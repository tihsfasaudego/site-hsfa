import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import emailService from './services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON e FormData
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware para permitir requisições do frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// IMPORTANTE: Rotas específicas devem vir ANTES do express.static para evitar conflitos
// /assinaturas (sem barra) vai para o React Router para ter o layout completo
// /assinaturas/ (com barra) também vai para o React Router
// Apenas arquivos específicos como /assinaturas/carimbo.html são servidos diretamente

// Função auxiliar para processar formulário de contato
const processContactForm = async (req, res) => {
  try {
    const { nome, email, assunto, celular, message } = req.body;
    
    // Validações
    if (!nome || !email || !assunto || !message) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome, email, assunto e mensagem'
      });
    }
    
    // Enviar email se o serviço estiver configurado
    if (emailService.isConfigured()) {
      try {
        await emailService.sendContactForm({ nome, email, assunto, celular, message });
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Continuar mesmo se o email falhar
      }
    } else {
      console.warn('Serviço de email não configurado. Configure as variáveis de ambiente.');
    }
    
    res.json({
      success: true,
      message: 'Mensagem enviada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao processar formulário de contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a mensagem. Tente novamente mais tarde.'
    });
  }
};

// Função auxiliar para processar pesquisa de satisfação
const processSatisfactionSurvey = async (req, res) => {
  try {
    const formData = req.body;
    
    // Validações básicas
    if (!formData.nome || !formData.email || !formData.celular) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome, email e celular'
      });
    }
    
    // Enviar email se o serviço estiver configurado
    if (emailService.isConfigured()) {
      try {
        await emailService.sendSatisfactionSurvey(formData);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Continuar mesmo se o email falhar
      }
    } else {
      console.warn('Serviço de email não configurado. Configure as variáveis de ambiente.');
    }
    
    res.json({
      success: true,
      message: 'Pesquisa enviada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao processar pesquisa de satisfação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar a pesquisa. Tente novamente mais tarde.'
    });
  }
};

// API para enviar formulário de contato (novo endpoint Node.js)
app.post('/api/contato', processContactForm);

// API para enviar pesquisa de satisfação (novo endpoint Node.js)
app.post('/api/pesquisa', processSatisfactionSurvey);

// Endpoints de compatibilidade com nomes .php (mantidos para não quebrar código existente)
app.post('/enviaMensagem.php', processContactForm);
app.post('/enviaPesquisa.php', processSatisfactionSurvey);

// API para obter o conteúdo HTML do carimbo (apenas o body)
app.get('/assinaturas/api/conteudo', (req, res) => {
  try {
    // Verificar primeiro em dist (produção), depois em public (desenvolvimento)
    let carimboPath = join(__dirname, 'dist', 'assinatura', 'carimbo.html');
    if (!existsSync(carimboPath)) {
      carimboPath = join(__dirname, 'public', 'assinatura', 'carimbo.html');
    }
    
    if (!existsSync(carimboPath)) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo carimbo.html não encontrado'
      });
    }
    
    const content = readFileSync(carimboPath, 'utf-8');
    
    // Extrair apenas o conteúdo do body (sem as tags <body>)
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : content;
    
    // Remover scripts do bodyContent (serão adicionados separadamente)
    bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Extrair scripts do head e body
    const scripts = [];
    const scriptMatches = content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    for (const match of scriptMatches) {
      scripts.push(match[0]);
    }
    
    // Extrair estilos do head para incluir no HTML
    let styles = [];
    const styleMatches = content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    for (const match of styleMatches) {
      let styleContent = match[1];
      
      // Escopar TODOS os seletores para dentro de #carimbo-content
      // Substituir seletores body e html por #carimbo-content
      styleContent = styleContent.replace(/^(\s*)body\s*\{/gm, '$1#carimbo-content {');
      styleContent = styleContent.replace(/^(\s*)html\s*\{/gm, '$1#carimbo-content {');
      
      // Remover regras que afetam html e body globalmente
      styleContent = styleContent.replace(/html\s*\{[^}]*\}/g, '');
      styleContent = styleContent.replace(/body\s*\{[^}]*\}/g, '');
      
      // Envolver todo o conteúdo de estilo em um escopo #carimbo-content
      // Isso garante que nenhum estilo afete o layout global
      styleContent = `#carimbo-content { ${styleContent} }`;
      
      styles.push(`<style>${styleContent}</style>`);
    }
    
    // Adicionar estilos ao início do bodyContent
    if (styles.length > 0) {
      bodyContent = styles.join('\n') + '\n' + bodyContent;
    }
    
    res.json({
      success: true,
      html: bodyContent,
      scripts: scripts
    });
  } catch (error) {
    console.error('Erro ao ler carimbo.html:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao carregar conteúdo'
    });
  }
});

