import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/vagas/")({
  component: VagasPage,
});

function VagasPage() {
  return null;
}
