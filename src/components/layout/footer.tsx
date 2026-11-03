"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon, SpinnerIcon, TelegramIcon, VkIcon, WhatsappIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/primitives";
import type { Category, Store } from "@/db/schema";
import { companyLinks, customerLinks, site } from "@/lib/site";
import { isValidEmail } from "@/lib/utils";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setState("error");
      setMessage("Проверьте адрес e-mail");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setMessage("Спасибо! Промокод WELCOME уже ждёт вас при оформлении заказа.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("Не получилось подписаться. Попробуйте ещё раз.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5">
      <div className="flex items-center gap-2 border-b border-white/30 pb-2 focus-within:border-white">
        <MailIcon size={18} className="shrink-0 text-white/60" />
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="Ваш e-mail"
          aria-label="E-mail для рассылки"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/50"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
          aria-label="Подписаться"
        >
          {state === "loading" ? <SpinnerIcon size={16} /> : <ArrowRightIcon size={16} />}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-xs animate-fade-in ${state === "error" ? "text-brand-200" : "text-white/80"}`} role="status">
          {message}
        </p>
      )}
    </form>
  );
}

export function Footer({ categories, stores }: { categories: Category[]; stores: Store[] }) {
  return (
    <footer className="mt-24 bg-ink text-white pb-mobile-nav">
      <div className="mx-auto max-w-[1440px] px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo className="[&_.display]:text-white [&_.eyebrow]:text-white/50" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{site.description}</p>
            <div className="mt-6 flex gap-2">
              <a href={site.socials.telegram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white hover:bg-white hover:text-ink" aria-label="Telegram">
                <TelegramIcon size={17} />
              </a>
              <a href={site.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white hover:bg-white hover:text-ink" aria-label="WhatsApp">
                <WhatsappIcon size={17} />
              </a>
              <a href={site.socials.vk} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white hover:bg-white hover:text-ink" aria-label="ВКонтакте">
                <VkIcon size={17} />
              </a>
            </div>
            <div className="mt-8">
              <p className="eyebrow text-white/60">Рассылка</p>
              <p className="mt-2 text-sm text-white/80">Новинки, акции и закрытые распродажи — первыми.</p>
              <NewsletterForm />
            </div>
          </div>

          <div>
            <p className="eyebrow text-white/60">Каталог</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/catalog/${c.slug}`} className="text-white/80 transition-colors hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sale" className="text-brand-300 transition-colors hover:text-white">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/60">Покупателям</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {customerLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-8 text-white/60">Компания</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/60">Магазины в Казани</p>
            <ul className="mt-4 space-y-3 text-sm">
              {stores.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.mapUrl ?? site.socials.yandexMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-white/80 transition-colors hover:text-white"
                  >
                    <MapPinIcon size={16} className="mt-0.5 shrink-0 text-brand-300" />
                    {s.address}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 text-sm text-white/80">
              <p className="flex items-center gap-2">
                <ClockIcon size={16} className="text-brand-300" /> {site.hoursShort}
              </p>
              <a href={site.phoneHref} className="flex items-center gap-2 transition-colors hover:text-white">
                <PhoneIcon size={16} className="text-brand-300" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 transition-colors hover:text-white">
                <MailIcon size={16} className="text-brand-300" /> {site.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.tagline}. Все права защищены.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="rounded border border-white/15 px-2 py-0.5 tracking-wider">МИР</span>
            <span className="rounded border border-white/15 px-2 py-0.5 tracking-wider">VISA</span>
            <span className="rounded border border-white/15 px-2 py-0.5 tracking-wider">MASTERCARD</span>
            <span className="rounded border border-white/15 px-2 py-0.5 tracking-wider">СБП</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
