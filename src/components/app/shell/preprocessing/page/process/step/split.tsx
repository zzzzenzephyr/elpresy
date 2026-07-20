import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/preprocessing/page/table';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { savePreprocessData } from '@/script/app/actions/preprocess';

interface SplitStepProps {
  data: FirebaseDataRow[];
  setDataFilter: React.Dispatch<React.SetStateAction<FirebaseDataRow[]>>;
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getStandardColumns: () => ColumnDef<FirebaseDataRow>[];
  answerContent: React.ReactNode;
}

export const SplitStep = ({ data, setDataFilter, openAccordionId, toggleAccordion, getStandardColumns, answerContent }: SplitStepProps) => {
  const t = useTranslations('PreprocessingPage.Process');
  const [isPending, startTransition] = React.useTransition();

  const handleSave = () => {
    if (!data || data.length === 0) {
      toast.error('No data to save');
      return;
    }
    
    startTransition(async () => {
      const result = await savePreprocessData(data);
      if (result.success) {
        toast.success('Data saved successfully to preprocess table');
      } else {
        toast.error(result.error || 'Failed to save data');
      }
    });
  };

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
        <ProcessTable data={trainData} columns={getStandardColumns()} setDataFilter={setDataFilter} editConfig={{ disableTimestamp: true }} />
      </AccordionItem>

      <AccordionItem 
        id="2" 
        title={t('testSetTitle', { count: testData.length })} 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        <ProcessTable data={testData} columns={getStandardColumns()} setDataFilter={setDataFilter} editConfig={{ disableTimestamp: true }} />
      </AccordionItem>
      
      <AccordionItem 
        id="3" 
        title={t('currentDataTitle', { count: data.length })} 
        numberSeq={4} 
        isOpen={openAccordionId === '3'} 
        onToggle={() => toggleAccordion('3')}
      >
        <ProcessTable data={data} columns={getStandardColumns()} setDataFilter={setDataFilter} editConfig={{ disableTimestamp: true }} />
      </AccordionItem>

      <AccordionItem
        id="4"
        title="Upload Data"
        numberSeq={5}
        isOpen={openAccordionId === '4'}
        onToggle={() => toggleAccordion('4')}
      >
        <div className="p-4 flex flex-col items-start gap-4">
          <p className="text-body-subtle text-sm">
            Save the final processed data filter state into the database for future reference.
          </p>
          <Button onClick={handleSave} disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Upload to Preprocess
          </Button>
        </div>
      </AccordionItem>
    </div>
  );
};
