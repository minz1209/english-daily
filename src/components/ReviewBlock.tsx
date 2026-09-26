import { useMemo, useState } from 'react'
import type { Unit } from '../types/content'
import { getProgress } from '../lib/progress'
import { seededShuffle } from '../lib/quiz'
import { todayISO } from '../lib/schedule'
import { SectionHeader } from './SectionHeader'
import { QuizCard } from './QuizCard'

const MAX_FROM_WRONG_BANK = 4

export function ReviewBlock({ unit }: { unit: Unit }) {
  // 進頁面時抓一次錯題快照；作答後錯題本會變動，但這一輪的題目不跟著跳
  const [wrongPicks] = useState(() => {
    const fixedIds = new Set(unit.review.map((r) => r.id))
    const pool = Object.values(getProgress().wrongBank).filter((w) => w.sourceUnit <= unit.id && !fixedIds.has(w.id))
    return seededShuffle(pool, `${unit.id}-${todayISO()}`).slice(0, MAX_FROM_WRONG_BANK)
  })
  const [score, setScore] = useState({ answered: 0, correct: 0 })

  const items = useMemo(
    () => [
      ...unit.review.map((r) => ({ item: r, source: r.sourceUnit, tag: r.sourceUnit === unit.id ? '本單元' : `第 ${r.sourceUnit} 單元` })),
      ...wrongPicks.map((w) => ({ item: w, source: w.sourceUnit, tag: `錯題 · 第 ${w.sourceUnit} 單元` })),
    ],
    [unit, wrongPicks],
  )

  return (
    <section id="review" className="scroll-mt-24">
      <SectionHeader
        block="review"
        title="複習題"
        sub={`間隔複習前面單元的重點${wrongPicks.length ? `，另外加上 ${wrongPicks.length} 題你之前答錯的` : ''}。`}
      />
      <div className="space-y-4">
        {items.map(({ item, source, tag }, i) => (
          <QuizCard
            key={item.id}
            item={item}
            sourceUnit={source}
            index={i}
            tag={tag}
            onAnswered={(ok) => setScore((s) => ({ answered: s.answered + 1, correct: s.correct + (ok ? 1 : 0) }))}
          />
        ))}
      </div>
      {score.answered > 0 && (
        <p className="mt-6 text-center text-ink-2">
          這一輪 <span className="font-display text-2xl text-rev">{score.correct}</span> / {items.length}
        </p>
      )}
    </section>
  )
}
