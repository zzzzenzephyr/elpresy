import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/predict/page/table';
import { SortableHeader, ActionCell } from '@/components/app/shell/predict/page/table/columns';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

interface OutlierStepProps {
  data: FirebaseDataRow[];
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getSelectColumn: () => ColumnDef<FirebaseDataRow>;
  answerContent: React.ReactNode;
}

export const OutlierStep = ({ data, openAccordionId, toggleAccordion, getSelectColumn, answerContent }: OutlierStepProps) => {
  const t = useTranslations('PredictPage.Process');

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
      {[
        { label: t('calcIqrV'), s: statsV, seq: 2, key: '1' },
        { label: t('calcIqrI'), s: statsI, seq: 3, key: '2' },
        { label: t('calcIqrP'), s: statsP, seq: 4, key: '3' }
      ].map(item => (
        <AccordionItem 
          key={item.key} 
          id={item.key} 
          title={item.label} 
          numberSeq={item.seq} 
          isOpen={openAccordionId === item.key} 
          onToggle={() => toggleAccordion(item.key)}
        >
           {item.s ? (
             <div className="text-sm font-mono text-body-subtle space-y-3 p-4 sm:p-5 bg-neutral-secondary-soft rounded-[12px] border border-border-default overflow-x-auto custom-scrollbar">
               <p>Q₁ = {item.s.q1.toFixed(2)}</p>
               <p>Q₃ = {item.s.q3.toFixed(2)}</p>
               <p className="whitespace-nowrap sm:whitespace-normal">IQR = {item.s.q3.toFixed(2)} - {item.s.q1.toFixed(2)} = <span className="text-brand font-bold text-base">{item.s.iqr.toFixed(2)}</span></p>
               <div className="pt-4 mt-2 border-t border-border-default space-y-3 whitespace-nowrap sm:whitespace-normal">
                 <p>{t('lowerBound')} = {item.s.q1.toFixed(2)} - (1.5 × {item.s.iqr.toFixed(2)}) = <span className="text-danger font-bold text-base">{item.s.lower.toFixed(2)}</span></p>
                 <p>{t('upperBound')} = {item.s.q3.toFixed(2)} + (1.5 × {item.s.iqr.toFixed(2)}) = <span className="text-danger font-bold text-base">{item.s.upper.toFixed(2)}</span></p>
               </div>
             </div>
           ) : (
             <p className="text-sm text-body-subtle">{t('insufficientData')}</p>
           )}
        </AccordionItem>
      ))}
      
      <AccordionItem 
        id="4" 
        title={t('outlierTableTitle', { count: outliers.length })} 
        numberSeq={5} 
        isOpen={openAccordionId === '4'} 
        onToggle={() => toggleAccordion('4')}
      >
        <ProcessTable data={outliers} columns={columns} />
      </AccordionItem>
    </div>
  );
};
