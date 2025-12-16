# 🚀 Guia de Deploy Automatizado - HSFA Saúde

## 📋 Visão Geral

O script `deploy.sh` foi atualizado para fazer **deploy automático completo**:
1. ✅ **Pull automático do GitHub** - Atualiza o código antes de fazer deploy
2. ✅ **Build automático** - Compila a aplicação React
3. ✅ **Deploy automático** - Reinicia a aplicação no PM2

## 🎯 Uso Básico

### Deploy Completo (Recomendado)

```bash
./deploy.sh
```

Este comando irá:
1. Fazer pull das atualizações do GitHub
2. Instalar/atualizar dependências
3. Fazer build da aplicação
4. Reiniciar a aplicação no PM2

### Deploy com Opções

```bash
# Pular atualização do GitHub (usar código local)
./deploy.sh --skip-pull

# Pular build (usar build existente)
./deploy.sh --skip-build

# Pular reinicialização do PM2
./deploy.sh --skip-pm2

# Especificar branch do GitHub
./deploy.sh --branch=main

# Combinar opções
./deploy.sh --skip-pull --skip-build
```

## 📝 Opções Disponíveis

| Opção | Descrição |
|-------|-----------|
| `--skip-pull` | Não faz pull do GitHub (usa código local) |
| `--skip-build` | Não faz build (usa pasta `dist` existente) |
| `--skip-pm2` | Não reinicia a aplicação no PM2 |
| `--branch=BRANCH` | Especifica qual branch fazer pull (padrão: branch atual ou `main`) |

## 🔄 Fluxo de Deploy Automático

```
1. Verificar Git
   ├─ É repositório Git? → Sim
   │  ├─ Há remote configurado? → Sim
   │  │  ├─ Há mudanças locais? → Sim
   │  │  │  └─ Fazer stash ou descartar
   │  │  └─ Fazer fetch do GitHub
   │  │     └─ Há atualizações? → Sim
   │  │        └─ Fazer pull
   │  └─ Não → Pular atualização
   └─ Não → Pular atualização

2. Instalar Dependências
   └─ npm install --include=dev

3. Build
   └─ npm run build (ou npx vite build)

4. Copiar Arquivos
   └─ Copiar public/assinatura para dist/

5. PM2
   └─ Reiniciar aplicação hsfasaude
```

## 🛠️ Configuração Inicial

### 1. Tornar o Script Executável

```bash
chmod +x deploy.sh
```

### 2. Configurar Git (se ainda não configurado)

```bash
# Verificar se é repositório Git
git status

# Se não for, inicializar
git init

# Adicionar remote do GitHub
git remote add origin https://github.com/USUARIO/REPOSITORIO.git

# Ou se já existir, verificar
git remote -v
```

### 3. Configurar Branch Padrão

O script detecta automaticamente a branch atual. Para usar uma branch específica:

```bash
./deploy.sh --branch=main
# ou
./deploy.sh --branch=master
# ou
./deploy.sh --branch=develop
```

## 📊 Exemplos de Uso

### Exemplo 1: Deploy Normal (Recomendado)

```bash
# No servidor, após fazer push no GitHub
./deploy.sh
```

**O que acontece:**
1. Faz pull do GitHub (branch atual)
2. Instala dependências
3. Faz build
4. Reinicia PM2

### Exemplo 2: Deploy Rápido (sem atualizar do GitHub)

```bash
# Se você já fez pull manualmente ou fez mudanças locais
./deploy.sh --skip-pull
```

### Exemplo 3: Deploy Apenas Build (sem reiniciar PM2)

```bash
# Se você quer apenas fazer build sem reiniciar
./deploy.sh --skip-pm2
```

### Exemplo 4: Deploy de Branch Específica

```bash
# Fazer deploy da branch develop
./deploy.sh --branch=develop
```

## 🔍 Resolução de Problemas

### Erro: "Git não está instalado"

```bash
# Instalar Git
sudo apt-get update
sudo apt-get install git

# Ou no CentOS/RHEL
sudo yum install git
```

### Erro: "Conflitos no pull"

O script detecta conflitos e para. Para resolver:

```bash
# Ver conflitos
git status

# Resolver manualmente
git mergetool

# Ou descartar mudanças locais (CUIDADO!)
git reset --hard origin/main
git pull

# Depois executar deploy novamente
./deploy.sh
```

### Erro: "Mudanças locais não commitadas"

O script oferece 3 opções:
1. **Fazer stash** (recomendado) - Salva mudanças temporariamente
2. **Descartar mudanças** - Remove mudanças locais
3. **Cancelar** - Cancela o deploy

### Erro: "Build falhou"

```bash
# Verificar logs do build
npm run build

# Limpar e reinstalar dependências
rm -rf node_modules package-lock.json
npm install --include=dev
npm run build
```

### Erro: "PM2 não encontrado"

O script tenta instalar automaticamente. Se falhar:

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Verificar instalação
pm2 -v
```

## 📋 Checklist de Deploy

Antes de executar o deploy:

- [ ] Código commitado e pushado para o GitHub
- [ ] Arquivo `.env` configurado no servidor
- [ ] Git configurado no servidor
- [ ] PM2 instalado
- [ ] Node.js instalado (versão 16+)
- [ ] Permissões corretas no diretório

## 🎯 Workflow Recomendado

### No Desenvolvimento (Local)

```bash
# 1. Fazer mudanças no código
# 2. Testar localmente
npm run dev

# 3. Commit e push
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

### No Servidor (Produção)

```bash
# 1. Conectar no servidor via SSH
ssh usuario@servidor

# 2. Ir para o diretório do projeto
cd /caminho/do/projeto

# 3. Executar deploy
./deploy.sh

# 4. Verificar logs se necessário
pm2 logs hsfasaude
```

## 🔐 Segurança

### Arquivo `.env`

O arquivo `.env` **NÃO** é commitado no Git (está no `.gitignore`). Certifique-se de que:

1. O arquivo `.env` existe no servidor
2. Contém todas as variáveis necessárias
3. Tem permissões corretas: `chmod 600 .env`

### Credenciais do Git

Se usar HTTPS com senha, considere usar:
- **SSH Keys** (recomendado)
- **Personal Access Token** do GitHub
- **Git Credential Helper**

## 📊 Informações Exibidas

Após o deploy, o script mostra:

- ✅ Status do Git (branch, commit, mensagem)
- ✅ Status do PM2 (aplicação online/offline)
- ✅ Comandos úteis do PM2
- ✅ URLs de acesso

## 💡 Dicas

1. **Sempre faça backup antes de deploy em produção**
2. **Teste em ambiente de desenvolvimento primeiro**
3. **Monitore os logs após deploy**: `pm2 logs hsfasaude`
4. **Use `--skip-pull` se fez mudanças diretas no servidor**
5. **Verifique o status do PM2**: `pm2 status`

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `pm2 logs hsfasaude`
2. Verifique o status: `pm2 status`
3. Verifique o Git: `git status`
4. Execute com verbose: `bash -x deploy.sh`

## 📝 Changelog

### Versão Atualizada
- ✅ Adicionado pull automático do GitHub
- ✅ Detecção automática de branch
- ✅ Tratamento de mudanças locais
- ✅ Exibição de informações do Git após deploy
- ✅ Opção `--skip-pull` para pular atualização
- ✅ Opção `--branch` para especificar branch

