'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, AlertTriangle } from 'lucide-react'

type Props = {
  userId: string
  email: string
  settings: any
}

type ToggleProps = {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
}

function Toggle({ label, description, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink/45 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${value ? 'bg-brand' : 'bg-neutral-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

export default function SettingsClient({ userId, email, settings }: Props) {
  const supabase = createClient()
  const router = useRouter()

  const [notifyLikes, setNotifyLikes] = useState(settings?.notify_likes ?? true)
  const [notifyComments, setNotifyComments] = useState(settings?.notify_comments ?? true)
  const [notifyMessages, setNotifyMessages] = useState(settings?.notify_messages ?? true)
  const [notifyCofounder, setNotifyCofounder] = useState(settings?.notify_cofounder ?? true)
  const [notifyTakas, setNotifyTakas] = useState(settings?.notify_takas ?? true)
  const [profilePublic, setProfilePublic] = useState(settings?.profile_public ?? true)
  const [startupPublic, setStartupPublic] = useState(settings?.startup_public ?? true)
  const [language, setLanguage] = useState(settings?.language ?? 'tr')

  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [emailMsg, setEmailMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [error, setError] = useState('')

  async function saveSettings() {
    setSaving(true)
    await supabase.from('user_settings').upsert({
      id: userId,
      notify_likes: notifyLikes,
      notify_comments: notifyComments,
      notify_messages: notifyMessages,
      notify_cofounder: notifyCofounder,
      notify_takas: notifyTakas,
      profile_public: profilePublic,
      startup_public: startupPublic,
      language,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail) return
    setEmailLoading(true)
    setEmailMsg('')
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) setEmailMsg('Hata: ' + error.message)
    else setEmailMsg('Doğrulama e-postası gönderildi.')
    setEmailLoading(false)
    setNewEmail('')
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setPasswordMsg('Şifreler eşleşmiyor.'); return }
    if (newPassword.length < 6) { setPasswordMsg('Şifre en az 6 karakter olmalı.'); return }
    setPasswordLoading(true)
    setPasswordMsg('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setPasswordMsg('Hata: ' + error.message)
    else setPasswordMsg('Şifre başarıyla değiştirildi.')
    setPasswordLoading(false)
    setNewPassword('')
    setConfirmPassword('')
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    await supabase.from('profiles').delete().eq('id', userId)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="space-y-6">

      {/* Kaydet butonu */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="btn-primary flex items-center gap-1.5 text-sm disabled:opacity-60"
        >
          {saved ? <><Check size={14} /> Kaydedildi</> : saving ? 'Kaydediliyor...' : 'Ayarları kaydet'}
        </button>
      </div>

      {/* Bildirim ayarları */}
      <div className="card">
        <p className="mono text-xs text-ink/35 tracking-widest mb-4">BİLDİRİM AYARLARI</p>
        <Toggle label="Beğeniler" description="Birisi postunu beğendiğinde bildirim al." value={notifyLikes} onChange={setNotifyLikes} />
        <Toggle label="Yorumlar" description="Birisiyorum yaptığında bildirim al." value={notifyComments} onChange={setNotifyComments} />
        <Toggle label="Mesajlar" description="Yeni mesaj geldiğinde bildirim al." value={notifyMessages} onChange={setNotifyMessages} />
        <Toggle label="Co-founder istekleri" description="Birisi seni co-founder olarak davet ettiğinde." value={notifyCofounder} onChange={setNotifyCofounder} />
        <Toggle label="Takas teklifleri" description="Yeni bir takas teklifi geldiğinde bildirim al." value={notifyTakas} onChange={setNotifyTakas} />
      </div>

      {/* Gizlilik ayarları */}
      <div className="card">
        <p className="mono text-xs text-ink/35 tracking-widest mb-4">GİZLİLİK AYARLARI</p>
        <Toggle label="Profil herkese açık" description="Kapalıysa sadece üyeler profilini görebilir." value={profilePublic} onChange={setProfilePublic} />
        <Toggle label="Startuplar herkese açık" description="Kapalıysa startupların sadece sana görünür." value={startupPublic} onChange={setStartupPublic} />
      </div>

      {/* Görünüm ayarları */}
      <div className="card">
        <p className="mono text-xs text-ink/35 tracking-widest mb-4">GÖRÜNÜM</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Dil</p>
            <p className="text-xs text-ink/45 mt-0.5">Platform dilini seç.</p>
          </div>
          <div className="flex gap-2">
            {[{ key: 'tr', label: 'Türkçe' }, { key: 'en', label: 'English' }].map(l => (
              <button
                key={l.key}
                onClick={() => setLanguage(l.key)}
                className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${language === l.key ? 'bg-brand text-white border-brand' : 'bg-white text-ink/60 border-neutral-200 hover:border-brand/40'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hesap ayarları — e-posta */}
      <div className="card">
        <p className="mono text-xs text-ink/35 tracking-widest mb-4">HESAP</p>

        <div className="mb-5">
          <p className="text-sm font-medium text-ink mb-1">Mevcut e-posta</p>
          <p className="mono text-xs text-ink/45 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2">{email}</p>
        </div>

        <form onSubmit={handleEmailChange} className="mb-5 pb-5 border-b border-neutral-100">
          <p className="text-sm font-medium text-ink mb-3">E-posta değiştir</p>
          <div className="flex gap-2">
            <input
              type="email"
              className="input flex-1"
              placeholder="Yeni e-posta adresi"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
            />
            <button type="submit" disabled={emailLoading || !newEmail} className="btn-primary text-sm px-4 disabled:opacity-50">
              {emailLoading ? '...' : 'Değiştir'}
            </button>
          </div>
          {emailMsg && <p className={`text-xs mt-2 ${emailMsg.startsWith('Hata') ? 'text-red-500' : 'text-green-600'}`}>{emailMsg}</p>}
        </form>

        <form onSubmit={handlePasswordChange}>
          <p className="text-sm font-medium text-ink mb-3">Şifre değiştir</p>
          <div className="space-y-2">
            <input type="password" className="input" placeholder="Yeni şifre" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6} />
            <input type="password" className="input" placeholder="Şifreyi tekrarla" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          {passwordMsg && <p className={`text-xs mt-2 ${passwordMsg.startsWith('Hata') || passwordMsg.includes('eşleşmiyor') ? 'text-red-500' : 'text-green-600'}`}>{passwordMsg}</p>}
          <button type="submit" disabled={passwordLoading || !newPassword} className="btn-primary text-sm mt-3 disabled:opacity-50">
            {passwordLoading ? 'Değiştiriliyor...' : 'Şifreyi değiştir'}
          </button>
        </form>
      </div>

      {/* Tehlikeli alan — hesap silme */}
      <div className="card border-red-100">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} className="text-red-500" />
          <p className="mono text-xs text-red-500 tracking-widest">TEHLİKELİ ALAN</p>
        </div>
        <p className="text-sm text-ink/60 mb-4 leading-relaxed">
          Hesabını silersen tüm verilerini, startuplarını ve paylaşımlarını kalıcı olarak kaybedersin. Bu işlem geri alınamaz.
        </p>
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)} className="text-sm text-red-500 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors">
            Hesabımı sil
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-700 mb-3">Emin misin? Bu işlem geri alınamaz.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(false)} className="btn-secondary text-xs py-1.5 px-3">
                İptal
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading} className="bg-red-500 text-white text-xs py-1.5 px-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-60">
                {deleteLoading ? 'Siliniyor...' : 'Evet, hesabımı sil'}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}