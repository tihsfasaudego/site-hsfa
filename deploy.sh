#!/bin/bash

# ============================================
# Script de Deploy Automatizado - HSFA Saúde
# ============================================
# Uso: ./deploy.sh [--skip-build] [--skip-pm2]

set -e  # Parar em caso de erro

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Flags
SKIP_BUILD=false
SKIP_PM2=false

# Processar argumentos
for arg in "$@"; do
    case $arg in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-pm2)
            SKIP_PM2=true
            shift
            ;;
        *)
            ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 Deploy HSFA Saúde${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado. Execute este script na raiz do projeto.${NC}"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Erro: Node.js não está instalado.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js encontrado: ${NODE_VERSION}${NC}"

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado.${NC}"
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}📋 Copiando .env.example para .env...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Por favor, edite o arquivo .env com as configurações corretas antes de continuar.${NC}"
        echo -e "${YELLOW}   Pressione Enter para continuar ou Ctrl+C para cancelar...${NC}"
        read
    else
        echo -e "${RED}❌ Arquivo .env.example não encontrado. Criando .env básico...${NC}"
        cat > .env << EOF
NODE_ENV=production
PORT=3000
EOF
    fi
else
    echo -e "${GREEN}✅ Arquivo .env encontrado${NC}"
fi

# Carregar variáveis de ambiente (ignorar comentários e linhas vazias)
if [ -f ".env" ]; then
    # Usar uma abordagem mais segura para carregar variáveis
    while IFS= read -r line || [ -n "$line" ]; do
        # Ignorar linhas vazias e comentários
        if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
            # Verificar se a linha contém um =
            if [[ "$line" =~ ^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*= ]]; then
                export "$line"
            fi
        fi
    done < .env
    echo -e "${GREEN}✅ Variáveis de ambiente carregadas${NC}"
fi

# Verificar se PM2 está instalado (se não for pular PM2)
if [ "$SKIP_PM2" = false ]; then
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}⚠️  PM2 não está instalado. Instalando globalmente...${NC}"
        npm install -g pm2
    fi
    PM2_VERSION=$(pm2 -v)
    echo -e "${GREEN}✅ PM2 encontrado: v${PM2_VERSION}${NC}"
fi

echo ""
echo -e "${BLUE}📦 Instalando/Atualizando dependências...${NC}"
npm install --include=dev

# Verificar se o vite foi instalado
if [ ! -f "node_modules/.bin/vite" ] && [ ! -d "node_modules/vite" ]; then
    echo -e "${YELLOW}⚠️  Vite não encontrado após instalação. Tentando instalar novamente...${NC}"
    npm install vite @vitejs/plugin-react --save-dev
fi

# Verificar se há dependências vulneráveis
echo -e "${YELLOW}🔍 Verificando vulnerabilidades...${NC}"
npm audit --audit-level=moderate || echo -e "${YELLOW}⚠️  Algumas vulnerabilidades foram encontradas, mas continuando...${NC}"

