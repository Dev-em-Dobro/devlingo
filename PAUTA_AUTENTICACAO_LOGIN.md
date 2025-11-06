# Pauta de Aula: Autenticação - Login com Email e Senha

## [Introdução]

Nessa aula tu vai aprender como implementar autenticação de usuários usando email e senha no React. Vamos usar o Supabase como backend, criar um contexto de autenticação para gerenciar o estado do usuário em toda a aplicação, e construir uma página de login completa com validação e tratamento de erros. Tu vai entender na prática como funciona autenticação em aplicações modernas, como usar Context API do React, e como integrar com serviços externos de forma segura.

---

## [Tópicos principais]

### **1. Entendendo o que é Autenticação**

Antes de começar a codar, é importante entender o conceito:

**O que é autenticação?**
- É o processo de verificar quem você é
- No nosso caso, vamos verificar se o email e senha que o usuário digitou estão corretos
- Se estiverem corretos, o usuário consegue acessar a aplicação
- Se não estiverem, mostramos uma mensagem de erro

**Por que usar Supabase?**
- O Supabase é um Backend as a Service (BaaS)
- Ele já tem toda a infraestrutura de autenticação pronta
- Não precisamos criar servidor, banco de dados, ou sistema de segurança do zero
- Ele cuida de coisas complexas como: hash de senhas, tokens de autenticação, sessões, etc.

**Fluxo de autenticação:**
1. Usuário digita email e senha no formulário
2. Enviamos esses dados pro Supabase
3. Supabase verifica se o email existe e se a senha está correta
4. Se estiver correto, Supabase retorna um token de autenticação
5. Guardamos esse token e usamos pra identificar o usuário nas próximas requisições

---

### **2. Configurando o Supabase no Projeto**

Primeiro, precisamos configurar o cliente do Supabase no nosso projeto.

**Passo 1: Instalar o pacote do Supabase**

```bash
npm install @supabase/supabase-js
```

**Passo 2: Criar arquivo de configuração**

Vamos criar o arquivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Explicando o código:**
- `createClient`: Função do Supabase que cria uma conexão com o backend
- `import.meta.env.VITE_SUPABASE_URL`: Pega a URL do Supabase das variáveis de ambiente
- `import.meta.env.VITE_SUPABASE_ANON_KEY`: Pega a chave pública do Supabase
- Por que usar variáveis de ambiente? Porque não queremos expor essas informações no código (segurança)

**Passo 3: Criar arquivo .env**

Na raiz do projeto, criar arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
```

**⚠️ IMPORTANTE:**
- Substitua pelos valores reais do seu projeto no Supabase
- O arquivo `.env` já deve estar no `.gitignore` (não vai pro GitHub)
- Nunca compartilhe essas chaves publicamente

**Como obter essas credenciais:**
1. Acesse o dashboard do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. Vá em Settings > API
4. Copie a "Project URL" e a "anon public key"

---

### **3. Criando o Context de Autenticação**

O Context API do React permite compartilhar dados entre componentes sem precisar passar props manualmente. Vamos criar um contexto pra gerenciar o estado de autenticação.

**Por que usar Context?**
- O estado do usuário (logado ou não) precisa ser acessível em vários lugares
- Sem Context, teríamos que passar props por vários componentes (prop drilling)
- Com Context, qualquer componente pode acessar o estado do usuário

**Criando o AuthContext:**

Vamos criar `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Define o tipo do nosso contexto
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

// Cria o contexto (começa como undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook customizado pra usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

**Explicando:**
- `createContext`: Cria um novo contexto
- `useAuth`: Hook customizado que facilita o uso do contexto
- Se alguém tentar usar `useAuth` fora do Provider, vai dar erro (proteção)

**Criando o Provider:**

Agora vamos criar o componente Provider que vai envolver a aplicação:

