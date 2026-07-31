import type { FirebaseDataRow } from "@/components/app/shell/firebase/page/table/columns";

export interface TrendContext {
  rtDateString: string;
  rtLastUpdated: number;
}

export interface TimePointPair {
  current: number;
  next: number;
}

export interface PctCalculation {
  realtime: number;
  avg: number;
}
export function isValidAverage(avg: number) {
  return Boolean(avg) && !isNaN(avg) && avg !== 0;
}

export function hasNoData(data: FirebaseDataRow[] | null | undefined) {
  return !data || data.length === 0;
}

export function isValidRealtimeData(context: TrendContext, data: FirebaseDataRow[]) {
  return context.rtLastUpdated > 0 && !hasNoData(data);
}

export function calculateRealtimeTimeDiff(context: TrendContext, data: FirebaseDataRow[]) {
  if (!isValidRealtimeData(context, data)) return 0;
  const latestDbTime = Math.max(...data.map(d => Number(d.last_updated) || 0));
  return latestDbTime > 0 ? Math.max(0, context.rtLastUpdated - latestDbTime) : 0;
}

export function getValidDataPoints(data: FirebaseDataRow[]) {
  if (hasNoData(data)) return [];
  return [...data].sort((a, b) => Number(b.last_updated) - Number(a.last_updated)).slice(2);
}

export function calculateAverages(validData: FirebaseDataRow[]) {
  if (validData.length === 0) return { current: 0, voltage: 0, power: 0 };
  
  let current = 0, voltage = 0, power = 0;
  validData.forEach(row => {
    current += Number(row.current) || 0;
    voltage += Number(row.voltage) || 0;
    power += Number(row.power_watt) || 0;
  });

  return {
    current: current / validData.length,
    voltage: voltage / validData.length,
    power: power / validData.length
  };
}

export function isSameDateAsRealtime(timestamp: number, context: TrendContext) {
  return new Date(timestamp).toDateString() === context.rtDateString;
}

export function areValidConsecutiveDates(pair: TimePointPair, context: TrendContext) {
  return isSameDateAsRealtime(pair.current, context) && isSameDateAsRealtime(pair.next, context);
}

export function isSameDate(current: number, next: number) {
  return new Date(current).toDateString() === new Date(next).toDateString();
}

export function isValidTimeDiff(diff: number) {
  return !isNaN(diff) && diff >= 0;
}

export function calculateAverageTimeDiff(validData: FirebaseDataRow[], context: TrendContext) {
  let timeDiffSum = 0;
  let timeDiffCount = 0;

  for (let i = 0; i < validData.length - 1; i++) {
    const current = Number(validData[i].last_updated);
    const next = Number(validData[i+1].last_updated);
    
    if (areValidConsecutiveDates({ current, next }, context)) {
      const diff = current - next;
      if (isValidTimeDiff(diff)) {
        timeDiffSum += diff;
        timeDiffCount++;
      }
    }
  }

  return timeDiffCount > 0 ? timeDiffSum / timeDiffCount : 0;
}

export function calculateOverallAverageTimeDiff(validData: FirebaseDataRow[]) {
  let timeDiffSum = 0;
  let timeDiffCount = 0;

  for (let i = 0; i < validData.length - 1; i++) {
    const current = Number(validData[i].last_updated);
    const next = Number(validData[i+1].last_updated);
    
    if (isSameDate(current, next)) {
      const diff = current - next;
      if (isValidTimeDiff(diff)) {
        timeDiffSum += diff;
        timeDiffCount++;
      }
    }
  }

  return timeDiffCount > 0 ? timeDiffSum / timeDiffCount : 0;
}

export function calculateTrendStats(data: FirebaseDataRow[], context: TrendContext) {
  const validData = getValidDataPoints(data);
  const avgs = calculateAverages(validData);
  const avgTimeDiff = calculateAverageTimeDiff(validData, context);
  const overallAvgTimeDiff = calculateOverallAverageTimeDiff(validData);
  
  return { 
    avgCurrent: avgs.current, 
    avgVoltage: avgs.voltage, 
    avgPower: avgs.power, 
    avgTimeDiff,
    overallAvgTimeDiff
  };
}


export function calcPct(params: PctCalculation) {
  if (!isValidAverage(params.avg)) return 0;
  return ((params.realtime - params.avg) / params.avg) * 100;
}

export function getRealtimeDateString(rtLastUpdated: number | undefined | null) {
  return rtLastUpdated 
    ? new Date(rtLastUpdated).toDateString() 
    : new Date().toDateString();
}

export function extractRealtimeValue(value: any) {
  return Number(value) || 0;
}
