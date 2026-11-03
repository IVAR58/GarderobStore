import type { CatalogFilters, SortKey } from "@/lib/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const SORT_KEYS: SortKey[] = ["featured", "new", "price-asc", "price-desc", "popular"];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined) {
  const v = first(value);
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function num(value: string | string[] | undefined) {
  const v = first(value);
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}

export function parseCatalogParams(raw: RawSearchParams): CatalogFilters {
  const sortRaw = first(raw.sort) as SortKey | undefined;
  return {
    sizes: list(raw.size),
    colors: list(raw.color),
    minPrice: num(raw.min),
    maxPrice: num(raw.max),
    onlyNew: first(raw.new) === "1",
    onlySale: first(raw.sale) === "1",
    q: first(raw.q)?.trim() || undefined,
    sort: sortRaw && SORT_KEYS.includes(sortRaw) ? sortRaw : "featured",
    page: num(raw.page) || 1,
  };
}

export function countActiveFilters(f: CatalogFilters) {
  let n = 0;
  n += f.sizes?.length ?? 0;
  n += f.colors?.length ?? 0;
  if (typeof f.minPrice === "number" || typeof f.maxPrice === "number") n += 1;
  if (f.onlyNew) n += 1;
  if (f.onlySale) n += 1;
  return n;
}

export function filtersKey(f: CatalogFilters) {
  return JSON.stringify([f.category, f.sizes, f.colors, f.minPrice, f.maxPrice, f.onlyNew, f.onlySale, f.q, f.sort, f.page]);
}
