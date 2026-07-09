import { setRequestLocale } from 'next-intl/server';
import { Process } from '@/components/app/shell/predict/page/process/process';
import { fetchNeonData } from '@/script/app/firebase/actions';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';
export default async function PredictPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const data = (await fetchNeonData()) as FirebaseDataRow[];

  return (
    <div className="flex flex-col min-h-screen">
      <Process data={data} />
    </div>
  );
}
