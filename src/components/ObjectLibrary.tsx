import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Box, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

interface ObjectLibraryProps {
  onObjectSelect: (emoji: string) => void;
}

const outdoorObjects = [
  { emoji: "🌳", label: "Tree" },
  { emoji: "🌲", label: "Pine Tree" },
  { emoji: "🌴", label: "Palm Tree" },
  { emoji: "🌿", label: "Herb" },
  { emoji: "🌺", label: "Flower" },
  { emoji: "🌻", label: "Sunflower" },
  { emoji: "🪴", label: "Potted Plant" },
  { emoji: "🪵", label: "Wood" },
  { emoji: "🪑", label: "Chair" },
  { emoji: "🛋️", label: "Couch" },
  { emoji: "🏮", label: "Lantern" },
  { emoji: "💡", label: "Light" },
  { emoji: "⛲", label: "Fountain" },
  { emoji: "🗿", label: "Statue" },
  { emoji: "🪨", label: "Rock" },
  { emoji: "⛱️", label: "Umbrella" },
];

export const ObjectLibrary = ({ onObjectSelect }: ObjectLibraryProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleObjectClick = (emoji: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.font = '80px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 50, 50);
      onObjectSelect(canvas.toDataURL());
    }
  };

  if (isCollapsed) {
    return (
      <Button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-6 top-24 z-50 w-12 h-12 p-0 rounded-full shadow-medium"
        variant="toolbar"
        title="Open Object Library"
      >
        <Box className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed right-6 top-24 z-50 w-64 p-4 bg-toolbar-bg border-border shadow-medium">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-foreground">Object Library</h3>
        <Button
          onClick={() => setIsCollapsed(true)}
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          title="Collapse"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-3 gap-2">
          {outdoorObjects.map((obj) => (
            <button
              key={obj.emoji}
              onClick={() => handleObjectClick(obj.emoji)}
              className="aspect-square flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-border bg-card hover:bg-muted transition-all duration-200 hover:scale-105 hover:border-primary"
              title={obj.label}
            >
              <span className="text-3xl">{obj.emoji}</span>
              <span className="text-[10px] text-muted-foreground leading-tight text-center">{obj.label}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
