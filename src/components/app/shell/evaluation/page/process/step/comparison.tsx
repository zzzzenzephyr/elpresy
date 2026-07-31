import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { Button } from '@/components/ui/button';
import { DecisionTreeRegression as DTRegression } from 'ml-cart';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  predictedData: any[];
  evalMetrics: any; // Contains 2-feature metrics
  modelComparison: any;
  setModelComparison: (m: any) => void;
}

export const ComparisonStep = ({ openAccordionId, toggleAccordion, answerContent, predictedData, evalMetrics, modelComparison, setModelComparison }: StepProps) => {
  const t = useTranslations('EvaluationPage.Process');
  
  const [isRunning, setIsRunning] = React.useState(false);

  const runComparison = () => {
    if (predictedData.length === 0 || !evalMetrics) {
      alert("Please calculate the initial metrics first.");
      return;
    }

    setIsRunning(true);
    setTimeout(() => {
      try {
        // Train 1-feature model (Current only) using the test dataset for demonstration purposes
        const X1 = predictedData.map(d => [parseFloat(d.current) || 0]);
        const y = predictedData.map(d => parseFloat(d.power_watt) || 0);

        const reg1 = new DTRegression({ maxDepth: 10, minNumSamples: 3 });
        reg1.train(X1, y);
        const yPred1 = reg1.predict(X1);

        // Calculate metrics for 1-feature
        let sumAbsError = 0;
        let sumSqrError = 0;
        let sumY = 0;
        const n = y.length;

        for (let i = 0; i < n; i++) {
          const error = y[i] - yPred1[i];
          sumAbsError += Math.abs(error);
          sumSqrError += (error * error);
          sumY += y[i];
        }

        const mae1 = sumAbsError / n;
        const rmse1 = Math.sqrt(sumSqrError / n);
        const meanY = sumY / n;

        let tss = 0;
        for (let i = 0; i < n; i++) {
          tss += Math.pow(y[i] - meanY, 2);
        }
        
        const r21 = 1 - (sumSqrError / (tss || 1));

        setModelComparison({
          feature1: {
            name: "1-Feature (Arus)",
            mae: mae1,
            rmse: rmse1,
            r2: r21
          },
          feature2: {
            name: "2-Feature (Arus + Waktu)",
            mae: evalMetrics.mae,
            rmse: evalMetrics.rmse,
            r2: evalMetrics.r2
          }
        });
        
        toggleAccordion('2');
      } catch (err) {
        console.error(err);
        alert("Comparison failed");
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.comparison.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      
      <AccordionItem 
        id="1" 
        title="Run Feature Comparison" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex items-center justify-between">
          <span className="text-body text-sm font-medium">Compare 1-Feature vs 2-Feature model performance</span>
          <Button onClick={runComparison} disabled={isRunning || predictedData.length === 0 || !evalMetrics}>
            {isRunning ? "Running..." : "Run Comparison"}
          </Button>
        </div>
      </AccordionItem>

      {modelComparison && (
        <AccordionItem 
          id="2" 
          title="Comparison Results" 
          numberSeq={3} 
          isOpen={openAccordionId === '2'} 
          onToggle={() => toggleAccordion('2')}
        >
          <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-6 text-sm">
            
            <table className="w-full text-left border border-border-default">
              <thead className="bg-neutral-primary text-body-subtle">
                <tr>
                  <th className="p-3 border-b border-border-default">Metric</th>
                  <th className="p-3 border-b border-border-default">{modelComparison.feature1.name}</th>
                  <th className="p-3 border-b border-border-default text-brand">{modelComparison.feature2.name}</th>
                  <th className="p-3 border-b border-border-default">Improvement</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-default">
                  <td className="p-3 font-medium">R-Squared (R²)</td>
                  <td className="p-3">{modelComparison.feature1.r2.toFixed(4)}</td>
                  <td className="p-3 font-semibold text-brand">{modelComparison.feature2.r2.toFixed(4)}</td>
                  <td className={`p-3 font-medium ${modelComparison.feature2.r2 >= modelComparison.feature1.r2 ? 'text-success' : 'text-danger'}`}>
                    {(modelComparison.feature2.r2 - modelComparison.feature1.r2) > 0 ? '+' : ''}
                    {(modelComparison.feature2.r2 - modelComparison.feature1.r2).toFixed(4)}
                  </td>
                </tr>
                <tr className="border-b border-border-default">
                  <td className="p-3 font-medium">MAE</td>
                  <td className="p-3">{modelComparison.feature1.mae.toFixed(4)}</td>
                  <td className="p-3 font-semibold text-brand">{modelComparison.feature2.mae.toFixed(4)}</td>
                  <td className={`p-3 font-medium ${modelComparison.feature2.mae <= modelComparison.feature1.mae ? 'text-success' : 'text-danger'}`}>
                    {(modelComparison.feature1.mae - modelComparison.feature2.mae) > 0 ? '+' : ''}
                    {(modelComparison.feature1.mae - modelComparison.feature2.mae).toFixed(4)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">RMSE</td>
                  <td className="p-3">{modelComparison.feature1.rmse.toFixed(4)}</td>
                  <td className="p-3 font-semibold text-brand">{modelComparison.feature2.rmse.toFixed(4)}</td>
                  <td className={`p-3 font-medium ${modelComparison.feature2.rmse <= modelComparison.feature1.rmse ? 'text-success' : 'text-danger'}`}>
                    {(modelComparison.feature1.rmse - modelComparison.feature2.rmse) > 0 ? '+' : ''}
                    {(modelComparison.feature1.rmse - modelComparison.feature2.rmse).toFixed(4)}
                  </td>
                </tr>
              </tbody>
            </table>


          </div>
        </AccordionItem>
      )}
    </div>
  );
};
