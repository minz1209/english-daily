// 每個內容區塊的主色與標籤。Tailwind 需要完整 class 字串，所以集中寫在這裡
export const BLOCKS = {
  scenario: { label: '生活情境', en: 'Scene', text: 'text-scene', bg: 'bg-scene', soft: 'bg-scene-soft', border: 'border-scene' },
  grammar: { label: '文法', en: 'Grammar', text: 'text-gram', bg: 'bg-gram', soft: 'bg-gram-soft', border: 'border-gram' },
  slang: { label: '俚語', en: 'Slang', text: 'text-slang', bg: 'bg-slang', soft: 'bg-slang-soft', border: 'border-slang' },
  review: { label: '複習', en: 'Review', text: 'text-rev', bg: 'bg-rev', soft: 'bg-rev-soft', border: 'border-rev' },
  daily: { label: '每日一句', en: 'Today', text: 'text-daily', bg: 'bg-daily', soft: 'bg-daily-soft', border: 'border-daily' },
} as const

export type BlockKey = keyof typeof BLOCKS
