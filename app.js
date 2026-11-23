/* GiLF Eventos — protótipo sem servidor.
   Conta, participações, grupos e eventos criados ficam guardados neste browser.
   No MVP passam para a base de dados (schema.sql). */
(function () {
  "use strict";
  var D = window.GE_DATA;
  var main = document.getElementById("main");
  var modal = document.getElementById("modal");
  var mBody = document.getElementById("mBody");
  var P2 = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ================= utilidades ================= */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function hash(s) { var h = 0; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function slug(s) { return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "item"; }
  function qsParse(s) { var o = {}; (s || "").split("&").forEach(function (kv) { if (!kv) return; var p = kv.split("="); o[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); }); return o; }
  function qsBuild(o) { var a = []; Object.keys(o).forEach(function (k) { if (o[k]) a.push(encodeURIComponent(k) + "=" + encodeURIComponent(o[k])); }); return a.length ? "?" + a.join("&") : ""; }
  function kz(v) { return new Intl.NumberFormat("pt-PT").format(v) + " Kz"; }
  function wa(msg) { return "https://wa.me/" + D.org.whatsapp + "?text=" + encodeURIComponent(msg); }
  function toast(t) { var el = document.createElement("div"); el.className = "toast"; el.textContent = t; document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2400); }

  var fWd = new Intl.DateTimeFormat("pt-PT", { weekday: "short" });
  var fMs = new Intl.DateTimeFormat("pt-PT", { month: "short" });
  var fLong = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var fHora = new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" });
  var fMesAno = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" });
  function dt(s) { return new Date(s); }
  function ymd(d) { return d.getFullYear() + "-" + P2(d.getMonth() + 1) + "-" + P2(d.getDate()); }
  function dia0(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function addD(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function quando(s) {
    var d = dt(s), hoje = dia0(new Date()), dd = dia0(d), diff = Math.round((dd - hoje) / 864e5);
    var dia = diff === 0 ? "Hoje" : diff === 1 ? "Amanhã" : fWd.format(d) + ", " + d.getDate() + " de " + fMs.format(d);
    return (dia + " · " + fHora.format(d)).toUpperCase();
  }

  /* ================= ícones ================= */
  var PATH = {
    investimento: "M3 17l6-6 4 4 8-8M15 7h6v6",
    lideranca: "M5 21V4M5 4h12l-2.5 4L17 12H5",
    digital: "M4 5h16v11H4zM2 20h20M10 16v4M14 16v4",
    empreendedorismo: "M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2M9 15l-3-3c2-6 7-9 14-9 0 7-3 12-9 14zM15 9h.01",
    mulheres: "M12 13a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 13v8M8.5 17.5h7",
    jovens: "M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6",
    networking: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3",
    agro: "M5 19C5 10 10 5 20 4c-1 10-6 15-15 15zM5 19l7-7",
    cultura: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5s1-1.5 2-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8.5-9-8.5zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01",
    saude: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z",
    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5",
    cal: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    pin: "M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    video: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
    users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3",
    ticket: "M3 8V6h18v2a2 2 0 0 0 0 4v2H3v-2a2 2 0 0 0 0-4zM3 14v4h18v-4",
    share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
    check: "M5 12.5l4.5 4.5L19 7.5",
    plus: "M12 5v14M5 12h14",
    left: "M15 6l-6 6 6 6", right: "M9 6l6 6-6 6",
    lock: "M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
    globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
    star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
    chat: "M4 5h16v11H9l-5 4z",
    menu: "M4 7h16M4 12h16M4 17h16",
    award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14l-1.5 7 5-3 5 3-1.5-7"
  };
  function ic(n, cls) { return '<svg class="' + (cls || "ic") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (PATH[n] || PATH.users) + '"/></svg>'; }

  var CORES = {
    investimento: ["#0d5446", "#22a07c"], lideranca: ["#7d0f14", "#e0383e"], digital: ["#1a2766", "#4466e0"],
    empreendedorismo: ["#8a4300", "#f08c1c"], mulheres: ["#6a1650", "#d2489a"], jovens: ["#0b5868", "#1ab0c4"],
    networking: ["#38246a", "#8462e0"], agro: ["#2d5710", "#72b236"], cultura: ["#8b2600", "#f0612f"], saude: ["#0a5636", "#31c278"]
  };
  function cores(cat) { return CORES[cat] || CORES.lideranca; }
  function capa(cat, seed, oficial) {
    if (oficial) return '<div class="cover cover--gilf"><img src="img/gilf-mark.png" alt=""></div>';
    var c = cores(cat), h = hash(seed), circ = "";
    for (var i = 0; i < 4; i++) {
      var x = (h >> (i * 3)) % 400, y = (h >> (i * 4 + 1)) % 225, r = 30 + ((h >> (i * 2)) % 90);
      circ += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" opacity="' + (0.05 + (i % 3) * 0.04) + '"/>';
    }
    circ += '<path d="M0 ' + (150 + h % 50) + ' Q 120 ' + (110 + h % 60) + ' 220 ' + (165 + h % 30) + ' T 400 ' + (140 + h % 40) + ' V225 H0z" fill="#000" opacity=".12"/>';
    return '<div class="cover" style="--c1:' + c[0] + ";--c2:" + c[1] + ";--a:" + (100 + h % 80) + 'deg"><svg class="art" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + circ + "</svg>" +
      '<svg class="cic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (PATH[cat] || PATH.users) + '"/></svg></div>';
  }
  function iniciais(n) { var p = String(n || "?").trim().split(/\s+/); return (p[0].charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : "")).toUpperCase(); }
  function av(nome, cls) { return '<span class="av ' + (cls || "") + '" style="--h:' + (hash(nome) % 360) + '" title="' + esc(nome) + '">' + esc(iniciais(nome)) + "</span>"; }

  /* ================= estado local ================= */
  var KEY = "gilfeventos.v2";
  var S = { user: null, rsvps: {}, membros: [], grupos: [], eventos: [], comentarios: {}, posts: {} };
  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved) Object.keys(S).forEach(function (k) { if (saved[k] != null) S[k] = saved[k]; }); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  D.grupos = D.grupos.concat(S.grupos);
  D.eventos = D.eventos.concat(S.eventos);

  function grupo(id) { return byId(D.grupos, id); }
  function evento(id) { return byId(D.eventos, id); }
  function cat(id) { return byId(D.categorias, id) || { id: id, nome: id }; }
  function pessoa(id) { return byId(D.pessoas, id) || { id: id, nome: id, cargo: "" }; }
  function souOrg(gid) { var g = grupo(gid); return !!(g && g.meu); }
  function souMembro(gid) { return souOrg(gid) || S.membros.indexOf(gid) >= 0; }
  function nMembros(g) { return g.membros + (!g.meu && S.membros.indexOf(g.id) >= 0 ? 1 : 0); }
  function rsvp(eid) { return S.rsvps[eid] || null; }
  function vou(eid) { var r = rsvp(eid); return !!(r && r.estado === "confirmado"); }
  function nInscritos(e) { return e.inscritos + (vou(e.id) ? 1 : 0); }
  function cheio(e) { return nInscritos(e) >= e.vagas; }
  function catEvento(e) { var g = grupo(e.grupo); return g ? g.categoria : "networking"; }
  function paisDe(c) { return c === "Dubai" ? "Emirados Árabes Unidos" : c === "Lisboa" ? "Portugal" : D.cidades.indexOf(c) >= 0 ? "Angola" : ""; }
  function precoTxt(e) { return e.preco == null ? (e.precoTexto || "Ver condições") : e.preco === 0 ? "Gratuito" : kz(e.preco); }
  function lugarTxt(e) { return e.formato === "online" ? "Evento online" : [e.endereco || e.cidade, e.cidade !== e.endereco ? e.cidade : ""].filter(Boolean).join(", "); }
  function futuro(e) { return dt(e.fim || e.inicio).getTime() >= Date.now(); }
  function porData(a, b) { return dt(a.inicio) - dt(b.inicio); }
  function proximos() { return D.eventos.filter(futuro).sort(porData); }
  function participantes(e) {
    var base = D.pessoas.slice().sort(function (a, b) { return hash(e.id + a.id) - hash(e.id + b.id); });
    var n = Math.min(base.length, Math.max(3, Math.min(nInscritos(e), 12)));
    var lista = base.slice(0, n).map(function (p) { return p.nome; });
    if (vou(e.id) && S.user) lista.unshift(S.user.nome);
    return lista;
  }
  function codigo() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "GE-" + s; }
  function pontos() {
    var p = 0;
    Object.keys(S.rsvps).forEach(function (k) { p += S.rsvps[k].estado === "confirmado" ? 10 : 2; });
    p += S.membros.length * 5 + S.grupos.length * 30 + S.eventos.length * 20;
    if (S.user && S.user.cargo && S.user.cidade) p += 10;
    return p;
  }
  function precisaConta(depois) { if (S.user) return true; abrirConta("registar", depois); return false; }

  /* ================= componentes ================= */
  function cardEvento(e) {
    var g = grupo(e.grupo) || {}, ps = participantes(e).slice(0, 3), r = rsvp(e.id);
    var badges = (e.oficial ? '<span class="badge badge--gold">Evento oficial</span>' : "") +
      (e.formato === "online" ? '<span class="badge">' + ic("video", "ic") + "Online</span>" : "") +
      (r ? (r.estado === "confirmado" ? '<span class="badge badge--ok">' + ic("check") + "Vai</span>" : '<span class="badge">Lista de espera</span>') : cheio(e) ? '<span class="badge badge--brand">Esgotado</span>' : "");
    return '<a class="ecard" href="#/evento/' + e.id + '"><div class="ratio">' + capa(catEvento(e), e.id, e.oficial) + '<div class="badges">' + badges + "</div></div>" +
      '<div><div class="when">' + esc(quando(e.inicio)) + "</div><h3>" + esc(e.titulo) + '</h3><div class="by">' + esc(g.nome || "") + "</div></div>" +
      '<div class="row"><span class="stack">' + ps.map(function (n) { return av(n, "av--s"); }).join("") + "</span><span>" + nInscritos(e) + " participantes</span><span class=\"dot\">" + esc(precoTxt(e)) + "</span></div></a>";
  }
  function itemEvento(e) {
    var g = grupo(e.grupo) || {};
    return '<a class="ritem" href="#/evento/' + e.id + '"><div class="ratio">' + capa(catEvento(e), e.id, e.oficial) + "</div><div>" +
      '<div class="when">' + esc(quando(e.inicio)) + "</div><h3>" + esc(e.titulo) + '</h3><div class="by">' + esc(g.nome || "") + " · " + esc(lugarTxt(e)) + "</div>" +
      '<div class="row" style="margin-top:8px">' + (e.oficial ? '<span class="badge badge--gold">Oficial</span>' : "") + (e.formato === "online" ? '<span class="badge badge--teal">Online</span>' : "") +
      (vou(e.id) ? '<span class="badge badge--ok">Vai</span>' : cheio(e) ? '<span class="badge badge--brand">Esgotado</span>' : "") +
      "<span>" + nInscritos(e) + ' participantes</span><span class="dot hide-s">' + esc(precoTxt(e)) + "</span></div></div></a>";
  }
  function cardGrupo(g) {
    var prox = proximos().filter(function (e) { return e.grupo === g.id; }).length;
    return '<a class="gcard" href="#/grupo/' + g.id + '"><div class="ratio">' + capa(g.categoria, g.id) + (g.meu ? '<div class="badges" style="position:absolute;left:10px;top:10px"><span class="badge badge--gold">Organizador</span></div>' : "") + "</div>" +
      "<div><h3>" + esc(g.nome) + '</h3><div class="by">' + esc(g.cidade) + "</div></div>" +
      '<div class="row"><span>' + nMembros(g) + " membros</span><span class=\"dot\">" + (prox ? prox + " eventos" : "Sem eventos marcados") + "</span>" + (souMembro(g.id) && !g.meu ? '<span class="badge badge--ok">Membro</span>' : "") + "</div></a>";
  }
  function grade(items, cls) { return items.length ? '<div class="grid ' + (cls || "") + '">' + items.join("") + "</div>" : '<div class="empty">Nada encontrado com estes filtros.</div>'; }

  /* ================= cabeçalho ================= */
  function desenharTopo() {
    var r = document.getElementById("topR");
    if (S.user) {
      r.innerHTML = '<a class="iconbtn" href="#/procurar" aria-label="Pesquisar">' + ic("search") + "</a>" +
        '<a class="tlink tlink--hide" href="#/criar-grupo">Criar grupo</a>' +
        '<div class="me"><button class="me__btn" type="button" data-act="menu" aria-label="Menu da conta" aria-expanded="false">' + av(S.user.nome) + "</button>" +
        '<div class="menu" id="meMenu"><div style="padding:8px 12px"><b>' + esc(S.user.nome) + '</b><div class="small">' + pontos() + " pontos de liderança</div></div><hr>" +
        '<a href="#/conta">Os meus eventos</a><a href="#/conta?tab=grupos">Os meus grupos</a><a href="#/criar-grupo">Criar grupo</a><a href="#/conta?tab=perfil">Perfil</a><hr><button type="button" data-act="sair">Sair</button></div></div>';
    } else {
      r.innerHTML = '<a class="iconbtn" href="#/procurar" aria-label="Pesquisar">' + ic("search") + "</a>" +
        '<a class="tlink tlink--hide" href="#/criar-grupo">Criar grupo</a><button class="tlink" style="border:0;background:none" type="button" data-act="entrar">Entrar</button>' +
        '<button class="btn btn--sm" type="button" data-act="registar">Registar</button>';
    }
  }

  /* ================= páginas ================= */
  function pgInicio() {
    var ev = proximos();
    var online = ev.filter(function (e) { return e.formato === "online"; }).slice(0, 4);
    var cidade = (S.user && S.user.cidade) || "Luanda";
    var perto = ev.filter(function (e) { return e.cidade === cidade && e.formato !== "online"; }).slice(0, 4);
    var meus = ev.filter(function (e) { return rsvp(e.id); });
    var topo;
    if (S.user) {
      topo = '<section class="welcome"><div class="wrap"><h1>Olá, ' + esc(S.user.nome.split(" ")[0]) + "</h1>" +
        (meus.length ? '<div class="sec__head" style="margin-top:18px"><h2>Os seus próximos eventos</h2><a class="link" href="#/conta">Ver todos</a></div>' + grade(meus.slice(0, 4).map(cardEvento))
          : '<p class="muted">Ainda não tem eventos marcados. Explore abaixo e junte-se a um grupo perto de si.</p>') + "</div></section>";
    } else {
      topo = '<section class="hero"><div class="wrap hero__in"><div>' +
        "<h1>A plataforma de quem <em>lidera</em> — onde os interesses viram negócios e amizades</h1>" +
        "<p>Encontre grupos de líderes, investidores, empreendedores e da diáspora angolana. Participe em encontros todos os meses, perto de si ou online. O GiLF acontece uma vez por ano; a rede, todos os dias.</p>" +
        '<div class="btns"><button class="btn btn--lg" type="button" data-act="registar">Juntar-me ao GiLF Eventos</button><a class="btn btn--line btn--lg" href="#/procurar">Ver eventos</a></div></div>' +
        '<div class="collage" aria-hidden="true"><div class="c1">' + capa("lideranca", "hero1") + '</div><div class="c2">' + capa("digital", "hero2") + '</div><div class="c3">' + capa("investimento", "hero3") + "</div>" +
        '<div class="bubble"><span class="stack">' + av("Ana Domingos", "av--s") + av("Bruno Kiala", "av--s") + av("Kátia Fernandes", "av--s") + "</span>" + D.grupos.reduce(function (a, g) { return a + g.membros; }, 0).toLocaleString("pt-PT") + " membros</div></div>" +
        "</div></section>";
    }
    main.innerHTML = topo +
      '<section class="sec"><div class="wrap"><div class="sec__head"><h2>Eventos perto de ' + esc(cidade) + '</h2><a class="link" href="#/procurar?cidade=' + encodeURIComponent(cidade) + '">Ver todos os eventos</a></div>' + grade(perto.map(cardEvento)) + "</div></section>" +
      '<section class="sec"><div class="wrap"><div class="sec__head"><h2>Próximos eventos online</h2><a class="link" href="#/procurar?formato=online">Ver todos</a></div>' + grade(online.map(cardEvento)) + "</div></section>" +
      '<section class="sec" id="categorias"><div class="wrap"><div class="sec__head"><h2>Explore as principais categorias</h2></div><div class="cats">' +
        D.categorias.map(function (c) { var k = cores(c.id); return '<a class="cat" href="#/procurar?cat=' + c.id + '"><span class="cat__ic" style="--c1:' + k[0] + ";--c2:" + k[1] + '">' + ic(c.id) + "</span>" + esc(c.nome) + "</a>"; }).join("") +
      "</div></div></section>" +
      '<section class="sec sec--soft"><div class="wrap"><div class="sec__head"><h2>Grupos populares</h2><a class="link" href="#/procurar?tipo=grupos">Ver todos os grupos</a></div>' +
        grade(D.grupos.slice().sort(function (a, b) { return nMembros(b) - nMembros(a); }).slice(0, 6).map(cardGrupo), "grid--3") + "</div></section>" +
      '<section class="sec"><div class="wrap"><div class="sec__head"><h2>Como funciona o GiLF Eventos</h2></div><div class="how">' +
        '<a href="#/procurar?tipo=grupos"><div class="ill">' + ic("users") + "</div><h3>Junte-se a um grupo</h3><p class=\"small\" style=\"margin:0\">Grupos por cidade e por tema. Receba os convites por WhatsApp e não perca nenhum encontro.</p></a>" +
        '<a href="#/procurar"><div class="ill">' + ic("ticket") + "</div><h3>Encontre um evento</h3><p class=\"small\" style=\"margin:0\">Confirme a participação num toque. Entre com o bilhete QR e receba sugestões de reuniões B2B.</p></a>" +
        '<a href="#/criar-grupo"><div class="ill">' + ic("plus") + "</div><h3>Crie um grupo</h3><p class=\"small\" style=\"margin:0\">Lidere a comunidade da sua cidade ou sector, com o apoio da Luadeira e da marca GiLF.</p></a>" +
      "</div></div></section>" +
      '<section class="sec"><div class="wrap"><div class="sec__head"><h2>Cidades populares</h2></div><div class="cities">' +
        D.cidades.map(function (c, i) { var n = D.eventos.filter(function (e) { return e.cidade === c && futuro(e); }).length; return '<a class="city" href="#/procurar?cidade=' + encodeURIComponent(c) + '">' + capa(D.categorias[i % D.categorias.length].id, "city" + c) + "<span>" + esc(c) + "<small>" + n + " eventos</small></span></a>"; }).join("") +
      "</div></div></section>" +
      '<section class="sec"><div class="wrap"><div class="band"><div><h2>Leve o GiLF à sua cidade</h2><p>Crie um grupo e organize encontros com o apoio da Luadeira Digital Angola: inscrições, check-in por QR, certificados e ligação aos parceiros do GiLF.</p></div><a class="btn btn--lg" href="#/criar-grupo">Criar um grupo</a></div></div></section>';
  }

  /* ----- pesquisa ----- */
  var calMes = null;
  function intervalo(dia) {
    var h = dia0(new Date()), wd = h.getDay();
    if (dia === "hoje") return [h, addD(h, 1)];
    if (dia === "amanha") return [addD(h, 1), addD(h, 2)];
    if (dia === "fim-de-semana") { var sab = wd === 0 ? addD(h, -1) : addD(h, (6 - wd)); return [wd === 0 ? h : sab, addD(sab, 2)]; }
    var seg = addD(h, ((8 - wd) % 7) || 7);
    if (dia === "semana") return [h, seg];
    if (dia === "proxima-semana") return [seg, addD(seg, 7)];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dia || "")) { var d = new Date(dia + "T00:00"); return [d, addD(d, 1)]; }
    return null;
  }
  function pgProcurar(q) {
    var tipo = q.tipo === "grupos" ? "grupos" : "eventos";
    var cidades = ["Online"].concat(D.cidades);
    function sel(name, label, opts) {
      return '<select data-f="' + name + '" aria-label="' + label + '"><option value="">' + label + "</option>" + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (q[name] === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>";
    }
    var temFiltro = q.q || q.cidade || q.cat || q.dia || q.formato;
    var titulo = q.q ? "Resultados para «" + esc(q.q) + "»" : tipo === "grupos" ? "Grupos" + (q.cidade ? " em " + esc(q.cidade) : "") : "Eventos" + (q.cidade ? " perto de " + esc(q.cidade) : "");
    var filtros = '<div class="filters">' +
      (tipo === "eventos" ? sel("dia", "Qualquer dia", [["hoje", "Hoje"], ["amanha", "Amanhã"], ["fim-de-semana", "Este fim de semana"], ["semana", "Esta semana"], ["proxima-semana", "Próxima semana"]].concat(/^\d{4}/.test(q.dia || "") ? [[q.dia, fLong.format(new Date(q.dia + "T00:00"))]] : [])) +
        sel("formato", "Qualquer tipo", [["presencial", "Presencial"], ["online", "Online"]]) : "") +
      sel("cidade", "Qualquer cidade", cidades.map(function (c) { return [c, c]; })) +
      sel("cat", "Qualquer categoria", D.categorias.map(function (c) { return [c.id, c.nome]; })) +
      (tipo === "eventos" ? sel("preco", "Qualquer preço", [["gratis", "Gratuitos"], ["pago", "Pagos"]]) : "") +
      (temFiltro ? '<button class="clear" type="button" data-act="limpar">Limpar filtros</button>' : "") + "</div>";
    var txt = (q.q || "").toLowerCase(), res;
    if (tipo === "grupos") {
      res = D.grupos.filter(function (g) {
        if (q.cidade && g.cidade !== q.cidade) return false;
        if (q.cat && g.categoria !== q.cat) return false;
        if (txt && (g.nome + " " + g.descricao + " " + g.cidade + " " + cat(g.categoria).nome).toLowerCase().indexOf(txt) < 0) return false;
        return true;
      }).sort(function (a, b) { return nMembros(b) - nMembros(a); });
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
        if (txt && (e.titulo + " " + e.descricao + " " + (e.cidade || "") + " " + g.nome + " " + cat(g.categoria).nome).toLowerCase().indexOf(txt) < 0) return false;
        return true;
      });
    }
    var tabQ = function (t) { var o = {}; Object.keys(q).forEach(function (k) { o[k] = q[k]; }); o.tipo = t === "grupos" ? "grupos" : ""; if (t === "grupos") { o.dia = ""; o.formato = ""; o.preco = ""; } return "#/procurar" + qsBuild(o); };
    main.innerHTML = '<div class="wrap search-page"><div>' +
      "<h1 style=\"font-size:clamp(1.4rem,3vw,1.9rem)\">" + titulo + "</h1>" +
      '<form class="filters" id="pq" role="search" style="margin:12px 0 6px"><input name="q" type="search" placeholder="Pesquisar eventos e grupos" value="' + esc(q.q || "") + '" style="flex:1 1 240px;border-radius:10px"><button class="btn btn--sm" type="submit">Pesquisar</button></form>' +
      '<div class="tabs"><a href="' + tabQ("eventos") + '" class="' + (tipo === "eventos" ? "on" : "") + '">Eventos</a><a href="' + tabQ("grupos") + '" class="' + (tipo === "grupos" ? "on" : "") + '">Grupos</a></div>' +
      filtros + '<p class="small">' + res.length + (tipo === "grupos" ? " grupos" : " eventos") + "</p>" +
      (tipo === "grupos" ? grade(res.map(cardGrupo), "grid--3") : res.length ? res.map(itemEvento).join("") : '<div class="empty">Nenhum evento com estes filtros. <button class="link" style="border:0;background:none" type="button" data-act="limpar">Limpar filtros</button></div>') +
      "</div><aside>" + (tipo === "eventos" ? '<div class="cal" id="cal"></div>' : "") + "</aside></div>";
    main.querySelectorAll("[data-f]").forEach(function (s) {
      s.addEventListener("change", function () { var o = {}; Object.keys(q).forEach(function (k) { o[k] = q[k]; }); o[s.dataset.f] = s.value; location.hash = "#/procurar" + qsBuild(o); });
    });
    document.getElementById("pq").addEventListener("submit", function (ev) { ev.preventDefault(); var o = {}; Object.keys(q).forEach(function (k) { o[k] = q[k]; }); o.q = new FormData(this).get("q"); location.hash = "#/procurar" + qsBuild(o); });
    if (tipo === "eventos") desenharCal(q);
  }
  function desenharCal(q) {
    var el = document.getElementById("cal"); if (!el) return;
    var hoje = dia0(new Date());
    if (!calMes) calMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    var dias = {}; proximos().forEach(function (e) { dias[ymd(dt(e.inicio))] = 1; });
    var first = new Date(calMes), off = (first.getDay() + 6) % 7, total = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    var h = '<div class="cal__h"><button type="button" data-cal="-1" aria-label="Mês anterior">' + ic("left") + "</button><span>" + esc((function (t) { return t.charAt(0).toUpperCase() + t.slice(1); })(fMesAno.format(first))) + '</span><button type="button" data-cal="1" aria-label="Mês seguinte">' + ic("right") + '</button></div><div class="cal__g">' +
      ["S", "T", "Q", "Q", "S", "S", "D"].map(function (d) { return "<b>" + d + "</b>"; }).join("");
    for (var i = 0; i < off; i++) h += "<span></span>";
    for (var d = 1; d <= total; d++) {
      var day = new Date(first.getFullYear(), first.getMonth(), d), k = ymd(day), cls = [];
      if (dias[k]) cls.push("has"); if (k === ymd(hoje)) cls.push("today"); if (q.dia === k) cls.push("sel"); if (day < hoje) cls.push("past");
      h += '<button type="button" class="' + cls.join(" ") + '" data-dia="' + k + '"' + (day < hoje ? " disabled" : "") + ' aria-label="' + esc(fLong.format(day)) + '">' + d + "</button>";
    }
    el.innerHTML = h + '</div><p class="small" style="margin:10px 0 0">Os dias com ponto têm eventos.</p>';
    el.querySelectorAll("[data-cal]").forEach(function (b) { b.addEventListener("click", function () { calMes = new Date(calMes.getFullYear(), calMes.getMonth() + Number(b.dataset.cal), 1); desenharCal(q); }); });
    el.querySelectorAll("[data-dia]").forEach(function (b) { b.addEventListener("click", function () { var o = {}; Object.keys(q).forEach(function (k) { o[k] = q[k]; }); o.dia = q.dia === b.dataset.dia ? "" : b.dataset.dia; location.hash = "#/procurar" + qsBuild(o); }); });
  }

  /* ----- evento ----- */
  function pgEvento(id) {
    var e = evento(id); if (!e) return pgNada();
    var g = grupo(e.grupo) || { nome: "", organizadores: [] }, org = g.meu ? (S.user ? S.user.nome : "Você") : pessoa((g.organizadores || [])[0]).nome;
    var d = dt(e.inicio), f = dt(e.fim || e.inicio), ps = participantes(e), r = rsvp(e.id), full = cheio(e), passado = !futuro(e);
    var coms = (D.comentarios[e.id] || []).map(function (c) { return { nome: pessoa(c[0]).nome, t: c[1] }; }).concat(S.comentarios[e.id] || []);
    var semelhantes = proximos().filter(function (x) { return x.id !== e.id && (catEvento(x) === catEvento(e) || x.cidade === e.cidade); }).slice(0, 4);
    var acao;
    if (passado) acao = '<button class="btn" disabled>Evento terminado</button>';
    else if (r && r.estado === "confirmado") acao = '<a class="btn btn--ok" href="#/conta">' + ic("check") + " Vai participar</a>";
    else if (r) acao = '<button class="btn btn--line" type="button" data-act="cancelar" data-id="' + e.id + '">Na lista de espera · sair</button>';
    else acao = '<button class="btn btn--lg" type="button" data-act="participar" data-id="' + e.id + '">' + (full ? "Entrar na lista de espera" : "Participar") + "</button>";
    var vagas = e.vagas - nInscritos(e);
    document.body.classList.add("has-bar");
    main.innerHTML =
      '<section class="ehead"><div class="wrap"><div class="small">' + esc(fLong.format(d)) + "</div><h1>" + esc(e.titulo) + "</h1>" +
        '<div class="host">' + av(org) + '<div><div class="small">Organizado por</div><b>' + esc(org) + '</b> · <a class="link" href="#/grupo/' + esc(g.id) + '">' + esc(g.nome) + "</a></div></div></div></section>" +
      '<section class="ebody"><div class="wrap ebody__in"><div>' +
        '<div class="ratio" style="border-radius:16px;margin-bottom:22px">' + capa(catEvento(e), e.id, e.oficial) + "</div>" +
        '<h2>Detalhes</h2><div class="desc">' + esc(e.descricao) + "</div>" +
        (e.link ? '<p style="margin-top:12px"><a class="link" href="' + esc(e.link) + '" target="_blank" rel="noopener">Site oficial do evento ›</a></p>' : "") +
        '<div class="row" style="margin:16px 0 28px">' + (e.certificado ? '<span class="badge badge--line">' + ic("award") + " Com certificado</span>" : "") + '<span class="badge badge--line">' + esc(cat(catEvento(e)).nome) + "</span>" + (e.formato === "online" ? '<span class="badge badge--teal">Online</span>' : "") + "</div>" +
        '<div class="box" style="margin-bottom:28px"><h3 style="display:flex;gap:8px;align-items:center">' + ic("users") + " Reuniões B2B</h3><p class=\"small\" style=\"margin:0\">Ao confirmar, indique o que procura. 48 horas antes recebe por WhatsApp até 3 sugestões de pessoas com quem reunir neste evento.</p></div>" +
        '<div class="sec__head"><h2>Participantes (' + nInscritos(e) + ')</h2></div><div class="people" style="margin-bottom:28px">' +
          ps.slice(0, 8).map(function (n, i) { var p = D.pessoas.filter(function (x) { return x.nome === n; })[0]; return '<div class="person">' + av(n, "av--l") + "<b>" + esc(n) + "</b>" + (i === 0 && vou(e.id) ? '<span class="role">Você</span>' : p && (g.organizadores || []).indexOf(p.id) >= 0 ? '<span class="role">Organizador</span>' : '<span class="small">' + esc(p ? p.cargo : "Membro") + "</span>") + "</div>"; }).join("") +
        "</div>" +
        '<h2>Comentários (' + coms.length + ')</h2><div class="box">' +
          (coms.length ? coms.map(function (c) { return '<div class="comment">' + av(c.nome) + "<div><b>" + esc(c.nome) + '</b><div>' + esc(c.t) + "</div></div></div>"; }).join("") : '<p class="small" style="margin:0">Ainda sem comentários. Seja o primeiro.</p>') +
          '<form class="cform" data-form="comentar" data-id="' + e.id + '"><input name="t" placeholder="' + (S.user ? "Escreva um comentário…" : "Entre para comentar") + '" aria-label="Comentário" required maxlength="500"><button class="btn btn--sm" type="submit">Enviar</button></form>' +
        "</div>" +
      "</div><aside class=\"side\">" +
        '<a class="box gmini" href="#/grupo/' + esc(g.id) + '" style="display:flex"><div class="ratio">' + capa(g.categoria, g.id) + "</div><div><b style=\"color:var(--ink)\">" + esc(g.nome) + '</b><div class="small">' + (g.id ? nMembros(g) + " membros · Grupo público" : "") + "</div></div></a>" +
        '<div class="box facts">' +
          '<div class="fact">' + ic("clock") + "<div><b>" + esc(fLong.format(d)) + "</b>" + esc(fHora.format(d)) + " – " + esc(fHora.format(f)) + "</div></div>" +
          (e.formato === "online" ? '<div class="fact">' + ic("video") + "<div><b>Evento online</b>O link é enviado por WhatsApp a quem confirmar.</div></div>"
            : '<div class="fact">' + ic("pin") + "<div><b>" + esc(e.local || "A confirmar") + "</b>" + esc(lugarTxt(e)) + '<br><a class="link" target="_blank" rel="noopener" href="https://www.google.com/maps/search/' + encodeURIComponent((e.local && e.local !== "A confirmar" ? e.local + ", " : "") + (e.endereco || "") + ", " + e.cidade) + '">Abrir no mapa</a></div></div>') +
          '<div class="fact">' + ic("ticket") + "<div><b>" + esc(precoTxt(e)) + "</b>" + (e.preco > 0 ? "Pagamento por Multicaixa Express ou referência" : vagas > 0 ? vagas + " lugares disponíveis" : "Esgotado · lista de espera aberta") + "</div></div>" +
          '<div class="btns"><button class="btn btn--line btn--sm" type="button" data-act="ics" data-id="' + e.id + '">' + ic("cal") + ' Calendário</button><a class="btn btn--line btn--sm" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(e.titulo + " — " + fLong.format(d) + " · " + location.href) + '">' + ic("share") + " Partilhar</a></div>" +
        "</div>" +
      "</aside></div></section>" +
      (semelhantes.length ? '<section class="sec"><div class="wrap"><h2>Eventos semelhantes</h2>' + grade(semelhantes.map(cardEvento)) + "</div></section>" : "") +
      '<div class="ebar"><div class="wrap ebar__in"><div class="ebar__l"><span class="when">' + esc(quando(e.inicio)) + "</span><b>" + esc(e.titulo) + '</b></div><div class="ebar__r"><div class="ebar__price"><b>' + esc(precoTxt(e)) + "</b>" + (passado ? "" : vagas > 0 ? vagas + " lugares" : "Esgotado") + "</div>" + acao + "</div></div></div>";
  }

  /* ----- grupo ----- */
  function pgGrupo(id, q) {
    var g = grupo(id); if (!g) return pgNada();
    var tab = q.tab || "sobre", membro = souMembro(g.id), orgs = g.meu ? [S.user ? S.user.nome : "Você"] : (g.organizadores || []).map(function (p) { return pessoa(p).nome; });
    var evs = D.eventos.filter(function (e) { return e.grupo === g.id; }), prox = evs.filter(futuro).sort(porData), pass = evs.filter(function (e) { return !futuro(e); });
    var membros = (g.meu ? [] : D.pessoas.filter(function (p) { return hash(g.id + p.id) % 3 !== 0 || (g.organizadores || []).indexOf(p.id) >= 0; }).map(function (p) { return { nome: p.nome, cargo: p.cargo, org: (g.organizadores || []).indexOf(p.id) >= 0 }; }));
    if (S.user && membro) membros.unshift({ nome: S.user.nome, cargo: S.user.cargo || "", org: !!g.meu, eu: true });
    var acoes = g.meu ? '<a class="btn" href="#/grupo/' + g.id + '/novo-evento">' + ic("plus") + ' Criar evento</a><button class="btn btn--line" type="button" data-act="partilhar-grupo" data-id="' + g.id + '">' + ic("share") + " Convidar</button>"
      : membro ? '<button class="btn btn--ok" type="button" data-act="sair-grupo" data-id="' + g.id + '">' + ic("check") + ' É membro · sair</button><button class="btn btn--line" type="button" data-act="partilhar-grupo" data-id="' + g.id + '">' + ic("share") + " Convidar</button>"
      : '<button class="btn btn--lg" type="button" data-act="juntar" data-id="' + g.id + '">Juntar-me a este grupo</button>';
    var corpo;
    if (tab === "eventos") {
      var vista = q.v === "passados" ? pass : prox;
      corpo = '<div><div class="seg"><button type="button" class="' + (q.v !== "passados" ? "on" : "") + '" data-go="#/grupo/' + g.id + '?tab=eventos">Próximos (' + prox.length + ')</button><button type="button" class="' + (q.v === "passados" ? "on" : "") + '" data-go="#/grupo/' + g.id + '?tab=eventos&v=passados">Passados (' + pass.length + ")</button></div>" +
        (vista.length ? vista.map(itemEvento).join("") : '<div class="empty">' + (q.v === "passados" ? "Ainda sem eventos passados." : "Sem eventos marcados." + (g.meu ? ' <a class="link" href="#/grupo/' + g.id + '/novo-evento">Criar o primeiro evento</a>' : "")) + "</div>") + "</div>";
    } else if (tab === "membros") {
      corpo = '<div><h2>Membros (' + nMembros(g) + ')</h2><div class="people">' + membros.map(function (m) { return '<div class="person">' + av(m.nome, "av--l") + "<b>" + esc(m.nome) + "</b>" + (m.eu ? '<span class="role">Você</span>' : m.org ? '<span class="role">Organizador</span>' : '<span class="small">' + esc(m.cargo) + "</span>") + "</div>"; }).join("") + "</div>" +
        (g.membros > membros.length ? '<p class="small" style="margin-top:14px">E mais ' + (nMembros(g) - membros.length) + " membros.</p>" : "") + "</div>";
    } else if (tab === "discussoes") {
      var posts = (D.discussoes[g.id] || []).map(function (c) { return { nome: pessoa(c[0]).nome, t: c[1] }; }).concat(S.posts[g.id] || []).reverse();
      corpo = "<div><h2>Discussões</h2>" + (membro ? '<form class="box form" data-form="post" data-id="' + g.id + '" style="margin-bottom:16px"><label>Nova publicação<textarea name="t" required maxlength="1000" placeholder="Partilhe uma ideia, pergunta ou oportunidade com o grupo"></textarea></label><div><button class="btn btn--sm" type="submit">Publicar</button></div></form>' : '<div class="note" style="margin-bottom:16px">Junte-se ao grupo para participar nas discussões.</div>') +
        (posts.length ? '<div class="box">' + posts.map(function (p) { return '<div class="comment">' + av(p.nome) + "<div><b>" + esc(p.nome) + "</b><div style=\"white-space:pre-line\">" + esc(p.t) + "</div></div></div>"; }).join("") + "</div>" : '<div class="empty">Ainda sem publicações.</div>') + "</div>";
    } else {
      corpo = '<div><h2>O que fazemos</h2><div class="desc" style="margin-bottom:26px">' + esc(g.descricao) + "</div>" +
        '<div class="sec__head"><h2>Próximos eventos (' + prox.length + ")</h2>" + (prox.length > 2 ? '<a class="link" href="#/grupo/' + g.id + '?tab=eventos">Ver todos</a>' : "") + "</div>" +
        (prox.length ? prox.slice(0, 2).map(itemEvento).join("") : '<div class="empty">Sem eventos marcados.' + (g.meu ? ' <a class="link" href="#/grupo/' + g.id + '/novo-evento">Criar o primeiro evento</a>' : "") + "</div>") + "</div>";
    }
    main.innerHTML = '<section class="ghead"><div class="wrap ghead__in"><div class="ratio">' + capa(g.categoria, g.id) + "</div><div>" +
        (g.meu ? '<div class="status">' + ic("clock") + " Em análise pela Luadeira (até 48h)</div>" : "") +
        "<h1>" + esc(g.nome) + '</h1><div class="gfacts">' +
          "<div>" + ic("pin") + esc(g.cidade) + (g.cidade === "Online" ? " · encontros online" : ", " + esc(paisDe(g.cidade))) + "</div>" +
          "<div>" + ic("users") + nMembros(g) + " membros · Grupo público</div>" +
          "<div>" + ic("star") + "Organizado por <b style=\"color:var(--ink)\">" + esc(orgs[0] || "") + "</b>" + (orgs.length > 1 ? " e mais " + (orgs.length - 1) : "") + "</div>" +
          "<div>" + ic(g.categoria) + esc(cat(g.categoria).nome) + (g.desde ? " · desde " + esc(g.desde) : "") + "</div>" +
        '</div><div class="btns">' + acoes + "</div></div></div></section>" +
      '<div class="gtabs"><div class="wrap"><div class="tabs">' +
        [["sobre", "Sobre"], ["eventos", "Eventos"], ["membros", "Membros"], ["discussoes", "Discussões"]].map(function (t) { return '<a href="#/grupo/' + g.id + "?tab=" + t[0] + '" class="' + (tab === t[0] ? "on" : "") + '">' + t[1] + "</a>"; }).join("") +
      "</div></div></div>" +
      '<div class="wrap gbody">' + corpo + '<aside><div class="box"><h3>Organizadores</h3>' + orgs.map(function (n) { return '<div class="gmini" style="margin-top:10px">' + av(n) + "<div><b style=\"color:var(--ink)\">" + esc(n) + '</b><div class="small">Organizador</div></div></div>'; }).join("") +
        '</div><div class="box"><h3>Membros</h3><div class="stack" style="margin:8px 0">' + membros.slice(0, 8).map(function (m) { return av(m.nome); }).join("") + '</div><a class="link" href="#/grupo/' + g.id + '?tab=membros">Ver todos (' + nMembros(g) + ")</a></div></aside></div>";
  }

  /* ----- criar grupo ----- */
  var wiz = null;
  function pgCriarGrupo() {
    if (!S.user) {
      main.innerHTML = '<div class="wrap--n wiz"><h1>Crie o seu grupo</h1><p class="muted">Para criar um grupo precisa de uma conta GiLF Eventos.</p><button class="btn btn--lg" type="button" data-act="registar" data-then="#/criar-grupo">Registar e continuar</button></div>';
      return;
    }
    if (!wiz) wiz = { passo: 1, cidade: S.user.cidade || "", cats: [], nome: "", descricao: "", ok: false };
    var n = 5, p = wiz.passo, corpo = "";
    if (p === 1) corpo = "<h1>Primeiro, onde fica o seu grupo?</h1><p class=\"muted\">Os membros encontram grupos pela cidade. Escolha \"Online\" se os encontros forem só pela internet.</p>" +
      '<div class="chips" style="margin:18px 0">' + ["Online"].concat(D.cidades).map(function (c) { return '<button type="button" class="chip' + (wiz.cidade === c ? " on" : "") + '" data-wz="cidade" data-v="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + "</div>" +
      '<div class="form"><label>Outra cidade<input id="wzCidade" value="' + esc(D.cidades.indexOf(wiz.cidade) < 0 && wiz.cidade !== "Online" ? wiz.cidade : "") + '" placeholder="Ex.: Malanje, Namibe, Joanesburgo"></label></div>';
    if (p === 2) corpo = "<h1>Escolha até 3 temas</h1><p class=\"muted\">Ajudam as pessoas certas a encontrar o seu grupo.</p><div class=\"chips\" style=\"margin-top:18px\">" +
      D.categorias.map(function (c) { return '<button type="button" class="chip' + (wiz.cats.indexOf(c.id) >= 0 ? " on" : "") + '" data-wz="cat" data-v="' + c.id + '">' + ic(c.id) + esc(c.nome) + "</button>"; }).join("") + "</div>";
    if (p === 3) corpo = "<h1>Qual será o nome do grupo?</h1><p class=\"muted\">Escolha um nome claro, que diga o tema e o lugar. Pode mudar mais tarde.</p><div class=\"form\" style=\"margin-top:18px\"><label>Nome do grupo<input id=\"wzNome\" maxlength=\"70\" value=\"" + esc(wiz.nome) + '" placeholder="Ex.: Líderes do Lobito"></label><span class="hint" id="wzN">' + wiz.nome.length + "/70</span></div>";
    if (p === 4) corpo = "<h1>Descreva o propósito do grupo</h1><p class=\"muted\">As pessoas vão ler isto antes de se juntarem.</p><ul class=\"small\"><li>Qual é o objectivo do grupo?</li><li>Quem deve juntar-se?</li><li>O que vão fazer nos encontros?</li></ul><div class=\"form\"><label>Descrição<textarea id=\"wzDesc\" maxlength=\"2000\" placeholder=\"Mínimo de 50 caracteres\">" + esc(wiz.descricao) + '</textarea></label><span class="hint" id="wzD">' + wiz.descricao.length + " caracteres (mínimo 50)</span></div>";
    if (p === 5) corpo = "<h1>Quase pronto</h1><p class=\"muted\">Reveja o seu grupo.</p><div class=\"box\" style=\"margin:16px 0\"><div class=\"gmini\"><div class=\"ratio\">" + capa(wiz.cats[0] || "networking", "novo" + wiz.nome) + "</div><div><b style=\"color:var(--ink)\">" + esc(wiz.nome) + '</b><div class="small">' + esc(wiz.cidade) + " · " + wiz.cats.map(function (c) { return esc(cat(c).nome); }).join(", ") + '</div></div></div><p class="small" style="margin:12px 0 0;white-space:pre-line">' + esc(wiz.descricao) + "</p></div>" +
      '<div class="form"><label class="check"><input type="checkbox" id="wzOk"' + (wiz.ok ? " checked" : "") + "> Li e aceito as Regras da Comunidade GiLF: respeito, sem spam, eventos reais e abertos. O grupo fica em análise pela Luadeira Digital Angola até 48 horas.</label></div>";
    var podeSeguir = p === 1 ? !!wiz.cidade : p === 2 ? wiz.cats.length > 0 : p === 3 ? wiz.nome.trim().length >= 4 : p === 4 ? wiz.descricao.trim().length >= 50 : wiz.ok;
    main.innerHTML = '<div class="wrap--n wiz"><div class="small" style="margin-bottom:8px">Passo ' + p + " de " + n + '</div><div class="prog"><i style="width:' + (p / n * 100) + '%"></i></div>' + corpo +
      '<div class="wiz__nav"><button class="btn btn--line" type="button" data-wznav="-1"' + (p === 1 ? " disabled" : "") + ">Voltar</button><button class=\"btn\" type=\"button\" id=\"wzNext\" data-wznav=\"1\"" + (podeSeguir ? "" : " disabled") + ">" + (p === n ? "Criar grupo" : "Seguinte") + "</button></div></div>";
    function refresh() { var ok = p === 3 ? wiz.nome.trim().length >= 4 : p === 4 ? wiz.descricao.trim().length >= 50 : p === 5 ? wiz.ok : p === 1 ? !!wiz.cidade : wiz.cats.length > 0; document.getElementById("wzNext").disabled = !ok; }
    var ci = document.getElementById("wzCidade"); if (ci) ci.addEventListener("input", function () { wiz.cidade = ci.value.trim(); main.querySelectorAll("[data-wz=cidade]").forEach(function (b) { b.classList.remove("on"); }); refresh(); });
    var no = document.getElementById("wzNome"); if (no) no.addEventListener("input", function () { wiz.nome = no.value; document.getElementById("wzN").textContent = no.value.length + "/70"; refresh(); });
    var de = document.getElementById("wzDesc"); if (de) de.addEventListener("input", function () { wiz.descricao = de.value; document.getElementById("wzD").textContent = de.value.length + " caracteres (mínimo 50)"; refresh(); });
    var ok = document.getElementById("wzOk"); if (ok) ok.addEventListener("change", function () { wiz.ok = ok.checked; refresh(); });
    main.querySelectorAll("[data-wz]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.dataset.wz === "cidade") { wiz.cidade = b.dataset.v; }
        else { var i = wiz.cats.indexOf(b.dataset.v); if (i >= 0) wiz.cats.splice(i, 1); else if (wiz.cats.length < 3) wiz.cats.push(b.dataset.v); else toast("Pode escolher até 3 temas"); }
        pgCriarGrupo();
      });
    });
    main.querySelectorAll("[data-wznav]").forEach(function (b) {
      b.addEventListener("click", function () {
        var dir = Number(b.dataset.wznav);
        if (dir > 0 && p === n) {
          var id = slug(wiz.nome), base = id, k = 2; while (grupo(id)) id = base + "-" + k++;
          var novo = { id: id, nome: wiz.nome.trim(), cidade: wiz.cidade, pais: "", categoria: wiz.cats[0], temas: wiz.cats.slice(), membros: 1, organizadores: [], desde: String(new Date().getFullYear()), descricao: wiz.descricao.trim(), meu: true };
          S.grupos.push(novo); D.grupos.push(novo); save(); wiz = null;
          location.hash = "#/grupo/" + id;
          setTimeout(function () { abrir('<div class="okmark">' + ic("check") + '</div><h2 id="mTitle">Grupo criado!</h2><p class="muted">O grupo fica visível para todos depois da análise da Luadeira (até 48 horas). Entretanto, já pode marcar o primeiro evento.</p><div class="btns"><a class="btn" href="#/grupo/' + id + '/novo-evento">Criar o primeiro evento</a><a class="btn btn--wa" target="_blank" rel="noopener" href="' + wa("Criei um grupo no GiLF Eventos e peço a aprovação:\n\n" + novo.nome + "\n" + novo.cidade + "\n\n" + novo.descricao) + '">Avisar a Luadeira</a></div>'); }, 50);
          return;
        }
        wiz.passo = Math.max(1, Math.min(n, p + dir)); pgCriarGrupo(); window.scrollTo(0, 0);
      });
    });
  }

  /* ----- criar evento ----- */
  function pgNovoEvento(gid) {
    var g = grupo(gid); if (!g) return pgNada();
    if (!souOrg(gid)) { main.innerHTML = '<div class="wrap--n wiz"><h1>Só os organizadores podem criar eventos</h1><p><a class="link" href="#/grupo/' + gid + '">Voltar ao grupo</a></p></div>'; return; }
    var amanha = ymd(addD(new Date(), 7));
    main.innerHTML = '<div class="wrap--n wiz"><div class="small"><a class="link" href="#/grupo/' + g.id + '">' + esc(g.nome) + '</a></div><h1>Criar um evento</h1>' +
      '<form class="form" id="fEv">' +
        '<label>Título<input name="titulo" required maxlength="90" placeholder="Ex.: Café de Líderes de Janeiro"></label>' +
        '<div class="two"><label>Data<input name="data" type="date" required value="' + amanha + '" min="' + ymd(new Date()) + '"></label><label>Formato<select name="formato" id="evFmt"><option value="presencial">Presencial</option><option value="online">Online</option></select></label></div>' +
        '<div class="two"><label>Início<input name="hi" type="time" required value="18:00"></label><label>Fim<input name="hf" type="time" required value="20:00"></label></div>' +
        '<div class="two" id="evLocal"><label>Local<input name="local" placeholder="Nome do espaço"></label><label>Bairro / endereço<input name="endereco" placeholder="Ex.: Talatona"></label></div>' +
        '<div class="two"><label>Lugares<input name="vagas" type="number" min="2" max="5000" value="40" required></label><label>Preço (Kz)<input name="preco" type="number" min="0" step="500" value="0"><span class="hint">0 = gratuito</span></label></div>' +
        '<label>Descrição<textarea name="descricao" required minlength="30" placeholder="O que vai acontecer, para quem é e o que levar"></textarea></label>' +
        '<label class="check"><input type="checkbox" name="certificado"> Emitir certificado de participação</label>' +
        '<div class="btns"><button class="btn btn--lg" type="submit">Publicar evento</button><a class="btn btn--line btn--lg" href="#/grupo/' + g.id + '">Cancelar</a></div>' +
      "</form></div>";
    var fmt = document.getElementById("evFmt");
    fmt.addEventListener("change", function () { document.getElementById("evLocal").hidden = fmt.value === "online"; });
    document.getElementById("fEv").addEventListener("submit", function (ev) {
      ev.preventDefault(); var f = new FormData(this);
      if (f.get("hf") <= f.get("hi")) { toast("A hora de fim tem de ser depois do início"); return; }
      var id = slug(f.get("titulo")), base = id, k = 2; while (evento(id)) id = base + "-" + k++;
      var online = f.get("formato") === "online";
      var novo = { id: id, grupo: g.id, titulo: f.get("titulo").trim(), inicio: f.get("data") + "T" + f.get("hi"), fim: f.get("data") + "T" + f.get("hf"), formato: f.get("formato"),
        local: online ? "" : (f.get("local") || "A confirmar").trim(), endereco: online ? "" : (f.get("endereco") || g.cidade).trim(), cidade: online ? "Online" : (g.cidade === "Online" ? (f.get("endereco") || "") : g.cidade),
        preco: Number(f.get("preco")) || 0, vagas: Number(f.get("vagas")) || 40, inscritos: 0, descricao: f.get("descricao").trim(), certificado: !!f.get("certificado"), meu: true };
      S.eventos.push(novo); D.eventos.push(novo); save();
      location.hash = "#/evento/" + id; toast("Evento publicado");
    });
  }

  /* ----- conta ----- */
  function pgConta(q) {
    if (!S.user) { main.innerHTML = '<div class="wrap--n wiz"><h1>A minha conta</h1><p class="muted">Entre para ver os seus bilhetes, grupos e pontos.</p><div class="btns"><button class="btn" type="button" data-act="entrar">Entrar</button><button class="btn btn--line" type="button" data-act="registar">Registar</button></div></div>'; return; }
    var tab = q.tab || "eventos", u = S.user;
    var lista = Object.keys(S.rsvps).map(function (k) { return evento(k); }).filter(Boolean).sort(porData);
    var prox = lista.filter(futuro), pass = lista.filter(function (e) { return !futuro(e); });
    var corpo;
    if (tab === "grupos") {
      var gs = D.grupos.filter(function (g) { return souMembro(g.id); });
      corpo = '<div class="sec__head"><h2>Os meus grupos</h2><a class="btn btn--sm" href="#/criar-grupo">' + ic("plus") + " Criar grupo</a></div>" + (gs.length ? grade(gs.map(cardGrupo), "grid--3") : '<div class="empty">Ainda não pertence a nenhum grupo. <a class="link" href="#/procurar?tipo=grupos">Explorar grupos</a></div>');
    } else if (tab === "perfil") {
      corpo = '<div class="wrap--n" style="margin:0;max-width:620px"><h2>Perfil</h2><form class="form" data-form="perfil">' + camposConta(u, true) + '<div><button class="btn" type="submit">Guardar</button></div></form></div>';
    } else {
      corpo = '<div class="points" style="margin-bottom:22px"><b>' + pontos() + '</b><div><strong style="color:#f2dfab">Pontos de liderança</strong><br><span class="small" style="color:#d8c8a6">Participações, grupos, eventos organizados e perfil completo. Os membros mais activos são indicados à Comissão dos Prémios Líderes Angola.</span></div></div>' +
        '<h2>Próximos (' + prox.length + ")</h2>" +
        (prox.length ? prox.map(function (e) {
          var r = rsvp(e.id), ok = r.estado === "confirmado";
          return '<div class="ticket"><a class="ratio" href="#/evento/' + e.id + '">' + capa(catEvento(e), e.id, e.oficial) + "</a><div>" +
            '<span class="badge ' + (ok ? "badge--ok" : "badge--line") + '">' + (ok ? "Confirmado" : "Lista de espera") + '</span><div class="when" style="margin-top:6px">' + esc(quando(e.inicio)) + '</div><h3 style="margin:2px 0"><a href="#/evento/' + e.id + '">' + esc(e.titulo) + '</a></h3><div class="small">' + esc(lugarTxt(e)) + '</div><div class="code" style="margin:6px 0">' + esc(r.codigo) + "</div>" +
            '<div class="btns"><button class="btn btn--line btn--sm" type="button" data-act="ics" data-id="' + e.id + '">Calendário</button><button class="btn btn--line btn--sm" type="button" data-act="cancelar" data-id="' + e.id + '">Cancelar</button></div></div>' +
            (ok ? '<div class="qr" data-qr="' + esc(r.codigo + "|" + e.id) + '" role="img" aria-label="Código QR de entrada"></div>' : "<div></div>") + "</div>";
        }).join("") : '<div class="empty">Sem eventos marcados. <a class="link" href="#/procurar">Encontrar eventos</a></div>') +
        (pass.length ? '<h2 style="margin-top:28px">Passados</h2>' + pass.map(itemEvento).join("") : "");
    }
    main.innerHTML = '<div class="wrap"><div class="phead">' + av(u.nome, "av--xl") + "<div><h1 style=\"margin:0\">" + esc(u.nome) + '</h1><div class="muted">' + esc([u.cargo, u.organizacao].filter(Boolean).join(" · ")) + '</div><div class="small">' + esc(u.cidade || "") + " · " + S.membros.length + " grupos · " + prox.length + " próximos eventos</div></div></div>" +
      '<div class="tabs"><a href="#/conta" class="' + (tab === "eventos" ? "on" : "") + '">Os meus eventos</a><a href="#/conta?tab=grupos" class="' + (tab === "grupos" ? "on" : "") + '">Os meus grupos</a><a href="#/conta?tab=perfil" class="' + (tab === "perfil" ? "on" : "") + '">Perfil</a></div>' +
      '<div style="padding:10px 0 40px">' + corpo + '<p class="note" style="margin-top:24px">Protótipo: a conta e os dados ficam guardados apenas neste browser.</p></div></div>';
    desenharQRs(main);
  }

  function pgNada() { main.innerHTML = '<div class="wrap--n wiz"><h1>Página não encontrada</h1><p><a class="link" href="#/">Voltar ao início</a></p></div>'; }

  /* ================= modais ================= */
  function abrir(html) { mBody.innerHTML = html; modal.hidden = false; var f = mBody.querySelector("input,select,button:not([data-close])"); if (f) f.focus(); desenharQRs(mBody); }
  function fechar() { modal.hidden = true; mBody.innerHTML = ""; }

  function camposConta(u, completo) {
    u = u || {};
    return '<label>Nome completo<input name="nome" required autocomplete="name" value="' + esc(u.nome || "") + '"></label>' +
      '<label>Número de WhatsApp<input name="telefone" required type="tel" autocomplete="tel" placeholder="+244 9xx xxx xxx" value="' + esc(u.telefone || "") + '"></label>' +
      '<label>Cidade<select name="cidade">' + D.cidades.concat(["Outra"]).map(function (c) { return "<option" + ((u.cidade || "Luanda") === c ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + "</select></label>" +
      (completo ? '<div class="two"><label>Cargo<input name="cargo" value="' + esc(u.cargo || "") + '"></label><label>Organização<input name="organizacao" value="' + esc(u.organizacao || "") + '"></label></div>' : "");
  }
  function lerConta(f) { S.user = S.user || {}; ["nome", "telefone", "cidade", "cargo", "organizacao"].forEach(function (k) { if (f.has(k)) S.user[k] = String(f.get(k) || "").trim(); }); }

  var depoisConta = null;
  function abrirConta(modo, depois) {
    depoisConta = depois || null;
    var reg = modo !== "entrar";
    abrir('<div style="text-align:center;margin-bottom:14px"><img src="img/gilf-mark.png" alt="" style="width:48px;height:48px;border-radius:10px;margin:0 auto 10px;background:#fff"><h2 id="mTitle" style="margin:0">' + (reg ? "Registar no GiLF Eventos" : "Entrar no GiLF Eventos") + '</h2><p class="small" style="margin:4px 0 0">' + (reg ? "Já tem conta? " : "Ainda não tem conta? ") + '<button class="link" style="border:0;background:none;padding:0" type="button" data-act="' + (reg ? "entrar" : "registar") + '">' + (reg ? "Entrar" : "Registar") + "</button></p></div>" +
      '<form class="form" data-form="conta">' + (reg ? camposConta({}, true) : '<label>Número de WhatsApp<input name="telefone" type="tel" required placeholder="+244 9xx xxx xxx"></label><label>Nome<input name="nome" required autocomplete="name"></label>') +
      '<button class="btn btn--lg btn--block" type="submit">Continuar</button><p class="small" style="margin:0;text-align:center">Na versão final recebe um código de confirmação por WhatsApp ou SMS.</p></form>');
  }

  function abrirParticipar(e) {
    var g = grupo(e.grupo) || {}, full = cheio(e);
    abrir('<h2 id="mTitle">' + (full ? "Entrar na lista de espera" : "Confirmar participação") + '</h2><p class="small">' + esc(e.titulo) + " · " + esc(quando(e.inicio)) + "</p>" +
      '<form class="form" data-form="participar" data-id="' + e.id + '">' +
      '<label>O que procura neste evento?<select name="objectivo"><option>Networking</option><option>Encontrar investidores</option><option>Encontrar clientes</option><option>Encontrar parceiros ou fornecedores</option><option>Emprego ou talento</option><option>Aprender</option></select></label>' +
      '<label class="check"><input type="checkbox" name="b2b" checked> Quero sugestões de reuniões B2B</label>' +
      (!souMembro(g.id) ? '<p class="note">Ao participar junta-se também ao grupo <b>' + esc(g.nome) + "</b>.</p>" : "") +
      (e.preco > 0 ? '<p class="note">Evento pago (' + esc(kz(e.preco)) + '). Recebe por WhatsApp a referência para pagar por Multicaixa Express. O bilhete fica válido após o pagamento.</p>' : "") +
      (e.oficial ? '<p class="note">Evento oficial: esta inscrição regista o seu interesse; a Comissão Organizadora confirma o bilhete.</p>' : "") +
      '<button class="btn btn--lg btn--block" type="submit">' + (full ? "Entrar na lista de espera" : "Confirmar") + "</button></form>");
  }

  function sucesso(e, r) {
    var ok = r.estado === "confirmado", d = dt(e.inicio);
    var msg = (ok ? "Confirmo a minha participação" : "Inscrevi-me na lista de espera") + " — GiLF Eventos\n\n" + e.titulo + "\n" + fLong.format(d) + ", " + fHora.format(d) + "\n" + lugarTxt(e) + "\n\nNome: " + S.user.nome + "\nCódigo: " + r.codigo;
    abrir('<div class="okmark">' + ic("check") + '</div><h2 id="mTitle">' + (ok ? "Vai participar!" : "Está na lista de espera") + "</h2>" +
      '<p class="small">' + (ok ? "O bilhete fica em «Os meus eventos». Mostre o código QR à entrada." : "Avisamos por WhatsApp se abrir uma vaga.") + "</p>" +
      (ok ? '<div style="display:flex;gap:14px;align-items:center;margin:14px 0"><div class="qr" data-qr="' + esc(r.codigo + "|" + e.id) + '"></div><div><div class="code">' + esc(r.codigo) + '</div><div class="small">' + esc(quando(e.inicio)) + "</div></div></div>" : '<p class="code">' + esc(r.codigo) + "</p>") +
      '<div class="btns"><a class="btn btn--wa" target="_blank" rel="noopener" href="' + wa(msg) + '">Receber no WhatsApp</a><button class="btn btn--line" type="button" data-act="ics" data-id="' + e.id + '">Calendário</button></div>');
  }

  function desenharQRs(root) {
    root.querySelectorAll("[data-qr]").forEach(function (el) {
      try { var q = window.qrcode(0, "M"); q.addData(el.dataset.qr); q.make(); el.innerHTML = q.createSvgTag({ cellSize: 3, margin: 0, scalable: true }); }
      catch (x) { el.textContent = el.dataset.qr.split("|")[0]; }
    });
  }

  function baixarIcs(e) {
    function f(s) { var d = dt(s); return d.getFullYear() + P2(d.getMonth() + 1) + P2(d.getDate()) + "T" + P2(d.getHours()) + P2(d.getMinutes()) + "00"; }
    function x(s) { return String(s || "").replace(/[\\,;]/g, "\\$&").replace(/\n/g, "\\n"); }
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GiLF Eventos//PT", "BEGIN:VEVENT", "UID:" + e.id + "@gilfeventos", "DTSTAMP:" + f(new Date().toISOString()),
      "DTSTART:" + f(e.inicio), "DTEND:" + f(e.fim || e.inicio), "SUMMARY:" + x(e.titulo), "LOCATION:" + x(lugarTxt(e)), "DESCRIPTION:" + x(e.descricao), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = e.id + ".ics"; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ================= acções (delegadas) ================= */
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-act],[data-close],[data-go],[data-goto]");
    if (!t) { var m = document.getElementById("meMenu"); if (m && !ev.target.closest(".me")) m.classList.remove("on"); if (ev.target === modal) fechar(); return; }
    if (t.hasAttribute("data-close")) return fechar();
    if (t.dataset.go) { location.hash = t.dataset.go; return; }
    if (t.dataset.goto) { ev.preventDefault(); if (location.hash !== "#/" && location.hash !== "") { location.hash = "#/"; setTimeout(function () { var el = document.getElementById(t.dataset.goto); if (el) el.scrollIntoView(); }, 60); } else { var el = document.getElementById(t.dataset.goto); if (el) el.scrollIntoView({ behavior: "smooth" }); } return; }
    var a = t.dataset.act, id = t.dataset.id;
    if (t.tagName === "A") ev.preventDefault();
    if (a === "menu") { var mm = document.getElementById("meMenu"); mm.classList.toggle("on"); t.setAttribute("aria-expanded", mm.classList.contains("on")); return; }
    if (a === "entrar" || a === "registar") { var then = t.dataset.then; abrirConta(a, then ? function () { location.hash = then; route(); } : depoisConta); return; }
    if (a === "sair") { S.user = null; save(); desenharTopo(); location.hash = "#/"; route(); toast("Sessão terminada"); return; }
    if (a === "participar") { var e = evento(id); if (!precisaConta(function () { abrirParticipar(e); })) return; return abrirParticipar(e); }
    if (a === "cancelar") { if (!confirm("Cancelar a participação? O lugar passa para a próxima pessoa da lista de espera.")) return; delete S.rsvps[id]; save(); route(); toast("Participação cancelada"); return; }
    if (a === "juntar") { if (!precisaConta(function () { S.membros.push(id); save(); route(); toast("Bem-vindo ao grupo!"); })) return; if (S.membros.indexOf(id) < 0) S.membros.push(id); save(); route(); toast("Bem-vindo ao grupo!"); return; }
    if (a === "sair-grupo") { if (!confirm("Sair deste grupo?")) return; S.membros = S.membros.filter(function (x) { return x !== id; }); save(); route(); return; }
    if (a === "partilhar-grupo") { var g = grupo(id); window.open("https://wa.me/?text=" + encodeURIComponent("Junte-se ao grupo " + g.nome + " no GiLF Eventos: " + location.href.split("?")[0]), "_blank", "noopener"); return; }
    if (a === "ics") { baixarIcs(evento(id)); return; }
    if (a === "limpar") { var tipo = /tipo=grupos/.test(location.hash) ? "?tipo=grupos" : ""; location.hash = "#/procurar" + tipo; return; }
  });

  document.addEventListener("submit", function (ev) {
    var f = ev.target, k = f.dataset && f.dataset.form; if (!k) return;
    ev.preventDefault(); var fd = new FormData(f), id = f.dataset.id;
    if (k === "conta") {
      lerConta(fd); save(); fechar(); desenharTopo(); toast("Bem-vindo, " + S.user.nome.split(" ")[0]);
      var cb = depoisConta; depoisConta = null; if (cb) cb(); else route(); return;
    }
    if (k === "perfil") { lerConta(fd); save(); desenharTopo(); route(); toast("Perfil guardado"); return; }
    if (k === "participar") {
      var e = evento(id), r = { estado: cheio(e) ? "espera" : "confirmado", codigo: codigo(), objectivo: fd.get("objectivo"), b2b: !!fd.get("b2b"), criado: new Date().toISOString() };
      S.rsvps[id] = r; if (!souMembro(e.grupo)) S.membros.push(e.grupo); save(); route(); sucesso(e, r); return;
    }
    if (k === "comentar") {
      if (!precisaConta()) return;
      (S.comentarios[id] = S.comentarios[id] || []).push({ nome: S.user.nome, t: String(fd.get("t")).trim() }); save(); route(); return;
    }
    if (k === "post") { (S.posts[id] = S.posts[id] || []).push({ nome: S.user.nome, t: String(fd.get("t")).trim() }); save(); route(); toast("Publicado"); return; }
  });

  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) fechar(); });
  document.getElementById("hsearch").addEventListener("submit", function (ev) { ev.preventDefault(); var f = new FormData(this); location.hash = "#/procurar" + qsBuild({ q: f.get("q"), cidade: f.get("cidade") }); });

  /* ================= router ================= */
  function route() {
    var h = location.hash.replace(/^#\/?/, ""), parts = h.split("?"), seg = parts[0].split("/"), q = qsParse(parts[1]);
    document.body.classList.remove("has-bar");
    var mm = document.getElementById("meMenu"); if (mm) mm.classList.remove("on");
    switch (seg[0]) {
      case "": pgInicio(); break;
      case "procurar": pgProcurar(q); break;
      case "evento": pgEvento(seg[1]); break;
      case "grupo": if (seg[2] === "novo-evento") pgNovoEvento(seg[1]); else pgGrupo(seg[1], q); break;
      case "criar-grupo": pgCriarGrupo(); break;
      case "conta": pgConta(q); break;
      default: pgNada();
    }
  }
  var ultimo = location.hash;
  window.addEventListener("hashchange", function () {
    var mesmaPagina = ultimo.split("?")[0] === location.hash.split("?")[0] && /^#\/(procurar|grupo|conta)/.test(location.hash);
    ultimo = location.hash; fechar(); route(); if (!mesmaPagina) window.scrollTo(0, 0);
  });
  document.getElementById("demo").hidden = !D.demo;
  document.getElementById("fMarca").textContent = "© GiLF Eventos · " + D.org.marca;
  document.getElementById("fWa").href = "https://wa.me/" + D.org.whatsapp;
  document.getElementById("dl-cidades").innerHTML = ["Online"].concat(D.cidades).map(function (c) { return '<option value="' + esc(c) + '">'; }).join("");
  desenharTopo();
  route();
})();
