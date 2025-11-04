import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import { lessonsData } from '../lib/lessonsData'

interface LessonModalProps {
  isOpen: boolean
  onClose: () => void
  unitId?: number
}

const LessonModal = ({ isOpen, onClose, unitId = 1 }: LessonModalProps) => {
  const navigate = useNavigate()
  const { preferences } = useUserPreferences()
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null)

  // Resetar lição selecionada quando a unidade mudar ou o modal fechar
  useEffect(() => {
    if (isOpen) {
      setSelectedLessonIndex(null)
    }
  }, [unitId, isOpen])

  // Buscar todas as lições baseadas nas preferências do usuário
  const allLessons = useMemo(() => {
    if (!preferences.language || !preferences.level) return []
    return lessonsData[preferences.language]?.[preferences.level] || []
  }, [preferences.language, preferences.level])

  // Determinar quantas unidades existem (mesmo número usado no LessonPath)
  const totalUnits = 5
  
  // Número de lições por unidade (dividir igualmente)
  const lessonsPerUnit = Math.ceil(allLessons.length / totalUnits)
  
  // Filtrar lições apenas da unidade atual
  const lessons = useMemo(() => {
    const startIndex = (unitId - 1) * lessonsPerUnit
    const endIndex = Math.min(startIndex + lessonsPerUnit, allLessons.length)
    return allLessons.slice(startIndex, endIndex)
  }, [allLessons, unitId, lessonsPerUnit])

  const totalLessons = lessons.length
  // Progress circle commented out, but keeping progress calculation for potential future use
  // const progress = totalLessons > 0 ? ((selectedLessonIndex !== null ? selectedLessonIndex + 1 : 0) / totalLessons) * 100 : 0

  const handleStartLesson = () => {
    if (selectedLessonIndex !== null && lessons[selectedLessonIndex]) {
      navigate(`/lesson/${lessons[selectedLessonIndex].id}`)
      onClose()
    }
  }

  const handleLessonClick = (index: number) => {
    setSelectedLessonIndex(index)
  }

  if (!isOpen) return null

  if (lessons.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
          <p className="text-center text-gray-600">
            Nenhuma lição disponível. Configure suas preferências primeiro.
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-[#58CC02] text-white py-3 rounded-2xl font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Progress circle at top */}
        {/* <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
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
                strokeDasharray={`${progress * 2.513} 251.3`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-[#58CC02] rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⭐</span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main content */}
        <div className="bg-[#9225d4] rounded-3xl p-8 pt-16">
          {selectedLessonIndex !== null && lessons[selectedLessonIndex] ? (
            <>
              <h2 className="text-white text-2xl font-bold text-center mb-2">
                {lessons[selectedLessonIndex].title}
              </h2>
              <p className="text-white text-center mb-8">
                Lição {selectedLessonIndex + 1} de {totalLessons}
              </p>
              
              <button
                onClick={handleStartLesson}
                className="w-full bg-white text-[#58CC02] py-4 rounded-2xl font-bold text-lg uppercase shadow-lg hover:bg-gray-50 transition-colors"
              >
                Começar +{lessons[selectedLessonIndex].xpReward} XP
              </button>
            </>
          ) : (
            <>
              <h2 className="text-white text-2xl font-bold text-center mb-2">
                Escolha uma lição
              </h2>
              <p className="text-white text-center mb-8">
                Unidade {unitId}
              </p>

              {/* Lesson list */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(index)}
                    className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-xl text-left transition-all"
                  >
                    <div className="font-semibold">{lesson.title}</div>
                    <div className="text-sm opacity-90">{lesson.description}</div>
                    <div className="text-xs mt-1">+{lesson.xpReward} XP</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Character at bottom right */}
        <div className="absolute -bottom-12 -right-8">
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

export default LessonModal

