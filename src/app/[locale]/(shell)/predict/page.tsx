import { setRequestLocale } from 'next-intl/server';
import { Process } from '@/components/app/shell/predict/page/process';

export default async function PredictPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Process />
    </div>
  );
}
