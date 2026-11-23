# GiLF Eventos

**A rede de encontros de líderes, investidores, empreendedores e da diáspora angolana. Um projecto Luadeira Digital Angola, extensão do GiLF.**

O GiLF Angola acontece uma vez por ano. O GiLF Eventos mantém a comunidade activa o ano todo, com **capítulos** locais e temáticos que organizam encontros regulares. Inspira-se no Meetup e foi adaptado a Angola.

> Este é um projecto independente do site `gilf-angola.com`. Está nesta pasta apenas até ter um repositório próprio: basta copiar a pasta `gilfeventos/` para um repositório novo.

## O que o protótipo já faz
- **Início:** pesquisa por tema e cidade, próximos eventos, capítulos e "como funciona".
- **Eventos:** filtros por cidade, tema e preço; barra de lugares ocupados; marcação de esgotado.
- **Página do evento:** data, local, preço em Kz, programa, organizador, partilha no WhatsApp.
- **Confirmar presença:** perfil, objectivo do participante (para reuniões B2B), consentimento WhatsApp.
  - Com lugares: bilhete com **código QR** e código `GE-XXXXXX`.
  - Esgotado: **lista de espera** automática.
  - Evento pago: aviso de pagamento por **Multicaixa Express**.
  - Confirmação enviada pelo **WhatsApp** e evento adicionado ao **calendário** (.ics).
- **Capítulos:** juntar-se e sair, lista de membros e eventos do capítulo.
- **Organizar:** planos (membro, organizador, empresa, patrocinador) e formulários para propor um evento ou criar um capítulo, enviados por WhatsApp.
- **A minha conta:** bilhetes com QR, cancelar, capítulos e **pontos de liderança**.

Limitações do protótipo: as inscrições ficam guardadas só no browser de cada pessoa, e os eventos que não são o GiLF Angola 2026 são exemplos (`dados.js`).

## Correr localmente
```bash
cd gilfeventos
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
