import { useState } from 'react'
import { applyTheme, getTheme, resetAll, setStartDate, useProgress, type Theme } from '../lib/progress'
import { useSchedule } from '../lib/useSchedule'
import { speechSupported, speak } from '../lib/speech'

export function Settings() {
  const p = useProgress()
  const sch = useSchedule()
  const [theme, setTheme] = useState<Theme>(getTheme())

  return (
    <div className="space-y-12">
      <h1 className="font-display text-4xl font-semibold">設定</h1>

      <section>
        <h2 className="mb-2 font-bold">開始日期</h2>
        <p className="mb-3 text-[0.95rem] text-ink-2">從這天起每 2 天解鎖一個單元。往前調可以一次解鎖多個，往後調就會重新上鎖。</p>
        <input
          type="date"
          value={p.startDate}
          onChange={(e) => e.target.value && setStartDate(e.target.value)}
          className="rounded-xl border border-rule bg-transparent px-4 py-2"
        />
        <p className="mt-2 text-sm text-ink-3">目前已解鎖 {sch.unlocked} 個單元</p>
      </section>

      <section>
        <h2 className="mb-3 font-bold">外觀</h2>
        <div className="flex gap-2">
          {(
            [
              ['system', '跟隨系統'],
              ['light', '淺色'],
              ['dark', '深色'],
            ] as const
          ).map(([t, label]) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTheme(t)
                applyTheme(t)
              }}
              className={`rounded-full border px-4 py-1.5 ${theme === t ? 'border-ink bg-ink text-paper' : 'border-rule text-ink-2'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-bold">發音</h2>
        {speechSupported ? (
          <button type="button" onClick={() => speak("Hey, how's it going? Long time no see!")} className="rounded-full border border-rule px-4 py-1.5 text-ink-2">
            試聽一句
          </button>
        ) : (
          <p className="text-ink-2">這個瀏覽器不支援內建發音。</p>
        )}
        <p className="mt-2 text-sm text-ink-3">用的是瀏覽器或系統內建的英文語音，iPhone 可在「設定 › 輔助使用 › 朗讀內容 › 聲音」下載更自然的語音。</p>
      </section>

      <section>
        <h2 className="mb-2 font-bold text-bad">重設所有進度</h2>
        <p className="mb-3 text-[0.95rem] text-ink-2">會清掉完成紀錄、測驗紀錄、錯題本和收藏，無法復原。</p>
        <button
          type="button"
          onClick={() => {
            if (confirm('確定要清除所有學習進度嗎？')) resetAll()
          }}
          className="rounded-full border border-bad px-4 py-1.5 text-bad"
        >
          重設
        </button>
      </section>
    </div>
  )
}
