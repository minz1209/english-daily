import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const NAV = [
  { to: '/', label: '今天', icon: 'M4 10.5 12 4l8 6.5V20H4z' },
  { to: '/course', label: '課程', icon: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11' },
  { to: '/flashcards', label: '單字卡', icon: 'M7 3h10v18l-5-3.5L7 21z' },
  { to: '/search', label: '搜尋', icon: 'M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm5-2 4 4' },
  { to: '/settings', label: '設定', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2m12 0h2M12 4v2m0 12v2M6.3 6.3l1.4 1.4m8.6 8.6 1.4 1.4m0-11.4-1.4 1.4m-8.6 8.6-1.4 1.4' },
]

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-dvh">
      {/* 桌面：頂部細導覽 */}
      <header className="sticky top-0 z-20 hidden border-b border-rule bg-paper/90 backdrop-blur md:block">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <NavLink to="/" className="font-display text-xl italic">
            Daily <span className="text-slang">Margin</span>
          </NavLink>
          <nav className="flex gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `rounded-full px-3 py-1 text-[0.95rem] transition ${isActive ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink'}`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-6 pb-32 sm:px-6 md:pt-10">
        <Outlet />
      </main>

      {/* 手機：底部分頁列 */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[0.7rem] ${isActive ? 'text-ink' : 'text-ink-3'}`}
            >
              <Icon d={n.icon} />
              {n.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
