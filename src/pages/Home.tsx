import { useState } from 'react'
import { Link } from 'react-router-dom'
import { curriculum, dailySentences, moduleOf, authoredCount } from '../lib/content'
import { DAYS_PER_UNIT, formatCountdown } from '../lib/schedule'
import { useSchedule } from '../lib/useSchedule'
import { quizAccuracy, useProgress } from '../lib/progress'
import { SpeakButton } from '../components/SpeakButton'
import { BLOCKS } from '../components/blocks'

const WEEKDAY = ['日', '一', '二', '三', '四', '五', '六']

function randomIndex(prev?: number) {
  if (dailySentences.length < 2) return 0
  let i = prev ?? -1
  while (i === prev) i = Math.floor(Math.random() * dailySentences.length)
  return i
}

export function Home() {
  const sch = useSchedule()
  const p = useProgress()
  const [di, setDi] = useState(() => randomIndex())
  const daily = dailySentences[di]
  const today = curriculum.units.find((u) => u.id === sch.todayUnit)
  const mod = moduleOf(sch.todayUnit)
  const acc = quizAccuracy(p)
  const wrongCount = Object.keys(p.wrongBank).length
  const total = curriculum.units.length
  const doneToday = p.completed.includes(sch.todayUnit)

  return (
    <div className="space-y-12">
      <div className="rise flex items-baseline justify-between text-ink-3">
        <p>
          {sch.now.getMonth() + 1} 月 {sch.now.getDate()} 日 · 週{WEEKDAY[sch.now.getDay()]}
        </p>
        <p className="font-display italic">Day {sch.day}</p>
      </div>

      {/* 今天的單元 */}
      {today && (
        <section className="rise" style={{ animationDelay: '60ms' }}>
          <p className="mb-2 text-sm tracking-widest text-ink-3">
            今天的單元 · {mod?.title} · {today.level}
          </p>
          <Link to={`/unit/${today.id}`} className="group block">
            <div className="flex items-end gap-4">
              <span className="font-display text-[5.5rem] leading-[0.8] font-semibold text-ink/15 transition group-hover:text-slang/40">
                {String(today.id).padStart(2, '0')}
              </span>
              <div className="pb-1">
                <h1 className="text-[2rem] leading-tight font-bold">{today.title.zh}</h1>
                <p className="font-display text-lg text-ink-2 italic">{today.title.en}</p>
              </div>
            </div>
          </Link>
          <p className="mt-5 text-ink-2">
            {DAYS_PER_UNIT === 1
              ? '建議順序：情境對話和句型 → 文法小測驗 → 俚語 → 複習題。'
              : sch.dayOfUnit === 1
                ? '第 1 天：先讀情境對話和句型，再做文法小測驗。'
                : '第 2 天：學俚語、做複習題，把單元收尾。'}
            {doneToday && <span className="ml-1 text-ok">（已完成 ✓）</span>}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(['scenario', 'grammar', 'slang', 'review'] as const).map((k, i) => {
              const b = BLOCKS[k]
              const hint = k === 'scenario' ? today.scenario : k === 'grammar' ? today.grammar.title : k === 'slang' ? `${today.slang.length} 則` : '間隔複習'
              const suggested = DAYS_PER_UNIT === 1 || (sch.dayOfUnit === 1 ? i < 2 : i >= 2)
              return (
                <Link
                  key={k}
                  to={`/unit/${today.id}#${k}`}
                  className={`rounded-2xl border-t-4 ${b.border} ${suggested ? b.soft : 'bg-paper-2/60'} p-3 transition hover:-translate-y-0.5`}
                >
                  <p className={`text-xs font-bold tracking-widest ${b.text}`}>{b.label}</p>
                  <p className="mt-1 line-clamp-2 text-[0.9rem] leading-snug text-ink-2">{hint}</p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* 補貨提醒 */}
      {sch.needsRestock && (
        <div className="rise rounded-2xl border border-dashed border-slang p-4 text-[0.95rem]" style={{ animationDelay: '120ms' }}>
          <p className="font-bold text-slang">該補新單元了</p>
          <p className="text-ink-2">
            {sch.outOfContent
              ? `排程已經走到第 ${sch.scheduled} 單元，但內容只寫到第 ${authoredCount} 單元。`
              : `還沒解鎖的單元只剩 ${sch.remainingLocked} 個。`}
            在 Claude Code 輸入 <code className="rounded bg-paper-2 px-1.5 font-mono text-sm">/new-units</code> 補 30 個。
          </p>
        </div>
      )}

      {/* 進度 */}
      <section className="rise grid grid-cols-3 gap-4 border-y border-rule py-6" style={{ animationDelay: '160ms' }}>
        <Stat label="已完成" value={`${p.completed.length}`} unit={`/ ${total}`} />
        <Stat label="測驗答對率" value={acc.rate === null ? '—' : `${acc.rate}`} unit={acc.rate === null ? '' : '%'} />
        <Stat
          label="下一單元"
          value={sch.nextUnlockAt ? formatCountdown(sch.nextUnlockAt.getTime() - sch.now.getTime()) : '—'}
          small
        />
        <div className="col-span-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-paper-2">
            <div className="h-full rounded-full bg-scene transition-all" style={{ width: `${(sch.unlocked / total) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-ink-3">
            已解鎖 {sch.unlocked} / {total} 單元
            {wrongCount > 0 && (
              <>
                {' · '}
                <Link to="/review" className="text-rev underline underline-offset-4">
                  錯題本 {wrongCount} 題
                </Link>
              </>
            )}
          </p>
        </div>
      </section>

      {/* 每日一句 */}
      {daily && (
        <section className="rise relative" style={{ animationDelay: '220ms' }}>
          <p className={`mb-3 text-xs font-bold tracking-[0.2em] ${BLOCKS.daily.text}`}>每日一句</p>
          <blockquote className="relative pl-6">
            <span className="absolute -top-4 -left-1 font-display text-6xl text-daily/30">“</span>
            <p className="en text-[1.6rem] leading-snug text-ink">{daily.en}</p>
            <p className="mt-2 text-ink-2">{daily.zh}</p>
            <p className="mt-3 rounded-xl bg-daily-soft p-3 text-[0.95rem] text-ink-2">{daily.note}</p>
          </blockquote>
          <div className="mt-3 flex items-center gap-2 pl-6">
            <SpeakButton text={daily.en} />
            <button type="button" onClick={() => setDi((i) => randomIndex(i))} className="text-sm text-ink-3 underline underline-offset-4 hover:text-ink">
              換一句
            </button>
          </div>
        </section>
      )}

      {/* 單獨瀏覽 */}
      <section className="rise" style={{ animationDelay: '280ms' }}>
        <p className="mb-3 text-sm tracking-widest text-ink-3">單獨瀏覽已解鎖內容</p>
        <div className="flex flex-wrap gap-2">
          {(['scenario', 'grammar', 'slang'] as const).map((k) => (
            <Link key={k} to={`/browse/${k}`} className={`rounded-full border ${BLOCKS[k].border} px-4 py-1.5 ${BLOCKS[k].text} transition hover:opacity-70`}>
              全部{BLOCKS[k].label}
            </Link>
          ))}
          <Link to="/review" className={`rounded-full border ${BLOCKS.review.border} px-4 py-1.5 ${BLOCKS.review.text}`}>
            錯題本
          </Link>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value, unit, small }: { label: string; value: string; unit?: string; small?: boolean }) {
  return (
    <div>
      <p className="text-xs tracking-widest text-ink-3">{label}</p>
      <p className={`mt-1 font-display ${small ? 'text-lg leading-tight' : 'text-3xl'} text-ink`}>
        {value}
        {unit && <span className="ml-1 text-sm text-ink-3">{unit}</span>}
      </p>
    </div>
  )
}
