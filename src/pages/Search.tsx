import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ensureIndex, search, type SearchDoc, type HitKind } from '../lib/search'
import { useSchedule } from '../lib/useSchedule'

const KIND_LABEL: Record<HitKind, { label: string; cls: string }> = {
  slang: { label: '俚語', cls: 'text-slang' },
  grammar: { label: '文法', cls: 'text-gram' },
  pattern: { label: '句型', cls: 'text-scene' },
  scenario: { label: '情境', cls: 'text-scene' },
  dialogue: { label: '對話', cls: 'text-scene' },
  chinglish: { label: '中式英文', cls: 'text-scene' },
}

export function Search() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [docs, setDocs] = useState<SearchDoc[] | null>(null)
  const sch = useSchedule()

  useEffect(() => {
    ensureIndex(Array.from({ length: sch.unlocked }, (_, i) => i + 1)).then(setDocs)
  }, [sch.unlocked])

  const hits = useMemo(() => (docs ? search(docs, q) : []), [docs, q])

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold">搜尋</h1>
      <input
        autoFocus
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })
        }}
        placeholder="英文或中文都可以，例如 ghost、客氣、現在完成式"
        className="mt-6 w-full border-b-2 border-ink bg-transparent py-3 text-xl outline-none placeholder:text-ink-3"
      />
      <p className="mt-2 text-sm text-ink-3">搜尋範圍：已解鎖的 {sch.unlocked} 個單元</p>

      <ul className="mt-6 divide-y divide-rule">
        {hits.map((h, i) => (
          <li key={i}>
            <Link to={`/unit/${h.unitId}#${h.anchor}`} className="block py-3 transition hover:bg-paper-2/50">
              <p className="text-xs text-ink-3">
                <span className={`mr-2 font-bold ${KIND_LABEL[h.kind].cls}`}>{KIND_LABEL[h.kind].label}</span>第 {h.unitId} 單元 · {h.unitTitle}
              </p>
              <p className="en mt-0.5">{h.title}</p>
              <p className="line-clamp-2 text-[0.95rem] text-ink-2">{h.body}</p>
            </Link>
          </li>
        ))}
      </ul>
      {q && docs && !hits.length && <p className="py-10 text-center text-ink-3">找不到「{q}」</p>}
    </div>
  )
}
