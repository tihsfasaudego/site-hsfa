import nodemailer from 'nodemailer';

/**
 * Serviço de envio de emails usando Microsoft 365/Outlook
 * Configuração via variáveis de ambiente
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Configuração para Microsoft 365/Outlook
    // Suporta tanto OAuth2 quanto autenticação básica SMTP
    const emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.office365.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.EMAIL_USER || process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    };

    // Se não tiver senha, tentar OAuth2 (requer configuração adicional)
    if (!emailConfig.auth.pass && process.env.EMAIL_CLIENT_ID) {
      emailConfig.auth = {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      };
    }

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  /**
   * Método auxiliar para obter emails de destino unificados
   * Retorna: { to: email principal, cc: email cópia }
   */
  getEmailAddresses() {
    const emailTo = process.env.EMAIL_TO || 'contato@hsfasaude.com.br';
    const emailCC = process.env.EMAIL_CC || 'sac@hsfasaude.com.br';
    return { to: emailTo, cc: emailCC };
  }

  /**
   * Envia email de formulário de contato
   */
  async sendContactForm(data) {
    const { nome, email, assunto, celular, message } = data;
    const { to, cc } = this.getEmailAddresses();
    
    const mailOptions = {
      from: `"Site HSFA" <${process.env.EMAIL_FROM || 'contato@hsfasaude.com.br'}>`,
      to: to,
      cc: cc,
      replyTo: email,
      subject: `[Formulário de Contato] ${assunto}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #196F75; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #196F75; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #196F75; }
            .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nova Mensagem do Formulário de Contato</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nome:</div>
                <div class="value">${nome}</div>
              </div>
              <div class="field">
                <div class="label">E-mail:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Celular:</div>
                <div class="value">${celular}</div>
              </div>
              <div class="field">
                <div class="label">Assunto:</div>
                <div class="value">${assunto}</div>
              </div>
              <div class="field">
                <div class="label">Mensagem:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>Este email foi enviado automaticamente pelo site do Hospital São Francisco de Assis.</p>
              <p>Data/Hora: ${new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Nova Mensagem do Formulário de Contato

Nome: ${nome}
E-mail: ${email}
Celular: ${celular}
Assunto: ${assunto}

Mensagem:
${message}

---
Este email foi enviado automaticamente pelo site do Hospital São Francisco de Assis.
Data/Hora: ${new Date().toLocaleString('pt-BR')}
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erro ao enviar email de contato:', error);
      throw error;
    }
  }

  /**
   * Envia email de pesquisa de satisfação
   */
  async sendSatisfactionSurvey(data) {
    const {
      nome, email, celular, data: dataVisita, leito, medico, tipoPaciente,
      recomendariaHospital, justifiqueAtendimento, sugestaoReclamacao,
      notaProntoSocorro, notaRecepcao, notaCadastroInternacao,
      notaMedicos, notaEnfermagem, notaFisioterapia, notaNutricao,
      notaAssistenteSocial, notaDiagnosticoImagem, notaHemodinamica,
      notaCentroCirurgico, notaUti, notaFarmacia, notaHotelaria,
      notaMaqueiro, notaHigienizacao, notaSeguranca, notaInfraestrutura
    } = data;

    // Criar tabela de avaliações dos setores
    const setores = [
      { nome: 'Pronto Socorro', nota: notaProntoSocorro },
      { nome: 'Recepção', nota: notaRecepcao },
      { nome: 'Cadastro/Internação', nota: notaCadastroInternacao },
      { nome: 'Médicos', nota: notaMedicos },
      { nome: 'Enfermagem', nota: notaEnfermagem },
      { nome: 'Fisioterapia', nota: notaFisioterapia },
      { nome: 'Nutrição', nota: notaNutricao },
      { nome: 'Assistente Social', nota: notaAssistenteSocial },
      { nome: 'Diagnóstico por Imagem', nota: notaDiagnosticoImagem },
      { nome: 'Hemodinâmica', nota: notaHemodinamica },
      { nome: 'Centro Cirúrgico', nota: notaCentroCirurgico },
      { nome: 'UTI', nota: notaUti },
      { nome: 'Farmácia', nota: notaFarmacia },
      { nome: 'Hotelaria', nota: notaHotelaria },
      { nome: 'Maqueiro', nota: notaMaqueiro },
      { nome: 'Higienização', nota: notaHigienizacao },
      { nome: 'Segurança', nota: notaSeguranca },
      { nome: 'Infraestrutura', nota: notaInfraestrutura },
    ];

    const setoresUtilizados = setores.filter(s => s.nota !== 'Não Utilizei');
    const setoresHTML = setoresUtilizados.map(s => 
      `<tr><td>${s.nome}</td><td><strong>${s.nota}</strong></td></tr>`
    ).join('');

    const { to, cc } = this.getEmailAddresses();
    
    const mailOptions = {
      from: `"Site HSFA" <${process.env.EMAIL_FROM || 'contato@hsfasaude.com.br'}>`,
      to: to,
      cc: cc,
      replyTo: email,
      subject: `[Pesquisa de Satisfação] Avaliação - ${nome}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background-color: #196F75; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #196F75; margin-bottom: 15px; border-bottom: 2px solid #196F75; padding-bottom: 5px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #196F75; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #196F75; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            table th, table td { padding: 10px; text-align: left; border: 1px solid #ddd; }
            table th { background-color: #196F75; color: white; }
            table tr:nth-child(even) { background-color: #f2f2f2; }
            .rating { font-size: 24px; font-weight: bold; color: #196F75; }
            .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nova Pesquisa de Satisfação</h2>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">1. Dados Pessoais</div>
                <div class="field">
                  <div class="label">Nome:</div>
                  <div class="value">${nome}</div>
                </div>
                <div class="field">
                  <div class="label">E-mail:</div>
                  <div class="value">${email}</div>
                </div>
                <div class="field">
                  <div class="label">Celular:</div>
                  <div class="value">${celular}</div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">2. Informações da Visita</div>
                <div class="field">
                  <div class="label">Data da Visita:</div>
                  <div class="value">${dataVisita ? new Date(dataVisita).toLocaleDateString('pt-BR') : 'Não informado'}</div>
                </div>
                <div class="field">
                  <div class="label">Leito:</div>
                  <div class="value">${leito || 'Não informado'}</div>
                </div>
                <div class="field">
                  <div class="label">Médico Responsável:</div>
                  <div class="value">${medico || 'Não informado'}</div>
                </div>
                <div class="field">
                  <div class="label">Tipo:</div>
                  <div class="value">${tipoPaciente}</div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">3. Avaliação Geral</div>
                <div class="field">
                  <div class="label">Recomendaria o hospital? (0 a 10):</div>
                  <div class="value rating">${recomendariaHospital}/10</div>
                </div>
                <div class="field">
                  <div class="label">Justificativa:</div>
                  <div class="value">${justifiqueAtendimento.replace(/\n/g, '<br>')}</div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">4. Avaliação dos Setores</div>
                ${setoresUtilizados.length > 0 ? `
                  <table>
                    <thead>
                      <tr>
                        <th>Setor</th>
                        <th>Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${setoresHTML}
                    </tbody>
                  </table>
                ` : '<p>Nenhum setor foi avaliado.</p>'}
              </div>

              ${sugestaoReclamacao ? `
              <div class="section">
                <div class="section-title">5. Comentários Finais</div>
                <div class="value">${sugestaoReclamacao.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p>Este email foi enviado automaticamente pelo site do Hospital São Francisco de Assis.</p>
              <p>Data/Hora: ${new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Nova Pesquisa de Satisfação

1. DADOS PESSOAIS
Nome: ${nome}
E-mail: ${email}
Celular: ${celular}

2. INFORMAÇÕES DA VISITA
Data da Visita: ${dataVisita ? new Date(dataVisita).toLocaleDateString('pt-BR') : 'Não informado'}
Leito: ${leito || 'Não informado'}
Médico Responsável: ${medico || 'Não informado'}
Tipo: ${tipoPaciente}

3. AVALIAÇÃO GERAL
Recomendaria o hospital? (0 a 10): ${recomendariaHospital}/10
Justificativa: ${justifiqueAtendimento}

4. AVALIAÇÃO DOS SETORES
${setoresUtilizados.map(s => `${s.nome}: ${s.nota}`).join('\n')}

${sugestaoReclamacao ? `5. COMENTÁRIOS FINAIS\n${sugestaoReclamacao}` : ''}

---
Este email foi enviado automaticamente pelo site do Hospital São Francisco de Assis.
Data/Hora: ${new Date().toLocaleString('pt-BR')}
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erro ao enviar email de pesquisa:', error);
      throw error;
    }
  }

  /**
   * Envia email de notificação de assinatura digital
   */
  async sendSignatureNotification(data) {
    const { nome, cargo, empresa, registro, nomeArquivo, dataHora } = data;
    const { to, cc } = this.getEmailAddresses();

    const mailOptions = {
      from: `"Site HSFA" <${process.env.EMAIL_FROM || 'contato@hsfasaude.com.br'}>`,
      to: to,
      cc: cc,
      subject: `[Assinatura Digital] Nova assinatura registrada - ${nome}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #196F75; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #196F75; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #196F75; }
            .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nova Assinatura Digital Registrada</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nome:</div>
                <div class="value">${nome}</div>
              </div>
              <div class="field">
                <div class="label">Cargo:</div>
                <div class="value">${cargo || 'Não informado'}</div>
              </div>
              <div class="field">
                <div class="label">Empresa/Instituição:</div>
                <div class="value">${empresa || 'Não informado'}</div>
              </div>
              <div class="field">
                <div class="label">Número de Registro:</div>
                <div class="value">${registro || 'Não informado'}</div>
              </div>
              <div class="field">
                <div class="label">Arquivo:</div>
                <div class="value">${nomeArquivo}</div>
              </div>
              <div class="field">
                <div class="label">Data/Hora:</div>
                <div class="value">${dataHora}</div>
              </div>
            </div>
            <div class="footer">
              <p>Este email foi enviado automaticamente pelo site do Hospital São Francisco de Assis.</p>
              <p>A assinatura digital foi salva no servidor.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Nova Assinatura Digital Registrada

Nome: ${nome}
Cargo: ${cargo || 'Não informado'}
Empresa/Instituição: ${empresa || 'Não informado'}
Número de Registro: ${registro || 'Não informado'}
Arquivo: ${nomeArquivo}
Data/Hora: ${dataHora}

---
Este email foi enviado automaticamente pelo site do Hospital São Francisco de Assis.
A assinatura digital foi salva no servidor.
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erro ao enviar email de assinatura:', error);
      throw error;
    }
  }

  /**
   * Verifica se o serviço de email está configurado
   */
  isConfigured() {
    return !!(process.env.EMAIL_FROM || process.env.EMAIL_USER) && 
           !!(process.env.EMAIL_PASSWORD || process.env.EMAIL_CLIENT_ID);
  }
}

export default new EmailService();

