/* GiLF Angola 2026 — Área Administrativa
   Edits assets/dados.js and uploads images straight to the GitHub repository
   (one commit per "Publicar"). GitHub Pages then rebuilds the public site. */
(function () {
  "use strict";

  /* ======================= utilities ======================= */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var slug = function (s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/^(dr|dra|eng|prof|sr|sra|sensei)\.?\s+/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "item"; };
  var stamp = function () { return Date.now().toString(36).slice(-5); };
  var nrm = function (s) { return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/^(s\.?\s?e\.?|dr|dra|eng|prof|sr|sra|sensei)\.?\s+/, "").replace(/[^a-z0-9]+/g, " ").trim(); };
  var initials = function (n) { return String(n || "?").split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase(); };
  var K = { auth: "gilf-admin-auth", draft: "gilf-admin-draft", files: "gilf-admin-files" };
  var ICONS = {
    painel: '<path d="M3 13h8V3H3zM13 21h8v-8h-8zM13 3v8h8V3zM3 21h8v-6H3z"/>',
    evento: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    programa: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    pessoas: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    premios: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    parceiros: '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2L15 11l-1 1a2.1 2.1 0 0 1-3-3l2.8-2.8a3 3 0 0 1 3.6-.4l.6.4a3 3 0 0 0 2 .5H21v7M3 4h2l6 6M3 14h2l4 4a1.4 1.4 0 0 0 2-2"/>',
    bilhetes: '<path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z"/>',
    patrocinio: '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    organizacao: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>',
    faq: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01"/>',
    gala: '<path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8-4.2-4.1 5.9-.9z"/>',
    edicoes: '<path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4zM8 4v16M12 9h5M12 13h5"/>',
    noticias: '<path d="M4 5h13v14a1 1 0 0 0 2 0V8h1M4 5v13a1 1 0 0 0 1 1h14M8 9h5M8 13h5M8 16h3"/>',
    clube: '<circle cx="12" cy="7" r="4"/><path d="M5 21v-1a7 7 0 0 1 14 0v1M17.5 3.5 20 2M6.5 3.5 4 2"/>',
    historico: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>',
    definicoes: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>', del: '<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"/>',
    up: '<path d="m6 15 6-6 6 6"/>', down: '<path d="m6 9 6 6 6-6"/>', grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>', plus: '<path d="M12 5v14M5 12h14"/>'
  };
  var ic = function (n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || "") + "</svg>"; };
  var toastT;
  function toast(msg, err) { var t = $("#toast"); t.textContent = msg; t.className = "toast show" + (err ? " err" : ""); clearTimeout(toastT); toastT = setTimeout(function () { t.className = "toast" + (err ? " err" : ""); }, err ? 6000 : 3200); }
  function busy(txt) { $("#busy").classList.toggle("hidden", !txt); if (txt) $("#busyTxt").textContent = txt; }
  var lsGet = function (k) { try { return JSON.parse(localStorage.getItem(k) || sessionStorage.getItem(k) || "null"); } catch (e) { return null; } };

  /* ======================= state ======================= */
  var S = { user: null, papel: "", edicao: localStorage.getItem("gilf-admin-edicao") || "", edicoes: [], publicadoEm: null, data: null, base: "", fileSha: null, files: {}, view: "painel", offline: false, prog: "forum", pFilter: "todos", pQuery: "" };
  var podeEditar = function () { return S.papel === "admin" || S.papel === "editor"; };
  var isDirty = function () { return JSON.stringify(S.data) !== S.base || Object.keys(usedFiles()).length > 0; };
  function usedFiles() {
    var used = {}, txt = JSON.stringify(S.data);
    Object.keys(S.files).forEach(function (p) { if (txt.indexOf('"' + p + '"') > -1) used[p] = S.files[p]; });
    return used;
  }
  function save() {
    try {
      localStorage.setItem(K.draft, JSON.stringify({ data: S.data, edicao: S.edicao, publicadoEm: S.publicadoEm, at: Date.now() }));
      localStorage.setItem(K.files, JSON.stringify(usedFiles()));
    } catch (e) { toast("Aviso: o rascunho é grande demais para guardar no browser. Publique em breve.", true); }
    status(); rascunhoServidor();
  }
  var tRasc = null, rascEstado = "";
  function rascunhoServidor() {
    if (!S.edicao || !S.data || !podeEditar()) return;
    clearTimeout(tRasc);
    tRasc = setTimeout(function () {
      if (!isDirty()) return;
      rascEstado = "a guardar…"; status();
      api("forum_guardar_rascunho", { p_slug: S.edicao, p_conteudo: S.data }).then(function () { rascEstado = "rascunho guardado na nuvem"; status(); }, function () { rascEstado = "rascunho só neste computador"; status(); });
    }, 2500);
  }
  function status() {
    var st = $("#status"), d = isDirty();
    st.className = "status" + (d ? " dirty" : "");
    $("span", st).textContent = (d ? "Alterações por publicar" : "Tudo publicado") + (d && rascEstado ? " · " + rascEstado : "");
    $("#publishBtn").textContent = "Publicar"; $("#publishBtn").hidden = !podeEditar();
  }
  var img = function (p) { return !p ? "" : S.files[p] || (/^(data:|https?:)/.test(p) ? p : "../" + p); };
  var D = function () { return S.data; };
  var people = function () { return D().pessoas || (D().pessoas = []); };
  var person = function (id) { return people().filter(function (p) { return p.id === id; })[0]; };
  var ROLE = { keynote: "Keynote", guest: "Guest Speaker", moderador: "Moderador(a)", orador: "Orador(a)", "": "—" };

  /* ======================= base de dados (Supabase) ======================= */
  var sb = window.supabase.createClient("https://sohducskrepqpsbrxwgr.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaGR1Y3NrcmVwcXBzYnJ4d2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0ODc5ODksImV4cCI6MjExMTA2Mzk4OX0.-YSWoI851LXBnKXKQB8FYvCFIkEdYb9mVz8fZl1Q3i0", { auth: { persistSession: true, autoRefreshToken: true, storageKey: "gilf-admin-sessao" } });
  function api(fn, args) {
    return sb.rpc(fn, args || {}).then(function (r) { if (r.error) { var e = new Error(r.error.message); e.code = r.error.code; throw e; } return r.data; });
  }
  /* explicação clara de qualquer erro */
  function why(err) {
    var m = String((err && err.message) || err || "");
    if (/fetch|network|load failed|NetworkError/i.test(m)) return "Sem ligação à internet. Verifique a ligação e tente de novo.";
    if (/Invalid login credentials/i.test(m)) return "Email ou palavra-passe incorrectos.";
    if (/Email not confirmed/i.test(m)) return "Esta conta ainda não confirmou o email.";
    if (/Sem permiss/i.test(m)) return "A sua conta não tem permissão para esta acção. Peça a um administrador para o adicionar à equipa.";
    if (/JWT|expired/i.test(m)) return "A sessão expirou. Entre de novo.";
    return m.replace(/^CONFLITO: /, "") || "Erro desconhecido.";
  }
  function parseDados(text) {
    var m = /^window\.GILF\s*=\s*/m.exec(text);
    var a = m ? m.index + m[0].length : -1, b = text.lastIndexOf("}");
    if (a < 0 || b < a) throw new Error("Formato de dados.js inesperado.");
    return JSON.parse(text.slice(a, b + 1));
  }
  function serialize(d) {
    return "/* GiLF ANGOLA 2026 — CONTEÚDOS DO SITE\n   Este ficheiro é gerido pela Área Administrativa (/admin/).\n   Edições manuais: manter o formato  window.GILF = { ... };  (JSON válido). */\nwindow.GILF = " + JSON.stringify(d, null, 2) + ";\n";
  }

  /* ======================= login ======================= */
  function showApp() { $("#login").classList.add("hidden"); $("#app").classList.remove("hidden"); buildNav(); go(location.hash.slice(1) || "painel"); status(); }
  function start(ed) {
    S.edicao = ed.slug; S.papel = ed.papel || S.papel; S.publicadoEm = ed.publicado_em; localStorage.setItem("gilf-admin-edicao", ed.slug);
    var base = ed.conteudo || ed.rascunho || { evento: {} };
    S.data = clone(base); S.base = JSON.stringify(ed.conteudo || {}); S.fileSha = null; S.files = {};
    if (ed.rascunho && ed.conteudo && JSON.stringify(ed.rascunho) !== S.base) {
      var quando = new Date(ed.rascunho_em).toLocaleString("pt-PT");
      if (confirm("Há um rascunho por publicar desta edição, guardado por " + (ed.rascunho_por || "alguém da equipa") + " em " + quando + ".\n\nOK = continuar esse rascunho · Cancelar = começar da versão publicada")) S.data = clone(ed.rascunho);
    }
    var dr = lsGet(K.draft);
    if (dr && dr.data && dr.edicao === ed.slug && JSON.stringify(dr.data) !== JSON.stringify(S.data) && JSON.stringify(dr.data) !== S.base && dr.at > (ed.rascunho_em ? +new Date(ed.rascunho_em) : 0)) {
      if (confirm("Existe um rascunho mais recente guardado neste computador (" + new Date(dr.at).toLocaleString("pt-PT") + ").\n\nOK = recuperar · Cancelar = ignorar")) S.data = dr.data;
    }
    save(); showApp();
  }
  function abrirEdicao(slug) {
    busy("A carregar a edição…");
    return api("forum_edicoes").then(function (l) {
      S.edicoes = l || [];
      var alvo = slug || S.edicao, ex = S.edicoes.filter(function (e) { return e.slug === alvo; })[0] || S.edicoes.filter(function (e) { return e.actual; })[0] || S.edicoes[0];
      if (!ex) throw new Error("Ainda não existe nenhuma edição.");
      return api("forum_obter", { p_slug: ex.slug });
    }).then(function (ed) { busy(); start(ed); }).catch(function (err) { busy(); throw err; });
  }
  function entrar() {
    return sb.auth.getSession().then(function (r) {
      var ses = r.data.session; if (!ses) return false;
      S.user = { email: ses.user.email };
      return api("forum_papel").then(function (p) {
        if (!p) { sb.auth.signOut(); throw new Error("A conta " + ses.user.email + " não faz parte da equipa do GiLF. Peça a um administrador para o adicionar em Equipa."); }
        S.papel = p; return abrirEdicao().then(function () { toast("Bem-vindo(a), " + ses.user.email); return true; });
      });
    });
  }
  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var em = $("#lemail").value.trim(), pw = $("#lpass").value;
    if (!em || !pw) return;
    $("#loginErr").textContent = ""; busy("A entrar…");
    sb.auth.signInWithPassword({ email: em, password: pw }).then(function (r) { if (r.error) throw r.error; return entrar(); })
      .catch(function (err) { busy(); $("#loginErr").textContent = why(err); });
  });
  $("#forgot").addEventListener("click", function () {
    var em = $("#lemail").value.trim(); if (!em) { $("#loginErr").textContent = "Escreva primeiro o seu email."; return; }
    sb.auth.resetPasswordForEmail(em, { redirectTo: "https://gilf-evento.com/#/nova-password" }).then(function () { $("#loginErr").textContent = "Enviámos um email para definir uma nova palavra-passe."; });
  });
  $("#logout").addEventListener("click", function () {
    if (isDirty() && !confirm("Tem alterações por publicar (ficam guardadas como rascunho). Sair?")) return;
    sb.auth.signOut().then(function () { location.hash = ""; location.reload(); });
  });
  window.addEventListener("beforeunload", function (e) { if (S.data && isDirty()) { e.preventDefault(); e.returnValue = ""; } });
  busy("A verificar sessão…");
  entrar().then(function (ok) { if (!ok) busy(); }).catch(function (err) { busy(); $("#loginErr").textContent = why(err); });

  /* ======================= navigation ======================= */
  var VIEWS = [
    ["painel", "Painel"], ["sep", "Conteúdos"], ["evento", "Evento"], ["programa", "Programa"], ["pessoas", "Oradores & Pessoas"],
    ["sep", "Gala & Prémios"], ["premios", "Prémios & Distinguidos"], ["gala", "Gala"], ["edicoes", "Edições & Líderes"],
    ["sep", "Comunidade"], ["noticias", "Notícias"], ["clube", "Clube de Líderes"],
    ["sep", "Mais"], ["parceiros", "Parceiros"], ["bilhetes", "Bilhetes"], ["patrocinio", "Patrocínio"], ["organizacao", "Organização"], ["faq", "Perguntas frequentes"],
    ["sep", "Gestão"], ["registos", "Reservas & mensagens"], ["plataforma", "Edições do evento"], ["equipa", "Equipa & acessos"],
    ["sep", "Sistema"], ["historico", "Histórico de versões"], ["actividade", "Registo de actividade"], ["definicoes", "Definições & cópias"]
  ];
  function buildNav() {
    $("#nav").innerHTML = VIEWS.map(function (v) {
      if (v[0] === "sep") return '<div class="side__sep">' + v[1] + "</div>";
      var c = ["registos", "plataforma", "equipa", "actividade"].indexOf(v[0]) >= 0 ? "" : v[0] === "pessoas" ? people().length : v[0] === "premios" ? honCount() : v[0] === "noticias" ? (D().noticias || []).length : v[0] === "edicoes" ? (D().edicoes || []).length + 1 : v[0] === "parceiros" ? (D().parceiros || []).reduce(function (n, g) { return n + (g.itens || []).length; }, 0) : "";
      return '<button class="nav' + (S.view === v[0] ? " on" : "") + '" data-go="' + v[0] + '">' + ic(v[0]) + "<span>" + v[1] + "</span>" + (c !== "" ? '<span class="count">' + c + "</span>" : "") + "</button>";
    }).join("");
    var PAP = { admin: "Administrador", editor: "Editor", leitor: "Só leitura" };
    $("#who").innerHTML = '<span><b style="color:#fff">' + esc(S.user ? S.user.email : "") + '</b><br><span class="small">' + esc(PAP[S.papel] || "") + '</span></span>' +
      '<label class="small" style="display:block;margin-top:8px;color:#d8c9a8">Edição<select id="edSel" style="width:100%;margin-top:4px">' + S.edicoes.map(function (e) { return '<option value="' + esc(e.slug) + '"' + (e.slug === S.edicao ? " selected" : "") + ">" + esc(e.nome) + (e.actual ? " ★" : "") + "</option>"; }).join("") + "</select></label>";
    var es = $("#edSel"); if (es) es.onchange = function () { var v = es.value; if (isDirty() && !confirm("As alterações desta edição ficam guardadas como rascunho. Mudar de edição?")) { es.value = S.edicao; return; } abrirEdicao(v).catch(function (err) { toast(why(err), true); }); };
  }
  document.addEventListener("click", function (e) {
    var g = e.target.closest("[data-go]"); if (!g) return;
    e.preventDefault(); go(g.getAttribute("data-go")); $("#side").classList.remove("open");
  });
  $("#menuBtn").addEventListener("click", function () { $("#side").classList.toggle("open"); });
  function go(v) {
    if (!R[v]) v = "painel";
    S.view = v; location.hash = v;
    $("#title").textContent = VIEWS.filter(function (x) { return x[0] === v; })[0][1] + (S.edicao ? " · " + ((S.edicoes.filter(function (e) { return e.slug === S.edicao; })[0] || {}).nome || S.edicao) : "");
    buildNav(); $("#view").innerHTML = ""; R[v]($("#view")); window.scrollTo(0, 0);
  }
  function changed(rerender) { save(); buildNav(); if (rerender !== false) R[S.view]($("#view").replaceChildren() || $("#view")); }

  /* ======================= images ======================= */
  function processImage(file, mode) {
    return new Promise(function (res, rej) {
      if (!/^image\//.test(file.type)) return rej(new Error("O ficheiro não é uma imagem."));
      var im = new Image(), url = URL.createObjectURL(file);
      im.onload = function () {
        var c = document.createElement("canvas"), x = c.getContext("2d");
        if (mode === "wide") {
          var kw = Math.min(1, 1600 / im.width);
          c.width = Math.round(im.width * kw); c.height = Math.round(im.height * kw);
          x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
          res(c.toDataURL("image/jpeg", .85));
        } else if (mode === "photo") {
          var s = Math.min(im.width, im.height), sx = (im.width - s) / 2, sy = im.height > im.width ? (im.height - s) * .18 : (im.height - s) / 2;
          c.width = c.height = Math.min(640, s); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
          x.drawImage(im, sx, sy, s, s, 0, 0, c.width, c.width);
          res(c.toDataURL("image/jpeg", .86));
        } else {
          var k = Math.min(1, 600 / im.width, 300 / im.height);
          c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          x.drawImage(im, 0, 0, c.width, c.height);
          res(c.toDataURL("image/png"));
        }
        URL.revokeObjectURL(url);
      };
      im.onerror = function () { rej(new Error("Não foi possível ler a imagem.")); };
      im.src = url;
    });
  }

  /* ======================= dialog + form builder ======================= */
  var dlg = $("#dlg"), dlgForm = $("#dlgForm"), dlgCtl = null;
  dlgForm.addEventListener("submit", function (e) {
    if (e.submitter && e.submitter.value === "ok" && dlgCtl && !dlgCtl.valid()) { e.preventDefault(); }
  });
  $$("[data-close]", dlg).forEach(function (b) { b.addEventListener("click", function () { dlg.close("cancel"); }); });
  dlg.addEventListener("close", function () { var c = dlgCtl; dlgCtl = null; if (c) c.done(dlg.returnValue === "ok"); });
  function openForm(title, fields, obj, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      $("#dlgTitle").textContent = title;
      $("#dlgOk").textContent = opts.ok || "Guardar";
      $("#dlgExtra").innerHTML = "";
      var form = buildForm($("#dlgBody"), fields, obj);
      if (opts.extra) opts.extra($("#dlgExtra"));
      dlgCtl = { valid: form.valid, done: function (ok) { resolve(ok ? form.read() : null); } };
      dlg.returnValue = ""; dlg.showModal();
      var first = $("input:not([type=file]):not([type=checkbox]), textarea", $("#dlgBody")); if (first) first.focus();
    });
  }
  /* field: {k, l (label), t (type), req, hint, opts:[[v,l]], ph, mode, dir, name(obj)->filename} ; rows: {row:[...]} */
  function buildForm(root, fields, obj) {
    var getters = [], checks = [];
    root.innerHTML = "";
    function field(f, parent) {
      var v = obj[f.k], wrap = document.createElement("div");
      var label = '<span class="' + (f.req ? "req" : "") + '">' + esc(f.l) + "</span>" + (f.hint ? '<span class="hint">' + esc(f.hint) + "</span>" : "");
      if (f.t === "check") {
        wrap.innerHTML = '<label class="f f--check"><input type="checkbox"' + (v ? " checked" : "") + "> " + esc(f.l) + "</label>";
        var cb = $("input", wrap); getters.push(function (o) { o[f.k] = cb.checked; });
      } else if (f.t === "textarea" || f.t === "lines") {
        wrap.innerHTML = '<label class="f">' + label + '<textarea rows="' + (f.rows || 4) + '" placeholder="' + esc(f.ph || "") + '"></textarea></label>';
        var ta = $("textarea", wrap); ta.value = f.t === "lines" ? (v || []).join("\n") : (v || "");
        getters.push(function (o) { o[f.k] = f.t === "lines" ? ta.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean) : ta.value.trim(); });
        if (f.req) checks.push(function () { return ta.value.trim() ? "" : f.l; });
      } else if (f.t === "select") {
        var o = typeof f.opts === "function" ? f.opts() : f.opts;
        wrap.innerHTML = '<label class="f">' + label + "<select>" + o.map(function (x) { return '<option value="' + esc(x[0]) + '">' + esc(x[1]) + "</option>"; }).join("") + "</select></label>";
        var se = $("select", wrap); se.value = v == null ? "" : v;
        getters.push(function (ob) { ob[f.k] = se.value; });
      } else if (f.t === "people") {
        var sel = (v || []).slice();
        wrap.innerHTML = '<div class="f">' + label + '<div class="picker"><input class="inp" placeholder="Pesquisar pessoas…"><div class="picker__list"></div><div class="chosen"></div></div></div>';
        var list = $(".picker__list", wrap), q = $("input", wrap), chosen = $(".chosen", wrap);
        var draw = function () {
          var t = q.value.toLowerCase();
          list.innerHTML = people().filter(function (p) { return !t || (p.nome + " " + p.cargo + " " + p.organizacao).toLowerCase().indexOf(t) > -1; }).map(function (p) {
            return '<label><input type="checkbox" value="' + esc(p.id) + '"' + (sel.indexOf(p.id) > -1 ? " checked" : "") + '><span class="thumb">' + (p.foto ? '<img src="' + esc(img(p.foto)) + '" alt="">' : esc(initials(p.nome))) + "</span><span>" + esc(p.nome) + ' <span class="muted small">' + esc(p.cargo || "") + "</span></span></label>";
          }).join("") || '<span class="muted small" style="padding:8px">Sem resultados. Adicione a pessoa em “Oradores & Pessoas”.</span>';
          chosen.innerHTML = sel.length ? sel.map(function (id, i) { var p = person(id); return "<span>" + (i + 1) + ". " + esc(p ? p.nome : id) + "</span>"; }).join("") : '<span class="muted small" style="background:none">Nenhuma selecção</span>';
        };
        list.addEventListener("change", function (e) { var id = e.target.value; if (e.target.checked) sel.push(id); else sel = sel.filter(function (x) { return x !== id; }); draw(); });
        q.addEventListener("input", draw); draw();
        getters.push(function (ob) { ob[f.k] = sel.slice(); });
      } else if (f.t === "image" || f.t === "logo") {
        var cur = v || "", isLogo = f.t === "logo";
        wrap.innerHTML = '<div class="imgf' + (isLogo ? " imgf--logo" : "") + '"><div class="prev"></div><div class="acts"><b class="small">' + esc(f.l) + '</b><label class="btn btn--sm" style="cursor:pointer">Carregar imagem<input type="file" accept="image/*" hidden></label><button type="button" class="btn btn--sm btn--danger">Remover</button><span class="hint small muted">' + (isLogo ? "PNG com fundo transparente, de preferência." : f.mode === "wide" ? "Mantém o formato original (máx. 1600 px)." : "Recortada automaticamente em quadrado.") + "</span></div></div>";
        var prev = $(".prev", wrap), show = function () { prev.innerHTML = cur ? '<img src="' + esc(img(cur)) + '" alt="">' : (isLogo ? "Sem logótipo" : "Sem foto"); };
        $("input", wrap).addEventListener("change", function (e) {
          var file = e.target.files[0]; if (!file) return;
          processImage(file, f.mode || (isLogo ? "logo" : "photo")).then(function (data) {
            var base = f.name ? slug(f.name()) : "img";
            var path = (S.edicao || "geral") + "/" + (f.dir || "assets/img/pessoas/").replace(/^assets\/img\//, "") + base + "-" + stamp() + (isLogo ? ".png" : ".jpg");
            prev.innerHTML = '<span class="small">A carregar…</span>';
            return fetch(data).then(function (r) { return r.blob(); }).then(function (blob) {
              return sb.storage.from("gilf-media").upload(path, blob, { contentType: isLogo ? "image/png" : "image/jpeg", upsert: false });
            }).then(function (r) {
              if (r.error) throw r.error;
              cur = sb.storage.from("gilf-media").getPublicUrl(path).data.publicUrl; show();
              prev.dispatchEvent(new Event("change", { bubbles: true }));
            });
          }).catch(function (err) { show(); toast("A imagem não foi carregada: " + why(err), true); });
        });
        $("button", wrap).addEventListener("click", function () { cur = ""; show(); prev.dispatchEvent(new Event("change", { bubbles: true })); });
        show();
        getters.push(function (ob) { ob[f.k] = cur; });
        if (f.req) checks.push(function () { return cur ? "" : f.l; });
      } else {
        wrap.innerHTML = '<label class="f">' + label + '<input type="' + (f.t || "text") + '" placeholder="' + esc(f.ph || "") + '"></label>';
        var inp = $("input", wrap); inp.value = v == null ? "" : v;
        getters.push(function (ob) { ob[f.k] = f.t === "number" ? (inp.value === "" ? 0 : Number(inp.value)) : inp.value.trim(); });
        if (f.req) checks.push(function () { return inp.value.trim() ? "" : f.l; });
      }
      parent.appendChild(wrap.children.length === 1 ? wrap.firstChild : wrap);
    }
    fields.forEach(function (f) {
      if (f.row) { var r = document.createElement("div"); r.className = f.row.length === 3 ? "grid3" : "grid2"; root.appendChild(r); f.row.forEach(function (x) { field(x, r); }); }
      else if (f.html) { var h = document.createElement("div"); h.innerHTML = f.html; root.appendChild(h); }
      else field(f, root);
    });
    return {
      read: function () { var o = clone(obj); getters.forEach(function (g) { g(o); }); return o; },
      valid: function () { var miss = checks.map(function (c) { return c(); }).filter(Boolean); if (miss.length) toast("Campo obrigatório: " + miss.join(", "), true); return !miss.length; }
    };
  }
  /* Inline (non-dialog) form bound directly to an object; saves on change. */
  function inlineForm(root, fields, obj, after) {
    var f = buildForm(root, fields, obj);
    root.addEventListener("input", commit); root.addEventListener("change", commit);
    function commit() { var o = f.read(); Object.keys(o).forEach(function (k) { obj[k] = o[k]; }); save(); if (after) after(); }
  }

  /* ======================= list editor ======================= */
  function listEditor(root, o) {
    /* o: {arr(), row(item,i)->{thumb,title,sub,pills}, fields, title(item), make(), onDelete(item), add (label), empty} */
    var wrap = document.createElement("div");
    root.appendChild(wrap);
    function draw() {
      var arr = o.arr();
      var items = o.filter ? arr.map(function (x, i) { return [x, i]; }).filter(function (p) { return o.filter(p[0]); }) : arr.map(function (x, i) { return [x, i]; });
      wrap.innerHTML = (items.length ? '<div class="rows">' + items.map(function (p) {
        var r = o.row(p[0], p[1]);
        return '<div class="row" draggable="' + (!o.filter || o.dragAll ? "true" : "false") + '" data-i="' + p[1] + '"><div style="display:flex;align-items:center;gap:8px"><span class="handle" title="Arrastar para ordenar">' + ic("grip") + "</span>" + (r.thumb || "") + '</div><div class="row__main" data-act="edit"><b>' + esc(r.title) + (r.pills || "") + "</b><small>" + esc(r.sub || "") + '</small></div><div class="row__acts">' +
          '<button class="btn btn--icon btn--sm" data-act="up" title="Subir">' + ic("up") + '</button><button class="btn btn--icon btn--sm" data-act="down" title="Descer">' + ic("down") + '</button><button class="btn btn--icon btn--sm" data-act="edit" title="Editar">' + ic("edit") + '</button><button class="btn btn--icon btn--sm btn--danger" data-act="del" title="Remover">' + ic("del") + "</button></div></div>";
      }).join("") + "</div>" : '<div class="empty">' + (o.empty || "Ainda não há itens.") + "</div>");
    }
    function move(i, j) { var a = o.arr(); if (j < 0 || j >= a.length) return; a.splice(j, 0, a.splice(i, 1)[0]); changed(false); draw(); }
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b) return;
      var i = +b.closest(".row").getAttribute("data-i"), a = o.arr(), act = b.getAttribute("data-act");
      if (act === "up") move(i, i - 1);
      if (act === "down") move(i, i + 1);
      if (act === "edit") edit(i);
      if (act === "del" && confirm("Remover “" + o.title(a[i]) + "”?")) { var it = a.splice(i, 1)[0]; if (o.onDelete) o.onDelete(it); changed(); }
    });
    var dragI = null;
    wrap.addEventListener("dragstart", function (e) { var r = e.target.closest(".row"); if (!r) return; dragI = +r.getAttribute("data-i"); e.dataTransfer.effectAllowed = "move"; });
    wrap.addEventListener("dragover", function (e) { var r = e.target.closest(".row"); if (r && dragI !== null) { e.preventDefault(); $$(".row", wrap).forEach(function (x) { x.classList.toggle("drag-over", x === r); }); } });
    wrap.addEventListener("drop", function (e) { var r = e.target.closest(".row"); if (!r || dragI === null) return; e.preventDefault(); move(dragI, +r.getAttribute("data-i")); dragI = null; });
    wrap.addEventListener("dragend", function () { dragI = null; $$(".row", wrap).forEach(function (x) { x.classList.remove("drag-over"); }); });
    function edit(i) {
      var a = o.arr(), it = a[i];
      openForm("Editar · " + o.title(it), typeof o.fields === "function" ? o.fields(it) : o.fields, it).then(function (res) {
        if (!res) return; if (o.before) res = o.before(res, it); a[i] = res; changed(); toast("Guardado");
      });
    }
    draw();
    return {
      add: function () {
        var n = o.make();
        openForm(o.add || "Adicionar", typeof o.fields === "function" ? o.fields(n) : o.fields, n, { ok: "Adicionar" }).then(function (res) {
          if (!res) return; if (o.before) res = o.before(res, null); o.arr().push(res); changed(); toast("Adicionado");
        });
      },
      draw: draw
    };
  }
  function cardHead(root, title, sub, btns) {
    var h = document.createElement("div"); h.className = "card__h";
    h.innerHTML = "<div><h2>" + esc(title) + "</h2>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + '</div><div class="toolbar" style="margin:0"></div>';
    (btns || []).forEach(function (b) { var x = document.createElement("button"); x.className = "btn " + (b[2] || "btn--dark"); x.innerHTML = (b[3] === false ? "" : ic("plus")) + esc(b[0]); x.addEventListener("click", b[1]); $(".toolbar", h).appendChild(x); });
    root.appendChild(h); return h;
  }
  function card(root, title, sub, btns) { var c = document.createElement("section"); c.className = "card"; root.appendChild(c); if (title) cardHead(c, title, sub, btns); return c; }
  var thumbP = function (p) { return '<span class="thumb">' + (p && p.foto ? '<img src="' + esc(img(p.foto)) + '" alt="">' : esc(initials(p ? p.nome : "?"))) + "</span>"; };

  /* ======================= health checks ======================= */
  function health() {
    var d = D(), out = [], ids = {};
    people().forEach(function (p) { ids[p.id] = p; });
    var used = {};
    ["forum", "gala"].forEach(function (k) {
      ((d.programa || {})[k] || []).forEach(function (s) {
        if (s.moderador) { used[s.moderador] = 1; if (!ids[s.moderador]) out.push(["err", "Sessão “" + s.titulo + "” tem um moderador que já não existe.", "programa"]); }
        (s.oradores || []).forEach(function (id) { used[id] = 1; if (!ids[id]) out.push(["err", "Sessão “" + s.titulo + "” refere uma pessoa removida.", "programa"]); });
        if (s.tipo === "painel" && !s.moderador) out.push(["warn", "O painel “" + s.titulo + "” ainda não tem moderador (aparece “A anunciar”).", "programa"]);
      });
    });
    var actoIds = {}; ((d.premios || {}).actos || []).forEach(function (a) { actoIds[a.id] = 1; });
    ((d.premios || {}).categorias || []).forEach(function (c) {
      var n = (c.distinguidos || []).length;
      (c.distinguidos || []).forEach(function (nm) { var p = personByName(nm); if (p) used[p.id] = 1; });
      if (!n && !c.vagas) out.push(["warn", "A categoria “" + c.titulo + "” não tem distinguidos.", "premios"]);
      if (c.vagas > n) out.push(["warn", "“" + c.titulo + "”: " + (c.vagas - n) + " distinção(ões) por indicar.", "premios"]);
      if (!actoIds[c.acto]) out.push(["err", "A categoria “" + c.titulo + "” não está atribuída a nenhum acto da Gala (não aparece no site).", "premios"]);
    });
    if (!(d.gala || {}).apresentadores || (d.gala.apresentadores || []).filter(Boolean).length < 2) out.push(["warn", "Falta indicar o(a) segundo(a) mestre de cerimónia da Gala.", "gala"]);
    people().forEach(function (p) {
      if (!p.foto) out.push(["warn", p.nome + " não tem fotografia.", "pessoas"]);
      if (p.papel && !used[p.id]) out.push(["warn", p.nome + " (" + ROLE[p.papel] + ") não está em nenhuma sessão do programa.", "programa"]);
      if (!p.papel && !used[p.id]) out.push(["warn", p.nome + " não tem papel nem distinção — o perfil não aparece no site.", "pessoas"]);
    });
    (d.parceiros || []).forEach(function (g) { (g.itens || []).forEach(function (i) { if (!i.logo) out.push(["err", "O parceiro “" + i.nome + "” não tem logótipo.", "parceiros"]); }); });
    var e = d.evento || {};
    ["dataTexto", "local", "telefone", "email", "inicio"].forEach(function (k) { if (!e[k]) out.push(["err", "Falta preencher o campo do evento: " + k + ".", "evento"]); });
    if (e.inicio && isNaN(new Date(e.inicio))) out.push(["err", "A data/hora de início (contagem decrescente) é inválida.", "evento"]);
    return out;
  }

  /* ======================= views ======================= */
  var R = {};

  R.painel = function (v) {
    var d = D(), e = d.evento || {}, days = Math.max(0, Math.ceil((new Date(e.inicio) - new Date()) / 864e5));
    var spk = people().filter(function (p) { return p.papel; }).length;

    var parts = (d.parceiros || []).reduce(function (n, g) { return n + (g.grupo === "Organização" ? 0 : (g.itens || []).length); }, 0);
    v.insertAdjacentHTML("beforeend", (S.offline ? '<div class="banner banner--warn"><b>Modo local.</b> As alterações não são publicadas automaticamente: use “Exportar dados.js” e envie o ficheiro para o repositório.</div>' : "") +
      '<div class="kpis"><div class="kpi kpi--hero"><b>' + (isNaN(days) ? "—" : days) + "</b><span>dias até " + esc(e.dataTexto || "o evento") + '</span></div><div class="kpi"><b>' + spk + '</b><span>oradores e moderadores</span></div><div class="kpi"><b>' + honCount() + '</b><span>distinguidos na Gala</span></div><div class="kpi"><b>' + parts + "</b><span>patrocinadores e parceiros</span></div></div>");
    var two = document.createElement("div"); two.className = "two"; v.appendChild(two);
    var h = health(), c1 = card(two, "Saúde dos conteúdos", h.length ? h.length + " ponto(s) a rever" : "Tudo em ordem");
    var errs = h.filter(function (x) { return x[0] === "err"; }).length;
    c1.insertAdjacentHTML("beforeend", '<ul class="checks">' + (h.length ? h.slice(0, 14).map(function (x) { return '<li><span class="dot dot--' + x[0] + '"></span><span>' + esc(x[1]) + ' <a data-go="' + x[2] + '">Corrigir →</a></span></li>'; }).join("") + (h.length > 14 ? '<li class="muted">… e mais ' + (h.length - 14) + "</li>" : "") : '<li><span class="dot dot--ok"></span>Sem problemas detectados.</li>') + "</ul>" +
      (errs ? '<p class="small" style="color:var(--red);margin:10px 0 0">Há ' + errs + " erro(s) que devem ser corrigidos antes de publicar.</p>" : ""));
    var c2 = card(two, "Acções rápidas");
    c2.insertAdjacentHTML("beforeend", '<div class="rows">' + [["pessoas", "Adicionar orador ou moderador"], ["programa", "Editar painéis e sessões"], ["premios", "Gerir distinguidos da Gala"], ["noticias", "Publicar uma notícia"], ["edicoes", "Preparar a próxima edição"], ["parceiros", "Adicionar patrocinador"], ["evento", "Aviso no topo do site"]].map(function (a) {
      return '<button class="row" style="grid-template-columns:1fr auto;text-align:left;cursor:pointer" data-go="' + a[0] + '"><span class="row__main"><b>' + a[1] + "</b></span><span>→</span></button>";
    }).join("") + "</div>" + (isDirty() ? '<div class="banner banner--info" style="margin:14px 0 0">Tem alterações por publicar. Reveja com <b>Pré-visualizar</b> e depois clique em <b>Publicar</b>.</div>' : ""));
  };

  R.evento = function (v) {
    var e = D().evento || (D().evento = {}); e.redes = e.redes || {};
    var c = card(v, "Dados do evento", "Aparecem no topo, rodapé, contagem decrescente e páginas do site.");
    var f = document.createElement("div"); c.appendChild(f);
    inlineForm(f, [
      { row: [{ k: "nome", l: "Nome curto", req: true }, { k: "nomeCompleto", l: "Nome completo" }] },
      { row: [{ k: "nomeIngles", l: "Nome em inglês" }, { k: "gala", l: "Nome da Gala" }] },
      { k: "tema", l: "Tema / lema" },
      { row: [{ k: "dataTexto", l: "Data (texto)", req: true, ph: "17 de Dezembro de 2026" }, { k: "inicio", l: "Início (contagem decrescente)", req: true, hint: "Formato: 2026-12-17T08:30:00+01:00" }] },
      { row: [{ k: "horarioForum", l: "Horário do Fórum" }, { k: "horarioGala", l: "Horário da Gala" }, { k: "participantes", l: "Participantes esperados" }] },
      { k: "mestres", l: "Mestres de cerimónia do Fórum", ph: "Karina & Julião Correia", hint: "Os da Gala editam-se em Gala." },
      { row: [{ k: "local", l: "Local", req: true }, { k: "cidade", l: "Cidade" }, { k: "morada", l: "Morada" }] },
      { row: [{ k: "telefone", l: "Telefone principal", req: true }, { k: "telefone2", l: "Telefone 2" }, { k: "whatsapp", l: "WhatsApp", hint: "Só números, com 244" }] },
      { row: [{ k: "email", l: "E-mail", t: "email", req: true }, { k: "site", l: "Website" }] },
      { k: "aviso", l: "Aviso no topo do site", hint: "Faixa vermelha em todas as páginas (ex.: “Últimos lugares para a Gala!”). Deixe vazio para esconder." }
    ], e);
    var c2 = card(v, "Redes sociais", "Ícones no rodapé. Deixe vazio para esconder.");
    var f2 = document.createElement("div"); c2.appendChild(f2);
    var N = D().numeros || (D().numeros = { forum: [], premios: [] });
    [["forum", "Números do Fórum", "Faixa de números na página inicial e no programa (ex.: 7 Painéis, 28 Oradores)."], ["premios", "Números dos Prémios", "Faixa de números nas secções dos prémios (ex.: 70 Figuras, 30 Instituições)."]].forEach(function (x) {
      var cn = card(v, x[1], x[2], [["Novo número", function () { en.add(); }]]);
      var en = listEditor(cn, {
        arr: function () { return N[x[0]] || (N[x[0]] = []); }, title: function (n) { return n.valor + " " + n.rotulo; },
        row: function (n) { return { thumb: '<span class="thumb" style="font-weight:700;font-size:.95rem">' + esc(n.valor) + "</span>", title: n.rotulo }; },
        fields: [{ row: [{ k: "valor", l: "Número", req: true }, { k: "rotulo", l: "Descrição", req: true }] }],
        make: function () { return { valor: "", rotulo: "" }; }, add: "Novo número"
      });
    });
    inlineForm(f2, [{ row: [{ k: "facebook", l: "Facebook (URL)" }, { k: "instagram", l: "Instagram (URL)" }] }, { row: [{ k: "linkedin", l: "LinkedIn (URL)" }, { k: "youtube", l: "YouTube (URL)" }] }, { k: "tiktok", l: "TikTok (URL)" }], e.redes);
  };

  var personOpts = function () { return [["", "— Nenhum / a anunciar —"]].concat(people().map(function (p) { return [p.id, p.nome + (p.cargo ? " · " + p.cargo : "")]; })); };
  var sessionFields = [
    { row: [{ k: "tipo", l: "Tipo", t: "select", opts: [["keynote", "Keynote Speaker"], ["guest", "Guest Speaker"], ["painel", "Painel"], ["sessao", "Sessão"], ["networking", "Networking"], ["pausa", "Pausa"], ["gala", "Gala"], ["premios", "Entrega de prémios"], ["honra", "Momento de honra"], ["musica", "Momento musical"], ["jantar", "Jantar"], ["memoria", "Homenagem póstuma"]] }, { k: "numero", l: "Nº do painel", ph: "ex.: 4" }, { k: "hora", l: "Início", ph: "09:00", hint: "Vazio = mostra a ordem" }] },
    { row: [{ k: "fim", l: "Fim", ph: "10:00" }, { k: "vagas", l: "Nº total de oradores previstos", t: "number", hint: "Os lugares sem nome aparecem como “A anunciar”" }] },
    { k: "titulo", l: "Título", req: true },
    { k: "subtitulo", l: "Subtítulo / tema do painel" },
    { k: "descricao", l: "Descrição", t: "textarea", rows: 3 },
    { k: "moderador", l: "Moderador(a)", t: "select", opts: personOpts },
    { k: "oradores", l: "Oradores (pela ordem de selecção)", t: "people" }
  ];
  R.programa = function (v) {
    var pr = D().programa || (D().programa = { forum: [], gala: [] });
    var c0 = card(v, "Aviso do programa");
    var f0 = document.createElement("div"); c0.appendChild(f0);
    inlineForm(f0, [{ k: "provisorio", l: "Mostrar a nota de programa provisório", t: "check" }, { k: "nota", l: "Texto da nota" }], pr);
    var c = card(v, "Sessões", "Arraste para ordenar. Clique numa sessão para editar moderador e oradores.", [["Nova sessão", function () { ed.add(); }]]);
    var seg = document.createElement("div"); seg.className = "toolbar";
    seg.innerHTML = '<div class="seg"><button data-k="forum">Fórum (' + (pr.forum || []).length + ')</button><button data-k="gala">Gala (' + (pr.gala || []).length + ")</button></div>";
    c.appendChild(seg);
    $$("button", seg).forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-k") === S.prog); b.addEventListener("click", function () { S.prog = b.getAttribute("data-k"); go("programa"); }); });
    var TAG = { keynote: "Keynote", guest: "Guest Speaker", painel: "Painel", sessao: "Sessão", networking: "Networking", pausa: "Pausa", gala: "Gala", premios: "Prémios", honra: "Honra", musica: "Música", jantar: "Jantar", memoria: "Memória" };
    var ed = listEditor(c, {
      arr: function () { return pr[S.prog] || (pr[S.prog] = []); },
      title: function (s) { return s.titulo; },
      row: function (s, i) {
        var mod = person(s.moderador), sp = (s.oradores || []).map(person).filter(Boolean);
        return { thumb: '<span class="thumb" style="font-size:.8rem;font-weight:700">' + esc(s.hora || (i + 1)) + "</span>", title: s.titulo,
          pills: '<span class="pill' + (s.tipo === "painel" ? " pill--dark" : "") + '">' + esc(s.tipo === "painel" && s.numero ? "Painel " + s.numero : TAG[s.tipo] || s.tipo) + "</span>" + (s.tipo === "painel" && !mod ? '<span class="pill pill--warn">sem moderador</span>' : ""),
          sub: [mod ? "Mod.: " + mod.nome : "", sp.map(function (p) { return p.nome; }).join(", ")].filter(Boolean).join(" · ") || s.subtitulo };
      },
      fields: sessionFields,
      make: function () { return { id: "s-" + stamp(), hora: "", fim: "", tipo: S.prog === "gala" ? "gala" : "painel", numero: "", titulo: "", subtitulo: "", descricao: "", moderador: "", oradores: [], vagas: 0 }; },
      add: "Nova sessão", empty: "Sem sessões neste momento do programa."
    });
  };

  var personFields = function (p) {
    return [
      { k: "foto", l: "Fotografia", t: "image", dir: "assets/img/pessoas/", name: function () { return $("#dlgBody input[placeholder='Nome como aparece no site']").value || p.nome || "pessoa"; } },
      { row: [{ k: "nome", l: "Nome", req: true, ph: "Nome como aparece no site" }, { k: "papel", l: "Papel no Fórum", t: "select", opts: [["", "— Nenhum (ex.: só distinguido) —"], ["keynote", "Keynote Speaker"], ["guest", "Guest Speaker"], ["moderador", "Moderador(a)"], ["orador", "Orador(a)"]] }] },
      { row: [{ k: "cargo", l: "Cargo" }, { k: "organizacao", l: "Organização" }, { k: "pais", l: "País" }] },
      { k: "tema", l: "Tema da intervenção", t: "textarea", rows: 2 },
      { k: "bio", l: "Biografia", t: "textarea", rows: 5 },
      { row: [{ k: "nomeCompleto", l: "Nome completo (opcional)" }, { k: "linkedin", l: "LinkedIn (URL)" }] },
      { k: "aliases", l: "Outras formas do nome", t: "lines", rows: 2, hint: "Uma por linha. Serve para ligar a fotografia ao nome escrito na lista de distinguidos (ex.: Márcio Lopes Daniel)." },
      { k: "destaque", l: "Destacar na página inicial", t: "check" }
    ];
  };
  function removePersonRefs(p) {
    var pr = D().programa || {};
    ["forum", "gala"].forEach(function (k) { (pr[k] || []).forEach(function (s) { if (s.moderador === p.id) s.moderador = ""; s.oradores = (s.oradores || []).filter(function (x) { return x !== p.id; }); }); });
  }
  function usage(p) {
    var u = [], pr = D().programa || {};
    ["forum", "gala"].forEach(function (k) { (pr[k] || []).forEach(function (s) { if (s.moderador === p.id) u.push("Modera: " + s.titulo); if ((s.oradores || []).indexOf(p.id) > -1) u.push(s.titulo); }); });
    honOf(p).forEach(function (c) { u.push("Distinguido: " + c.titulo); });
    return u;
  }
  R.pessoas = function (v) {
    var c = card(v, "Oradores, moderadores e distinguidos", "Perfis com fotografia e biografia. Uma pessoa pode ser oradora e distinguida ao mesmo tempo: a ligação aos prémios faz-se pelo nome (ou “Outras formas do nome”).", [["Adicionar pessoa", function () { ed.add(); }]]);
    var tb = document.createElement("div"); tb.className = "toolbar";
    var nomIds = {}; people().forEach(function (pp) { if (honOf(pp).length) nomIds[pp.id] = 1; });
    var F = [["todos", "Todas"], ["keynote", "Keynote"], ["guest", "Guest"], ["moderador", "Moderadores"], ["orador", "Oradores"], ["nomeado", "Distinguidos"]];
    tb.innerHTML = '<input class="inp" placeholder="Pesquisar…" value="' + esc(S.pQuery) + '"><div class="seg">' + F.map(function (x) { return '<button data-f="' + x[0] + '" class="' + (S.pFilter === x[0] ? "on" : "") + '">' + x[1] + "</button>"; }).join("") + "</div>";
    c.appendChild(tb);
    var ed = listEditor(c, {
      arr: people, dragAll: true,
      filter: function (p) {
        var okF = S.pFilter === "todos" || (S.pFilter === "nomeado" ? nomIds[p.id] : p.papel === S.pFilter);
        return okF && (!S.pQuery || (p.nome + " " + p.cargo + " " + p.organizacao).toLowerCase().indexOf(S.pQuery.toLowerCase()) > -1);
      },
      title: function (p) { return p.nome; },
      row: function (p) {
        var u = usage(p);
        return { thumb: thumbP(p), title: p.nome, pills: (p.papel ? '<span class="pill' + (p.papel === "moderador" ? " pill--dark" : "") + '">' + ROLE[p.papel] + "</span>" : "") + (nomIds[p.id] ? '<span class="pill">Distinguido</span>' : "") + (p.destaque ? '<span class="pill pill--new">Destaque</span>' : "") + (!p.foto ? '<span class="pill pill--warn">sem foto</span>' : ""),
          sub: [p.cargo, p.organizacao].filter(Boolean).join(" · ") + (u.length ? "  —  " + u.join(" · ") : "") };
      },
      fields: personFields,
      before: function (res, old) {
        if (!old) { var base = slug(res.nome), id = base, n = 2; while (person(id)) id = base + "-" + n++; res.id = id; }
        return res;
      },
      onDelete: removePersonRefs,
      make: function () { return { id: "", nome: "", cargo: "", organizacao: "", pais: "Angola", papel: "orador", foto: "", tema: "", bio: "", linkedin: "", destaque: false }; },
      add: "Adicionar pessoa", empty: "Nenhuma pessoa corresponde ao filtro."
    });
    $("input", tb).addEventListener("input", function (e) { S.pQuery = e.target.value; ed.draw(); });
    $$(".seg button", tb).forEach(function (b) { b.addEventListener("click", function () { S.pFilter = b.getAttribute("data-f"); $$(".seg button", tb).forEach(function (x) { x.classList.toggle("on", x === b); }); ed.draw(); }); });
  };

  /* ---------- awards helpers (names are plain text; photos link by name) ---------- */
  function personByName(n) {
    var k = nrm(n); if (!k) return null;
    return people().filter(function (p) { return [p.nome, p.nomeCompleto].concat(p.aliases || []).some(function (x) { return x && nrm(x) === k; }); })[0] || null;
  }
  function honOf(p) {
    var keys = [p.nome, p.nomeCompleto].concat(p.aliases || []).filter(Boolean).map(nrm);
    return ((D().premios || {}).categorias || []).filter(function (c) { return (c.distinguidos || []).some(function (n) { return keys.indexOf(nrm(n)) > -1; }); });
  }
  function honCount() { var n = 0; ((D().premios || {}).categorias || []).forEach(function (c) { n += (c.distinguidos || []).length; }); return n; }
  var TIPOS = [["personalidade", "Personalidade"], ["instituicao", "Instituição"], ["especial", "Distinção especial"], ["postumo", "Homenagem póstuma"], ["orador", "Orador do GiLF"]];
  var TIPO_L = {}; TIPOS.forEach(function (t) { TIPO_L[t[0]] = t[1]; });
  /* categories <-> plain text: "## Título | tipo" followed by one name per line */
  function catsToText(cats) {
    return (cats || []).map(function (c) { return "## " + c.titulo + (c.tipo && c.tipo !== "personalidade" ? " | " + c.tipo : "") + "\n" + (c.distinguidos || []).join("\n"); }).join("\n\n");
  }
  function textToCats(t) {
    var out = [], cur = null;
    String(t || "").split("\n").forEach(function (l) {
      l = l.trim(); if (!l) return;
      if (l.indexOf("##") === 0) { var m = l.replace(/^#+\s*/, "").split("|"); cur = { titulo: m[0].trim(), tipo: (m[1] || "personalidade").trim(), distinguidos: [] }; out.push(cur); }
      else { if (!cur) { cur = { titulo: "Distinguidos", tipo: "personalidade", distinguidos: [] }; out.push(cur); } cur.distinguidos.push(l.replace(/^[-•*]\s*/, "")); }
    });
    return out;
  }
  function snapshotEdition() {
    var d = D(), cur = d.edicaoActual || {}, e = d.evento || {}, P = d.premios || {};
    return { id: "ed-" + (cur.ano || stamp()), ano: cur.ano || "", titulo: cur.titulo || "", tema: cur.tema || e.tema || "", data: e.dataTexto || "", local: [e.local, String(e.cidade || "").split(",")[0]].filter(Boolean).join(", "),
      resumo: P.nota || "", imagem: "",
      categorias: (P.categorias || []).filter(function (c) { return (c.distinguidos || []).length; }).map(function (c) { return { titulo: (c.tipo === "orador" ? "Oradores · " : "") + c.titulo, tipo: c.tipo || "personalidade", distinguidos: (c.distinguidos || []).slice() }; }),
      oradores: people().filter(function (p) { return p.papel; }).map(function (p) { return p.nome; }) };
  }

  R.premios = function (v) {
    var P = D().premios || (D().premios = { actos: [], categorias: [] });
    P.actos = P.actos || []; P.categorias = P.categorias || [];
    var tot = {}; P.categorias.forEach(function (c) { tot[c.tipo] = (tot[c.tipo] || 0) + (c.distinguidos || []).length; });
    v.insertAdjacentHTML("beforeend", '<div class="kpis">' + TIPOS.map(function (t) { return '<div class="kpi"><b>' + (tot[t[0]] || 0) + "</b><span>" + t[1] + (t[0] === "instituicao" ? "s" : t[0] === "personalidade" ? "s" : "") + "</span></div>"; }).join("") + "</div>" +
      '<div class="banner banner--info">Os números grandes que aparecem no site (ex.: “70 Personalidades”) editam-se em <a data-go="evento">Evento → Números dos Prémios</a>. Aqui contam-se os nomes efectivamente inseridos.</div>');
    var c0 = card(v, "Texto de apresentação");
    var f0 = document.createElement("div"); c0.appendChild(f0);
    inlineForm(f0, [{ k: "nota", l: "Nota sobre a escolha dos distinguidos", t: "textarea", rows: 2 }], P);

    var ca = card(v, "Actos da Gala", "Cada categoria pertence a um acto. A ordem aqui é a ordem no site.", [["Novo acto", function () { ea.add(); }]]);
    var ea = listEditor(ca, {
      arr: function () { return P.actos; }, title: function (a) { return a.titulo; },
      row: function (a) { var n = P.categorias.filter(function (c) { return c.acto === a.id; }).length; return { thumb: '<span class="thumb" style="font-size:.72rem;font-weight:700">' + esc(a.hora || "—") + "</span>", title: a.titulo, sub: (a.tema || "") + " · " + n + " categoria(s)" }; },
      fields: [{ row: [{ k: "titulo", l: "Nome do acto", req: true, ph: "I Acto" }, { k: "hora", l: "Hora", ph: "19:55" }] }, { k: "tema", l: "Tema / subtítulo", ph: "Distinções Especiais, Estado e Instituições Públicas" }],
      before: function (r, old) { if (!old) r.id = "acto-" + slug(r.titulo) + "-" + stamp(); return r; },
      onDelete: function (a) { P.categorias.forEach(function (c) { if (c.acto === a.id) c.acto = ""; }); },
      make: function () { return { id: "", titulo: "", hora: "", tema: "" }; }, add: "Novo acto"
    });

    var c = card(v, "Categorias e distinguidos", "Escreva um nome por linha. Se o nome coincidir com uma pessoa em “Oradores & Pessoas”, a fotografia e o perfil aparecem automaticamente.", [["Nova categoria", function () { ed.add(); }]]);
    var tb = document.createElement("div"); tb.className = "toolbar";
    S.aFilter = S.aFilter || "todos";
    tb.innerHTML = '<input class="inp" placeholder="Pesquisar nome ou categoria…"><div class="seg"><button data-f="todos">Todos</button>' + P.actos.map(function (a) { return '<button data-f="' + esc(a.id) + '">' + esc(a.titulo) + "</button>"; }).join("") + '<button data-f="">Sem acto</button></div>';
    c.appendChild(tb);
    var q = "";
    var ed = listEditor(c, {
      arr: function () { return P.categorias; }, dragAll: true,
      filter: function (x) {
        var okA = S.aFilter === "todos" || (x.acto || "") === S.aFilter;
        return okA && (!q || nrm(x.titulo + " " + (x.distinguidos || []).join(" ")).indexOf(nrm(q)) > -1);
      },
      title: function (x) { return x.titulo; },
      row: function (x) {
        var ns = x.distinguidos || [], withP = ns.map(personByName).filter(Boolean), a = P.actos.filter(function (y) { return y.id === x.acto; })[0];
        return { thumb: withP[0] ? thumbP(withP[0]) : '<span class="thumb">★</span>', title: x.titulo,
          pills: '<span class="pill pill--dark">' + esc(a ? a.titulo : "sem acto") + '</span><span class="pill">' + esc(TIPO_L[x.tipo] || "Personalidade") + '</span><span class="pill' + (x.vagas > ns.length ? " pill--warn" : "") + '">' + ns.length + (x.vagas ? " / " + x.vagas : "") + "</span>" + (withP.length ? '<span class="pill pill--new">' + withP.length + " com perfil</span>" : ""),
          sub: ns.join(", ") };
      },
      fields: function () {
        return [{ k: "titulo", l: "Nome da categoria", req: true, ph: "Líderes Empresários" },
          { row: [{ k: "acto", l: "Acto da Gala", t: "select", opts: function () { return [["", "— Sem acto (não aparece) —"]].concat(P.actos.map(function (a) { return [a.id, a.titulo + (a.tema ? " · " + a.tema : "")]; })); } },
            { k: "tipo", l: "Tipo", t: "select", opts: TIPOS }, { k: "vagas", l: "Total previsto", t: "number", hint: "Opcional. Os lugares em falta aparecem como “por indicar”." }] },
          { k: "distinguidos", l: "Distinguidos (um por linha)", t: "lines", rows: 9, ph: "Nome da personalidade ou instituição" }];
      },
      before: function (r, old) { if (!old) r.id = "cat-" + slug(r.titulo) + "-" + stamp(); return r; },
      make: function () { return { id: "", acto: S.aFilter !== "todos" ? S.aFilter : ((P.actos[0] || {}).id || ""), tipo: "personalidade", titulo: "", distinguidos: [], vagas: 0 }; },
      add: "Nova categoria", empty: "Nenhuma categoria corresponde ao filtro."
    });
    $$(".seg button", tb).forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-f") === S.aFilter); b.addEventListener("click", function () { S.aFilter = b.getAttribute("data-f"); $$(".seg button", tb).forEach(function (x) { x.classList.toggle("on", x === b); }); ed.draw(); }); });
    $("input", tb).addEventListener("input", function (e) { q = e.target.value; ed.draw(); });
  };

  R.gala = function (v) {
    var GA = D().gala || (D().gala = {});
    var c = card(v, "Gala de Premiação", "Página Gala & Prémios. O programa hora-a-hora da Gala edita-se em Programa → Gala.");
    var f = document.createElement("div"); c.appendChild(f);
    inlineForm(f, [{ k: "titulo", l: "Título da noite", ph: "Uma noite entre Líderes." },
      { k: "apresentadores", l: "Mestres de cerimónia da Gala (um por linha)", t: "lines", rows: 2, hint: "Se só houver um nome, o site mostra “co-mestre de cerimónia a anunciar”." },
      { k: "musica", l: "Música ao vivo", t: "textarea", rows: 2 }], GA, function () { if ((GA.apresentadores || []).length < 2) GA.apresentadores = (GA.apresentadores || []).concat([""]); });
    var c2 = card(v, "Comissão Organizadora", "", [["Novo membro", function () { e2.add(); }]]);
    var e2 = listEditor(c2, {
      arr: function () { return GA.comissao || (GA.comissao = []); }, title: function (x) { return x.nome; },
      row: function (x) { return { thumb: '<span class="thumb">' + esc(initials(x.nome)) + "</span>", title: x.nome, sub: x.organizacao }; },
      fields: [{ row: [{ k: "nome", l: "Nome", req: true }, { k: "organizacao", l: "Organização" }] }], make: function () { return { nome: "", organizacao: "" }; }, add: "Novo membro"
    });
    var c3 = card(v, "Programa da Gala");
    c3.insertAdjacentHTML("beforeend", '<p class="small muted">' + ((D().programa || {}).gala || []).length + ' momentos no programa. <a data-go="programa" onclick="return true">Editar em Programa → Gala →</a></p>');
    $("a", c3).addEventListener("click", function () { S.prog = "gala"; });
  };

  R.edicoes = function (v) {
    var d = D(), cur = d.edicaoActual || (d.edicaoActual = {});
    var c0 = card(v, "Edição actual", "Identifica a edição em curso na página “Líderes de todas as edições”. Os distinguidos vêm de Prémios & Distinguidos.");
    var f0 = document.createElement("div"); c0.appendChild(f0);
    inlineForm(f0, [{ row: [{ k: "ano", l: "Ano", req: true, ph: "2026" }, { k: "titulo", l: "Edição", ph: "3.ª edição" }] }, { k: "tema", l: "Tema / lema desta edição" }], cur);
    var cA = card(v, "Preparar a próxima edição", "Quando a Gala terminar: (1) arquive a edição actual — fica guardada para sempre em “Líderes”; (2) prepare a nova edição. Pode rever tudo antes de publicar.");
    cA.insertAdjacentHTML("beforeend", '<div class="toolbar" style="margin:0"><button class="btn btn--dark" id="arch">' + ic("edicoes") + "Arquivar edição " + esc(cur.ano || "actual") + '</button><button class="btn" id="nextEd">' + ic("plus") + "Começar nova edição</button></div>");
    $("#arch", cA).addEventListener("click", function () {
      var snap = snapshotEdition(), list = d.edicoes || (d.edicoes = []);
      var i = list.map(function (e) { return String(e.ano); }).indexOf(String(snap.ano));
      if (i > -1 && !confirm("Já existe um arquivo de " + snap.ano + ". Substituir pela versão actual?")) return;
      if (i > -1) { snap.imagem = list[i].imagem || ""; list[i] = snap; } else list.push(snap);
      changed(); toast("Edição " + snap.ano + " arquivada com " + snap.categorias.length + " categorias.");
    });
    $("#nextEd", cA).addEventListener("click", function () {
      var archived = (d.edicoes || []).some(function (e) { return String(e.ano) === String(cur.ano); });
      if (!archived && !confirm("A edição " + (cur.ano || "actual") + " ainda não foi arquivada. Arquivar automaticamente antes de começar a nova?")) return;
      if (!archived) { (d.edicoes || (d.edicoes = [])).push(snapshotEdition()); }
      var ano = prompt("Ano da nova edição:", String((+cur.ano || new Date().getFullYear()) + 1)); if (!ano) return;
      var n = parseInt(String(cur.titulo || "").replace(/\D/g, ""), 10);
      cur.ano = ano; cur.titulo = n ? (n + 1) + ".ª edição" : cur.titulo;
      if (confirm("Limpar os nomes dos distinguidos (mantendo actos e categorias) para a nova edição?")) ((d.premios || {}).categorias || []).forEach(function (c) { c.distinguidos = []; });
      changed(); toast("Nova edição " + ano + " preparada. Actualize datas em Evento, o Programa e os Números antes de publicar.");
    });
    var c = card(v, "Arquivo de edições anteriores", "Aparecem na página “Líderes de todas as edições”. Pode acrescentar edições antigas manualmente.", [["Adicionar edição", function () { ed.add(); }]]);
    var ed = listEditor(c, {
      arr: function () { return d.edicoes || (d.edicoes = []); }, title: function (e) { return "Edição " + e.ano; },
      row: function (e) { var n = 0; (e.categorias || []).forEach(function (x) { n += (x.distinguidos || []).length; }); return { thumb: '<span class="thumb" style="font-size:.78rem;font-weight:700">' + esc(e.ano) + "</span>", title: (e.titulo ? e.titulo + " · " : "") + (e.tema || ""), pills: '<span class="pill">' + n + ' distinguidos</span><span class="pill">' + (e.oradores || []).length + " oradores</span>" + (!n ? '<span class="pill pill--warn">sem lista</span>' : ""), sub: [e.data, e.local].filter(Boolean).join(" · ") }; },
      fields: [{ row: [{ k: "ano", l: "Ano", req: true }, { k: "titulo", l: "Edição", ph: "2.ª edição" }, { k: "data", l: "Data", ph: "18 de Dezembro de 2025" }] },
        { row: [{ k: "tema", l: "Tema" }, { k: "local", l: "Local" }] },
        { k: "resumo", l: "Resumo", t: "textarea", rows: 2 },
        { k: "imagem", l: "Imagem (cartaz ou fotografia)", t: "image", mode: "wide", dir: "assets/img/edicoes/", name: function () { return "edicao"; } },
        { k: "_cats", l: "Distinguidos por categoria", t: "textarea", rows: 12, hint: "Formato: uma linha “## Nome da categoria” e, por baixo, um nome por linha. Para instituições escreva “## Nome | instituicao”.", ph: "## Líderes Empresários\nNome 1\nNome 2\n\n## Empresa do Ano | instituicao\nEmpresa X" },
        { k: "oradores", l: "Oradores do GiLF nesta edição (um por linha)", t: "lines", rows: 4 }],
      before: function (r) { r.categorias = textToCats(r._cats); delete r._cats; if (!r.id) r.id = "ed-" + slug(r.ano); return r; },
      make: function () { return { id: "", ano: "", titulo: "", tema: "", data: "", local: "Hotel EPIC SANA, Luanda", resumo: "", imagem: "", categorias: [], oradores: [], _cats: "" }; },
      add: "Adicionar edição", empty: "Ainda não há edições arquivadas."
    });
    /* expose categories as text in the edit dialog */
    (d.edicoes || []).forEach(function (e) { Object.defineProperty(e, "_cats", { get: function () { return catsToText(e.categorias); }, enumerable: false, configurable: true }); });
  };

  R.noticias = function (v) {
    var c = card(v, "Notícias e actualizações", "Aparecem na página Notícias e as três mais recentes na página inicial. Use-as para anunciar oradores, distinguidos, novidades e próximas edições.", [["Nova notícia", function () { ed.add(); }]]);
    var ed = listEditor(c, {
      arr: function () { return D().noticias || (D().noticias = []); }, title: function (n) { return n.titulo; },
      row: function (n) { return { thumb: n.imagem ? '<span class="thumb"><img src="' + esc(img(n.imagem)) + '" alt=""></span>' : '<span class="thumb">N</span>', title: n.titulo, pills: (n.destaque ? '<span class="pill pill--new">Destaque</span>' : ""), sub: (n.data || "sem data") + " · " + (n.resumo || "") }; },
      fields: [{ row: [{ k: "titulo", l: "Título", req: true }, { k: "data", l: "Data", t: "date", req: true }] },
        { k: "resumo", l: "Resumo (aparece no cartão)", t: "textarea", rows: 2 },
        { k: "texto", l: "Texto completo", t: "textarea", rows: 8 },
        { k: "imagem", l: "Imagem", t: "image", mode: "wide", dir: "assets/img/noticias/", name: function () { return $("#dlgBody input").value || "noticia"; } },
        { row: [{ k: "link", l: "Ligação “Saber mais” (opcional)", ph: "premios.html" }] },
        { k: "destaque", l: "Destacar", t: "check" }],
      before: function (r, old) { if (!old) r.id = slug(r.titulo) + "-" + stamp(); return r; },
      make: function () { return { id: "", data: new Date().toISOString().slice(0, 10), titulo: "", resumo: "", texto: "", imagem: "", link: "", destaque: false }; },
      add: "Nova notícia", empty: "Ainda não há notícias."
    });
  };

  R.clube = function (v) {
    var C = D().clube || (D().clube = {});
    var id = String(C.formUrl || "").replace(/\D+$/, "").split("/").pop();
    v.insertAdjacentHTML("beforeend", '<div class="banner banner--info"><b>Candidaturas:</b> chegam ao formulário Jotform e não ficam guardadas no site (os dados pessoais não ficam públicos). ' +
      (id ? 'Consulte-as em <a href="https://www.jotform.com/tables/' + esc(id) + '" target="_blank" rel="noopener">Jotform → Tabelas</a>.' : "") + " Depois de aprovar alguém, acrescente-o em “Membros”.</div>");
    var c = card(v, "Página do Clube de Líderes");
    var f = document.createElement("div"); c.appendChild(f);
    inlineForm(f, [{ k: "titulo", l: "Título", req: true }, { k: "texto", l: "Apresentação", t: "textarea", rows: 3 },
      { k: "beneficios", l: "Benefícios (um por linha)", t: "lines", rows: 4 },
      { k: "formUrl", l: "Endereço do formulário de inscrição", hint: "Ex.: https://form.jotform.com/… — aparece incorporado na página. Vazio = “inscrições brevemente”." }], C);
    var c2 = card(v, "Membros", "Só aparecem no site os membros aqui listados (com o consentimento deles).", [["Novo membro", function () { e2.add(); }]]);
    var e2 = listEditor(c2, {
      arr: function () { return C.membros || (C.membros = []); }, title: function (m) { return m.nome; },
      row: function (m) { return { thumb: thumbP(m), title: m.nome, sub: [m.cargo, m.organizacao, m.desde ? "desde " + m.desde : ""].filter(Boolean).join(" · ") }; },
      fields: [{ k: "foto", l: "Fotografia", t: "image", dir: "assets/img/clube/", name: function () { return $("#dlgBody input[placeholder='Nome']").value || "membro"; } },
        { row: [{ k: "nome", l: "Nome", req: true, ph: "Nome" }, { k: "desde", l: "Membro desde", ph: "2026" }] }, { row: [{ k: "cargo", l: "Cargo" }, { k: "organizacao", l: "Organização" }] }],
      make: function () { return { nome: "", cargo: "", organizacao: "", foto: "", desde: String(new Date().getFullYear()) }; }, add: "Novo membro"
    });
  };

  R.parceiros = function (v) {
    var G = D().parceiros || (D().parceiros = []);
    cardHead(v, "Parceiros e patrocinadores", "Organize por grupos. Arraste para ordenar os logótipos dentro de cada grupo.", [["Novo grupo", function () {
      openForm("Novo grupo", [{ k: "grupo", l: "Nome do grupo", req: true, ph: "Patrocinadores Ouro" }], { grupo: "", itens: [] }, { ok: "Criar" }).then(function (r) { if (r) { G.push(r); changed(); } });
    }]]);
    G.forEach(function (g, gi) {
      var c = card(v);
      var h = document.createElement("div"); h.className = "card__h";
      h.innerHTML = "<div><h2>" + esc(g.grupo) + '</h2><p>' + (g.itens || []).length + ' logótipo(s)</p></div><div class="toolbar" style="margin:0"><button class="btn btn--sm" data-a="up">' + ic("up") + '</button><button class="btn btn--sm" data-a="down">' + ic("down") + '</button><button class="btn btn--sm" data-a="ren">Renomear</button><button class="btn btn--sm btn--danger" data-a="del">Remover grupo</button><button class="btn btn--sm btn--dark" data-a="add">' + ic("plus") + "Adicionar logótipo</button></div>";
      c.appendChild(h);
      var ed = listEditor(c, {
        arr: function () { return g.itens || (g.itens = []); },
        title: function (x) { return x.nome; },
        row: function (x) { return { thumb: '<span class="thumb thumb--logo">' + (x.logo ? '<img src="' + esc(img(x.logo)) + '" alt="">' : "—") + "</span>", title: x.nome, sub: x.url || "", pills: x.logo ? "" : '<span class="pill pill--warn">sem logótipo</span>' }; },
        fields: [{ k: "logo", l: "Logótipo", t: "logo", dir: "assets/img/logos/", req: true, name: function () { return $("#dlgBody input[placeholder='Nome da empresa']").value || "logo"; } }, { k: "nome", l: "Nome", req: true, ph: "Nome da empresa" }, { k: "url", l: "Website (opcional)", t: "url", ph: "https://" }],
        make: function () { return { nome: "", logo: "", url: "" }; }, add: "Adicionar logótipo", empty: "Sem logótipos neste grupo."
      });
      h.addEventListener("click", function (e) {
        var b = e.target.closest("[data-a]"); if (!b) return; var a = b.getAttribute("data-a");
        if (a === "add") ed.add();
        if (a === "up" && gi > 0) { G.splice(gi - 1, 0, G.splice(gi, 1)[0]); changed(); }
        if (a === "down" && gi < G.length - 1) { G.splice(gi + 1, 0, G.splice(gi, 1)[0]); changed(); }
        if (a === "del" && confirm("Remover o grupo “" + g.grupo + "” e todos os seus logótipos?")) { G.splice(gi, 1); changed(); }
        if (a === "ren") openForm("Renomear grupo", [{ k: "grupo", l: "Nome", req: true }], g).then(function (r) { if (r) { g.grupo = r.grupo; changed(); } });
      });
    });
  };

  R.bilhetes = function (v) {
    var T = D().ingressos || (D().ingressos = { tipos: [] });
    var c0 = card(v, "Página de bilhetes");
    var f0 = document.createElement("div"); c0.appendChild(f0);
    inlineForm(f0, [{ k: "texto", l: "Texto de introdução", t: "textarea", rows: 2 }], T);
    var c = card(v, "Tipos de bilhete", "Deixe o preço vazio para mostrar “Preço sob consulta”.", [["Novo bilhete", function () { ed.add(); }]]);
    var ed = listEditor(c, {
      arr: function () { return T.tipos || (T.tipos = []); }, title: function (x) { return x.nome; },
      row: function (x) { return { thumb: '<span class="thumb">🎟</span>', title: x.nome, pills: x.destaque ? '<span class="pill pill--new">Recomendado</span>' : "", sub: [x.subtitulo, x.preco || "Sob consulta"].join(" · ") }; },
      fields: [{ row: [{ k: "nome", l: "Nome", req: true }, { k: "subtitulo", l: "Subtítulo / horário" }, { k: "preco", l: "Preço", ph: "ex.: 150.000 Kz" }] }, { k: "itens", l: "O que inclui (um item por linha)", t: "lines" }, { k: "destaque", l: "Destacar como recomendado", t: "check" }],
      make: function () { return { nome: "", subtitulo: "", preco: "", itens: [], destaque: false }; }, add: "Novo bilhete"
    });
  };

  R.patrocinio = function (v) {
    var P = D().patrocinio || (D().patrocinio = { pacotes: [], vantagens: [] });
    var c0 = card(v, "Página de patrocínio");
    var f0 = document.createElement("div"); c0.appendChild(f0);
    inlineForm(f0, [{ k: "texto", l: "Texto de introdução", t: "textarea", rows: 3 }, { k: "mostrarPrecos", l: "Mostrar os valores dos pacotes no site (se desactivado, mostra “Sob consulta”)", t: "check" }], P);
    var c1 = card(v, "Pacotes", "", [["Novo pacote", function () { e1.add(); }]]);
    var e1 = listEditor(c1, {
      arr: function () { return P.pacotes || (P.pacotes = []); }, title: function (x) { return x.nome; },
      row: function (x) { return { thumb: '<span class="thumb">◆</span>', title: x.nome, sub: [x.preco, x.vip, x.espaco, x.destaque].filter(Boolean).join(" · ") }; },
      fields: [{ row: [{ k: "nome", l: "Nome", req: true }, { k: "preco", l: "Investimento" }] }, { row: [{ k: "vip", l: "Convites VIP" }, { k: "espaco", l: "Espaço expositivo" }] }, { k: "destaque", l: "Destaque principal" }],
      make: function () { return { nome: "", preco: "", vip: "", espaco: "", destaque: "" }; }, add: "Novo pacote"
    });
    var c2 = card(v, "Vantagens", "", [["Nova vantagem", function () { e2.add(); }]]);
    var e2 = listEditor(c2, {
      arr: function () { return P.vantagens || (P.vantagens = []); }, title: function (x) { return x.titulo; },
      row: function (x) { return { thumb: '<span class="thumb">✦</span>', title: x.titulo, sub: x.texto }; },
      fields: [{ k: "titulo", l: "Título", req: true }, { k: "texto", l: "Texto", t: "textarea", rows: 3 }],
      make: function () { return { titulo: "", texto: "" }; }, add: "Nova vantagem"
    });
  };

  R.organizacao = function (v) {
    var O = D().organizacao || (D().organizacao = {});
    var c = card(v, "Fundador / coordenação", "Página “Sobre” e secção da página inicial.");
    var f = document.createElement("div"); c.appendChild(f);
    inlineForm(f, [{ k: "foto", l: "Fotografia", t: "image", dir: "assets/img/pessoas/", name: function () { return O.nome || "organizacao"; } },
      { row: [{ k: "nome", l: "Nome", req: true }, { k: "nomeCompleto", l: "Nome completo" }] }, { k: "cargo", l: "Cargo" }, { k: "bio", l: "Apresentação", t: "textarea", rows: 4 }], O);
    var c1 = card(v, "Percurso", "", [["Novo marco", function () { e1.add(); }]]);
    var e1 = listEditor(c1, {
      arr: function () { return O.percurso || (O.percurso = []); }, title: function (x) { return x.ano; },
      row: function (x) { return { thumb: '<span class="thumb" style="font-size:.7rem;font-weight:700">' + esc(x.ano) + "</span>", title: x.ano, sub: x.texto }; },
      fields: [{ k: "ano", l: "Ano / data", req: true }, { k: "texto", l: "Texto", t: "textarea", rows: 2 }], make: function () { return { ano: "", texto: "" }; }, add: "Novo marco"
    });
    var c2 = card(v, "Projectos e iniciativas", "Aparecem na página Sobre.", [["Novo projecto", function () { e2.add(); }]]);
    var e2 = listEditor(c2, {
      arr: function () { return O.iniciativas || (O.iniciativas = []); }, title: function (x) { return x.titulo; },
      row: function (x) { return { thumb: '<span class="thumb">✦</span>', title: x.titulo, sub: x.texto }; },
      fields: [{ k: "titulo", l: "Título", req: true }, { k: "texto", l: "Texto", t: "textarea", rows: 2 }], make: function () { return { titulo: "", texto: "" }; }, add: "Nova iniciativa"
    });
  };

  R.faq = function (v) {
    var c = card(v, "Perguntas frequentes", "Aparecem na página de Contacto.", [["Nova pergunta", function () { ed.add(); }]]);
    var ed = listEditor(c, {
      arr: function () { return D().faq || (D().faq = []); }, title: function (x) { return x.p; },
      row: function (x) { return { thumb: '<span class="thumb">?</span>', title: x.p, sub: x.r }; },
      fields: [{ k: "p", l: "Pergunta", req: true }, { k: "r", l: "Resposta", t: "textarea", rows: 4, req: true }], make: function () { return { p: "", r: "" }; }, add: "Nova pergunta"
    });
  };

  R.historico = function (v) {
    var c = card(v, "Histórico de publicações", "Cada publicação desta edição fica guardada. Pode abrir uma versão anterior, revê-la e publicá-la de novo para a restaurar.");
    c.insertAdjacentHTML("beforeend", '<div id="hist"><div class="empty">A carregar…</div></div>');
    api("forum_versoes", { p_slug: S.edicao }).then(function (list) {
      $("#hist").innerHTML = (list || []).map(function (x, i) {
        return '<div class="commit"><div><b>' + esc(x.nota || "Publicação") + (i === 0 ? '<span class="pill pill--new">actual</span>' : "") + "</b><small>" + esc(new Date(x.criado_em).toLocaleString("pt-PT")) + " · " + esc(x.autor || "") + "</small></div>" +
          (i === 0 ? "" : '<button class="btn btn--sm" data-ver="' + x.id + '">Abrir esta versão</button>') + "</div>";
      }).join("") || '<div class="empty">Ainda sem publicações nesta edição.</div>';
    }).catch(function (e) { $("#hist").innerHTML = '<div class="empty">Erro: ' + esc(why(e)) + "</div>"; });
    c.addEventListener("click", function (e) {
      var b = e.target.closest("[data-ver]"); if (!b) return;
      if (isDirty() && !confirm("Isto substitui as alterações por publicar. Continuar?")) return;
      busy("A abrir versão…");
      api("forum_versao", { p_id: +b.getAttribute("data-ver") }).then(function (d) { busy(); S.data = d; save(); toast("Versão aberta. Reveja e clique em Publicar para a restaurar."); go("painel"); })
        .catch(function (err) { busy(); toast(why(err), true); });
    });
  };

  R.definicoes = function (v) {
    var ed = S.edicoes.filter(function (e) { return e.slug === S.edicao; })[0] || {};
    var c = card(v, "Esta edição");
    c.insertAdjacentHTML("beforeend", '<p>Edição: <b>' + esc(ed.nome || S.edicao) + "</b>" + (ed.actual ? ' <span class="pill pill--new">no site</span>' : "") + "<br>Última publicação: <b>" + esc(S.publicadoEm ? new Date(S.publicadoEm).toLocaleString("pt-PT") : "—") + "</b>" + (ed.publicado_por ? " por " + esc(ed.publicado_por) : "") +
      '</p><p class="small muted">Os conteúdos ficam guardados na base de dados. Ao publicar, o site actualiza em menos de um minuto. Os rascunhos são guardados automaticamente na nuvem enquanto edita.</p>');
    var c2 = card(v, "Cópias de segurança", "Descarregue uma cópia completa desta edição sempre que quiser. Pode importá-la mais tarde, por exemplo para começar uma edição nova.");
    c2.insertAdjacentHTML("beforeend", '<div class="toolbar"><button class="btn" id="dlJson">Descarregar cópia (JSON)</button><button class="btn" id="dlJs">Descarregar dados.js</button><label class="btn" style="cursor:pointer">Importar cópia (JSON)<input type="file" accept="application/json,.json,.js" hidden id="upJson"></label><button class="btn" id="reset">Descartar alterações por publicar</button></div>');
    $("#dlJson").addEventListener("click", function () { download(S.edicao + "-" + new Date().toISOString().slice(0, 10) + ".json", "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(S.data, null, 2))); });
    $("#dlJs").addEventListener("click", exportJs);
    $("#upJson").addEventListener("change", function (e) {
      var f = e.target.files[0]; if (!f) return;
      f.text().then(function (t) { var d = /window\.GILF/.test(t) ? parseDados(t) : JSON.parse(t); if (!d.evento) throw new Error("Ficheiro sem a estrutura esperada."); S.data = d; save(); toast("Cópia importada. Reveja e publique."); go("painel"); })
        .catch(function (err) { toast("Importação falhou: " + err.message, true); });
    });
    $("#reset").addEventListener("click", function () {
      if (!confirm("Descartar todas as alterações por publicar desta edição?")) return;
      S.data = JSON.parse(S.base || "{}"); save(); api("forum_descartar_rascunho", { p_slug: S.edicao }).catch(function () {}); toast("Alterações descartadas."); go("painel");
    });
  };

  /* ---------- reservas & mensagens ---------- */
  var ESTADOS = [["novo", "Novo"], ["contactado", "Contactado"], ["confirmado", "Confirmado"], ["pago", "Pago"], ["cancelado", "Cancelado"]];
  var REG = { lista: null, q: "", e: "", f: "" };
  var tipoReg = function (f) { return /bilhete/i.test(f) ? "Bilhete" : /patroc/i.test(f) ? "Patrocínio" : /orador/i.test(f) ? "Oradores" : "Contacto"; };
  var waLink = function (t) { return "https://wa.me/" + String(t || "").replace(/\D/g, ""); };
  R.registos = function (v) {
    if (!REG.lista) { v.innerHTML = '<div class="empty">A carregar…</div>'; api("forum_admin_lista").then(function (l) { REG.lista = l || []; if (S.view === "registos") go("registos"); }).catch(function (e) { v.innerHTML = '<div class="empty">' + esc(why(e)) + "</div>"; }); return; }
    var L = REG.lista, f = REG.q.toLowerCase();
    var V = L.filter(function (x) { return (!REG.e || x.estado === REG.e) && (!REG.f || tipoReg(x.formulario) === REG.f) && (!f || (x.codigo + " " + x.nome + " " + x.email + " " + x.telefone + " " + x.empresa).toLowerCase().indexOf(f) >= 0); });
    var bil = L.filter(function (x) { return tipoReg(x.formulario) === "Bilhete" && x.estado !== "cancelado"; });
    v.insertAdjacentHTML("beforeend", '<div class="kpis">' + [[L.length, "pedidos no total"], [L.filter(function (x) { return x.estado === "novo"; }).length, "novos por tratar"], [bil.length, "reservas de bilhete"], [bil.reduce(function (s, x) { return s + (x.quantidade || 1); }, 0), "lugares reservados"], [bil.filter(function (x) { return x.estado === "pago"; }).length, "reservas pagas"]]
      .map(function (k, i) { return '<div class="kpi' + (i === 1 ? " kpi--hero" : "") + '"><b>' + k[0] + "</b><span>" + k[1] + "</span></div>"; }).join("") + "</div>");
    var c = card(v, "Pedidos recebidos pelo site", "Reservas de bilhete, contactos, patrocínio e pedidos sobre oradores. Cada pedido tem um código (GILF-B… bilhetes, GILF-M… mensagens).");
    c.insertAdjacentHTML("beforeend", '<div class="toolbar"><input id="rq" type="search" placeholder="Procurar código, nome, email, telefone" value="' + esc(REG.q) + '" style="flex:1 1 220px"><select id="re"><option value="">Todos os estados</option>' + ESTADOS.map(function (k) { return '<option value="' + k[0] + '"' + (REG.e === k[0] ? " selected" : "") + ">" + k[1] + "</option>"; }).join("") + '</select><select id="rf"><option value="">Todos os tipos</option>' + ["Bilhete", "Contacto", "Patrocínio", "Oradores"].map(function (k) { return "<option" + (REG.f === k ? " selected" : "") + ">" + k + "</option>"; }).join("") + '</select><button class="btn" id="rcsv">Exportar Excel (CSV)</button><button class="btn" id="rref">Actualizar</button></div>' +
      (V.length ? '<div class="rows">' + V.map(function (x) {
        return '<div class="row" style="cursor:pointer" data-reg="' + x.id + '"><span class="thumb" style="font-size:11px">' + esc(tipoReg(x.formulario).slice(0, 3)) + '</span><div class="row__b"><b>' + esc(x.codigo) + " · " + esc(x.nome) + "</b><small>" + esc([new Date(x.criado_em).toLocaleString("pt-PT"), x.ingresso ? x.ingresso + (x.quantidade ? " × " + x.quantidade : "") : "", x.telefone, x.email].filter(Boolean).join(" · ")) + '</small></div><span class="pill' + (x.estado === "novo" ? " pill--new" : "") + '">' + esc((ESTADOS.filter(function (k) { return k[0] === x.estado; })[0] || [0, x.estado])[1]) + "</span></div>";
      }).join("") + "</div>" : '<div class="empty">' + (L.length ? "Nenhum pedido com estes filtros." : "Ainda não há pedidos. Aparecem aqui assim que alguém preencher um formulário do site.") + "</div>"));
    $("#rq").addEventListener("change", function () { REG.q = this.value; go("registos"); });
    $("#re").addEventListener("change", function () { REG.e = this.value; go("registos"); });
    $("#rf").addEventListener("change", function () { REG.f = this.value; go("registos"); });
    $("#rref").addEventListener("click", function () { REG.lista = null; go("registos"); });
    $("#rcsv").addEventListener("click", function () {
      var linhas = [["Código", "Data", "Tipo", "Nome", "Empresa", "Email", "Telefone", "Ingresso", "Quantidade", "Estado", "Nota"]].concat(V.map(function (x) { return [x.codigo, new Date(x.criado_em).toLocaleString("pt-PT"), tipoReg(x.formulario), x.nome, x.empresa, x.email, x.telefone, x.ingresso, x.quantidade || "", x.estado, x.nota]; }));
      var t = linhas.map(function (l) { return l.map(function (cc) { cc = String(cc == null ? "" : cc); return /[",;\n]/.test(cc) ? '"' + cc.replace(/"/g, '""') + '"' : cc; }).join(";"); }).join("\r\n");
      download("gilf-pedidos-" + new Date().toISOString().slice(0, 10) + ".csv", URL.createObjectURL(new Blob(["﻿" + t], { type: "text/csv;charset=utf-8" })));
    });
    c.addEventListener("click", function (e) {
      var r = e.target.closest("[data-reg]"); if (!r) return;
      var x = L.filter(function (y) { return y.id === r.getAttribute("data-reg"); })[0]; if (!x) return;
      var extra = Object.keys(x.dados || {}).filter(function (k) { return ["nome", "email", "telefone", "empresa", "ingresso", "quantidade"].indexOf(k) < 0; }).map(function (k) { return k + ": " + x.dados[k]; }).join("\n");
      openForm(x.codigo + " · " + x.nome, [
        { html: '<p class="small muted" style="margin:0 0 10px">' + esc(x.formulario) + " · " + esc(new Date(x.criado_em).toLocaleString("pt-PT")) + "</p><p>" + esc([x.empresa, x.email, x.telefone].filter(Boolean).join(" · ")) + "</p>" + (x.ingresso ? "<p>Ingresso: <b>" + esc(x.ingresso) + "</b>" + (x.quantidade ? " × " + x.quantidade : "") + "</p>" : "") + (extra ? '<pre style="white-space:pre-wrap;background:#faf6ec;padding:10px;border-radius:10px">' + esc(extra) + "</pre>" : "") +
          '<p>' + (x.telefone ? '<a class="btn btn--sm" target="_blank" rel="noopener" href="' + esc(waLink(x.telefone)) + '">WhatsApp</a> ' : "") + (x.email ? '<a class="btn btn--sm" href="mailto:' + esc(x.email) + "?subject=" + encodeURIComponent("GiLF · " + x.codigo) + '">Email</a>' : "") + "</p>" },
        { k: "estado", l: "Estado", t: "select", opts: ESTADOS },
        { k: "nota", l: "Nota interna", t: "textarea", rows: 3 }
      ], { estado: x.estado, nota: x.nota }, { ok: "Guardar" }).then(function (res) {
        if (!res) return;
        api("forum_admin_actualizar", { p_id: x.id, p_estado: res.estado, p_nota: res.nota }).then(function () { x.estado = res.estado; x.nota = res.nota; toast("Pedido actualizado."); go("registos"); }).catch(function (err) { toast(why(err), true); });
      });
    });
  };

  /* ---------- edições (base para todos os GiLF e galas futuras) ---------- */
  R.plataforma = function (v) {
    var admin = S.papel === "admin";
    var c = card(v, "Edições do evento", "Cada edição (GiLF Angola 2026, GiLF Dubai, Gala 2027…) tem os seus conteúdos, histórico e publicação próprios. A edição marcada com ★ é a que aparece no site.",
      admin ? [["Nova edição", function () { novaEdicao(); }, "btn--gold"]] : []);
    c.insertAdjacentHTML("beforeend", '<div class="rows">' + S.edicoes.map(function (e) {
      return '<div class="row"><span class="thumb">' + (e.actual ? "★" : esc(String(e.ano || "").slice(-2))) + '</span><div class="row__b"><b>' + esc(e.nome) + (e.slug === S.edicao ? ' <span class="pill pill--new">a editar</span>' : "") + "</b><small>" + esc([e.slug, { rascunho: "Rascunho", publicada: "Publicada", arquivada: "Arquivada" }[e.estado], e.publicado_em ? "publicada " + new Date(e.publicado_em).toLocaleString("pt-PT") : "", e.tem_rascunho ? "com rascunho por publicar" : ""].filter(Boolean).join(" · ")) + '</small></div>' +
        (e.slug !== S.edicao ? '<button class="btn btn--sm" data-abrir="' + esc(e.slug) + '">Editar</button>' : "") + (admin ? ' <button class="btn btn--sm" data-def="' + esc(e.slug) + '">Definições</button>' : "") + "</div>";
    }).join("") + "</div>");
    c.addEventListener("click", function (ev) {
      var a = ev.target.closest("[data-abrir]"), d = ev.target.closest("[data-def]");
      if (a) { if (isDirty() && !confirm("As alterações desta edição ficam guardadas como rascunho. Continuar?")) return; abrirEdicao(a.getAttribute("data-abrir")).then(function () { go("painel"); }).catch(function (err) { toast(why(err), true); }); return; }
      if (d) {
        var e = S.edicoes.filter(function (x) { return x.slug === d.getAttribute("data-def"); })[0];
        openForm("Definições · " + e.nome, [
          { k: "nome", l: "Nome da edição", req: true },
          { k: "estado", l: "Estado", t: "select", opts: [["rascunho", "Rascunho (não aparece no site)"], ["publicada", "Publicada"], ["arquivada", "Arquivada (edição passada)"]] },
          { k: "actual", l: "Mostrar esta edição no site (substitui a actual)", t: "check" }
        ], { nome: e.nome, estado: e.estado, actual: e.actual }, { ok: "Guardar" }).then(function (r) {
          if (!r) return;
          if (r.actual && !e.actual && !confirm("O site público passa a mostrar «" + r.nome + "». Confirmar?")) return;
          api("forum_edicao_definir", { p_slug: e.slug, p_nome: r.nome, p_estado: r.estado, p_actual: !!r.actual }).then(function () { return api("forum_edicoes"); }).then(function (l) { S.edicoes = l; toast("Edição actualizada."); go("plataforma"); }).catch(function (err) { toast(why(err), true); });
        });
        return;
      }
    });
    function novaEdicao() {
      openForm("Nova edição", [
        { html: '<p class="small muted">A nova edição começa como cópia de uma edição existente (oradores, parceiros, textos…), para só ter de mudar o que é diferente. Fica em rascunho até a publicar e marcar como actual.</p>' },
        { k: "nome", l: "Nome", ph: "ex.: GiLF Angola 2027 · Fórum + Gala", req: true },
        { row: [{ k: "ano", l: "Ano", t: "number" }, { k: "tipo", l: "Tipo", t: "select", opts: [["forum-gala", "Fórum + Gala"], ["forum", "Só fórum"], ["gala", "Só gala"], ["outro", "Outro evento"]] }] },
        { k: "base", l: "Copiar conteúdos de", t: "select", opts: [["", "— começar vazio —"]].concat(S.edicoes.map(function (e) { return [e.slug, e.nome]; })) }
      ], { nome: "", ano: new Date().getFullYear() + 1, tipo: "forum-gala", base: S.edicao }, { ok: "Criar edição" }).then(function (r) {
        if (!r) return;
        var sl = slug(r.nome).replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").slice(0, 60);
        api("forum_nova_edicao", { p_base: r.base, p_slug: sl, p_nome: r.nome, p_ano: r.ano || null, p_tipo: r.tipo }).then(function () { return abrirEdicao(sl); }).then(function () { toast("Edição criada. Já está a editá-la."); go("evento"); }).catch(function (err) { toast(why(err), true); });
      });
    }
  };

  /* ---------- equipa ---------- */
  R.equipa = function (v) {
    var admin = S.papel === "admin";
    var c = card(v, "Equipa & acessos", "Quem pode entrar nesta área. Administrador: tudo, incluindo edições e equipa. Editor: edita e publica conteúdos e trata pedidos. Só leitura: consulta.", admin ? [["Adicionar pessoa", function () { form({ email: "", nome: "", papel: "editor" }); }, "btn--gold"]] : []);
    c.insertAdjacentHTML("beforeend", '<div id="eq"><div class="empty">A carregar…</div></div><p class="small muted">Para adicionar alguém, a pessoa cria primeiro uma conta em <a href="https://gilf-evento.com/#/registar" target="_blank" rel="noopener">gilf-evento.com</a> (Registar) e depois um administrador adiciona-a aqui com o mesmo email.</p>');
    var PAP = [["admin", "Administrador"], ["editor", "Editor"], ["leitor", "Só leitura"]];
    api("forum_equipa").then(function (l) {
      $("#eq").innerHTML = '<div class="rows">' + l.map(function (p) { return '<div class="row"><span class="thumb">' + esc(initials(p.nome || p.email)) + '</span><div class="row__b"><b>' + esc(p.nome || p.email) + "</b><small>" + esc(p.email) + '</small></div><span class="pill">' + esc((PAP.filter(function (x) { return x[0] === p.papel; })[0] || [0, p.papel])[1]) + "</span>" + (admin ? ' <button class="btn btn--sm" data-eq="' + esc(p.email) + '" data-pap="' + esc(p.papel) + '" data-nome="' + esc(p.nome) + '">Alterar</button>' : "") + "</div>"; }).join("") + "</div>";
    }).catch(function (e) { $("#eq").innerHTML = '<div class="empty">' + esc(why(e)) + "</div>"; });
    function form(o) {
      openForm(o.email ? "Acesso · " + o.email : "Adicionar pessoa à equipa", [
        { k: "email", l: "Email da conta", req: true }, { k: "nome", l: "Nome" },
        { k: "papel", l: "Acesso", t: "select", opts: PAP.concat(o.email ? [["", "— retirar acesso —"]] : []) }
      ], o, { ok: "Guardar" }).then(function (r) {
        if (!r) return;
        api("forum_equipa_definir", { p_email: r.email, p_papel: r.papel, p_nome: r.nome }).then(function () { toast("Equipa actualizada."); go("equipa"); }).catch(function (err) { toast(why(err), true); });
      });
    }
    c.addEventListener("click", function (e) {
      var b = e.target.closest("[data-eq]"); if (b) return form({ email: b.getAttribute("data-eq"), papel: b.getAttribute("data-pap"), nome: b.getAttribute("data-nome") });
    });
  };

  /* ---------- registo de actividade ---------- */
  R.actividade = function (v) {
    var c = card(v, "Registo de actividade", "Quem fez o quê: publicações, edições criadas, alterações na equipa e pedidos apagados.");
    c.insertAdjacentHTML("beforeend", '<div id="act"><div class="empty">A carregar…</div></div>');
    api("forum_actividade").then(function (l) {
      $("#act").innerHTML = (l || []).length ? '<div class="rows">' + l.map(function (x) { return '<div class="row"><div class="row__b"><b>' + esc(x.accao) + "</b><small>" + esc(new Date(x.quando).toLocaleString("pt-PT")) + " · " + esc(x.autor) + (x.alvo ? " · " + esc(x.alvo) : "") + "</small></div></div>"; }).join("") + "</div>" : '<div class="empty">Sem actividade registada.</div>';
    }).catch(function (e) { $("#act").innerHTML = '<div class="empty">' + esc(why(e)) + "</div>"; });
  };

  /* ======================= publish ======================= */
  function download(name, href) { var a = document.createElement("a"); a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
  function exportJs() {
    download("dados.js", URL.createObjectURL(new Blob([serialize(S.data)], { type: "text/javascript" })));
    var f = usedFiles(), keys = Object.keys(f);
    keys.forEach(function (p, i) { setTimeout(function () { download(p.split("/").pop(), f[p]); }, 300 * (i + 1)); });
    toast("dados.js" + (keys.length ? " e " + keys.length + " imagem(ns)" : "") + " descarregado(s). Envie-os para o repositório (assets/ e as pastas das imagens).");
  }
  $("#previewBtn").addEventListener("click", function () { save(); });
  $("#publishBtn").addEventListener("click", function () {
    if (!podeEditar()) return toast("A sua conta é só de leitura.", true);
    if (!isDirty()) return toast("Não há alterações por publicar.");
    var errs = health().filter(function (x) { return x[0] === "err"; });
    var ed = S.edicoes.filter(function (e) { return e.slug === S.edicao; })[0] || {};
    openForm("Publicar alterações", [
      { html: (errs.length ? '<div class="banner banner--warn"><b>Atenção:</b> ' + errs.length + " erro(s) por corrigir:<br>" + errs.slice(0, 5).map(function (x) { return "• " + esc(x[1]); }).join("<br>") + "</div>" : "") +
        "<p>Edição: <b>" + esc(ed.nome || S.edicao) + "</b>. " + (ed.actual ? "É a edição que está no site: as alterações ficam visíveis para todos em menos de um minuto." : "Esta edição não é a que está no site: fica publicada, mas só aparece quando a marcar como actual em «Edições do evento».") + "</p>" },
      { k: "msg", l: "Descrição da alteração (fica no histórico)", ph: "ex.: Adicionados os premiados do II Acto" }
    ], { msg: "" }, { ok: "Publicar agora" }).then(function (r) { if (r) publish(r.msg || "Actualização de conteúdos"); });
  });
  function publish(msg, forcar) {
    busy("A publicar…");
    api("forum_publicar", { p_slug: S.edicao, p_conteudo: S.data, p_nota: msg, p_publicado_em: forcar ? null : S.publicadoEm }).then(function (t) {
      S.publicadoEm = t; S.base = JSON.stringify(S.data);
      localStorage.removeItem(K.draft); localStorage.removeItem(K.files);
      return api("forum_edicoes").then(function (l) { S.edicoes = l; });
    }).then(function () {
      busy(); status(); toast("Publicado! O site actualiza em menos de um minuto."); go(S.view);
    }).catch(function (err) {
      busy();
      if (/CONFLITO/.test(err.message)) {
        if (confirm(why(err) + "\n\nOK = publicar mesmo assim (substitui a versão dessa pessoa, que fica no histórico) · Cancelar = não publicar")) return publish(msg, true);
        return;
      }
      toast("Não foi possível publicar. " + why(err), true);
    });
  }
})();