```typescript
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Verifica se já existe uma sessão quando a aplicação carrega
  useEffect(() => {
    // Busca a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuta mudanças no estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Limpa a subscription quando o componente desmonta
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Função de logout
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

**Explicando passo a passo:**

1. **Estados:**
   - `user`: Guarda os dados do usuário logado (ou null se não estiver logado)
   - `session`: Guarda a sessão de autenticação (contém o token)
   - `loading`: Indica se ainda está verificando a sessão inicial

2. **useEffect:**
   - Roda quando o componente monta (quando a aplicação carrega)
   - `getSession()`: Verifica se já existe uma sessão salva (usuário já estava logado)
   - `onAuthStateChange`: Escuta mudanças no estado de autenticação (login, logout, etc.)
   - Quando detecta mudança, atualiza os estados automaticamente

3. **signIn:**
   - Recebe email e senha
   - Chama `supabase.auth.signInWithPassword()`
   - Se der erro, retorna o erro
   - Se der certo, o `onAuthStateChange` vai detectar e atualizar os estados

4. **signOut:**
   - Chama `supabase.auth.signOut()`
   - Remove a sessão
   - O `onAuthStateChange` detecta e atualiza os estados

**Envolvendo a aplicação com o Provider:**

No `src/main.tsx` ou `src/App.tsx`:

```typescript
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      {/* Resto da aplicação */}
    </AuthProvider>
  )
}
```

---

### **4. Criando a Página de Login**

Agora vamos criar a interface de login. Vamos criar `src/pages/Login.tsx`:

```typescript
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
        setLoading(false)
      } else {
        // Login bem-sucedido, redireciona
        navigate('/')
        setLoading(false)
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9225D4] to-[#6c19a0] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Bem-vindo de volta!
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#9225D4]"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#9225D4]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9225D4] hover:bg-[#7a1fb3] text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
```

**Explicando o código:**

1. **Estados locais:**
   - `email` e `password`: Guardam os valores dos inputs
   - `error`: Guarda mensagem de erro (se houver)
   - `loading`: Indica se está processando o login

2. **handleSubmit:**
   - `e.preventDefault()`: Previne o comportamento padrão do formulário (recarregar página)
   - Limpa erros anteriores
   - Ativa o loading
   - Chama `signIn` do contexto
   - Se der erro, mostra mensagem
   - Se der certo, redireciona pra home

3. **Formulário:**
   - `onSubmit={handleSubmit}`: Quando o usuário submete o form
   - `required`: Validação HTML básica (não pode estar vazio)
   - `disabled={loading}`: Desabilita inputs e botão durante o loading
   - `onChange`: Atualiza os estados quando o usuário digita

4. **Exibição de erro:**
   - Só mostra se `error` não for null
   - Estilizado com cores vermelhas pra chamar atenção

---

### **5. Entendendo o Fluxo Completo**

Vamos entender o que acontece quando o usuário faz login:

1. **Usuário preenche o formulário** e clica em "Entrar"
2. **handleSubmit é chamado** e previne o reload da página
3. **signIn do contexto é chamado** com email e senha
4. **Supabase recebe a requisição** e valida as credenciais
5. **Se válido:**
   - Supabase retorna uma sessão com token
   - `onAuthStateChange` detecta a mudança
   - Estados `user` e `session` são atualizados no contexto
   - Usuário é redirecionado pra home
6. **Se inválido:**
   - Supabase retorna um erro
   - Erro é exibido na tela
   - Usuário pode tentar novamente

**Por que o estado é atualizado automaticamente?**
- O `onAuthStateChange` fica "escutando" mudanças no Supabase
- Quando o login acontece, o Supabase emite um evento
- Nosso código captura esse evento e atualiza os estados
- Isso garante que todos os componentes que usam `useAuth()` vejam a mudança

---

### **6. Criando Rotas Protegidas**

Agora vamos proteger rotas que só devem ser acessadas por usuários logados.

**Criando componente ProtectedRoute:**

```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
```

**Explicando:**
- Se ainda está carregando, mostra loading
- Se não tem usuário, redireciona pra `/login`
- Se tem usuário, renderiza o conteúdo (children)

**Usando nas rotas:**

```typescript
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
```

---

### **7. Tratamento de Erros Comum**

Vamos melhorar o tratamento de erros pra dar feedbacks mais específicos:

```typescript
const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Erros comuns do Supabase
      if (error.message.includes('Invalid login credentials')) {
        return { error: new Error('Email ou senha incorretos') }
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: new Error('Por favor, confirme seu email antes de fazer login') }
      }
      return { error }
    }

    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}
