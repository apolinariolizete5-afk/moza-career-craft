import type { CvData, CvTemplate } from "@/lib/cv";

function list(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
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
  const surface = template.surface;
  const serif = template.font === "serif";
  const name = data.fullName || "O seu nome";
  const contacts = [data.email, data.phone, data.location].filter(Boolean);
  const skills = list(data.skills);
  const languages = list(data.languages);
  const experiences = data.experiences.filter((e) => e.role || e.company);
  const education = data.education.filter((e) => e.course || e.school);

  const Photo = ({
    size = 96,
    ring,
    shape,
  }: {
    size?: number | undefined;
    ring?: string | undefined;
    shape?: "circle" | "square" | "arch" | undefined;
  }) => {
    const s = shape ?? template.photoShape;

    const radius =
      s === "circle"
        ? "9999px"
        : s === "arch"
          ? `${size / 2}px ${size / 2}px 12px 12px`
          : "10px";

    const style: React.CSSProperties = {
      width: size,
      height: size,
      borderRadius: radius,
      objectFit: "cover",
      border: ring ? `3px solid ${ring}` : undefined,
      flexShrink: 0,
    };

    return data.photo ? (
      <img src={data.photo} alt={name} style={style} />
    ) : (
      <div
        aria-hidden
        style={{
          ...style,
          background: "rgba(127,127,127,0.22)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <span
          style={{
            color: "rgba(0,0,0,0.35)",
            fontSize: size / 3.2,
            fontWeight: 700,
          }}
        >
          {initials(name)}
        </span>
      </div>
    );
  };

  const Title = ({
    children,
    color = accent,
  }: {
    children: React.ReactNode;
    color?: string | undefined;
  }) => (
    <h3
      className="text-[11px] font-bold uppercase tracking-[0.16em]"
      style={{
        color,
        fontFamily: serif ? "Georgia, serif" : undefined,
      }}
    >
      {children}
    </h3>
  );

  const Section = ({
    title,
    children,
    color = accent,
    rule,
  }: {
    title: string;
    children: React.ReactNode;
    color?: string | undefined;
    rule?: boolean | undefined;
  }) => (
    <section className="mt-4">
      <Title color={color}>{title}</Title>

      {rule && (
        <div
          className="mt-1 h-px w-full"
          style={{ backgroundColor: `${color}55` }}
        />
      )}

      <div className="mt-1.5 space-y-2 text-[11px] leading-snug">
        {children}
      </div>
    </section>
  );

  const Experiences = ({
    color = accent,
    rule,
  }: {
    color?: string | undefined;
    rule?: boolean | undefined;
  }) =>
    experiences.length > 0 ? (
      <Section title="Experiência" color={color} rule={rule}>
        {experiences.map((e, i) => (
          <div key={i}>
            <p className="text-[12px] font-semibold text-neutral-900">
              {e.role}
            </p>

            <p
              className="text-[10px] font-medium"
              style={{ color }}
            >
              {[e.company, e.period].filter(Boolean).join(" · ")}
            </p>

            {e.description && (
              <p className="text-neutral-700">
                {e.description}
              </p>
            )}
          </div>
        ))}
      </Section>
    ) : null;

  const Education = ({
    color = accent,
    rule,
  }: {
    color?: string | undefined;
    rule?: boolean | undefined;
  }) =>
    education.length > 0 ? (
      <Section title="Formação" color={color} rule={rule}>
        {education.map((e, i) => (
          <div key={i}>
            <p className="text-[12px] font-semibold text-neutral-900">
              {e.course}
            </p>

            <p className="text-[10px] text-neutral-500">
              {[e.school, e.period].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </Section>
    ) : null;

  const Summary = ({
    color = accent,
    rule,
  }: {
    color?: string | undefined;
    rule?: boolean | undefined;
  }) =>
    data.summary ? (
      <Section title="Perfil" color={color} rule={rule}>
        <p className="text-neutral-700">
          {data.summary}
        </p>
      </Section>
    ) : null;

  const Contacts = ({
    color = accent,
    className = "",
  }: {
    color?: string | undefined;
    className?: string | undefined;
  }) =>
    contacts.length > 0 ? (
      <div className={className}>
        <Section title="Contactos" color={color}>
          <ul className="space-y-1">
            {contacts.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Section>
      </div>
    ) : null;

  const Bars = ({
    items,
    color,
  }: {
    items: string[];
    color: string;
  }) => (
    <ul className="space-y-1.5">
      {items.map((s, i) => (
        <li key={s}>
          <span className="text-[10px]">{s}</span>

          <span
            className="mt-0.5 block h-[3px] w-full rounded-full"
            style={{
              backgroundColor: `${color}33`,
            }}
          >
            <span
              className="block h-[3px] rounded-full"
              style={{
                width: `${Math.max(45, 92 - i * 7)}%`,
                backgroundColor: color,
              }}
            />
          </span>
        </li>
      ))}
    </ul>
  );

  const Chips = ({
    items,
    color,
  }: {
    items: string[];
    color: string;
  }) => (
    <div className="flex flex-wrap gap-1">
      {items.map((s) => (
        <span
          key={s}
          className="rounded-full px-2 py-[2px] text-[9px]"
          style={{
            backgroundColor: `${color}18`,
            color,
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );

  const page = (children: React.ReactNode) => (
    <div
      id={id}
      className="mx-auto w-full max-w-[794px] overflow-hidden bg-white text-neutral-800 shadow-sm"
      style={{
        aspectRatio: "1 / 1.414",
        fontFamily: serif
          ? "Georgia, 'Times New Roman', serif"
          : undefined,
      }}
    >
      {children}
    </div>
  );

  switch (template.layout) {
    /* ============================================================
       1 — SIDEBAR DARK
       ============================================================ */
    case "sidebar-dark":
      return page(
        <div className="grid h-full grid-cols-[34%_1fr]">
          <aside
            className="h-full px-5 py-6 text-white"
            style={{ backgroundColor: surface }}
          >
            <div className="flex justify-center">
              <Photo
                size={104}
                ring="rgba(255,255,255,0.5)"
              />
            </div>

            <h2 className="mt-4 text-center text-[18px] font-extrabold leading-tight">
              {name}
            </h2>

            <p className="text-center text-[11px] opacity-85">
              {data.title}
            </p>

            <div className="text-[11px] text-white/90">
              <Contacts color="#ffffff" />

              {skills.length > 0 && (
                <Section
                  title="Competências"
                  color="#ffffff"
                >
                  <Bars
                    items={skills}
                    color="#ffffff"
                  />
                </Section>
              )}

              {languages.length > 0 && (
                <Section
                  title="Idiomas"
                  color="#ffffff"
                >
                  <ul className="space-y-1">
                    {languages.map((l) => (
                      <li key={l}>• {l}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </aside>

          <div className="px-6 py-6">
            <Summary />
            <Experiences />
            <Education />
          </div>
        </div>,
      );

    /* ============================================================
       2 — SIDEBAR RIGHT
       ============================================================ */
    case "sidebar-right":
      return page(
        <div className="grid h-full grid-cols-[1fr_32%]">
          <div className="px-7 py-7">
            <h2 className="text-[26px] font-extrabold leading-none text-neutral-900">
              {name}
            </h2>

            <p
              className="mt-1 text-[12px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              {data.title}
            </p>

            <Summary rule />
            <Experiences rule />
            <Education rule />
          </div>

          <aside
            className="h-full px-5 py-7 text-[11px] text-neutral-700"
            style={{ backgroundColor: surface }}
          >
            <div className="flex justify-center">
              <Photo
                size={92}
                ring="#ffffff"
              />
            </div>

            <Contacts />

            {skills.length > 0 && (
              <Section title="Competências">
                <Chips
                  items={skills}
                  color={accent}
                />
              </Section>
            )}

            {languages.length > 0 && (
              <Section title="Idiomas">
                <Chips
                  items={languages}
                  color={accent}
                />
              </Section>
            )}
          </aside>
        </div>,
      );

    /* ============================================================
       3 — HEADER BAND
       ============================================================ */
    case "header-band":
      return page(
        <div className="h-full">
          <header
            className="flex items-center justify-between gap-4 px-8 py-7 text-white"
            style={{ backgroundColor: surface }}
          >
            <div>
              <h2 className="text-[24px] font-extrabold leading-tight">
                {name}
              </h2>

              <p className="text-[12px] uppercase tracking-[0.24em] opacity-80">
                {data.title}
              </p>

              {contacts.length > 0 && (
                <p className="mt-2 text-[10px] opacity-80">
                  {contacts.join("  |  ")}
                </p>
              )}
            </div>

            <Photo
              size={86}
              ring="rgba(255,255,255,0.45)"
            />
          </header>

          <div
            className="h-[6px]"
            style={{ backgroundColor: accent }}
          />

          <div className="grid grid-cols-[1fr_30%] gap-7 px-8 py-5">
            <div>
              <Summary />
              <Experiences />
            </div>

            <div className="text-[11px] text-neutral-700">
              <Education />

              {skills.length > 0 && (
                <Section title="Competências">
                  <Bars
                    items={skills}
                    color={accent}
                  />
                </Section>
              )}

              {languages.length > 0 && (
                <Section title="Idiomas">
                  <Chips
                    items={languages}
                    color={accent}
                  />
                </Section>
              )}
            </div>
          </div>
        </div>,
      );

    /* ============================================================
       4 — CENTERED ARCH
       ============================================================ */
    case "centered-arch":
      return page(
        <div className="h-full">
          <header className="relative px-8 pb-6 pt-7 text-center">
            <div
              className="absolute inset-x-0 top-0 h-[120px]"
              style={{ backgroundColor: surface }}
            />

            <div className="relative flex flex-col items-center">
              <Photo
                size={104}
                shape="arch"
                ring="#ffffff"
              />

              <h2 className="mt-3 text-[24px] font-extrabold text-neutral-900">
                {name}
              </h2>

              <p
                className="text-[12px] uppercase tracking-[0.2em]"
                style={{ color: accent }}
              >
                {data.title}
              </p>

              {contacts.length > 0 && (
                <p className="mt-1 text-[10px] text-neutral-500">
                  {contacts.join(" · ")}
                </p>
              )}
            </div>
          </header>

          <div className="px-9">
            <Summary rule />

            <div className="grid grid-cols-2 gap-6">
              <Experiences rule />

              <div>
                <Education rule />

                {skills.length > 0 && (
                  <Section
                    title="Competências"
                    rule
                  >
                    <Chips
                      items={skills}
                      color={accent}
                    />
                  </Section>
                )}

                {languages.length > 0 && (
                  <Section
                    title="Idiomas"
                    rule
                  >
                    <Chips
                      items={languages}
                      color={accent}
                    />
                  </Section>
                )}
              </div>
            </div>
          </div>
        </div>,
      );

    /* ============================================================
       5 — TIMELINE
       ============================================================ */
    case "timeline":
      return page(
        <div className="h-full px-9 py-8">
          <header
            className="flex items-center gap-4 border-b-2 pb-4"
            style={{ borderColor: accent }}
          >
            <Photo size={76} />

            <div>
              <h2 className="text-[24px] font-extrabold leading-tight text-neutral-900">
                {name}
              </h2>

              <p
                className="text-[12px]"
                style={{ color: accent }}
              >
                {data.title}
              </p>

              {contacts.length > 0 && (
                <p className="mt-1 text-[10px] text-neutral-500">
                  {contacts.join(" · ")}
                </p>
              )}
            </div>
          </header>

          {data.summary && (
            <p className="mt-3 text-[11px] leading-snug text-neutral-700">
              {data.summary}
            </p>
          )}

          <div className="mt-4">
            <Title>Percurso</Title>

            <div
              className="mt-2 border-l-2 pl-4"
              style={{ borderColor: `${accent}44` }}
            >
              {[
                ...experiences.map((e) => ({
                  head: e.role,
                  sub: [e.company, e.period]
                    .filter(Boolean)
                    .join(" · "),
                  body: e.description,
                })),

                ...education.map((e) => ({
                  head: e.course,
                  sub: [e.school, e.period]
                    .filter(Boolean)
                    .join(" · "),
                  body: "",
                })),
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative mb-3"
                >
                  <span
                    className="absolute -left-[22px] top-[4px] block h-[9px] w-[9px] rounded-full"
                    style={{
                      backgroundColor: accent,
                    }}
                  />

                  <p className="text-[12px] font-semibold text-neutral-900">
                    {item.head}
                  </p>

                  <p className="text-[10px] text-neutral-500">
                    {item.sub}
                  </p>

                  {item.body && (
                    <p className="text-[11px] text-neutral-700">
                      {item.body}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-6">
            {skills.length > 0 && (
              <Section title="Competências">
                <Chips
                  items={skills}
                  color={accent}
                />
              </Section>
            )}

            {languages.length > 0 && (
              <Section title="Idiomas">
                <Chips
                  items={languages}
                  color={accent}
                />
              </Section>
            )}
          </div>
        </div>,
      );

    /* ============================================================
       6 — TWO TONE
       ============================================================ */
    case "two-tone":
      return page(
        <div className="h-full">
          <div className="grid grid-cols-[38%_1fr]">
            <div
              className="flex items-center justify-center py-8"
              style={{ backgroundColor: surface }}
            >
              <Photo
                size={112}
                ring="rgba(255,255,255,0.6)"
              />
            </div>

            <div
              className="flex flex-col justify-center px-7 py-8"
              style={{
                backgroundColor: `${accent}12`,
              }}
            >
              <h2 className="text-[26px] font-extrabold leading-none text-neutral-900">
                {name}
              </h2>

              <p
                className="mt-1 text-[12px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: accent }}
              >
                {data.title}
              </p>

              {contacts.length > 0 && (
                <p className="mt-2 text-[10px] text-neutral-600">
                  {contacts.join(" · ")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_34%] gap-6 px-8 py-5">
            <div>
              <Summary />
              <Experiences />
            </div>

            <div className="text-[11px] text-neutral-700">
              <Education />

              {skills.length > 0 && (
                <Section title="Competências">
                  <Bars
                    items={skills}
                    color={accent}
                  />
                </Section>
              )}

              {languages.length > 0 && (
                <Section title="Idiomas">
                  <ul className="space-y-1">
                    {languages.map((l) => (
                      <li key={l}>• {l}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </div>
        </div>,
      );

    /* ============================================================
       7 — MONOGRAM
       ============================================================ */
    case "monogram":
      return page(
        <div className="h-full px-10 py-10">
          <header className="text-center">
            <div className="flex justify-center">
              <Photo
                size={96}
                shape="circle"
                ring={accent}
              />
            </div>

            <h2 className="mt-3 text-[28px] font-semibold tracking-wide text-neutral-900">
              {name}
            </h2>

            <div
              className="mx-auto my-2 h-px w-24"
              style={{ backgroundColor: accent }}
            />

            <p className="text-[12px] uppercase tracking-[0.35em] text-neutral-500">
              {data.title}
            </p>

            {contacts.length > 0 && (
              <p className="mt-2 text-[10px] text-neutral-500">
                {contacts.join("   ·   ")}
              </p>
            )}
          </header>

          <div className="mt-4">
            <Summary />
            <Experiences />
            <Education />

            {skills.length > 0 && (
              <Section title="Competências">
                <p className="text-neutral-700">
                  {skills.join("  ·  ")}
                </p>
              </Section>
            )}

            {languages.length > 0 && (
              <Section title="Idiomas">
                <p className="text-neutral-700">
                  {languages.join("  ·  ")}
                </p>
              </Section>
            )}
          </div>
        </div>,
      );

    /* ============================================================
       8 — CORNER PHOTO
       ============================================================ */
    case "corner-photo":
      return page(
        <div className="h-full">
          <div className="grid grid-cols-[36%_1fr] items-stretch">
            <div
              style={{ backgroundColor: surface }}
              className="p-4"
            >
              <Photo
                size={200}
                shape="square"
              />
            </div>

            <div className="px-6 py-6">
              <h2 className="text-[30px] font-black uppercase leading-[0.95] text-neutral-900">
                {name}
              </h2>

              <p
                className="mt-1 text-[12px] font-semibold"
                style={{ color: accent }}
              >
                {data.title}
              </p>

              {contacts.length > 0 && (
                <ul className="mt-3 space-y-[2px] text-[10px] text-neutral-600">
                  {contacts.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}

              {data.summary && (
                <p className="mt-3 text-[11px] leading-snug text-neutral-700">
                  {data.summary}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_32%] gap-6 px-7 py-4">
            <div>
              <Experiences rule />
              <Education rule />
            </div>

            <div className="text-[11px] text-neutral-700">
              {skills.length > 0 && (
                <Section
                  title="Competências"
                  rule
                >
                  <Bars
                    items={skills}
                    color={accent}
                  />
                </Section>
              )}

              {languages.length > 0 && (
                <Section
                  title="Idiomas"
                  rule
                >
                  <Chips
                    items={languages}
                    color={accent}
                  />
                </Section>
              )}
            </div>
          </div>
        </div>,
      );

    /* ============================================================
       9 — CARDS
       ============================================================ */
    case "cards":
      return page(
        <div
          className="h-full px-6 py-6"
          style={{ backgroundColor: surface }}
        >
          <header className="flex items-center gap-4 rounded-xl bg-white px-5 py-4 shadow-sm">
            <Photo size={78} />

            <div>
              <h2 className="text-[22px] font-extrabold leading-tight text-neutral-900">
                {name}
              </h2>

              <p
                className="text-[12px]"
                style={{ color: accent }}
              >
                {data.title}
              </p>

              {contacts.length > 0 && (
                <p className="mt-1 text-[10px] text-neutral-500">
                  {contacts.join(" · ")}
                </p>
              )}
            </div>
          </header>

          <div className="mt-3 grid grid-cols-[1fr_33%] gap-3">
            <div className="rounded-xl bg-white px-5 py-3 shadow-sm">
              <Summary />
              <Experiences />
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-white px-4 py-3 text-[11px] text-neutral-700 shadow-sm">
                <Education />
              </div>

              <div className="rounded-xl bg-white px-4 py-3 text-[11px] text-neutral-700 shadow-sm">
                {skills.length > 0 && (
                  <Section title="Competências">
                    <Chips
                      items={skills}
                      color={accent}
                    />
                  </Section>
                )}

                {languages.length > 0 && (
                  <Section title="Idiomas">
                    <Chips
                      items={languages}
                      color={accent}
                    />
                  </Section>
                )}
              </div>
            </div>
          </div>
        </div>,
      );

    /* ============================================================
       10 — MINIMAL
       ============================================================ */
    case "minimal":
      return page(
        <div className="h-full px-10 py-10">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[30px] font-light leading-none text-neutral-900">
                {name}
              </h2>

              <p
                className="mt-2 text-[11px] uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                {data.title}
              </p>

              {contacts.length > 0 && (
                <p className="mt-2 text-[10px] text-neutral-500">
                  {contacts.join("  ·  ")}
                </p>
              )}
            </div>

            <Photo size={72} />
          </header>

          <div
            className="mt-4 h-px w-full"
            style={{ backgroundColor: accent }}
          />

          <div className="grid grid-cols-[1fr_28%] gap-8">
            <div>
              <Summary />
              <Experiences />
            </div>

            <div className="text-[11px] text-neutral-700">
              <Education />

              {skills.length > 0 && (
                <Section title="Competências">
                  <ul className="space-y-1">
                    {skills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {languages.length > 0 && (
                <Section title="Idiomas">
                  <ul className="space-y-1">
                    {languages.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </div>
        </div>,
      );

    /* ============================================================
       11 — ATS PRO
       ============================================================ */
    case "ats":
      return page(
        <div className="h-full px-10 py-9">
          <header
            className="border-b-2 pb-4"
            style={{ borderColor: accent }}
          >
            <h2 className="text-[27px] font-bold uppercase tracking-tight text-neutral-900">
              {name}
            </h2>

            {data.title && (
              <p className="mt-1 text-[13px] font-semibold text-neutral-700">
                {data.title}
              </p>
            )}

            {contacts.length > 0 && (
              <p className="mt-2 text-[10px] text-neutral-600">
                {contacts.join("  |  ")}
              </p>
            )}
          </header>

          <div className="mt-5">
            <Summary rule />
            <Experiences rule />
            <Education rule />

            {skills.length > 0 && (
              <Section
                title="Competências"
                rule
              >
                <p className="text-neutral-700">
                  {skills.join(" • ")}
                </p>
              </Section>
            )}

            {languages.length > 0 && (
              <Section
                title="Idiomas"
                rule
              >
                <p className="text-neutral-700">
                  {languages.join(" • ")}
                </p>
              </Section>
            )}
          </div>
        </div>,
      );

    /* ============================================================
       12 — PRIMEIRO EMPREGO
       ============================================================ */
    case "first-job":
      return page(
        <div className="h-full">
          <header
            className="px-9 py-7"
            style={{
              backgroundColor: surface,
              borderBottom: `5px solid ${accent}`,
            }}
          >
            <div className="flex items-center gap-5">
              <Photo
                size={96}
                ring="#ffffff"
              />

              <div>
                <h2 className="text-[25px] font-extrabold text-neutral-900">
                  {name}
                </h2>

                <p
                  className="mt-1 text-[12px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: accent }}
                >
                  {data.title || "Candidato"}
                </p>

                {contacts.length > 0 && (
                  <p className="mt-2 text-[10px] text-neutral-600">
                    {contacts.join(" · ")}
                  </p>
                )}
              </div>
            </div>
          </header>

          <div className="px-9 py-5">
            <Summary rule />

            <div className="grid grid-cols-2 gap-7">
              <div>
                <Education rule />

                {skills.length > 0 && (
                  <Section
                    title="Competências"
                    rule
                  >
                    <Chips
                      items={skills}
                      color={accent}
                    />
                  </Section>
                )}
              </div>

              <div>
                <Experiences rule />

                {languages.length > 0 && (
                  <Section
                    title="Idiomas"
                    rule
                  >
                    <Chips
                      items={languages}
                      color={accent}
                    />
                  </Section>
                )}
              </div>
            </div>
          </div>
        </div>,
      );

    /* ============================================================
       13 — TECHNOLOGY
       ============================================================ */
    case "tech":
      return page(
        <div
          className="h-full"
          style={{ backgroundColor: "#F8FAFC" }}
        >
          <header
            className="px-8 py-7 text-white"
            style={{ backgroundColor: surface }}
          >
            <div className="flex items-center gap-5">
              <Photo
                size={92}
                shape="square"
                ring={accent}
              />

              <div>
                <p
                  className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: accent }}
                >
                  PROFILE / CV
                </p>

                <h2 className="text-[26px] font-bold">
                  {name}
                </h2>

                <p className="mt-1 text-[12px] text-white/70">
                  {data.title}
                </p>
              </div>
            </div>

            {contacts.length > 0 && (
              <div className="mt-4 border-t border-white/10 pt-3 text-[9px] text-white/70">
                {contacts.join("   •   ")}
              </div>
            )}
          </header>

          <div className="grid grid-cols-[1fr_31%] gap-6 px-8 py-5">
            <div>
              <Summary />

              <Section
                title="Experiência"
                color={accent}
              >
                {experiences.map((e, i) => (
                  <div
                    key={i}
                    className="border-l-2 pl-3"
                    style={{
                      borderColor: accent,
                    }}
                  >
                    <p className="text-[12px] font-bold text-neutral-900">
                      {e.role}
                    </p>

                    <p
                      className="text-[10px] font-medium"
                      style={{ color: accent }}
                    >
                      {[e.company, e.period]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    {e.description && (
                      <p className="mt-1 text-neutral-700">
                        {e.description}
                      </p>
                    )}
                  </div>
                ))}
              </Section>

              <Education />
            </div>

            <aside
              className="rounded-lg p-4 text-white"
              style={{ backgroundColor: surface }}
            >
              {skills.length > 0 && (
                <Section
                  title="Skills"
                  color={accent}
                >
                  <div className="space-y-2">
                    {skills.map((skill, i) => (
                      <div key={skill}>
                        <p className="text-[9px] text-white/90">
                          {skill}
                        </p>

                        <div className="mt-1 h-1 rounded-full bg-white/10">
                          <div
                            className="h-1 rounded-full"
                            style={{
                              width: `${Math.max(
                                50,
                                92 - i * 7,
                              )}%`,
                              backgroundColor: accent,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {languages.length > 0 && (
                <Section
                  title="Languages"
                  color={accent}
                >
                  <ul className="space-y-1 text-[10px] text-white/80">
                    {languages.map((language) => (
                      <li key={language}>
                        › {language}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </aside>
          </div>
        </div>,
      );

    /* ============================================================
       14 — PORTFÓLIO
       ============================================================ */
    case "portfolio":
      return page(
        <div
          className="h-full px-7 py-7"
          style={{ backgroundColor: surface }}
        >
          <header className="rounded-2xl bg-white px-6 py-5 shadow-sm">
            <div className="flex items-center gap-5">
              <Photo
                size={100}
                shape="square"
              />

              <div>
                <h2 className="text-[26px] font-black text-neutral-900">
                  {name}
                </h2>

                <p
                  className="mt-1 text-[12px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: accent }}
                >
                  {data.title}
                </p>

                {contacts.length > 0 && (
                  <p className="mt-2 text-[10px] text-neutral-500">
                    {contacts.join(" · ")}
                  </p>
                )}
              </div>
            </div>
          </header>

          <div className="mt-4 grid grid-cols-[1fr_34%] gap-4">
            <main className="space-y-4">
              {data.summary && (
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <Title>Sobre mim</Title>

                  <p className="mt-2 text-[11px] leading-relaxed text-neutral-700">
                    {data.summary}
                  </p>
                </div>
              )}

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <Title>Experiência</Title>

                <div className="mt-3 space-y-4">
                  {experiences.map((e, i) => (
                    <div key={i}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[12px] font-bold text-neutral-900">
                          {e.role}
                        </p>

                        {e.period && (
                          <span
                            className="rounded-full px-2 py-1 text-[8px] font-semibold"
                            style={{
                              backgroundColor: `${accent}18`,
                              color: accent,
                            }}
                          >
                            {e.period}
                          </span>
                        )}
                      </div>

                      <p
                        className="text-[10px] font-medium"
                        style={{ color: accent }}
                      >
                        {e.company}
                      </p>

                      {e.description && (
                        <p className="mt-1 text-[10px] text-neutral-700">
                          {e.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <Education />
              </div>
            </main>

            <aside className="space-y-4">
              {skills.length > 0 && (
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <Title>Competências</Title>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="rounded-lg border px-3 py-2 text-[9px] font-medium"
                        style={{
                          borderColor: `${accent}30`,
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {languages.length > 0 && (
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <Title>Idiomas</Title>

                  <ul className="mt-3 space-y-2 text-[10px] text-neutral-700">
                    {languages.map((language) => (
                      <li key={language}>
                        ● {language}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>,
      );

    /* ============================================================
       15 — MOÇAMBIQUE
       ============================================================ */
    case "mozambique":
      return page(
        <div className="h-full">
          <header className="relative overflow-hidden px-8 py-7">
            <div
              className="absolute inset-x-0 top-0 h-2"
              style={{ backgroundColor: accent }}
            />

            <div className="mt-2 flex items-center gap-5">
              <Photo
                size={94}
                ring={accent}
              />

              <div>
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: accent }}
                >
                  CURRICULUM VITAE
                </p>

                <h2 className="mt-1 text-[27px] font-extrabold text-neutral-900">
                  {name}
                </h2>

                <p className="text-[12px] font-semibold text-neutral-600">
                  {data.title}
                </p>

                {contacts.length > 0 && (
                  <p className="mt-2 text-[10px] text-neutral-500">
                    {contacts.join("  ·  ")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex h-1 w-full">
              <div
                className="h-full w-1/3"
                style={{ backgroundColor: "#F2C94C" }}
              />

              <div
                className="h-full w-1/3"
                style={{ backgroundColor: accent }}
              />

              <div
                className="h-full w-1/3"
                style={{ backgroundColor: "#C0392B" }}
              />
            </div>
          </header>

          <div className="grid grid-cols-[1fr_32%] gap-7 px-8 py-3">
            <main>
              <Summary rule />
              <Experiences rule />
              <Education rule />
            </main>

            <aside>
              {skills.length > 0 && (
                <Section
                  title="Competências"
                  color={accent}
                  rule
                >
                  <Chips
                    items={skills}
                    color={accent}
                  />
                </Section>
              )}

              {languages.length > 0 && (
                <Section
                  title="Idiomas"
                  color={accent}
                  rule
                >
                  <ul className="space-y-1 text-[10px] text-neutral-700">
                    {languages.map((language) => (
                      <li key={language}>
                        • {language}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section
                title="Localização"
                color={accent}
                rule
              >
                <p className="text-[10px] text-neutral-700">
                  {data.location || "Moçambique"}
                </p>
              </Section>
            </aside>
          </div>
        </div>,
      );

    /* ============================================================
       FALLBACK
       ============================================================ */
    default:
      return page(
        <div className="h-full px-10 py-10">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[30px] font-light leading-none text-neutral-900">
                {name}
              </h2>

              <p
                className="mt-2 text-[11px] uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                {data.title}
              </p>

              {contacts.length > 0 && (
                <p className="mt-2 text-[10px] text-neutral-500">
                  {contacts.join("  ·  ")}
                </p>
              )}
            </div>

            <Photo size={72} />
          </header>

          <div
            className="mt-4 h-px w-full"
            style={{ backgroundColor: accent }}
          />

          <div className="grid grid-cols-[1fr_28%] gap-8">
            <div>
              <Summary />
              <Experiences />
            </div>

            <div className="text-[11px] text-neutral-700">
              <Education />

              {skills.length > 0 && (
                <Section title="Competências">
                  <ul className="space-y-1">
                    {skills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </Section>
              )}

              {languages.length > 0 && (
                <Section title="Idiomas">
                  <ul className="space-y-1">
                    {languages.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          </div>
        </div>,
      );
  }
}

/** Miniatura escalada da página A4 (usada na galeria de modelos). */
export function CvThumb({
  data,
  template,
  width = 180,
}: {
  data: CvData;
  template: CvTemplate;
  width?: number;
}) {
  const scale = width / 794;

  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-white"
      style={{
        width,
        height: width * 1.414,
      }}
    >
      <div
        style={{
          width: 794,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <CvPreview
          data={data}
          template={template}
        />
      </div>
    </div>
  );
          }
