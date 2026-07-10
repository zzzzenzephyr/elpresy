import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/predict/page/table';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

interface SplitStepProps {
  data: FirebaseDataRow[];
  setDataFilter: React.Dispatch<React.SetStateAction<FirebaseDataRow[]>>;
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getStandardColumns: () => ColumnDef<FirebaseDataRow>[];
  answerContent: React.ReactNode;
}

export const SplitStep = ({ data, setDataFilter, openAccordionId, toggleAccordion, getStandardColumns, answerContent }: SplitStepProps) => {
  const t = useTranslations('PredictPage.Process');

  const ExplanationItem = () => (
    <AccordionItem 
      id="0" 
      title={t('explanation')} 
      numberSeq={1} 
      isOpen={openAccordionId === '0'} 
      onToggle={() => toggleAccordion('0')}
    >
      {answerContent}
    </AccordionItem>
  );

  const total = data.length;
  const trainCount = Math.floor(total * 0.7);
  const trainData = data.slice(0, trainCount);
  const testData = data.slice(trainCount);
  
  return (
    <div className="flex flex-col w-full pb-10">
      <ExplanationItem />
      
      <AccordionItem 
        id="1" 
        title={t('trainSetTitle', { count: trainCount })} 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <ProcessTable data={trainData} columns={getStandardColumns()} setDataFilter={setDataFilter} />
      </AccordionItem>

      <AccordionItem 
        id="2" 
        title={t('testSetTitle', { count: testData.length })} 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        <ProcessTable data={testData} columns={getStandardColumns()} setDataFilter={setDataFilter} />
      </AccordionItem>
    </div>
  );
};
