"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFirebaseData } from "@/components/app/shell/firebase/page/provider";
import { useRouter } from "next/navigation";
import { recordFirebaseData } from "@/script/app/actions/firebase";
import type { FirebaseData } from "@/script/app/firebase/types";
import { cn } from "@/lib/utils";

// --- TEMPORARY MANUAL MANIPULATION ---
// Delete this function and its call inside useFirebaseRecorder anytime
function manipulateFirebaseData(data: FirebaseData, offsetDays: number) {
  // Number of days to offset backwards from current date
  const offsetMs = offsetDays * 24 * 60 * 60 * 1000;
  const offsetDate = new Date(Date.now() - offsetMs);

  return {
    ...data,
    // Manually manipulate last_updated and createdAt here
    last_updated: offsetDate.getTime(),
    createdAt: offsetDate.toISOString(),
  } as FirebaseData;
}
// --------------------------------------

function useFirebaseRecorder(data: FirebaseData | null, isRecording: boolean, toggleRecording: () => void) {
  const router = useRouter();
  const queueRef = useRef<FirebaseData[]>([]);
  const isFlushingRef = useRef(false);
  const [counter, setCounter] = useState(0);
  const [multDate, setMultDate] = useState(36);

  const decreaseMultDate = () => {
    setMultDate(prev => prev - 1);
  };

  const addCounter = () => {
    setCounter(prev => prev + 1);
  };

  useEffect(() => {
    if (multDate === 0 && isRecording) {
      toggleRecording();
    }
    if (isRecording && counter >= 200) {
      if (counter === 200) {
        decreaseMultDate();
      }
      setCounter(0);
    }
  }, [counter, isRecording, toggleRecording, multDate]);

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

  useEffect(() => {
    if (isRecording && data && counter < 200) {
      queueRef.current.push(manipulateFirebaseData(data, multDate));
      addCounter();
      flushQueue();
    }
  }, [data, isRecording]);
}

export function MetricsHeader() {
  const t = useTranslations("FirebaseMonitoring");
  const { data } = useFirebaseData();
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  useFirebaseRecorder(data, isRecording, toggleRecording);

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
