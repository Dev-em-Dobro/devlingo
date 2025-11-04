import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Log para debug (remover em produção se necessário)
if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
  console.log('✅ Supabase configurado:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
  })
} else {
  console.warn('⚠️ Supabase não configurado ou usando placeholder')
}

// Se não houver variáveis de ambiente, cria cliente mock para desenvolvimento
// Em produção, isso indicará que as variáveis não foram configuradas
export const supabase = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Log de erro mais claro em produção
if (typeof window !== 'undefined' && (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')) {
  if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
    console.error('❌ ERRO CRÍTICO: Variáveis de ambiente não configuradas na Vercel!')
    console.error('Configure as seguintes variáveis no dashboard da Vercel:')
    console.error('- VITE_SUPABASE_URL')
    console.error('- VITE_SUPABASE_ANON_KEY')
    console.error('Acesse: https://vercel.com/seu-projeto/settings/environment-variables')
  }
}

