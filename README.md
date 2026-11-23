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

## Dois modos
- **Modo real**: com `config.js` preenchido, usa o Supabase. Há contas com email e palavra-passe, os dados são partilhados por todos e as regras de segurança são aplicadas na base de dados.
- **Modo demonstração**: com `config.js` vazio, os dados de exemplo ficam guardados no browser e a primeira conta criada fica administradora.

**Para publicar, siga [`PUBLICAR.md`](PUBLICAR.md).**

## Correr localmente
```bash
python3 -m http.server 8000   # na raiz do projecto; abrir http://localhost:8000
```

## Estrutura
| Ficheiro | Função |
|---|---|
| `index.html` | Estrutura da página |
| `app.css` | Estilo (identidade GiLF, modo escuro, telemóvel) |
| `app.js` | Interface: site público, conta, organizadores (inscrições e check-in) e administração |
| `api.js` | Dados: Supabase (modo real) ou browser (modo demonstração) |
| `config.js` | URL e chave pública do Supabase |
| `schema.sql` | Base de dados, regras de segurança, lista de espera, funções de administração |
| `dados.js` | Categorias, cidades e dados de demonstração |
| `vendor/` | Bibliotecas: gerador de QR (MIT) e cliente Supabase (MIT) |
| `PUBLICAR.md` | Guia de publicação passo a passo |
