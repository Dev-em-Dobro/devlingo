import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  name: string | null
  total_xp: number
}

export const useUserProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('user_profiles')
          .select('id, email, name, total_xp')
          .eq('id', user.id)
          .single()

        if (fetchError) {
          console.error('Erro ao buscar perfil:', fetchError)
          setError(fetchError as Error)
          setProfile(null)
        } else {
          setProfile(data)
          setError(null)
        }
      } catch (err) {
        console.error('Erro inesperado ao buscar perfil:', err)
        setError(err as Error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()

    // Criar um listener para atualizar quando o perfil mudar (via realtime do Supabase)
    const channel = supabase
      .channel('user_profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Perfil atualizado:', payload.new)
          setProfile(payload.new as UserProfile)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return { profile, loading, error }
}

