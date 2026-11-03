import { NextResponse, type NextRequest } from "next/server";
import { searchProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ items: [] });
  try {
    const items = await searchProducts(q.slice(0, 80), 8);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("[api/search]", error);
    return NextResponse.json({ items: [], error: "search_failed" }, { status: 500 });
  }
}
