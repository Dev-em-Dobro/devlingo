# 🔧 Guia de Configuração do Supabase

Este guia vai te ajudar a configurar o Supabase para autenticação e armazenamento de pontuação dos usuários.

## 📋 Pré-requisitos

- Conta no GitHub, GitLab ou email para criar conta no Supabase
- Node.js instalado no seu computador

---

## 🚀 Passo 1: Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"Start your project"** ou **"Sign Up"**
3. Escolha uma das opções para criar conta:
   - GitHub (recomendado)
   - GitLab
   - Email
4. Complete o processo de cadastro

---

## 🏗️ Passo 2: Criar um Novo Projeto

1. Após fazer login, clique em **"New Project"**
2. Preencha as informações:
   - **Name**: `devlingo` (ou o nome que preferir)
   - **Database Password**: Crie uma senha forte e **GUARDE ESSA SENHA** (você precisará dela depois)
   - **Region**: Escolha a região mais próxima (ex: `South America (São Paulo)`)
   - **Pricing Plan**: Selecione **"Free"** (plano gratuito)
3. Clique em **"Create new project"**
4. Aguarde 2-3 minutos enquanto o projeto é criado

---

## 🔑 Passo 3: Obter as Credenciais do Projeto

1. No dashboard do seu projeto, clique no ícone de **⚙️ Settings** (no canto inferior esquerdo)
2. Vá em **"API"** no menu lateral
3. Você verá duas informações importantes:
   - **Project URL**: Algo como `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Uma chave longa começando com `eyJ...`

4. **Copie essas duas informações** - você vai precisar delas no próximo passo

---

## 🌍 Passo 4: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo chamado `.env` (se já não existir)

2. Adicione as seguintes variáveis no arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
```

**⚠️ IMPORTANTE:**
- Substitua `https://seu-projeto-id.supabase.co` pela **Project URL** que você copiou
- Substitua `sua-chave-anon-public-aqui` pela **anon public key** que você copiou
- Não coloque aspas ao redor dos valores
- Não compartilhe essas chaves publicamente (o arquivo `.env` já está no `.gitignore`)

3. Salve o arquivo

---

## 🔐 Passo 5: Configurar Autenticação por Email

1. No dashboard do Supabase, vá em **Authentication** (menu lateral)
2. Clique em **"Providers"**
3. Clique em **"Email"** (ou procure por "Email" na lista de providers)
4. Certifique-se de que **"Enable Email provider"** está habilitado (toggle verde)
   - Esta é a opção principal que permite login e cadastro por email
   - **Deve estar HABILITADA** para funcionar
5. Você verá outras opções de segurança:
   - **Secure email change**: Pode deixar habilitado (adiciona camada extra de segurança)
   - **Secure password change**: Pode deixar desabilitado para desenvolvimento
   - **Prevent use of leaked passwords**: Só disponível no plano Pro, pode deixar desabilitado
6. ⚠️ **IMPORTANTE - Confirmação de Email:**
   - Procure por **"Enable email confirmations"** ou **"Confirm email"**
   - **Para desenvolvimento**: Desabilite esta opção (facilita testes e permite que o perfil seja criado imediatamente após cadastro)
   - **Para produção**: Recomendado habilitar (mais seguro, mas requer que o usuário confirme o email antes de usar)
   - **Nota**: Se a confirmação de email estiver habilitada, o perfil só será criado quando o usuário confirmar o email e fizer login
7. Clique em **"Save"** (se houver botão de salvar)

---

## 🌐 Passo 6: Configurar Login com Google (Opcional)

1. Ainda em **Authentication > Providers**
2. Clique em **"Google"**
3. Clique no toggle para **habilitar** o Google
4. Você precisará de credenciais do Google Cloud:
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto ou selecione um existente
   - Vá em **"APIs & Services" > "Credentials"**
   - Clique em **"Create Credentials" > "OAuth client ID"**
   - Escolha **"Web application"**
   - Adicione a **Authorized redirect URI**: 
     ```
     https://seu-projeto-id.supabase.co/auth/v1/callback
     ```
   - Copie o **Client ID** e **Client Secret**
