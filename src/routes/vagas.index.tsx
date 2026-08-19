import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { JobCard } from "@/components/jobs/JobCard";
import { JobSearchBar } from "@/components/jobs/JobSearchBar";
import { JobFilters, type FiltersValue } from "@/components/jobs/JobFilters";
import { Button } from "@/components/ui/button";
import { listFacets, listJobs } from "@/lib/jobs.functions";

interface VagasSearch {
  q?: string;
  location?: string;
  category?: string;
  type?: string;
  experience?: string;
  days?: string;
  page?: number;
}

const str = (value: unknown) => (typeof value === "string" && value ? value : undefined);

const jobsQuery = (search: VagasSearch) =>
  queryOptions({
    queryKey: ["jobs", "list", search],
    queryFn: () => listJobs({ data: { ...search, limit: 20 } }),
  });

const facetsQuery = queryOptions({
  queryKey: ["facets"],
  queryFn: () => listFacets(),
});

export const Route = createFileRoute("/vagas/")({
  head: () => ({
    meta: [
      { title: "Vagas de emprego em Moçambique | Moza Empregos" },
      {
        name: "description",
        content:
          "Explore vagas de emprego em Moçambique com filtros por localização, categoria, tipo de emprego e nível de experiência.",
      },
      { property: "og:title", content: "Vagas de emprego em Moçambique" },
      {
        property: "og:description",
        content: "Filtre vagas por localização, categoria, tipo e experiência no Moza Empregos.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): VagasSearch => ({
    q: str(search.q),
    location: str(search.location),
    category: str(search.category),
    type: str(search.type),
    experience: str(search.experience),
    days: str(search.days),
    page: Number(search.page) > 1 ? Number(search.page) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(jobsQuery(deps)),
      context.queryClient.ensureQueryData(facetsQuery),
    ]);
  },
  errorComponent: ({ error }) => (
    <AppShell>
      <p role="alert" className="py-12 text-center text-sm text-muted-foreground">
        Não foi possível carregar as vagas. {error.message}
      </p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <p className="py-12 text-center text-sm text-muted-foreground">Nenhuma vaga encontrada.</p>
    </AppShell>
  ),
  component: VagasPage,
});

function VagasPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/vagas" });
  const { data } = useSuspenseQuery(jobsQuery(search));
  const { data: facets } = useSuspenseQuery(facetsQuery);

  const page = search.page ?? 1;
  const totalPages = Math.max(Math.ceil(data.total / 20), 1);

  const filters: FiltersValue = {
    location: search.location ?? "",
    category: search.category ?? "",
    type: search.type ?? "",
    experience: search.experience ?? "",
    days: search.days ?? "any",
  };

  const activeCount = [
    filters.location,
    filters.category,
    filters.type,
    filters.experience,
    filters.days !== "any" ? filters.days : "",
  ].filter(Boolean).length;

  const patch = (next: Partial<VagasSearch>) =>
    navigate({
      search: (prev) => ({ ...prev, ...next, page: undefined }),
    });

  return (
    <AppShell>
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold">Vagas</h1>
        <p className="text-sm text-muted-foreground">
          {data.total} vaga{data.total === 1 ? "" : "s"} disponíveis
        </p>
      </header>

      <div className="space-y-3">
        <JobSearchBar
          defaultValue={search.q ?? ""}
          onSubmit={(term) => patch({ q: term || undefined })}
        />
        <JobFilters
          value={filters}
          activeCount={activeCount}
          locations={facets.locations}
          categories={facets.categories}
          onChange={(next) =>
            patch({
              location: next.location ?? filters.location || undefined,
              category: next.category ?? filters.category || undefined,
              type: next.type ?? filters.type || undefined,
              experience: next.experience ?? filters.experience || undefined,
              days:
                (next.days ?? filters.days) === "any" ? undefined : (next.days ?? filters.days),
            })
          }
          onClear={() =>
            navigate({
              search: (prev) => ({ q: prev.q }),
            })
          }
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {data.jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {data.jobs.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Nenhuma vaga corresponde à sua pesquisa. Experimente remover alguns filtros.
        </p>
      )}

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Paginação">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() =>
              navigate({
                search: (prev) => ({ ...prev, page: page - 1 > 1 ? page - 1 : undefined }),
              })
            }
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => navigate({ search: (prev) => ({ ...prev, page: page + 1 }) })}
          >
            Seguinte
          </Button>
        </nav>
      )}
    </AppShell>
  );
}
