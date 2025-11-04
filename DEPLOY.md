# 🚀 Guia Completo de Deploy - Devlingo na Vercel

Este guia passo a passo vai te ajudar a fazer o deploy do Devlingo na Vercel de forma completa e funcional.

---

## 📋 Pré-requisitos

- [ ] Conta no GitHub
- [ ] Conta no Supabase configurada (veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- [ ] Conta na Vercel (pode criar durante o processo)
- [ ] Node.js instalado localmente
- [ ] Projeto funcionando localmente (`npm run dev`)

---

## 🔧 Passo 1: Preparar o Projeto Localmente

### 1.1 Verificar se o build funciona

Antes de fazer o deploy, certifique-se de que o build funciona localmente. Este passo é **essencial** porque se o build falhar localmente, também falhará na Vercel.

#### Como testar o build:

1. **Abra o terminal** na pasta raiz do projeto (onde está o `package.json`)

2. **Execute o comando de build:**
   ```bash
   npm run build
   ```

3. **O que você deve ver:**
   - O processo compilará o TypeScript
   - Gerará os arquivos otimizados na pasta `dist/`
   - No final, você verá algo como:
     ```
     ✓ built in 2.5s
     dist/index.html                   1.23 kB
     dist/assets/index-abc123.js       234.56 kB
     dist/assets/index-xyz789.css      12.34 kB
     ```

4. **Resultado esperado:**
   - ✅ **Sucesso**: O comando termina sem erros e cria a pasta `dist/` com os arquivos compilados
   - ❌ **Erro**: Aparecem mensagens de erro em vermelho (ex: erros de TypeScript, imports não encontrados, etc.)

#### Se o build funcionou:

1. **Teste o build localmente:**
   ```bash
   npm run preview
   ```
   
   Isso iniciará um servidor local que simula como o site funcionará na Vercel. Você verá algo como:
   ```
   ➜  Local:   http://localhost:4173/
   ```

2. **Abra o navegador** em `http://localhost:4173/`

3. **Teste as funcionalidades:**
   - Navegue pelas páginas
   - Verifique se as imagens aparecem
   - Teste se o roteamento funciona (tente acessar rotas diretamente)

4. **Pare o servidor de preview** pressionando `Ctrl + C` no terminal

#### Se o build falhou:

**Erros comuns e como corrigir:**

- **Erro de TypeScript**:
  - Verifique os erros exibidos no terminal
  - Corrija os problemas de tipagem
  - Execute `npm run lint` para verificar outros problemas

- **Erro de imports não encontrados**:
  - Verifique se todos os arquivos importados existem
  - Verifique se os caminhos dos imports estão corretos

- **Erro de dependências faltando**:
  - Execute `npm install` para garantir que todas as dependências estão instaladas

- **Erro de variáveis de ambiente**:
  - O build pode funcionar mesmo sem variáveis de ambiente (elas só são necessárias em runtime)
  - Mas certifique-se de que não há referências a `process.env` que causem erros de build
  - Se aparecer erro sobre `import.meta.env`, crie o arquivo `src/vite-env.d.ts` com:
    ```typescript
    /// <reference types="vite/client" />
    
    interface ImportMetaEnv {
      readonly VITE_SUPABASE_URL: string
      readonly VITE_SUPABASE_ANON_KEY: string
    }
    
    interface ImportMeta {
      readonly env: ImportMetaEnv
    }
    ```

- **Erro com arquivos do Supabase (arquivos binários em node_modules)**:
  - Se aparecer erro como `File appears to be binary` em `node_modules/@supabase/...`
  - Adicione `"exclude": ["node_modules", "dist"]` no `tsconfig.json`
  - Certifique-se de que `"skipLibCheck": true` está ativado no `tsconfig.json`
  - Se persistir, tente: `rm -rf node_modules package-lock.json && npm install`

- **Erros de imports/variáveis não utilizados**:
  - Se aparecer `TS6133: 'variável' is declared but its value is never read`
  - Remova os imports/variáveis não utilizados ou prefixe com `_` (ex: `_unusedVariable`)
  - Ou comente temporariamente se for necessário para uso futuro

**⚠️ IMPORTANTE**: Não faça o deploy até que o build funcione sem erros localmente!

### 1.2 Verificar arquivos importantes

Certifique-se de que:
- ✅ Todas as imagens estão na pasta `/public`
- ✅ O arquivo `.env` está no `.gitignore` (não será commitado)
- ✅ Não há senhas ou tokens hardcoded no código
- ✅ O projeto está funcionando localmente

---

## 📦 Passo 2: Criar Repositório no GitHub

### 2.1 Criar repositório

1. Acesse [GitHub](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
3. Configure o repositório:
   - **Name**: `devlingo` (ou o nome que preferir)
   - **Visibility**: Escolha **Public** ou **Private**
   - ⚠️ **NÃO** marque "Add a README file" (já temos arquivos)
   - ⚠️ **NÃO** marque "Add .gitignore" (já temos)
   - ⚠️ **NÃO** marque "Choose a license"
4. Clique em **"Create repository"**

### 2.2 Inicializar Git (se ainda não foi feito)

Abra o terminal na pasta do projeto e execute:

```bash
# Verificar se já existe git
git status

# Se não existir, inicializar
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit - Devlingo project"
```

### 2.3 Conectar ao repositório do GitHub

O GitHub mostrará comandos após criar o repositório. Execute algo como:

```bash
# Adicionar remote (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/devlingo.git

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push
git push -u origin main
```

Se pedir credenciais, use um Personal Access Token do GitHub (Settings → Developer settings → Personal access tokens).

---

## 🌐 Passo 3: Deploy na Vercel

### 3.1 Criar conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"** (recomendado para integração automática)
4. Autorize a Vercel a acessar seus repositórios

### 3.2 Importar projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Você verá seus repositórios do GitHub. Clique em **"Import"** ao lado do repositório `devlingo`
3. Configure o projeto:
   - **Project Name**: `devlingo` (ou o nome que preferir)
   - **Framework Preset**: Deixe **"Vite"** (já detectado automaticamente)
   - **Root Directory**: `./` (padrão)
   - **Build Command**: `npm run build` (já vem preenchido)
   - **Output Directory**: `dist` (já vem preenchido)
   - **Install Command**: `npm install` (já vem preenchido)

### 3.3 Configurar Variáveis de Ambiente ⚠️ IMPORTANTE

**ANTES DE CLICAR EM DEPLOY**, configure as variáveis de ambiente:

1. Na seção **"Environment Variables"**, clique em **"Add"** ou expanda a seção
2. Adicione as seguintes variáveis:

   **Variável 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Cole a URL do seu projeto Supabase (ex: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Environment**: Marque todas as opções (Production, Preview, Development)

   **Variável 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Cole a chave anon public do Supabase (começa com `eyJ...`)
   - **Environment**: Marque todas as opções (Production, Preview, Development)

3. ⚠️ **IMPORTANTE**: Essas variáveis devem ser exatamente as mesmas que você tem no arquivo `.env` local

### 3.4 Fazer o deploy

1. Clique em **"Deploy"**
2. Aguarde 1-3 minutos enquanto o build é executado
3. Você verá o progresso em tempo real
4. Ao finalizar, você receberá uma URL como: `https://devlingo.vercel.app`

---

## 🔐 Passo 4: Configurar Google OAuth para Produção

Se você usa login com Google, precisa atualizar as URLs de redirect no Google Cloud Console:

### 4.1 Obter URL do projeto na Vercel

Após o deploy, você terá uma URL como:
- `https://devlingo.vercel.app` (produção)
- `https://devlingo-git-main-seu-usuario.vercel.app` (preview)

### 4.2 Atualizar Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Vá em **APIs & Services** → **Credentials**
3. Clique no seu **OAuth 2.0 Client ID** (o que você criou para o Devlingo)
4. Em **"Authorized redirect URIs"**, adicione:
   ```
   https://SEU-PROJETO-ID.supabase.co/auth/v1/callback
   ```
   (Esta URL já deve estar configurada do setup inicial)
   
   ⚠️ **Nota**: A URL de callback do Google OAuth é sempre a do Supabase, não da Vercel. A Vercel só hospeda a aplicação frontend.

### 4.3 Verificar configuração no Supabase

1. Acesse o dashboard do Supabase
2. Vá em **Authentication** → **URL Configuration**
3. Verifique se as **Site URL** e **Redirect URLs** estão corretas:
   - **Site URL**: `https://devlingo.vercel.app` (sua URL da Vercel)
   - **Redirect URLs**: Adicione `https://devlingo.vercel.app/**` se necessário

---

## ✅ Passo 5: Testar o Deploy

1. Acesse a URL do seu projeto: `https://devlingo.vercel.app`
2. Teste as funcionalidades:
   - [ ] Página inicial carrega
   - [ ] Login funciona (email ou Google)
   - [ ] Cadastro funciona
   - [ ] Seleção de linguagem e nível funciona
   - [ ] Lições carregam corretamente
   - [ ] Imagens aparecem corretamente
   - [ ] Navegação entre páginas funciona

---

## 🔄 Passo 6: Deploy Automático (Já Configurado!)

A Vercel está conectada ao seu repositório do GitHub. Isso significa:

- ✅ Cada push para a branch `main` = Deploy automático em produção
- ✅ Cada Pull Request = Preview deployment (URL temporária)
- ✅ Deploy instantâneo (1-3 minutos)

### 6.1 Fazer atualizações

Para atualizar o site:

```bash
# Fazer suas alterações no código
# ... editar arquivos ...

# Commit e push
git add .
git commit -m "Descrição das mudanças"
git push
```

A Vercel automaticamente detectará o push e fará um novo deploy! 🚀

---

## 📝 Passo 7: Configurar Domínio Customizado (Opcional)

Se você tem um domínio próprio (ex: `devlingo.com`):

1. No dashboard da Vercel, vá em **Settings** → **Domains**
2. Clique em **"Add"**
3. Digite seu domínio (ex: `devlingo.com`)
4. Siga as instruções para configurar DNS:
   - Adicione os registros DNS que a Vercel indicar
   - Geralmente é um registro CNAME apontando para `cname.vercel-dns.com`
5. Aguarde a propagação DNS (pode levar alguns minutos a horas)
6. ✅ Seu site estará acessível via seu domínio customizado!

---

## 🐛 Solução de Problemas

### ❌ Erro no Build

**Problema**: Build falha na Vercel

**Soluções**:
1. Teste localmente: `npm run build`
2. Verifique se todas as dependências estão no `package.json`
3. Verifique os logs na Vercel para ver o erro específico
4. Certifique-se de que não há erros de TypeScript: `npm run lint`

### ❌ Variáveis de Ambiente não funcionam

**Problema**: App não conecta ao Supabase após deploy

**Soluções**:
1. Verifique se as variáveis foram adicionadas na Vercel (Settings → Environment Variables)
2. Certifique-se de que os nomes estão corretos: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Faça um novo deploy após adicionar as variáveis
4. Verifique se as variáveis estão marcadas para o ambiente correto (Production, Preview, Development)

### ❌ Erro 404 em rotas

**Problema**: Ao navegar diretamente para uma rota, aparece 404

**Solução**: Para SPAs (Single Page Applications) como React, é necessário criar um arquivo `vercel.json`:

Crie o arquivo `vercel.json` na raiz do projeto:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Faça commit e push:
```bash
git add vercel.json
git commit -m "Add vercel.json for SPA routing"
git push
```

### ❌ Imagens não aparecem

**Problema**: Imagens não carregam no site

**Soluções**:
1. Certifique-se de que as imagens estão na pasta `/public`
2. Use caminhos absolutos: `/devlingo-char.png` (não `./devlingo-char.png`)
3. Verifique se os nomes dos arquivos estão corretos (case-sensitive)

### ❌ Login com Google não funciona

**Problema**: Botão "Continuar com Google" não funciona em produção

**Soluções**:
1. Verifique se o Google OAuth está configurado no Supabase
2. Verifique se a URL de callback no Google Cloud Console está correta
3. Verifique as configurações de URL no Supabase (Authentication → URL Configuration)
4. Certifique-se de que a Site URL no Supabase aponta para sua URL da Vercel

---

## 📊 Monitoramento e Logs

### Ver logs do deploy

1. No dashboard da Vercel, clique no seu projeto
2. Vá na aba **"Deployments"**
3. Clique em qualquer deployment para ver logs detalhados

### Ver logs em tempo real

1. Durante o build, os logs aparecem automaticamente
2. Você pode acompanhar o progresso em tempo real

### Funções e Analytics

- A Vercel oferece analytics gratuitos (Settings → Analytics)
- Você pode ver estatísticas de visitantes, páginas mais acessadas, etc.

---

## 🎯 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Build funciona localmente (`npm run build`)
- [ ] Código está no GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy inicial funcionou
- [ ] Site está acessível na URL da Vercel
- [ ] Login funciona
- [ ] Navegação funciona
- [ ] Imagens aparecem
- [ ] Google OAuth configurado (se aplicável)
- [ ] Domínio customizado configurado (se aplicável)

---

## 🎉 Pronto!

Seu Devlingo está no ar! 🚀

**URLs importantes:**
- **Produção**: `https://devlingo.vercel.app` (ou seu domínio customizado)
- **Dashboard**: `https://vercel.com/seu-usuario/devlingo`
- **GitHub**: `https://github.com/seu-usuario/devlingo`

**Próximos passos:**
- Compartilhe o link com seus usuários
- Monitore os analytics na Vercel
- Faça atualizações e elas serão deployadas automaticamente

---

## 📚 Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Guia de Vite na Vercel](https://vercel.com/guides/deploying-vite-to-vercel)
- [Variáveis de Ambiente na Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Dúvidas?** Consulte a documentação ou os outros arquivos `.md` do projeto:
- `SUPABASE_SETUP.md` - Configuração do Supabase
- `GOOGLE_LOGIN_SETUP.md` - Configuração do Google OAuth
