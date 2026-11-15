# GiLF Angola 2026 — site oficial

**Fórum Global de Investimento e Liderança** + **Gala de Premiação Prémios Líderes Angola 2026**
17 de Dezembro de 2026 · Hotel EPIC SANA, Luanda · www.gilf-angola.com

Site estático (HTML/CSS/JS, sem servidor nem base de dados). Pode ser alojado no GitHub Pages, Netlify ou em qualquer alojamento web.

## Páginas
| Ficheiro | Conteúdo |
|---|---|
| `index.html` | Início: destaque, contagem decrescente, temas, oradores, programa, Gala, parceiros |
| `forum.html` | Fórum e programa completo (manhã + Gala), com moderadores e oradores por sessão |
| `oradores.html` | Oradores e moderadores (filtros, pesquisa, perfil) + candidatura a orador |
| `gala.html` | Gala Prémios Líderes Angola: programa 19h–22h, categorias, nomeações |
| `parceiros.html` | Logótipos por grupo + pacotes de patrocínio + pedido de proposta |
| `inscricao.html` | Ingressos e formulário de reserva + mapa |
| `contacto.html` | Contactos, sala de imprensa (cartazes para download), FAQ |
| `admin.html` | **Gestor de Conteúdos** (não indexado pelos motores de busca) |

## Adicionar oradores, moderadores e sessões
1. Abra `admin.html` no site (ex.: www.gilf-angola.com/admin.html).
2. Adicione pessoas (com foto — recortada automaticamente) e atribua-as às sessões do programa.
3. **Pré-visualizar site** mostra o resultado antes de publicar.
4. **Descarregar dados.js** (+ **Descarregar fotos novas**).
5. No GitHub: envie `dados.js` para `assets/` e as fotos para `assets/img/oradores/`.

Todo o conteúdo editável (evento, oradores, programa, prémios, ingressos, parceiros) está em `assets/dados.js`.

## Formulários
Inscrição, nomeações, candidaturas, patrocínio e contacto abrem uma mensagem pronta no e-mail
ou no WhatsApp da organização (+244 922 812 224) — não é preciso servidor.

## Estrutura
- `assets/css/site.css` — design
- `assets/js/site.js` — cabeçalho/rodapé, oradores, programa, parceiros, formulários
- `assets/img/logos/` — logótipos (extraídos dos cartazes oficiais)
- `assets/img/oradores/` — fotos dos oradores
