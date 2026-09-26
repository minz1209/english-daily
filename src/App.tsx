import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Course } from './pages/Course'
import { UnitPage } from './pages/UnitPage'
import { Browse } from './pages/Browse'
import { Flashcards } from './pages/Flashcards'
import { WrongBank } from './pages/WrongBank'
import { Search } from './pages/Search'
import { Settings } from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="course" element={<Course />} />
          <Route path="unit/:id" element={<UnitPage />} />
          <Route path="unit/:id/:section" element={<UnitPage />} />
          <Route path="browse/:block" element={<Browse />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="review" element={<WrongBank />} />
          <Route path="search" element={<Search />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<p className="py-20 text-center text-ink-3">找不到這一頁。</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
