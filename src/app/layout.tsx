import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { CartDrawer, MobileMenu, SearchOverlay } from "@/components/layout/drawers";
import { Header, MobileTabBar } from "@/components/layout/header";
import { StoreProvider } from "@/components/providers/store-provider";
import { NavProgressProvider, Toaster } from "@/components/ui/feedback";
import { getCategories, getStores } from "@/lib/data";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — женская одежда в Казани`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["женская одежда", "Казань", "платья", "костюмы", "Garderob", "garderob_store"],
  openGraph: {
    title: `${site.name} — женская одежда в Казани`,
    description: site.description,
    type: "website",
    locale: "ru_RU",
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#E9A3C4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [categories, stores] = await Promise.all([getCategories(), getStores()]);

  return (
    <html lang="ru" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh antialiased">
        <StoreProvider>
          <NavProgressProvider>
            <Header categories={categories} />
            <main className="min-h-[60vh]">{children}</main>
            <Footer categories={categories} stores={stores} />
            <MobileTabBar />
            <MobileMenu categories={categories} />
            <CartDrawer />
            <SearchOverlay categories={categories} />
            <Toaster />
          </NavProgressProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
