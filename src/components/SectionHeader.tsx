import { BLOCKS, type BlockKey } from './blocks'

export function SectionHeader({ block, title, sub }: { block: BlockKey; title: string; sub?: string }) {
  const b = BLOCKS[block]
  return (
    <header className="mb-6">
      <div className={`mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase ${b.text}`}>
        <span className={`h-2 w-2 rounded-full ${b.bg}`} />
        <span>{b.label}</span>
        <span className="font-display font-normal tracking-normal normal-case italic opacity-70">{b.en}</span>
      </div>
      <h2 className="font-display text-[1.7rem] leading-tight font-semibold text-ink">{title}</h2>
      {sub && <p className="mt-2 text-ink-2">{sub}</p>}
    </header>
  )
}

export function Rule() {
  return <hr className="my-12 border-0 border-t border-dashed border-rule" />
}