5. Cole essas credenciais no Supabase:
   - **Client ID (for OAuth)**: Cole o Client ID
   - **Client Secret (for OAuth)**: Cole o Client Secret
6. Clique em **"Save"**

---

## 💾 Passo 7: Criar Tabela de Perfil do Usuário

1. No dashboard, vá em **"SQL Editor"** (menu lateral)
2. Clique em **"New query"**
3. Cole o seguinte SQL e clique em **"Run"**:

```sql
-- Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de preferências do usuário
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  language TEXT CHECK (language IN ('html', 'css', 'javascript')),
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar tabela de pontuação por lição
CREATE TABLE IF NOT EXISTS public.lesson_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  language TEXT NOT NULL,
  level TEXT NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Habilitar Row Level Security (RLS)
-- ⚠️ IMPORTANTE: Sem RLS, qualquer usuário logado poderia ver/editar dados de outros usuários!
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_scores ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ============================================
-- As políticas abaixo garantem que cada usuário só acesse seus próprios dados.
-- SEM essas políticas, qualquer usuário logado poderia ver/editar dados de outros!

-- Políticas para user_profiles:

-- 1. SELECT (Visualizar)
-- Permite que usuários vejam apenas seus próprios perfis
-- Exemplo: Usuário A não consegue ver o perfil do Usuário B
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 2. INSERT (Criar)
-- Permite que usuários criem apenas seus próprios perfis
-- Exemplo: Ao cadastrar, você só pode criar um perfil com seu próprio ID
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. UPDATE (Atualizar)
-- Permite que usuários atualizem apenas seus próprios perfis
-- Exemplo: Você só pode atualizar seu próprio total_xp, não o de outros
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para lesson_scores:

-- 4. SELECT (Visualizar)
-- Permite que usuários vejam apenas suas próprias pontuações
-- Exemplo: Você só vê suas próprias pontuações, não as de outros usuários
CREATE POLICY "Users can view own scores"
  ON public.lesson_scores
  FOR SELECT
  USING (auth.uid() = user_id);

-- 5. INSERT (Criar)
-- Permite que usuários criem apenas suas próprias pontuações
-- Exemplo: Ao completar uma lição, você só pode salvar pontuação para você mesmo
CREATE POLICY "Users can insert own scores"
  ON public.lesson_scores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. UPDATE (Atualizar)
-- Permite que usuários atualizem apenas suas próprias pontuações
-- Exemplo: Você só pode atualizar suas próprias pontuações, não as de outros
CREATE POLICY "Users can update own scores"
  ON public.lesson_scores
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para user_preferences:

-- 7. SELECT (Visualizar)
-- Permite que usuários vejam apenas suas próprias preferências
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- 8. INSERT (Criar)
-- Permite que usuários criem apenas suas próprias preferências
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 9. UPDATE (Atualizar)
-- Permite que usuários atualizem apenas suas próprias preferências
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 10. DELETE (Deletar)
-- Permite que usuários deletem apenas suas próprias preferências
CREATE POLICY "Users can delete own preferences"
  ON public.user_preferences
  FOR DELETE
  USING (auth.uid() = user_id);
```

4. Clique em **"Run"** ou pressione `Ctrl + Enter`
5. Você verá uma mensagem de sucesso

---

**📝 Nota Importante:**
- O perfil do usuário será criado manualmente no código da aplicação (não há trigger automático)
- Você precisará criar o perfil após o cadastro/login em `AuthContext.tsx`
- Veja o próximo passo para implementar a criação do perfil no código

---

## 🔐 Por que as Políticas RLS são Necessárias?

**Row Level Security (RLS)** é uma camada de segurança do Supabase que:

✅ **Protege os dados**: Cada usuário só acessa seus próprios dados
✅ **Previne acesso não autorizado**: Usuários não podem ver/editar dados de outros
✅ **É obrigatório**: Quando você habilita RLS em uma tabela, SEM políticas, ninguém consegue acessar nada!

**Exemplo prático:**
- Sem RLS: Usuário A poderia fazer `SELECT * FROM user_profiles` e ver todos os perfis
- Com RLS: Usuário A só consegue ver `SELECT * FROM user_profiles WHERE id = 'seu-id'`

