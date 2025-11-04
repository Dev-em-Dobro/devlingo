import { useState, useMemo } from 'react'
import LessonNode from './LessonNode'
import LessonModal from './LessonModal'
import { useCompletedLessons } from '../hooks/useCompletedLessons'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import { lessonsData } from '../lib/lessonsData'

const LessonPath = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1)
  const { completedLessonIds } = useCompletedLessons()
  const { preferences } = useUserPreferences()

  // Obter todas as lições disponíveis para o idioma e nível atual
  const allLessons = useMemo(() => {
    if (!preferences.language || !preferences.level) return []
    return lessonsData[preferences.language]?.[preferences.level] || []
  }, [preferences.language, preferences.level])

  // Determinar quantas unidades existem (por enquanto, vamos usar 5 unidades fixas)
  const totalUnits = 5
  
  // Número de lições por unidade (dividir igualmente)
  const lessonsPerUnit = Math.ceil(allLessons.length / totalUnits)
  
  // Função para obter os IDs das lições de uma unidade específica
  const getUnitLessonIds = (unitId: number): string[] => {
    const startIndex = (unitId - 1) * lessonsPerUnit
    const endIndex = Math.min(startIndex + lessonsPerUnit, allLessons.length)
    return allLessons.slice(startIndex, endIndex).map(lesson => lesson.id)
  }
  
  // Função para determinar se uma unidade está completa
  // Uma unidade está completa quando todas as lições dessa unidade foram completadas
  const isUnitCompleted = (unitId: number): boolean => {
    const unitLessonIds = getUnitLessonIds(unitId)
    if (unitLessonIds.length === 0) return false
    
    // Verifica se todas as lições da unidade foram completadas
    return unitLessonIds.every(lessonId => completedLessonIds.has(lessonId))
  }

  // Determinar o status de cada unidade
  const getUnitStatus = (unitId: number): 'available' | 'locked' | 'completed' => {
    // Verificar se a unidade está completa
    if (isUnitCompleted(unitId)) {
      return 'completed'
    }
    
    // A primeira unidade sempre está disponível (mesmo que não completa)
    if (unitId === 1) {
      return 'available'
    }
    
    // Se a unidade anterior foi completada, esta está disponível
    const previousUnitCompleted = isUnitCompleted(unitId - 1)
    if (previousUnitCompleted) {
      return 'available'
    }
    
    // Caso contrário, está bloqueada
    return 'locked'
  }

  const units = Array.from({ length: totalUnits }, (_, i) => i + 1).map((unitId) => {
    // Offsets originais para manter o caminho das estrelas alinhado
    const offsets: Record<number, number> = {
      1: 0,
      2: -40,
      3: -60,
      4: -80,
      5: -40,
    }
    
    return {
      id: unitId,
      type: 'lesson' as const,
      status: getUnitStatus(unitId),
      position: unitId === 1 ? 'center' : unitId % 2 === 0 ? 'left' : 'right',
      offset: offsets[unitId] || 0,
    }
  })

  const handleUnitClick = (unitId: number, status: 'available' | 'locked' | 'completed') => {
    // Permite clicar em unidades disponíveis ou completadas
    if (status === 'available' || status === 'completed') {
      setSelectedUnitId(unitId)
      setIsModalOpen(true)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 relative overflow-x-hidden px-4">
      <div className="flex flex-col items-center gap-4">
        {units.map((unit, index) => (
          <div 
            key={unit.id}
            className="relative w-full flex justify-center"
            style={{ 
              transform: `translateX(${unit.offset}px)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <LessonNode 
              type={unit.type}
              status={unit.status}
              showStartButton={index === 0}
              onClick={() => handleUnitClick(unit.id, unit.status)}
            />
            {/* Coruja ao lado do caminho */}
            {index === 2 && (
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-24">
                <LessonNode 
                  type={'practice' as const}
                  status={'locked' as const}
                  showStartButton={false}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <LessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        unitId={selectedUnitId}
      />
    </div>
  )
}

export default LessonPath

