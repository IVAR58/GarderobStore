import type { Metadata } from "next";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Breadcrumbs, ButtonLink, ProductImage, Reveal } from "@/components/ui/primitives";
import { siteImages } from "@/db/seed-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "О бренде",
  description: "Garderob_store — сеть магазинов женской одежды в Казани. Честные цены, актуальные тренды и внимательный сервис.",
};

const values = [
  { title: "Тренды без переплат", text: "Отбираем вещи, которые действительно носят в этом сезоне, и держим цены адекватными. Костюм, за который в бутике просят в разы больше, у нас стоит честных денег." },
  { title: "Сервис, который помнят", text: "В каждом магазине много консультантов — на всех хватит. Помогаем определиться с размером, не навязываем мнение, собираем образ под событие." },
  { title: "Доверие на расстоянии", text: "Покупательницы из других городов заказывают у нас годами: отправляем фото и видео вещи перед отправкой и подсказываем с размером." },
  { title: "Полный гардероб", text: "Костюмы, платья, трикотаж, обувь, бижутерия и бельё — всё, что нужно для образа, в одном месте. И новые поступления каждую неделю." },
];

export default function AboutPage() {
  return (
    <div className="">
      <div className="mx-auto max-w-[1440px] px-4 pt-5 lg:px-8 lg:pt-8">
        <Breadcrumbs items={[{ label: "О бренде" }]} />
        <div className="mt-5 grid gap-10 lg:mt-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-brand-600">О бренде</p>
            <h1 className="display mt-2 text-[2.6rem] leading-[1] md:text-[4rem]">
              Мы — <span className="italic font-normal text-brand-600">Garderob</span>. Женская одежда из Казани
            </h1>
            <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-ink-soft md:text-base">
              {site.name} начинался как небольшой магазин и вырос в сеть из четырёх пространств в Казани. Мы верим, что красивая и актуальная одежда не обязана стоить как крыло самолёта, а шопинг должен приносить удовольствие — поэтому у нас чисто, уютно и всегда есть кому помочь.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/catalog">
                Смотреть каталог <ArrowRightIcon size={16} />
              </ButtonLink>
              <ButtonLink href="/stores" variant="outline">
                Наши магазины
              </ButtonLink>
            </div>
          </div>
          <Reveal delay={100}>
            <div className="grid grid-cols-[1.2fr_1fr] gap-3">
              <ProductImage src={siteImages.heroPortrait} alt="Образ из коллекции Garderob" className="row-span-2 aspect-[3/4] rounded-3xl" imgClassName="transition-transform duration-[1500ms] hover:scale-105" />
              <ProductImage src={siteImages.aboutDetail} alt="Детали в магазине" className="aspect-square rounded-3xl" imgClassName="transition-transform duration-[1500ms] hover:scale-105" />
              <div className="flex flex-col justify-end rounded-3xl bg-brand-300 p-5">
                <span className="display text-5xl text-ink">4</span>
                <span className="text-sm text-ink/80">магазина в Казани, открыты ежедневно 10:00–21:00</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-4 pt-20 lg:px-8 lg:pt-28">
        <Reveal>
          <p className="eyebrow text-brand-600">Ценности</p>
          <h2 className="display mt-3 max-w-2xl text-[2.2rem] leading-[1.02] md:text-[3rem]">Что для нас важно</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-sand bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-card md:p-9">
                <span className="display text-lg text-brand-500">0{i + 1}</span>
                <h3 className="display mt-3 text-2xl md:text-3xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-[0.95rem]">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-20 lg:px-8 lg:pt-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl">
            <ProductImage src={siteImages.editorial} alt="Редакционная съёмка Garderob" className="aspect-[4/5] md:aspect-[21/9]" imgClassName="animate-ken-burns" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:justify-center md:p-14">
              <p className="eyebrow text-brand-200">Новая коллекция</p>
              <h2 className="display mt-3 max-w-lg text-[2.2rem] leading-[1.02] md:text-[3.4rem]">Одежда, в которой хочется жить каждый день</h2>
              <div className="mt-6">
                <ButtonLink href="/new" variant="brand">
                  Смотреть новинки
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
