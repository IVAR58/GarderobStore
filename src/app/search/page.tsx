import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { parseCatalogParams, type RawSearchParams } from "@/lib/catalog-params";

export async function generateMetadata({ searchParams }: { searchParams: Promise<RawSearchParams> }): Promise<Metadata> {
  const { q } = parseCatalogParams(await searchParams);
  return { title: q ? `Поиск: ${q}` : "Поиск", robots: { index: false } };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const filters = parseCatalogParams(await searchParams);
  const q = filters.q;

  return (
    <CatalogView
      filters={filters}
      basePath="/catalog"
      eyebrow="Поиск"
      title={q ? <>«{q}»</> : "Что ищем?"}
      description={q ? "Результаты поиска по названию, описанию, категории и цвету." : "Введите запрос в строку поиска — например, «платье», «костюм» или «пальто»."}
      breadcrumbs={[{ label: "Поиск" }]}
      emptyTitle={q ? `По запросу «${q}» ничего не нашлось` : "Введите поисковый запрос"}
      emptyDescription="Проверьте написание или попробуйте более общее слово — например, «платье» вместо «платье миди в горох»."
    />
  );
}
