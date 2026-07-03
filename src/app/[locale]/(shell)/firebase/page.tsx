import { Separator } from "@/components/ui/separator";
import { MetricsWidget } from "@/components/app/shell/firebase/page/metrics";
import { TrendBadge } from "@/components/app/shell/firebase/page/badge";
import { RTable } from "@/components/app/shell/firebase/page/table";
import { Provider } from "@/components/app/shell/firebase/page/provider";

export default function FirebasePage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TrendBadge
            value="163.4k"
            label="Last 7 days website visits"
            percentage={10}
            comparisonText="vs last week"
          />
          <TrendBadge
            value="$24.5k"
            label="Total Revenue"
            percentage={4.2}
            comparisonText="vs last week"
          />
          <TrendBadge
            value="1,204"
            label="New Signups"
            percentage={-2.1}
            comparisonText="vs last week"
          />
          <TrendBadge
            value="42.3%"
            label="Bounce Rate"
            percentage={-1.5}
            comparisonText="vs last week"
          />
        </div>
      </section>

      <Separator className="my-2 bg-border-default" />

      {/* Requests Data Table */}
      <section>
        <RTable />
      </section>
    </div>
    </Provider>
  );
}
