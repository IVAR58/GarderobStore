"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useStore } from "@/components/providers/store-provider";
import {
  ArrowRightIcon,
  BagIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  SearchIcon,
  TelegramIcon,
  TrashIcon,
  WhatsappIcon,
} from "@/components/ui/icons";
import { ButtonLink, Logo, Price, ProductImage } from "@/components/ui/primitives";
import type { Category } from "@/db/schema";
import { site } from "@/lib/site";
import type { ProductWithCategory } from "@/lib/types";
import { cn, formatPrice, productsCountLabel } from "@/lib/utils";

function Overlay({ open, onClose, children, side }: { open: boolean; onClose: () => void; children: ReactNode; side: "left" | "right" | "top" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]">
      <button type="button" aria-label="Закрыть" onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-in" />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute flex flex-col bg-white shadow-float",
          side === "right" && "inset-y-0 right-0 w-full max-w-md animate-slide-in-right",
          side === "left" && "inset-y-0 left-0 w-[88vw] max-w-sm animate-slide-in-left",
          side === "top" && "inset-x-0 top-0 max-h-[100dvh] animate-slide-down lg:max-h-[80vh]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ——— Мобильное меню ——— */
export function MobileMenu({ categories }: { categories: Category[] }) {
  const { menuOpen, setMenuOpen, setSearchOpen } = useStore();
  const pathname = usePathname();
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  return (
    <Overlay open={menuOpen} onClose={() => setMenuOpen(false)} side="left">
      <div className="flex items-center justify-between border-b border-sand px-5 py-4">
        <Logo compact />
        <button type="button" onClick={() => setMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-pearl" aria-label="Закрыть меню">
          <CloseIcon size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            setSearchOpen(true);
          }}
          className="flex h-12 w-full items-center gap-3 rounded-full border border-sand bg-pearl px-4 text-sm text-mist"
        >
          <SearchIcon size={18} /> Найти платье, костюм, пальто…
        </button>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link href="/new" className="rounded-2xl bg-ink px-4 py-4 text-white">
            <span className="eyebrow text-[0.55rem] text-white/60">Только что</span>
            <span className="mt-1 block font-semibold">Новинки</span>
          </Link>
          <Link href="/sale" className="rounded-2xl bg-brand-100 px-4 py-4 text-ink">
            <span className="eyebrow text-[0.55rem] text-brand-600">Выгодно</span>
            <span className="mt-1 block font-semibold">Sale</span>
          </Link>
        </div>

        <p className="eyebrow mt-8 text-mist">Категории</p>
        <ul className="mt-3 divide-y divide-sand">
          <li>
            <Link href="/catalog" className="flex items-center justify-between py-3.5 text-[0.95rem] font-medium">
              Все товары <ChevronRightIcon size={16} className="text-mist" />
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/catalog/${c.slug}`} className="flex items-center justify-between py-3.5 text-[0.95rem]">
                <span className="flex items-center gap-3">
                  <ProductImage src={c.image} alt="" className="h-10 w-8 rounded-md" />
                  {c.name}
                </span>
                <ChevronRightIcon size={16} className="text-mist" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="eyebrow mt-8 text-mist">Garderob</p>
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-ink-soft">
          {[
            ["О бренде", "/about"],
            ["Магазины", "/stores"],
            ["Отзывы", "/reviews"],
            ["Доставка и возврат", "/delivery"],
            ["Таблица размеров", "/size-guide"],
            ["Избранное", "/wishlist"],
          ].map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="transition-colors hover:text-ink">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-sand bg-pearl px-5 py-4 text-sm">
        <a href={site.phoneHref} className="flex items-center gap-2 font-medium">
          <PhoneIcon size={16} /> {site.phone}
        </a>
        <p className="mt-1.5 flex items-center gap-2 text-ink-soft">
          <ClockIcon size={16} /> {site.hoursShort}
        </p>
        <div className="mt-3 flex gap-2">
          <a href={site.socials.telegram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white" aria-label="Telegram">
            <TelegramIcon size={16} />
          </a>
          <a href={site.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white" aria-label="WhatsApp">
            <WhatsappIcon size={16} />
          </a>
        </div>
      </div>
    </Overlay>
  );
}

/* ——— Корзина (выезжающая) ——— */
export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, cartSubtotal, cartCount, updateQuantity, removeFromCart } = useStore();
  const pathname = usePathname();
  useEffect(() => setCartOpen(false), [pathname, setCartOpen]);

  const remaining = Math.max(0, site.delivery.freeFrom - cartSubtotal);
  const progress = Math.min(100, Math.round((cartSubtotal / site.delivery.freeFrom) * 100));

  return (
    <Overlay open={cartOpen} onClose={() => setCartOpen(false)} side="right">
      <div className="flex items-center justify-between border-b border-sand px-5 py-4">
        <div>
          <h2 className="display text-2xl">Корзина</h2>
          <p className="text-xs text-mist">{cartCount ? productsCountLabel(cartCount) : "Пока пусто"}</p>
        </div>
        <button type="button" onClick={() => setCartOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-pearl" aria-label="Закрыть корзину">
          <CloseIcon size={20} />
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <BagIcon size={26} />
          </span>
          <p className="display text-2xl">В корзине пока пусто</p>
          <p className="text-sm text-ink-soft">Загляните в новинки — там точно найдётся что-то для вас.</p>
          <ButtonLink href="/catalog" variant="primary" className="mt-2">
            Перейти в каталог
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="border-b border-sand px-5 py-3">
            <p className="text-xs text-ink-soft">
              {remaining > 0 ? (
                <>
                  До бесплатной доставки осталось <span className="font-semibold text-ink">{formatPrice(remaining)}</span>
                </>
              ) : (
                <span className="font-semibold text-brand-600">Доставка по Казани — бесплатно 🎀</span>
              )}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-pearl">
              <div className="h-full rounded-full bg-brand-400 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="flex-1 divide-y divide-sand overflow-y-auto px-5">
            {cart.map((line) => (
              <li key={line.key} className="flex gap-4 py-4 animate-fade-in">
                <Link href={`/product/${line.slug}`} className="shrink-0">
                  <ProductImage src={line.image} alt={line.name} className="h-28 w-[5.25rem] rounded-xl" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/product/${line.slug}`} className="line-clamp-2 text-sm font-medium leading-snug hover:text-brand-600">
                        {line.name}
                      </Link>
                      <p className="mt-1 text-xs text-mist">
                        {[line.color, line.size].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <button type="button" onClick={() => removeFromCart(line.key)} className="text-mist transition-colors hover:text-ink" aria-label="Удалить">
                      <TrashIcon size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line.key, q)} size="sm" />
                    <Price price={line.price * line.quantity} size="sm" />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-sand px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-soft">Сумма</span>
              <span className="text-lg font-semibold">{formatPrice(cartSubtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-mist">Доставка и промокод рассчитываются при оформлении</p>
            <div className="mt-4 grid gap-2">
              <ButtonLink href="/checkout" full>
                Оформить заказ <ArrowRightIcon size={16} />
              </ButtonLink>
              <ButtonLink href="/cart" variant="secondary" full>
                Перейти в корзину
              </ButtonLink>
            </div>
          </div>
        </>
      )}
    </Overlay>
  );
}

