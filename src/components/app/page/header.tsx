import { Link } from '@/i18n/routing';

export function Header({ locale }: { locale: string }) {
  return (
    <header className="w-full border-b border-border-default bg-neutral-primary-soft">
      <div className="max-w-[1152px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-heading font-semibold text-lg">ELPRESY</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" locale="en" className={locale === 'en' ? 'text-brand' : 'text-body hover:text-brand'}>EN</Link>
          <Link href="/" locale="id" className={locale === 'id' ? 'text-brand' : 'text-body hover:text-brand'}>ID</Link>
        </div>
      </div>
    </header>
  );
}
