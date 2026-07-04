"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

export function MetricsFooter() {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border-default pt-6 mt-2">
      <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border border-border-default rounded-md text-sm font-medium text-body hover:bg-neutral-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Last 7 days
        <ChevronDown className="w-4 h-4 text-body-subtle" />
      </button>
      
      <button onClick={() => window.open("https://console.firebase.google.com/", "_blank")} className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1 px-3 py-2 text-sm font-medium text-brand hover:text-brand-strong hover:underline transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
        View Firebase Console
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
