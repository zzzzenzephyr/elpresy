import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { PredictTable } from '../../table';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  data: any[];
}

export const SpecificationStep = ({ openAccordionId, toggleAccordion, answerContent, data }: StepProps) => {
  const t = useTranslations('PredictPage.Process');
  
  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.specification.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      <AccordionItem 
        id="1" 
        title="Input Features (Attributes)" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-2 text-sm text-body-subtle">
          <p><strong>1. Current (Arus):</strong> Ampere measurements reflecting the load.</p>
          <p><strong>2. Operational Time (Waktu Operasional):</strong> Time elapsed (in hours) affecting temperature and efficiency.</p>
        </div>
      </AccordionItem>
      <AccordionItem 
        id="2" 
        title="Target Variable" 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-2 text-sm text-body-subtle">
          <p><strong>Active Power (Daya Aktif):</strong> The output power in Watts to be predicted by the model.</p>
        </div>
      </AccordionItem>
    </div>
  );
};
