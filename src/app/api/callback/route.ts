import { NextResponse } from "next/server";
import { createCallbackRequest } from "@/lib/data";
import { isValidPhone } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; phone?: string; message?: string };
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
    if (name.length < 2) return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
    if (!isValidPhone(phone)) return NextResponse.json({ error: "Укажите корректный телефон" }, { status: 400 });
    await createCallbackRequest({ name, phone, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/callback]", error);
    return NextResponse.json({ error: "Не удалось отправить заявку" }, { status: 500 });
  }
}
