export type ExperienceCategory =
  | "project"
  | "contest"
  | "course"
  | "club"
  | "certificate"
  | "career"
  | "etc";

export const EXPERIENCE_CATEGORIES: {
  value: ExperienceCategory;
  label: string; // 모노 라벨 (DESIGN.md 3장 — 카테고리는 색이 아닌 모노 라벨 텍스트로 구분)
  koLabel: string;
}[] = [
  { value: "project", label: "PROJECT", koLabel: "프로젝트" },
  { value: "contest", label: "CONTEST", koLabel: "공모전" },
  { value: "course", label: "COURSE", koLabel: "강의/교육" },
  { value: "club", label: "CLUB", koLabel: "동아리/대외활동" },
  { value: "certificate", label: "CERT", koLabel: "자격증" },
  { value: "career", label: "CAREER", koLabel: "인턴/경력" },
  { value: "etc", label: "ETC", koLabel: "기타" },
];

export interface Experience {
  id: string;
  category: ExperienceCategory;
  title: string;
  organization?: string;
  startDate?: string; // 'YYYY-MM'
  endDate?: string; // 'YYYY-MM'
  techStack: string[];
  situation: string;
  task: string;
  action: string;
  result: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export type ExperienceInput = Omit<Experience, "id" | "createdAt" | "updatedAt">;

export interface CoverLetterQuestion {
  id: string;
  question: string;
  charLimit: number;
  generatedAnswer: string;
  usedExperienceIds: string[];
  charCount: number;
}

export type CoverLetterQuestionInput = Pick<CoverLetterQuestion, "question" | "charLimit">;

export interface CoverLetter {
  id: string;
  companyName: string;
  jobTitle: string;
  qualification: string;
  preference: string;
  jobPostingRaw?: string;
  extractedKeywords: string[];
  selectedExperienceIds: string[]; // 생성 시 사용자가 선택한 경험 (재생성 시 동일 선택 재사용)
  questions: CoverLetterQuestion[];
  createdAt: string;
  updatedAt: string;
}

export type CoverLetterInput = Omit<CoverLetter, "id" | "createdAt" | "updatedAt">;
