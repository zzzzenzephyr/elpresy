import { useTranslations } from 'next-intl';

export function Features() {
  const t = useTranslations('HomePage');

  return (
    <section className="w-full py-24 bg-neutral-secondary-soft">
      <div className="max-w-[1152px] mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-heading text-h2 font-semibold">
            {t('featuresTitle')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-neutral-primary-soft border border-border-default rounded-base p-6 shadow-xs hover:bg-neutral-secondary-medium transition-colors cursor-pointer">
            <h3 className="text-heading text-h5 font-medium mb-2">
              {t('feature1Title')}
            </h3>
            <p className="text-body text-body-sm">
              {t('feature1Desc')}
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-neutral-primary-soft border border-border-default rounded-base p-6 shadow-xs hover:bg-neutral-secondary-medium transition-colors cursor-pointer">
            <h3 className="text-heading text-h5 font-medium mb-2">
              {t('feature2Title')}
            </h3>
            <p className="text-body text-body-sm">
              {t('feature2Desc')}
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-neutral-primary-soft border border-border-default rounded-base p-6 shadow-xs hover:bg-neutral-secondary-medium transition-colors cursor-pointer">
            <h3 className="text-heading text-h5 font-medium mb-2">
              {t('feature3Title')}
            </h3>
            <p className="text-body text-body-sm">
              {t('feature3Desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
