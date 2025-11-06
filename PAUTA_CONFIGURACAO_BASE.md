# Pauta de Aula: Configuração Base do Projeto DevLingo

## [Introdução]

Nessa aula tu vai aprender como configurar um projeto React do zero usando as tecnologias mais modernas do ecossistema. Vamos criar um projeto usando Vite (build tool super rápido), React com TypeScript (pra ter tipagem e mais segurança no código), Tailwind CSS (pra estilizar de forma rápida e moderna), React Router (pra navegação entre páginas), e preparar a estrutura base pra integrar com Supabase depois. Tu vai entender cada ferramenta, por que escolhemos ela, e como configurar tudo passo a passo.

---

## [Tópicos principais]

### **1. Pré-requisitos e Ferramentas Necessárias**

Antes de começar, precisamos ter algumas coisas instaladas no computador:

**O que precisamos:**
- **Node.js** (versão 18 ou superior)
- **npm** (vem junto com o Node.js)
- **Git** (pra controle de versão)
- **Editor de código** (VS Code recomendado)

**Como verificar se já tem instalado:**

Abre o terminal (ou PowerShell no Windows) e digite:

```bash
node --version
npm --version
git --version
```

Se aparecer um número de versão, está instalado! Se não, precisa instalar primeiro.

**Instalando Node.js:**
1. Acesse https://nodejs.org
2. Baixe a versão LTS (Long Term Support - mais estável)
3. Execute o instalador e siga as instruções
4. Reinicie o terminal e verifique novamente

**Por que essas ferramentas?**
- **Node.js**: Permite executar JavaScript fora do navegador e usar ferramentas de desenvolvimento
- **npm**: Gerenciador de pacotes, permite instalar bibliotecas e ferramentas
- **Git**: Controle de versão, permite salvar histórico do código
- **VS Code**: Editor moderno com muitas extensões úteis pra React

---

### **2. Criando o Projeto com Vite**

Vite é um build tool super rápido criado pelo mesmo criador do Vue.js. Ele é muito mais rápido que o Create React App tradicional.

**Por que Vite?**
- ⚡ Inicia o servidor de desenvolvimento instantaneamente
- 🔥 Hot Module Replacement (HMR) super rápido
- 📦 Build otimizado pra produção
- 🎯 Suporte nativo a TypeScript

**Criando o projeto:**

No terminal, navegue até a pasta onde quer criar o projeto e execute:

```bash
npm create vite@latest devlingo -- --template react-ts
```

**Explicando o comando:**
- `npm create vite@latest`: Cria um novo projeto usando a versão mais recente do Vite
- `devlingo`: Nome do projeto (pode ser qualquer nome)
- `--template react-ts`: Template com React e TypeScript já configurado

**O que vai acontecer:**
1. Vite vai criar uma pasta chamada `devlingo`
2. Vai configurar a estrutura básica do projeto
3. Vai instalar as dependências básicas

**Navegando até o projeto:**

```bash
cd devlingo
```

**Instalando as dependências:**

```bash
npm install
```

Isso vai instalar todas as dependências listadas no `package.json`.

**Testando se funcionou:**

```bash
npm run dev
```

