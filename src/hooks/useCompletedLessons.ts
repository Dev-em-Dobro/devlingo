import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useUserPreferences } from '../contexts/UserPreferencesContext'

export const useCompletedLessons = () => {
  const { user } = useAuth()
  const { preferences } = useUserPreferences()
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !preferences.language || !preferences.level) {
      setCompletedLessonIds(new Set())
      setLoading(false)
      return
    }

    const fetchCompletedLessons = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('lesson_scores')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('language', preferences.language)
          .eq('level', preferences.level)

        if (error) {
          console.error('Erro ao buscar lições completadas:', error)
          setCompletedLessonIds(new Set())
        } else {
          const completedIds = new Set(data?.map(score => score.lesson_id) || [])
          setCompletedLessonIds(completedIds)
        }
      } catch (error) {
        console.error('Erro inesperado ao buscar lições completadas:', error)
        setCompletedLessonIds(new Set())
      } finally {
        setLoading(false)
      }
    }

    fetchCompletedLessons()

    // Criar um listener para atualizar quando uma lição for completada
    const channel = supabase
      .channel('lesson_scores_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lesson_scores',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Recarrega as lições completadas quando houver mudança
          fetchCompletedLessons()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, preferences.language, preferences.level])

  return { completedLessonIds, loading }
}

