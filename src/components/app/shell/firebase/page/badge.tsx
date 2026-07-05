"use client";

import { useMemo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useFirebaseData } from "@/components/app/shell/firebase/page/provider";
import type { FirebaseDataRow } from "@/components/app/shell/firebase/page/table/columns";

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

export function TrendBadgesGrid({ data }: { data: FirebaseDataRow[] }) {
  const t = useTranslations("FirebaseMonitoring");
  const { data: realtimeData } = useFirebaseData();

  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return { avgCurrent: 0, avgVoltage: 0, avgPower: 0, avgTimeDiff: 0 };
    }

    let sumCurrent = 0;
    let sumVoltage = 0;
    let sumPower = 0;

    data.forEach(row => {
      sumCurrent += Number(row.current) || 0;
      sumVoltage += Number(row.voltage) || 0;
      sumPower += Number(row.power_watt) || 0;
    });

    const avgCurrent = sumCurrent / data.length;
    const avgVoltage = sumVoltage / data.length;
    const avgPower = sumPower / data.length;

    let timeDiffSum = 0;
    let timeDiffCount = 0;

    // Data is sorted by date desc by default in the DB, so we sort it locally to ensure proper calculation
    const sortedByTime = [...data].sort((a, b) => Number(b.last_updated) - Number(a.last_updated));

    for (let i = 0; i < sortedByTime.length - 1; i++) {
      const diff = Number(sortedByTime[i].last_updated) - Number(sortedByTime[i+1].last_updated);
      if (!isNaN(diff) && diff >= 0) {
        timeDiffSum += diff;
        timeDiffCount++;
      }
    }

    const avgTimeDiff = timeDiffCount > 0 ? timeDiffSum / timeDiffCount : 0;

    return { avgCurrent, avgVoltage, avgPower, avgTimeDiff };
  }, [data]);

  // Calculate percentages
  // formula: ((realtime - average) / average) * 100
  const calcPct = (realtime: number, avg: number) => {
    if (!avg || isNaN(avg) || avg === 0) return 0;
    return ((realtime - avg) / avg) * 100;
  };

  const rtCurrent = realtimeData?.current || 0;
  const rtVoltage = realtimeData?.voltage || 0;
  const rtPower = realtimeData?.power_watt || 0;
  const rtLastUpdated = realtimeData?.last_updated || 0;

  // Realtime time diff is (Realtime Last Updated - Latest DB Last Updated)
  const latestDbTime = data && data.length > 0 ? Math.max(...data.map(d => Number(d.last_updated) || 0)) : 0;
  // If no realtime data or no db data, we assume 0 difference
  const rtTimeDiff = (rtLastUpdated > 0 && latestDbTime > 0) ? Math.max(0, rtLastUpdated - latestDbTime) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <TrendBadge
        value={stats.avgCurrent.toFixed(2)}
        label={t("avgCurrent")}
        percentage={calcPct(rtCurrent, stats.avgCurrent)}
        comparisonText={t("vsRealtime")}
      />
      <TrendBadge
        value={stats.avgVoltage.toFixed(2)}
        label={t("avgVoltage")}
        percentage={calcPct(rtVoltage, stats.avgVoltage)}
        comparisonText={t("vsRealtime")}
      />
      <TrendBadge
        value={stats.avgPower.toFixed(2)}
        label={t("avgPower")}
        percentage={calcPct(rtPower, stats.avgPower)}
        comparisonText={t("vsRealtime")}
      />
      <TrendBadge
        value={`~${stats.avgTimeDiff.toFixed(0)}s`}
        label={t("avgUpdateFreq")}
        percentage={calcPct(rtTimeDiff, stats.avgTimeDiff)}
        comparisonText={t("vsRealtime")}
      />
    </div>
  );
}
