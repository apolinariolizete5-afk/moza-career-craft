import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/empresas/")({
  component: EmpresasPage,
});

function EmpresasPage() {
  return null;
}
