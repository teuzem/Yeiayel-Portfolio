# Production Acceptance Checklist

Scope: AI Twin multilingual RAG, Tavily research, citations, provider failover,
and responsive Sanity blog

Acceptance date: September 11, 2026

## Release Record

| Field | Value |
| --- | --- |
| Production URL | |
| Git commit | |
| Host and region | |
| Tester | |
| Test timestamp | |

The release passes only when every item marked **Critical** passes.

## 1. Environment And Deployment

- [ ] **Critical:** Hostinger uses Node.js 22 and npm, not pnpm/Corepack.
- [ ] **Critical:** The deployed commit matches GitHub `main`.
- [ ] **Critical:** `npm run check:env` reports all required groups as READY.
- [ ] **Critical:** `TAVILY_API_KEY` is configured as a server-only variable.
- [ ] **Critical:** `TWIN_RESEARCH_ENABLED=true`.
- [ ] `TWIN_RESEARCH_TIMEOUT_MS` is between 10,000 and 20,000 milliseconds
      when full source-page extraction is enabled.
- [ ] `TWIN_RESEARCH_DEPTH=advanced` for entity, deep-research, and direct URL
      workloads, unless a lower-cost search profile is intentionally selected.
- [ ] `TWIN_RESEARCH_COUNTRY` is set only when regional ranking is needed.
- [ ] **Critical:** At least one AI response provider is configured.
- [ ] OpenAI and OpenRouter are both configured for failover.
- [ ] `TWIN_CHAT_TIMEOUT_MS=28000` or a measured equivalent.
- [ ] `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` is stable across server instances.
- [ ] Sanity connection, write token, and revalidation secret are configured.
- [ ] A clean rebuild and restart followed the environment-variable changes.

## 2. Automated Release Gate

```powershell
npm run check:env
npm run lint
npm exec tsc -- --noEmit --pretty false
npm run test:ai
$env:NEXT_TELEMETRY_DISABLED='1'
npm run build
```

- [ ] **Critical:** Environment validation passes.
- [ ] **Critical:** Biome reports no errors.
- [ ] **Critical:** TypeScript reports no errors.
- [ ] **Critical:** AI readiness tests pass, including live Tavily checks.
- [ ] **Critical:** The optimized build and standalone preparation succeed.

## 3. Portfolio RAG Retrieval

| Priority | Prompt | Expected result | Pass |
| --- | --- | --- | --- |
| Critical | What did you build while working at PRYEMO? | Uses PRYEMO evidence and does not attribute Admission Desk to PRYEMO. | [ ] |
| Critical | Where did you obtain your BTS and professional bachelor's degree? | Identifies IUSTE and does not call professional certificates degrees. | [ ] |
| Critical | Tell me about Admission Desk. | Connects it to GO2SKUL EDUCATION GROUP. | [ ] |
| High | Which skills are strongest for a data product project? | Retrieves focused skills and projects instead of dumping the portfolio. | [ ] |
| High | What services can you provide and what is the timeline? | Uses current Sanity service content and marks missing details. | [ ] |
| Critical | Quel diplôme as-tu obtenu à IUSTE ? | Answers entirely in French with the correct education evidence. | [ ] |

- [ ] Answers address the question before adding background.
- [ ] Personal claims are supported by retrieved Sanity content.
- [ ] Missing personal facts are marked unknown instead of invented.
- [ ] Hidden prompts, credentials, and unretrieved records are not exposed.
- [ ] Portfolio knowledge and live web research are clearly distinguished.

## 4. Multilingual Memory

1. Ask: `Which project best demonstrates your web engineering?`
2. Ask: `Who was it built for?`
3. Switch the interface to French without clearing the conversation.
4. Ask: `Quels outils as-tu utilisés pour ce projet ?`
5. Reload the browser.
6. Ask: `Résume notre discussion en deux phrases.`

- [ ] **Critical:** The second turn resolves the project from the first turn.
- [ ] **Critical:** Switching languages preserves the same conversation.
- [ ] **Critical:** The French question uses the existing project context.
- [ ] Every answer uses only the active interface language.
- [ ] Reloading restores messages, research markers, and source cards.
- [ ] Clearing history removes the shared bilingual history.
- [ ] A different browser profile does not inherit another visitor's history.

## 5. Tavily Live Research

