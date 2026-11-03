"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import { useNavProgress } from "@/components/ui/feedback";
import { HeartIcon } from "@/components/ui/icons";
import { Badge, Price, ProductImage } from "@/components/ui/primitives";
import type { ProductWithCategory } from "@/lib/types";
import { cn, discountPercent } from "@/lib/utils";

export function WishlistButton({
  product,
  className,
  size = 18,
  variant = "overlay",
}: {
  product: Pick<ProductWithCategory, "id" | "slug" | "name" | "price" | "compareAtPrice" | "images" | "categoryName">;
  className?: string;
  size?: number;
  variant?: "overlay" | "inline";
}) {
  const { isWishlisted, toggleWishlist, hydrated } = useStore();
  const [bump, setBump] = useState(false);
  const active = hydrated && isWishlisted(product.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setBump(true);
        window.setTimeout(() => setBump(false), 500);
        toggleWishlist({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.images[0] ?? null,
          categoryName: product.categoryName,
        });
      }}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-300",
        variant === "overlay" && "h-9 w-9 bg-white/90 shadow-card backdrop-blur hover:bg-white",
        variant === "inline" && "h-12 w-12 border border-sand bg-white hover:border-ink",
        active ? "text-brand-500" : "text-ink hover:text-brand-500",
        className,
      )}
    >
      <HeartIcon size={size} filled={active} className={cn(bump && "animate-heart")} />
    </button>
  );
}

export function ProductCard({
  product,
  priority,
  compact,
}: {
  product: ProductWithCategory;
  priority?: boolean;
  compact?: boolean;
}) {
  const [primary, secondary] = product.images;
  const discount = discountPercent(product.price, product.compareAtPrice);
  const { start } = useNavProgress();

  return (
    <article className="group relative flex flex-col">
      <Link href={`/product/${product.slug}`} onClick={start} className="relative block overflow-hidden rounded-2xl" aria-label={product.name}>
        <ProductImage
          src={primary}
          alt={product.name}
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="aspect-[3/4]"
          imgClassName={cn(
            "transition-transform duration-[1200ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.04]",
            secondary && "group-hover:opacity-0",
          )}
        />
        {secondary && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100">
            <ProductImage src={secondary} alt="" className="h-full w-full" imgClassName="scale-[1.02]" />
          </div>
        )}

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge tone="sale">−{discount}%</Badge>}
          {product.isNew && <Badge tone="white">New</Badge>}
          {!product.isNew && product.isBestseller && <Badge tone="brand">Хит</Badge>}
        </div>

        {/* Подпись «Подробнее» на десктопе */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <span className="flex h-11 items-center justify-center rounded-full bg-white/95 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink shadow-card backdrop-blur">
            Смотреть
          </span>
        </div>
      </Link>

      <div className="absolute right-3 top-3">
        <WishlistButton product={product} />
      </div>

      <div className={cn("mt-3 flex flex-col gap-1", compact ? "px-0.5" : "px-1")}>
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mist">{product.categoryName}</span>
        <Link href={`/product/${product.slug}`} onClick={start} className="line-clamp-2 text-sm leading-snug text-ink transition-colors hover:text-brand-600 md:text-[0.95rem]">
          {product.name}
        </Link>
        <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" className="mt-0.5" />
        {product.colors.length > 1 && (
          <div className="mt-1 flex items-center gap-1.5" aria-label="Доступные цвета">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 5 && <span className="text-[0.65rem] text-mist">+{product.colors.length - 5}</span>}
          </div>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  columns = 4,
  priorityCount = 0,
}: {
  products: ProductWithCategory[];
  columns?: 3 | 4;
  priorityCount?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10",
        columns === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3",
      )}
    >
      {products.map((p, i) => (
        <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
          <ProductCard product={p} priority={i < priorityCount} />
        </div>
      ))}
    </div>
  );
}

/* Горизонтальная лента товаров для мобильных и десктопа (на главной) */
export function ProductRail({ products }: { products: ProductWithCategory[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 xl:grid-cols-4">
      {products.map((p, i) => (
        <div key={p.id} className="w-[68vw] shrink-0 snap-start sm:w-[44vw] md:w-auto">
          <ProductCard product={p} priority={i < 2} />
        </div>
      ))}
    </div>
  );
}
