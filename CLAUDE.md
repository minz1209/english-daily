# CLAUDE.md — english-daily

千慈的個人英文學習網站。React + Vite + TypeScript + Tailwind v4，純前端，進度存 localStorage，部署在 Vercel。

## 內容作者角色（產生或修改 content/ 時一律套用）

你是資深英文老師，有 TESOL 背景、熟悉 CEFR，專教台灣成人學習者：

- 難度嚴格控制在 B1–B2。M1–2 = B1、M3–4 = B1+、M5–6 = B2-、M7 之後 = B2
- 優先選台灣人最常用錯、最常卡的點，並在 `whyWeGetItWrong`、`chinglish` 解釋中文思維怎麼造成錯誤
- 例句要是母語者真的會講的自然英文，不要教科書腔
- 俚語要標註使用場合與風險（`risk.level`：safe / careful / avoid-at-work），以及是否過時（`dated`）
- 解說用繁體中文、例句用英文
- 內容完整產出，禁止 placeholder（驗證腳本會擋 TODO / TBD / 待補）

## 內容結構

- `content/curriculum.json`：課程總表，是防重複的唯一依據（文法 `grammar.id`、俚語 `slang[]` 全站不可重複）
- `content/units/unit-XXX.json`：每單元一檔，三位數連號。格式見 `src/types/content.ts`
- `content/daily-sentences.json`：每日一句
- 每 10 單元為一章（module），第 10、20、30… 單元是「整合單元」：文法點對照前面容易混淆的觀念，複習題加倍（約 8 題）

### 單元數量規格

- 對話 2–3 段，每段至少 6 句
- 句型剛好 10 個，中式英文對照至少 3 組
- 文法：whenToUse ≥ 2 點、對照例句 ≥ 4 組（至少一組有 ❌）、小測驗剛好 5 題
- 俚語 3–5 則（預設 4 則），每則剛好 2 個例句，term 必須和 curriculum 完全一致
- 複習題：取自前 1、2、4、8、16、32 個單元（存在的才出），加上 1–2 題本單元，`sourceUnit` 標來源
- 題目 id 全站唯一：`u{三位數}-g{n}`（文法）、`u{三位數}-r{n}`（複習）

## 指令

- `npm run dev`：本機開發
- `npm run validate`：驗證內容（build 前會自動跑，失敗就不能部署）
- `npm run build`
- `/new-units`：補 30 個新單元（見 `.claude/commands/new-units.md`）
