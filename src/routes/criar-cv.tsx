import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2, Plus, Sparkles, Trash2, Upload, UserRound } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CvPreview, CvThumb } from "@/components/cv/CvPreview";
import {
  CV_TEMPLATES,
  EMPTY_CV,
  loadCv,
  previewData,
  saveCv,
  type CvData,
} from "@/lib/cv";
import { parseCvFile } from "@/lib/cv.functions";
import { useCvDownload } from "@/hooks/useCvDownload";


export const Route = createFileRoute("/criar-cv")({
  head: () => ({
    meta: [
      { title: "Criar CV profissional online | Moza Empregos" },
      {
        name: "description",
        content:
          "Crie o seu CV profissional em minutos: 20 modelos originais com fotografia, preenchimento automático por IA e exportação em PDF.",
      },
      { property: "og:title", content: "Criador de CV | Moza Empregos" },
      {
        property: "og:description",
        content: "Modelos originais A4 com fotografia, preenchimento automático e exportação em PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CriarCvPage,
});

const STEPS = ["Modelo", "Dados", "Experiência", "Formação", "Competências"] as const;

function CriarCvPage() {
  const [data, setData] = useState<CvData>(EMPTY_CV);
  const [step, setStep] = useState(0);
  const [aiState, setAiState] = useState<{ loading: boolean; message: string }>({
    loading: false,
    message: "",
  });
  const photoInput = useRef<HTMLInputElement>(null);
  const cvInput = useRef<HTMLInputElement>(null);
  const parse = useServerFn(parseCvFile);
  const pdf = useCvDownload();


  useEffect(() => setData(loadCv()), []);
  useEffect(() => saveCv(data), [data]);

  const set = <K extends keyof CvData>(key: K, value: CvData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const template = CV_TEMPLATES.find((t) => t.id === data.templateId) ?? CV_TEMPLATES[0]!;
  const preview = previewData(data);

  async function onPhoto(file: File) {
    const dataUrl = await toDataUrl(file);
    set("photo", dataUrl);
  }

  async function onCvFile(file: File) {
    setAiState({ loading: true, message: "A ler o seu CV..." });
    try {
      const dataUrl = await toDataUrl(file);
      const base64 = dataUrl.split(",")[1] ?? "";
      const result = (await parse({
        data: { base64, mimeType: file.type || "application/pdf", fileName: file.name },
      })) as { ok: true; cvJson: string } | { ok: false; error: string };
      if (!result.ok) {
        setAiState({ loading: false, message: result.error });
        return;
      }
      const cv = JSON.parse(result.cvJson) as Partial<CvData>;
      setData((prev) => ({
        ...prev,
        fullName: str(cv.fullName) || prev.fullName,
        title: str(cv.title) || prev.title,
        email: str(cv.email) || prev.email,
        phone: str(cv.phone) || prev.phone,
        location: str(cv.location) || prev.location,
        summary: str(cv.summary) || prev.summary,
        skills: str(cv.skills) || prev.skills,
        languages: str(cv.languages) || prev.languages,
        experiences:
          Array.isArray(cv.experiences) && cv.experiences.length
            ? cv.experiences.map((e) => ({
                role: str(e?.role),
                company: str(e?.company),
                period: str(e?.period),
                description: str(e?.description),
              }))
            : prev.experiences,
        education:
          Array.isArray(cv.education) && cv.education.length
            ? cv.education.map((e) => ({
                course: str(e?.course),
                school: str(e?.school),
                period: str(e?.period),
              }))
            : prev.education,
      }));
      setAiState({ loading: false, message: "Formulários preenchidos. Reveja e ajuste o que precisar." });
    } catch {
      setAiState({ loading: false, message: "Falha ao ler o ficheiro. Tente novamente." });
    }
  }

  return (
    <AppShell>
      <section className="rounded-3xl bg-primary px-5 py-6 text-primary-foreground print:hidden">
        <h1 className="text-2xl font-extrabold leading-tight">Criador de CV</h1>
        <p className="mt-1 max-w-lg text-sm opacity-90">
          Preencha os passos, escolha um modelo e descarregue em PDF. O rascunho fica guardado neste
          telemóvel.
        </p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="print:hidden">
          <div className="mb-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Já tem um CV? Preenchemos por si
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Envie o seu CV antigo em PDF ou uma fotografia legível. A IA preenche os formulários
              automaticamente.
            </p>
            <input
              ref={cvInput}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onCvFile(file);
                e.target.value = "";
              }}
            />
            <Button
              variant="outline"
              className="mt-3 gap-2"
              disabled={aiState.loading}
              onClick={() => cvInput.current?.click()}
            >
              {aiState.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Carregar CV antigo
            </Button>
            {aiState.message && (
              <p className="mt-2 text-xs text-muted-foreground" role="status">
                {aiState.message}
              </p>
            )}
          </div>

          <nav className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
            {STEPS.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                aria-current={index === step}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  index === step
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {index + 1}. {label}
              </button>
            ))}
          </nav>

          <div className="rounded-2xl border border-border bg-card p-4">
            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2 flex items-center gap-4 rounded-xl border border-border p-3">
                  {data.photo ? (
                    <img src={data.photo} alt="Fotografia" className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <UserRound className="h-7 w-7 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">Fotografia</p>
                    <p className="text-xs text-muted-foreground">
                      Use uma foto de rosto, fundo simples e roupa formal.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <input
                        ref={photoInput}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void onPhoto(file);
                          e.target.value = "";
                        }}
                      />
                      <Button size="sm" variant="outline" onClick={() => photoInput.current?.click()}>
                        Carregar foto
                      </Button>
                      {data.photo && (
                        <Button size="sm" variant="ghost" onClick={() => set("photo", "")}>
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <Field
                  label="Nome completo"
                  placeholder="Ex.: Ana Macuácua"
                  hint="Escreva o nome como aparece no BI."
                  value={data.fullName}
                  onChange={(v) => set("fullName", v)}
                />
                <Field
                  label="Cargo pretendido"
                  placeholder="Ex.: Gestora de Operações"
                  hint="A função que procura, não a atual."
                  value={data.title}
                  onChange={(v) => set("title", v)}
                />
                <Field
                  label="Email"
                  placeholder="Ex.: ana.macuacua@email.com"
                  value={data.email}
                  onChange={(v) => set("email", v)}
                  type="email"
                />
                <Field
                  label="Telefone"
                  placeholder="Ex.: +258 84 000 0000"
                  value={data.phone}
                  onChange={(v) => set("phone", v)}
                />
                <Field
                  label="Localização"
                  placeholder="Ex.: Maputo, Moçambique"
                  value={data.location}
                  onChange={(v) => set("location", v)}
                />
                <div className="sm:col-span-2">
                  <Label htmlFor="summary">Resumo profissional</Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    placeholder="Ex.: Profissional com 6 anos de experiência em operações, focada em resultados e liderança de equipas."
                    value={data.summary}
                    onChange={(e) => set("summary", e.target.value)}
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    3 a 4 linhas: anos de experiência, área e um resultado concreto.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {data.experiences.map((exp, index) => (
                  <div key={index} className="rounded-xl border border-border p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Cargo"
                        placeholder="Ex.: Assistente Administrativa"
                        value={exp.role}
                        onChange={(v) => updateItem(setData, "experiences", index, { role: v })}
                      />
                      <Field
                        label="Empresa"
                        placeholder="Ex.: Grupo Zambeze"
                        value={exp.company}
                        onChange={(v) => updateItem(setData, "experiences", index, { company: v })}
                      />
                      <Field
                        label="Período"
                        placeholder="Ex.: Jan 2022 — Atual"
                        value={exp.period}
                        onChange={(v) => updateItem(setData, "experiences", index, { period: v })}
                      />
                    </div>
                    <Label className="mt-3 block">Descrição</Label>
                    <Textarea
                      rows={3}
                      className="mt-1"
                      placeholder="Ex.: Coordenei uma equipa de 12 pessoas e reduzi em 18% os custos logísticos."
                      value={exp.description}
                      onChange={(e) =>
                        updateItem(setData, "experiences", index, { description: e.target.value })
                      }
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Comece por um verbo de ação e inclua números sempre que possível.
                    </p>
                    {data.experiences.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 gap-1 text-destructive"
                        onClick={() => removeItem(setData, "experiences", index)}
                      >
                        <Trash2 className="h-4 w-4" /> Remover
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={() =>
                    setData((p) => ({
                      ...p,
                      experiences: [...p.experiences, { role: "", company: "", period: "", description: "" }],
                    }))
                  }
                >
                  <Plus className="h-4 w-4" /> Adicionar experiência
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-2">
                    <Field
                      label="Curso"
                      placeholder="Ex.: Licenciatura em Gestão"
                      value={edu.course}
                      onChange={(v) => updateItem(setData, "education", index, { course: v })}
                    />
                    <Field
                      label="Instituição"
                      placeholder="Ex.: Universidade Eduardo Mondlane"
                      value={edu.school}
                      onChange={(v) => updateItem(setData, "education", index, { school: v })}
                    />
                    <Field
                      label="Período"
                      placeholder="Ex.: 2015 — 2019"
                      value={edu.period}
                      onChange={(v) => updateItem(setData, "education", index, { period: v })}
                    />
                    {data.education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 self-end text-destructive"
                        onClick={() => removeItem(setData, "education", index)}
                      >
                        <Trash2 className="h-4 w-4" /> Remover
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="gap-1"
                  onClick={() =>
                    setData((p) => ({
                      ...p,
                      education: [...p.education, { course: "", school: "", period: "" }],
                    }))
                  }
                >
                  <Plus className="h-4 w-4" /> Adicionar formação
                </Button>
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="skills">Competências</Label>
                  <Textarea
                    id="skills"
                    rows={4}
                    className="mt-1"
                    placeholder="Ex.: Atendimento ao cliente, Excel avançado, Gestão de stock, Trabalho em equipa"
                    value={data.skills}
                    onChange={(e) => set("skills", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Separe por vírgulas ou escreva uma por linha.
                  </p>
                </div>
                <div>
                  <Label htmlFor="languages">Idiomas</Label>
                  <Textarea
                    id="languages"
                    rows={3}
                    className="mt-1"
                    placeholder="Ex.: Português (nativo), Inglês (intermédio), Changana"
                    value={data.languages}
                    onChange={(e) => set("languages", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 0 && (
              <div>
                <p className="mb-3 text-sm text-muted-foreground">
                  As miniaturas mostram os <strong>seus dados</strong>. Toque para escolher.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {CV_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => set("templateId", tpl.id)}
                      aria-pressed={tpl.id === data.templateId}
                      className={`rounded-xl border p-2 text-left transition-colors ${
                        tpl.id === data.templateId ? "border-primary ring-2 ring-primary/30" : "border-border"
                      }`}
                    >
                      <CvThumb data={preview} template={tpl} width={150} />
                      <span className="mt-2 block text-sm font-semibold">{tpl.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {tpl.premium ? "Premium" : "Gratuito"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Anterior
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
                  Seguinte
                </Button>
              ) : (
                <Button className="gap-1" disabled={pdf.busy} onClick={() => void pdf.download()}>
                  {pdf.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {pdf.paid ? "Descarregar PDF" : `Pagar e descarregar${pdf.amount ? ` · ${pdf.amount} MZN` : ""}`}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-sm font-semibold text-muted-foreground print:hidden">
            Pré-visualização · {template.name}
          </p>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-white print:border-0">
            <div className="origin-top-left [zoom:0.44] sm:[zoom:0.72] lg:[zoom:1] print:[zoom:1]">
              <CvPreview id="cv-print-area" data={preview} template={template} />
            </div>
            {!pdf.paid ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid select-none place-items-center overflow-hidden"
              >
                <div className="-rotate-30 space-y-6 text-center">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <p
                      key={i}
                      className="whitespace-nowrap text-3xl font-extrabold tracking-[0.3em] text-black/10 sm:text-4xl"
                    >
                      MOZA EMPREGOS · AMOSTRA
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Button
            variant="outline"
            className="mt-3 w-full gap-1 print:hidden"
            disabled={pdf.busy}
            onClick={() => void pdf.download()}
          >
            {pdf.busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {pdf.paid ? "Descarregar PDF" : `Pagar e descarregar${pdf.amount ? ` · ${pdf.amount} MZN` : ""}`}
          </Button>
          {pdf.message ? (
            <p className="mt-2 text-center text-xs text-destructive print:hidden">{pdf.message}</p>
          ) : null}
          {!pdf.paid ? (
            <p className="mt-2 text-center text-xs text-muted-foreground print:hidden">
              Pagamento seguro por M-Pesa, e-Mola ou cartão.
            </p>
          ) : null}

        </div>
      </div>
    </AppShell>
  );
}

function str(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read error"));
    reader.readAsDataURL(file);
  });
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function updateItem<K extends "experiences" | "education">(
  setData: React.Dispatch<React.SetStateAction<CvData>>,
  key: K,
  index: number,
  patch: Partial<CvData[K][number]>,
) {
  setData((prev) => ({
    ...prev,
    [key]: prev[key].map((item, i) => (i === index ? { ...item, ...patch } : item)),
  }));
}

function removeItem(
  setData: React.Dispatch<React.SetStateAction<CvData>>,
  key: "experiences" | "education",
  index: number,
) {
  setData((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
}
