/**
 * XSS ve injection saldırılarına karşı input temizleme
 */

// HTML özel karakterleri encode et
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Metin alanları için temizleme — script tagları ve tehlikeli içerikleri kaldır
export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

// URL güvenlik kontrolü
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    // Sadece http ve https izin ver
    if (!['http:', 'https:'].includes(parsed.protocol)) return ''
    return url
  } catch {
    return ''
  }
}

// Username doğrulama — sadece harf, rakam, alt çizgi
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username)
}

// Email doğrulama
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Şifre güç kontrolü
export function checkPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Çok zayıf', color: '#dc2626' }
  if (score === 2) return { score, label: 'Zayıf', color: '#f97316' }
  if (score === 3) return { score, label: 'Orta', color: '#eab308' }
  if (score === 4) return { score, label: 'Güçlü', color: '#22c55e' }
  return { score, label: 'Çok güçlü', color: '#16a34a' }
}