# Troubleshooting - Formulário de Contato

## 🔍 Problema Identificado

A URL estava duplicando `/api/api/contato` ao invés de `/api/contato`.

## ✅ Solução Aplicada

Corrigido o arquivo `src/services/api.js` para:
- **Em desenvolvimento**: Não usar `baseURL`, deixando o proxy do Vite fazer o redirecionamento
- **Em produção**: Usar URL relativa ou variável de ambiente

## 🚀 Como Testar Agora

### 1. Verificar se os servidores estão rodando

**Terminal 1 - Servidor Node.js (Backend):**
```bash
npm start
# ou
node server.js
```
Deve mostrar: `🚀 Servidor rodando na porta 3000`

**Terminal 2 - Servidor Vite (Frontend):**
```bash
npm run dev
```
Deve mostrar: `Local: http://localhost:5173` (ou porta configurada)

### 2. Reiniciar o servidor Vite

Se o Vite já estava rodando, **reinicie** para pegar as mudanças:
1. Pare o servidor (Ctrl+C)
2. Execute novamente: `npm run dev`

### 3. Testar o formulário

1. Acesse: `http://localhost:5173/contato` (ou a porta do seu Vite)
2. Preencha o formulário
3. Clique em "Enviar"
4. Verifique no console do navegador (F12) se a requisição foi feita para `/api/contato`

### 4. Verificar logs

**No terminal do Node.js**, você deve ver:
- `POST /api/contato` quando o formulário for enviado
- Mensagens de sucesso ou erro do envio de email

**No console do navegador (F12 > Network)**, você deve ver:
- Requisição `POST /api/contato` com status 200 (sucesso)
- Se houver erro, verá o status e a mensagem de erro

## 🐛 Problemas Comuns

### Erro: "Network Error" ou "Failed to fetch"

**Causa**: Servidor Node.js não está rodando na porta 3000

**Solução**:
```bash
# Verificar se a porta 3000 está em uso
netstat -ano | findstr :3000

# Se não estiver, iniciar o servidor
npm start
```

### Erro: "CORS policy"

**Causa**: Problema de CORS entre frontend e backend

**Solução**: O CORS já está configurado no `server.js`. Verifique se está correto:
```javascript
res.header('Access-Control-Allow-Origin', '*');
```

### Erro: "404 Not Found"

**Causa**: Endpoint não encontrado

**Solução**: Verifique se o endpoint `/api/contato` está registrado no `server.js`

### Erro: "Email não configurado"

**Causa**: Variáveis de ambiente não configuradas

**Solução**: Configure o arquivo `.env`:
```env
EMAIL_FROM=contato@hsfasaude.com.br
EMAIL_TO=contato@hsfasaude.com.br
EMAIL_CC=sac@hsfasaude.com.br
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=contato@hsfasaude.com.br
EMAIL_PASSWORD=sua_senha_aqui
```

**Nota**: Mesmo sem email configurado, o formulário deve retornar sucesso (o email apenas não será enviado).

## 📋 Checklist de Verificação

- [ ] Servidor Node.js rodando na porta 3000
- [ ] Servidor Vite rodando (porta 5173 ou configurada)
- [ ] Arquivo `src/services/api.js` atualizado (sem baseURL em desenvolvimento)
- [ ] Navegador recarregado após mudanças
- [ ] Console do navegador aberto (F12) para ver erros
- [ ] Terminal do Node.js visível para ver logs

## 🔧 Debug Avançado

### Verificar requisição no Network Tab

1. Abra o DevTools (F12)
2. Vá na aba "Network"
3. Filtre por "Fetch/XHR"
4. Envie o formulário
5. Clique na requisição `contato`
6. Verifique:
   - **Request URL**: Deve ser `http://localhost:5173/api/contato` (não `/api/api/contato`)
   - **Status**: Deve ser `200 OK`
   - **Response**: Deve ter `{ success: true, message: "..." }`

### Verificar resposta do servidor

No terminal do Node.js, você deve ver:
```
POST /api/contato 200 XXms
```

Se houver erro:
```
Erro ao processar formulário de contato: [mensagem do erro]
```

## 📞 Se ainda não funcionar

1. **Limpe o cache do navegador**: Ctrl+Shift+R (hard refresh)
2. **Verifique os logs**: Tanto no terminal quanto no console do navegador
3. **Teste diretamente o endpoint**: Use Postman ou curl:
   ```bash
   curl -X POST http://localhost:3000/api/contato \
     -H "Content-Type: application/json" \
     -d '{"nome":"Teste","email":"teste@teste.com","assunto":"Teste","celular":"123","message":"Teste"}'
   ```

