import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notificacoes")({
  component: NotificacoesPage,
});

function NotificacoesPage() {
  return null;
}
