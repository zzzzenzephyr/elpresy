import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/predict/page/table';
import { SortableHeader, ActionCell } from '@/components/app/shell/predict/page/table/columns';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

interface TimeStepProps {
  data: FirebaseDataRow[];
  setDataFilter: React.Dispatch<React.SetStateAction<FirebaseDataRow[]>>;
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getSelectColumn: () => ColumnDef<FirebaseDataRow>;
  answerContent: React.ReactNode;
}

export const TimeStep = ({ data, setDataFilter, openAccordionId, toggleAccordion, getSelectColumn, answerContent }: TimeStepProps) => {
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

  let anomalyRows: Set<number> = new Set();
  let affectedRows: Set<number> = new Set();
  
  for (let i = 1; i < data.length; i++) {
     const prev = Number(data[i-1].last_updated);
     const curr = Number(data[i].last_updated);
     if (curr <= prev) {
       anomalyRows.add(i);
       affectedRows.add(i-1);
       affectedRows.add(i+1);
     }
  }

  const columns: ColumnDef<FirebaseDataRow>[] = [
    getSelectColumn(),
    {
      id: "indeks",
      accessorFn: (_, idx) => idx,
      header: ({ column }) => <SortableHeader column={column} title={t('index')} />,
      cell: ({ row }) => <div className="tabular-nums font-medium text-body">{row.getValue("indeks") as number}</div>
    },
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column} title={t('dataId')} />,
      cell: ({ row }) => <div className="tabular-nums text-body">{String(row.getValue("id")).substring(0, 8)}...</div>
    },
    {
      accessorKey: "last_updated",
      header: ({ column }) => <SortableHeader column={column} title={t('timestamp')} />,
      cell: ({ row }) => <div className="text-body-subtle tabular-nums">{row.getValue("last_updated")}</div>
    },
    {
      id: "status",
      accessorFn: (row, idx) => {
        if (anomalyRows.has(idx)) return t('anomalyStatus');
        if (affectedRows.has(idx) && !anomalyRows.has(idx)) return t('affectedStatus');
        return t('normal');
      },
      header: ({ column }) => <SortableHeader column={column} title={t('status')} />,
      cell: ({ row }) => {
        const val = row.getValue("status") as string;
        if (val === t('anomalyStatus')) return <span className="text-danger font-bold">{val}</span>;
        if (val === t('affectedStatus')) return <span className="text-brand font-medium">{val}</span>;
        return <span className="text-body">{val}</span>;
      }
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell row={row} />
    }
  ];
  
  return (
    <div className="flex flex-col w-full pb-10">
      <ExplanationItem />
      <AccordionItem 
        id="1" 
        title={t('timeCheckTableTitle')} 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <ProcessTable data={data} columns={columns} />
      </AccordionItem>
    </div>
  );
};
