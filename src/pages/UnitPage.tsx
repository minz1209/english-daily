import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import type { Unit } from '../types/content'
import { curriculum, loadUnit, moduleOf } from '../lib/content'
import { useSchedule } from '../lib/useSchedule'
import { toggleCompleted, useProgress } from '../lib/progress'
import { ScenarioBlock } from '../components/ScenarioBlock'
import { GrammarBlock } from '../components/GrammarBlock'
import { SlangCard } from '../components/SlangCard'
import { ReviewBlock } from '../components/ReviewBlock'
import { Rule, SectionHeader } from '../components/SectionHeader'
import { BLOCKS } from '../components/blocks'

const SECTIONS = ['scenario', 'grammar', 'slang', 'review'] as const
type Section = (typeof SECTIONS)[number]

export function UnitPage() {
  const { id: idParam, section } = useParams()
  const id = Number(idParam)
  const { hash } = useLocation()
  const sch = useSchedule()
  const p = useProgress()
  const [unit, setUnit] = useState<Unit | null | undefined>(undefined)
  const only = SECTIONS.includes(section as Section) ? (section as Section) : null
  const locked = id > sch.unlocked
  const entry = curriculum.units.find((u) => u.id === id)

  useEffect(() => {
    if (locked) return
    setUnit(undefined)
    loadUnit(id).then(setUnit)
  }, [id, locked])

  // 內容載入後才捲到 #anchor
  useEffect(() => {
    if (!unit || !hash) return
    requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' }))
  }, [unit, hash])

  if (!entry) return <p className="text-ink-2">找不到這個單元。</p>

  if (locked) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-6xl text-ink/15">{String(id).padStart(2, '0')}</p>
        <h1 className="mt-4 text-2xl font-bold">{entry.title.zh}</h1>
        <p className="mt-2 text-ink-2">這個單元還沒解鎖。照進度走，複習才會跟得上。</p>
        <Link to="/course" className="mt-6 inline-block text-ink-3 underline underline-offset-4">
          回課程總表
        </Link>
      </div>
    )
  }

  if (unit === undefined) return <p className="py-20 text-center text-ink-3">載入中…</p>
  if (unit === null) return <p className="text-ink-2">這個單元的內容檔還沒寫好。</p>

  const mod = moduleOf(id)
  const done = p.completed.includes(id)
  const show = (s: Section) => !only || only === s

  return (
    <article>
      <header className="rise mb-6">
        <p className="text-sm tracking-widest text-ink-3">
          第 {mod?.id} 章 · {mod?.title} · {unit.level}
        </p>
        <div className="mt-2 flex items-end gap-4">
          <span className="font-display text-7xl leading-[0.8] font-semibold text-ink/15">{String(id).padStart(2, '0')}</span>
          <div>
            <h1 className="text-3xl leading-tight font-bold">{unit.title.zh}</h1>
            <p className="font-display text-lg text-ink-2 italic">{unit.title.en}</p>
          </div>
        </div>
      </header>

      {/* 區塊導覽 */}
      <nav className="no-scrollbar sticky top-0 z-10 -mx-4 mb-10 flex gap-2 overflow-x-auto bg-paper/90 px-4 py-3 backdrop-blur md:top-[57px]">
        {SECTIONS.map((s) => {
          const b = BLOCKS[s]
          const active = only === s
          return (
            <Link
              key={s}
              to={only ? `/unit/${id}/${s}` : `/unit/${id}#${s}`}
              className={`shrink-0 rounded-full border px-4 py-1 text-sm transition ${b.border} ${active ? `${b.bg} text-paper` : b.text}`}
            >
              {b.label}
            </Link>
          )
        })}
        <Link to={only ? `/unit/${id}` : `/unit/${id}/scenario`} className="shrink-0 rounded-full px-3 py-1 text-sm text-ink-3 underline underline-offset-4">
          {only ? '看整個單元' : '一次看一塊'}
        </Link>
      </nav>

      {show('scenario') && <ScenarioBlock unit={unit} />}
      {!only && <Rule />}
      {show('grammar') && <GrammarBlock unit={unit} />}
      {!only && <Rule />}
      {show('slang') && (
        <section id="slang" className="scroll-mt-24">
          <SectionHeader block="slang" title="這單元的俚語" sub="標了「看場合」「職場避免」的，先學會聽懂就好。" />
          <div className="space-y-5">
            {unit.slang.map((s) => (
              <SlangCard key={s.id} slang={s} unitId={id} />
            ))}
          </div>
        </section>
      )}
      {!only && <Rule />}
      {show('review') && <ReviewBlock key={id} unit={unit} />}

      <footer className="mt-16 space-y-6">
        <button
          type="button"
          onClick={() => toggleCompleted(id)}
          className={`w-full rounded-2xl py-4 text-lg font-bold transition active:scale-[0.99] ${done ? 'border border-ok text-ok' : 'bg-ink text-paper'}`}
        >
          {done ? '已完成 ✓（點一下取消）' : '這個單元完成了'}
        </button>
        <div className="flex justify-between text-ink-2">
          {id > 1 ? (
            <Link to={`/unit/${id - 1}`} className="hover:text-ink">
              ← 第 {id - 1} 單元
            </Link>
          ) : (
            <span />
          )}
          {id < sch.unlocked && (
            <Link to={`/unit/${id + 1}`} className="hover:text-ink">
              第 {id + 1} 單元 →
            </Link>
          )}
        </div>
      </footer>
    </article>
  )
}