```

**Erros comuns:**
- "Invalid login credentials": Email ou senha errados
- "Email not confirmed": Email não foi confirmado (se confirmação estiver habilitada)
- "Too many requests": Muitas tentativas de login (rate limiting)

---

### **8. Adicionando Timeout de Segurança**

Pra evitar que a aplicação trave se o Supabase demorar muito pra responder:

```typescript
const signIn = async (email: string, password: string) => {
  try {
    // Cria uma promise com timeout
    const loginPromise = supabase.auth.signInWithPassword({
      email,
      password,
    })

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: Login demorou muito')), 8000)
    })

    // Usa Promise.race pra pegar a primeira que resolver
    const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any

    if (error) {
      return { error }
    }

    return { error: null }
  } catch (error: any) {
    if (error?.message?.includes('Timeout')) {
      return { error: new Error('Login demorou muito. Verifique sua conexão.') }
    }
    return { error: error as Error }
  }
}
```

**Explicando:**
- `Promise.race`: Retorna a primeira promise que resolver (sucesso ou erro)
- Se o login demorar mais de 8 segundos, o timeout vence primeiro
- Isso evita que a aplicação fique travada esperando resposta

---

### **9. Testando a Autenticação**

Vamos testar passo a passo:

1. **Teste de login com credenciais válidas:**
   - Preencha email e senha de um usuário que existe
   - Clique em "Entrar"
   - Deve redirecionar pra home
   - Verifique no console se o usuário foi setado

2. **Teste de login com credenciais inválidas:**
   - Preencha email ou senha errados
   - Deve mostrar mensagem de erro
   - Não deve redirecionar

3. **Teste de rota protegida:**
   - Tente acessar uma rota protegida sem estar logado
   - Deve redirecionar pra `/login`

4. **Teste de persistência de sessão:**
   - Faça login
   - Recarregue a página
   - Deve continuar logado (sessão foi salva)

---

## [Conclusão]

Resumindo o que implementamos: configuramos o Supabase no projeto, criamos um contexto de autenticação usando Context API do React, implementamos a função de login que se comunica com o Supabase, criamos uma página de login completa com validação e tratamento de erros, e protegemos rotas que só devem ser acessadas por usuários autenticados. Tu aprendeu na prática como funciona autenticação em aplicações React modernas, como usar Context API pra gerenciar estado global, e como integrar com serviços externos de forma segura.

**Conceitos importantes aprendidos:**
- Autenticação e autorização
- Context API do React
- Gerenciamento de estado global
- Integração com Supabase
- Rotas protegidas
- Tratamento de erros
- Timeout de segurança

Na próxima aula vamos implementar o cadastro de novos usuários e melhorar ainda mais a experiência de autenticação!

---

## [Descrição da aula para plataforma de vídeo]

Aprende como implementar autenticação com email e senha em React usando Supabase. Implementa Context API para gerenciar estado de autenticação, cria página de login completa com validação, protege rotas que exigem autenticação, e trata erros de forma adequada. Tudo explicado passo a passo de forma didática.

---

## [Pontuação da didática da aula]

**9/10** - Aula muito prática que ensina conceitos fundamentais (Context API, autenticação, integração com backend) enquanto constrói funcionalidades reais. A progressão é lógica e as explicações são claras e detalhadas.

---

## [Links e códigos da aula]

**Projeto:**
- **Repositório:** [Link do repositório]
- **Supabase Dashboard:** https://app.supabase.com

**Documentação:**
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **React Context API:** https://react.dev/reference/react/useContext
- **Supabase JavaScript Client:** https://supabase.com/docs/reference/javascript/auth-signinwithpassword

**Ferramentas utilizadas:**
- **Supabase:** Backend as a Service para autenticação
- **React Context API:** Gerenciamento de estado global
- **React Router:** Navegação e rotas protegidas

**Códigos da aula:**

**src/lib/supabase.ts:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**src/contexts/AuthContext.tsx:**
```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

**src/pages/Login.tsx:**
```typescript
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
        setLoading(false)
      } else {
        navigate('/')
        setLoading(false)
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9225D4] to-[#6c19a0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Bem-vindo de volta!
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#9225D4] disabled:opacity-50"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#9225D4] disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9225D4] hover:bg-[#7a1fb3] text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
```

**src/components/ProtectedRoute.tsx:**
```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
```

**Variáveis de ambiente (.env):**
```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
```

**Referências externas:**
- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth
- **React Context API:** https://react.dev/reference/react/useContext
- **React Router:** https://reactrouter.com/

