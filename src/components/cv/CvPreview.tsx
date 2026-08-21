import type { CvData, CvTemplate } from "@/lib/cv";

function list(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CvPreview({ data, template }: { data: CvData; template: CvTemplate }) {
  const accent = template.accent;
  const name = data.fullName || "O seu nome";
  const contacts = [data.email, data.phone, data.location].filter(Boolean);
  const skills = list(data.skills);
  const languages = list(data.languages);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mt-4">
      <h3
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {title}
      </h3>
      <div className="mt-1 space-y-2 text-[11px] leading-snug text-neutral-700">{children}</div>
    </section>
  );

  const body = (
    <>
      {data.summary && <Section title="Perfil">{<p>{data.summary}</p>}</Section>}
      {data.experiences.some((e) => e.role || e.company) && (
        <Section title="Experiência">
          {data.experiences
            .filter((e) => e.role || e.company)
            .map((e, i) => (
              <div key={i}>
                <p className="text-[12px] font-semibold text-neutral-900">
                  {e.role}
                  {e.company ? ` — ${e.company}` : ""}
                </p>
                {e.period && <p className="text-[10px] text-neutral-500">{e.period}</p>}
                {e.description && <p>{e.description}</p>}
              </div>
            ))}
        </Section>
      )}
      {data.education.some((e) => e.course || e.school) && (
        <Section title="Formação">
          {data.education
            .filter((e) => e.course || e.school)
            .map((e, i) => (
              <div key={i}>
                <p className="text-[12px] font-semibold text-neutral-900">{e.course}</p>
                <p className="text-[10px] text-neutral-500">
                  {[e.school, e.period].filter(Boolean).join(" · ")}
                </p>
              </div>
            ))}
        </Section>
      )}
    </>
  );

  const aside = (
    <>
      {skills.length > 0 && (
        <Section title="Competências">
          <ul className="space-y-1">
            {skills.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </Section>
      )}
      {languages.length > 0 && (
        <Section title="Idiomas">
          <ul className="space-y-1">
            {languages.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );

  return (
    <div
      id="cv-print-area"
      className="mx-auto w-full max-w-[794px] bg-white p-8 text-neutral-800 shadow-sm"
      style={{ aspectRatio: "1 / 1.414" }}
    >
      {template.layout === "banner" ? (
        <header className="-m-8 mb-6 px-8 py-6 text-white" style={{ backgroundColor: accent }}>
          <h2 className="text-2xl font-extrabold">{name}</h2>
          <p className="text-sm opacity-90">{data.title}</p>
          {contacts.length > 0 && <p className="mt-1 text-[11px] opacity-90">{contacts.join(" · ")}</p>}
        </header>
      ) : (
        <header className="border-b pb-3" style={{ borderColor: accent }}>
          <h2 className="text-2xl font-extrabold text-neutral-900">{name}</h2>
          <p className="text-sm" style={{ color: accent }}>
            {data.title}
          </p>
          {contacts.length > 0 && (
            <p className="mt-1 text-[11px] text-neutral-500">{contacts.join(" · ")}</p>
          )}
        </header>
      )}

      {template.layout === "sidebar" ? (
        <div className="mt-4 grid grid-cols-[1fr_34%] gap-6">
          <div>{body}</div>
          <div className="rounded-md bg-neutral-50 p-3">{aside}</div>
        </div>
      ) : (
        <div className="mt-2">
          {body}
          {aside}
        </div>
      )}
    </div>
  );
}
