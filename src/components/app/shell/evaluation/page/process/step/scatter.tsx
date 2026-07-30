import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  predictedData: any[];
}

export const ScatterStep = ({ openAccordionId, toggleAccordion, answerContent, predictedData }: StepProps) => {
  const t = useTranslations('EvaluationPage.Process');
  
  // Prepare data for recharts
  const scatterData = React.useMemo(() => {
    return predictedData.map(d => ({
      x: parseFloat(d.powerWatt) || 0, // Actual
      y: parseFloat(d.predictedPowerWatt) || 0 // Predicted
    }));
  }, [predictedData]);

  // Find min and max for the ideal fit line
  const domainLimits = React.useMemo(() => {
    if (scatterData.length === 0) return [0, 0];
    let min = Math.min(scatterData[0].x, scatterData[0].y);
    let max = Math.max(scatterData[0].x, scatterData[0].y);
    
    for (let i = 1; i < scatterData.length; i++) {
      if (scatterData[i].x < min) min = scatterData[i].x;
      if (scatterData[i].y < min) min = scatterData[i].y;
      if (scatterData[i].x > max) max = scatterData[i].x;
      if (scatterData[i].y > max) max = scatterData[i].y;
    }
    
    // add 10% padding
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [scatterData]);

  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.scatter.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      
      <AccordionItem 
        id="1" 
        title="Actual vs Predicted Visualization" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-4 h-[500px]">
          {scatterData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Actual Power" 
                  unit=" W" 
                  domain={domainLimits}
                  label={{ value: 'Actual Power (Watt)', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Predicted Power" 
                  unit=" W" 
                  domain={domainLimits}
                  label={{ value: 'Predicted Power (Watt)', angle: -90, position: 'left' }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Predictions" data={scatterData} fill="#3b82f6" opacity={0.6} />
                {/* Ideal fit line y = x */}
                <ReferenceLine 
                  segment={[{ x: domainLimits[0], y: domainLimits[0] }, { x: domainLimits[1], y: domainLimits[1] }]} 
                  stroke="#ef4444" 
                  strokeDasharray="3 3"
                />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center text-body-subtle text-sm">
              Select data first to view the scatter plot.
            </div>
          )}
        </div>
      </AccordionItem>
    </div>
  );
};
