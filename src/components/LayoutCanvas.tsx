import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, FabricImage, Line } from "fabric";
import { toast } from "sonner";

type Tool = "select" | "draw" | "place";

interface LayoutCanvasProps {
  activeTool: Tool;
  activeColor: string;
  objectToPlace: string | null;
  onObjectPlaced: () => void;
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
  showGrid: boolean;
  onStateChange: () => void;
}

export const LayoutCanvas = ({ 
  activeTool, 
  activeColor, 
  objectToPlace, 
  onObjectPlaced,
  canvasRef,
  showGrid,
  onStateChange
}: LayoutCanvasProps) => {
  const htmlCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlacingObject, setIsPlacingObject] = useState(false);

  useEffect(() => {
    if (!htmlCanvasRef.current) return;

    const canvas = new FabricCanvas(htmlCanvasRef.current, {
      width: 1200,
      height: 700,
      backgroundColor: "hsl(95, 25%, 94%)",
      selection: activeTool === "select",
    });

    // Draw grid
    drawGrid(canvas);

    canvasRef.current = canvas;
    toast.success("Canvas ready! Start designing your outdoor space.");

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update canvas interaction mode
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.selection = activeTool === "select";
    canvas.defaultCursor = activeTool === "draw" ? "crosshair" : "default";
    
    // Disable selection when drawing or placing
    canvas.forEachObject((obj) => {
      obj.selectable = activeTool === "select";
      obj.evented = activeTool === "select";
    });
    
    canvas.renderAll();
  }, [activeTool]);

  // Toggle grid visibility
  useEffect(() => {
    if (!canvasRef.current) return;
    toggleGridVisibility(canvasRef.current, showGrid);
  }, [showGrid]);

  // Handle drawing zones
  useEffect(() => {
    if (!canvasRef.current || activeTool !== "draw") return;

    const canvas = canvasRef.current;
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let rect: Rect | null = null;

    const handleMouseDown = (e: any) => {
      const pointer = canvas.getPointer(e.e);
      isDrawing = true;
      startX = pointer.x;
      startY = pointer.y;

      rect = new Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: activeColor,
        opacity: 0.6,
        stroke: activeColor,
        strokeWidth: 2,
        selectable: false,
      });

      canvas.add(rect);
    };

    const handleMouseMove = (e: any) => {
      if (!isDrawing || !rect) return;

      const pointer = canvas.getPointer(e.e);
      const width = pointer.x - startX;
      const height = pointer.y - startY;

      rect.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width > 0 ? startX : pointer.x,
        top: height > 0 ? startY : pointer.y,
      });

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (rect) {
        rect.set({ selectable: true });
        onStateChange();
        toast.success("Zone created! Switch to Select mode to move or resize.");
      }
      isDrawing = false;
      rect = null;
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [activeTool, activeColor]);

  // Handle object placement
  useEffect(() => {
    if (!canvasRef.current || !objectToPlace || activeTool !== "place") return;

    const canvas = canvasRef.current;
    setIsPlacingObject(true);

    const handleClick = (e: any) => {
      const pointer = canvas.getPointer(e.e);
      
      FabricImage.fromURL(objectToPlace).then((img) => {
        img.set({
          left: pointer.x - 25,
          top: pointer.y - 25,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        
        canvas.add(img);
        canvas.renderAll();
        onStateChange();
        toast.success("Object placed! Switch to Select mode to move or resize.");
        onObjectPlaced();
        setIsPlacingObject(false);
      });
    };

    canvas.on("mouse:down", handleClick);

    return () => {
      canvas.off("mouse:down", handleClick);
      setIsPlacingObject(false);
    };
  }, [objectToPlace, activeTool]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="border-2 border-border rounded-lg shadow-medium overflow-hidden bg-canvas-bg">
        <canvas ref={htmlCanvasRef} className="max-w-full" />
      </div>
    </div>
  );
};

function drawGrid(canvas: FabricCanvas) {
  const gridSize = 40;
  const width = canvas.width || 1200;
  const height = canvas.height || 700;

  for (let i = 0; i < width / gridSize; i++) {
    const line = new Line([i * gridSize, 0, i * gridSize, height], {
      stroke: "hsl(120, 15%, 85%)",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
    line.set('data', { isGrid: true });
    canvas.add(line);
  }

  for (let i = 0; i < height / gridSize; i++) {
    const line = new Line([0, i * gridSize, width, i * gridSize], {
      stroke: "hsl(120, 15%, 85%)",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
    line.set('data', { isGrid: true });
    canvas.add(line);
  }
}

function toggleGridVisibility(canvas: FabricCanvas, visible: boolean) {
  canvas.forEachObject((obj) => {
    if ((obj as any).data?.isGrid) {
      obj.set('visible', visible);
    }
  });
  canvas.renderAll();
}
