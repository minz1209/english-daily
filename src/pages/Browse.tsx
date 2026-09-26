import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Unit } from '../types/content'
import { loadUnits } from '../lib/content'
import { useSchedule } from '../lib/useSchedule'
import { BLOCKS } from '../components/blocks'
import { SlangCard } from '../components/SlangCard'

type Kind = 'scenario' | 'grammar' | 'slang'

export function Browse() {
  const { block } = useParams()
  const kind: Kind = block === 'grammar' || block === 'slang' ? block : 'scenario'
  const sch = useSchedule()
  const [units, setUnits] = useState<Unit[] | null>(null)

  useEffect(() => {
    loadUnits(Array.from({ length: sch.unlocked }, (_, i) => i + 1)).then(setUnits)
  }, [sch.unlocked])

  const b = BLOCKS[kind]
  return (
    <div>
      <p className={`text-xs font-bold tracking-[0.2em] ${b.text}`}>單獨瀏覽</p>
      <h1 className="mt-1 font-display text-4xl font-semibold">全部{b.label}</h1>
      <div className="mt-4 mb-8 flex gap-2">
        {(['scenario', 'grammar', 'slang'] as const).map((k) => (
          <Link
            key={k}
            to={`/browse/${k}`}
            className={`rounded-full border px-4 py-1 text-sm ${BLOCKS[k].border} ${k === kind ? `${BLOCKS[k].bg} text-paper` : BLOCKS[k].text}`}
          >
            {BLOCKS[k].label}
          </Link>
        ))}
      </div>

      {!units ? (
        <p className="text-ink-3">載入中…</p>
      ) : kind === 'slang' ? (
        <div className="space-y-5">
          {units.flatMap((u) =>
            u.slang.map((s) => (
              <div key={s.id}>
                <Link to={`/unit/${u.id}#slang-${s.id}`} className="mb-1 block text-xs text-ink-3">
                  第 {u.id} 單元 · {u.title.zh}
                </Link>
                <SlangCard slang={s} unitId={u.id} />
              </div>
            )),
          )}
        </div>
      ) : (
        <ol className="divide-y divide-rule border-y border-rule">
          {units.map((u) => (
            <li key={u.id}>
              <Link to={`/unit/${u.id}/${kind}`} className="flex gap-4 py-4 transition hover:bg-paper-2/50">
                <span className="w-8 font-display text-lg text-ink-3">{String(u.id).padStart(2, '0')}</span>
                <div className="flex-1">
                  <p className="font-bold">{kind === 'scenario' ? u.scenario.title : u.grammar.title}</p>
                  <p className="text-[0.95rem] text-ink-2">{kind === 'scenario' ? u.scenario.context : u.grammar.oneLiner}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
