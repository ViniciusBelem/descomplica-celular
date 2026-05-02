import { test, expect } from '@playwright/test';

test('Diagnostic: Why is the button disabled?', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[ERROR] ${err.message}`));

  console.log('🧐 Analisando estado de carregamento...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

  // Esperar um pouco para ver se o botão habilita
  await page.waitForTimeout(5000);

  const startBtn = page.locator('button:has-text("Proceed"), button:has-text("Começar")').first();
  const isDisabled = await startBtn.getAttribute('disabled') !== null;
  const btnText = await startBtn.innerText();

  console.log(`🔘 Botão "${btnText}" está DESABILITADO? ${isDisabled}`);

  console.log('📋 Logs do Navegador durante o boot:');
  logs.forEach(log => console.log(`   ${log}`));

  await page.screenshot({ path: 'diagnostic_boot.png' });
});
