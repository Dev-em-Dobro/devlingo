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
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

