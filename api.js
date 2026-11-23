/* GiLF Eventos — camada de dados.
   Modo real: Supabase (config.js preenchido).
   Modo demonstração: tudo guardado no browser, com dados de exemplo (dados.js). */
(function () {
  "use strict";
  var CFG = window.GE_CONFIG || {};
  var D = window.GE_DATA;
  var LIVE = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase);

  function hash(s) { var h = 0; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function slug(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "item"; }
  function uid() { return "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function codigo() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "GE-" + s; }
  function paisDe(c) { return c === "Dubai" ? "Emirados Árabes Unidos" : c === "Lisboa" ? "Portugal" : c === "Online" ? "" : "Angola"; }
  function fim(e) { return new Date(e.fim || e.inicio).getTime(); }

  var MSG = {
    "Invalid login credentials": "Email ou palavra-passe incorrectos.",
    "User already registered": "Já existe uma conta com este email. Use «Entrar».",
    "Email not confirmed": "Ainda não confirmou o email. Veja a sua caixa de entrada (e o spam).",
    "Password should be at least 6 characters": "A palavra-passe deve ter pelo menos 6 caracteres.",
    "duplicate key value": "Já existe um registo com esse nome. Escolha outro.",
    "new row violates row-level security": "Sem permissão para esta acção.",
    "Failed to fetch": "Sem ligação à internet. Tente de novo."
  };
  function erro(e) {
    var m = (e && (e.message || e.error_description)) || String(e);
    for (var k in MSG) if (m.indexOf(k) >= 0) return new Error(MSG[k]);
    if (/rate limit/i.test(m)) return new Error("Demasiadas tentativas. Aguarde um minuto.");
    return new Error(m);
  }
  function ok(r) { if (r.error) throw erro(r.error); return r.data; }

  /* ===================================================================== */
  /* MODO REAL — SUPABASE                                                   */
  /* ===================================================================== */
  function apiLive() {
    var sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    var me = null;
    function G(r) { return { id: r.id, nome: r.nome, cidade: r.cidade, pais: r.pais || paisDe(r.cidade), categoria: r.categoria, temas: r.temas || [], descricao: r.descricao, desde: r.desde, estado: r.estado, destaque: r.destaque, criado_por: r.criado_por, nMembros: r.n_membros != null ? r.n_membros : 1 }; }
    function E(r) { return { id: r.id, grupo: r.grupo_id, titulo: r.titulo, descricao: r.descricao, inicio: r.inicio, fim: r.fim, formato: r.formato, local: r.local, endereco: r.endereco, cidade: r.cidade, preco: r.preco, precoTexto: r.preco_texto, vagas: r.vagas, certificado: r.certificado, oficial: r.oficial, link: r.link, estado: r.estado, nConfirmados: r.n_confirmados || 0 }; }
    function eventoRow(o) {
      var r = {}; var map = { titulo: "titulo", descricao: "descricao", inicio: "inicio", fim: "fim", formato: "formato", local: "local", endereco: "endereco", cidade: "cidade", preco: "preco", precoTexto: "preco_texto", vagas: "vagas", certificado: "certificado", oficial: "oficial", link: "link", estado: "estado", grupo: "grupo_id" };
      Object.keys(map).forEach(function (k) { if (o[k] !== undefined) r[map[k]] = o[k]; });
      ["inicio", "fim"].forEach(function (k) { if (r[k]) r[k] = new Date(r[k]).toISOString(); });
      return r;
    }
    function grupoRow(o) { var r = {}; ["nome", "cidade", "pais", "categoria", "temas", "descricao", "estado", "destaque"].forEach(function (k) { if (o[k] !== undefined) r[k] = o[k]; }); return r; }
    async function inserir(tabela, row) {
      for (var t = 0; t < 3; t++) {
        var r = await sb.from(tabela).insert(row);
        if (!r.error) return row.id;
        if (r.error.code !== "23505") throw erro(r.error);
        row.id = row.id.replace(/-[a-z0-9]{4}$/, "") + "-" + Math.random().toString(36).slice(2, 6);
      }
      throw new Error("Não foi possível gravar. Tente de novo.");
    }
    async function idLivre(tabela, base) { var id = base, k = 2; for (;;) { var r = await sb.from(tabela).select("id").eq("id", id).maybeSingle(); if (!r.data) return id; id = base + "-" + k++; } }

    return {
      live: true,
      async boot() {
        var s = (await sb.auth.getSession()).data.session;
        me = s ? s.user : null;
        var desde = new Date(Date.now() - 180 * 864e5).toISOString();
        var q = [sb.from("v_grupos").select("*"), sb.from("v_eventos").select("*").gte("inicio", desde).order("inicio")];
        if (me) q.push(sb.from("perfis").select("*").eq("id", me.id).maybeSingle(), sb.from("grupo_membros").select("grupo_id,funcao").eq("perfil_id", me.id),
          sb.from("inscricoes").select("evento_id,estado,codigo").eq("perfil_id", me.id).neq("estado", "cancelado"), sb.from("grupos").select("*").neq("estado", "aprovado"));
        var r = await Promise.all(q);
        var st = { user: null, grupos: ok(r[0]).map(G), eventos: ok(r[1]).map(E), membros: {}, rsvps: {} };
        if (me) {
          var p = ok(r[2]) || {};
          st.user = { id: me.id, email: me.email, nome: p.nome || "", telefone: p.telefone || "", cidade: p.cidade || "", cargo: p.cargo || "", organizacao: p.organizacao || "", papel: p.papel || "membro" };
          ok(r[3]).forEach(function (m) { st.membros[m.grupo_id] = m.funcao; });
          ok(r[4]).forEach(function (i) { st.rsvps[i.evento_id] = { estado: i.estado, codigo: i.codigo }; });
          var outros = ok(r[5]).map(G).filter(function (g) { return !st.grupos.some(function (x) { return x.id === g.id; }); });
          st.grupos = st.grupos.concat(outros);
          var ids = outros.map(function (g) { return g.id; });
          if (ids.length) { var ev = ok(await sb.from("eventos").select("*").in("grupo_id", ids)); st.eventos = st.eventos.concat(ev.map(E)); }
          if (st.user.papel === "admin" || Object.keys(st.membros).some(function (k) { return st.membros[k] === "organizador"; })) {
            var rasc = ok(await sb.from("eventos").select("*").eq("estado", "rascunho"));
            rasc.forEach(function (x) { if (!st.eventos.some(function (y) { return y.id === x.id; })) st.eventos.push(E(x)); });
          }
        }
        return st;
      },
      onAuth(cb) { sb.auth.onAuthStateChange(function (ev) { cb(ev); }); },
      async registar(o) {
        var r = await sb.auth.signUp({ email: o.email, password: o.password, options: { data: { nome: o.nome, telefone: o.telefone, cidade: o.cidade }, emailRedirectTo: location.origin + location.pathname } });
        var d = ok(r);
        return { confirmar: !d.session };
      },
      async entrar(email, password) { ok(await sb.auth.signInWithPassword({ email: email, password: password })); },
      async sair() { await sb.auth.signOut(); },
      async recuperar(email) { ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname + "#/nova-password" })); },
      async novaPassword(pw) { ok(await sb.auth.updateUser({ password: pw })); },
      async guardarPerfil(o) { var r = {}; ["nome", "telefone", "cidade", "cargo", "organizacao"].forEach(function (k) { if (o[k] !== undefined) r[k] = o[k]; }); ok(await sb.from("perfis").update(r).eq("id", me.id)); },

      async juntar(gid) { ok(await sb.from("grupo_membros").insert({ grupo_id: gid, perfil_id: me.id })); },
      async sairGrupo(gid) { ok(await sb.from("grupo_membros").delete().eq("grupo_id", gid).eq("perfil_id", me.id)); },
      async criarGrupo(o) { var row = grupoRow(o); row.id = await idLivre("grupos", slug(o.nome)); return inserir("grupos", row); },
      async editarGrupo(id, o) { ok(await sb.from("grupos").update(grupoRow(o)).eq("id", id)); },
      async apagarGrupo(id) { ok(await sb.from("grupos").delete().eq("id", id)); },
      async membros(gid) { return ok(await sb.from("v_membros").select("*").eq("grupo_id", gid).order("funcao", { ascending: false }).order("entrou_em").limit(300)).map(function (m) { return { id: m.perfil_id, nome: m.nome, cargo: m.cargo, org: m.funcao === "organizador" }; }); },
      async publicacoes(gid) { return ok(await sb.from("v_publicacoes").select("*").eq("grupo_id", gid).order("criado_em", { ascending: false }).limit(100)).map(function (c) { return { id: c.id, autor: c.perfil_id, nome: c.nome, t: c.texto, quando: c.criado_em }; }); },
      async publicar(gid, t) { ok(await sb.from("publicacoes").insert({ grupo_id: gid, texto: t, perfil_id: me.id })); },
      async apagarPublicacao(id) { ok(await sb.from("publicacoes").delete().eq("id", id)); },

      async participantes(eid) { return ok(await sb.from("v_participantes").select("*").eq("evento_id", eid).order("criado_em").limit(200)).map(function (p) { return { id: p.perfil_id, nome: p.nome, cargo: p.cargo }; }); },
      async comentarios(eid) { return ok(await sb.from("v_comentarios").select("*").eq("evento_id", eid).order("criado_em").limit(200)).map(function (c) { return { id: c.id, autor: c.perfil_id, nome: c.nome, t: c.texto, quando: c.criado_em }; }); },
      async comentar(eid, t) { ok(await sb.from("comentarios").insert({ evento_id: eid, texto: t, perfil_id: me.id })); },
      async apagarComentario(id) { ok(await sb.from("comentarios").delete().eq("id", id)); },
      async participar(eid, objectivo, b2b) { var d = ok(await sb.rpc("participar", { p_evento: eid, p_objectivo: objectivo, p_b2b: b2b })); return { estado: d[0].r_estado, codigo: d[0].r_codigo }; },
      async cancelar(eid) { ok(await sb.rpc("cancelar_participacao", { p_evento: eid })); },
      async criarEvento(o) { var row = eventoRow(o); row.id = await idLivre("eventos", slug(o.titulo)); return inserir("eventos", row); },
      async editarEvento(id, o) { ok(await sb.from("eventos").update(eventoRow(o)).eq("id", id)); },
      async apagarEvento(id) { ok(await sb.from("eventos").delete().eq("id", id)); },
      async listaInscricoes(eid) { return ok(await sb.rpc("lista_inscricoes", { p_evento: eid })); },
      async checkIn(eid, cod) { return ok(await sb.rpc("check_in", { p_evento: eid, p_codigo: cod })); },
      async marcarPresenca(id, p) { ok(await sb.rpc("marcar_presenca", { p_inscricao: id, p_presente: p })); },

      async adminResumo() { return ok(await sb.rpc("admin_resumo")); },
      async adminGrupos() {
        var r = await Promise.all([sb.from("grupos").select("*").order("criado_em", { ascending: false }), sb.from("v_grupos").select("id,n_membros")]);
        var n = {}; ok(r[1]).forEach(function (x) { n[x.id] = x.n_membros; });
        return ok(r[0]).map(function (g) { g.n_membros = n[g.id] != null ? n[g.id] : 1; return G(g); });
      },
      async adminEventos() {
        var r = await Promise.all([sb.from("eventos").select("*").order("inicio", { ascending: false }).limit(500), sb.from("v_eventos").select("id,n_confirmados")]);
        var n = {}; ok(r[1]).forEach(function (x) { n[x.id] = x.n_confirmados; });
        return ok(r[0]).map(function (e) { e.n_confirmados = n[e.id] || 0; return E(e); });
      },
      async adminUtilizadores(q) { return ok(await sb.rpc("admin_utilizadores", { p_q: q || "" })); },
      async adminPapel(id, papel) { ok(await sb.from("perfis").update({ papel: papel }).eq("id", id)); },
      async adminOrganizador(gid, email, org) { ok(await sb.rpc("admin_definir_organizador", { p_grupo: gid, p_email: email, p_org: org })); },
      async adminRecentes() {
        var r = await Promise.all([sb.from("v_comentarios").select("*").order("criado_em", { ascending: false }).limit(80), sb.from("v_publicacoes").select("*").order("criado_em", { ascending: false }).limit(80)]);
        return ok(r[0]).map(function (c) { return { tipo: "comentario", id: c.id, onde: c.evento_id, nome: c.nome, t: c.texto, quando: c.criado_em }; })
          .concat(ok(r[1]).map(function (c) { return { tipo: "publicacao", id: c.id, onde: c.grupo_id, nome: c.nome, t: c.texto, quando: c.criado_em }; }))
          .sort(function (a, b) { return new Date(b.quando) - new Date(a.quando); });
      }
    };
  }

  /* ===================================================================== */
  /* MODO DEMONSTRAÇÃO — tudo no browser                                    */
  /* ===================================================================== */
  function apiDemo() {
    var KEY = "gilfeventos.demo.v3";
    var db;
    try { db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { db = null; }
    if (!db || !db.grupos) db = semente();
    function guardar() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
    function semente() {
      var s = { sessao: null, users: [], membros: [], inscricoes: [], comentarios: [], publicacoes: [], materializado: {} };
      s.grupos = D.grupos.map(function (g, i) { return { id: g.id, nome: g.nome, cidade: g.cidade, pais: paisDe(g.cidade), categoria: g.categoria, temas: [g.categoria], descricao: g.descricao, desde: g.desde, estado: "aprovado", destaque: i < 3, criado_por: null, base: g.membros, orgs: g.organizadores || [] }; });
      s.eventos = D.eventos.map(function (e) { return { id: e.id, grupo: e.grupo, titulo: e.titulo, descricao: e.descricao, inicio: e.inicio, fim: e.fim, formato: e.formato, local: e.local || "", endereco: e.endereco || "", cidade: e.formato === "online" ? "Online" : e.cidade, preco: e.preco, precoTexto: e.precoTexto || "", vagas: e.vagas, certificado: !!e.certificado, oficial: !!e.oficial, link: e.link || "", estado: "publicado", base: e.inscritos }; });
      Object.keys(D.comentarios || {}).forEach(function (eid) { D.comentarios[eid].forEach(function (c, i) { s.comentarios.push({ id: uid() + i, evento: eid, autor: c[0], t: c[1], quando: new Date(Date.now() - (5 - i) * 36e5).toISOString() }); }); });
      Object.keys(D.discussoes || {}).forEach(function (gid) { D.discussoes[gid].forEach(function (c, i) { s.publicacoes.push({ id: uid() + i, grupo: gid, autor: c[0], t: c[1], quando: new Date(Date.now() - (9 - i) * 864e5).toISOString() }); }); });
      return s;
    }
    function pessoa(id) { var u = db.users.filter(function (x) { return x.id === id; })[0]; if (u) return u; return D.pessoas.filter(function (p) { return p.id === id; })[0] || { id: id, nome: "Membro", cargo: "" }; }
    function eu() { return db.sessao ? db.users.filter(function (u) { return u.id === db.sessao; })[0] || null : null; }
    function precisa() { var u = eu(); if (!u) throw new Error("Precisa de entrar na sua conta."); return u; }
    function isAdmin() { var u = eu(); return !!(u && u.papel === "admin"); }
    function isOrg(gid) { var u = eu(); if (!u) return false; if (u.papel === "admin") return true; return db.membros.some(function (m) { return m.g === gid && m.u === u.id && m.f === "organizador"; }); }
    function confReais(eid) { return db.inscricoes.filter(function (i) { return i.e === eid && i.estado === "confirmado" && !i.sint; }).length; }
    function G(g) { return { id: g.id, nome: g.nome, cidade: g.cidade, pais: g.pais, categoria: g.categoria, temas: g.temas, descricao: g.descricao, desde: g.desde, estado: g.estado, destaque: g.destaque, criado_por: g.criado_por, nMembros: (g.base || 0) + db.membros.filter(function (m) { return m.g === g.id; }).length }; }
    function E(e) { var o = {}; Object.keys(e).forEach(function (k) { if (k !== "base") o[k] = e[k]; }); o.nConfirmados = (e.base || 0) + confReais(e.id); return o; }
    function grupoVisivel(g) { var u = eu(); return g.estado === "aprovado" || (u && (g.criado_por === u.id || isOrg(g.id))); }
    function espera(ms) { return new Promise(function (r) { setTimeout(r, ms || 60); }); }
    function sinteticos(eid) {
      if (db.materializado[eid]) return;
      var e = db.eventos.filter(function (x) { return x.id === eid; })[0]; if (!e || !e.base) { db.materializado[eid] = 1; return; }
      var ps = D.pessoas.slice().sort(function (a, b) { return hash(eid + a.id) - hash(eid + b.id); }).slice(0, Math.min(e.base, D.pessoas.length));
      ps.forEach(function (p, i) { db.inscricoes.push({ id: uid() + i, e: eid, u: p.id, codigo: "GE-" + (hash(eid + p.id).toString(36).toUpperCase() + "XXXXXX").slice(0, 6), estado: "confirmado", objectivo: "Networking", b2b: true, checkin: null, criado: new Date(Date.now() - (30 - i) * 36e5).toISOString(), sint: true }); });
      db.materializado[eid] = 1;
    }

    return {
      live: false,
      async boot() {
        await espera(10);
        var u = eu(), st = { user: null, grupos: [], eventos: [], membros: {}, rsvps: {} };
        if (u) {
          st.user = { id: u.id, email: u.email, nome: u.nome, telefone: u.telefone, cidade: u.cidade, cargo: u.cargo || "", organizacao: u.organizacao || "", papel: u.papel };
          db.membros.forEach(function (m) { if (m.u === u.id) st.membros[m.g] = m.f; });
          db.inscricoes.forEach(function (i) { if (i.u === u.id && i.estado !== "cancelado") st.rsvps[i.e] = { estado: i.estado, codigo: i.codigo }; });
        }
        st.grupos = db.grupos.filter(grupoVisivel).map(G);
        var vis = {}; st.grupos.forEach(function (g) { vis[g.id] = g; });
        st.eventos = db.eventos.filter(function (e) { var g = vis[e.grupo]; return g && (e.estado !== "rascunho" && g.estado === "aprovado" || isOrg(e.grupo)); }).map(E);
        return st;
      },
      onAuth() {},
      async registar(o) {
        await espera();
        if (db.users.some(function (u) { return u.email.toLowerCase() === o.email.toLowerCase(); })) throw new Error("Já existe uma conta com este email. Use «Entrar».");
        if (String(o.password || "").length < 6) throw new Error("A palavra-passe deve ter pelo menos 6 caracteres.");
        var u = { id: uid(), email: o.email, pw: o.password, nome: o.nome, telefone: o.telefone, cidade: o.cidade, cargo: "", organizacao: "", papel: db.users.length === 0 ? "admin" : "membro", criado: new Date().toISOString() };
        db.users.push(u); db.sessao = u.id; guardar(); return { confirmar: false };
      },
      async entrar(email, pw) {
        await espera();
        var u = db.users.filter(function (x) { return x.email.toLowerCase() === String(email).toLowerCase(); })[0];
        if (!u || u.pw !== pw) throw new Error("Email ou palavra-passe incorrectos.");
        db.sessao = u.id; guardar();
      },
      async sair() { db.sessao = null; guardar(); },
      async recuperar() { await espera(); },
      async novaPassword(pw) { var u = precisa(); u.pw = pw; guardar(); },
      async guardarPerfil(o) { var u = precisa(); Object.keys(o).forEach(function (k) { u[k] = o[k]; }); guardar(); },

      async juntar(gid) { var u = precisa(); if (!db.membros.some(function (m) { return m.g === gid && m.u === u.id; })) db.membros.push({ g: gid, u: u.id, f: "membro", em: new Date().toISOString() }); guardar(); },
      async sairGrupo(gid) { var u = precisa(); db.membros = db.membros.filter(function (m) { return !(m.g === gid && m.u === u.id); }); guardar(); },
      async criarGrupo(o) {
        var u = precisa(), id = slug(o.nome), base = id, k = 2;
        while (db.grupos.some(function (g) { return g.id === id; })) id = base + "-" + k++;
        db.grupos.push({ id: id, nome: o.nome, cidade: o.cidade, pais: paisDe(o.cidade), categoria: o.categoria, temas: o.temas || [o.categoria], descricao: o.descricao, desde: String(new Date().getFullYear()), estado: u.papel === "admin" ? "aprovado" : "pendente", destaque: false, criado_por: u.id, base: 0, orgs: [] });
        db.membros.push({ g: id, u: u.id, f: "organizador", em: new Date().toISOString() }); guardar(); return id;
      },
      async editarGrupo(id, o) {
        if (!isOrg(id)) throw new Error("Sem permissão.");
        var g = db.grupos.filter(function (x) { return x.id === id; })[0];
        Object.keys(o).forEach(function (k) { if ((k === "estado" || k === "destaque") && !isAdmin()) return; g[k] = o[k]; });
        if (o.cidade) g.pais = paisDe(o.cidade); guardar();
      },
      async apagarGrupo(id) { if (!isAdmin()) throw new Error("Sem permissão."); db.grupos = db.grupos.filter(function (g) { return g.id !== id; }); db.eventos = db.eventos.filter(function (e) { return e.grupo !== id; }); guardar(); },
      async membros(gid) {
        await espera();
        var g = db.grupos.filter(function (x) { return x.id === gid; })[0] || {};
        var lista = [];
        if (g.base) D.pessoas.forEach(function (p) { if (hash(gid + p.id) % 3 !== 0 || (g.orgs || []).indexOf(p.id) >= 0) lista.push({ id: p.id, nome: p.nome, cargo: p.cargo, org: (g.orgs || []).indexOf(p.id) >= 0 }); });
        db.membros.filter(function (m) { return m.g === gid; }).forEach(function (m) { var u = pessoa(m.u); lista.unshift({ id: u.id, nome: u.nome, cargo: u.cargo || "", org: m.f === "organizador" }); });
        return lista.sort(function (a, b) { return (b.org ? 1 : 0) - (a.org ? 1 : 0); });
      },
      async publicacoes(gid) { await espera(); return db.publicacoes.filter(function (p) { return p.grupo === gid; }).map(function (p) { return { id: p.id, autor: p.autor, nome: pessoa(p.autor).nome, t: p.t, quando: p.quando }; }).reverse(); },
      async publicar(gid, t) { var u = precisa(); db.publicacoes.push({ id: uid(), grupo: gid, autor: u.id, t: t, quando: new Date().toISOString() }); guardar(); },
      async apagarPublicacao(id) { db.publicacoes = db.publicacoes.filter(function (p) { return p.id !== id; }); guardar(); },

      async participantes(eid) { await espera(); sinteticos(eid); return db.inscricoes.filter(function (i) { return i.e === eid && i.estado === "confirmado"; }).map(function (i) { var p = pessoa(i.u); return { id: p.id, nome: p.nome, cargo: p.cargo || "" }; }).reverse(); },
      async comentarios(eid) { await espera(); return db.comentarios.filter(function (c) { return c.evento === eid; }).map(function (c) { return { id: c.id, autor: c.autor, nome: pessoa(c.autor).nome, t: c.t, quando: c.quando }; }); },
      async comentar(eid, t) { var u = precisa(); db.comentarios.push({ id: uid(), evento: eid, autor: u.id, t: t, quando: new Date().toISOString() }); guardar(); },
      async apagarComentario(id) { db.comentarios = db.comentarios.filter(function (c) { return c.id !== id; }); guardar(); },
      async participar(eid, objectivo, b2b) {
        await espera(); var u = precisa(); sinteticos(eid);
        var e = db.eventos.filter(function (x) { return x.id === eid; })[0];
        if (!e || e.estado !== "publicado") throw new Error("Evento indisponível.");
        if (fim(e) < Date.now()) throw new Error("Este evento já terminou.");
        var ja = db.inscricoes.filter(function (i) { return i.e === eid && i.u === u.id; })[0];
        if (ja && ja.estado !== "cancelado") return { estado: ja.estado, codigo: ja.codigo };
        var conf = E(e).nConfirmados, est = conf >= e.vagas ? "espera" : "confirmado";
        if (ja) { ja.estado = est; ja.criado = new Date().toISOString(); ja.checkin = null; ja.objectivo = objectivo; ja.b2b = b2b; }
        else { ja = { id: uid(), e: eid, u: u.id, codigo: codigo(), estado: est, objectivo: objectivo, b2b: b2b, checkin: null, criado: new Date().toISOString() }; db.inscricoes.push(ja); }
        if (!db.membros.some(function (m) { return m.g === e.grupo && m.u === u.id; })) db.membros.push({ g: e.grupo, u: u.id, f: "membro", em: new Date().toISOString() });
        guardar(); return { estado: ja.estado, codigo: ja.codigo };
      },
      async cancelar(eid) {
        var u = precisa(), i = db.inscricoes.filter(function (x) { return x.e === eid && x.u === u.id; })[0]; if (!i) return;
        var era = i.estado; i.estado = "cancelado"; i.checkin = null;
        if (era === "confirmado") { var w = db.inscricoes.filter(function (x) { return x.e === eid && x.estado === "espera"; }).sort(function (a, b) { return a.criado < b.criado ? -1 : 1; })[0]; if (w) w.estado = "confirmado"; }
        guardar();
      },
      async criarEvento(o) {
        if (!isOrg(o.grupo)) throw new Error("Sem permissão.");
        var id = slug(o.titulo), base = id, k = 2; while (db.eventos.some(function (e) { return e.id === id; })) id = base + "-" + k++;
        var e = { id: id, estado: "publicado", oficial: false, link: "", precoTexto: "", base: 0 }; Object.keys(o).forEach(function (k2) { e[k2] = o[k2]; });
        if (!isAdmin()) e.oficial = false; db.eventos.push(e); guardar(); return id;
      },
      async editarEvento(id, o) {
        var e = db.eventos.filter(function (x) { return x.id === id; })[0]; if (!e || !isOrg(e.grupo)) throw new Error("Sem permissão.");
        Object.keys(o).forEach(function (k) { if (k === "oficial" && !isAdmin()) return; if (k === "grupo") return; e[k] = o[k]; }); guardar();
      },
      async apagarEvento(id) { var e = db.eventos.filter(function (x) { return x.id === id; })[0]; if (!e || !isOrg(e.grupo)) throw new Error("Sem permissão."); db.eventos = db.eventos.filter(function (x) { return x.id !== id; }); guardar(); },
      async listaInscricoes(eid) {
        await espera(); var e = db.eventos.filter(function (x) { return x.id === eid; })[0]; if (!e || !isOrg(e.grupo)) throw new Error("Sem permissão.");
        sinteticos(eid); guardar();
        return db.inscricoes.filter(function (i) { return i.e === eid && i.estado !== "cancelado"; }).map(function (i) {
          var p = pessoa(i.u); return { id: i.id, nome: p.nome, telefone: p.telefone || "+244 9" + String(hash(p.id) % 100000000).padStart(8, "0"), email: p.email || slug(p.nome).replace(/-/g, ".") + "@exemplo.ao", cargo: p.cargo || "", organizacao: p.organizacao || "", estado: i.estado, codigo: i.codigo, objectivo: i.objectivo, quer_b2b: i.b2b, check_in_em: i.checkin, criado_em: i.criado };
        }).sort(function (a, b) { return a.estado === b.estado ? (a.criado_em < b.criado_em ? -1 : 1) : a.estado === "confirmado" ? -1 : 1; });
      },
      async checkIn(eid, cod) {
        var e = db.eventos.filter(function (x) { return x.id === eid; })[0]; if (!e || !isOrg(e.grupo)) throw new Error("Sem permissão.");
        sinteticos(eid); var c = String(cod).split("|")[0].trim().toUpperCase();
        var i = db.inscricoes.filter(function (x) { return x.e === eid && x.codigo === c; })[0];
        if (!i) return { ok: false, msg: "Código não encontrado neste evento." };
        var nome = pessoa(i.u).nome;
        if (i.estado !== "confirmado") return { ok: false, msg: nome + " não tem lugar confirmado (" + i.estado + ")." };
        if (i.checkin) return { ok: true, ja: true, nome: nome };
        i.checkin = new Date().toISOString(); guardar(); return { ok: true, ja: false, nome: nome };
      },
      async marcarPresenca(id, p) { var i = db.inscricoes.filter(function (x) { return x.id === id; })[0]; if (i) { i.checkin = p ? new Date().toISOString() : null; guardar(); } },

      async adminResumo() {
        if (!isAdmin()) throw new Error("Sem permissão.");
        var agora = Date.now();
        return { utilizadores: db.users.length + D.pessoas.length, grupos: db.grupos.filter(function (g) { return g.estado === "aprovado"; }).length, pendentes: db.grupos.filter(function (g) { return g.estado === "pendente"; }).length,
          eventos: db.eventos.filter(function (e) { return e.estado === "publicado" && fim(e) >= agora; }).length,
          inscricoes: db.eventos.reduce(function (a, e) { return a + E(e).nConfirmados; }, 0), presencas: db.inscricoes.filter(function (i) { return i.checkin; }).length,
          novos7: db.users.filter(function (u) { return agora - new Date(u.criado).getTime() < 7 * 864e5; }).length };
      },
      async adminGrupos() { if (!isAdmin()) throw new Error("Sem permissão."); return db.grupos.map(G).reverse(); },
      async adminEventos() { if (!isAdmin()) throw new Error("Sem permissão."); return db.eventos.map(E).sort(function (a, b) { return new Date(b.inicio) - new Date(a.inicio); }); },
      async adminUtilizadores(q) {
        if (!isAdmin()) throw new Error("Sem permissão."); q = String(q || "").toLowerCase();
        var todos = db.users.map(function (u) { return { id: u.id, nome: u.nome, email: u.email, telefone: u.telefone, cidade: u.cidade, cargo: u.cargo, organizacao: u.organizacao, papel: u.papel, criado_em: u.criado }; })
          .concat(D.pessoas.map(function (p, i) { return { id: p.id, nome: p.nome, email: slug(p.nome).replace(/-/g, ".") + "@exemplo.ao", telefone: "", cidade: "Luanda", cargo: p.cargo, organizacao: "", papel: "membro", criado_em: new Date(Date.now() - (i + 3) * 864e5 * 9).toISOString(), demo: true }; }));
        todos.forEach(function (t) { t.n_inscricoes = db.inscricoes.filter(function (i) { return i.u === t.id && i.estado === "confirmado"; }).length; t.n_presencas = db.inscricoes.filter(function (i) { return i.u === t.id && i.checkin; }).length; });
        return todos.filter(function (t) { return !q || (t.nome + " " + t.email + " " + t.telefone).toLowerCase().indexOf(q) >= 0; });
      },
      async adminPapel(id, papel) { if (!isAdmin()) throw new Error("Sem permissão."); var u = db.users.filter(function (x) { return x.id === id; })[0]; if (!u) throw new Error("Os membros de exemplo não podem ser alterados."); u.papel = papel; guardar(); },
      async adminOrganizador(gid, email, org) {
        if (!isAdmin()) throw new Error("Sem permissão.");
        var u = db.users.filter(function (x) { return x.email.toLowerCase() === String(email).trim().toLowerCase(); })[0]; if (!u) throw new Error("Não existe conta com esse email.");
        var m = db.membros.filter(function (x) { return x.g === gid && x.u === u.id; })[0];
        if (m) m.f = org ? "organizador" : "membro"; else db.membros.push({ g: gid, u: u.id, f: org ? "organizador" : "membro", em: new Date().toISOString() }); guardar();
      },
      async adminRecentes() {
        if (!isAdmin()) throw new Error("Sem permissão.");
        return db.comentarios.map(function (c) { return { tipo: "comentario", id: c.id, onde: c.evento, nome: pessoa(c.autor).nome, t: c.t, quando: c.quando }; })
          .concat(db.publicacoes.map(function (c) { return { tipo: "publicacao", id: c.id, onde: c.grupo, nome: pessoa(c.autor).nome, t: c.t, quando: c.quando }; }))
          .sort(function (a, b) { return new Date(b.quando) - new Date(a.quando); });
      },
      reporDemo() { try { localStorage.removeItem(KEY); } catch (e) {} db = semente(); }
    };
  }

  window.GE_API = LIVE ? apiLive() : apiDemo();
})();
