import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/empresas/$slug")({
  component: EmpresaPage,
});

function EmpresaPage() {
  return null;
}
