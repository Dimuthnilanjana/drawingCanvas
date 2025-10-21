import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const presetColors = [
  { color: "#4ade80", label: "Lawn Green" },
  { color: "#86efac", label: "Light Green" },
  { color: "#cbd5e1", label: "Stone Gray" },
  { color: "#f59e0b", label: "Sand" },
  { color: "#dc2626", label: "Brick Red" },
  { color: "#3b82f6", label: "Water Blue" },
  { color: "#8b5cf6", label: "Lavender" },
  { color: "#ec4899", label: "Pink" },
];

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <Button
        onClick={() => setIsCollapsed(false)}
        className="fixed left-6 top-24 z-50 w-12 h-12 p-0 rounded-full shadow-medium"
        variant="toolbar"
        title="Open Color Picker"
      >
        <Palette className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed left-6 top-24 z-50 w-56 p-4 bg-toolbar-bg border-border shadow-medium">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-foreground">Zone Color</h3>
        <Button
          onClick={() => setIsCollapsed(true)}
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          title="Collapse"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 p-1 cursor-pointer"
          />
          <div className="flex-1">
            <Label htmlFor="color-hex" className="text-xs text-muted-foreground">Hex</Label>
            <Input
              id="color-hex"
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Presets</Label>
          <div className="grid grid-cols-4 gap-2">
            {presetColors.map((preset) => (
              <button
                key={preset.color}
                onClick={() => onChange(preset.color)}
                className="w-10 h-10 rounded-md border-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: preset.color,
                  borderColor: color === preset.color ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                }}
                title={preset.label}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
