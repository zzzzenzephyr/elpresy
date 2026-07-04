"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { FirebaseData } from "@/script/app/firebase/types";

const chartConfig = {
  current: {
    label: "Current",
    color: "var(--brand)",
  },
  power: {
    label: "Power Watt",
    color: "var(--success)",
  },
  voltage: {
    label: "Voltage",
    color: "var(--warning)",
  },
};

export function MetricsChart({ data }: { data: FirebaseData }) {
  const currentPercent = Math.min(((data.current || 0) / 5) * 100, 100);
  const powerPercent = Math.min(((data.power_watt || 0) / 100) * 100, 100);
  const voltagePercent = Math.min(((data.voltage || 0) / 300) * 100, 100);

  const chartData = [
    { name: "Voltage", value: voltagePercent, fill: "var(--color-voltage)", raw: data.voltage },
    { name: "Power Watt", value: powerPercent, fill: "var(--color-power)", raw: data.power_watt },
    { name: "Current", value: currentPercent, fill: "var(--color-current)", raw: data.current },
  ];
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
            domain={[0, 100]}
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
