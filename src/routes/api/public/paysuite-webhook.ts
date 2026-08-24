import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

type PaySuiteEvent = {
  event?: string;
  data?: { id?: string; reference?: string; method?: string; amount?: string | number; status?: string };
};

function validSignature(body: string, signature: string | null): boolean {
  const secret = process.env["PAYSUITE_WEBHOOK_SECRET"];
  if (!secret) return false;
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  const a = Buffer.from(signature.trim());
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/paysuite-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();
        const signature =
          request.headers.get("x-paysuite-signature") ?? request.headers.get("x-signature");

        if (!validSignature(body, signature)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: PaySuiteEvent;
        try {
          payload = JSON.parse(body) as PaySuiteEvent;
        } catch {
          return new Response("Invalid body", { status: 400 });
        }

        const reference = payload.data?.reference;
        if (!reference) return new Response("Missing reference", { status: 400 });

        const paid = payload.event === "payment.success" || payload.data?.status === "success";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        await supabaseAdmin
          .from("cv_purchases")
          .update({
            status: paid ? "paid" : "failed",
            method: payload.data?.method ?? null,
            provider_id: payload.data?.id ?? null,
            paid_at: paid ? new Date().toISOString() : null,
          })
          .eq("reference", reference);

        return new Response("ok");
      },
    },
  },
});
