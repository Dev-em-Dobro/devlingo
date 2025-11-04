import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { GraduationCap, Target, Award } from 'lucide-react'
import { useUserPreferences } from '../contexts/UserPreferencesContext'

type Level = 'beginner' | 'intermediate' | 'advanced'

const levels = [
  {
    id: 'beginner' as Level,
    name: 'Iniciante',
    description: 'Estou começando do zero',
    icon: GraduationCap,
    color: 'text-green-500',
  },
  {
    id: 'intermediate' as Level,
    name: 'Intermediário',
    description: 'Já tenho alguma experiência',
    icon: Target,
    color: 'text-blue-500',
  },
  {
    id: 'advanced' as Level,
    name: 'Avançado',
    description: 'Quero aprimorar meus conhecimentos',
    icon: Award,
    color: 'text-purple-500',
  },
]

const LevelSelection = () => {
  const { preferences, setLevel } = useUserPreferences()
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(preferences.level || null)
  const navigate = useNavigate()

  useEffect(() => {
    // Se não tem linguagem selecionada, volta para seleção de linguagem
    if (!preferences.language) {
      navigate('/language-selection')
    }
  }, [preferences.language, navigate])

  // Atualiza o nível selecionado quando as preferências mudarem
  useEffect(() => {
    if (preferences.level) {
      setSelectedLevel(preferences.level)
    }
  }, [preferences.level])

  const handleContinue = () => {
    if (selectedLevel && preferences.language) {
      setLevel(selectedLevel)
      // Redireciona para home após completar o setup
      navigate('/', { replace: true })
    }
  }

  const handleBack = () => {
    navigate('/language-selection')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar with progress */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex items-center gap-3 md:max-w-3xl md:mx-auto">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#58CC02] rounded-full" style={{ width: '66%' }} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Character and question */}
        <div className="flex items-start gap-6 mb-8">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src="/devlingo-char.png"
                alt="Devlingo"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
          <div className="flex-1 pt-4">
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 shadow-sm relative">
              <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-gray-300 border-b-8 border-b-transparent"></div>
              <div className="absolute -left-2 top-6 w-0 h-0 border-t-7 border-t-transparent border-r-7 border-r-white border-b-7 border-b-transparent"></div>
              <p className="text-xl font-semibold text-gray-800">
                Qual é o seu nível atual?
              </p>
            </div>
          </div>
        </div>

        {/* Level options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {levels.map((level) => {
            const Icon = level.icon
            const isSelected = selectedLevel === level.id

            return (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`
                  flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all text-center
                  ${isSelected
                    ? 'border-[#58CC02] bg-green-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                  }
                `}
              >
                <Icon size={40} className={level.color} />
                <div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {level.name}
                  </div>
                  <div className="text-sm text-gray-600">{level.description}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Continue button */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedLevel}
            className={`
              px-8 py-4 rounded-2xl font-bold text-white text-lg uppercase
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${selectedLevel
                ? 'bg-[#58CC02] hover:bg-[#4cb302] shadow-lg hover:shadow-xl'
                : 'bg-gray-300'
              }
            `}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export default LevelSelection

