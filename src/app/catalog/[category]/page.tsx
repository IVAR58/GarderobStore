import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import { parseCatalogParams, type RawSearchParams } from "@/lib/catalog-params";
import { getCategoryBySlug } from "@/lib/data";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) return { title: "Категория не найдена" };
  return {
    title: `${cat.name} — купить в Казани`,
    description: cat.description ?? `${cat.name} в магазинах Garderob_store в Казани и с доставкой по России.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const cat = await getCategoryBySlug(category);
  if (!cat) notFound();

  const filters = { ...parseCatalogParams(await searchParams), category: cat.slug };

  return (
    <CatalogView
      filters={filters}
      category={cat}
      eyebrow="Каталог"
      title={cat.name}
      description={cat.description}
      heroImage={cat.image}
      breadcrumbs={[{ label: "Каталог", href: "/catalog" }, { label: cat.name }]}
    />
  );
}
