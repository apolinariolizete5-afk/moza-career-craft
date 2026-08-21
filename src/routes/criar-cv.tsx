import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CvPreview } from "@/components/cv/CvPreview";
import { CV_TEMPLATES, EMPTY_CV, loadCv, saveCv, type CvData } from "@/lib/cv";

export const Route = createFileRoute("/criar-cv")({
  head: () => ({
    meta: [
      { title: "Criar CV profissional online | Moza Empregos" },
      {
        name: "description",
        content:
          "Crie o seu CV profissional em minutos: 20 modelos originais, edição no telemóvel e exportação em PDF.",
      },
      { property: "og:title", content: "Criador de CV | Moza Empregos" },
      {
        property: "og:description",
        content: "Modelos originais A4, edição passo a passo e exportação em PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CriarCvPage,
});

const STEPS = ["Dados", "Experiência", "Formação", "Competências", "Modelo"] as const;

function CriarCvPage() {
  const [data, setData] = useState<CvData>(EMPTY_CV);
  const [step, setStep] = useState(0);

  useEffect(() => setData(loadCv()), []);
  useEffect(() => saveCv(data), [data]);

  const set = <K extends keyof CvData>(key: K, value: CvData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const template = CV_TEMPLATES.find((t) => t.id === data.templateId) ?? CV_TEMPLATES[0]!;

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
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nome completo" value={data.fullName} onChange={(v) => set("fullName", v)} />
                <Field label="Cargo pretendido" value={data.title} onChange={(v) => set("title", v)} />
                <Field label="Email" value={data.email} onChange={(v) => set("email", v)} type="email" />
                <Field label="Telefone" value={data.phone} onChange={(v) => set("phone", v)} />
                <Field label="Localização" value={data.location} onChange={(v) => set("location", v)} />
                <div className="sm:col-span-2">
                  <Label htmlFor="summary">Resumo profissional</Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    value={data.summary}
                    onChange={(e) => set("summary", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                {data.experiences.map((exp, index) => (
                  <div key={index} className="rounded-xl border border-border p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field
                        label="Cargo"
                        value={exp.role}
                        onChange={(v) => updateItem(setData, "experiences", index, { role: v })}
                      />
                      <Field
                        label="Empresa"
                        value={exp.company}
                        onChange={(v) => updateItem(setData, "experiences", index, { company: v })}
                      />
                      <Field
                        label="Período"
                        value={exp.period}
                        onChange={(v) => updateItem(setData, "experiences", index, { period: v })}
                      />
                    </div>
                    <Label className="mt-3 block">Descrição</Label>
                    <Textarea
                      rows={3}
                      className="mt-1"
                      value={exp.description}
                      onChange={(e) =>
                        updateItem(setData, "experiences", index, { description: e.target.value })
                      }
                    />
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

            {step === 2 && (
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="grid gap-3 rounded-xl border border-border p-3 sm:grid-cols-2">
                    <Field
                      label="Curso"
                      value={edu.course}
                      onChange={(v) => updateItem(setData, "education", index, { course: v })}
                    />
                    <Field
                      label="Instituição"
                      value={edu.school}
                      onChange={(v) => updateItem(setData, "education", index, { school: v })}
                    />
                    <Field
                      label="Período"
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

            {step === 3 && (
              <div className="grid gap-3">
                <div>
                  <Label htmlFor="skills">Competências (uma por linha ou separadas por vírgula)</Label>
                  <Textarea
                    id="skills"
                    rows={4}
                    className="mt-1"
                    value={data.skills}
                    onChange={(e) => set("skills", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="languages">Idiomas</Label>
                  <Textarea
                    id="languages"
                    rows={3}
                    className="mt-1"
                    value={data.languages}
                    onChange={(e) => set("languages", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CV_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => set("templateId", tpl.id)}
                    aria-pressed={tpl.id === data.templateId}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      tpl.id === data.templateId ? "border-primary ring-2 ring-primary/30" : "border-border"
                    }`}
                  >
                    <span
                      className="block h-10 w-full rounded-md"
                      style={{ backgroundColor: tpl.accent }}
                      aria-hidden
                    />
                    <span className="mt-2 block text-sm font-semibold">{tpl.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {tpl.premium ? "Premium" : "Gratuito"}
                    </span>
                  </button>
                ))}
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
                <Button className="gap-1" onClick={() => window.print()}>
                  <Download className="h-4 w-4" /> Descarregar PDF
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-sm font-semibold text-muted-foreground print:hidden">
            Pré-visualização · {template.name}
          </p>
          <div className="overflow-hidden rounded-2xl border border-border bg-white print:border-0">
            <CvPreview data={data} template={template} />
          </div>
          <Button variant="outline" className="mt-3 w-full gap-1 print:hidden" onClick={() => window.print()}>
            <Download className="h-4 w-4" /> Descarregar PDF
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1" />
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
