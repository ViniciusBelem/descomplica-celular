/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - API SERVICES & DASHBOARD ENGINE
   Projeto: Descomplica Celular
   Camada: Consumo de Dados, Manipulação de DOM e Segurança de Rota (Guards)
   ========================================================================== */

import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

class DashboardEngine {
    constructor() {
        // Elementos do DOM - Header
        this.userNameDisplay = document.getElementById('user-name-display');
        this.btnLogout = document.getElementById('btn-logout');
        this.profileTrigger = document.getElementById('profile-menu-trigger');
        this.profileDropdown = document.getElementById('profile-dropdown');
        this.userEmailDisplay = document.getElementById('user-email-display');
        this.userAvatarInitial = document.getElementById('user-avatar-initial');
        
        // Elementos do DOM - Métricas
        this.apiBadge = document.getElementById('api-status-badge');
        this.latencyContainer = document.getElementById('api-latency-container');
        this.devicesContainer = document.getElementById('devices-analyzed-container');
        this.budgetContainer = document.getElementById('avg-budget-container');
        
        // Elementos do DOM - Gráficos e Listas
        this.chartContainer = document.getElementById('chart-container');
        this.matchesContainer = document.getElementById('recent-matches-container');
        this.btnRefresh = document.getElementById('btn-refresh-data');

        this.init();
    }

    init() {
        this.bindEvents();
        this.verifySecurityClearance(); // O Segurança da Porta
    }

