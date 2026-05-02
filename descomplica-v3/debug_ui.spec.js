import { test, expect } from '@playwright/test';

test('Persistent UI Test', async ({ page }) => {
  console.log('🔍 Tentativa de acesso persistente...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

  // Tirar um print da Home pra eu ver o que está acontecendo
  await page.screenshot({ path: 'debug_home_state.png' });

  // Tentar achar QUALQUER botão grande na tela (Hero section)
  const buttons = page.locator('button');
  const count = await buttons.count();
  console.log(`🔘 Botões encontrados na página: ${count}`);

  for (let i = 0; i < count; i++) {
    const text = await buttons.nth(i).innerText();
    console.log(`   [Botão ${i}]: "${text}"`);
  }

  // Se o botão de começar estiver lá, ele deve ser um dos primeiros
  if (count > 0) {
    await buttons.first().click();
    await page.waitForTimeout(2000);
    console.log('✅ Clique no primeiro botão executado.');
    await page.screenshot({ path: 'debug_after_click.png' });
  }
});
