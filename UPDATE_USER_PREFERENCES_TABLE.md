# 📝 Atualização: Tabela de Preferências do Usuário

Para que as preferências do usuário (linguagem e nível) sejam salvas permanentemente no banco de dados, você precisa executar este SQL no Supabase:

## 🔧 Passo a Passo

1. Acesse o dashboard do seu projeto no [Supabase](https://supabase.com)
2. No menu lateral, vá em **"SQL Editor"**
3. Clique em **"New query"**
4. Cole o seguinte SQL:

```sql
-- Criar tabela de preferências do usuário
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  language TEXT CHECK (language IN ('html', 'css', 'javascript')),
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança RLS para user_preferences:

-- SELECT (Visualizar)
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT (Criar)
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE (Atualizar)
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE (Deletar)
CREATE POLICY "Users can delete own preferences"
  ON public.user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);
```

5. Clique em **"Run"** ou pressione `Ctrl + Enter`

---

## ✅ Pronto!

Agora as preferências do usuário serão salvas no banco de dados e persistirão mesmo quando o usuário sair e voltar à aplicação.

### O que mudou:

1. **Antes**: As preferências eram salvas apenas no `localStorage` do navegador
2. **Agora**: As preferências são salvas no banco de dados Supabase vinculadas ao usuário

### Benefícios:

- ✅ Preferências persistem entre dispositivos
- ✅ Preferências persistem mesmo ao limpar o cache do navegador
- ✅ Preferências persistem ao sair e fazer login novamente
- ✅ Fallback para localStorage se houver problema com o banco

