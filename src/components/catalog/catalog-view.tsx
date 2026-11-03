import { Suspense, type ReactNode } from "react";
import { ActiveFilters, CategoryChips, FilterPanel, MobileFilters, Pagination, SortSelect } from "@/components/catalog/catalog-controls";
import { ProductGrid } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/ui/feedback";
import { SearchIcon } from "@/components/ui/icons";
import { Breadcrumbs, ButtonLink, EmptyState } from "@/components/ui/primitives";
import type { Category } from "@/db/schema";
import { filtersKey } from "@/lib/catalog-params";
import { getCategories, getFilterOptions, getProducts } from "@/lib/data";
import type { CatalogFilters } from "@/lib/types";
import { productsCountLabel } from "@/lib/utils";

type CatalogViewProps = {
  filters: CatalogFilters;
  title: ReactNode;
  eyebrow?: string;
  description?: string | null;
  breadcrumbs: Array<{ label: string; href?: string }>;
  category?: Category;
  basePath?: string;
  heroImage?: string | null;
  emptyTitle?: string;
  emptyDescription?: string;
};

async function CatalogResults({ filters, emptyTitle, emptyDescription }: { filters: CatalogFilters; emptyTitle?: string; emptyDescription?: string }) {
  const result = await getProducts(filters);
  if (!result.items.length) {
    return (
      <EmptyState
        icon={<SearchIcon size={24} />}
        title={emptyTitle ?? "Ничего не нашлось"}
        description={emptyDescription ?? "Попробуйте изменить фильтры или посмотреть другие категории."}
        action={<ButtonLink href="/catalog" variant="outline">Весь каталог</ButtonLink>}
      />
    );
  }
  return (
    <>
      <p className="mb-5 text-xs text-mist lg:hidden">{productsCountLabel(result.total)}</p>
      <ProductGrid products={result.items} columns={4} priorityCount={4} />
      <Suspense fallback={null}>
        <Pagination page={result.page} totalPages={result.totalPages} />
      </Suspense>
    </>
  );
}

async function ResultCount({ filters }: { filters: CatalogFilters }) {
  const { total } = await getProducts({ ...filters, perPage: 1, page: 1 });
  return <span className="text-sm text-mist">{productsCountLabel(total)}</span>;
}

export async function CatalogView({ filters, title, eyebrow, description, breadcrumbs, category, basePath = "/catalog", heroImage, emptyTitle, emptyDescription }: CatalogViewProps) {
  const [categories, options] = await Promise.all([getCategories(), getFilterOptions(category?.slug)]);
  const key = filtersKey(filters);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-5 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow text-brand-600">{eyebrow}</p>}
          <h1 className="display mt-2 text-[2.4rem] leading-[1] md:text-[3.4rem]">{title}</h1>
          {description && <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">{description}</p>}
        </div>
        {heroImage && (
          <div className="hidden overflow-hidden rounded-2xl lg:block lg:h-28 lg:w-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroImage} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        )}
      </div>

      <div className="mt-6 lg:mt-8">
        <CategoryChips categories={categories} activeSlug={category?.slug} basePath={basePath} />
      </div>

      <div className="mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[260px_1fr] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <Suspense fallback={null}>
              <FilterPanel options={options} filters={filters} lockedCategory={category?.slug} />
            </Suspense>
          </div>
        </aside>

        <section aria-label="Товары">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Suspense fallback={null}>
                <MobileFilters options={options} filters={filters} lockedCategory={category?.slug} />
              </Suspense>
              <span className="hidden lg:inline">
                <Suspense fallback={<span className="skeleton inline-block h-4 w-24 rounded-full" />}>
                  <ResultCount filters={filters} />
                </Suspense>
              </span>
            </div>
            <Suspense fallback={null}>
              <SortSelect value={filters.sort ?? "featured"} />
            </Suspense>
          </div>

          <div className="mt-4 empty:hidden">
            <Suspense fallback={null}>
              <ActiveFilters filters={filters} />
            </Suspense>
          </div>

          <div className="mt-6">
            <Suspense key={key} fallback={<ProductGridSkeleton count={8} />}>
              <CatalogResults filters={filters} emptyTitle={emptyTitle} emptyDescription={emptyDescription} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