Deve abrir um servidor local (geralmente em http://localhost:5173). Se abrir uma página com o logo do Vite e React, está funcionando! 🎉

---

### **3. Entendendo a Estrutura do Projeto**

Vamos entender o que o Vite criou pra gente:

```
devlingo/
├── node_modules/          # Dependências instaladas (não mexer)
├── public/                # Arquivos estáticos (imagens, favicon, etc)
├── src/                   # Código fonte da aplicação
│   ├── assets/           # Imagens, ícones, etc
│   ├── App.tsx           # Componente principal
│   ├── App.css           # Estilos do App
│   ├── index.css         # Estilos globais
│   ├── main.tsx          # Ponto de entrada da aplicação
│   └── vite-env.d.ts     # Tipos do Vite
├── index.html            # HTML principal
├── package.json          # Dependências e scripts do projeto
├── tsconfig.json         # Configuração do TypeScript
├── tsconfig.node.json    # Configuração do TypeScript pro Node
└── vite.config.ts        # Configuração do Vite
```

**Arquivos importantes:**

1. **package.json**: Lista todas as dependências e scripts do projeto
2. **vite.config.ts**: Configurações do Vite (aliases, plugins, etc)
3. **tsconfig.json**: Configurações do TypeScript (regras de tipagem)
4. **index.html**: HTML base da aplicação
5. **src/main.tsx**: Arquivo que inicializa o React
6. **src/App.tsx**: Componente principal da aplicação

---

### **4. Instalando Dependências Principais**

Agora vamos instalar as bibliotecas que vamos usar no projeto:

**React Router (navegação):**
```bash
npm install react-router-dom
```

**Tipos do React Router (TypeScript):**
```bash
npm install -D @types/react-router-dom
```

**Supabase (backend e autenticação):**
```bash
npm install @supabase/supabase-js
```

**Lucide React (ícones modernos):**
```bash
npm install lucide-react
```

**React Icons (mais ícones):**
```bash
npm install react-icons
```

**Utilitários CSS:**
```bash
npm install clsx tailwind-merge class-variance-authority
```

**Explicando cada uma:**
- **react-router-dom**: Permite criar rotas e navegação entre páginas
- **@supabase/supabase-js**: Cliente JavaScript do Supabase (backend, autenticação, banco de dados)
- **lucide-react**: Biblioteca de ícones SVG moderna e bonita
- **react-icons**: Mais opções de ícones (Font Awesome, Material, etc)
- **clsx/tailwind-merge**: Utilitários pra trabalhar com classes CSS do Tailwind

---

### **5. Configurando Tailwind CSS**

Tailwind CSS é um framework CSS utility-first. Ao invés de escrever CSS tradicional, usamos classes utilitárias diretamente no HTML/JSX.

**Por que Tailwind?**
- ⚡ Desenvolvimento mais rápido
- 🎨 Design system consistente
- 📦 Build otimizado (só inclui classes usadas)
- 🔧 Fácil customização

**Instalando Tailwind e dependências:**

```bash
npm install -D tailwindcss postcss autoprefixer
npm install -D tailwindcss-animate
```

**Inicializando Tailwind:**

```bash
npx tailwindcss init -p
```

Isso cria dois arquivos:
- `tailwind.config.js`: Configuração do Tailwind
- `postcss.config.js`: Configuração do PostCSS

**Configurando o tailwind.config.js:**

Substitua o conteúdo por:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**Explicando:**
- `content`: Onde o Tailwind deve procurar classes (arquivos que usam Tailwind)
- `darkMode: ["class"]`: Permite modo escuro baseado em classe
- `theme.extend`: Estende o tema padrão com cores customizadas
- `plugins`: Plugins adicionais (tailwindcss-animate pra animações)

**Configurando o CSS global:**

No arquivo `src/index.css`, substitua tudo por:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Explicando:**
- `@tailwind base/components/utilities`: Importa as diretivas do Tailwind
- `:root`: Define variáveis CSS pra cores (modo claro)
- `.dark`: Define variáveis CSS pra modo escuro
- `@layer base`: Aplica estilos base usando classes do Tailwind

**Testando o Tailwind:**

No `src/App.tsx`, teste com:

```tsx
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white">Tailwind funcionando! 🎉</h1>
    </div>
  )
}
```

Se aparecer um fundo roxo/rosa com texto branco, o Tailwind está funcionando!

---

### **6. Configurando shadcn/ui**

shadcn/ui é uma biblioteca de componentes React reutilizáveis construída com Radix UI e Tailwind CSS. A diferença é que os componentes são copiados diretamente pro seu projeto (não são instalados como dependência), então você tem controle total sobre o código.

**Por que shadcn/ui?**
- 🎨 Componentes bonitos e acessíveis por padrão
- 🔧 Código que você pode modificar (não é uma dependência)
- ⚡ Baseado em Radix UI (acessibilidade de primeira classe)
- 🎯 Integração perfeita com Tailwind CSS
- 📦 Instala apenas os componentes que você precisa

**O que já temos instalado:**
O projeto já tem algumas dependências necessárias:
- `clsx` e `tailwind-merge`: Pra combinar classes CSS
- `class-variance-authority`: Pra variantes de componentes
- `lucide-react`: Ícones usados nos componentes
- `tailwindcss-animate`: Animações do Tailwind

**Instalando dependências adicionais (se necessário):**

```bash
npm install clsx tailwind-merge class-variance-authority lucide-react
npm install -D tailwindcss-animate
```

**Criando arquivo de configuração do shadcn:**

Na raiz do projeto, crie um arquivo `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

**Explicando a configuração:**
- `style: "default"`: Estilo padrão dos componentes
- `rsc: false`: Não estamos usando React Server Components
- `tsx: true`: Usar TypeScript
- `tailwind.config`: Caminho do arquivo de configuração do Tailwind
- `css`: Caminho do arquivo CSS principal
- `cssVariables: true`: Usar variáveis CSS (já configuramos)
- `aliases`: Atalhos pra importar componentes

**Criando pasta para componentes UI:**

```bash
mkdir src/components/ui
```

**Instalando o CLI do shadcn (opcional mas recomendado):**

```bash
npx shadcn-ui@latest init
```

Isso vai fazer algumas perguntas:
- **Would you like to use TypeScript?** → Yes
- **Which style would you like to use?** → Default
- **Which color would you like to use as base color?** → Slate
- **Where is your global CSS file?** → src/index.css
- **Would you like to use CSS variables for colors?** → Yes
- **Where is your tailwind.config.js located?** → tailwind.config.js
- **Configure the import alias for components?** → @/components
- **Configure the import alias for utils?** → @/lib/utils

**OU você pode configurar manualmente:**

O arquivo `components.json` que criamos já tem tudo configurado. Agora você pode instalar componentes individualmente.

**Instalando componentes do shadcn:**

Para instalar um componente, use:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
```

**Exemplo: Instalando o componente Button:**

```bash
npx shadcn-ui@latest add button
```

Isso vai:
1. Criar o arquivo `src/components/ui/button.tsx`
2. Adicionar as dependências necessárias (se houver)
3. Atualizar o arquivo de estilos se necessário

**Usando os componentes:**

Depois de instalar, você pode usar assim:

```tsx
import { Button } from "@/components/ui/button"

function App() {
  return (
    <div>
      <Button>Clique aqui</Button>
      <Button variant="outline">Outro botão</Button>
      <Button variant="destructive">Deletar</Button>
    </div>
  )
}
```

**Componentes mais usados:**

```bash
# Componentes básicos
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add switch

# Feedback
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add tooltip

# Navegação
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add navigation-menu

# Layout
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add accordion
```

**Exemplo completo usando shadcn:**

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LoginForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Entre na sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

**Vantagens do shadcn/ui:**
- ✅ Componentes acessíveis (ARIA compliant)
- ✅ Customizáveis (você tem o código)
- ✅ Leves (só instala o que precisa)
- ✅ TypeScript nativo
- ✅ Integração perfeita com Tailwind

**Documentação completa:**
- Site oficial: https://ui.shadcn.com
- Componentes disponíveis: https://ui.shadcn.com/docs/components
- Exemplos: https://ui.shadcn.com/examples

---

### **7. Configurando Path Aliases no TypeScript**

Path aliases permitem importar arquivos usando `@/` ao invés de `../../`. Facilita muito a organização!

**Configurando o vite.config.ts:**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**Configurando o tsconfig.json:**

Adicione essas linhas no `compilerOptions`:

```json
{
  "compilerOptions": {
    // ... outras opções
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Agora podemos usar:**

```tsx
// Antes:
import { Button } from '../../../components/Button'

// Agora:
import { Button } from '@/components/Button'
```

Muito mais limpo! 🎯

---

### **8. Criando a Estrutura de Pastas**

Vamos organizar o projeto de forma profissional:

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── contexts/           # Contexts do React (estado global)
├── hooks/              # Custom hooks
├── lib/                # Utilitários e configurações
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

**Criando as pastas:**

No terminal (dentro da pasta `src`):

```bash
mkdir components pages contexts hooks lib
```

Ou crie manualmente no VS Code.

**Estrutura explicada:**
- **components/**: Componentes que podem ser reutilizados (Button, Card, Header, etc)
- **pages/**: Componentes que representam páginas completas (Home, Login, etc)
- **contexts/**: Contexts do React pra estado global (AuthContext, etc)
- **hooks/**: Custom hooks (useAuth, useLocalStorage, etc)
- **lib/**: Funções utilitárias e configurações (supabase.ts, utils.ts, etc)

---

### **9. Configurando React Router**

React Router permite criar rotas e navegação entre páginas.

**Criando arquivo de rotas básico:**

No `src/App.tsx`, vamos configurar as rotas:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

**Explicando:**
- `BrowserRouter`: Componente que habilita o roteamento
- `Routes`: Container de todas as rotas
- `Route`: Define uma rota específica
  - `path`: URL da rota
  - `element`: Componente a ser renderizado

**Criando páginas básicas:**

**src/pages/Home.tsx:**
```tsx
const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Página Home</h1>
    </div>
  )
}

