export type CvExperience = { role: string; company: string; period: string; description: string };
export type CvEducation = { course: string; school: string; period: string };

export type CvData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  photo: string;
  summary: string;
  experiences: CvExperience[];
  education: CvEducation[];
  skills: string;
  languages: string;
  templateId: string;
};

export const EMPTY_CV: CvData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  photo: "",
  summary: "",
  experiences: [{ role: "", company: "", period: "", description: "" }],
  education: [{ course: "", school: "", period: "" }],
  skills: "",
  languages: "",
  templateId: "maputo-sidebar",
};

/** Fotografia de exemplo usada nas amostras dos modelos. */
export const SAMPLE_PHOTO = "/__l5e/assets-v1/84a8c7a3-478d-4be2-af74-37f63a62b315/cv-sample-photo.jpg";

/** Dados de demonstração usados nas miniaturas quando o utilizador ainda não preencheu nada. */
export const SAMPLE_CV: CvData = {
  ...EMPTY_CV,
  fullName: "Ana Macuácua",
  title: "Gestora de Operações",
  email: "ana.macuacua@email.com",
  phone: "+258 84 000 0000",
  location: "Maputo, Moçambique",
  photo: SAMPLE_PHOTO,
  summary:
    "Gestora com 8 anos de experiência em operações, logística e liderança de equipas multidisciplinares. Historial comprovado na redução de custos, na melhoria de processos e no cumprimento de metas trimestrais em empresas de grande dimensão em Moçambique.",
  experiences: [
    {
      role: "Gestora de Operações",
      company: "Grupo Zambeze, Maputo",
      period: "2022 — Atual",
      description:
        "Coordenação de uma equipa de 12 pessoas em três armazéns; redução de 18% nos custos logísticos e aumento de 25% na pontualidade das entregas.",
    },
    {
      role: "Supervisora de Logística",
      company: "TecnoMoz, Matola",
      period: "2019 — 2022",
      description:
        "Gestão de stock e frota, negociação com fornecedores e implementação de um sistema de controlo que eliminou 90% das rupturas.",
    },
    {
      role: "Assistente Administrativa",
      company: "Banco Horizonte, Beira",
      period: "2017 — 2019",
      description:
        "Apoio administrativo, atendimento a clientes empresariais e elaboração de relatórios mensais de desempenho.",
    },
  ],
  education: [
    { course: "Mestrado em Gestão de Operações", school: "Universidade Eduardo Mondlane", period: "2020 — 2022" },
    { course: "Licenciatura em Gestão de Empresas", school: "Universidade Eduardo Mondlane", period: "2015 — 2019" },
  ],
  skills:
    "Gestão de equipas, Logística e cadeia de abastecimento, Excel avançado, Análise de dados, Negociação, Gestão de orçamentos, Atendimento ao cliente",
  languages: "Português (nativo), Inglês (avançado), Changana (fluente)",
};


export type CvLayout =
  | "sidebar-dark"
  | "sidebar-right"
  | "header-band"
  | "centered-arch"
  | "timeline"
  | "two-tone"
  | "monogram"
  | "corner-photo"
  | "cards"
  | "minimal";

export type CvTemplate = {
  id: string;
  name: string;
  layout: CvLayout;
  accent: string;
  /** cor de fundo da coluna/cabeçalho */
  surface: string;
  photoShape: "circle" | "square";
  font?: "sans" | "serif";
  premium: boolean;
};

export const CV_TEMPLATES: CvTemplate[] = [
  { id: "maputo-sidebar", name: "Maputo", layout: "sidebar-dark", accent: "#0F5132", surface: "#0F5132", photoShape: "circle", premium: false },
  { id: "executive", name: "Executive", layout: "header-band", accent: "#C9A227", surface: "#111827", photoShape: "circle", premium: false },
  { id: "corporate", name: "Corporate", layout: "sidebar-right", accent: "#12324F", surface: "#EEF2F7", photoShape: "square", premium: false },
  { id: "modern", name: "Modern", layout: "two-tone", accent: "#0E7C66", surface: "#0E7C66", photoShape: "circle", premium: false },
  { id: "minimal", name: "Minimal", layout: "minimal", accent: "#2B2B2B", surface: "#F5F5F5", photoShape: "square", premium: false },
  { id: "beira", name: "Beira", layout: "centered-arch", accent: "#1B6CA8", surface: "#DCEAF6", photoShape: "circle", premium: true },
  { id: "nampula", name: "Nampula", layout: "corner-photo", accent: "#7A3E9D", surface: "#4C2A63", photoShape: "square", premium: true },
  { id: "elegant", name: "Elegant", layout: "monogram", accent: "#5A3E2B", surface: "#F3EDE6", photoShape: "circle", font: "serif", premium: true },
  { id: "impact", name: "Impact", layout: "corner-photo", accent: "#C0392B", surface: "#1C1C1C", photoShape: "square", premium: true },
  { id: "focus", name: "Focus", layout: "timeline", accent: "#00695C", surface: "#E4F1EE", photoShape: "circle", premium: true },
  { id: "clarity", name: "Clarity", layout: "cards", accent: "#37474F", surface: "#ECEFF1", photoShape: "circle", premium: true },
  { id: "prestige", name: "Prestige", layout: "monogram", accent: "#8E6C0A", surface: "#FBF6E6", photoShape: "circle", font: "serif", premium: true },
  { id: "startup", name: "Startup", layout: "cards", accent: "#6C3CD1", surface: "#F1ECFB", photoShape: "circle", premium: true },
  { id: "academic", name: "Academic", layout: "timeline", accent: "#1A237E", surface: "#E8EAF6", photoShape: "square", font: "serif", premium: true },
  { id: "technical", name: "Technical", layout: "sidebar-dark", accent: "#00A3C4", surface: "#00344C", photoShape: "square", premium: true },
  { id: "creative", name: "Creative", layout: "two-tone", accent: "#D81B60", surface: "#D81B60", photoShape: "circle", premium: true },
  { id: "graduate", name: "Graduate", layout: "centered-arch", accent: "#2E7D32", surface: "#E3F0E4", photoShape: "circle", premium: true },
  { id: "manager", name: "Manager", layout: "header-band", accent: "#90A4AE", surface: "#2C3A41", photoShape: "circle", premium: true },
  { id: "consultant", name: "Consultant", layout: "sidebar-right", accent: "#0B4F6C", surface: "#E7F0F4", photoShape: "square", premium: true },
  { id: "zambeze", name: "Zambeze", layout: "minimal", accent: "#0F8B8D", surface: "#FFFFFF", photoShape: "circle", font: "serif", premium: true },
];


export const CV_STORAGE_KEY = "moza-cv-draft";

export function loadCv(): CvData {
  if (typeof window === "undefined") return EMPTY_CV;
  try {
    const raw = window.localStorage.getItem(CV_STORAGE_KEY);
    return raw ? { ...EMPTY_CV, ...(JSON.parse(raw) as Partial<CvData>) } : EMPTY_CV;
  } catch {
    return EMPTY_CV;
  }
}

export function saveCv(data: CvData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

/** Junta os dados do utilizador com o exemplo, para miniaturas nunca ficarem vazias. */
export function previewData(data: CvData): CvData {
  const filled = data.fullName || data.title || data.summary || data.experiences.some((e) => e.role);
  return filled ? data : { ...SAMPLE_CV, photo: data.photo || SAMPLE_PHOTO, templateId: data.templateId };
}
