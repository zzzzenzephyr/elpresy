import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { Button } from '@/components/ui/button';
import { savePredictData } from '@/script/app/actions/predict';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  testData: any[];
  trainedModel: any;
}

export const ResultStep = ({ openAccordionId, toggleAccordion, answerContent, testData, trainedModel }: StepProps) => {
  const t = useTranslations('PredictPage.Process');
  
  const [isPredicting, setIsPredicting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [predictions, setPredictions] = React.useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handlePredict = () => {
    if (!trainedModel) {
      alert("Please train the model first.");
      return;
    }
    
    setIsPredicting(true);
    
    setTimeout(() => {
      try {
        const X_test = testData.map(d => {
          const current = parseFloat(d.current) || 0;
          const opTime = d.operationalTime ? parseFloat(d.operationalTime) : 0;
          return [current, opTime];
        });
        
        const predictedValues = trainedModel.predict(X_test);
        
        const results = testData.map((d, i) => ({
          ...d,
          predictedPowerWatt: predictedValues[i]
        }));
        
        setPredictions(results);
        toggleAccordion('2');
      } catch (err) {
        console.error(err);
        alert("Prediction failed.");
      } finally {
        setIsPredicting(false);
      }
    }, 100);
  };

  const handleSave = async () => {
    if (predictions.length === 0) return;
    
    setIsSaving(true);
    const res = await savePredictData(predictions);
    if (res.success) {
      setSaveSuccess(true);
    } else {
      alert("Failed to save predictions: " + res.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.result.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      
      <AccordionItem 
        id="1" 
        title="Run Prediction" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex items-center justify-between">
          <span className="text-body text-sm font-medium">Generate predictions on {testData.length} test rows</span>
          <Button variant="default" onClick={handlePredict} disabled={!trainedModel || isPredicting || testData.length === 0}>
            {isPredicting ? "Predicting..." : "Predict Test Data"}
          </Button>
        </div>
      </AccordionItem>

      {predictions.length > 0 && (
        <AccordionItem 
          id="2" 
          title="Generated Predictions" 
          numberSeq={3} 
          isOpen={openAccordionId === '2'} 
          onToggle={() => toggleAccordion('2')}
        >
          <div className="flex flex-col gap-4">
            <div className="text-sm text-body-subtle">
              Predictions generated successfully. Below is a preview of the results:
            </div>
            
            <div className="border border-border-default rounded overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-secondary-soft text-body-subtle sticky top-0">
                  <tr>
                    <th className="px-4 py-2 font-medium">Timestamp</th>
                    <th className="px-4 py-2 font-medium">Actual Power (W)</th>
                    <th className="px-4 py-2 font-medium text-brand">Predicted (W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {predictions.slice(0, 50).map((row, idx) => (
                    <tr key={idx} className="bg-neutral-primary/50 hover:bg-neutral-primary/80 transition-colors">
                      <td className="px-4 py-2 text-body">{new Date(row.timestamp || row.created_at || Date.now()).toLocaleString()}</td>
                      <td className="px-4 py-2 text-body">{row.power_watt}</td>
                      <td className="px-4 py-2 text-brand font-semibold">{Number(row.predictedPowerWatt).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {predictions.length > 50 && (
                <div className="p-2 text-center text-xs text-body-subtle bg-neutral-secondary-soft">
                  Showing first 50 rows.
                </div>
              )}
            </div>
            
            <div className="flex justify-end items-center gap-4 mt-2">
              {saveSuccess && <span className="text-success text-sm font-medium">Saved to database successfully!</span>}
              <Button onClick={handleSave} disabled={isSaving || saveSuccess} size="sm">
                {isSaving ? "Saving..." : t('steps.result.uploadButton')}
              </Button>
            </div>
          </div>
        </AccordionItem>
      )}
    </div>
  );
};
