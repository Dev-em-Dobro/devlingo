interface LessonResultPopupProps {
  isOpen: boolean
  correctAnswers: number
  wrongAnswers: number
  totalQuestions: number
  onTryAgain: () => void
  onGoBack: () => void
}

const LessonResultPopup = ({
  isOpen,
  correctAnswers,
  wrongAnswers,
  totalQuestions,
  onTryAgain,
  onGoBack,
}: LessonResultPopupProps) => {
  if (!isOpen) return null

  const accuracy = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end justify-center z-50 p-4">
      {/* Character at top */}
      <div className="absolute top-20">
        <img
          src="/devlingo-char.png"
          alt="Devlingo"
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Main popup card */}
      <div className="relative w-full max-w-md mb-8 mt-24">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl relative border-2 border-gray-200">
          {/* Pointer/tail at bottom */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-white"></div>
          </div>

          {/* Title */}
          <h2 className="text-gray-900 text-2xl font-bold text-center mb-2">
            Você quase conseguiu!
          </h2>
          
          {/* Subtitle */}
          <p className="text-gray-600 text-center mb-6">
            Continue praticando para melhorar
          </p>

          {/* Stats */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
            <div className="space-y-4">
              {/* Correct answers */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✓</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">Respostas corretas</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{correctAnswers}</span>
              </div>

              {/* Wrong answers */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✗</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">Respostas incorretas</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{wrongAnswers}</span>
              </div>

              {/* Accuracy */}
              <div className="pt-4 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-700">Precisão</span>
                  <span className="text-xl font-bold text-gray-800">{accuracy}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onGoBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-2xl font-bold uppercase transition-colors text-sm"
            >
              Voltar
            </button>
            <button
              onClick={onTryAgain}
              className="flex-1 bg-[#58CC02] hover:bg-[#4cb302] text-white px-4 py-3 rounded-2xl font-bold uppercase transition-colors text-sm"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonResultPopup

