import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletContext } from "./wallet-provider";

export function NetworkConfig() {
  const { network, setNetwork, rpcEndpoint, setRpcEndpoint } = useWalletContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">Network</Label>
        <div className="flex space-x-2">
          <Button
            variant={network === "devnet" ? "default" : "outline"}
            onClick={() => setNetwork("devnet")}
            className="flex-1"
            size="sm"
          >
            Devnet
          </Button>
          <Button
            variant={network === "mainnet-beta" ? "default" : "outline"}
            onClick={() => setNetwork("mainnet-beta")}
            className="flex-1"
            size="sm"
          >
            Mainnet
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="rpcEndpoint" className="text-sm font-medium text-gray-700 mb-2 block">
          Custom RPC Endpoint <span className="text-red-500">(required for reliable creation)</span>
        </Label>
        <Input
          id="rpcEndpoint"
          type="url"
          placeholder={network === 'devnet' 
            ? "https://devnet.helius-rpc.com/?api-key=YOUR-KEY" 
            : "https://mainnet.helius-rpc.com/?api-key=YOUR-KEY"
          }
          value={rpcEndpoint}
          onChange={(e) => setRpcEndpoint(e.target.value)}
          className="w-full"
        />
        <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
          <strong>Important:</strong> Public RPC endpoints often block Merkle tree creation due to rate limits. 
          Use a dedicated RPC provider for reliable functionality.
        </div>
      </div>
    </div>
  );
}
