import type { Metadata } from "next";
import { CallbackForm } from "@/components/forms/callback-form";
import { ArrowRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon, TelegramIcon, VkIcon, WhatsappIcon } from "@/components/ui/icons";
import { Breadcrumbs, ProductImage, Reveal } from "@/components/ui/primitives";
import { siteImages } from "@/db/seed-data";
import { getStores } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Магазины и контакты в Казани",
  description: "Адреса четырёх магазинов Garderob_store в Казани, часы работы и контакты.",
};

export default async function StoresPage() {
  const stores = await getStores();

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: "Магазины и контакты" }]} />
      <div className="mt-5 max-w-2xl lg:mt-8">
        <p className="eyebrow text-brand-600">Контакты</p>
        <h1 className="display mt-2 text-[2.4rem] leading-[1] md:text-[3.4rem]">Четыре магазина в Казани</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">Приходите примерить вживую — консультанты помогут подобрать размер и собрать образ. Все магазины работают ежедневно с 10:00 до 21:00, включая праздники.</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
        {stores.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <a href={s.mapUrl ?? site.socials.yandexMaps} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col justify-between rounded-3xl border border-sand bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-card md:p-8">
              <div>
                <span className="display text-lg text-brand-500">0{i + 1}</span>
                <h2 className="display mt-2 text-2xl md:text-3xl">{s.address}</h2>
                <p className="mt-1 text-sm text-mist">{s.city}</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-ink-soft">
                  <ClockIcon size={16} className="text-brand-500" /> {s.hours}
                </span>
                <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink">
                  <MapPinIcon size={16} /> На карте
                  <ArrowRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1fr_1fr_1.1fr]">
        <Reveal>
          <h2 className="display text-3xl">Часы работы</h2>
          <ul className="mt-5 divide-y divide-sand border-y border-sand text-sm">
            {site.hours.map((h) => (
              <li key={h.day} className="flex items-center justify-between py-3">
                <span>{h.day}</span>
                <span className="font-medium tabular-nums">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-mist">В праздничные дни работаем по обычному графику.</p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="display text-3xl">Связаться</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-3 transition-colors hover:text-brand-600">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pearl">
                  <PhoneIcon size={18} />
                </span>
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition-colors hover:text-brand-600">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pearl">
                  <MailIcon size={18} />
                </span>
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.socials.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-brand-600">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pearl">
                  <TelegramIcon size={18} />
                </span>
                Telegram
              </a>
            </li>
            <li>
              <a href={site.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-brand-600">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pearl">
                  <WhatsappIcon size={18} />
                </span>
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.socials.vk} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-colors hover:text-brand-600">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pearl">
                  <VkIcon size={18} />
                </span>
                ВКонтакте
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={160}>
          <CallbackForm />
        </Reveal>
      </div>

      <Reveal className="mt-16 lg:mt-24">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <ProductImage src={siteImages.storeInterior} alt="Интерьер магазина Garderob" className="aspect-[4/3] rounded-2xl" />
          <ProductImage src={siteImages.storeRack} alt="Вешалки с одеждой" className="aspect-[4/3] rounded-2xl" />
          <ProductImage src={siteImages.mannequin} alt="Манекен с платьем" className="col-span-2 aspect-[8/3] rounded-2xl md:col-span-1 md:aspect-[4/3]" />
        </div>
      </Reveal>
    </div>
  );
}
