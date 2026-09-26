import { useState } from 'react'
import type { Unit } from '../types/content'
import { SpeakButton } from './SpeakButton'
import { FavButton } from './FavButton'
import { SectionHeader } from './SectionHeader'

export function ScenarioBlock({ unit }: { unit: Unit }) {
  const s = unit.scenario
  const [showZh, setShowZh] = useState(true)
  return (
    <section id="scenario" className="scroll-mt-24">
      <SectionHeader block="scenario" title={s.title} sub={s.context} />

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowZh((v) => !v)}
          className="rounded-full border border-rule px-3 py-1 text-sm text-ink-2 transition hover:border-ink-3"
        >
          {showZh ? '隱藏中文' : '顯示中文'}
        </button>
      </div>

      <div className="space-y-10">
        {s.dialogues.map((d, di) => (
          <article key={di}>
            <h3 className="mb-4 font-display text-lg text-scene italic">
              {di + 1}. {d.title}
            </h3>
            <ol className="space-y-4">
              {d.lines.map((l, li) => (
                <li key={li} className="grid grid-cols-[4.5rem_1fr] gap-x-3 sm:grid-cols-[6rem_1fr]">
                  <span className="pt-1 text-right font-display text-sm text-ink-3">{l.speaker}</span>
                  <div className="border-l border-rule pl-3">
                    <div className="flex items-start gap-1">
                      <p className="en flex-1 text-ink">{l.en}</p>
                      <SpeakButton text={l.en} className="-mt-0.5" />
                    </div>
                    {showZh && <p className="text-[0.92rem] text-ink-3">{l.zh}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>

      <h3 className="mt-12 mb-4 text-sm font-bold tracking-widest text-scene">10 個實用句型</h3>
      <ol className="divide-y divide-rule border-y border-rule">
        {s.patterns.map((p, i) => (
          <li key={i} className="flex items-start gap-3 py-3">
            <span className="w-6 pt-1 font-display text-sm text-ink-3">{i + 1}</span>
            <div className="flex-1">
              <p className="en text-ink">{p.en}</p>
              <p className="text-[0.92rem] text-ink-2">{p.zh}</p>
              {p.note && <p className="mt-1 text-sm text-scene">↳ {p.note}</p>}
            </div>
            <div className="flex">
              <SpeakButton text={p.en} />
              <FavButton fav={{ key: `pattern:u${unit.id}-${i}`, kind: 'pattern', front: p.en, back: p.zh, note: p.note, unitId: unit.id }} />
            </div>
          </li>
        ))}
      </ol>

      <h3 className="mt-12 mb-4 text-sm font-bold tracking-widest text-scene">中式英文，對照一下</h3>
      <div className="space-y-4">
        {s.chinglish.map((c, i) => (
          <div key={i} className="rounded-2xl bg-scene-soft p-4">
            <p className="en text-bad line-through decoration-1">✕ {c.wrong}</p>
            <div className="flex items-start gap-1">
              <p className="en flex-1 font-medium text-ok">✓ {c.right}</p>
              <SpeakButton text={c.right} />
            </div>
            <p className="mt-1 text-[0.95rem] text-ink-2">{c.why}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