// API para salvar assinaturas (substitui o PHP)
app.post('/assinaturas/api/salvar', (req, res) => {
  try {
    const { nome, cargo, empresa, registro, imagem } = req.body;
    
    // Validações
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nome é obrigatório'
      });
    }
    
    if (!imagem || imagem.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Imagem da assinatura é obrigatória'
      });
    }
    
    // Diretório onde serão salvos os arquivos
    const diretorio = join(__dirname, 'dist', 'assinatura', 'assinatura');
    
    // Criar diretório se não existir
    if (!existsSync(diretorio)) {
      mkdirSync(diretorio, { recursive: true });
    }
    
    // Limpar o nome para usar como nome de arquivo
    const nomeArquivo = nome.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    
    // Adicionar timestamp para evitar sobrescrita
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');
    const nomeArquivoFinal = `${nomeArquivo}_${timestamp}`;
    
    // Processar a imagem base64
    // Remover o prefixo "data:image/png;base64,"
    const imagemBase64 = imagem.replace(/^data:image\/\w+;base64,/, '');
    const imagemBuffer = Buffer.from(imagemBase64, 'base64');
    
    // Salvar a imagem PNG
    const caminhoImagem = join(diretorio, `${nomeArquivoFinal}.png`);
    writeFileSync(caminhoImagem, imagemBuffer);
    
    // Criar conteúdo do arquivo TXT
    const dataHora = new Date().toLocaleString('pt-BR');
    const conteudoTxt = `==============================================
       REGISTRO DE ASSINATURA DIGITAL
==============================================

STATUS: OK

DADOS DO REGISTRO:
----------------------------------------------
Nome: ${nome}
Cargo: ${cargo || 'Não informado'}
Empresa/Instituição: ${empresa || 'Não informado'}
Número de Registro: ${registro || 'Não informado'}
----------------------------------------------

INFORMAÇÕES TÉCNICAS:
----------------------------------------------
Data e Hora: ${dataHora}
Arquivo de Imagem: ${nomeArquivoFinal}.png
IP do Cliente: ${req.ip || req.connection.remoteAddress}
User Agent: ${req.get('user-agent') || 'Não informado'}
----------------------------------------------

Assinatura digital salva com sucesso!
==============================================
`;
    
    // Salvar o arquivo TXT
    const caminhoTxt = join(diretorio, `${nomeArquivoFinal}.txt`);
    writeFileSync(caminhoTxt, conteudoTxt, 'utf-8');
    
    // Enviar email de notificação se o serviço estiver configurado
    if (emailService.isConfigured()) {
      try {
        await emailService.sendSignatureNotification({
          nome,
          cargo,
          empresa,
          registro,
          nomeArquivo: nomeArquivoFinal,
          dataHora
        });
      } catch (emailError) {
        console.error('Erro ao enviar email de notificação:', emailError);
        // Continuar mesmo se o email falhar
      }
    }
    
    // Resposta de sucesso
    res.json({
      success: true,
      message: 'Assinatura salva com sucesso!',
      data: {
        nome_arquivo: nomeArquivoFinal,
        arquivo_imagem: `${nomeArquivoFinal}.png`,
        arquivo_txt: `${nomeArquivoFinal}.txt`,
        data_hora: dataHora,
        status: 'OK'
      }
    });
    
  } catch (error) {
    console.error('Erro ao salvar assinatura:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao salvar a assinatura'
    });
  }
});

// Servir arquivos específicos da pasta assinaturas (HTML, CSS, JS, imagens)
// IMPORTANTE: Esta rota deve vir DEPOIS da rota da API para não capturar /api/salvar
app.get('/assinaturas/:filename', (req, res) => {
  // Excluir rotas da API
  if (req.path.startsWith('/assinaturas/api/')) {
    return res.status(404).send('API não encontrada');
  }
  
  const filename = req.params.filename;
  const fullPath = join(__dirname, 'dist', 'assinatura', filename);
  
  // Verificar se é um arquivo PHP
  if (filename.endsWith('.php')) {
    if (existsSync(fullPath)) {
      // Arquivo PHP existe - deve ser servido pelo servidor web
      return res.status(503).send(`
        <html>
          <head><title>Arquivo PHP - Configuração Necessária</title></head>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1>⚠️ Arquivo PHP não pode ser executado pelo Node.js</h1>
            <p>Arquivos PHP devem ser servidos diretamente pelo servidor web (Apache/Nginx).</p>
            <p>Verifique a configuração do servidor web para servir arquivos PHP.</p>
            <p><small>Arquivo: ${filename}</small></p>
          </body>
        </html>
      `);
    } else {
      return res.status(404).send('Arquivo PHP não encontrado');
    }
  }
  
  // Para outros arquivos (HTML, CSS, JS, imagens), tentar servir como arquivo estático
  if (existsSync(fullPath)) {
    const ext = extname(filename);
    let contentType = 'text/plain';
    
    if (ext === '.html' || ext === '.htm') {
      contentType = 'text/html';
    } else if (ext === '.css') {
      contentType = 'text/css';
    } else if (ext === '.js') {
      contentType = 'application/javascript';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    }
    
    try {
      const content = readFileSync(fullPath);
      res.setHeader('Content-Type', contentType);
      return res.send(content);
    } catch (error) {
      return res.status(500).send('Erro ao ler arquivo');
    }
  }
  
  // Se não encontrou, retornar 404 diretamente (não chamar next())
  return res.status(404).send('Arquivo não encontrado');
});

