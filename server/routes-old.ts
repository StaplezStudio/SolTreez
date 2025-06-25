import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Merkle tree routes
  app.post("/api/merkle-trees", async (req, res) => {
    try {
      const validatedData = insertMerkleTreeSchema.parse(req.body);
      const tree = await storage.createMerkleTree(validatedData);
      res.json(tree);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/merkle-trees", async (req, res) => {
    try {
      const trees = await storage.getMerkleTrees();
      res.json(trees);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/merkle-trees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tree ID" });
      }
      
      const tree = await storage.getMerkleTree(id);
      if (!tree) {
        return res.status(404).json({ message: "Tree not found" });
      }
      
      res.json(tree);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/merkle-trees/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tree ID" });
      }

      const { status, transactionSignature } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }

      const tree = await storage.updateMerkleTreeStatus(id, status, transactionSignature);
      if (!tree) {
        return res.status(404).json({ message: "Tree not found" });
      }

      res.json(tree);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete a merkle tree
  app.delete("/api/merkle-trees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid tree ID" });
      }
      
      const deleted = await storage.deleteMerkleTree(id);
      if (!deleted) {
        return res.status(404).json({ message: "Tree not found" });
      }
      
      res.json({ message: "Tree deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Clear all data
  app.delete("/api/clear-all", async (req, res) => {
    try {
      await storage.clearAllData();
      res.json({ message: "All data cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Validate merkle tree parameters
  app.post("/api/validate-params", async (req, res) => {
    try {
      const validatedParams = merkleTreeParamsSchema.parse(req.body);
      
      // Additional validation logic
      if (validatedParams.canopyDepth > validatedParams.maxDepth) {
        return res.status(400).json({ 
          message: "Canopy depth cannot be greater than max depth" 
        });
      }

      res.json({ valid: true, params: validatedParams });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid parameters", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Source code download endpoint
  app.get("/api/source-code/download", async (req, res) => {
    try {
      const projectRoot = path.resolve(__dirname, '..');
      const sharedFolder = path.join(projectRoot, 'shared');
      
      // Find the most recent zip file
      const zipFiles = fs.readdirSync(sharedFolder)
        .filter(file => file.startsWith('soltree-complete-') && file.endsWith('.zip'))
        .sort()
        .reverse();
      
      if (zipFiles.length === 0) {
        return res.status(404).json({ error: 'No source code archive found. Please create one first.' });
      }
      
      const latestZip = zipFiles[0];
      const zipFilePath = path.join(sharedFolder, latestZip);
      
      // Check if file exists
      if (!fs.existsSync(zipFilePath)) {
        return res.status(404).json({ error: 'Archive file not found' });
      }
      
      const stats = fs.statSync(zipFilePath);
      
      // Set response headers for file download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${latestZip}"`);
      res.setHeader('Content-Length', stats.size);
      
      // Stream the file
      const fileStream = fs.createReadStream(zipFilePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (err) => {
        console.error('File stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download archive' });
        }
      });
      
    } catch (error) {
      console.error('Source code download error:', error);
      res.status(500).json({ error: 'Failed to access source code archive' });
    }
  });

  // Tree configuration routes
  app.get("/api/tree-configurations", async (req, res) => {
    try {
      const configurations = await storage.getTreeConfigurations();
      res.json(configurations);
    } catch (error) {
      console.error('Error getting tree configurations:', error);
      res.status(500).json({ error: 'Failed to get tree configurations' });
    }
  });

  app.post("/api/tree-configurations", async (req, res) => {
    try {
      const result = treeConfigurationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid configuration data', details: result.error.errors });
      }

      const configuration = await storage.createTreeConfiguration(result.data);
      res.status(201).json(configuration);
    } catch (error) {
      console.error('Error creating tree configuration:', error);
      res.status(500).json({ error: 'Failed to create tree configuration' });
    }
  });

  app.get("/api/tree-configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid configuration ID' });
      }

      const configuration = await storage.getTreeConfiguration(id);
      if (!configuration) {
        return res.status(404).json({ error: 'Configuration not found' });
      }

      res.json(configuration);
    } catch (error) {
      console.error('Error getting tree configuration:', error);
      res.status(500).json({ error: 'Failed to get tree configuration' });
    }
  });

  app.patch("/api/tree-configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid configuration ID' });
      }

      const result = treeConfigurationSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid configuration data', details: result.error.errors });
      }

      const configuration = await storage.updateTreeConfiguration(id, result.data);
      if (!configuration) {
        return res.status(404).json({ error: 'Configuration not found' });
      }

      res.json(configuration);
    } catch (error) {
      console.error('Error updating tree configuration:', error);
      res.status(500).json({ error: 'Failed to update tree configuration' });
    }
  });

  app.delete("/api/tree-configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid configuration ID' });
      }

      const success = await storage.deleteTreeConfiguration(id);
      if (!success) {
        return res.status(404).json({ error: 'Configuration not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting tree configuration:', error);
      res.status(500).json({ error: 'Failed to delete tree configuration' });
    }
  });

  app.post("/api/tree-configurations/:id/set-default", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid configuration ID' });
      }

      const success = await storage.setDefaultConfiguration(id);
      if (!success) {
        return res.status(404).json({ error: 'Configuration not found' });
      }

      res.json({ message: 'Default configuration set successfully' });
    } catch (error) {
      console.error('Error setting default configuration:', error);
      res.status(500).json({ error: 'Failed to set default configuration' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
