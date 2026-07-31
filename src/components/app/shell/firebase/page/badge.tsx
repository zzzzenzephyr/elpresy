"use client";

import { useMemo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useFirebaseData } from "@/components/app/shell/firebase/page/provider";
import type { FirebaseDataRow } from "@/components/app/shell/firebase/page/table/columns";
import { 
  calculateTrendStats, 
  calculateRealtimeTimeDiff,
  calcPct,
  getRealtimeDateString,
  extractRealtimeValue,
  type TrendContext
} from "@/script/app/firebase/metrics";

interface TrendBadgeProps {
  value: string | number;
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
          {isPositive ? "+" : ""}{percentage.toFixed(1)}% {comparisonText}
        </span>
      </div>
    </div>
  );
}

function useTrendMetrics(data: FirebaseDataRow[], realtimeData: any) {
  const rtDateString = getRealtimeDateString(realtimeData?.last_updated);
  const rtLastUpdated = extractRealtimeValue(realtimeData?.last_updated);

  const context: TrendContext = useMemo(() => ({
    rtDateString,
    rtLastUpdated
  }), [rtDateString, rtLastUpdated]);

  const stats = useMemo(() => calculateTrendStats(data, context), [data, context]);

  const rtCurrent = extractRealtimeValue(realtimeData?.current);
  const rtVoltage = extractRealtimeValue(realtimeData?.voltage);
  const rtPower = extractRealtimeValue(realtimeData?.power_watt);

  const rtTimeDiff = calculateRealtimeTimeDiff(context, data);

  return {
    avgCurrent: stats.avgCurrent,
    avgVoltage: stats.avgVoltage,
    avgPower: stats.avgPower,
    avgTimeDiff: stats.overallAvgTimeDiff,
    pctCurrent: calcPct({ realtime: rtCurrent, avg: stats.avgCurrent }),
    pctVoltage: calcPct({ realtime: rtVoltage, avg: stats.avgVoltage }),
    pctPower: calcPct({ realtime: rtPower, avg: stats.avgPower }),
    pctTimeDiff: calcPct({ realtime: stats.avgTimeDiff, avg: stats.overallAvgTimeDiff })
  };
}

export function TrendBadgesGrid({ data = [] }: { data: FirebaseDataRow[] }) {
  const t = useTranslations("FirebaseMonitoring");
  const { data: realtimeData } = useFirebaseData();
  const metrics = useTrendMetrics(data, realtimeData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <TrendBadge
        value={metrics.avgCurrent.toFixed(2)}
        label={t("avgCurrent")}
        percentage={metrics.pctCurrent}
        comparisonText={t("vsRealtime")}
      />
      <TrendBadge
        value={metrics.avgVoltage.toFixed(2)}
        label={t("avgVoltage")}
        percentage={metrics.pctVoltage}
        comparisonText={t("vsRealtime")}
      />
      <TrendBadge
        value={metrics.avgPower.toFixed(2)}
        label={t("avgPower")}
        percentage={metrics.pctPower}
        comparisonText={t("vsRealtime")}
      />
      <TrendBadge
        value={`~${(metrics.avgTimeDiff / 1000).toFixed(1)}s`}
        label={t("avgUpdateFreq")}
        percentage={metrics.pctTimeDiff}
        comparisonText={t("vsTodayAvg", { fallback: "vs today's avg" })}
      />
    </div>
  );
}

