import type {
  CoverLetter,
  CoverLetterInput,
  Experience,
  ExperienceInput,
} from "@/lib/types";

/**
 * 저장소 추상 인터페이스.
 * Phase 1은 localStorage 구현체(localStorageClient.ts)를 사용하지만,
 * 모든 메서드를 Promise로 선언해두어 향후 Supabase 구현체로 교체해도
 * 호출부(hooks/*) 코드는 변경되지 않도록 한다.
 */
export interface StorageClient {
  listExperiences(): Promise<Experience[]>;
  getExperience(id: string): Promise<Experience | null>;
  createExperience(input: ExperienceInput): Promise<Experience>;
  updateExperience(id: string, patch: Partial<ExperienceInput>): Promise<Experience>;
  deleteExperience(id: string): Promise<void>;

  listCoverLetters(): Promise<CoverLetter[]>;
  getCoverLetter(id: string): Promise<CoverLetter | null>;
  createCoverLetter(input: CoverLetterInput): Promise<CoverLetter>;
  updateCoverLetter(id: string, patch: Partial<CoverLetterInput>): Promise<CoverLetter>;
  deleteCoverLetter(id: string): Promise<void>;
}
