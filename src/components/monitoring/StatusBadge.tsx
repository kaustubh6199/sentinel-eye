import { cn } from "@/lib/utils";

type StatusType = "pending" | "approved" | "dismissed" | "escalated";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: "Pending Review",
    className: "bg-decision-pending/20 text-decision-pending border-decision-pending/30",
  },
  approved: {
    label: "Confirmed",
    className: "bg-decision-approved/20 text-decision-approved border-decision-approved/30",
  },
  dismissed: {
    label: "False Positive",
    className: "bg-decision-dismissed/20 text-decision-dismissed border-decision-dismissed/30",
  },
  escalated: {
    label: "Escalated",
    className: "bg-status-critical/20 text-status-critical border-status-critical/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-2xs font-medium rounded border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
