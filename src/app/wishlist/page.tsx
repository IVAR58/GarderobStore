"use client";

import Link from "next/link";
import { useStore } from "@/components/providers/store-provider";
import { ProductCardSkeleton } from "@/components/ui/feedback";
import { CloseIcon, HeartIcon } from "@/components/ui/icons";
import { Breadcrumbs, ButtonLink, EmptyState, Price, ProductImage } from "@/components/ui/primitives";
import { productsCountLabel } from "@/lib/utils";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, hydrated } = useStore();

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: "Избранное" }]} />
      <div className="mt-5 flex flex-col gap-2 lg:mt-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-brand-600">Ваш список</p>
          <h1 className="display mt-2 text-[2.4rem] leading-[1] md:text-[3.4rem]">Избранное</h1>
        </div>
        {hydrated && wishlist.length > 0 && <p className="text-sm text-mist">{productsCountLabel(wishlist.length)}</p>}
      </div>

      <div className="mt-8 lg:mt-10">
        {!hydrated ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <EmptyState
            icon={<HeartIcon size={24} />}
            title="В избранном пока пусто"
            description="Нажимайте на сердечко у товаров, чтобы вернуться к ним позже — список сохранится на этом устройстве."
            action={<ButtonLink href="/catalog">Перейти в каталог</ButtonLink>}
          />
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 xl:grid-cols-4">
            {wishlist.map((item, i) => (
              <li key={item.productId} className="group relative flex flex-col animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                <Link href={`/product/${item.slug}`} className="block overflow-hidden rounded-2xl">
                  <ProductImage src={item.image} alt={item.name} className="aspect-[3/4]" imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.04]" />
                </Link>
                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-card backdrop-blur transition-colors hover:bg-white hover:text-brand-600"
                  aria-label="Убрать из избранного"
                >
                  <CloseIcon size={16} />
                </button>
                <div className="mt-3 flex flex-col gap-1 px-1">
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mist">{item.categoryName}</span>
                  <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm leading-snug hover:text-brand-600 md:text-[0.95rem]">
                    {item.name}
                  </Link>
                  <Price price={item.price} compareAtPrice={item.compareAtPrice} size="sm" />
                  <Link
                    href={`/product/${item.slug}`}
                    className="mt-2 inline-flex h-10 items-center justify-center rounded-full border border-ink text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-white"
                  >
                    Выбрать размер
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
