'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ProcessTable } from "@/components/app/shell/predict/page/table";
import { SortableHeader, ActionCell } from "@/components/app/shell/predict/page/table/columns";
import { FirebaseDataRow } from "@/components/app/shell/firebase/page/table/columns";

import { OutlierStep } from './step/outlier';
import { MissingStep } from './step/missing';
import { GroundStep } from './step/ground';
import { TimeStep } from './step/time';
import { SanityStep } from './step/sanity';
import { SplitStep } from './step/split';

export function Process({ data = [] }: { data?: FirebaseDataRow[] }) {
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

  const getSelectColumn = (): ColumnDef<FirebaseDataRow> => ({
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

  const getStandardColumns = (): ColumnDef<FirebaseDataRow>[] => [
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

    const commonProps = {
      data,
      openAccordionId,
      toggleAccordion,
      answerContent: steps[index].answer
    };

    switch (index) {
      case 0:
        return <OutlierStep {...commonProps} getSelectColumn={getSelectColumn} />;
      case 1:
        return <MissingStep {...commonProps} getSelectColumn={getSelectColumn} />;
      case 2:
        return <GroundStep {...commonProps} />;
      case 3:
        return <TimeStep {...commonProps} getSelectColumn={getSelectColumn} />;
      case 4:
        return <SanityStep {...commonProps} getSelectColumn={getSelectColumn} />;
      case 5:
        return <SplitStep {...commonProps} getStandardColumns={getStandardColumns} />;
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
                    className="min-w-[140px] md:min-w-0 flex-1 shrink-0 flex items-center gap-2 px-2 hover:bg-neutral-primary/50 h-[48px] md:h-full transition-colors group first:rounded-l-[12px] md:first:rounded-l-full last:rounded-r-[12px] md:last:rounded-r-full snap-center"
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
