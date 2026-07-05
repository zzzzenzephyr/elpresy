import { setRequestLocale } from 'next-intl/server';
import { Faq } from '@/components/app/shell/predict/page/faq';

export default async function PredictPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Faq />
    </div>
  );
}
