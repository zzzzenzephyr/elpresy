import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { ScatterECharts } from './scatter-echarts';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  predictedData: any[];
}

export const ScatterStep = ({ openAccordionId, toggleAccordion, answerContent, predictedData }: StepProps) => {
  const t = useTranslations('EvaluationPage.Process');
  
  // Data processing is now handled inside ScatterECharts component

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
          <ScatterECharts predictedData={predictedData} />
        </div>
      </AccordionItem>
    </div>
  );
};
