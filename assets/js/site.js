/* GiLF Angola 2026 — public site engine. Content: assets/dados.js (managed in /admin/) */
(function () {
  "use strict";

  /* ---------- preview mode (unpublished edits from /admin/, this browser only) ---------- */
  var PREVIEW = false;
  try {
    if (/[?&]preview=1/.test(location.search)) sessionStorage.setItem("gilf-preview", "1");
    if (/[?&]preview=0/.test(location.search)) sessionStorage.removeItem("gilf-preview");
    var draft = sessionStorage.getItem("gilf-preview") && localStorage.getItem("gilf-admin-draft");
    if (draft) {
      var dj = JSON.parse(draft);
      if (dj && dj.data) {
        window.GILF = dj.data; PREVIEW = true;
        var pend = JSON.parse(localStorage.getItem("gilf-admin-files") || "{}");
        var swap = function (o, k) { if (o && o[k] && pend[o[k]]) o[k] = pend[o[k]]; };
        (GILF.pessoas || []).forEach(function (p) { swap(p, "foto"); });
        (GILF.parceiros || []).forEach(function (g) { (g.itens || []).forEach(function (i) { swap(i, "logo"); }); });
        swap(GILF.organizacao, "foto");
      }
    }
  } catch (e) {}

  var D = window.GILF || {};
  var E = D.evento || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var G = window.GILF_UI = { esc: esc, data: D };

  /* ---------- icons ---------- */
  var P = {
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    chat: '<path d="M4 5h16v11H8l-4 4z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z"/><path d="M14 4v16" stroke-dasharray="2 2"/>',
    in: '<path d="M4 9h4v11H4zM6 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h4v1.6c.6-1 1.9-1.9 3.8-1.9 3.1 0 4.2 2 4.2 5.2V20h-4v-5.4c0-1.5-.3-2.8-2-2.8s-2 1.3-2 2.8V20h-4z" fill="currentColor" stroke="none"/>',
    fb: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V8Z" fill="currentColor" stroke="none"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
    yt: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    tt: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.2 4 5 4"/>'
  };
  var WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z"/></svg>';
  var ic = G.ic = function (n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || "") + "</svg>"; };
  var WAVES = '<svg class="waves" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true"><path d="M0 230 Q180 170 360 230 T720 230 T1080 230 T1440 230 T1800 230 T2160 230 T2520 230 T2880 230" fill="none" stroke="#d8b466" stroke-width="1.2" opacity="0.9"/><path d="M0 280 Q240 235 480 280 T960 280 T1440 280 T1920 280 T2400 280 T2880 280" fill="none" stroke="#d8b466" stroke-width="1.6" opacity="0.6"/><path d="M0 320 Q360 250 720 320 T1440 320 T2160 320 T2880 320" fill="none" stroke="#d8b466" stroke-width="1" opacity="0.45"/></svg>';
  $$("[data-waves]").forEach(function (el) { el.insertAdjacentHTML("afterbegin", WAVES); });
  $$("[data-ic]").forEach(function (el) { el.insertAdjacentHTML("afterbegin", ic(el.getAttribute("data-ic"))); });

  /* ---------- bindings: data-bind="evento.local" ---------- */
  $$("[data-bind]").forEach(function (el) {
    var v = el.getAttribute("data-bind").split(".").reduce(function (o, k) { return o ? o[k] : ""; }, D);
    if (v !== "" && v != null) el.textContent = v;
  });

  /* ---------- layout ---------- */
  var page = document.body.getAttribute("data-page") || "";
  var NAV = [["index.html", "Início", "inicio"], ["programa.html", "Programa", "programa"], ["oradores.html", "Oradores", "oradores"],
    ["premios.html", "Prémios", "premios"], ["parceiros.html", "Parceiros", "parceiros"], ["sobre.html", "Sobre", "sobre"], ["contacto.html", "Contacto", "contacto"]];
  var tel = (E.telefone || "").replace(/\s/g, "");
  var waLink = G.wa = "https://wa.me/" + (E.whatsapp || "");
  var head = (PREVIEW ? '<div class="preview-bar">Pré-visualização de alterações ainda não publicadas · <a href="?preview=0">Sair</a></div>' : "") +
    '<a class="skip" href="#main">Saltar para o conteúdo</a>' +
    (E.aviso ? '<div class="notice">' + esc(E.aviso) + "</div>" : "") +
    '<div class="topbar"><div class="wrap"><div class="topbar__g"><span>' + esc(E.dataTexto) + " · " + esc(E.local) + ", Luanda</span>" +
    '<span class="topbar__x">' + esc(E.tema) + '</span></div><div class="topbar__g"><a href="tel:' + esc(tel) + '">' + esc(E.telefone) + "</a>" +
    '<a class="topbar__x" href="mailto:' + esc(E.email) + '">' + esc(E.email) + "</a></div></div></div>" +
    '<header class="header" id="hdr"><div class="wrap header__in">' +
    '<a class="logo" href="index.html" aria-label="GiLF Angola — início"><img src="assets/img/logos/gilf-lockup.png" alt="GiLF Angola — Fórum Global de Investimento e Liderança Angola 2026" width="472" height="121"></a>' +
    '<nav class="menu" id="menu" aria-label="Principal">' + NAV.map(function (n) { return '<a href="' + n[0] + '"' + (page === n[2] ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("") +
    '<a class="btn btn--gold" href="bilhetes.html">Comprar bilhete</a></nav>' +
    '<div class="header__cta"><a class="btn btn--gold btn--sm" href="bilhetes.html">Comprar bilhete</a>' +
    '<button class="burger" id="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><span></span></button></div></div></header>';
  document.body.insertAdjacentHTML("afterbegin", head);

  var socials = Object.keys(E.redes || {}).filter(function (k) { return E.redes[k]; }).map(function (k) {
    return '<a href="' + esc(E.redes[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ic({ facebook: "fb", instagram: "ig", linkedin: "in", youtube: "yt", tiktok: "tt" }[k]) + "</a>";
  }).join("");
  var foot = '<footer class="footer"><div class="wrap"><div class="footer__grid">' +
    '<div class="footer__brand"><img src="assets/img/logos/premios-lideres.png" alt="Prémios Líderes Angola 2026" width="699" height="383" loading="lazy">' +
    "<p>" + esc(E.nomeCompleto) + " e " + esc(E.gala) + ". " + esc(E.tema) + "</p>" + (socials ? '<div class="social">' + socials + "</div>" : "") + "</div>" +
    "<div><h4>Navegação</h4><ul>" + NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + "</a></li>"; }).join("") + '<li><a href="bilhetes.html">Bilhetes</a></li></ul></div>' +
    "<div><h4>O evento</h4><ul><li>" + esc(E.dataTexto) + "</li><li>Fórum · " + esc(E.horarioForum) + "</li><li>Gala · " + esc(E.horarioGala) + "</li><li>" + esc(E.local) + "</li><li>" + esc(E.cidade) + "</li></ul></div>" +
    '<div><h4>Contacto</h4><ul><li><a href="tel:' + esc(tel) + '">' + esc(E.telefone) + "</a></li>" +
    (E.telefone2 ? '<li><a href="tel:' + esc(E.telefone2.replace(/\s/g, "")) + '">' + esc(E.telefone2) + "</a></li>" : "") +
    '<li><a href="mailto:' + esc(E.email) + '">' + esc(E.email) + '</a></li><li><a href="' + waLink + '" target="_blank" rel="noopener">WhatsApp</a></li></ul>' +
    '<div class="footer__org"><span><img src="assets/img/logos/luadeira.png" alt="Lua-Deira Digital Angola" loading="lazy"></span><span><img src="assets/img/logos/jldi.png" alt="JLDI" loading="lazy"></span></div></div></div>' +
    '<div class="footer__bar"><span>© 2026 GiLF Angola · Organização: Luadeira Digital Angola &amp; JLDI</span><span>' + esc(E.site) + "</span></div></div></footer>" +
    '<a class="wa-float" href="' + waLink + '" target="_blank" rel="noopener" aria-label="Falar connosco no WhatsApp">' + WA + "</a>" +
    '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mName"><div class="modal__box"><button class="modal__close" aria-label="Fechar">×</button><div class="modal__ph" id="mPh"></div><div class="modal__body" id="mBody"></div></div></div>';
  document.body.insertAdjacentHTML("beforeend", foot);

  var hdr = $("#hdr"), burger = $("#burger"), menu = $("#menu");
  var onScroll = function () { hdr.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", function () {
    var o = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(o)); burger.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu");
  });

  /* ---------- countdown ---------- */
  $$("[data-countdown]").forEach(function (cd) {
    var target = new Date(E.inicio || "2026-12-17T08:30:00+01:00");
    cd.innerHTML = ["dias", "horas", "min", "seg"].map(function (l) { return "<div><b>--</b><small>" + l + "</small></div>"; }).join("");
    var bs = $$("b", cd), pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var t = function () {
      var s = Math.max(0, Math.floor((target - new Date()) / 1000));
      bs[0].textContent = Math.floor(s / 86400); bs[1].textContent = pad(Math.floor(s % 86400 / 3600));
      bs[2].textContent = pad(Math.floor(s % 3600 / 60)); bs[3].textContent = pad(s % 60);
    };
    t(); setInterval(t, 1000);
  });

  /* ---------- people helpers ---------- */
  var PEOPLE = (D.pessoas || []).filter(function (p) { return p && p.nome; });
  var byId = {}; PEOPLE.forEach(function (p) { byId[p.id] = p; });
  G.person = function (id) { return byId[id]; };
  var ROLE = G.ROLE = { keynote: "Keynote Speaker", guest: "Guest Speaker", moderador: "Moderador(a)", orador: "Orador(a)" };
  var initials = function (n) { return String(n).replace(/^(Dr|Dra|Eng|Prof|Sr|Sra|Sensei)\.?\s+/i, "").split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase(); };
  var photo = G.photo = function (p, cls) { return p.foto ? '<img src="' + esc(p.foto) + '" alt="' + esc(p.nome) + '" loading="lazy">' : '<span class="mono ' + (cls || "") + '">' + esc(initials(p.nome)) + "</span>"; };
  var pos = G.pos = function (p) { return [p.cargo, p.organizacao].filter(Boolean).join(" · "); };
  var CATS = (D.premios && D.premios.categorias) || [];
  var nominationsOf = function (id) { return CATS.filter(function (c) { return (c.nomeados || []).indexOf(id) > -1; }); };
  var sessionsOf = function (id) {
    var out = [];
    ["forum", "gala"].forEach(function (k) { ((D.programa || {})[k] || []).forEach(function (s) {
      if (s.moderador === id) out.push("Modera · " + s.titulo);
      else if ((s.oradores || []).indexOf(id) > -1) out.push(s.titulo);
    }); });
    return out;
  };
  var speakers = G.speakers = function () { return PEOPLE.filter(function (p) { return ROLE[p.papel]; }); };

  /* modal */
  var modal = $("#modal"), last = null;
  G.open = function (id) {
    var p = byId[id]; if (!p) return;
    last = document.activeElement;
    $("#mPh").innerHTML = photo(p);
    var noms = nominationsOf(id), ses = sessionsOf(id);
    $("#mBody").innerHTML =
      (ROLE[p.papel] ? '<span class="badge">' + esc(ROLE[p.papel]) + "</span> " : "") + (noms.length ? '<span class="badge" style="background:#15100a;color:#f2dfab">Nomeado</span>' : "") +
      '<h3 id="mName">' + esc(p.nomeCompleto || p.nome) + '</h3><p class="pos">' + esc(pos(p)) + (p.pais && p.pais !== "Angola" ? " · " + esc(p.pais) : "") + "</p>" +
      (p.tema ? '<div class="topic"><small>Tema da intervenção</small>' + esc(p.tema) + "</div>" : "") +
      (p.bio ? "<p>" + esc(p.bio) + "</p>" : "") +
      (p.linkedin ? '<p><a class="link" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">Perfil LinkedIn →</a></p>' : "") +
      ((ses.length || noms.length) ? '<div class="tags">' + ses.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + noms.map(function (c) { return "<span>★ " + esc(c.titulo) + "</span>"; }).join("") + "</div>" : "");
    modal.classList.add("open"); document.body.style.overflow = "hidden";
    $(".modal__close", modal).focus();
  };
  var close = function () { modal.classList.remove("open"); document.body.style.overflow = ""; if (last) last.focus(); };
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-p]") : null;
    if (t) { e.preventDefault(); G.open(t.getAttribute("data-p")); return; }
    if (e.target === modal || (e.target.closest && e.target.closest(".modal__close"))) close();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) close(); });

  /* ---------- renderers ---------- */
  G.card = function (p) {
    return '<button class="card rv" type="button" data-p="' + esc(p.id) + '"><div class="card__ph">' + (ROLE[p.papel] ? '<span class="role role--' + esc(p.papel) + '">' + esc(ROLE[p.papel]) + "</span>" : "") + photo(p) +
      '</div><div class="card__b"><h3>' + esc(p.nome) + "</h3><p>" + esc(p.cargo) + (p.organizacao ? '<br><span class="org">' + esc(p.organizacao) + "</span>" : "") + "</p></div></button>";
  };
  G.keynote = function (p, i) {
    return '<button class="kn rv' + (i ? " d" + i : "") + '" type="button" data-p="' + esc(p.id) + '"><div class="kn__ph"><span class="badge">' + esc(ROLE[p.papel]) + "</span>" + photo(p) +
      '</div><div class="kn__b"><h3>' + esc(p.nome) + '</h3><span class="pos">' + esc(pos(p)) + "</span>" + (p.tema ? '<span class="topic">“' + esc(p.tema) + "”</span>" : "") + "</div></button>";
  };
  G.who = function (p, label) {
    return '<button class="who" type="button" data-p="' + esc(p.id) + '"><span class="av">' + photo(p) + "</span><span><b>" + esc(p.nome) + "</b><small>" + esc(label || pos(p)) + "</small></span></button>";
  };
  G.panel = function (s, i) {
    var mod = byId[s.moderador];
    var spk = (s.oradores || []).map(function (id) { return byId[id]; }).filter(Boolean);
    return '<article class="panel rv"><div><span class="panel__n">' + (s.numero ? "Painel " + esc(s.numero) : "Painel") + "</span><h3>" + esc(s.titulo) + "</h3>" + (s.subtitulo ? "<p>" + esc(s.subtitulo) + "</p>" : "") +
      (mod ? '<div class="panel__mod">' + G.who(mod, "Moderador(a)") + "</div>" : "") + '</div><div class="faces">' +
      spk.map(function (p) { return '<button class="face" type="button" data-p="' + esc(p.id) + '">' + photo(p) + "<b>" + esc(p.nome) + "</b><small>" + esc(p.cargo || p.organizacao) + "</small></button>"; }).join("") + "</div></article>";
  };
  var TAG = { sessao: "Sessão", keynote: "Keynote", painel: "Painel", pausa: "Pausa", networking: "Networking", gala: "Gala" };
  G.agenda = function (el, key) {
    var list = (D.programa || {})[key] || [];
    el.innerHTML = list.map(function (s, i) {
      var mod = byId[s.moderador], spk = (s.oradores || []).map(function (id) { return byId[id]; }).filter(Boolean);
      var talks = (mod ? '<button class="talk talk--mod" type="button" data-p="' + esc(mod.id) + '"><span class="av">' + photo(mod) + "</span><span><b>" + esc(mod.nome) + "</b><small>Moderação" + (mod.cargo ? " · " + esc(mod.cargo) : "") + "</small></span></button>" : "") +
        spk.map(function (p) { return '<button class="talk" type="button" data-p="' + esc(p.id) + '"><span class="av">' + photo(p) + "</span><span><b>" + esc(p.nome) + "</b><small>" + esc(pos(p)) + "</small>" + (p.tema && s.tipo === "painel" ? "<em>" + esc(p.tema) + "</em>" : "") + "</span></button>"; }).join("");
      for (var v = spk.length; v < (s.vagas || 0); v++) talks += '<div class="talk talk--tba"><span class="av">?</span><span><b>A anunciar</b><small>Orador(a)</small></span></div>';
      var time = s.hora ? esc(s.hora) + (s.fim ? "<small>até " + esc(s.fim) + "</small>" : "") : '<span class="seq">' + (i + 1 < 10 ? "0" : "") + (i + 1) + "</span>";
      return '<li class="slot rv"><div class="slot__time">' + time + '</div><div><span class="tag tag--' + esc(s.tipo) + '">' + esc(s.tipo === "painel" && s.numero ? "Painel " + s.numero : s.tipo === "keynote" && spk[0] && ROLE[spk[0].papel] ? ROLE[spk[0].papel] : TAG[s.tipo] || s.tipo) + "</span><h3>" + esc(s.titulo) + "</h3>" +
        (s.subtitulo ? '<p class="sub">' + esc(s.subtitulo) + "</p>" : "") + (s.descricao ? '<p class="sub">' + esc(s.descricao) + "</p>" : "") + (talks ? '<div class="talks">' + talks + "</div>" : "") + "</div></li>";
    }).join("");
    observe(el);
  };
  G.categories = function (el) {
    var reveal = D.premios && D.premios.revelarVencedores;
    el.innerHTML = CATS.map(function (c) {
      return '<div class="cat rv"><div class="cat__t"><small>Categoria</small>' + esc(c.titulo) + '</div><div class="noms">' +
        (c.nomeados || []).map(function (id) { var p = byId[id]; if (!p) return "";
          return '<button class="nom' + (reveal && c.vencedor === id ? " nom--win" : "") + '" type="button" data-p="' + esc(p.id) + '"><span class="av">' + photo(p) + "</span><span><b>" + esc(p.nome) + "</b><small>" + esc(pos(p) || "Nomeado(a)") + "</small></span></button>"; }).join("") + "</div></div>";
    }).join("");
    observe(el);
  };
  G.nominees = function (el, limit) {
    var seen = {}, out = [];
    CATS.forEach(function (c) { (c.nomeados || []).forEach(function (id) { if (!seen[id] && byId[id]) { seen[id] = 1; out.push([byId[id], c]); } }); });
    el.innerHTML = out.slice(0, limit || 99).map(function (x, i) {
      return '<button class="nomcard rv' + (i % 5 ? " d" + Math.min(3, i % 5) : "") + '" type="button" data-p="' + esc(x[0].id) + '">' + photo(x[0]) + "<div><b>" + esc(x[0].nome) + "</b><small>" + esc(x[1].titulo) + "</small></div></button>";
    }).join("");
    observe(el);
  };
  G.nomineeCount = function () { var s = {}; CATS.forEach(function (c) { (c.nomeados || []).forEach(function (id) { s[id] = 1; }); }); return Object.keys(s).length; };

  function logo(p, eager) {
    var img = '<img src="' + esc(p.logo) + '" alt="' + esc(p.nome) + '" title="' + esc(p.nome) + '"' + (eager ? "" : ' loading="lazy"') + ">";
    return p.url ? '<a class="plogo" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + img + "</a>" : '<div class="plogo">' + img + "</div>";
  }
  G.partners = function (el) {
    el.innerHTML = (D.parceiros || []).filter(function (g) { return g.itens && g.itens.length; }).map(function (g) {
      return '<div class="pgroup rv"><div class="pgroup__t">' + esc(g.grupo) + '</div><div class="logos' + (g.grupo === "Organização" ? " logos--lg" : "") + '">' + g.itens.map(function (p) { return logo(p); }).join("") + "</div></div>";
    }).join("");
    observe(el);
  };
  G.marquee = function (el) {
    var all = []; (D.parceiros || []).forEach(function (g) { all = all.concat(g.itens || []); });
    var row = all.map(function (p) { return logo(p, true); }).join("");
    el.innerHTML = '<div class="marquee__track">' + row + row + "</div>";
  };
  G.partnerCount = function () { var n = 0; (D.parceiros || []).forEach(function (g) { if (g.grupo !== "Organização") n += (g.itens || []).length; }); return n; };

  /* ---------- forms: compose an e-mail or WhatsApp message (no server needed) ---------- */
  G.forms = function () {
    $$("form[data-form]").forEach(function (form) {
      if (form._ok) return; form._ok = 1;
      var via = "email", st = $(".form__status", form);
      $$("[data-via]", form).forEach(function (b) { b.addEventListener("click", function () { via = b.getAttribute("data-via"); }); });
      var qs = new URLSearchParams(location.search);
      $$("[data-qs]", form).forEach(function (f) { var v = qs.get(f.getAttribute("data-qs")); if (v) f.value = v; });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = true;
        $$("[required]", form).forEach(function (f) {
          var bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value.trim()));
          f.classList.toggle("bad", bad); if (bad) ok = false;
        });
        if (!ok) { st.className = "form__status err"; st.textContent = "Preencha os campos obrigatórios (*) correctamente."; return; }
        var lines = [form.getAttribute("data-form"), ""];
        $$("input, select, textarea", form).forEach(function (f) {
          var v = (f.value || "").trim(); if (!v || !f.name) return;
          var lab = f.closest(".field"); lines.push((lab ? lab.firstChild.textContent.replace("*", "").trim() : f.name) + ": " + v);
        });
        var body = lines.join("\n"), nm = form.querySelector("[name=nome]");
        if (via === "wa") window.open(waLink + "?text=" + encodeURIComponent(body), "_blank", "noopener");
        else location.href = "mailto:" + E.email + "?subject=" + encodeURIComponent(form.getAttribute("data-form") + (nm ? " — " + nm.value : "")) + "&body=" + encodeURIComponent(body);
        st.className = "form__status ok";
        st.textContent = "Mensagem preparada — confirme o envio na aplicação de " + (via === "wa" ? "WhatsApp." : "e-mail.");
      });
    });
  };

  /* ---------- reveal ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { threshold: .08, rootMargin: "0px 0px -30px 0px" }) : null;
  function observe(root) { $$(".rv:not(.in)", root).forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); }); }
  G.observe = observe;
  G.ready = function () { G.forms(); observe(document); };
})();
