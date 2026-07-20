import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/preprocessing/page/table';
import { SortableHeader, ActionCell } from '@/components/app/shell/preprocessing/page/table/columns';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

interface OutlierStepProps {
  data: FirebaseDataRow[];
  setDataFilter: React.Dispatch<React.SetStateAction<FirebaseDataRow[]>>;
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getSelectColumn: () => ColumnDef<FirebaseDataRow>;
  getStandardColumns: () => ColumnDef<FirebaseDataRow>[];
  answerContent: React.ReactNode;
}

export const OutlierStep = ({ data, setDataFilter, openAccordionId, toggleAccordion, getSelectColumn, getStandardColumns, answerContent }: OutlierStepProps) => {
  const t = useTranslations('PreprocessingPage.Process');

  const ExplanationItem = () => (
    <AccordionItem 
      id="0" 
      title={t('explanation')} 
      numberSeq={1} 
      isOpen={openAccordionId === '0'} 
      onToggle={() => toggleAccordion('0')}
    >
      {answerContent}
    </AccordionItem>
  );

  const calcStats = (arr: number[]) => {
    if (arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;
    return { q1, q3, iqr, lower, upper };
  };

  const statsV = calcStats(data.map(d => Number(d.voltage)));
  const statsI = calcStats(data.map(d => Number(d.current)));
  const statsP = calcStats(data.map(d => Number(d.power_watt)));

  const outliers = data.filter(d => {
    const v = Number(d.voltage);
    const i = Number(d.current);
    const p = Number(d.power_watt);
    return (statsV && (v < statsV.lower || v > statsV.upper)) ||
           (statsI && (i < statsI.lower || i > statsI.upper)) ||
           (statsP && (p < statsP.lower || p > statsP.upper));
  });

  const columns: ColumnDef<FirebaseDataRow>[] = [
    getSelectColumn(),
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column} title={t('dataId')} />,
      cell: ({ row }) => <div className="tabular-nums font-medium text-body">{String(row.getValue("id")).substring(0, 8)}...</div>
    },
    {
      accessorKey: "voltage",
      header: ({ column }) => <SortableHeader column={column} title={t('voltage')} />,
      cell: ({ row }) => {
        const v = Number(row.getValue("voltage"));
        const isOut = statsV && (v < statsV.lower || v > statsV.upper);
        return <div className={isOut ? "text-danger font-bold" : "font-medium text-warning"}>{v}</div>;
      }
    },
    {
      accessorKey: "current",
      header: ({ column }) => <SortableHeader column={column} title={t('current')} />,
      cell: ({ row }) => {
        const i = Number(row.getValue("current"));
        const isOut = statsI && (i < statsI.lower || i > statsI.upper);
        return <div className={isOut ? "text-danger font-bold" : "font-medium text-brand"}>{i}</div>;
      }
    },
    {
      accessorKey: "power_watt",
      header: ({ column }) => <SortableHeader column={column} title={t('power')} />,
      cell: ({ row }) => {
        const p = Number(row.getValue("power_watt"));
        const isOut = statsP && (p < statsP.lower || p > statsP.upper);
        return <div className={isOut ? "text-danger font-bold" : "font-medium text-success"}>{p}</div>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell row={row} />
    }
  ];
  
  return (
    <div className="flex flex-col w-full">
      <ExplanationItem />
      <AccordionItem 
        id="1" 
        title={t('calcIqr')} 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: t('voltage'), s: statsV },
            { label: t('current'), s: statsI },
            { label: t('power'), s: statsP }
          ].map(item => (
            <div key={item.label} className="text-sm font-mono text-body-subtle space-y-3 p-4 sm:p-5 bg-neutral-secondary-soft rounded-[12px] border border-border-default overflow-x-auto custom-scrollbar flex flex-col">
              <h4 className="font-semibold text-heading mb-2">{item.label}</h4>
              {item.s ? (
                <>
                  <p>Q₁ = {item.s.q1.toFixed(2)}</p>
                  <p>Q₃ = {item.s.q3.toFixed(2)}</p>
                  <p className="whitespace-nowrap sm:whitespace-normal">IQR = {item.s.q3.toFixed(2)} - {item.s.q1.toFixed(2)} = <span className="text-brand font-bold text-base">{item.s.iqr.toFixed(2)}</span></p>
                  <div className="pt-4 mt-2 border-t border-border-default space-y-3 whitespace-nowrap sm:whitespace-normal">
                    <p>{t('lowerBound')} = {item.s.q1.toFixed(2)} - (1.5 × {item.s.iqr.toFixed(2)}) = <span className="text-danger font-bold text-base">{item.s.lower.toFixed(2)}</span></p>
                    <p>{t('upperBound')} = {item.s.q3.toFixed(2)} + (1.5 × {item.s.iqr.toFixed(2)}) = <span className="text-danger font-bold text-base">{item.s.upper.toFixed(2)}</span></p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-body-subtle">{t('insufficientData')}</p>
              )}
            </div>
          ))}
        </div>
      </AccordionItem>
      
      <AccordionItem 
        id="2" 
        title={t('outlierTableTitle', { count: outliers.length })} 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        <ProcessTable data={outliers} columns={columns} setDataFilter={setDataFilter} editConfig={{ disableTimestamp: true }} />
      </AccordionItem>
      
      <AccordionItem 
        id="3" 
        title={t('currentDataTitle', { count: data.length })} 
        numberSeq={4} 
        isOpen={openAccordionId === '3'} 
        onToggle={() => toggleAccordion('3')}
      >
        <ProcessTable data={data} columns={getStandardColumns()} setDataFilter={setDataFilter} editConfig={{ disableTimestamp: true }} />
      </AccordionItem>
    </div>
  );
};
