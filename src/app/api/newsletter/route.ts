import { NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/data";
import { isValidEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
    if (!isValidEmail(email)) return NextResponse.json({ error: "Некорректный e-mail" }, { status: 400 });
    await subscribeEmail(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json({ error: "Не удалось подписаться" }, { status: 500 });
  }
}
