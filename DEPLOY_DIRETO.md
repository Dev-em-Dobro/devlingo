# 🚀 Deploy Direto na Vercel - Guia Rápido

Este guia mostra como fazer deploy direto na Vercel de forma rápida e fácil.

---

## 📋 Pré-requisitos Rápidos

- ✅ Conta no GitHub (ou GitLab/Bitbucket)
- ✅ Conta na Vercel (crie em [vercel.com](https://vercel.com))
- ✅ Projeto funcionando localmente (`npm run build` funciona)

---

## 🎯 Opção 1: Deploy via Interface Web (Mais Fácil)

### Passo 1: Verificar Build Local

```bash
npm run build
```

Se funcionar, continue!

### Passo 2: Subir Código para GitHub

Se ainda não subiu seu código:

```bash
# Inicializar Git (se necessário)
git init
git add .
git commit -m "Initial commit"

# Adicionar remote do GitHub
git remote add origin https://github.com/SEU_USUARIO/devlingo.git
git branch -M main
git push -u origin main
```

### Passo 3: Deploy na Vercel

1. **Acesse** [vercel.com](https://vercel.com)
2. **Faça login** (pode usar GitHub)
3. **Clique** em **"Add New..."** → **"Project"**
4. **Importe** seu repositório `devlingo`
5. **Configure** as variáveis de ambiente (IMPORTANTE!):
   - Clique em **"Environment Variables"**
   - Adicione:
     - `VITE_SUPABASE_URL` = sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY` = sua chave anon do Supabase
   - Marque todas as opções (Production, Preview, Development)
6. **Clique** em **"Deploy"**
7. **Aguarde** 1-3 minutos
8. ✅ **Pronto!** Seu site estará no ar em `https://devlingo.vercel.app`

---

## ⚡ Opção 2: Deploy via CLI (Mais Rápido)

### Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Passo 2: Fazer Login

```bash
vercel login
```

Isso abrirá o navegador para você fazer login.

### Passo 3: Deploy Direto

```bash
# Na pasta do projeto
vercel
```

Siga as instruções:
- **Set up and deploy?** → Digite `Y`
- **Which scope?** → Escolha sua conta
- **Link to existing project?** → Digite `N` (primeira vez)
- **What's your project's name?** → Digite `devlingo`
- **In which directory is your code located?** → Pressione Enter (./)
- **Want to override the settings?** → Digite `N`

### Passo 4: Configurar Variáveis de Ambiente

Após o primeiro deploy, configure as variáveis:

```bash
vercel env add VITE_SUPABASE_URL
# Cole o valor quando solicitado
# Escolha: Production, Preview, Development (todas)

vercel env add VITE_SUPABASE_ANON_KEY
# Cole o valor quando solicitado
# Escolha: Production, Preview, Development (todas)
```

### Passo 5: Deploy de Produção

```bash
vercel --prod
```

✅ **Pronto!** Seu site estará no ar!

---

## 🔄 Atualizações Futuras

### Via Interface Web:
- Apenas faça `git push` e a Vercel faz deploy automático!

### Via CLI:
```bash
vercel --prod
```

---

## 📝 Comandos Úteis da CLI

```bash
# Ver deployments
vercel ls

# Ver logs
vercel logs

# Remover projeto
vercel remove

# Ver informações do projeto
vercel inspect
```

---

## ⚠️ Importante: Variáveis de Ambiente

**NUNCA ESQUEÇA** de configurar as variáveis de ambiente:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Sem elas, o app não funcionará corretamente!

---

## 🎉 Pronto!

Seu Devlingo está no ar! 🚀

**URL de produção**: `https://devlingo.vercel.app`

Para mais detalhes, veja o [DEPLOY.md](./DEPLOY.md) completo.

