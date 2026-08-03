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

  const createOption = (title: string, dataF1: number, dataF2: number, isR2: boolean) => {
    let d1 = isR2 ? dataF1 * 100 : dataF1;
    let d2 = isR2 ? dataF2 * 100 : dataF2;
    
    d1 = Number(d1.toFixed(2));
    d2 = Number(d2.toFixed(2));

    return {
      tooltip: { 
        trigger: 'axis', 
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          return `${params[0].axisValue}<br/>` + params.map((p: any) => `${p.marker} ${p.seriesName}: <b>${p.value}${isR2 ? '%' : ''}</b>`).join('<br/>');
        }
      },
      legend: {
        bottom: 0,
        data: ['1-Feature', '2-Feature'],
        textStyle: { color: theme === 'dark' ? '#9CA3AF' : '#4B5563', fontSize: 10 },
        itemWidth: 10,
        itemHeight: 10
      },
      grid: { left: '18%', right: '5%', bottom: '20%', top: '15%' },
      xAxis: {
        type: 'category',
        data: [title],
        axisLabel: { color: theme === 'dark' ? '#E5E7EB' : '#1F2937', fontWeight: 'bold' },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        max: isR2 ? 100 : undefined,
        axisLabel: { color: theme === 'dark' ? '#9CA3AF' : '#4B5563', fontSize: 10 },
        splitLine: { lineStyle: { color: theme === 'dark' ? '#374151' : '#E5E7EB' } }
      },
      series: [
        {
          name: '1-Feature',
          type: 'bar',
          data: [d1],
          color: '#0ea5e9',
          label: { show: true, position: 'top', color: theme === 'dark' ? '#9CA3AF' : '#4B5563', formatter: isR2 ? '{c}%' : '{c}' }
        },
        {
          name: '2-Feature',
          type: 'bar',
          data: [d2],
          color: '#A855F7',
          label: { show: true, position: 'top', color: theme === 'dark' ? '#9CA3AF' : '#4B5563', formatter: isR2 ? '{c}%' : '{c}' }
        }
      ]
    };
  };

  const optionR2 = createOption('R² Score', f1.r2, f2.r2, true);
  const optionMAE = createOption('MAE', f1.mae, f2.mae, false);
  const optionRMSE = createOption('RMSE', f1.rmse, f2.rmse, false);

  return (
    <div className="bg-neutral-primary border border-border-default rounded-xl p-4 shadow-xs">
      <h3 className="text-heading text-lg font-medium mb-4">Model Evaluation Comparison</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-secondary-soft rounded-lg border border-border-default pt-2">
          <ReactECharts option={optionR2} style={{ height: '280px', width: '100%' }} />
        </div>
        <div className="bg-neutral-secondary-soft rounded-lg border border-border-default pt-2">
          <ReactECharts option={optionMAE} style={{ height: '280px', width: '100%' }} />
        </div>
        <div className="bg-neutral-secondary-soft rounded-lg border border-border-default pt-2">
          <ReactECharts option={optionRMSE} style={{ height: '280px', width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
