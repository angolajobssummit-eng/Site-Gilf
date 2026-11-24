-- =====================================================================
-- GiLF Eventos — base de dados (Supabase / PostgreSQL)
-- Como usar: Supabase → SQL Editor → New query → colar TUDO → Run.
-- Pode correr de novo sem perder dados (usa "if not exists"/"or replace").
-- =====================================================================

-- ---------- Tabelas ----------
create table if not exists perfis (
  id uuid primary key references auth.users on delete cascade,
  nome text not null default '',
  telefone text default '',
  cidade text default '',
  cargo text default '',
  organizacao text default '',
  papel text not null default 'membro' check (papel in ('membro', 'admin')),
  criado_em timestamptz not null default now()
);

create table if not exists grupos (
  id text primary key,
  nome text not null,
  cidade text not null,
  pais text default '',
  categoria text not null,
  temas text[] default '{}',
  descricao text not null default '',
  desde text default to_char(now(), 'YYYY'),
  estado text not null default 'pendente' check (estado in ('pendente', 'aprovado', 'rejeitado')),
  destaque boolean not null default false,
  criado_por uuid references perfis on delete set null,
  criado_em timestamptz not null default now()
);

create table if not exists grupo_membros (
  grupo_id text references grupos on delete cascade,
  perfil_id uuid references perfis on delete cascade,
  funcao text not null default 'membro' check (funcao in ('membro', 'organizador')),
  entrou_em timestamptz not null default now(),
  primary key (grupo_id, perfil_id)
);

create table if not exists eventos (
  id text primary key,
  grupo_id text not null references grupos on delete cascade,
  titulo text not null,
  descricao text not null default '',
  inicio timestamptz not null,
  fim timestamptz,
  formato text not null default 'presencial' check (formato in ('presencial', 'online')),
  local text default '',
  endereco text default '',
  cidade text default '',
  link_online text default '',
  preco integer,                 -- null = "ver condições"; 0 = gratuito
  preco_texto text default '',
  vagas integer not null default 40 check (vagas > 0),
  certificado boolean not null default false,
  oficial boolean not null default false,
  link text default '',
  estado text not null default 'publicado' check (estado in ('publicado', 'cancelado', 'rascunho')),
  criado_por uuid references perfis on delete set null,
  criado_em timestamptz not null default now()
);

create table if not exists inscricoes (
  id uuid primary key default gen_random_uuid(),
  evento_id text not null references eventos on delete cascade,
  perfil_id uuid not null references perfis on delete cascade,
  codigo text not null unique,
  estado text not null check (estado in ('confirmado', 'espera', 'cancelado')),
  objectivo text default '',
  quer_b2b boolean not null default true,
  check_in_em timestamptz,
  criado_em timestamptz not null default now(),
  unique (evento_id, perfil_id)
);

create table if not exists comentarios (
  id uuid primary key default gen_random_uuid(),
  evento_id text not null references eventos on delete cascade,
  perfil_id uuid not null references perfis on delete cascade default auth.uid(),
  texto text not null check (char_length(texto) between 1 and 1000),
  criado_em timestamptz not null default now()
);

create table if not exists publicacoes (
  id uuid primary key default gen_random_uuid(),
  grupo_id text not null references grupos on delete cascade,
  perfil_id uuid not null references perfis on delete cascade default auth.uid(),
  texto text not null check (char_length(texto) between 1 and 2000),
  criado_em timestamptz not null default now()
);

create index if not exists eventos_inicio_idx on eventos (inicio);
create index if not exists inscricoes_evento_idx on inscricoes (evento_id, estado);
create index if not exists comentarios_evento_idx on comentarios (evento_id);
create index if not exists publicacoes_grupo_idx on publicacoes (grupo_id);

-- ---------- Funções de permissão ----------
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfis where id = auth.uid() and papel = 'admin');
$$;

create or replace function is_org(p_grupo text) returns boolean
language sql stable security definer set search_path = public as $$
  select is_admin() or exists (select 1 from grupo_membros where grupo_id = p_grupo and perfil_id = auth.uid() and funcao = 'organizador');
$$;

