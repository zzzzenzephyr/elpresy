import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/predict/page/table';
import { SortableHeader, ActionCell } from '@/components/app/shell/predict/page/table/columns';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

interface MissingStepProps {
  data: FirebaseDataRow[];
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getSelectColumn: () => ColumnDef<FirebaseDataRow>;
  answerContent: React.ReactNode;
}

export const MissingStep = ({ data, openAccordionId, toggleAccordion, getSelectColumn, answerContent }: MissingStepProps) => {
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

  let smallGaps = 0;
  let largeGaps = 0;
  const sorted = [...data].sort((a, b) => Number(a.last_updated) - Number(b.last_updated));
  
  let sampleGap: any = null;
  const gapRows = [];
  for (let i = 0; i < sorted.length; i++) {
    const diff = i === 0 ? 0 : Number(sorted[i].last_updated) - Number(sorted[i-1].last_updated);
    gapRows.push({ ...sorted[i], diff });
    if (diff > 60) {
      if (diff > 1800) largeGaps++;
      else {
        smallGaps++;
        if (!sampleGap) sampleGap = { prev: sorted[i-1], curr: sorted[i], diff };
      }
    }
  }
  
  const columns: ColumnDef<FirebaseDataRow>[] = [
    getSelectColumn(),
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column} title={t('dataId')} />,
      cell: ({ row }) => <div className="tabular-nums font-medium text-body">{String(row.getValue("id")).substring(0, 8)}...</div>
    },
    {
      accessorKey: "last_updated",
      header: ({ column }) => <SortableHeader column={column} title={t('timestamp')} />,
      cell: ({ row }) => <div className="text-body-subtle tabular-nums">{row.getValue("last_updated")}</div>
    },
    {
      accessorKey: "diff",
      header: ({ column }) => <SortableHeader column={column} title={t('gapDuration')} />,
      cell: ({ row }) => {
        const diff = Number(row.getValue("diff"));
        const isLarge = diff > 1800;
        const isSmall = diff > 60 && !isLarge;
        return <div className={`font-bold tabular-nums ${isLarge ? 'text-danger' : isSmall ? 'text-warning' : 'text-success'}`}>{diff}</div>;
      }
    },
    {
      id: "keterangan",
      accessorFn: (row) => row.diff > 1800 ? t('gapLarge') : row.diff > 60 ? t('gapSmall') : t('normal'),
      header: ({ column }) => <SortableHeader column={column} title={t('description')} />,
      cell: ({ row }) => <div className="text-body">{row.getValue("keterangan") as string}</div>
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
        title={sampleGap ? t('sampleInterpolationTitle') : t('normalConditionTitle')} 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        {sampleGap ? (
          <div className="text-sm font-mono text-body-subtle space-y-3 p-4 sm:p-5 bg-neutral-secondary-soft rounded-[12px] border border-border-default overflow-x-auto custom-scrollbar">
            <p>{t('gapDuration')}: <span className="font-bold text-body">{sampleGap.diff} {t('seconds')}</span></p>
            <p>{t('formula')}: <span className="text-brand">y = y₁ + (x - x₁)(y₂ - y₁) / (x₂ - x₁)</span></p>
            <p className="mt-4 break-words">{t('exampleMidpoint', { mid: (Number(sampleGap.curr.last_updated) + Number(sampleGap.prev.last_updated))/2 })}</p>
            <div className="pl-4 border-l-2 border-border-default mt-2 space-y-2 whitespace-nowrap sm:whitespace-normal">
              <p>y₁ = {sampleGap.prev.voltage} V</p>
              <p>y₂ = {sampleGap.curr.voltage} V</p>
              <p>y = {sampleGap.prev.voltage} + (Δx)({sampleGap.curr.voltage} - {sampleGap.prev.voltage}) / {sampleGap.diff}</p>
              <p className="text-brand font-bold text-base mt-2">{t('result')} = {(((Number(sampleGap.curr.voltage) + Number(sampleGap.prev.voltage)) / 2).toFixed(2))} V</p>
            </div>
          </div>
        ) : (
          <div className="bg-success-soft p-5 rounded-[12px] border border-success flex flex-col items-start gap-2">
            <p className="font-semibold text-success text-base">{t('allNormalTitle')}</p>
            <p className="text-success text-sm">{t('allNormalDesc')}</p>
          </div>
        )}
      </AccordionItem>

      <AccordionItem 
        id="2" 
        title={t('sequenceTableTitle')} 
        numberSeq={3} 
        isOpen={openAccordionId === '2'} 
        onToggle={() => toggleAccordion('2')}
      >
        <ProcessTable data={gapRows} columns={columns} />
      </AccordionItem>
    </div>
  );
};
