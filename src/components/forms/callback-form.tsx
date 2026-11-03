"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/primitives";
import { formatPhoneInput, isValidPhone } from "@/lib/utils";

export function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Укажите имя");
    if (!isValidPhone(phone)) return setError("Укажите телефон полностью");
    setError("");
    setState("loading");
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("idle");
      setError("Не удалось отправить. Попробуйте ещё раз или позвоните нам.");
    }
  };

  if (state === "done") {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-brand-100 px-6 py-12 text-center animate-fade-in">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-300 text-ink animate-pop">
          <CheckIcon size={24} />
        </span>
        <p className="display mt-5 text-2xl">Заявка отправлена</p>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">Перезвоним в рабочее время — ежедневно с 10:00 до 21:00.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-sand bg-white p-6 md:p-8">
      <h3 className="display text-2xl">Заказать звонок</h3>
      <p className="mt-2 text-sm text-ink-soft">Поможем подобрать размер, расскажем о наличии в конкретном магазине и отправим фото.</p>
      <div className="mt-6 grid gap-4">
        <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Имя" autoComplete="name" />
        <input value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} className="field" placeholder="+7 (___) ___-__-__" inputMode="tel" autoComplete="tel" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="field resize-none" placeholder="Что вас интересует? (необязательно)" />
      </div>
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      <Button type="submit" full className="mt-5" loading={state === "loading"}>
        Перезвоните мне
      </Button>
      <p className="mt-3 text-center text-[0.7rem] text-mist">Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.</p>
    </form>
  );
}
