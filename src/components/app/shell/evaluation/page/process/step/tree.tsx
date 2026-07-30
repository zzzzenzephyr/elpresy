import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { Button } from '@/components/ui/button';
import { saveEvaluationData } from '@/script/app/actions/evaluation';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  evalMetrics: any;
  modelComparison: any;
  predictedData: any[];
}

export const TreeStep = ({ openAccordionId, toggleAccordion, answerContent, evalMetrics, modelComparison, predictedData }: StepProps) => {
  const t = useTranslations('EvaluationPage.Process');
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = async () => {
    if (!evalMetrics || predictedData.length === 0) return;
    
    setIsSaving(true);
    const evalPayload = {
      metrics: evalMetrics,
      comparison: modelComparison,
      testDataSize: predictedData.length
    };
    
    const res = await saveEvaluationData(evalPayload);
    if (res.success) {
      setSaveSuccess(true);
    } else {
      alert("Failed to save evaluation data: " + res.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.tree.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      
      <AccordionItem 
        id="1" 
        title="Decision Tree Structure" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex items-center justify-center text-body-subtle text-sm min-h-[150px]">
          The detailed node-by-node splitting structure can be reviewed in the 'Recursive Splitting' step of the Predict page.
        </div>
      </AccordionItem>

      <AccordionItem 
        id="2" 
        title="Save Evaluation Results" 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-4">
          <div className="text-sm text-body-subtle">
            Save the computed Evaluation Metrics and Model Comparison results to the database for final reporting.
          </div>

          <div className="flex justify-end items-center mt-2 border-t border-border-default pt-4 gap-4">
            {saveSuccess && <span className="text-success text-sm font-medium">Saved to evaluation table successfully!</span>}
            <Button onClick={handleSave} disabled={isSaving || saveSuccess || !evalMetrics}>
              {isSaving ? "Saving..." : t('steps.tree.uploadButton')}
            </Button>
          </div>
        </div>
      </AccordionItem>
    </div>
  );
};
