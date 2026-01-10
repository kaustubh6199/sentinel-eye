import { useState } from "react";
import { VLMPanel } from "@/components/monitoring/VLMPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Video, 
  Maximize2,
  Grid3X3,
  LayoutPanelLeft,
  Pause,
  Play,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";

const cameras = [
  { id: "CAM-001", location: "Main Entrance Gate A", status: "alert" },
  { id: "CAM-002", location: "Parking Lot B - North", status: "online" },
  { id: "CAM-003", location: "Building Reception", status: "online" },
  { id: "CAM-006", location: "Loading Dock", status: "alert" },
];

export default function VLMMonitoring() {
  const [selectedCamera, setSelectedCamera] = useState("CAM-001");
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [layout, setLayout] = useState<"split" | "focus">("split");

  const currentCamera = cameras.find((c) => c.id === selectedCamera);

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-3">
              VLM Analysis Console
              <Badge variant="outline" className="text-xs font-normal">
                Vision-Language Model
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time AI scene understanding with human-in-the-loop validation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isAnalyzing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAnalyzing(!isAnalyzing)}
              className="gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause Analysis
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Resume Analysis
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-4">
          <Select value={selectedCamera} onValueChange={setSelectedCamera}>
            <SelectTrigger className="w-64 bg-background">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Select Camera" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {cameras.map((camera) => (
                <SelectItem key={camera.id} value={camera.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        camera.status === "alert"
                          ? "bg-status-critical animate-pulse"
                          : "bg-status-healthy"
                      )}
                    />
                    <span>{camera.id}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-muted-foreground text-xs truncate max-w-32">
                      {camera.location}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => setLayout("split")}
              className={cn(
                "p-2 flex items-center gap-1.5 text-xs",
                layout === "split" ? "bg-secondary" : "hover:bg-secondary/50"
              )}
            >
              <LayoutPanelLeft className="w-4 h-4" />
              Split View
            </button>
            <button
              onClick={() => setLayout("focus")}
              className={cn(
                "p-2 flex items-center gap-1.5 text-xs",
                layout === "focus" ? "bg-secondary" : "hover:bg-secondary/50"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
              Focus Mode
            </button>
          </div>

          {isAnalyzing && (
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-2 h-2 rounded-full bg-status-healthy animate-pulse" />
              <span className="text-xs text-muted-foreground">
                Live Analysis Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6">
        <div
          className={cn(
            "h-full grid gap-6",
            layout === "split" ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          {/* Video Feed Panel */}
          <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Live Feed
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-2xs",
                    currentCamera?.status === "alert"
                      ? "text-status-critical border-status-critical/30"
                      : "text-status-healthy border-status-healthy/30"
                  )}
                >
                  {currentCamera?.status === "alert" ? "ALERT" : "LIVE"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xs text-muted-foreground font-mono">
                  {selectedCamera}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Maximize2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Video Placeholder with Detection Overlay */}
            <div className="flex-1 bg-secondary/30 relative flex items-center justify-center min-h-[400px]">
              <Video className="w-16 h-16 text-muted-foreground/30" />

              {/* Mock Detection Boxes */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Person A */}
                <div
                  className="absolute border-2 border-status-warning rounded"
                  style={{ left: "25%", top: "30%", width: "15%", height: "45%" }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-status-warning text-background text-2xs font-medium rounded">
                    Person A • 96%
                  </div>
                </div>

                {/* Person B */}
                <div
                  className="absolute border-2 border-status-healthy rounded"
                  style={{ left: "60%", top: "35%", width: "12%", height: "40%" }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-status-healthy text-background text-2xs font-medium rounded">
                    Person B • 91%
                  </div>
                </div>

                {/* Object */}
                <div
                  className="absolute border-2 border-primary/60 rounded"
                  style={{ left: "30%", top: "55%", width: "8%", height: "15%" }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-primary text-primary-foreground text-2xs font-medium rounded whitespace-nowrap">
                    Backpack • 72%
                  </div>
                </div>
              </div>

              {/* Camera Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="px-3 py-2 bg-background/80 backdrop-blur-sm rounded border border-border">
                  <p className="text-xs font-medium text-foreground">
                    {currentCamera?.location}
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    {selectedCamera} • Zone A
                  </p>
                </div>
                <div className="px-3 py-2 bg-background/80 backdrop-blur-sm rounded border border-border text-right">
                  <p className="text-2xs font-mono text-foreground">
                    14:32:15 IST
                  </p>
                  <p className="text-2xs text-muted-foreground">
                    1920×1080 @ 30fps
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* VLM Analysis Panel */}
          <div className="overflow-y-auto">
            <VLMPanel cameraId={selectedCamera} />
          </div>
        </div>
      </div>
    </div>
  );
}
