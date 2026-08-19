import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pesquisar")({
  component: PesquisarPage,
});

function PesquisarPage() {
  return null;
}
