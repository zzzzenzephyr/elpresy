import { setRequestLocale } from 'next-intl/server';
import { Shell } from '@/components/app/shell/layout/shell';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ShellLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect(`/${locale}`);
  }

  setRequestLocale(locale);
  return <Shell>{props.children}</Shell>;
}
