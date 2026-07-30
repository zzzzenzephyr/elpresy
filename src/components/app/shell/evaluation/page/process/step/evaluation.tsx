import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { Button } from '@/components/ui/button';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  predictedData: any[];
  evalMetrics: any;
  setEvalMetrics: (m: any) => void;
}

export const EvaluationStep = ({ openAccordionId, toggleAccordion, answerContent, predictedData, evalMetrics, setEvalMetrics }: StepProps) => {
  const t = useTranslations('EvaluationPage.Process');
  
  const calculateMetrics = () => {
    if (predictedData.length === 0) return;
    
    let sumAbsError = 0;
    let sumSqrError = 0;
    let sumY = 0;
    const n = predictedData.length;
    
    // First pass for MAE, RMSE and sumY
    for (let i = 0; i < n; i++) {
      const yTrue = parseFloat(predictedData[i].powerWatt) || 0;
      const yPred = parseFloat(predictedData[i].predictedPowerWatt) || 0;
      
      const error = yTrue - yPred;
      sumAbsError += Math.abs(error);
      sumSqrError += (error * error);
      sumY += yTrue;
    }
    
    const mae = sumAbsError / n;
    const rmse = Math.sqrt(sumSqrError / n);
    const meanY = sumY / n;
    
    // Second pass for Total Sum of Squares (TSS) for R2
    let tss = 0;
    for (let i = 0; i < n; i++) {
      const yTrue = parseFloat(predictedData[i].powerWatt) || 0;
      tss += Math.pow(yTrue - meanY, 2);
    }
    
    const r2 = 1 - (sumSqrError / (tss || 1));
    
    setEvalMetrics({ mae, rmse, r2, n });
    toggleAccordion('2');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.evaluation.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      
      <AccordionItem 
        id="1" 
        title="Calculate Metrics" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex items-center justify-between">
          <span className="text-body text-sm font-medium">Calculate MAE, RMSE, and R² on predictions</span>
          <Button onClick={calculateMetrics} disabled={predictedData.length === 0}>
            Calculate Metrics
          </Button>
        </div>
      </AccordionItem>

      {evalMetrics && (
        <AccordionItem 
          id="2" 
          title="Evaluation Results" 
          numberSeq={3} 
          isOpen={openAccordionId === '2'} 
          onToggle={() => toggleAccordion('2')}
        >
          <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-primary border border-border-default rounded p-4 flex flex-col items-center justify-center">
                <span className="text-body-subtle text-xs font-semibold uppercase tracking-wider mb-2">Mean Absolute Error (MAE)</span>
                <span className="text-2xl font-bold text-heading">{evalMetrics.mae.toFixed(4)} W</span>
              </div>
              <div className="bg-neutral-primary border border-border-default rounded p-4 flex flex-col items-center justify-center">
                <span className="text-body-subtle text-xs font-semibold uppercase tracking-wider mb-2">Root Mean Sq Error (RMSE)</span>
                <span className="text-2xl font-bold text-heading">{evalMetrics.rmse.toFixed(4)} W</span>
              </div>
              <div className="bg-neutral-primary border border-border-default rounded p-4 flex flex-col items-center justify-center">
                <span className="text-body-subtle text-xs font-semibold uppercase tracking-wider mb-2">R-Squared (R²)</span>
                <span className={`text-2xl font-bold ${evalMetrics.r2 >= 0.75 ? 'text-success' : 'text-danger'}`}>
                  {evalMetrics.r2.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </AccordionItem>
      )}
    </div>
  );
};
