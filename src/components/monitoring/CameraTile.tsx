import { cn } from "@/lib/utils";
import { Video, AlertCircle, Clock } from "lucide-react";

interface CameraTileProps {
  cameraId: string;
  location: string;
  zone: string;
  lastEvent?: {
    type: string;
    timestamp: string;
    confidence: number;
  };
  status: "online" | "offline" | "alert";
  onClick?: () => void;
}

export function CameraTile({
  cameraId,
  location,
  zone,
  lastEvent,
  status,
  onClick,
}: CameraTileProps) {
  const statusConfig = {
    online: {
      indicator: "bg-status-healthy",
      border: "border-border",
    },
    offline: {
      indicator: "bg-muted-foreground",
      border: "border-border",
    },
    alert: {
      indicator: "bg-status-critical animate-pulse",
      border: "border-status-critical/30 glow-critical",
    },
  };

  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "camera-tile w-full bg-card rounded-lg border overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-primary/50",
        config.border
      )}
    >
      {/* Camera Feed Placeholder */}
      <div className="aspect-video bg-secondary/50 relative flex items-center justify-center">
        <Video className="w-8 h-8 text-muted-foreground/50" />
        
        {/* Status Indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
          <div className={cn("w-1.5 h-1.5 rounded-full", config.indicator)} />
          <span className="text-2xs font-medium uppercase">
            {status === "online" ? "Live" : status}
          </span>
        </div>

        {/* Alert Badge */}
        {status === "alert" && lastEvent && (
          <div className="absolute bottom-2 left-2 right-2 px-2 py-1.5 rounded bg-status-critical/20 border border-status-critical/30 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-status-critical" />
            <span className="text-2xs text-status-critical font-medium truncate">
              {lastEvent.type}
            </span>
          </div>
        )}
      </div>

      {/* Camera Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-foreground">{cameraId}</p>
            <p className="text-2xs text-muted-foreground">{location}</p>
          </div>
          <span className="text-2xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
            {zone}
          </span>
        </div>

        {lastEvent && (
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-2xs text-muted-foreground">
              {lastEvent.timestamp}
            </span>
            <span className="text-2xs text-muted-foreground">•</span>
            <span className={cn(
              "text-2xs font-medium",
              lastEvent.confidence >= 85 ? "text-confidence-high" :
              lastEvent.confidence >= 60 ? "text-confidence-medium" : "text-confidence-low"
            )}>
              {lastEvent.confidence}% conf.
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
