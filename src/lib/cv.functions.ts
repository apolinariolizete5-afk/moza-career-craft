import { createServerFn } from "@tanstack/react-start";

type ParseInput = {
  mimeType: string;
  fileName: string;
  base64: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(
  apiKey: string,
  model: string,
  parts: Array<Record<string, unknown>>
) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
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
  });

  const text = await response.text();

  let json: GeminiResponse | null = null;

  try {
    json = JSON.parse(text) as GeminiResponse;
  } catch {
    // Resposta não-JSON
  }

  return {
    response,
    text,
    json,
  };
}

export const parseCvFile = createServerFn({ method: "POST" })
  .inputValidator((data: ParseInput) => {
    if (!data || typeof data.base64 !== "string" || !data.base64) {
      throw new Error("Ficheiro inválido.");
    }

    return data;
  })
  .handler(async ({ data }) => {
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
          "Formato não suportado. Envie o CV em PDF ou uma fotografia legível (JPG/PNG).",
      };
    }

    const instruction =
      "Analisa este currículo e devolve APENAS JSON válido. " +
      "Não escrevas explicações, Markdown ou texto fora do JSON. " +
      "Usa exactamente esta estrutura: " +
      "{ " +
      '"fullName": "", ' +
      '"title": "", ' +
      '"email": "", ' +
      '"phone": "", ' +
      '"location": "", ' +
      '"summary": "", ' +
      '"experiences": [{"role": "", "company": "", "period": "", "description": ""}], ' +
      '"education": [{"course": "", "school": "", "period": ""}], ' +
      '"skills": "", ' +
      '"languages": "" ' +
      "}. " +
      "Usa português. " +
      "Se uma informação não existir no currículo, deixa o campo vazio. " +
      "Não inventes informações.";

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

    /*
     * Primeiro tenta o modelo principal.
     * Se estiver temporariamente indisponível, tenta novamente
     * e depois usa o modelo alternativo.
     */
    const models = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
    ];

    let lastStatus = 0;
    let lastError = "";

    for (const model of models) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const result = await callGemini(apiKey, model, parts);

          lastStatus = result.response.status;
          lastError = result.text;

          if (result.response.ok) {
            const raw =
              result.json?.candidates?.[0]?.content?.parts
                ?.map((part) => part.text ?? "")
                .join("") ?? "";

            if (!raw) {
              console.error(
                `Gemini ${model} devolveu uma resposta vazia.`
              );

              break;
            }

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
              const match = cleaned.match(/\{[\s\S]*\}/);

              if (match) {
                try {
                  const parsed = JSON.parse(match[0]);

                  return {
                    ok: true as const,
                    cvJson: JSON.stringify(parsed),
                  };
                } catch {
                  console.error(
                    `Gemini ${model}: JSON inválido.`
                  );
                }
              }
            }

            break;
          }

          console.error(
            `Gemini ${model} tentativa ${attempt}:`,
            result.response.status,
            result.text
          );

          /*
           * 503 = serviço temporariamente indisponível
           * 429 = limite/quota
           *
           * Nestes casos esperamos e tentamos novamente.
           */
          if (
            result.response.status === 503 ||
            result.response.status === 429 ||
            result.response.status === 500 ||
            result.response.status === 502
          ) {
            if (attempt < 3) {
              await sleep(attempt * 2000);
              continue;
            }

            break;
          }

          /*
           * 400, 401 e 403 não devem ser repetidos.
           */
          break;
        } catch (error) {
          console.error(
            `Erro ao contactar Gemini ${model}:`,
            error
          );

          lastError =
            error instanceof Error
              ? error.message
              : String(error);

          if (attempt < 3) {
            await sleep(attempt * 2000);
            continue;
          }
        }
      }
    }

    console.error(
      "Gemini CV parse failed definitivamente:",
      lastStatus,
      lastError
    );

    if (lastStatus === 401 || lastStatus === 403) {
      return {
        ok: false as const,
        error:
          "A chave da Gemini API é inválida ou não está autorizada.",
      };
    }

    if (lastStatus === 429) {
      return {
        ok: false as const,
        error:
          "O limite da Gemini API foi atingido. Tente novamente mais tarde.",
      };
    }

    if (lastStatus === 503) {
      return {
        ok: false as const,
        error:
          "A IA está temporariamente ocupada. Tente novamente daqui a pouco.",
      };
    }

    if (lastStatus === 400) {
      return {
        ok: false as const,
        error:
          "A Gemini recusou o ficheiro. Tente enviar outro PDF ou uma fotografia mais nítida.",
      };
    }

    return {
      ok: false as const,
      error:
        "Não foi possível ler o CV neste momento. Tente novamente.",
    };
  });
