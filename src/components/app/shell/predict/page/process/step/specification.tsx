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

export const SpecificationStep = ({ openAccordionId, toggleAccordion, answerContent, trainData, testData, trainedModel, setTrainedModel }: StepProps) => {
  const t = useTranslations('PredictPage.Process');
  
  const [maxDepth, setMaxDepth] = React.useState<number>(5);
  const [minNumSamples, setMinNumSamples] = React.useState<number>(5);
  const [isTraining, setIsTraining] = React.useState(false);
  const [trainingComplete, setTrainingComplete] = React.useState(false);

  const handleTrain = async () => {
    if (trainData.length === 0) {
      alert("Please select data in the Data Selection step first.");
      return;
    }
    
    setIsTraining(true);
    
    setTimeout(() => {
      try {
        const X = trainData.map(d => {
          const current = parseFloat(d.current) || 0;
          const opTime = d.operationalTime ? parseFloat(d.operationalTime) : 0;
          return [current, opTime];
        });
        
        const y = trainData.map(d => parseFloat(d.power_watt) || 0);

        const options = {
          maxDepth: maxDepth,
          minNumSamples: minNumSamples
        };

        const reg = new DTRegression(options);
        reg.train(X, y);
        
        setTrainedModel(reg);
        setTrainingComplete(true);
        toggleAccordion('3'); // It will go to next step which is Split (now it should probably trigger something else if we want it to go to next step, but manually is fine for now or we can just leave it to expand a dummy accordion, but actually let's just let the user click next)
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
        title={t('steps.specification.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      <AccordionItem 
        id="1" 
        title="Input Features (Attributes)" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-2 text-sm text-body-subtle">
          <p><strong>1. Current (Arus):</strong> Ampere measurements reflecting the load.</p>
          <p><strong>2. Operational Time (Waktu Operasional):</strong> Time elapsed (in hours) affecting temperature and efficiency.</p>
        </div>
      </AccordionItem>
      <AccordionItem 
        id="2" 
        title="Target Variable" 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-2 text-sm text-body-subtle">
          <p><strong>Active Power (Daya Aktif):</strong> The output power in Watts to be predicted by the model.</p>
        </div>
      </AccordionItem>
      <AccordionItem 
        id="3" 
        title="Hyperparameter Configuration" 
        numberSeq={4} 
        isOpen={openAccordionId === '3'} 
        onToggle={() => toggleAccordion('3')}
      >
        <div className="p-4 bg-neutral-secondary-soft border border-border-default rounded flex flex-col gap-4">
          <div className="text-sm text-body-subtle">
            Configure the hyperparameters for the CART Decision Tree model. Adjust the maximum depth and minimum samples per leaf before training.
          </div>
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
