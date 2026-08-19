import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/vagas")({
  component: AdminVagasPage,
});

function AdminVagasPage() {
  return null;
}
