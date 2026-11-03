import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Breadcrumbs } from "@/components/ui/primitives";
import { getStores } from "@/lib/data";

export const metadata: Metadata = { title: "Оформление заказа", robots: { index: false } };

export default async function CheckoutPage() {
  const stores = await getStores();
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-5 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: "Корзина", href: "/cart" }, { label: "Оформление" }]} />
      <div className="mt-5 lg:mt-8">
        <p className="eyebrow text-brand-600">Последний шаг</p>
        <h1 className="display mt-2 text-[2.4rem] leading-[1] md:text-[3.4rem]">Оформление заказа</h1>
      </div>
      <div className="mt-8 lg:mt-12">
        <CheckoutForm stores={stores} />
      </div>
    </div>
  );
}
