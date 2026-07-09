import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/predict/page/table';
import { SortableHeader, ActionCell } from '@/components/app/shell/predict/page/table/columns';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

interface SanityStepProps {
  data: FirebaseDataRow[];
  setDataFilter: React.Dispatch<React.SetStateAction<FirebaseDataRow[]>>;
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getSelectColumn: () => ColumnDef<FirebaseDataRow>;
  answerContent: React.ReactNode;
}

export const SanityStep = ({ data, setDataFilter, openAccordionId, toggleAccordion, getSelectColumn, answerContent }: SanityStepProps) => {
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

  const zeroData = data.filter(d => Number(d.power_watt) <= 0 || Number(d.current) <= 0 || Number(d.voltage) <= 0);
  
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
        return <div className={v <= 0 ? "text-danger font-bold" : "font-medium text-warning"}>{v}</div>;
      }
    },
    {
      accessorKey: "current",
      header: ({ column }) => <SortableHeader column={column} title={t('current')} />,
      cell: ({ row }) => {
        const i = Number(row.getValue("current"));
        return <div className={i <= 0 ? "text-danger font-bold" : "font-medium text-brand"}>{i}</div>;
      }
    },
    {
      accessorKey: "power_watt",
      header: ({ column }) => <SortableHeader column={column} title={t('power')} />,
      cell: ({ row }) => {
        const p = Number(row.getValue("power_watt"));
        return <div className={p <= 0 ? "text-danger font-bold" : "font-medium text-success"}>{p}</div>;
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
        title={t('illogicalTableTitle')} 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        <ProcessTable data={zeroData} columns={columns} />
      </AccordionItem>
    </div>
  );
};
