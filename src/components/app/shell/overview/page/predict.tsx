"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function PredictChart({ data }: { data: any[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[350px] w-full animate-pulse bg-neutral-primary-soft rounded-xl" />;

  const formatTime = (d: any) => {
    const date = new Date(d.createdAt || d.createdat);
    return isNaN(date.getTime()) ? d.createdAt : date.toLocaleTimeString();
  };

  const timeData = data.map(formatTime);

  const allValues = [
    ...data.map(d => Number(d.power_watt)),
    ...data.map(d => Number(d.predictedPowerWatt))
  ].filter(v => !isNaN(v));

  const minVal = allValues.length ? Math.min(...allValues) : 0;
  const maxVal = allValues.length ? Math.max(...allValues) : 2000;

  const yMin = Math.max(0, Math.floor(minVal * 0.85));
  const yMax = Math.ceil(maxVal * 1.15);

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: {
      data: ['Actual Power (W)', 'Predicted Power (W)'],
      textStyle: { color: theme === 'dark' ? '#9CA3AF' : '#4B5563' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeData,
      axisLabel: { color: theme === 'dark' ? '#9CA3AF' : '#4B5563' }
    },
    yAxis: {
      type: 'value',
      min: yMin,
      max: yMax,
      axisLabel: { formatter: '{value} W', color: theme === 'dark' ? '#9CA3AF' : '#4B5563' },
      axisPointer: { snap: true },
      splitLine: { lineStyle: { color: theme === 'dark' ? '#374151' : '#E5E7EB' } }
    },
    visualMap: {
      show: false,
      dimension: 0,
      seriesIndex: 0,
      pieces: [
        { lte: Math.max(1, Math.floor(data.length * 0.3)), color: '#10b981' },
        { gt: Math.max(1, Math.floor(data.length * 0.3)), lte: Math.max(2, Math.floor(data.length * 0.7)), color: '#ef4444' },
        { gt: Math.max(2, Math.floor(data.length * 0.7)), color: '#10b981' }
      ]
    },
    series: [
      { 
        name: 'Actual Power (W)', 
        type: 'line', 
        smooth: true,
        data: data.map(d => d.power_watt), 
        symbol: 'none',
        markArea: {
          itemStyle: { color: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' },
          data: [
            [
              { name: 'Peak', xAxis: timeData[Math.floor(data.length * 0.3)] || '' },
              { xAxis: timeData[Math.floor(data.length * 0.7)] || '' }
            ]
          ]
        }
      },
      { 
        name: 'Predicted Power (W)', 
        type: 'line', 
        smooth: true,
        data: data.map(d => Number(Number(d.predictedPowerWatt).toFixed(2))),  
        color: '#A855F7', 
        symbol: 'none' 
      }
    ]
  };

  return (
    <div className="bg-neutral-primary border border-border-default rounded-xl p-4 shadow-xs">
      <h3 className="text-heading text-lg font-medium mb-4">Distribution of Electricity</h3>
      <ReactECharts option={option} style={{ height: '350px', width: '100%' }} />
    </div>
  );
}
