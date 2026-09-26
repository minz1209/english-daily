import { toggleFavorite, useProgress, type Favorite } from '../lib/progress'

export function FavButton({ fav }: { fav: Omit<Favorite, 'addedAt'> }) {
  const p = useProgress()
  const on = p.favorites.some((f) => f.key === fav.key)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(fav)
      }}
      aria-pressed={on}
      aria-label={on ? `取消收藏 ${fav.front}` : `收藏 ${fav.front}`}
      title={on ? '已收藏（進單字卡）' : '收藏到單字卡'}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition active:scale-90 ${on ? 'text-slang' : 'text-ink-3 hover:bg-paper-2 hover:text-ink'}`}
    >
      <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden>
        <path
          d="M5 2.8h10a.8.8 0 0 1 .8.8v14l-5.8-3.6-5.8 3.6v-14a.8.8 0 0 1 .8-.8Z"
          fill={on ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
