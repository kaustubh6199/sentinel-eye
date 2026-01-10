import { Shield, Activity, User, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type SystemHealth = "healthy" | "warning" | "critical";
type UserRole = "Operator" | "Supervisor" | "Admin";

interface GlobalHeaderProps {
  systemHealth?: SystemHealth;
  userRole?: UserRole;
  userName?: string;
}

export function GlobalHeader({
  systemHealth = "healthy",
  userRole = "Operator",
  userName = "R. Sharma",
}: GlobalHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const healthConfig = {
    healthy: {
      color: "bg-status-healthy",
      label: "All Systems Operational",
    },
    warning: {
      color: "bg-status-warning",
      label: "Degraded Performance",
    },
    critical: {
      color: "bg-status-critical",
      label: "System Alert",
    },
  };

  const health = healthConfig[systemHealth];

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left: System Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">
            AI Video Intelligence Platform
          </h1>
          <p className="text-2xs text-muted-foreground">
            Security Operations Center
          </p>
        </div>
      </div>

      {/* Center: System Health */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/50">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${health.color} animate-pulse-slow`} />
          <span className="text-xs font-medium text-foreground">
            {health.label}
          </span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            47 Active Cameras
          </span>
        </div>
      </div>

      {/* Right: Date, Time, User */}
      <div className="flex items-center gap-6">
        {/* Date & Time */}
        <div className="flex items-center gap-3 text-right">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs font-mono text-foreground">
              {formatTime(currentTime)} IST
            </p>
            <p className="text-2xs text-muted-foreground">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-medium text-foreground">{userName}</p>
            <p className="text-2xs text-muted-foreground">{userRole}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
