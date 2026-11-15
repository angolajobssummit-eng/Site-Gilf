(function () {
  "use strict";

  var EVENT_DATE = new Date("2026-12-17T08:00:00+01:00"); // Luanda (WAT, UTC+1)
  var EMAIL = "angolajobssummit@gmail.com";
  var WHATSAPP = "244922812224";

  /* ---------- i18n ---------- */
  var EN = {
    "nav.about": "About", "nav.corridor": "Angola–Dubai", "nav.program": "Programme", "nav.awards": "Awards", "nav.partners": "Partners", "nav.cta": "Register",
    "hero.eyebrow": "Luanda · 17 December 2026 · EPIC SANA",
    "hero.t1": "Global Investment", "hero.t2": "& Leadership Forum",
    "hero.theme": "Connecting Angola to the World. Inspiring Leadership. Creating Impact.",
    "hero.lead": "One day linking Luanda and Dubai: the Investment Forum in the morning and the Angola Leaders Awards Gala in the evening — decision-makers, investors and institutions in one room.",
    "hero.cta1": "Secure my seat", "hero.cta2": "Become a partner / sponsor",
    "cd.d": "days", "cd.h": "hours", "cd.m": "min", "cd.s": "sec",
    "facts.date": "December 2026", "facts.moments": "moments: Forum & Gala", "facts.corridor": "Angola–Dubai corridor", "facts.venue": "Luanda, Angola",
    "about.kicker": "About GiLF", "about.title": "Where Angolan leadership meets global capital",
    "about.p1": "GiLF Angola — Global Investment & Leadership Forum — brings together business leaders, executives, public and private institutions, experts, investors, academics and professionals from Angola's strategic economic sectors.",
    "about.p2": "The 2026 edition has a clear focus: bringing Angola closer to the Gulf, and Dubai in particular — one of the world's leading hubs for trade, logistics and investment — and creating concrete links for business, financing and partnerships.",
    "about.l1": "Panels with public and private decision-makers", "about.l2": "Networking sessions and B2B meetings", "about.l3": "Recognition of the leaders transforming Angola",
    "cor.kicker": "The Angola–Dubai Corridor", "cor.title": "Two economies, one bridge of opportunity",
    "cor.sub": "Angola offers resources, a growing market and a diversifying economy. Dubai offers capital, logistics and access to over 2 billion consumers. GiLF connects the two.",
    "cor.c1t": "Energy & Resources", "cor.c1p": "Oil, gas, renewables and mining — value chains that need investment and international know-how.",
    "cor.c2t": "Logistics & Trade", "cor.c2p": "Ports, transport and supply chains: the Lobito Corridor and Gulf routes as engines of regional integration.",
    "cor.c3t": "Agribusiness", "cor.c3p": "Food security, agro-industry and exports — fertile land in Angola, markets and capital in the Gulf.",
    "cor.c4t": "Finance & Investment", "cor.c4p": "Banking, sovereign funds, private equity and project finance to grow Angolan companies.",
    "cor.c5t": "Technology & Innovation", "cor.c5p": "Digital transformation, startups and the creative economy — from Luanda's ecosystem to Dubai's.",
    "cor.c6t": "Tourism & Real Estate", "cor.c6p": "Hospitality, infrastructure and urban development inspired by the Gulf's success stories.",
    "prog.kicker": "Programme · 17 December", "prog.title": "One day, two landmark moments",
    "prog.tab1": "☀ Morning · Forum", "prog.tab2": "✦ Evening · Gala",
    "am.1t": "Registration & welcome", "am.1p": "Guest arrival, coffee and networking.",
    "am.2t": "Opening session", "am.2p": "Institutional remarks and presentation of the theme “Connecting Angola to the World”.",
    "am.3t": "Keynote · Angola–Dubai", "am.3p": "Trade and investment opportunities between Angola and the United Arab Emirates.",
    "am.4t": "Panel I · Investment & Finance", "am.4p": "Banks, funds and instruments to finance growth.",
    "am.5t": "Panel II · Logistics, Energy & Diversification", "am.5p": "Strategic value chains and regional integration.",
    "am.6t": "Panel III · Leadership, Human Capital & Innovation", "am.6p": "Skills, entrepreneurship and digital transformation.",
    "am.7t": "Lunch & B2B meetings", "am.7p": "Business meetings between companies, investors and institutions.",
    "pm.1t": "Red carpet", "pm.1p": "Guest arrival, photography and welcome cocktail.",
    "pm.2t": "Gala opening", "pm.2p": "Message from the Organising Committee and cultural performance.",
    "pm.3t": "Gala dinner", "pm.3p": "Dinner with live music.",
    "pm.4t": "Angola Leaders Awards 2026 ceremony", "pm.4p": "Presentation of awards to the distinguished personalities and institutions.",
    "pm.5t": "Networking & close", "pm.5p": "Final toast and reception.",
    "prog.note": "Provisional programme, subject to change. The final version will be published on this page.",
    "aw.kicker": "Gala · Angola Leaders Awards 2026", "aw.title": "Celebrating those leading Angola's transformation",
    "aw.p": "The Angola Leaders Awards honour personalities, companies and institutions that stand out for their vision, impact and contribution to the country's development and international standing.",
    "aw.cta": "Nominate someone",
    "aw.1": "Business Leader of the Year", "aw.2": "Investment & Internationalisation", "aw.3": "Women in Leadership", "aw.4": "Young Entrepreneur",
    "aw.5": "Innovation & Digital Transformation", "aw.6": "Social Responsibility", "aw.7": "Public Sector Leadership", "aw.8": "Lifetime Achievement",
    "who.kicker": "Who attends", "who.title": "A room full of decision-makers",
    "who.1": "CEOs and board members", "who.2": "Investors and funds", "who.3": "Government and public institutions", "who.4": "Chambers of commerce",
    "who.5": "Banking and insurance", "who.6": "Diplomacy and cooperation", "who.7": "Academia and training", "who.8": "Entrepreneurs and startups", "who.9": "Press and media",
    "pa.kicker": "Sponsorship & Partnerships", "pa.title": "Put your brand on the Angola–Dubai bridge",
    "pa.sub": "Visibility with decision-makers, a voice on the panels and privileged access to the Gala. Packages tailored to your goals.",
    "pa.t1": "Institutional Partner", "pa.t1a": "Logo on institutional communications", "pa.t1b": "Technical participation in the Forum", "pa.t1c": "Networking invitations",
    "pa.feat": "Most popular", "pa.t2": "Gold Sponsor", "pa.t2a": "Speaker on a Forum panel", "pa.t2b": "Brand on stage, screens and materials", "pa.t2c": "Table at the Awards Gala", "pa.t2d": "Arranged B2B meetings",
    "pa.t3": "Main Sponsor", "pa.t3a": "Naming of a panel or award category", "pa.t3b": "Speech at the opening or Gala", "pa.t3c": "Maximum visibility across all channels", "pa.t3d": "VIP table and access to delegations",
    "pa.ask": "Request proposal", "pa.media": "Press and media: accreditation requests via the official contact.",
    "reg.kicker": "Registration", "reg.title": "Reserve your seat",
    "reg.p": "Seats are limited. Fill in the form and the Organising Committee will get back to you with confirmation and participation details.",
    "reg.venue": "Venue", "reg.map": "View on map →",
    "f.name": "Full name", "f.org": "Company / Institution", "f.role": "Position", "f.country": "Country", "f.phone": "Phone / WhatsApp",
    "f.type": "Participation type", "f.o1": "Forum (morning)", "f.o2": "Gala (evening)", "f.o3": "Forum + Gala", "f.o4": "Sponsorship / Partnership", "f.o5": "Press", "f.o6": "Dubai / UAE delegation",
    "f.msg": "Message (optional)", "f.send": "Send by e-mail", "f.wa": "Send via WhatsApp",
    "faq.title": "Frequently asked questions",
    "faq.q1": "When and where does GiLF take place?", "faq.a1": "On 17 December 2026 at the EPIC SANA Hotel in Luanda. The Forum runs in the morning and the Angola Leaders Awards Gala in the evening.",
    "faq.q2": "Why Angola–Dubai?", "faq.a2": "Dubai is one of the world's leading centres for trade, logistics and investment. GiLF aims to build a lasting bridge between Angolan companies and institutions and the UAE ecosystem.",
    "faq.q3": "Can I attend only the Gala or only the Forum?", "faq.a3": "Yes. In the registration form you can choose the Forum, the Gala or both.",
    "faq.q4": "How can I sponsor or partner?", "faq.a4": "Contact the Organising Committee by e-mail or WhatsApp and we will send you the sponsorship proposal and visibility benefits.",
    "faq.q5": "What language is the event in?", "faq.a5": "The main language is Portuguese, with English sessions and support for international delegations.",
    "ct.kicker": "Contact", "ct.title": "Talk to the Organising Committee",
    "ct.p": "Luadeira Digital Angola & JLDI — organisers of GiLF Angola and the Angola Leaders Awards.",
    "ct.tel": "Phone", "ct.web": "Angola Leaders Awards",
    "ft.org": "Organised by Luadeira Digital Angola & JLDI"
  };

  var nodes = document.querySelectorAll("[data-i18n]");
  var PT = {};
  nodes.forEach(function (el) { PT[el.getAttribute("data-i18n")] = el.innerHTML; });

  var lang = "pt";
  var saved = null;
  try { saved = localStorage.getItem("gilf-lang"); } catch (e) {}
  if (saved === "en" || saved === "pt") lang = saved;
  else if (/^en\b/i.test(navigator.language || "")) lang = "en";
  var langBtn = document.getElementById("langBtn");

  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function setLang(l) {
    lang = l;
    nodes.forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      el.innerHTML = l === "en" && EN[k] ? esc(EN[k]) : PT[k];
    });
    document.documentElement.lang = l;
    langBtn.textContent = l === "en" ? "PT" : "EN";
    try { localStorage.setItem("gilf-lang", l); } catch (e) {}
  }
  langBtn.addEventListener("click", function () { setLang(lang === "en" ? "pt" : "en"); });
  if (lang === "en") setLang("en");

  /* ---------- nav ---------- */
  var nav = document.querySelector(".nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 30); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.add("is-scrolled");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- countdown ---------- */
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function tick() {
    var diff = Math.max(0, EVENT_DATE - new Date());
    var s = Math.floor(diff / 1000);
    document.getElementById("cd-d").textContent = Math.floor(s / 86400);
    document.getElementById("cd-h").textContent = pad(Math.floor(s % 86400 / 3600));
    document.getElementById("cd-m").textContent = pad(Math.floor(s % 3600 / 60));
    document.getElementById("cd-s").textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- tabs ---------- */
  var tabs = document.querySelectorAll(".tab");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.toggle("is-active", x === t); x.setAttribute("aria-selected", String(x === t)); });
      document.querySelectorAll(".timeline").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== t.getAttribute("data-tab"); });
    });
  });

  /* ---------- reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- form ---------- */
  var form = document.getElementById("regForm");
  var status = document.getElementById("formStatus");
  var via = "email";
  form.querySelectorAll("button[type=submit]").forEach(function (b) {
    b.addEventListener("click", function () { via = b.getAttribute("data-via"); });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      status.textContent = lang === "en" ? "Please fill in your name and a valid e-mail." : "Por favor preencha o nome e um e-mail válido.";
      return;
    }
    var d = new FormData(form);
    var labels = lang === "en"
      ? { nome: "Name", empresa: "Company", cargo: "Position", pais: "Country", email: "E-mail", telefone: "Phone", tipo: "Participation", mensagem: "Message" }
      : { nome: "Nome", empresa: "Empresa", cargo: "Cargo", pais: "País", email: "E-mail", telefone: "Telefone", tipo: "Participação", mensagem: "Mensagem" };
    var lines = [lang === "en" ? "GiLF Angola–Dubai 2026 — Registration" : "GiLF Angola–Dubai 2026 — Inscrição", ""];
    Object.keys(labels).forEach(function (k) { var v = (d.get(k) || "").toString().trim(); if (v) lines.push(labels[k] + ": " + v); });
    var body = lines.join("\n");
    if (via === "wa") {
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(body), "_blank", "noopener");
    } else {
      var subject = (lang === "en" ? "Registration GiLF 2026 — " : "Inscrição GiLF 2026 — ") + d.get("nome");
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }
    status.textContent = lang === "en" ? "Thank you! Your message is ready to send." : "Obrigado! A sua mensagem está pronta a enviar.";
  });
})();
