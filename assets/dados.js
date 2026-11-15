/* =====================================================================
   GiLF ANGOLA 2026 — FICHEIRO DE CONTEÚDOS
   ---------------------------------------------------------------------
   Todo o conteúdo dinâmico do site está aqui: oradores, moderadores,
   programa, prémios, ingressos e parceiros.

   Forma mais fácil de editar: abrir  admin.html  no browser
   (Gestor de Conteúdos), fazer as alterações e descarregar o novo
   dados.js, que substitui este ficheiro.

   Também pode editar à mão. Regras:
   - Cada texto vai entre aspas "assim".
   - Separe os itens com vírgulas.
   - Fotos de oradores: coloque o ficheiro em assets/img/oradores/
     (quadrado, ~600x600 px) e escreva o caminho no campo "foto".
   ===================================================================== */
window.GILF = {
  "evento": {
    "nome": "GiLF Angola 2026",
    "nomeCompleto": "Fórum Global de Investimento e Liderança",
    "tema": "Conectando Angola ao Mundo. Inspirando Lideranças. Gerando Impacto.",
    "data": "2026-12-17",
    "inicio": "2026-12-17T08:00:00+01:00",
    "local": "Hotel EPIC SANA",
    "cidade": "Luanda, Angola",
    "morada": "Rua da Missão, Luanda",
    "horarioForum": "Manhã",
    "horarioGala": "19h às 22h",
    "telefone": "+244 922 812 224",
    "telefone2": "+244 940 440 708",
    "whatsapp": "244922812224",
    "email": "angolajobssummit@gmail.com",
    "site": "www.gilf-angola.com",
    "redes": {
      "facebook": "",
      "instagram": "",
      "linkedin": "",
      "youtube": ""
    }
  },

  /* ---------------------------------------------------------------
     ORADORES E MODERADORES
     papel: "keynote" | "orador" | "moderador" | "apresentador" | "honra"
     id: identificador curto e único (sem espaços), usado no programa.
     destaque: true → aparece na página inicial.
     Exemplo:
     {
       "id": "maria-silva",
       "nome": "Dra. Maria Silva",
       "cargo": "Administradora Executiva",
       "organizacao": "Empresa X",
       "pais": "Angola",
       "papel": "orador",
       "foto": "assets/img/oradores/maria-silva.jpg",
       "bio": "Breve biografia...",
       "linkedin": "https://www.linkedin.com/in/...",
       "destaque": true
     }
     --------------------------------------------------------------- */
  "oradores": [],

  /* ---------------------------------------------------------------
     PROGRAMA
     tipo: "sessao" | "keynote" | "painel" | "pausa" | "networking" | "gala"
     moderador: id de um orador (ou "")
     oradores: lista de ids de oradores
     vagas: nº de lugares "A anunciar" mostrados enquanto não há nomes
     --------------------------------------------------------------- */
  "programa": {
    "provisorio": true,
    "forum": [
      { "hora": "08:00", "fim": "09:00", "tipo": "networking", "titulo": "Acreditação, boas-vindas e café de networking", "descricao": "Recepção dos participantes e entrega de credenciais.", "moderador": "", "oradores": [], "vagas": 0 },
      { "hora": "09:00", "fim": "09:30", "tipo": "sessao", "titulo": "Sessão de abertura", "descricao": "Discursos institucionais e apresentação do tema “Conectando Angola ao Mundo”.", "moderador": "", "oradores": [], "vagas": 2 },
      { "hora": "09:30", "fim": "10:00", "tipo": "keynote", "titulo": "Keynote · Angola no mapa global do investimento", "descricao": "Oportunidades de comércio e investimento entre Angola, o Golfo e o mundo.", "moderador": "", "oradores": [], "vagas": 1 },
      { "hora": "10:00", "fim": "11:00", "tipo": "painel", "titulo": "Painel I · Investimento, Financiamento e Mercados de Capitais", "descricao": "Banca, fundos e instrumentos para financiar o crescimento das empresas angolanas.", "moderador": "", "oradores": [], "vagas": 4 },
      { "hora": "11:00", "fim": "11:20", "tipo": "pausa", "titulo": "Pausa para café", "descricao": "", "moderador": "", "oradores": [], "vagas": 0 },
      { "hora": "11:20", "fim": "12:20", "tipo": "painel", "titulo": "Painel II · Diversificação Económica, Logística e Zonas Económicas", "descricao": "Cadeias de valor estratégicas, indústria, agronegócio e integração regional.", "moderador": "", "oradores": [], "vagas": 4 },
      { "hora": "12:20", "fim": "13:20", "tipo": "painel", "titulo": "Painel III · Liderança, Capital Humano e Inovação", "descricao": "Formação, empreendedorismo, transformação digital e o papel das novas lideranças.", "moderador": "", "oradores": [], "vagas": 4 },
      { "hora": "13:20", "fim": "14:30", "tipo": "networking", "titulo": "Almoço de networking e reuniões B2B", "descricao": "Encontros de negócios entre empresas, investidores e instituições.", "moderador": "", "oradores": [], "vagas": 0 }
    ],
    "gala": [
      { "hora": "19:00", "fim": "19:30", "tipo": "networking", "titulo": "Passadeira vermelha e cocktail de boas-vindas", "descricao": "Chegada dos convidados, fotografia oficial.", "moderador": "", "oradores": [], "vagas": 0 },
      { "hora": "19:30", "fim": "19:50", "tipo": "sessao", "titulo": "Abertura da Gala", "descricao": "Mensagem da Comissão Organizadora e momento cultural.", "moderador": "", "oradores": [], "vagas": 0 },
      { "hora": "19:50", "fim": "20:40", "tipo": "gala", "titulo": "Jantar de gala", "descricao": "Jantar com animação musical.", "moderador": "", "oradores": [], "vagas": 0 },
      { "hora": "20:40", "fim": "21:45", "tipo": "gala", "titulo": "Cerimónia de entrega dos Prémios Líderes Angola 2026", "descricao": "Distinção das personalidades, empresas e instituições premiadas.", "moderador": "", "oradores": [], "vagas": 0 },
      { "hora": "21:45", "fim": "22:00", "tipo": "networking", "titulo": "Brinde final e encerramento", "descricao": "", "moderador": "", "oradores": [], "vagas": 0 }
    ]
  },

  /* ---------------------------------------------------------------
     CATEGORIAS DOS PRÉMIOS LÍDERES ANGOLA
     --------------------------------------------------------------- */
  "premios": [
    { "titulo": "Líder Empresarial do Ano", "descricao": "Visão, resultados e capacidade de transformar organizações." },
    { "titulo": "Investimento e Internacionalização", "descricao": "Empresas que levam Angola ao mundo e trazem o mundo a Angola." },
    { "titulo": "Liderança Feminina", "descricao": "Mulheres que inspiram e abrem caminho em todos os sectores." },
    { "titulo": "Jovem Líder Empreendedor", "descricao": "A nova geração que cria empresas, emprego e inovação." },
    { "titulo": "Inovação e Transformação Digital", "descricao": "Tecnologia ao serviço da competitividade e das pessoas." },
    { "titulo": "Responsabilidade Social", "descricao": "Impacto positivo e sustentável nas comunidades." },
    { "titulo": "Liderança no Sector Público", "descricao": "Gestão pública orientada para resultados e para o cidadão." },
    { "titulo": "Prémio Carreira", "descricao": "Um percurso de excelência que marcou o país." }
  ],

  /* ---------------------------------------------------------------
     INGRESSOS  (preco: "" mostra "Sob consulta")
     --------------------------------------------------------------- */
  "ingressos": [
    { "nome": "Fórum", "subtitulo": "Período da manhã", "preco": "", "itens": ["Acesso a todos os painéis", "Café e almoço de networking", "Reuniões B2B"], "destaque": false },
    { "nome": "Gala & Jantar", "subtitulo": "19h às 22h", "preco": "", "itens": ["Passadeira vermelha e cocktail", "Jantar de gala", "Cerimónia dos Prémios Líderes Angola"], "destaque": false },
    { "nome": "Pacote Completo", "subtitulo": "Fórum + Gala", "preco": "", "itens": ["Tudo o que inclui o Fórum", "Tudo o que inclui a Gala", "Lugar preferencial"], "destaque": true },
    { "nome": "Mesa Corporativa", "subtitulo": "Para empresas e instituições", "preco": "", "itens": ["Mesa na Gala para a sua equipa", "Acesso ao Fórum", "Menção institucional"], "destaque": false }
  ],

  /* ---------------------------------------------------------------
     PARCEIROS — grupos e logótipos (assets/img/logos/)
     --------------------------------------------------------------- */
  "parceiros": [
    { "grupo": "Organização", "itens": [
      { "nome": "Lua-Deira Digital Angola", "logo": "assets/img/logos/luadeira.png", "url": "" },
      { "nome": "JLDI — Consultoria e Prestação de Serviços", "logo": "assets/img/logos/jldi.png", "url": "" }
    ]},
    { "grupo": "Patrocinadores", "itens": [
      { "nome": "Grupo EJ", "logo": "assets/img/logos/grupo-ej.png", "url": "" },
      { "nome": "Kanka Soluções", "logo": "assets/img/logos/kanka.png", "url": "" },
      { "nome": "Tropicana", "logo": "assets/img/logos/tropicana.png", "url": "" },
      { "nome": "Catmanuel & Filhos, Lda", "logo": "assets/img/logos/catmanuel.png", "url": "" },
      { "nome": "VC Sociedade de Advogados, RL", "logo": "assets/img/logos/vc-advogados.png", "url": "" },
      { "nome": "Instituto Innate", "logo": "assets/img/logos/instituto-innate.png", "url": "" },
      { "nome": "Cavalinho", "logo": "assets/img/logos/cavalinho.png", "url": "" }
    ]},
    { "grupo": "Parceiros", "itens": [
      { "nome": "Edmundo Abel", "logo": "assets/img/logos/edmundo-abel.png", "url": "" },
      { "nome": "GL Services", "logo": "assets/img/logos/gl-services.png", "url": "" },
      { "nome": "DNA Company Hub", "logo": "assets/img/logos/dna-company-hub.png", "url": "" },
      { "nome": "Agnela", "logo": "assets/img/logos/agnela.png", "url": "" },
      { "nome": "Unass Design", "logo": "assets/img/logos/unass-design.png", "url": "" },
      { "nome": "Aceld Vision", "logo": "assets/img/logos/aceld-vision.png", "url": "" },
      { "nome": "AfriCore Studios", "logo": "assets/img/logos/africore-studios.png", "url": "" },
      { "nome": "Yos's Store", "logo": "assets/img/logos/yos-store.png", "url": "" }
    ]},
    { "grupo": "Apoio Institucional", "itens": [
      { "nome": "INAPEM", "logo": "assets/img/logos/inapem.png", "url": "" },
      { "nome": "ZEE — Zona Económica Especial Luanda-Bengo", "logo": "assets/img/logos/zee.png", "url": "" },
      { "nome": "CCIAM — Câmara de Comércio e Indústria Angola-Moçambique", "logo": "assets/img/logos/cciam.png", "url": "" }
    ]},
    { "grupo": "Media Partners", "itens": [
      { "nome": "Nova Tela", "logo": "assets/img/logos/nova-tela.png", "url": "" },
      { "nome": "TopKwanza", "logo": "assets/img/logos/topkwanza.png", "url": "" },
      { "nome": "Bateu Bwé", "logo": "assets/img/logos/bateu-bwe.png", "url": "" },
      { "nome": "Platina Grupo de Comunicação", "logo": "assets/img/logos/platina.png", "url": "" },
      { "nome": "ZAP", "logo": "assets/img/logos/zap.png", "url": "" },
      { "nome": "Radar", "logo": "assets/img/logos/radar.png", "url": "" },
      { "nome": "Platinaline", "logo": "assets/img/logos/platinaline.png", "url": "" }
    ]}
  ]
};
