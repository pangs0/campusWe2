export type Profile = {
  id: string
  full_name: string
  username: string
  university: string | null
  department: string | null
  bio: string | null
  avatar_url: string | null
  karma_tokens: number
  created_at: string
}

export type UserSkill = {
  id: string
  user_id: string
  skill_name: string
  category: string
}

export type Startup = {
  id: string
  founder_id: string
  name: string
  slug: string
  description: string | null
  stage: 'fikir' | 'mvp' | 'traction' | 'büyüme'
  sector: string | null
  cover_url: string | null
  is_public: boolean
  created_at: string
  founder?: Profile
}

export type StartupUpdate = {
  id: string
  startup_id: string
  user_id: string
  title: string
  content: string
  update_type: 'güncelleme' | 'milestone' | 'sorun' | 'başarı'
  created_at: string
  author?: Profile
}

export type StartupMember = {
  id: string
  startup_id: string
  user_id: string
  role: string
  joined_at: string
  profile?: Profile
}
