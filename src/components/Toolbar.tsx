import {
  MousePointer2,
  Square,
  Package,
  Trash2,
  RotateCcw,
  Download,
  Copy,
  Undo,
  Redo,
  Grid3x3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Tool = "select" | "draw" | "place";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onClear: () => void;
  onExport: () => void;
  onDuplicate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  showGrid: boolean;
  onGridToggle: (show: boolean) => void;
}

export const Toolbar = ({
  activeTool,
  onToolChange,
  onClear,
  onExport,
  onDuplicate,
  onUndo,
  onRedo,
  showGrid,
  onGridToggle,
}: ToolbarProps) => {
  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl px-3 py-2 flex items-center gap-2 flex-wrap max-w-[95vw]">
        
        {/* Tool Buttons */}
        <div className="flex items-center gap-2">
          {[
            { icon: MousePointer2, tool: "select", label: "Select (V)" },
            { icon: Square, tool: "draw", label: "Draw Zone (D)" },
            { icon: Package, tool: "place", label: "Place Object (P)" },
          ].map(({ icon: Icon, tool, label }) => (
            <Tooltip key={tool}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToolChange(tool as Tool)}
                  className={`h-10 w-10 rounded-xl transition-all duration-200 ${
                    activeTool === tool
                      ? "bg-gradient-to-br from-[#3CB371] to-[#2E8B57] text-white shadow-md"
                      : "bg-white/70 hover:bg-gray-100 text-gray-700 hover:text-[#2E8B57]"
                  }`}
                >
                  <Icon className="h-5 w-5 transition-colors duration-200" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8 mx-2" />

        {/* Undo / Redo / Duplicate / Delete */}
        <div className="flex items-center gap-2">
          {[
            { icon: Undo, onClick: onUndo, label: "Undo (Ctrl+Z)" },
            { icon: Redo, onClick: onRedo, label: "Redo (Ctrl+Y)" },
            { icon: Copy, onClick: onDuplicate, label: "Duplicate (Ctrl+D)" },
            {
              icon: Trash2,
              onClick: () => {
                const selected = window.fabricCanvasRef?.current?.getActiveObject();
                if (selected) {
                  window.fabricCanvasRef.current?.remove(selected);
                  window.fabricCanvasRef.current?.renderAll();
                }
              },
              label: "Delete Selected (Del)",
            },
          ].map(({ icon: Icon, onClick, label }, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClick}
                  className="h-10 w-10 rounded-xl bg-white/70 hover:bg-gray-100 text-gray-700 hover:text-[#2E8B57] transition-all duration-200 hover:shadow-md"
                >
                  <Icon className="h-5 w-5 transition-colors duration-200" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8 mx-2" />

        {/* Grid Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 px-2 cursor-pointer">
              <Grid3x3 className="h-5 w-5 text-gray-700" />
              <Switch
                id="grid-toggle"
                checked={showGrid}
                onCheckedChange={onGridToggle}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">Toggle Grid</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-8 mx-2" />

        {/* Clear / Export */}
        <div className="flex items-center gap-2">
          {[
            { icon: RotateCcw, onClick: onClear, label: "Clear Canvas" },
            { icon: Download, onClick: onExport, label: "Export as PNG" },
          ].map(({ icon: Icon, onClick, label }, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClick}
                  className="h-10 w-10 rounded-xl bg-white/70 hover:bg-gray-100 text-gray-700 hover:text-[#2E8B57] transition-all duration-200 hover:shadow-md"
                >
                  <Icon className="h-5 w-5 transition-colors duration-200" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

// Global window type
declare global {
  interface Window {
    fabricCanvasRef: React.MutableRefObject<any> | undefined;
  }
}
