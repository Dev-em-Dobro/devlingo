import { Lock, Trophy } from 'lucide-react'

interface LessonNodeProps {
  type: 'lesson' | 'chest' | 'practice' | 'unit'
  status: 'current' | 'locked' | 'completed'
  showStartButton?: boolean
}

const LessonNode = ({ type, status }: LessonNodeProps) => {
  const isLocked = status === 'locked'
  const isCurrent = status === 'current'

  // Determine the background color and styling
  const getNodeStyle = () => {
    if (isLocked) {
      return 'bg-gray-300'
    }
    if (isCurrent) {
      return 'bg-[#58CC02]'
    }
    return 'bg-yellow-400'
  }

  const renderNodeContent = () => {
    if (type === 'chest') {
      return (
        <div className={`
          w-24 h-24 rounded-full ${getNodeStyle()} 
          flex items-center justify-center
          shadow-lg
          ${!isLocked ? 'ring-8 ring-gray-200' : ''}
        `}>
          <div className="w-16 h-12 bg-gray-400 rounded-md flex items-center justify-center">
            <Lock className="text-gray-600" size={24} />
          </div>
        </div>
      )
    }

    if (type === 'practice') {
      return (
        <div className="relative">
          <div className={`
            w-32 h-32 rounded-full
            flex items-center justify-center
            ${!isLocked ? 'ring-8 ring-gray-100' : ''}
            animate-float
          `}>
            <img 
              src="/devlingo-char.png" 
              alt="Devlingo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )
    }

    if (type === 'unit') {
      return (
        <div className={`
          w-24 h-24 rounded-full ${getNodeStyle()} 
          flex items-center justify-center
          shadow-lg
          ${!isLocked ? 'ring-8 ring-gray-200' : ''}
        `}>
          <Trophy className={isLocked ? 'text-gray-500' : 'text-white'} size={32} />
        </div>
      )
    }

    // Default lesson type
    return (
      <div className={`
        relative
        transition-all duration-300 hover:scale-105
      `}>
        <img 
          src={isLocked ? '/gray-star.png' : '/green-star.png'}
          alt={isLocked ? 'Lição bloqueada' : 'Lição disponível'}
          className="w-20 h-20 object-contain drop-shadow-lg"
        />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* {showStartButton && (
        <div className="mb-4 bg-white border-2 border-gray-300 rounded-2xl px-6 py-3 font-bold text-[#58CC02] text-lg uppercase shadow-md">
          Começar
        </div>
      )} */}
      {renderNodeContent()}
    </div>
  )
}

export default LessonNode

