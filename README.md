# GiLF Eventos

**A rede de encontros de líderes, investidores, empreendedores e da diáspora angolana. Um projecto Luadeira Digital Angola, extensão do GiLF.**

O GiLF Angola acontece uma vez por ano. O GiLF Eventos mantém a comunidade activa o ano todo, com **capítulos** locais e temáticos que organizam encontros regulares. Inspira-se no Meetup e foi adaptado a Angola.

> Projecto independente do site `gilf-angola.com`. Esta branch contém só o GiLF Eventos; o site do fórum continua na sua própria branch, sem alterações.

## O que o protótipo já faz
Funciona como o Meetup, com marca própria e adaptado a Angola.
- **Início:** eventos perto da sua cidade, eventos online, categorias, grupos populares, "como funciona", cidades populares.
- **Pesquisa:** separadores Eventos/Grupos; filtros por dia (hoje, amanhã, fim de semana, semana), tipo, cidade, categoria e preço; calendário com os dias que têm eventos.
- **Página do evento:** organizador, detalhes, participantes, comentários, local com link para o mapa, calendário (.ics), partilha no WhatsApp, eventos semelhantes, barra fixa "Participar".
- **Participar:** bilhete com código QR, lista de espera quando esgota, aviso de pagamento Multicaixa Express, objectivo para reuniões B2B, confirmação por WhatsApp. Junta automaticamente ao grupo.
- **Página do grupo:** separadores Sobre / Eventos (próximos e passados) / Membros / Discussões; juntar-se, sair, convidar por WhatsApp.
- **Criar grupo:** assistente em 5 passos (cidade, temas, nome, descrição, regras). O grupo fica "em análise pela Luadeira".
- **Criar evento:** organizadores marcam eventos (presencial ou online, lugares, preço em Kz, certificado).
- **Conta:** registo/entrada, bilhetes com QR, grupos, perfil e pontos de liderança.

Limitações do protótipo: conta e dados ficam guardados só no browser de cada pessoa; excepto o GiLF Angola 2026, grupos, pessoas e eventos são fictícios (`dados.js`).

## Correr localmente
```bash
python3 -m http.server 8000   # abrir http://localhost:8000
```
Não depende de serviços externos além das Google Fonts: o gerador de QR está em `vendor/`.

## Estrutura
| Ficheiro | Função |
|---|---|
| `index.html` | Estrutura da página |
| `app.css` | Estilo (identidade GiLF, modo escuro, telemóvel) |
| `app.js` | Páginas, inscrições, QR, calendário, WhatsApp |
| `dados.js` | Capítulos e eventos de demonstração |
| `schema.sql` | Base de dados para o MVP (Supabase) |
| `vendor/qrcode.js` | Gerador de QR (MIT, Kazuhiko Arase) |

## Próximas fases
1. **MVP (6–8 semanas):** Supabase com login por telefone, base de dados (`schema.sql`), painel do organizador e **check-in por câmara** a ler o QR.
2. **WhatsApp Business API:** confirmações, lembretes 24 horas antes, aviso de vaga na lista de espera.
3. **Pagamentos:** Multicaixa Express e referência bancária (por exemplo, via ProxyPay ou EMIS GPO).
4. **Reuniões B2B:** sugestões automáticas por sector e objectivo, enviadas 48 horas antes.
5. **Certificados digitais** com código de verificação e **relatórios para patrocinadores**.
6. **Ligação ao GiLF:** perfis verificados de oradores e premiados; os pontos de liderança passam a contar para as candidaturas aos Prémios Líderes Angola.