**Cada política faz uma coisa específica:**
- **SELECT**: Permite ler dados
- **INSERT**: Permite criar novos registros
- **UPDATE**: Permite atualizar registros existentes

**A condição `auth.uid() = id` significa:**
- `auth.uid()`: ID do usuário autenticado no momento
- `= id`: Deve ser igual ao ID do registro
- **Resultado**: "Você só pode acessar registros onde você é o dono"

---

## 🧪 Passo 8: Testar a Configuração

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse a aplicação e teste:
   - Tente fazer cadastro com email e senha
   - Tente fazer login
   - (Se configurou) Teste o login com Google

3. Verifique se o usuário foi criado:
   - No Supabase, vá em **Authentication > Users**
   - Você deve ver o usuário que acabou de criar

4. Verifique se o perfil foi criado:
   - Vá em **Table Editor > user_profiles**
   - Você deve ver o perfil do usuário

---

## 📊 Como Funciona a Pontuação e Preferências

### Estrutura das Tabelas:

**`user_profiles`:**
- `id`: ID do usuário (mesmo do auth.users)
- `email`: Email do usuário
- `name`: Nome do usuário
- `total_xp`: Pontuação total acumulada
- `created_at`: Data de criação do perfil
- `updated_at`: Data da última atualização

**`user_preferences`:**
- `user_id`: ID do usuário (mesmo do auth.users, chave primária)
- `language`: Linguagem preferida (html, css, javascript) - pode ser NULL
- `level`: Nível preferido (beginner, intermediate, advanced) - pode ser NULL
- `created_at`: Data de criação das preferências
- `updated_at`: Data da última atualização

**📝 Nota sobre Preferências:**
- As preferências são salvas automaticamente quando o usuário escolhe linguagem e nível
- Permanecem salvas mesmo após o usuário sair e fazer login novamente
- Funcionam em diferentes dispositivos (já que estão no banco de dados)
- Se não houver preferências salvas, o usuário será redirecionado para a tela de seleção

**`lesson_scores`:**
- `id`: ID único da pontuação
- `user_id`: ID do usuário
- `lesson_id`: ID da lição
- `language`: Linguagem (html, css, javascript)
- `level`: Nível (beginner, intermediate, advanced)
- `correct_answers`: Número de acertos
- `wrong_answers`: Número de erros
- `xp_earned`: XP ganho nessa lição
- `completed_at`: Data de conclusão

---


## ✅ Próximos Passos

Agora você pode:

1. **Implementar a função de salvar XP** no código:
   - Quando o usuário completa uma lição, salvar em `lesson_scores`
   - Atualizar `total_xp` em `user_profiles`

2. **Exibir a pontuação do usuário**:
   - Buscar `total_xp` do perfil do usuário
   - Mostrar no header ou perfil

3. **Criar ranking** (se quiser):
   - Fazer uma query para listar usuários por `total_xp`

---

## 🆘 Troubleshooting

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor após adicionar o `.env`

### Erro: "relation does not exist"
- Certifique-se de que executou o SQL do Passo 7
- Verifique se está usando o schema `public`

### Login com Google não funciona
- Verifique se habilitou o provider no Supabase
- Confirme que o redirect URI está correto no Google Cloud Console
- Verifique se as credenciais estão corretas

### Usuário criado mas perfil não aparece
- Verifique se você criou o perfil manualmente no código após o cadastro/login
- Certifique-se de que a função de criação de perfil está sendo chamada corretamente

### Preferências não persistem após fazer logout/login
- Certifique-se de que executou o SQL completo do Passo 7, incluindo a criação da tabela `user_preferences` e as políticas RLS
- Verifique se a tabela `user_preferences` existe no Supabase: vá em **Table Editor** e confirme que a tabela está lá
- Verifique se as políticas RLS estão criadas: vá em **Authentication > Policies** e confirme que existem políticas para `user_preferences`
- Se a tabela não existir, execute novamente o SQL do Passo 7 ou apenas a parte da tabela `user_preferences`

---

## 📚 Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Autenticação](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Dashboard](https://app.supabase.com)

---

**Pronto! 🎉 Agora seu Supabase está configurado e pronto para uso!**

