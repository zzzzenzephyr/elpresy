import * as React from 'react';
import { useTranslations } from 'next-intl';

export function useProcessStepsData() {
  const t = useTranslations('PredictPage.Process');
  
  return [
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
      label: t('steps.tuning.label'),
      question: t('steps.tuning.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.tuning.p1')}</p>
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
      label: t('steps.upload.label'),
      question: t('steps.upload.question'),
      answer: (
        <div className="space-y-4 text-body text-sm leading-relaxed">
          <p>{t('steps.upload.p1')}</p>
        </div>
      )
    }
  ];
}
