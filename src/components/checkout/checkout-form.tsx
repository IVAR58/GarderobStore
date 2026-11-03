"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useStore } from "@/components/providers/store-provider";
import { ArrowRightIcon, BagIcon, CheckIcon, ChevronDownIcon } from "@/components/ui/icons";
import { Button, ButtonLink, EmptyState, ProductImage } from "@/components/ui/primitives";
import type { Store } from "@/db/schema";
import { site } from "@/lib/site";
import type { DeliveryMethod, PaymentMethod } from "@/lib/types";
import { cn, formatPhoneInput, formatPrice, isValidEmail, isValidPhone } from "@/lib/utils";

const deliveryOptions: Array<{ value: DeliveryMethod; title: string; text: string; price: (subtotal: number) => number }> = [
  { value: "pickup", title: "Самовывоз из магазина", text: "Казань · обычно готов на следующий день", price: () => 0 },
  { value: "courier", title: "Курьер по Казани", text: "1–2 дня · с примеркой у двери", price: (s) => (s >= site.delivery.freeFrom ? 0 : site.delivery.courier) },
  { value: "cdek", title: "СДЭК по России", text: "3–7 дней · до пункта выдачи или до двери", price: (s) => (s >= site.delivery.freeFrom ? 0 : site.delivery.cdek) },
];

const paymentOptions: Array<{ value: PaymentMethod; title: string; text: string }> = [
  { value: "card", title: "Картой онлайн", text: "МИР, Visa, Mastercard" },
  { value: "sbp", title: "СБП", text: "По QR-коду без комиссии" },
  { value: "cash", title: "При получении", text: "Наличными или картой" },
];

type Errors = Partial<Record<"name" | "phone" | "email" | "address" | "city" | "store" | "agree", string>>;

