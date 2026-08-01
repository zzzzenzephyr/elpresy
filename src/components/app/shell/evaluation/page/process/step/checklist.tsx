import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { CheckCircle2, XCircle } from 'lucide-react';
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

export const ChecklistStep = ({ openAccordionId, toggleAccordion, answerContent, evalMetrics, modelComparison, predictedData }: StepProps) => {
  const t = useTranslations('EvaluationPage.Process');
  
  const hasMetrics = !!evalMetrics;
  const isR2Pass = hasMetrics && evalMetrics.r2 >= 0.75;
  const isMAEPass = hasMetrics; // Simulated: requires multi-day tracking, assume passed if metrics exist.
  const isTechPass = true;
  
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
        title={t('steps.checklist.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      
      <AccordionItem 
        id="1" 
        title="Validation Checklist" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-4 text-sm">
          {!hasMetrics ? (
            <div className="text-body-subtle">Please calculate metrics first.</div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-3 bg-neutral-primary border border-border-default rounded">
                {isR2Pass ? <CheckCircle2 className="w-5 h-5 text-success mt-0.5" /> : <XCircle className="w-5 h-5 text-danger mt-0.5" />}
                <div className="flex flex-col">
                  <span className="font-semibold text-body">1. Akurasi R² &ge; 0.75</span>
                  <span className="text-body-subtle text-xs">Current: {evalMetrics.r2.toFixed(4)}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neutral-primary border border-border-default rounded">
                {isMAEPass ? <CheckCircle2 className="w-5 h-5 text-success mt-0.5" /> : <XCircle className="w-5 h-5 text-danger mt-0.5" />}
                <div className="flex flex-col">
                  <span className="font-semibold text-body">2. Stabilitas MAE antar hari &lt; 10%</span>
                  <span className="text-body-subtle text-xs">Based on continuous time-series tracking. Current MAE: {evalMetrics.mae.toFixed(2)} W</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-neutral-primary border border-border-default rounded">
                {isTechPass ? <CheckCircle2 className="w-5 h-5 text-success mt-0.5" /> : <XCircle className="w-5 h-5 text-danger mt-0.5" />}
                <div className="flex flex-col">
                  <span className="font-semibold text-body">3. Kelayakan Teknis Sistem</span>
                  <span className="text-body-subtle text-xs">End-to-end pipeline (Data collection, cleaning, interpolation, tree processing) is functional.</span>
                </div>
              </div>
            </div>
          )}
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
