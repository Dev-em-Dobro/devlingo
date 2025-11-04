import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Loader2 } from 'lucide-react'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import { useAuth } from '../contexts/AuthContext'
import { lessonsData, Question } from '../lib/lessonsData'
import AnswerFeedbackPopup from '../components/AnswerFeedbackPopup'
import { saveLessonScore } from '../lib/saveLessonScore'

const LessonScreen = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { preferences } = useUserPreferences()
  const { user } = useAuth()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [lives, setLives] = useState(3)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [answers] = useState<boolean[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null)
  const [isSavingScore, setIsSavingScore] = useState(false)

  // Buscar a lição atual
  const lesson = preferences.language && preferences.level && lessonId
    ? lessonsData[preferences.language][preferences.level].find(l => l.id === lessonId)
    : null

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lição não encontrada</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#58CC02] text-white px-6 py-2 rounded-xl"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion: Question = lesson.questions[currentQuestionIndex]
  const totalQuestions = lesson.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleCheck = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    // Registrar resposta
    answers[currentQuestionIndex] = correct
    
    // Mostrar feedback de resposta
    setFeedbackType(correct ? 'correct' : 'incorrect')
    setShowFeedback(true)
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1)
    } else {
      setWrongAnswers(prev => prev + 1)
      // Consumir um coração quando erra
      setLives(prev => Math.max(0, prev - 1))
    }
  }

  const handleNext = async () => {
    // Esconder feedback antes de avançar
    setShowFeedback(false)
    setFeedbackType(null)
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(false)
    } else {
      // Lição concluída - verificar se passou
      // Se acertou todas as questões (100% de precisão)
      if (wrongAnswers === 0 && correctAnswers === totalQuestions) {
        // Salvar pontuação antes de navegar
        if (user && lessonId && preferences.language && preferences.level) {
          setIsSavingScore(true)
          
          try {
            const result = await saveLessonScore({
              userId: user.id,
              lessonId,
              language: preferences.language,
              level: preferences.level,
              correctAnswers,
              wrongAnswers,
              xpEarned: lesson.xpReward,
            })

            if (result.error) {
              console.error('Erro ao salvar pontuação:', result.error)
              // Continua mesmo com erro ao salvar
            }
          } catch (error) {
            console.error('Erro inesperado ao salvar pontuação:', error)
          } finally {
            setIsSavingScore(false)
          }
        }

        // Tela de sucesso
        navigate('/lesson-success', {
          state: {
            lessonId,
            xpEarned: lesson.xpReward,
            accuracy: 100,
          },
        })
      } else {
        // Tela de resultado (teve erros) - não salva pontuação
        navigate('/lesson-result', {
          state: {
            correctAnswers,
            wrongAnswers,
            totalQuestions,
            lessonId,
          },
        })
      }
    }
  }

  const handleSkip = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(false)
    }
  }

  // Se perdeu todas as vidas durante a lição, redireciona para tela de resultado
  if (lives <= 0 && currentQuestionIndex < totalQuestions - 1) {
    const totalCorrect = correctAnswers
    const totalWrong = wrongAnswers + 1 // +1 da resposta atual que causou a perda de vida
    
    // Navegar para tela de resultado
    setTimeout(() => {
      navigate('/lesson-result', {
        state: {
          correctAnswers: totalCorrect,
          wrongAnswers: totalWrong,
          totalQuestions: currentQuestionIndex + 1,
          lessonId,
        },
      })
    }, 1500) // Pequeno delay para mostrar feedback
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Você perdeu todas as vidas!</h2>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 py-4 px-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X size={24} />
          </button>
          
          {/* Progress bar */}
          <div className="flex-1 h-2 bg-gray-200 rounded-full mx-4 overflow-hidden">
            <div
              className="h-full bg-gray-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Lives */}
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">❤️</span>
            <span className="font-bold text-gray-700">{lives}</span>
          </div>
        </div>
      </div>

      {/* Question section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* New word badge */}
        {currentQuestionIndex === 0 && (
          <div className="bg-[#9225D4] text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
            PALAVRA NOVA
          </div>
        )}

        {/* Question */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {currentQuestion.options?.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectAnswer = index === currentQuestion.correctAnswer
            let buttonClass = 'bg-white border-2 border-gray-300 text-gray-800 hover:border-gray-400'

            if (showResult) {
              if (isCorrectAnswer) {
                buttonClass = 'bg-green-500 border-2 border-green-600 text-white'
              } else if (isSelected && !isCorrect) {
                buttonClass = 'bg-red-500 border-2 border-red-600 text-white'
              } else {
                buttonClass = 'bg-white border-2 border-gray-300 text-gray-800 opacity-50'
              }
            } else if (isSelected) {
              buttonClass = 'bg-blue-100 border-2 border-blue-500 text-gray-800'
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`
                  p-6 rounded-2xl text-left transition-all relative
                  ${buttonClass}
                `}
              >
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="font-semibold text-lg mb-2">{option}</div>
              </button>
            )
          })}
        </div>

        {/* Bottom buttons - escondidos quando feedback está visível */}
        {!showFeedback && (
          <div className="flex gap-4 justify-between">
            <button
              onClick={handleSkip}
              disabled={showResult && isCorrect}
              className="px-8 py-4 bg-gray-300 text-gray-700 rounded-2xl font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
            >
              Pular
            </button>
            
            {!showResult ? (
            <button
              onClick={handleCheck}
              disabled={selectedAnswer === null || isSavingScore}
              className={`
                px-8 py-4 rounded-2xl font-bold uppercase transition-colors flex items-center justify-center gap-2
                ${selectedAnswer !== null && !isSavingScore
                  ? 'bg-[#58CC02] text-white hover:bg-[#4cb302]'
                  : 'bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400'
                }
              `}
            >
              {isSavingScore && <Loader2 className="w-5 h-5 animate-spin" />}
              Verificar
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isSavingScore}
              className="px-8 py-4 bg-[#58CC02] text-white rounded-2xl font-bold uppercase hover:bg-[#4cb302] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSavingScore && <Loader2 className="w-5 h-5 animate-spin" />}
              {currentQuestionIndex < totalQuestions - 1 ? 'Continuar' : 'Finalizar'}
            </button>
          )}
          </div>
        )}
      </div>

      {/* Feedback Popup para cada resposta */}
      <AnswerFeedbackPopup
        isOpen={showFeedback && showResult}
        type={feedbackType}
        onContinue={handleNext}
        isLoading={isSavingScore}
      />
    </div>
  )
}

export default LessonScreen

