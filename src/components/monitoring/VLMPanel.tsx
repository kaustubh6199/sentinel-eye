import { useState } from "react";
import { VLMAnalysis } from "./VLMAnalysis";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  RefreshCw, 
  History, 
  Settings, 
  ChevronDown,
  Zap
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface VLMPanelProps {
  cameraId?: string;
  className?: string;
}

// Mock VLM analysis data
const mockAnalysis = {
  cameraId: "CAM-001",
  timestamp: "14:32:15 IST",
  sceneDescription:
    "Indoor corridor environment with two individuals present. Primary subject (Person A) exhibits stationary behavior near restricted access door. Secondary subject (Person B) walking eastward toward exit. Lighting conditions normal. No visible obstructions.",
  detectedObjects: [
    { label: "Person A (Stationary)", confidence: 96 },
    { label: "Person B (Moving)", confidence: 91 },
    { label: "Access Control Panel", confidence: 88 },
    { label: "Security Door", confidence: 94 },
    { label: "Backpack", confidence: 72 },
    { label: "ID Badge (Visible)", confidence: 65 },
  ],
  riskAssessment: {
    level: "medium" as const,
    score: 58,
    reasoning:
      "Elevated risk due to prolonged stationary behavior (>45 seconds) near restricted access point. Subject positioning suggests potential tailgating attempt. Badge visibility partially obscured.",
  },
  anomalies: [
    "Unusual dwell time near access control point (exceeds baseline by 340%)",
    "Partial face occlusion detected - identity verification incomplete",
  ],
  behaviorAnalysis:
    "Person A has remained within 2m radius of access door for 47 seconds without authentication attempt. Historical baseline for this zone indicates average transit time of 8-12 seconds. Body orientation suggests attention directed at access panel. No aggressive posture indicators detected.",
};

const analysisHistory = [
  { timestamp: "14:32:15", riskLevel: "medium", confidence: 87 },
  { timestamp: "14:31:45", riskLevel: "low", confidence: 92 },
  { timestamp: "14:31:15", riskLevel: "low", confidence: 89 },
  { timestamp: "14:30:45", riskLevel: "high", confidence: 94 },
];

export function VLMPanel({ cameraId = "CAM-001", className }: VLMPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleRefresh = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const riskColors = {
    low: "text-status-healthy",
    medium: "text-status-warning",
    high: "text-status-critical",
    critical: "text-status-critical",
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Vision-Language Model
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time scene understanding & risk analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isProcessing}
            className="gap-2"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isProcessing && "animate-spin")} />
            {isProcessing ? "Analyzing..." : "Re-analyze"}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-status-healthy" />
          <span className="text-xs font-medium text-foreground">Model Active</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Frame Rate:</span>
          <Badge variant="secondary" className="text-2xs">
            5 FPS
          </Badge>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Latency:</span>
          <Badge variant="secondary" className="text-2xs">
            145ms
          </Badge>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">GPU:</span>
          <Badge variant="secondary" className="text-2xs">
            42% Util
          </Badge>
        </div>
      </div>

      {/* Analysis History */}
      <Collapsible open={showHistory} onOpenChange={setShowHistory}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full p-3 rounded-lg bg-card border border-border hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Analysis History
              </span>
              <Badge variant="outline" className="text-2xs">
                {analysisHistory.length} recent
              </Badge>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                showHistory && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="space-y-1 p-2 rounded-lg bg-secondary/20 border border-border">
            {analysisHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded hover:bg-secondary/30 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">
                    {item.timestamp}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-2xs uppercase",
                      riskColors[item.riskLevel as keyof typeof riskColors]
                    )}
                  >
                    {item.riskLevel}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.confidence}% conf
                </span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Main Analysis */}
      <VLMAnalysis
        cameraId={mockAnalysis.cameraId}
        timestamp={mockAnalysis.timestamp}
        sceneDescription={mockAnalysis.sceneDescription}
        detectedObjects={mockAnalysis.detectedObjects}
        riskAssessment={mockAnalysis.riskAssessment}
        anomalies={mockAnalysis.anomalies}
        behaviorAnalysis={mockAnalysis.behaviorAnalysis}
      />
    </div>
  );
}
