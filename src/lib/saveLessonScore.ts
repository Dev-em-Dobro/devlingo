import { supabase } from './supabase'

interface SaveLessonScoreParams {
  userId: string
  lessonId: string
  language: string
  level: string
  correctAnswers: number
  wrongAnswers: number
  xpEarned: number
}

/**
 * Salva a pontuação da lição no Supabase e atualiza o XP total do usuário
 */
export const saveLessonScore = async ({
  userId,
  lessonId,
  language,
  level,
  correctAnswers,
  wrongAnswers,
  xpEarned,
}: SaveLessonScoreParams) => {
  if (!userId) {
    console.warn('⚠️ userId não fornecido, não é possível salvar pontuação')
    return { error: new Error('userId não fornecido') }
  }

  try {
    console.log('💾 Salvando pontuação da lição:', {
      userId,
      lessonId,
      language,
      level,
      correctAnswers,
      wrongAnswers,
      xpEarned,
    })

    // 1. Salvar ou atualizar pontuação da lição
    const { data: lessonScore, error: scoreError } = await supabase
      .from('lesson_scores')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        language,
        level,
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
        xp_earned: xpEarned,
      }, {
        onConflict: 'user_id,lesson_id', // Atualiza se já existir
      })
      .select()
      .single()

    if (scoreError) {
      console.error('❌ Erro ao salvar pontuação da lição:', scoreError)
      return { error: scoreError }
    }

    console.log('✅ Pontuação da lição salva:', lessonScore)

    // 2. Atualizar XP total do usuário
    // Buscar XP atual
    const { data: currentProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('total_xp')
      .eq('id', userId)
      .single()

    if (fetchError) {
      console.error('❌ Erro ao buscar perfil do usuário:', fetchError)
      return { error: fetchError }
    }

    const newTotalXP = (currentProfile?.total_xp || 0) + xpEarned

    // Atualizar XP total
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ total_xp: newTotalXP })
      .eq('id', userId)

    if (updateError) {
      console.error('❌ Erro ao atualizar XP total:', updateError)
      return { error: updateError }
    }

    console.log('✅ XP total atualizado:', {
      anterior: currentProfile?.total_xp || 0,
      ganho: xpEarned,
      novo: newTotalXP,
    })

    return { error: null, newTotalXP }
  } catch (error) {
    console.error('❌ Erro inesperado ao salvar pontuação:', error)
    return { error: error as Error }
  }
}

