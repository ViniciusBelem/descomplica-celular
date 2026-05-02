import { test, expect } from '@playwright/test';

test('Deep Dive: Advisor (Proceed Mode)', async ({ page }) => {
  console.log('🧪 Iniciando teste do Recomendador (Modo "Proceed")...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

  // 1. Clicar em "Proceed" (O botão de começar)
  await page.locator('button:has-text("Proceed")').click();
  console.log('✅ Clique em Proceed executado.');
  await page.waitForTimeout(1000);

  // 2. Passo 1: Orçamento (Selecionar o primeiro que aparecer)
  const step1Btn = page.locator('button').nth(3); // Baseado no log anterior (Botão 03 era "01")
  await step1Btn.click();
  await page.locator('button:has-text("Proceed")').click();
  console.log('✅ Orçamento selecionado.');

  // 3. Passo 2: Perfil
  await page.locator('button').nth(1).click(); // Clica em uma opção de perfil
  await page.locator('button:has-text("Proceed")').click();
  console.log('✅ Perfil selecionado.');

  // 4. Passo 3: Prioridade e Gerar
  await page.locator('button').nth(1).click(); // Clica em uma opção de prioridade
  await page.locator('button:has-text("Proceed")').click();
  console.log('🧠 Gerando recomendação...');

  // 5. Verificar Resultado Final
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'final_advisor_results.png', fullPage: true });
  
  const hasResults = await page.locator('.glass-panel').count() > 0;
  console.log(hasResults ? '✅ RESULTADOS EXIBIDOS COM SUCESSO!' : '❌ NENHUM RESULTADO EXIBIDO.');
});
