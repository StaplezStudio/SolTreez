import { Connection, PublicKey, Keypair, clusterApiUrl } from '@solana/web3.js';

export function getConnection(network: 'devnet' | 'mainnet-beta', customRpc?: string): Connection {
  const endpoint = customRpc || clusterApiUrl(network);
  return new Connection(endpoint, 'confirmed');
}

export function validateSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export async function confirmTransaction(
  connection: Connection,
  signature: string,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
): Promise<boolean> {
  try {
    const result = await connection.confirmTransaction(signature, commitment);
    return !result.value.err;
  } catch (error) {
    console.error('Error confirming transaction:', error);
    return false;
  }
}
