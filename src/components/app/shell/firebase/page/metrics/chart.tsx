"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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

export function MetricsChart() {
  return (
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
  );
}
