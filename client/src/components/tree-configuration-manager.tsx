import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Save, 
  Settings, 
  Star, 
  Trash2, 
  Edit3, 
  Plus,
  Download
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TreeConfiguration } from "@shared/schema";

interface TreeConfigurationManagerProps {
  currentParams: {
    canopyDepth: number;
    maxDepth: number;
    maxBufferSize: number;
  };
  network: string;
  onLoadConfiguration: (config: TreeConfiguration) => void;
}

export function TreeConfigurationManager({ 
  currentParams, 
  network, 
  onLoadConfiguration 
}: TreeConfigurationManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const [configDescription, setConfigDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const { toast } = useToast();

  const { data: configurations, isLoading } = useQuery({
    queryKey: ['/api/tree-configurations'],
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (configData: any) => apiRequest('/api/tree-configurations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tree-configurations'] });
      setIsCreateDialogOpen(false);
      setConfigName('');
      setConfigDescription('');
      setIsDefault(false);
      toast({
        title: "Configuration Saved",
        description: "Tree configuration has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Could not save tree configuration.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/tree-configurations/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tree-configurations'] });
      toast({
        title: "Configuration Deleted",
        description: "Tree configuration has been deleted.",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/tree-configurations/${id}/set-default`, {
      method: 'POST',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tree-configurations'] });
      toast({
        title: "Default Set",
        description: "Configuration set as default.",
      });
    },
  });

  const handleSaveConfiguration = () => {
    if (!configName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for this configuration.",
        variant: "destructive",
      });
      return;
    }

    const configData = {
      name: configName.trim(),
      description: configDescription.trim() || undefined,
      canopyDepth: currentParams.canopyDepth,
      maxDepth: currentParams.maxDepth,
      maxBufferSize: currentParams.maxBufferSize,
      network,
      isDefault,
    };

    createMutation.mutate(configData);
  };

  const handleLoadConfiguration = (config: TreeConfiguration) => {
    onLoadConfiguration(config);
    toast({
      title: "Configuration Loaded",
      description: `Loaded "${config.name}" configuration.`,
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Tree Configurations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Saved Configurations
            <Badge variant="secondary" className="ml-2">
              {configurations?.length || 0}
            </Badge>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="e.g., Small NFT Collection"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                  <Textarea
                    value={configDescription}
                    onChange={(e) => setConfigDescription(e.target.value)}
                    placeholder="Describe when to use this configuration..."
                    maxLength={500}
                    rows={3}
                  />
                </div>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="font-medium mb-1">Current Parameters:</p>
                  <div className="space-y-1">
                    <p>Max Depth: {currentParams.maxDepth} (up to {Math.pow(2, currentParams.maxDepth).toLocaleString()} items)</p>
                    <p>Canopy Depth: {currentParams.canopyDepth}</p>
                    <p>Buffer Size: {currentParams.maxBufferSize}</p>
                    <p>Network: {network}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isDefault" className="text-sm">
                    Set as default configuration
                  </label>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSaveConfiguration}
                    disabled={createMutation.isPending}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!configurations || configurations.length === 0 ? (
          <div className="text-center py-6">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No saved configurations</p>
            <p className="text-sm text-gray-500">Save your current parameters for quick reuse</p>
          </div>
        ) : (
          configurations.map((config: TreeConfiguration) => (
            <div key={config.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{config.name}</h4>
                  {config.isDefault && (
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {config.network}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLoadConfiguration(config)}
                    title="Load configuration"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDefaultMutation.mutate(config.id)}
                    disabled={config.isDefault}
                    title="Set as default"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(config.id, config.name)}
                    title="Delete configuration"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              
              {config.description && (
                <p className="text-sm text-gray-600">{config.description}</p>
              )}
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-blue-600 font-medium">Depth: {config.maxDepth}</p>
                  <p className="text-blue-500">{Math.pow(2, config.maxDepth).toLocaleString()} items</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-green-600 font-medium">Canopy: {config.canopyDepth}</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="text-purple-600 font-medium">Buffer: {config.maxBufferSize}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}