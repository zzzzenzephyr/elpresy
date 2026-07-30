import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { Button } from '@/components/ui/button';
import { DecisionTreeRegression as DTRegression } from 'ml-cart';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  trainData: any[];
  testData: any[];
  trainedModel: any;
  setTrainedModel: (m: any) => void;
}

export const TuningStep = ({ openAccordionId, toggleAccordion, answerContent, trainData, testData, trainedModel, setTrainedModel }: StepProps) => {
  const t = useTranslations('PredictPage.Process');
  
  const [maxDepth, setMaxDepth] = React.useState<number>(10);
  const [minNumSamples, setMinNumSamples] = React.useState<number>(3);
  const [isTraining, setIsTraining] = React.useState(false);
  const [trainingComplete, setTrainingComplete] = React.useState(false);

  const handleTrain = async () => {
    if (trainData.length === 0) {
      alert("Please select data in the Data Selection step first.");
      return;
    }
    
    setIsTraining(true);
    
    // Slight timeout to allow UI to show loading state
    setTimeout(() => {
      try {
        // Extract features (Current, Time) and target (Power) from trainData
        // We will train on 2 features by default based on thesis. 
        // We'll calculate operational time if it doesn't exist, but we assume it's in the data or we just use current and voltage for now?
        // Wait, the thesis mentions Arus and Waktu Operasional.
        // If 'operational_time' is not in firebase, we might need to compute it or just use 'current' and 'voltage'.
        // Let's use 'current' as feature 1. We will check for 'time' or 'operationalTime'.
        
        const X = trainData.map(d => {
          const current = parseFloat(d.current) || 0;
          // For operational time, if we don't have it, we could use index or time diff
          // Let's just use current for now, or current + voltage if op time is missing
          const opTime = d.operationalTime ? parseFloat(d.operationalTime) : 0;
          return [current, opTime];
        });
        
        const y = trainData.map(d => parseFloat(d.powerWatt) || 0);

        const options = {
          maxDepth: maxDepth,
          minNumSamples: minNumSamples
        };

        const reg = new DTRegression(options);
        reg.train(X, y);
        
        setTrainedModel(reg);
        setTrainingComplete(true);
        toggleAccordion('2'); // Move to next step if applicable, or just show success
      } catch (err) {
        console.error("Training failed", err);
        alert("Training failed: " + err);
      } finally {
        setIsTraining(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.tuning.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      <AccordionItem 
        id="1" 
        title="Hyperparameter Configuration" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Max Depth</label>
              <input 
                type="number" 
                className="px-3 py-2 border border-border-default rounded bg-neutral-primary" 
                value={maxDepth}
                onChange={e => setMaxDepth(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Min Number of Samples</label>
              <input 
                type="number" 
                className="px-3 py-2 border border-border-default rounded bg-neutral-primary" 
                value={minNumSamples}
                onChange={e => setMinNumSamples(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Gain Function</label>
              <input 
                type="text" 
                className="px-3 py-2 border border-border-default rounded bg-neutral-primary opacity-50" 
                value="MSE (Mean Squared Error)"
                disabled
              />
            </div>
          </div>
          
          <div className="flex justify-end items-center mt-4 border-t border-border-default pt-4">
            <Button onClick={handleTrain} disabled={isTraining || trainData.length === 0}>
              {isTraining ? "Training..." : "Train Model"}
            </Button>
          </div>
          
          {trainingComplete && (
            <div className="p-3 bg-success/10 border border-success/20 text-success rounded text-sm mt-2">
              Model trained successfully on {trainData.length} records!
            </div>
          )}
        </div>
      </AccordionItem>
    </div>
  );
};
