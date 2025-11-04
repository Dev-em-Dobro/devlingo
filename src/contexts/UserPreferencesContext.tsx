import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

export type Language = 'html' | 'css' | 'javascript'
export type Level = 'beginner' | 'intermediate' | 'advanced'

interface UserPreferences {
  language: Language | null
  level: Level | null
}

interface UserPreferencesContextType {
  preferences: UserPreferences
  setLanguage: (language: Language) => void
  setLevel: (level: Level) => void
  hasCompletedSetup: boolean
  clearPreferences: () => void
  loading: boolean
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext)
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
}

interface UserPreferencesProviderProps {
  children: ReactNode
}

export const UserPreferencesProvider = ({ children }: UserPreferencesProviderProps) => {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: null,
    level: null,
  })
  const [loading, setLoading] = useState(true)
  // Flag para evitar salvar durante o carregamento inicial
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Carregar preferências do banco de dados quando o usuário fizer login
  useEffect(() => {
    if (!user) {
      setPreferences({ language: null, level: null })
      setLoading(false)
      setIsInitialLoad(true)
      return
    }

    const loadPreferences = async () => {
      try {
        setLoading(true)
        setIsInitialLoad(true)
        console.log('🔍 Carregando preferências do banco para usuário:', user.id)

        const { data, error } = await supabase
          .from('user_preferences')
          .select('language, level')
          .eq('user_id', user.id)
          .single()

        if (error) {
          // Se não encontrar preferências, não é um erro crítico
          if (error.code === 'PGRST116') {
            console.log('ℹ️ Nenhuma preferência encontrada para o usuário')
            setPreferences({ language: null, level: null })
          } else {
            console.error('❌ Erro ao carregar preferências:', error)
            // Tenta carregar do localStorage como fallback
            const saved = localStorage.getItem(`user_preferences_${user.id}`)
            if (saved) {
              try {
                const parsed = JSON.parse(saved)
                console.log('📦 Carregando preferências do localStorage (fallback):', parsed)
                setPreferences(parsed)
              } catch (e) {
                console.error('❌ Erro ao carregar do localStorage:', e)
              }
            }
          }
        } else if (data) {
          console.log('✅ Preferências carregadas do banco:', data)
          setPreferences({
            language: data.language as Language | null,
            level: data.level as Level | null,
          })
        }
      } catch (error) {
        console.error('❌ Erro inesperado ao carregar preferências:', error)
        // Tenta carregar do localStorage como fallback
        const saved = localStorage.getItem(`user_preferences_${user.id}`)
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            console.log('📦 Carregando preferências do localStorage (fallback):', parsed)
            setPreferences(parsed)
          } catch (e) {
            console.error('❌ Erro ao carregar do localStorage:', e)
          }
        }
      } finally {
        setLoading(false)
        // Aguarda um pequeno delay antes de permitir salvamentos
        setTimeout(() => setIsInitialLoad(false), 100)
      }
    }

    loadPreferences()
  }, [user])

  // Salvar preferências no banco de dados quando mudarem
  useEffect(() => {
    if (!user || loading || isInitialLoad) return

    const savePreferences = async () => {
      try {
        console.log('💾 Salvando preferências no banco:', { 
          user_id: user.id, 
          language: preferences.language, 
          level: preferences.level 
        })

        const { data, error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            language: preferences.language,
            level: preferences.level,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
          })
          .select()

        if (error) {
          console.error('❌ Erro ao salvar preferências no banco:', error)
          // Fallback: salvar no localStorage
          localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(preferences))
        } else {
          console.log('✅ Preferências salvas com sucesso:', data)
          // Limpa o localStorage se salvou com sucesso no banco
          localStorage.removeItem(`user_preferences_${user.id}`)
        }
      } catch (error) {
        console.error('❌ Erro inesperado ao salvar preferências:', error)
        // Fallback: salvar no localStorage
        localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(preferences))
      }
    }

    // Só salva se tiver pelo menos uma preferência definida
    if (preferences.language || preferences.level) {
      savePreferences()
    }
  }, [preferences, user, loading, isInitialLoad])

  const setLanguage = (language: Language) => {
    setPreferences((prev) => ({ ...prev, language }))
  }

  const setLevel = (level: Level) => {
    setPreferences((prev) => ({ ...prev, level }))
  }

  const clearPreferences = async () => {
    setPreferences({ language: null, level: null })
    if (user) {
      try {
        await supabase
          .from('user_preferences')
          .delete()
          .eq('user_id', user.id)
        localStorage.removeItem(`user_preferences_${user.id}`)
      } catch (error) {
        console.error('Erro ao limpar preferências:', error)
        localStorage.removeItem(`user_preferences_${user.id}`)
      }
    }
  }

  const hasCompletedSetup = preferences.language !== null && preferences.level !== null

  const value = {
    preferences,
    setLanguage,
    setLevel,
    hasCompletedSetup,
    clearPreferences,
    loading,
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

