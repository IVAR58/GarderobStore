import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-card";
import { Accordion, ProductGallery, PurchasePanel } from "@/components/product/product-details";
import { ProductGridSkeleton } from "@/components/ui/feedback";
import { Badge, Breadcrumbs, Price, Reveal, SectionHeading, TextLink } from "@/components/ui/primitives";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { site } from "@/lib/site";
import type { ProductWithCategory } from "@/lib/types";
import { discountPercent, formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

async function RelatedProducts({ product }: { product: ProductWithCategory }) {
  const related = await getRelatedProducts(product, 4);
  if (!related.length) return null;
  return (
    <Reveal>
      <ProductGrid products={related} columns={4} />
    </Reveal>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Товар не найден" };
  return {
    title: `${product.name} — купить за ${formatPrice(product.price)}`,
    description: product.description,
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-28 pt-5 lg:px-8 lg:pb-16 lg:pt-8">
      <Breadcrumbs items={[{ label: "Каталог", href: "/catalog" }, { label: product.categoryName, href: `/catalog/${product.categorySlug}` }, { label: product.name }]} />

      <div className="mt-5 grid gap-8 lg:mt-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        <div>
          <ProductGallery product={product} />
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/catalog/${product.categorySlug}`} className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-mist transition-colors hover:text-ink">
              {product.categoryName}
            </Link>
            {product.isNew && <Badge tone="brand">New</Badge>}
            {product.isBestseller && <Badge tone="ink">Хит</Badge>}
            {discount > 0 && <Badge tone="sale">−{discount}%</Badge>}
          </div>
          <h1 className="display mt-3 text-[2rem] leading-[1.05] md:text-[2.6rem]">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
            {product.inStock ? (
              <span className="flex items-center gap-1.5 text-xs text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> В наличии
              </span>
            ) : (
              <span className="text-xs text-mist">Нет в наличии</span>
            )}
          </div>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-8">
            <PurchasePanel product={product} />
          </div>

          <div className="mt-10">
            <Accordion
              items={[
                {
                  title: "Состав и уход",
                  content: (
                    <ul className="space-y-1.5">
                      {product.details.map((d) => (
                        <li key={d} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  title: "Доставка и оплата",
                  content: (
                    <div className="space-y-2">
                      <p>Самовывоз из четырёх магазинов в Казани — бесплатно, обычно уже на следующий день.</p>
                      <p>
                        Курьер по Казани — {formatPrice(site.delivery.courier)}, СДЭК по России — от {formatPrice(site.delivery.cdek)}. При заказе от {formatPrice(site.delivery.freeFrom)} доставка бесплатная.
                      </p>
                      <p>Оплата картой онлайн, через СБП или при получении.</p>
                      <Link href="/delivery" className="nav-link inline-block text-ink">
                        Подробнее об условиях
                      </Link>
                    </div>
                  ),
                },
                {
                  title: "Обмен и возврат",
                  content: <p>Если вещь не подошла, её можно обменять или вернуть в течение 14 дней с сохранением товарного вида и бирок. Нижнее бельё и бижутерия обмену не подлежат.</p>,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <section className="mt-20 lg:mt-28">
        <Reveal>
          <SectionHeading eyebrow="Дополните образ" title="Вам также понравится" action={<TextLink href={`/catalog/${product.categorySlug}`}>Ещё {product.categoryName.toLowerCase()}</TextLink>} />
        </Reveal>
        <div className="mt-8">
          <Suspense fallback={<ProductGridSkeleton count={4} />}>
            <RelatedProducts product={product} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
