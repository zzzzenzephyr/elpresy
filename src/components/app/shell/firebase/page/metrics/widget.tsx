"use client";

import { useEffect, useState } from "react";
import type { FirebaseData } from "@/script/app/firebase/types";
import { generateMetricCells } from "@/script/app/firebase/logic";
import { useFirebaseData } from "@/components/app/shell/firebase/page/provider";

import { MetricsHeader } from "@/components/app/shell/firebase/page/metrics/header";
import { MetricsGrid } from "@/components/app/shell/firebase/page/metrics/grid";
import { MetricsChart } from "@/components/app/shell/firebase/page/metrics/chart";
import { MetricsFooter } from "@/components/app/shell/firebase/page/metrics/footer";

const defaultFirebaseData: FirebaseData = {
    "current": 0,
    "energy_kwh": 0,
    "last_updated": 0,
    "power_watt": 0,
    "voltage": 0,
}

export function MetricsWidget() {
  const { data, error } = useFirebaseData();
  const [realtimeData, setRealtimeData] = useState(defaultFirebaseData);
  const [pastData, setPastData] = useState(defaultFirebaseData);

  useEffect(() => {
    if (data) {
      setPastData(realtimeData);
      setRealtimeData(data);

      console.group(Date.now())
      console.log("MetricsWidget received data:", data);
      console.table(pastData);
      console.table(realtimeData);
      console.groupEnd()
    }
  }, [data]);

  const dynamicMetricCells = generateMetricCells(realtimeData, pastData);

  return (
    <div className="w-full pb-4">
      <div className="w-full bg-neutral-primary border border-border-default rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-6">
        
        <MetricsHeader />

        {/* Split body */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          <MetricsGrid cells={dynamicMetricCells} />

          <MetricsChart />
          
        </div>

        <MetricsFooter />

      </div>
    </div>
  );
}
