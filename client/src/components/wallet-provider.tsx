import React, { useMemo, createContext, useContext, useState, useCallback } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Required CSS for wallet adapter to work properly
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProps {
  network: 'devnet' | 'mainnet-beta';
  setNetwork: (network: 'devnet' | 'mainnet-beta') => void;
  rpcEndpoint: string;
  setRpcEndpoint: (endpoint: string) => void;
  connection: Connection;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [network, setNetwork] = useState<'devnet' | 'mainnet-beta'>('devnet');
  const [rpcEndpoint, setRpcEndpoint] = useState('');

  const endpoint = useMemo(() => {
    // Use custom RPC if provided, otherwise use reliable public endpoints
    if (rpcEndpoint) {
      return rpcEndpoint;
    }
    
    // Use higher-quality public RPC endpoints for better reliability
    if (network === 'devnet') {
      return 'https://devnet.helius-rpc.com/?api-key=demo';
    } else {
      return 'https://mainnet.helius-rpc.com/?api-key=demo';
    }
  }, [network, rpcEndpoint]);

  const connection = useMemo(() => {
    return new Connection(endpoint, 'confirmed');
  }, [endpoint]);

  const wallets = useMemo(
    () => {
      try {
        return [
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
        ];
      } catch (error) {
        console.log('Wallet adapter initialization error:', error);
        return [];
      }
    },
    []
  );

  const contextValue = useMemo(() => ({
    network,
    setNetwork,
    rpcEndpoint,
    setRpcEndpoint,
    connection,
  }), [network, rpcEndpoint, connection]);

  return (
    <WalletContext.Provider value={contextValue}>
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider 
          wallets={wallets} 
          autoConnect={false}
          onError={(error) => {
            console.error('Wallet error:', error);
          }}
        >
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </WalletContext.Provider>
  );
}
