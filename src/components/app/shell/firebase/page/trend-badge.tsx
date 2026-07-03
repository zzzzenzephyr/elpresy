import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendBadgeProps {
  value: string;
  label: string;
  percentage: number;
  comparisonText: string;
  className?: string;
}

export function TrendBadge({
  value,
  label,
  percentage,
  comparisonText,
  className,
}: TrendBadgeProps) {
  const isPositive = percentage >= 0;
  
  return (
    <div className={cn("p-4 md:p-6 rounded-xl bg-neutral-primary border border-border-default shadow-sm flex flex-col items-center justify-center text-center", className)}>
      <div className="tabular-nums text-4xl font-bold text-heading">
        {value}
      </div>
      <div className="text-sm text-body-subtle mt-1">
        {label}
      </div>
      <div 
        className={cn(
          "flex items-center gap-1 rounded-full px-[8px] py-[2px] mt-3 text-xs font-medium border",
          isPositive 
            ? "bg-success-soft text-fg-success-strong border-border-success-subtle" 
            : "bg-danger-soft text-fg-danger-strong border-border-danger-subtle"
        )}
      >
        {isPositive ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownRight className="w-3 h-3" />
        )}
        <span>
          {isPositive ? "+" : ""}{percentage}% {comparisonText}
        </span>
      </div>
    </div>
  );
}
