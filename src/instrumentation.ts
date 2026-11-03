export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { ensureDb } = await import("./db/ensure");
    try {
      await ensureDb();
    } catch (error) {
      console.error("[garderob] database bootstrap failed", error);
    }
  }
}
