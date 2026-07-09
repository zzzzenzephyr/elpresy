'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ProcessTable } from "@/components/app/shell/predict/page/table";
import { SortableHeader, ActionCell } from "@/components/app/shell/predict/page/table/columns";

// Generic AccordionItem to match FAQ design rules
const AccordionItem = ({
  id,
  title,
  numberSeq,
  isOpen,
  onToggle,
  children
}: {
  id: string,
  title: string,
  numberSeq: number,
  isOpen: boolean,
  onToggle: () => void,
  children: React.ReactNode
}) => {
  return (
    <div className="flex flex-col border border-border-default rounded-[12px] bg-neutral-primary shadow-sm overflow-hidden mb-4 last:mb-0 transition-all">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 hover:bg-neutral-secondary-soft transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-brand-soft text-heading flex items-center justify-center text-sm font-bold shrink-0">
            {numberSeq}
          </div>
          <span className="font-semibold text-heading">{title}</span>
        </div>
        <ChevronRight className={`w-5 h-5 text-body-subtle shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-border-default mt-2">
           <div className="pt-4 w-full">
             {children}
           </div>
        </div>
      )}
    </div>
  );
};

export function Process({ data = [] }: { data?: any[] }) {
  const tRoot = useTranslations('PredictPage');
  const t = useTranslations('PredictPage.Process');
  const [activeIndex, setActiveIndex] = useState(0);
  const [openAccordionId, setOpenAccordionId] = useState<string>('0');

  // Automatically open the first accordion item when changing steps
  useEffect(() => {
    setOpenAccordionId('0');
  }, [activeIndex]);

  const toggleAccordion = (id: string) => {
    setOpenAccordionId(prev => prev === id ? '' : id);
  };

  const steps = [
    {
      label: t('steps.outlier.label'),
      question: t('steps.outlier.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.outlier.p1')}</p>
          <div className="bg-neutral-secondary-soft p-4 rounded-md border border-border-default">
            <p className="font-semibold mb-2">{t('steps.outlier.stepsLabel')}</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('steps.outlier.step1')}</li>
              <li>{t('steps.outlier.step2')} <code className="bg-neutral-primary border border-border-default px-1.5 py-0.5 rounded text-brand">IQR = Q₃ - Q₁</code></li>
              <li>{t('steps.outlier.step3')}
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><code className="bg-neutral-primary border border-border-default px-1.5 py-0.5 rounded">{t('lowerBound')} = Q₁ - 1.5 × IQR</code></li>
                  <li><code className="bg-neutral-primary border border-border-default px-1.5 py-0.5 rounded">{t('upperBound')} = Q₃ + 1.5 × IQR</code></li>
                </ul>
              </li>
              <li><strong>{t('steps.outlier.step4Action')}</strong> {t('steps.outlier.step4Desc')}</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      label: t('steps.missing.label'),
      question: t('steps.missing.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.missing.p1')}</p>
          <div className="bg-neutral-secondary-soft p-4 rounded-md border border-border-default">
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>{t('steps.missing.smallGap')}</strong> {t('steps.missing.smallGapDesc')}<br />
              <em className="text-body-subtle mt-1 block">{t('steps.missing.formulaNote')} <code className="bg-neutral-primary border border-border-default px-1.5 py-0.5 rounded font-mono text-xs">y = y₁ + (x - x₁)(y₂ - y₁) / (x₂ - x₁)</code>)</em></li>
              <li><strong>{t('steps.missing.largeGap')}</strong> {t('steps.missing.largeGapDesc')}</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      label: t('steps.groundTruth.label'),
      question: t('steps.groundTruth.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.groundTruth.p1')}</p>
          <div className="bg-neutral-secondary-soft p-4 rounded-md border border-border-default">
            <p className="font-semibold mb-2">{t('steps.groundTruth.calcTitle')}</p>
            <p><code className="bg-neutral-primary border border-border-default px-1.5 py-0.5 rounded text-brand">Error(%) = |({t('sensorValue')} - {t('stdValue')}) / {t('stdValue')}| × 100%</code></p>
            
            <p className="font-semibold mt-4 mb-2">{t('steps.groundTruth.stdValuesTitle')}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t('steps.groundTruth.stdV')}</li>
              <li>{t('steps.groundTruth.stdP')}</li>
              <li>{t('steps.groundTruth.stdI')}</li>
            </ul>
          </div>
          <p><strong>{t('steps.groundTruth.action')}</strong> {t('steps.groundTruth.actionDesc')}</p>
        </div>
      )
    },
    {
      label: t('steps.timeCheck.label'),
      question: t('steps.timeCheck.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.timeCheck.p1')}</p>
          <div className="bg-neutral-secondary-soft p-4 rounded-md border border-border-default">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t('steps.timeCheck.requirement')}</strong> {t('steps.timeCheck.reqDesc')}</li>
              <li><strong>{t('steps.timeCheck.action')}</strong> {t('steps.timeCheck.actionDesc')}</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      label: t('steps.sanity.label'),
      question: t('steps.sanity.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.sanity.p1')}</p>
          <div className="bg-neutral-secondary-soft p-4 rounded-md border border-border-default">
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('steps.sanity.rule1')}</li>
              <li>{t('steps.sanity.rule2')}</li>
              <li><strong>{t('steps.sanity.action')}</strong> {t('steps.sanity.actionDesc')}</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      label: t('steps.split.label'),
      question: t('steps.split.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.split.p1')}</p>
          <div className="bg-neutral-secondary-soft p-4 rounded-md border border-border-default">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>{t('steps.split.train')}</strong> {t('steps.split.trainDesc')}</li>
              <li><strong>{t('steps.split.test')}</strong> {t('steps.split.testDesc')}</li>
            </ul>
            <p className="mt-3 text-body-subtle italic">{t('steps.split.note')}</p>
          </div>
        </div>
      )
    }
  ];

  const getSelectColumn = (): ColumnDef<any> => ({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  });

  const getStandardColumns = (): ColumnDef<any>[] => [
    getSelectColumn(),
    {
      accessorKey: "id",
      header: ({ column }) => <SortableHeader column={column} title={t('dataId')} />,
      cell: ({ row }) => <div className="tabular-nums font-medium text-body">{String(row.getValue("id")).substring(0, 8)}...</div>
    },
    {
      accessorKey: "voltage",
      header: ({ column }) => <SortableHeader column={column} title={t('voltage')} />,
      cell: ({ row }) => <div className="font-medium text-warning">{row.getValue("voltage")}</div>,
    },
    {
      accessorKey: "current",
      header: ({ column }) => <SortableHeader column={column} title={t('current')} />,
      cell: ({ row }) => <div className="font-medium text-brand">{row.getValue("current")}</div>,
    },
    {
      accessorKey: "power_watt",
      header: ({ column }) => <SortableHeader column={column} title={t('power')} />,
      cell: ({ row }) => <div className="font-medium text-success">{row.getValue("power_watt")}</div>,
    },
    {
      accessorKey: "last_updated",
      header: ({ column }) => <SortableHeader column={column} title={t('timestamp')} />,
      cell: ({ row }) => <div className="text-body-subtle tabular-nums">{row.getValue("last_updated")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell row={row} />
    }
  ];

  const renderRightColumn = (index: number) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center text-body-subtle mt-8">
          <p>{t('noData')}</p>
        </div>
      );
    }

    // Helper component for the first accordion item (always explanation)
    const ExplanationItem = () => (
      <AccordionItem 
        id="0" 
        title={t('explanation')} 
        numberSeq={1} 
        isOpen={openAccordionId === '0'} 
        onToggle={() => toggleAccordion('0')}
      >
        {steps[index].answer}
      </AccordionItem>
    );

    switch (index) {
      case 0: {
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

        const columns: ColumnDef<any>[] = [
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
      }
      case 1: {
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
        
        const columns: ColumnDef<any>[] = [
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
      }
      case 2: {
        const stdV = 220;
        const stdP = 1810;
        const stdI = 9.975;
        
        const r = data[0]; // Example row
        if (!r) return null;

        const makeErrorAccordion = (idKey: string, seq: number, name: string, sensor: number, std: number) => {
           const step1 = `Error(%) = |(${sensor} - ${std}) / ${std}| × 100%`;
           const diff = (sensor - std).toFixed(4);
           const step2 = `Error(%) = |(${diff}) / ${std}| × 100%`;
           const div = Math.abs(Number(diff) / std).toFixed(6);
           const step3 = `Error(%) = |${div}| × 100%`;
           const result = (Number(div) * 100).toFixed(2);
           const step4 = `Error(%) = ${result}%`;
           
           return (
               <AccordionItem 
                 id={idKey} 
                 title={t('simError', { name })} 
                 numberSeq={seq} 
                 isOpen={openAccordionId === idKey} 
                 onToggle={() => toggleAccordion(idKey)}
               >
                  <div className="text-sm font-mono text-body-subtle space-y-3 p-4 sm:p-5 bg-neutral-secondary-soft rounded-[12px] border border-border-default overflow-x-auto custom-scrollbar">
                    <p>{t('usingRowId')}: {r.id.substring(0,8)}...</p>
                    <p>{t('sensorValue')}: {sensor}</p>
                    <p>{t('stdValue')}: {std}</p>
                    <div className="pt-4 mt-2 border-t border-border-default space-y-2 whitespace-nowrap sm:whitespace-normal">
                      <p>{step1}</p>
                      <p>{step2}</p>
                      <p>{step3}</p>
                      <p className="text-brand font-bold text-base mt-2">{step4}</p>
                    </div>
                  </div>
               </AccordionItem>
           );
        };

        return (
          <div className="flex flex-col w-full pb-10">
            <ExplanationItem />
            {makeErrorAccordion('1', 2, t('voltage'), Number(r.voltage), stdV)}
            {makeErrorAccordion('2', 3, t('current'), Number(r.current), stdI)}
            {makeErrorAccordion('3', 4, t('power'), Number(r.power_watt), stdP)}
          </div>
        );
      }
      case 3: {
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

        const columns: ColumnDef<any>[] = [
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
      }
      case 4: {
        const zeroData = data.filter(d => Number(d.power_watt) <= 0 || Number(d.current) <= 0 || Number(d.voltage) <= 0);
        
        const columns: ColumnDef<any>[] = [
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
      }
      case 5: {
        const total = data.length;
        const trainCount = Math.floor(total * 0.7);
        const trainData = data.slice(0, trainCount);
        const testData = data.slice(trainCount);
        
        return (
          <div className="flex flex-col w-full pb-10">
            <ExplanationItem />
            
            <AccordionItem 
              id="1" 
              title={t('trainSetTitle', { count: trainCount })} 
              numberSeq={2} 
              isOpen={openAccordionId === '1'} 
              onToggle={() => toggleAccordion('1')}
            >
              <ProcessTable data={trainData} columns={getStandardColumns()} />
            </AccordionItem>

            <AccordionItem 
              id="2" 
              title={t('testSetTitle', { count: testData.length })} 
              numberSeq={3} 
              isOpen={openAccordionId === '2'} 
              onToggle={() => toggleAccordion('2')}
            >
              <ProcessTable data={testData} columns={getStandardColumns()} />
            </AccordionItem>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="w-full min-h-[calc(100vh-5rem)] p-2 sm:p-4 md:p-6 lg:p-8 bg-neutral-primary-soft flex flex-col">
      {/* Widget shell: Full Canvas */}
      <div className="flex-1 w-full mx-auto flex flex-col p-4 sm:p-6 lg:p-[40px] rounded-[16px] sm:rounded-[20px] bg-neutral-primary shadow-xl border border-border-default overflow-hidden">
          
          {/* Header row */}
          <div className="flex-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-body-subtle">
              {tRoot('title')}
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handlePrev}
                aria-label="Previous step"
                className="flex-1 sm:flex-none w-full sm:w-[130px] shadow-none"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t('prev')}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNext}
                aria-label="Next step"
                className="flex-1 sm:flex-none w-full sm:w-[130px] shadow-none"
              >
                {t('next')}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Stepper track */}
          <div className="flex-none mt-[24px] w-full relative">
            <div className="w-full h-[64px] rounded-[16px] md:rounded-full bg-neutral-secondary-soft flex items-center px-2 border border-border-default overflow-x-auto no-scrollbar snap-x snap-mandatory">
              {steps.map((step, idx) => {
                const isActive = idx === activeIndex;
                const isCompleted = idx < activeIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className="min-w-[140px] md:min-w-0 flex-1 flex-shrink-0 flex items-center gap-2 px-2 hover:bg-neutral-primary/50 h-[48px] md:h-full transition-colors group first:rounded-l-[12px] md:first:rounded-l-full last:rounded-r-[12px] md:last:rounded-r-full snap-center"
                  >
                    <div className={`w-[24px] h-[24px] shrink-0 rounded-full flex items-center justify-center text-[12px] font-medium transition-colors ${
                      isActive ? 'bg-brand text-white border-transparent shadow-xs' :
                      isCompleted ? 'bg-success text-white border-transparent' :
                      'border border-border-default text-body-subtle bg-neutral-primary'
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3" /> : (idx + 1)}
                    </div>
                    <span className={`text-[12px] md:text-[13px] font-medium truncate ${isActive ? 'text-heading' : 'text-body-subtle group-hover:text-body'}`}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Success state (Body Content) - Single Column Layout */}
          <div className="flex-1 mt-[24px] sm:mt-[32px] md:mt-[48px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
            <div className="flex flex-col gap-6 sm:gap-8 h-full">
              {/* Accordion Stack */}
              <div className="w-full max-w-5xl mx-auto flex flex-col justify-start pb-4">
                 {renderRightColumn(activeIndex)}
              </div>
            </div>
          </div>

        </div>
    </section>
  );
}
