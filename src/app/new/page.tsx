import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { parseCatalogParams, type RawSearchParams } from "@/lib/catalog-params";

export const metadata: Metadata = {
  title: "Новинки",
  description: "Новые поступления женской одежды, обуви и аксессуаров в Garderob_store.",
};

export default async function NewArrivalsPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const parsed = parseCatalogParams(await searchParams);
  const filters = { ...parsed, onlyNew: true, sort: parsed.sort === "featured" ? ("new" as const) : parsed.sort };
  return (
    <CatalogView
      filters={filters}
      basePath="/new"
      eyebrow="Только что"
      title="Новинки"
      description="Свежие поступления этой недели: то, что уже примеряют в наших магазинах."
      breadcrumbs={[{ label: "Новинки" }]}
      emptyTitle="Новинок с такими параметрами нет"
      emptyDescription="Попробуйте снять часть фильтров — или загляните в полный каталог."
    />
  );
}