-- ---------- Novo utilizador → perfil ----------
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into perfis (id, nome, telefone, cidade)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''), coalesce(new.raw_user_meta_data->>'telefone', ''), coalesce(new.raw_user_meta_data->>'cidade', ''))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- ---------- Protecções (só admin muda papel, estado, destaque, oficial) ----------
create or replace function guard_perfis() returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- auth.uid() nulo = editor SQL / service role (dono do projecto): sem restrições
  if auth.uid() is not null and not is_admin() then new.papel := old.papel; end if;
  return new;
end $$;
drop trigger if exists t_guard_perfis on perfis;
create trigger t_guard_perfis before update on perfis for each row execute function guard_perfis();

create or replace function guard_grupos() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null and not is_admin() then new.estado := 'pendente'; new.destaque := false; new.criado_por := auth.uid(); end if;
    if new.criado_por is null then new.criado_por := auth.uid(); end if;
  elsif auth.uid() is not null and not is_admin() then
    new.estado := old.estado; new.destaque := old.destaque; new.criado_por := old.criado_por;
  end if;
  return new;
end $$;
drop trigger if exists t_guard_grupos on grupos;
create trigger t_guard_grupos before insert or update on grupos for each row execute function guard_grupos();

create or replace function grupo_criador_organiza() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.criado_por is not null then
    insert into grupo_membros (grupo_id, perfil_id, funcao) values (new.id, new.criado_por, 'organizador')
    on conflict (grupo_id, perfil_id) do update set funcao = 'organizador';
  end if;
  return new;
end $$;
drop trigger if exists t_grupo_criador on grupos;
create trigger t_grupo_criador after insert on grupos for each row execute function grupo_criador_organiza();

create or replace function guard_eventos() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null and not is_admin() then new.oficial := false; end if;
    new.criado_por := coalesce(new.criado_por, auth.uid());
  elsif auth.uid() is not null and not is_admin() then
    new.oficial := old.oficial; new.grupo_id := old.grupo_id;
  end if;
  return new;
end $$;
drop trigger if exists t_guard_eventos on eventos;
create trigger t_guard_eventos before insert or update on eventos for each row execute function guard_eventos();

-- ---------- Regras de acesso (RLS) ----------
alter table perfis enable row level security;
alter table grupos enable row level security;
alter table grupo_membros enable row level security;
alter table eventos enable row level security;
alter table inscricoes enable row level security;
alter table comentarios enable row level security;
alter table publicacoes enable row level security;

drop policy if exists perfis_ver on perfis;
create policy perfis_ver on perfis for select using (id = auth.uid() or is_admin());
drop policy if exists perfis_editar on perfis;
create policy perfis_editar on perfis for update using (id = auth.uid() or is_admin());

drop policy if exists grupos_ver on grupos;
create policy grupos_ver on grupos for select using (estado = 'aprovado' or criado_por = auth.uid() or is_org(id));
drop policy if exists grupos_criar on grupos;
create policy grupos_criar on grupos for insert with check (auth.uid() is not null);
drop policy if exists grupos_editar on grupos;
create policy grupos_editar on grupos for update using (is_org(id));
drop policy if exists grupos_apagar on grupos;
create policy grupos_apagar on grupos for delete using (is_admin());

drop policy if exists membros_ver on grupo_membros;
create policy membros_ver on grupo_membros for select using (true);
drop policy if exists membros_entrar on grupo_membros;
create policy membros_entrar on grupo_membros for insert with check ((perfil_id = auth.uid() and funcao = 'membro') or is_admin());
drop policy if exists membros_sair on grupo_membros;
create policy membros_sair on grupo_membros for delete using (perfil_id = auth.uid() or is_admin());
drop policy if exists membros_admin on grupo_membros;
create policy membros_admin on grupo_membros for update using (is_admin());

drop policy if exists eventos_ver on eventos;
create policy eventos_ver on eventos for select using (
  (estado <> 'rascunho' and exists (select 1 from grupos g where g.id = grupo_id and g.estado = 'aprovado')) or is_org(grupo_id));
drop policy if exists eventos_criar on eventos;
create policy eventos_criar on eventos for insert with check (is_org(grupo_id));
drop policy if exists eventos_editar on eventos;
create policy eventos_editar on eventos for update using (is_org(grupo_id));
drop policy if exists eventos_apagar on eventos;
create policy eventos_apagar on eventos for delete using (is_org(grupo_id));

