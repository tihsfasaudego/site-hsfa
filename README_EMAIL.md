# Configuração de Email - Sistema de Formulários

Este documento explica como configurar o sistema de envio de emails para receber notificações de todos os formulários do site.

## 📋 Formulários Configurados

O sistema está configurado para enviar emails para **sac@hsfasaude.com.br** quando os seguintes formulários forem preenchidos:

1. **Formulário de Contato** (`/contato`)
   - Nome, Email, Celular, Assunto, Mensagem

2. **Pesquisa de Satisfação** (`/pesquisa-satisfacao`)
   - Dados pessoais, informações da visita, avaliação geral, avaliação dos setores, comentários finais

3. **Formulário de Assinaturas Digitais** (`/assinaturas`)
   - Nome, Cargo, Empresa, Registro, Imagem da assinatura

## 🔧 Configuração

### 1. Criar arquivo `.env`

Copie o arquivo `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```

### 2. Configurar credenciais de email

Edite o arquivo `.env` e configure as seguintes variáveis:

```env
EMAIL_FROM=sac@hsfasaude.com.br
EMAIL_TO=sac@hsfasaude.com.br
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=sac@hsfasaude.com.br
EMAIL_PASSWORD=sua_senha_aqui
```

### 3. Autenticação Microsoft 365/Outlook

O sistema suporta duas formas de autenticação:

#### Opção A: Autenticação Básica (Senha)

Use a senha do email Microsoft 365. **Importante**: Para contas Microsoft 365, você pode precisar criar uma "Senha de Aplicativo" em vez da senha normal:

1. Acesse: https://account.microsoft.com/security
2. Vá em "Segurança" > "Senhas de aplicativo"
3. Crie uma nova senha de aplicativo
4. Use essa senha no campo `EMAIL_PASSWORD`

#### Opção B: OAuth2 (Recomendado para produção)

Para maior segurança, configure OAuth2:

1. Registre um aplicativo no Azure AD: https://portal.azure.com
2. Configure as permissões necessárias (Mail.Send)
3. Obtenha Client ID, Client Secret e Refresh Token
4. Configure no `.env`:

```env
EMAIL_CLIENT_ID=seu_client_id
EMAIL_CLIENT_SECRET=seu_client_secret
EMAIL_REFRESH_TOKEN=seu_refresh_token
```

### 4. Reiniciar o servidor

Após configurar o `.env`, reinicie o servidor Node.js:

```bash
npm start
```

Ou se estiver usando PM2:

```bash
pm2 restart hsfasaude
```

## 📧 Formato dos Emails

Todos os emails são enviados em formato HTML com:

- **Assunto**: Identifica o tipo de formulário e informações principais
- **Corpo**: Formatação profissional com cores do hospital (#196F75)
- **Reply-To**: Email do remetente (quando disponível) para facilitar resposta
- **Rodapé**: Informações sobre data/hora e origem automática

## 🔍 Verificação

Para verificar se o sistema está funcionando:

1. Preencha um formulário no site
2. Verifique se o email chegou em **sac@hsfasaude.com.br**
3. Verifique os logs do servidor para erros

### Logs do Servidor

O servidor registra:
- ✅ Sucesso no envio de emails
- ⚠️ Avisos quando o serviço não está configurado
- ❌ Erros de conexão ou autenticação

## 🛠️ Solução de Problemas

### Email não está sendo enviado

1. **Verifique as variáveis de ambiente**:
   ```bash
   # No servidor, verifique se as variáveis estão carregadas
   echo $EMAIL_FROM
   ```

2. **Verifique os logs do servidor**:
   ```bash
   # Se usar PM2
   pm2 logs hsfasaude
   ```

3. **Teste a conexão SMTP**:
   - Verifique se a porta 587 está aberta
   - Verifique se o firewall não está bloqueando
   - Teste com um cliente de email (Outlook, Thunderbird)

### Erro de autenticação

- **Senha incorreta**: Use senha de aplicativo se necessário
- **Conta bloqueada**: Verifique se a conta não está bloqueada por segurança
- **2FA ativado**: Use senha de aplicativo ou OAuth2

### Emails indo para spam

- Configure SPF, DKIM e DMARC no domínio
- Adicione o remetente aos contatos confiáveis
- Verifique se o domínio está configurado corretamente no Microsoft 365

## 📝 Notas Importantes

- O sistema continua funcionando mesmo se o email falhar (não bloqueia o envio do formulário)
- Todos os emails são enviados de forma assíncrona
- Os dados dos formulários são salvos localmente (assinaturas) além do envio por email
- O sistema suporta tanto desenvolvimento quanto produção

## 🔒 Segurança

- **Nunca** commite o arquivo `.env` no Git
- Use senhas fortes ou OAuth2
- Mantenha as credenciais seguras
- Revise periodicamente as permissões de acesso

## 📞 Suporte

Em caso de problemas, verifique:
1. Logs do servidor
2. Configuração do Microsoft 365
3. Firewall e rede
4. Credenciais de acesso

