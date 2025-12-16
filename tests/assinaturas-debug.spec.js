import { test, expect } from '@playwright/test';

test('Debug página de Assinaturas', async ({ page }) => {
  // Interceptar requisições da API
  page.on('request', request => {
    if (request.url().includes('/assinaturas/api/conteudo')) {
      console.log('Requisição para API:', request.url());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/assinaturas')) {
      console.log(`Resposta ${response.status()} para:`, response.url());
    }
  });

  // Capturar erros do console
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('Erro no console:', msg.text());
    }
  });

  // Acessar a página
  await page.goto('http://localhost:5173/assinaturas', { waitUntil: 'networkidle' });
  
  // Aguardar um pouco
  await page.waitForTimeout(1000);
  
  // Verificar se a API foi chamada
  const apiCalled = await page.evaluate(() => {
    return window.fetch.toString();
  });
  console.log('Fetch disponível:', !!apiCalled);
  
  // Verificar o estado do componente React
  const reactState = await page.evaluate(() => {
    const container = document.querySelector('.sistema-container');
    const loading = document.querySelector('.spinner-border');
    const content = document.querySelector('#carimbo-content');
    
    return {
      containerExists: !!container,
      loadingExists: !!loading,
      contentExists: !!content,
      contentHTML: content ? content.innerHTML.substring(0, 200) : null,
      containerHTML: container ? container.innerHTML.substring(0, 500) : null
    };
  });
  
  console.log('Estado do React:', JSON.stringify(reactState, null, 2));
  
  // Aguardar mais um pouco para ver se o conteúdo aparece
  await page.waitForTimeout(3000);
  
  // Verificar novamente
  const reactStateAfter = await page.evaluate(() => {
    const container = document.querySelector('.sistema-container');
    const loading = document.querySelector('.spinner-border');
    const content = document.querySelector('#carimbo-content');
    
    return {
      containerExists: !!container,
      loadingExists: !!loading,
      contentExists: !!content,
      contentHTML: content ? content.innerHTML.substring(0, 200) : null,
      containerHTML: container ? container.innerHTML.substring(0, 500) : null
    };
  });
  
  console.log('Estado após espera:', JSON.stringify(reactStateAfter, null, 2));
  
  // Verificar se há erros
  if (consoleErrors.length > 0) {
    console.log('Erros encontrados:', consoleErrors);
  }
  
  // Tirar screenshot
  await page.screenshot({ path: 'tests/debug-assinaturas.png', fullPage: true });
  
  // Verificar se o conteúdo foi carregado
  expect(reactStateAfter.contentExists || reactStateAfter.containerHTML?.length > 100).toBeTruthy();
});

