import { ArrowUpRight, ChevronDown } from "lucide-react";

export function MetricsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-heading">Website performance</h2>
          <span className="flex items-center gap-1 bg-success-soft text-fg-success-strong border border-border-success-subtle text-xs font-medium px-2 py-0.5 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            10%
          </span>
        </div>
        <p className="text-sm text-body-subtle">Last month website stats</p>
      </div>
      <button className="flex items-center gap-2 px-3 py-2 border border-border-default rounded-md text-sm font-medium text-body hover:bg-neutral-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
        flowbite.com
        <ChevronDown className="w-4 h-4 text-body-subtle" />
      </button>
    </div>
  );
}
