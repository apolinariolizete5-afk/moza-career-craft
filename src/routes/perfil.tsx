import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
});

function PerfilPage() {
  return null;
}