-- Inscrições: cada pessoa vê as suas; criar/cancelar só pelas funções abaixo.
drop policy if exists inscricoes_ver on inscricoes;
create policy inscricoes_ver on inscricoes for select using (perfil_id = auth.uid() or is_admin());

drop policy if exists comentarios_ver on comentarios;
create policy comentarios_ver on comentarios for select using (true);
drop policy if exists comentarios_criar on comentarios;
create policy comentarios_criar on comentarios for insert with check (perfil_id = auth.uid());
drop policy if exists comentarios_apagar on comentarios;
create policy comentarios_apagar on comentarios for delete using (perfil_id = auth.uid() or is_admin());

drop policy if exists publicacoes_ver on publicacoes;
create policy publicacoes_ver on publicacoes for select using (true);
drop policy if exists publicacoes_criar on publicacoes;
create policy publicacoes_criar on publicacoes for insert with check (
  perfil_id = auth.uid() and exists (select 1 from grupo_membros m where m.grupo_id = publicacoes.grupo_id and m.perfil_id = auth.uid()));
drop policy if exists publicacoes_apagar on publicacoes;
create policy publicacoes_apagar on publicacoes for delete using (perfil_id = auth.uid() or is_org(grupo_id));

-- ---------- Vistas públicas (só o que pode ser mostrado a todos) ----------
create or replace view v_grupos as
  select g.id, g.nome, g.cidade, g.pais, g.categoria, g.temas, g.descricao, g.desde, g.estado, g.destaque, g.criado_por, g.criado_em,
         (select count(*) from grupo_membros m where m.grupo_id = g.id)::int as n_membros
  from grupos g where g.estado = 'aprovado';

create or replace view v_eventos as
  select e.id, e.grupo_id, e.titulo, e.descricao, e.inicio, e.fim, e.formato, e.local, e.endereco, e.cidade, e.preco, e.preco_texto,
         e.vagas, e.certificado, e.oficial, e.link, e.estado, e.criado_em,
         (select count(*) from inscricoes i where i.evento_id = e.id and i.estado = 'confirmado')::int as n_confirmados
  from eventos e join grupos g on g.id = e.grupo_id
  where e.estado in ('publicado', 'cancelado') and g.estado = 'aprovado';

create or replace view v_participantes as
  select i.evento_id, p.id as perfil_id, p.nome, p.cargo, i.criado_em
  from inscricoes i join perfis p on p.id = i.perfil_id where i.estado = 'confirmado';

create or replace view v_membros as
  select m.grupo_id, p.id as perfil_id, p.nome, p.cargo, m.funcao, m.entrou_em
  from grupo_membros m join perfis p on p.id = m.perfil_id;

create or replace view v_comentarios as
  select c.id, c.evento_id, c.perfil_id, p.nome, c.texto, c.criado_em from comentarios c join perfis p on p.id = c.perfil_id;

create or replace view v_publicacoes as
  select c.id, c.grupo_id, c.perfil_id, p.nome, c.texto, c.criado_em from publicacoes c join perfis p on p.id = c.perfil_id;

grant select on v_grupos, v_eventos, v_participantes, v_membros, v_comentarios, v_publicacoes to anon, authenticated;

