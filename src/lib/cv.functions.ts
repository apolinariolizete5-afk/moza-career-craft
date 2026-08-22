import { createServerFn } from "@tanstack/react-start";

type ParseInput = { mimeType: string; fileName: string; base64: string };

export const parseCvFile = createServerFn({ method: "POST" })
  .inputValidator((data: ParseInput) => {
    if (!data || typeof data.base64 !== "string" || !data.base64) {
      throw new Error("Ficheiro inválido.");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, error: "IA não configurada." };

    const isImage = data.mimeType.startsWith("image/");
    const isPdf = data.mimeType === "application/pdf" || data.fileName.toLowerCase().endsWith(".pdf");
    if (!isImage && !isPdf) {
      return {
        ok: false as const,
        error: "Formato não suportado. Envie o CV em PDF ou uma fotografia (JPG/PNG).",
      };
    }

    const instruction =
      "Extrai os dados deste currículo e devolve APENAS JSON válido com as chaves: " +
      "fullName, title, email, phone, location, summary, " +
      "experiences (array de {role, company, period, description}), " +
      "education (array de {course, school, period}), skills (texto separado por vírgulas), " +
      "languages (texto separado por vírgulas). Usa português. Campos desconhecidos ficam vazios.";

    const content = isImage
      ? [
          { type: "text", text: instruction },
          { type: "image_url", image_url: { url: `data:${data.mimeType};base64,${data.base64}` } },
        ]
      : [
          { type: "text", text: instruction },
          {
            type: "file",
            file: { filename: data.fileName, file_data: `data:application/pdf;base64,${data.base64}` },
          },
        ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI parse failed", response.status, text);
      if (response.status === 429) return { ok: false as const, error: "Muitos pedidos. Tente daqui a pouco." };
      if (response.status === 402)
        return { ok: false as const, error: "Créditos de IA esgotados. Contacte o administrador." };
      return { ok: false as const, error: "Não foi possível ler o ficheiro. Tente outro formato." };
    }

    const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false as const, error: "Não foi possível interpretar o CV." };

    try {
      return { ok: true as const, cv: JSON.parse(match[0]) as Record<string, unknown> };
    } catch {
      return { ok: false as const, error: "Não foi possível interpretar o CV." };
    }
  });
