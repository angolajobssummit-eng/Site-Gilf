-- GiLF Eventos — esquema da base de dados para o MVP (Supabase / PostgreSQL)
-- Corre no editor SQL do Supabase. As regras (RLS) garantem que cada pessoa só vê e altera o que é seu.

create table perfis (
  id uuid primary key references auth.users on delete cascade,
  nome text not null,
  telefone text,                       -- WhatsApp, formato +244...
  cargo text,
  organizacao text,
  sector text,
  cidade text,
  interesses text[] default '{}',
  papel text not null default 'membro' check (papel in ('membro', 'organizador', 'admin')),
  verificado text,                     -- ex.: 'Orador GiLF 2026', 'Prémio Líderes Angola'
  criado_em timestamptz default now()
);

create table capitulos (
  id text primary key,                 -- ex.: 'luanda'
  nome text not null,
  cidade text not null,
  pais text not null default 'Angola',
  tema text,
  descricao text,
  criado_em timestamptz default now()
);

create table capitulo_membros (
  capitulo_id text references capitulos on delete cascade,
  perfil_id uuid references perfis on delete cascade,
  funcao text not null default 'membro' check (funcao in ('membro', 'organizador')),
  entrou_em timestamptz default now(),
  primary key (capitulo_id, perfil_id)
);

create table eventos (
  id text primary key,
  capitulo_id text references capitulos,
  titulo text not null,
  descricao text,
  tema text,
  inicio timestamptz not null,
  fim timestamptz,
  formato text not null default 'presencial' check (formato in ('presencial', 'online', 'hibrido')),
  local text,
  cidade text,
  preco_kz integer not null default 0,
  vagas integer not null,
  certificado boolean default false,
  oficial boolean default false,
  programa jsonb default '[]',
  publicado boolean default false,
  criado_por uuid references perfis,
  criado_em timestamptz default now()
);

create table inscricoes (
  id uuid primary key default gen_random_uuid(),
  evento_id text references eventos on delete cascade,
  perfil_id uuid references perfis on delete cascade,
  codigo text unique not null,         -- conteúdo do código QR
  estado text not null check (estado in ('confirmado', 'espera', 'pendente_pagamento', 'cancelado')),
  objectivo text,                      -- para as sugestões B2B
  quer_b2b boolean default true,
  pago_em timestamptz,
  check_in_em timestamptz,             -- marcado à entrada
  criado_em timestamptz default now(),
  unique (evento_id, perfil_id)
);

-- Pontos de liderança: presença real conta mais do que inscrição
create view pontos as
select p.id as perfil_id,
  coalesce(sum(case when i.check_in_em is not null then 20 when i.estado = 'confirmado' then 5 else 0 end), 0)
  + (select count(*) * 5 from capitulo_membros cm where cm.perfil_id = p.id) as pontos
from perfis p left join inscricoes i on i.perfil_id = p.id
group by p.id;

-- Regras de acesso
alter table perfis enable row level security;
alter table capitulos enable row level security;
alter table capitulo_membros enable row level security;
alter table eventos enable row level security;
alter table inscricoes enable row level security;

create policy "capítulos públicos" on capitulos for select using (true);
create policy "eventos publicados são públicos" on eventos for select using (publicado);
create policy "ver o próprio perfil" on perfis for select using (auth.uid() = id);
create policy "editar o próprio perfil" on perfis for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "ver as próprias inscrições" on inscricoes for select using (auth.uid() = perfil_id);
create policy "inscrever-se" on inscricoes for insert with check (auth.uid() = perfil_id);
create policy "cancelar a própria inscrição" on inscricoes for update using (auth.uid() = perfil_id);
create policy "gerir a própria filiação" on capitulo_membros for all using (auth.uid() = perfil_id) with check (auth.uid() = perfil_id);

-- Organizadores gerem os eventos e as inscrições do seu capítulo (incluindo check-in)
create policy "organizador gere eventos" on eventos for all using (
  exists (select 1 from capitulo_membros cm where cm.capitulo_id = eventos.capitulo_id and cm.perfil_id = auth.uid() and cm.funcao = 'organizador'));
create policy "organizador vê e faz check-in" on inscricoes for all using (
  exists (select 1 from eventos e join capitulo_membros cm on cm.capitulo_id = e.capitulo_id
          where e.id = inscricoes.evento_id and cm.perfil_id = auth.uid() and cm.funcao = 'organizador'));
