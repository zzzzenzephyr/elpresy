import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/predict/page/table';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

interface ErrorAccordionProps {
  idKey: string;
  seq: number;
  name: string;
  sensor: number;
  std: number;
  rowId: string;
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
}

const ErrorAccordion = ({
  idKey,
  seq,
  name,
  sensor,
  std,
  rowId,
  openAccordionId,
  toggleAccordion
}: ErrorAccordionProps) => {
  const t = useTranslations('PredictPage.Process');
  const step1 = `Error(%) = |(${sensor} - ${std}) / ${std}| × 100%`;
  const diff = (sensor - std).toFixed(4);
  const step2 = `Error(%) = |(${diff}) / ${std}| × 100%`;
  const div = Math.abs(Number(diff) / std).toFixed(6);
  const step3 = `Error(%) = |${div}| × 100%`;
  const result = (Number(div) * 100).toFixed(2);
  const step4 = `Error(%) = ${result}%`;
  
  return (
      <AccordionItem 
        id={idKey} 
        title={t('simError', { name })} 
        numberSeq={seq} 
        isOpen={openAccordionId === idKey} 
        onToggle={() => toggleAccordion(idKey)}
      >
         <div className="text-sm font-mono text-body-subtle space-y-3 p-4 sm:p-5 bg-neutral-secondary-soft rounded-[12px] border border-border-default overflow-x-auto custom-scrollbar">
           <p>{t('usingRowId')}: {rowId.substring(0,8)}...</p>
           <p>{t('sensorValue')}: {sensor}</p>
           <p>{t('stdValue')}: {std}</p>
           <div className="pt-4 mt-2 border-t border-border-default space-y-2 whitespace-nowrap sm:whitespace-normal">
             <p>{step1}</p>
             <p>{step2}</p>
             <p>{step3}</p>
             <p className="text-brand font-bold text-base mt-2">{step4}</p>
           </div>
         </div>
      </AccordionItem>
  );
};

interface GroundStepProps {
  data: FirebaseDataRow[];
  setDataFilter: React.Dispatch<React.SetStateAction<FirebaseDataRow[]>>;
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getStandardColumns: () => ColumnDef<FirebaseDataRow>[];
  answerContent: React.ReactNode;
}

export const GroundStep = ({ data, setDataFilter, openAccordionId, toggleAccordion, getStandardColumns, answerContent }: GroundStepProps) => {
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

  const stdV = 220;
  const stdP = 1810;
  const stdI = 9.975;
  
  const r = data[0]; // Example row
  if (!r) return null;

  return (
    <div className="flex flex-col w-full pb-10">
      <ExplanationItem />
      <ErrorAccordion
        idKey="1"
        seq={2}
        name={t('voltage')}
        sensor={Number(r.voltage)}
        std={stdV}
        rowId={r.id}
        openAccordionId={openAccordionId}
        toggleAccordion={toggleAccordion}
      />
      <ErrorAccordion
        idKey="2"
        seq={3}
        name={t('current')}
        sensor={Number(r.current)}
        std={stdI}
        rowId={r.id}
        openAccordionId={openAccordionId}
        toggleAccordion={toggleAccordion}
      />
      <ErrorAccordion
        idKey="3"
        seq={4}
        name={t('power')}
        sensor={Number(r.power_watt)}
        std={stdP}
        rowId={r.id}
        openAccordionId={openAccordionId}
        toggleAccordion={toggleAccordion}
      />
      <AccordionItem 
        id="4" 
        title={t('currentDataTitle', { count: data.length })} 
        numberSeq={5} 
        isOpen={openAccordionId === '4'} 
        onToggle={() => toggleAccordion('4')}
      >
        <ProcessTable data={data} columns={getStandardColumns()} setDataFilter={setDataFilter} />
      </AccordionItem>
    </div>
  );
};
