import { useTranslations } from 'next-intl';

export function Hero({ children }: { children: React.ReactNode }) {
  const t = useTranslations('HomePage');

  return (
    <section className="relative w-full py-24 bg-neutral-primary-soft overflow-hidden">
      {/* Subtle geometric dot texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border-default) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative max-w-[1152px] mx-auto px-6 flex flex-col xl:grid xl:grid-cols-12 gap-12 xl:gap-8 items-center">
        {/* Left Column (7 columns) */}
        <div className="flex flex-col w-full xl:col-span-7 xl:pr-8 xl:self-center items-start text-left">
          <h1 className="text-heading text-h1 font-extrabold tracking-tight max-w-xl mb-4 leading-[1.1] shimmer">
            {t('title')}
          </h1>
          <p className="text-body text-body-lg max-w-lg mb-8">
            {t('subtitle')}
          </p>

          <a
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 bg-brand text-white font-medium rounded-base transition-colors hover:bg-brand-strong w-auto mb-16"
            style={{
              boxShadow:
                "var(--shadow-xs), inset var(--color-1-400) 0 6px 0px -5px, var(--color-1-700) 0 4px 10px -5px",
            }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <title>Play</title>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            {t('watchDemo')}
          </a>

          {/* Stat Row */}
          <div className="hidden xl:flex w-full pt-8 border-t border-border-default gap-8">
            <div className="flex items-center gap-3">
              <div className="text-[30px] font-extrabold tracking-tight text-heading leading-none">
                99%
              </div>
              <div className="text-body-sm leading-tight text-body-subtle">
                {t('accuracyLabel')}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[30px] font-extrabold tracking-tight text-heading leading-none">
                10k+
              </div>
              <div className="text-body-sm leading-tight text-body-subtle">
                {t('activeModelsLabel')}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[30px] font-extrabold tracking-tight text-heading leading-none">
                24/7
              </div>
              <div className="text-body-sm leading-tight text-body-subtle">
                {t('uptimeLabel')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 columns) */}
        <div className="w-full max-w-md mx-auto xl:col-span-5 xl:ml-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
