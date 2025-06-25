import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Code, FileText, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SourceCodeDownload() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownloadSource = async () => {
    setIsGenerating(true);
    
    try {
      // Request the source code from the backend
      const response = await fetch('/api/source-code/download');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download source code');
      }
      
      // Get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'soltree-source-code.zip';
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Source Code Downloaded",
        description: `Complete Soltree project downloaded as ${filename}`,
      });
      
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Could not download source code.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-blue-500" />
          Source Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="mb-3">Download the complete Soltree project including:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <Folder className="h-4 w-4 text-blue-500" />
              <span>React Frontend</span>
            </div>
            <div className="flex items-center space-x-2">
              <Folder className="h-4 w-4 text-green-500" />
              <span>Express Backend</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span>All Source Files</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-orange-500" />
              <span>Configuration & Docs</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleDownloadSource}
          disabled={isGenerating}
          className="w-full"
          variant="outline"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
              Generating Package...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Source Code
            </>
          )}
        </Button>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>Downloads the latest project archive from the shared folder.</p>
          <p>Standard ZIP format compatible with all decompression programs.</p>
        </div>
      </CardContent>
    </Card>
  );
}