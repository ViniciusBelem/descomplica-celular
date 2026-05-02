import { test, expect } from '@playwright/test';

test('Full Advisor Flow: Final Confirmation', async ({ page }) => {
  console.log('🧪 Iniciando teste final de ponta a ponta...');
  await page.goto('http://localhost:5174/');

  // 1. Home -> Iniciar
  const startBtn = page.locator('button:has-text("Começar"), button:has-text("Escolha")').first();
  await startBtn.click();
  console.log('✅ Início acessado.');

  // 2. Passo 1: Orçamento
  await page.waitForSelector('text=Parâmetros Financeiros');
  await page.locator('text=Intermediário').click();
  await page.locator('button:has-text("Prosseguir")').click();
  console.log('✅ Orçamento ok.');

  // 3. Passo 2: Perfil
  await page.waitForSelector('text=Intenção de Uso');
  await page.locator('text=Gamer').click();
  await page.locator('button:has-text("Prosseguir")').click();
  console.log('✅ Perfil ok.');

  // 4. Passo 3: Prioridade
  await page.waitForSelector('text=Foco Principal');
  await page.locator('text=Performance').click();
  await page.locator('button:has-text("Busca Neural")').click();
  console.log('🧠 IA Pensando...');

  // 5. Resultados
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'final_proof.png', fullPage: true });

  const results = page.locator('.glass-panel');
  const count = await results.count();
  
  if (count > 0) {
    console.log(`🎉 SUCESSO! IA entregou ${count} aparelhos.`);
    const firstVerdict = await page.locator('p.italic').first().innerText();
    console.log(`📝 Veredito Real: "${firstVerdict}"`);
  } else {
    throw new Error('A IA não retornou resultados.');
  }
});
