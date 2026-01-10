import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/monitoring/StatusBadge";
import { RiskBadge } from "@/components/monitoring/RiskBadge";
import { ConfidenceMeter } from "@/components/monitoring/ConfidenceMeter";
import {
  ArrowLeft,
  Video,
  Brain,
  User,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function EventDetail() {
  const [comment, setComment] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Mock event data
  const event = {
    id: "EVT-2024-001247",
    cameraId: "CAM-001",
    cameraLocation: "Main Entrance Gate A",
    zone: "Zone A",
    eventType: "Intrusion Detected",
    dateTime: "2024-01-10 14:32:15",
    confidence: 92,
    riskScore: 87,
    riskLevel: "critical" as const,
    status: "pending" as const,
    aiExplanation:
      "Individual detected crossing restricted perimeter boundary during non-operational hours. Movement pattern indicates deliberate approach rather than accidental entry. No authorized access credentials detected within 50m radius.",
    historicalBaseline:
      "This zone typically has 0-2 authorized entries per hour during this time window. Current detection represents anomalous activity compared to 30-day baseline.",
  };

  const isActionDisabled = !comment.trim();

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-4">
          <Link to="/events">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-foreground">{event.id}</h2>
              <StatusBadge status={event.status} />
            </div>
            <p className="text-sm text-muted-foreground">{event.eventType}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Video/Snapshot Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Video Preview */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="aspect-video bg-secondary/50 flex items-center justify-center relative">
                <Video className="w-16 h-16 text-muted-foreground/30" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="px-3 py-1.5 rounded bg-background/80 backdrop-blur-sm">
                    <span className="text-xs font-mono text-foreground">
                      {event.dateTime}
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded bg-status-critical/20 border border-status-critical/30">
                    <span className="text-xs font-medium text-status-critical">
                      Event Timestamp
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Video clip available: 30 seconds before/after event
                  </span>
                  <Button variant="outline" size="sm">
                    Play Clip
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Explanation Panel */}
            <div className="bg-card rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-decision-ai/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-decision-ai" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">AI Analysis</h3>
                  <p className="text-2xs text-muted-foreground">
                    Automated detection reasoning
                  </p>
                </div>
              </div>

              <div className="pl-10 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Detection Reason
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {event.aiExplanation}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Historical Comparison
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {event.historicalBaseline}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <ConfidenceMeter value={event.confidence} size="md" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Risk Assessment</p>
                    <RiskBadge level={event.riskLevel} score={event.riskScore} />
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border flex items-start gap-2">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-2xs text-muted-foreground">
                  AI predictions require human validation before any enforcement action.
                  This analysis is provided as decision support only.
                </p>
              </div>
            </div>
          </div>

          {/* Metadata & Actions Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Event Metadata */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xs text-muted-foreground">Camera ID</p>
                    <p className="text-sm font-mono text-foreground">{event.cameraId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xs text-muted-foreground">Location</p>
                    <p className="text-sm text-foreground">{event.cameraLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xs text-muted-foreground">Zone</p>
                    <p className="text-sm text-foreground">{event.zone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xs text-muted-foreground">Timestamp</p>
                    <p className="text-sm font-mono text-foreground">{event.dateTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xs text-muted-foreground">Event Type</p>
                    <p className="text-sm text-foreground">{event.eventType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Human Decision Panel */}
            <div className="bg-card rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Human Decision</h3>
                  <p className="text-2xs text-muted-foreground">
                    Mandatory review required
                  </p>
                </div>
              </div>

              {/* Comment Box */}
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">
                  Decision Comment <span className="text-status-critical">*</span>
                </label>
                <Textarea
                  placeholder="Provide justification for your decision..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px] bg-background"
                />
                <p className="text-2xs text-muted-foreground mt-1">
                  Comment is required before taking action
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full gap-2 bg-decision-approved hover:bg-decision-approved/90"
                  disabled={isActionDisabled}
                  onClick={() => setSelectedAction("confirm")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm Event
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-decision-dismissed text-decision-dismissed hover:bg-decision-dismissed/10"
                  disabled={isActionDisabled}
                  onClick={() => setSelectedAction("dismiss")}
                >
                  <XCircle className="w-4 h-4" />
                  Mark False Positive
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 border-status-critical text-status-critical hover:bg-status-critical/10"
                  disabled={isActionDisabled}
                  onClick={() => setSelectedAction("escalate")}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  Escalate to Supervisor
                </Button>
              </div>

              {/* Decision Audit Note */}
              <div className="pt-2 border-t border-border">
                <p className="text-2xs text-muted-foreground">
                  All decisions are logged with timestamp, user ID, and comment for
                  audit compliance (DPDP Act, CERT-In).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
