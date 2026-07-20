import { setRequestLocale } from 'next-intl/server';
import { Shell } from '@/components/app/shell/layout/shell';

export default async function ShellLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <Shell>{props.children}</Shell>;
}
