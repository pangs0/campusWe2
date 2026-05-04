import { createClient } from '@/lib/supabase/server'
import AppLayout from '@/components/layout/AppLayout'
import Link from 'next/link'
import { Clock, Plus, Star } from 'lucide-react'

export default async function OfficeHoursPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sessions } = await supabase
    .from('office_hours')
    .select('*, mentor:profiles(full_name, username, university, department, bio, user_skills(skill_name))')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const dayNames: Record<string, string> = {
    pazartesi: 'Pazartesi', sali: 'Salı', carsamba: 'Çarşamba',
    persembe: 'Perşembe', cuma: 'Cuma', cumartesi: 'Cumartesi', pazar: 'Pazar'
  }

  return (
    <AppLayout user={user}>
      

      <main className="px-8 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="mono text-xs text-ink/35 tracking-widest mb-1">OFFICE HOURS</p>
            <h1 className="font-serif text-3xl font-bold text-ink">Mentorlarla tanış.</h1>
            <p className="text-sm text-ink/45 mt-1">
              Sektör profesyonelleri haftada 1 saat gönüllü mentorluk yapıyor.
            </p>
          </div>
          {user && (
            <Link href="/office-hours/yeni" className="btn-primary flex items-center gap-1.5 text-xs">
              <Plus size={13} />
              Mentor ol
            </Link>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { n: sessions?.length || 0, l: 'Aktif mentor' },
            { n: 'Ücretsiz', l: 'Her zaman' },
            { n: '1 saat', l: 'Haftalık süre' },
          ].map((s, i) => (
            <div key={i} className="card text-center py-4">
              <div className="font-serif text-2xl font-bold text-ink">{s.n}</div>
              <div className="mono text-xs text-ink/35 mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        {sessions && sessions.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {sessions.map((session: any) => (
              <div key={session.id} className="card hover:border-brand/30 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center text-lg font-bold text-brand font-serif flex-shrink-0">
                    {session.mentor?.full_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif font-bold text-ink">{session.mentor?.full_name}</h2>
                    <p className="text-xs text-ink/45">
                      {session.mentor?.university}
                      {session.mentor?.department && ` · ${session.mentor.department}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-500 fill-amber-500" />
                    <span className="mono text-xs text-ink/40">Mentor</span>
                  </div>
                </div>

                {session.title && (
                  <h3 className="font-medium text-ink text-sm mb-1">{session.title}</h3>
                )}

                {session.description && (
                  <p className="text-xs text-ink/50 leading-relaxed mb-3 line-clamp-2">
                    {session.description}
                  </p>
                )}

                {session.mentor?.user_skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {session.mentor.user_skills.slice(0, 4).map((s: any, i: number) => (
                      <span key={i} className="mono text-xs bg-neutral-100 text-ink/55 border border-neutral-200 rounded px-2 py-0.5">
                        {s.skill_name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5 text-xs text-ink/40">
                    <Clock size={11} />
                    <span>
                      {dayNames[session.day_of_week] || session.day_of_week} · {session.time_slot}
                    </span>
                  </div>
                  <a
                    href={`mailto:?subject=Office Hours - ${session.mentor?.full_name}&body=Merhaba! CampusWe Office Hours üzerinden seninle görüşmek istiyorum.`}
                    className="btn-primary py-1.5 px-3 text-xs"
                  >
                    Randevu al
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Clock size={40} className="text-ink/15 mx-auto mb-4" />
            <p className="text-ink/40 font-serif text-xl mb-2">Henüz mentor yok.</p>
            <p className="text-sm text-ink/30 mb-6">İlk mentor sen ol.</p>
            {user && (
              <Link href="/office-hours/yeni" className="btn-primary inline-flex items-center gap-1.5 text-xs">
                <Plus size={13} />
                Mentor ol
              </Link>
            )}
          </div>
        )}
      </main>
    </AppLayout>
  )
}