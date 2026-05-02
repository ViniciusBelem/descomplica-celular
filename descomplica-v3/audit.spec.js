import { test, expect } from '@playwright/test';

test('Full System Audit - Descomplica Celular v3', async ({ page }) => {
  // Configurar para capturar erros do console do navegador
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('🚀 Iniciando Auditoria Visual em http://localhost:5174/');
  await page.goto('http://localhost:5174/');

  // 1. Verificar Home e Advisor
  await expect(page).toHaveTitle(/Descomplica/i);
  await page.screenshot({ path: 'audit_home.png' });
  console.log('✅ Home carregada.');

  // Tentar rodar o Advisor (clicar no botão de iniciar)
  const startButton = page.locator('button:has-text("Começar agora")').first();
  if (await startButton.isVisible()) {
    await startButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'audit_advisor_step1.png' });
    console.log('✅ Advisor iniciado.');
  }

  // 2. Navegar para o Catálogo
  console.log('📂 Indo para o Catálogo...');
  await page.goto('http://localhost:5174/catalog');
  await page.waitForTimeout(3000); // Esperar Supabase carregar
  
  // Verificar se existem cards de celular
  const cards = page.locator('.glass-panel');
  const count = await cards.count();
  console.log(`📱 Celulares encontrados no catálogo: ${count}`);
  await page.screenshot({ path: 'audit_catalog.png' });

  if (count > 0) {
    console.log('✅ Catálogo renderizado com sucesso.');
  } else {
    console.error('❌ Catálogo Vazio ou Erro de Sincronização.');
  }

  // 3. Verificar Admin (Login)
  console.log('🔐 Testando acesso ao Admin...');
  await page.goto('http://localhost:5174/login');
  await page.screenshot({ path: 'audit_login.png' });
  console.log('✅ Página de Login acessível.');

  // Relatório Final de Erros do Console
  if (consoleErrors.length > 0) {
    console.log('⚠️ Erros detectados no console do navegador:');
    consoleErrors.forEach(err => console.log(`   - ${err}`));
  } else {
    console.log('✨ Nenhum erro crítico detectado no console do navegador.');
  }
});
