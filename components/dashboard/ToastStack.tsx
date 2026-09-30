"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDashboard } from "@/components/dashboard/DashboardProvider";

type ToastVariant = "nudge" | "info" | "success";

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
  durationMs?: number;
};

type ToastContextValue = {
  push: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastStack");
  return ctx;
}

const NUDGE_MESSAGES = [
  "Wouldn't you rather invest $9.99 in real estate instead of buying a morning coffee?",
  "Your next latte costs the same as a fractional stake in a Dubai property.",
  "Skip one takeaway this week — and own a piece of UAE real estate instead.",
  "The average Dubai apartment grew 17% last year. A coffee grew 0%.",
];

const NUDGE_DELAY_MS = 30_000;
const NUDGE_KEY = "chesstate_nudge_last";

function variantStyles(variant: ToastVariant) {
  switch (variant) {
    case "nudge":
      return "border-gold/30 bg-[#0e1f36]";
    case "success":
      return "border-[#3EA88C]/30 bg-[#0a1e1a]";
    default:
      return "border-cream/15 bg-[#0e1f36]";
  }
}

function variantIcon(variant: ToastVariant) {
  if (variant === "nudge") {
    return (
      <span className="text-gold" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Z" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M8 7v3.5M8 5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </span>
    );
  }
  if (variant === "success") {
    return (
      <span className="text-[#3EA88C]" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  }
  return null;
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, toast.durationMs ?? 7000);
    return () => clearTimeout(t);
  }, [toast.durationMs, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      className={`flex w-full max-w-[340px] items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-sm ${variantStyles(toast.variant)}`}
    >
      {variantIcon(toast.variant) && (
        <span className="mt-0.5 shrink-0">{variantIcon(toast.variant)}</span>
      )}
      <p className="flex-1 font-sans text-[13px] leading-relaxed text-cream/85">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="mt-0.5 shrink-0 text-cream/35 transition hover:text-cream/70"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </motion.div>
  );
}

export function ToastStack({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { state } = useDashboard();
  const nudgeFired = useRef(false);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast_${Date.now().toString(36)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (nudgeFired.current) return;
    if (state.investments.length > 0) return;

    const last = Number(localStorage.getItem(NUDGE_KEY) ?? 0);
    const hourAgo = Date.now() - 60 * 60 * 1000;
    if (last > hourAgo) return;

    const timer = setTimeout(() => {
      if (nudgeFired.current) return;
      nudgeFired.current = true;
      localStorage.setItem(NUDGE_KEY, String(Date.now()));
      const msg = NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)];
      push({ message: msg, variant: "nudge", durationMs: 10_000 });
    }, NUDGE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [state.investments.length, push]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        aria-label="Notifications"
        className="pointer-events-none fixed bottom-6 right-4 z-[100] flex flex-col items-end gap-3 sm:right-6"
      >
        <AnimatePresence mode="sync">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto w-full">
              <ToastItem toast={toast} onDismiss={() => dismiss(toast.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
