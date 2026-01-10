import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Map, Video, Clock, Play, Pause, SkipBack, SkipForward } from "lucide-react";

// Mock camera positions for floor plan
const cameraPositions = [
  { id: "CAM-001", x: 15, y: 20, zone: "Zone A", status: "alert" as const },
  { id: "CAM-002", x: 35, y: 45, zone: "Zone B", status: "online" as const },
  { id: "CAM-003", x: 25, y: 30, zone: "Zone A", status: "online" as const },
  { id: "CAM-004", x: 60, y: 25, zone: "Zone C", status: "online" as const },
  { id: "CAM-005", x: 45, y: 70, zone: "Zone B", status: "offline" as const },
  { id: "CAM-006", x: 75, y: 55, zone: "Zone D", status: "alert" as const },
  { id: "CAM-007", x: 85, y: 15, zone: "Zone E", status: "online" as const },
  { id: "CAM-008", x: 20, y: 60, zone: "Zone A", status: "online" as const },
  { id: "CAM-009", x: 70, y: 75, zone: "Zone D", status: "online" as const },
  { id: "CAM-010", x: 50, y: 35, zone: "Zone C", status: "online" as const },
];

// Mock heatmap data (activity intensity)
const heatmapZones = [
  { x: 10, y: 15, radius: 15, intensity: 0.9 },
  { x: 70, y: 50, radius: 12, intensity: 0.7 },
  { x: 40, y: 65, radius: 10, intensity: 0.4 },
  { x: 55, y: 25, radius: 8, intensity: 0.3 },
];

export default function CameraMap() {
  const [selectedZone, setSelectedZone] = useState("all");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [timeSlider, setTimeSlider] = useState([100]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  const statusColors = {
    online: "bg-status-healthy",
    offline: "bg-muted-foreground",
    alert: "bg-status-critical animate-pulse",
  };

  const filteredCameras = cameraPositions.filter(
    (cam) => selectedZone === "all" || cam.zone === selectedZone
  );

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Camera & Zone Map
            </h2>
            <p className="text-sm text-muted-foreground">
              Spatial overview with activity heatmap
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-36 bg-background">
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="Zone A">Zone A</SelectItem>
                <SelectItem value="Zone B">Zone B</SelectItem>
                <SelectItem value="Zone C">Zone C</SelectItem>
                <SelectItem value="Zone D">Zone D</SelectItem>
                <SelectItem value="Zone E">Zone E</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showHeatmap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              Heatmap
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
          {/* Map View */}
          <div className="xl:col-span-3">
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Map className="w-4 h-4 text-primary" />
                    Facility Floor Plan
                  </CardTitle>
                  <div className="flex items-center gap-4 text-2xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-status-healthy" />
                      <span className="text-muted-foreground">Online</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-status-critical animate-pulse" />
                      <span className="text-muted-foreground">Alert</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      <span className="text-muted-foreground">Offline</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-60px)]">
                {/* Floor Plan Container */}
                <div className="relative w-full h-full bg-secondary/30 rounded-lg border border-border overflow-hidden">
                  {/* Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Zone Labels */}
                  <div className="absolute top-4 left-4 px-2 py-1 rounded bg-background/80 text-2xs font-medium">
                    Zone A
                  </div>
                  <div className="absolute top-1/2 left-1/3 px-2 py-1 rounded bg-background/80 text-2xs font-medium">
                    Zone B
                  </div>
                  <div className="absolute top-1/4 right-1/3 px-2 py-1 rounded bg-background/80 text-2xs font-medium">
                    Zone C
                  </div>
                  <div className="absolute bottom-1/4 right-1/4 px-2 py-1 rounded bg-background/80 text-2xs font-medium">
                    Zone D
                  </div>
                  <div className="absolute top-4 right-4 px-2 py-1 rounded bg-background/80 text-2xs font-medium">
                    Zone E
                  </div>

                  {/* Heatmap Overlay */}
                  {showHeatmap &&
                    heatmapZones.map((zone, idx) => (
                      <div
                        key={idx}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          left: `${zone.x}%`,
                          top: `${zone.y}%`,
                          width: `${zone.radius * 2}%`,
                          height: `${zone.radius * 2}%`,
                          transform: "translate(-50%, -50%)",
                          background: `radial-gradient(circle, hsl(var(--status-warning) / ${zone.intensity * 0.5}) 0%, transparent 70%)`,
                        }}
                      />
                    ))}

                  {/* Camera Markers */}
                  {filteredCameras.map((camera) => (
                    <button
                      key={camera.id}
                      onClick={() => setSelectedCamera(camera.id)}
                      className={cn(
                        "absolute w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        "bg-background border-2 hover:scale-110",
                        selectedCamera === camera.id
                          ? "border-primary ring-4 ring-primary/20"
                          : "border-border"
                      )}
                      style={{
                        left: `${camera.x}%`,
                        top: `${camera.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Video className="w-4 h-4 text-foreground" />
                      <div
                        className={cn(
                          "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                          statusColors[camera.status]
                        )}
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="xl:col-span-1 space-y-4">
            {/* Time Slider */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Historical Replay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
                <Slider
                  value={timeSlider}
                  onValueChange={setTimeSlider}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-2xs text-muted-foreground">
                  <span>08:00</span>
                  <span className="font-mono">
                    {Math.floor((timeSlider[0] / 100) * 8 + 8)}:
                    {String(Math.floor((timeSlider[0] % 12.5) * 4.8)).padStart(2, "0")}
                  </span>
                  <span>16:00</span>
                </div>
              </CardContent>
            </Card>

            {/* Camera Details */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  {selectedCamera ? `Camera ${selectedCamera}` : "Select a Camera"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCamera ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xs text-muted-foreground">Location</p>
                      <p className="text-sm text-foreground">
                        {cameraPositions.find((c) => c.id === selectedCamera)?.zone ||
                          "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xs text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            statusColors[
                              cameraPositions.find((c) => c.id === selectedCamera)
                                ?.status || "offline"
                            ]
                          )}
                        />
                        <span className="text-sm text-foreground capitalize">
                          {cameraPositions.find((c) => c.id === selectedCamera)
                            ?.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full" size="sm">
                      View Live Feed
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click on a camera marker to view details
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Zone Summary */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Zone Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"].map((zone) => {
                    const cameras = cameraPositions.filter((c) => c.zone === zone);
                    const alertCount = cameras.filter((c) => c.status === "alert").length;
                    return (
                      <div
                        key={zone}
                        className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                      >
                        <span className="text-sm text-foreground">{zone}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xs text-muted-foreground">
                            {cameras.length} cams
                          </span>
                          {alertCount > 0 && (
                            <span className="text-2xs px-1.5 py-0.5 rounded bg-status-critical/20 text-status-critical">
                              {alertCount} alert
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
