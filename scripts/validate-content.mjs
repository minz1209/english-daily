// 內容驗證：npm run validate（build 前自動執行，有錯就讓部署失敗）
// 檢查 JSON 格式、欄位數量、題目 ID 全站唯一、與 curriculum.json 是否一致、有沒有重複的文法點與俚語
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'content')
const errors = []
const warnings = []
const err = (where, msg) => errors.push(`✗ ${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`! ${where}: ${msg}`)

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    err(path.replace(ROOT, 'content'), `JSON 解析失敗 — ${e.message}`)
    return null
  }
}

const isStr = (v) => typeof v === 'string' && v.trim().length > 0
const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[?!.]/g, '').trim()
const LEVELS = ['B1', 'B1+', 'B2-', 'B2']
const PLACEHOLDER = /\b(TODO|TBD|lorem|placeholder)\b|待補|XXX/i

// ---------- curriculum ----------
const cur = readJson(join(ROOT, 'curriculum.json'))
const curById = new Map()
if (cur) {
  const gIds = new Set()
  const slangSeen = new Map()
  cur.units.forEach((u, i) => {
    const w = `curriculum #${u.id}`
    if (u.id !== i + 1) err(w, `id 應為 ${i + 1}（要連號）`)
    if (!LEVELS.includes(u.level)) err(w, `level 不合法：${u.level}`)
    if (!cur.modules.some((m) => m.id === u.module)) err(w, `module ${u.module} 不存在`)
    if (gIds.has(u.grammar.id)) err(w, `文法點重複：${u.grammar.id}`)
    gIds.add(u.grammar.id)
    if (u.slang.length < 3 || u.slang.length > 5) err(w, `俚語要 3–5 則，現在 ${u.slang.length}`)
    for (const s of u.slang) {
      const k = norm(s)
      if (slangSeen.has(k)) err(w, `俚語「${s}」和第 ${slangSeen.get(k)} 單元重複`)
      slangSeen.set(k, u.id)
    }
    curById.set(u.id, u)
  })
}

// ---------- units ----------
const unitDir = join(ROOT, 'units')
const files = readdirSync(unitDir).filter((f) => /^unit-\d{3}\.json$/.test(f)).sort()
const quizIds = new Map()
const slangIds = new Map()

function checkQuiz(q, where, unitId) {
  if (!isStr(q.id)) return err(where, '題目缺 id')
  if (quizIds.has(q.id)) err(where, `題目 id「${q.id}」和 ${quizIds.get(q.id)} 重複`)
  quizIds.set(q.id, where)
  if (!['mcq', 'fill'].includes(q.type)) err(where, `${q.id} type 必須是 mcq 或 fill`)
  if (!isStr(q.question)) err(where, `${q.id} 缺題目`)
  if (!isStr(q.explanation)) err(where, `${q.id} 缺解說`)
  if (q.type === 'mcq') {
    if (!Array.isArray(q.options) || q.options.length < 3) err(where, `${q.id} 選擇題至少 3 個選項`)
    else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) err(where, `${q.id} answer 索引超出範圍`)
    else if (new Set(q.options).size !== q.options.length) err(where, `${q.id} 選項重複`)
  }
  if (q.type === 'fill') {
    if (!isStr(q.answer)) err(where, `${q.id} 填空題 answer 要是字串`)
    if (!/_{2,}/.test(q.question)) warn(where, `${q.id} 填空題題目裡沒有 ___ 空格`)
  }
  if (q.sourceUnit !== undefined && (q.sourceUnit < 1 || q.sourceUnit > unitId)) err(where, `${q.id} sourceUnit ${q.sourceUnit} 不能晚於本單元`)
}

