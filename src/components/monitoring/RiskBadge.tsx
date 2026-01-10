import { cn } from "@/lib/utils";

type RiskLevel = "low" | "moderate" | "high" | "critical";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  className?: string;
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-risk-low/20 text-risk-low",
  },
  moderate: {
    label: "Moderate",
    className: "bg-risk-moderate/20 text-risk-moderate",
  },
  high: {
    label: "High",
    className: "bg-risk-high/20 text-risk-high",
  },
  critical: {
    label: "Critical",
    className: "bg-risk-critical/20 text-risk-critical",
  },
};

export function RiskBadge({ level, score, className }: RiskBadgeProps) {
  const config = riskConfig[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-2xs font-semibold rounded",
        config.className,
        className
      )}
    >
      {score !== undefined && <span>{score}</span>}
      <span>{config.label}</span>
    </span>
  );
}
