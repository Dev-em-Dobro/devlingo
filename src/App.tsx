import { useState, useEffect } from 'react'
import Home from './pages/Home'
import LoadingScreen from './components/LoadingScreen'
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
    <div className="App overflow-x-hidden animate-fadeIn">
      <Home />
    </div>
  )
}

export default App

