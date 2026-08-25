import type { GenerateRequest } from "./schema";

const CATEGORY_KO: Record<string, string> = {
  project: "프로젝트",
  contest: "공모전",
  course: "강의/교육",
  club: "동아리/대외활동",
  certificate: "자격증",
  career: "인턴/경력",
  etc: "기타",
};

export function buildPrompt(input: GenerateRequest): string {
  const { jobInfo, selectedExperiences, questions } = input;

  const experienceBlock = selectedExperiences
    .map((e, i) => {
      const period = [e.startDate, e.endDate].filter(Boolean).join(" ~ ");
      return `[경험 ${i + 1}] id: ${e.id}
- 카테고리: ${CATEGORY_KO[e.category] ?? e.category}
- 제목: ${e.title}
- 소속/기관: ${e.organization ?? "-"}
- 기간: ${period || "-"}
- 사용 기술/툴: ${e.techStack.join(", ") || "-"}
- S(상황): ${e.situation}
- T(과제): ${e.task}
- A(행동): ${e.action}
- R(결과): ${e.result}
- 키워드: ${e.keywords.join(", ") || "-"}`;
    })
    .join("\n\n");

  const questionBlock = questions
    .map((q, i) => `[문항 ${i + 1}] id: ${q.id} / 글자수 제한: ${q.charLimit}자\n${q.question}`)
    .join("\n\n");

  return `당신은 한국 IT 직무 취업준비생의 자기소개서 작성을 돕는 전문 커리어 컨설턴트입니다.
아래 채용공고 정보와 지원자의 경험(STAR) 데이터베이스를 바탕으로, 각 문항에 대한 자기소개서 답안을 작성하세요.

## 반드시 지켜야 할 규칙
1. 응답은 오직 JSON 하나만 출력합니다. 설명, 인사말, 마크다운 코드블록(\`\`\`) 등 다른 텍스트를 절대 포함하지 마세요.
2. 각 문항의 "글자수 제한"을 반드시 지키되, 제한의 90%~100% 사이 분량으로 충실하게 작성하세요. 제한을 초과하면 안 됩니다.
3. 문항 하나당 활용하는 경험은 반드시 1~2개로 제한합니다. 여러 경험을 나열식으로 욱여넣지 말고, 하나의 이야기로 깊이 있게 풀어내세요.
4. usedExperienceIds에는 아래 경험 목록에 실제로 존재하는 id만 사용하세요. 목록에 없는 id를 만들어내지 마세요.
5. 경험(STAR) 항목을 있는 그대로 나열하지 말고, 문항의 의도에 맞게 자연스러운 문장(서사)으로 재구성하세요.
6. 제공된 경험 정보의 범위를 벗어난 과장되거나 사실이 아닌 내용을 지어내지 마세요.
7. 공고의 자격요건/우대사항/전문을 스스로 분석해 핵심 역량 키워드를 extractedKeywords로 추출하세요.

## 채용공고 정보
- 회사명: ${jobInfo.companyName}
- 직무명: ${jobInfo.jobTitle}
- 지원자격: ${jobInfo.qualification || "-"}
- 우대사항: ${jobInfo.preference || "-"}
${jobInfo.jobPostingRaw ? `- 공고 전문:\n${jobInfo.jobPostingRaw}` : ""}

## 지원자 경험 목록 (총 ${selectedExperiences.length}개)
${experienceBlock}

## 작성해야 할 문항 목록 (총 ${questions.length}개)
${questionBlock}

## 출력 JSON 형식 (정확히 이 구조를 따르세요)
{
  "extractedKeywords": ["문자열", ...],
  "answers": [
    {
      "questionId": "문항의 id 값 그대로",
      "answer": "생성된 답안 본문",
      "usedExperienceIds": ["경험 id", "경험 id"],
      "charCount": 0
    }
  ]
}
answers 배열에는 위 문항 목록의 모든 id에 대해 정확히 하나씩만 포함하세요.`;
}
