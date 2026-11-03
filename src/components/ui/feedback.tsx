"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, Suspense, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useStore } from "@/components/providers/store-provider";
import { cn } from "@/lib/utils";
import { CheckIcon, CloseIcon, HeartIcon } from "./icons";

/* ——— Уведомления ——— */
export function Toaster() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[90] flex flex-col items-center gap-2 px-4 lg:bottom-8 lg:items-end lg:px-8">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-sand bg-white/95 px-4 py-3 shadow-float backdrop-blur animate-toast-in"
        >
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              toast.kind === "wishlist" ? "bg-brand-100 text-brand-600" : toast.kind === "error" ? "bg-red-50 text-red-600" : "bg-ink text-white",
            )}
          >
            {toast.kind === "wishlist" ? <HeartIcon size={15} filled className="animate-heart" /> : toast.kind === "error" ? <CloseIcon size={15} /> : <CheckIcon size={15} className="animate-check" />}
          </span>
          <p className="line-clamp-2 flex-1 text-sm text-ink">{toast.message}</p>
          {toast.href && toast.actionLabel && (
            <Link
              href={toast.href}
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand-600 transition-colors hover:text-ink"
            >
              {toast.actionLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 rounded-full p-1 text-mist transition-colors hover:text-ink"
            aria-label="Закрыть уведомление"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ——— Индикатор загрузки при переходах ——— */
const ProgressContext = createContext<{ start: () => void }>({ start: () => {} });

function ProgressWatcher({ onRouteChange }: { onRouteChange: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = `${pathname}?${searchParams.toString()}`;
  useEffect(() => {
    onRouteChange();
  }, [key, onRouteChange]);
  return null;
}

export function NavProgressProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const timer = useRef<number | null>(null);
  const stop = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setActive(false);
  }, []);
  const start = useCallback(() => {
    setActive(true);
    if (timer.current) window.clearTimeout(timer.current);
    // Страховка: если маршрут не изменился (клик по текущей странице), скрываем индикатор.
    timer.current = window.setTimeout(() => setActive(false), 6000);
  }, []);
  return (
    <ProgressContext.Provider value={{ start }}>
      <Suspense fallback={null}>
        <ProgressWatcher onRouteChange={stop} />
      </Suspense>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-brand-400 transition-opacity duration-300",
          active ? "animate-progress opacity-100" : "opacity-0",
        )}
      />
      {children}
    </ProgressContext.Provider>
  );
}

export function useNavProgress() {
  return useContext(ProgressContext);
}

/* ——— Скелетоны ——— */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="skeleton aspect-[3/4] rounded-2xl" />
      <div className="skeleton h-3 w-1/3 rounded-full" />
      <div className="skeleton h-4 w-3/4 rounded-full" />
      <div className="skeleton h-4 w-1/4 rounded-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
