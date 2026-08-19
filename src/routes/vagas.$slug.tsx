import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vagas/$slug")({
  component: VagaPage,
});

function VagaPage() {
  return null;
}
