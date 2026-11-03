import type { Metadata } from "next";
import { StarIcon } from "@/components/ui/icons";
import { Breadcrumbs, ButtonLink, Reveal } from "@/components/ui/primitives";
import { getReviews } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Отзывы покупательниц",
  description: "Реальные отзывы о магазинах Garderob_store с Яндекс Карт.",
};

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 5;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: "Отзывы" }]} />
      <div className="mt-5 grid gap-8 lg:mt-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-600">Отзывы</p>
          <h1 className="display mt-2 text-[2.4rem] leading-[1] md:text-[3.4rem]">Что говорят покупательницы</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">Мы не редактируем отзывы — только собираем их с Яндекс Карт. Спасибо, что делитесь впечатлениями: это помогает нам становиться лучше.</p>
        </div>
        <div className="flex items-center gap-5 rounded-3xl border border-sand bg-white px-6 py-5">
          <span className="display text-5xl">{avg.toFixed(1).replace(".", ",")}</span>
          <div>
            <div className="flex gap-0.5 text-brand-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={16} />
              ))}
            </div>
            <p className="mt-1 text-xs text-mist">на Яндекс Картах</p>
          </div>
        </div>
      </div>

      <div className="mt-10 columns-1 gap-4 md:columns-2 xl:columns-3 lg:mt-14 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={(i % 3) * 80}>
            <article className="rounded-3xl border border-sand bg-white p-6 md:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">{r.author.slice(0, 1)}</span>
                  <div>
                    <p className="font-semibold">{r.author}</p>
                    <p className="text-xs text-mist">{r.badge}</p>
                  </div>
                </div>
                <span className="text-xs text-mist">{r.dateLabel}</span>
              </div>
              <div className="mt-4 flex gap-0.5 text-brand-500">
                {Array.from({ length: r.rating }).map((_, s) => (
                  <StarIcon key={s} size={14} />
                ))}
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{r.body}</p>
              <p className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-mist">{r.source}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-ink px-6 py-12 text-center text-white">
          <p className="display text-3xl">Были у нас? Поделитесь впечатлением</p>
          <p className="max-w-md text-sm text-white/70">Ваш отзыв на Яндекс Картах помогает другим девушкам найти нас — и подсказывает нам, что сделать лучше.</p>
          <ButtonLink href={site.socials.yandexMaps} external variant="brand">
            Оставить отзыв
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
