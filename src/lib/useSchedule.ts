import { useEffect, useState } from 'react'
import { getSchedule } from './schedule'
import { useProgress } from './progress'

/** 每 30 秒重算一次，倒數與午夜解鎖不用重新整理 */
export function useSchedule() {
  const { startDate } = useProgress()
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  return { ...getSchedule(startDate, now), now }
}
