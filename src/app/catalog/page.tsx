import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { parseCatalogParams, type RawSearchParams } from "@/lib/catalog-params";

export const metadata: Metadata = {
  title: "Каталог женской одежды",
  description: "Платья, костюмы, блузы, верхняя одежда, трикотаж, обувь и бижутерия — полный каталог Garderob_store.",
};

export default async function CatalogPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const filters = parseCatalogParams(await searchParams);
  return (
    <CatalogView
      filters={filters}
      eyebrow="Каталог"
      title="Все товары"
      description="Полный ассортимент магазинов Garderob: от базовых вещей на каждый день до нарядов для особых случаев."
      breadcrumbs={[{ label: "Каталог" }]}
    />
  );
}