# Fazer build
if [ "$SKIP_BUILD" = false ]; then
    echo ""
    echo -e "${BLUE}🔨 Fazendo build da aplicação...${NC}"
    
    # Verificar se vite está disponível
    if [ ! -f "node_modules/.bin/vite" ]; then
        echo -e "${YELLOW}⚠️  Vite não encontrado em node_modules. Instalando dependências novamente...${NC}"
        npm install --include=dev
    fi
    
    # Usar npx para garantir que encontre o vite
    # Desabilitar set -e temporariamente para o build
    set +e
    npx vite build
    BUILD_EXIT_CODE=$?
    set -e
    
    if [ $BUILD_EXIT_CODE -ne 0 ]; then
        echo -e "${YELLOW}⚠️  npx vite build falhou, tentando com npm run build...${NC}"
        set +e
        npm run build
        BUILD_EXIT_CODE=$?
        set -e
        
        if [ $BUILD_EXIT_CODE -ne 0 ]; then
            echo -e "${RED}❌ Erro: Build falhou. Verifique se todas as dependências foram instaladas.${NC}"
            echo -e "${YELLOW}💡 Tente executar: npm install --include=dev${NC}"
            exit 1
        fi
    fi

    # Verificar se o build foi bem-sucedido
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ Erro: Pasta dist não foi criada. Verifique os erros do build.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Build concluído com sucesso${NC}"

    # Verificar se index.html foi gerado corretamente
    if [ ! -f "dist/index.html" ]; then
        echo -e "${RED}❌ Erro: dist/index.html não foi criado.${NC}"
        exit 1
    fi

    # Verificar se o arquivo wow.min.css foi removido do index.html
    if grep -q "wow.min.css" dist/index.html; then
        echo -e "${YELLOW}⚠️  Aviso: Referência a wow.min.css ainda encontrada em dist/index.html${NC}"
        echo -e "${YELLOW}   Removendo referência...${NC}"
        sed -i.bak 's|<link href="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.css" rel="stylesheet">||g' dist/index.html
        rm -f dist/index.html.bak
    fi

    # Garantir que os arquivos da pasta assinatura sejam copiados
    echo ""
    echo -e "${BLUE}📋 Copiando arquivos da pasta assinatura...${NC}"
    if [ -d "public/assinatura" ]; then
        if [ ! -d "dist/assinatura" ]; then
            mkdir -p dist/assinatura
        fi
        cp -r public/assinatura/* dist/assinatura/ 2>/dev/null || true
        echo -e "${GREEN}✅ Arquivos da pasta assinatura copiados${NC}"
    else
        echo -e "${YELLOW}⚠️  Pasta public/assinatura não encontrada${NC}"
    fi

    # Garantir permissões corretas na pasta de armazenamento
    if [ -d "dist/assinatura" ]; then
        mkdir -p dist/assinatura/assinatura
        chmod 755 dist/assinatura/assinatura 2>/dev/null || true
        echo -e "${GREEN}✅ Permissões da pasta assinatura configuradas${NC}"
    fi

    # Criar pasta de logs se não existir
    mkdir -p logs
    chmod 755 logs 2>/dev/null || true
    echo -e "${GREEN}✅ Pasta de logs verificada${NC}"
else
    echo -e "${YELLOW}⏭️  Build pulado (--skip-build)${NC}"
fi

# Gerenciar PM2
if [ "$SKIP_PM2" = false ]; then
    echo ""
    echo -e "${BLUE}🔄 Gerenciando aplicação no PM2...${NC}"
    
    # Verificar se server.js existe
    if [ ! -f "server.js" ]; then
        echo -e "${RED}❌ Erro: server.js não encontrado no diretório atual.${NC}"
        echo -e "${YELLOW}   Diretório atual: $(pwd)${NC}"
        exit 1
    fi
    
    # Verificar qual arquivo de configuração usar (.cjs tem prioridade)
    ECOSYSTEM_FILE=""
    if [ -f "ecosystem.config.cjs" ]; then
        ECOSYSTEM_FILE="ecosystem.config.cjs"
        echo -e "${GREEN}✅ Usando ecosystem.config.cjs${NC}"
    elif [ -f "ecosystem.config.js" ]; then
        ECOSYSTEM_FILE="ecosystem.config.js"
        echo -e "${GREEN}✅ Usando ecosystem.config.js${NC}"
    else
        echo -e "${RED}❌ Erro: Nenhum arquivo ecosystem.config encontrado.${NC}"
        exit 1
    fi
    
    # Verificar se PM2 já está rodando a aplicação
    if pm2 list | grep -q "hsfasaude"; then
        echo -e "${YELLOW}🔄 Reiniciando aplicação no PM2...${NC}"
        pm2 restart hsfasaude --update-env
    else
        echo -e "${YELLOW}🚀 Iniciando aplicação no PM2...${NC}"
        echo -e "${BLUE}   Usando arquivo: $ECOSYSTEM_FILE${NC}"
        echo -e "${BLUE}   Script: $(pwd)/server.js${NC}"
        
        # Tentar iniciar com o arquivo de configuração
        pm2 start "$ECOSYSTEM_FILE" || {
            echo -e "${YELLOW}⚠️  Tentando iniciar diretamente com server.js...${NC}"
            pm2 start server.js --name hsfasaude \
                --env NODE_ENV=production \
                --env PORT=3000 \
                --error logs/pm2-error.log \
                --output logs/pm2-out.log \
                --max-memory-restart 500M \
                --no-autorestart false
        }
    fi

    # Salvar configuração do PM2
    pm2 save

    # Aguardar um pouco para verificar se iniciou corretamente
    sleep 2
    
    # Verificar status
    if pm2 list | grep -q "hsfasaude.*online"; then
        echo -e "${GREEN}✅ Aplicação rodando no PM2${NC}"
    else
        echo -e "${RED}❌ Erro: Aplicação não está online no PM2${NC}"
        echo -e "${YELLOW}📋 Verifique os logs: pm2 logs hsfasaude${NC}"
    fi
else
    echo -e "${YELLOW}⏭️  PM2 pulado (--skip-pm2)${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ "$SKIP_PM2" = false ]; then
    echo -e "${BLUE}📊 Status da aplicação:${NC}"
    pm2 status
    echo ""
    echo -e "${BLUE}📝 Comandos úteis:${NC}"
    echo "   Ver logs:        ${YELLOW}pm2 logs hsfasaude${NC}"
    echo "   Reiniciar:       ${YELLOW}pm2 restart hsfasaude${NC}"
    echo "   Parar:           ${YELLOW}pm2 stop hsfasaude${NC}"
    echo "   Monitorar:       ${YELLOW}pm2 monit${NC}"
    echo ""
fi

echo -e "${BLUE}🌐 Acesse:${NC}"
echo "   Local:  http://localhost:${PORT:-3000}"
echo "   Produção: https://hsfasaude.com.br"
echo ""
