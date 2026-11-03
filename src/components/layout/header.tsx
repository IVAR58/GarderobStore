"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import { useNavProgress } from "@/components/ui/feedback";
import { BagIcon, GridIcon, HeartIcon, HomeIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { Logo, LogoMark, ProductImage } from "@/components/ui/primitives";
import type { Category } from "@/db/schema";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

function CountBadge({ count, className }: { count: number; className?: string }) {
  if (!count) return null;
  return (
    <span
      key={count}
      className={cn(
        "absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-[0.6rem] font-bold text-white animate-pop",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const { cartCount, wishlist, hydrated, setCartOpen, setMenuOpen, setSearchOpen } = useStore();
  const { start } = useNavProgress();
  const [scrolled, setScrolled] = useState(false);
  const wishCount = hydrated ? wishlist.length : 0;
  const count = hydrated ? cartCount : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-white">
        <p className="mx-auto max-w-[1440px] truncate px-4 py-2 text-center text-[0.68rem] font-medium uppercase tracking-[0.22em] text-white/90 md:text-[0.7rem]">
          {site.announcement}
        </p>
      </div>

      <div
        className={cn(
          "border-b border-sand/80 bg-cream/85 backdrop-blur-xl transition-shadow duration-500",
          scrolled && "shadow-[0_10px_40px_-24px_rgba(28,23,25,0.35)]",
        )}
      >
        {/* ——— Мобильная шапка ——— */}
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-pearl"
            aria-label="Открыть меню"
          >
            <MenuIcon size={22} />
          </button>
          <Logo compact />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-pearl"
              aria-label="Поиск"
            >
              <SearchIcon size={21} />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-pearl"
              aria-label={`Корзина, ${count} товаров`}
            >
              <BagIcon size={21} />
              <CountBadge count={count} className="-right-0.5 -top-0.5" />
            </button>
          </div>
        </div>

        {/* ——— Десктопная шапка ——— */}
        <div className="mx-auto hidden h-20 max-w-[1440px] items-center justify-between px-8 lg:flex">
          <Logo />

          <nav aria-label="Основная навигация">
            <ul className="flex items-center gap-8">
              {mainNav.map((item) => {
                const isCatalog = item.href === "/catalog";
                return (
                  <li key={item.href} className={cn("flex h-20 items-center", isCatalog && "group")}>
                    <Link
                      href={item.href}
                      onClick={() => !isActive(item.href) && start()}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "nav-link py-2 text-[0.78rem] font-semibold uppercase tracking-[0.2em] transition-colors",
                        item.accent ? "text-brand-600" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>

                    {isCatalog && (
                      <div className="invisible absolute inset-x-0 top-full translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <div className="border-b border-sand bg-white/95 shadow-float backdrop-blur-xl">
                          <div className="mx-auto grid max-w-[1440px] grid-cols-[1.1fr_3fr] gap-10 px-8 py-8">
                            <div>
                              <p className="eyebrow text-brand-600">Каталог</p>
                              <h3 className="display mt-3 text-3xl">Всё, что в тренде этого сезона</h3>
                              <p className="mt-3 text-sm text-ink-soft">
                                Костюмы, платья, трикотаж, обувь и бижутерия — собрали полный гардероб в одном месте.
                              </p>
                              <Link href="/catalog" className="nav-link mt-6 inline-block text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
                                Смотреть все товары
                              </Link>
                            </div>
                            <ul className="grid grid-cols-3 gap-x-6 gap-y-5 xl:grid-cols-5">
                              {categories.map((c) => (
                                <li key={c.id}>
                                  <Link href={`/catalog/${c.slug}`} className="group/cat block">
                                    <ProductImage
                                      src={c.image}
                                      alt={c.name}
                                      className="aspect-[4/5] rounded-xl"
                                      imgClassName="transition-transform duration-700 group-hover/cat:scale-105"
                                    />
                                    <span className="mt-2 block text-sm font-medium text-ink transition-colors group-hover/cat:text-brand-600">
                                      {c.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-11 items-center gap-2 rounded-full px-3 text-ink transition-colors hover:bg-pearl"
              aria-label="Поиск"
            >
              <SearchIcon size={20} />
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em]">Поиск</span>
            </button>
            <Link
              href="/wishlist"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-pearl"
              aria-label={`Избранное, ${wishCount} товаров`}
            >
              <HeartIcon size={21} filled={wishCount > 0} className={cn(wishCount > 0 && "text-brand-500")} />
              <CountBadge count={wishCount} className="right-0.5 top-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-pearl"
              aria-label={`Корзина, ${count} товаров`}
            >
              <BagIcon size={21} />
              <CountBadge count={count} className="right-0.5 top-0.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ——— Нижняя навигация для мобильных ——— */
export function MobileTabBar() {
  const pathname = usePathname();
  const { cartCount, wishlist, hydrated, setSearchOpen, searchOpen } = useStore();
  const count = hydrated ? cartCount : 0;
  const wishCount = hydrated ? wishlist.length : 0;

  const tabs = [
    { label: "Главная", href: "/", icon: HomeIcon, active: pathname === "/" },
    { label: "Каталог", href: "/catalog", icon: GridIcon, active: pathname.startsWith("/catalog") || pathname.startsWith("/new") || pathname.startsWith("/sale") },
    { label: "Поиск", action: () => setSearchOpen(true), icon: SearchIcon, active: searchOpen || pathname.startsWith("/search") },
    { label: "Избранное", href: "/wishlist", icon: HeartIcon, active: pathname.startsWith("/wishlist"), badge: wishCount },
    { label: "Корзина", href: "/cart", icon: BagIcon, active: pathname.startsWith("/cart") || pathname.startsWith("/checkout"), badge: count },
  ];

  return (
    <nav
      aria-label="Мобильная навигация"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const inner = (
            <>
              <span className="relative">
                <Icon size={22} className={cn("transition-transform duration-300", tab.active && "scale-110")} />
                {tab.badge ? (
                  <span
                    key={tab.badge}
                    className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-500 px-1 text-[0.55rem] font-bold text-white animate-pop"
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em]">{tab.label}</span>
              <span className={cn("h-1 w-1 rounded-full bg-brand-500 transition-opacity", tab.active ? "opacity-100" : "opacity-0")} />
            </>
          );
          const cls = cn(
            "flex h-[4.25rem] w-full flex-col items-center justify-center gap-1 transition-colors",
            tab.active ? "text-ink" : "text-mist",
          );
          return (
            <li key={tab.label}>
              {tab.href ? (
                <Link href={tab.href} className={cls} aria-current={tab.active ? "page" : undefined}>
                  {inner}
                </Link>
              ) : (
                <button type="button" onClick={tab.action} className={cls}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { LogoMark };
