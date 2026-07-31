import * as React from 'react';
import { useTranslations } from 'next-intl';

export function useProcessStepsData() {
  const t = useTranslations('PredictPage.Process');
  
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
      label: t('steps.specification.label'),
      question: t('steps.specification.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.specification.p1')}</p>
        </div>
      )
    },

    {
      label: t('steps.split.label'),
      question: t('steps.split.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.split.p1')}</p>
        </div>
      )
    },
    {
      label: t('steps.result.label'),
      question: t('steps.result.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.result.p1')}</p>
        </div>
      )
    }
  ];
}
