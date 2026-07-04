import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { MetricCell } from "@/script/app/firebase/types";

export function MetricsGrid({ cells }: { cells: MetricCell[] }) {
  const t = useTranslations("FirebaseMonitoring");

  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border-default border border-border-default rounded-lg overflow-hidden">
      {cells.map((cell, idx) => (
        <div key={idx} className="bg-neutral-primary p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-body-subtle">{t(cell.label)}</span>
            <span 
              className={cn(
                "text-xs font-medium flex items-center gap-0.5",
                cell.text === "-" ? "text-body-subtle" : cell.isPositive ? "text-fg-success-strong" : "text-fg-danger-strong"
              )}
            >
              {cell.text !== "-" && (cell.isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              ))}
              {cell.text}
            </span>
          </div>
          <span className="tabular-nums text-2xl font-bold text-heading">{String(cell.value)}</span>
        </div>
      ))}
    </div>
  );
}
