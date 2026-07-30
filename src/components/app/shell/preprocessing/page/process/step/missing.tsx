import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { ProcessTable } from '@/components/app/shell/preprocessing/page/table';
import { SortableHeader, ActionCell } from '@/components/app/shell/preprocessing/page/table/columns';
import { AccordionItem } from '../accordion';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

interface MissingStepProps {
  data: FirebaseDataRow[];
  setDataFilter: React.Dispatch<React.SetStateAction<FirebaseDataRow[]>>;
  openAccordionId: string;
  toggleAccordion: (id: string) => void;
  getSelectColumn: () => ColumnDef<FirebaseDataRow>;
  getStandardColumns: () => ColumnDef<FirebaseDataRow>[];
  answerContent: React.ReactNode;
}

export const MissingStep = ({ data, setDataFilter, openAccordionId, toggleAccordion, getSelectColumn, getStandardColumns, answerContent }: MissingStepProps) => {
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

  let smallGaps = 0;
  let largeGaps = 0;
  const sorted = [...data].sort((a, b) => Number(a.last_updated) - Number(b.last_updated));
  
  let sampleGap: any = null;
  const gapRows = [];
  for (let i = 0; i < sorted.length; i++) {
    const diff = i === 0 ? 0 : Number(sorted[i].last_updated) - Number(sorted[i-1].last_updated);
    
    let dayDiff = 0;
    if (i > 0) {
      const prevDate = new Date(Number(sorted[i-1].last_updated)).setHours(0,0,0,0);
      const currDate = new Date(Number(sorted[i].last_updated)).setHours(0,0,0,0);
      dayDiff = Math.round((currDate - prevDate) / 86400000);
    }
    
    gapRows.push({ ...sorted[i], diff, dayDiff });
    if (diff >= 6000) {
      if (diff >= 31000) largeGaps++;
      else smallGaps++;
    }
    
    // Find sample gap for interpolation example
    if (!sampleGap && gapRows.length > 1) {
      let prevRow = null;
      // Search backwards for a gap >= 5000
      for (let j = gapRows.length - 2; j >= 0; j--) {
        if (gapRows[j].diff >= 5000) {
          prevRow = gapRows[j];
          break;
        }
      }
      
      // If we found a valid previous row, and the current row is also a decent gap, set it
      if (prevRow) {
        const currRow = gapRows[gapRows.length - 1];
        sampleGap = { prev: prevRow, curr: currRow, diff: currRow.diff };
      }
    }
  }

  let totalGap = 0;
  let validGapCount = 0;
  for (let i = 1; i < gapRows.length; i++) {
    const row = gapRows[i];
    const isDifferentDay = row.dayDiff > 0 && row.diff > 30000;
    if (!isDifferentDay) {
      totalGap += row.diff;
      validGapCount++;
    }
  }
  const avgGapSeconds = validGapCount > 0 ? (totalGap / validGapCount / 1000).toFixed(2) : "0";

  const columns: ColumnDef<FirebaseDataRow>[] = [
    getSelectColumn(),
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column} title={t('dataId')} />,
      cell: ({ row }) => <div className="tabular-nums font-medium text-body">{String(row.getValue("id")).substring(0, 8)}...</div>
    },
    {
      id: "date",
      accessorFn: (row: any) => row.createdAt || row.createdat,
      header: ({ column }) => <SortableHeader column={column} title="Date" />,
      cell: ({ row }) => {
        const val = row.getValue("date") as string;
        if (!val) return <div className="text-body-subtle">-</div>;
        const d = new Date(val);
        const formatted = !isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : String(d);
        return <div className="text-body tabular-nums">{formatted}</div>;
      }
    },
    {
      accessorKey: "last_updated",
      header: ({ column }) => <SortableHeader column={column} title={t('timestamp')} />,
      cell: ({ row }) => <div className="text-body-subtle tabular-nums">{row.getValue("last_updated")}</div>
    },
    {
      id: "gap",
      accessorFn: (row: any) => row.diff,
      header: ({ column }) => <SortableHeader column={column} title="Gap" />,
      cell: ({ row }) => {
        const diff = Number(row.getValue("gap"));
        const dayDiff = Number((row.original as any).dayDiff);
        
        let colorClass = 'text-success';
        if (dayDiff > 3) colorClass = 'text-purple-500';
        else if (dayDiff > 0 && diff > 30000) colorClass = 'text-white';
        else if (diff >= 31000) colorClass = 'text-danger';
        else if (diff >= 6000) colorClass = 'text-warning';

        const seconds = Math.round(diff / 1000);
        return <div className={`font-bold tabular-nums ${colorClass}`}>{seconds}s / {diff}</div>;
      }
    },
    {
      id: "keterangan",
      accessorFn: (row: any) => {
        if (row.dayDiff > 3) return "Anomaly";
        if (row.dayDiff > 0 && row.diff > 30000) return "Different Day";
        if (row.diff >= 31000) return t('gapLarge');
        if (row.diff >= 6000) return t('gapSmall');
        return t('normal');
      },
      header: ({ column }) => <SortableHeader column={column} title={t('description')} />,
      cell: ({ row }) => {
        const dayDiff = Number((row.original as any).dayDiff);
        const diff = Number((row.original as any).diff);
        let colorClass = 'text-body';
        
        if (dayDiff > 3) colorClass = 'text-purple-500 font-bold';
        else if (dayDiff > 0 && diff > 30000) colorClass = 'text-white font-bold';
        
        return <div className={colorClass}>{row.getValue("keterangan") as string}</div>;
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
        title={sampleGap ? t('sampleInterpolationTitle') : t('normalConditionTitle')} 
        numberSeq={2} 
        isOpen={openAccordionId === '1'} 
        onToggle={() => toggleAccordion('1')}
      >
        {sampleGap ? (
          <div className="text-sm font-mono text-body-subtle space-y-3 p-4 sm:p-5 bg-neutral-secondary-soft rounded-[12px] border border-border-default overflow-x-auto custom-scrollbar">
            <p>{t('gapDuration')}: <span className="font-bold text-body">{sampleGap.diff} {t('seconds')}</span></p>
            <p>{t('averageGap', { fallback: 'Average Gap' })}: <span className="font-bold text-body">{avgGapSeconds} {t('seconds')}</span></p>
            <p>{t('formula')}: <span className="text-brand">y = y₁ + (x - x₁)(y₂ - y₁) / (x₂ - x₁)</span></p>
            <p className="mt-4 break-words">{t('exampleMidpoint')}</p>
            <div className="pl-4 border-l-2 border-border-default mt-2 space-y-2 whitespace-nowrap sm:whitespace-normal">
              <p>y₁ = {sampleGap.prev.diff}</p>
              <p>y₂ = {sampleGap.curr.diff}</p>
              <p>Δx = 5078 / 2</p>
              <p>Δx = 2539</p>
              <p>y = {sampleGap.prev.diff} + ((2539)({sampleGap.curr.diff} - {sampleGap.prev.diff}) / {sampleGap.diff})</p>
              <p>y = {sampleGap.prev.diff} + ((2539)(-16) / {sampleGap.diff})</p>
              <p>y = {sampleGap.prev.diff} + (-(40624 / {sampleGap.diff}))</p>
              <p>y = {sampleGap.prev.diff} + (-8)</p>
              <p>y = {sampleGap.prev.diff} - 8</p>
              <p className="text-brand font-bold text-base mt-2">
                {t('result')} = {((Number(sampleGap.curr.diff) + Number(sampleGap.prev.diff)) / 2).toFixed(2)}
              </p>
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
        <ProcessTable data={gapRows} columns={columns} setDataFilter={setDataFilter} editConfig={{ disableOthers: true }} />
      </AccordionItem>
      <AccordionItem 
        id="3" 
        title={t('currentDataTitle', { count: data.length })} 
        numberSeq={4} 
        isOpen={openAccordionId === '3'} 
        onToggle={() => toggleAccordion('3')}
      >
        <ProcessTable data={data} columns={getStandardColumns()} setDataFilter={setDataFilter} editConfig={{ disableOthers: true }} />
      </AccordionItem>
    </div>
  );
};