export default Home
```

**src/pages/Login.tsx:**
```tsx
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">Página de Login</h1>
    </div>
  )
}

export default Login
```

**Testando as rotas:**

1. Execute `npm run dev`
2. Acesse http://localhost:5173 (deve mostrar Home)
3. Acesse http://localhost:5173/login (deve mostrar Login)

Se funcionar, as rotas estão configuradas! ✅

---

### **10. Configurando Supabase (Estrutura Base)**

Vamos preparar a estrutura pra usar Supabase, mas sem configurar ainda (isso vem na próxima aula).

**Criando arquivo de configuração do Supabase:**

**src/lib/supabase.ts:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Criando arquivo .env:**

Na raiz do projeto, crie um arquivo `.env`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**⚠️ IMPORTANTE:**
- Por enquanto deixe vazio (vamos preencher depois)
- O arquivo `.env` já deve estar no `.gitignore` (não vai pro GitHub)

**Criando arquivo .env.example:**

Crie também um `.env.example` (esse pode ir pro GitHub):

```env
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

Isso serve como template pra outros desenvolvedores saberem quais variáveis precisam.

---

### **11. Configurando Git e .gitignore**

Vamos configurar o controle de versão.

**Inicializando Git:**

```bash
git init
```

**Criando/Verificando .gitignore:**

