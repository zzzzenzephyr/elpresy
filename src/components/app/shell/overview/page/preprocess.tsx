"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function Sparkline({ title, color, data, labels, unit }: { title: string, color: string, data: number[], labels: string[], unit: string }) {
  const { theme } = useTheme();
  
  const option = {
    tooltip: { 
      trigger: 'axis',
      formatter: `{b}<br />{a}: {c} ${unit}`
    },
    grid: { left: '2%', right: '2%', bottom: '5%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: labels,
      show: true
    },
    yAxis: {
      type: 'value',
      show: true,
      min: 'dataMin',
      max: 'dataMax'
    },
    series: [
      {
        name: title,
        type: 'line',
        smooth: true,
        data: data,
        symbol: 'none',
        lineStyle: {
          color: color,
          width: 2
        },
        areaStyle: {
          color: color,
          opacity: 0.15
        }
      }
    ]
  };

  return (
    <div className="bg-neutral-primary border border-border-default rounded-xl p-4 shadow-xs flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-body-subtle text-sm font-medium">{title}</h4>
        <span className="text-lg font-bold text-heading" style={{ color }}>
          {data[data.length - 1]?.toFixed(2) || 0} <span className="text-xs font-normal text-body-subtle">{unit}</span>
        </span>
      </div>
      <ReactECharts option={option} style={{ height: '140px', width: '100%' }} />
    </div>
  );
}

export function PreprocessChart({ data }: { data: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="w-full mb-6">
      <h3 className="text-heading text-lg font-medium mb-4">Real-time Electrical Data</h3>
      <div className="flex flex-col gap-4">
        <div className="h-[160px] w-full animate-pulse bg-neutral-primary-soft rounded-xl" />
        <div className="h-[160px] w-full animate-pulse bg-neutral-primary-soft rounded-xl" />
        <div className="h-[160px] w-full animate-pulse bg-neutral-primary-soft rounded-xl" />
      </div>
    </div>
  );

  const labels = data.map(d => {
    const date = new Date(d.createdAt || d.createdat);
    return isNaN(date.getTime()) ? d.createdAt : date.toLocaleTimeString();
  });

  const voltageData = data.map(d => d.voltage);
  const currentData = data.map(d => d.current);
  const powerData = data.map(d => d.power_watt);

  return (
    <div className="w-full mb-2">
      <h3 className="text-heading text-lg font-medium mb-4">Real-time Electrical Data</h3>
      <div className="flex flex-col gap-4">
        <Sparkline title="Voltage" color="#f59e0b" data={voltageData} labels={labels} unit="V" />
        <Sparkline title="Current" color="#0ea5e9" data={currentData} labels={labels} unit="A" />
        <Sparkline title="Power" color="#10b981" data={powerData} labels={labels} unit="W" />
      </div>
    </div>
  );
}
