import { Separator } from "@/components/ui/separator";
import { MetricsWidget } from "@/components/app/shell/firebase/page/metrics/widget";
import { TrendBadgesGrid } from "@/components/app/shell/firebase/page/badge";
import { RTable } from "@/components/app/shell/firebase/page/table";
import { Provider } from "@/components/app/shell/firebase/page/provider";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { FirebaseDataRow } from "@/components/app/shell/firebase/page/table/columns";

export const revalidate = 60; // Next.js ISR: Cache page for 60 seconds, serving stale data on DB failure

// Helper function to retry DB calls on failure (e.g. Neon scale-to-zero cold start)
async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delayMs = 1500
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`DB connection failed, retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(operation, retries - 1, Math.round(delayMs * 1.5));
    }
    throw error;
  }
}

export default async function FirebasePage() {
  let tableData: FirebaseDataRow[] = [];
  try {
    // Querying the "firebase" table with retry wrapper
    const result = await fetchWithRetry(() => db.execute(sql`SELECT * FROM firebase`));
    tableData = result.rows as unknown as FirebaseDataRow[];
  } catch (error) {
    console.error("Final Neon Database Error after retries:", error);
  }

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
