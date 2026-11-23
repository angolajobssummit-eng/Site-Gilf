/* GiLF Eventos — protótipo (SPA sem servidor).
   As inscrições ficam no browser; no MVP passam para a base de dados (schema.sql). */
(function () {
  "use strict";
  var D = window.GE_DATA;
  var main = document.getElementById("main");
  var modal = document.getElementById("modal");
  var mBody = document.getElementById("mBody");

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function tema(id) { var t = byId(D.temas, id); return t ? t.nome : id; }
  function cap(id) { return byId(D.capitulos, id) || { nome: "", cidade: "" }; }
  var fmtDia = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  var fmtMes = new Intl.DateTimeFormat("pt-PT", { month: "short" });
  var fmtHora = new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" });
  function dt(s) { return new Date(s); }
  function kz(v) { return new Intl.NumberFormat("pt-PT").format(v) + " Kz"; }
  function precoTxt(e) { return e.preco == null ? (e.precoTexto || "Ver condições") : e.preco === 0 ? "Gratuito" : kz(e.preco); }
  function wa(msg) { return "https://wa.me/" + D.org.whatsapp + "?text=" + encodeURIComponent(msg); }
  var IC = {
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    ppl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6 6 0 0 1 3.5 6"/></svg>',
    tkt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z" transform="translate(0 2)"/></svg>',
    grp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>'
  };

  /* ---------- armazenamento local (protótipo) ---------- */
  var KEY = "gilfeventos.v1";
  var S = load();
  function load() {
    var base = { perfil: {}, inscricoes: [], capitulos: [] };
    try { var v = JSON.parse(localStorage.getItem(KEY)); if (v) { base.perfil = v.perfil || {}; base.inscricoes = v.inscricoes || []; base.capitulos = v.capitulos || []; } } catch (e) {}
    return base;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function minha(eid) { for (var i = 0; i < S.inscricoes.length; i++) if (S.inscricoes[i].eventoId === eid) return S.inscricoes[i]; return null; }
  function ocupados(e) { var m = minha(e.id); return e.inscritos + (m && m.estado === "confirmado" ? 1 : 0); }
  function cheio(e) { return ocupados(e) >= e.vagas; }
  function membro(cid) { return S.capitulos.indexOf(cid) >= 0; }
  function codigo() { var c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 6; i++) s += c[Math.floor(Math.random() * c.length)]; return "GE-" + s; }
  function pontos() {
    var p = 0;
    S.inscricoes.forEach(function (i) { p += i.estado === "confirmado" ? 10 : 2; });
    p += S.capitulos.length * 5;
    if (S.perfil.nome && S.perfil.telefone && S.perfil.sector) p += 10;
    return p;
  }
  function proximos() { var agora = Date.now(); return D.eventos.filter(function (e) { return dt(e.fim || e.inicio).getTime() >= agora; }).sort(function (a, b) { return dt(a.inicio) - dt(b.inicio); }); }

  /* ---------- componentes ---------- */
  function cardEvento(e) {
    var d = dt(e.inicio), c = cap(e.capitulo), m = minha(e.id), pct = Math.min(100, Math.round(ocupados(e) / e.vagas * 100));
    var estado = m ? (m.estado === "confirmado" ? '<span class="tag tag--ok">Vou</span>' : '<span class="tag">Lista de espera</span>')
      : cheio(e) ? '<span class="tag tag--full">Esgotado · lista de espera</span>' : "";
    return '<a class="card" href="#/evento/' + e.id + '">' +
      '<div class="card__top"><div class="date"><b>' + d.getDate() + '</b><span>' + esc(fmtMes.format(d).replace(".", "")) + '</span></div>' +
      '<div><div class="tags">' + (e.oficial ? '<span class="tag tag--gold">Oficial</span>' : "") + '<span class="tag">' + esc(tema(e.tema)) + '</span>' + estado + '</div></div></div>' +
      '<div class="card__body"><h3>' + esc(e.titulo) + '</h3>' +
      '<div class="meta"><span>' + esc(fmtHora.format(d)) + '</span><span>' + esc(e.formato === "online" ? "Online" : e.cidade) + '</span><span>' + esc(c.nome) + '</span><span>' + esc(precoTxt(e)) + '</span></div>' +
      '<div class="bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' +
      '<div class="small">' + ocupados(e) + ' de ' + e.vagas + ' lugares confirmados</div></div></a>';
  }
  function cardCapitulo(c) {
    var n = D.eventos.filter(function (e) { return e.capitulo === c.id; }).length;
    return '<a class="chap" href="#/capitulo/' + c.id + '"><div class="chap__ic">' + esc(c.cidade.charAt(0)) + '</div>' +
      '<h3>' + esc(c.nome) + '</h3><div class="meta"><span>' + esc(c.cidade + (c.pais && c.pais !== "Rede" ? ", " + c.pais : "")) + '</span><span>' + (c.membros + (membro(c.id) ? 1 : 0)) + ' membros</span><span>' + n + ' eventos</span></div>' +
      '<p class="small" style="margin:0">' + esc(c.descricao) + '</p>' + (membro(c.id) ? '<span class="tag tag--ok" style="align-self:start">Membro</span>' : "") + '</a>';
  }
  function grade(lista) { return lista.length ? '<div class="grid">' + lista.join("") + "</div>" : '<div class="empty">Nenhum evento corresponde aos filtros.</div>'; }

  /* ---------- páginas ---------- */
  function pgInicio() {
    var ev = proximos(), membros = D.capitulos.reduce(function (a, c) { return a + c.membros; }, 0);
    var cidades = []; D.eventos.forEach(function (e) { if (cidades.indexOf(e.cidade) < 0) cidades.push(e.cidade); });
    main.innerHTML =
      '<section class="hero"><div class="wrap">' +
        '<span class="kicker">Um projecto Luadeira Digital Angola</span>' +
        '<h1>Os encontros de quem <em>lidera</em> Angola, todo o ano.</h1>' +
        '<p>O GiLF acontece uma vez por ano. O GiLF Eventos junta líderes, investidores, empreendedores e a diáspora em capítulos locais, com encontros todos os meses.</p>' +
        '<form class="search" id="srch" role="search"><input name="q" placeholder="Procurar eventos, temas, cidades…" aria-label="Pesquisar">' +
        '<select name="cidade" aria-label="Cidade"><option value="">Todas as cidades</option>' + cidades.map(function (c) { return '<option>' + esc(c) + "</option>"; }).join("") + '</select>' +
        '<button class="btn" type="submit">Procurar</button></form>' +
        '<div class="stats"><div><b>' + D.capitulos.length + '</b><span>capítulos</span></div><div><b>' + membros + '</b><span>membros</span></div><div><b>' + ev.length + '</b><span>próximos eventos</span></div></div>' +
      '</div></section>' +
      '<section class="sec"><div class="wrap"><div class="sec__head"><div><span class="kicker">Agenda</span><h2>Próximos eventos</h2></div><a class="btn btn--ghost btn--sm" href="#/eventos">Ver todos</a></div>' +
        grade(ev.slice(0, 6).map(cardEvento)) + '</div></section>' +
      '<section class="sec sec--soft"><div class="wrap"><div class="sec__head"><div><span class="kicker">Rede</span><h2>Capítulos</h2></div><a class="btn btn--ghost btn--sm" href="#/capitulos">Ver todos</a></div>' +
        '<div class="grid">' + D.capitulos.map(cardCapitulo).join("") + '</div></div></section>' +
      '<section class="sec"><div class="wrap"><span class="kicker">Como funciona</span><h2>Do registo à reunião certa</h2><div class="steps" style="margin-top:20px">' +
        '<div class="step"><h3>Junte-se a um capítulo</h3><p class="small">Escolha a sua cidade ou um tema. Recebe os convites por WhatsApp.</p></div>' +
        '<div class="step"><h3>Confirme presença</h3><p class="small">Um toque. Se estiver esgotado, entra na lista de espera e é avisado se abrir vaga.</p></div>' +
        '<div class="step"><h3>Entre com código QR</h3><p class="small">O bilhete fica no telemóvel. A entrada é registada e conta para os seus pontos.</p></div>' +
        '<div class="step"><h3>Reuniões B2B</h3><p class="small">Antes do encontro, sugerimos com quem falar com base no seu sector e objectivos.</p></div>' +
      '</div></div></section>';
    document.getElementById("srch").addEventListener("submit", function (ev) {
      ev.preventDefault(); var f = new FormData(this);
      location.hash = "#/eventos?q=" + encodeURIComponent(f.get("q") || "") + "&cidade=" + encodeURIComponent(f.get("cidade") || "");
    });
  }

  function pgEventos(qs) {
    var cidades = []; D.eventos.forEach(function (e) { if (cidades.indexOf(e.cidade) < 0) cidades.push(e.cidade); });
    var st = { q: qs.q || "", cidade: qs.cidade || "", tema: qs.tema || "", preco: "" };
    main.innerHTML = '<div class="wrap page-head"><span class="kicker">Agenda</span><h1>Eventos</h1></div>' +
      '<div class="wrap"><div class="filters">' +
        '<input id="fq" type="search" placeholder="Pesquisar…" aria-label="Pesquisar" value="' + esc(st.q) + '">' +
        '<select id="fc" aria-label="Cidade"><option value="">Todas as cidades</option>' + cidades.map(function (c) { return '<option' + (c === st.cidade ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + '</select>' +
        '<select id="fp" aria-label="Preço"><option value="">Gratuitos e pagos</option><option value="g">Só gratuitos</option><option value="p">Só pagos</option></select>' +
      '</div><div class="chips" id="chips"></div><div id="lista"></div></div>';
    function chips() {
      document.getElementById("chips").innerHTML = '<button class="chip' + (st.tema ? "" : " on") + '" data-t="">Todos os temas</button>' +
        D.temas.map(function (t) { return '<button class="chip' + (st.tema === t.id ? " on" : "") + '" data-t="' + t.id + '">' + esc(t.nome) + "</button>"; }).join("");
    }
    function draw() {
      var q = st.q.toLowerCase();
      var l = proximos().filter(function (e) {
        if (st.cidade && e.cidade !== st.cidade) return false;
        if (st.tema && e.tema !== st.tema) return false;
        if (st.preco === "g" && e.preco !== 0) return false;
        if (st.preco === "p" && !(e.preco > 0)) return false;
        if (q && (e.titulo + " " + e.descricao + " " + e.cidade + " " + cap(e.capitulo).nome + " " + tema(e.tema)).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      document.getElementById("lista").innerHTML = grade(l.map(cardEvento));
      chips();
    }
    document.getElementById("fq").addEventListener("input", function () { st.q = this.value; draw(); });
    document.getElementById("fc").addEventListener("change", function () { st.cidade = this.value; draw(); });
    document.getElementById("fp").addEventListener("change", function () { st.preco = this.value; draw(); });
    document.getElementById("chips").addEventListener("click", function (ev) { var b = ev.target.closest(".chip"); if (b) { st.tema = b.dataset.t; draw(); } });
    draw();
  }

  function pgEvento(id) {
    var e = byId(D.eventos, id); if (!e) return pgNaoEncontrado();
    var c = cap(e.capitulo), d = dt(e.inicio), f = dt(e.fim || e.inicio), m = minha(e.id), full = cheio(e);
    var acao;
    if (m) acao = '<p><span class="tag ' + (m.estado === "confirmado" ? "tag--ok" : "") + '">' + (m.estado === "confirmado" ? "Presença confirmada" : "Está na lista de espera") + '</span></p>' +
      '<div class="btns"><a class="btn" href="#/conta">Ver bilhete</a><button class="btn btn--ghost" id="ics" type="button">Calendário</button></div>';
    else acao = '<button class="btn" id="rsvp" type="button" style="width:100%">' + (full ? "Entrar na lista de espera" : "Confirmar presença") + '</button>';
    main.innerHTML = '<div class="wrap page-head"><div class="crumb"><a href="#/eventos">Eventos</a> / <a href="#/capitulo/' + c.id + '">' + esc(c.nome) + '</a></div>' +
      '<div class="tags" style="margin-bottom:10px">' + (e.oficial ? '<span class="tag tag--gold">Evento oficial</span>' : "") + '<span class="tag">' + esc(tema(e.tema)) + '</span>' + (e.certificado ? '<span class="tag">Com certificado</span>' : "") + '</div>' +
      '<h1>' + esc(e.titulo) + '</h1></div>' +
      '<div class="wrap detail"><div>' +
        '<div class="panel"><h2 style="font-size:1.3rem">Sobre o evento</h2><p>' + esc(e.descricao) + '</p>' + (e.link ? '<p><a href="' + esc(e.link) + '" target="_blank" rel="noopener">Site oficial do evento ›</a></p>' : "") + '</div>' +
        (e.programa && e.programa.length ? '<div class="panel"><h2 style="font-size:1.3rem">Programa</h2><ul class="prog">' + e.programa.map(function (p) { return "<li><b>" + esc(p[0]) + "</b><span>" + esc(p[1]) + "</span></li>"; }).join("") + "</ul></div>" : "") +
        '<div class="panel"><h2 style="font-size:1.3rem">Reuniões B2B</h2><p class="small" style="margin:0">Ao confirmar presença, indique o seu sector e o que procura. 48 horas antes do evento recebe por WhatsApp até 3 sugestões de pessoas com quem reunir.</p></div>' +
      '</div><aside class="side"><div class="panel">' +
        '<ul class="facts">' +
          '<li>' + IC.cal + '<span><b>' + esc(fmtDia.format(d)) + '</b><br>' + esc(fmtHora.format(d)) + " – " + esc(fmtHora.format(f)) + '</span></li>' +
          '<li>' + IC.pin + '<span><b>' + esc(e.local) + '</b><br>' + esc(e.cidade) + '</span></li>' +
          '<li>' + IC.tkt + '<span><b>' + esc(precoTxt(e)) + '</b>' + (e.preco > 0 ? '<br><span class="small">Pagamento por Multicaixa Express ou referência</span>' : "") + '</span></li>' +
          '<li>' + IC.ppl + '<span><b>' + ocupados(e) + " / " + e.vagas + '</b> lugares confirmados' + (full ? '<br><span class="small">Esgotado: inscrição em lista de espera</span>' : "") + '</span></li>' +
          '<li>' + IC.grp + '<span>Organizado por <a href="#/capitulo/' + c.id + '">' + esc(c.nome) + '</a></span></li>' +
        '</ul>' + acao +
        '<div class="btns" style="margin-top:10px"><a class="btn btn--ghost btn--sm" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(e.titulo + " — " + fmtDia.format(d) + " · " + location.href) + '">Partilhar no WhatsApp</a></div>' +
      '</div></aside></div>';
    var b = document.getElementById("rsvp"); if (b) b.addEventListener("click", function () { abrirInscricao(e); });
    var i = document.getElementById("ics"); if (i) i.addEventListener("click", function () { baixarIcs(e); });
  }

  function pgCapitulos() {
    main.innerHTML = '<div class="wrap page-head"><span class="kicker">Rede</span><h1>Capítulos</h1><p class="muted" style="max-width:620px">Cada capítulo é uma comunidade local ou temática, com organizadores próprios e encontros regulares. Não encontra a sua cidade? <a href="#/organizar">Crie um capítulo</a>.</p></div>' +
      '<div class="wrap"><div class="grid">' + D.capitulos.map(cardCapitulo).join("") + '</div></div>';
  }

  function pgCapitulo(id) {
    var c = byId(D.capitulos, id); if (!c) return pgNaoEncontrado();
    var ev = proximos().filter(function (e) { return e.capitulo === c.id; });
    var sou = membro(c.id);
    main.innerHTML = '<div class="wrap page-head"><div class="crumb"><a href="#/capitulos">Capítulos</a></div>' +
      '<span class="kicker">' + esc(tema(c.tema)) + " · " + esc(c.cidade) + '</span><h1>' + esc(c.nome) + '</h1>' +
      '<p class="muted" style="max-width:640px">' + esc(c.descricao) + '</p>' +
      '<div class="btns"><button class="btn' + (sou ? " btn--ghost" : "") + '" id="join" type="button">' + (sou ? "Sair do capítulo" : "Juntar-me ao capítulo") + '</button>' +
      '<span class="small" style="align-self:center">' + (c.membros + (sou ? 1 : 0)) + ' membros</span></div></div>' +
      '<section class="sec" style="padding-top:28px"><div class="wrap"><h2>Próximos eventos</h2>' + grade(ev.map(cardEvento)) + '</div></section>';
    document.getElementById("join").addEventListener("click", function () {
      if (membro(c.id)) S.capitulos.splice(S.capitulos.indexOf(c.id), 1);
      else {
        if (!S.perfil.nome) return abrirPerfil(function () { S.capitulos.push(c.id); save(); pgCapitulo(id); });
        S.capitulos.push(c.id);
      }
      save(); pgCapitulo(id);
    });
  }

  function pgOrganizar() {
    main.innerHTML = '<div class="wrap page-head"><span class="kicker">Organizar</span><h1>Leve o GiLF à sua cidade</h1>' +
      '<p class="muted" style="max-width:660px">Os capítulos são liderados por voluntários da rede, com o apoio da Luadeira Digital Angola: identidade GiLF, plataforma de inscrições, check-in, certificados e ligação aos parceiros.</p></div>' +
      '<section class="sec" style="padding-top:20px"><div class="wrap"><div class="steps">' +
        '<div class="step"><h3>Membro</h3><p class="small"><b>Gratuito.</b> Juntar-se a capítulos, confirmar presença, bilhete QR, pontos de liderança.</p></div>' +
        '<div class="step"><h3>Organizador de capítulo</h3><p class="small">Criar eventos, gerir inscrições e lista de espera, check-in, mensagens WhatsApp aos membros.</p></div>' +
        '<div class="step"><h3>Empresa / instituição</h3><p class="small">Capítulo próprio (associação, universidade, empresa), relatórios e marca no evento.</p></div>' +
        '<div class="step"><h3>Patrocinador</h3><p class="small">Patrocinar um capítulo ou uma série de encontros, com relatório de presenças e alcance.</p></div>' +
      '</div></div></section>' +
      '<section class="sec sec--soft"><div class="wrap detail" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))">' +
        '<div class="panel"><h2 style="font-size:1.3rem">Propor um evento</h2><form class="form" id="fEv">' +
          '<label>Título<input name="titulo" required></label>' +
          '<div class="row2"><label>Capítulo<select name="capitulo">' + D.capitulos.map(function (c) { return '<option value="' + c.id + '">' + esc(c.nome) + "</option>"; }).join("") + '</select></label>' +
          '<label>Tema<select name="tema">' + D.temas.map(function (t) { return '<option value="' + t.id + '">' + esc(t.nome) + "</option>"; }).join("") + '</select></label></div>' +
          '<div class="row2"><label>Data<input name="data" type="date" required></label><label>Vagas<input name="vagas" type="number" min="5" value="40"></label></div>' +
          '<label>Descrição<textarea name="descricao" required></textarea></label>' +
          '<button class="btn btn--wa" type="submit">Enviar proposta por WhatsApp</button></form></div>' +
        '<div class="panel"><h2 style="font-size:1.3rem">Criar um capítulo</h2><form class="form" id="fCap">' +
          '<div class="row2"><label>Cidade<input name="cidade" required></label><label>País<input name="pais" value="Angola"></label></div>' +
          '<label>Tema principal<select name="tema">' + D.temas.map(function (t) { return '<option value="' + t.id + '">' + esc(t.nome) + "</option>"; }).join("") + '</select></label>' +
          '<label>O seu nome<input name="nome" required value="' + esc(S.perfil.nome || "") + '"></label>' +
          '<label>Porque quer liderar este capítulo?<textarea name="motivo" required></textarea></label>' +
          '<button class="btn btn--wa" type="submit">Enviar candidatura por WhatsApp</button></form></div>' +
      '</div></section>';
    document.getElementById("fEv").addEventListener("submit", function (ev) {
      ev.preventDefault(); var f = new FormData(this);
      window.open(wa("Proposta de evento — GiLF Eventos\n\nTítulo: " + f.get("titulo") + "\nCapítulo: " + cap(f.get("capitulo")).nome + "\nTema: " + tema(f.get("tema")) + "\nData: " + f.get("data") + "\nVagas: " + f.get("vagas") + "\n\n" + f.get("descricao")), "_blank", "noopener");
    });
    document.getElementById("fCap").addEventListener("submit", function (ev) {
      ev.preventDefault(); var f = new FormData(this);
      window.open(wa("Candidatura a capítulo — GiLF Eventos\n\nCidade: " + f.get("cidade") + ", " + f.get("pais") + "\nTema: " + tema(f.get("tema")) + "\nNome: " + f.get("nome") + "\n\n" + f.get("motivo")), "_blank", "noopener");
    });
  }

  function pgConta() {
    var p = S.perfil;
    var ins = S.inscricoes.map(function (i) { return { i: i, e: byId(D.eventos, i.eventoId) }; }).filter(function (x) { return x.e; })
      .sort(function (a, b) { return dt(a.e.inicio) - dt(b.e.inicio); });
    main.innerHTML = '<div class="wrap page-head"><span class="kicker">A minha conta</span><h1>' + (p.nome ? "Olá, " + esc(p.nome.split(" ")[0]) : "A minha conta") + '</h1></div>' +
      '<div class="wrap detail"><div>' +
        '<div class="points"><b>' + pontos() + '</b><div><strong style="color:#f2dfab">Pontos de liderança</strong><br><span class="small" style="color:#a99c84">Presenças, capítulos e perfil completo. Os membros mais activos são indicados à Comissão dos Prémios Líderes Angola.</span></div></div>' +
        '<h2 style="font-size:1.3rem">Os meus bilhetes</h2>' +
        (ins.length ? ins.map(function (x) {
          var d = dt(x.e.inicio);
          return '<div class="ticket"><div><div class="tags" style="margin-bottom:6px"><span class="tag ' + (x.i.estado === "confirmado" ? "tag--ok" : "") + '">' + (x.i.estado === "confirmado" ? "Confirmado" : "Lista de espera") + '</span></div>' +
            '<h3><a href="#/evento/' + x.e.id + '">' + esc(x.e.titulo) + '</a></h3><div class="meta"><span>' + esc(fmtDia.format(d)) + ", " + esc(fmtHora.format(d)) + '</span><span>' + esc(x.e.local + ", " + x.e.cidade) + '</span></div>' +
            '<div class="code" style="margin:8px 0">' + esc(x.i.codigo) + '</div>' +
            '<div class="btns"><button class="btn btn--ghost btn--sm" data-ics="' + x.e.id + '">Calendário</button><button class="btn btn--ghost btn--sm" data-cancel="' + x.e.id + '">Cancelar</button></div></div>' +
            (x.i.estado === "confirmado" ? '<div class="qr" data-qr="' + esc(x.i.codigo + "|" + x.e.id) + '" role="img" aria-label="Código QR de entrada"></div>' : "") + "</div>";
        }).join("") : '<div class="empty">Ainda não tem inscrições. <a href="#/eventos">Ver eventos</a></div>') +
      '</div><aside class="side"><div class="panel"><h2 style="font-size:1.2rem">Perfil</h2>' +
        (p.nome ? '<p style="margin:0"><b>' + esc(p.nome) + '</b></p><p class="small">' + esc([p.cargo, p.organizacao].filter(Boolean).join(" · ")) + '<br>' + esc(p.telefone || "") + '<br>' + esc(p.sector || "") + '</p>' : '<p class="small">Complete o perfil para confirmar presenças mais rápido e receber sugestões de reuniões B2B.</p>') +
        '<button class="btn btn--ghost btn--sm" id="edit" type="button">' + (p.nome ? "Editar perfil" : "Criar perfil") + '</button>' +
        '<h3 style="margin-top:20px">Os meus capítulos</h3>' +
        (S.capitulos.length ? '<ul style="padding-left:18px;margin:0">' + S.capitulos.map(function (id) { var c = cap(id); return '<li><a href="#/capitulo/' + id + '">' + esc(c.nome) + "</a></li>"; }).join("") + "</ul>" : '<p class="small"><a href="#/capitulos">Junte-se a um capítulo</a></p>') +
        '<p class="note">Protótipo: os dados ficam guardados apenas neste browser.</p>' +
      '</div></aside></div>';
    document.getElementById("edit").addEventListener("click", function () { abrirPerfil(pgConta); });
    main.querySelectorAll("[data-ics]").forEach(function (b) { b.addEventListener("click", function () { baixarIcs(byId(D.eventos, b.dataset.ics)); }); });
    main.querySelectorAll("[data-cancel]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!confirm("Cancelar a inscrição? O lugar passa para a lista de espera.")) return;
        S.inscricoes = S.inscricoes.filter(function (i) { return i.eventoId !== b.dataset.cancel; }); save(); pgConta();
      });
    });
    desenharQRs(main);
  }

  function pgNaoEncontrado() { main.innerHTML = '<div class="wrap page-head"><h1>Página não encontrada</h1><p><a href="#/">Voltar ao início</a></p></div>'; }

  /* ---------- modais ---------- */
  function abrir(html) { mBody.innerHTML = html; modal.hidden = false; var f = mBody.querySelector("input,button"); if (f) f.focus(); }
  function fechar() { modal.hidden = true; mBody.innerHTML = ""; }
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest("[data-close]")) fechar(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) fechar(); });

  function camposPerfil(p) {
    return '<div class="row2"><label>Nome completo<input name="nome" required autocomplete="name" value="' + esc(p.nome || "") + '"></label>' +
      '<label>WhatsApp<input name="telefone" required type="tel" autocomplete="tel" placeholder="+244 9xx xxx xxx" value="' + esc(p.telefone || "") + '"></label></div>' +
      '<div class="row2"><label>Cargo<input name="cargo" value="' + esc(p.cargo || "") + '"></label><label>Organização<input name="organizacao" value="' + esc(p.organizacao || "") + '"></label></div>' +
      '<label>Sector<select name="sector">' + ["", "Banca e finanças", "Petróleo e energia", "Agricultura e agro-indústria", "Tecnologia", "Educação", "Saúde", "Construção e imobiliário", "Comércio e logística", "Sector público", "Outro"].map(function (s) { return '<option' + (s === (p.sector || "") ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + '</select></label>';
  }
  function lerPerfil(f) { ["nome", "telefone", "cargo", "organizacao", "sector"].forEach(function (k) { S.perfil[k] = (f.get(k) || "").trim(); }); }

  function abrirPerfil(depois) {
    abrir('<h2 id="mTitle" style="font-size:1.4rem">O seu perfil</h2><form class="form" id="fp">' + camposPerfil(S.perfil) + '<button class="btn" type="submit">Guardar</button></form>');
    document.getElementById("fp").addEventListener("submit", function (ev) { ev.preventDefault(); lerPerfil(new FormData(this)); save(); fechar(); if (depois) depois(); });
  }

  function abrirInscricao(e) {
    var full = cheio(e);
    abrir('<h2 id="mTitle" style="font-size:1.35rem">' + (full ? "Lista de espera" : "Confirmar presença") + '</h2><p class="small">' + esc(e.titulo) + '</p>' +
      '<form class="form" id="fr">' + camposPerfil(S.perfil) +
      '<label>O que procura neste evento? <span class="muted">(para as sugestões B2B)</span><select name="objectivo"><option>Networking</option><option>Encontrar investidores</option><option>Encontrar clientes</option><option>Encontrar parceiros ou fornecedores</option><option>Emprego ou talento</option><option>Aprender</option></select></label>' +
      '<label class="check"><input type="checkbox" name="b2b" checked> Quero receber sugestões de reuniões B2B</label>' +
      '<label class="check"><input type="checkbox" name="ok" required> Aceito receber a confirmação e os lembretes por WhatsApp</label>' +
      (e.preco > 0 ? '<p class="note">Evento pago (' + esc(kz(e.preco)) + '). Recebe por WhatsApp a referência para pagar por Multicaixa Express. O bilhete fica válido após o pagamento.</p>' : "") +
      (e.oficial ? '<p class="note">Este é o evento oficial GiLF: a inscrição aqui regista o seu interesse; a Comissão Organizadora confirma o bilhete.</p>' : "") +
      '<button class="btn" type="submit">' + (full ? "Entrar na lista de espera" : "Confirmar") + '</button></form>');
    document.getElementById("fr").addEventListener("submit", function (ev) {
      ev.preventDefault(); var f = new FormData(this); lerPerfil(f);
      var ins = { eventoId: e.id, codigo: codigo(), estado: full ? "espera" : "confirmado", objectivo: f.get("objectivo"), b2b: !!f.get("b2b"), criado: new Date().toISOString() };
      S.inscricoes.push(ins);
      if (S.capitulos.indexOf(e.capitulo) < 0) S.capitulos.push(e.capitulo);
      save(); sucesso(e, ins);
    });
  }

  function sucesso(e, ins) {
    var ok = ins.estado === "confirmado", d = dt(e.inicio);
    var msg = (ok ? "Confirmo a minha presença" : "Inscrevi-me na lista de espera") + " — GiLF Eventos\n\n" + e.titulo + "\n" + fmtDia.format(d) + ", " + fmtHora.format(d) + "\n" + e.local + ", " + e.cidade + "\n\nNome: " + S.perfil.nome + "\nCódigo: " + ins.codigo;
    abrir('<div class="okmark">✓</div><h2 id="mTitle" style="font-size:1.35rem">' + (ok ? "Presença confirmada" : "Está na lista de espera") + '</h2>' +
      '<p class="small">' + (ok ? "O seu bilhete está em «A minha conta». Apresente o código QR à entrada." : "Avisamos por WhatsApp se abrir uma vaga.") + '</p>' +
      (ok ? '<div style="display:flex;gap:14px;align-items:center;margin:12px 0"><div class="qr" data-qr="' + esc(ins.codigo + "|" + e.id) + '"></div><div class="code">' + esc(ins.codigo) + '</div></div>' : '<p class="code">' + esc(ins.codigo) + '</p>') +
      '<div class="btns"><a class="btn btn--wa" target="_blank" rel="noopener" href="' + wa(msg) + '">Enviar por WhatsApp</a><button class="btn btn--ghost" id="ics2" type="button">Calendário</button></div>');
    document.getElementById("ics2").addEventListener("click", function () { baixarIcs(e); });
    desenharQRs(mBody);
    route();
  }

  function desenharQRs(root) {
    root.querySelectorAll("[data-qr]").forEach(function (el) {
      try {
        var q = window.qrcode(0, "M"); q.addData(el.dataset.qr); q.make();
        el.innerHTML = q.createSvgTag({ cellSize: 3, margin: 0, scalable: true });
      } catch (x) { el.textContent = el.dataset.qr.split("|")[0]; }
    });
  }

  function baixarIcs(e) {
    function f(s) { var d = dt(s); function p(n) { return (n < 10 ? "0" : "") + n; } return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "T" + p(d.getHours()) + p(d.getMinutes()) + "00"; }
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GiLF Eventos//PT", "BEGIN:VEVENT", "UID:" + e.id + "@gilfeventos",
      "DTSTART:" + f(e.inicio), "DTEND:" + f(e.fim || e.inicio), "SUMMARY:" + e.titulo.replace(/[,;]/g, "\\$&"),
      "LOCATION:" + (e.local + ", " + e.cidade).replace(/[,;]/g, "\\$&"), "DESCRIPTION:" + e.descricao.replace(/[,;]/g, "\\$&"), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = e.id + ".ics"; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- router ---------- */
  function route() {
    var h = location.hash.replace(/^#\/?/, ""), parts = h.split("?"), seg = parts[0].split("/"), qs = {};
    (parts[1] || "").split("&").forEach(function (kv) { if (!kv) return; var p = kv.split("="); qs[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ""); });
    document.querySelectorAll("[data-nav]").forEach(function (a) { a.classList.toggle("on", a.dataset.nav === seg[0] || (seg[0] === "evento" && a.dataset.nav === "eventos") || (seg[0] === "capitulo" && a.dataset.nav === "capitulos")); });
    switch (seg[0]) {
      case "": pgInicio(); break;
      case "eventos": pgEventos(qs); break;
      case "evento": pgEvento(seg[1]); break;
      case "capitulos": pgCapitulos(); break;
      case "capitulo": pgCapitulo(seg[1]); break;
      case "organizar": pgOrganizar(); break;
      case "conta": pgConta(); break;
      default: pgNaoEncontrado();
    }
  }
  window.addEventListener("hashchange", function () { fechar(); route(); window.scrollTo(0, 0); });
  document.getElementById("demo").hidden = !D.demo;
  document.getElementById("fMarca").textContent = D.org.marca;
  document.getElementById("fWa").href = "https://wa.me/" + D.org.whatsapp;
  route();
})();