for (const f of files) {
  const u = readJson(join(unitDir, f))
  if (!u) continue
  const w = f
  const idFromName = Number(f.match(/\d+/)[0])
  if (u.id !== idFromName) err(w, `id ${u.id} 和檔名不符`)
  const c = curById.get(u.id)
  if (!c) err(w, 'curriculum.json 沒有這個單元')
  else {
    if (u.module !== c.module) err(w, `module 和 curriculum 不一致`)
    if (u.level !== c.level) err(w, `level 和 curriculum 不一致`)
    if (u.grammar?.id !== c.grammar.id) err(w, `grammar.id「${u.grammar?.id}」和 curriculum「${c.grammar.id}」不一致`)
    const a = (u.slang ?? []).map((s) => norm(s.term)).sort().join('|')
    const b = c.slang.map(norm).sort().join('|')
    if (a !== b) err(w, `俚語和 curriculum 不一致\n    單元：${a}\n    總表：${b}`)
  }
  if (!isStr(u.title?.zh) || !isStr(u.title?.en)) err(w, '缺 title.zh / title.en')

  const s = u.scenario ?? {}
  if (!isStr(s.title) || !isStr(s.context)) err(w, 'scenario 缺 title / context')
  if (!Array.isArray(s.dialogues) || s.dialogues.length < 2 || s.dialogues.length > 3) err(w, '對話要 2–3 段')
  s.dialogues?.forEach((d, i) => {
    if (!isStr(d.title)) err(w, `對話 ${i + 1} 缺標題`)
    if (!Array.isArray(d.lines) || d.lines.length < 6) err(w, `對話 ${i + 1} 至少 6 句`)
    d.lines?.forEach((l, j) => {
      if (!isStr(l.speaker) || !isStr(l.en) || !isStr(l.zh)) err(w, `對話 ${i + 1} 第 ${j + 1} 句欄位不完整`)
    })
  })
  if (s.patterns?.length !== 10) err(w, `句型要剛好 10 個，現在 ${s.patterns?.length}`)
  s.patterns?.forEach((p, i) => (!isStr(p.en) || !isStr(p.zh)) && err(w, `句型 ${i + 1} 欄位不完整`))
  if (!Array.isArray(s.chinglish) || s.chinglish.length < 3) err(w, '中式英文對照至少 3 組')
  s.chinglish?.forEach((c, i) => (!isStr(c.wrong) || !isStr(c.right) || !isStr(c.why)) && err(w, `中式英文 ${i + 1} 欄位不完整`))

  const g = u.grammar ?? {}
  for (const k of ['title', 'oneLiner', 'whyWeGetItWrong']) if (!isStr(g[k])) err(w, `grammar 缺 ${k}`)
  if (!Array.isArray(g.whenToUse) || g.whenToUse.length < 2) err(w, 'whenToUse 至少 2 點')
  if (!Array.isArray(g.examples) || g.examples.length < 4) err(w, '文法對照例句至少 4 組')
  if (!g.examples?.some((e) => isStr(e.incorrect))) err(w, '文法例句至少要有一組 ❌ 對照')
  if (g.quiz?.length !== 5) err(w, `文法小測驗要 5 題，現在 ${g.quiz?.length}`)
  g.quiz?.forEach((q) => checkQuiz(q, w, u.id))

  if (!Array.isArray(u.slang) || u.slang.length < 3 || u.slang.length > 5) err(w, '俚語要 3–5 則')
  u.slang?.forEach((sl) => {
    const sw = `${w} 俚語「${sl.term}」`
    if (slangIds.has(sl.id)) err(sw, `id「${sl.id}」和 ${slangIds.get(sl.id)} 重複`)
    slangIds.set(sl.id, w)
    for (const k of ['id', 'term', 'meaning', 'usage']) if (!isStr(sl[k])) err(sw, `缺 ${k}`)
    if (!['neutral', 'casual', 'very-casual'].includes(sl.register)) err(sw, 'register 不合法')
    if (!['safe', 'careful', 'avoid-at-work'].includes(sl.risk?.level) || !isStr(sl.risk?.note)) err(sw, 'risk 不完整')
    if (typeof sl.dated !== 'boolean') err(sw, 'dated 要是 true/false')
    if (!['US', 'UK', 'both'].includes(sl.variety)) err(sw, 'variety 不合法')
    if (sl.examples?.length !== 2) err(sw, '例句要剛好 2 個')
  })

  if (!Array.isArray(u.review) || u.review.length < 3) err(w, '複習題至少 3 題')
  u.review?.forEach((q) => {
    if (typeof q.sourceUnit !== 'number') err(w, `${q.id} 缺 sourceUnit`)
    checkQuiz(q, w, u.id)
  })
  if (u.id > 1 && !u.review?.some((q) => q.sourceUnit < u.id)) err(w, '複習題至少要有一題來自前面單元')

  if (PLACEHOLDER.test(JSON.stringify(u))) err(w, '發現 placeholder 字樣（TODO / TBD / 待補…）')
}

// ---------- daily sentences ----------
const daily = readJson(join(ROOT, 'daily-sentences.json'))
if (daily) {
  if (!Array.isArray(daily) || daily.length < 30) err('daily-sentences.json', '至少 30 句')
  daily.forEach?.((d, i) => (!isStr(d.en) || !isStr(d.zh) || !isStr(d.note)) && err('daily-sentences.json', `第 ${i + 1} 句欄位不完整`))
  const seen = new Set()
  daily.forEach?.((d) => {
    if (seen.has(norm(d.en))) err('daily-sentences.json', `重複：${d.en}`)
    seen.add(norm(d.en))
  })
}

// ---------- 連號檢查 ----------
files.forEach((f, i) => {
  if (Number(f.match(/\d+/)[0]) !== i + 1) err(f, `單元檔要從 unit-001 連號，缺 unit-${String(i + 1).padStart(3, '0')}`)
})

warnings.forEach((m) => console.warn(m))
if (errors.length) {
  errors.forEach((m) => console.error(m))
  console.error(`\n內容驗證失敗：${errors.length} 個錯誤`)
  process.exit(1)
}
console.log(`✓ 內容驗證通過：${files.length} 個單元、${cur?.units.length ?? 0} 筆課表、${daily?.length ?? 0} 句每日一句、${quizIds.size} 道題目`)
