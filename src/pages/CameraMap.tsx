import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Map, Video, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import { AddCameraDialog } from "@/components/map/AddCameraDialog";
import { AddZoneDialog } from "@/components/map/AddZoneDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CameraMap() {
  const [cameras, setCameras] = useState<Tables<"cameras">[]>([]);
  const [zones, setZones] = useState<Tables<"zones">[]>([]);
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const [camRes, zoneRes] = await Promise.all([
      supabase.from("cameras").select("*"),
      supabase.from("zones").select("*"),
    ]);
    if (camRes.data) setCameras(camRes.data);
    if (zoneRes.data) setZones(zoneRes.data);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredCameras = cameras.filter(
    (cam) => selectedZone === "all" || cam.zone_id === selectedZone
  );

  const selectedCam = cameras.find((c) => c.id === selectedCamera);
  const selectedCamZone = selectedCam ? zones.find((z) => z.id === selectedCam.zone_id) : null;

  const statusColors: Record<string, string> = {
    online: "bg-status-healthy",
    offline: "bg-muted-foreground",
    alert: "bg-status-critical animate-pulse",
  };

  const deleteCamera = async (id: string) => {
    const { error } = await supabase.from("cameras").delete().eq("id", id);
    if (error) { toast.error("Failed to delete camera"); return; }
    toast.success("Camera deleted");
    setSelectedCamera(null);
    fetchData();
  };

  const deleteZone = async (id: string) => {
    const { error } = await supabase.from("zones").delete().eq("id", id);
    if (error) { toast.error("Failed to delete zone"); return; }
    toast.success("Zone deleted");
    fetchData();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Camera & Zone Map</h2>
            <p className="text-sm text-muted-foreground">Manage cameras and zones spatially</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-36 bg-background">
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map((z) => (
                  <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddZoneDialog onZoneAdded={fetchData} />
            <AddCameraDialog zones={zones} onCameraAdded={fetchData} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
          {/* Map */}
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
                <div className="relative w-full h-full bg-secondary/30 rounded-lg border border-border overflow-hidden min-h-[400px]">
                  {/* Grid */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Zone rectangles */}
                  {zones.map((zone) => (
                    <div
                      key={zone.id}
                      className="absolute rounded-md border-2 border-dashed flex items-start justify-start p-1"
                      style={{
                        left: `${zone.x_position}%`,
                        top: `${zone.y_position}%`,
                        width: `${zone.width}%`,
                        height: `${zone.height}%`,
                        borderColor: zone.color,
                        backgroundColor: `${zone.color}15`,
                      }}
                    >
                      <span className="text-2xs font-medium px-1 rounded" style={{ backgroundColor: zone.color, color: "#fff" }}>
                        {zone.name}
                      </span>
                    </div>
                  ))}

                  {/* Camera markers */}
                  {filteredCameras.map((camera) => (
                    <button
                      key={camera.id}
                      onClick={() => setSelectedCamera(camera.id)}
                      className={cn(
                        "absolute w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        "bg-background border-2 hover:scale-110 z-10",
                        selectedCamera === camera.id
                          ? "border-primary ring-4 ring-primary/20"
                          : "border-border"
                      )}
                      style={{
                        left: `${camera.x_position}%`,
                        top: `${camera.y_position}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title={camera.name}
                    >
                      <Video className="w-4 h-4 text-foreground" />
                      <div
                        className={cn(
                          "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                          statusColors[camera.status] || "bg-muted-foreground"
                        )}
                      />
                    </button>
                  ))}

                  {cameras.length === 0 && zones.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <p className="text-sm">Add zones and cameras to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="xl:col-span-1 space-y-4">
            {/* Camera Details */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">
                  {selectedCam ? selectedCam.name : "Select a Camera"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCam ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-2xs text-muted-foreground">RTSP URL</p>
                      <p className="text-sm text-foreground font-mono break-all">{selectedCam.rtsp_url}</p>
                    </div>
                    <div>
                      <p className="text-2xs text-muted-foreground">Zone</p>
                      <p className="text-sm text-foreground">{selectedCamZone?.name || "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="text-2xs text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={cn("w-2 h-2 rounded-full", statusColors[selectedCam.status] || "bg-muted-foreground")} />
                        <span className="text-sm text-foreground capitalize">{selectedCam.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-2xs text-muted-foreground">Position</p>
                      <p className="text-sm text-foreground">X: {selectedCam.x_position}% Y: {selectedCam.y_position}%</p>
                    </div>
                    <Button variant="destructive" size="sm" className="w-full gap-1.5" onClick={() => deleteCamera(selectedCam.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Camera
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Click on a camera marker to view details</p>
                )}
              </CardContent>
            </Card>

            {/* Zone Summary */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Zones ({zones.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {zones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No zones added yet</p>
                ) : (
                  <div className="space-y-2">
                    {zones.map((zone) => {
                      const zoneCams = cameras.filter((c) => c.zone_id === zone.id);
                      const alertCount = zoneCams.filter((c) => c.status === "alert").length;
                      return (
                        <div key={zone.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: zone.color }} />
                            <span className="text-sm text-foreground">{zone.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xs text-muted-foreground">{zoneCams.length} cams</span>
                            {alertCount > 0 && (
                              <span className="text-2xs px-1.5 py-0.5 rounded bg-status-critical/20 text-status-critical">
                                {alertCount} alert
                              </span>
                            )}
                            <button onClick={() => deleteZone(zone.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
