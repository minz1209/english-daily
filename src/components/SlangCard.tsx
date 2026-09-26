import type { Slang } from '../types/content'
import { SpeakButton } from './SpeakButton'
import { FavButton } from './FavButton'

const REGISTER: Record<Slang['register'], string> = {
  neutral: '中性，哪裡都能用',
  casual: '口語，朋友同事間',
  'very-casual': '很隨興，熟人才用',
}
const RISK: Record<Slang['risk']['level'], { label: string; cls: string }> = {
  safe: { label: '安全', cls: 'text-ok border-ok' },
  careful: { label: '看場合', cls: 'text-rev border-rev' },
  'avoid-at-work': { label: '職場避免', cls: 'text-bad border-bad' },
}
const VARIETY: Record<Slang['variety'], string> = { US: '美式', UK: '英式', both: '美英通用' }

export function SlangCard({ slang, unitId }: { slang: Slang; unitId: number }) {
  const risk = RISK[slang.risk.level]
  return (
    <article id={`slang-${slang.id}`} className="scroll-mt-24 rounded-2xl border border-rule bg-paper p-5">
      <div className="flex items-start gap-2">
        <h3 className="en flex-1 font-display text-2xl leading-tight font-semibold text-slang">{slang.term}</h3>
        <SpeakButton text={slang.term} />
        <FavButton fav={{ key: `slang:${slang.id}`, kind: 'slang', front: slang.term, back: slang.meaning, note: slang.usage, unitId }} />
      </div>
      <p className="mt-1 text-lg text-ink">{slang.meaning}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-slang-soft px-2.5 py-1 text-ink-2">{REGISTER[slang.register]}</span>
        <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-2">{VARIETY[slang.variety]}</span>
        <span className={`rounded-full border px-2.5 py-0.5 ${risk.cls}`}>{risk.label}</span>
        {slang.dated && <span className="rounded-full border border-ink-3 px-2.5 py-0.5 text-ink-3">有點過時</span>}
      </div>

      <p className="mt-4 text-[0.95rem] text-ink-2">
        <span className="font-bold text-ink">使用情境　</span>
        {slang.usage}
      </p>
      <p className="mt-1 text-[0.95rem] text-ink-2">
        <span className="font-bold text-ink">注意　</span>
        {slang.risk.note}
      </p>

      <ul className="mt-4 space-y-3 border-t border-dashed border-rule pt-4">
        {slang.examples.map((ex, i) => (
          <li key={i} className="flex items-start gap-1">
            <div className="flex-1">
              <p className="en text-ink">{ex.en}</p>
              <p className="text-[0.92rem] text-ink-3">{ex.zh}</p>
            </div>
            <SpeakButton text={ex.en} />
          </li>
        ))}
      </ul>
    </article>
  )
}
