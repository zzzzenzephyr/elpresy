import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { Button } from '@/components/ui/button';
import { fetchPreprocessDataList, fetchPreprocessDataById } from '@/script/app/actions/predict';
import { PredictTable } from '../../table';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  data: any[];
  trainData: any[];
  setTrainData: (d: any[]) => void;
  testData: any[];
  setTestData: (d: any[]) => void;
}

export const SelectionStep = ({ openAccordionId, toggleAccordion, answerContent, data, trainData, setTrainData, testData, setTestData }: StepProps) => {
  const t = useTranslations('PredictPage.Process');
  const [dataList, setDataList] = React.useState<any[]>([]);
  const [loadingList, setLoadingList] = React.useState(true);
  
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [loadingData, setLoadingData] = React.useState(false);

  React.useEffect(() => {
    async function loadList() {
      setLoadingList(true);
      const res = await fetchPreprocessDataList();
      if (res.success && res.data) {
        setDataList(res.data);
      }
      setLoadingList(false);
    }
    loadList();
  }, []);

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    setLoadingData(true);
    const res = await fetchPreprocessDataById(id);
    if (res.success && res.data) {
      // Split 70:30 time-based (chronological)
      // Assuming data is already sorted by time (chronological).
      const allData = res.data;
      const splitIndex = Math.floor(allData.length * 0.7);
      
      const train = allData.slice(0, splitIndex);
      const test = allData.slice(splitIndex);
      
      setTrainData(train);
      setTestData(test);
      
      // Auto-open next accordion
      toggleAccordion('2');
    }
    setLoadingData(false);
  };
  
  return (
    <div className="flex flex-col w-full pb-10">
      <AccordionItem 
        id="0" 
        title={t('steps.selection.question')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {answerContent}
      </AccordionItem>
      <AccordionItem 
        id="1" 
        title="List of Preprocessed Data" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="flex flex-col gap-4">
          {loadingList ? (
            <div className="text-sm text-body-subtle">Loading data list...</div>
          ) : dataList.length === 0 ? (
            <div className="text-sm text-body-subtle">No preprocessed data found.</div>
          ) : (
            <div className="border border-border-default rounded overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-secondary-soft text-body-subtle">
                  <tr>
                    <th className="px-4 py-2 font-medium">ID</th>
                    <th className="px-4 py-2 font-medium">Created At</th>
                    <th className="px-4 py-2 font-medium w-[100px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {dataList.map((item) => (
                    <tr key={item.id} className="bg-neutral-primary hover:bg-neutral-primary/80 transition-colors">
                      <td className="px-4 py-3 text-body truncate max-w-[200px]" title={item.id}>{item.id}</td>
                      <td className="px-4 py-3 text-body">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <Button 
                          variant={selectedId === item.id ? "default" : "outline"} 
                          size="sm"
                          onClick={() => handleSelect(item.id)}
                          disabled={loadingData}
                        >
                          {selectedId === item.id ? "Selected" : "Select"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AccordionItem>
      <AccordionItem 
        id="2" 
        title="Training & Testing Data Split (70:30)" 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        {loadingData ? (
          <div className="text-sm text-body-subtle">Loading and splitting data...</div>
        ) : trainData.length > 0 ? (
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-2">Training Data (70% - {trainData.length} rows)</h3>
              <div className="border border-border-default rounded overflow-hidden max-h-[400px] overflow-y-auto">
                <PredictTable data={trainData} />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Testing Data (30% - {testData.length} rows)</h3>
              <div className="border border-border-default rounded overflow-hidden max-h-[400px] overflow-y-auto">
                <PredictTable data={testData} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-body-subtle">Please select data from the list above.</div>
        )}
      </AccordionItem>
    </div>
  );
};