export function QuantityStepper({ value, onChange, size = "md" }: { value: number; onChange: (q: number) => void; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-9" : "h-11";
  const w = size === "sm" ? "w-9" : "w-11";
  return (
    <div className={cn("flex w-fit items-center rounded-full border border-sand bg-white", h)}>
      <button type="button" onClick={() => onChange(value - 1)} className={cn("flex h-full items-center justify-center rounded-l-full transition-colors hover:bg-pearl", w)} aria-label="Уменьшить">
        <MinusIcon size={14} />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" key={value}>
        {value}
      </span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= 10} className={cn("flex h-full items-center justify-center rounded-r-full transition-colors hover:bg-pearl disabled:opacity-40", w)} aria-label="Увеличить">
        <PlusIcon size={14} />
      </button>
    </div>
  );
}

/* ——— Поиск ——— */
const popularQueries = ["Платье", "Костюм", "Пальто", "Джинсы", "Серьги", "Пижама"];

export function SearchOverlay({ categories }: { categories: Category[] }) {
  const { searchOpen, setSearchOpen } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setSearchOpen(false), [pathname, setSearchOpen]);
  useEffect(() => {
    if (searchOpen) window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const data = (await res.json()) as { items: ProductWithCategory[] };
        setResults(data.items ?? []);
      } catch {
        /* отменено */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  return (
    <Overlay open={searchOpen} onClose={() => setSearchOpen(false)} side="top">
      <div className="mx-auto w-full max-w-3xl px-4 py-5 lg:px-8 lg:py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
          className="flex items-center gap-3 border-b border-ink pb-3"
          role="search"
        >
          <SearchIcon size={22} className="shrink-0 text-mist" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Что ищем?"
            className="w-full bg-transparent text-xl outline-none placeholder:text-mist lg:text-2xl"
            aria-label="Поиск по каталогу"
            autoComplete="off"
          />
          <button type="button" onClick={() => setSearchOpen(false)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-pearl" aria-label="Закрыть поиск">
            <CloseIcon size={20} />
          </button>
        </form>

        <div className="max-h-[60dvh] overflow-y-auto pt-5">
          {query.trim().length >= 2 ? (
            <div>
              {loading && results.length === 0 ? (
                <p className="text-sm text-mist">Ищем…</p>
              ) : results.length ? (
                <>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link href={`/product/${p.slug}`} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-pearl">
                          <ProductImage src={p.images[0]} alt={p.name} className="h-16 w-12 rounded-lg" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{p.name}</span>
                            <span className="block text-xs text-mist">{p.categoryName}</span>
                            <Price price={p.price} compareAtPrice={p.compareAtPrice} size="sm" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => submit(query)} className="mt-4 inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-600">
                    Все результаты <ArrowRightIcon size={14} />
                  </button>
                </>
              ) : (
                <p className="text-sm text-mist">Ничего не нашли по запросу «{query}». Попробуйте другое слово или загляните в каталог.</p>
              )}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-mist">Часто ищут</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularQueries.map((q) => (
                    <button key={q} type="button" onClick={() => submit(q)} className="rounded-full border border-sand px-4 py-2 text-sm transition-colors hover:border-ink">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow text-mist">Категории</p>
                <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link href={`/catalog/${c.slug}`} className="transition-colors hover:text-brand-600">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
}
