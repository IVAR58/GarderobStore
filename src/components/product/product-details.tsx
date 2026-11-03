"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useStore } from "@/components/providers/store-provider";
import { BagIcon, CheckIcon, ChevronDownIcon, MinusIcon, PlusIcon, ReturnIcon, ShieldIcon, TruckIcon } from "@/components/ui/icons";
import { Button, Price, ProductImage } from "@/components/ui/primitives";
import { WishlistButton } from "@/components/product/product-card";
import { site } from "@/lib/site";
import type { ProductWithCategory } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

/* ——— Галерея ——— */
export function ProductGallery({ product }: { product: ProductWithCategory }) {
  const images = product.images.length ? product.images : [null];
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Синхронизация точек с горизонтальной прокруткой на мобильных
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex((prev) => (prev === i ? prev : i));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div className="lg:flex lg:gap-4">
      {/* Миниатюры — десктоп */}
      {images.length > 1 && (
        <div className="hidden lg:flex lg:w-20 lg:flex-col lg:gap-3">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Фото ${i + 1}`}
              className={cn(
                "overflow-hidden rounded-xl border transition-all duration-300",
                i === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <ProductImage src={src} alt="" className="aspect-[3/4]" />
            </button>
          ))}
        </div>
      )}

      {/* Главное фото — десктоп с зумом */}
      <div
        className="relative hidden flex-1 cursor-zoom-in overflow-hidden rounded-3xl lg:block"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
      >
        <div
          className="h-full w-full transition-transform duration-300 ease-out"
          style={{
            transform: zoom ? "scale(1.6)" : "scale(1)",
            transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
          }}
        >
          <ProductImage key={index} src={images[index]} alt={product.name} priority className="aspect-[3/4] animate-fade-in" />
        </div>
      </div>

      {/* Карусель — мобильные */}
      <div className="lg:hidden">
        <div ref={railRef} className="-mx-4 flex snap-x snap-mandatory overflow-x-auto scrollbar-none">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="w-full shrink-0 snap-center px-4">
              <ProductImage src={src} alt={`${product.name} — фото ${i + 1}`} priority={i === 0} className="aspect-[3/4] rounded-2xl" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-6 bg-ink" : "w-1.5 bg-sand")} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ——— Панель выбора и покупки ——— */
export function PurchasePanel({ product }: { product: ProductWithCategory }) {
  const { addToCart, setCartOpen, pushToast } = useStore();
  const singleSize = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(singleSize ? product.sizes[0] : null);
  const [color, setColor] = useState<string | null>(product.colors[0]?.name ?? null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const [sizeError, setSizeError] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    if (product.sizes.length && !size) {
      setSizeError(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      pushToast({ message: "Пожалуйста, выберите размер", kind: "error" });
      return;
    }
    setStatus("adding");
    window.setTimeout(() => {
      addToCart({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.images[0] ?? null,
        size,
        color,
        quantity,
        categoryName: product.categoryName,
      });
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 1800);
    }, 350);
  };

  return (
    <>
      <div className="flex flex-col gap-7">
        {product.colors.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[0.62rem] text-mist">Цвет</span>
              <span className="text-sm text-ink">{color}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={cn(
                    "relative h-9 w-9 rounded-full border-2 transition-all duration-300",
                    color === c.name ? "border-ink scale-105" : "border-transparent hover:scale-105",
                  )}
                >
                  <span className="absolute inset-[3px] rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div ref={sizeRef}>
            <div className="flex items-center justify-between">
              <span className="eyebrow text-[0.62rem] text-mist">Размер</span>
              <Link href="/size-guide" className="nav-link text-xs text-ink-soft">
                Таблица размеров
              </Link>
            </div>
            <div className={cn("mt-3 flex flex-wrap gap-2", sizeError && "animate-pop")}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  aria-pressed={size === s}
                  className={cn(
                    "min-w-[3.25rem] rounded-full border px-4 py-2.5 text-sm transition-all duration-300",
                    size === s ? "border-ink bg-ink text-white" : "border-sand bg-white text-ink hover:border-ink",
                    sizeError && !size && "border-red-300",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {sizeError && <p className="mt-2 text-xs text-red-600">Выберите размер, чтобы добавить товар в корзину</p>}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-12 w-fit items-center rounded-full border border-sand bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-full w-11 items-center justify-center rounded-l-full text-ink transition-colors hover:bg-pearl"
              aria-label="Уменьшить количество"
            >
              <MinusIcon size={16} />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="flex h-full w-11 items-center justify-center rounded-r-full text-ink transition-colors hover:bg-pearl"
              aria-label="Увеличить количество"
            >
              <PlusIcon size={16} />
            </button>
          </div>
          <Button
            size="md"
            onClick={handleAdd}
            loading={status === "adding"}
            className={cn("flex-1", status === "added" && "bg-brand-500 hover:bg-brand-500")}
          >
            {status === "added" ? (
              <>
                <CheckIcon size={16} className="animate-check" /> Добавлено
              </>
            ) : (
              <>
                <BagIcon size={16} /> В корзину · {formatPrice(product.price * quantity)}
              </>
            )}
          </Button>
          <WishlistButton product={product} variant="inline" size={20} className="hidden sm:flex" />
        </div>

        {status === "added" && (
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="nav-link w-fit text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 animate-fade-in"
          >
            Открыть корзину
          </button>
        )}

        <ul className="grid gap-3 rounded-2xl bg-pearl p-4 text-sm text-ink-soft sm:grid-cols-3">
          <li className="flex items-start gap-2.5">
            <TruckIcon size={18} className="mt-0.5 shrink-0 text-brand-600" />
            <span>
              Доставка по Казани — {formatPrice(site.delivery.courier)}, бесплатно от {formatPrice(site.delivery.freeFrom)}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <ReturnIcon size={18} className="mt-0.5 shrink-0 text-brand-600" />
            <span>Обмен и возврат в течение 14 дней</span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldIcon size={18} className="mt-0.5 shrink-0 text-brand-600" />
            <span>Фото и видео вещи перед отправкой</span>
          </li>
        </ul>
      </div>

      {/* Липкая панель на мобильных */}
      <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 border-t border-sand bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[0.6rem] uppercase tracking-[0.18em] text-mist">Итого</span>
            <Price price={product.price * quantity} size="md" />
          </div>
          <Button size="md" onClick={handleAdd} loading={status === "adding"} className="flex-1">
            {status === "added" ? "Добавлено" : "В корзину"}
          </Button>
          <WishlistButton product={product} variant="inline" size={18} className="h-12 w-12" />
        </div>
      </div>
    </>
  );
}

/* ——— Аккордеон описания ——— */
export function Accordion({ items }: { items: Array<{ title: string; content: React.ReactNode }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-sand border-y border-sand">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : i)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-[0.14em]"
            >
              {item.title}
              <ChevronDownIcon size={18} className={cn("transition-transform duration-300", expanded && "rotate-180")} />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-400 ease-out",
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-sm leading-relaxed text-ink-soft">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
