import { cn } from "@/lib/utils";
import { 
  Brain, 
  Eye, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Activity,
  Target,
  Users,
  Car,
  Package
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
  icon?: React.ReactNode;
}

interface VLMAnalysisProps {
  cameraId: string;
  timestamp: string;
  sceneDescription: string;
  detectedObjects: DetectedObject[];
  riskAssessment: {
    level: "low" | "medium" | "high" | "critical";
    score: number;
    reasoning: string;
  };
  anomalies: string[];
  behaviorAnalysis?: string;
  processingTime?: number;
  modelVersion?: string;
  className?: string;
}

export function VLMAnalysis({
  cameraId,
  timestamp,
  sceneDescription,
  detectedObjects,
  riskAssessment,
  anomalies,
  behaviorAnalysis,
  processingTime = 145,
  modelVersion = "VLM-SOC-v2.1",
  className,
}: VLMAnalysisProps) {
  const riskConfig = {
    low: { color: "text-status-healthy", bg: "bg-status-healthy/10", border: "border-status-healthy/30" },
    medium: { color: "text-status-warning", bg: "bg-status-warning/10", border: "border-status-warning/30" },
    high: { color: "text-status-critical", bg: "bg-status-critical/10", border: "border-status-critical/30" },
    critical: { color: "text-status-critical", bg: "bg-status-critical/20", border: "border-status-critical/50" },
  };

  const config = riskConfig[riskAssessment.level];

  const getObjectIcon = (label: string) => {
    const lower = label.toLowerCase();
    if (lower.includes("person") || lower.includes("human")) return <Users className="w-3 h-3" />;
    if (lower.includes("vehicle") || lower.includes("car")) return <Car className="w-3 h-3" />;
    if (lower.includes("package") || lower.includes("bag")) return <Package className="w-3 h-3" />;
    return <Target className="w-3 h-3" />;
  };

  return (
    <div className={cn("bg-card border border-border rounded-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 bg-secondary/30 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              VLM Analysis
              <Badge variant="outline" className="text-2xs font-mono">
                {modelVersion}
              </Badge>
            </h3>
            <p className="text-2xs text-muted-foreground">
              Vision-Language Model Output • {cameraId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-2xs text-muted-foreground">
          <Activity className="w-3 h-3" />
          <span>{processingTime}ms</span>
          <span className="text-border">|</span>
          <Clock className="w-3 h-3" />
          <span>{timestamp}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Scene Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <Eye className="w-3.5 h-3.5 text-primary" />
            Scene Understanding
          </div>
          <div className="bg-secondary/30 rounded-md p-3 border border-border">
            <p className="text-sm text-foreground leading-relaxed">
              <Sparkles className="w-3 h-3 inline mr-1.5 text-primary" />
              {sceneDescription}
            </p>
          </div>
        </div>

        <Separator />

        {/* Detected Objects */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <Target className="w-3.5 h-3.5 text-primary" />
              Detected Objects
            </div>
            <span className="text-2xs text-muted-foreground">
              {detectedObjects.length} identified
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {detectedObjects.map((obj, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-md bg-secondary/20 border border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-muted-foreground">
                    {obj.icon || getObjectIcon(obj.label)}
                  </div>
                  <span className="text-xs text-foreground">{obj.label}</span>
                </div>
                <span
                  className={cn(
                    "text-2xs font-mono font-medium",
                    obj.confidence >= 85
                      ? "text-confidence-high"
                      : obj.confidence >= 60
                      ? "text-confidence-medium"
                      : "text-confidence-low"
                  )}
                >
                  {obj.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Risk Assessment */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <AlertTriangle className="w-3.5 h-3.5 text-primary" />
            AI Risk Assessment
          </div>
          <div className={cn("rounded-md p-3 border", config.bg, config.border)}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "uppercase text-2xs font-semibold",
                    config.color,
                    config.border
                  )}
                >
                  {riskAssessment.level} Risk
                </Badge>
              </div>
              <span className={cn("text-lg font-bold font-mono", config.color)}>
                {riskAssessment.score}/100
              </span>
            </div>
            <Progress
              value={riskAssessment.score}
              className="h-1.5 mb-2"
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {riskAssessment.reasoning}
            </p>
          </div>
        </div>

        {/* Anomalies Detected */}
        {anomalies.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <AlertTriangle className="w-3.5 h-3.5 text-status-warning" />
                Anomalies Detected
              </div>
              <div className="space-y-1.5">
                {anomalies.map((anomaly, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 rounded-md bg-status-warning/5 border border-status-warning/20"
                  >
                    <AlertTriangle className="w-3 h-3 text-status-warning mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground">{anomaly}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Behavior Analysis */}
        {behaviorAnalysis && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                Behavior Analysis
              </div>
              <div className="bg-secondary/20 rounded-md p-3 border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {behaviorAnalysis}
                </p>
              </div>
            </div>
          </>
        )}

        {/* AI Disclaimer */}
        <div className="flex items-start gap-2 p-2 rounded-md bg-primary/5 border border-primary/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
          <p className="text-2xs text-muted-foreground">
            <span className="font-medium text-foreground">AI-Generated Analysis:</span> This output requires human validation before any enforcement action. Confidence scores reflect model certainty, not ground truth.
          </p>
        </div>
      </div>
    </div>
  );
}
