export const proposal = {
  projectName: "Nome do Cliente",

  title: "Estratégia e Design para a nova fase da marca.",

  subtitle:
    "Uma proposta modular e configurável para estruturar direção, comunicação e presença da marca.",

  proposalType: "Proposta Comercial · Design Estratégico",

  formName: "proposta-simplexa",

  assets: {
    headerDesktop: "/assets/header-desktop.png",
    headerMobile: "/assets/header-mobile.png",
    simplexaLogo: "/assets/simplexa-logo.png",
    favicon: "/assets/favicon.svg",
  },

  nav: [
    ["contexto", "Contexto"],
    ["diagnostico", "Diagnóstico"],
    ["escopo", "Escopo"],
    ["investimento", "Investimento"],
    ["cronograma", "Cronograma"],
    ["delimitacoes", "Delimitações"],
  ],

  introCard: {
    label: "Escopo configurável",
    title: "Proposta modular",
    text:
      "Cada bloco pode assumir apenas as profundidades que realmente fazem sentido para o projeto.",
  },

  payment: {
    cashDiscount: 0.05,
    entryPercent: 0.4,
    installmentsCount: 3,

    milestones: [
      "40% na aprovação",
      "30% na entrega parcial",
      "30% na entrega final",
    ],
  },

  sections: {
    context: {
      id: "contexto",
      eyebrow: "Contexto",

      title: "Momento da marca",

      paragraphs: [
        "A marca está em um momento de reorganização e evolução.",
        "O desafio não é apenas atualizar materiais, mas estruturar direção e clareza para os próximos movimentos.",
      ],
    },

    diagnostic: {
      id: "diagnostico",

      eyebrow: "Leitura",

      title: "Síntese da necessidade",

      text:
        "Criar uma base mais organizada para orientar posicionamento, comunicação e expansão.",

      cards: [
        {
          title: "Direção",
          text:
            "Definir critérios para comunicação, marca e tomada de decisão.",
        },

        {
          title: "Sistema",
          text:
            "Organizar o projeto em blocos claros e configuráveis.",
        },
      ],

      note:
        "A proposta foi estruturada para permitir ajustes de profundidade conforme a necessidade real do projeto.",
    },

    scope: {
      id: "escopo",

      eyebrow: "Escopo",

      title: "Estrutura da proposta",

      text:
        "Os blocos abaixo podem ser incluídos ou ampliados conforme a necessidade do projeto.",
    },

    investment: {
      id: "investimento",

      eyebrow: "Investimento",

      title: "Configuração de escopo",

      text:
        "Alguns blocos possuem apenas Incluir / Não incluir. Outros possuem versões Padrão e Expandido.",

      summaryButtonClosed: "Abrir resumo",
      summaryButtonOpen: "Fechar resumo",

      standardButtonDesktop: "Configuração base",
      expandedButtonDesktop: "Configuração expandida",

      standardButtonMobile: "Base",
      expandedButtonMobile: "Expandido",
    },

    summary: {
      title: "Resumo da proposta",

      text:
        "O resumo abaixo consolida os blocos escolhidos e as condições da proposta.",

      totalLabel: "Total selecionado",

      sendButton: "Enviar resumo",

      sendingButton: "Enviando...",

      successMessage:
        "Resumo enviado com sucesso.",

      errorMessage:
        "Não foi possível enviar agora.",

      downloadPdfButton: "Baixar PDF",

      sharePdfButton: "Compartilhar PDF",
    },

    timeline: {
      id: "cronograma",

      eyebrow: "Cronograma",

      title: "Etapas previstas",

      items: [
        {
          period: "Semana 01",
          text: "Imersão e alinhamento inicial.",
        },

        {
          period: "Semana 02–03",
          text: "Desenvolvimento estratégico.",
        },

        {
          period: "Semana 04",
          text: "Consolidação e apresentação.",
        },
      ],
    },

    exclusions: {
      id: "delimitacoes",

      eyebrow: "Delimitações",

      title: "Itens não inclusos",

      items: [
        "Produção gráfica",
        "Registro de marca",
        "Desenvolvimento técnico de site",
      ],
    },

    closing: {
      id: "fechamento",

      eyebrow: "Próximo passo",

      title: "Início do projeto",

      text:
        "Após a aprovação, a Simplexa agenda o alinhamento inicial e inicia o processo.",

      flowTitle: "Fluxo",

      flow: [
        "Aprovação da proposta",
        "Pagamento da entrada",
        "Briefing e kickoff",
        "Início do projeto",
      ],
    },
  },

  blocks: [
    {
      id: "01",

      key: "diagnostico",

      title: "Diagnóstico de Marca",

      note:
        "Leitura estratégica do contexto, oportunidades e desafios.",

      standard: {
        label: "Incluir",

        value: 10000,

        description:
          "Diagnóstico estruturado para orientar as decisões seguintes.",

        includes: [
          "Briefing",
          "Leitura de materiais",
          "Síntese diagnóstica",
          "Direcionamento estratégico inicial",
        ],
      },
    },

    {
      id: "02",

      key: "estrategia",

      title: "Estratégia de Marca",

      note:
        "Estrutura posicionamento, valor e direção da marca.",

      standard: {
        label: "Padrão",

        value: 14000,

        description:
          "Estratégia aplicável para orientar comunicação e crescimento.",

        includes: [
          "Plataforma da Marca",
          "Público e Valor",
          "Mensagens-chave",
        ],
      },

      expanded: {
        label: "Expandido",

        value: 22000,

        description:
          "Versão aprofundada com maior documentação e transferência operacional.",

        includes: [
          "Tudo do Padrão",
          "Arquitetura Estratégica",
          "Identidade Verbal",
          "Mapa de Evolução",
        ],
      },
    },
  ],

  contact: {
    email: "contato@simplexa.com.br",

    instagram: "@simplexa",

    instagramUrl: "https://instagram.com/simplexa",

    website: "simplexa.com.br",

    websiteUrl: "https://simplexa.com.br",

    whatsapp: [
    {
      label: "PM FERRONY",
      url: "https://wa.me/5555999999999",
    },

    {
      label: "ROGÉRIO LOBO",
      url: "https://wa.me/5555981150877",
    },
  ],
},
