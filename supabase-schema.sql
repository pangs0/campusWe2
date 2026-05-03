-- CampusWe MVP — Supabase SQL
-- Supabase Dashboard > SQL Editor'a yapıştır ve çalıştır

-- Profiller tablosu
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  username text unique not null,
  university text,
  department text,
  bio text,
  avatar_url text,
  karma_tokens integer default 100,
  created_at timestamp with time zone default now()
);

-- Yetkinlikler tablosu
create table user_skills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  skill_name text not null,
  category text default 'genel',
  created_at timestamp with time zone default now()
);

-- Startuplar tablosu
create table startups (
  id uuid default gen_random_uuid() primary key,
  founder_id uuid references profiles(id) on delete cascade,
  name text not null,
  slug text unique not null,
  description text,
  stage text default 'fikir' check (stage in ('fikir','mvp','traction','büyüme')),
  sector text,
  cover_url text,
  is_public boolean default true,
  created_at timestamp with time zone default now()
);

-- Startup üyeleri
create table startup_members (
  id uuid default gen_random_uuid() primary key,
  startup_id uuid references startups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'Üye',
  joined_at timestamp with time zone default now(),
  unique(startup_id, user_id)
);

-- Startup güncellemeleri
create table startup_updates (
  id uuid default gen_random_uuid() primary key,
  startup_id uuid references startups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  content text not null,
  update_type text default 'güncelleme' check (update_type in ('güncelleme','milestone','sorun','başarı')),
  created_at timestamp with time zone default now()
);

-- RLS (Row Level Security) — güvenlik kuralları
alter table profiles enable row level security;
alter table user_skills enable row level security;
alter table startups enable row level security;
alter table startup_members enable row level security;
alter table startup_updates enable row level security;

-- Profil politikaları
create policy "Herkes profilleri görebilir"
  on profiles for select using (true);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on profiles for update using (auth.uid() = id);

create policy "Kullanıcı profil oluşturabilir"
  on profiles for insert with check (auth.uid() = id);

-- Yetenek politikaları
create policy "Herkes yetenekleri görebilir"
  on user_skills for select using (true);

create policy "Kullanıcı kendi yeteneklerini yönetebilir"
  on user_skills for all using (auth.uid() = user_id);

-- Startup politikaları
create policy "Herkes herkese açık startupları görebilir"
  on startups for select using (is_public = true or auth.uid() = founder_id);

create policy "Kullanıcı startup oluşturabilir"
  on startups for insert with check (auth.uid() = founder_id);

create policy "Kurucu startup düzenleyebilir"
  on startups for update using (auth.uid() = founder_id);

create policy "Kurucu startup silebilir"
  on startups for delete using (auth.uid() = founder_id);

-- Üye politikaları
create policy "Herkes üyeleri görebilir"
  on startup_members for select using (true);

create policy "Giriş yapan kullanıcı üye ekleyebilir"
  on startup_members for insert with check (auth.uid() is not null);

-- Güncelleme politikaları
create policy "Herkes güncellemeleri görebilir"
  on startup_updates for select using (true);

create policy "Üyeler güncelleme ekleyebilir"
  on startup_updates for insert with check (auth.uid() is not null);
