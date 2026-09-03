import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

type NetShopEvent = {
  event?: string;
  data?: {
    id?: string;
    reference?: string;
    method?: string;
    amount?: string | number;
    status?: string;
  };
  id?: string;
  reference?: string;
  method?: string;
  amount?: string | number;
  status?: string;
};

function verifySignature(
  body: string,
  signature: string | null
): boolean {
  const secret = process.env["NETSHOP_WEBHOOK_SECRET"];

  if (!secret || !signature) {
    return false;
  }

  const expected = createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const received = signature.trim();

  const a = Buffer.from(received, "utf8");
  const b = Buffer.from(expected, "utf8");

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export const Route = createFileRoute(
  "/api/public/netshop-webhook"
)({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text();

        const signature =
          request.headers.get("x-netshop-signature");

        if (!verifySignature(body, signature)) {
          return new Response("Invalid signature", {
            status: 401,
          });
        }

        let payload: NetShopEvent;

        try {
          payload = JSON.parse(body) as NetShopEvent;
        } catch {
          return new Response("Invalid body", {
            status: 400,
          });
        }

        const data = payload.data ?? payload;

        const reference = data.reference;

        if (!reference) {
          return new Response("Missing reference", {
            status: 400,
          });
        }

        const event = payload.event ?? "";

        const status = data.status;

        const paid =
          event === "charge.paid" ||
          status === "paid";

        const failed =
          event === "charge.failed" ||
          status === "failed";

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        if (paid) {
          const { error } = await supabaseAdmin
            .from("cv_purchases")
            .update({
              status: "paid",
              method: data.method ?? null,
              provider_id: data.id ?? null,
              paid_at: new Date().toISOString(),
            })
            .eq("reference", reference);

          if (error) {
            console.error(
              "Erro ao atualizar pagamento:",
              error
            );

            return new Response("Database error", {
              status: 500,
            });
          }
        } else if (failed) {
          const { error } = await supabaseAdmin
            .from("cv_purchases")
            .update({
              status: "failed",
              method: data.method ?? null,
              provider_id: data.id ?? null,
            })
            .eq("reference", reference);

          if (error) {
            console.error(
              "Erro ao atualizar pagamento:",
              error
            );

            return new Response("Database error", {
              status: 500,
            });
          }
        }

        return new Response("ok", {
          status: 200,
        });
      },
    },
  },
});
