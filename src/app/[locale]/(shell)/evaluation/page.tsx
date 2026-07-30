import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Process } from '@/components/app/shell/evaluation/page/process';

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('EvaluationPage');

  return (
    <div className="flex flex-col h-full bg-neutral-primary">
      <div className="flex-1 overflow-auto bg-neutral-secondary-soft p-4 md:p-6 lg:p-8">
        <Process />
      </div>
    </div>
  );
}
