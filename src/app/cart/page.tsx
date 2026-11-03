"use client";

import Link from "next/link";
import { useState } from "react";
import { QuantityStepper } from "@/components/layout/drawers";
import { useStore } from "@/components/providers/store-provider";
import { ArrowRightIcon, BagIcon, CheckIcon, TrashIcon } from "@/components/ui/icons";
import { Breadcrumbs, Button, ButtonLink, EmptyState, Price, ProductImage } from "@/components/ui/primitives";
import { site } from "@/lib/site";
import { formatPrice, productsCountLabel } from "@/lib/utils";

export default function CartPage() {
  const { cart, cartCount, cartSubtotal, updateQuantity, removeFromCart, clearCart, hydrated, promoCode, setPromoCode, pushToast } = useStore();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const discountPercent = site.promoCodes[promoCode] ?? 0;
  const discount = Math.round((cartSubtotal * discountPercent) / 100);
  const afterDiscount = cartSubtotal - discount;
  const deliveryEstimate = afterDiscount >= site.delivery.freeFrom ? 0 : site.delivery.courier;
  const remaining = Math.max(0, site.delivery.freeFrom - afterDiscount);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (site.promoCodes[code]) {
      setPromoCode(code);
      setPromoError("");
      setPromoInput("");
      pushToast({ message: `Промокод ${code} применён: −${site.promoCodes[code]}%`, kind: "success" });
    } else {
      setPromoError("Такого промокода нет. Попробуйте GB10 или WELCOME.");
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: "Корзина" }]} />
      <div className="mt-5 flex flex-col gap-2 lg:mt-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-brand-600">Почти готово</p>
          <h1 className="display mt-2 text-[2.4rem] leading-[1] md:text-[3.4rem]">Корзина</h1>
        </div>
        {hydrated && cart.length > 0 && (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-mist">{productsCountLabel(cartCount)}</span>
            <button type="button" onClick={clearCart} className="nav-link text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
              Очистить
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 lg:mt-10">
        {!hydrated ? (
          <div className="grid gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="skeleton h-36 rounded-2xl" />
            ))}
          </div>
        ) : cart.length === 0 ? (
          <EmptyState
            icon={<BagIcon size={24} />}
            title="Корзина пуста"
            description="Самое время подобрать что-то красивое. Начните с новинок или бестселлеров."
            action={
              <div className="flex flex-col gap-2 sm:flex-row">
                <ButtonLink href="/new">Новинки</ButtonLink>
                <ButtonLink href="/catalog" variant="outline">
                  Каталог
                </ButtonLink>
              </div>
            }
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
            <ul className="divide-y divide-sand border-y border-sand">
              {cart.map((line) => (
                <li key={line.key} className="flex gap-4 py-5 md:gap-6 md:py-6 animate-fade-in">
                  <Link href={`/product/${line.slug}`} className="shrink-0">
                    <ProductImage src={line.image} alt={line.name} className="h-36 w-28 rounded-xl md:h-44 md:w-32" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-mist">{line.categoryName}</p>
                        <Link href={`/product/${line.slug}`} className="mt-1 line-clamp-2 text-[0.95rem] font-medium leading-snug hover:text-brand-600 md:text-base">
                          {line.name}
                        </Link>
                        <p className="mt-1 text-xs text-mist">
                          {[line.color && `Цвет: ${line.color}`, line.size && `Размер: ${line.size}`].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(line.key)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-mist transition-colors hover:bg-pearl hover:text-ink" aria-label="Удалить из корзины">
                        <TrashIcon size={17} />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                      <QuantityStepper value={line.quantity} onChange={(q) => updateQuantity(line.key, q)} />
                      <div className="text-right">
                        <Price price={line.price * line.quantity} compareAtPrice={line.compareAtPrice ? line.compareAtPrice * line.quantity : null} />
                        {line.quantity > 1 && <p className="text-xs text-mist">{formatPrice(line.price)} за шт.</p>}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="rounded-3xl border border-sand bg-white p-6 lg:sticky lg:top-32">
              <h2 className="display text-2xl">Итого</h2>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-mist" htmlFor="promo">
                  Промокод
                </label>
                {promoCode ? (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3 text-sm">
                    <span className="flex items-center gap-2 font-medium text-brand-700">
                      <CheckIcon size={16} /> {promoCode} · −{discountPercent}%
                    </span>
                    <button type="button" onClick={() => setPromoCode("")} className="text-xs text-mist underline-offset-4 hover:underline">
                      Убрать
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-2 flex gap-2">
                      <input
                        id="promo"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                        placeholder="Например, GB10"
                        className="field !py-2.5 uppercase"
                        aria-invalid={Boolean(promoError)}
                      />
                      <Button variant="secondary" size="sm" onClick={applyPromo} className="h-auto shrink-0 px-4">
                        Применить
                      </Button>
                    </div>
                    {promoError && <p className="mt-2 text-xs text-red-600">{promoError}</p>}
                  </>
                )}
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Товары ({cartCount})</dt>
                  <dd className="tabular-nums">{formatPrice(cartSubtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-700">
                    <dt>Скидка по промокоду</dt>
                    <dd className="tabular-nums">−{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Доставка по Казани</dt>
                  <dd className="tabular-nums">{deliveryEstimate === 0 ? <span className="text-brand-700">Бесплатно</span> : formatPrice(deliveryEstimate)}</dd>
                </div>
                <div className="flex justify-between border-t border-sand pt-3 text-base font-semibold">
                  <dt>К оплате</dt>
                  <dd className="tabular-nums">{formatPrice(afterDiscount + deliveryEstimate)}</dd>
                </div>
              </dl>
              {remaining > 0 && (
                <p className="mt-3 text-xs text-mist">
                  Добавьте товаров ещё на {formatPrice(remaining)} — и доставка будет бесплатной.
                </p>
              )}

              <ButtonLink href="/checkout" full size="lg" className="mt-6">
                Оформить заказ <ArrowRightIcon size={16} />
              </ButtonLink>
              <Link href="/catalog" className="mt-4 block text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-ink">
                Продолжить покупки
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
