export const proposal = {
  projectName: "Nagashimori | Casa Delmar",

  title: "Package System de Transição",

  subtitle:
    "Sistema de embalagens desenvolvido para acompanhar a evolução entre Casa Delmar e Nagashimori, utilizando a muralha artística existente como elemento visual proprietário.",

  proposalType: "Proposta Comercial · Design de Embalagem",

  formName: "proposta-nagashimori-package-system",

  assets: {
    headerDesktop: "/assets/header-desktop.png",
    headerMobile: "/assets/header-mobile.png",
    simplexaLogo: "/assets/simplexa-logo.png",
    favicon: "/assets/favicon.svg",
  },

  nav: [
    ["contexto", "Contexto"],
    ["diagnostico", "Leitura"],
    ["escopo", "Escopo"],
    ["investimento", "Investimento"],
    ["cronograma", "Cronograma"],
    ["delimitacoes", "Delimitações"],
  ],

  introCard: {
    label: "Escopo modular",
    title: "Sistema principal + adicional",
    text:
      "A proposta contempla um package system principal para as embalagens centrais do negócio, com possibilidade de expansão para itens complementares.",
  },

  payment: {
    cashDiscount: 0,
    entryPercent: 0,
    installmentsCount: 12,

    options: [
      {
        id: "sebrae-12x",
        label: "Programa Sebrae",
        description:
          "Valor com 40% de subsídio Sebrae, com saldo parcelado em até 12x.",
        discount: 0.4,
        entryPercent: 0,
        installmentsCount: 12,
      },
    ],

    milestones: [
      "Projeto realizado via programa Sebrae",
      "40% de subsídio sobre o valor integral",
      "Saldo final parcelado em até 12x",
    ],
  },

  sections: {
    context: {
      id: "contexto",
      eyebrow: "Contexto",

      title: "Uma embalagem para um momento de transição",

      paragraphs: [
        "Casa Delmar e Nagashimori vivem um momento de evolução física, simbólica e comercial. Antes de uma transição completa de marca, existe a necessidade de criar um sistema de embalagem capaz de acompanhar esse período sem depender diretamente das identidades atuais.",
        "A proposta parte da muralha artística existente no espaço físico da Casa Delmar como elemento reconhecível e afetivo, transformando essa referência em uma linguagem gráfica própria para as embalagens.",
      ],
    },

    diagnostic: {
      id: "diagnostico",

      eyebrow: "Leitura",

      title: "Síntese da necessidade",

      text:
        "Criar um sistema visual de embalagens que funcione como ponte entre o momento atual e a próxima fase do negócio.",

      cards: [
        {
          title: "Transição",
          text:
            "Usar um elemento físico já existente como base para a evolução visual do negócio.",
        },

        {
          title: "Sistema",
          text:
            "Fazer as embalagens conversarem entre si, funcionando individualmente e como conjunto.",
        },
      ],

      note:
        "O projeto não é um redesign de marca. A estratégia aparece de forma pontual, apenas como direcionamento conceitual para orientar o uso da muralha como elemento simbólico e visual da transição.",
    },

    scope: {
      id: "escopo",

      eyebrow: "Escopo",

      title: "Estrutura da proposta",

      text:
        "O projeto está dividido entre o package system principal e um módulo adicional de expansão para novas categorias de embalagem.",
    },

    investment: {
      id: "investimento",

      eyebrow: "Investimento",

      title: "Configuração de escopo",

      text:
        "O escopo principal contempla as embalagens centrais do sistema. O módulo adicional pode ser incluído conforme a necessidade do projeto.",

      summaryButtonClosed: "Abrir resumo",
      summaryButtonOpen: "Fechar resumo",

      standardButtonDesktop: "Configuração base",
      expandedButtonDesktop: "Configuração completa",

      standardButtonMobile: "Base",
      expandedButtonMobile: "Completa",
    },

    summary: {
      title: "Resumo da proposta",

      text:
        "O resumo abaixo consolida os itens selecionados e a condição Sebrae aplicada ao investimento.",

      totalLabel: "Total selecionado",

      sendButton: "Enviar resumo",
      sendingButton: "Enviando...",
      successMessage: "Resumo enviado com sucesso.",
      errorMessage: "Não foi possível enviar agora.",

      downloadPdfButton: "Baixar PDF",
      sharePdfButton: "Compartilhar PDF",
    },

    ```js
timeline: {
  id: "cronograma",

  eyebrow: "Cronograma",

  title: "Cronograma estimado de 5 dias úteis",

  items: [
    {
      period: "Etapa 01 · 1 dia útil",
      text:
        "Alinhamento inicial, recebimento das referências, medidas, modelos de embalagem e imagem-base da muralha artística.",
    },

    {
      period: "Etapa 02 · 2 dias úteis",
      text:
        "Leitura conceitual da transição, interpretação da muralha artística, definição da lógica visual do sistema e estruturação das aplicações.",
    },

    {
      period: "Etapa 03 · 1 dia útil",
      text:
        "Desenvolvimento dos mockups, simulações de aplicação e apresentação preliminar do package system.",
    },

    {
      period: "Etapa 04 · 1 dia útil",
      text:
        "Ajustes finais, preparação dos arquivos para produção e entrega das especificações básicas para fornecedores.",
    },
  ],
},
```


    exclusions: {
      id: "delimitacoes",

      eyebrow: "Delimitações",

      title: "Itens não inclusos",

      items: [
        "Produção gráfica das embalagens",
        "Impressão, prototipagem física ou compra de embalagens",
        "Fotografia profissional dos produtos",
        "Redesign das marcas Casa Delmar ou Nagashimori",
        "Criação de logotipo, naming ou identidade visual completa",
        "Ajustes técnicos exigidos por fornecedores após alteração de faca, formato ou processo produtivo não previsto",
      ],
    },

    closing: {
      id: "fechamento",

      eyebrow: "Próximo passo",

      title: "Início do projeto",

      text:
        "Após a aprovação, a Simplexa organiza os materiais necessários, valida os formatos de embalagem e inicia o desenvolvimento do sistema visual.",

      flowTitle: "Fluxo",

      flow: [
        "Aprovação da proposta",
        "Envio das referências e modelos das embalagens",
        "Alinhamento inicial",
        "Desenvolvimento e apresentação do package system",
        "Ajustes finais e entrega dos arquivos",
      ],
    },
  },

  blocks: [
    {
      id: "01",

      key: "package-system-principal",

      title: "Package System Principal",

      note:
        "Sistema visual de transição aplicado às embalagens centrais do negócio.",

      standard: {
        label: "Principal",

        value: 2300,

        description:
          "Desenvolvimento do sistema principal de embalagens, usando a muralha artística como base visual e simbólica.",

        includes: [
          "Direcionamento conceitual de transição entre Casa Delmar e Nagashimori",
          "Definição da muralha artística como elemento simbólico e visual do sistema",
          "Leitura e interpretação da arte existente",
          "Vetorização e reconstrução gráfica da arte",
          "Definição do padrão cromático do sistema",
          "Desenvolvimento da lógica de composição visual",
          "Definição de como cada embalagem recebe a ilustração",
          "Relação visual entre as embalagens para funcionamento individual e integrado",
          "Caixa sushi pequena",
          "Caixa sushi média",
          "Caixa sushi grande",
          "Embalagem de temaki",
          "Sacola craft branca",
          "Arquivos finais para produção",
          "Mockups de apresentação",
          "Especificações básicas para fornecedores",
        ],
      },
    },

    {
      id: "02",

      key: "modulo-adicional",

      title: "Módulo Adicional",

      note:
        "Expansão do sistema visual para embalagens complementares.",

      standard: {
        label: "Adicional",

        value: 600,

        description:
          "Adaptação do sistema principal para novos formatos de embalagem, mantendo unidade estética, produtiva e operacional.",

        includes: [
          "Poke bowl — tamanho 01",
          "Poke bowl — tamanho 02",
          "Tampa personalizada para embalagem de escondidinho congelado",
          "Adaptação da linguagem visual aos novos formatos",
          "Arquivos finais para produção",
          "Mockups de apresentação",
          "Especificações básicas para fornecedores",
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
        url: "https://wa.me/5555999014361",
      },

      {
        label: "ROGÉRIO LOBO",
        url: "https://wa.me/5555981150877",
      },
    ],
  },
};
