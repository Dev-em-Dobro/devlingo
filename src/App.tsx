import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LanguageSelection from './pages/LanguageSelection'
import LevelSelection from './pages/LevelSelection'
import LessonScreen from './pages/LessonScreen'
import LessonSuccessScreen from './pages/LessonSuccessScreen'
import LessonResultScreen from './pages/LessonResultScreen'
import LoadingScreen from './components/LoadingScreen'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Simula um carregamento de 2.5 segundos
    const timer = setTimeout(() => {
      setIsFadingOut(true)
      // Aguarda a animação de fade out terminar antes de remover o loading
      setTimeout(() => {
        setIsLoading(false)
      }, 600) // Tempo da animação fadeOut
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen isFadingOut={isFadingOut} />
  }

  return (
    <BrowserRouter>
      <div className="App overflow-x-hidden animate-fadeIn">
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path="/language-selection"
            element={
              <ProtectedRoute>
                <LanguageSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/level-selection"
            element={
              <ProtectedRoute>
                <LevelSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <LessonScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson-success"
            element={
              <ProtectedRoute>
                <LessonSuccessScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson-result"
            element={
              <ProtectedRoute>
                <LessonResultScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
