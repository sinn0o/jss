# jss — 자소서 대리작성

경험(STAR) 데이터베이스를 미리 구축해두면, 채용공고 정보를 입력했을 때 Gemini API가
가장 적합한 경험을 골라 문항별 자소서 초안을 생성해주는 개인용 웹 서비스입니다.

> "초안에 도장을 찍다." — 정리되지 않은 경험이 다듬어져 정식 제출 문서가 되는 과정을 표현한
> 제품/디자인 컨셉은 [`PRD.md`](./PRD.md), [`DESIGN.md`](./DESIGN.md) 참고.

## 무엇을 하는 서비스인가

1. **경험 등록** (`/experiences`) — 프로젝트/공모전/강의/동아리/자격증/인턴 등 자신의 경험을
   STAR(상황-과제-행동-결과) 형식과 기술스택/키워드 태그로 정리해 미리 쌓아둡니다.
2. **자소서 생성** (`/cover-letters`) — 회사명·직무·지원자격·우대사항(및 공고 전문)을 입력하고,
   작성할 문항(글자수 제한 포함)을 추가한 뒤 활용할 경험을 선택합니다.
3. **AI 생성** — "자소서 생성" 버튼 한 번으로 Gemini가 공고에서 핵심 키워드를 추출하고, 문항마다
   가장 적합한 경험 1~2개를 골라 자연스러운 문장으로 재구성한 답안을 문항별 글자수 제한에 맞춰
   한 번에 작성합니다.
4. **다듬기** — 결과는 문항 단위/전체 단위로 재생성할 수 있고, 텍스트 영역에서 직접 수정한 뒤
   "복사하기"로 클립보드에 담아 실제 채용 사이트에 붙여넣어 사용합니다. 파일 다운로드 기능은
   제공하지 않습니다 — 이 서비스는 완성 제출본이 아닌 **초안 대리작성**이 목적입니다.

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

주요 스크립트: `npm run build`(프로덕션 빌드), `npm start`(빌드 결과 실행), `npm run lint`(ESLint).

### Gemini API 연동

1. [Google AI Studio](https://aistudio.google.com/apikey) 에서 API 키를 발급받습니다.
2. `.env.local.example`을 복사해 `.env.local`을 만들고 `GEMINI_API_KEY`를 채웁니다.
   ```bash
   cp .env.local.example .env.local
   ```
3. 개발 서버를 재시작합니다 (`.env.local`은 서버 시작 시에만 로드됩니다).

키가 없어도 앱은 정상적으로 실행되며, "자소서 생성"을 누르는 시점에만 안내 에러가 표시됩니다.

기본 모델은 `gemini-3.6-flash`이며, `GEMINI_MODEL` 환경변수로 덮어쓸 수 있습니다.

## Vercel 배포

이 프로젝트는 서버 상태를 갖지 않는 구조(데이터는 브라우저 `localStorage`, `/api/generate`는
매 요청마다 독립적으로 Gemini를 호출)라 Vercel 서버리스 환경에 그대로 배포할 수 있습니다.

1. GitHub 저장소를 Vercel에 연결합니다(Framework Preset: Next.js, 별도 설정 불필요).
2. Vercel 프로젝트 설정 → Environment Variables에 `GEMINI_API_KEY`를 추가합니다(`GEMINI_MODEL`은 선택).
   `.env.local`은 로컬 전용 파일이라 배포 환경에는 자동으로 전달되지 않으니 반드시 별도로 등록해야 합니다.
3. `/api/generate` 라우트는 `runtime = "nodejs"`, `maxDuration = 60`으로 설정되어 있습니다.
   문항을 한 번에 여러 개 생성하는 배치 모드는 시간이 걸릴 수 있으므로, Hobby 플랜(최대 60초)에서도
   타임아웃이 발생하면 문항 수를 줄이거나 상위 플랜을 사용하세요.
4. "AI 호출 중 오류가 발생했습니다" 같은 안내가 뜨는 경우 대부분 Gemini API 쪽의 일시적인
   과부하(예: `503 Service Unavailable`)이며, 서버 로그(Vercel Functions 로그)에 실제 원인이
   `[generate] Gemini 호출 실패:`로 남으니 확인 후 잠시 뒤 재시도하면 됩니다.

## 데이터 저장 구조

로그인 없는 단일 사용자 전제로, 모든 데이터(경험/자소서)는 브라우저 `localStorage`에 저장됩니다
(`src/lib/storage/localStorageClient.ts`). 저장소는 `StorageClient` 인터페이스로 추상화되어 있어
(`src/lib/storage/index.ts`), 추후 Supabase 등 서버 DB로 옮길 때 구현체 한 곳만 교체하면 됩니다.

## Gemini 호출 원칙

"생성"/"재생성" 액션 1회당 Gemini API 호출은 **1번**입니다. 키워드 추출 → 경험 매칭 → 문항별
답안 작성을 모두 하나의 프롬프트/응답 사이클(`src/lib/gemini/prompt.ts`, `src/app/api/generate/route.ts`)
안에서 처리하고, 응답 JSON에서 `extractedKeywords`와 문항별 `answers`를 한 번에 받아옵니다.
프론트엔드에서는 실제로는 한 번뿐인 이 호출이 진행되는 동안, 사용자에게는 "키워드를 추출하는
중이에요..." → "자소서를 작성하고 있어요..."처럼 단계별로 보이는 로딩 문구를 순차 전환해 보여줍니다.

## 현재 범위 (Phase 1)

- 경험 등록/수정/삭제, 카테고리별 STAR 입력, 기술스택/키워드 태그
- 자소서 생성: 공고 정보 입력 + 문항 여러 개 추가 + 경험 수동 선택(전체 선택/해제 지원)
- Gemini 호출: 생성/재생성 액션 1회당 API 호출 1회
- 문항 단위/전체 단위 재생성, 결과 텍스트 직접 편집, 클립보드 복사
- 다운로드 기능 없음 — "복사하기"로 클립보드에 복사해 채용 사이트에 직접 붙여넣는 방식
- 로그인 없는 단일 사용자, 데이터는 브라우저 `localStorage`에만 저장 (다른 기기/브라우저와 공유되지 않음)

## 스택

Next.js (App Router, TypeScript) · Tailwind CSS v4 · Gemini API (`@google/genai`) · zod
