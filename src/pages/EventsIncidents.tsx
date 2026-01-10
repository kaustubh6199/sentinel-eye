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
import { StatusBadge } from "@/components/monitoring/StatusBadge";
import { RiskBadge } from "@/components/monitoring/RiskBadge";
import { ConfidenceMeter } from "@/components/monitoring/ConfidenceMeter";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock event data
const mockEvents = [
  {
    id: "EVT-2024-001247",
    cameraLocation: "Main Entrance Gate A",
    eventType: "Intrusion Detected",
    dateTime: "2024-01-10 14:32:15",
    confidence: 92,
    riskScore: 87,
    riskLevel: "critical" as const,
    status: "pending" as const,
  },
  {
    id: "EVT-2024-001246",
    cameraLocation: "Loading Dock",
    eventType: "Crowding Detected",
    dateTime: "2024-01-10 14:30:08",
    confidence: 88,
    riskScore: 72,
    riskLevel: "high" as const,
    status: "pending" as const,
  },
  {
    id: "EVT-2024-001245",
    cameraLocation: "Parking Lot B - North",
    eventType: "Loitering",
    dateTime: "2024-01-10 14:28:45",
    confidence: 78,
    riskScore: 45,
    riskLevel: "moderate" as const,
    status: "approved" as const,
  },
  {
    id: "EVT-2024-001244",
    cameraLocation: "Perimeter Fence East",
    eventType: "Motion Detected",
    dateTime: "2024-01-10 14:25:33",
    confidence: 45,
    riskScore: 23,
    riskLevel: "low" as const,
    status: "dismissed" as const,
  },
  {
    id: "EVT-2024-001243",
    cameraLocation: "Warehouse Entry",
    eventType: "Unauthorized Vehicle",
    dateTime: "2024-01-10 14:20:12",
    confidence: 95,
    riskScore: 91,
    riskLevel: "critical" as const,
    status: "escalated" as const,
  },
  {
    id: "EVT-2024-001242",
    cameraLocation: "Staff Canteen",
    eventType: "Crowd Gathering",
    dateTime: "2024-01-10 14:18:45",
    confidence: 72,
    riskScore: 38,
    riskLevel: "moderate" as const,
    status: "approved" as const,
  },
  {
    id: "EVT-2024-001241",
    cameraLocation: "Server Room Corridor",
    eventType: "Unusual Activity",
    dateTime: "2024-01-10 14:15:22",
    confidence: 65,
    riskScore: 56,
    riskLevel: "high" as const,
    status: "pending" as const,
  },
  {
    id: "EVT-2024-001240",
    cameraLocation: "VIP Parking Area",
    eventType: "Tailgating",
    dateTime: "2024-01-10 14:10:05",
    confidence: 81,
    riskScore: 64,
    riskLevel: "high" as const,
    status: "approved" as const,
  },
];

export default function EventsIncidents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const pendingCount = mockEvents.filter((e) => e.status === "pending").length;

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Events & Incidents</h2>
            <p className="text-sm text-muted-foreground">
              Review and validate AI-detected security events
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-decision-pending/20 text-decision-pending">
                {pendingCount} Pending Review
              </span>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>

          <Select value={selectedEventType} onValueChange={setSelectedEventType}>
            <SelectTrigger className="w-44 bg-background">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Event Types</SelectItem>
              <SelectItem value="intrusion">Intrusion</SelectItem>
              <SelectItem value="loitering">Loitering</SelectItem>
              <SelectItem value="crowding">Crowding</SelectItem>
              <SelectItem value="motion">Motion Detected</SelectItem>
              <SelectItem value="vehicle">Vehicle Related</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Confirmed</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Events Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-table-header">
            <tr className="text-left">
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Event ID
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Camera Location
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Event Type
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI Confidence
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Risk Score
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-table-border">
            {mockEvents.map((event) => (
              <tr
                key={event.id}
                className={cn(
                  "data-row hover:bg-table-row-hover",
                  event.status === "pending" && "bg-decision-pending/5"
                )}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-foreground">{event.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{event.cameraLocation}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{event.eventType}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-muted-foreground">
                    {event.dateTime}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ConfidenceMeter value={event.confidence} />
                </td>
                <td className="px-6 py-4">
                  <RiskBadge level={event.riskLevel} score={event.riskScore} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={event.status} />
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-border bg-card/50 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-8 of 247 events
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-foreground px-2">Page 1 of 31</span>
          <Button variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
