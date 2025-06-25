import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Receipt, ExternalLink } from "lucide-react";

interface TransactionStatusProps {
  transaction: {
    signature?: string;
    treeAddress?: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    error?: string;
  };
  network: string;
}

export function TransactionStatus({ transaction, network }: TransactionStatusProps) {
  const getExplorerUrl = (signature: string) => {
    const baseUrl = network === 'mainnet-beta' 
      ? 'https://explorer.solana.com' 
      : 'https://explorer.solana.com';
    return `${baseUrl}/tx/${signature}${network === 'devnet' ? '?cluster=devnet' : ''}`;
  };

  const getAddressExplorerUrl = (address: string) => {
    const baseUrl = network === 'mainnet-beta' 
      ? 'https://explorer.solana.com' 
      : 'https://explorer.solana.com';
    return `${baseUrl}/address/${address}${network === 'devnet' ? '?cluster=devnet' : ''}`;
  };

  if (transaction.status === 'idle') {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Receipt className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">No transactions yet</p>
        <p className="text-xs text-gray-400 mt-1">Create a Merkle tree to see transaction status</p>
      </div>
    );
  }

  if (transaction.status === 'loading') {
    return (
      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <div>
          <p className="text-sm font-medium text-blue-900">Creating Merkle Tree...</p>
          <p className="text-xs text-blue-600">Broadcasting transaction to network</p>
        </div>
      </div>
    );
  }

  if (transaction.status === 'error') {
    return (
      <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
        <XCircle className="h-4 w-4 text-red-500" />
        <div>
          <p className="text-sm font-medium text-red-900">Transaction Failed</p>
          <p className="text-xs text-red-600">{transaction.error}</p>
        </div>
      </div>
    );
  }

  if (transaction.status === 'success') {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle className="h-4 w-4 text-success" />
          <div>
            <p className="text-sm font-medium text-green-900">Tree Created Successfully</p>
            <p className="text-xs text-green-600">Transaction confirmed</p>
          </div>
        </div>
        
        {transaction.treeAddress && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Tree Address:</p>
            <p className="text-xs font-mono bg-white p-2 rounded border break-all">
              {transaction.treeAddress}
            </p>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs mt-1"
              onClick={() => window.open(getAddressExplorerUrl(transaction.treeAddress!), '_blank')}
            >
              View on Explorer
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}

        {transaction.signature && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Transaction Signature:</p>
            <p className="text-xs font-mono bg-white p-2 rounded border break-all">
              {transaction.signature}
            </p>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs mt-1"
              onClick={() => window.open(getExplorerUrl(transaction.signature!), '_blank')}
            >
              View Transaction
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
