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

/** Dados de demonstração usados nas miniaturas quando o utilizador ainda não preencheu nada. */
export const SAMPLE_CV: CvData = {
  ...EMPTY_CV,
  fullName: "Ana Macuácua",
  title: "Gestora de Operações",
  email: "ana.macuacua@email.com",
  phone: "+258 84 000 0000",
  location: "Maputo, Moçambique",
  summary:
    "Profissional com 6 anos de experiência em operações e liderança de equipas, focada em resultados e melhoria de processos.",
  experiences: [
    {
      role: "Gestora de Operações",
      company: "Grupo Zambeze",
      period: "2022 — Atual",
      description: "Coordenação de equipa de 12 pessoas e redução de 18% nos custos logísticos.",
    },
  ],
  education: [{ course: "Licenciatura em Gestão", school: "UEM", period: "2015 — 2019" }],
  skills: "Gestão de equipas, Excel avançado, Logística, Atendimento ao cliente",
  languages: "Português (nativo), Inglês (intermédio)",
};

export type CvLayout =
  | "sidebar-photo"
  | "header-dark"
  | "banner-photo"
  | "classic-photo"
  | "split"
  | "minimal";

export type CvTemplate = {
  id: string;
  name: string;
  layout: CvLayout;
  accent: string;
  /** cor de fundo da coluna/cabeçalho */
  surface: string;
  photoShape: "circle" | "square";
  premium: boolean;
};

export const CV_TEMPLATES: CvTemplate[] = [
  { id: "maputo-sidebar", name: "Maputo", layout: "sidebar-photo", accent: "#0F5132", surface: "#0F5132", photoShape: "circle", premium: false },
  { id: "executive", name: "Executive", layout: "header-dark", accent: "#1F2937", surface: "#111827", photoShape: "circle", premium: false },
  { id: "corporate", name: "Corporate", layout: "classic-photo", accent: "#12324F", surface: "#EEF2F7", photoShape: "square", premium: false },
  { id: "modern", name: "Modern", layout: "banner-photo", accent: "#0E7C66", surface: "#0E7C66", photoShape: "circle", premium: false },
  { id: "minimal", name: "Minimal", layout: "minimal", accent: "#2B2B2B", surface: "#F5F5F5", photoShape: "square", premium: false },
  { id: "beira", name: "Beira", layout: "split", accent: "#1B6CA8", surface: "#1B6CA8", photoShape: "circle", premium: true },
  { id: "nampula", name: "Nampula", layout: "sidebar-photo", accent: "#7A3E9D", surface: "#4C2A63", photoShape: "square", premium: true },
  { id: "elegant", name: "Elegant", layout: "classic-photo", accent: "#5A3E2B", surface: "#F3EDE6", photoShape: "circle", premium: true },
  { id: "impact", name: "Impact", layout: "banner-photo", accent: "#C0392B", surface: "#C0392B", photoShape: "square", premium: true },
  { id: "focus", name: "Focus", layout: "split", accent: "#00695C", surface: "#00695C", photoShape: "circle", premium: true },
  { id: "clarity", name: "Clarity", layout: "sidebar-photo", accent: "#37474F", surface: "#263238", photoShape: "circle", premium: true },
  { id: "prestige", name: "Prestige", layout: "header-dark", accent: "#8E6C0A", surface: "#3E2F05", photoShape: "square", premium: true },
  { id: "startup", name: "Startup", layout: "banner-photo", accent: "#6C3CD1", surface: "#6C3CD1", photoShape: "circle", premium: true },
  { id: "academic", name: "Academic", layout: "classic-photo", accent: "#1A237E", surface: "#E8EAF6", photoShape: "square", premium: true },
  { id: "technical", name: "Technical", layout: "sidebar-photo", accent: "#004D6E", surface: "#00344C", photoShape: "square", premium: true },
  { id: "creative", name: "Creative", layout: "split", accent: "#D81B60", surface: "#D81B60", photoShape: "circle", premium: true },
  { id: "graduate", name: "Graduate", layout: "minimal", accent: "#2E7D32", surface: "#EAF3EA", photoShape: "circle", premium: true },
  { id: "manager", name: "Manager", layout: "header-dark", accent: "#455A64", surface: "#2C3A41", photoShape: "circle", premium: true },
  { id: "consultant", name: "Consultant", layout: "classic-photo", accent: "#0B4F6C", surface: "#E7F0F4", photoShape: "square", premium: true },
  { id: "zambeze", name: "Zambeze", layout: "split", accent: "#0F8B8D", surface: "#0F8B8D", photoShape: "square", premium: true },
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
  return filled ? data : { ...SAMPLE_CV, photo: data.photo, templateId: data.templateId };
}
