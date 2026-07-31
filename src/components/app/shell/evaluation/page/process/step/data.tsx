import * as React from 'react';
import { useTranslations } from 'next-intl';

export function useProcessStepsData() {
  const t = useTranslations('EvaluationPage.Process');
  
  return [
    {
      label: t('steps.selection.label'),
      question: t('steps.selection.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.selection.p1')}</p>
        </div>
      )
    },
    {
      label: t('steps.evaluation.label'),
      question: t('steps.evaluation.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.evaluation.p1')}</p>
        </div>
      )
    },
    {
      label: t('steps.scatter.label'),
      question: t('steps.scatter.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.scatter.p1')}</p>
        </div>
      )
    },
    {
      label: t('steps.comparison.label'),
      question: t('steps.comparison.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.comparison.p1')}</p>
        </div>
      )
    },
    {
      label: t('steps.checklist.label'),
      question: t('steps.checklist.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.checklist.p1')}</p>
        </div>
      )
    }
  ];
}
