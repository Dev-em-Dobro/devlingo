import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import LoadingScreen from './LoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth()
  const { hasCompletedSetup, loading: preferencesLoading } = useUserPreferences()
  const location = useLocation()

  // Aguarda o carregamento da autenticação e das preferências
  if (authLoading || preferencesLoading) {
    return <LoadingScreen isFadingOut={false} />
  }

  if (!user) {
    // Redireciona para login, mas salva a localização atual para redirecionar depois
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const currentPath = location.pathname
  
  // Se não tem preferências completas e não está nas páginas de seleção, redireciona para seleção de linguagem
  // Permite acesso às páginas de seleção mesmo quando já tem setup completo (para permitir trocar de linguagem/nível)
  if (!hasCompletedSetup && currentPath !== '/language-selection' && currentPath !== '/level-selection') {
    return <Navigate to="/language-selection" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

