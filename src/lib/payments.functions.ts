import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Preço do download do CV (MZN), configurável pelo admin em app_settings. */
export const getCvPrice = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("key", "cv_price_mzn")
    .maybeSingle();
  return { price: Number(data?.value ?? 150) };
});

/** Diz se o utilizador já pagou (tem pelo menos uma compra confirmada). */
export const getCvAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("cv_purchases")
      .select("id")
      .eq("status", "paid")
      .limit(1);
    return { paid: (data?.length ?? 0) > 0 };
  });

/** Cria um pagamento na PaySuite e devolve o link de checkout (M-Pesa, e-Mola, cartão). */
export const createCvPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { returnUrl: string }) => data)
  .handler(async ({ data, context }) => {
    const apiKey = process.env["PAYSUITE_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, error: "Pagamentos ainda não configurados. Falta a chave PaySuite." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: setting } = await supabaseAdmin
      .from("app_settings")
      .select("value")
      .eq("key", "cv_price_mzn")
      .maybeSingle();
    const amount = Number(setting?.value ?? 150);
    const reference = `CV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

    await supabaseAdmin.from("cv_purchases").insert({
      user_id: context.userId,
      reference,
      amount,
      status: "pending",
    });

    const origin = new URL(data.returnUrl).origin;
    const response = await fetch("https://paysuite.tech/api/v1/payments", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        amount: String(amount),
        reference,
        description: "Download de CV - Moza Empregos",
        return_url: data.returnUrl,
        callback_url: `${origin}/api/public/paysuite-webhook`,
      }),
    });

    const json = (await response.json().catch(() => null)) as
      | { status?: string; data?: { id?: string; checkout_url?: string }; message?: string }
      | null;

    if (!response.ok || !json?.data?.checkout_url) {
      console.error("PaySuite create failed", response.status, json?.message);
      return { ok: false as const, error: json?.message ?? "Não foi possível iniciar o pagamento." };
    }

    if (json.data.id) {
      await supabaseAdmin
        .from("cv_purchases")
        .update({ provider_id: json.data.id })
        .eq("reference", reference);
    }

    return { ok: true as const, checkoutUrl: json.data.checkout_url, reference };
  });
