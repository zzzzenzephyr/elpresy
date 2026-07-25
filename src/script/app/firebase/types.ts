export interface FirebaseData {
  current?: number;
  power_watt?: number;
  voltage?: number;
  energy_kwh?: number;
  last_updated?: number;
  createdAt?: string;
}

export interface MetricCell {
  label: string;
  value: string | number;
  text: string;
  isPositive: boolean;
}
