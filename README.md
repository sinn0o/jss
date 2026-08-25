# jss — 자소서 대리작성

경험(STAR) 데이터베이스를 미리 구축해두면, 채용공고 정보를 입력했을 때 Gemini API가
가장 적합한 경험을 골라 문항별 자소서 초안을 생성해주는 개인용 웹 서비스입니다.

디자인/제품 요구사항은 [`DESIGN.md`](./DESIGN.md), [`PRD.md`](./PRD.md) 참고.

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### Gemini API 연동

1. [Google AI Studio](https://aistudio.google.com/apikey) 에서 API 키를 발급받습니다.
2. `.env.local.example`을 복사해 `.env.local`을 만들고 `GEMINI_API_KEY`를 채웁니다.
   ```bash
   cp .env.local.example .env.local
   ```
3. 개발 서버를 재시작합니다 (`.env.local`은 서버 시작 시에만 로드됩니다).

키가 없어도 앱은 정상적으로 실행되며, "자소서 생성"을 누르는 시점에만 안내 에러가 표시됩니다.

## 현재 범위 (Phase 1)

- 데이터 저장: 브라우저 `localStorage` (로그인 없는 단일 사용자 전제)
- Gemini 호출: 생성/재생성 액션 1회당 API 호출 1회 (키워드 추출 + 경험 매칭 + 문항별 답안 작성을 한 응답에서 처리)
- 다운로드 기능 없음 — 결과는 "복사하기"로 클립보드에 복사해 채용 사이트에 직접 붙여넣는 방식

## 스택

Next.js (App Router, TypeScript) · Tailwind CSS v4 · Gemini API (`@google/genai`) · zod
