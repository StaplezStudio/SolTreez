import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface MerkleTreeParamsProps {
  canopyDepth: number[];
  maxDepth: number[];
  maxBufferSize: number[];
  onCanopyDepthChange: (value: number[]) => void;
  onMaxDepthChange: (value: number[]) => void;
  onMaxBufferSizeChange: (value: number[]) => void;
}

export function MerkleTreeParams({
  canopyDepth,
  maxDepth,
  maxBufferSize,
  onCanopyDepthChange,
  onMaxDepthChange,
  onMaxBufferSizeChange,
}: MerkleTreeParamsProps) {
  return (
    <div className="space-y-6">
      {/* Canopy Depth */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="canopyDepth" className="text-sm font-medium text-gray-700">
            Canopy Depth
          </Label>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {canopyDepth[0]}
          </span>
        </div>
        <Slider
          value={canopyDepth}
          onValueChange={onCanopyDepthChange}
          max={20}
          min={0}
          step={1}
          className="w-full slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>20</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Controls how many proof nodes are cached on-chain
        </p>
      </div>

      {/* Max Depth */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="maxDepth" className="text-sm font-medium text-gray-700">
            Max Depth
          </Label>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {maxDepth[0]}
          </span>
        </div>
        <Slider
          value={maxDepth}
          onValueChange={onMaxDepthChange}
          max={30}
          min={5}
          step={1}
          className="w-full slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5</span>
          <span>30</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Maximum depth of the Merkle tree (2^depth = max leaves). Minimum 5 for safety.
        </p>
      </div>

      {/* Max Buffer Size */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="maxBufferSize" className="text-sm font-medium text-gray-700">
            Max Buffer Size
          </Label>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
            {maxBufferSize[0]}
          </span>
        </div>
        <Slider
          value={maxBufferSize}
          onValueChange={onMaxBufferSizeChange}
          max={2048}
          min={8}
          step={8}
          className="w-full slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>8</span>
          <span>2048</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Number of concurrent updates that can be made to the tree
        </p>
      </div>
    </div>
  );
}
