import { test, expect } from '@playwright/test';

test('Full Advisor Flow: Verification', async ({ page }) => {
  console.log('🧪 Iniciando "Fuçagem" do Advisor em Português...');
  await page.goto('http://localhost:5174/');

  // 1. Clicar no botão principal para começar (Geralmente o Hero button)
  const startBtn = page.locator('button').first();
  await startBtn.click();
  console.log('✅ Início clicado.');

  // 2. Passo 1: Orçamento
  await page.waitForSelector('text=Parâmetros Financeiros');
  await page.locator('button').nth(2).click(); // Selecionar qualquer opção
  await page.locator('button:has-text("Prosseguir")').click();
  console.log('✅ Orçamento definido.');

  // 3. Passo 2: Perfil
  await page.waitForSelector('text=Intenção de Uso');
  await page.locator('button').nth(1).click();
  await page.locator('button:has-text("Prosseguir")').click();
  console.log('✅ Perfil definido.');

  // 4. Passo 3: Prioridade
  await page.waitForSelector('text=Foco Principal');
  await page.locator('button').nth(1).click();
  await page.locator('button:has-text("Executar Busca Neural")').click();
  console.log('🧠 Busca Neural acionada...');

  // 5. Verificar Resultados
  await page.waitForTimeout(7000); // Esperar a IA
  await page.screenshot({ path: 'advisor_final_results.png', fullPage: true });

  const cards = page.locator('.glass-panel');
  const count = await cards.count();
  
  if (count > 0) {
    console.log(`🎉 SUCESSO: A IA entregou ${count} celulares!`);
    const verdict = await page.locator('p.italic').first().innerText();
    console.log(`📝 Veredito da IA: ${verdict}`);
  } else {
    console.error('❌ ERRO: A IA não retornou nada. Verifique logs.');
  }
});
