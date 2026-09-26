import { useState } from 'react'
import { speak, speechSupported, stopSpeaking } from '../lib/speech'

export function SpeakButton({ text, className = '' }: { text: string; className?: string }) {
  const [playing, setPlaying] = useState(false)
  if (!speechSupported) return null
  return (
    <button
      type="button"
      aria-label={`播放發音：${text}`}
      title="播放發音"
      onClick={(e) => {
        e.stopPropagation()
        if (playing) {
          stopSpeaking()
          setPlaying(false)
          return
        }
        setPlaying(true)
        speak(text, () => setPlaying(false))
      }}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-3 transition hover:bg-paper-2 hover:text-ink active:scale-95 ${playing ? 'bg-paper-2 text-ink' : ''} ${className}`}
    >
      {playing ? (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><rect x="4" y="4" width="8" height="8" rx="1.5" fill="currentColor" /></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M3 8v4h3l4 3.5v-11L6 8H3Z" fill="currentColor" />
          <path d="M13 7.2a4 4 0 0 1 0 5.6M15.2 5a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
