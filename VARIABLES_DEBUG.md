# 🔍 Debug: Variáveis de Ambiente no Vercel

## ⚠️ PROBLEMA CRÍTICO: Variáveis não funcionam após adicionar

### Como o Vite funciona com variáveis de ambiente:

1. **As variáveis são substituídas NO MOMENTO DO BUILD**
2. **NÃO são lidas em runtime** (diferente de Node.js)
3. **Precisam começar com `VITE_`** para serem expostas ao cliente
4. **Se você adicionar variáveis DEPOIS do deploy, precisa fazer um NOVO BUILD**

---

## 📍 De onde o código está puxando as variáveis?

O código está em `src/lib/supabase.ts`:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
```

### Fluxo completo:

1. **Vercel** → Variáveis configuradas no dashboard
2. **Build time** → Vite substitui `import.meta.env.VITE_SUPABASE_URL` pelo valor real
3. **Runtime** → Código usa os valores que foram "baked in" no build

---

## ✅ Solução: Fazer Novo Deploy

### Opção 1: Redeploy na Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Vá no seu projeto → **Deployments**
3. Clique nos **três pontos (...)** no último deployment
4. Clique em **"Redeploy"**
5. ✅ Isso fará um novo build com as variáveis atualizadas

### Opção 2: Via Git

```bash
git commit --allow-empty -m "Redeploy para aplicar variáveis de ambiente"
git push
```

### Opção 3: Via CLI

```bash
vercel --prod
```

---

## 🔍 Como Verificar se Está Funcionando

### 1. Verificar no Console do Navegador

1. Abra seu site: `https://devlingo.vercel.app`
2. Abra o Console (F12)
3. Procure por:

**✅ Sucesso:**
```
✅ Supabase configurado: { url: 'https://...', hasKey: true }
```

**❌ Erro:**
```
⚠️ Supabase não configurado ou usando placeholder
🔍 Debug - Variáveis de ambiente: { ... }
```

### 2. Verificar se as Variáveis Foram "Baked In"

No console, você verá:
- Se aparecer `undefined` ou `placeholder`, as variáveis não foram incluídas no build
- Se aparecer a URL real do Supabase, está funcionando!

---

## 🐛 Problemas Comuns

### Problema 1: Variáveis adicionadas mas não funcionam

**Causa:** Deploy foi feito ANTES de adicionar as variáveis

**Solução:** Fazer redeploy (veja acima)

### Problema 2: Variáveis não aparecem no console

**Causa:** Variáveis não começam com `VITE_`

**Solução:** Verifique se os nomes são exatamente:
- `VITE_SUPABASE_URL` (não `SUPABASE_URL`)
- `VITE_SUPABASE_ANON_KEY` (não `SUPABASE_ANON_KEY`)

### Problema 3: Variáveis funcionam em Preview mas não em Production

**Causa:** Variáveis não estão marcadas para "Production"

**Solução:** 
1. Vercel → Settings → Environment Variables
2. Edite cada variável
3. Marque "Production" nas opções

---

## 📝 Checklist de Verificação

Antes de reportar problema, verifique:

- [ ] Variáveis estão configuradas na Vercel
- [ ] Nomes começam com `VITE_` (importante!)
- [ ] Variáveis estão marcadas para "Production"
- [ ] Foi feito um NOVO DEPLOY após adicionar as variáveis
- [ ] Console do navegador mostra a URL real (não placeholder)
- [ ] Build não falhou (verificar logs na Vercel)

---

## 🎯 Resumo

**O problema mais comum:** Variáveis adicionadas na Vercel mas deploy antigo ainda está ativo.

**Solução:** Sempre faça um **REDEPLOY** após adicionar/modificar variáveis de ambiente!

