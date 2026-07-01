import { useTranslations } from 'next-intl';

export function Process() {
  const t = useTranslations('HomePage');

  return (
    <section className="w-full py-24 bg-neutral-secondary-soft border-t border-border-default">
      <div className="max-w-[1152px] mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-heading text-h2 font-semibold mb-4">
            {t('processTitle')}
          </h2>
          <p className="text-body text-[20px] leading-[1.4] max-w-2xl mx-auto">
            {t('processSubtitle')}
          </p>
        </div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-neutral-primary-soft border border-border-default rounded-[8px] p-8 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-soft text-brand-strong flex items-center justify-center mb-6 text-lg font-bold">
              1
            </div>
            <h3 className="text-heading text-[20px] font-semibold mb-3">
              {t('step1Title')}
            </h3>
            <p className="text-body text-base">
              {t('step1Desc')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-neutral-primary-soft border border-border-default rounded-[8px] p-8 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-soft text-brand-strong flex items-center justify-center mb-6 text-lg font-bold">
              2
            </div>
            <h3 className="text-heading text-[20px] font-semibold mb-3">
              {t('step2Title')}
            </h3>
            <p className="text-body text-base">
              {t('step2Desc')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-neutral-primary-soft border border-border-default rounded-[8px] p-8 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-brand-soft text-brand-strong flex items-center justify-center mb-6 text-lg font-bold">
              3
            </div>
            <h3 className="text-heading text-[20px] font-semibold mb-3">
              {t('step3Title')}
            </h3>
            <p className="text-body text-base">
              {t('step3Desc')}
            </p>
          </div>
        </div>

        {/* Badge Bottom */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-neutral-primary-soft border border-border-default shadow-xs text-body-sm text-heading font-medium">
            <svg
              className="w-4 h-4 mr-2 text-brand"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('poweredBy')}
          </div>
        </div>
      </div>
    </section>
  );
}
