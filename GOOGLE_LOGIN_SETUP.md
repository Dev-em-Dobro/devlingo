# 🔐 Guia Completo: Login com Google

Este guia vai te ajudar a configurar o login com Google OAuth no Supabase passo a passo.

## 📋 Pré-requisitos

- Ter uma conta no Supabase configurada
- Ter o projeto Supabase criado e as variáveis de ambiente configuradas
- Ter uma conta no Google (Gmail)

---

## 🚀 Passo 1: Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google
3. Clique no dropdown de projetos no topo (ao lado do logo do Google Cloud)
4. Clique em **"New Project"** (ou **"Novo Projeto"**)
5. Preencha:
   - **Nome do projeto**: `devlingo` (ou o nome que preferir)
   - **Organização**: Deixe como está (se não tiver, pode deixar em branco)
6. Clique em **"Create"** (ou **"Criar"**)
7. Aguarde alguns segundos e selecione o projeto criado no dropdown

---

## 🔑 Passo 2: Configurar OAuth Consent Screen

1. No menu lateral do Google Cloud Console, vá em **"APIs & Services"** > **"OAuth consent screen"**
2. Selecione **"External"** (para desenvolvimento) e clique em **"Create"**
3. Preencha o formulário:
   - **App name**: `Devlingo` (ou o nome da sua aplicação)
   - **User support email**: Seu email pessoal
   - **Developer contact information**: Seu email pessoal
4. Clique em **"Save and Continue"**
5. Na tela de **"Scopes"**, clique em **"Save and Continue"** (não precisa adicionar escopos agora)
6. Na tela de **"Test users"** (se aparecer), clique em **"Save and Continue"**
7. Na tela de **"Summary"**, clique em **"Back to Dashboard"**

---

## 🔐 Passo 3: Criar Credenciais OAuth

1. No menu lateral, vá em **"APIs & Services"** > **"Credentials"**
2. Clique em **"+ CREATE CREDENTIALS"** no topo
3. Selecione **"OAuth client ID"**
4. Se aparecer uma mensagem pedindo para configurar o consent screen, clique em **"CONFIGURE CONSENT SCREEN"** e siga o Passo 2 acima
5. Em **"Application type"**, selecione **"Web application"**
6. Em **"Name"**, digite: `Devlingo Web Client` (ou qualquer nome)
7. Em **"Authorized redirect URIs"**, clique em **"+ ADD URI"** e adicione:
   ```
   https://SEU-PROJETO-ID.supabase.co/auth/v1/callback
   ```
   **⚠️ IMPORTANTE**: Substitua `SEU-PROJETO-ID` pelo ID do seu projeto Supabase (o mesmo que está na URL do Supabase, antes de `.supabase.co`)
   
   Exemplo:
   ```
   https://abcdefghijklmnop.supabase.co/auth/v1/callback
   ```
8. Clique em **"Create"** (ou **"Criar"**)
9. Uma janela popup aparecerá com suas credenciais:
   - **Your Client ID**: Copie este valor
   - **Your Client Secret**: Copie este valor
   
   ⚠️ **GUARDE ESSAS INFORMAÇÕES** - você precisará delas no próximo passo

---

## 🔧 Passo 4: Configurar Google no Supabase

1. Acesse o dashboard do seu projeto no [Supabase](https://supabase.com)
2. No menu lateral, vá em **"Authentication"**
3. Clique na aba **"Providers"**
4. Procure por **"Google"** na lista de providers
5. Clique em **"Google"** para abrir as configurações
6. Clique no **toggle** para **habilitar** o Google provider (deve ficar verde/ativado)
7. Cole as credenciais que você copiou:
   - **Client ID (for OAuth)**: Cole o Client ID que você copiou do Google Cloud Console
   - **Client Secret (for OAuth)**: Cole o Client Secret que você copiou do Google Cloud Console
8. Clique em **"Save"** (ou **"Salvar"**)

---

## ✅ Passo 5: Testar o Login

1. Certifique-se de que suas variáveis de ambiente estão configuradas no arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-public-aqui
   ```

2. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

3. Acesse a página de login da sua aplicação
4. Clique no botão **"Continuar com Google"**
5. Você deve ser redirecionado para a página de login do Google
6. Escolha sua conta Google e autorize o acesso
7. Você será redirecionado de volta para sua aplicação (`/language-selection`)

---

## 🔍 Solução de Problemas

### Problema: "Redirect URI mismatch"

**Solução**: 
- Verifique se o redirect URI no Google Cloud Console está **exatamente** igual a:
  ```
  https://SEU-PROJETO-ID.supabase.co/auth/v1/callback
  ```
- Certifique-se de que não há espaços extras ou caracteres diferentes
- O URI deve começar com `https://` (não `http://`)

### Problema: "Error: invalid_client"

**Solução**:
- Verifique se o Client ID e Client Secret estão corretos no Supabase
- Certifique-se de que copiou os valores completos sem espaços extras
- Verifique se o Google provider está habilitado no Supabase

### Problema: O botão não faz nada

**Solução**:
- Verifique o console do navegador para erros
- Certifique-se de que as variáveis de ambiente estão configuradas corretamente
- Reinicie o servidor de desenvolvimento após adicionar as variáveis

### Problema: "Access blocked: This app's request is invalid"

**Solução**:
- Certifique-se de que configurou o OAuth Consent Screen (Passo 2)
- Se estiver em modo de teste, adicione seu email como "Test user" no OAuth Consent Screen
- Para produção, você precisará publicar o app no Google Cloud Console

---

## 📝 Notas Importantes

1. **Modo de Teste**: Durante o desenvolvimento, seu app estará em modo de teste. Apenas usuários adicionados como "Test users" poderão fazer login.

2. **Publicação**: Para permitir que qualquer pessoa faça login, você precisará publicar o app no Google Cloud Console (isso requer verificação do Google).

3. **Redirect URI**: Para desenvolvimento local, você pode adicionar também:
   ```
   http://localhost:5173/auth/v1/callback
   ```
   Mas o Supabase usa seu próprio callback, então apenas o URI do Supabase é necessário.

4. **Segurança**: Nunca compartilhe suas credenciais OAuth publicamente. Mantenha-as seguras e não as commite no Git.

---

## 🎉 Pronto!

Se tudo estiver configurado corretamente, o login com Google deve funcionar. O usuário será autenticado no Supabase e o perfil será criado automaticamente quando necessário.

