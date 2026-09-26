import type { Curriculum, DailySentence, Unit } from '../types/content'
import curriculumJson from '../../content/curriculum.json'
import dailyJson from '../../content/daily-sentences.json'

export const curriculum = curriculumJson as Curriculum
export const dailySentences = dailyJson as DailySentence[]

// 單元檔懶載入：每個 unit-XXX.json 各自打包成一個 chunk
const unitLoaders = import.meta.glob<{ default: Unit }>('../../content/units/unit-*.json')

const loaderById = new Map<number, () => Promise<{ default: Unit }>>()
for (const [path, loader] of Object.entries(unitLoaders)) {
  const m = path.match(/unit-(\d+)\.json$/)
  if (m) loaderById.set(Number(m[1]), loader)
}

/** 已經寫好內容檔的單元數（curriculum 可能排得比實際內容多） */
export const authoredUnitIds = [...loaderById.keys()].sort((a, b) => a - b)
export const authoredCount = authoredUnitIds.length

const cache = new Map<number, Unit>()

export async function loadUnit(id: number): Promise<Unit | null> {
  if (cache.has(id)) return cache.get(id)!
  const loader = loaderById.get(id)
  if (!loader) return null
  const unit = (await loader()).default
  cache.set(id, unit)
  return unit
}

export async function loadUnits(ids: number[]): Promise<Unit[]> {
  const units = await Promise.all(ids.map(loadUnit))
  return units.filter((u): u is Unit => u !== null)
}

export function moduleOf(id: number) {
  const entry = curriculum.units.find((u) => u.id === id)
  return curriculum.modules.find((m) => m.id === entry?.module)
}
