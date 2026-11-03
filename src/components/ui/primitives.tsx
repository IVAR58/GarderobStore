"use client";

import Link from "next/link";
import { useEffect, useRef, useState} from "react";
import { cn, formatPrice } from "@/lib/utils";
import { site } from "@/lib/site";
import { SpinnerIcon, ChevronRightIcon } from "./icons";

/* ——— Логотип ——— */
export function LogoMark({ className, size = 40 }: { className?: string; size?: number }) {
  // Монограмма GB. Чтобы использовать фирменный файл, замените SVG на <img src="/logo.png" />.
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role="img"
      aria-label={site.name}
    >
      <rect width="64" height="64" rx="16" fill="#E9A3C4" />
      <text
        x="33"
        y="35"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-manrope), Arial, sans-serif"
        fontWeight="800"
        fontSize="30"
        letterSpacing="-3.5"
        fill="#F8DDE9"
      >
        GB
      </text>
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)} aria-label={`${site.name} — на главную`}>
      <LogoMark size={compact ? 34 : 40} className="transition-transform duration-500 group-hover:rotate-[-6deg]" />
      <span className="flex flex-col leading-none">
        <span className="display text-[1.45rem] tracking-[0.04em] text-ink md:text-[1.6rem]">
          {site.displayName}
          <span className="text-brand-500">_</span>store
        </span>
        {!compact && <span className="eyebrow mt-1 text-[0.58rem] text-mist">{site.tagline}</span>}
      </span>
    </Link>
  );
}

/* ——— Кнопка ——— */
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "brand";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-ink-soft shadow-[0_12px_30px_-14px_rgba(28,23,25,.6)]",
  brand: "bg-brand-300 text-ink hover:bg-brand-400 shadow-[0_12px_30px_-14px_rgba(233,163,196,.9)]",
  secondary: "bg-white text-ink border border-sand hover:border-ink",
  outline: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-white",
  ghost: "bg-transparent text-ink hover:bg-pearl",
};
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.78rem]",
  md: "h-12 px-6 text-[0.82rem]",
  lg: "h-14 px-8 text-[0.86rem]",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  full?: boolean;
};

export function Button({ variant = "primary", size = "md", loading, full, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.16em] transition-all duration-300 ease-out",
        "active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        variantClasses[variant],
        sizeClasses[size],
        full && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <SpinnerIcon size={16} />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  full,
  className,
  children,
  external,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.16em] transition-all duration-300 ease-out active:scale-[0.97]",
    variantClasses[variant],
    sizeClasses[size],
    full && "w-full",
    className,
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* ——— Появление при прокрутке ——— */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as "div";
  return (
    <Component
      ref={ref as never}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}

/* ——— Изображение товара с фирменной заглушкой ——— */
export function ProductImage({ src, alt, className, imgClassName, sizes, priority, }: { src?: string | null; alt: string; className?: string; imgClassName?: string; sizes?: string; priority?: boolean; }) { const [failed, setFailed] = useState(false); const [loaded, setLoaded] = useState(false); const imageRef = useRef<HTMLImageElement>(null);
const showPlaceholder = !src || failed;
useEffect(() => { setLoaded(false); setFailed(false);
const image = imageRef.current;

if (image?.complete && image.naturalWidth > 0) {
  setLoaded(true);
}
}, [src]);
return ( <div className={cn("relative overflow-hidden bg-pearl", className)}> {showPlaceholder ? ( <ImagePlaceholder label={alt} /> ) : ( <> {!loaded && ( <div className="skeleton absolute inset-0" aria-hidden /> )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-700",
          "opacity-100",
          imgClassName,
        )}
      />
    </>
  )}
</div>
); }

export function ImagePlaceholder({ label }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#fae7f0,#f6f0f2_55%,#fdf5f9)] p-6 text-center">
      <LogoMark size={44} className="opacity-80" />
      <span className="eyebrow text-[0.55rem] text-brand-600/70">Фото скоро</span>
      {label && <span className="line-clamp-2 max-w-[12rem] text-xs text-mist">{label}</span>}
    </div>
  );
}

/* ——— Цена ——— */
export function Price({
  price,
  compareAtPrice,
  className,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const hasDiscount = Boolean(compareAtPrice && compareAtPrice > price);
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      <span
        className={cn(
          "font-semibold tabular-nums",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-2xl",
          hasDiscount && "text-brand-600",
        )}
      >
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span className={cn("text-mist line-through tabular-nums", size === "lg" ? "text-base" : "text-xs")}>
          {formatPrice(compareAtPrice!)}
        </span>
      )}
    </span>
  );
}

/* ——— Бейдж ——— */
export function Badge({ children, tone = "ink", className }: { children: ReactNode; tone?: "ink" | "brand" | "sale" | "white"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em]",
        tone === "ink" && "bg-ink text-white",
        tone === "brand" && "bg-brand-300 text-ink",
        tone === "sale" && "bg-brand-600 text-white",
        tone === "white" && "bg-white/90 text-ink backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ——— Хлебные крошки ——— */
export function Breadcrumbs({ items, className }: { items: Array<{ label: string; href?: string }>; className?: string }) {
  return (
    <nav aria-label="Хлебные крошки" className={cn("flex flex-wrap items-center gap-1.5 text-xs text-mist", className)}>
      <Link href="/" className="transition-colors hover:text-ink">
        Главная
      </Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          <ChevronRightIcon size={12} className="opacity-60" />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ——— Заголовок секции ——— */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow text-brand-600">{eyebrow}</p>}
        <h2 className="display mt-3 text-[2rem] md:text-[2.6rem]">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-ink-soft md:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-ink",
        className,
      )}
    >
      <span className="nav-link">{children}</span>
      <ChevronRightIcon size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

/* ——— Пустое состояние ——— */
export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-sand bg-white/60 px-6 py-16 text-center">
      {icon && <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">{icon}</div>}
      <h3 className="display text-2xl">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
