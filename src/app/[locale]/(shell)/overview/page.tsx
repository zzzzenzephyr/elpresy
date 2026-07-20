import { setRequestLocale } from 'next-intl/server';
import { Maintenance } from '@/components/app/shell/overview/page/maintenance';

export default async function ShellPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <Maintenance />;
}
