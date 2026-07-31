import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { Button } from '@/components/ui/button';
import { savePredictData } from '@/script/app/actions/predict';
import { RowTable } from '../../row-table';

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
            
            <RowTable 
              data={predictions} 
              headerAction={
                <div className="flex items-center gap-4">
                  {saveSuccess && <span className="text-success text-sm font-medium">Saved to database successfully!</span>}
                  <Button onClick={handleSave} disabled={isSaving || saveSuccess} size="sm">
                    {isSaving ? "Saving..." : t('steps.result.uploadButton')}
                  </Button>
                </div>
              } 
            />
          </div>
        </AccordionItem>
      )}
    </div>
  );
};
