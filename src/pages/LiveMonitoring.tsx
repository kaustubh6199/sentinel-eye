import { useState } from "react";
import { CameraTile } from "@/components/monitoring/CameraTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, Search, RefreshCw } from "lucide-react";

// Mock camera data
const mockCameras = [
  {
    id: "CAM-001",
    location: "Main Entrance Gate A",
    zone: "Zone A",
    status: "alert" as const,
    lastEvent: { type: "Intrusion Detected", timestamp: "14:32:15", confidence: 92 },
  },
  {
    id: "CAM-002",
    location: "Parking Lot B - North",
    zone: "Zone B",
    status: "online" as const,
    lastEvent: { type: "Loitering", timestamp: "14:28:45", confidence: 78 },
  },
  {
    id: "CAM-003",
    location: "Building Reception",
    zone: "Zone A",
    status: "online" as const,
    lastEvent: undefined,
  },
  {
    id: "CAM-004",
    location: "Server Room Corridor",
    zone: "Zone C",
    status: "online" as const,
    lastEvent: { type: "Unusual Activity", timestamp: "14:15:22", confidence: 65 },
  },
  {
    id: "CAM-005",
    location: "Emergency Exit West",
    zone: "Zone B",
    status: "offline" as const,
    lastEvent: undefined,
  },
  {
    id: "CAM-006",
    location: "Loading Dock",
    zone: "Zone D",
    status: "alert" as const,
    lastEvent: { type: "Crowding Detected", timestamp: "14:30:08", confidence: 88 },
  },
  {
    id: "CAM-007",
    location: "Perimeter Fence East",
    zone: "Zone E",
    status: "online" as const,
    lastEvent: { type: "Motion Detected", timestamp: "14:25:33", confidence: 45 },
  },
  {
    id: "CAM-008",
    location: "VIP Parking Area",
    zone: "Zone A",
    status: "online" as const,
    lastEvent: undefined,
  },
  {
    id: "CAM-009",
    location: "Warehouse Entry",
    zone: "Zone D",
    status: "online" as const,
    lastEvent: { type: "Vehicle Detected", timestamp: "14:20:12", confidence: 95 },
  },
  {
    id: "CAM-010",
    location: "Rooftop Access",
    zone: "Zone C",
    status: "online" as const,
    lastEvent: undefined,
  },
  {
    id: "CAM-011",
    location: "Staff Canteen",
    zone: "Zone B",
    status: "online" as const,
    lastEvent: { type: "Crowd Gathering", timestamp: "14:18:45", confidence: 72 },
  },
  {
    id: "CAM-012",
    location: "Control Room Entrance",
    zone: "Zone C",
    status: "online" as const,
    lastEvent: undefined,
  },
];

export default function LiveMonitoring() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCameras = mockCameras.filter((camera) => {
    const matchesSearch =
      camera.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === "all" || camera.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const alertCount = mockCameras.filter((c) => c.status === "alert").length;
  const offlineCount = mockCameras.filter((c) => c.status === "offline").length;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Live Monitoring</h2>
            <p className="text-sm text-muted-foreground">
              Real-time camera feeds with AI-detected events
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh All
          </Button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-status-healthy" />
            <span className="text-sm text-foreground">
              {mockCameras.length - offlineCount} Online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-status-critical animate-pulse" />
            <span className="text-sm text-foreground">{alertCount} Active Alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">{offlineCount} Offline</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-40 bg-background">
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

          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-secondary" : "hover:bg-secondary/50"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-secondary" : "hover:bg-secondary/50"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredCameras.map((camera) => (
            <CameraTile
              key={camera.id}
              cameraId={camera.id}
              location={camera.location}
              zone={camera.zone}
              status={camera.status}
              lastEvent={camera.lastEvent}
              onClick={() => console.log("Open camera:", camera.id)}
            />
          ))}
        </div>

        {filteredCameras.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-sm">No cameras match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
