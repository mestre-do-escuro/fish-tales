-- App-level profile for every Better Auth user (the "user" table from 0001_auth),
-- plus the per-plan feature toggles managed in the backoffice.

create table if not exists profiles (
  user_id    text primary key references "user" ("id") on delete cascade,
  role       text not null default 'user' check (role in ('admin', 'user')),
  plan       text not null default 'free' check (plan in ('free', 'standard', 'pro')),
  status     text not null default 'active' check (status in ('active', 'suspended')),
  phone      text,
  location   text,
  bio        text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on profiles (role);

-- Only overrides are stored; features without a row use the defaults in
-- src/lib/access.ts, so new features can ship without a migration.
create table if not exists plan_features (
  plan       text not null check (plan in ('free', 'standard', 'pro')),
  feature    text not null,
  enabled    boolean not null,
  updated_at timestamptz not null default now(),
  primary key (plan, feature)
);
