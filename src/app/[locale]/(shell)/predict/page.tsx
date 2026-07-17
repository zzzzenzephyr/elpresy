import { setRequestLocale } from 'next-intl/server';
import { Process } from '@/components/app/shell/predict/page/process';
import { fetchNeonData } from '@/script/app/firebase/actions';
import { FirebaseDataRow } from '@/components/app/shell/firebase/page/table/columns';

export default async function PredictPageRoute(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Fetch preprocessed data for the predict workflow
  const data = (await fetchNeonData()) as FirebaseDataRow[];

  return (
    <div className="flex flex-col min-h-screen">
      <Process data={data} />
    </div>
  );
}
