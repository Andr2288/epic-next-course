# Part 6 — чеклисти

**Автоперевірка репозиторію (2026):** `npm run build` у `frontend/` і `backend/` — **успішно**.

---

## 1. Чеклист відповідності Part 6 (Epic Next.js + Strapi, [туторіал](https://strapi.io/blog/epic-next-js-15-tutorial-part-6-create-video-summary-with-next-js-and-ai-sdk))

| # | Вимога | Статус у проєкті |
|---|--------|-------------------|
| 1 | Форма для YouTube ID/URL + кнопка «Create summary» | `frontend/src/components/forms/summary-form.tsx` |
| 2 | `extractYouTubeID` (id, watch, shorts) | `frontend/src/lib/utils.ts` |
| 3 | Toasts (Sonner) + `<Toaster />` у layout | `src/components/ui/sonner.tsx`, `src/app/layout.tsx` |
| 4 | Форма в header для залогіненого користувача | `src/components/custom/header.tsx` |
| 5 | API route: транскрипт (YouTube) | `src/app/api/transcript/route.ts` + `generate-transcript.ts` |
| 6 | API route: саммарі (AI SDK + OpenAI) | `src/app/api/summarize/route.ts` + `generate-summary.ts` |
| 7 | Бібліотека `youtubei.js` | `package.json` (frontend) |
| 8 | Пакети `ai`, `@ai-sdk/openai` | `package.json` (frontend) |
| 9 | Змінні `OPENAI_API_KEY` (і за бажанням `OPENAI_MODEL` тощо) | **вручну** у `.env` / `.env.local` |
| 10 | Strapi collection `Summary` (videoId, title, content, userId) | `backend/src/api/summary/content-types/summary/schema.json` |
| 11 | Збереження summary в Strapi | `save-summary.ts` + **server action** `createSummaryAction` (замість прямого виклику сервісу з клієнта) |
| 12 | Route middleware: `userId` + кредити на create | `backend/.../middlewares/on-summary-create.ts` + `routes/summary.ts` |
| 13 | Список summaries (loader + grid) | `loaders.ts` → `getSummaries`, `summaries-grid.tsx`, `dashboard/summaries/page.tsx` |
| 14 | Сторінка одного summary + embed YouTube | `dashboard/summaries/[documentId]/page.tsx`, `youtube-player.tsx` |
| 15 | Markdown-контент (перегляд) | `react-markdown` на сітці та детальній сторінці |
| 16 | Права Strapi для Authenticated (Summary) | **лише вручну** в Admin |
| 17 | Кредити у User | **вручну** в Admin (`credits` > 0) |

**Відмінності від статті (навмисно / спрощення):**

- Збереження в Strapi через **server action** + JWT з cookie, а не `import { services }` у client-компоненті.
- **Немає** MDX Editor / `summary-update-form` (це в Part 7 у туторіал-серії).
- Фільтр `getSummaries` за `userId` + перевірка власника на `getSummaryByDocumentId` (зручніше для безпеки).

---

## 2. Чеклист «що має працювати на цьому етапі» (ручна перевірка)

### Перед тестом

- [ ] Backend: `cd backend && npm run develop` (Strapi на `http://localhost:1337` або ваш URL).
- [ ] Frontend: `cd frontend && npm run dev` (Next на `http://localhost:3000`).
- [ ] У `.env` фронта: `NEXT_PUBLIC_STRAPI_URL` = URL Strapi; `OPENAI_API_KEY` задано.
- [ ] Strapi Admin → **Users & permissions → Roles → Authenticated** → для **Summary**: увімкнено **create**, **find**, **findOne** (мінімум для part 6).
- [ ] У **Content Manager** → **User** → ваш користувач з фронта: **credits** ≥ 1 (наприклад, 5).
- [ ] Підготуйте посилання на відео **з наявними субтитрами/транскриптом** (інакше крок transcript впаде з помилкою).

### Сценарії

- [ ] **Гість:** на головній у header — CTA (Sign in), **немає** поля «Create summary».
- [ ] **Після login:** у header з’являється поле + кнопка; редірект на `/dashboard` як раніше.
- [ ] **Create summary:** вставити `watch` / `shorts` URL або 11-символьний id → toasts: transcript → summary → save → успіх → **редірект** на `/dashboard/summaries/{documentId}`.
- [ ] **Без кредитів (0):** після введення відео — помилка на кроці **Generating summary** (402) або аналог (недостатньо кредитів).
- [ ] **Summaries:** `/dashboard/summaries` — картка з’являється, прев’ю markdown, клік веде на детальну.
- [ ] **Детальна:** зліва повний текст summary (markdown), справа embed + заголовок; невалідний `videoId` — повідомлення про URL.
- [ ] **Strapi:** після успішного save з’являється запис **Summary** з `userId`; у **User** **credits** зменшились на 1.
- [ ] **Чужий `documentId` в URL** (якщо тестуєте руками) — 404 / «не знайдено» (не показувати чужі summary).

### Регресія part 1–5

- [ ] Головна: блоки home-page з Strapi.
- [ ] **Sign in / sign up / logout.**
- [ ] **Account:** профіль і зображення (як після part 5).
- [ ] **Middleware:** без JWT `/dashboard/...` → на `/signin`.

---

## 3. Швидка таблиця помилок

| Що бачите | Ймовірна причина |
|-----------|------------------|
| 401 на transcript/summarize | Немає `jwt` cookie (не залогінені) |
| 402 на `/api/summarize` | `credits` = 0 або null |
| 401 / «кредити» на save в Strapi | Мало кредитів **або** немає прав `create` на Summary |
| Немає transcript | Відео без транскрипту / `youtubei.js` не зміг отримати панель |
| Порожня відповідь AI | `OPENAI_API_KEY` / ліміти / порожня відповідь моделі |

Після проходження розділу **2** Part 6 можна вважати **закритим з точки зору функціоналу**; далі — Part 7 (політики, update/delete тощо за планом курсу).
