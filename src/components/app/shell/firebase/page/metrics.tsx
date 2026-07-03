"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { name: "Desktop", value: 450, fill: "var(--color-desktop)" },
  { name: "Mobile", value: 320, fill: "var(--color-mobile)" },
  { name: "Tablet", value: 180, fill: "var(--color-tablet)" },
  { name: "Other", value: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--brand, 221 83% 53%))", // Fallback if --brand is missing
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--brand, 221 83% 53%) / 0.8)",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(var(--brand, 221 83% 53%) / 0.6)",
  },
  other: {
    label: "Other",
    color: "hsl(var(--brand, 221 83% 53%) / 0.4)",
  },
};

const metricCells = [
  { label: "Website visits", value: "163.4M", delta: "+1.45%", isPositive: true },
  { label: "Monthly revenue", value: "$768k", delta: "+5.12%", isPositive: true },
  { label: "Active users", value: "6,567", delta: "-2.10%", isPositive: false },
  { label: "Bounce rate", value: "42.3%", delta: "+1.15%", isPositive: false }, // typically higher bounce rate is bad, but keeping simple semantic
  { label: "Conversion rate", value: "3.2%", delta: "+0.8%", isPositive: true },
  { label: "Avg. session length", value: "4m 12s", delta: "-0.5%", isPositive: false },
];

export function MetricsWidget() {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="w-[1024px] bg-neutral-primary border border-border-default rounded-xl p-6 shadow-sm flex flex-col gap-6">
        
        {/* Header row */}
        <div className="flex items-start justify-between">
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
        <div className="flex gap-8">
          
          {/* Left side: Metric grid */}
          <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-px bg-border-default border border-border-default rounded-lg overflow-hidden">
            {metricCells.map((cell, idx) => (
              <div key={idx} className="bg-neutral-primary p-4 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-body-subtle">{cell.label}</span>
                  <span 
                    className={cn(
                      "text-xs font-medium flex items-center gap-0.5",
                      cell.isPositive ? "text-fg-success-strong" : "text-fg-danger-strong"
                    )}
                  >
                    {cell.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {cell.delta}
                  </span>
                </div>
                <span className="tabular-nums text-2xl font-bold text-heading">{cell.value}</span>
              </div>
            ))}
          </div>

          {/* Right side: Chart */}
          <div className="w-[320px] shrink-0 flex items-center justify-center">
            <ChartContainer config={chartConfig} className="w-full h-full min-h-[200px]">
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
        <div className="flex items-center justify-between border-t border-border-default pt-6 mt-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-border-default rounded-md text-sm font-medium text-body hover:bg-neutral-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Last 7 days
            <ChevronDown className="w-4 h-4 text-body-subtle" />
          </button>
          
          <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-brand hover:text-brand-strong hover:underline transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            View full report
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
