import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NetworkConfig } from "@/components/network-config";
import { MerkleTreeParams } from "@/components/merkle-tree-params";
import { WalletStatus } from "@/components/wallet-status";
import { WalletConnection } from "@/components/wallet-connection";
import { WalletInfoNote } from "@/components/wallet-info-note";
import { MerkleTreeHistory } from "@/components/merkle-tree-history";
import { SourceCodeDownload } from "@/components/source-code-download";
import { TreeConfigurationManager } from "@/components/tree-configuration-manager";
import { TransactionStatus } from "@/components/transaction-status";
import { useWalletContext } from "@/components/wallet-provider";
import { ListTree, Wallet, History, InfoIcon, Rocket, Sliders, Network } from "lucide-react";
import { createMerkleTree, estimateCost } from "@/lib/merkle-tree";
import { useToast } from "@/hooks/use-toast";

import type { MerkleTreeParams as MerkleTreeParamsType, TreeConfiguration } from "@shared/schema";

export default function MerkleTreeCreator() {
  const { publicKey, connected, wallet } = useWallet();
  const { network, setNetwork, rpcEndpoint, setRpcEndpoint, connection } = useWalletContext();
  const { toast } = useToast();
  const [canopyDepth, setCanopyDepth] = useState([10]);
  const [maxDepth, setMaxDepth] = useState([14]);
  const [maxBufferSize, setMaxBufferSize] = useState([512]);
  const [isCreating, setIsCreating] = useState(false);
  const [transaction, setTransaction] = useState<{
    signature?: string;
    treeAddress?: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    error?: string;
  }>({ status: 'idle' });

  const maxLeaves = Math.pow(2, maxDepth[0]);
  const estimatedCost = estimateCost(canopyDepth[0], maxBufferSize[0]);

  const handleCreateTree = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before creating a tree.",
        variant: "destructive",
      });
      return;
    }

    if (!rpcEndpoint) {
      toast({
        title: "Custom RPC Required",
        description: "Please configure a custom RPC endpoint above for reliable Merkle tree creation.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    setTransaction({ status: 'loading' });

    try {
      const params: MerkleTreeParamsType = {
        canopyDepth: canopyDepth[0],
        maxDepth: maxDepth[0],
        maxBufferSize: maxBufferSize[0],
        network,
      };

      // Create the actual tree
      const result = await createMerkleTree(connection, publicKey, params);
      
      setTransaction({
        status: 'success',
        signature: result.signature,
        treeAddress: result.treeAddress,
      });

      toast({
        title: "Merkle Tree Created Successfully",
        description: `Tree created with address: ${result.treeAddress}`,
      });

    } catch (error) {
      console.error('Error creating tree:', error);
      setTransaction({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });

      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const validateParams = () => {
    if (canopyDepth[0] > maxDepth[0]) {
      toast({
        title: "Invalid Parameters",
        description: "Canopy depth cannot be greater than max depth.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Parameters Valid",
      description: "All parameters are within acceptable ranges.",
    });
  };

  const handleLoadConfiguration = (config: TreeConfiguration) => {
    setCanopyDepth([config.canopyDepth]);
    setMaxDepth([config.maxDepth]);
    setMaxBufferSize([config.maxBufferSize]);
    setNetwork(config.network as 'devnet' | 'mainnet-beta');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ListTree className="text-primary-foreground h-4 w-4" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Merkle Tree Creator</h1>
                <p className="text-xs text-gray-500">Solana Blockchain</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600 capitalize">{network}</span>
              </div>
              {connected ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-600">Connected</span>
                  <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
                </div>
              ) : (
                <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Network Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2 text-secondary" />
                  Network Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NetworkConfig />
              </CardContent>
            </Card>

            {/* Merkle ListTree Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sliders className="h-5 w-5 mr-2 text-secondary" />
                  Merkle ListTree Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MerkleTreeParams
                  canopyDepth={canopyDepth}
                  maxDepth={maxDepth}
                  maxBufferSize={maxBufferSize}
                  onCanopyDepthChange={setCanopyDepth}
                  onMaxDepthChange={setMaxDepth}
                  onMaxBufferSizeChange={setMaxBufferSize}
                />
              </CardContent>
            </Card>

            {/* Create ListTree Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="h-5 w-5 mr-2 text-secondary" />
                  Create Merkle ListTree
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="font-mono font-medium">~{estimatedCost} SOL</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600">Max Leaves:</span>
                    <span className="font-mono font-medium">{maxLeaves.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleCreateTree} 
                    disabled={!connected || isCreating}
                    className="flex-1"
                  >
                    <ListTree className="h-4 w-4 mr-2" />
                    {isCreating ? 'Creating...' : 'Create ListTree'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={validateParams}
                    className="px-4"
                  >
                    ✓
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            
            {/* Wallet Connection */}
            <div>
              <WalletConnection />
            </div>

            {/* Info Note */}
            <WalletInfoNote />

            {/* Wallet Status */}
            {connected && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-secondary" />
                    Wallet Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WalletStatus />
                </CardContent>
              </Card>
            )}

            {/* Transaction Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-secondary" />
                  Transaction Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionStatus transaction={transaction} network={network} />
              </CardContent>
            </Card>

            {/* ListTree Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <InfoIcon className="h-5 w-5 mr-2 text-secondary" />
                  ListTree Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-2">What is Canopy Depth?</h4>
                  <p className="text-blue-700 text-xs leading-relaxed">
                    Canopy depth determines how many proof nodes are cached on-chain. Higher values reduce proof sizes but increase tree creation cost.
                  </p>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-3">
                  <h4 className="font-medium text-amber-900 mb-2">Cost Considerations</h4>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Larger trees and higher canopy depths cost more SOL to create. Consider your use case when setting parameters.
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="font-medium text-purple-900 mb-2">Need Help?</h4>
                  <p className="text-purple-700 text-xs leading-relaxed">
                    Check the Solana documentation for detailed information about compressed NFTs and Merkle trees.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tree Configuration Manager */}
            <TreeConfigurationManager
              currentParams={{
                canopyDepth: canopyDepth[0],
                maxDepth: maxDepth[0],
                maxBufferSize: maxBufferSize[0],
              }}
              network={network}
              onLoadConfiguration={handleLoadConfiguration}
            />

            {/* Source Code Download */}
            <SourceCodeDownload />
          </div>
        </div>
      </div>
    </div>
  );
}
