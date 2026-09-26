import { Link } from 'react-router-dom'
import { curriculum } from '../lib/content'
import { useSchedule } from '../lib/useSchedule'
import { useProgress } from '../lib/progress'

export function Course() {
  const sch = useSchedule()
  const p = useProgress()
  return (
    <div>
      <h1 className="rise font-display text-4xl font-semibold">課程總表</h1>
      <p className="rise mt-2 text-ink-2">
        {curriculum.units.length} 個單元，每 2 天解鎖一個。已解鎖的隨時可以回頭看。
      </p>

      <div className="mt-10 space-y-12">
        {curriculum.modules.map((m) => {
          const units = curriculum.units.filter((u) => u.module === m.id)
          return (
            <section key={m.id}>
              <div className="mb-3 flex items-baseline justify-between border-b border-ink pb-2">
                <h2 className="text-xl font-bold">
                  <span className="mr-2 font-display text-ink-3 italic">Ch.{m.id}</span>
                  {m.title}
                </h2>
                <span className="text-sm text-ink-3">{m.level}</span>
              </div>
              <ol>
                {units.map((u) => {
                  const unlocked = u.id <= sch.unlocked
                  const isToday = u.id === sch.todayUnit
                  const done = p.completed.includes(u.id)
                  const row = (
                    <div className={`flex items-start gap-3 border-b border-rule py-3 ${unlocked ? '' : 'opacity-45'}`}>
                      <span className={`w-8 pt-0.5 font-display text-lg ${isToday ? 'text-slang' : 'text-ink-3'}`}>{String(u.id).padStart(2, '0')}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">
                          {u.title.zh}
                          {isToday && <span className="ml-2 rounded-full bg-slang px-2 py-0.5 align-middle text-xs font-normal text-paper">今天</span>}
                        </p>
                        <p className="truncate text-sm text-gram">{u.grammar.title}</p>
                        <p className="en truncate text-sm text-ink-3">{u.slang.join(' · ')}</p>
                      </div>
                      <span className="pt-1 text-sm">{done ? <span className="text-ok">✓</span> : unlocked ? '' : '🔒'}</span>
                    </div>
                  )
                  return <li key={u.id}>{unlocked ? <Link to={`/unit/${u.id}`} className="block transition hover:bg-paper-2/50">{row}</Link> : row}</li>
                })}
              </ol>
            </section>
          )
        })}
      </div>
    </div>
  )
}
