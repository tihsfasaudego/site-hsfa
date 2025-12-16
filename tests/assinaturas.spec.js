import { test, expect } from '@playwright/test';

test.describe('Página de Assinaturas', () => {
  test('deve carregar a página /assinaturas', async ({ page }) => {
    // Acessar a página
    await page.goto('http://localhost:5173/assinaturas');
    
    // Aguardar um pouco para o conteúdo carregar
    await page.waitForTimeout(2000);
    
    // Tirar screenshot para debug
    await page.screenshot({ path: 'tests/screenshot-assinaturas.png', fullPage: true });
    
    // Verificar se a página carregou
    const title = await page.title();
    console.log('Título da página:', title);
    
    // Verificar se há algum erro no console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('Erro no console:', msg.text());
      }
    });
    
    // Verificar se há erros de rede
    page.on('response', response => {
      if (!response.ok() && response.url().includes('/assinaturas')) {
        console.log('Erro de resposta:', response.status(), response.url());
      }
    });
    
    // Verificar se o conteúdo está presente
    const loadingSpinner = await page.locator('.spinner-border').count();
    console.log('Spinners encontrados:', loadingSpinner);
    
    const carimboContent = await page.locator('#carimbo-content').count();
    console.log('Elementos #carimbo-content encontrados:', carimboContent);
    
    const sistemaContainer = await page.locator('.sistema-container').count();
    console.log('Elementos .sistema-container encontrados:', sistemaContainer);
    
    // Verificar se a API está respondendo
    try {
      const apiResponse = await page.goto('http://localhost:5173/assinaturas/api/conteudo');
      console.log('Status da API /assinaturas/api/conteudo:', apiResponse?.status());
    } catch (error) {
      console.log('Erro ao acessar API:', error.message);
    }
    
    // Verificar se há algum texto na página
    const bodyText = await page.textContent('body');
    console.log('Primeiros 500 caracteres do body:', bodyText?.substring(0, 500));
    
    // Aguardar mais um pouco para ver se o conteúdo aparece
    await page.waitForTimeout(3000);
    
    // Verificar novamente após esperar
    const finalContent = await page.locator('#carimbo-content').count();
    console.log('Elementos #carimbo-content após espera:', finalContent);
    
    // Verificar se há canvas de assinatura
    const canvas = await page.locator('#signatureCanvas').count();
    console.log('Canvas de assinatura encontrados:', canvas);
    
    // Listar todos os erros encontrados
    if (errors.length > 0) {
      console.log('Erros encontrados:', errors);
    }
  });
});