O Vite já cria um `.gitignore`, mas vamos garantir que está completo:

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production
```

**Fazendo o primeiro commit:**

```bash
git add .
git commit -m "feat: configuração inicial do projeto"
```

---

### **12. Criando Componentes Base**

Vamos criar alguns componentes básicos que vamos usar:

**src/lib/utils.ts (utilitários):**

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Explicando:**
- `cn`: Função helper pra combinar classes do Tailwind
- `clsx`: Combina classes condicionalmente
- `twMerge`: Mescla classes do Tailwind evitando conflitos

**Exemplo de uso:**
```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  "px-4 py-2",
  isActive && "bg-blue-500",
  className
)}>
```

**src/components/LoadingScreen.tsx:**

```tsx
const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl font-semibold">Carregando...</p>
      </div>
    </div>
  )
}

export default LoadingScreen
```

---

### **13. Configurando ESLint (Opcional mas Recomendado)**

ESLint ajuda a manter o código consistente e encontrar erros.

**O Vite já vem com ESLint configurado**, mas vamos verificar:

**Arquivo .eslintrc.cjs (se não existir, crie):**

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

**Scripts no package.json:**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

**Testando:**
```bash
npm run lint
```

---

### **14. Testando Tudo**

Vamos fazer um teste completo pra garantir que tudo está funcionando:

**1. Testar o servidor de desenvolvimento:**
```bash
npm run dev
```
Deve abrir em http://localhost:5173 sem erros.

**2. Testar o build de produção:**
```bash
npm run build
```
Deve criar uma pasta `dist` com os arquivos otimizados.

**3. Testar o preview do build:**
```bash
npm run preview
```
Deve abrir uma versão de produção localmente.

**4. Testar o linter:**
```bash
npm run lint
```
Não deve ter erros críticos.

**5. Verificar estrutura de pastas:**
```
src/
├── components/
├── pages/
├── contexts/
├── hooks/
├── lib/
├── App.tsx
├── main.tsx
└── index.css
```

---

### **15. Criando README.md**

Vamos documentar o projeto:

**README.md:**

```markdown
# DevLingo

