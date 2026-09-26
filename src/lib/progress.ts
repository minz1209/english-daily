// 學習進度：全部存在 localStorage。讀寫都包 try/catch，無痕模式下網站仍可正常運作（只是不會記住）
import { useSyncExternalStore } from 'react'
import type { QuizItem } from '../types/content'
import { todayISO } from './schedule'

const KEY = 'ed:progress:v1'

export interface QuizStat {
  correct: number
  wrong: number
  lastResult: 'correct' | 'wrong'
  lastAt: string
}

/** 答錯的題目存一份快照，複習時不必再載入原單元 */
export interface WrongItem extends QuizItem {
  sourceUnit: number
  /** 答錯後在複習中連續答對的次數，達 2 次就移出錯題本 */
  streak: number
}

export interface Favorite {
  key: string // 例：slang:whats-up、pattern:u001-3
  kind: 'slang' | 'pattern'
  front: string // 英文
  back: string // 中文意思
  note?: string
  unitId: number
  addedAt: string
}

/** Flashcard 用簡化版 Leitner：box 1–5，box 越高隔越久才出現 */
export interface CardState {
  box: number
  due: string
}

export interface Progress {
  startDate: string
  completed: number[]
  quiz: Record<string, QuizStat>
  wrongBank: Record<string, WrongItem>
  favorites: Favorite[]
  cards: Record<string, CardState>
}

function fresh(): Progress {
  return { startDate: todayISO(), completed: [], quiz: {}, wrongBank: {}, favorites: [], cards: {} }
}

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...fresh(), ...JSON.parse(raw) }
  } catch {
    /* 讀不到就用預設值 */
  }
  const p = fresh()
  write(p)
  return p
}

function write(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* 無痕模式或空間滿：只存在記憶體 */
  }
}

let state: Progress = read()
const listeners = new Set<() => void>()

function set(updater: (p: Progress) => Progress) {
  state = updater(state)
  write(state)
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state)
}

export function getProgress() {
  return state
}

// ---------- 動作 ----------

export function setStartDate(iso: string) {
  set((p) => ({ ...p, startDate: iso }))
}

export function toggleCompleted(unitId: number) {
  set((p) => ({
    ...p,
    completed: p.completed.includes(unitId)
      ? p.completed.filter((id) => id !== unitId)
      : [...p.completed, unitId].sort((a, b) => a - b),
  }))
}

export function recordAnswer(item: QuizItem, sourceUnit: number, isCorrect: boolean) {
  set((p) => {
    const prev = p.quiz[item.id]
    const stat: QuizStat = {
      correct: (prev?.correct ?? 0) + (isCorrect ? 1 : 0),
      wrong: (prev?.wrong ?? 0) + (isCorrect ? 0 : 1),
      lastResult: isCorrect ? 'correct' : 'wrong',
      lastAt: new Date().toISOString(),
    }
    const wrongBank = { ...p.wrongBank }
    const existing = wrongBank[item.id]
    if (!isCorrect) {
      const { id, type, question, options, answer, explanation } = item
      wrongBank[item.id] = { id, type, question, options, answer, explanation, sourceUnit, streak: 0 }
    } else if (existing) {
      if (existing.streak + 1 >= 2) delete wrongBank[item.id]
      else wrongBank[item.id] = { ...existing, streak: existing.streak + 1 }
    }
    return { ...p, quiz: { ...p.quiz, [item.id]: stat }, wrongBank }
  })
}

export function isFavorite(key: string) {
  return state.favorites.some((f) => f.key === key)
}

export function toggleFavorite(fav: Omit<Favorite, 'addedAt'>) {
  set((p) => {
    const exists = p.favorites.some((f) => f.key === fav.key)
    if (exists) {
      const cards = { ...p.cards }
      delete cards[fav.key]
      return { ...p, favorites: p.favorites.filter((f) => f.key !== fav.key), cards }
    }
    return { ...p, favorites: [{ ...fav, addedAt: new Date().toISOString() }, ...p.favorites] }
  })
}

const BOX_INTERVAL_DAYS = [0, 1, 2, 4, 8, 16]

export function gradeCard(key: string, knewIt: boolean) {
  set((p) => {
    const prev = p.cards[key] ?? { box: 1, due: todayISO() }
    const box = knewIt ? Math.min(5, prev.box + 1) : 1
    const due = new Date()
    due.setDate(due.getDate() + BOX_INTERVAL_DAYS[box])
    return { ...p, cards: { ...p.cards, [key]: { box, due: todayISO(due) } } }
  })
}

export function quizAccuracy(p: Progress, idPrefix?: string) {
  let c = 0
  let w = 0
  for (const [id, s] of Object.entries(p.quiz)) {
    if (idPrefix && !id.startsWith(idPrefix)) continue
    c += s.correct
    w += s.wrong
  }
  const total = c + w
  return { correct: c, total, rate: total ? Math.round((c / total) * 100) : null }
}

export function resetAll() {
  set(() => fresh())
}

// ---------- 主題 ----------

export type Theme = 'light' | 'dark' | 'system'

export function getTheme(): Theme {
  try {
    return (localStorage.getItem('ed:theme') as Theme) || 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(t: Theme) {
  try {
    if (t === 'system') localStorage.removeItem('ed:theme')
    else localStorage.setItem('ed:theme', t)
  } catch {
    /* ignore */
  }
  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}
