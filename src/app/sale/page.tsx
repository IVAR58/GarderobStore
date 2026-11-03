import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { parseCatalogParams, type RawSearchParams } from "@/lib/catalog-params";

export const metadata: Metadata = {
  title: "Sale — скидки на женскую одежду",
  description: "Товары со скидкой в Garderob_store: платья, костюмы, пальто, обувь и аксессуары по сниженным ценам.",
};

export default async function SalePage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const filters = { ...parseCatalogParams(await searchParams), onlySale: true };
  return (
    <CatalogView
      filters={filters}
      basePath="/sale"
      eyebrow="Выгодно"
      title={
        <>
          Sale <span className="text-brand-600">%</span>
        </>
      }
      description="Избранные модели по сниженным ценам. Количество ограничено — размеры разбирают быстро."
      breadcrumbs={[{ label: "Sale" }]}
      emptyTitle="Со скидкой пока ничего не нашлось"
      emptyDescription="Измените фильтры или посмотрите новинки — скидки обновляются регулярно."
    />
  );
}
