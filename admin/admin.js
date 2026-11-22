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
  var S = { auth: null, user: null, data: null, base: "", fileSha: null, files: {}, view: "painel", offline: false, prog: "forum", pFilter: "todos", pQuery: "" };
  var isDirty = function () { return JSON.stringify(S.data) !== S.base || Object.keys(usedFiles()).length > 0; };
  function usedFiles() {
    var used = {}, txt = JSON.stringify(S.data);
    Object.keys(S.files).forEach(function (p) { if (txt.indexOf('"' + p + '"') > -1) used[p] = S.files[p]; });
    return used;
  }
  function save() {
    try {
      localStorage.setItem(K.draft, JSON.stringify({ data: S.data, fileSha: S.fileSha, at: Date.now() }));
      localStorage.setItem(K.files, JSON.stringify(usedFiles()));
    } catch (e) { toast("Aviso: o rascunho é grande demais para guardar no browser. Publique em breve.", true); }
    status();
  }
  function status() {
    var st = $("#status"), d = isDirty();
    st.className = "status" + (S.offline ? " off" : d ? " dirty" : "");
    $("span", st).textContent = S.offline ? (d ? "Modo local · alterações por exportar" : "Modo local") : d ? "Alterações por publicar" : "Tudo publicado";
    $("#publishBtn").textContent = S.offline ? "Exportar dados.js" : "Publicar";
  }
  var img = function (p) { return !p ? "" : S.files[p] || (/^(data:|https?:)/.test(p) ? p : "../" + p); };
  var D = function () { return S.data; };
  var people = function () { return D().pessoas || (D().pessoas = []); };
  var person = function (id) { return people().filter(function (p) { return p.id === id; })[0]; };
  var ROLE = { keynote: "Keynote", guest: "Guest Speaker", moderador: "Moderador(a)", orador: "Orador(a)", "": "—" };

  /* ======================= GitHub API ======================= */
  function gh(path, method, body) {
    return fetch("https://api.github.com" + path, {
      method: method || "GET", cache: "no-store",
      headers: { Authorization: "Bearer " + S.auth.token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error((j && j.message) || ("Erro " + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }
  var b64dec = function (s) { var bin = atob(s.replace(/\s/g, "")); var u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new TextDecoder().decode(u); };
  function parseDados(text) {
    var m = /^window\.GILF\s*=\s*/m.exec(text);
    var a = m ? m.index + m[0].length : -1, b = text.lastIndexOf("}");
    if (a < 0 || b < a) throw new Error("Formato de dados.js inesperado.");
    return JSON.parse(text.slice(a, b + 1));
  }
  function serialize(d) {
    return "/* GiLF ANGOLA 2026 — CONTEÚDOS DO SITE\n   Este ficheiro é gerido pela Área Administrativa (/admin/).\n   Edições manuais: manter o formato  window.GILF = { ... };  (JSON válido). */\nwindow.GILF = " + JSON.stringify(d, null, 2) + ";\n";
  }
  var repoPath = function () { return "/repos/" + S.auth.repo; };
  function loadRemote(ref) {
    return gh(repoPath() + "/contents/assets/dados.js?ref=" + encodeURIComponent(ref || S.auth.branch)).then(function (r) { return { data: parseDados(b64dec(r.content)), sha: r.sha }; });
  }

  /* ======================= login ======================= */
  function showApp() { $("#login").classList.add("hidden"); $("#app").classList.remove("hidden"); buildNav(); go(location.hash.slice(1) || "painel"); status(); }
  function start(data, fileSha) {
    S.data = data; S.base = JSON.stringify(data); S.fileSha = fileSha; S.files = {};
    var dr = lsGet(K.draft);
    if (dr && dr.data && JSON.stringify(dr.data) !== S.base) {
      var same = !fileSha || dr.fileSha === fileSha;
      var when = new Date(dr.at).toLocaleString("pt-PT");
      if (confirm((same ? "Existe um rascunho por publicar" : "Existe um rascunho antigo (o site foi entretanto publicado por outra pessoa)") + " guardado neste browser em " + when + ".\n\nOK = recuperar o rascunho · Cancelar = descartar")) {
        S.data = dr.data; S.files = lsGet(K.files) || {};
      }
    }
    save(); showApp();
  }
  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var token = $("#tok").value.trim(), repo = $("#repo").value.trim().replace(/^https:\/\/github.com\//, "").replace(/\.git$/, ""), branch = $("#branch").value.trim();
    if (!token) return;
    S.auth = { token: token, repo: repo, branch: branch }; S.offline = false;
    $("#loginErr").textContent = ""; busy("A verificar acesso…");
    Promise.all([gh("/user"), gh(repoPath())]).then(function (r) {
      S.user = r[0];
      if (r[1].permissions && !r[1].permissions.push) throw new Error("Esta chave não tem permissão de escrita no repositório.");
      (($("#remember").checked) ? localStorage : sessionStorage).setItem(K.auth, JSON.stringify(S.auth));
      busy("A carregar conteúdos…");
      return loadRemote();
    }).then(function (res) { busy(); start(res.data, res.sha); toast("Bem-vindo, " + (S.user.name || S.user.login) + "!"); })
      .catch(function (err) { busy(); S.auth = null; $("#loginErr").textContent = err.status === 401 ? "Chave inválida ou expirada." : err.status === 404 ? "Repositório ou branch não encontrado (ou sem acesso)." : err.message; });
  });
  $("#offline").addEventListener("click", function () {
    S.offline = true; S.user = null;
    start(clone(window.GILF || {}), null);
    toast("Modo local: as alterações são exportadas como ficheiro dados.js.");
  });
  $("#logout").addEventListener("click", function () {
    if (isDirty() && !confirm("Tem alterações por publicar (ficam guardadas como rascunho neste browser). Sair?")) return;
    localStorage.removeItem(K.auth); sessionStorage.removeItem(K.auth); location.hash = ""; location.reload();
  });
  window.addEventListener("beforeunload", function (e) { if (S.data && isDirty()) { e.preventDefault(); e.returnValue = ""; } });
  (function auto() {
    var a = lsGet(K.auth); if (!a || !a.token) return;
    $("#tok").value = a.token; $("#repo").value = a.repo; $("#branch").value = a.branch;
    $("#loginForm").requestSubmit ? $("#loginForm").requestSubmit() : $("#loginForm").dispatchEvent(new Event("submit"));
  })();

  /* ======================= navigation ======================= */
  var VIEWS = [
    ["painel", "Painel"], ["sep", "Conteúdos"], ["evento", "Evento"], ["programa", "Programa"], ["pessoas", "Oradores & Pessoas"], ["premios", "Prémios & Nomeados"],
    ["parceiros", "Parceiros"], ["bilhetes", "Bilhetes"], ["patrocinio", "Patrocínio"], ["organizacao", "Organização"], ["faq", "Perguntas frequentes"],
    ["sep", "Sistema"], ["historico", "Histórico de versões"], ["definicoes", "Definições"]
  ];
  function buildNav() {
    $("#nav").innerHTML = VIEWS.map(function (v) {
      if (v[0] === "sep") return '<div class="side__sep">' + v[1] + "</div>";
      var c = v[0] === "pessoas" ? people().length : v[0] === "parceiros" ? (D().parceiros || []).reduce(function (n, g) { return n + (g.itens || []).length; }, 0) : "";
      return '<button class="nav' + (S.view === v[0] ? " on" : "") + '" data-go="' + v[0] + '">' + ic(v[0]) + "<span>" + v[1] + "</span>" + (c !== "" ? '<span class="count">' + c + "</span>" : "") + "</button>";
    }).join("");
    $("#who").innerHTML = S.user ? '<img src="' + esc(S.user.avatar_url) + '" alt=""><span><b style="color:#fff">' + esc(S.user.name || S.user.login) + '</b><br><span class="small">@' + esc(S.user.login) + "</span></span>" : '<span class="small">Modo local (sem publicação)</span>';
  }
  document.addEventListener("click", function (e) {
    var g = e.target.closest("[data-go]"); if (!g) return;
    e.preventDefault(); go(g.getAttribute("data-go")); $("#side").classList.remove("open");
  });
  $("#menuBtn").addEventListener("click", function () { $("#side").classList.toggle("open"); });
  function go(v) {
    if (!R[v]) v = "painel";
    S.view = v; location.hash = v;
    $("#title").textContent = VIEWS.filter(function (x) { return x[0] === v; })[0][1];
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
        if (mode === "photo") {
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
        wrap.innerHTML = '<div class="imgf' + (isLogo ? " imgf--logo" : "") + '"><div class="prev"></div><div class="acts"><b class="small">' + esc(f.l) + '</b><label class="btn btn--sm" style="cursor:pointer">Carregar imagem<input type="file" accept="image/*" hidden></label><button type="button" class="btn btn--sm btn--danger">Remover</button><span class="hint small muted">' + (isLogo ? "PNG com fundo transparente, de preferência." : "Recortada automaticamente em quadrado.") + "</span></div></div>";
        var prev = $(".prev", wrap), show = function () { prev.innerHTML = cur ? '<img src="' + esc(img(cur)) + '" alt="">' : (isLogo ? "Sem logótipo" : "Sem foto"); };
        $("input", wrap).addEventListener("change", function (e) {
          var file = e.target.files[0]; if (!file) return;
          processImage(file, isLogo ? "logo" : "photo").then(function (data) {
            var base = f.name ? slug(f.name()) : "img";
            var path = (f.dir || "assets/img/pessoas/") + base + "-" + stamp() + (isLogo ? ".png" : ".jpg");
            S.files[path] = data; cur = path; show();
            prev.dispatchEvent(new Event("change", { bubbles: true }));
          }).catch(function (err) { toast(err.message, true); });
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
    ((d.premios || {}).categorias || []).forEach(function (c) {
      (c.nomeados || []).forEach(function (id) { used[id] = 1; if (!ids[id]) out.push(["err", "A categoria “" + c.titulo + "” refere um nomeado removido.", "premios"]); });
      if (!(c.nomeados || []).length && !c.vagas) out.push(["warn", "A categoria “" + c.titulo + "” não tem nomeados.", "premios"]);
      if (c.vencedor && (c.nomeados || []).indexOf(c.vencedor) < 0) out.push(["err", "O vencedor de “" + c.titulo + "” não está entre os nomeados.", "premios"]);
    });
    people().forEach(function (p) {
      if (!p.foto) out.push(["warn", p.nome + " não tem fotografia.", "pessoas"]);
      if (p.papel && !used[p.id]) out.push(["warn", p.nome + " (" + ROLE[p.papel] + ") não está em nenhuma sessão do programa.", "programa"]);
      if (!p.papel && !used[p.id]) out.push(["warn", p.nome + " não tem papel nem nomeação — não aparece no site.", "pessoas"]);
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
    var noms = {}; ((d.premios || {}).categorias || []).forEach(function (c) { (c.nomeados || []).forEach(function (id) { noms[id] = 1; }); });
    var parts = (d.parceiros || []).reduce(function (n, g) { return n + (g.grupo === "Organização" ? 0 : (g.itens || []).length); }, 0);
    v.insertAdjacentHTML("beforeend", (S.offline ? '<div class="banner banner--warn"><b>Modo local.</b> As alterações não são publicadas automaticamente: use “Exportar dados.js” e envie o ficheiro para o repositório.</div>' : "") +
      '<div class="kpis"><div class="kpi kpi--hero"><b>' + (isNaN(days) ? "—" : days) + "</b><span>dias até " + esc(e.dataTexto || "o evento") + '</span></div><div class="kpi"><b>' + spk + '</b><span>oradores e moderadores</span></div><div class="kpi"><b>' + Object.keys(noms).length + '</b><span>nomeados</span></div><div class="kpi"><b>' + parts + "</b><span>patrocinadores e parceiros</span></div></div>");
    var two = document.createElement("div"); two.className = "two"; v.appendChild(two);
    var h = health(), c1 = card(two, "Saúde dos conteúdos", h.length ? h.length + " ponto(s) a rever" : "Tudo em ordem");
    var errs = h.filter(function (x) { return x[0] === "err"; }).length;
    c1.insertAdjacentHTML("beforeend", '<ul class="checks">' + (h.length ? h.slice(0, 14).map(function (x) { return '<li><span class="dot dot--' + x[0] + '"></span><span>' + esc(x[1]) + ' <a data-go="' + x[2] + '">Corrigir →</a></span></li>'; }).join("") + (h.length > 14 ? '<li class="muted">… e mais ' + (h.length - 14) + "</li>" : "") : '<li><span class="dot dot--ok"></span>Sem problemas detectados.</li>') + "</ul>" +
      (errs ? '<p class="small" style="color:var(--red);margin:10px 0 0">Há ' + errs + " erro(s) que devem ser corrigidos antes de publicar.</p>" : ""));
    var c2 = card(two, "Acções rápidas");
    c2.insertAdjacentHTML("beforeend", '<div class="rows">' + [["pessoas", "Adicionar orador ou moderador"], ["programa", "Editar painéis e sessões"], ["premios", "Gerir nomeados e vencedores"], ["parceiros", "Adicionar patrocinador"], ["evento", "Aviso no topo do site"]].map(function (a) {
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
        row: function (n) { return { thumb: '<span class="thumb" style="font-family:Inter;font-weight:700;font-size:.95rem">' + esc(n.valor) + "</span>", title: n.rotulo }; },
        fields: [{ row: [{ k: "valor", l: "Número", req: true }, { k: "rotulo", l: "Descrição", req: true }] }],
        make: function () { return { valor: "", rotulo: "" }; }, add: "Novo número"
      });
    });
    inlineForm(f2, [{ row: [{ k: "facebook", l: "Facebook (URL)" }, { k: "instagram", l: "Instagram (URL)" }] }, { row: [{ k: "linkedin", l: "LinkedIn (URL)" }, { k: "youtube", l: "YouTube (URL)" }] }, { k: "tiktok", l: "TikTok (URL)" }], e.redes);
  };

  var personOpts = function () { return [["", "— Nenhum / a anunciar —"]].concat(people().map(function (p) { return [p.id, p.nome + (p.cargo ? " · " + p.cargo : "")]; })); };
  var sessionFields = [
    { row: [{ k: "tipo", l: "Tipo", t: "select", opts: [["keynote", "Keynote Speaker"], ["guest", "Guest Speaker"], ["painel", "Painel"], ["sessao", "Sessão"], ["networking", "Networking"], ["pausa", "Pausa"], ["gala", "Gala"]] }, { k: "numero", l: "Nº do painel", ph: "ex.: 4" }, { k: "hora", l: "Início", ph: "09:00", hint: "Vazio = mostra a ordem" }] },
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
    var TAG = { keynote: "Keynote", guest: "Guest Speaker", painel: "Painel", sessao: "Sessão", networking: "Networking", pausa: "Pausa", gala: "Gala" };
    var ed = listEditor(c, {
      arr: function () { return pr[S.prog] || (pr[S.prog] = []); },
      title: function (s) { return s.titulo; },
      row: function (s, i) {
        var mod = person(s.moderador), sp = (s.oradores || []).map(person).filter(Boolean);
        return { thumb: '<span class="thumb" style="font-family:Inter;font-size:.8rem;font-weight:700">' + esc(s.hora || (i + 1)) + "</span>", title: s.titulo,
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
      { row: [{ k: "nome", l: "Nome", req: true, ph: "Nome como aparece no site" }, { k: "papel", l: "Papel no Fórum", t: "select", opts: [["", "— Nenhum (ex.: só nomeado) —"], ["keynote", "Keynote Speaker"], ["guest", "Guest Speaker"], ["moderador", "Moderador(a)"], ["orador", "Orador(a)"]] }] },
      { row: [{ k: "cargo", l: "Cargo" }, { k: "organizacao", l: "Organização" }, { k: "pais", l: "País" }] },
      { k: "tema", l: "Tema da intervenção", t: "textarea", rows: 2 },
      { k: "bio", l: "Biografia", t: "textarea", rows: 5 },
      { row: [{ k: "nomeCompleto", l: "Nome completo (opcional)" }, { k: "linkedin", l: "LinkedIn (URL)" }] },
      { k: "destaque", l: "Destacar na página inicial", t: "check" }
    ];
  };
  function removePersonRefs(p) {
    var pr = D().programa || {};
    ["forum", "gala"].forEach(function (k) { (pr[k] || []).forEach(function (s) { if (s.moderador === p.id) s.moderador = ""; s.oradores = (s.oradores || []).filter(function (x) { return x !== p.id; }); }); });
    ((D().premios || {}).categorias || []).forEach(function (c) { c.nomeados = (c.nomeados || []).filter(function (x) { return x !== p.id; }); if (c.vencedor === p.id) c.vencedor = ""; });
  }
  function usage(p) {
    var u = [], pr = D().programa || {};
    ["forum", "gala"].forEach(function (k) { (pr[k] || []).forEach(function (s) { if (s.moderador === p.id) u.push("Modera: " + s.titulo); if ((s.oradores || []).indexOf(p.id) > -1) u.push(s.titulo); }); });
    ((D().premios || {}).categorias || []).forEach(function (c) { if ((c.nomeados || []).indexOf(p.id) > -1) u.push("Nomeado: " + c.titulo); });
    return u;
  }
  R.pessoas = function (v) {
    var c = card(v, "Oradores, moderadores e nomeados", "Uma pessoa pode ser oradora e nomeada ao mesmo tempo. Depois de criar, atribua-a a uma sessão em Programa ou a uma categoria em Prémios.", [["Adicionar pessoa", function () { ed.add(); }]]);
    var tb = document.createElement("div"); tb.className = "toolbar";
    var nomIds = {}; ((D().premios || {}).categorias || []).forEach(function (cc) { (cc.nomeados || []).forEach(function (id) { nomIds[id] = 1; }); });
    var F = [["todos", "Todas"], ["keynote", "Keynote"], ["guest", "Guest"], ["moderador", "Moderadores"], ["orador", "Oradores"], ["nomeado", "Nomeados"]];
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
        return { thumb: thumbP(p), title: p.nome, pills: (p.papel ? '<span class="pill' + (p.papel === "moderador" ? " pill--dark" : "") + '">' + ROLE[p.papel] + "</span>" : "") + (nomIds[p.id] ? '<span class="pill">Nomeado</span>' : "") + (p.destaque ? '<span class="pill pill--new">Destaque</span>' : "") + (!p.foto ? '<span class="pill pill--warn">sem foto</span>' : ""),
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

  R.premios = function (v) {
    var P = D().premios || (D().premios = { categorias: [] });
    var c0 = card(v, "Definições dos prémios");
    var f0 = document.createElement("div"); c0.appendChild(f0);
    inlineForm(f0, [{ k: "nota", l: "Nota sobre a escolha dos vencedores" }, { k: "revelarVencedores", l: "Revelar vencedores no site (activar só depois da Gala)", t: "check" }], P);
    var cg = card(v, "Grupos de distinções", "Ex.: Figuras nacionais (70), Instituições (30), Homenagens a título póstumo (2), Oradores premiados (10).", [["Novo grupo", function () { eg.add(); }]]);
    var eg = listEditor(cg, {
      arr: function () { return P.grupos || (P.grupos = []); }, title: function (g) { return g.titulo; },
      row: function (g) { var n = (P.categorias || []).filter(function (c) { return c.grupo === g.id; }).length; return { thumb: '<span class="thumb" style="font-family:Inter;font-weight:700">' + esc(g.total || "—") + "</span>", title: g.titulo, sub: n + " categoria(s)" }; },
      fields: [{ row: [{ k: "titulo", l: "Nome do grupo", req: true }, { k: "total", l: "Total de distinções", t: "number" }] }],
      before: function (r, old) { if (!old) r.id = slug(r.titulo) + "-" + stamp(); return r; },
      make: function () { return { id: "", titulo: "", total: 0 }; }, add: "Novo grupo"
    });
    var c = card(v, "Categorias e nomeados", "Os nomeados vêm da lista de pessoas. Para um nome novo, adicione-o primeiro em “Oradores & Pessoas”.", [["Nova categoria", function () { ed.add(); }]]);
    var ed = listEditor(c, {
      arr: function () { return P.categorias || (P.categorias = []); },
      title: function (x) { return x.titulo; },
      row: function (x) {
        var ns = (x.nomeados || []).map(person).filter(Boolean), win = person(x.vencedor);
        var gr = (P.grupos || []).filter(function (g) { return g.id === x.grupo; })[0];
        return { thumb: ns[0] ? thumbP(ns[0]) : '<span class="thumb">★</span>', title: x.titulo, pills: (gr ? '<span class="pill pill--dark">' + esc(gr.titulo) + "</span>" : "") + '<span class="pill">' + ns.length + (x.vagas ? " / " + x.vagas : "") + " nomeado(s)</span>" + (win ? '<span class="pill pill--new">Vencedor: ' + esc(win.nome) + "</span>" : ""), sub: ns.map(function (p) { return p.nome; }).join(", ") };
      },
      fields: function (x) {
        return [{ k: "titulo", l: "Nome da categoria", req: true, ph: "Líder Jovem do Ano 2026" },
          { row: [{ k: "grupo", l: "Grupo", t: "select", opts: function () { return [["", "— Sem grupo —"]].concat((P.grupos || []).map(function (g) { return [g.id, g.titulo]; })); } }, { k: "vagas", l: "Nº total de distinções nesta categoria", t: "number", hint: "Os lugares sem nome aparecem como “a anunciar”" }] },
          { k: "nomeados", l: "Nomeados", t: "people" },
          { k: "vencedor", l: "Vencedor (só aparece no site se “Revelar vencedores” estiver activo)", t: "select", opts: function () { return [["", "— Por anunciar —"]].concat((x.nomeados || []).map(function (id) { var p = person(id); return [id, p ? p.nome : id]; })); }, hint: "Guarde primeiro os nomeados para os ver nesta lista." }];
      },
      make: function () { return { id: "c-" + stamp(), grupo: ((P.grupos || [])[0] || {}).id || "", titulo: "", nomeados: [], vencedor: "", vagas: 0 }; },
      add: "Nova categoria"
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
      row: function (x) { return { thumb: '<span class="thumb" style="font-family:Inter;font-size:.7rem;font-weight:700">' + esc(x.ano) + "</span>", title: x.ano, sub: x.texto }; },
      fields: [{ k: "ano", l: "Ano / data", req: true }, { k: "texto", l: "Texto", t: "textarea", rows: 2 }], make: function () { return { ano: "", texto: "" }; }, add: "Novo marco"
    });
    var c2 = card(v, "Iniciativas", "", [["Nova iniciativa", function () { e2.add(); }]]);
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
    var c = card(v, "Histórico de publicações", "Cada publicação fica guardada. Pode carregar uma versão anterior, revê-la e publicá-la de novo para a restaurar.");
    if (S.offline) { c.insertAdjacentHTML("beforeend", '<div class="empty">Disponível apenas com sessão iniciada.</div>'); return; }
    c.insertAdjacentHTML("beforeend", '<div id="hist"><div class="empty">A carregar…</div></div>');
    gh(repoPath() + "/commits?path=assets/dados.js&sha=" + encodeURIComponent(S.auth.branch) + "&per_page=30").then(function (list) {
      $("#hist").innerHTML = list.map(function (cm, i) {
        var a = cm.commit.author || {};
        return '<div class="commit"><div><b>' + esc(cm.commit.message.split("\n")[0]) + (i === 0 ? '<span class="pill pill--new">actual</span>' : "") + "</b><small>" + esc(new Date(a.date).toLocaleString("pt-PT")) + " · " + esc((cm.author && cm.author.login) || a.name || "") + "</small></div>" +
          (i === 0 ? "" : '<button class="btn btn--sm" data-sha="' + cm.sha + '">Carregar esta versão</button>') + "</div>";
      }).join("") || '<div class="empty">Sem histórico.</div>';
    }).catch(function (e) { $("#hist").innerHTML = '<div class="empty">Erro: ' + esc(e.message) + "</div>"; });
    c.addEventListener("click", function (e) {
      var b = e.target.closest("[data-sha]"); if (!b) return;
      if (isDirty() && !confirm("Isto substitui as alterações por publicar. Continuar?")) return;
      busy("A carregar versão…");
      loadRemote(b.getAttribute("data-sha")).then(function (r) { busy(); S.data = r.data; save(); toast("Versão carregada. Reveja e clique em Publicar para a restaurar."); go("painel"); })
        .catch(function (err) { busy(); toast(err.message, true); });
    });
  };

  R.definicoes = function (v) {
    var c = card(v, "Ligação");
    c.insertAdjacentHTML("beforeend", S.offline ? '<p class="muted">Modo local — sem ligação ao repositório.</p>' :
      '<p>Repositório: <b>' + esc(S.auth.repo) + "</b><br>Branch publicado: <b>" + esc(S.auth.branch) + '</b></p><p class="small muted">Depois de publicar, o GitHub Pages actualiza o site em 1 a 2 minutos. Se não vir a alteração, actualize a página do site (Ctrl+F5).</p>');
    var c2 = card(v, "Cópias de segurança");
    c2.insertAdjacentHTML("beforeend", '<div class="toolbar"><button class="btn" id="dlJson">Descarregar cópia (JSON)</button><label class="btn" style="cursor:pointer">Importar cópia (JSON)<input type="file" accept="application/json,.json,.js" hidden id="upJson"></label><button class="btn" id="dlJs">Descarregar dados.js</button><button class="btn btn--danger" id="reset">Descartar alterações por publicar</button></div>');
    $("#dlJson").addEventListener("click", function () { download("gilf-conteudos-" + new Date().toISOString().slice(0, 10) + ".json", "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(S.data, null, 2))); });
    $("#dlJs").addEventListener("click", exportJs);
    $("#upJson").addEventListener("change", function (e) {
      var f = e.target.files[0]; if (!f) return;
      f.text().then(function (t) { var d = /window\.GILF/.test(t) ? parseDados(t) : JSON.parse(t); if (!d.evento || !d.pessoas) throw new Error("Ficheiro sem a estrutura esperada."); S.data = d; save(); toast("Cópia importada. Reveja e publique."); go("painel"); })
        .catch(function (err) { toast("Importação falhou: " + err.message, true); });
    });
    $("#reset").addEventListener("click", function () {
      if (!confirm("Descartar todas as alterações por publicar?")) return;
      S.data = JSON.parse(S.base); S.files = {}; save(); toast("Alterações descartadas."); go("painel");
    });
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
    if (S.offline) return exportJs();
    if (!isDirty()) return toast("Não há alterações por publicar.");
    var errs = health().filter(function (x) { return x[0] === "err"; });
    var files = usedFiles(), nf = Object.keys(files).length;
    openForm("Publicar alterações", [
      { html: (errs.length ? '<div class="banner banner--warn"><b>Atenção:</b> ' + errs.length + " erro(s) por corrigir:<br>" + errs.slice(0, 5).map(function (x) { return "• " + esc(x[1]); }).join("<br>") + "</div>" : "") +
        '<p>As alterações ficam visíveis no site para todos em 1 a 2 minutos.' + (nf ? " Inclui " + nf + " imagem(ns) nova(s)." : "") + "</p>" },
      { k: "msg", l: "Descrição da alteração (fica no histórico)", ph: "ex.: Adicionados os oradores do Painel 5" }
    ], { msg: "" }, { ok: "Publicar agora" }).then(function (r) { if (r) publish(r.msg || "Actualização de conteúdos", files); });
  });
  function publish(msg, files) {
    var repo = repoPath(), br = S.auth.branch, head, baseTree;
    busy("A publicar…");
    gh(repo + "/contents/assets/dados.js?ref=" + encodeURIComponent(br)).then(function (cur) {
      if (S.fileSha && cur.sha !== S.fileSha && !confirm("Outra pessoa publicou alterações desde que abriu a área administrativa. Publicar mesmo assim substitui as alterações dela. Continuar?\n\n(Cancelar = parar e recarregar mais tarde)")) throw new Error("cancel");
      return gh(repo + "/git/ref/heads/" + br);
    }).then(function (ref) {
      head = ref.object.sha; return gh(repo + "/git/commits/" + head);
    }).then(function (cm) {
      baseTree = cm.tree.sha;
      var jobs = [gh(repo + "/git/blobs", "POST", { content: serialize(S.data), encoding: "utf-8" }).then(function (b) { return { path: "assets/dados.js", mode: "100644", type: "blob", sha: b.sha }; })];
      Object.keys(files).forEach(function (p) {
        jobs.push(gh(repo + "/git/blobs", "POST", { content: files[p].split(",")[1], encoding: "base64" }).then(function (b) { return { path: p, mode: "100644", type: "blob", sha: b.sha }; }));
      });
      return Promise.all(jobs);
    }).then(function (tree) {
      return gh(repo + "/git/trees", "POST", { base_tree: baseTree, tree: tree });
    }).then(function (t) {
      return gh(repo + "/git/commits", "POST", { message: "Admin: " + msg, tree: t.sha, parents: [head] });
    }).then(function (c) {
      return gh(repo + "/git/refs/heads/" + br, "PATCH", { sha: c.sha });
    }).then(function () {
      return loadRemote();
    }).then(function (res) {
      S.fileSha = res.sha; S.base = JSON.stringify(S.data);
      /* keep showing the just-published images locally until GitHub Pages serves them */
      var pub = {}; Object.keys(files).forEach(function (p) { pub["__pub__" + p] = files[p]; });
      S.files = pub;
      localStorage.removeItem(K.draft); localStorage.removeItem(K.files);
      busy(); status(); toast("Publicado! O site público actualiza em poucos minutos.");
      go(S.view);
    }).catch(function (err) {
      busy(); if (err.message === "cancel") return;
      toast("Não foi possível publicar: " + (err.status === 401 ? "sessão expirada — entre de novo." : err.status === 409 || err.status === 422 ? "o site mudou entretanto; tente de novo." : err.message), true);
    });
  }
  /* published images keep showing locally until GitHub Pages serves them */
  var _img = img;
  img = function (p) { return S.files["__pub__" + p] || _img(p); };
})();
