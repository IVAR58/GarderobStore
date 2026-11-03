import Link from "next/link";
import { ProductRail } from "@/components/product/product-card";
import { ArrowRightIcon, ClockIcon, MapPinIcon, ReturnIcon, ShieldIcon, SparkleIcon, StarIcon, TruckIcon } from "@/components/ui/icons";
import { ButtonLink, ProductImage, Reveal, SectionHeading, TextLink } from "@/components/ui/primitives";
import { siteImages } from "@/db/seed-data";
import { getCategories, getHomeCollections, getReviews, getStores } from "@/lib/data";
import { site } from "@/lib/site";
import { cn, formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const [categories, { featured, fresh, bestsellers }, reviews, stores] = await Promise.all([
    getCategories(),
    getHomeCollections(),
    getReviews(),
    getStores(),
  ]);

  const marquee = ["Новая коллекция", `Бесплатная доставка от ${formatPrice(site.delivery.freeFrom)}`, "4 магазина в Казани", "Обмен и возврат 14 дней", "Фото и видео перед отправкой"];

  return (
    <div className="">
      {/* ——— Hero ——— */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[1440px] lg:min-h-[calc(100dvh-7rem)] lg:grid-cols-[1fr_1.1fr]">
          <div className="relative order-2 flex flex-col justify-center px-4 pb-10 pt-8 lg:order-1 lg:px-12 lg:py-20 xl:px-20">
            <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-200/60 blur-3xl" aria-hidden />
            <p className="eyebrow text-brand-600 animate-fade-up">
              {site.name} · {site.city}
            </p>
            <h1 className="display mt-4 text-[2.9rem] leading-[0.98] md:text-[4rem] xl:text-[5rem] animate-fade-up" style={{ animationDelay: "80ms" }}>
              Гардероб,
              <br />в котором <em className="font-normal italic text-brand-600">хочется</em> жить
            </h1>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-soft md:text-base animate-fade-up" style={{ animationDelay: "160ms" }}>
              Костюмы, платья, трикотаж, обувь и бижутерия — всё, что в тренде этого сезона, по честным ценам. Четыре магазина в Казани и доставка по всей России.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-up" style={{ animationDelay: "240ms" }}>
              <ButtonLink href="/catalog" size="lg">
                Смотреть каталог <ArrowRightIcon size={16} />
              </ButtonLink>
              <ButtonLink href="/new" size="lg" variant="outline">
                Новинки
              </ButtonLink>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-sand pt-6 text-xs text-ink-soft animate-fade-up" style={{ animationDelay: "320ms" }}>
              <div>
                <dt className="display text-2xl text-ink">4</dt>
                <dd>магазина в Казани</dd>
              </div>
              <div>
                <dt className="display text-2xl text-ink">10–21</dt>
                <dd>открыты ежедневно</dd>
              </div>
              <div>
                <dt className="display text-2xl text-ink">5,0</dt>
                <dd>рейтинг на Яндекс Картах</dd>
              </div>
            </dl>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
              <ProductImage src={siteImages.hero} alt="Новая коллекция Garderob" priority className="h-full w-full" imgClassName="animate-ken-burns" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent lg:hidden" />
              <Link
                href="/catalog/suits"
                className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-white/90 py-2 pl-2 pr-4 text-xs font-medium text-ink shadow-card backdrop-blur transition-transform hover:scale-[1.02] lg:bottom-8 lg:left-8"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-300">
                  <SparkleIcon size={14} />
                </span>
                Костюмы сезона — смотреть
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ——— Бегущая строка ——— */}
      <div className="overflow-hidden border-y border-sand bg-white py-3">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-ink-soft">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((item, i) => (
            <span key={i} className="flex items-center gap-10">
              {item}
              <span className="h-1 w-1 rounded-full bg-brand-400" />
            </span>
          ))}
        </div>
      </div>

      {/* ——— Категории ——— */}
      <section className="mx-auto max-w-[1440px] px-4 pt-16 lg:px-8 lg:pt-24">
        <Reveal>
          <SectionHeading eyebrow="Категории" title="Собрать образ целиком" description="От базового трикотажа до вечернего платья и бижутерии к нему." action={<TextLink href="/catalog">Весь каталог</TextLink>} />
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:grid-rows-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i, 6) * 60} className={cn(i === 0 && "col-span-2 row-span-2 md:col-span-2 lg:col-span-2 lg:row-span-2")}>
              <Link href={`/catalog/${c.slug}`} className="group relative block h-full overflow-hidden rounded-2xl">
                <ProductImage src={c.image} alt={c.name} className={cn("h-full w-full", i === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-[4/5]")} imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5">
                  <div>
                    <h3 className={cn("display text-white", i === 0 ? "text-3xl md:text-4xl" : "text-xl md:text-2xl")}>{c.name}</h3>
                    {i === 0 && c.description && <p className="mt-1 hidden max-w-xs text-sm text-white/80 md:block">{c.description}</p>}
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink transition-transform duration-500 group-hover:translate-x-1">
                    <ArrowRightIcon size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Новинки ——— */}
      <section className="mx-auto max-w-[1440px] px-4 pt-20 lg:px-8 lg:pt-28">
        <Reveal>
          <SectionHeading eyebrow="Только что" title="Новинки недели" description="Свежие поступления — то, что уже примеряют в наших магазинах." action={<TextLink href="/new">Все новинки</TextLink>} />
        </Reveal>
        <Reveal className="mt-8" delay={100}>
          <ProductRail products={fresh} />
        </Reveal>
      </section>

      {/* ——— Редакционный баннер ——— */}
      <section className="mx-auto max-w-[1440px] px-4 pt-20 lg:px-8 lg:pt-28">
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl bg-brand-100 lg:grid-cols-2">
            <div className="order-2 flex flex-col justify-center px-6 py-10 lg:order-1 lg:px-14 lg:py-16">
              <p className="eyebrow text-brand-600">Философия бренда</p>
              <h2 className="display mt-3 text-[2.2rem] leading-[1.02] md:text-[3rem]">Тренды — без переплаты за имя</h2>
              <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
                Мы отбираем вещи, которые хочется носить каждый день, и держим честные цены: костюм, за который в бутике просят в разы больше, у нас стоит адекватных денег. А консультанты помогут подобрать размер и отправят фото и видео перед отправкой.
              </p>
              <ul className="mt-6 grid gap-3 text-sm text-ink">
                {["Новые поступления каждую неделю", "Размеры от XS до XL, обувь 36–40", "Доставка по Казани и всей России"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href="/about" variant="primary">
                  О бренде <ArrowRightIcon size={16} />
                </ButtonLink>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <ProductImage src={siteImages.aboutBoutique} alt="Магазин Garderob" className="aspect-[4/3] h-full w-full lg:aspect-auto" imgClassName="transition-transform duration-[2000ms] hover:scale-105" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— Хиты ——— */}
      <section className="mx-auto max-w-[1440px] px-4 pt-20 lg:px-8 lg:pt-28">
        <Reveal>
          <SectionHeading eyebrow="Выбор покупательниц" title="Бестселлеры" description="Модели, которые раскупают быстрее всего — и за которыми возвращаются." action={<TextLink href="/catalog?sort=popular">Смотреть все</TextLink>} />
        </Reveal>
        <Reveal className="mt-8" delay={100}>
          <ProductRail products={bestsellers} />
        </Reveal>
      </section>

      {/* ——— Преимущества ——— */}
      <section className="mx-auto max-w-[1440px] px-4 pt-20 lg:px-8 lg:pt-28">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: SparkleIcon, title: "Подберём размер", text: "Консультанты помогут определиться с размером и соберут образ под событие." },
            { icon: ShieldIcon, title: "Фото и видео перед отправкой", text: "Покажем, как вещь выглядит вживую, до того как отправим заказ." },
            { icon: TruckIcon, title: "Доставка по России", text: `Курьером по Казани, СДЭК по стране. Бесплатно от ${formatPrice(site.delivery.freeFrom)}.` },
            { icon: ReturnIcon, title: "Обмен и возврат", text: "14 дней на обмен или возврат, если что-то не подошло." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-sand bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand-600 transition-colors duration-500 group-hover:bg-brand-300 group-hover:text-ink">
                  <item.icon size={20} />
                </span>
                <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— Рекомендуем ——— */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 pt-20 lg:px-8 lg:pt-28">
          <Reveal>
            <SectionHeading eyebrow="Редакция рекомендует" title="Образы сезона" action={<TextLink href="/catalog">В каталог</TextLink>} />
          </Reveal>
          <Reveal className="mt-8" delay={100}>
            <ProductRail products={featured.slice(0, 4)} />
          </Reveal>
        </section>
      )}

      {/* ——— Отзывы ——— */}
      <section className="mt-20 bg-white py-16 lg:mt-28 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Отзывы"
              title={
                <>
                  Нас рекомендуют <span className="inline-flex items-center gap-1 text-brand-600"><StarIcon size={28} /> 5,0</span>
                </>
              }
              description="Реальные отзывы покупательниц с Яндекс Карт."
              action={<TextLink href="/reviews">Все отзывы</TextLink>}
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reviews.slice(0, 4).map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
                <article className="flex h-full flex-col rounded-2xl bg-cream p-6">
                  <div className="flex items-center gap-1 text-brand-500">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <StarIcon key={s} size={14} />
                    ))}
                  </div>
                  <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                  <div className="mt-auto pt-5">
                    <p className="font-semibold">{r.author}</p>
                    <p className="text-xs text-mist">
                      {r.badge} · {r.dateLabel}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Магазины ——— */}
      <section className="mx-auto max-w-[1440px] px-4 pt-16 lg:px-8 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <p className="eyebrow text-brand-600">Магазины</p>
            <h2 className="display mt-3 text-[2.2rem] leading-[1.02] md:text-[3rem]">Четыре адреса в Казани</h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">Приходите примерить вживую: в каждом магазине вас встретят консультанты, которые помогут собрать образ.</p>
            <ul className="mt-8 divide-y divide-sand border-y border-sand">
              {stores.map((s) => (
                <li key={s.id}>
                  <a href={s.mapUrl ?? site.socials.yandexMaps} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-4">
                    <span className="flex items-center gap-3">
                      <MapPinIcon size={18} className="text-brand-500" />
                      <span>
                        <span className="block font-medium">{s.address}</span>
                        <span className="flex items-center gap-1.5 text-xs text-mist">
                          <ClockIcon size={12} /> {s.hours}
                        </span>
                      </span>
                    </span>
                    <ArrowRightIcon size={16} className="text-mist transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/stores" variant="outline">
                Контакты и часы работы
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-3">
              <ProductImage src={siteImages.storeInterior} alt="Интерьер магазина" className="aspect-[4/5] rounded-2xl" imgClassName="transition-transform duration-[1500ms] hover:scale-105" />
              <ProductImage src={siteImages.aboutRack} alt="Вешалки с одеждой" className="mt-8 aspect-[4/5] rounded-2xl" imgClassName="transition-transform duration-[1500ms] hover:scale-105" />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
