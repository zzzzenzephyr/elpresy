import * as React from 'react';
import { useTranslations } from 'next-intl';

export function useProcessStepsData() {
  const t = useTranslations('PredictPage.Process');
  
  return [
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
}
