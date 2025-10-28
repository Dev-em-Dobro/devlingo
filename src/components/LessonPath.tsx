import LessonNode from './LessonNode'

const LessonPath = () => {
  const lessons = [
    { id: 1, type: 'lesson', status: 'current', position: 'center', offset: 0 },
    { id: 2, type: 'lesson', status: 'locked', position: 'left', offset: -40 },
    { id: 3, type: 'lesson', status: 'locked', position: 'left', offset: -60 },
    { id: 4, type: 'lesson', status: 'locked', position: 'right', offset: -80 },
    { id: 5, type: 'lesson', status: 'locked', position: 'center', offset: -40 },
    { id: 6, type: 'lesson', status: 'locked', position: 'center', offset: 0 },
  ]

  return (
    <div className="max-w-2xl mx-auto py-12 relative overflow-x-hidden px-4">
      <div className="flex flex-col items-center gap-4">
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id}
            className="relative w-full flex justify-center"
            style={{ 
              transform: `translateX(${lesson.offset}px)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <LessonNode 
              type={lesson.type as 'lesson' | 'chest' | 'practice' | 'unit'}
              status={lesson.status as 'current' | 'locked' | 'completed'}
              showStartButton={index === 0}
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
    </div>
  )
}

export default LessonPath

