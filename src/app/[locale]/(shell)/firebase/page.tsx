import { Separator } from "@/components/ui/separator";
import { MetricsWidget } from "@/components/app/shell/firebase/page/metrics/widget";
import { TrendBadgesGrid } from "@/components/app/shell/firebase/page/badge";
import { RTable } from "@/components/app/shell/firebase/page/table";
import { Provider } from "@/components/app/shell/firebase/page/provider";
import { FirebaseDataRow } from "@/components/app/shell/firebase/page/table/columns";
import { fetchNeonData } from "@/script/app/firebase/actions";

export const revalidate = 60; // Next.js ISR: Cache page for 60 seconds, serving stale data on DB failure

export default async function FirebasePage() {
  const tableData = await fetchNeonData() as FirebaseDataRow[];

  return (
    <Provider>
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-6 px-4 md:px-8">
        {/* Metrics Section */}
      <section>
        <MetricsWidget />
      </section>

      <Separator className="my-2 bg-border-default" />

      {/* Trend Badges Grid */}
      <section>
        <TrendBadgesGrid data={tableData} />
      </section>

      <Separator className="my-2 bg-border-default" />

      {/* Requests Data Table */}
      <section>
        <RTable data={tableData} />
      </section>
    </div>
    </Provider>
  );
}
