/* GiLF Angola 2026 — site engine. Content lives in assets/dados.js */
(function () {
  "use strict";
  /* preview mode: shows unpublished edits made in admin.html (this browser only) */
  var PREVIEW = false;
  try {
    if (/[?&]preview=1/.test(location.search)) sessionStorage.setItem("gilf-preview", "1");
    if (/[?&]preview=0/.test(location.search)) sessionStorage.removeItem("gilf-preview");
    var draft = sessionStorage.getItem("gilf-preview") && localStorage.getItem("gilf-draft");
    if (draft) {
      window.GILF = JSON.parse(draft); PREVIEW = true;
      var ph = JSON.parse(localStorage.getItem("gilf-photos") || "{}");
      (window.GILF.oradores || []).forEach(function (o) { if (ph[o.foto]) o.foto = ph[o.foto]; });
    }
  } catch (e) {}
  var D = window.GILF || {};
  var E = D.evento || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* ---------- icons ---------- */
  var P = {
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    chart: '<path d="M3 21h18M6 17V11M11 17V7M16 17v-4M21 17V5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    hand: '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2L15 11l-1 1a2.1 2.1 0 0 1-3-3l2.8-2.8a3 3 0 0 1 3.6-.4l.6.4a3 3 0 0 0 2 .5H21v7"/><path d="M3 4h2l6 6M3 14h2l4 4a1.4 1.4 0 0 0 2-2"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>',
    plane: '<path d="M10.5 13.5 3 11l1.5-1.5 8 1 4-4c1-1 3-1.5 3.5-1s0 2.5-1 3.5l-4 4 1 8L14.5 22 12 14.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    in: '<path d="M4 9h4v11H4zM6 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h4v1.6c.6-1 1.9-1.9 3.8-1.9 3.1 0 4.2 2 4.2 5.2V20h-4v-5.4c0-1.5-.3-2.8-2-2.8s-2 1.3-2 2.8V20h-4z" fill="currentColor" stroke="none"/>',
    fb: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V8Z" fill="currentColor" stroke="none"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
    yt: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    dl: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'
  };
  var WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z"/></svg>';
  function ic(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || "") + "</svg>"; }
  window.GILF_ICON = ic;
  $$("[data-ic]").forEach(function (el) { el.innerHTML = ic(el.getAttribute("data-ic")) + el.innerHTML; });

  /* ---------- decorative waves ---------- */
  var WAVES = '<svg class="waves" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true"><path d="M0 230 Q180 170 360 230 T720 230 T1080 230 T1440 230 T1800 230 T2160 230 T2520 230 T2880 230" fill="none" stroke="#d8b466" stroke-width="1.2" opacity="0.9"/><path d="M0 280 Q240 235 480 280 T960 280 T1440 280 T1920 280 T2400 280 T2880 280" fill="none" stroke="#d8b466" stroke-width="1.6" opacity="0.6"/><path d="M0 320 Q360 250 720 320 T1440 320 T2160 320 T2880 320" fill="none" stroke="#d8b466" stroke-width="1" opacity="0.45"/></svg>';
  $$("[data-waves]").forEach(function (el) { el.insertAdjacentHTML("afterbegin", WAVES); });

  /* ---------- layout ---------- */
  var page = document.body.getAttribute("data-page") || "";
  var NAV = [
    ["index.html", "Início", "inicio"], ["forum.html", "Fórum", "forum"], ["oradores.html", "Oradores", "oradores"],
    ["gala.html", "Gala & Prémios", "gala"], ["parceiros.html", "Parceiros", "parceiros"], ["contacto.html", "Contacto", "contacto"]
  ];
  var tel = (E.telefone || "").replace(/\s/g, "");
  var waLink = "https://wa.me/" + (E.whatsapp || "");

  var header =
    '<a class="skip" href="#main">Saltar para o conteúdo</a>' +
    '<div class="topbar"><div class="wrap"><div class="topbar__info">' +
    "<span>17 de Dezembro de 2026 · " + esc(E.local) + ", Luanda</span>" +
    '<span class="topbar__extra">' + esc(E.tema) + "</span></div>" +
    '<div class="topbar__info"><a href="tel:' + esc(tel) + '">' + esc(E.telefone) + '</a><a href="mailto:' + esc(E.email) + '">' + esc(E.email) + "</a></div></div></div>" +
    '<header class="header" id="header"><div class="wrap header__in">' +
    '<a class="logo" href="index.html" aria-label="GiLF Angola — Início"><img src="assets/img/logos/gilf-lockup.png" alt="GiLF Angola — Fórum Global de Investimento e Liderança Angola 2026" width="472" height="121"></a>' +
    '<nav class="menu" id="menu" aria-label="Principal">' +
    NAV.map(function (n) { return '<a href="' + n[0] + '"' + (page === n[2] ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("") +
    '<a class="btn btn--gold btn--sm" style="margin:14px 0 0" data-mobile-only href="inscricao.html">Garantir ingresso</a>' +
    "</nav>" +
    '<div class="header__cta"><a class="btn btn--gold btn--sm" href="inscricao.html">Garantir ingresso</a>' +
    '<button class="burger" id="burger" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu"><span></span></button></div>' +
    "</div></header>";
  document.body.insertAdjacentHTML("afterbegin", header);
  var mob = $("[data-mobile-only]");
  var mq = window.matchMedia("(max-width: 960px)");
  var syncMob = function () { mob.style.display = mq.matches ? "" : "none"; };
  syncMob(); mq.addListener ? mq.addListener(syncMob) : mq.addEventListener("change", syncMob);

  var socials = Object.keys(E.redes || {}).filter(function (k) { return E.redes[k]; }).map(function (k) {
    var m = { facebook: "fb", instagram: "ig", linkedin: "in", youtube: "yt" }[k];
    return '<a href="' + esc(E.redes[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + ic(m) + "</a>";
  }).join("");

  var footer =
    '<footer class="footer"><div class="wrap"><div class="footer__grid">' +
    '<div class="footer__brand"><img src="assets/img/logos/premios-lideres.png" alt="Prémios Líderes Angola 2026" width="699" height="383">' +
    "<p>" + esc(E.nomeCompleto) + " e Gala de Premiação Prémios Líderes Angola 2026. " + esc(E.tema) + "</p>" +
    (socials ? '<div class="social">' + socials + "</div>" : "") + "</div>" +
    '<div><h4>Navegação</h4><ul>' + NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1] + "</a></li>"; }).join("") + '<li><a href="inscricao.html">Ingressos & Inscrição</a></li></ul></div>' +
    '<div><h4>Evento</h4><ul><li>17 de Dezembro de 2026</li><li>Fórum · ' + esc(E.horarioForum) + "</li><li>Gala · " + esc(E.horarioGala) + "</li><li>" + esc(E.local) + "</li><li>" + esc(E.cidade) + "</li></ul></div>" +
    '<div><h4>Contacto</h4><ul><li><a href="tel:' + esc(tel) + '">' + esc(E.telefone) + "</a></li>" +
    (E.telefone2 ? '<li><a href="tel:' + esc(E.telefone2.replace(/\s/g, "")) + '">' + esc(E.telefone2) + "</a></li>" : "") +
    '<li><a href="mailto:' + esc(E.email) + '">' + esc(E.email) + "</a></li>" +
    '<li><a href="' + waLink + '" target="_blank" rel="noopener">WhatsApp</a></li></ul>' +
    '<div class="footer__org"><span><img src="assets/img/logos/luadeira.png" alt="Lua-Deira Digital Angola"></span><span><img src="assets/img/logos/jldi.png" alt="JLDI"></span></div></div>' +
    "</div>" +
    '<div class="footer__bar"><span>© 2026 GiLF Angola · Organização: Lua-Deira Digital Angola & JLDI</span><span>' + esc(E.site) + "</span></div></div></footer>" +
    '<a class="wa-float" href="' + waLink + '" target="_blank" rel="noopener" aria-label="Falar connosco no WhatsApp">' + WA + "</a>" +
    '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalName"><div class="modal__box"><button class="modal__close" aria-label="Fechar">×</button><div class="modal__ph" id="modalPh"></div><div class="modal__body" id="modalBody"></div></div></div>';
  document.body.insertAdjacentHTML("beforeend", footer);
  if (PREVIEW) document.body.insertAdjacentHTML("afterbegin", '<div style="position:sticky;top:0;z-index:90;background:#d61f26;color:#fff;text-align:center;padding:8px 12px;font-size:.85rem;font-weight:600">Pré-visualização das alterações (ainda não publicadas) · <a href="?preview=0" style="color:#fff">Sair</a></div>');

  var hd = $("#header");
  var onScroll = function () { hd.classList.toggle("is-scrolled", window.scrollY > 10); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $("#burger"), menu = $("#menu");
  burger.addEventListener("click", function () {
    var o = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(o));
    burger.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu");
  });

  /* ---------- fill simple bindings: data-bind="evento.local" ---------- */
  $$("[data-bind]").forEach(function (el) {
    var v = el.getAttribute("data-bind").split(".").reduce(function (o, k) { return o ? o[k] : ""; }, D);
    if (v) el.textContent = v;
  });

  /* ---------- countdown ---------- */
  var cd = $("[data-countdown]");
  if (cd) {
    var target = new Date(E.inicio || "2026-12-17T08:00:00+01:00");
    cd.innerHTML = ["dias", "horas", "min", "seg"].map(function (l) { return "<div><b>--</b><small>" + l + "</small></div>"; }).join("");
    var bs = $$("b", cd);
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var tick = function () {
      var s = Math.max(0, Math.floor((target - new Date()) / 1000));
      bs[0].textContent = Math.floor(s / 86400); bs[1].textContent = pad(Math.floor(s % 86400 / 3600));
      bs[2].textContent = pad(Math.floor(s % 3600 / 60)); bs[3].textContent = pad(s % 60);
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- speakers ---------- */
  var SP = (D.oradores || []).filter(function (o) { return o && o.nome; });
  var byId = {}; SP.forEach(function (o) { byId[o.id] = o; });
  var ROLE = { keynote: "Keynote", orador: "Orador(a)", moderador: "Moderador(a)", apresentador: "Apresentador(a)", honra: "Convidado de Honra" };
  var initials = function (n) { return n.replace(/^(Dr|Dra|Eng|Engª|Prof|Sr|Sra|Exmo|Exma)\.?\s+/i, "").split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase(); };
  var photo = function (o, cls) { return o.foto ? '<img src="' + esc(o.foto) + '" alt="' + esc(o.nome) + '" loading="lazy">' : '<span class="' + (cls || "mono") + '">' + esc(initials(o.nome)) + "</span>"; };

  function card(o) {
    return '<button class="spk rv" type="button" data-spk="' + esc(o.id) + '">' +
      '<div class="spk__ph"><span class="role role--' + esc(o.papel) + '">' + esc(ROLE[o.papel] || o.papel || "") + "</span>" + photo(o) + "</div>" +
      '<div class="spk__body"><h3>' + esc(o.nome) + "</h3><p>" + esc(o.cargo) + (o.organizacao ? '<br><span class="org">' + esc(o.organizacao) + "</span>" : "") + "</p></div></button>";
  }
  function tba() {
    return '<div class="spk spk--tba rv"><div class="spk__ph"><span class="mono">' + ic("user") + '</span></div><div class="spk__body"><h3>A anunciar</h3><p>Brevemente</p></div></div>';
  }
  window.GILF_renderSpeakers = function (el, opts) {
    opts = opts || {};
    var list = SP.slice();
    if (opts.papel && opts.papel !== "todos") list = list.filter(function (o) { return o.papel === opts.papel; });
    if (opts.q) { var q = opts.q.toLowerCase(); list = list.filter(function (o) { return [o.nome, o.cargo, o.organizacao, o.pais].join(" ").toLowerCase().indexOf(q) > -1; }); }
    if (opts.destaque) { var f = list.filter(function (o) { return o.destaque; }); list = f.length ? f : list; }
    if (opts.limit) list = list.slice(0, opts.limit);
    var html = list.map(card).join("");
    var fill = opts.minCards ? Math.max(0, opts.minCards - list.length) : 0;
    if (!SP.length || (opts.minCards && !opts.q && (!opts.papel || opts.papel === "todos"))) for (var i = 0; i < fill; i++) html += tba();
    if (!html) html = '<div class="empty" style="grid-column:1/-1">Nenhum resultado.</div>';
    el.innerHTML = html;
    observe(el);
  };
  window.GILF_speakerCount = function (papel) { return papel ? SP.filter(function (o) { return o.papel === papel; }).length : SP.length; };

  /* modal */
  var modal = $("#modal"), lastFocus = null;
  function sessionsOf(id) {
    var out = [];
    ["forum", "gala"].forEach(function (k) {
      ((D.programa || {})[k] || []).forEach(function (s) {
        if (s.moderador === id) out.push([s.hora, s.titulo + " (moderação)"]);
        else if ((s.oradores || []).indexOf(id) > -1) out.push([s.hora, s.titulo]);
      });
    });
    return out;
  }
  function openSpeaker(id) {
    var o = byId[id]; if (!o) return;
    lastFocus = document.activeElement;
    $("#modalPh").innerHTML = photo(o);
    var ses = sessionsOf(id);
    $("#modalBody").innerHTML = '<span class="role role--' + esc(o.papel) + '" style="position:static;display:inline-block">' + esc(ROLE[o.papel] || "") + "</span>" +
      '<h3 id="modalName">' + esc(o.nome) + '</h3><p class="pos">' + esc(o.cargo) + (o.organizacao ? " · <b>" + esc(o.organizacao) + "</b>" : "") + (o.pais ? " · " + esc(o.pais) : "") + "</p>" +
      (o.bio ? '<p class="bio">' + esc(o.bio) + "</p>" : "") +
      (o.linkedin ? '<p><a class="link" href="' + esc(o.linkedin) + '" target="_blank" rel="noopener">Perfil LinkedIn →</a></p>' : "") +
      (ses.length ? '<ul class="sessions">' + ses.map(function (s) { return "<li><b>" + esc(s[0]) + "</b>" + esc(s[1]) + "</li>"; }).join("") + "</ul>" : "");
    modal.classList.add("is-open"); document.body.style.overflow = "hidden";
    $(".modal__close", modal).focus();
  }
  function closeModal() { modal.classList.remove("is-open"); document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-spk]") : null;
    if (t) { openSpeaker(t.getAttribute("data-spk")); return; }
    if (e.target === modal || (e.target.closest && e.target.closest(".modal__close"))) closeModal();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

  /* ---------- agenda ---------- */
  var TAG = { sessao: "Sessão", keynote: "Keynote", painel: "Painel", pausa: "Pausa", networking: "Networking", gala: "Gala" };
  function personChip(o, label) {
    if (!o) return '<span class="person" aria-hidden="true"><span class="av av--tba">?</span><span><b>A anunciar</b><small>' + esc(label || "Orador(a)") + "</small></span></span>";
    return '<button class="person" type="button" data-spk="' + esc(o.id) + '"><span class="av">' + photo(o, "ini") + "</span><span><b>" + esc(o.nome) + "</b><small>" + esc(label || o.organizacao || o.cargo) + "</small></span></button>";
  }
  window.GILF_renderAgenda = function (el, key) {
    var list = ((D.programa || {})[key] || []);
    el.innerHTML = list.map(function (s) {
      var light = s.tipo === "pausa" || s.tipo === "networking";
      var ppl = "";
      var mod = s.moderador && byId[s.moderador];
      var spk = (s.oradores || []).map(function (id) { return byId[id]; }).filter(Boolean);
      var vagas = Math.max(0, (s.vagas || 0) - spk.length);
      if (mod) ppl += personChip(mod, "Moderador(a)");
      else if (s.tipo === "painel") ppl += personChip(null, "Moderador(a)");
      spk.forEach(function (o) { ppl += personChip(o); });
      for (var i = 0; i < vagas; i++) ppl += personChip(null, s.tipo === "keynote" ? "Keynote" : "Orador(a)");
      return '<li class="slot rv' + (light ? " slot--light" : "") + '"><div class="slot__time">' + esc(s.hora) + (s.fim ? "<small>até " + esc(s.fim) + "</small>" : "") + "</div><div>" +
        '<span class="slot__tag slot__tag--' + esc(s.tipo) + '">' + esc(TAG[s.tipo] || s.tipo) + "</span><h3>" + esc(s.titulo) + "</h3>" +
        (s.descricao ? "<p>" + esc(s.descricao) + "</p>" : "") + (ppl ? '<div class="people">' + ppl + "</div>" : "") + "</div></li>";
    }).join("");
    observe(el);
  };
  $$("[data-tabs]").forEach(function (wrap) {
    var tabs = $$("[role=tab]", wrap);
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) { x.setAttribute("aria-selected", String(x === t)); });
        $$("[data-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== t.getAttribute("data-tab"); });
      });
    });
  });

  /* ---------- awards ---------- */
  window.GILF_renderAwards = function (el) {
    el.innerHTML = (D.premios || []).map(function (a, i) {
      return '<article class="award rv' + (i % 4 ? " rv-d" + (i % 4) : "") + '"><div class="award__ic">' + ic("trophy") + "</div><h3>" + esc(a.titulo) + "</h3><p>" + esc(a.descricao) + "</p></article>";
    }).join("");
    observe(el);
  };

  /* ---------- tickets ---------- */
  window.GILF_renderTickets = function (el) {
    el.innerHTML = (D.ingressos || []).map(function (t) {
      return '<article class="tier rv' + (t.destaque ? " tier--feat" : "") + '">' + (t.destaque ? '<span class="tier__badge">Recomendado</span>' : "") +
        "<h3>" + esc(t.nome) + '</h3><div class="tier__sub">' + esc(t.subtitulo) + '</div><div class="tier__price">' + esc(t.preco || "Sob consulta") + "</div>" +
        "<ul>" + (t.itens || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<a class="btn ' + (t.destaque ? "btn--gold" : "btn--line") + ' btn--block" href="inscricao.html?ingresso=' + encodeURIComponent(t.nome) + '#form">Reservar</a></article>';
    }).join("");
    observe(el);
  };

  /* ---------- partners ---------- */
  function logo(p, eager) {
    var inner = '<img src="' + esc(p.logo) + '" alt="' + esc(p.nome) + '" title="' + esc(p.nome) + '"' + (eager ? "" : ' loading="lazy"') + ">";
    return p.url ? '<a class="plogo" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + inner + "</a>" : '<div class="plogo">' + inner + "</div>";
  }
  window.GILF_renderPartners = function (el, opts) {
    opts = opts || {};
    el.innerHTML = (D.parceiros || []).filter(function (g) { return !opts.skip || opts.skip.indexOf(g.grupo) < 0; }).map(function (g) {
      return '<div class="pgroup rv"><div class="pgroup__t">' + esc(g.grupo) + '</div><div class="logos' + (g.grupo === "Organização" ? " logos--lg" : "") + '">' + g.itens.map(function (p) { return logo(p); }).join("") + "</div></div>";
    }).join("");
    observe(el);
  };
  window.GILF_renderMarquee = function (el) {
    var all = []; (D.parceiros || []).forEach(function (g) { all = all.concat(g.itens); });
    var row = all.map(function (p) { return logo(p, true); }).join("");
    el.innerHTML = '<div class="marquee__track">' + row + row + "</div>";
  };
  window.GILF_partnerCount = function () { var n = 0; (D.parceiros || []).forEach(function (g) { if (g.grupo !== "Organização") n += g.itens.length; }); return n; };

  /* ---------- forms (mailto / WhatsApp, no server needed) ---------- */
  $$("form[data-form]").forEach(function (form) {
    var via = "email", st = $(".form__status", form);
    $$("[data-via]", form).forEach(function (b) { b.addEventListener("click", function () { via = b.getAttribute("data-via"); }); });
    var qs = new URLSearchParams(location.search);
    $$("[data-qs]", form).forEach(function (f) {
      var v = qs.get(f.getAttribute("data-qs")); if (!v) return;
      if (f.tagName === "SELECT") { $$("option", f).forEach(function (o) { if (o.value === v || o.text === v) f.value = o.value; }); } else f.value = v;
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (f) {
        var bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value.trim()));
        f.classList.toggle("is-invalid", bad); if (bad) ok = false;
      });
      if (!ok) { st.className = "form__status err"; st.textContent = "Por favor preencha os campos obrigatórios (*) correctamente."; return; }
      var lines = [form.getAttribute("data-form"), ""];
      $$("input, select, textarea", form).forEach(function (f) {
        var v = (f.value || "").trim(); if (!v || !f.name) return;
        var lab = f.closest(".field"); lab = lab ? lab.firstChild.textContent.replace("*", "").trim() : f.name;
        lines.push(lab + ": " + v);
      });
      var body = lines.join("\n");
      var nameField = form.querySelector("[name=nome]");
      if (via === "wa") window.open("https://wa.me/" + E.whatsapp + "?text=" + encodeURIComponent(body), "_blank", "noopener");
      else location.href = "mailto:" + E.email + "?subject=" + encodeURIComponent(form.getAttribute("data-form") + (nameField ? " — " + nameField.value : "")) + "&body=" + encodeURIComponent(body);
      st.className = "form__status ok";
      st.textContent = "Obrigado! A sua mensagem foi preparada — confirme o envio na aplicação de " + (via === "wa" ? "WhatsApp." : "e-mail.");
    });
  });

  /* ---------- reveal ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, { threshold: .1, rootMargin: "0px 0px -30px 0px" }) : null;
  function observe(root) { $$(".rv:not(.in)", root).forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); }); }
  window.GILF_observe = observe;

  document.dispatchEvent(new Event("gilf:ready"));
  observe(document);
})();
