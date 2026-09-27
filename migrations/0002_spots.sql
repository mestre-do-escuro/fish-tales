-- Regions (zones in the header dropdown) and their fishing spots (beaches).
-- Images are stored inline as base64; list queries must never select image_data.

create table if not exists regions (
  id            serial primary key,
  name          text not null unique,
  sort          int not null default 0,
  image_data    text,
  image_type    text,
  image_focus   int not null default 50,
  image_version int not null default 0
);

create table if not exists spots (
  id            serial primary key,
  region_id     int not null references regions (id) on delete restrict,
  name          text not null,
  profile       int not null,
  seed          real not null default 0,
  temp          int not null default 0,
  wind          real not null default 1,
  rain          int not null default 0,
  coef          int not null default 0,
  score         int not null default 0,
  sort          int not null default 0,
  image_data    text,
  image_type    text,
  image_focus   int not null default 50,
  image_version int not null default 0,
  unique (region_id, name)
);

create index if not exists spots_region_id_idx on spots (region_id);

insert into regions (name, sort) values
  ('Cascais', 1),
  ('Parque das Nações', 2),
  ('Sintra', 3),
  ('Almada', 4)
on conflict (name) do nothing;

insert into spots (region_id, name, profile, seed, temp, wind, rain, coef, score, sort)
select r.id, v.name, v.profile, v.seed, v.temp, v.wind, v.rain, v.coef, v.score, v.sort
from (values
  ('Parque das Nações', 'Parque das Nações', 0, 0.22,  1, 1.16,  4, -2, -1, 1),
  ('Parque das Nações', 'Belém',             0, 0.34,  1, 1.08,  2, -1,  0, 2),
  ('Parque das Nações', 'Algés',             0, 0.16,  0, 1.02,  1,  0,  0, 3),
  ('Cascais',           'Oeiras',            0, 0,     0, 1,     0,  0,  0, 1),
  ('Cascais',           'Cascais',           2, 0.08,  1, 0.94, -2,  1,  1, 2),
  ('Cascais',           'Carcavelos',        3, 0.18,  0, 1.04,  1,  0,  0, 3),
  ('Cascais',           'Estoril',           2, 0.28,  1, 0.9,  -3,  2,  1, 4),
  ('Cascais',           'Guincho',           1, 0.45, -1, 1.34,  3, -1, -1, 5),
  ('Sintra',            'Guincho',           1, 0.45, -1, 1.34,  3, -1, -1, 1),
  ('Sintra',            'Praia Grande',      1, 0.62, -2, 1.42,  5, -2, -1, 2),
  ('Sintra',            'Adraga',            1, 0.76, -2, 1.28,  4,  0,  0, 3),
  ('Sintra',            'Magoito',           1, 0.91, -2, 1.36,  6, -3, -1, 4),
  ('Almada',            'Costa da Caparica', 4, 0.2,   0, 1,     0,  0,  0, 1),
  ('Almada',            'Fonte da Telha',    4, 0.5,   1, 1.18, -1,  2,  1, 2),
  ('Almada',            'Trafaria',          4, 0.1,   1, 0.92,  2, -1,  0, 3)
) as v (region, name, profile, seed, temp, wind, rain, coef, score, sort)
join regions r on r.name = v.region
on conflict (region_id, name) do nothing;
