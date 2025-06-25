import { AlertCircle, Info, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WalletInfoNote() {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-3">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-amber-800 font-medium">RPC Endpoint Notice</p>
            <p className="text-amber-700 mb-2">
              For reliable Merkle tree creation, consider using a dedicated RPC provider:
            </p>
            <div className="space-y-1 text-xs">
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-amber-700 underline"
                onClick={() => window.open('https://helius.xyz', '_blank')}
              >
                • Helius (Recommended) <ExternalLink className="h-3 w-3 ml-1 inline" />
              </Button>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-amber-700 underline"
                onClick={() => window.open('https://quicknode.com', '_blank')}
              >
                • QuickNode <ExternalLink className="h-3 w-3 ml-1 inline" />
              </Button>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-amber-700 underline"
                onClick={() => window.open('https://alchemy.com', '_blank')}
              >
                • Alchemy <ExternalLink className="h-3 w-3 ml-1 inline" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}