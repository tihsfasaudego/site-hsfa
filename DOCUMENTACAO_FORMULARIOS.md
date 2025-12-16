# Documentação Unificada - Sistema de Formulários e Emails

## 📋 Páginas React do Site

O site utiliza **React Router** com as seguintes páginas:

### Páginas Principais
1. **Home** (`src/pages/Home.jsx`) - `/`
2. **Quem Somos** (`src/pages/QuemSomos.jsx`) - `/quem-somos`
3. **Exames** (`src/pages/Exames.jsx`) - `/exames`
4. **Ver Exame** (`src/pages/VerExame.jsx`) - `/exames/:id`
5. **Cirurgias** (`src/pages/Cirurgias.jsx`) - `/cirurgias`
6. **Ver Cirurgia** (`src/pages/VerCirurgia.jsx`) - `/cirurgias/:id`
7. **Diferenciais** (`src/pages/Diferenciais.jsx`) - `/diferenciais`
8. **Editais** (`src/pages/Editais.jsx`) - `/editais`

### Páginas com Formulários (Envio de Emails)

#### 1. **Formulário de Contato** 
- **Arquivo**: `src/pages/Contato.jsx`
- **Rota**: `/contato`
- **Endpoint API**: `POST /api/contato` (Node.js)
- **Compatibilidade**: `POST /enviaMensagem.php` (mantido para compatibilidade)

**Campos do Formulário:**
- Nome (obrigatório)
- Email (obrigatório)
- Celular (obrigatório)
- Assunto (obrigatório)
- Mensagem (obrigatório)

**Lógica de Envio:**
```javascript
// Frontend: src/pages/Contato.jsx
contatoService.send(formData)

// Backend: server.js -> /api/contato
emailService.sendContactForm(data)
```

#### 2. **Pesquisa de Satisfação**
- **Arquivo**: `src/pages/PesquisaSatisfacao.jsx`
- **Rota**: `/pesquisa-satisfacao`
- **Endpoint API**: `POST /api/pesquisa` (Node.js)
- **Compatibilidade**: `POST /enviaPesquisa.php` (mantido para compatibilidade)

**Campos do Formulário:**
- **Etapa 1 - Dados Pessoais**: Nome, Email, Celular
- **Etapa 2 - Informações da Visita**: Data, Leito, Médico, Tipo (Paciente/Acompanhante)
- **Etapa 3 - Avaliação Geral**: Recomendaria hospital (0-10), Justificativa
- **Etapa 4 - Avaliação dos Setores**: 18 setores com notas de 0-10 ou "Não Utilizei"
- **Etapa 5 - Comentários Finais**: Sugestões/Reclamações

**Lógica de Envio:**
```javascript
// Frontend: src/pages/PesquisaSatisfacao.jsx
contatoService.sendPesquisa(formData)

// Backend: server.js -> /api/pesquisa
emailService.sendSatisfactionSurvey(formData)
```

#### 3. **Formulário de Assinaturas Digitais**
- **Arquivo**: `src/pages/Assinaturas.jsx` + `public/assinatura/carimbo.html`
- **Rota**: `/assinaturas`
- **Endpoint API**: `POST /assinaturas/api/salvar` (Node.js)

**Campos do Formulário:**
- Nome (obrigatório)
- Cargo
- Empresa/Instituição
- Registro
- Imagem da assinatura (base64)

**Lógica de Envio:**
```javascript
// Frontend: public/assinatura/carimbo.html
fetch('/assinaturas/api/salvar', { method: 'POST', body: JSON.stringify(dados) })

// Backend: server.js -> /assinaturas/api/salvar
emailService.sendSignatureNotification(data)
```

## 📧 Sistema de Envio de Emails

### Arquitetura Unificada

```
Frontend (React)
    ↓
API Service (axios) - src/services/api.js
    ↓
Backend (Express/Node.js) - server.js
    ↓
Email Service (nodemailer) - services/emailService.js
    ↓
Microsoft 365 SMTP
    ↓
contato@hsfasaude.com.br (TO)
sac@hsfasaude.com.br (CC)
```

### Configuração de Emails

**Email Principal (Destinatário):** `contato@hsfasaude.com.br`  
**Email Cópia (CC):** `sac@hsfasaude.com.br`

### Variáveis de Ambiente

```env
# Email remetente (deve ser o mesmo da autenticação)
EMAIL_FROM=contato@hsfasaude.com.br

# Email destinatário principal
EMAIL_TO=contato@hsfasaude.com.br

# Email cópia (CC)
EMAIL_CC=sac@hsfasaude.com.br

# Configuração SMTP Microsoft 365
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=contato@hsfasaude.com.br
EMAIL_PASSWORD=sua_senha_aqui
```

### Serviço de Email (`services/emailService.js`)

O serviço unificado possui três métodos principais:

1. **`sendContactForm(data)`**
   - Envia emails do formulário de contato
   - Assunto: `[Formulário de Contato] {assunto}`
   - Para: `contato@hsfasaude.com.br`
   - CC: `sac@hsfasaude.com.br`

2. **`sendSatisfactionSurvey(data)`**
   - Envia emails da pesquisa de satisfação
   - Assunto: `[Pesquisa de Satisfação] Avaliação - {nome}`
   - Para: `contato@hsfasaude.com.br`
   - CC: `sac@hsfasaude.com.br`
   - Inclui tabela HTML com avaliações dos setores

3. **`sendSignatureNotification(data)`**
   - Envia notificações de assinaturas digitais
   - Assunto: `[Assinatura Digital] Nova assinatura registrada - {nome}`
   - Para: `contato@hsfasaude.com.br`
   - CC: `sac@hsfasaude.com.br`

