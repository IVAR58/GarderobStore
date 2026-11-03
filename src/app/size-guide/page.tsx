import type { Metadata } from "next";
import { Breadcrumbs, ButtonLink, Reveal } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Таблица размеров",
  description: "Как подобрать размер одежды и обуви в Garderob_store: таблица соответствия международных и российских размеров.",
};

const clothing = [
  { size: "XS", ru: "40–42", bust: "80–84", waist: "60–64", hips: "86–90" },
  { size: "S", ru: "42–44", bust: "84–88", waist: "64–68", hips: "90–94" },
  { size: "M", ru: "44–46", bust: "88–92", waist: "68–72", hips: "94–98" },
  { size: "L", ru: "46–48", bust: "92–96", waist: "72–76", hips: "98–102" },
  { size: "XL", ru: "48–50", bust: "96–100", waist: "76–80", hips: "102–106" },
];

const shoes = [
  { ru: "36", eu: "36", cm: "23,0" },
  { ru: "37", eu: "37", cm: "23,5" },
  { ru: "38", eu: "38", cm: "24,5" },
  { ru: "39", eu: "39", cm: "25,0" },
  { ru: "40", eu: "40", cm: "26,0" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: "Таблица размеров" }]} />
      <div className="mt-5 max-w-2xl lg:mt-8">
        <p className="eyebrow text-brand-600">Покупателям</p>
        <h1 className="display mt-2 text-[2.4rem] leading-[1] md:text-[3.4rem]">Таблица размеров</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft md:text-base">Не уверены в размере? Снимите мерки по инструкции ниже или напишите нам — консультанты подскажут, как сидит конкретная модель, и пришлют фото.</p>
      </div>

      <Reveal className="mt-10">
        <h2 className="display text-3xl">Одежда</h2>
        <div className="mt-4 overflow-x-auto rounded-3xl border border-sand bg-white">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-pearl text-left text-[0.65rem] uppercase tracking-[0.18em] text-mist">
              <tr>
                <th className="px-5 py-3 font-semibold">Размер</th>
                <th className="px-5 py-3 font-semibold">RU</th>
                <th className="px-5 py-3 font-semibold">Грудь, см</th>
                <th className="px-5 py-3 font-semibold">Талия, см</th>
                <th className="px-5 py-3 font-semibold">Бёдра, см</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {clothing.map((r) => (
                <tr key={r.size} className="transition-colors hover:bg-brand-50">
                  <td className="px-5 py-3 font-semibold">{r.size}</td>
                  <td className="px-5 py-3">{r.ru}</td>
                  <td className="px-5 py-3 tabular-nums">{r.bust}</td>
                  <td className="px-5 py-3 tabular-nums">{r.waist}</td>
                  <td className="px-5 py-3 tabular-nums">{r.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-12" delay={80}>
        <h2 className="display text-3xl">Обувь</h2>
        <div className="mt-4 overflow-x-auto rounded-3xl border border-sand bg-white">
          <table className="w-full min-w-[360px] text-sm">
            <thead className="bg-pearl text-left text-[0.65rem] uppercase tracking-[0.18em] text-mist">
              <tr>
                <th className="px-5 py-3 font-semibold">RU</th>
                <th className="px-5 py-3 font-semibold">EU</th>
                <th className="px-5 py-3 font-semibold">Длина стопы, см</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {shoes.map((r) => (
                <tr key={r.ru} className="transition-colors hover:bg-brand-50">
                  <td className="px-5 py-3 font-semibold">{r.ru}</td>
                  <td className="px-5 py-3">{r.eu}</td>
                  <td className="px-5 py-3 tabular-nums">{r.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-12" delay={120}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Грудь", "Измеряйте по самым выступающим точкам, лента проходит горизонтально и не стягивает."],
            ["Талия", "Самое узкое место корпуса, обычно чуть выше пупка. Не втягивайте живот."],
            ["Бёдра", "По самым широким точкам ягодиц, ноги вместе, лента параллельна полу."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-3xl bg-pearl p-6">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-sand bg-white p-6 md:flex-row md:items-center">
          <p className="text-sm text-ink-soft">Сомневаетесь между двумя размерами? Напишите нам — подскажем по конкретной модели.</p>
          <ButtonLink href="/stores" variant="outline" size="sm">
            Связаться
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