export function CheckoutForm({ stores }: { stores: Store[] }) {
  const router = useRouter();
  const { cart, cartSubtotal, cartCount, hydrated, promoCode, clearCart, pushToast } = useStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("pickup");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [store, setStore] = useState(stores[0]?.address ?? "");
  const [city, setCity] = useState("Казань");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [agree, setAgree] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const discountPercent = site.promoCodes[promoCode] ?? 0;
  const discount = Math.round((cartSubtotal * discountPercent) / 100);
  const afterDiscount = cartSubtotal - discount;
  const deliveryCost = useMemo(() => deliveryOptions.find((d) => d.value === delivery)!.price(afterDiscount), [delivery, afterDiscount]);
  const total = afterDiscount + deliveryCost;

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Введите имя";
    if (!isValidPhone(phone)) e.phone = "Введите телефон полностью";
    if (email && !isValidEmail(email)) e.email = "Проверьте e-mail";
    if (delivery === "pickup" && !store) e.store = "Выберите магазин";
    if (delivery !== "pickup") {
      if (city.trim().length < 2) e.city = "Укажите город";
      if (address.trim().length < 5) e.address = "Укажите адрес доставки";
    }
    if (!agree) e.agree = "Нужно согласие на обработку данных";
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const firstKey = Object.keys(e)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          phone,
          email: email.trim() || undefined,
          deliveryMethod: delivery,
          paymentMethod: payment,
          city: delivery === "pickup" ? "Казань" : city.trim(),
          address: delivery === "pickup" ? undefined : address.trim(),
          pickupStore: delivery === "pickup" ? store : undefined,
          comment: comment.trim() || undefined,
          promoCode: promoCode || undefined,
          items: cart.map((l) => ({ productId: l.productId, quantity: l.quantity, size: l.size, color: l.color })),
        }),
      });
      const data = (await res.json()) as { number?: string; error?: string };
      if (!res.ok || !data.number) throw new Error(data.error || "Не удалось оформить заказ");
      clearCart();
      pushToast({ message: `Заказ ${data.number} оформлен`, kind: "success" });
      router.push(`/order/${data.number}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Что-то пошло не так. Попробуйте ещё раз.");
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="skeleton h-96 rounded-3xl" />
        <div className="skeleton h-72 rounded-3xl" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        icon={<BagIcon size={24} />}
        title="Нечего оформлять"
        description="Корзина пуста. Добавьте товары — и возвращайтесь к оформлению."
        action={<ButtonLink href="/catalog">Перейти в каталог</ButtonLink>}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
      <div className="space-y-10">
        {/* 1. Контакты */}
        <Section step="01" title="Контакты">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="field-name" label="Имя" error={errors.name}>
              <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Как к вам обращаться" autoComplete="name" aria-invalid={Boolean(errors.name)} />
            </Field>
            <Field id="field-phone" label="Телефон" error={errors.phone}>
              <input value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} className="field" placeholder="+7 (___) ___-__-__" inputMode="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} />
            </Field>
            <Field id="field-email" label="E-mail (необязательно)" error={errors.email} className="sm:col-span-2">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="Для подтверждения заказа" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} />
            </Field>
          </div>
        </Section>

        {/* 2. Доставка */}
        <Section step="02" title="Доставка">
          <div className="grid gap-3">
            {deliveryOptions.map((opt) => {
              const price = opt.price(afterDiscount);
              const active = delivery === opt.value;
              return (
                <label key={opt.value} className={cn("flex cursor-pointer items-center gap-4 rounded-2xl border bg-white p-4 transition-all", active ? "border-ink shadow-card" : "border-sand hover:border-ink/40")}>
                  <input type="radio" name="delivery" value={opt.value} checked={active} onChange={() => setDelivery(opt.value)} className="sr-only" />
                  <Radio active={active} />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{opt.title}</span>
                    <span className="block text-xs text-mist">{opt.text}</span>
                  </span>
                  <span className="text-sm font-semibold">{price === 0 ? "Бесплатно" : formatPrice(price)}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-5 animate-fade-in" key={delivery}>
            {delivery === "pickup" ? (
              <Field id="field-store" label="Магазин" error={errors.store}>
                <div className="relative">
                  <select value={store} onChange={(e) => setStore(e.target.value)} className="field appearance-none pr-10" aria-invalid={Boolean(errors.store)}>
                    {stores.map((s) => (
                      <option key={s.id} value={s.address}>
                        {s.address} · {s.hours}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist" />
                </div>
              </Field>
            ) : (
              <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                <Field id="field-city" label="Город" error={errors.city}>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="field" disabled={delivery === "courier"} aria-invalid={Boolean(errors.city)} />
                </Field>
                <Field id="field-address" label="Адрес" error={errors.address}>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className="field" placeholder="Улица, дом, квартира" autoComplete="street-address" aria-invalid={Boolean(errors.address)} />
                </Field>
              </div>
            )}
          </div>
        </Section>

        {/* 3. Оплата */}
        <Section step="03" title="Оплата">
          <div className="grid gap-3 sm:grid-cols-3">
            {paymentOptions.map((opt) => {
              const active = payment === opt.value;
              return (
                <label key={opt.value} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border bg-white p-4 transition-all", active ? "border-ink shadow-card" : "border-sand hover:border-ink/40")}>
                  <input type="radio" name="payment" value={opt.value} checked={active} onChange={() => setPayment(opt.value)} className="sr-only" />
                  <Radio active={active} />
                  <span>
                    <span className="block text-sm font-semibold">{opt.title}</span>
                    <span className="block text-xs text-mist">{opt.text}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </Section>

        {/* 4. Комментарий */}
        <Section step="04" title="Комментарий к заказу">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="field resize-none" placeholder="Например: позвоните перед доставкой или нужна подарочная упаковка" />
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-ink-soft" id="field-agree">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="peer sr-only" />
            <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors", agree ? "border-ink bg-ink" : "border-sand bg-white")}>{agree && <CheckIcon size={12} className="text-white" />}</span>
            <span>
              Согласна с{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                политикой обработки персональных данных
              </Link>
            </span>
          </label>
          {errors.agree && <p className="mt-2 text-xs text-red-600">{errors.agree}</p>}
        </Section>
      </div>

      {/* Итог */}
      <aside className="rounded-3xl border border-sand bg-white p-6 lg:sticky lg:top-32">
        <div className="flex items-center justify-between">
          <h2 className="display text-2xl">Ваш заказ</h2>
          <Link href="/cart" className="text-xs text-mist underline-offset-4 hover:underline">
            Изменить
          </Link>
        </div>
        <ul className="mt-5 max-h-72 space-y-3 overflow-y-auto pr-1">
          {cart.map((l) => (
            <li key={l.key} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <ProductImage src={l.image} alt={l.name} className="h-16 w-12 rounded-lg" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[0.6rem] font-bold text-white">{l.quantity}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.name}</p>
                <p className="text-xs text-mist">{[l.color, l.size].filter(Boolean).join(" · ")}</p>
              </div>
              <span className="text-sm tabular-nums">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2.5 border-t border-sand pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Товары ({cartCount})</dt>
            <dd className="tabular-nums">{formatPrice(cartSubtotal)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-brand-700">
              <dt>Промокод {promoCode}</dt>
              <dd className="tabular-nums">−{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-ink-soft">Доставка</dt>
            <dd className="tabular-nums">{deliveryCost === 0 ? <span className="text-brand-700">Бесплатно</span> : formatPrice(deliveryCost)}</dd>
          </div>
          <div className="flex justify-between border-t border-sand pt-3 text-base font-semibold">
            <dt>Итого</dt>
            <dd className="tabular-nums">{formatPrice(total)}</dd>
          </div>
        </dl>
        {serverError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">
            {serverError}
          </p>
        )}
        <Button type="submit" full size="lg" loading={submitting} className="mt-6">
          {submitting ? "Оформляем…" : "Подтвердить заказ"} {!submitting && <ArrowRightIcon size={16} />}
        </Button>
        <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-mist">Менеджер свяжется с вами для подтверждения и отправит фото и видео вещи перед отправкой.</p>
      </aside>
    </form>
  );
}

function Section({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <span className="display text-lg text-brand-500">{step}</span>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ id, label, error, children, className }: { id: string; label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div id={id} className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-mist">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600 animate-fade-in">{error}</p>}
    </div>
  );
}

function Radio({ active }: { active: boolean }) {
  return (
    <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors", active ? "border-ink" : "border-sand")}>
      <span className={cn("h-2.5 w-2.5 rounded-full bg-ink transition-transform duration-300", active ? "scale-100" : "scale-0")} />
    </span>
  );
}
