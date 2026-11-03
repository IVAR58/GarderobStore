"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useNavProgress } from "@/components/ui/feedback";
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, FilterIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/primitives";
import type { Category } from "@/db/schema";
import { countActiveFilters } from "@/lib/catalog-params";
import { SORT_OPTIONS, type CatalogFilters, type FilterOptions, type SortKey } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

/* ——— Хук для обновления URL-параметров ——— */
function useCatalogNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { start } = useNavProgress();

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void, options?: { keepPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      if (!options?.keepPage) params.delete("page");
      start();
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams, start],
  );

  const toggleInList = useCallback(
    (key: string, value: string) => {
      update((params) => {
        const current = params.get(key)?.split(",").filter(Boolean) ?? [];
        const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
        if (next.length) params.set(key, next.join(","));
        else params.delete(key);
      });
    },
    [update],
  );

  return { update, toggleInList, pathname, searchParams };
}

/* ——— Чипсы категорий ——— */
export function CategoryChips({ categories, activeSlug, basePath = "/catalog" }: { categories: Category[]; activeSlug?: string; basePath?: string }) {
  const { start } = useNavProgress();
  return (
    <div className="-mx-4 overflow-x-auto px-4 scrollbar-none lg:mx-0 lg:px-0">
      <ul className="flex w-max gap-2 pb-1">
        <li>
          <Link
            href={basePath}
            onClick={() => activeSlug && start()}
            className={cn(
              "inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors",
              !activeSlug ? "border-ink bg-ink text-white" : "border-sand bg-white text-ink hover:border-ink",
            )}
          >
            Все
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/catalog/${c.slug}`}
              onClick={() => activeSlug !== c.slug && start()}
              className={cn(
                "inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors",
                activeSlug === c.slug ? "border-ink bg-ink text-white" : "border-sand bg-white text-ink hover:border-ink",
              )}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ——— Сортировка ——— */
export function SortSelect({ value }: { value: SortKey }) {
  const { update } = useCatalogNavigation();
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Сортировка</span>
      <select
        value={value}
        onChange={(e) => update((p) => (e.target.value === "featured" ? p.delete("sort") : p.set("sort", e.target.value)), { keepPage: false })}
        className="h-10 appearance-none rounded-full border border-sand bg-white pl-4 pr-10 text-sm text-ink outline-none transition-colors hover:border-ink focus:border-brand-400"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon size={16} className="pointer-events-none absolute right-3.5 text-mist" />
    </label>
  );
}

/* ——— Панель фильтров ——— */
function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-sand py-4">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
        {title}
        <ChevronDownIcon size={16} className={cn("transition-transform duration-300", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-300", open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export function FilterPanel({ options, filters, lockedCategory }: { options: FilterOptions; filters: CatalogFilters; lockedCategory?: string }) {
  const { update, toggleInList, pathname } = useCatalogNavigation();
  const [min, setMin] = useState(filters.minPrice?.toString() ?? "");
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? "");
  const [syncedRange, setSyncedRange] = useState<[number | undefined, number | undefined]>([filters.minPrice, filters.maxPrice]);
  if (syncedRange[0] !== filters.minPrice || syncedRange[1] !== filters.maxPrice) {
    // Сбрасываем поля, когда диапазон в URL изменился извне (например, через «Сбросить»).
    setSyncedRange([filters.minPrice, filters.maxPrice]);
    setMin(filters.minPrice?.toString() ?? "");
    setMax(filters.maxPrice?.toString() ?? "");
  }

  const applyPrice = () => {
    update((p) => {
      if (min) p.set("min", min);
      else p.delete("min");
      if (max) p.set("max", max);
      else p.delete("max");
    });
  };

  const active = countActiveFilters(filters);

  return (
    <div>
      {active > 0 && (
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs text-mist">Активно: {active}</span>
          <Link href={pathname} className="nav-link text-xs font-semibold uppercase tracking-[0.16em] text-brand-600" scroll={false}>
            Сбросить
          </Link>
        </div>
      )}

      {!lockedCategory && (
        <FilterGroup title="Категория">
          <ul className="space-y-2 text-sm">
            {options.categories.map((c) => (
              <li key={c.id}>
                <Link href={`/catalog/${c.slug}`} className="flex items-center justify-between text-ink-soft transition-colors hover:text-ink">
                  {c.name}
                  <ChevronRightIcon size={14} className="text-mist" />
                </Link>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Подборки">
        <div className="flex flex-col gap-2.5 text-sm">
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={Boolean(filters.onlyNew)} onChange={() => update((p) => (filters.onlyNew ? p.delete("new") : p.set("new", "1")))} />
            Только новинки
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <Checkbox checked={Boolean(filters.onlySale)} onChange={() => update((p) => (filters.onlySale ? p.delete("sale") : p.set("sale", "1")))} />
            Со скидкой
          </label>
        </div>
      </FilterGroup>

      {options.sizes.length > 0 && (
        <FilterGroup title="Размер">
          <div className="flex flex-wrap gap-2">
            {options.sizes.map((s) => {
              const on = filters.sizes?.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleInList("size", s)}
                  className={cn(
                    "min-w-[2.75rem] rounded-full border px-3 py-2 text-xs transition-all",
                    on ? "border-ink bg-ink text-white" : "border-sand bg-white hover:border-ink",
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      {options.colors.length > 0 && (
        <FilterGroup title="Цвет">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {options.colors.map((c) => {
              const on = filters.colors?.includes(c.name);
              return (
                <button key={c.name} type="button" aria-pressed={on} onClick={() => toggleInList("color", c.name)} className="flex items-center gap-2.5 text-left text-sm">
                  <span className={cn("relative h-5 w-5 rounded-full border transition-all", on ? "border-ink ring-2 ring-ink/10" : "border-black/10")} style={{ backgroundColor: c.hex }}>
                    {on && <CheckIcon size={12} className={cn("absolute inset-0 m-auto", isLight(c.hex) ? "text-ink" : "text-white")} />}
                  </span>
                  <span className={cn(on ? "text-ink" : "text-ink-soft")}>{c.name}</span>
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Цена">
        <div className="flex items-center gap-2">
          <input type="number" inputMode="numeric" min={0} value={min} onChange={(e) => setMin(e.target.value)} placeholder={String(options.minPrice)} className="field !py-2.5 text-sm" aria-label="Цена от" />
          <span className="text-mist">—</span>
          <input type="number" inputMode="numeric" min={0} value={max} onChange={(e) => setMax(e.target.value)} placeholder={String(options.maxPrice)} className="field !py-2.5 text-sm" aria-label="Цена до" />
        </div>
        <p className="mt-2 text-xs text-mist">
          Диапазон: {formatPrice(options.minPrice)} – {formatPrice(options.maxPrice)}
        </p>
        <Button variant="secondary" size="sm" onClick={applyPrice} className="mt-3 w-full">
          Применить
        </Button>
      </FilterGroup>
    </div>
  );
}

function isLight(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span className="relative inline-flex">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex h-5 w-5 items-center justify-center rounded-md border border-sand bg-white transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300">
        {checked && <CheckIcon size={12} className="text-white" />}
      </span>
    </span>
  );
}

/* ——— Активные фильтры ——— */
export function ActiveFilters({ filters }: { filters: CatalogFilters }) {
  const { update, toggleInList, pathname } = useCatalogNavigation();
  const chips: Array<{ label: string; onRemove: () => void }> = [];
  filters.sizes?.forEach((s) => chips.push({ label: `Размер ${s}`, onRemove: () => toggleInList("size", s) }));
  filters.colors?.forEach((c) => chips.push({ label: c, onRemove: () => toggleInList("color", c) }));
  if (typeof filters.minPrice === "number" || typeof filters.maxPrice === "number") {
    chips.push({
      label: `${filters.minPrice ? `от ${formatPrice(filters.minPrice)}` : ""} ${filters.maxPrice ? `до ${formatPrice(filters.maxPrice)}` : ""}`.trim(),
      onRemove: () =>
        update((p) => {
          p.delete("min");
          p.delete("max");
        }),
    });
  }
  if (filters.onlyNew) chips.push({ label: "Новинки", onRemove: () => update((p) => p.delete("new")) });
  if (filters.onlySale) chips.push({ label: "Со скидкой", onRemove: () => update((p) => p.delete("sale")) });
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button key={chip.label} type="button" onClick={chip.onRemove} className="inline-flex items-center gap-1.5 rounded-full bg-pearl px-3 py-1.5 text-xs text-ink transition-colors hover:bg-brand-100">
          {chip.label}
          <CloseIcon size={12} />
        </button>
      ))}
      <Link href={pathname} scroll={false} className="text-xs text-mist underline-offset-4 hover:underline">
        Очистить всё
      </Link>
    </div>
  );
}

/* ——— Мобильная кнопка и выезжающая панель фильтров ——— */
export function MobileFilters({ options, filters, lockedCategory }: { options: FilterOptions; filters: CatalogFilters; lockedCategory?: string }) {
  const [open, setOpen] = useState(false);
  const active = countActiveFilters(filters);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-full border border-sand bg-white px-4 text-sm transition-colors hover:border-ink lg:hidden">
        <FilterIcon size={16} /> Фильтры
        {active > 0 && <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[0.65rem] font-bold text-white">{active}</span>}
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button type="button" aria-label="Закрыть" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/40 animate-fade-in" />
          <div role="dialog" aria-modal="true" className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl bg-white animate-slide-up">
            <div className="flex items-center justify-between border-b border-sand px-5 py-4">
              <h2 className="display text-2xl">Фильтры</h2>
              <button type="button" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-pearl" aria-label="Закрыть">
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">
              <FilterPanel options={options} filters={filters} lockedCategory={lockedCategory} />
            </div>
            <div className="border-t border-sand p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <Button full onClick={() => setOpen(false)}>
                Показать товары
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ——— Пагинация ——— */
export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const { searchParams, pathname } = useCatalogNavigation();
  const { start } = useNavProgress();
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <nav aria-label="Пагинация" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} onClick={start} className="flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white transition-colors hover:border-ink" aria-label="Предыдущая страница">
          <ChevronLeftIcon size={16} />
        </Link>
      )}
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-mist">…</span>}
            <Link
              href={hrefFor(p)}
              onClick={start}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "flex h-10 min-w-[2.5rem] items-center justify-center rounded-full border px-3 text-sm transition-colors",
                p === page ? "border-ink bg-ink text-white" : "border-sand bg-white hover:border-ink",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} onClick={start} className="flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-white transition-colors hover:border-ink" aria-label="Следующая страница">
          <ChevronRightIcon size={16} />
        </Link>
      )}
    </nav>
  );
}
