/* GiLF Eventos — interface (site público, organizadores e administração). */
(function () {
  "use strict";
  var API = window.GE_API, D = window.GE_DATA;
  var main = document.getElementById("main"), modal = document.getElementById("modal"), mBody = document.getElementById("mBody");
  var ST = { user: null, grupos: [], eventos: [], membros: {}, rsvps: {} };
  var C = {}, PEND = {};
  var P2 = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ================= utilidades ================= */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function hash(s) { var h = 0; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function qsParse(s) { var o = {}; (s || "").split("&").forEach(function (kv) { if (!kv) return; var p = kv.split("="); o[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); }); return o; }
  function qsBuild(o) { var a = []; Object.keys(o).forEach(function (k) { if (o[k]) a.push(encodeURIComponent(k) + "=" + encodeURIComponent(o[k])); }); return a.length ? "?" + a.join("&") : ""; }
  function copia(o) { var r = {}; Object.keys(o).forEach(function (k) { r[k] = o[k]; }); return r; }
  function kz(v) { return new Intl.NumberFormat("pt-PT").format(v) + " Kz"; }
  function wa(msg, num) { return "https://wa.me/" + (num ? String(num).replace(/\D/g, "") : D.org.whatsapp) + "?text=" + encodeURIComponent(msg); }
  function toast(t, mau) { var el = document.createElement("div"); el.className = "toast" + (mau ? " toast--mau" : ""); el.setAttribute("role", "status"); el.textContent = t; document.body.appendChild(el); setTimeout(function () { el.remove(); }, mau ? 4200 : 2400); }
  function cap1(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

  var fWd = new Intl.DateTimeFormat("pt-PT", { weekday: "short" });
  var fMs = new Intl.DateTimeFormat("pt-PT", { month: "short" });
  var fLong = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var fCurta = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
  var fHora = new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" });
  var fMesAno = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" });
  function dt(s) { return new Date(s); }
  function ymd(d) { return d.getFullYear() + "-" + P2(d.getMonth() + 1) + "-" + P2(d.getDate()); }
  function hm(d) { return P2(d.getHours()) + ":" + P2(d.getMinutes()); }
  function dia0(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function addD(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function quando(s) {
    var d = dt(s), diff = Math.round((dia0(d) - dia0(new Date())) / 864e5);
    var dia = diff === 0 ? "Hoje" : diff === 1 ? "Amanhã" : fWd.format(d) + ", " + d.getDate() + " de " + fMs.format(d);
    return (dia + " · " + fHora.format(d)).toUpperCase();
  }
  function haQuanto(s) { var m = Math.round((Date.now() - dt(s)) / 6e4); return m < 1 ? "agora" : m < 60 ? "há " + m + " min" : m < 1440 ? "há " + Math.round(m / 60) + " h" : fCurta.format(dt(s)); }

  /* ================= ícones e imagens ================= */
  var PATH = {
    investimento: "M3 17l6-6 4 4 8-8M15 7h6v6", lideranca: "M5 21V4M5 4h12l-2.5 4L17 12H5", digital: "M4 5h16v11H4zM2 20h20M10 16v4M14 16v4",
    empreendedorismo: "M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2M9 15l-3-3c2-6 7-9 14-9 0 7-3 12-9 14zM15 9h.01", mulheres: "M12 13a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 13v8M8.5 17.5h7",
    jovens: "M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6", networking: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3",
    agro: "M5 19C5 10 10 5 20 4c-1 10-6 15-15 15zM5 19l7-7", cultura: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5s1-1.5 2-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8.5-9-8.5zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01",
    saude: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5", cal: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4", clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    pin: "M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", video: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
    users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3", ticket: "M3 8V6h18v2a2 2 0 0 0 0 4v2H3v-2a2 2 0 0 0 0-4zM3 14v4h18v-4",
    share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
    check: "M5 12.5l4.5 4.5L19 7.5", plus: "M12 5v14M5 12h14", left: "M15 6l-6 6 6 6", right: "M9 6l6 6-6 6", star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
    award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14l-1.5 7 5-3 5 3-1.5-7", edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4", trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
    shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z", qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z",
    download: "M12 4v11M7 10l5 5 5-5M4 20h16", list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
  };
  function ic(n, cls) { return '<svg class="' + (cls || "ic") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (PATH[n] || PATH.users) + '"/></svg>'; }
  var CORES = { investimento: ["#0d5446", "#22a07c"], lideranca: ["#7d0f14", "#e0383e"], digital: ["#1a2766", "#4466e0"], empreendedorismo: ["#8a4300", "#f08c1c"], mulheres: ["#6a1650", "#d2489a"], jovens: ["#0b5868", "#1ab0c4"], networking: ["#38246a", "#8462e0"], agro: ["#2d5710", "#72b236"], cultura: ["#8b2600", "#f0612f"], saude: ["#0a5636", "#31c278"] };
  function cores(c) { return CORES[c] || CORES.lideranca; }
  function capa(cat, seed, oficial) {
    if (oficial) return '<div class="cover cover--gilf"><img src="img/gilf-mark.png" alt=""></div>';
    var c = cores(cat), h = hash(seed), circ = "";
    for (var i = 0; i < 4; i++) circ += '<circle cx="' + ((h >> (i * 3)) % 400) + '" cy="' + ((h >> (i * 4 + 1)) % 225) + '" r="' + (30 + ((h >> (i * 2)) % 90)) + '" fill="#fff" opacity="' + (0.05 + (i % 3) * 0.04) + '"/>';
    circ += '<path d="M0 ' + (150 + h % 50) + " Q 120 " + (110 + h % 60) + " 220 " + (165 + h % 30) + " T 400 " + (140 + h % 40) + ' V225 H0z" fill="#000" opacity=".12"/>';
    return '<div class="cover" style="--c1:' + c[0] + ";--c2:" + c[1] + ";--a:" + (100 + h % 80) + 'deg"><svg class="art" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + circ + '</svg><svg class="cic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (PATH[cat] || PATH.users) + '"/></svg></div>';
  }
  function iniciais(n) { var p = String(n || "?").trim().split(/\s+/); return (p[0].charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : "")).toUpperCase(); }
  function av(nome, cls) { return '<span class="av ' + (cls || "") + '" style="--h:' + (hash(nome) % 360) + '" title="' + esc(nome) + '">' + esc(iniciais(nome)) + "</span>"; }

  /* ================= estado ================= */
  function grupo(id) { return byId(ST.grupos, id); }
  function evento(id) { return byId(ST.eventos, id); }
  function cat(id) { return byId(D.categorias, id) || { id: id, nome: id || "" }; }
  function isAdmin() { return !!(ST.user && ST.user.papel === "admin"); }
  function souOrg(gid) { return isAdmin() || ST.membros[gid] === "organizador"; }
  function souMembro(gid) { return !!ST.membros[gid]; }
  function rsvp(eid) { return ST.rsvps[eid] || null; }
  function vou(eid) { var r = rsvp(eid); return !!(r && r.estado === "confirmado"); }
  function cheio(e) { return e.nConfirmados >= e.vagas; }
  function catEvento(e) { var g = grupo(e.grupo); return g ? g.categoria : "networking"; }
  function precoTxt(e) { return e.preco == null ? (e.precoTexto || "Ver condições") : e.preco === 0 ? "Gratuito" : kz(e.preco); }
  function lugarTxt(e) { return e.formato === "online" ? "Evento online" : [e.endereco, e.cidade && e.cidade !== e.endereco ? e.cidade : ""].filter(Boolean).join(", ") || "A confirmar"; }
  function futuro(e) { return dt(e.fim || e.inicio).getTime() >= Date.now(); }
  function porData(a, b) { return dt(a.inicio) - dt(b.inicio); }
  function visivel(e) { return e.estado === "publicado" || e.estado === "cancelado"; }
  function proximos() { return ST.eventos.filter(function (e) { var g = grupo(e.grupo); return futuro(e) && e.estado === "publicado" && g && g.estado === "aprovado"; }).sort(porData); }
  function pontos() {
    var p = 0; Object.keys(ST.rsvps).forEach(function (k) { p += ST.rsvps[k].estado === "confirmado" ? 10 : 2; });
    Object.keys(ST.membros).forEach(function (k) { p += ST.membros[k] === "organizador" ? 30 : 5; });
    if (ST.user && ST.user.cargo && ST.user.cidade) p += 10; return p;
  }

  async function carregar() { try { ST = await API.boot(); } catch (e) { toast("Não foi possível carregar: " + e.message, true); } }
  function need(key, fn) {
    if (Object.prototype.hasOwnProperty.call(C, key)) return C[key];
    if (!PEND[key]) {
      PEND[key] = 1; var rota = location.hash;
      fn().then(function (v) { C[key] = v; }, function (e) { C[key] = { erro: e.message }; }).then(function () { delete PEND[key]; if (location.hash === rota && modal.hidden) render(); });
    }
    return undefined;
  }
  function limpar(pref) { Object.keys(C).forEach(function (k) { if (!pref || k.indexOf(pref) === 0) delete C[k]; }); }
  async function acao(fn, msg, prefs) {
    document.body.classList.add("busy");
    try { var r = await fn(); (prefs || []).forEach(limpar); await carregar(); desenharTopo(); render(); if (msg) toast(msg); return r; }
    catch (e) { toast(e.message, true); throw e; }
    finally { document.body.classList.remove("busy"); }
  }
  function carregando() { return '<div class="loading" aria-live="polite"><span></span>A carregar…</div>'; }
  function falhou(v) { return v && v.erro ? '<div class="empty">' + esc(v.erro) + "</div>" : ""; }

  /* ================= componentes ================= */
  function cardEvento(e) {
    var g = grupo(e.grupo) || {}, r = rsvp(e.id);
    var badges = (e.oficial ? '<span class="badge badge--gold">Evento oficial</span>' : "") + (e.formato === "online" ? '<span class="badge">' + ic("video") + "Online</span>" : "") +
      (e.estado === "cancelado" ? '<span class="badge badge--brand">Cancelado</span>' : r ? (r.estado === "confirmado" ? '<span class="badge badge--ok">' + ic("check") + "Vai</span>" : '<span class="badge">Lista de espera</span>') : cheio(e) ? '<span class="badge badge--brand">Esgotado</span>' : "");
    return '<a class="ecard" href="#/evento/' + e.id + '"><div class="ratio">' + capa(catEvento(e), e.id, e.oficial) + '<div class="badges">' + badges + "</div></div>" +
      '<div><div class="when">' + esc(quando(e.inicio)) + "</div><h3>" + esc(e.titulo) + '</h3><div class="by">' + esc(g.nome || "") + "</div></div>" +
      '<div class="row">' + ic("users") + "<span>" + e.nConfirmados + ' participantes</span><span class="dot">' + esc(precoTxt(e)) + "</span></div></a>";
  }
  function itemEvento(e) {
    var g = grupo(e.grupo) || {};
    return '<a class="ritem" href="#/evento/' + e.id + '"><div class="ratio">' + capa(catEvento(e), e.id, e.oficial) + "</div><div>" +
      '<div class="when">' + esc(quando(e.inicio)) + "</div><h3>" + esc(e.titulo) + '</h3><div class="by">' + esc(g.nome || "") + " · " + esc(lugarTxt(e)) + "</div>" +
      '<div class="row" style="margin-top:8px">' + (e.oficial ? '<span class="badge badge--gold">Oficial</span>' : "") + (e.formato === "online" ? '<span class="badge badge--teal">Online</span>' : "") +
      (e.estado === "cancelado" ? '<span class="badge badge--brand">Cancelado</span>' : e.estado === "rascunho" ? '<span class="badge badge--line">Rascunho</span>' : vou(e.id) ? '<span class="badge badge--ok">Vai</span>' : cheio(e) ? '<span class="badge badge--brand">Esgotado</span>' : "") +
      "<span>" + e.nConfirmados + ' participantes</span><span class="dot hide-s">' + esc(precoTxt(e)) + "</span></div></div></a>";
  }
  function cardGrupo(g) {
    var n = proximos().filter(function (e) { return e.grupo === g.id; }).length;
    var tag = g.estado !== "aprovado" ? '<span class="badge badge--gold">' + (g.estado === "pendente" ? "Em análise" : "Rejeitado") + "</span>" : ST.membros[g.id] === "organizador" ? '<span class="badge badge--gold">Organizador</span>' : "";
    return '<a class="gcard" href="#/grupo/' + g.id + '"><div class="ratio">' + capa(g.categoria, g.id) + (tag ? '<div class="badges">' + tag + "</div>" : "") + "</div>" +
      "<div><h3>" + esc(g.nome) + '</h3><div class="by">' + esc(g.cidade) + "</div></div>" +
      '<div class="row"><span>' + g.nMembros + ' membros</span><span class="dot">' + (n ? n + (n === 1 ? " evento" : " eventos") : "Sem eventos marcados") + "</span>" + (souMembro(g.id) && ST.membros[g.id] !== "organizador" ? '<span class="badge badge--ok">Membro</span>' : "") + "</div></a>";
  }
  function grade(items, cls) { return items.length ? '<div class="grid ' + (cls || "") + '">' + items.join("") + "</div>" : '<div class="empty">Nada para mostrar aqui.</div>'; }

  /* ================= cabeçalho ================= */
  function desenharTopo() {
    var r = document.getElementById("topR");
    if (ST.user) {
      r.innerHTML = '<a class="iconbtn" href="#/procurar" aria-label="Pesquisar">' + ic("search") + "</a>" +
        (isAdmin() ? '<a class="tlink tlink--hide" href="#/admin">' + ic("shield") + " Administração</a>" : '<a class="tlink tlink--hide" href="#/criar-grupo">Criar grupo</a>') +
        '<div class="me"><button class="me__btn" type="button" data-act="menu" aria-label="Menu da conta" aria-expanded="false" aria-controls="meMenu">' + av(ST.user.nome || ST.user.email) + "</button>" +
        '<div class="menu" id="meMenu"><div style="padding:8px 12px"><b>' + esc(ST.user.nome || ST.user.email) + '</b><div class="small">' + pontos() + " pontos de liderança</div></div><hr>" +
        '<a href="#/conta">Os meus eventos</a><a href="#/conta?tab=grupos">Os meus grupos</a><a href="#/criar-grupo">Criar grupo</a><a href="#/conta?tab=perfil">Perfil</a>' +
        (isAdmin() ? '<hr><a href="#/admin">Administração</a>' : "") + '<hr><button type="button" data-act="sair">Sair</button></div></div>';
    } else {
      r.innerHTML = '<a class="iconbtn" href="#/procurar" aria-label="Pesquisar">' + ic("search") + "</a>" +
        '<a class="tlink tlink--hide" href="#/criar-grupo">Criar grupo</a><button class="tlink" style="border:0;background:none" type="button" data-act="entrar">Entrar</button>' +
        '<button class="btn btn--sm" type="button" data-act="registar">Registar</button>';
    }
  }

  /* ================= páginas públicas ================= */
  function pgInicio() {
    var ev = proximos(), cidade = (ST.user && D.cidades.indexOf(ST.user.cidade) >= 0 && ST.user.cidade) || "Luanda";
    var online = ev.filter(function (e) { return e.formato === "online"; }).slice(0, 4);
    var perto = ev.filter(function (e) { return e.cidade === cidade && e.formato !== "online"; }).slice(0, 4);
    if (!perto.length) perto = ev.filter(function (e) { return e.formato !== "online"; }).slice(0, 4);
    var meus = ev.filter(function (e) { return rsvp(e.id); });
    var aprovados = ST.grupos.filter(function (g) { return g.estado === "aprovado"; });
    var topo;
    if (ST.user) {
      topo = '<section class="welcome"><div class="wrap"><h1>Olá, ' + esc((ST.user.nome || "").split(" ")[0] || "bem-vindo") + "</h1>" +
        (meus.length ? '<div class="sec__head" style="margin-top:18px"><h2>Os seus próximos eventos</h2><a class="link" href="#/conta">Ver todos</a></div>' + grade(meus.slice(0, 4).map(cardEvento))
          : '<p class="muted">Ainda não tem eventos marcados. Explore abaixo e junte-se a um grupo perto de si.</p>') + "</div></section>";
    } else {
      var total = aprovados.reduce(function (a, g) { return a + g.nMembros; }, 0);
      topo = '<section class="hero"><div class="wrap hero__in"><div>' +
        "<h1>A plataforma de quem <em>lidera</em> — onde os interesses viram negócios e amizades</h1>" +
        "<p>Encontre grupos de líderes, investidores, empreendedores e da diáspora angolana. Participe em encontros todos os meses, perto de si ou online. O GiLF acontece uma vez por ano; a rede, todos os dias.</p>" +
        '<div class="btns"><button class="btn btn--lg" type="button" data-act="registar">Juntar-me ao GiLF Eventos</button><a class="btn btn--line btn--lg" href="#/procurar">Ver eventos</a></div></div>' +
        '<div class="collage" aria-hidden="true"><div class="c1">' + capa("lideranca", "hero1") + '</div><div class="c2">' + capa("digital", "hero2") + '</div><div class="c3">' + capa("investimento", "hero3") + "</div>" +
        (total > 20 ? '<div class="bubble"><span class="stack">' + av("A D", "av--s") + av("B K", "av--s") + av("K F", "av--s") + "</span>" + total.toLocaleString("pt-PT") + " membros</div>" : "") + "</div></div></section>";
    }
    main.innerHTML = topo +
      '<section class="sec"><div class="wrap"><div class="sec__head"><h2>Eventos perto de ' + esc(cidade) + '</h2><a class="link" href="#/procurar?cidade=' + encodeURIComponent(cidade) + '">Ver todos os eventos</a></div>' + grade(perto.map(cardEvento)) + "</div></section>" +
      (online.length ? '<section class="sec"><div class="wrap"><div class="sec__head"><h2>Próximos eventos online</h2><a class="link" href="#/procurar?formato=online">Ver todos</a></div>' + grade(online.map(cardEvento)) + "</div></section>" : "") +
      '<section class="sec" id="categorias"><div class="wrap"><div class="sec__head"><h2>Explore as principais categorias</h2></div><div class="cats">' +
        D.categorias.map(function (c) { var k = cores(c.id); return '<a class="cat" href="#/procurar?cat=' + c.id + '"><span class="cat__ic" style="--c1:' + k[0] + ";--c2:" + k[1] + '">' + ic(c.id) + "</span>" + esc(c.nome) + "</a>"; }).join("") + "</div></div></section>" +
      '<section class="sec sec--soft"><div class="wrap"><div class="sec__head"><h2>Grupos populares</h2><a class="link" href="#/procurar?tipo=grupos">Ver todos os grupos</a></div>' +
        grade(aprovados.slice().sort(function (a, b) { return (b.destaque ? 1e6 : 0) + b.nMembros - (a.destaque ? 1e6 : 0) - a.nMembros; }).slice(0, 6).map(cardGrupo), "grid--3") + "</div></section>" +
      '<section class="sec"><div class="wrap"><div class="sec__head"><h2>Como funciona o GiLF Eventos</h2></div><div class="how">' +
        '<a href="#/procurar?tipo=grupos"><div class="ill">' + ic("users") + '</div><h3>Junte-se a um grupo</h3><p class="small" style="margin:0">Grupos por cidade e por tema. Receba os convites e não perca nenhum encontro.</p></a>' +
        '<a href="#/procurar"><div class="ill">' + ic("ticket") + '</div><h3>Encontre um evento</h3><p class="small" style="margin:0">Confirme a participação num toque. Entre com o bilhete QR e receba sugestões de reuniões B2B.</p></a>' +
        '<a href="#/criar-grupo"><div class="ill">' + ic("plus") + '</div><h3>Crie um grupo</h3><p class="small" style="margin:0">Lidere a comunidade da sua cidade ou sector, com o apoio da Luadeira e da marca GiLF.</p></a></div></div></section>' +
      '<section class="sec"><div class="wrap"><div class="sec__head"><h2>Cidades</h2></div><div class="cities">' +
        D.cidades.map(function (c, i) { var n = ev.filter(function (e) { return e.cidade === c; }).length; return '<a class="city" href="#/procurar?cidade=' + encodeURIComponent(c) + '">' + capa(D.categorias[i % D.categorias.length].id, "city" + c) + "<span>" + esc(c) + "<small>" + n + (n === 1 ? " evento" : " eventos") + "</small></span></a>"; }).join("") + "</div></div></section>" +
      '<section class="sec"><div class="wrap"><div class="band"><div><h2>Leve o GiLF à sua cidade</h2><p>Crie um grupo e organize encontros com o apoio da Luadeira Digital Angola: inscrições, check-in por QR, lista de espera e ligação aos parceiros do GiLF.</p></div><a class="btn btn--lg" href="#/criar-grupo">Criar um grupo</a></div></div></section>';
  }

  var calMes = null;
  function intervalo(dia) {
    var h = dia0(new Date()), wd = h.getDay();
    if (dia === "hoje") return [h, addD(h, 1)];
    if (dia === "amanha") return [addD(h, 1), addD(h, 2)];
    if (dia === "fim-de-semana") { var sab = wd === 0 ? addD(h, -1) : addD(h, 6 - wd); return [wd === 0 ? h : sab, addD(sab, 2)]; }
    var seg = addD(h, ((8 - wd) % 7) || 7);
    if (dia === "semana") return [h, seg];
    if (dia === "proxima-semana") return [seg, addD(seg, 7)];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dia || "")) { var d = new Date(dia + "T00:00"); return [d, addD(d, 1)]; }
    return null;
  }
  function pgProcurar(q) {
    var tipo = q.tipo === "grupos" ? "grupos" : "eventos";
    function sel(name, label, opts) { return '<select data-f="' + name + '" aria-label="' + label + '"><option value="">' + label + "</option>" + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (q[name] === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>"; }
    var temFiltro = q.q || q.cidade || q.cat || q.dia || q.formato || q.preco;
    var titulo = q.q ? "Resultados para «" + esc(q.q) + "»" : tipo === "grupos" ? "Grupos" + (q.cidade ? " em " + esc(q.cidade) : "") : "Eventos" + (q.cidade ? " perto de " + esc(q.cidade) : "");
    var filtros = '<div class="filters">' +
      (tipo === "eventos" ? sel("dia", "Qualquer dia", [["hoje", "Hoje"], ["amanha", "Amanhã"], ["fim-de-semana", "Este fim de semana"], ["semana", "Esta semana"], ["proxima-semana", "Próxima semana"]].concat(/^\d{4}/.test(q.dia || "") ? [[q.dia, fLong.format(new Date(q.dia + "T00:00"))]] : [])) + sel("formato", "Qualquer tipo", [["presencial", "Presencial"], ["online", "Online"]]) : "") +
      sel("cidade", "Qualquer cidade", ["Online"].concat(D.cidades).map(function (c) { return [c, c]; })) + sel("cat", "Qualquer categoria", D.categorias.map(function (c) { return [c.id, c.nome]; })) +
      (tipo === "eventos" ? sel("preco", "Qualquer preço", [["gratis", "Gratuitos"], ["pago", "Pagos"]]) : "") +
      (temFiltro ? '<button class="clear" type="button" data-act="limpar">Limpar filtros</button>' : "") + "</div>";
    var txt = (q.q || "").toLowerCase(), res;
    if (tipo === "grupos") {
      res = ST.grupos.filter(function (g) {
        if (g.estado !== "aprovado") return false;
        if (q.cidade && g.cidade !== q.cidade) return false;
        if (q.cat && g.categoria !== q.cat && (g.temas || []).indexOf(q.cat) < 0) return false;
        return !txt || (g.nome + " " + g.descricao + " " + g.cidade + " " + cat(g.categoria).nome).toLowerCase().indexOf(txt) >= 0;
      }).sort(function (a, b) { return b.nMembros - a.nMembros; });
    } else {
      var iv = intervalo(q.dia);
      res = proximos().filter(function (e) {
        var g = grupo(e.grupo) || {};
        if (q.cidade && (q.cidade === "Online" ? e.formato !== "online" : e.cidade !== q.cidade)) return false;
        if (q.formato && e.formato !== q.formato) return false;
        if (q.cat && g.categoria !== q.cat) return false;
        if (q.preco === "gratis" && e.preco !== 0) return false;
        if (q.preco === "pago" && !(e.preco > 0)) return false;
        if (iv) { var t = dt(e.inicio); if (t < iv[0] || t >= iv[1]) return false; }
        return !txt || (e.titulo + " " + e.descricao + " " + (e.cidade || "") + " " + g.nome + " " + cat(g.categoria).nome).toLowerCase().indexOf(txt) >= 0;
      });
    }
    var tabQ = function (t) { var o = copia(q); o.tipo = t === "grupos" ? "grupos" : ""; if (t === "grupos") { o.dia = ""; o.formato = ""; o.preco = ""; } return "#/procurar" + qsBuild(o); };
    main.innerHTML = '<div class="wrap search-page"><div><h1 style="font-size:clamp(1.4rem,3vw,1.9rem)">' + titulo + "</h1>" +
      '<form class="filters" id="pq" role="search" style="margin:12px 0 6px"><input name="q" type="search" placeholder="Pesquisar eventos e grupos" aria-label="Pesquisar" value="' + esc(q.q || "") + '" style="flex:1 1 240px;border-radius:10px"><button class="btn btn--sm" type="submit">Pesquisar</button></form>' +
      '<div class="tabs"><a href="' + tabQ("eventos") + '" class="' + (tipo === "eventos" ? "on" : "") + '">Eventos</a><a href="' + tabQ("grupos") + '" class="' + (tipo === "grupos" ? "on" : "") + '">Grupos</a></div>' +
      filtros + '<p class="small">' + res.length + (tipo === "grupos" ? " grupos" : " eventos") + "</p>" +
      (tipo === "grupos" ? grade(res.map(cardGrupo), "grid--3") : res.length ? res.map(itemEvento).join("") : '<div class="empty">Nenhum evento com estes filtros.' + (temFiltro ? ' <button class="link" style="border:0;background:none" type="button" data-act="limpar">Limpar filtros</button>' : "") + "</div>") +
      "</div><aside>" + (tipo === "eventos" ? '<div class="cal" id="cal"></div>' : "") + "</aside></div>";
    main.querySelectorAll("[data-f]").forEach(function (s) { s.addEventListener("change", function () { var o = copia(q); o[s.dataset.f] = s.value; location.hash = "#/procurar" + qsBuild(o); }); });
    document.getElementById("pq").addEventListener("submit", function (ev) { ev.preventDefault(); var o = copia(q); o.q = new FormData(this).get("q"); location.hash = "#/procurar" + qsBuild(o); });
    if (tipo === "eventos") desenharCal(q);
  }
  function desenharCal(q) {
    var el = document.getElementById("cal"); if (!el) return;
    var hoje = dia0(new Date()); if (!calMes) calMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    var dias = {}; proximos().forEach(function (e) { dias[ymd(dt(e.inicio))] = 1; });
    var first = new Date(calMes), off = (first.getDay() + 6) % 7, total = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    var h = '<div class="cal__h"><button type="button" data-cal="-1" aria-label="Mês anterior">' + ic("left") + "</button><span>" + esc(cap1(fMesAno.format(first))) + '</span><button type="button" data-cal="1" aria-label="Mês seguinte">' + ic("right") + '</button></div><div class="cal__g">' + ["S", "T", "Q", "Q", "S", "S", "D"].map(function (d) { return "<b>" + d + "</b>"; }).join("");
    for (var i = 0; i < off; i++) h += "<span></span>";
    for (var d = 1; d <= total; d++) {
      var day = new Date(first.getFullYear(), first.getMonth(), d), k = ymd(day), cls = [];
      if (dias[k]) cls.push("has"); if (k === ymd(hoje)) cls.push("today"); if (q.dia === k) cls.push("sel"); if (day < hoje) cls.push("past");
      h += '<button type="button" class="' + cls.join(" ") + '" data-dia="' + k + '"' + (day < hoje ? " disabled" : "") + ' aria-label="' + esc(fLong.format(day)) + '">' + d + "</button>";
    }
    el.innerHTML = h + '</div><p class="small" style="margin:10px 0 0">Os dias com ponto têm eventos.</p>';
    el.querySelectorAll("[data-cal]").forEach(function (b) { b.addEventListener("click", function () { calMes = new Date(calMes.getFullYear(), calMes.getMonth() + Number(b.dataset.cal), 1); desenharCal(q); }); });
    el.querySelectorAll("[data-dia]").forEach(function (b) { b.addEventListener("click", function () { var o = copia(q); o.dia = q.dia === b.dataset.dia ? "" : b.dataset.dia; location.hash = "#/procurar" + qsBuild(o); }); });
  }

  /* ----- evento ----- */
  function pgEvento(id) {
    var e = evento(id); if (!e) return pgNada();
    var g = grupo(e.grupo) || { id: "", nome: "", categoria: "networking", nMembros: 0 };
    var membros = need("memb:" + g.id, function () { return API.membros(g.id); });
    var ps = need("part:" + id, function () { return API.participantes(id); });
    var coms = need("com:" + id, function () { return API.comentarios(id); });
    var orgs = Array.isArray(membros) ? membros.filter(function (m) { return m.org; }) : [];
    var orgNome = orgs.length ? orgs[0].nome : g.nome;
    var d = dt(e.inicio), f = dt(e.fim || e.inicio), r = rsvp(e.id), full = cheio(e), passado = !futuro(e), vagas = e.vagas - e.nConfirmados;
    var semelhantes = proximos().filter(function (x) { return x.id !== e.id && (catEvento(x) === catEvento(e) || x.cidade === e.cidade); }).slice(0, 4);
    var acao;
    if (e.estado === "cancelado") acao = '<button class="btn" disabled>Evento cancelado</button>';
    else if (e.estado === "rascunho") acao = '<button class="btn" disabled>Rascunho (não publicado)</button>';
    else if (passado) acao = '<button class="btn" disabled>Evento terminado</button>';
    else if (r && r.estado === "confirmado") acao = '<a class="btn btn--ok" href="#/conta">' + ic("check") + " Vai participar</a>";
    else if (r) acao = '<button class="btn btn--line" type="button" data-act="cancelar" data-id="' + e.id + '">Na lista de espera · sair</button>';
    else acao = '<button class="btn btn--lg" type="button" data-act="participar" data-id="' + e.id + '">' + (full ? "Entrar na lista de espera" : "Participar") + "</button>";
    var gestao = souOrg(e.grupo) ? '<div class="adminbar"><div class="wrap adminbar__in"><span>' + ic("shield") + " Gestão do evento</span>" +
      '<a class="btn btn--sm" href="#/gerir/' + e.id + '">' + ic("list") + " Inscrições e check-in</a>" +
      '<a class="btn btn--line btn--sm" href="#/evento/' + e.id + '/editar">' + ic("edit") + " Editar</a></div></div>" : "";
    var listaP = Array.isArray(ps) ? ps : [];
    document.body.classList.add("has-bar");
    main.innerHTML = gestao +
      '<section class="ehead"><div class="wrap"><div class="small">' + esc(cap1(fLong.format(d))) + "</div><h1>" + esc(e.titulo) + "</h1>" +
        (e.estado === "cancelado" ? '<div class="status status--mau">Este evento foi cancelado pela organização.</div>' : "") +
        '<div class="host">' + av(orgNome) + '<div><div class="small">Organizado por</div><b>' + esc(orgNome) + "</b>" + (orgs.length ? ' · <a class="link" href="#/grupo/' + esc(g.id) + '">' + esc(g.nome) + "</a>" : "") + "</div></div></div></section>" +
      '<section class="ebody"><div class="wrap ebody__in"><div>' +
        '<div class="ratio" style="border-radius:16px;margin-bottom:22px">' + capa(catEvento(e), e.id, e.oficial) + "</div>" +
        '<h2>Detalhes</h2><div class="desc">' + esc(e.descricao) + "</div>" +
        (e.link ? '<p style="margin-top:12px"><a class="link" href="' + esc(e.link) + '" target="_blank" rel="noopener">Mais informação ›</a></p>' : "") +
        '<div class="row" style="margin:16px 0 28px">' + (e.certificado ? '<span class="badge badge--line">' + ic("award") + " Com certificado</span>" : "") + '<span class="badge badge--line">' + esc(cat(catEvento(e)).nome) + "</span>" + (e.formato === "online" ? '<span class="badge badge--teal">Online</span>' : "") + "</div>" +
        '<div class="box" style="margin-bottom:28px"><h3 style="display:flex;gap:8px;align-items:center">' + ic("users") + ' Reuniões B2B</h3><p class="small" style="margin:0">Ao confirmar, indique o que procura. Antes do evento, a organização sugere-lhe pessoas com quem reunir.</p></div>' +
        '<div class="sec__head"><h2>Participantes (' + e.nConfirmados + ")</h2></div>" +
        (ps === undefined ? carregando() : falhou(ps) || (listaP.length ? '<div class="people" style="margin-bottom:28px">' + listaP.slice(0, 12).map(function (p) { var eu = ST.user && p.id === ST.user.id; var org = orgs.some(function (o) { return o.id === p.id; }); return '<div class="person">' + av(p.nome, "av--l") + "<b>" + esc(p.nome) + "</b>" + (eu ? '<span class="role">Você</span>' : org ? '<span class="role">Organizador</span>' : '<span class="small">' + esc(p.cargo || "Membro") + "</span>") + "</div>"; }).join("") + "</div>" + (e.nConfirmados > 12 ? '<p class="small">E mais ' + (e.nConfirmados - 12) + " pessoas.</p>" : "") : '<div class="empty" style="margin-bottom:28px">Seja o primeiro a confirmar.</div>')) +
        "<h2>Comentários" + (Array.isArray(coms) ? " (" + coms.length + ")" : "") + '</h2><div class="box">' +
          (coms === undefined ? carregando() : falhou(coms) || (coms.length ? coms.map(function (c) { var podeApagar = ST.user && (c.autor === ST.user.id || isAdmin()); return '<div class="comment">' + av(c.nome) + "<div><b>" + esc(c.nome) + '</b> <span class="small">' + esc(haQuanto(c.quando)) + "</span>" + (podeApagar ? ' <button class="linkbtn" type="button" data-act="apagar-com" data-id="' + esc(c.id) + '" data-ev="' + e.id + '">Apagar</button>' : "") + "<div>" + esc(c.t) + "</div></div></div>"; }).join("") : '<p class="small" style="margin:0">Ainda sem comentários. Seja o primeiro.</p>')) +
          '<form class="cform" data-form="comentar" data-id="' + e.id + '"><input name="t" placeholder="' + (ST.user ? "Escreva um comentário…" : "Entre para comentar") + '" aria-label="Comentário" required maxlength="1000"><button class="btn btn--sm" type="submit">Enviar</button></form></div>' +
      '</div><aside class="side">' +
        '<a class="box gmini" href="#/grupo/' + esc(g.id) + '" style="display:flex"><div class="ratio">' + capa(g.categoria, g.id) + '</div><div><b style="color:var(--ink)">' + esc(g.nome) + '</b><div class="small">' + g.nMembros + " membros · Grupo público</div></div></a>" +
        '<div class="box facts">' +
          '<div class="fact">' + ic("clock") + "<div><b>" + esc(cap1(fLong.format(d))) + "</b>" + esc(fHora.format(d)) + " – " + esc(fHora.format(f)) + "</div></div>" +
          (e.formato === "online" ? '<div class="fact">' + ic("video") + "<div><b>Evento online</b>O link é enviado a quem confirmar.</div></div>"
            : '<div class="fact">' + ic("pin") + "<div><b>" + esc(e.local || "Local a confirmar") + "</b>" + esc(lugarTxt(e)) + '<br><a class="link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/' + encodeURIComponent([e.local, e.endereco, e.cidade].filter(function (x) { return x && x !== "A confirmar"; }).join(", ")) + '">Abrir no mapa</a></div></div>') +
          '<div class="fact">' + ic("ticket") + "<div><b>" + esc(precoTxt(e)) + "</b>" + (e.preco > 0 ? "Pagamento por Multicaixa Express ou referência" : vagas > 0 ? vagas + " lugares disponíveis" : "Esgotado · lista de espera aberta") + "</div></div>" +
          '<div class="btns"><button class="btn btn--line btn--sm" type="button" data-act="ics" data-id="' + e.id + '">' + ic("cal") + ' Calendário</button><a class="btn btn--line btn--sm" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(e.titulo + " — " + fLong.format(d) + " · " + location.href) + '">' + ic("share") + " Partilhar</a></div></div>" +
      "</aside></div></section>" +
      (semelhantes.length ? '<section class="sec"><div class="wrap"><h2>Eventos semelhantes</h2>' + grade(semelhantes.map(cardEvento)) + "</div></section>" : "") +
      '<div class="ebar"><div class="wrap ebar__in"><div class="ebar__l"><span class="when">' + esc(quando(e.inicio)) + "</span><b>" + esc(e.titulo) + '</b></div><div class="ebar__r"><div class="ebar__price"><b>' + esc(precoTxt(e)) + "</b>" + (passado || e.estado !== "publicado" ? "" : vagas > 0 ? vagas + " lugares" : "Esgotado") + "</div>" + acao + "</div></div></div>";
  }

  /* ----- grupo ----- */
  function pgGrupo(id, q) {
    var g = grupo(id); if (!g) return pgNada();
    var tab = q.tab || "sobre", membro = souMembro(g.id), org = souOrg(g.id);
    var membros = need("memb:" + g.id, function () { return API.membros(g.id); });
    var lista = Array.isArray(membros) ? membros : [], orgs = lista.filter(function (m) { return m.org; });
    var evs = ST.eventos.filter(function (e) { return e.grupo === g.id && (visivel(e) || org); });
    var prox = evs.filter(futuro).sort(porData), pass = evs.filter(function (e) { return !futuro(e); }).sort(function (a, b) { return porData(b, a); });
    var acoes = (org ? '<a class="btn" href="#/grupo/' + g.id + '/novo-evento">' + ic("plus") + ' Criar evento</a><a class="btn btn--line" href="#/grupo/' + g.id + '/editar">' + ic("edit") + " Editar grupo</a>"
      : membro ? '<button class="btn btn--ok" type="button" data-act="sair-grupo" data-id="' + g.id + '">' + ic("check") + " É membro · sair</button>"
      : '<button class="btn btn--lg" type="button" data-act="juntar" data-id="' + g.id + '"' + (g.estado !== "aprovado" ? " disabled" : "") + ">Juntar-me a este grupo</button>") +
      '<button class="btn btn--line" type="button" data-act="partilhar-grupo" data-id="' + g.id + '">' + ic("share") + " Convidar</button>";
    var adminAcoes = isAdmin() && g.estado !== "aprovado" ? '<div class="adminbar"><div class="wrap adminbar__in"><span>' + ic("shield") + " Grupo " + (g.estado === "pendente" ? "em análise" : "rejeitado") + '</span><button class="btn btn--sm" type="button" data-act="aprovar" data-id="' + g.id + '">Aprovar</button>' + (g.estado === "pendente" ? '<button class="btn btn--line btn--sm" type="button" data-act="rejeitar" data-id="' + g.id + '">Rejeitar</button>' : "") + "</div></div>" : "";
    var corpo;
    if (tab === "eventos") {
      var vista = q.v === "passados" ? pass : prox;
      corpo = '<div><div class="seg"><button type="button" class="' + (q.v !== "passados" ? "on" : "") + '" data-go="#/grupo/' + g.id + '?tab=eventos">Próximos (' + prox.length + ')</button><button type="button" class="' + (q.v === "passados" ? "on" : "") + '" data-go="#/grupo/' + g.id + '?tab=eventos&v=passados">Passados (' + pass.length + ")</button></div>" +
        (vista.length ? vista.map(itemEvento).join("") : '<div class="empty">' + (q.v === "passados" ? "Ainda sem eventos passados." : "Sem eventos marcados." + (org ? ' <a class="link" href="#/grupo/' + g.id + '/novo-evento">Criar o primeiro evento</a>' : "")) + "</div>") + "</div>";
    } else if (tab === "membros") {
      corpo = "<div><h2>Membros (" + g.nMembros + ")</h2>" + (membros === undefined ? carregando() : falhou(membros) || '<div class="people">' + lista.map(function (m) { var eu = ST.user && m.id === ST.user.id; return '<div class="person">' + av(m.nome, "av--l") + "<b>" + esc(m.nome) + "</b>" + (eu ? '<span class="role">Você</span>' : m.org ? '<span class="role">Organizador</span>' : '<span class="small">' + esc(m.cargo || "Membro") + "</span>") + "</div>"; }).join("") + "</div>") +
        (g.nMembros > lista.length && lista.length ? '<p class="small" style="margin-top:14px">E mais ' + (g.nMembros - lista.length) + " membros.</p>" : "") + "</div>";
    } else if (tab === "discussoes") {
      var posts = need("posts:" + g.id, function () { return API.publicacoes(g.id); });
      corpo = "<div><h2>Discussões</h2>" + (membro ? '<form class="box form" data-form="post" data-id="' + g.id + '" style="margin-bottom:16px"><label>Nova publicação<textarea name="t" required maxlength="2000" placeholder="Partilhe uma ideia, pergunta ou oportunidade com o grupo"></textarea></label><div><button class="btn btn--sm" type="submit">Publicar</button></div></form>' : '<div class="note" style="margin-bottom:16px">Junte-se ao grupo para participar nas discussões.</div>') +
        (posts === undefined ? carregando() : falhou(posts) || (posts.length ? '<div class="box">' + posts.map(function (p) { var pode = ST.user && (p.autor === ST.user.id || org); return '<div class="comment">' + av(p.nome) + "<div><b>" + esc(p.nome) + '</b> <span class="small">' + esc(haQuanto(p.quando)) + "</span>" + (pode ? ' <button class="linkbtn" type="button" data-act="apagar-post" data-id="' + esc(p.id) + '" data-g="' + g.id + '">Apagar</button>' : "") + '<div style="white-space:pre-line">' + esc(p.t) + "</div></div></div>"; }).join("") + "</div>" : '<div class="empty">Ainda sem publicações.</div>')) + "</div>";
    } else {
      corpo = '<div><h2>O que fazemos</h2><div class="desc" style="margin-bottom:26px">' + esc(g.descricao) + "</div>" +
        '<div class="sec__head"><h2>Próximos eventos (' + prox.length + ")</h2>" + (prox.length > 2 ? '<a class="link" href="#/grupo/' + g.id + '?tab=eventos">Ver todos</a>' : "") + "</div>" +
        (prox.length ? prox.slice(0, 2).map(itemEvento).join("") : '<div class="empty">Sem eventos marcados.' + (org ? ' <a class="link" href="#/grupo/' + g.id + '/novo-evento">Criar o primeiro evento</a>' : "") + "</div>") + "</div>";
    }
    main.innerHTML = adminAcoes + '<section class="ghead"><div class="wrap ghead__in"><div class="ratio">' + capa(g.categoria, g.id) + "</div><div>" +
        (g.estado === "pendente" ? '<div class="status">' + ic("clock") + " Em análise pela Luadeira</div>" : g.estado === "rejeitado" ? '<div class="status status--mau">Grupo não aprovado</div>' : "") +
        "<h1>" + esc(g.nome) + '</h1><div class="gfacts">' +
          "<div>" + ic("pin") + esc(g.cidade) + (g.cidade === "Online" ? " · encontros online" : g.pais ? ", " + esc(g.pais) : "") + "</div>" +
          "<div>" + ic("users") + g.nMembros + " membros · Grupo público</div>" +
          (orgs.length ? "<div>" + ic("star") + 'Organizado por <b style="color:var(--ink)">' + esc(orgs[0].nome) + "</b>" + (orgs.length > 1 ? " e mais " + (orgs.length - 1) : "") + "</div>" : "") +
          "<div>" + ic(g.categoria) + esc(cat(g.categoria).nome) + (g.desde ? " · desde " + esc(g.desde) : "") + "</div>" +
        '</div><div class="btns">' + acoes + "</div></div></div></section>" +
      '<div class="gtabs"><div class="wrap"><div class="tabs">' + [["sobre", "Sobre"], ["eventos", "Eventos"], ["membros", "Membros"], ["discussoes", "Discussões"]].map(function (t) { return '<a href="#/grupo/' + g.id + "?tab=" + t[0] + '" class="' + (tab === t[0] ? "on" : "") + '">' + t[1] + "</a>"; }).join("") + "</div></div></div>" +
      '<div class="wrap gbody">' + corpo + '<aside><div class="box"><h3>Organizadores</h3>' + (membros === undefined ? carregando() : orgs.length ? orgs.map(function (n) { return '<div class="gmini" style="margin-top:10px">' + av(n.nome) + '<div><b style="color:var(--ink)">' + esc(n.nome) + '</b><div class="small">Organizador</div></div></div>'; }).join("") : '<p class="small">Equipa Luadeira</p>') +
        '</div><div class="box"><h3>Membros</h3><div class="stack" style="margin:8px 0">' + lista.slice(0, 8).map(function (m) { return av(m.nome); }).join("") + '</div><a class="link" href="#/grupo/' + g.id + '?tab=membros">Ver todos (' + g.nMembros + ")</a></div></aside></div>";
  }

  /* ----- criar / editar grupo ----- */
  var wiz = null;
  function pgCriarGrupo() {
    if (!ST.user) { main.innerHTML = '<div class="wrap--n wiz"><h1>Crie o seu grupo</h1><p class="muted">Para criar um grupo precisa de uma conta GiLF Eventos.</p><div class="btns"><button class="btn btn--lg" type="button" data-act="registar" data-then="#/criar-grupo">Registar e continuar</button><button class="btn btn--line btn--lg" type="button" data-act="entrar" data-then="#/criar-grupo">Já tenho conta</button></div></div>'; return; }
    if (!wiz) wiz = { passo: 1, cidade: D.cidades.indexOf(ST.user.cidade) >= 0 ? ST.user.cidade : "", cats: [], nome: "", descricao: "", ok: false };
    var n = 5, p = wiz.passo, corpo = "";
    if (p === 1) corpo = '<h1>Primeiro, onde fica o seu grupo?</h1><p class="muted">Os membros encontram grupos pela cidade. Escolha "Online" se os encontros forem só pela internet.</p><div class="chips" style="margin:18px 0">' + ["Online"].concat(D.cidades).map(function (c) { return '<button type="button" class="chip' + (wiz.cidade === c ? " on" : "") + '" data-wz="cidade" data-v="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + '</div><div class="form"><label>Outra cidade<input id="wzCidade" value="' + esc(D.cidades.indexOf(wiz.cidade) < 0 && wiz.cidade !== "Online" ? wiz.cidade : "") + '" placeholder="Ex.: Malanje, Namibe, Joanesburgo"></label></div>';
    if (p === 2) corpo = '<h1>Escolha até 3 temas</h1><p class="muted">Ajudam as pessoas certas a encontrar o seu grupo.</p><div class="chips" style="margin-top:18px">' + D.categorias.map(function (c) { return '<button type="button" class="chip' + (wiz.cats.indexOf(c.id) >= 0 ? " on" : "") + '" data-wz="cat" data-v="' + c.id + '">' + ic(c.id) + esc(c.nome) + "</button>"; }).join("") + "</div>";
    if (p === 3) corpo = '<h1>Qual será o nome do grupo?</h1><p class="muted">Escolha um nome claro, que diga o tema e o lugar. Pode mudar mais tarde.</p><div class="form" style="margin-top:18px"><label>Nome do grupo<input id="wzNome" maxlength="70" value="' + esc(wiz.nome) + '" placeholder="Ex.: Líderes do Lobito"></label><span class="hint" id="wzN">' + wiz.nome.length + "/70</span></div>";
    if (p === 4) corpo = '<h1>Descreva o propósito do grupo</h1><p class="muted">As pessoas vão ler isto antes de se juntarem.</p><ul class="small"><li>Qual é o objectivo do grupo?</li><li>Quem deve juntar-se?</li><li>O que vão fazer nos encontros?</li></ul><div class="form"><label>Descrição<textarea id="wzDesc" maxlength="2000" placeholder="Mínimo de 50 caracteres">' + esc(wiz.descricao) + '</textarea></label><span class="hint" id="wzD">' + wiz.descricao.length + " caracteres (mínimo 50)</span></div>";
    if (p === 5) corpo = '<h1>Quase pronto</h1><p class="muted">Reveja o seu grupo.</p><div class="box" style="margin:16px 0"><div class="gmini"><div class="ratio">' + capa(wiz.cats[0] || "networking", "novo" + wiz.nome) + '</div><div><b style="color:var(--ink)">' + esc(wiz.nome) + '</b><div class="small">' + esc(wiz.cidade) + " · " + wiz.cats.map(function (c) { return esc(cat(c).nome); }).join(", ") + '</div></div></div><p class="small" style="margin:12px 0 0;white-space:pre-line">' + esc(wiz.descricao) + "</p></div>" +
      '<div class="form"><label class="check"><input type="checkbox" id="wzOk"' + (wiz.ok ? " checked" : "") + "> Li e aceito as Regras da Comunidade GiLF: respeito, sem spam, eventos reais e abertos. " + (isAdmin() ? "" : "O grupo fica em análise pela Luadeira Digital Angola.") + "</label></div>";
    function pode() { return p === 1 ? !!wiz.cidade : p === 2 ? wiz.cats.length > 0 : p === 3 ? wiz.nome.trim().length >= 4 : p === 4 ? wiz.descricao.trim().length >= 50 : wiz.ok; }
    main.innerHTML = '<div class="wrap--n wiz"><div class="small" style="margin-bottom:8px">Passo ' + p + " de " + n + '</div><div class="prog"><i style="width:' + (p / n * 100) + '%"></i></div>' + corpo +
      '<div class="wiz__nav"><button class="btn btn--line" type="button" data-wznav="-1"' + (p === 1 ? " disabled" : "") + '>Voltar</button><button class="btn" type="button" id="wzNext" data-wznav="1"' + (pode() ? "" : " disabled") + ">" + (p === n ? "Criar grupo" : "Seguinte") + "</button></div></div>";
    function refresh() { document.getElementById("wzNext").disabled = !pode(); }
    var ci = document.getElementById("wzCidade"); if (ci) ci.addEventListener("input", function () { wiz.cidade = ci.value.trim(); main.querySelectorAll("[data-wz=cidade]").forEach(function (b) { b.classList.remove("on"); }); refresh(); });
    var no = document.getElementById("wzNome"); if (no) no.addEventListener("input", function () { wiz.nome = no.value; document.getElementById("wzN").textContent = no.value.length + "/70"; refresh(); });
    var de = document.getElementById("wzDesc"); if (de) de.addEventListener("input", function () { wiz.descricao = de.value; document.getElementById("wzD").textContent = de.value.length + " caracteres (mínimo 50)"; refresh(); });
    var okc = document.getElementById("wzOk"); if (okc) okc.addEventListener("change", function () { wiz.ok = okc.checked; refresh(); });
    main.querySelectorAll("[data-wz]").forEach(function (b) { b.addEventListener("click", function () {
      if (b.dataset.wz === "cidade") wiz.cidade = b.dataset.v;
      else { var i = wiz.cats.indexOf(b.dataset.v); if (i >= 0) wiz.cats.splice(i, 1); else if (wiz.cats.length < 3) wiz.cats.push(b.dataset.v); else toast("Pode escolher até 3 temas"); }
      pgCriarGrupo();
    }); });
    main.querySelectorAll("[data-wznav]").forEach(function (b) { b.addEventListener("click", async function () {
      var dir = Number(b.dataset.wznav);
      if (dir > 0 && p === n) {
        b.disabled = true;
        try {
          var dados = { nome: wiz.nome.trim(), cidade: wiz.cidade, categoria: wiz.cats[0], temas: wiz.cats.slice(), descricao: wiz.descricao.trim() };
          var id = await acao(function () { return API.criarGrupo(dados); });
          wiz = null; location.hash = "#/grupo/" + id;
          setTimeout(function () { var g = grupo(id); abrir('<div class="okmark">' + ic("check") + '</div><h2 id="mTitle">Grupo criado!</h2><p class="muted">' + (g && g.estado === "aprovado" ? "O grupo já está visível para todos." : "O grupo fica visível para todos depois da aprovação da Luadeira. Entretanto, já pode preparar o primeiro evento.") + '</p><div class="btns"><a class="btn" href="#/grupo/' + id + '/novo-evento">Criar o primeiro evento</a>' + (g && g.estado !== "aprovado" ? '<a class="btn btn--wa" target="_blank" rel="noopener" href="' + wa("Criei um grupo no GiLF Eventos e peço a aprovação:\n\n" + dados.nome + "\n" + dados.cidade + "\n\n" + dados.descricao) + '">Avisar a Luadeira</a>' : "") + "</div>"); }, 80);
        } catch (e) { b.disabled = false; }
        return;
      }
      wiz.passo = Math.max(1, Math.min(n, p + dir)); pgCriarGrupo(); window.scrollTo(0, 0);
    }); });
  }

  function pgEditarGrupo(id) {
    var g = grupo(id); if (!g) return pgNada();
    if (!souOrg(id)) return semPermissao();
    main.innerHTML = '<div class="wrap--n wiz"><div class="small"><a class="link" href="#/grupo/' + g.id + '">' + esc(g.nome) + '</a></div><h1>Editar grupo</h1><form class="form" data-form="editar-grupo" data-id="' + g.id + '">' +
      '<label>Nome<input name="nome" required maxlength="70" value="' + esc(g.nome) + '"></label>' +
      '<div class="two"><label>Cidade<input name="cidade" required list="dl-cidades" value="' + esc(g.cidade) + '"></label><label>Categoria principal<select name="categoria">' + D.categorias.map(function (c) { return '<option value="' + c.id + '"' + (g.categoria === c.id ? " selected" : "") + ">" + esc(c.nome) + "</option>"; }).join("") + "</select></label></div>" +
      '<label>Descrição<textarea name="descricao" required minlength="50" maxlength="2000">' + esc(g.descricao) + "</textarea></label>" +
      (isAdmin() ? '<div class="two"><label>Estado<select name="estado">' + [["aprovado", "Aprovado"], ["pendente", "Em análise"], ["rejeitado", "Rejeitado"]].map(function (o) { return '<option value="' + o[0] + '"' + (g.estado === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + '</select></label><label class="check" style="align-self:end"><input type="checkbox" name="destaque"' + (g.destaque ? " checked" : "") + "> Grupo em destaque na página inicial</label></div>" : "") +
      '<div class="btns"><button class="btn btn--lg" type="submit">Guardar</button><a class="btn btn--line btn--lg" href="#/grupo/' + g.id + '">Cancelar</a>' + (isAdmin() ? '<button class="btn btn--line btn--lg danger" type="button" data-act="apagar-grupo" data-id="' + g.id + '">' + ic("trash") + " Apagar grupo</button>" : "") + "</div></form>" +
      (isAdmin() ? '<div class="box" style="margin-top:26px"><h3>Organizadores</h3><p class="small">Indique o email de uma conta existente para a tornar organizadora deste grupo.</p><form class="cform" data-form="organizador" data-id="' + g.id + '"><input name="email" type="email" required placeholder="email@exemplo.com" aria-label="Email"><button class="btn btn--sm" type="submit">Tornar organizador</button></form></div>' : "") + "</div>";
  }

  /* ----- criar / editar evento ----- */
  function formEvento(g, e, gruposEscolha) {
    var novo = !e, d = e ? dt(e.inicio) : addD(new Date(), 7), f = e ? dt(e.fim || e.inicio) : null;
    var hi = e ? hm(d) : "18:00", hf = e ? hm(f) : "20:00";
    return '<form class="form" data-form="evento" data-id="' + (e ? e.id : "") + '" data-g="' + (g ? g.id : "") + '">' +
      (gruposEscolha ? '<label>Grupo<select name="grupo" required>' + gruposEscolha.map(function (x) { return '<option value="' + x.id + '">' + esc(x.nome) + "</option>"; }).join("") + "</select></label>" : "") +
      '<label>Título<input name="titulo" required maxlength="110" value="' + esc(e ? e.titulo : "") + '" placeholder="Ex.: Café de Líderes de Janeiro"></label>' +
      '<div class="two"><label>Data<input name="data" type="date" required value="' + ymd(d) + '"' + (novo ? ' min="' + ymd(new Date()) + '"' : "") + '></label><label>Formato<select name="formato" id="evFmt"><option value="presencial">Presencial</option><option value="online"' + (e && e.formato === "online" ? " selected" : "") + ">Online</option></select></label></div>" +
      '<div class="two"><label>Início<input name="hi" type="time" required value="' + hi + '"></label><label>Fim<input name="hf" type="time" required value="' + hf + '"></label></div>' +
      '<div id="evLocal"' + (e && e.formato === "online" ? " hidden" : "") + '><div class="two"><label>Local<input name="local" value="' + esc(e ? e.local : "") + '" placeholder="Nome do espaço"></label><label>Bairro / endereço<input name="endereco" value="' + esc(e ? e.endereco : "") + '" placeholder="Ex.: Talatona"></label></div>' +
        '<label style="margin-top:14px">Cidade<input name="cidade" list="dl-cidades" value="' + esc(e ? (e.cidade === "Online" ? "" : e.cidade) : g && g.cidade !== "Online" ? g.cidade : "") + '"></label></div>' +
      '<div class="two"><label>Lugares<input name="vagas" type="number" min="1" max="20000" value="' + (e ? e.vagas : 40) + '" required></label><label>Preço (Kz)<input name="preco" type="number" min="0" step="100" value="' + (e && e.preco != null ? e.preco : e ? "" : 0) + '"><span class="hint">0 = gratuito · vazio = "ver condições"</span></label></div>' +
      '<label>Descrição<textarea name="descricao" required minlength="20" maxlength="5000" placeholder="O que vai acontecer, para quem é e o que levar">' + esc(e ? e.descricao : "") + "</textarea></label>" +
      '<label>Link com mais informação (opcional)<input name="link" type="url" value="' + esc(e ? e.link : "") + '" placeholder="https://"></label>' +
      '<label class="check"><input type="checkbox" name="certificado"' + (e && e.certificado ? " checked" : "") + "> Emitir certificado de participação</label>" +
      (isAdmin() ? '<label class="check"><input type="checkbox" name="oficial"' + (e && e.oficial ? " checked" : "") + "> Evento oficial GiLF (destaque dourado)</label>" : "") +
      (e ? '<label>Estado<select name="estado">' + [["publicado", "Publicado"], ["rascunho", "Rascunho (só organizadores vêem)"], ["cancelado", "Cancelado"]].map(function (o) { return '<option value="' + o[0] + '"' + (e.estado === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></label>" : "") +
      '<div class="btns"><button class="btn btn--lg" type="submit">' + (novo ? "Publicar evento" : "Guardar alterações") + '</button><a class="btn btn--line btn--lg" href="' + (e ? "#/evento/" + e.id : g ? "#/grupo/" + g.id : "#/admin/eventos") + '">Cancelar</a>' +
      (e ? '<button class="btn btn--line btn--lg danger" type="button" data-act="apagar-evento" data-id="' + e.id + '">' + ic("trash") + " Apagar</button>" : "") + "</div></form>";
  }
  function ligarFormEvento() { var fmt = document.getElementById("evFmt"); if (fmt) fmt.addEventListener("change", function () { document.getElementById("evLocal").hidden = fmt.value === "online"; }); }
  function pgNovoEvento(gid) {
    var g = grupo(gid); if (!g) return pgNada(); if (!souOrg(gid)) return semPermissao();
    main.innerHTML = '<div class="wrap--n wiz"><div class="small"><a class="link" href="#/grupo/' + g.id + '">' + esc(g.nome) + "</a></div><h1>Criar um evento</h1>" + formEvento(g, null) + "</div>"; ligarFormEvento();
  }
  function pgEditarEvento(id) {
    var e = evento(id); if (!e) return pgNada(); if (!souOrg(e.grupo)) return semPermissao();
    main.innerHTML = '<div class="wrap--n wiz"><div class="small"><a class="link" href="#/evento/' + e.id + '">' + esc(e.titulo) + "</a></div><h1>Editar evento</h1>" + formEvento(grupo(e.grupo), e) + "</div>"; ligarFormEvento();
  }

  /* ----- gerir inscrições e check-in ----- */
  var scan = null;
  function pararCamera() { if (scan) { scan.ativo = false; if (scan.stream) scan.stream.getTracks().forEach(function (t) { t.stop(); }); scan = null; } }
  function pgGerir(eid, q) {
    var e = evento(eid); if (!e) return pgNada(); if (!souOrg(e.grupo)) return semPermissao();
    var lista = need("insc:" + eid, function () { return API.listaInscricoes(eid); });
    var L = Array.isArray(lista) ? lista : [], fl = (q.f || "").toLowerCase();
    var conf = L.filter(function (i) { return i.estado === "confirmado"; }), esp = L.filter(function (i) { return i.estado === "espera"; }), pres = L.filter(function (i) { return i.check_in_em; });
    var vis = L.filter(function (i) { return !fl || (i.nome + " " + i.email + " " + i.telefone + " " + i.codigo).toLowerCase().indexOf(fl) >= 0; });
    var camAberta = !!scan;
    main.innerHTML = '<div class="wrap" style="padding:26px 0 50px"><div class="small"><a class="link" href="#/evento/' + e.id + '">' + esc(e.titulo) + "</a> · " + esc(quando(e.inicio)) + "</div><h1>Inscrições e check-in</h1>" +
      '<div class="stats"><div class="stat"><b>' + conf.length + "</b><span>confirmados de " + e.vagas + '</span></div><div class="stat"><b>' + pres.length + '</b><span>presentes</span></div><div class="stat"><b>' + esp.length + '</b><span>em lista de espera</span></div><div class="stat"><b>' + Math.max(0, e.vagas - conf.length) + "</b><span>lugares livres</span></div></div>" +
      '<div class="box checkin"><h2 style="font-size:1.15rem">Check-in à entrada</h2><form class="cform" data-form="checkin" data-id="' + e.id + '"><input name="codigo" required placeholder="Código do bilhete (ex.: GE-AB12CD)" aria-label="Código do bilhete" autocomplete="off" style="text-transform:uppercase"><button class="btn" type="submit">' + ic("check") + ' Registar</button><button class="btn btn--line" type="button" data-act="camera" data-id="' + e.id + '">' + ic("qr") + " Ler QR</button></form>" +
        '<div id="camBox"' + (camAberta ? "" : " hidden") + '><video id="cam" playsinline muted></video><button class="btn btn--line btn--sm" type="button" data-act="parar-camera">Parar câmara</button></div><div id="ciMsg" aria-live="polite"></div></div>' +
      '<div class="sec__head" style="margin-top:26px"><h2>Lista (' + L.length + ')</h2><div class="btns"><input class="search-in" id="gF" type="search" placeholder="Procurar nome, telefone, código" value="' + esc(q.f || "") + '" aria-label="Procurar"><button class="btn btn--line btn--sm" type="button" data-act="csv-insc" data-id="' + e.id + '">' + ic("download") + " Exportar CSV</button></div></div>" +
      (lista === undefined ? carregando() : falhou(lista) || (vis.length ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>Presente</th><th>Nome</th><th>Contacto</th><th>Estado</th><th>Código</th><th class="hide-s">Procura</th></tr></thead><tbody>' +
        vis.map(function (i) { return '<tr><td><input type="checkbox" aria-label="Presente: ' + esc(i.nome) + '" data-pres="' + esc(i.id) + '"' + (i.check_in_em ? " checked" : "") + (i.estado !== "confirmado" ? " disabled" : "") + "></td><td><b>" + esc(i.nome) + '</b><div class="small">' + esc([i.cargo, i.organizacao].filter(Boolean).join(" · ")) + "</div></td><td>" + (i.telefone ? '<a class="link" target="_blank" rel="noopener" href="' + wa("Olá " + String(i.nome).split(" ")[0] + ", sobre o evento «" + e.titulo + "»: ", i.telefone) + '">' + esc(i.telefone) + "</a><br>" : "") + '<span class="small">' + esc(i.email || "") + "</span></td><td>" + (i.estado === "confirmado" ? '<span class="badge badge--ok">Confirmado</span>' : '<span class="badge badge--line">Espera</span>') + '</td><td class="code">' + esc(i.codigo) + '</td><td class="hide-s small">' + esc(i.objectivo || "") + (i.quer_b2b ? " · B2B" : "") + "</td></tr>"; }).join("") + "</tbody></table></div>" : '<div class="empty">Ainda sem inscrições.</div>')) + "</div>";
    if (camAberta && scan.stream) { var v = document.getElementById("cam"); v.srcObject = scan.stream; v.play().catch(function () {}); scan.video = v; }
    var gf = document.getElementById("gF"); if (gf) gf.addEventListener("input", function () { q.f = gf.value; history.replaceState(null, "", "#/gerir/" + eid + qsBuild(copia(q))); pgGerir(eid, q); var n = document.getElementById("gF"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); });
    main.querySelectorAll("[data-pres]").forEach(function (c) { c.addEventListener("change", function () { acao(function () { return API.marcarPresenca(c.dataset.pres, c.checked); }, c.checked ? "Presença registada" : "Presença removida", ["insc:" + eid]).catch(function () {}); }); });
  }
  async function fazerCheckIn(eid, cod) {
    var html;
    try {
      var r = await API.checkIn(eid, cod);
      html = '<div class="ci ' + (r.ok ? (r.ja ? "ci--ja" : "ci--ok") : "ci--mau") + '">' + (r.ok ? ic("check") + " <b>" + esc(r.nome) + "</b> " + (r.ja ? "já tinha entrado." : "— entrada registada.") : esc(r.msg)) + "</div>";
      if (navigator.vibrate) navigator.vibrate(r.ok ? 80 : [60, 60, 60]);
      if (r.ok && !r.ja) { delete C["insc:" + eid]; try { C["insc:" + eid] = await API.listaInscricoes(eid); } catch (x) {} if (/^#\/gerir\//.test(location.hash)) render(); }
    } catch (e) { html = '<div class="ci ci--mau">' + esc(e.message) + "</div>"; }
    var msg = document.getElementById("ciMsg"); if (msg) msg.innerHTML = html;
  }
  async function abrirCamera(eid) {
    if (!("BarcodeDetector" in window) || !navigator.mediaDevices) { toast("Este browser não lê QR. Escreva o código, ou use o Chrome no Android.", true); return; }
    try {
      pararCamera();
      var det = new window.BarcodeDetector({ formats: ["qr_code"] });
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      var v = document.getElementById("cam"); document.getElementById("camBox").hidden = false; v.srcObject = stream; await v.play();
      scan = { ativo: true, stream: stream, ultimo: "", quando: 0, video: v };
      var s = scan;
      (async function loop() {
        if (!s.ativo) return;
        try { var cods = await det.detect(s.video); if (cods.length) { var t = cods[0].rawValue; if (t !== s.ultimo || Date.now() - s.quando > 4000) { s.ultimo = t; s.quando = Date.now(); await fazerCheckIn(eid, t); } } } catch (e) {}
        setTimeout(loop, 350);
      })();
    } catch (e) { toast("Não foi possível abrir a câmara: " + e.message, true); }
  }
  function csv(linhas, nome) {
    var txt = linhas.map(function (l) { return l.map(function (c) { c = String(c == null ? "" : c); return /[",;\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(";"); }).join("\r\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\ufeff" + txt], { type: "text/csv;charset=utf-8" })); a.download = nome; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ----- conta ----- */
  function pgConta(q) {
    if (!ST.user) { main.innerHTML = '<div class="wrap--n wiz"><h1>A minha conta</h1><p class="muted">Entre para ver os seus bilhetes, grupos e pontos.</p><div class="btns"><button class="btn" type="button" data-act="entrar">Entrar</button><button class="btn btn--line" type="button" data-act="registar">Registar</button></div></div>'; return; }
    var tab = q.tab || "eventos", u = ST.user;
    var lista = Object.keys(ST.rsvps).map(evento).filter(Boolean).sort(porData);
    var prox = lista.filter(futuro), pass = lista.filter(function (e) { return !futuro(e); });
    var corpo;
    if (tab === "grupos") {
      var gs = ST.grupos.filter(function (g) { return souMembro(g.id); });
      corpo = '<div class="sec__head"><h2>Os meus grupos</h2><a class="btn btn--sm" href="#/criar-grupo">' + ic("plus") + " Criar grupo</a></div>" + (gs.length ? grade(gs.map(cardGrupo), "grid--3") : '<div class="empty">Ainda não pertence a nenhum grupo. <a class="link" href="#/procurar?tipo=grupos">Explorar grupos</a></div>');
    } else if (tab === "perfil") {
      corpo = '<div style="max-width:620px"><h2>Perfil</h2><form class="form" data-form="perfil">' +
        '<label>Email<input value="' + esc(u.email || "") + '" disabled></label>' + camposPerfil(u) + '<div><button class="btn" type="submit">Guardar</button></div></form>' +
        '<h2 style="margin-top:30px">Alterar palavra-passe</h2><form class="form" data-form="nova-pw"><label>Nova palavra-passe<input name="pw" type="password" minlength="6" required autocomplete="new-password"></label><div><button class="btn btn--line" type="submit">Alterar</button></div></form></div>';
    } else {
      corpo = '<div class="points" style="margin-bottom:22px"><b>' + pontos() + '</b><div><strong style="color:#f2dfab">Pontos de liderança</strong><br><span class="small" style="color:#d8c8a6">Participações, grupos, grupos que organiza e perfil completo. Os membros mais activos são indicados à Comissão dos Prémios Líderes Angola.</span></div></div>' +
        "<h2>Próximos (" + prox.length + ")</h2>" +
        (prox.length ? prox.map(function (e) {
          var r = rsvp(e.id), ok = r.estado === "confirmado";
          return '<div class="ticket"><a class="ratio" href="#/evento/' + e.id + '">' + capa(catEvento(e), e.id, e.oficial) + "</a><div>" +
            '<span class="badge ' + (ok ? "badge--ok" : "badge--line") + '">' + (ok ? "Confirmado" : "Lista de espera") + '</span><div class="when" style="margin-top:6px">' + esc(quando(e.inicio)) + '</div><h3 style="margin:2px 0"><a href="#/evento/' + e.id + '">' + esc(e.titulo) + '</a></h3><div class="small">' + esc(lugarTxt(e)) + '</div><div class="code" style="margin:6px 0">' + esc(r.codigo) + "</div>" +
            '<div class="btns"><button class="btn btn--line btn--sm" type="button" data-act="ics" data-id="' + e.id + '">Calendário</button><button class="btn btn--line btn--sm" type="button" data-act="cancelar" data-id="' + e.id + '">Cancelar</button></div></div>' +
            (ok ? '<div class="qr" data-qr="' + esc(r.codigo + "|" + e.id) + '" role="img" aria-label="Código QR de entrada"></div>' : "<div></div>") + "</div>";
        }).join("") : '<div class="empty">Sem eventos marcados. <a class="link" href="#/procurar">Encontrar eventos</a></div>') +
        (pass.length ? '<h2 style="margin-top:28px">Passados</h2>' + pass.map(itemEvento).join("") : "");
    }
    main.innerHTML = '<div class="wrap"><div class="phead">' + av(u.nome || u.email, "av--xl") + '<div><h1 style="margin:0">' + esc(u.nome || u.email) + '</h1><div class="muted">' + esc([u.cargo, u.organizacao].filter(Boolean).join(" · ")) + '</div><div class="small">' + esc(u.cidade || "") + " · " + Object.keys(ST.membros).length + " grupos · " + prox.length + " próximos eventos" + (isAdmin() ? ' · <a class="link" href="#/admin">Administrador</a>' : "") + "</div></div></div>" +
      '<div class="tabs"><a href="#/conta" class="' + (tab === "eventos" ? "on" : "") + '">Os meus eventos</a><a href="#/conta?tab=grupos" class="' + (tab === "grupos" ? "on" : "") + '">Os meus grupos</a><a href="#/conta?tab=perfil" class="' + (tab === "perfil" ? "on" : "") + '">Perfil</a></div>' +
      '<div style="padding:10px 0 40px">' + corpo + "</div></div>";
    desenharQRs(main);
  }

  /* ================= administração ================= */
  function adminNav(t) {
    return '<div class="adminhead"><div class="wrap"><div class="adminhead__t">' + ic("shield") + ' Administração</div><div class="tabs">' +
      [["", "Resumo"], ["grupos", "Grupos"], ["eventos", "Eventos"], ["utilizadores", "Utilizadores"], ["moderacao", "Moderação"]].map(function (x) { return '<a href="#/admin' + (x[0] ? "/" + x[0] : "") + '" class="' + (t === x[0] ? "on" : "") + '">' + x[1] + "</a>"; }).join("") + "</div></div></div>";
  }
  function pgAdmin(sub, q) {
    if (!ST.user) { main.innerHTML = '<div class="wrap--n wiz"><h1>Administração</h1><p class="muted">Entre com uma conta de administrador.</p><button class="btn" type="button" data-act="entrar" data-then="#/admin">Entrar</button></div>'; return; }
    if (!isAdmin()) return semPermissao("Esta área é só para administradores.");
    var corpo = "";
    if (!sub) {
      var R = need("admin:resumo", API.adminResumo), G = need("admin:grupos", API.adminGrupos);
      var pend = Array.isArray(G) ? G.filter(function (g) { return g.estado === "pendente"; }) : [];
      var prox = proximos().slice(0, 6);
      corpo = (R === undefined ? carregando() : falhou(R) || '<div class="stats">' + [["utilizadores", "membros registados"], ["novos7", "novos nos últimos 7 dias"], ["grupos", "grupos activos"], ["pendentes", "grupos por aprovar"], ["eventos", "próximos eventos"], ["inscricoes", "participações confirmadas"], ["presencas", "presenças registadas"]].map(function (k) { return '<div class="stat"><b>' + (R[k[0]] || 0) + "</b><span>" + k[1] + "</span></div>"; }).join("") + "</div>") +
        '<div class="sec__head" style="margin-top:26px"><h2>Grupos por aprovar (' + pend.length + ")</h2></div>" +
        (G === undefined ? carregando() : pend.length ? pend.map(linhaGrupoPendente).join("") : '<div class="empty">Nenhum grupo à espera de aprovação.</div>') +
        '<div class="sec__head" style="margin-top:26px"><h2>Próximos eventos</h2><a class="btn btn--sm" href="#/admin/novo-evento">' + ic("plus") + " Novo evento</a></div>" +
        (prox.length ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>Data</th><th>Evento</th><th>Inscritos</th><th></th></tr></thead><tbody>' + prox.map(function (e) { return "<tr><td>" + esc(quando(e.inicio)) + '</td><td><a class="link" href="#/evento/' + e.id + '">' + esc(e.titulo) + '</a><div class="small">' + esc((grupo(e.grupo) || {}).nome || "") + "</div></td><td>" + e.nConfirmados + " / " + e.vagas + '</td><td><a class="btn btn--line btn--sm" href="#/gerir/' + e.id + '">Inscrições</a></td></tr>'; }).join("") + "</tbody></table></div>" : '<div class="empty">Sem eventos marcados.</div>');
    } else if (sub === "grupos") {
      var GG = need("admin:grupos", API.adminGrupos), est = q.e || "", f = (q.f || "").toLowerCase();
      var lg = Array.isArray(GG) ? GG.filter(function (g) { return (!est || g.estado === est) && (!f || (g.nome + " " + g.cidade).toLowerCase().indexOf(f) >= 0); }) : [];
      corpo = '<div class="filters"><input id="aF" type="search" placeholder="Procurar grupo" value="' + esc(q.f || "") + '" aria-label="Procurar grupo"><select id="aE" aria-label="Estado"><option value="">Todos os estados</option>' + [["pendente", "Em análise"], ["aprovado", "Aprovados"], ["rejeitado", "Rejeitados"]].map(function (o) { return '<option value="' + o[0] + '"' + (est === o[0] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + '</select><a class="btn btn--sm" href="#/criar-grupo">' + ic("plus") + " Novo grupo</a></div>" +
        (GG === undefined ? carregando() : falhou(GG) || (lg.length ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>Grupo</th><th>Cidade</th><th>Membros</th><th>Estado</th><th>Acções</th></tr></thead><tbody>' + lg.map(function (g) {
          return '<tr><td><a class="link" href="#/grupo/' + g.id + '">' + esc(g.nome) + '</a><div class="small">' + esc(cat(g.categoria).nome) + (g.destaque ? " · ★ destaque" : "") + "</div></td><td>" + esc(g.cidade) + "</td><td>" + g.nMembros + "</td><td>" + estadoBadge(g.estado) + '</td><td class="acts">' +
            (g.estado !== "aprovado" ? '<button class="btn btn--sm" type="button" data-act="aprovar" data-id="' + g.id + '">Aprovar</button>' : "") + (g.estado === "pendente" ? '<button class="btn btn--line btn--sm" type="button" data-act="rejeitar" data-id="' + g.id + '">Rejeitar</button>' : "") +
            '<button class="btn btn--line btn--sm" type="button" data-act="destaque" data-id="' + g.id + '" data-v="' + (g.destaque ? "0" : "1") + '">' + (g.destaque ? "Tirar destaque" : "Destacar") + '</button><a class="btn btn--line btn--sm" href="#/grupo/' + g.id + '/editar">Editar</a></td></tr>';
        }).join("") + "</tbody></table></div>" : '<div class="empty">Nenhum grupo.</div>'));
    } else if (sub === "eventos") {
      var EE = need("admin:eventos", API.adminEventos), fe = (q.f || "").toLowerCase(), periodo = q.p || "futuros";
      var le = Array.isArray(EE) ? EE.filter(function (e) { var fut = futuro(e); return (periodo === "todos" || (periodo === "futuros" ? fut : !fut)) && (!fe || (e.titulo + " " + e.cidade).toLowerCase().indexOf(fe) >= 0); }) : [];
      if (periodo === "futuros") le.sort(porData);
      corpo = '<div class="filters"><input id="aF" type="search" placeholder="Procurar evento" value="' + esc(q.f || "") + '" aria-label="Procurar evento"><select id="aP" aria-label="Período"><option value="futuros"' + (periodo === "futuros" ? " selected" : "") + '>Próximos</option><option value="passados"' + (periodo === "passados" ? " selected" : "") + '>Passados</option><option value="todos"' + (periodo === "todos" ? " selected" : "") + '>Todos</option></select><a class="btn btn--sm" href="#/admin/novo-evento">' + ic("plus") + " Novo evento</a></div>" +
        (EE === undefined ? carregando() : falhou(EE) || (le.length ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>Data</th><th>Evento</th><th>Inscritos</th><th>Estado</th><th>Acções</th></tr></thead><tbody>' + le.map(function (e) {
          var g = grupo(e.grupo) || {};
          return "<tr><td>" + esc(fCurta.format(dt(e.inicio))) + '<div class="small">' + esc(fHora.format(dt(e.inicio))) + '</div></td><td><a class="link" href="#/evento/' + e.id + '">' + esc(e.titulo) + "</a>" + (e.oficial ? ' <span class="badge badge--gold">Oficial</span>' : "") + '<div class="small">' + esc(g.nome || e.grupo) + " · " + esc(e.formato === "online" ? "Online" : e.cidade) + "</div></td><td>" + e.nConfirmados + " / " + e.vagas + "</td><td>" + estadoBadge(e.estado) + '</td><td class="acts"><a class="btn btn--sm" href="#/gerir/' + e.id + '">Inscrições</a><a class="btn btn--line btn--sm" href="#/evento/' + e.id + '/editar">Editar</a></td></tr>';
        }).join("") + "</tbody></table></div>" : '<div class="empty">Nenhum evento.</div>'));
    } else if (sub === "utilizadores") {
      var qq = q.f || "", UU = need("admin:users:" + qq, function () { return API.adminUtilizadores(qq); });
      corpo = '<form class="filters" id="uF"><input name="f" type="search" placeholder="Procurar por nome, email ou telefone" value="' + esc(qq) + '" aria-label="Procurar utilizador" style="flex:1 1 260px"><button class="btn btn--sm" type="submit">Procurar</button><button class="btn btn--line btn--sm" type="button" data-act="csv-users">' + ic("download") + " Exportar CSV</button></form>" +
        (UU === undefined ? carregando() : falhou(UU) || (UU.length ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>Nome</th><th>Contacto</th><th class="hide-s">Cidade</th><th>Participações</th><th>Papel</th></tr></thead><tbody>' + UU.map(function (u) {
          return "<tr><td><b>" + esc(u.nome || "—") + '</b><div class="small">' + esc([u.cargo, u.organizacao].filter(Boolean).join(" · ")) + '</div><div class="small">Desde ' + esc(fCurta.format(dt(u.criado_em))) + "</div></td><td>" + esc(u.email || "") + '<br><span class="small">' + esc(u.telefone || "") + '</span></td><td class="hide-s">' + esc(u.cidade || "") + "</td><td>" + (u.n_inscricoes || 0) + ' <span class="small">(' + (u.n_presencas || 0) + " presenças)</span></td><td>" +
            (u.demo ? '<span class="small">exemplo</span>' : '<select data-papel="' + esc(u.id) + '" aria-label="Papel de ' + esc(u.nome) + '"' + (ST.user.id === u.id ? " disabled" : "") + '><option value="membro"' + (u.papel === "membro" ? " selected" : "") + '>Membro</option><option value="admin"' + (u.papel === "admin" ? " selected" : "") + ">Administrador</option></select>") + "</td></tr>";
        }).join("") + "</tbody></table></div>" : '<div class="empty">Nenhum utilizador.</div>'));
    } else if (sub === "moderacao") {
      var MM = need("admin:recentes", API.adminRecentes);
      corpo = '<p class="muted">Comentários em eventos e publicações em grupos, mais recentes primeiro.</p>' + (MM === undefined ? carregando() : falhou(MM) || (MM.length ? '<div class="box">' + MM.map(function (m) {
        return '<div class="comment">' + av(m.nome) + "<div><b>" + esc(m.nome) + '</b> <span class="small">' + esc(haQuanto(m.quando)) + " · " + (m.tipo === "comentario" ? 'comentário em <a class="link" href="#/evento/' + esc(m.onde) + '">' + esc((evento(m.onde) || {}).titulo || m.onde) + "</a>" : 'publicação em <a class="link" href="#/grupo/' + esc(m.onde) + '?tab=discussoes">' + esc((grupo(m.onde) || {}).nome || m.onde) + "</a>") +
          '</span> <button class="linkbtn" type="button" data-act="' + (m.tipo === "comentario" ? "apagar-com" : "apagar-post") + '" data-id="' + esc(m.id) + '" data-ev="' + esc(m.onde) + '" data-g="' + esc(m.onde) + '">Apagar</button><div>' + esc(m.t) + "</div></div></div>";
      }).join("") + "</div>" : '<div class="empty">Sem conteúdos.</div>'));
    } else if (sub === "novo-evento") {
      var gsel = ST.grupos.filter(function (g) { return g.estado === "aprovado"; });
      corpo = '<div style="max-width:760px"><h2>Novo evento</h2>' + (gsel.length ? formEvento(null, null, gsel) : '<div class="empty">Crie primeiro um grupo.</div>') + "</div>";
    } else return pgNada();
    main.innerHTML = adminNav(sub === "novo-evento" ? "eventos" : sub) + '<div class="wrap" style="padding:24px 0 50px">' + corpo + "</div>";
    if (sub === "novo-evento") ligarFormEvento();
    var aF = document.getElementById("aF"); if (aF) aF.addEventListener("change", function () { var o = copia(q); o.f = aF.value; location.hash = "#/admin/" + sub + qsBuild(o); });
    var aE = document.getElementById("aE"); if (aE) aE.addEventListener("change", function () { var o = copia(q); o.e = aE.value; location.hash = "#/admin/" + sub + qsBuild(o); });
    var aP = document.getElementById("aP"); if (aP) aP.addEventListener("change", function () { var o = copia(q); o.p = aP.value; location.hash = "#/admin/" + sub + qsBuild(o); });
    var uF = document.getElementById("uF"); if (uF) uF.addEventListener("submit", function (ev) { ev.preventDefault(); location.hash = "#/admin/utilizadores" + qsBuild({ f: new FormData(uF).get("f") }); });
    main.querySelectorAll("[data-papel]").forEach(function (s) { s.addEventListener("change", function () {
      var id = s.dataset.papel, v = s.value;
      if (v === "admin" && !confirm("Dar acesso de administrador a esta pessoa? Poderá aprovar grupos, editar eventos e ver contactos.")) { s.value = "membro"; return; }
      acao(function () { return API.adminPapel(id, v); }, "Papel actualizado", ["admin:users"]).catch(function () {});
    }); });
  }
  function linhaGrupoPendente(g) {
    return '<div class="box pend"><div class="gmini"><div class="ratio">' + capa(g.categoria, g.id) + '</div><div><a class="link" href="#/grupo/' + g.id + '"><b>' + esc(g.nome) + '</b></a><div class="small">' + esc(g.cidade) + " · " + esc(cat(g.categoria).nome) + '</div></div></div><p class="small" style="margin:10px 0;white-space:pre-line">' + esc(g.descricao) + '</p><div class="btns"><button class="btn btn--sm" type="button" data-act="aprovar" data-id="' + g.id + '">Aprovar</button><button class="btn btn--line btn--sm" type="button" data-act="rejeitar" data-id="' + g.id + '">Rejeitar</button></div></div>';
  }
  function estadoBadge(s) { var m = { aprovado: ["badge--ok", "Aprovado"], publicado: ["badge--ok", "Publicado"], pendente: ["badge--gold", "Em análise"], rascunho: ["badge--line", "Rascunho"], rejeitado: ["badge--brand", "Rejeitado"], cancelado: ["badge--brand", "Cancelado"] }[s] || ["badge--line", s]; return '<span class="badge ' + m[0] + '">' + m[1] + "</span>"; }

  function semPermissao(t) { main.innerHTML = '<div class="wrap--n wiz"><h1>Sem acesso</h1><p class="muted">' + esc(t || "Não tem permissão para ver esta página.") + '</p><a class="link" href="#/">Voltar ao início</a></div>'; }
  function pgNada() { main.innerHTML = '<div class="wrap--n wiz"><h1>Página não encontrada</h1><p class="muted">O evento ou grupo pode ter sido removido.</p><a class="link" href="#/">Voltar ao início</a></div>'; }
  function pgNovaPw() { main.innerHTML = '<div class="wrap--n wiz" style="max-width:480px"><h1>Nova palavra-passe</h1><form class="form" data-form="nova-pw"><label>Nova palavra-passe<input name="pw" type="password" minlength="6" required autocomplete="new-password"></label><button class="btn btn--lg" type="submit">Guardar</button></form></div>'; }

  /* ================= modais ================= */
  function abrir(html) { mBody.innerHTML = html; modal.hidden = false; var f = mBody.querySelector("input:not([disabled]),select,button:not([data-close])"); if (f) f.focus(); desenharQRs(mBody); }
  function fechar() { modal.hidden = true; mBody.innerHTML = ""; }
  function camposPerfil(u) {
    u = u || {};
    return '<label>Nome completo<input name="nome" required autocomplete="name" value="' + esc(u.nome || "") + '"></label>' +
      '<div class="two"><label>WhatsApp<input name="telefone" type="tel" autocomplete="tel" placeholder="+244 9xx xxx xxx" value="' + esc(u.telefone || "") + '"></label>' +
      '<label>Cidade<input name="cidade" list="dl-cidades" value="' + esc(u.cidade || "") + '"></label></div>' +
      '<div class="two"><label>Cargo<input name="cargo" value="' + esc(u.cargo || "") + '"></label><label>Organização<input name="organizacao" value="' + esc(u.organizacao || "") + '"></label></div>';
  }
  var depoisConta = null;
  function abrirConta(modo, depois) {
    if (depois !== undefined) depoisConta = depois;
    var cab = function (t, alt) { return '<div style="text-align:center;margin-bottom:14px"><img src="img/gilf-mark.png" alt="" style="width:48px;height:48px;border-radius:10px;margin:0 auto 10px;background:#fff"><h2 id="mTitle" style="margin:0">' + t + '</h2><p class="small" style="margin:4px 0 0">' + alt + "</p></div>"; };
    if (modo === "recuperar") {
      abrir(cab("Recuperar palavra-passe", "Enviamos-lhe um link por email.") + '<form class="form" data-form="recuperar"><label>Email<input name="email" type="email" required autocomplete="email"></label><button class="btn btn--lg btn--block" type="submit">Enviar link</button><p class="small" style="text-align:center;margin:0"><button class="linkbtn" type="button" data-act="entrar">Voltar a entrar</button></p></form>');
    } else if (modo === "entrar") {
      abrir(cab("Entrar no GiLF Eventos", 'Ainda não tem conta? <button class="linkbtn" type="button" data-act="registar">Registar</button>') +
        '<form class="form" data-form="entrar"><label>Email<input name="email" type="email" required autocomplete="email"></label><label>Palavra-passe<input name="pw" type="password" required autocomplete="current-password"></label><button class="btn btn--lg btn--block" type="submit">Entrar</button>' +
        '<p class="small" style="text-align:center;margin:0"><button class="linkbtn" type="button" data-act="recuperar">Esqueci-me da palavra-passe</button></p></form>');
    } else {
      abrir(cab("Registar no GiLF Eventos", 'Já tem conta? <button class="linkbtn" type="button" data-act="entrar">Entrar</button>') +
        '<form class="form" data-form="registar"><label>Nome completo<input name="nome" required autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label>' +
        '<div class="two"><label>WhatsApp<input name="telefone" type="tel" autocomplete="tel" placeholder="+244 9xx xxx xxx"></label><label>Cidade<input name="cidade" list="dl-cidades" value="Luanda"></label></div>' +
        '<label>Palavra-passe<input name="pw" type="password" minlength="6" required autocomplete="new-password"><span class="hint">Mínimo 6 caracteres</span></label>' +
        '<label class="check"><input type="checkbox" name="aceito" required> Aceito que o meu nome apareça nas listas de participantes e membros, e que a organização me contacte sobre os eventos.</label>' +
        '<button class="btn btn--lg btn--block" type="submit">Criar conta</button>' + (API.live ? "" : '<p class="small" style="margin:0;text-align:center">Modo demonstração: a primeira conta criada fica administradora.</p>') + "</form>");
    }
  }
  function precisaConta(depois) { if (ST.user) return true; abrirConta("registar", depois || null); return false; }

  function abrirParticipar(e) {
    var g = grupo(e.grupo) || {}, full = cheio(e);
    abrir('<h2 id="mTitle">' + (full ? "Entrar na lista de espera" : "Confirmar participação") + '</h2><p class="small">' + esc(e.titulo) + " · " + esc(quando(e.inicio)) + "</p>" +
      '<form class="form" data-form="participar" data-id="' + e.id + '">' +
      '<label>O que procura neste evento?<select name="objectivo"><option>Networking</option><option>Encontrar investidores</option><option>Encontrar clientes</option><option>Encontrar parceiros ou fornecedores</option><option>Emprego ou talento</option><option>Aprender</option></select></label>' +
      '<label class="check"><input type="checkbox" name="b2b" checked> Quero sugestões de reuniões B2B</label>' +
      (!souMembro(g.id) ? '<p class="note">Ao participar junta-se também ao grupo <b>' + esc(g.nome) + "</b>.</p>" : "") +
      (e.preco > 0 ? '<p class="note">Evento pago (' + esc(kz(e.preco)) + "). A organização envia-lhe por WhatsApp a referência para pagar por Multicaixa Express.</p>" : "") +
      (e.oficial ? '<p class="note">Evento oficial: esta inscrição regista o seu interesse; a Comissão Organizadora confirma o bilhete.</p>' : "") +
      '<button class="btn btn--lg btn--block" type="submit">' + (full ? "Entrar na lista de espera" : "Confirmar") + "</button></form>");
  }
  function sucesso(e, r) {
    var ok = r.estado === "confirmado", d = dt(e.inicio);
    var msg = (ok ? "Confirmo a minha participação" : "Inscrevi-me na lista de espera") + " — GiLF Eventos\n\n" + e.titulo + "\n" + fLong.format(d) + ", " + fHora.format(d) + "\n" + lugarTxt(e) + "\n\nNome: " + (ST.user ? ST.user.nome : "") + "\nCódigo: " + r.codigo;
    abrir('<div class="okmark">' + ic("check") + '</div><h2 id="mTitle">' + (ok ? "Vai participar!" : "Está na lista de espera") + "</h2>" +
      '<p class="small">' + (ok ? "O bilhete fica em «Os meus eventos». Mostre o código QR à entrada." : "Se alguém cancelar, o lugar passa automaticamente para si e o bilhete aparece em «Os meus eventos».") + "</p>" +
      (ok ? '<div style="display:flex;gap:14px;align-items:center;margin:14px 0"><div class="qr" data-qr="' + esc(r.codigo + "|" + e.id) + '"></div><div><div class="code">' + esc(r.codigo) + '</div><div class="small">' + esc(quando(e.inicio)) + "</div></div></div>" : '<p class="code">' + esc(r.codigo) + "</p>") +
      '<div class="btns"><a class="btn btn--wa" target="_blank" rel="noopener" href="' + wa(msg) + '">Enviar à organização</a><button class="btn btn--line" type="button" data-act="ics" data-id="' + e.id + '">Calendário</button></div>');
  }
  function desenharQRs(root) {
    root.querySelectorAll("[data-qr]").forEach(function (el) {
      try { var q = window.qrcode(0, "M"); q.addData(el.dataset.qr); q.make(); el.innerHTML = q.createSvgTag({ cellSize: 3, margin: 0, scalable: true }); }
      catch (x) { el.textContent = el.dataset.qr.split("|")[0]; }
    });
  }
  function baixarIcs(e) {
    function f(s) { return new Date(s).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
    function x(s) { return String(s || "").replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n"); }
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GiLF Eventos//PT", "BEGIN:VEVENT", "UID:" + e.id + "@gilfeventos", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(e.inicio), "DTEND:" + f(e.fim || e.inicio), "SUMMARY:" + x(e.titulo), "LOCATION:" + x(lugarTxt(e)), "DESCRIPTION:" + x(e.descricao + "\n\n" + location.href.split("#")[0] + "#/evento/" + e.id), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = e.id + ".ics"; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ================= cliques ================= */
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-act],[data-close],[data-go],[data-goto]");
    if (!t) { var m = document.getElementById("meMenu"); if (m && !ev.target.closest(".me")) m.classList.remove("on"); if (ev.target === modal) fechar(); return; }
    if (t.hasAttribute("data-close")) return fechar();
    if (t.dataset.go) { location.hash = t.dataset.go; return; }
    if (t.dataset.goto) { ev.preventDefault(); var alvo = t.dataset.goto; if (location.hash !== "#/" && location.hash !== "") { location.hash = "#/"; setTimeout(function () { var el = document.getElementById(alvo); if (el) el.scrollIntoView(); }, 80); } else { var el2 = document.getElementById(alvo); if (el2) el2.scrollIntoView({ behavior: "smooth" }); } return; }
    var a = t.dataset.act, id = t.dataset.id;
    if (t.tagName === "A") ev.preventDefault();
    if (a === "menu") { var mm = document.getElementById("meMenu"); mm.classList.toggle("on"); t.setAttribute("aria-expanded", mm.classList.contains("on")); return; }
    if (a === "entrar" || a === "registar" || a === "recuperar") { var then = t.dataset.then; abrirConta(a, then ? function () { location.hash = then; render(); } : undefined); return; }
    if (a === "sair") { acao(function () { return API.sair(); }, "Sessão terminada", [""]).then(function () { location.hash = "#/"; }).catch(function () {}); return; }
    if (a === "participar") { var e = evento(id); if (!precisaConta(function () { abrirParticipar(e); })) return; return abrirParticipar(e); }
    if (a === "cancelar") { if (!confirm("Cancelar a participação? O lugar passa para a próxima pessoa da lista de espera.")) return; acao(function () { return API.cancelar(id); }, "Participação cancelada", ["part:" + id]).catch(function () {}); return; }
    if (a === "juntar") { var fazer = function () { return acao(function () { return API.juntar(id); }, "Bem-vindo ao grupo!", ["memb:" + id]).catch(function () {}); }; if (!precisaConta(fazer)) return; fazer(); return; }
    if (a === "sair-grupo") { if (!confirm("Sair deste grupo?")) return; acao(function () { return API.sairGrupo(id); }, "Saiu do grupo", ["memb:" + id]).catch(function () {}); return; }
    if (a === "partilhar-grupo") { var g = grupo(id); window.open("https://wa.me/?text=" + encodeURIComponent("Junte-se ao grupo " + g.nome + " no GiLF Eventos: " + location.href.split("?")[0]), "_blank", "noopener"); return; }
    if (a === "ics") { baixarIcs(evento(id)); return; }
    if (a === "limpar") { location.hash = "#/procurar" + (/tipo=grupos/.test(location.hash) ? "?tipo=grupos" : ""); return; }
    if (a === "apagar-com") { if (!confirm("Apagar este comentário?")) return; acao(function () { return API.apagarComentario(id); }, "Comentário apagado", ["com:" + t.dataset.ev, "admin:recentes"]).catch(function () {}); return; }
    if (a === "apagar-post") { if (!confirm("Apagar esta publicação?")) return; acao(function () { return API.apagarPublicacao(id); }, "Publicação apagada", ["posts:" + t.dataset.g, "admin:recentes"]).catch(function () {}); return; }
    if (a === "aprovar" || a === "rejeitar") { acao(function () { return API.editarGrupo(id, { estado: a === "aprovar" ? "aprovado" : "rejeitado" }); }, a === "aprovar" ? "Grupo aprovado" : "Grupo rejeitado", ["admin:"]).catch(function () {}); return; }
    if (a === "destaque") { acao(function () { return API.editarGrupo(id, { destaque: t.dataset.v === "1" }); }, "Guardado", ["admin:"]).catch(function () {}); return; }
    if (a === "apagar-grupo") { if (!confirm("Apagar este grupo e TODOS os seus eventos e inscrições? Não pode ser desfeito.")) return; acao(function () { return API.apagarGrupo(id); }, "Grupo apagado", ["admin:"]).then(function () { location.hash = "#/admin/grupos"; }).catch(function () {}); return; }
    if (a === "apagar-evento") { if (!confirm("Apagar este evento e todas as inscrições? Para avisar os inscritos, prefira mudar o estado para «Cancelado».")) return; acao(function () { return API.apagarEvento(id); }, "Evento apagado", ["admin:"]).then(function () { location.hash = isAdmin() ? "#/admin/eventos" : "#/conta"; }).catch(function () {}); return; }
    if (a === "camera") { abrirCamera(id); return; }
    if (a === "parar-camera") { pararCamera(); var cb = document.getElementById("camBox"); if (cb) cb.hidden = true; return; }
    if (a === "csv-insc") {
      var L = C["insc:" + id]; if (!Array.isArray(L)) return; var ee = evento(id);
      csv([["Nome", "Email", "Telefone", "Cargo", "Organização", "Estado", "Código", "Procura", "B2B", "Presente", "Inscrito em"]].concat(L.map(function (i) { return [i.nome, i.email, i.telefone, i.cargo, i.organizacao, i.estado, i.codigo, i.objectivo, i.quer_b2b ? "sim" : "não", i.check_in_em ? "sim" : "não", fCurta.format(dt(i.criado_em))]; })), "inscricoes-" + ee.id + ".csv"); return;
    }
    if (a === "csv-users") {
      var k = Object.keys(C).filter(function (x) { return x.indexOf("admin:users:") === 0; })[0], U = k && C[k]; if (!Array.isArray(U)) return;
      csv([["Nome", "Email", "Telefone", "Cidade", "Cargo", "Organização", "Papel", "Participações", "Presenças", "Registado em"]].concat(U.filter(function (u) { return !u.demo; }).map(function (u) { return [u.nome, u.email, u.telefone, u.cidade, u.cargo, u.organizacao, u.papel, u.n_inscricoes, u.n_presencas, fCurta.format(dt(u.criado_em))]; })), "membros-gilf-eventos.csv"); return;
    }
    if (a === "repor-demo") { if (!confirm("Apagar todos os dados de demonstração deste browser e começar de novo?")) return; API.reporDemo(); limpar(); carregar().then(function () { desenharTopo(); location.hash = "#/"; render(); }); return; }
  });

  /* ================= formulários ================= */
  var TRATADO = { perfil: 1, participar: 1, comentar: 1, post: 1, "editar-grupo": 1, evento: 1, organizador: 1 };
  document.addEventListener("submit", async function (ev) {
    var f = ev.target, k = f.dataset && f.dataset.form; if (!k) return;
    ev.preventDefault(); var fd = new FormData(f), id = f.dataset.id, btn = f.querySelector("[type=submit]");
    function val(n) { return String(fd.get(n) || "").trim(); }
    if (btn) btn.disabled = true;
    try {
      if (k === "registar") {
        var r = await API.registar({ nome: val("nome"), email: val("email"), telefone: val("telefone"), cidade: val("cidade"), password: fd.get("pw") });
        if (r.confirmar) { abrir('<div class="okmark">' + ic("check") + '</div><h2 id="mTitle">Confirme o seu email</h2><p class="muted">Enviámos um link para <b>' + esc(val("email")) + "</b>. Abra-o para activar a conta e depois entre aqui. Veja também a pasta de spam.</p>"); return; }
        limpar(); await carregar(); desenharTopo(); fechar(); toast("Bem-vindo, " + val("nome").split(" ")[0]);
        var cb = depoisConta; depoisConta = null; if (cb) cb(); else render(); return;
      }
      if (k === "entrar") {
        await API.entrar(val("email"), fd.get("pw")); limpar(); await carregar(); desenharTopo(); fechar(); toast("Sessão iniciada");
        var cb2 = depoisConta; depoisConta = null; if (cb2) cb2(); else render(); return;
      }
      if (k === "recuperar") { await API.recuperar(val("email")); abrir('<div class="okmark">' + ic("check") + '</div><h2 id="mTitle">Verifique o seu email</h2><p class="muted">Se existir uma conta com <b>' + esc(val("email")) + "</b>, recebe um link para definir uma nova palavra-passe.</p>"); return; }
      if (k === "nova-pw") { await API.novaPassword(fd.get("pw")); toast("Palavra-passe alterada"); f.reset(); if (location.hash.indexOf("nova-password") >= 0) location.hash = "#/conta"; return; }
      if (k === "perfil") { await acao(function () { return API.guardarPerfil({ nome: val("nome"), telefone: val("telefone"), cidade: val("cidade"), cargo: val("cargo"), organizacao: val("organizacao") }); }, "Perfil guardado"); return; }
      if (k === "participar") {
        var e = evento(id), res = await acao(function () { return API.participar(id, val("objectivo"), !!fd.get("b2b")); }, null, ["part:" + id, "memb:" + e.grupo]);
        sucesso(evento(id) || e, res); return;
      }
      if (k === "comentar") { if (!precisaConta()) return; await acao(function () { return API.comentar(id, val("t")); }, null, ["com:" + id]); return; }
      if (k === "post") { await acao(function () { return API.publicar(id, val("t")); }, "Publicado", ["posts:" + id]); return; }
      if (k === "checkin") { await fazerCheckIn(id, val("codigo")); var inp = document.querySelector('[data-form=checkin] input'); if (inp) { inp.value = ""; inp.focus(); } return; }
      if (k === "organizador") { await acao(function () { return API.adminOrganizador(id, val("email"), true); }, "Organizador adicionado", ["memb:" + id]); return; }
      if (k === "editar-grupo") {
        var o = { nome: val("nome"), cidade: val("cidade"), categoria: val("categoria"), descricao: val("descricao") };
        if (isAdmin()) { o.estado = val("estado"); o.destaque = !!fd.get("destaque"); }
        await acao(function () { return API.editarGrupo(id, o); }, "Grupo guardado", ["admin:"]); location.hash = "#/grupo/" + id; return;
      }
      if (k === "evento") {
        if (val("hf") <= val("hi")) { toast("A hora de fim tem de ser depois do início", true); return; }
        var online = val("formato") === "online", gid = val("grupo") || f.dataset.g, g = grupo(gid) || {};
        var ini = new Date(val("data") + "T" + val("hi")), fimD = new Date(val("data") + "T" + val("hf"));
        var dados = { titulo: val("titulo"), inicio: ini.toISOString(), fim: fimD.toISOString(), formato: val("formato"), local: online ? "" : val("local") || "A confirmar", endereco: online ? "" : val("endereco"),
          cidade: online ? "Online" : val("cidade") || (g.cidade !== "Online" ? g.cidade : ""), vagas: Number(val("vagas")) || 40, preco: val("preco") === "" ? null : Number(val("preco")), descricao: val("descricao"), link: val("link"), certificado: !!fd.get("certificado") };
        if (isAdmin()) dados.oficial = !!fd.get("oficial");
        if (id) { dados.estado = val("estado") || "publicado"; await acao(function () { return API.editarEvento(id, dados); }, "Evento guardado", ["admin:"]); location.hash = "#/evento/" + id; }
        else { dados.grupo = gid; var nid = await acao(function () { return API.criarEvento(dados); }, "Evento publicado", ["admin:"]); location.hash = "#/evento/" + nid; }
        return;
      }
    } catch (e) { if (!TRATADO[k]) toast(e.message, true); }
    finally { if (btn && document.body.contains(btn)) btn.disabled = false; }
  });

  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) fechar(); });
  document.getElementById("hsearch").addEventListener("submit", function (ev) { ev.preventDefault(); var f = new FormData(this); location.hash = "#/procurar" + qsBuild({ q: f.get("q"), cidade: f.get("cidade") }); });

  /* ================= router ================= */
  function render() {
    var h = location.hash.replace(/^#\/?/, ""), parts = h.split("?"), seg = parts[0].split("/"), q = qsParse(parts[1]);
    if (seg[0] !== "gerir") pararCamera();
    document.body.classList.remove("has-bar");
    var mm = document.getElementById("meMenu"); if (mm) mm.classList.remove("on");
    switch (seg[0]) {
      case "": pgInicio(); break;
      case "procurar": pgProcurar(q); break;
      case "evento": if (seg[2] === "editar") pgEditarEvento(seg[1]); else pgEvento(seg[1]); break;
      case "grupo": if (seg[2] === "novo-evento") pgNovoEvento(seg[1]); else if (seg[2] === "editar") pgEditarGrupo(seg[1]); else pgGrupo(seg[1], q); break;
      case "criar-grupo": pgCriarGrupo(); break;
      case "gerir": pgGerir(seg[1], q); break;
      case "conta": pgConta(q); break;
      case "admin": pgAdmin(seg[1] || "", q); break;
      case "nova-password": pgNovaPw(); break;
      default: pgNada();
    }
  }
  var ultimo = location.hash;
  window.addEventListener("hashchange", function () {
    var mesma = ultimo.split("?")[0] === location.hash.split("?")[0] && /^#\/(procurar|grupo|conta|admin|gerir)/.test(location.hash);
    ultimo = location.hash; fechar(); render(); if (!mesma) window.scrollTo(0, 0);
  });
  API.onAuth(function (ev) {
    if (ev === "PASSWORD_RECOVERY") { location.hash = "#/nova-password"; return; }
    if (ev === "SIGNED_OUT") { carregar().then(function () { desenharTopo(); if (modal.hidden) render(); }); }
  });

  /* ================= arranque ================= */
  var demo = document.getElementById("demo");
  if (!API.live) { demo.hidden = false; demo.innerHTML = 'Modo demonstração: dados de exemplo guardados só neste browser. A primeira conta criada fica administradora. <button class="linkbtn" type="button" data-act="repor-demo">Repor dados</button>'; }
  document.getElementById("fMarca").textContent = "© GiLF Eventos · " + D.org.marca;
  document.getElementById("fWa").href = "https://wa.me/" + D.org.whatsapp;
  document.getElementById("dl-cidades").innerHTML = ["Online"].concat(D.cidades).map(function (c) { return '<option value="' + esc(c) + '">'; }).join("");
  main.innerHTML = '<div class="wrap" style="padding:60px 0">' + carregando() + "</div>";
  carregar().then(function () { desenharTopo(); render(); });
})();
