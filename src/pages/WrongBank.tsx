import { useState } from 'react'
import { useProgress, getProgress, quizAccuracy } from '../lib/progress'
import { QuizCard } from '../components/QuizCard'
import { SectionHeader } from '../components/SectionHeader'

export function WrongBank() {
  const p = useProgress()
  // 進頁面時固定這一輪題目；答對兩次會從錯題本移除，但不會立刻從畫面消失
  const [items] = useState(() => Object.values(getProgress().wrongBank).sort((a, b) => a.sourceUnit - b.sourceUnit))
  const acc = quizAccuracy(p)
  const remaining = Object.keys(p.wrongBank).length

  return (
    <div>
      <SectionHeader block="review" title="錯題本" sub="答錯的題目都在這裡，也會自動混進之後單元的複習題。連續答對 2 次就會畢業。" />
      <p className="mb-8 text-ink-2">
        總答對率 <span className="font-display text-2xl text-rev">{acc.rate ?? '—'}{acc.rate !== null && '%'}</span>
        <span className="ml-2 text-sm text-ink-3">（{acc.total} 次作答，錯題本剩 {remaining} 題）</span>
      </p>
      {items.length ? (
        <div className="space-y-4">
          {items.map((w, i) => (
            <QuizCard key={w.id} item={w} sourceUnit={w.sourceUnit} index={i} tag={`第 ${w.sourceUnit} 單元`} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-ink-3">目前沒有錯題。</p>
      )}
    </div>
  )
}
