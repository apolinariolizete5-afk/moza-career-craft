import { createServerFn } from "@tanstack/react-start";

type ParseInput = {
  mimeType: string;
  fileName: string;
  base64: string;
};

export const parseCvFile = createServerFn({ method: "POST" })
  .inputValidator((data: ParseInput) => {
    if (!data || typeof data.base64 !== "string" || !data.base64) {
      throw new Error("Ficheiro inválido.");
    }
    return data;
  })
  .handler(async ({ data }) => {
    // Chave própria da Google Gemini
    const apiKey = process.env["GEMINI_API_KEY"];

    if (!apiKey) {
      return {
        ok: false as const,
        error: "IA não configurada.",
      };
    }

    const isImage = data.mimeType.startsWith("image/");
    const isPdf =
      data.mimeType === "application/pdf" ||
      data.fileName.toLowerCase().endsWith(".pdf");

    if (!isImage && !isPdf) {
      return {
        ok: false as const,
        error:
          "Formato não suportado. Envie o CV em PDF ou uma fotografia (JPG/PNG).",
      };
    }

    const instruction =
      "Extrai os dados deste currículo e devolve APENAS JSON válido. " +
      "Usa exactamente estas chaves: " +
      "fullName, title, email, phone, location, summary, " +
      "experiences (array de objetos com role, company, period, description), " +
      "education (array de objetos com course, school, period), " +
      "skills (texto separado por vírgulas), " +
      "languages (texto separado por vírgulas). " +
      "Usa português. Campos desconhecidos ficam vazios.";

    // Conteúdo enviado directamente para a Gemini API
    const parts: Array<Record<string, unknown>> = [
      {
        text: instruction,
      },
    ];

    if (isImage) {
      parts.push({
        inline_data: {
          mime_type: data.mimeType,
          data: data.base64,
        },
      });
    } else {
      parts.push({
        inline_data: {
          mime_type: "application/pdf",
          data: data.base64,
        },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts,
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();

      console.error("Gemini CV parse failed:", response.status, text);

      if (response.status === 400) {
        return {
          ok: false as const,
          error: "Pedido inválido. Verifique o ficheiro enviado.",
        };
      }

      if (response.status === 401 || response.status === 403) {
        return {
          ok: false as const,
          error: "A chave da Gemini API é inválida ou não está autorizada.",
        };
      }

      if (response.status === 429) {
        return {
          ok: false as const,
          error: "Limite da Gemini API atingido. Tente novamente mais tarde.",
        };
      }

      return {
        ok: false as const,
        error: "Não foi possível ler o ficheiro. Tente outro formato.",
      };
    }

    const json = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    };

    const raw =
      json.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("") ?? "";

    if (!raw) {
      return {
        ok: false as const,
        error: "A Gemini não devolveu os dados do CV.",
      };
    }

    // Limpa possíveis blocos Markdown caso o modelo os devolva
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);

      return {
        ok: true as const,
        cvJson: JSON.stringify(parsed),
      };
    } catch {
      // Fallback caso venha algum texto antes/depois do JSON
      const match = cleaned.match(/\{[\s\S]*\}/);

      if (!match) {
        return {
          ok: false as const,
          error: "Não foi possível interpretar o CV.",
        };
      }

      try {
        JSON.parse(match[0]);

        return {
          ok: true as const,
          cvJson: match[0],
        };
      } catch {
        return {
          ok: false as const,
          error: "Não foi possível interpretar o CV.",
        };
      }
    }
  });
