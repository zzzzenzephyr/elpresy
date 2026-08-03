"use client";

import React from 'react';
import ReactECharts from 'echarts-for-react';

interface TreeEChartsProps {
  modelNode: any;
}

// Convert ml-cart node to echarts tree node format
function convertToEchartsTree(node: any, edgePath?: string): any {
  if (!node) return {};
  
  const isLeaf = !node.left && !node.right;
  let labelText = edgePath ? `(${edgePath})\n` : '';
  
  const samplesText = node.numberSamples !== undefined ? `\nSamples: ${node.numberSamples}` : '';
  
  if (isLeaf) {
    return {
      name: `${labelText}Pred:\n${node.distribution !== undefined ? Number(node.distribution).toFixed(2) : '?'} W${samplesText}`,
      value: node.distribution,
      itemStyle: {
        color: '#10b981', // brand success color for leaves
        borderColor: '#047857'
      }
    };
  }

  const featureName = node.splitColumn === 0 ? 'Current (A)' : node.splitColumn === 1 ? 'Time (m)' : `Feat ${node.splitColumn}`;
  
  const children = [];
  // For standard decision trees: Left is usually True (Yes), Right is False (No)
  if (node.left) children.push(convertToEchartsTree(node.left, 'Left'));
  if (node.right) children.push(convertToEchartsTree(node.right, 'Right'));
  
  const gainText = node.gain !== undefined ? `\nGain: ${Number(node.gain).toFixed(2)}` : '';

  return {
    name: `${labelText}${featureName} < ${Number(node.splitValue).toFixed(3)}${gainText}${samplesText}`,
    children,
    itemStyle: {
      color: '#3b82f6', // neutral primary for splits
      borderColor: '#2563eb'
    }
  };
}

export const TreeECharts = ({ modelNode }: TreeEChartsProps) => {
  const treeData = convertToEchartsTree(modelNode);

  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [treeData],
        top: '10%',
        left: '5%',
        bottom: '10%',
        right: '5%',
        layout: 'orthogonal',
        orient: 'TB',
        roam: true,
        symbolSize: 10,
        edgeShape: 'polyline',
        edgeForkPosition: '50%',
        initialTreeDepth: -1,
        lineStyle: {
          color: '#cbd5e1', // border-default
          width: 2
        },
        label: {
          position: 'top',
          verticalAlign: 'middle',
          align: 'center',
          fontSize: 12,
          fontFamily: 'monospace',
          backgroundColor: '#fff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderRadius: 4,
          padding: [4, 6],
          lineHeight: 16
        },
        leaves: {
          label: {
            position: 'bottom',
            verticalAlign: 'middle',
            align: 'center'
          }
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  };

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar">
      <div style={{ minWidth: '1500px', height: '600px' }}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
};
