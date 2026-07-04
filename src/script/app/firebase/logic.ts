import type { FirebaseData, MetricCell } from "@/script/app/firebase/types";

function hasValidDelta(curr?: number, past?: number): boolean {
  return curr != null && past != null && past !== 0;
}

function calcDelta(curr: number, past: number) {
  const diff = curr - past;
  const percent = (diff / past) * 100;
  
  if (Math.abs(percent) < 0.005) {
    return { text: "-", isPositive: true };
  }
  
  return {
    text: `${diff > 0 ? "+" : ""}${percent.toFixed(2)}%`,
    isPositive: diff > 0,
  };
}

export function generateMetricCells(realtimeData: FirebaseData, pastData: FirebaseData): MetricCell[] {
  const createMetric = (label: string, key: keyof Omit<FirebaseData, 'last_updated'>, unit: string): MetricCell => {
    const curr = realtimeData[key];
    const past = pastData[key];
    
    let delta = { text: "-", isPositive: true };
    if (hasValidDelta(curr, past)) {
      delta = calcDelta(curr as number, past as number);
    }

    return {
      label,
      value: curr != null ? `${curr} ${unit}` : "-",
      ...delta,
    };
  };

  return [
    createMetric("Current", "current", "A"),
    createMetric("Power Watt", "power_watt", "W"),
    createMetric("Voltage", "voltage", "V"),
    createMetric("Energy kWh", "energy_kwh", "kWh"),
    {
      label: "Date",
      value: realtimeData.last_updated ? new Date(realtimeData.last_updated * 1000).toLocaleDateString() : "-",
      text: "-",
      isPositive: true,
    },
    {
      label: "Time",
      value: realtimeData.last_updated ? new Date(realtimeData.last_updated * 1000).toLocaleTimeString() : "-",
      text: "-",
      isPositive: true,
    },
  ];
}
