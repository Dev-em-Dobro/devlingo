import { Language, Level } from '../contexts/UserPreferencesContext'

export interface Question {
  id: string
  type: 'multiple-choice' | 'fill-blank' | 'code-snippet'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  questions: Question[]
  xpReward: number
}

export const lessonsData: Record<Language, Record<Level, Lesson[]>> = {
  html: {
    beginner: [
      {
        id: 'html-beginner-1',
        title: 'Estrutura básica HTML',
        description: 'Aprenda as tags fundamentais do HTML',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual tag HTML é usada para criar um parágrafo?',
            options: ['<p>', '<paragraph>', '<text>', '<para>'],
            correctAnswer: 0,
            explanation: 'A tag <p> é usada para criar parágrafos em HTML.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Qual tag define o título principal de uma página?',
            options: ['<h1>', '<title>', '<head>', '<header>'],
            correctAnswer: 0,
            explanation: 'A tag <h1> representa o título principal da página.',
          },
          {
            id: 'q3',
            type: 'multiple-choice',
            question: 'Qual atributo é usado para adicionar um link?',
            options: ['src', 'link', 'href', 'url'],
            correctAnswer: 2,
            explanation: 'O atributo href especifica a URL do link.',
          },
        ],
      },
      {
        id: 'html-beginner-2',
        title: 'Listas e links',
        description: 'Crie listas ordenadas e desordenadas',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual tag cria uma lista não ordenada?',
            options: ['<ul>', '<ol>', '<li>', '<list>'],
            correctAnswer: 0,
            explanation: '<ul> cria uma lista não ordenada (com marcadores).',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Qual tag é usada para criar um link?',
            options: ['<link>', '<a>', '<url>', '<href>'],
            correctAnswer: 1,
            explanation: 'A tag <a> (anchor) é usada para criar links.',
          },
        ],
      },
      {
        id: 'html-beginner-3',
        title: 'Imagens e multimídia',
        description: 'Adicione imagens às suas páginas',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual atributo da tag <img> especifica o caminho da imagem?',
            options: ['link', 'src', 'href', 'path'],
            correctAnswer: 1,
            explanation: 'O atributo src especifica o caminho para a imagem.',
          },
        ],
      },
      {
        id: 'html-beginner-4',
        title: 'Formulários básicos',
        description: 'Crie formulários interativos',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual tag cria um campo de entrada de texto?',
            options: ['<input>', '<text>', '<field>', '<form>'],
            correctAnswer: 0,
            explanation: 'A tag <input> cria diferentes tipos de campos de entrada.',
          },
        ],
      },
    ],
    intermediate: [
      {
        id: 'html-intermediate-1',
        title: 'Semântica HTML5',
        description: 'Use tags semânticas modernas',
        xpReward: 15,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual tag semântica representa o conteúdo principal?',
            options: ['<main>', '<content>', '<body>', '<section>'],
            correctAnswer: 0,
          },
        ],
      },
      {
        id: 'html-intermediate-2',
        title: 'Tabelas avançadas',
        description: 'Crie tabelas complexas',
        xpReward: 15,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual tag agrupa o cabeçalho de uma tabela?',
            options: ['<thead>', '<header>', '<head>', '<th>'],
            correctAnswer: 0,
          },
        ],
      },
    ],
    advanced: [
      {
        id: 'html-advanced-1',
        title: 'Acessibilidade HTML',
        description: 'Crie páginas acessíveis',
        xpReward: 20,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual atributo melhora a acessibilidade de imagens?',
            options: ['title', 'alt', 'description', 'label'],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
  css: {
    beginner: [
      {
        id: 'css-beginner-1',
        title: 'Introdução ao CSS',
        description: 'Aprenda os fundamentos do CSS',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual propriedade CSS altera a cor do texto?',
            options: ['text-color', 'color', 'font-color', 'text-style'],
            correctAnswer: 1,
            explanation: 'A propriedade color define a cor do texto.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Qual propriedade altera o tamanho da fonte?',
            options: ['text-size', 'font-size', 'size', 'font-weight'],
            correctAnswer: 1,
            explanation: 'A propriedade font-size define o tamanho da fonte.',
          },
        ],
      },
      {
        id: 'css-beginner-2',
        title: 'Seletores CSS',
        description: 'Selecione elementos específicos',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual seletor seleciona todos os elementos?',
            options: ['*', '#', '.', 'all'],
            correctAnswer: 0,
          },
        ],
      },
      {
        id: 'css-beginner-3',
        title: 'Box Model',
        description: 'Entenda o modelo de caixa',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual propriedade define o espaçamento interno?',
            options: ['margin', 'padding', 'space', 'inside'],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'css-beginner-4',
        title: 'Cores e backgrounds',
        description: 'Estilize cores e fundos',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual propriedade define a cor de fundo?',
            options: ['bg-color', 'background-color', 'color-background', 'back-color'],
            correctAnswer: 1,
          },
        ],
      },
    ],
    intermediate: [
      {
        id: 'css-intermediate-1',
        title: 'Flexbox',
        description: 'Layout flexível com Flexbox',
        xpReward: 15,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual propriedade ativa o Flexbox?',
            options: ['display: flex', 'flex: true', 'layout: flex', 'flexbox: on'],
            correctAnswer: 0,
          },
        ],
      },
    ],
    advanced: [
      {
        id: 'css-advanced-1',
        title: 'Grid Layout',
        description: 'Crie layouts complexos com Grid',
        xpReward: 20,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual propriedade cria um grid?',
            options: ['grid: true', 'display: grid', 'layout: grid', 'grid-layout: on'],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },
  javascript: {
    beginner: [
      {
        id: 'js-beginner-1',
        title: 'Variáveis e tipos',
        description: 'Aprenda sobre variáveis em JavaScript',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual palavra-chave cria uma variável mutável?',
            options: ['const', 'let', 'var', 'variable'],
            correctAnswer: 1,
            explanation: 'let permite reatribuição, diferente de const.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Qual tipo de dado representa texto?',
            options: ['number', 'string', 'boolean', 'text'],
            correctAnswer: 1,
            explanation: 'String representa valores de texto.',
          },
        ],
      },
      {
        id: 'js-beginner-2',
        title: 'Funções',
        description: 'Crie e use funções',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual palavra-chave define uma função?',
            options: ['func', 'function', 'def', 'fnñ'],
            correctAnswer: 1,
          },
        ],
      },
      {
        id: 'js-beginner-3',
        title: 'Arrays',
        description: 'Trabalhe com listas de dados',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual método adiciona um elemento ao final do array?',
            options: ['push()', 'add()', 'append()', 'insert()'],
            correctAnswer: 0,
          },
        ],
      },
      {
        id: 'js-beginner-4',
        title: 'Objetos',
        description: 'Entenda objetos JavaScript',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Como você acessa a propriedade de um objeto?',
            options: ['object.property', 'object->property', 'object::property', 'object[property]'],
            correctAnswer: 0,
          },
        ],
      },
      {
        id: 'js-beginner-5',
        title: 'Condicionais',
        description: 'Use if, else e switch',
        xpReward: 10,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual operador compara valores?',
            options: ['=', '==', '===', 'Todas as anteriores'],
            correctAnswer: 2,
            explanation: '=== compara valor e tipo, evitando conversões automáticas.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Qual estrutura é usada para múltiplas condições?',
            options: ['if', 'else if', 'switch', 'Todas as anteriores'],
            correctAnswer: 3,
            explanation: 'Você pode usar if, else if ou switch para múltiplas condições.',
          },
        ],
      },
    ],
    intermediate: [
      {
        id: 'js-intermediate-1',
        title: 'Arrow Functions',
        description: 'Use funções arrow modernas',
        xpReward: 15,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual é a sintaxe de uma arrow function?',
            options: ['() => {}', 'function() {}', '=> () {}', '() function {}'],
            correctAnswer: 0,
            explanation: 'A sintaxe () => {} define uma arrow function.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Arrow functions têm seu próprio this?',
            options: ['Sim', 'Não, herdam do escopo pai', 'Depende', 'Só em alguns casos'],
            correctAnswer: 1,
            explanation: 'Arrow functions não têm seu próprio this, elas herdam do escopo pai.',
          },
        ],
      },
      {
        id: 'js-intermediate-2',
        title: 'Destructuring',
        description: 'Desestruture arrays e objetos',
        xpReward: 15,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Como desestruturar um array?',
            options: ['const [a, b] = array', 'const {a, b} = array', 'const a, b = array', 'const array = [a, b]'],
            correctAnswer: 0,
            explanation: 'Use colchetes [] para desestruturar arrays.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Como desestruturar um objeto?',
            options: ['const [a, b] = obj', 'const {a, b} = obj', 'const a, b = obj', 'const obj = {a, b}'],
            correctAnswer: 1,
            explanation: 'Use chaves {} para desestruturar objetos.',
          },
        ],
      },
      {
        id: 'js-intermediate-3',
        title: 'Spread Operator',
        description: 'Use o operador spread',
        xpReward: 15,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual símbolo representa o spread operator?',
            options: ['...', '***', '>>>', '...>'],
            correctAnswer: 0,
            explanation: 'O operador spread é representado por três pontos (...).',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'O que [...array] faz?',
            options: ['Cria uma cópia do array', 'Remove elementos', 'Ordena o array', 'Inverte o array'],
            correctAnswer: 0,
            explanation: 'O spread operator cria uma cópia superficial do array.',
          },
        ],
      },
      {
        id: 'js-intermediate-4',
        title: 'Map, Filter e Reduce',
        description: 'Manipule arrays com métodos avançados',
        xpReward: 15,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual método transforma cada elemento de um array?',
            options: ['map()', 'filter()', 'reduce()', 'forEach()'],
            correctAnswer: 0,
            explanation: 'map() transforma cada elemento e retorna um novo array.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Qual método filtra elementos de um array?',
            options: ['map()', 'filter()', 'reduce()', 'forEach()'],
            correctAnswer: 1,
            explanation: 'filter() retorna apenas elementos que passam no teste.',
          },
        ],
      },
    ],
    advanced: [
      {
        id: 'js-advanced-1',
        title: 'Promises e Async/Await',
        description: 'Trabalhe com código assíncrono',
        xpReward: 20,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual palavra-chave aguarda uma Promise?',
            options: ['wait', 'await', 'async', 'promise'],
            correctAnswer: 1,
            explanation: 'await pausa a execução até que a Promise seja resolvida.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Uma função async sempre retorna?',
            options: ['Um valor', 'Uma Promise', 'Undefined', 'Null'],
            correctAnswer: 1,
            explanation: 'Funções async sempre retornam uma Promise.',
          },
        ],
      },
      {
        id: 'js-advanced-2',
        title: 'Classes e Herança',
        description: 'Use classes ES6',
        xpReward: 20,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Qual palavra-chave cria uma classe?',
            options: ['class', 'function', 'object', 'constructor'],
            correctAnswer: 0,
            explanation: 'A palavra-chave class é usada para criar classes.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Como você herda de outra classe?',
            options: ['extends', 'inherits', 'super', 'parent'],
            correctAnswer: 0,
            explanation: 'Use extends para criar uma classe filha.',
          },
        ],
      },
      {
        id: 'js-advanced-3',
        title: 'Modules ES6',
        description: 'Importe e exporte módulos',
        xpReward: 20,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Como exportar uma função?',
            options: ['export function', 'export const', 'export default', 'Todas as anteriores'],
            correctAnswer: 3,
            explanation: 'Você pode exportar de várias formas: export function, export const, ou export default.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Como importar um módulo padrão?',
            options: ['import nome from "modulo"', 'import { nome } from "modulo"', 'import * as nome from "modulo"', 'Todas as anteriores'],
            correctAnswer: 0,
            explanation: 'Use import nome from "modulo" para importar exportações default.',
          },
        ],
      },
      {
        id: 'js-advanced-4',
        title: 'Closures e Escopo',
        description: 'Entenda closures em JavaScript',
        xpReward: 20,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'O que é uma closure?',
            options: ['Uma função dentro de outra', 'Uma função que acessa variáveis do escopo externo', 'Uma variável global', 'Um objeto'],
            correctAnswer: 1,
            explanation: 'Closure é uma função que tem acesso a variáveis do escopo externo mesmo após o retorno.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Qual é o escopo de uma variável let?',
            options: ['Global', 'Função', 'Bloco', 'Nenhum'],
            correctAnswer: 2,
            explanation: 'let tem escopo de bloco, apenas dentro das chaves {} onde foi declarada.',
          },
        ],
      },
      {
        id: 'js-advanced-5',
        title: 'Template Literals',
        description: 'Use template strings do ES6',
        xpReward: 20,
        questions: [
          {
            id: 'q1',
            type: 'multiple-choice',
            question: 'Como criar uma template literal?',
            options: ['"string"', "'string'", '`string`', 'Todas as anteriores'],
            correctAnswer: 2,
            explanation: 'Template literals usam backticks (`) e permitem interpolação.',
          },
          {
            id: 'q2',
            type: 'multiple-choice',
            question: 'Como inserir uma variável em uma template literal?',
            options: ['${var}', '{{var}}', '$var', '${var}'],
            correctAnswer: 3,
            explanation: 'Use ${var} para inserir variáveis em template literals.',
          },
        ],
      },
    ],
  },
}

