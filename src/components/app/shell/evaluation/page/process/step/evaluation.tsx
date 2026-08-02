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

    let n = predictedData.length;
    let sumAbsError = 0;
    let sumSqError = 0;
    let sumActual = 0;

    // 1. Calculate MAE, MSE, and the mean of actual values
    for (let i = 0; i < n; i++) {
      let actual = parseFloat(predictedData[i].power_watt) || 0;
      let predicted = parseFloat(predictedData[i].predictedPowerWatt) || 0;
      
      let error = actual - predicted;
      sumAbsError += Math.abs(error);
      sumSqError += error * error;
      sumActual += actual;
    }

    let mae = sumAbsError / n;
    let mse = sumSqError / n;
    let rmse = Math.sqrt(mse);
    let meanActual = sumActual / n;

    // 2. Calculate R-squared (R2)
    let totalSumOfSquares = 0; // Variance in the actual data
    for (let i = 0; i < n; i++) {
      let actual = parseFloat(predictedData[i].power_watt) || 0;
      totalSumOfSquares += Math.pow(actual - meanActual, 2);
    }

    // R2 = 1 - (Residual Sum of Squares / Total Sum of Squares)
    let r2 = totalSumOfSquares === 0 ? 1 : 1 - (sumSqError / totalSumOfSquares);
    
    setEvalMetrics({ mae, rmse, r2, n, meanY: meanActual });
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-primary border border-border-default rounded p-4 flex flex-col items-center justify-center text-center">
                <span className="text-body-subtle text-xs font-semibold uppercase tracking-wider mb-2">Avg Actual Power<br/>(Testing Data 30%)</span>
                <span className="text-2xl font-bold text-heading">{evalMetrics.meanY.toFixed(2)} W</span>
              </div>
              <div className="bg-neutral-primary border border-border-default rounded p-4 flex flex-col items-center justify-center text-center">
                <span className="text-body-subtle text-xs font-semibold uppercase tracking-wider mb-2">Mean Absolute Error (MAE)</span>
                <span className="text-2xl font-bold text-heading">{evalMetrics.mae.toFixed(2)} W</span>
              </div>
              <div className="bg-neutral-primary border border-border-default rounded p-4 flex flex-col items-center justify-center text-center">
                <span className="text-body-subtle text-xs font-semibold uppercase tracking-wider mb-2">Root Mean Sq Error (RMSE)</span>
                <span className="text-2xl font-bold text-heading">{evalMetrics.rmse.toFixed(2)} W</span>
              </div>
              <div className="bg-neutral-primary border border-border-default rounded p-4 flex flex-col items-center justify-center text-center">
                <span className="text-body-subtle text-xs font-semibold uppercase tracking-wider mb-2">R-Squared (R²)</span>
                <span className={`text-2xl font-bold ${evalMetrics.r2 >= 0.75 ? 'text-success' : 'text-danger'}`}>
                  {evalMetrics.r2.toFixed(5)}
                </span>
              </div>
            </div>
          </div>
        </AccordionItem>
      )}
    </div>
  );
};
