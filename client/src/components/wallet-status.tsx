import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "./wallet-provider";

export function WalletStatus() {
  const { publicKey, connected, wallet, select, wallets } = useWallet();
  const { connection } = useWalletContext();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.log('Balance fetch limited by RPC');
          setBalance(null);
        }
      };

      const timeoutId = setTimeout(fetchBalance, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setBalance(null);
    }
  }, [connected, publicKey, connection]);

  return (
    <div className="space-y-3">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Status</span>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      {/* Wallet Type */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Wallet</span>
        <span className="text-sm font-medium">
          {wallet?.adapter.name || '-'}
        </span>
      </div>
      
      {/* Balance */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Balance</span>
        <span className="text-sm font-mono">
          {balance !== null ? `${balance.toFixed(4)} SOL` : 'Rate limited'}
        </span>
      </div>
      
      {/* Public Key */}
      {connected && publicKey && (
        <div className="pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Public Key</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono block break-all mt-1">
            {publicKey.toString().slice(0, 12)}...{publicKey.toString().slice(-12)}
          </code>
        </div>
      )}
    </div>
  );
}
