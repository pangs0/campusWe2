'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, X, Plus, Check, Upload, Camera, Linkedin, Globe, Twitter, Instagram } from 'lucide-react'

const SKILL_CATEGORIES = ['Teknik', 'Tasarım', 'Pazarlama', 'İş Geliştirme', 'Finans', 'Hukuk', 'Diğer']
const FOCUS_AREAS = ['FinTech', 'EdTech', 'HealthTech', 'AgriTech', 'SaaS', 'Yapay Zeka', 'E-ticaret', 'CleanTech', 'DeepTech', 'GameTech']
const STAGES = ['Pre-Seed', 'Seed', 'Seri A', 'Seri B+']
const LOOKING_FOR = ['Stajyer', 'Junior Geliştirici', 'Senior Geliştirici', 'Tasarımcı', 'Pazarlama Uzmanı', 'Co-founder', 'İş Geliştirme']
const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+']
const TICKET_SIZES = ['₺50K - ₺250K', '₺250K - ₺1M', '₺1M - ₺5M', '₺5M+', '$50K - $500K', '$500K - $2M', '$2M+']

type Props = {
  userId: string
  profile: any
  role: string
  skills: any[]
  investorProfile: any
  companyProfile: any
}

export default function ProfileEditClient({ userId, profile, role, skills: initialSkills, investorProfile, companyProfile }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null)

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    university: profile?.university || '',
    department: profile?.department || '',
    city: profile?.city || '',
    linkedin_url: profile?.linkedin_url || '',
    twitter_url: profile?.twitter_url || '',
    website_url: profile?.website_url || '',
  })

  const [invForm, setInvForm] = useState({
    firm_name: investorProfile?.firm_name || '',
    title: investorProfile?.title || '',
    ticket_size: investorProfile?.ticket_size || '',
    linkedin_url: investorProfile?.linkedin_url || '',
    website_url: investorProfile?.website_url || '',
  })
  const [focusAreas, setFocusAreas] = useState<string[]>(investorProfile?.focus_areas || [])
  const [prefStages, setPrefStages] = useState<string[]>(investorProfile?.preferred_stages || [])

  const [compForm, setCompForm] = useState({
    company_name: companyProfile?.company_name || '',
    sector: companyProfile?.sector || '',
    company_size: companyProfile?.company_size || '',
    founded_year: companyProfile?.founded_year || '',
    website_url: companyProfile?.website_url || '',
    linkedin_url: companyProfile?.linkedin_url || '',
    description: companyProfile?.description || '',
  })
  const [lookingFor, setLookingFor] = useState<string[]>(companyProfile?.looking_for || [])

  const [skills, setSkills] = useState<any[]>(initialSkills)
  const [newSkill, setNewSkill] = useState({ skill_name: '', category: 'Teknik' })

  function toggleArray(arr: string[], setArr: (a: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item])
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    let avatar_url = profile?.avatar_url
    if (avatarFile) {
      const cleanName = avatarFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const path = `${userId}/${Date.now()}-${cleanName}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
        avatar_url = urlData.publicUrl
      }
    }

    await supabase.from('profiles').update({ ...form, avatar_url }).eq('id', userId)

    if (role === 'investor') {
      await supabase.from('investor_profiles').upsert({
        id: userId, ...invForm, focus_areas: focusAreas, preferred_stages: prefStages,
      })
    }
    if (role === 'company') {
      await supabase.from('company_profiles').upsert({
        id: userId, ...compForm, looking_for: lookingFor,
      })
    }

    setLoading(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); router.push('/profile') }, 1500)
  }

  async function addSkill() {
    if (!newSkill.skill_name.trim()) return
    const { data } = await supabase.from('user_skills').insert({
      user_id: userId, skill_name: newSkill.skill_name.trim(), category: newSkill.category,
    }).select().single()
    if (data) setSkills(prev => [...prev, data])
    setNewSkill({ skill_name: '', category: 'Teknik' })
  }

  async function removeSkill(id: string) {
    await supabase.from('user_skills').delete().eq('id', id)
    setSkills(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div>
      <Link href="/profile" className="flex items-center gap-1.5 text-sm text-ink/45 hover:text-ink mb-8 transition-colors">
        <ArrowLeft size={14} /> Profile dön
      </Link>

      <div className="mb-8">
        <p className="mono text-xs text-ink/35 tracking-widest mb-1">PROFİL</p>
        <h1 className="font-serif text-3xl font-bold text-ink">Bilgilerini güncelle.</h1>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">

        {/* Sol — form */}
        <form onSubmit={handleSave} className="col-span-2 space-y-5">

            {/* Genel bilgiler */}
            <div className="card space-y-4">
              <p className="mono text-xs text-ink/35 tracking-widest">GENEL BİLGİLER</p>

              {/* Avatar yükleme */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-2xl border-2 border-white shadow-sm">
                    {avatarPreview
                      ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                      : form.full_name?.[0] || '?'
                    }
                  </div>
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow">
                    <Camera size={11} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{form.full_name || 'İsim belirtilmemiş'}</p>
                  <p className="mono text-xs text-ink/35">@{form.username || 'kullanici'}</p>
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="mt-1.5 text-xs text-brand hover:underline">
                    Fotoğraf değiştir
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Ad Soyad</label>
                  <input type="text" className="input" value={form.full_name}
                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Kullanıcı adı</label>
                  <input type="text" className="input" value={form.username}
                    onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
                </div>
              </div>

              <div>
                <label className="label">Şehir</label>
                <input type="text" className="input" placeholder="İstanbul" value={form.city}
                  onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
              </div>

              {role === 'founder' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Üniversite</label>
                    <input type="text" className="input" placeholder="ODTÜ" value={form.university}
                      onChange={e => setForm(p => ({ ...p, university: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Bölüm</label>
                    <input type="text" className="input" placeholder="Bilgisayar Müh." value={form.department}
                      onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
                  </div>
                </div>
              )}

              <div>
                <label className="label">Hakkında</label>
                <textarea className="input resize-none" placeholder="Kendini kısaca tanıt..." value={form.bio} rows={3}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
                <p className="mono text-xs text-ink/25 mt-1">{form.bio.length}/300 karakter</p>
              </div>
            </div>

            {/* Sosyal linkler */}
            <div className="card space-y-4">
              <p className="mono text-xs text-ink/35 tracking-widest">SOSYAL MEDYA & LİNKLER</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Linkedin size={15} className="text-ink/30 flex-shrink-0" />
                  <input type="url" className="input flex-1" placeholder="https://linkedin.com/in/..."
                    value={form.linkedin_url} onChange={e => setForm(p => ({ ...p, linkedin_url: e.target.value }))} />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter size={15} className="text-ink/30 flex-shrink-0" />
                  <input type="url" className="input flex-1" placeholder="https://twitter.com/..."
                    value={form.twitter_url} onChange={e => setForm(p => ({ ...p, twitter_url: e.target.value }))} />
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={15} className="text-ink/30 flex-shrink-0" />
                  <input type="url" className="input flex-1" placeholder="https://..."
                    value={form.website_url} onChange={e => setForm(p => ({ ...p, website_url: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Yatırımcı alanları */}
            {role === 'investor' && (
              <div className="card space-y-4">
                <p className="mono text-xs text-ink/35 tracking-widest">YATIRIMCI BİLGİLERİ</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Firma Adı</label>
                    <input type="text" className="input" placeholder="ABC Ventures" value={invForm.firm_name}
                      onChange={e => setInvForm(p => ({ ...p, firm_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Unvan</label>
                    <input type="text" className="input" placeholder="Partner" value={invForm.title}
                      onChange={e => setInvForm(p => ({ ...p, title: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label">Ticket Boyutu</label>
                  <select className="input" value={invForm.ticket_size}
                    onChange={e => setInvForm(p => ({ ...p, ticket_size: e.target.value }))}>
                    <option value="">Seç</option>
                    {TICKET_SIZES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label mb-2">Odak Alanları</label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_AREAS.map(area => (
                      <button key={area} type="button" onClick={() => toggleArray(focusAreas, setFocusAreas, area)}
                        className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          focusAreas.includes(area) ? 'bg-brand text-white border-brand' : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                        }`}>
                        {focusAreas.includes(area) && <Check size={10} className="inline mr-1" />}{area}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label mb-2">Tercih Edilen Aşamalar</label>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map(stage => (
                      <button key={stage} type="button" onClick={() => toggleArray(prefStages, setPrefStages, stage)}
                        className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          prefStages.includes(stage) ? 'bg-ink text-white border-ink' : 'bg-white text-ink/50 border-neutral-200 hover:border-ink/30'
                        }`}>
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Şirket alanları */}
            {role === 'company' && (
              <div className="card space-y-4">
                <p className="mono text-xs text-ink/35 tracking-widest">ŞİRKET BİLGİLERİ</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Şirket Adı</label>
                    <input type="text" className="input" placeholder="Şirket A.Ş." value={compForm.company_name}
                      onChange={e => setCompForm(p => ({ ...p, company_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Sektör</label>
                    <input type="text" className="input" placeholder="Teknoloji" value={compForm.sector}
                      onChange={e => setCompForm(p => ({ ...p, sector: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Çalışan Sayısı</label>
                    <select className="input" value={compForm.company_size}
                      onChange={e => setCompForm(p => ({ ...p, company_size: e.target.value }))}>
                      <option value="">Seç</option>
                      {COMPANY_SIZES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Kuruluş Yılı</label>
                    <input type="number" className="input" placeholder="2020" value={compForm.founded_year}
                      onChange={e => setCompForm(p => ({ ...p, founded_year: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label mb-2">Aranan Profiller</label>
                  <div className="flex flex-wrap gap-2">
                    {LOOKING_FOR.map(item => (
                      <button key={item} type="button" onClick={() => toggleArray(lookingFor, setLookingFor, item)}
                        className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          lookingFor.includes(item) ? 'bg-brand text-white border-brand' : 'bg-white text-ink/50 border-neutral-200 hover:border-brand/30'
                        }`}>
                        {lookingFor.includes(item) && <Check size={10} className="inline mr-1" />}{item}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Şirket Hakkında</label>
                  <textarea className="input resize-none" placeholder="Şirketinizi tanıtın..." value={compForm.description} rows={3}
                    onChange={e => setCompForm(p => ({ ...p, description: e.target.value }))} />
                </div>
              </div>
            )}

            {/* Yetenekler — founder */}
            {role === 'founder' && (
              <div className="card space-y-4">
                <p className="mono text-xs text-ink/35 tracking-widest">YETENEKLERİM</p>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? skills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 rounded px-2.5 py-1">
                      <span className="mono text-xs text-ink/70">{skill.skill_name}</span>
                      <button type="button" onClick={() => removeSkill(skill.id)} className="text-ink/30 hover:text-red-500 transition-colors">
                        <X size={11} />
                      </button>
                    </div>
                  )) : <p className="text-xs text-ink/35">Henüz yetenek eklenmedi.</p>}
                </div>
                <div className="border-t border-neutral-100 pt-4">
                  <p className="mono text-xs text-ink/35 tracking-widest mb-3">YENİ YETENEK EKLE</p>
                  <div className="flex gap-2">
                    <select className="input w-36" value={newSkill.category}
                      onChange={e => setNewSkill(p => ({ ...p, category: e.target.value }))}>
                      {SKILL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input type="text" className="input flex-1" placeholder="React, Figma, SEO..."
                      value={newSkill.skill_name}
                      onChange={e => setNewSkill(p => ({ ...p, skill_name: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                    <button onClick={addSkill} type="button" className="btn-primary px-3 flex items-center gap-1">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 py-3">
              {saved ? '✓ Kaydedildi — yönlendiriliyor' : loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
        </form>

        {/* Sağ — önizleme */}
        <div className="space-y-4 sticky top-10 self-start">
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">CANLI ÖNİZLEME</p>

              {/* Kapak */}
              <div style={{ height: 60, background: 'linear-gradient(135deg, #1a1a18, #2a1a10)', borderRadius: '8px 8px 0 0', marginBottom: -24, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(196,80,10,.06) 20px, rgba(196,80,10,.06) 40px)', borderRadius: '8px 8px 0 0' }} />
              </div>

              <div style={{ padding: '0 12px 12px' }}>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-brand/15 flex items-center justify-center font-serif font-bold text-brand text-lg mb-2 border-2 border-white">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                    : form.full_name?.[0] || '?'
                  }
                </div>
                <p className="font-serif font-bold text-ink text-sm">{form.full_name || 'Ad Soyad'}</p>
                <p className="mono text-xs text-ink/35">@{form.username || 'kullanici'}</p>
                {form.city && <p className="mono text-xs text-ink/30 mt-0.5">📍 {form.city}</p>}
                {form.bio && <p className="text-xs text-ink/50 mt-2 leading-relaxed line-clamp-2">{form.bio}</p>}

                {role === 'founder' && form.university && (
                  <p className="mono text-xs text-ink/30 mt-1">🎓 {form.university}</p>
                )}

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {skills.slice(0, 3).map(s => (
                      <span key={s.id} className="mono text-xs bg-neutral-100 text-ink/50 border border-neutral-200 rounded px-1.5 py-0.5">{s.skill_name}</span>
                    ))}
                  </div>
                )}

                {/* Sosyal linkler */}
                <div className="flex gap-2 mt-2">
                  {form.linkedin_url && <Linkedin size={13} className="text-ink/30" />}
                  {form.twitter_url && <Twitter size={13} className="text-ink/30" />}
                  {form.website_url && <Globe size={13} className="text-ink/30" />}
                </div>
              </div>
            </div>

            {/* İpuçları */}
            <div className="card">
              <p className="mono text-xs text-ink/35 tracking-widest mb-3">İPUÇLARI</p>
              <div className="space-y-2.5">
                {[
                  { icon: '📸', text: 'Fotoğraf ekle — güven oluşturur' },
                  { icon: '✍️', text: 'Hakkında bölümünü doldur' },
                  { icon: '🔗', text: 'LinkedIn bağla' },
                  { icon: '🏙️', text: 'Şehir ekle — yerel bağlantılar kur' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ fontSize: 12, flexShrink: 0 }}>{tip.icon}</span>
                    <p className="text-xs text-ink/55">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}