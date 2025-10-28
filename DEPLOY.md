# 🚀 Deploy do Devlingo na Vercel

## Passo a Passo Completo

### 1. Criar repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique no botão **"New"** ou **"+"** → **"New repository"**
3. Nome do repositório: `devlingo`
4. Deixe como **público** ou **privado** (sua escolha)
5. **NÃO** marque "Initialize with README" (já temos arquivos locais)
6. Clique em **"Create repository"**

### 2. Inicializar Git localmente (se ainda não foi feito)

Abra o terminal na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "Initial commit - Devlingo project"
```

### 3. Conectar ao repositório do GitHub

Copie os comandos que o GitHub mostra após criar o repo, algo como:

```bash
git remote add origin https://github.com/SEU_USUARIO/devlingo.git
git branch -M main
git push -u origin main
```

### 4. Deploy na Vercel

#### Opção A: Via Interface Web (Mais fácil)

1. Acesse [vercel.com](https://vercel.com)
2. Faça login (pode usar sua conta do GitHub)
3. Clique em **"Add New..."** → **"Project"**
4. Importe o repositório `devlingo` do GitHub
5. Configure o projeto:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (já vem preenchido)
   - **Output Directory**: `dist` (já vem preenchido)
   - **Install Command**: `npm install`
6. Clique em **"Deploy"**
7. Aguarde 1-2 minutos ⏱️
8. Pronto! Seu app estará no ar! 🎉

#### Opção B: Via CLI (Terminal)

1. Instale a Vercel CLI:
```bash
npm install -g vercel
```

2. Faça login na Vercel:
```bash
vercel login
```

3. Deploy do projeto:
```bash
vercel
```

4. Siga as instruções:
   - Set up and deploy? **Y**
   - Which scope? (escolha sua conta)
   - Link to existing project? **N**
   - What's your project's name? **devlingo**
   - In which directory is your code located? **./** (Enter)
   - Want to override the settings? **N**

5. Para deploy de produção:
```bash
vercel --prod
```

### 5. Atualizações Futuras

Após fazer mudanças no código:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

A Vercel automaticamente fará o redeploy! 🔄

### 6. Configurar Domínio Customizado (Opcional)

1. No painel da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio customizado
3. Configure o DNS conforme instruções da Vercel

## 🎯 URLs Importantes

Após o deploy, você terá:
- **URL de produção**: `https://devlingo.vercel.app` (ou similar)
- **Dashboard**: `https://vercel.com/seu-usuario/devlingo`
- **Previews**: Cada push gera um preview único

## 🐛 Solução de Problemas

### Erro no Build?
- Verifique se `npm run build` funciona localmente
- Certifique-se que todas as dependências estão no `package.json`

### Imagens não aparecem?
- Verifique se as imagens estão na pasta `/public`
- Use caminhos absolutos: `/devlingo-char.png`

### Erro 404 em rotas?
- Para SPA, a Vercel geralmente configura automaticamente
- Se necessário, crie um `vercel.json` com regras de rewrite

## 📦 Verificar antes do deploy

- [ ] `npm run build` funciona sem erros
- [ ] Todas as imagens estão em `/public`
- [ ] Não há senhas ou tokens no código
- [ ] `.gitignore` está correto

## 🎉 Pronto!

Seu Devlingo estará acessível globalmente via HTTPS, com CDN e deploy automático!

