import type { Metadata } from "next";
import { ReturnIcon, ShieldIcon, StoreIcon, TruckIcon } from "@/components/ui/icons";
import { Breadcrumbs, ButtonLink, Reveal } from "@/components/ui/primitives";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Доставка и возврат",
  description: "Условия доставки по Казани и России, самовывоз из магазинов, оплата, обмен и возврат в Garderob_store.",
};

export default function DeliveryPage() {
  const methods = [
    { icon: StoreIcon, title: "Самовывоз", price: "Бесплатно", text: "Из любого из четырёх магазинов в Казани. Обычно заказ готов на следующий день; мы напишем, когда можно забирать. Храним 5 дней." },
    { icon: TruckIcon, title: "Курьер по Казани", price: `${formatPrice(site.delivery.courier)} · бесплатно от ${formatPrice(site.delivery.freeFrom)}`, text: "Доставка 1–2 дня в удобный интервал. Можно примерить при курьере и отказаться от того, что не подошло." },
    { icon: TruckIcon, title: "СДЭК по России", price: `от ${formatPrice(site.delivery.cdek)} · бесплатно от ${formatPrice(site.delivery.freeFrom)}`, text: "До пункта выдачи или до двери за 3–7 дней. Перед отправкой присылаем фото и видео вещи, чтобы вы были уверены в выборе." },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: "Доставка и возврат" }]} />
      <div className="mt-5 max-w-2xl lg:mt-8">
        <p className="eyebrow text-brand-600">Покупателям</p>
        <h1 className="display mt-2 text-[2.4rem] leading-[1] md:text-[3.4rem]">Доставка, оплата и возврат</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">Коротко о том, как получить заказ и что делать, если вещь не подошла.</p>
      </div>

      <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3">
        {methods.map((m, i) => (
          <Reveal key={m.title} delay={i * 80}>
            <div className="h-full rounded-3xl border border-sand bg-white p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <m.icon size={20} />
              </span>
              <h2 className="display mt-5 text-2xl">{m.title}</h2>
              <p className="mt-1 text-sm font-semibold text-brand-700">{m.price}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{m.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="flex items-center gap-3">
            <ShieldIcon size={22} className="text-brand-600" />
            <h2 className="display text-3xl">Оплата</h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink-soft">
            <li className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />Картой онлайн — МИР, Visa, Mastercard. Данные карты защищены, мы их не храним.</li>
            <li className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />Через СБП по QR-коду без комиссии.</li>
            <li className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />При получении — наличными или картой курьеру либо в магазине.</li>
            <li className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />Промокоды применяются в корзине. После подписки на рассылку действует код WELCOME.</li>
          </ul>
        </Reveal>
        <Reveal delay={80}>
          <div className="flex items-center gap-3">
            <ReturnIcon size={22} className="text-brand-600" />
            <h2 className="display text-3xl">Обмен и возврат</h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink-soft">
            <li className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />14 дней с момента получения на обмен или возврат, если вещь не подошла.</li>
            <li className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />Товар должен сохранить товарный вид, бирки и упаковку, без следов носки.</li>
            <li className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />Нижнее бельё и бижутерия обмену и возврату не подлежат по санитарным нормам.</li>
            <li className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />Деньги возвращаем тем же способом, которым был оплачен заказ, в течение 3–10 рабочих дней.</li>
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-100 p-8 md:flex-row md:items-center">
          <div>
            <p className="display text-2xl">Остались вопросы?</p>
            <p className="mt-1 text-sm text-ink-soft">Напишите нам в мессенджер или закажите звонок — ответим в рабочее время, {site.hoursShort.toLowerCase()}.</p>
          </div>
          <ButtonLink href="/stores" variant="primary">
            Контакты
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
