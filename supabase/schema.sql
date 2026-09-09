-- Ta-réincarnation — schéma Supabase
-- Exécuter dans le SQL Editor du projet Supabase.

create table if not exists characters (
  id text primary key,                    -- slug, ex: "abiba-conseillere-abomey"
  name text not null,
  era text not null,
  location text not null,
  profession text not null,
  personality_tags text[] not null default '{}',
  affinity_tags text[] not null default '{}',
  hook text not null,
  story_short text not null,
  story_long text not null,
  portrait_url text,
  location_card_url text
);

create table if not exists quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  birth_date date,
  zodiac text,
  answers jsonb,
  matched_character_id text references characters (id),
  compatibility_score int,
  plan_purchased text,                    -- 'standard' | 'premium' | null
  paid_at timestamptz,
  pack_credits int not null default 0
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references quiz_sessions (id),
  provider text not null default 'saspay',
  plan text,
  amount int not null,
  currency text not null default 'XOF',
  status text not null default 'pending',
  transaction_ref text,
  saspay_session_id text,                 -- id de la session de checkout Saspay (vérification API)
  created_at timestamptz not null default now()
);

create index if not exists payments_session_idx on payments (session_id);

-- Migration pour une base déjà créée avant ce champ :
-- alter table payments add column if not exists saspay_session_id text;

-- RLS : aucun accès public — l'app passe toujours par la clé service côté serveur.
alter table characters enable row level security;
alter table quiz_sessions enable row level security;
alter table payments enable row level security;
