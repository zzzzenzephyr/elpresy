"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useFirebaseData } from "@/components/app/shell/firebase/page/provider";
import { useEffect, useState } from "react";

interface FirebaseData {
  current?: number;
  power_watt?: number;
  voltage?: number;
  energy_kwh?: number;
  last_updated?: number;
}

const defaultFirebaseData: FirebaseData = {
    "current": 0,
    "energy_kwh": 0,
    "last_updated": 0,
    "power_watt": 0,
    "voltage": 0,
}

const chartData = [
  { name: "Desktop", value: 450, fill: "var(--color-desktop)" },
  { name: "Mobile", value: 320, fill: "var(--color-mobile)" },
  { name: "Tablet", value: 180, fill: "var(--color-tablet)" },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-brand)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-success)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--color-warning)",
  },
};

// Dynamic metric cells will be generated inside the component

export function MetricsWidget() {
  const { data, error } = useFirebaseData();
  const [realtimeData, setRealtimeData] = useState(defaultFirebaseData);
  const [pastData, setPastData] = useState(defaultFirebaseData);

  useEffect(() => {
    if (data) {
      setPastData(realtimeData);
      setRealtimeData(data);

      console.group(Date.now())
      console.log("MetricsWidget received data:", data);
      console.table(pastData);
      console.table(realtimeData);
      console.groupEnd()
    }
  }, [data]);

  const safeDelta = (curr: number | undefined, past: number | undefined) => {
    if (curr == null || past == null || past === 0) return { text: "-", isPositive: true };
    const diff = curr - past;
    const percent = (diff / past) * 100;
    
    // If the difference rounds to 0.00%, show "-"
    if (Math.abs(percent) < 0.005) {
      return { text: "-", isPositive: true };
    }
    
    return {
      text: `${diff > 0 ? "+" : ""}${percent.toFixed(2)}%`,
      isPositive: diff > 0,
    };
  };

  const dynamicMetricCells = [
    {
      label: "Current",
      value: realtimeData?.current != null ? `${realtimeData.current} A` : "-",
      ...safeDelta(realtimeData?.current, pastData?.current),
    },
    {
      label: "Power Watt",
      value: realtimeData?.power_watt != null ? `${realtimeData.power_watt} W` : "-",
      ...safeDelta(realtimeData?.power_watt, pastData?.power_watt),
    },
    {
      label: "Voltage",
      value: realtimeData?.voltage != null ? `${realtimeData.voltage} V` : "-",
      ...safeDelta(realtimeData?.voltage, pastData?.voltage),
    },
    {
      label: "Energy kWh",
      value: realtimeData?.energy_kwh != null ? `${realtimeData.energy_kwh} kWh` : "-",
      ...safeDelta(realtimeData?.energy_kwh, pastData?.energy_kwh),
    },
    {
      label: "Date",
      value: realtimeData?.last_updated ? new Date(realtimeData.last_updated * 1000).toLocaleDateString() : "-",
      text: "-",
      isPositive: true,
    },
    {
      label: "Time",
      value: realtimeData?.last_updated ? new Date(realtimeData.last_updated * 1000).toLocaleTimeString() : "-",
      text: "-",
      isPositive: true,
    },
  ];

  return (
    <div className="w-full pb-4">
      <div className="w-full bg-neutral-primary border border-border-default rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
        
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-heading">Website performance</h2>
              <span className="flex items-center gap-1 bg-success-soft text-fg-success-strong border border-border-success-subtle text-xs font-medium px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3" />
                10%
              </span>
            </div>
            <p className="text-sm text-body-subtle">Last month website stats</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-border-default rounded-md text-sm font-medium text-body hover:bg-neutral-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
            flowbite.com
            <ChevronDown className="w-4 h-4 text-body-subtle" />
          </button>
        </div>

        {/* Split body */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left side: Metric grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border-default border border-border-default rounded-lg overflow-hidden">
            {dynamicMetricCells.map((cell, idx) => (
              <div key={idx} className="bg-neutral-primary p-4 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-body-subtle">{cell.label}</span>
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

          {/* Right side: Chart */}
          <div className="w-full lg:w-[320px] shrink-0 flex items-center justify-center">
            <ChartContainer config={chartConfig} className="w-full h-full min-h-[250px]">
              <RadialBarChart 
                data={chartData} 
                innerRadius={40} 
                outerRadius={110} 
                barSize={12}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 500]}
                  angleAxisId={0}
                  tick={false}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <RadialBar
                  background={{ fill: 'var(--color-neutral-secondary)' }}
                  dataKey="value"
                  cornerRadius={9999}
                />
              </RadialBarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border-default pt-6 mt-2">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-border-default rounded-md text-sm font-medium text-body hover:bg-neutral-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Last 7 days
            <ChevronDown className="w-4 h-4 text-body-subtle" />
          </button>
          
          <button className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1 px-3 py-2 text-sm font-medium text-brand hover:text-brand-strong hover:underline transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            View full report
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