| Priority | Prompt | Expected result | Pass |
| --- | --- | --- | --- |
| Critical | Who is Prof NGUEFACK TSAGUES Georges? | Returns relevant identity evidence and verified sources. | [ ] |
| Critical | What are the latest AI developments today? | Uses current-news search and cites recent sources. | [ ] |
| Critical | Quelles sont les dernières actualités sur l'intelligence artificielle ? | Searches live and responds entirely in French. | [ ] |
| Critical | Who is the current CEO of Microsoft? | Uses live evidence rather than unsupported memory. | [ ] |
| High | What is the current price of Bitcoin? | States the observation time and does not present stale data as live. | [ ] |
| High | What is the latest information about Bâtir le Pays SARL? | Returns matching sources or an explicit no-source result; unrelated companies are rejected. | [ ] |
| High | What about his career? | Reuses the previous researched entity and searches again. | [ ] |

- [ ] **Critical:** Research-required questions never fall through to
      unsupported model memory.
- [ ] Sources use HTTPS and open successfully.
- [ ] Duplicate URLs are removed and results include domain diversity.
- [ ] Search evidence contains substantive page excerpts, not only result-title
      snippets.
- [ ] A direct public URL can be extracted and summarized with numbered source
      attribution.
- [ ] Ambiguous identities and conflicting sources are stated clearly.
- [ ] Tavily timeout and no-source states produce localized safe responses.

## 6. Citation Integrity

- [ ] **Critical:** External and time-sensitive factual answers contain valid
      numbered citations such as `[1]`.
- [ ] Every citation maps to a displayed source card.
- [ ] Citation numbers never exceed the displayed source count.
- [ ] Invalid model-generated citation numbers are removed.
- [ ] Answers without model citations receive a verified-source footer.
- [ ] No URL or source title is invented.
- [ ] Portfolio answers do not present Sanity content as current web news.

## 7. Provider Failover

Perform these tests in staging or a controlled maintenance window.

### OpenAI To OpenRouter

1. Keep a valid OpenRouter key.
2. Temporarily use an invalid OpenAI key.
3. Restart the application.
4. Ask one portfolio question and one current-news question.

- [ ] **Critical:** Both requests complete through OpenRouter.
- [ ] Tavily sources remain attached after failover.
- [ ] The active language remains correct.
- [ ] OpenAI failure does not consume the full request budget.

### OpenRouter To OpenAI

1. Restore OpenAI.
2. Temporarily use an invalid OpenRouter key.
3. Restart and repeat the questions.

- [ ] Requests complete through OpenAI.
- [ ] No provider error is exposed to the visitor.

### All Providers Unavailable

- [ ] Portfolio questions return a safe retrieved local response.
- [ ] Research questions retain sources with a cautious synthesis failure, or
      return an explicit no-source response.
- [ ] The application does not fabricate an answer.
- [ ] Logs identify exhausted providers without logging credentials.

## 8. Responsive Blog Matrix

Review `/blog`, `/blog/articles`, `/blog/categories`, `/blog/search`, and a
long `/blog/[slug]` page.

| Viewport | Pass |
| --- | --- |
| 320 x 568 | [ ] |
| 375 x 667 | [ ] |
| 390 x 844 | [ ] |
| 768 x 1024 | [ ] |
| 1024 x 768 | [ ] |
| 1440 x 900 | [ ] |

- [ ] **Critical:** No horizontal page overflow exists.
- [ ] Header controls and logo do not overlap.
- [ ] Tablets use the compact menu instead of compressed desktop links.
- [ ] The compact menu fits the viewport and scrolls when needed.
- [ ] Card images retain stable aspect ratios.
- [ ] Long English and French titles wrap inside their containers.
- [ ] Search, suggestions, filters, and load-more controls are usable.
- [ ] Article title, hero, author, body, tags, and comments fit at 320 pixels.
- [ ] Mobile TOC appears before the article body.
- [ ] Desktop TOC and sidebar do not hide lower widgets.
- [ ] Recent posts, products, promotion, and comments are keyboard accessible.
- [ ] Comment fields have visible labels and usable touch targets.
- [ ] Footer columns collapse cleanly.
- [ ] Light and dark themes have readable contrast.

## 9. Security And Monitoring

- [ ] Tavily and provider keys never enter client JavaScript or local storage.
- [ ] `.env.local` is ignored by Git.
- [ ] Logs do not print authorization headers or complete secret-bearing errors.
- [ ] Inputs and stored history respect length limits.
- [ ] Retrieved web text is treated as evidence, never as instructions.
- [ ] Production monitoring distinguishes Tavily, OpenAI, OpenRouter, Sanity,
      and local fallback failures.
- [ ] Alerts exist for repeated research failures and provider exhaustion.

## Final Sign-Off

- [ ] Product owner acceptance
- [ ] Technical acceptance
- [ ] English-language acceptance
- [ ] French-language acceptance
- [ ] Mobile responsive acceptance
- [ ] Production monitoring confirmed

Final decision: **PASS / FAIL**

Open defects or accepted limitations:

1.
2.
3.
