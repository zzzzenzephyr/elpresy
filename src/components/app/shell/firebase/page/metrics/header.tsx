import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function MetricsHeader() {
  const t = useTranslations("FirebaseMonitoring");

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-heading">{t("metricsTitle")}</h2>
        </div>
        <p className="text-sm text-body-subtle">{t("metricsSubtitle")}</p>
      </div>
      <button className="flex items-center gap-2 px-3 py-2 border border-border-default rounded-md text-sm font-medium text-body hover:bg-neutral-secondary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {t("domain")}
        <ChevronDown className="w-4 h-4 text-body-subtle" />
      </button>
    </div>
  );
}
