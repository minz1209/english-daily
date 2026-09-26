import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { gradeCard, toggleFavorite, useProgress } from '../lib/progress'
import { todayISO } from '../lib/schedule'
import { SpeakButton } from '../components/SpeakButton'

export function Flashcards() {
  const p = useProgress()
  const [mode, setMode] = useState<'due' | 'all' | 'list'>('due')
  const [flipped, setFlipped] = useState(false)
  const [sessionDone, setSessionDone] = useState<string[]>([])

  const today = todayISO()
  const queue = useMemo(() => {
    const base = mode === 'due' ? p.favorites.filter((f) => (p.cards[f.key]?.due ?? today) <= today) : p.favorites
    return base.filter((f) => !sessionDone.includes(f.key))
  }, [p.favorites, p.cards, mode, sessionDone, today])
  const card = queue[0]

  function grade(knew: boolean) {
    if (!card) return
    gradeCard(card.key, knew)
    setSessionDone((d) => [...d, card.key])
    setFlipped(false)
  }

  if (!p.favorites.length) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-4xl font-semibold">單字卡</h1>
        <p className="mt-4 text-ink-2">還沒有收藏。在單元裡按句型或俚語旁的書籤圖示，就會出現在這裡。</p>
        <Link to="/" className="mt-6 inline-block text-ink-3 underline underline-offset-4">
          回今天的單元
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold">單字卡</h1>
      <div className="mt-4 mb-8 flex gap-2 text-sm">
        {(
          [
            ['due', '今天該複習'],
            ['all', '全部練一輪'],
            ['list', '收藏清單'],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m)
              setSessionDone([])
              setFlipped(false)
            }}
            className={`rounded-full border px-4 py-1 ${mode === m ? 'border-ink bg-ink text-paper' : 'border-rule text-ink-2'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'list' ? (
        <ul className="divide-y divide-rule border-y border-rule">
          {p.favorites.map((f) => (
            <li key={f.key} className="flex items-start gap-2 py-3">
              <div className="flex-1">
                <p className="en">{f.front}</p>
                <p className="text-sm text-ink-2">{f.back}</p>
                <p className="text-xs text-ink-3">
                  第 {f.unitId} 單元 · 盒子 {p.cards[f.key]?.box ?? 1}/5
                </p>
              </div>
              <SpeakButton text={f.front} />
              <button type="button" onClick={() => toggleFavorite(f)} className="px-2 text-sm text-ink-3 hover:text-bad">
                移除
              </button>
            </li>
          ))}
        </ul>
      ) : card ? (
        <div>
          <p className="mb-3 text-sm text-ink-3">剩 {queue.length} 張</p>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="relative flex min-h-[18rem] w-full flex-col items-center justify-center rounded-3xl border border-rule bg-paper p-8 text-center shadow-[0_6px_0_var(--paper-2),0_7px_0_var(--rule)] transition active:translate-y-0.5"
          >
            <span className={`absolute top-4 left-5 text-xs tracking-widest ${card.kind === 'slang' ? 'text-slang' : 'text-scene'}`}>
              {card.kind === 'slang' ? '俚語' : '句型'}
            </span>
            <p className={`en ${card.front.length > 40 ? 'text-2xl' : 'text-3xl'} leading-snug`}>{card.front}</p>
            {flipped ? (
              <div className="rise mt-6">
                <p className="text-xl">{card.back}</p>
                {card.note && <p className="mt-2 text-[0.95rem] text-ink-3">{card.note}</p>}
              </div>
            ) : (
              <p className="mt-6 text-sm text-ink-3">點一下翻面</p>
            )}
          </button>
          <div className="mt-4 flex justify-center">
            <SpeakButton text={card.front} />
          </div>
          {flipped && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => grade(false)} className="rounded-2xl border border-bad py-3 text-bad">
                還不熟
              </button>
              <button type="button" onClick={() => grade(true)} className="rounded-2xl bg-ok py-3 text-paper">
                記得
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="font-display text-3xl">今天的卡片清空了</p>
          <p className="mt-2 text-ink-2">記得的卡片會隔 1、2、4、8、16 天再出現。</p>
        </div>
      )}
    </div>
  )
}
