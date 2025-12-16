import { test, expect } from '@playwright/test';

test('Verificar página de assinaturas em produção', async ({ page }) => {
  const errors = [];
  const networkErrors = [];

  // Capturar erros do console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Capturar erros de rede
  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  // Acessar a página
  await page.goto('https://hsfasaude.com.br/assinaturas', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });

  // Aguardar carregamento
  await page.waitForTimeout(3000);

  // Verificar se a página carregou
  const title = await page.title();
  console.log('Título:', title);

  // Verificar se há conteúdo
  const hasContent = await page.locator('#carimbo-content').count() > 0;
  const isLoading = await page.locator('.spinner-border').count() > 0;

  console.log('Conteúdo carregado:', hasContent);
  console.log('Ainda carregando:', isLoading);
  console.log('Erros no console:', errors.length);
  console.log('Erros de rede:', networkErrors.length);

  // Filtrar apenas erros relevantes (ignorar favicon, etc)
  const relevantErrors = networkErrors.filter(err => 
    !err.url.includes('favicon') && 
    !err.url.includes('analytics') &&
    err.status >= 400
  );

  if (relevantErrors.length > 0) {
    console.log('\nErros relevantes encontrados:');
    relevantErrors.forEach(err => {
      console.log(`  ${err.status} ${err.statusText}: ${err.url}`);
    });
  }

  // Screenshot para análise
  await page.screenshot({ 
    path: 'tests/assinaturas-prod-debug.png', 
    fullPage: true 
  });
});

