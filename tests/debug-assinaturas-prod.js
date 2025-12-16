import { test, expect } from '@playwright/test';

test('Debug página de Assinaturas em produção', async ({ page }) => {
  // Capturar todos os erros de console
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('❌ Erro no console:', msg.text());
    }
  });

  // Capturar erros de rede
  const networkErrors = [];
  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.log(`❌ Erro de rede: ${response.status()} - ${response.url()}`);
    }
  });

  // Acessar a página de produção
  console.log('🌐 Acessando: https://hsfasaude.com.br/assinaturas');
  await page.goto('https://hsfasaude.com.br/assinaturas', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });

  // Aguardar um pouco para garantir que tudo carregou
  await page.waitForTimeout(3000);

  // Verificar se a página carregou
  const title = await page.title();
  console.log('📄 Título da página:', title);

  // Verificar se há spinner de carregamento
  const spinner = await page.locator('.spinner-border').count();
  console.log('⏳ Spinners encontrados:', spinner);

  // Verificar se o conteúdo foi carregado
  const carimboContent = await page.locator('#carimbo-content').count();
  console.log('📦 Elementos #carimbo-content encontrados:', carimboContent);

  // Verificar se há erros na API
  const apiErrors = networkErrors.filter(err => err.url.includes('/assinaturas/api'));
  if (apiErrors.length > 0) {
    console.log('🔴 Erros na API:', apiErrors);
  }

  // Verificar erros de recursos externos
  const cdnErrors = networkErrors.filter(err => 
    err.url.includes('cdnjs.cloudflare.com') || 
    err.url.includes('cdn.jsdelivr.net')
  );
  if (cdnErrors.length > 0) {
    console.log('🔴 Erros em CDN:', cdnErrors);
  }

  // Tirar screenshot para análise
  await page.screenshot({ 
    path: 'tests/debug-assinaturas-prod.png', 
    fullPage: true 
  });
  console.log('📸 Screenshot salvo em: tests/debug-assinaturas-prod.png');

  // Verificar o estado do React
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

  console.log('⚛️ Estado do React:', JSON.stringify(reactState, null, 2));

  // Resumo final
  console.log('\n📊 RESUMO:');
  console.log(`- Erros no console: ${consoleErrors.length}`);
  console.log(`- Erros de rede: ${networkErrors.length}`);
  console.log(`- Erros de CDN: ${cdnErrors.length}`);
  console.log(`- Erros na API: ${apiErrors.length}`);
  
  if (consoleErrors.length > 0) {
    console.log('\n🔴 Erros no console:');
    consoleErrors.forEach(err => console.log(`  - ${err}`));
  }
  
  if (networkErrors.length > 0) {
    console.log('\n🔴 Erros de rede:');
    networkErrors.forEach(err => console.log(`  - ${err.status} ${err.statusText}: ${err.url}`));
  }
});

