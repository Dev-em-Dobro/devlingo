import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import GoogleButton from '../components/GoogleButton'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('📝 Tentando fazer login...')
      
      // Timeout de segurança: 10 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Login demorou muito para responder')), 10000)
      })

      const loginPromise = signIn(email, password)
      
      const { error } = await Promise.race([loginPromise, timeoutPromise]) as { error: Error | null }
      
      if (error) {
        console.error('❌ Erro retornado do signIn:', error)
        setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
        setLoading(false)
      } else {
        console.log('✅ Login bem-sucedido, redirecionando...')
        // Redireciona para seleção de linguagem após login
        // TODO: Verificar se usuário já tem preferências salvas e pular para home se tiver
        navigate('/language-selection', { replace: true })
        setLoading(false)
      }
    } catch (err: any) {
      console.error('❌ Erro capturado no handleSubmit:', err)
      setError(err?.message || 'Erro inesperado. Tente novamente.')
      setLoading(false)
    }
  }

  const handleGoogleSuccess = () => {
    // Redireciona para seleção de linguagem após login
    navigate('/language-selection', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9225D4] to-[#6c19a0] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-600">Entre na sua conta para continuar</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#9225D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#9225D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9225D4] hover:bg-[#7a1fb3] text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">ou</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <GoogleButton onSuccess={handleGoogleSuccess} />

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Não tem uma conta?{' '}
            <Link to="/signup" className="text-[#9225D4] font-semibold hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

