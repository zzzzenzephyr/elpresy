import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
}

export const TuningStep = ({ openAccordionId, toggleAccordion, answerContent }: StepProps) => {
  const t = useTranslations('PredictPage.Process');
  
  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.tuning.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      <AccordionItem 
        id="1" 
        title="Parameters Form (Placeholder)" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="h-32 bg-neutral-secondary-soft border border-dashed border-border-default rounded flex items-center justify-center text-body-subtle">
          Hyperparameter UI Placeholder
        </div>
      </AccordionItem>
    </div>
  );
};
