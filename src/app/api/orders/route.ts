import { NextResponse } from "next/server";
import { createOrder } from "@/lib/data";
import type { CheckoutPayload, DeliveryMethod, PaymentMethod } from "@/lib/types";
import { isValidEmail, isValidPhone } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DELIVERY: DeliveryMethod[] = ["pickup", "courier", "cdek"];
const PAYMENT: PaymentMethod[] = ["card", "sbp", "cash"];

function str(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Partial<CheckoutPayload>;
  try {
    body = (await request.json()) as Partial<CheckoutPayload>;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const customerName = str(body.customerName, 120);
  const phone = str(body.phone, 30);
  const email = str(body.email, 120);
  const deliveryMethod = body.deliveryMethod as DeliveryMethod;
  const paymentMethod = body.paymentMethod as PaymentMethod;

  if (customerName.length < 2) return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
  if (!isValidPhone(phone)) return NextResponse.json({ error: "Укажите корректный телефон" }, { status: 400 });
  if (email && !isValidEmail(email)) return NextResponse.json({ error: "Укажите корректный e-mail" }, { status: 400 });
  if (!DELIVERY.includes(deliveryMethod)) return NextResponse.json({ error: "Выберите способ доставки" }, { status: 400 });
  if (!PAYMENT.includes(paymentMethod)) return NextResponse.json({ error: "Выберите способ оплаты" }, { status: 400 });

  const address = str(body.address, 300);
  const city = str(body.city, 100);
  const pickupStore = str(body.pickupStore, 200);
  if (deliveryMethod === "pickup" && !pickupStore) return NextResponse.json({ error: "Выберите магазин для самовывоза" }, { status: 400 });
  if (deliveryMethod !== "pickup" && (!address || !city)) return NextResponse.json({ error: "Укажите адрес доставки" }, { status: 400 });

  const items = Array.isArray(body.items)
    ? body.items
        .filter((i) => i && Number.isInteger(i.productId) && Number.isFinite(i.quantity))
        .map((i) => ({
          productId: Number(i.productId),
          quantity: Math.max(1, Math.min(10, Math.floor(Number(i.quantity)))),
          size: typeof i.size === "string" ? i.size.slice(0, 40) : null,
          color: typeof i.color === "string" ? i.color.slice(0, 40) : null,
        }))
    : [];
  if (!items.length) return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });

  try {
    const result = await createOrder({
      customerName,
      phone,
      email: email || undefined,
      deliveryMethod,
      paymentMethod,
      city: city || undefined,
      address: address || undefined,
      pickupStore: pickupStore || undefined,
      comment: str(body.comment, 1000) || undefined,
      promoCode: str(body.promoCode, 30) || undefined,
      items,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[api/orders]", error);
    const message = error instanceof Error ? error.message : "Не удалось оформить заказ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
