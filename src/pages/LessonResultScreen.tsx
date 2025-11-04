import { useNavigate, useLocation } from 'react-router-dom'

const LessonResultScreen = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { 
    correctAnswers, 
    wrongAnswers, 
    totalQuestions,
    lessonId 
  } = (location.state as { 
    correctAnswers?: number
    wrongAnswers?: number
    totalQuestions?: number
    lessonId?: string
  }) || {}

  const accuracy = totalQuestions && totalQuestions > 0
    ? Math.round((correctAnswers || 0) / totalQuestions * 100)
    : 0

  const handleTryAgain = () => {
    if (lessonId) {
      navigate(`/lesson/${lessonId}`, { replace: true })
    } else {
      navigate('/')
    }
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      {/* Character */}
      <div className="mb-8">
        <img
          src="/devlingo-char.png"
          alt="Devlingo"
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Result message */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Você quase conseguiu!
      </h1>
      <p className="text-xl text-gray-600 mb-12 text-center">
        Continue praticando para melhorar
      </p>

      {/* Stats */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 mb-8 max-w-md w-full">
        <div className="space-y-6">
          {/* Correct answers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">Respostas corretas</span>
            </div>
            <span className="text-3xl font-bold text-green-600">{correctAnswers || 0}</span>
          </div>

          {/* Wrong answers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✗</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">Respostas incorretas</span>
            </div>
            <span className="text-3xl font-bold text-red-600">{wrongAnswers || 0}</span>
          </div>

          {/* Accuracy */}
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Precisão</span>
              <span className="text-2xl font-bold text-gray-800">{accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 w-full max-w-md">
        <button
          onClick={handleGoHome}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-4 rounded-2xl font-bold uppercase transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleTryAgain}
          className="flex-1 bg-[#58CC02] hover:bg-[#4cb302] text-white px-6 py-4 rounded-2xl font-bold uppercase transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )
}

export default LessonResultScreen

