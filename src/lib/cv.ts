export type CvExperience = { role: string; company: string; period: string; description: string };
export type CvEducation = { course: string; school: string; period: string };

export type CvData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
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
  summary: "",
  experiences: [{ role: "", company: "", period: "", description: "" }],
  education: [{ course: "", school: "", period: "" }],
  skills: "",
  languages: "",
  templateId: "executive",
};

export type CvTemplate = {
  id: string;
  name: string;
  /** layout family */
  layout: "sidebar" | "classic" | "banner";
  accent: string;
  premium: boolean;
};

export const CV_TEMPLATES: CvTemplate[] = [
  { id: "executive", name: "Executive", layout: "sidebar", accent: "#0F5132", premium: false },
  { id: "corporate", name: "Corporate", layout: "classic", accent: "#12324F", premium: false },
  { id: "modern", name: "Modern", layout: "banner", accent: "#0E7C66", premium: false },
  { id: "minimal", name: "Minimal", layout: "classic", accent: "#2B2B2B", premium: false },
  { id: "maputo", name: "Maputo", layout: "sidebar", accent: "#B4531F", premium: true },
  { id: "beira", name: "Beira", layout: "banner", accent: "#1B6CA8", premium: true },
  { id: "nampula", name: "Nampula", layout: "sidebar", accent: "#7A3E9D", premium: true },
  { id: "elegant", name: "Elegant", layout: "classic", accent: "#5A3E2B", premium: true },
  { id: "impact", name: "Impact", layout: "banner", accent: "#C0392B", premium: true },
  { id: "focus", name: "Focus", layout: "classic", accent: "#00695C", premium: true },
  { id: "clarity", name: "Clarity", layout: "sidebar", accent: "#37474F", premium: true },
  { id: "prestige", name: "Prestige", layout: "banner", accent: "#8E6C0A", premium: true },
  { id: "startup", name: "Startup", layout: "banner", accent: "#6C3CD1", premium: true },
  { id: "academic", name: "Academic", layout: "classic", accent: "#1A237E", premium: true },
  { id: "technical", name: "Technical", layout: "sidebar", accent: "#004D6E", premium: true },
  { id: "creative", name: "Creative", layout: "banner", accent: "#D81B60", premium: true },
  { id: "graduate", name: "Graduate", layout: "classic", accent: "#2E7D32", premium: true },
  { id: "manager", name: "Manager", layout: "sidebar", accent: "#455A64", premium: true },
  { id: "consultant", name: "Consultant", layout: "classic", accent: "#0B4F6C", premium: true },
  { id: "zambeze", name: "Zambeze", layout: "banner", accent: "#0F8B8D", premium: true },
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