### Método Auxiliar

**`getEmailAddresses()`**
- Retorna objeto com `{ to, cc }`
- Usa variáveis de ambiente ou valores padrão
- Unifica a configuração de destinatários

## 🔄 Endpoints da API

### Novos Endpoints (Node.js)

| Endpoint | Método | Descrição | Frontend |
|----------|--------|-----------|----------|
| `/api/contato` | POST | Processa formulário de contato | `contatoService.send()` |
| `/api/pesquisa` | POST | Processa pesquisa de satisfação | `contatoService.sendPesquisa()` |
| `/assinaturas/api/salvar` | POST | Salva assinatura digital | `fetch('/assinaturas/api/salvar')` |

### Endpoints de Compatibilidade

Mantidos para não quebrar código existente (mas implementados em Node.js, não PHP):

| Endpoint | Método | Redireciona Para |
|----------|--------|------------------|
| `/enviaMensagem.php` | POST | `/api/contato` |
| `/enviaPesquisa.php` | POST | `/api/pesquisa` |

**⚠️ IMPORTANTE:** Estes endpoints `.php` são apenas nomes de compatibilidade. A implementação é 100% Node.js/Express.

## 📝 Fluxo de Dados

### Formulário de Contato

```
1. Usuário preenche formulário em /contato
2. React: handleSubmit() chama contatoService.send(formData)
3. Axios: POST /api/contato com dados JSON
4. Express: server.js recebe requisição em /api/contato
5. Validação: Verifica campos obrigatórios
6. Email Service: emailService.sendContactForm(data)
7. Nodemailer: Envia email via SMTP Microsoft 365
8. Email chega em: contato@hsfasaude.com.br (CC: sac@hsfasaude.com.br)
9. Resposta JSON: { success: true, message: '...' }
10. React: Mostra mensagem de sucesso
```

### Pesquisa de Satisfação

```
1. Usuário preenche pesquisa em /pesquisa-satisfacao (5 etapas)
2. React: handleSubmit() chama contatoService.sendPesquisa(formData)
3. Axios: POST /api/pesquisa com dados JSON
4. Express: server.js recebe requisição em /api/pesquisa
5. Validação: Verifica campos obrigatórios
6. Email Service: emailService.sendSatisfactionSurvey(formData)
7. Nodemailer: Envia email formatado com tabela HTML
8. Email chega em: contato@hsfasaude.com.br (CC: sac@hsfasaude.com.br)
9. Resposta JSON: { success: true, message: '...' }
10. React: Mostra alerta e redireciona para home
```

### Assinaturas Digitais

```
1. Usuário cria assinatura em /assinaturas
2. JavaScript: salvarNoServidor() converte canvas para base64
3. Fetch: POST /assinaturas/api/salvar com dados JSON
4. Express: server.js recebe requisição em /assinaturas/api/salvar
5. Validação: Verifica nome e imagem
6. Sistema de Arquivos: Salva PNG e TXT localmente
7. Email Service: emailService.sendSignatureNotification(data)
8. Nodemailer: Envia notificação
9. Email chega em: contato@hsfasaude.com.br (CC: sac@hsfasaude.com.br)
10. Resposta JSON: { success: true, data: {...} }
11. JavaScript: Mostra alerta de sucesso
```

## 🎨 Formato dos Emails

Todos os emails são enviados em **HTML profissional** com:

- **Cabeçalho**: Cor do hospital (#196F75)
- **Conteúdo**: Formatação clara e organizada
- **Rodapé**: Informações de data/hora e origem automática
- **Reply-To**: Email do remetente (quando disponível)

### Exemplo de Assunto dos Emails:

- **Contato**: `[Formulário de Contato] {Assunto}`
- **Pesquisa**: `[Pesquisa de Satisfação] Avaliação - {Nome}`
- **Assinatura**: `[Assinatura Digital] Nova assinatura registrada - {Nome}`

## ✅ Checklist de Implementação

- [x] Serviço de email unificado criado
- [x] Todos os formulários configurados para Node.js
- [x] Endpoints `/api/` criados
- [x] Compatibilidade com endpoints `.php` mantida
- [x] Email principal: contato@hsfasaude.com.br
- [x] Email cópia: sac@hsfasaude.com.br
- [x] Frontend atualizado para usar novos endpoints
- [x] Documentação completa criada

## 🔍 Resumo das Mudanças

### Antes
- Endpoints com nomes `.php` (confusão)
- Email único: sac@hsfasaude.com.br
- Lógica espalhada

### Depois
- Endpoints `/api/` claros (Node.js)
- Email principal: contato@hsfasaude.com.br
- Email cópia: sac@hsfasaude.com.br
- Lógica unificada em `emailService.js`
- Compatibilidade mantida com endpoints `.php`

## 🛠️ Arquivos Modificados

### Criados:
- `services/emailService.js` - Serviço unificado de email
- `DOCUMENTACAO_FORMULARIOS.md` - Esta documentação

### Modificados:
- `server.js` - Endpoints unificados e compatibilidade
- `src/services/api.js` - Atualizado para usar `/api/`
- `src/pages/Contato.jsx` - Usa novo endpoint
- `src/pages/PesquisaSatisfacao.jsx` - Usa novo endpoint

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do servidor: `pm2 logs hsfasaude`
2. Verifique as variáveis de ambiente no `.env`
3. Teste a conexão SMTP manualmente
4. Consulte `README_EMAIL.md` para configuração detalhada

