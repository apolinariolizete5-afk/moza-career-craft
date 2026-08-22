import type { CvData, CvTemplate } from "@/lib/cv";

function list(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CvPreview({
  data,
  template,
  id,
}: {
  data: CvData;
  template: CvTemplate;
  id?: string;
}) {
  const accent = template.accent;
  const dark = ["sidebar-photo", "header-dark", "banner-photo", "split"].includes(template.layout);
  const name = data.fullName || "O seu nome";
  const contacts = [data.email, data.phone, data.location].filter(Boolean);
  const skills = list(data.skills);
  const languages = list(data.languages);

  const Photo = ({ size = 96, ring }: { size?: number; ring?: string }) =>
    data.photo ? (
      <img
        src={data.photo}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: template.photoShape === "circle" ? "9999px" : "10px",
          objectFit: "cover",
          border: ring ? `3px solid ${ring}` : undefined,
        }}
      />
    ) : (
      <div
        aria-hidden
        style={{
          width: size,
          height: size,
          borderRadius: template.photoShape === "circle" ? "9999px" : "10px",
          background: "rgba(127,127,127,0.25)",
          border: ring ? `3px solid ${ring}` : undefined,
        }}
      />
    );

  const Section = ({
    title,
    children,
    color = accent,
  }: {
    title: string;
    children: React.ReactNode;
    color?: string;
  }) => (
    <section className="mt-4">
      <h3 className="text-[11px] font-bold uppercase tracking-widest" style={{ color }}>
        {title}
      </h3>
      <div className="mt-1 space-y-2 text-[11px] leading-snug">{children}</div>
    </section>
  );

  const body = (
    <div className="text-neutral-700">
      {data.summary && (
        <Section title="Perfil">
          <p>{data.summary}</p>
        </Section>
      )}
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
    </div>
  );

  const asideItems = (color: string, textClass: string) => (
    <div className={textClass}>
      {contacts.length > 0 && (
        <Section title="Contactos" color={color}>
          <ul className="space-y-1">
            {contacts.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Section>
      )}
      {skills.length > 0 && (
        <Section title="Competências" color={color}>
          <ul className="space-y-1">
            {skills.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </Section>
      )}
      {languages.length > 0 && (
        <Section title="Idiomas" color={color}>
          <ul className="space-y-1">
            {languages.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );

  const page = (children: React.ReactNode) => (
    <div
      id={id}
      className="mx-auto w-full max-w-[794px] overflow-hidden bg-white text-neutral-800 shadow-sm"
      style={{ aspectRatio: "1 / 1.414" }}
    >
      {children}
    </div>
  );

  if (template.layout === "sidebar-photo") {
    return page(
      <div className="grid h-full grid-cols-[35%_1fr]">
        <aside className="h-full px-5 py-6 text-white" style={{ backgroundColor: template.surface }}>
          <div className="flex justify-center">
            <Photo size={104} ring="rgba(255,255,255,0.5)" />
          </div>
          <h2 className="mt-4 text-center text-[18px] font-extrabold leading-tight">{name}</h2>
          <p className="text-center text-[11px] opacity-85">{data.title}</p>
          <div className="[&_li]:opacity-90">{asideItems("#ffffff", "text-[11px] text-white/90")}</div>
        </aside>
        <div className="px-6 py-6">{body}</div>
      </div>,
    );
  }

  if (template.layout === "header-dark") {
    return page(
      <div className="h-full">
        <header
          className="flex items-center gap-4 px-7 py-6 text-white"
          style={{ backgroundColor: template.surface }}
        >
          <Photo size={82} ring="rgba(255,255,255,0.4)" />
          <div>
            <h2 className="text-[22px] font-extrabold leading-tight">{name}</h2>
            <p className="text-[12px]" style={{ color: accent === "#1F2937" ? "#cbd5e1" : accent }}>
              {data.title}
            </p>
            {contacts.length > 0 && (
              <p className="mt-1 text-[10px] opacity-80">{contacts.join(" · ")}</p>
            )}
          </div>
        </header>
        <div className="grid grid-cols-[1fr_32%] gap-6 px-7 py-5">
          <div>{body}</div>
          <div>{asideItems(accent, "text-[11px] text-neutral-600")}</div>
        </div>
      </div>,
    );
  }

  if (template.layout === "banner-photo") {
    return page(
      <div className="h-full">
        <header
          className="px-7 pb-8 pt-6 text-center text-white"
          style={{ backgroundColor: template.surface }}
        >
          <div className="flex justify-center">
            <Photo size={92} ring="rgba(255,255,255,0.6)" />
          </div>
          <h2 className="mt-3 text-[22px] font-extrabold">{name}</h2>
          <p className="text-[12px] opacity-90">{data.title}</p>
          {contacts.length > 0 && <p className="mt-1 text-[10px] opacity-85">{contacts.join(" · ")}</p>}
        </header>
        <div className="grid grid-cols-[1fr_32%] gap-6 px-7 py-4">
          <div>{body}</div>
          <div>{asideItems(accent, "text-[11px] text-neutral-600")}</div>
        </div>
      </div>,
    );
  }

  if (template.layout === "split") {
    return page(
      <div className="h-full">
        <div className="grid grid-cols-[1fr_38%]">
          <header className="px-7 py-7">
            <h2 className="text-[24px] font-extrabold leading-tight text-neutral-900">{name}</h2>
            <p className="text-[13px] font-medium" style={{ color: accent }}>
              {data.title}
            </p>
          </header>
          <div
            className="flex items-center justify-center py-6"
            style={{ backgroundColor: template.surface }}
          >
            <Photo size={100} ring="rgba(255,255,255,0.65)" />
          </div>
        </div>
        <div className="h-1" style={{ backgroundColor: accent }} />
        <div className="grid grid-cols-[1fr_34%] gap-6 px-7 py-4">
          <div>{body}</div>
          <div className="rounded-md p-3" style={{ backgroundColor: `${accent}12` }}>
            {asideItems(accent, "text-[11px] text-neutral-700")}
          </div>
        </div>
      </div>,
    );
  }

  if (template.layout === "classic-photo") {
    return page(
      <div className="h-full">
        <header
          className="flex items-center gap-4 px-7 py-6"
          style={{ backgroundColor: template.surface }}
        >
          <Photo size={80} ring="#ffffff" />
          <div>
            <h2 className="text-[22px] font-extrabold leading-tight text-neutral-900">{name}</h2>
            <p className="text-[12px] font-medium" style={{ color: accent }}>
              {data.title}
            </p>
            {contacts.length > 0 && (
              <p className="mt-1 text-[10px] text-neutral-600">{contacts.join(" · ")}</p>
            )}
          </div>
        </header>
        <div className="grid grid-cols-[1fr_32%] gap-6 px-7 py-4">
          <div>{body}</div>
          <div>{asideItems(accent, "text-[11px] text-neutral-600")}</div>
        </div>
      </div>,
    );
  }

  // minimal
  return page(
    <div className="h-full px-8 py-8">
      <header className="flex items-start justify-between gap-4 border-b pb-4" style={{ borderColor: accent }}>
        <div>
          <h2 className="text-[26px] font-extrabold leading-tight text-neutral-900">{name}</h2>
          <p className="text-[13px]" style={{ color: accent }}>
            {data.title}
          </p>
          {contacts.length > 0 && (
            <p className="mt-1 text-[10px] text-neutral-500">{contacts.join(" · ")}</p>
          )}
        </div>
        <Photo size={78} />
      </header>
      <div className="grid grid-cols-[1fr_30%] gap-6">
        <div>{body}</div>
        <div>{asideItems(accent, "text-[11px] text-neutral-600")}</div>
      </div>
    </div>,
  );
}

/** Miniatura escalada da página A4 (usada na galeria de modelos). */
export function CvThumb({ data, template, width = 180 }: { data: CvData; template: CvTemplate; width?: number }) {
  const scale = width / 794;
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-white"
      style={{ width, height: width * 1.414 }}
    >
      <div style={{ width: 794, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <CvPreview data={data} template={template} />
      </div>
    </div>
  );
}
