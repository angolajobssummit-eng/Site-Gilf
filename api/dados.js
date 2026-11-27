// Conteúdo público do site, lido da base de dados (edição actual publicada).
// Se a base de dados falhar, a página carrega o ficheiro de reserva assets/dados.js.
const URL_DB = "https://sohducskrepqpsbrxwgr.supabase.co/rest/v1/rpc/forum_site";
const CHAVE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaGR1Y3NrcmVwcXBzYnJ4d2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0ODc5ODksImV4cCI6MjExMTA2Mzk4OX0.-YSWoI851LXBnKXKQB8FYvCFIkEdYb9mVz8fZl1Q3i0"; // chave pública (anon), só lê conteúdo publicado

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  const slug = String((req.query && req.query.e) || "").replace(/[^a-z0-9-]/g, "").slice(0, 60);
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 4000);
    const r = await fetch(URL_DB, { method: "POST", signal: ctl.signal, headers: { apikey: CHAVE, Authorization: "Bearer " + CHAVE, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: slug || null }) });
    clearTimeout(t);
    const d = r.ok ? await r.json() : null;
    if (!d || !d.evento) throw new Error("sem conteúdo");
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=600");
    res.status(200).send("window.GILF = " + JSON.stringify(d).replace(/</g, "\\u003c") + ";\nwindow.GILF_FONTE = 'base-de-dados';\n");
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send("/* base de dados indisponível: usar ficheiro de reserva */\n");
  }
};
