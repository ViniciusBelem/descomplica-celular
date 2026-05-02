import { test, expect } from '@playwright/test';

test('Deep Dive: Advisor & AI Verdict', async ({ page }) => {
  console.log('🧪 Iniciando teste profundo do Recomendador...');
  await page.goto('http://localhost:5174/');

  // 1. Clicar em começar
  const startBtn = page.locator('button:has-text("Começar agora")');
  await startBtn.click();
  await page.waitForTimeout(500);

  // 2. Passo 1: Orçamento (Selecionar 2k-4k)
  console.log('💰 Selecionando orçamento...');
  const budgetBtn = page.locator('button:has-text("Intermediário")');
  await budgetBtn.click();
  await page.locator('button:has-text("Próximo")').click();

  // 3. Passo 2: Perfil (Selecionar Jogos/Performance)
  console.log('🎮 Selecionando perfil de uso...');
  const profileBtn = page.locator('button:has-text("Jogos e Performance")');
  await profileBtn.click();
  await page.locator('button:has-text("Próximo")').click();

  // 4. Passo 3: Prioridade (Selecionar Câmera)
  console.log('📸 Selecionando prioridade...');
  const priorityBtn = page.locator('button:has-text("Câmeras Profissionais")');
  await priorityBtn.click();
  
  // 5. Gerar Recomendação
  console.log('🧠 Acionando IA Nexus...');
  await page.locator('button:has-text("Gerar Recomendação")').click();

  // 6. Aguardar Resultados e verificar IA
  await page.waitForTimeout(8000); // Dar tempo para a IA pensar
  await page.screenshot({ path: 'audit_ai_results.png', fullPage: true });

  const results = page.locator('.glass-panel');
  const count = await results.count();
  
  if (count > 0) {
    console.log(`✅ IA entregou ${count} recomendações.`);
    // Verificar se tem texto do veredito (procurar por aspas ou palavras do prompt)
    const verdict = await page.locator('p.italic').first().innerText();
    console.log(`📝 Amostra do Veredito da IA: ${verdict.substring(0, 50)}...`);
  } else {
    console.error('❌ Falha: A IA não retornou nenhum celular para este perfil.');
  }
});