-- ---------- Participar / cancelar (com lista de espera automática) ----------
create or replace function participar(p_evento text, p_objectivo text default '', p_b2b boolean default true)
returns table (r_estado text, r_codigo text)
language plpgsql security definer set search_path = public as $$
declare v_e eventos; v_conf int; v_est text;
begin
  if auth.uid() is null then raise exception 'Precisa de entrar na sua conta.'; end if;
  select e.* into v_e from eventos e join grupos g on g.id = e.grupo_id
    where e.id = p_evento and e.estado = 'publicado' and g.estado = 'aprovado' for update of e;
  if not found then raise exception 'Evento indisponível.'; end if;
  if coalesce(v_e.fim, v_e.inicio) < now() then raise exception 'Este evento já terminou.'; end if;
  select count(*) into v_conf from inscricoes where evento_id = p_evento and estado = 'confirmado';
  v_est := case when v_conf >= v_e.vagas then 'espera' else 'confirmado' end;
  insert into inscricoes (evento_id, perfil_id, codigo, estado, objectivo, quer_b2b)
  values (p_evento, auth.uid(), 'GE-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6)), v_est, coalesce(p_objectivo, ''), coalesce(p_b2b, true))
  on conflict (evento_id, perfil_id) do update
    set estado = excluded.estado, objectivo = excluded.objectivo, quer_b2b = excluded.quer_b2b, criado_em = now(), check_in_em = null
    where inscricoes.estado = 'cancelado';
  insert into grupo_membros (grupo_id, perfil_id) values (v_e.grupo_id, auth.uid()) on conflict do nothing;
  return query select i.estado, i.codigo from inscricoes i where i.evento_id = p_evento and i.perfil_id = auth.uid();
end $$;

create or replace function cancelar_participacao(p_evento text) returns void
language plpgsql security definer set search_path = public as $$
declare v_era text;
begin
  perform 1 from eventos where id = p_evento for update;
  select estado into v_era from inscricoes where evento_id = p_evento and perfil_id = auth.uid();
  update inscricoes set estado = 'cancelado', check_in_em = null where evento_id = p_evento and perfil_id = auth.uid();
  if v_era = 'confirmado' then   -- passa o lugar à primeira pessoa da lista de espera
    update inscricoes set estado = 'confirmado'
    where id = (select id from inscricoes where evento_id = p_evento and estado = 'espera' order by criado_em limit 1);
  end if;
end $$;

-- ---------- Organizadores e administração ----------
create or replace function lista_inscricoes(p_evento text)
returns table (id uuid, nome text, telefone text, email text, cargo text, organizacao text, estado text, codigo text, objectivo text, quer_b2b boolean, check_in_em timestamptz, criado_em timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if not is_org((select grupo_id from eventos where eventos.id = p_evento)) then raise exception 'Sem permissão.'; end if;
  return query select i.id, p.nome, p.telefone, u.email::text, p.cargo, p.organizacao, i.estado, i.codigo, i.objectivo, i.quer_b2b, i.check_in_em, i.criado_em
    from inscricoes i join perfis p on p.id = i.perfil_id join auth.users u on u.id = p.id
    where i.evento_id = p_evento and i.estado <> 'cancelado' order by i.estado, i.criado_em;
end $$;

create or replace function check_in(p_evento text, p_codigo text) returns json
language plpgsql security definer set search_path = public as $$
declare v inscricoes; v_nome text;
begin
  if not is_org((select grupo_id from eventos where id = p_evento)) then raise exception 'Sem permissão.'; end if;
  select * into v from inscricoes where evento_id = p_evento and codigo = upper(trim(split_part(p_codigo, '|', 1)));
  if not found then return json_build_object('ok', false, 'msg', 'Código não encontrado neste evento.'); end if;
  select nome into v_nome from perfis where id = v.perfil_id;
  if v.estado <> 'confirmado' then return json_build_object('ok', false, 'msg', v_nome || ' não tem lugar confirmado (' || v.estado || ').'); end if;
  if v.check_in_em is not null then return json_build_object('ok', true, 'ja', true, 'nome', v_nome); end if;
  update inscricoes set check_in_em = now() where id = v.id;
  return json_build_object('ok', true, 'ja', false, 'nome', v_nome);
end $$;

create or replace function marcar_presenca(p_inscricao uuid, p_presente boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_org((select e.grupo_id from inscricoes i join eventos e on e.id = i.evento_id where i.id = p_inscricao)) then raise exception 'Sem permissão.'; end if;
  update inscricoes set check_in_em = case when p_presente then now() else null end where id = p_inscricao;
end $$;

create or replace function admin_resumo() returns json
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'Sem permissão.'; end if;
  return json_build_object(
    'utilizadores', (select count(*) from perfis),
    'grupos', (select count(*) from grupos where estado = 'aprovado'),
    'pendentes', (select count(*) from grupos where estado = 'pendente'),
    'eventos', (select count(*) from eventos where estado = 'publicado' and coalesce(fim, inicio) >= now()),
    'inscricoes', (select count(*) from inscricoes where estado = 'confirmado'),
    'presencas', (select count(*) from inscricoes where check_in_em is not null),
    'novos7', (select count(*) from perfis where criado_em > now() - interval '7 days'));
end $$;

create or replace function admin_utilizadores(p_q text default '')
returns table (id uuid, nome text, email text, telefone text, cidade text, cargo text, organizacao text, papel text, criado_em timestamptz, n_inscricoes bigint, n_presencas bigint)
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'Sem permissão.'; end if;
  return query select p.id, p.nome, u.email::text, p.telefone, p.cidade, p.cargo, p.organizacao, p.papel, p.criado_em,
      (select count(*) from inscricoes i where i.perfil_id = p.id and i.estado = 'confirmado'),
      (select count(*) from inscricoes i where i.perfil_id = p.id and i.check_in_em is not null)
    from perfis p join auth.users u on u.id = p.id
    where coalesce(p_q, '') = '' or p.nome ilike '%' || p_q || '%' or u.email ilike '%' || p_q || '%' or p.telefone ilike '%' || p_q || '%'
    order by p.criado_em desc limit 500;
end $$;

create or replace function admin_definir_organizador(p_grupo text, p_email text, p_org boolean) returns void
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if not is_admin() then raise exception 'Sem permissão.'; end if;
  select id into v_id from auth.users where lower(email) = lower(trim(p_email));
  if v_id is null then raise exception 'Não existe conta com esse email.'; end if;
  insert into grupo_membros (grupo_id, perfil_id, funcao) values (p_grupo, v_id, case when p_org then 'organizador' else 'membro' end)
  on conflict (grupo_id, perfil_id) do update set funcao = excluded.funcao;
end $$;

-- ---------- Permissões da API (o Supabase não as dá automaticamente em projectos novos) ----------
revoke all on perfis, grupos, grupo_membros, eventos, inscricoes, comentarios, publicacoes from anon;
revoke truncate, trigger, references on perfis, grupos, grupo_membros, eventos, inscricoes, comentarios, publicacoes from authenticated;
revoke truncate, trigger, references on v_grupos, v_eventos, v_participantes, v_membros, v_comentarios, v_publicacoes from anon, authenticated;
grant select, update on perfis to authenticated;
grant select, insert, update, delete on grupos, grupo_membros, eventos to authenticated;
grant select on inscricoes to authenticated;
grant select, insert, delete on comentarios, publicacoes to authenticated;

-- Funções internas (gatilhos) não ficam expostas na API; acções só para quem tem sessão iniciada
revoke execute on function handle_new_user(), guard_perfis(), guard_grupos(), guard_eventos(), grupo_criador_organiza() from public, anon, authenticated;
revoke execute on function participar(text, text, boolean), cancelar_participacao(text), lista_inscricoes(text), check_in(text, text),
  marcar_presenca(uuid, boolean), admin_resumo(), admin_utilizadores(text), admin_definir_organizador(text, text, boolean) from public, anon;
grant execute on function participar(text, text, boolean), cancelar_participacao(text), lista_inscricoes(text), check_in(text, text),
  marcar_presenca(uuid, boolean), admin_resumo(), admin_utilizadores(text), admin_definir_organizador(text, text, boolean) to authenticated;

-- ---------- Conteúdo inicial: grupo e evento oficial GiLF ----------
insert into grupos (id, nome, cidade, pais, categoria, descricao, desde, estado, destaque)
values ('gilf-luanda', 'GiLF Luanda — Líderes & Investidores', 'Luanda', 'Angola', 'lideranca',
  'O grupo-mãe da rede GiLF. Encontros de líderes, gestores e investidores em Luanda e preparação do fórum anual GiLF Angola.', '2024', 'aprovado', true)
on conflict (id) do nothing;

insert into eventos (id, grupo_id, titulo, descricao, inicio, fim, formato, local, endereco, cidade, preco, preco_texto, vagas, oficial, link)
values ('gilf-2026', 'gilf-luanda', 'GiLF Angola 2026 — Fórum Global de Investimento e Liderança',
  'O evento anual da rede: fórum de investimento e liderança durante o dia e Gala dos Prémios Líderes Angola à noite.

A inscrição aqui regista o seu interesse; a Comissão Organizadora confirma o bilhete.',
  '2026-12-17 08:00+01', '2026-12-17 23:00+01', 'presencial', 'Hotel EPIC SANA', 'Luanda', 'Luanda', null, 'Bilhetes via Comissão', 600, true, 'https://www.gilf-angola.com')
on conflict (id) do nothing;

-- ---------- Tornar-se administrador ----------
-- Depois de criar a sua conta no site, corra (com o SEU email):
--   update perfis set papel = 'admin' where id = (select id from auth.users where email = 'o-seu-email@exemplo.com');
