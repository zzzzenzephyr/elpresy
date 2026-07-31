import { setRequestLocale } from 'next-intl/server';
import { db } from '@/lib/db';
import { firebase, preprocess, predict, evaluation } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { OverviewKPI } from '@/components/app/shell/overview/page/kpi';
import { PreprocessChart } from '@/components/app/shell/overview/page/preprocess';
import { PredictChart } from '@/components/app/shell/overview/page/predict';
import { EvaluationChart } from '@/components/app/shell/overview/page/evaluation';

export default async function ShellPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  
  // Fetch latest data from database
  const latestFirebase = await db.select().from(firebase).orderBy(desc(firebase.createdAt)).limit(1);
  const latestPreprocess = await db.select().from(preprocess).orderBy(desc(preprocess.createdAt)).limit(1);
  const latestPredict = await db.select().from(predict).orderBy(desc(predict.createdAt)).limit(1);
  const latestEvaluation = await db.select().from(evaluation).orderBy(desc(evaluation.createdAt)).limit(1);

  const fbData = latestFirebase[0] || null;
  const evalData = latestEvaluation[0] || null;
  
  let preprocessData = [];
  try {
    preprocessData = latestPreprocess[0]?.data ? (typeof latestPreprocess[0].data === 'string' ? JSON.parse(latestPreprocess[0].data) : latestPreprocess[0].data) : [];
  } catch(e) {}

  let predictData = [];
  try {
    predictData = latestPredict[0]?.data ? (typeof latestPredict[0].data === 'string' ? JSON.parse(latestPredict[0].data) : latestPredict[0].data) : [];
  } catch(e) {}

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-6 px-4 md:px-8">
      <div>
        <h1 className="text-h3 font-semibold text-heading mb-2">Overview Dashboard</h1>
        <p className="text-body text-body-sm">Real-time metrics and prediction overview.</p>
      </div>

      {/* KPI Cards */}
      {/* <OverviewKPI firebaseData={fbData} evaluationData={evalData} /> */}

      {/* Charts List */}
      <div className="flex flex-col gap-6">
        <PreprocessChart data={preprocessData} />
        <PredictChart data={predictData} />
        <EvaluationChart data={evalData?.data || {}} />
      </div>
    </div>
  );
}
