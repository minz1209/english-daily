import type { QuizItem } from '../types/content'

// 填空題比對：忽略大小寫、前後空白、結尾標點與彎引號；answer 可用 | 列多個可接受答案
function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.!?,]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function checkAnswer(item: QuizItem, response: number | string): boolean {
  if (item.type === 'mcq') return Number(response) === Number(item.answer)
  const accepted = String(item.answer).split('|').map(normalize)
  return accepted.includes(normalize(String(response)))
}

export function displayAnswer(item: QuizItem) {
  if (item.type === 'mcq' && item.options) return item.options[Number(item.answer)]
  return String(item.answer).split('|')[0]
}

/** 穩定洗牌：同一天同一組題目順序固定，避免重新整理就換題 */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    const j = Math.abs(h) % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
