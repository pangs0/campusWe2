'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NotFound() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf9f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: .3; } 50% { opacity: .6; } }
      `}</style>

      {/* Arka plan grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(26,26,24,.05) 39px, rgba(26,26,24,.05) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(26,26,24,.05) 39px, rgba(26,26,24,.05) 40px)', pointerEvents: 'none' }} />

      {/* Dekoratif daireler */}
      {[
        { size: 300, top: '-10%', left: '-5%', opacity: 0.04 },
        { size: 200, bottom: '-5%', right: '-3%', opacity: 0.06 },
        { size: 150, top: '30%', right: '10%', opacity: 0.03 },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', top: (c as any).top, bottom: (c as any).bottom,
          left: (c as any).left, right: (c as any).right,
          width: c.size, height: c.size, borderRadius: '50%',
          background: '#C4500A', opacity: c.opacity,
          animation: `pulse ${3 + i}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{
        textAlign: 'center', position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>

        {/* 404 büyük yazı */}
        <div style={{ position: 'relative', marginBottom: '2rem', animation: 'float 4s ease-in-out infinite' }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontSize: 140,
            fontWeight: 800,
            color: 'rgba(26,26,24,.06)',
            margin: 0,
            lineHeight: 1,
            letterSpacing: -8,
            userSelect: 'none',
          }}>404</p>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(196,80,10,.1)',
            border: '2px solid rgba(196,80,10,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
          }}>
            🔍
          </div>
        </div>

        {/* Logo */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 800, color: '#1a1a18' }}>
            Campus<em style={{ color: '#C4500A', fontStyle: 'normal' }}>We</em>
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 800,
          color: '#1a1a18', letterSpacing: -1, marginBottom: '1rem',
          animation: 'fadeUp 0.6s ease 0.2s both',
        }}>
          Sayfa bulunamadı.
        </h1>

        <p style={{
          fontSize: 15, color: 'rgba(26,26,24,.45)', maxWidth: 360,
          margin: '0 auto 2.5rem', lineHeight: 1.7,
          animation: 'fadeUp 0.6s ease 0.3s both',
        }}>
          Aradığın sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>

        {/* Linkler */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeUp 0.6s ease 0.4s both',
        }}>
          <Link href="/dashboard" style={{
            background: '#C4500A', color: 'white',
            padding: '12px 28px', borderRadius: 8,
            fontSize: 14, textDecoration: 'none', fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
          }}>
            Ana sayfaya dön →
          </Link>
          <Link href="/feed" style={{
            background: 'white', color: 'rgba(26,26,24,.6)',
            padding: '12px 28px', borderRadius: 8, fontSize: 14,
            textDecoration: 'none', border: '1px solid rgba(26,26,24,.12)',
            fontFamily: 'Inter, sans-serif',
          }}>
            Akışa git
          </Link>
        </div>

        {/* Hızlı linkler */}
        <div style={{
          marginTop: '3rem',
          animation: 'fadeUp 0.6s ease 0.5s both',
        }}>
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(26,26,24,.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            HIZLI ERİŞİM
          </p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { href: '/kurslar', label: 'Kurslar' },
              { href: '/demo-day', label: 'Demo Day' },
              { href: '/kahve', label: 'Kahve Molası' },
              { href: '/takas', label: 'Takas' },
              { href: '/office-hours', label: 'Mentorlar' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                fontSize: 13, color: '#C4500A',
                textDecoration: 'none', fontFamily: 'Inter, sans-serif',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}