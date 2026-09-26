// 內容資料格式：content/ 底下所有 JSON 都要符合這裡的型別
// scripts/validate-content.mjs 會在 build 前做同樣的檢查

export type Level = 'B1' | 'B1+' | 'B2-' | 'B2'

export interface Bilingual {
  en: string
  zh: string
}

export interface DialogueLine {
  speaker: string
  en: string
  zh: string
}

export interface Dialogue {
  title: string
  lines: DialogueLine[]
}

export interface Pattern {
  en: string
  zh: string
  note?: string
}

export interface Chinglish {
  wrong: string
  right: string
  why: string
}

export interface Scenario {
  title: string
  context: string
  dialogues: Dialogue[] // 2–3 段
  patterns: Pattern[] // 10 個
  chinglish: Chinglish[]
}

export interface GrammarExample {
  correct: string
  incorrect?: string
  note: string
}

export type QuizType = 'mcq' | 'fill'

export interface QuizItem {
  id: string // 全站唯一，例：u001-g1、u005-r2
  type: QuizType
  question: string
  options?: string[] // mcq 才有
  answer: number | string // mcq：選項索引；fill：正確答案（可用 | 分隔多個可接受答案）
  explanation: string
}

export interface Grammar {
  id: string // 防重複用的 kebab-case key
  title: string
  oneLiner: string
  whenToUse: string[]
  whyWeGetItWrong: string
  examples: GrammarExample[]
  quiz: QuizItem[] // 5 題
}

export type RiskLevel = 'safe' | 'careful' | 'avoid-at-work'

export interface Slang {
  id: string
  term: string
  meaning: string
  register: 'neutral' | 'casual' | 'very-casual'
  usage: string
  risk: { level: RiskLevel; note: string }
  dated: boolean
  variety: 'US' | 'UK' | 'both'
  examples: Bilingual[] // 2 個
}

export interface ReviewItem extends QuizItem {
  sourceUnit: number
}

export interface Unit {
  id: number
  module: number
  level: Level
  title: Bilingual
  scenario: Scenario
  grammar: Grammar
  slang: Slang[]
  review: ReviewItem[]
}

export interface CurriculumEntry {
  id: number
  module: number
  level: Level
  title: Bilingual
  scenario: string
  grammar: { id: string; title: string }
  slang: string[]
}

export interface Curriculum {
  version: number
  modules: { id: number; title: string; level: Level }[]
  units: CurriculumEntry[]
}

export interface DailySentence {
  en: string
  zh: string
  note: string
}
