"use client";

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

interface ScatterEChartsProps {
  predictedData: any[];
}

export const ScatterECharts = ({ predictedData }: ScatterEChartsProps) => {
  const { scatterData, lineData, domainLimits } = useMemo(() => {
    if (!predictedData || predictedData.length === 0) {
      return { scatterData: [], lineData: [], domainLimits: [0, 0] };
    }

    let min = Infinity;
    let max = -Infinity;
    
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    const n = predictedData.length;

    const data = predictedData.map(d => {
      const x = parseFloat(d.power_watt) || 0;
      const y = parseFloat(d.predictedPowerWatt) || 0;
      
      if (x < min) min = x;
      if (y < min) min = y;
      if (x > max) max = x;
      if (y > max) max = y;

      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;

      return [x, y];
    });

    const padding = (max - min) * 0.1;
    const limits = [Math.max(0, min - padding), max + padding];

    // Calculate Linear Regression Line
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Line points based on domain limits
    const lineStart = [limits[0], slope * limits[0] + intercept];
    const lineEnd = [limits[1], slope * limits[1] + intercept];

    return { 
      scatterData: data, 
      lineData: [lineStart, lineEnd], 
      domainLimits: limits 
    };
  }, [predictedData]);

  if (scatterData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-body-subtle text-sm">
        Select data first to view the scatter plot.
      </div>
    );
  }

  const option = {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross'
      },
      formatter: (params: any) => {
        if (params.seriesType === 'scatter') {
          return `
            <div style="font-family:sans-serif;font-size:13px;">
              <div style="font-weight:600;margin-bottom:4px;color:#64748b;">Data Point</div>
              <div style="display:flex;justify-content:space-between;gap:12px;">
                <span>Actual:</span>
                <span style="font-weight:600;">${params.value[0].toFixed(2)} W</span>
              </div>
              <div style="display:flex;justify-content:space-between;gap:12px;">
                <span style="color:#3b82f6;">Predicted:</span>
                <span style="font-weight:600;color:#3b82f6;">${params.value[1].toFixed(2)} W</span>
              </div>
            </div>
          `;
        }
        if (params.seriesName === 'Linear Regression' || params.seriesName === 'Ideal Fit (y=x)') {
           return `
            <div style="font-family:sans-serif;font-size:13px;">
              <div style="font-weight:600;margin-bottom:4px;color:${params.color};">${params.seriesName}</div>
              <div style="display:flex;justify-content:space-between;gap:12px;">
                <span>Actual:</span>
                <span style="font-weight:600;">${params.value[0].toFixed(2)} W</span>
              </div>
              <div style="display:flex;justify-content:space-between;gap:12px;">
                <span style="color:${params.color};">Expected:</span>
                <span style="font-weight:600;color:${params.color};">${params.value[1].toFixed(2)} W</span>
              </div>
            </div>
          `;
        }
        return params.name;
      }
    },
    xAxis: {
      name: 'Actual Power (Watt)',
      nameLocation: 'middle',
      nameGap: 30,
      type: 'value',
      min: domainLimits[0].toFixed(2),
      max: domainLimits[1].toFixed(2),
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      name: 'Predicted Power (Watt)',
      nameLocation: 'middle',
      nameGap: 40,
      type: 'value',
      min: domainLimits[0].toFixed(2),
      max: domainLimits[1].toFixed(2),
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'Predictions',
        type: 'scatter',
        data: scatterData,
        itemStyle: {
          color: '#3b82f6',
          opacity: 0.6
        }
      },
      {
        name: 'Linear Regression',
        type: 'line',
        data: lineData,
        showSymbol: false,
        lineStyle: {
          color: '#ef4444',
          width: 2,
          type: 'solid' // Can be dashed if preferred
        }
      },
      {
        name: 'Ideal Fit (y=x)',
        type: 'line',
        data: [
          [domainLimits[0], domainLimits[0]], 
          [domainLimits[1], domainLimits[1]]
        ],
        showSymbol: false,
        lineStyle: {
          color: '#10b981',
          width: 2,
          type: 'dashed'
        }
      }
    ]
  };

  return (
    <div className="w-full h-full">
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};
