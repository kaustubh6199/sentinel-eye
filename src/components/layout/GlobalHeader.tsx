import { Shield, Activity, User, Clock, LogOut, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteUserDialog } from "@/components/admin/InviteUserDialog";
import { useToast } from "@/hooks/use-toast";

type SystemHealth = "healthy" | "warning" | "critical";

export function GlobalHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, role, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const systemHealth: SystemHealth = "healthy";
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

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
      navigate("/auth");
    }
  };

  const userName = user?.email?.split("@")[0] || "User";
  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";

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
        {/* Admin: Invite User Button */}
        {isAdmin && (
          <InviteUserDialog
            trigger={
              <Button variant="outline" size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Invite User
              </Button>
            }
          />
        )}

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

        {/* User Info with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-xs font-medium text-foreground">{userName}</p>
                <p className="text-2xs text-muted-foreground">{displayRole}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{role || "User"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
