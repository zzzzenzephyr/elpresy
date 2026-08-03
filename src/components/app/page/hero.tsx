import { useTranslations, useLocale } from 'next-intl';

export function Hero({ children }: { children: React.ReactNode }) {
  const t = useTranslations('HomePage');
  const locale = useLocale();

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
        </div>

        {/* Right Column (5 columns) */}
        <div className="w-full max-w-md mx-auto xl:col-span-5 xl:ml-auto">
          {children}
        </div>
      </div>
    </section>
  );
}