Aplicação de aprendizado de programação com gamificação.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Supabase

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📝 Scripts

- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Cria build de produção
- `npm run preview`: Preview do build de produção
- `npm run lint`: Verifica erros de código
```

---

## [Conclusão]

Resumindo o que configuramos: criamos um projeto React do zero usando Vite, configuramos TypeScript pra ter tipagem, instalamos e configuramos Tailwind CSS pra estilização moderna, configuramos shadcn/ui pra ter componentes acessíveis e bonitos, configuramos React Router pra navegação, criamos a estrutura de pastas organizada, preparamos a base pro Supabase, e configuramos Git pra controle de versão. Tu aprendeu na prática como configurar um projeto React moderno do zero, entendendo cada ferramenta e sua função.

**O que temos agora:**
- ✅ Projeto React + TypeScript funcionando
- ✅ Tailwind CSS configurado
- ✅ shadcn/ui configurado e pronto pra usar
- ✅ React Router configurado
- ✅ Estrutura de pastas organizada
- ✅ Base pro Supabase preparada
- ✅ Git configurado

**Próximos passos:**
- Configurar Supabase completamente
- Implementar autenticação
- Criar páginas e componentes
- Implementar funcionalidades

---

## [Descrição da aula para plataforma de vídeo]

Aprende como configurar um projeto React moderno do zero usando Vite, TypeScript, Tailwind CSS, shadcn/ui e React Router. Configura todas as ferramentas necessárias, estrutura de pastas profissional, componentes UI acessíveis, e prepara a base pra desenvolvimento. Tudo explicado passo a passo de forma didática.

---

## [Pontuação da didática da aula]

**10/10** - Aula essencial que ensina a base de qualquer projeto React moderno. Explicações claras, passo a passo, e cobre todos os aspectos necessários pra começar a desenvolver.

---

## [Links e códigos da aula]

**Ferramentas e Documentação:**
- **Vite:** https://vitejs.dev
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com
- **shadcn/ui:** https://ui.shadcn.com
- **React Router:** https://reactrouter.com
- **Supabase:** https://supabase.com

**Comandos principais:**

**Criar projeto:**
```bash
npm create vite@latest devlingo -- --template react-ts
cd devlingo
npm install
```

**Instalar dependências:**
```bash
npm install react-router-dom @supabase/supabase-js lucide-react react-icons
npm install clsx tailwind-merge class-variance-authority
npm install -D @types/react-router-dom tailwindcss postcss autoprefixer tailwindcss-animate
```

**Configurar shadcn/ui:**
```bash
# Criar arquivo components.json (copiar conteúdo da seção 6)
npx shadcn-ui@latest init
# Instalar componentes conforme necessário
npx shadcn-ui@latest add button card input label
```

**Configurar Tailwind:**
```bash
npx tailwindcss init -p
```

**Scripts do package.json:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

**Estrutura de pastas final:**
```
devlingo/
├── public/
├── src/
│   ├── components/
│   │   └── ui/          # Componentes do shadcn/ui
│   ├── pages/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── components.json      # Configuração do shadcn/ui
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

**Arquivos de configuração completos:**

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**components.json (configuração do shadcn/ui):**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

**src/lib/utils.ts:**
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**src/lib/supabase.ts:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**src/App.tsx (exemplo básico):**
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

**Referências externas:**
- **Vite Docs:** https://vitejs.dev/guide/
- **React Docs:** https://react.dev/learn
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/intro.html
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **shadcn/ui Docs:** https://ui.shadcn.com
- **React Router Docs:** https://reactrouter.com/en/main

