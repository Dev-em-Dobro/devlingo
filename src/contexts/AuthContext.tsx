import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Função helper para criar ou atualizar perfil do usuário
const createOrUpdateUserProfile = async (user: User) => {
  // Verifica se o Supabase está configurado
  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || ''
  
  if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
    console.warn('⚠️ Supabase não está configurado. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env')
    return { error: new Error('Supabase não configurado') }
  }

  if (!user || !user.id || !user.email) {
    console.error('❌ Usuário inválido para criar perfil:', user)
    return { error: new Error('Usuário inválido') }
  }

  console.log('🔍 Tentando criar/verificar perfil para usuário:', {
    id: user.id,
    email: user.email,
  })

  try {
    // Verifica se o perfil já existe
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    // Se já existe, não precisa criar novamente
    if (existingProfile && !fetchError) {
      console.log('✅ Perfil do usuário já existe')
      return { error: null }
    }

    // Se não existe (ou deu erro que não seja "não encontrado"), cria o perfil
    const name = 
      user.user_metadata?.full_name || 
      user.user_metadata?.name || 
      user.email?.split('@')[0] || 
      'Usuário'

    console.log('📝 Criando novo perfil com dados:', {
      id: user.id,
      email: user.email,
      name: name,
    })

    const { data: insertedData, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email,
        name: name,
        total_xp: 0,
      })
      .select()

    if (insertError) {
      // Se o erro for de violação de constraint única (perfil já existe), não é um erro crítico
      if (insertError.code === '23505') {
        console.log('✅ Perfil do usuário já existe (detectado no insert)')
        return { error: null }
      }
      console.error('❌ Erro ao criar perfil do usuário:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      })
      return { error: insertError }
    }

    console.log('✅ Perfil do usuário criado com sucesso!', insertedData)
    return { error: null }
  } catch (error) {
    console.error('❌ Erro inesperado ao criar perfil:', error)
    return { error: error as Error }
  }
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
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
    // Timeout de segurança: após 5 segundos, força o loading para false
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Timeout ao verificar sessão inicial - forçando loading para false')
      setLoading(false)
    }, 5000)
    
    // Verificar sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Criar perfil se usuário existe e estiver logado
      // Não bloqueia o carregamento se houver erro
      if (session?.user) {
        try {
          await createOrUpdateUserProfile(session.user)
        } catch (error) {
          console.error('Erro ao criar perfil na inicialização:', error)
          // Não bloqueia o carregamento
        }
      }
      
      clearTimeout(timeoutId)
      setLoading(false)
    }).catch((error) => {
      console.error('Erro ao verificar sessão inicial:', error)
      clearTimeout(timeoutId)
      setLoading(false)
    })

    // Ouvir mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Auth state changed:', _event, session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)
      
      // Criar perfil quando usuário faz login ou cadastro
      // Não bloqueia o carregamento se houver erro
      if (session?.user && _event !== 'INITIAL_SESSION') {
        // Não await - executa em background para não bloquear
        setTimeout(() => {
          createOrUpdateUserProfile(session.user).then((profileError) => {
            if (profileError.error) {
              console.error('Erro ao criar perfil no auth state change:', profileError.error)
            } else {
              console.log('✅ Perfil criado/verificado no auth state change')
            }
          }).catch((error) => {
            console.error('Erro inesperado ao criar perfil:', error)
          })
        }, 100) // Pequeno delay para não conflitar com outras operações
      }
      
      setLoading(false)
    })

    return () => {
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      console.log('📝 Iniciando cadastro de usuário:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        console.error('❌ Erro no cadastro:', error)
        return { error }
      }

      console.log('✅ Usuário cadastrado com sucesso:', data.user?.id)
      console.log('📊 Dados do cadastro:', {
        user: data.user,
        session: data.session,
      })

      // Se houver sessão (usuário autenticado imediatamente), criar perfil
      // Caso contrário, o perfil será criado quando o usuário confirmar o email e fazer login
      if (data.session && data.user) {
        console.log('🔧 Criando perfil para o usuário (sessão ativa)...')
        const profileError = await createOrUpdateUserProfile(data.user)
        if (profileError.error) {
          console.error('❌ Erro ao criar perfil após cadastro:', profileError.error)
          // Não bloqueia o cadastro se falhar ao criar perfil, mas mostra alerta
          alert('Usuário cadastrado, mas houve um erro ao criar o perfil. Verifique o console para mais detalhes.')
        } else {
          console.log('✅ Perfil criado com sucesso após cadastro')
        }
      } else if (data.user && !data.session) {
        console.log('ℹ️ Usuário criado mas não autenticado ainda (confirmação de email pode estar habilitada)')
        console.log('ℹ️ O perfil será criado automaticamente quando o usuário confirmar o email e fazer login')
      } else {
        console.warn('⚠️ Usuário não retornado após cadastro')
      }

      return { error: null }
    } catch (error) {
      console.error('❌ Erro inesperado no cadastro:', error)
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login:', email)
      console.log('🔐 Supabase client:', supabase ? 'OK' : 'NÃO INICIALIZADO')
      
      // Criar uma promise com timeout para evitar travar
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      })

      // Timeout de segurança: 8 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: signInWithPassword demorou muito')), 8000)
      })

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any
      
      console.log('🔐 Resposta do signInWithPassword:', { 
        hasData: !!data, 
        hasError: !!error,
        userId: data?.user?.id 
      })

      if (error) {
        console.error('❌ Erro no login:', {
          code: error.code,
          message: error.message,
          status: error.status,
        })
        return { error }
      }

      if (!data || !data.user) {
        console.error('❌ Login retornou sem dados do usuário')
        return { error: new Error('Login retornou sem dados do usuário') }
      }

      console.log('✅ Login realizado com sucesso:', data.user.id)

      // NÃO criar perfil aqui - deixar o onAuthStateChange fazer isso
      // Isso evita race conditions e conflitos

      return { error: null }
    } catch (error: any) {
      console.error('❌ Erro inesperado no login:', {
        message: error?.message,
        stack: error?.stack,
        error: error,
      })
      
      // Se for timeout, retornar erro específico
      if (error?.message?.includes('Timeout')) {
        return { error: new Error('Login demorou muito para responder. Verifique sua conexão.') }
      }
      
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('mock_google_session')
  }

  const signInWithGoogle = async () => {
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || ''
    
    // Se Supabase estiver configurado, usa OAuth real
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/language-selection`,
          },
        })
        
        if (error) {
          console.error('Erro no login com Google:', error)
          throw error
        }
        
        // O perfil será criado automaticamente pelo onAuthStateChange quando o usuário retornar
      } catch (error) {
        console.error('Erro no login com Google:', error)
        throw error
      }
    } else {
      // Mock de login com Google - simula autenticação para desenvolvimento
      try {
        // Simula um delay de autenticação
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Cria um usuário mock temporário apenas para desenvolvimento
        const mockUser = {
          id: 'mock-google-user-' + Date.now(),
          email: 'usuario.google@gmail.com',
          app_metadata: {},
          user_metadata: {
            name: 'Usuário Google',
            avatar_url: '',
          },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User

        const mockSession = {
          access_token: 'mock-token',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Date.now() / 1000 + 3600,
          refresh_token: 'mock-refresh-token',
          user: mockUser,
        } as Session

        setSession(mockSession)
        setUser(mockUser)
        
        // Criar perfil mock (não será salvo no Supabase, mas simula o comportamento)
        console.log('Mock Google login realizado. Configure as credenciais do Google no Supabase para usar autenticação real.')
        
        // Salva no localStorage para persistência (apenas para mock)
        localStorage.setItem('mock_google_session', JSON.stringify(mockSession))
      } catch (error) {
        console.error('Erro no mock de login Google:', error)
        throw error
      }
    }
  }

  // Recupera sessão mock do localStorage ao carregar (apenas para desenvolvimento)
  useEffect(() => {
    const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || ''
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      const mockSession = localStorage.getItem('mock_google_session')
      if (mockSession) {
        try {
          const session = JSON.parse(mockSession)
          // Verifica se a sessão não expirou
          if (session.expires_at && session.expires_at > Date.now() / 1000) {
            setSession(session)
            setUser(session.user)
          } else {
            localStorage.removeItem('mock_google_session')
          }
        } catch (error) {
          localStorage.removeItem('mock_google_session')
        }
      }
    }
  }, [])

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
