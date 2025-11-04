interface LessonSuccessPopupProps {
  isOpen: boolean
  lessonTitle?: string
  xpEarned?: number
  accuracy?: number
  onContinue: () => void
}

const LessonSuccessPopup = ({ isOpen, lessonTitle = 'Lição concluída!', xpEarned = 0, accuracy = 100, onContinue }: LessonSuccessPopupProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end justify-center z-50 p-4">
      {/* Progress circle at top */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#58CC02"
              strokeWidth="8"
              fill="none"
              strokeDasharray="251.3 251.3"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-[#58CC02] rounded-full flex items-center justify-center">
              <span className="text-white text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main popup card */}
      <div className="relative w-full max-w-md mb-8">
        {/* Green card */}
        <div className="bg-[#58CC02] rounded-3xl p-8 shadow-2xl relative">
          {/* Pointer/tail at bottom */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[15px] border-t-[#58CC02]"></div>
          </div>

          {/* Title */}
          <h2 className="text-white text-2xl font-bold text-center mb-2">
            {lessonTitle}
          </h2>
          
          {/* Subtitle */}
          <p className="text-white text-center mb-6 opacity-90">
            Excelente trabalho!
          </p>

          {/* Stats */}
          <div className="flex gap-4 mb-6">
            {/* XP Card */}
            <div className="flex-1 bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <div className="text-white text-xs font-semibold mb-1">XP GANHO</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl">⚡</span>
                <span className="text-2xl font-bold text-white">{xpEarned}</span>
              </div>
            </div>

            {/* Accuracy Card */}
            <div className="flex-1 bg-white bg-opacity-20 rounded-xl p-4 text-center">
              <div className="text-white text-xs font-semibold mb-1">PRECISÃO</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl">🎯</span>
                <span className="text-2xl font-bold text-white">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={onContinue}
            className="w-full bg-white text-[#58CC02] py-4 rounded-2xl font-bold text-lg uppercase shadow-lg hover:bg-gray-50 transition-colors"
          >
            Continuar
          </button>
        </div>

        {/* Character at bottom right */}
        <div className="absolute -bottom-16 -right-8">
          <img
            src="/devlingo-char.png"
            alt="Devlingo"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default LessonSuccessPopup