    /* --- 1. CONTROLE DE SESSÃO REAL (FIREBASE GUARD) --- */
    verifySecurityClearance() {
        // O Firebase fica "escutando" o estado do usuário na aba
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // USUÁRIO AUTENTICADO
                const nomeExibicao = user.displayName || user.email.split('@')[0];
                this.userNameDisplay.textContent = nomeExibicao;
                
                // --- NOVOS DADOS DO PERFIL ---
                this.userEmailDisplay.textContent = user.email; // Puxa o e-mail real do Google
                this.userEmailDisplay.title = user.email; // (Cria o hover do e-mail completo)
                this.userAvatarInitial.textContent = nomeExibicao.charAt(0).toUpperCase(); // Pega a primeira letra do nome

                this.fetchDashboardData(); 
            } else {
                // INVASOR: Não tem token. Redireciona imediatamente.
                console.warn("%c[Security] Acesso negado. Redirecionando para login...", "color: #FF3333; font-weight: bold;");
                window.location.replace('login.html'); // replace() impede que o usuário use o botão "Voltar" do navegador
            }
        });
    }

    bindEvents() {
        // Logout seguro e definitivo do Firebase
        // Toggle do Menu de Perfil
        this.profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o clique feche imediatamente
            const isExpanded = this.profileDropdown.classList.toggle('active');
            this.profileTrigger.setAttribute('aria-expanded', isExpanded);
        });

        // Fechar o menu ao clicar fora dele
        document.addEventListener('click', (e) => {
            if (!this.profileDropdown.contains(e.target) && !this.profileTrigger.contains(e.target)) {
                this.profileDropdown.classList.remove('active');
                this.profileTrigger.setAttribute('aria-expanded', 'false');
            }
        });
        this.btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                sessionStorage.removeItem('descomplica_user'); // Limpeza por garantia
                window.location.replace('login.html');
            } catch (error) {
                console.error("[Auth API] Erro ao deslogar:", error);
            }
        });

        this.btnRefresh.addEventListener('click', () => {
            this.fetchDashboardData(true); 
        });
    }

    /* --- 2. COMUNICAÇÃO ASSÍNCRONA (SIMULAÇÃO DE API) --- */
    async fetchDashboardData(isRefresh = false) {
        if (isRefresh) {
            this.setLoadingState();
        }

        try {
            const data = await this.simulateServerDelay(1500);
            
            this.renderMetrics(data.metrics);
            this.renderChart(data.chartData);
            this.renderMatchesList(data.recentMatches);

            this.apiBadge.textContent = "Conectado";
            this.apiBadge.classList.add('success');
            this.apiBadge.classList.remove('badge'); 
            this.apiBadge.classList.add('badge'); 

        } catch (error) {
            console.error("[Dashboard Engine] Falha ao carregar dados:", error);
            this.apiBadge.textContent = "Erro de Conexão";
            this.apiBadge.style.backgroundColor = "rgba(255, 51, 51, 0.1)";
            this.apiBadge.style.color = "var(--brand-error)";
        }
    }

    simulateServerDelay(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    metrics: {
                        latency: "14ms",
                        devicesScanned: 145892,
                        avgBudget: 2850.00
                    },
                    chartData: [
                        { label: 'Câmera', value: 85 },
                        { label: 'Jogos', value: 62 },
                        { label: 'Bateria', value: 94 },
                        { label: 'Multitarefa', value: 78 },
                        { label: 'Custo-Benefício', value: 88 }
                    ],
                    recentMatches: [
                        { model: "Samsung Galaxy A54", profile: "Foco em Custo-Benefício", price: "R$ 1.799" },
                        { model: "iPhone 13", profile: "Foco em Câmera e Redes Sociais", price: "R$ 3.599" },
                        { model: "Poco X5 Pro", profile: "Alta Performance / Jogos", price: "R$ 1.950" },
                        { model: "Motorola Edge 40", profile: "Design e Multitarefa", price: "R$ 2.399" }
                    ]
                });
            }, ms);
        });
    }

    /* --- 3. MOTORES DE RENDERIZAÇÃO DE UI --- */
    renderMetrics(metrics) {
        this.latencyContainer.innerHTML = `
            <div class="metric-value">${metrics.latency}</div>
            <div class="metric-subtitle">Ping Servidor SP-01</div>
        `;

        this.devicesContainer.innerHTML = `
            <div class="metric-value">${metrics.devicesScanned.toLocaleString('pt-BR')}</div>
            <div class="metric-subtitle">Aparelhos no Banco de Dados</div>
        `;

        this.budgetContainer.innerHTML = `
            <div class="metric-value">${metrics.avgBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div class="metric-subtitle">Orçamento médio dos usuários</div>
        `;
    }

    renderChart(data) {
        let chartHTML = `<div style="display: flex; height: 100%; align-items: flex-end; gap: 1rem; padding-top: 2rem;">`;
        
        data.forEach(item => {
            chartHTML += `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; group">
                    <span style="font-size: var(--fs-xs); color: var(--brand-cyan); font-weight: 700;">${item.value}%</span>
                    <div style="width: 100%; background: rgba(0, 229, 255, 0.1); border-radius: var(--radius-sm) var(--radius-sm) 0 0; position: relative; height: 200px; overflow: hidden;">
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: ${item.value}%; background: linear-gradient(0deg, var(--brand-cyan), #00b3cc); transition: height 1s var(--ease-bounce);"></div>
                    </div>
                    <span style="font-size: var(--fs-xs); color: var(--text-secondary); text-align: center;">${item.label}</span>
                </div>
            `;
        });

        chartHTML += `</div>`;
        this.chartContainer.innerHTML = chartHTML;

        const bars = this.chartContainer.querySelectorAll('div > div > div');
        bars.forEach(bar => {
            const finalHeight = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => { bar.style.height = finalHeight; }, 50);
        });
    }

    renderMatchesList(matches) {
        let listHTML = '';
        matches.forEach(match => {
            listHTML += `
                <div class="match-item">
                    <div class="match-info">
                        <h4>${match.model}</h4>
                        <p>${match.profile}</p>
                    </div>
                    <div class="match-price">${match.price}</div>
                </div>
            `;
        });
        this.matchesContainer.innerHTML = listHTML;
    }

    setLoadingState() {
        this.apiBadge.textContent = "Atualizando...";
        this.apiBadge.className = "badge"; 

        const skeletonHtmlText = '<div class="skeleton skeleton-title" style="width: 50%;"></div><div class="skeleton skeleton-text" style="width: 80%;"></div>';
        
        this.latencyContainer.innerHTML = skeletonHtmlText;
        this.devicesContainer.innerHTML = skeletonHtmlText;
        this.budgetContainer.innerHTML = skeletonHtmlText;
        
        this.chartContainer.innerHTML = '<div class="skeleton skeleton-block chart-skeleton" style="height: 300px; border-radius: var(--radius-sm);"></div>';
        
        this.matchesContainer.innerHTML = `
            <div class="skeleton skeleton-text" style="height: 3rem; margin-bottom: 1rem;"></div>
            <div class="skeleton skeleton-text" style="height: 3rem; margin-bottom: 1rem;"></div>
            <div class="skeleton skeleton-text" style="height: 3rem;"></div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('api-status-badge')) {
        window.DashboardUI = new DashboardEngine();
        console.log('%c[Descomplica Celular] Dashboard Seguro Iniciado', 'color: #00FA9A; font-weight: bold;');
    }
});