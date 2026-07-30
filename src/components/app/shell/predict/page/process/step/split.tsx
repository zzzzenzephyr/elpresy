import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  trainedModel: any;
}

export const SplitStep = ({ openAccordionId, toggleAccordion, answerContent, trainedModel }: StepProps) => {
  const t = useTranslations('PredictPage.Process');
  
  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.split.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      <AccordionItem 
        id="1" 
        title="Recursive Splitting (Model Tree Output)" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        {trainedModel ? (
          <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex items-start text-sm text-body overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
            <pre className="font-mono whitespace-pre-wrap text-xs">
              {JSON.stringify(trainedModel.toJSON(), null, 2)}
            </pre>
          </div>
        ) : (
          <div className="h-32 bg-neutral-secondary-soft border border-dashed border-border-default rounded flex items-center justify-center text-body-subtle text-sm">
            Please train the model in the previous step to see the split tree.
          </div>
        )}
      </AccordionItem>
    </div>
  );
};
