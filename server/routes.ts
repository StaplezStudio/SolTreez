import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Soltree API is running" });
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

  const httpServer = createServer(app);
  return httpServer;
}