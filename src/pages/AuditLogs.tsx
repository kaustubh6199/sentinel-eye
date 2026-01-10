import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Shield,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  User,
  Settings,
  FileText,
  Eye,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActionType = "access" | "decision" | "export" | "model" | "config";

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  actionType: ActionType;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}

// Mock audit data
const mockAuditLogs: AuditEntry[] = [
  {
    id: "AUD-2024-005247",
    timestamp: "2024-01-10 14:32:18",
    userId: "USR-1042",
    userName: "R. Sharma",
    userRole: "Operator",
    actionType: "decision",
    action: "Event Confirmed",
    resource: "EVT-2024-001247",
    details: "Confirmed intrusion event with comment: 'Visual verification complete'",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AUD-2024-005246",
    timestamp: "2024-01-10 14:30:05",
    userId: "USR-1042",
    userName: "R. Sharma",
    userRole: "Operator",
    actionType: "access",
    action: "View Event",
    resource: "EVT-2024-001247",
    details: "Accessed event detail page",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AUD-2024-005245",
    timestamp: "2024-01-10 14:25:12",
    userId: "USR-1015",
    userName: "A. Patel",
    userRole: "Supervisor",
    actionType: "export",
    action: "Export Report",
    resource: "RPT-DAILY-20240110",
    details: "Exported daily incident summary report (PDF)",
    ipAddress: "192.168.1.38",
  },
  {
    id: "AUD-2024-005244",
    timestamp: "2024-01-10 14:20:33",
    userId: "USR-1003",
    userName: "V. Kumar",
    userRole: "Admin",
    actionType: "model",
    action: "Model Update",
    resource: "MDL-INTRUSION-V2.3",
    details: "Deployed intrusion detection model update v2.3.1",
    ipAddress: "192.168.1.12",
  },
  {
    id: "AUD-2024-005243",
    timestamp: "2024-01-10 14:15:45",
    userId: "USR-1042",
    userName: "R. Sharma",
    userRole: "Operator",
    actionType: "decision",
    action: "False Positive",
    resource: "EVT-2024-001244",
    details: "Marked as false positive: 'Bird triggered motion sensor'",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AUD-2024-005242",
    timestamp: "2024-01-10 14:10:22",
    userId: "USR-1015",
    userName: "A. Patel",
    userRole: "Supervisor",
    actionType: "access",
    action: "Login",
    resource: "SYSTEM",
    details: "Successful authentication via SSO",
    ipAddress: "192.168.1.38",
  },
  {
    id: "AUD-2024-005241",
    timestamp: "2024-01-10 14:05:18",
    userId: "USR-1003",
    userName: "V. Kumar",
    userRole: "Admin",
    actionType: "config",
    action: "Settings Update",
    resource: "CFG-ALERTS",
    details: "Modified alert threshold for Zone A cameras",
    ipAddress: "192.168.1.12",
  },
  {
    id: "AUD-2024-005240",
    timestamp: "2024-01-10 14:00:05",
    userId: "SYSTEM",
    userName: "System",
    userRole: "System",
    actionType: "model",
    action: "Model Inference",
    resource: "MDL-CROWD-V1.8",
    details: "Batch inference completed: 47 cameras processed",
    ipAddress: "127.0.0.1",
  },
];

const actionTypeConfig: Record<
  ActionType,
  { icon: React.ElementType; color: string; label: string }
> = {
  access: { icon: Eye, color: "text-status-info", label: "Access" },
  decision: { icon: User, color: "text-decision-approved", label: "Decision" },
  export: { icon: FileText, color: "text-status-warning", label: "Export" },
  model: { icon: Database, color: "text-decision-ai", label: "Model" },
  config: { icon: Settings, color: "text-muted-foreground", label: "Config" },
};

export default function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActionType, setSelectedActionType] = useState("all");

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Audit Logs</h2>
              <p className="text-sm text-muted-foreground">
                Immutable record of all system activities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary/50 border border-border">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Export Restricted
              </span>
            </div>
            <Button variant="outline" size="sm" className="gap-2" disabled>
              <Download className="w-4 h-4" />
              Export (Admin Only)
            </Button>
          </div>
        </div>

        {/* Compliance Note */}
        <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-2xs text-muted-foreground">
            <span className="font-semibold text-foreground">Compliance Notice:</span>{" "}
            All entries are cryptographically signed and tamper-evident. Retention
            period: 7 years as per DPDP Act 2023 and CERT-In guidelines. Unauthorized
            access attempts are logged and reported.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>

          <Select value={selectedActionType} onValueChange={setSelectedActionType}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="access">Access</SelectItem>
              <SelectItem value="decision">Decisions</SelectItem>
              <SelectItem value="export">Exports</SelectItem>
              <SelectItem value="model">Model Updates</SelectItem>
              <SelectItem value="config">Config Changes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-table-header">
            <tr className="text-left">
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Log ID
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resource
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-table-border">
            {mockAuditLogs.map((log) => {
              const typeConfig = actionTypeConfig[log.actionType];
              const TypeIcon = typeConfig.icon;

              return (
                <tr key={log.id} className="data-row hover:bg-table-row-hover">
                  <td className="px-6 py-3">
                    <span className="text-xs font-mono text-foreground">{log.id}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      {log.timestamp}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-xs text-foreground">{log.userName}</p>
                      <p className="text-2xs text-muted-foreground">
                        {log.userId} • {log.userRole}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5">
                      <TypeIcon className={cn("w-3.5 h-3.5", typeConfig.color)} />
                      <span className="text-xs text-foreground">{typeConfig.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs text-foreground">{log.action}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      {log.resource}
                    </span>
                  </td>
                  <td className="px-6 py-3 max-w-xs">
                    <p className="text-xs text-muted-foreground truncate" title={log.details}>
                      {log.details}
                    </p>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      {log.ipAddress}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-border bg-card/50 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-8 of 15,847 entries
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-foreground px-2">Page 1 of 1,981</span>
          <Button variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
