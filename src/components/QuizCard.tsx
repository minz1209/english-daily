import { useState } from 'react'
import type { QuizItem } from '../types/content'
import { checkAnswer, displayAnswer } from '../lib/quiz'
import { recordAnswer } from '../lib/progress'
import { SpeakButton } from './SpeakButton'

interface Props {
  item: QuizItem
  sourceUnit: number
  index: number
  /** 題目右上角的小標，例如「複習 · 第 3 單元」 */
  tag?: string
  onAnswered?: (correct: boolean) => void
}

export function QuizCard({ item, sourceUnit, index, tag, onAnswered }: Props) {
  const [picked, setPicked] = useState<number | null>(null)
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const done = result !== null

  function submit(response: number | string) {
    if (done) return
    const ok = checkAnswer(item, response)
    setResult(ok)
    recordAnswer(item, sourceUnit, ok)
    onAnswered?.(ok)
  }

  function retry() {
    setPicked(null)
    setTyped('')
    setResult(null)
  }

  return (
    <div className="rounded-2xl border border-rule bg-paper p-5 shadow-[0_1px_0_var(--rule)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="en text-ink leading-relaxed">
          <span className="mr-2 font-display text-sm text-ink-3">{String(index + 1).padStart(2, '0')}</span>
          {item.question}
        </p>
        {tag && <span className="shrink-0 rounded-full bg-paper-2 px-2 py-0.5 text-xs text-ink-3">{tag}</span>}
      </div>

      {item.type === 'mcq' && item.options ? (
        <div className="grid gap-2">
          {item.options.map((opt, i) => {
            const isAnswer = i === Number(item.answer)
            const isPicked = picked === i
            let cls = 'border-rule hover:border-ink-3'
            if (done && isAnswer) cls = 'border-ok bg-[color-mix(in_srgb,var(--ok)_10%,transparent)]'
            else if (done && isPicked) cls = 'border-bad bg-[color-mix(in_srgb,var(--bad)_10%,transparent)]'
            return (
              <button
                key={i}
                type="button"
                disabled={done}
                onClick={() => {
                  setPicked(i)
                  submit(i)
                }}
                className={`en rounded-xl border px-4 py-2.5 text-left transition ${cls} ${done ? 'cursor-default' : 'active:scale-[0.99]'}`}
              >
                <span className="mr-2 text-ink-3">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            )
          })}
        </div>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (typed.trim()) submit(typed)
          }}
        >
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={done}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="輸入答案"
            className={`en min-w-0 flex-1 rounded-xl border bg-transparent px-4 py-2.5 outline-none focus:border-ink ${
              done ? (result ? 'border-ok' : 'border-bad') : 'border-rule'
            }`}
          />
          {!done && (
            <button type="submit" className="rounded-xl bg-ink px-4 text-paper transition active:scale-95">
              送出
            </button>
          )}
        </form>
      )}

      {done && (
        <div className="rise mt-4 border-l-2 pl-4 text-[0.95rem]" style={{ borderColor: result ? 'var(--ok)' : 'var(--bad)' }}>
          <p className={`font-bold ${result ? 'text-ok' : 'text-bad'}`}>
            {result ? '答對了' : '再想想——這題會出現在之後的複習'}
          </p>
          {!result && (
            <p className="mt-1 flex items-center gap-1">
              <span className="text-ink-3">正確答案：</span>
              <span className="en font-medium">{displayAnswer(item)}</span>
            </p>
          )}
          <p className="mt-1 text-ink-2">{item.explanation}</p>
          <div className="mt-2 flex items-center gap-3">
            <button type="button" onClick={retry} className="text-sm text-ink-3 underline underline-offset-4 hover:text-ink">
              再做一次
            </button>
            {item.type === 'fill' && <SpeakButton text={item.question.replace(/_{2,}/g, displayAnswer(item))} />}
          </div>
        </div>
      )}
    </div>
  )
}
