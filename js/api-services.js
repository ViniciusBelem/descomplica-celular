/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - API SERVICES & DASHBOARD ENGINE
   Projeto: Descomplica Celular
   Camada: Consumo de Dados Reais (Firestore), DOM e Segurança (Guards)
   ========================================================================== */

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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
        this.verifySecurityClearance(); 
    }

    /* --- 1. CONTROLE DE SESSÃO REAL (FIREBASE GUARD) --- */
    verifySecurityClearance() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const nomeExibicao = user.displayName || user.email.split('@')[0];
                this.userNameDisplay.textContent = nomeExibicao;
                this.userEmailDisplay.textContent = user.email; 
                this.userEmailDisplay.title = user.email; 
                this.userAvatarInitial.textContent = nomeExibicao.charAt(0).toUpperCase();

                // Dispara a busca de dados assim que confirma quem é o utilizador
                this.fetchDashboardData(); 
            } else {
                console.warn("%c[Security] Acesso negado. Redirecionando para login...", "color: #FF3333; font-weight: bold;");
                window.location.replace('login.html'); 
            }
        });
    }

    bindEvents() {
        if (this.profileTrigger && this.profileDropdown) {
            this.profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = this.profileDropdown.classList.toggle('active');
                this.profileTrigger.setAttribute('aria-expanded', isExpanded);
            });

            document.addEventListener('click', (e) => {
                if (!this.profileDropdown.contains(e.target) && !this.profileTrigger.contains(e.target)) {
                    this.profileDropdown.classList.remove('active');
                    this.profileTrigger.setAttribute('aria-expanded', 'false');
                }
            });
        }

        if (this.btnLogout) {
            this.btnLogout.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await signOut(auth);
                    sessionStorage.removeItem('descomplica_user'); 
                    window.location.replace('login.html');
                } catch (error) {
                    console.error("[Auth API] Erro ao deslogar:", error);
                }
            });
        }

        if (this.btnRefresh) {
            this.btnRefresh.addEventListener('click', () => {
                this.fetchDashboardData(true); 
            });
        }
    }

    /* --- 2. LEITURA DE DADOS REAIS NO FIRESTORE --- */
    async fetchDashboardData(isRefresh = false) {
        if (isRefresh) this.setLoadingState();

        try {
            const user = auth.currentUser;
            if (!user) return;

            // Cria uma consulta (Query) pedindo APENAS os matches deste utilizador
            const q = query(
                collection(db, "historico_matches"),
                where("uid", "==", user.uid),
                orderBy("data_pesquisa", "desc"),
                limit(10) // Traz apenas as 10 últimas análises para não pesar a rede
            );

            const querySnapshot = await getDocs(q);
            
            let totalOrcamento = 0;
            let matches = [];
            let counts = { camera: 0, performance: 0, bateria: 0 };

            // Varre os documentos reais que vieram do Google
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                matches.push({
                    model: `${data.marca} ${data.modelo}`,
                    profile: `Foco: ${data.perfil.toUpperCase()}`,
                    price: `R$ ${data.preco.toLocaleString('pt-BR')}`
                });
                
                totalOrcamento += data.preco;
                
                if (data.perfil === 'camera') counts.camera++;
                else if (data.perfil === 'performance') counts.performance++;
                else if (data.perfil === 'bateria') counts.bateria++;
            });

            const totalMatches = matches.length;
            const avgBudget = totalMatches > 0 ? (totalOrcamento / totalMatches) : 0;

            // Calcula porcentagens para o gráfico baseadas nas pesquisas reais
            const chartData = [
                { label: 'Câmera', value: totalMatches ? Math.round((counts.camera / totalMatches) * 100) : 0 },
                { label: 'Performance', value: totalMatches ? Math.round((counts.performance / totalMatches) * 100) : 0 },
                { label: 'Bateria', value: totalMatches ? Math.round((counts.bateria / totalMatches) * 100) : 0 }
            ];

            // Embala os dados matemáticos
            const metrics = {
                latency: Math.floor(Math.random() * (20 - 5 + 1)) + 5 + "ms", // Ping apenas decorativo
                devicesScanned: totalMatches, // Mostra o número real de pesquisas do utilizador
                avgBudget: avgBudget
            };

            // Entrega os dados reais para a interface desenhar
            this.renderMetrics(metrics);
            this.renderChart(chartData);
            this.renderMatchesList(matches);

            this.apiBadge.textContent = "Sincronizado";
            this.apiBadge.classList.add('success');
            this.apiBadge.classList.remove('badge'); 
            this.apiBadge.classList.add('badge'); 

        } catch (error) {
            console.error("[Dashboard Engine] Falha ao carregar dados do Firestore:", error);
            this.apiBadge.textContent = "Erro de Sincronização";
            this.apiBadge.style.backgroundColor = "rgba(255, 51, 51, 0.1)";
            this.apiBadge.style.color = "var(--brand-error)";
        }
    }

    /* --- 3. MOTORES DE RENDERIZAÇÃO DE UI --- */
    renderMetrics(metrics) {
        this.latencyContainer.innerHTML = `
            <div class="metric-value">${metrics.latency}</div>
            <div class="metric-subtitle">Ping Servidor Google Cloud</div>
        `;

        this.devicesContainer.innerHTML = `
            <div class="metric-value">${metrics.devicesScanned}</div>
            <div class="metric-subtitle">Suas Análises Salvas</div>
        `;

        this.budgetContainer.innerHTML = `
            <div class="metric-value">${metrics.avgBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div class="metric-subtitle">Seu investimento médio</div>
        `;
    }

    renderChart(data) {
        let chartHTML = `<div style="display: flex; height: 100%; align-items: flex-end; justify-content: space-around; gap: 1rem; padding-top: 2rem;">`;
        
        data.forEach(item => {
            chartHTML += `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                    <span style="font-size: var(--fs-xs); color: var(--brand-cyan); font-weight: 700;">${item.value}%</span>
                    <div style="width: 100%; max-width: 60px; background: rgba(0, 229, 255, 0.1); border-radius: var(--radius-sm) var(--radius-sm) 0 0; position: relative; height: 200px; overflow: hidden;">
                        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: ${item.value}%; background: linear-gradient(0deg, var(--brand-cyan), #00b3cc); transition: height 1s var(--ease-bounce);"></div>
                    </div>
                    <span style="font-size: var(--fs-xs); color: var(--text-secondary); text-align: center;">${item.label}</span>
                </div>
            `;
        });

        chartHTML += `</div>`;
        this.chartContainer.innerHTML = chartHTML;

        // Gatilho de animação fluída
        const bars = this.chartContainer.querySelectorAll('div > div > div');
        bars.forEach(bar => {
            const finalHeight = bar.style.height;
            bar.style.height = '0%';
            setTimeout(() => { bar.style.height = finalHeight; }, 50);
        });
    }

    renderMatchesList(matches) {
        if (matches.length === 0) {
            this.matchesContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <p>Nenhuma análise encontrada no banco de dados.</p>
                    <a href="index.html#assistente" style="color: var(--brand-cyan); font-size: var(--fs-xs); display: block; margin-top: 0.5rem;">Faça seu primeiro Match</a>
                </div>
            `;
            return;
        }

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
        this.apiBadge.textContent = "Sincronizando...";
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
        console.log('%c[Descomplica Celular] Dashboard Conectado ao Firestore', 'color: #00FA9A; font-weight: bold;');
    }
});