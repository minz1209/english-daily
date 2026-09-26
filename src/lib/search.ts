// 全站搜尋：第一次搜尋時才載入已解鎖單元建索引（中英文都能搜）
import type { Unit } from '../types/content'
import { loadUnits } from './content'

export type HitKind = 'scenario' | 'pattern' | 'dialogue' | 'grammar' | 'slang' | 'chinglish'

export interface SearchDoc {
  kind: HitKind
  unitId: number
  unitTitle: string
  title: string
  body: string
  anchor: string
  haystack: string
}

function docsFor(u: Unit): SearchDoc[] {
  const base = { unitId: u.id, unitTitle: u.title.zh }
  const docs: SearchDoc[] = [
    { ...base, kind: 'scenario', title: u.scenario.title, body: u.scenario.context, anchor: 'scenario', haystack: '' },
    {
      ...base,
      kind: 'grammar',
      title: u.grammar.title,
      body: u.grammar.oneLiner,
      anchor: 'grammar',
      haystack: [u.grammar.whyWeGetItWrong, ...u.grammar.examples.map((e) => `${e.correct} ${e.incorrect ?? ''} ${e.note}`)].join(' '),
    },
  ]
  u.scenario.patterns.forEach((p) => docs.push({ ...base, kind: 'pattern', title: p.en, body: p.zh, anchor: 'scenario', haystack: p.note ?? '' }))
  u.scenario.dialogues.forEach((d) =>
    d.lines.forEach((l) => docs.push({ ...base, kind: 'dialogue', title: l.en, body: l.zh, anchor: 'scenario', haystack: d.title })),
  )
  u.scenario.chinglish.forEach((c) =>
    docs.push({ ...base, kind: 'chinglish', title: `✕ ${c.wrong} → ✓ ${c.right}`, body: c.why, anchor: 'scenario', haystack: '' }),
  )
  u.slang.forEach((s) =>
    docs.push({
      ...base,
      kind: 'slang',
      title: s.term,
      body: s.meaning,
      anchor: `slang-${s.id}`,
      haystack: [s.usage, ...s.examples.map((e) => `${e.en} ${e.zh}`)].join(' '),
    }),
  )
  return docs.map((d) => ({ ...d, haystack: `${d.title} ${d.body} ${d.haystack}`.toLowerCase() }))
}

let index: SearchDoc[] | null = null
let indexedUpTo = 0

export async function ensureIndex(unlockedIds: number[]) {
  const max = Math.max(0, ...unlockedIds)
  if (index && indexedUpTo === max) return index
  const units = await loadUnits(unlockedIds)
  index = units.flatMap(docsFor)
  indexedUpTo = max
  return index
}

const KIND_WEIGHT: Record<HitKind, number> = { slang: 0, grammar: 1, pattern: 2, scenario: 3, chinglish: 4, dialogue: 5 }

export function search(docs: SearchDoc[], q: string, limit = 60) {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return docs
    .filter((d) => terms.every((t) => d.haystack.includes(t)))
    .sort((a, b) => {
      // 標題命中優先，其次按類型
      const at = a.title.toLowerCase().includes(terms[0]) ? 0 : 1
      const bt = b.title.toLowerCase().includes(terms[0]) ? 0 : 1
      return at - bt || KIND_WEIGHT[a.kind] - KIND_WEIGHT[b.kind] || a.unitId - b.unitId
    })
    .slice(0, limit)
}
