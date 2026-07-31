"use client";

import ReactECharts from "echarts-for-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function EvaluationChart({ data }: { data: any }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[350px] w-full animate-pulse bg-neutral-primary-soft rounded-xl" />;

  // data contains { comparison: { feature1: { r2, mae, rmse, name }, feature2: { r2, mae, rmse, name } } }
  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch(e) {}
  }

  const comp = parsedData?.comparison || {};
  const f1 = comp.feature1 || { r2: 0, mae: 0, rmse: 0 };
  const f2 = comp.feature2 || { r2: 0, mae: 0, rmse: 0 };

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['1-Feature (Arus)', '2-Feature (Arus + Waktu)'],
      textStyle: { color: theme === 'dark' ? '#9CA3AF' : '#4B5563' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['R² Score', 'MAE', 'RMSE'],
      axisLabel: { color: theme === 'dark' ? '#9CA3AF' : '#4B5563' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: theme === 'dark' ? '#9CA3AF' : '#4B5563' },
      splitLine: { lineStyle: { color: theme === 'dark' ? '#374151' : '#E5E7EB' } }
    },
    series: [
      {
        name: '1-Feature (Arus)',
        type: 'bar',
        data: [f1.r2, f1.mae, f1.rmse],
        color: '#0ea5e9'
      },
      {
        name: '2-Feature (Arus + Waktu)',
        type: 'bar',
        data: [f2.r2, f2.mae, f2.rmse],
        color: '#A855F7'
      }
    ]
  };

  return (
    <div className="bg-neutral-primary border border-border-default rounded-xl p-4 shadow-xs">
      <h3 className="text-heading text-lg font-medium mb-4">Model Evaluation Comparison</h3>
      <ReactECharts option={option} style={{ height: '350px', width: '100%' }} />
    </div>
  );
}