// Servir arquivos estáticos da pasta dist (depois das rotas específicas)
// IMPORTANTE: express.static não deve processar /assinaturas/ pois já foi tratado acima
const staticMiddleware = express.static(join(__dirname, 'dist'), {
  // Configurar tipos MIME corretos
  setHeaders: (res, path) => {
    const ext = extname(path);
    if (ext === '.jpg' || ext === '.jpeg') {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (ext === '.png') {
      res.setHeader('Content-Type', 'image/png');
    } else if (ext === '.gif') {
      res.setHeader('Content-Type', 'image/gif');
    } else if (ext === '.svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (ext === '.ico') {
      res.setHeader('Content-Type', 'image/x-icon');
    }
  },
  // IMPORTANTE: Desabilitar redirecionamento automático para diretórios
  redirect: false
});

// Usar uma função personalizada para filtrar requisições
app.use((req, res, next) => {
  // Se a requisição é para arquivos específicos de /assinaturas/ (como carimbo.html), não processar com express.static
  // Mas permitir que /assinaturas seja tratado pelo React Router
  const isAssinaturasFile = req.path.match(/^\/assinaturas\/[^/]+\.[a-zA-Z]+$/) &&
                            !req.path.startsWith('/assinaturas/api/');
  
  if (isAssinaturasFile) {
    // Pular completamente o express.static para arquivos específicos de /assinaturas/
    return next();
  }
  // Para outras rotas, usar express.static
  staticMiddleware(req, res, next);
});

// Para rotas que não são arquivos estáticos, servir o index.html (necessário para React Router)
app.get('*', (req, res, next) => {
  // Verificar se é um arquivo específico da pasta assinaturas (como carimbo.html)
  // Mas /assinaturas e /assinaturas/ devem ir para o React Router para ter o layout
  const isAssinaturasFile = req.path.match(/^\/assinaturas\/[^/]+\.[a-zA-Z]+$/) &&
                            !req.path.startsWith('/assinaturas/api/');
  
  if (isAssinaturasFile) {
    return next();
  }
  
  // Se a requisição é para um arquivo estático (tem extensão), não servir HTML
  const ext = extname(req.path);
  const isStaticFile = ext && ext.length > 0 && !['.html', '.htm'].includes(ext);
  
  if (isStaticFile) {
    // Se é um arquivo estático mas não foi encontrado pelo express.static, retornar 404
    return res.status(404).send('Arquivo não encontrado');
  }
  
  // Para rotas da aplicação React, servir index.html
  try {
    const indexPath = join(__dirname, 'dist', 'index.html');
    
    // Verificar se o arquivo existe antes de tentar ler
    if (!existsSync(indexPath)) {
      console.error(`Arquivo não encontrado: ${indexPath}`);
      return res.status(500).send(`
        <html>
          <head><title>Erro - Build Necessário</title></head>
          <body style="font-family: Arial; padding: 50px; text-align: center;">
            <h1>⚠️ Erro: Build não encontrado</h1>
            <p>O arquivo <code>dist/index.html</code> não existe.</p>
            <p>Execute: <code>npm run build</code> para criar o build de produção.</p>
            <p>Caminho esperado: <code>${indexPath}</code></p>
          </body>
        </html>
      `);
    }
    
    const indexContent = readFileSync(indexPath, 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.send(indexContent);
  } catch (error) {
    console.error('Erro ao servir index.html:', error);
    res.status(500).send(`
      <html>
        <head><title>Erro do Servidor</title></head>
        <body style="font-family: Arial; padding: 50px; text-align: center;">
          <h1>❌ Erro ao carregar a aplicação</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
