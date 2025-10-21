import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas as FabricCanvas, Line, FabricObject } from "fabric";
import { LayoutCanvas } from "@/components/LayoutCanvas";
import { Toolbar } from "@/components/Toolbar";
import { ObjectLibrary } from "@/components/ObjectLibrary";
import { ColorPicker } from "@/components/ColorPicker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Tool = "select" | "draw" | "place";

const Index = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [activeColor, setActiveColor] = useState("#4ade80");
  const [objectToPlace, setObjectToPlace] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    window.fabricCanvasRef = canvasRef;
    return () => {
      window.fabricCanvasRef = undefined;
    };
  }, []);
  const saveState = () => {
    if (!canvasRef.current) return;
    const json = JSON.stringify(canvasRef.current.toJSON());
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        handleRedo();
      } else if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        handleDuplicate();
      } else if (e.key === "v" || e.key === "V") {
        setActiveTool("select");
        toast.info("Switched to Select mode");
      } else if (e.key === "d" || e.key === "D") {
        setActiveTool("draw");
        toast.info("Switched to Draw mode");
      } else if (e.key === "p" || e.key === "P") {
        setActiveTool("place");
        toast.info("Switched to Place mode");
      } else if (e.key === "Delete" || e.key === "Backspace") {
        const selected = canvasRef.current?.getActiveObject();
        if (selected) {
          canvasRef.current?.remove(selected);
          canvasRef.current?.renderAll();
          saveState();
          toast.success("Object deleted");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, historyStep]);

  const handleClear = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.clear();
    canvas.backgroundColor = "hsl(95, 25%, 94%)";
    
    const gridSize = 40;
    const width = canvas.width || 1200;
    const height = canvas.height || 700;

    for (let i = 0; i < width / gridSize; i++) {
      canvas.add(
        new Line([i * gridSize, 0, i * gridSize, height], {
          stroke: "hsl(120, 15%, 85%)",
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })
      );
    }

    for (let i = 0; i < height / gridSize; i++) {
      canvas.add(
        new Line([0, i * gridSize, width, i * gridSize], {
          stroke: "hsl(120, 15%, 85%)",
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })
      );
    }
    
    canvas.renderAll();
    toast.success("Canvas cleared");
  };

  const handleExport = () => {
    if (!canvasRef.current) return;

    const dataURL = canvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `outdoor-layout-${Date.now()}.png`;
    link.click();

    toast.success("Layout exported as PNG");
  };

  const handleObjectSelect = (dataUrl: string) => {
    setObjectToPlace(dataUrl);
    setActiveTool("place");
    toast.info("Click on canvas to place object");
  };

  const handleObjectPlaced = () => {
    setObjectToPlace(null);
    saveState();
  };

  const handleDuplicate = async () => {
    const selected = canvasRef.current?.getActiveObject();
    if (!selected) {
      toast.error("No object selected");
      return;
    }

    try {
      const cloned = await selected.clone();
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });
      canvasRef.current?.add(cloned);
      canvasRef.current?.setActiveObject(cloned);
      canvasRef.current?.renderAll();
      saveState();
      toast.success("Object duplicated");
    } catch (error) {
      toast.error("Failed to duplicate object");
    }
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      canvasRef.current?.loadFromJSON(history[newStep], () => {
        canvasRef.current?.renderAll();
      });
      toast.info("Undo");
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      canvasRef.current?.loadFromJSON(history[newStep], () => {
        canvasRef.current?.renderAll();
      });
      toast.info("Redo");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Outdoor Layout Designer</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Design your perfect outdoor space with zones and objects
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>
      <main className="relative">
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onClear={handleClear}
          onExport={handleExport}
          onDuplicate={handleDuplicate}
          onUndo={handleUndo}
          onRedo={handleRedo}
          showGrid={showGrid}
          onGridToggle={setShowGrid}
        />

        <ColorPicker color={activeColor} onChange={setActiveColor} />
        
        <ObjectLibrary onObjectSelect={handleObjectSelect} />

        <LayoutCanvas
          activeTool={activeTool}
          activeColor={activeColor}
          objectToPlace={objectToPlace}
          onObjectPlaced={handleObjectPlaced}
          canvasRef={canvasRef}
          showGrid={showGrid}
          onStateChange={saveState}
        />
      </main>

    </div>
  );
};

export default Index;
