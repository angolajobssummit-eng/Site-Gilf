# GiLF Angola 2026 — site oficial

**Fórum Global de Investimento e Liderança** + **Gala de Premiação Prémios Líderes Angola 2026**
17 de Dezembro de 2026 · Hotel EPIC SANA, Luanda · www.gilf-angola.com

Site estático (HTML/CSS/JS, sem servidor) com **área administrativa** que publica directamente no repositório.

## Páginas
| Página | Conteúdo |
|---|---|
| `index.html` | Início: keynotes, painéis, nomeados, organização, parceiros, contagem decrescente |
| `programa.html` | Programa do Fórum e da Gala, com moderadores, oradores e temas |
| `oradores.html` | Oradores e moderadores (filtros, pesquisa, perfis) |
| `premios.html` | Prémios Líderes Angola: categorias e nomeados |
| `parceiros.html` | Logótipos por grupo + pacotes de patrocínio + pedido de dossiê |
| `bilhetes.html` | Tipos de bilhete + reserva por WhatsApp/e-mail + mapa |
| `sobre.html` | O fórum, o fundador, percurso e iniciativas |
| `contacto.html` | Contactos, sala de imprensa e perguntas frequentes |
| `admin/` | **Área administrativa** (não indexada) |

## Área administrativa (`/admin/`)
- **Entrar** com uma chave de acesso GitHub (fine-grained token, só para este repositório, permissão *Contents: Read and write*). As instruções estão no ecrã de login.
- Gerir: evento, programa (sessões, moderadores, oradores), oradores e pessoas (com fotografia), prémios (categorias, nomeados, vencedores), parceiros (logótipos), bilhetes, patrocínio, organização e FAQ.
- **Pré-visualizar** antes de publicar · **Publicar** cria um único commit (`assets/dados.js` + imagens novas) · **Histórico de versões** permite restaurar versões anteriores.
- Painel com verificação automática de conteúdos (referências partidas, pessoas sem foto, painéis sem moderador…).
- Rascunhos guardados automaticamente no browser.

## Publicação (GitHub Pages)
Settings → Pages → *Deploy from a branch* → branch `claude/gilf-angola-dubai-site-wo7caz`, pasta `/ (root)`.
Depois de cada publicação no admin, o site actualiza em poucos minutos.

## Estrutura
- `assets/dados.js` — todo o conteúdo (gerido pelo admin)
- `assets/css/site.css`, `assets/js/site.js` — site público
- `admin/` — área administrativa
- `assets/img/pessoas/`, `assets/img/logos/` — fotografias e logótipos
