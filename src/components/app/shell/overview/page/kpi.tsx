import { Zap, Activity, Battery, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function OverviewKPI({ firebaseData, evaluationData }: { firebaseData: any, evaluationData: any }) {
  const current = firebaseData?.current ?? 0;
  const voltage = firebaseData?.voltage ?? 0;
  const power = firebaseData?.powerWatt ?? 0;
  
  let r2 = 0;
  try {
    const evalParsed = typeof evaluationData?.data === 'string' ? JSON.parse(evaluationData.data) : evaluationData?.data;
    r2 = evalParsed?.metrics?.r2 ?? 0;
  } catch(e) {}

  const cells = [
    { label: "Current", value: `${current} A`, icon: Activity, color: "text-amber-500" },
    { label: "Voltage", value: `${voltage} V`, icon: Zap, color: "text-sky-500" },
    { label: "Power", value: `${power} W`, icon: Battery, color: "text-emerald-500" },
    { label: "Model R² Score", value: r2.toFixed(4), icon: CheckCircle, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cells.map((cell, idx) => (
        <div key={idx} className="bg-neutral-primary border border-border-default rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-body-subtle">{cell.label}</span>
            <cell.icon className={cn("w-4 h-4", cell.color)} />
          </div>
          <span className="tabular-nums text-2xl font-bold text-heading">{cell.value}</span>
        </div>
      ))}
    </div>
  );
}
