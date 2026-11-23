# Publicar o GiLF Eventos (≈ 20 minutos)

São precisas duas contas gratuitas:
- **Supabase**: base de dados e contas de utilizador.
- **Vercel**: alojamento do site.

Não precisa de programar.

---

## 1. Base de dados — Supabase
1. Entre em **supabase.com** → *Start your project* → crie uma conta (pode usar o GitHub).
2. **New project**:
   - Nome: `gilf-eventos`.
   - Região: **West EU (Ireland)** ou **Central EU (Frankfurt)**, as mais próximas de Angola.
   - Defina uma palavra-passe da base de dados e guarde-a.
3. Quando o projecto estiver pronto (1–2 min): menu **SQL Editor** → **New query** → cole **todo** o conteúdo de `schema.sql` → **Run**. Deve aparecer "Success".
4. Menu **Project Settings → API**. Copie:
   - **Project URL**, por exemplo `https://abcd1234.supabase.co`;
   - **anon public key**, um texto longo que começa por `eyJ…`.

   ⚠️ **Não** use a chave `service_role`: essa é secreta.
5. Abra o ficheiro `config.js` e cole os dois valores:
   ```js
   window.GE_CONFIG = {
     supabaseUrl: "https://abcd1234.supabase.co",
     supabaseAnonKey: "eyJ..."
   };
   ```
   Guarde e envie para o GitHub (ou peça ao Claude para o fazer).

## 2. Site — Vercel
1. Entre em **vercel.com** com a conta GitHub → **Add New → Project**.
2. Escolha o repositório e a branch onde está o GiLF Eventos.
   - Se usar este mesmo repositório (`site-gilf`): em **Settings → Git → Production Branch**, escreva `ccr-c757c10b-w79e5s`.
   - Melhor: crie um repositório próprio, por exemplo `gilf-eventos`, e peça ao Claude para enviar o projecto para lá.
3. **Framework Preset: Other** · sem *Build Command* · **Deploy**.
4. Fica com um endereço como `https://gilf-eventos.vercel.app`.
5. (Opcional) **Settings → Domains** → `eventos.gilf-angola.com`, e siga as instruções de DNS.

## 3. Ligar o login ao endereço do site
No Supabase: **Authentication → URL Configuration**:
- **Site URL**: `https://gilf-eventos.vercel.app` (ou o seu domínio).
- **Redirect URLs**: acrescente `https://gilf-eventos.vercel.app/**`.

Sem isto, os links dos emails de confirmação e de recuperação de palavra-passe não abrem o site.

## 4. Tornar-se administrador
1. Abra o site e **registe-se** com o seu email. Confirme o email no link que recebe.
2. No Supabase → **SQL Editor** → corra, com o **seu** email:
   ```sql
   update perfis set papel = 'admin'
   where id = (select id from auth.users where email = 'o-seu-email@exemplo.com');
   ```
3. Saia e volte a entrar no site. Aparece **Administração** no topo.

A partir daí, dá acesso de administrador a outras pessoas em **Administração → Utilizadores**, sem SQL.

## 5. Emails (importante antes de abrir ao público)
O serviço de email incluído no Supabase envia **poucos emails por hora** e serve só para testes.

Para produção:
1. Crie uma conta num serviço de email, por exemplo **Brevo** ou **Resend** (ambos têm plano gratuito).
2. No Supabase → **Project Settings → Authentication → SMTP Settings**, preencha os dados desse serviço. Remetente sugerido: `eventos@gilf-angola.com`.
3. Em **Authentication → Email Templates**, traduza os textos dos emails para português.

---

## O que a área de administração faz
| Secção | Para quê |
|---|---|
| **Resumo** | Números da plataforma, grupos à espera de aprovação, próximos eventos |
| **Grupos** | Aprovar, rejeitar, destacar na página inicial, editar, apagar, nomear organizadores |
| **Eventos** | Todos os eventos (próximos e passados): editar, cancelar, marcar como oficial, criar para qualquer grupo |
| **Utilizadores** | Pesquisar membros, ver participações e presenças, dar ou tirar acesso de administrador, exportar CSV |
| **Moderação** | Apagar comentários e publicações |
| **Inscrições e check-in** (em cada evento) | Lista de inscritos com contactos, lista de espera, check-in por código ou câmara (QR), exportar CSV |

Os **organizadores** de cada grupo também criam e editam os eventos do seu grupo e fazem o check-in. Não vêem o resto da administração.

## Regras automáticas (já incluídas na base de dados)
- Os grupos criados por membros ficam **em análise** até um administrador aprovar.
- Quando o evento enche, as novas inscrições vão para a **lista de espera**. Se alguém cancelar, o lugar passa logo à primeira pessoa da lista.
- Cada pessoa só vê os seus próprios bilhetes. Os contactos dos inscritos só são visíveis para os organizadores do grupo e para os administradores.
- Só administradores podem marcar eventos como **oficiais**, aprovar grupos ou mudar papéis.

## Ainda não incluído (próximas fases)
- Mensagens automáticas por **WhatsApp**. Hoje, os botões abrem o WhatsApp com a mensagem pronta.
- **Pagamento online** Multicaixa Express. Hoje, o evento mostra o preço e a organização envia a referência.
- Fotografias de capa próprias para grupos e eventos. Hoje, as capas são geradas pela categoria.
- Certificados em PDF e sugestões B2B automáticas.
