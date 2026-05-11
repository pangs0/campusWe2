'use client'

import { useState, useEffect, useRef } from 'react'

type Props = {
  placeholders: string[]
  className?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
}

export default function TypewriterTextarea({ placeholders, className, value, onChange, rows = 3, onKeyDown }: Props) {
  const [placeholder, setPlaceholder] = useState('')
  const [focused, setFocused] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (focused || value) return

    function tick() {
      const current = placeholders[phraseIndex]

      if (!deleting) {
        setPlaceholder(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          timeoutRef.current = setTimeout(() => setDeleting(true), 1800)
        } else {
          setCharIndex(p => p + 1)
          timeoutRef.current = setTimeout(tick, 40)
        }
      } else {
        setPlaceholder(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setDeleting(false)
          setPhraseIndex(p => (p + 1) % placeholders.length)
          setCharIndex(0)
          timeoutRef.current = setTimeout(tick, 400)
        } else {
          setCharIndex(p => p - 1)
          timeoutRef.current = setTimeout(tick, 25)
        }
      }
    }

    timeoutRef.current = setTimeout(tick, 80)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [charIndex, deleting, focused, phraseIndex, value])

  return (
    <textarea
      className={className}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      rows={rows}
      placeholder={focused ? placeholders[0] : placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}