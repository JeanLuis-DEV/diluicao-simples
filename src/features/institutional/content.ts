export type InstitutionalContentId = 'about' | 'rights' | 'privacy'

type InstitutionalSection = {
  readonly heading: string
  readonly paragraphs: readonly string[]
}

type InstitutionalContent = {
  readonly title: string
  readonly sections: readonly InstitutionalSection[]
}

export const INSTITUTIONAL_CONTENT: Record<InstitutionalContentId, InstitutionalContent> = {
  about: {
    title: 'Sobre',
    sections: [
      {
        heading: 'Diluição Simples',
        paragraphs: [
          'Calculadora auxiliar para preparar diluições de produtos de limpeza automotiva. Selecione a proporção indicada no rótulo, informe a quantidade final e veja quanto produto concentrado e água utilizar.',
        ],
      },
      {
        heading: 'Como interpretar',
        paragraphs: [
          'Neste aplicativo, 1:N significa 1 parte de produto concentrado para N partes de água. A interpretação pode variar conforme o fabricante; consulte sempre o rótulo.',
        ],
      },
      {
        heading: 'Contato',
        paragraphs: ['jeanluis.dev@gmail.com'],
      },
    ],
  },
  rights: {
    title: 'Direito de uso',
    sections: [
      {
        heading: 'Titularidade',
        paragraphs: [
          'O Diluição Simples foi desenvolvido por Jean Luis DEV. O uso da aplicação não transfere a titularidade de seus elementos nem autoriza reprodução, redistribuição ou comercialização sem autorização prévia.',
        ],
      },
      {
        heading: 'Responsabilidade',
        paragraphs: [
          'A aplicação é uma ferramenta auxiliar e não oferece garantia de resultado químico. Confira os dados, siga o rótulo e as orientações do fabricante e observe as medidas de segurança aplicáveis.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidade',
    sections: [
      {
        heading: 'Funcionamento',
        paragraphs: [
          'Os cálculos são realizados no navegador. A aplicação não exige conta e não envia os valores informados ou os resultados para Jean Luis DEV ou terceiros.',
        ],
      },
      {
        heading: 'Dados e serviços',
        paragraphs: [
          'Esta versão armazena localmente apenas a confirmação de que a mensagem inicial já foi vista. Não utiliza banco de dados, analytics, publicidade ou rastreamento.',
        ],
      },
      {
        heading: 'Contato',
        paragraphs: ['Dúvidas sobre privacidade: jeanluis.dev@gmail.com.'],
      },
    ],
  },
}
