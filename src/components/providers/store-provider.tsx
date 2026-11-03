"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, WishItem } from "@/lib/types";

type ToastKind = "success" | "info" | "wishlist" | "error";
export type Toast = { id: number; message: string; kind: ToastKind; href?: string; actionLabel?: string };

type AddToCartInput = Omit<CartLine, "key" | "quantity"> & { quantity?: number };

type StoreContextValue = {
  hydrated: boolean;
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (input: AddToCartInput) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  wishlist: WishItem[];
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (item: Omit<WishItem, "addedAt">) => void;
  removeFromWishlist: (productId: number) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "garderob:cart:v1";
const WISH_KEY = "garderob:wishlist:v1";
const PROMO_KEY = "garderob:promo:v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function lineKey(productId: number, size: string | null, color: string | null) {
  return `${productId}::${size ?? "-"}::${color ?? "-"}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<WishItem[]>([]);
  const [promoCode, setPromoCodeState] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    // Восстанавливаем состояние из localStorage после монтирования (без расхождений с SSR).
    const frame = window.requestAnimationFrame(() => {
      setCart(readJson<CartLine[]>(CART_KEY, []));
      setWishlist(readJson<WishItem[]>(WISH_KEY, []));
      setPromoCodeState(readJson<string>(PROMO_KEY, ""));
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(PROMO_KEY, JSON.stringify(promoCode));
  }, [promoCode, hydrated]);

  // Блокируем прокрутку страницы, пока открыт любой оверлей.
  useEffect(() => {
    const anyOpen = cartOpen || menuOpen || searchOpen;
    document.documentElement.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [cartOpen, menuOpen, searchOpen]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = ++toastId.current;
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
      window.setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );

  const addToCart = useCallback(
    (input: AddToCartInput) => {
      const key = lineKey(input.productId, input.size, input.color);
      const quantity = Math.max(1, input.quantity ?? 1);
      setCart((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(10, l.quantity + quantity) } : l));
        }
        return [...prev, { ...input, key, quantity }];
      });
      pushToast({ message: `${input.name} — добавлено в корзину`, kind: "success", href: "/cart", actionLabel: "Корзина" });
    },
    [pushToast],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, quantity: Math.min(10, quantity) } : l)),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const isWishlisted = useCallback((productId: number) => wishlist.some((w) => w.productId === productId), [wishlist]);

  const toggleWishlist = useCallback(
    (item: Omit<WishItem, "addedAt">) => {
      const exists = wishlist.some((w) => w.productId === item.productId);
      if (exists) {
        setWishlist((prev) => prev.filter((w) => w.productId !== item.productId));
        pushToast({ message: "Удалено из избранного", kind: "info" });
      } else {
        setWishlist((prev) => [{ ...item, addedAt: Date.now() }, ...prev]);
        pushToast({ message: `${item.name} — в избранном`, kind: "wishlist", href: "/wishlist", actionLabel: "Открыть" });
      }
    },
    [wishlist, pushToast],
  );

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist((prev) => prev.filter((w) => w.productId !== productId));
  }, []);

  const setPromoCode = useCallback((code: string) => setPromoCodeState(code.trim().toUpperCase()), []);

  const cartCount = useMemo(() => cart.reduce((sum, l) => sum + l.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, l) => sum + l.price * l.quantity, 0), [cart]);

  const value = useMemo<StoreContextValue>(
    () => ({
      hydrated,
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      cartOpen,
      setCartOpen,
      menuOpen,
      setMenuOpen,
      searchOpen,
      setSearchOpen,
      toasts,
      pushToast,
      dismissToast,
      promoCode,
      setPromoCode,
    }),
    [
      hydrated,
      cart,
      cartCount,
      cartSubtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      cartOpen,
      menuOpen,
      searchOpen,
      toasts,
      pushToast,
      dismissToast,
      promoCode,
      setPromoCode,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
