# 🔧 Troubleshooting - Erros em Produção

## ❌ Erro: "Failed to fetch" ou "ERR_NAME_NOT_RESOLVED" com placeholder.supabase.co

### Problema Identificado

O erro mostra que a aplicação está tentando usar `https://placeholder.supabase.co`, o que significa que as **variáveis de ambiente não estão configuradas na Vercel**.

### Solução Rápida

#### 1. Verificar Variáveis de Ambiente na Vercel

1. Acesse o dashboard da Vercel: [vercel.com](https://vercel.com)
2. Selecione seu projeto `devlingo`
3. Vá em **Settings** → **Environment Variables**
4. Verifique se existem as seguintes variáveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

#### 2. Adicionar/Corrigir Variáveis

Se não existirem ou estiverem incorretas:

1. Clique em **"Add New"**
2. Adicione cada variável:

   **Variável 1:**
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Sua URL do Supabase (ex: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Environment**: Marque **todas** (Production, Preview, Development)

   **Variável 2:**
   - **Name**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Sua chave anon do Supabase (começa com `eyJ...`)
   - **Environment**: Marque **todas** (Production, Preview, Development)

3. Clique em **Save**

#### 3. Obter Credenciais do Supabase

Se você não lembra das credenciais:

1. Acesse [supabase.com](https://supabase.com)
2. Faça login e selecione seu projeto
3. Vá em **Settings** (⚙️) → **API**
4. Copie:
   - **Project URL** → Use para `VITE_SUPABASE_URL`
   - **anon public** key → Use para `VITE_SUPABASE_ANON_KEY`

#### 4. Fazer Novo Deploy

Após adicionar/corrigir as variáveis:

**Opção A: Via Interface Web**
1. Vá em **Deployments**
2. Clique nos três pontos (...) no último deployment
3. Clique em **Redeploy**
4. Aguarde o deploy concluir

**Opção B: Via CLI**
```bash
vercel --prod
```

**Opção C: Via Git**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## ✅ Verificar se Está Funcionando

### 1. Verificar no Console do Navegador

1. Abra seu site em produção: `https://devlingo.vercel.app`
2. Abra o Console do navegador (F12 → Console)
3. Procure por:
   - ✅ **Sucesso**: `✅ Supabase configurado: { url: 'https://...', hasKey: true }`
   - ❌ **Erro**: `⚠️ Supabase não configurado ou usando placeholder`

### 2. Testar Funcionalidades

- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Login com Google funciona
- [ ] Seleção de linguagem funciona
- [ ] Lições carregam

---

## 🔍 Outros Problemas Comuns

### Erro: Build falha na Vercel

**Solução:**
1. Teste localmente: `npm run build`
2. Verifique os logs do build na Vercel
3. Certifique-se de que todas as dependências estão no `package.json`

### Erro: Página 404 em rotas

**Solução:**
- Verifique se o arquivo `vercel.json` existe na raiz do projeto
- Se não existir, crie com:
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

### Erro: Imagens não aparecem

**Solução:**
1. Verifique se as imagens estão na pasta `/public`
2. Use caminhos absolutos: `/devlingo-char.png` (não `./devlingo-char.png`)

### Erro: Login com Google não funciona

**Solução:**
1. Verifique se o Google OAuth está configurado no Supabase
2. Verifique as URLs no Supabase:
   - **Settings** → **Authentication** → **URL Configuration**
   - **Site URL**: deve ser `https://devlingo.vercel.app`
   - **Redirect URLs**: deve incluir `https://devlingo.vercel.app/**`

---

## 📝 Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Variáveis estão marcadas para Production
- [ ] Build funciona localmente (`npm run build`)
- [ ] Código está no GitHub
- [ ] Deploy foi feito após adicionar variáveis
- [ ] Console do navegador não mostra erros de placeholder
- [ ] URL do Supabase está correta
- [ ] Chave anon do Supabase está correta

---

## 🆘 Ainda não funciona?

Se após seguir todos os passos ainda não funcionar:

1. **Verifique os logs do deploy na Vercel:**
   - Vá em **Deployments** → Clique no deployment → Veja os logs

2. **Verifique o console do navegador:**
   - Abra F12 → Console
   - Procure por erros específicos

3. **Compare com o ambiente local:**
   - O `.env` local funciona?
   - As variáveis são as mesmas?

4. **Limpe o cache:**
   - Na Vercel: Settings → Redeploy (limpa cache)
   - No navegador: Ctrl+Shift+R (hard refresh)

---

## 📞 Próximos Passos

Se precisar de mais ajuda, forneça:
- Screenshot do erro no console
- Logs do deploy na Vercel
- Mensagem de erro específica
- URL do seu projeto na Vercel

