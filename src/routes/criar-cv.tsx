import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Sparkles, Layout, Download } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/criar-cv")({
  head: () => ({
    meta: [
      { title: "Criar CV profissional online | Moza Empregos" },
      {
        name: "description",
        content:
          "Crie um CV profissional em minutos com modelos originais, edição passo a passo no telemóvel e exportação em PDF.",
      },
      { property: "og:title", content: "Criador de CV | Moza Empregos" },
      {
        property: "og:description",
        content: "Modelos originais, edição no telemóvel e exportação em PDF.",
      },
    ],
  }),
  component: CriarCvPage,
});

const FEATURES = [
  {
    icon: Layout,
    title: "Modelos originais",
    text: "Modelos A4 exclusivos do Moza Empregos, pensados para o mercado moçambicano.",
  },
  {
    icon: Sparkles,
    title: "Preenchimento assistido",
    text: "Carregue um CV existente e os seus dados são organizados automaticamente.",
  },
  {
    icon: Download,
    title: "Exportação em PDF",
    text: "Descarregue o seu CV pronto a enviar para qualquer candidatura.",
  },
];

function CriarCvPage() {
  return (
    <AppShell>
      <section className="rounded-3xl bg-primary px-5 py-7 text-primary-foreground">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-foreground/15">
          <FileText className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight">Criador de CV</h1>
        <p className="mt-2 max-w-lg text-sm opacity-90">
          Um CV profissional, feito no telemóvel, em poucos minutos. O editor completo com modelos
          premium está a ser preparado nesta mesma área.
        </p>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-3 text-sm font-extrabold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-dashed border-border bg-surface p-5 text-center">
        <p className="text-sm text-muted-foreground">
          Enquanto o editor não abre, comece por completar o seu perfil — esses dados vão preencher
          o seu CV automaticamente.
        </p>
        <Button asChild className="mt-4">
          <Link to="/perfil">Completar perfil</Link>
        </Button>
      </section>
    </AppShell>
  );
}
