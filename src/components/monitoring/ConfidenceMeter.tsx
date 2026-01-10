import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ConfidenceMeter({
  value,
  showLabel = true,
  size = "sm",
  className,
}: ConfidenceMeterProps) {
  const getColor = (val: number) => {
    if (val >= 85) return "bg-confidence-high";
    if (val >= 60) return "bg-confidence-medium";
    return "bg-confidence-low";
  };

  const getTextColor = (val: number) => {
    if (val >= 85) return "text-confidence-high";
    if (val >= 60) return "text-confidence-medium";
    return "text-confidence-low";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "bg-secondary rounded-full overflow-hidden",
          size === "sm" ? "h-1.5 w-16" : "h-2 w-24"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all", getColor(value))}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            "font-mono font-medium",
            size === "sm" ? "text-2xs" : "text-xs",
            getTextColor(value)
          )}
        >
          {value}%
        </span>
      )}
    </div>
  );
}
