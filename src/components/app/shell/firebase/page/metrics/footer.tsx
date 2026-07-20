"use client";

import { Activity, Pause, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFirebaseData } from "@/components/app/shell/firebase/page/provider";
import { cn } from "@/lib/utils";

export function MetricsFooter() {
  const t = useTranslations("FirebaseMonitoring");
  const { isSubscribed, setIsSubscribed } = useFirebaseData();

  return (
    <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border-default pt-6 mt-2">
      <button 
        onClick={() => setIsSubscribed(!isSubscribed)}
        className={cn(
          "w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isSubscribed 
            ? "border-brand bg-brand text-white hover:bg-brand-strong"
            : "border-border-default text-body hover:bg-neutral-secondary"
        )}
      >
        {isSubscribed ? <Activity className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        {t("liveData")}
      </button>
      
      <button onClick={() => window.open("https://console.firebase.google.com/", "_blank")} className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1 px-3 py-2 text-sm font-medium text-fg-brand hover:text-fg-brand-strong hover:underline transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
        {t("viewFirebaseConsole")}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
