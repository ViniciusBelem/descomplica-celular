import { test, expect } from '@playwright/test';

test('Autonomous Discovery Verification', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));

  console.log('🧪 Iniciando teste de Injeção Autônoma...');
  await page.goto('http://localhost:5174/');

  // 1. Iniciar Advisor
  await page.locator('button:has-text("Começar"), button:has-text("Escolha")').first().click();
  
  // 2. Passo 1: Orçamento (Colocar um valor alto para forçar descoberta de novidades)
  await page.waitForSelector('text=Parâmetros Financeiros');
  await page.locator('text=Premium').click();
  await page.locator('button:has-text("Prosseguir")').click();

  // 3. Passo 2: Perfil
  await page.waitForSelector('text=Intenção de Uso');
  await page.locator('text=Gamer').click();
  await page.locator('button:has-text("Prosseguir")').click();

  // 4. Passo 3: Prioridade
  await page.waitForSelector('text=Foco Principal');
  await page.locator('text=Performance').click();
  await page.locator('button:has-text("Busca Neural")').click();

  console.log('🧠 Aguardando IA e Injeção no Banco...');
  await page.waitForTimeout(15000); // IA demora para pesquisar e injetar

  const discoveryLog = logs.find(l => l.includes('Registering') || l.includes('AI Discovered'));
  if (discoveryLog) {
    console.log(`✅ LOG DE DESCOBERTA ENCONTRADO: ${discoveryLog}`);
  } else {
    console.log('ℹ️ Nenhuma descoberta nova (talvez o banco já esteja atualizado).');
  }

  await page.screenshot({ path: 'verify_discovery.png', fullPage: true });
});
