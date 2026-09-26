# Daily Margin 每日英文

個人用英文學習網站：每天解鎖一個單元（`src/lib/schedule.ts` 的 `DAYS_PER_UNIT` 可調），每單元包含生活情境、文法、俚語、複習題。

## 開發

```bash
npm install
npm run dev
```

## 內容

全部放在 `content/`（JSON）。格式定義在 `src/types/content.ts`，規格寫在 `CLAUDE.md`。
`npm run validate` 會檢查格式與重複，`npm run build` 前會自動執行。

補新單元：在這個資料夾開 Claude Code，輸入 `/new-units`。

## 部署到 Vercel（第一次）

1. 在 GitHub 建一個空 repo（例如 `english-daily`，不要勾 README）
2. 在這個資料夾執行 `git remote add origin <repo 網址>`，接著 `git push -u origin main`
3. 到 vercel.com → Add New Project → 選這個 repo → Framework 自動偵測為 Vite → Deploy

之後每次 push 都會自動部署。

## 學習進度

存在瀏覽器的 localStorage，換裝置或清除瀏覽資料會重來。開始日期可以在「設定」改。
