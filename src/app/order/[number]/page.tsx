import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, MapPinIcon, PhoneIcon, TelegramIcon, TruckIcon } from "@/components/ui/icons";
import { ButtonLink, ProductImage } from "@/components/ui/primitives";
import { getOrderByNumber } from "@/lib/data";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ number: string }> };

export const metadata: Metadata = { title: "Заказ оформлен", robots: { index: false } };

const deliveryLabels: Record<string, string> = { pickup: "Самовывоз из магазина", courier: "Курьер по Казани", cdek: "СДЭК по России" };
const paymentLabels: Record<string, string> = { card: "Картой онлайн", sbp: "СБП", cash: "При получении" };
const statusLabels: Record<string, string> = { new: "Принят, ждёт подтверждения", confirmed: "Подтверждён", shipped: "Отправлен", done: "Выполнен", cancelled: "Отменён" };

export default async function OrderPage({ params }: Props) {
  const { number } = await params;
  const data = await getOrderByNumber(decodeURIComponent(number).toUpperCase());
  if (!data) notFound();
  const { order, items } = data;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-10 lg:px-8 lg:pt-16">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-300 text-ink animate-pop">
          <CheckIcon size={28} />
        </span>
        <p className="eyebrow mt-6 text-brand-600">Спасибо за заказ</p>
        <h1 className="display mt-3 text-[2.4rem] leading-[1] md:text-[3.4rem]">
          Заказ <span className="text-brand-600">{order.number}</span> принят
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft md:text-base">
          {order.customerName}, мы уже получили ваш заказ. Менеджер свяжется с вами по номеру {order.phone}, чтобы подтвердить детали и отправить фото и видео вещей.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-[1fr_320px]">
        <section className="rounded-3xl border border-sand bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">Состав заказа</h2>
          <ul className="mt-5 divide-y divide-sand">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <Link href={`/product/${item.slug}`}>
                  <ProductImage src={item.image} alt={item.name} className="h-20 w-16 rounded-lg" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.slug}`} className="line-clamp-2 text-sm font-medium hover:text-brand-600">
                    {item.name}
                  </Link>
                  <p className="text-xs text-mist">
                    {[item.color, item.size].filter(Boolean).join(" · ")} · {item.quantity} шт.
                  </p>
                </div>
                <span className="text-sm tabular-nums">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-sand pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Товары</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brand-700">
                <dt>Промокод {order.promoCode}</dt>
                <dd>−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Доставка</dt>
              <dd>{order.deliveryCost === 0 ? "Бесплатно" : formatPrice(order.deliveryCost)}</dd>
            </div>
            <div className="flex justify-between border-t border-sand pt-3 text-base font-semibold">
              <dt>Итого</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-sand bg-white p-6 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-mist">Статус</h2>
            <p className="mt-2 flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> {statusLabels[order.status] ?? order.status}
            </p>
            <h2 className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-mist">Получение</h2>
            <p className="mt-2 flex items-start gap-2">
              {order.deliveryMethod === "pickup" ? <MapPinIcon size={16} className="mt-0.5 text-brand-500" /> : <TruckIcon size={16} className="mt-0.5 text-brand-500" />}
              <span>
                {deliveryLabels[order.deliveryMethod] ?? order.deliveryMethod}
                <br />
                <span className="text-ink-soft">{order.deliveryMethod === "pickup" ? order.pickupStore : [order.city, order.address].filter(Boolean).join(", ")}</span>
              </span>
            </p>
            <h2 className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-mist">Оплата</h2>
            <p className="mt-2">{paymentLabels[order.paymentMethod] ?? order.paymentMethod}</p>
            {order.comment && (
              <>
                <h2 className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-mist">Комментарий</h2>
                <p className="mt-2 text-ink-soft">{order.comment}</p>
              </>
            )}
          </div>
          <div className="rounded-3xl bg-brand-100 p-6 text-sm">
            <p className="font-semibold">Есть вопросы по заказу?</p>
            <a href={site.phoneHref} className="mt-3 flex items-center gap-2 text-ink-soft hover:text-ink">
              <PhoneIcon size={16} /> {site.phone}
            </a>
            <a href={site.socials.telegram} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 text-ink-soft hover:text-ink">
              <TelegramIcon size={16} /> Написать в Telegram
            </a>
          </div>
        </aside>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/catalog">Продолжить покупки</ButtonLink>
        <ButtonLink href="/" variant="outline">
          На главную
        </ButtonLink>
      </div>
    </div>
  );
}
