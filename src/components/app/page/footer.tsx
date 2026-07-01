import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('HomePage');

  return (
    <footer className="w-full border-t border-border-default py-8 bg-neutral-primary-soft">
      <div className="max-w-[1152px] mx-auto px-6 text-center text-body-sm">
        {t('footer', { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
