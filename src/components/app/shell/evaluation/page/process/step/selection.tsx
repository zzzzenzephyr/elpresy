import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AccordionItem } from '../accordion';
import { Button } from '@/components/ui/button';
import { fetchPredictDataList, fetchPredictDataById } from '@/script/app/actions/evaluation';

interface StepProps {
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  answerContent: React.ReactNode;
  predictedData: any[];
  setPredictedData: (d: any[]) => void;
}

export const SelectionStep = ({ openAccordionId, toggleAccordion, answerContent, predictedData, setPredictedData }: StepProps) => {
  const t = useTranslations('EvaluationPage.Process');
  const [dataList, setDataList] = React.useState<any[]>([]);
  const [loadingList, setLoadingList] = React.useState(true);
  
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [loadingData, setLoadingData] = React.useState(false);

  React.useEffect(() => {
    async function loadList() {
      setLoadingList(true);
      const res = await fetchPredictDataList();
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
    const res = await fetchPredictDataById(id);
    if (res.success && res.data) {
      setPredictedData(res.data);
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
        title="List of Predicted Data" 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="flex flex-col gap-4">
          {loadingList ? (
            <div className="text-sm text-body-subtle">Loading data list...</div>
          ) : dataList.length === 0 ? (
            <div className="text-sm text-body-subtle">No predicted data found. Train and save a model first in the Predict page.</div>
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
        title="Preview Selected Predictions" 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        {loadingData ? (
          <div className="text-sm text-body-subtle">Loading data...</div>
        ) : predictedData.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold mb-2">Total Rows: {predictedData.length}</h3>
            <div className="border border-border-default rounded overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-secondary-soft text-body-subtle sticky top-0">
                  <tr>
                    <th className="px-4 py-2 font-medium">Current (A)</th>
                    <th className="px-4 py-2 font-medium">Actual Power (W)</th>
                    <th className="px-4 py-2 font-medium text-brand">Predicted (W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {predictedData.slice(0, 50).map((row, idx) => (
                    <tr key={idx} className="bg-neutral-primary/50">
                      <td className="px-4 py-2 text-body">{row.current}</td>
                      <td className="px-4 py-2 text-body">{row.power_watt || row.powerWatt}</td>
                      <td className="px-4 py-2 text-brand font-semibold">{Number(row.predictedPowerWatt).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {predictedData.length > 50 && (
                <div className="p-2 text-center text-xs text-body-subtle bg-neutral-secondary-soft">
                  Showing first 50 rows.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-body-subtle">Please select data from the list above.</div>
        )}
      </AccordionItem>
    </div>
  );
};
