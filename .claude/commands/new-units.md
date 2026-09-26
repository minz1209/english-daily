---
description: 補 30 個新的英文學習單元（延續難度曲線、避免重複、驗證後 commit + push）
---

請幫我補 30 個新單元。完整遵守專案 CLAUDE.md 的「內容作者角色」與「單元數量規格」。

## 1. 盤點現況

- 讀 `content/curriculum.json`，列出目前有幾個單元、最後一章是哪一章、用過的所有 `grammar.id` 和俚語
- 確認 `content/units/` 的檔案數和 curriculum 一致；不一致就先停下來告訴我
- 讀最後 2 個單元的 JSON，對齊語氣、長度和難度

## 2. 規劃（先給我看再寫）

新單元編號從「目前最大編號 + 1」開始，共 30 個，也就是 3 章，每章 10 單元，第 10 個是整合單元。

難度曲線：
- 目前在 B2 的話，維持 B2，往「更細的語感」走：語域、語氣強弱、搭配詞、說話策略、容易混淆的近義詞（例如 affect/effect、lie/lay、since/because/as）
- 不要跳到 C1 的文學性、學術性內容

防重複（逐條比對 curriculum.json）：
- `grammar.id` 不可和既有重複；語意相近的也不行（例如已有 present-perfect-intro 就不要再出 present-perfect-basics）。可以做「進階篇」，但切角要不同，id 要能看出差異
- 俚語不可重複（大小寫、標點不同也算重複）
- 情境可以回到類似場域（職場、旅行），但要換具體場景

把 30 單元的「情境 / 文法點 / 俚語」表格給我確認，我說 OK 再往下做。

## 3. 產生內容

- 先更新 `content/curriculum.json`（新增 modules 和 units）
- 每 10 個單元一批：寫完就跑 `npm run validate`，有錯自己修到過，再進下一批
- 複習題照擴展間隔抽前面單元（n-1、n-2、n-4、n-8、n-16、n-32），這樣舊單元的內容會一直被複習到
- 每日一句順便補 30 句新的到 `content/daily-sentences.json`，不可和既有重複

## 4. 收尾

- `npm run validate` 和 `npm run build` 都要通過
- `git add -A && git commit -m "content: add units X–Y"`（commit message 寫實際範圍）
- `git push`，讓 Vercel 自動部署
- 回報：新增範圍、各章主題、驗證結果、推送結果。push 失敗的話直接貼錯誤訊息
