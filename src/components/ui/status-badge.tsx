import { Badge } from "@/components/ui/badge";
import { statusBadgeStyles, statusLabel, Status } from "@/theme/status-badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant='outline' className={cn("capitalize gap-1 font-medium", statusBadgeStyles[status], className)}>
      {statusLabel[status]}
    </Badge>
  );
}
