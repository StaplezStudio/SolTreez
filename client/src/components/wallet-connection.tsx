import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Power, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { useWalletContext } from "./wallet-provider";

export function WalletConnection() {
  const { publicKey, connected, connecting, wallet, select, wallets, connect } = useWallet();
  const { network } = useWalletContext();
  
  // Check if we're in mobile/preview mode
  const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isPreview = typeof window !== 'undefined' && window.location && window.location.hostname && 
    (window.location.hostname.includes('replit') || window.location.hostname.includes('repl.co'));

  if (connected && publicKey) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-green-900">Connected</p>
                <p className="text-sm text-green-700 break-all">
                  {isMobile 
                    ? `${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-6)}`
                    : `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`
                  }
                </p>
                <p className="text-xs text-green-600 capitalize">{network}</p>
              </div>
            </div>
            <WalletDisconnectButton className="!bg-red-500 hover:!bg-red-600 !text-sm !px-3 !py-1.5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (connecting) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <p className="text-blue-900">Connecting to wallet...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-gray-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-gray-600 flex-shrink-0" />
              <span className="font-medium">Connect Wallet</span>
              {isMobile && <Smartphone className="h-4 w-4 text-blue-500" />}
            </div>
            <Badge variant="outline" className="self-start sm:self-center">Required</Badge>
          </div>
          
          {/* Mobile/Preview mode notice */}
          {(isMobile || isPreview) && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">Mobile/Preview Mode Detected</p>
                  <p className="text-blue-700">
                    {isMobile 
                      ? "Wallet connections may open new tabs. Return here after connecting."
                      : "Preview mode active. Some features may require deployment for full functionality."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2 sm:space-y-3">
            {wallets.filter(w => w?.adapter).map((walletAdapter) => {
              const isInstalled = walletAdapter.readyState === 'Installed';
              const isLoadable = walletAdapter.readyState === 'Loadable';
              const canUse = isInstalled || isLoadable || isMobile || isPreview;
              
              return (
                <Button
                  key={walletAdapter.adapter.name}
                  variant="outline"
                  onClick={() => {
                    try {
                      if (walletAdapter?.adapter?.name) {
                        select(walletAdapter.adapter.name);
                      }
                    } catch (error) {
                      console.log('Selection error, trying fallback:', error);
                      // Fallback for mobile/preview mode
                      if (walletAdapter?.adapter?.name === 'Phantom') {
                        if (typeof window !== 'undefined' && window.location) {
                          window.open('https://phantom.app/ul/browse/' + encodeURIComponent(window.location.href), '_blank');
                        }
                      } else if (walletAdapter?.adapter?.name === 'Solflare') {
                        if (typeof window !== 'undefined') {
                          window.open('https://solflare.com/access-wallet', '_blank');
                        }
                      }
                    }
                  }}
                  className="w-full justify-start h-10 sm:h-12 text-sm sm:text-base"
                  disabled={!canUse}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 w-full">
                    {walletAdapter.adapter?.icon && (
                      <img 
                        src={walletAdapter.adapter.icon} 
                        alt={walletAdapter.adapter.name || 'Wallet'}
                        className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <span className="font-medium truncate">{walletAdapter.adapter?.name || 'Unknown Wallet'}</span>
                    <div className="ml-auto flex-shrink-0">
                      {isInstalled ? (
                        <Badge variant="secondary" className="text-xs">Detected</Badge>
                      ) : isLoadable || isMobile || isPreview ? (
                        <Badge variant="outline" className="text-xs">Available</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Install</Badge>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-800 font-medium">Need a wallet?</p>
                <p className="text-amber-700">
                  Install <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="underline font-medium">Phantom</a> or{' '}
                  <a href="https://solflare.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">Solflare</a> to get started.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Fallback wallet adapter button */}
      <div className="text-center">
        <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-sm sm:!text-base !px-4 sm:!px-6 !py-2 sm:!py-3" />
      </div>
    </div>
  );
}