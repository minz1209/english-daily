import type { Unit } from '../types/content'
import { SpeakButton } from './SpeakButton'
import { SectionHeader } from './SectionHeader'
import { QuizCard } from './QuizCard'

export function GrammarBlock({ unit }: { unit: Unit }) {
  const g = unit.grammar
  return (
    <section id="grammar" className="scroll-mt-24">
      <SectionHeader block="grammar" title={g.title} />

      <p className="mb-8 border-l-4 border-gram pl-4 font-display text-xl leading-snug text-ink">{g.oneLiner}</p>

      <h3 className="mb-3 text-sm font-bold tracking-widest text-gram">什麼時候用</h3>
      <ul className="mb-8 space-y-2">
        {g.whenToUse.map((w, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gram" />
            <span>{w}</span>
          </li>
        ))}
      </ul>

      <div className="mb-8 rounded-2xl bg-gram-soft p-5">
        <h3 className="mb-2 text-sm font-bold tracking-widest text-gram">為什麼台灣人常錯</h3>
        <p className="text-ink-2">{g.whyWeGetItWrong}</p>
      </div>

      <h3 className="mb-3 text-sm font-bold tracking-widest text-gram">對照例句</h3>
      <div className="mb-10 space-y-5">
        {g.examples.map((e, i) => (
          <div key={i} className="border-b border-rule pb-4">
            <div className="flex items-start gap-1">
              <p className="en flex-1 text-ink">
                <span className="mr-2 text-ok">✅</span>
                {e.correct}
              </p>
              <SpeakButton text={e.correct} />
            </div>
            {e.incorrect && (
              <p className="en text-ink-3 line-through decoration-1">
                <span className="mr-2 no-underline">❌</span>
                {e.incorrect}
              </p>
            )}
            <p className="mt-1 text-[0.95rem] text-ink-2">{e.note}</p>
          </div>
        ))}
      </div>

      <h3 className="mb-4 text-sm font-bold tracking-widest text-gram">小測驗</h3>
      <div className="space-y-4">
        {g.quiz.map((q, i) => (
          <QuizCard key={q.id} item={q} sourceUnit={unit.id} index={i} />
        ))}
      </div>
    </section>
  )
}
