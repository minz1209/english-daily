// 瀏覽器內建發音（Web Speech API），不需要任何 API key
let cachedVoice: SpeechSynthesisVoice | null = null

// 依序偏好的英文語音：macOS/iOS 的高品質語音 > Google > 任何 en-US > 任何英文
const PREFERRED = ['Samantha', 'Ava', 'Allison', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny']

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  const voices = speechSynthesis.getVoices()
  if (!voices.length) return null
  cachedVoice =
    PREFERRED.map((n) => voices.find((v) => v.name.includes(n))).find(Boolean) ??
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null
  return cachedVoice
}

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

if (speechSupported) {
  speechSynthesis.addEventListener?.('voiceschanged', () => {
    cachedVoice = null
    pickVoice()
  })
}

export function speak(text: string, onEnd?: () => void) {
  if (!speechSupported) return
  speechSynthesis.cancel()
  // 句型裡的 ___ 空格不要唸成 underscore，改成停頓
  const u = new SpeechSynthesisUtterance(text.replace(/_{2,}/g, ' … '))
  const voice = pickVoice()
  if (voice) u.voice = voice
  u.lang = voice?.lang ?? 'en-US'
  u.rate = 0.95
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (speechSupported) speechSynthesis.cancel()
}
