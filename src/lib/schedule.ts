// 解鎖規則：開始日當天解鎖第 1 單元，之後每 2 天（當地時間午夜）解鎖下一個
import { authoredCount } from './content'

export const DAYS_PER_UNIT = 2
export const RESTOCK_THRESHOLD = 15

export function todayISO(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseLocal(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysSince(startISO: string, now = new Date()) {
  const start = parseLocal(startISO)
  const today = parseLocal(todayISO(now))
  return Math.max(0, Math.round((today.getTime() - start.getTime()) / 86_400_000))
}

export interface ScheduleState {
  /** 依日期「應該」解鎖到第幾單元（不受內容數限制） */
  scheduled: number
  /** 實際可讀的單元數 = min(scheduled, 已寫好的單元數) */
  unlocked: number
  /** 今天的單元 */
  todayUnit: number
  /** 今天是這個單元的第幾天（1 或 2） */
  dayOfUnit: number
  /** 下一次解鎖時間；內容用完時為 null */
  nextUnlockAt: Date | null
  /** 尚未解鎖、但內容已經寫好的單元數 */
  remainingLocked: number
  needsRestock: boolean
  /** 排程已經超過現有內容 */
  outOfContent: boolean
}

export function getSchedule(startISO: string, now = new Date()): ScheduleState {
  const days = daysSince(startISO, now)
  const scheduled = Math.floor(days / DAYS_PER_UNIT) + 1
  const unlocked = Math.min(scheduled, authoredCount)
  const remainingLocked = Math.max(0, authoredCount - unlocked)
  const nextIndex = scheduled // 下一個要解鎖的是第 scheduled+1 單元
  const next = parseLocal(startISO)
  next.setDate(next.getDate() + nextIndex * DAYS_PER_UNIT)
  return {
    scheduled,
    unlocked,
    todayUnit: unlocked,
    dayOfUnit: (days % DAYS_PER_UNIT) + 1,
    nextUnlockAt: scheduled < authoredCount ? next : null,
    remainingLocked,
    needsRestock: remainingLocked < RESTOCK_THRESHOLD,
    outOfContent: scheduled > authoredCount,
  }
}

export function formatCountdown(ms: number) {
  if (ms <= 0) return '即將解鎖'
  const totalMin = Math.floor(ms / 60_000)
  const d = Math.floor(totalMin / 1440)
  const h = Math.floor((totalMin % 1440) / 60)
  const m = totalMin % 60
  if (d > 0) return `${d} 天 ${h} 小時`
  if (h > 0) return `${h} 小時 ${m} 分`
  return `${m} 分鐘`
}
