"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFirebaseData } from "@/components/app/shell/firebase/page/provider";
import { useRouter } from "next/navigation";
import { recordFirebaseData } from "@/app/actions/firebase";
import type { FirebaseData } from "@/script/app/firebase/types";
import { cn } from "@/lib/utils";

export function MetricsHeader() {
  const t = useTranslations("FirebaseMonitoring");
  const router = useRouter();
  const { data } = useFirebaseData();
  const [isRecording, setIsRecording] = useState(false);
  const queueRef = useRef<FirebaseData[]>([]);
  const isFlushingRef = useRef(false);

  useEffect(() => {
    if (isRecording && data) {
      queueRef.current.push(data);
      flushQueue();
    }
  }, [data, isRecording]);

  const flushQueue = async () => {
    if (isFlushingRef.current || queueRef.current.length === 0) return;
    
    isFlushingRef.current = true;
    const itemsToFlush = [...queueRef.current];
    
    try {
      const result = await recordFirebaseData(itemsToFlush);
      if (result.success) {
        // Remove successfully saved items from the queue
        queueRef.current = queueRef.current.filter(item => !itemsToFlush.includes(item));
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to flush queue:", error);
      // Items remain in the queue for the next retry
    } finally {
      isFlushingRef.current = false;
    }
  };

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-heading">{t("metricsTitle")}</h2>
        </div>
        <p className="text-sm text-body-subtle">{t("metricsSubtitle")}</p>
      </div>
      <button 
        onClick={toggleRecording}
        className={cn(
          "flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isRecording 
            ? "bg-success text-white border-success-subtle hover:bg-success-medium"
            : "bg-danger text-white border-danger-subtle hover:bg-danger-medium"
        )}
      >
        {isRecording ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {isRecording ? t("recordingLive") : t("notRecording")}
      </button>
    </div>
  );
}
