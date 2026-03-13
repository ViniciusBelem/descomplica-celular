/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - MATCH ENGINE (CÉREBRO DO CONSULTOR)
   Projeto: Descomplica Celular
   Camada: Lógica de Negócio, Filtros Algorítmicos e Firestore (addDoc)
   ========================================================================== */

// 1. IMPORTAÇÕES DA NUVEM (FIREBASE FIRESTORE)
import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

class MatchEngine {
    constructor() {
        this.form = document.getElementById('form-consultor');
        this.orcamentoInput = document.getElementById('orcamento');
        this.resultadoContainer = document.getElementById('resultado-container');
        
        // Banco de Dados Embutido (Catálogo)
        this.database = [
            // --- CÂMERA ---
            { marca: "Samsung", modelo: "Galaxy A54", preco: 1799, foco: "camera", specs: ["50MP OIS", "Selfie 32MP", "Exynos 1380"], selo: "📷 Custo-Benefício" },
            { marca: "Samsung", modelo: "Galaxy S23 FE", preco: 2799, foco: "camera", specs: ["Nightography", "Zoom Óptico 3x", "Vídeo 8K"], selo: "📷 Câmera Profissional" },
            { marca: "Apple", modelo: "iPhone 13", preco: 3599, foco: "camera", specs: ["Modo Cinema", "HDR Inteligente", "A15 Bionic"], selo: "🍎 Ecossistema Apple" },
            { marca: "Apple", modelo: "iPhone 15 Pro", preco: 6800, foco: "camera", specs: ["Lente Titânio 48MP", "ProRAW", "Zoom 5x"], selo: "📷 Qualidade Extrema" },
            
            // --- PERFORMANCE / JOGOS ---
            { marca: "Poco", modelo: "X6 Pro", preco: 1950, foco: "performance", specs: ["Dimensity 8300 Ultra", "120Hz AMOLED", "Câmara de Vapor"], selo: "🎮 Monstro Custo-Benefício" },
            { marca: "Motorola", modelo: "Edge 40 Neo", preco: 2200, foco: "performance", specs: ["144Hz pOLED", "Dimensity 7030", "12GB RAM"], selo: "🚀 Fluidez Máxima" },
            { marca: "Asus", modelo: "ROG Phone 7", preco: 6500, foco: "performance", specs: ["Snapdragon 8 Gen 2", "165Hz", "Gatilhos Ultrassônicos"], selo: "👾 Hardcore Gamer" },

            // --- BATERIA ---
            { marca: "Motorola", modelo: "Moto G84", preco: 1399, foco: "bateria", specs: ["5000mAh", "Carregador 33W na caixa", "Snapdragon 695"], selo: "🔋 Autonomia Confiável" },
            { marca: "Samsung", modelo: "Galaxy M54", preco: 1599, foco: "bateria", specs: ["Gigante 6000mAh", "Super AMOLED Plus", "5G"], selo: "🔋 Bateria Extrema" },
            { marca: "Apple", modelo: "iPhone 15 Plus", preco: 5999, foco: "bateria", specs: ["Maior Bateria Apple", "Eficiência A16", "MagSafe"], selo: "🍎 Autonomia Premium" }
        ];

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.processarAnalise(e));
    }

    processarAnalise(e) {
        e.preventDefault();

        const orcamentoMax = parseInt(this.orcamentoInput.value);
        const focoSelecionado = document.querySelector('input[name="foco"]:checked').value;

        this.renderLoading();

        setTimeout(() => {
            const matchPerfeito = this.calcularAlgoritmo(orcamentoMax, focoSelecionado);
            this.renderResultado(matchPerfeito, orcamentoMax);

            // 2. A MÁGICA DA NUVEM: Envia para o Firestore se houver usuário logado
            if (matchPerfeito && auth.currentUser) {
                this.salvarMatchNaNuvem(matchPerfeito, focoSelecionado);
            }

        }, 1500);
    }

    /* --- 3. MOTOR DE ESCRITA NO FIRESTORE (addDoc) --- */
    async salvarMatchNaNuvem(aparelho, foco) {
        try {
            const docRef = await addDoc(collection(db, "historico_matches"), {
                uid: auth.currentUser.uid, 
                email: auth.currentUser.email,
                marca: aparelho.marca,
                modelo: aparelho.modelo,
                preco: aparelho.preco,
                perfil: foco,
                data_pesquisa: serverTimestamp() 
            });
            console.log("%c[Firestore] Match guardado na nuvem! ID: " + docRef.id, "color: #00FA9A; font-weight: bold;");
        } catch (error) {
            console.error("[Firestore] Erro grave ao guardar dados: ", error);
        }
    }

    /* --- O CÉREBRO MATEMÁTICO --- */
    calcularAlgoritmo(orcamento, foco) {
        let aparelhosNoFoco = this.database.filter(cel => cel.foco === foco);
        let aparelhosNoOrcamento = aparelhosNoFoco.filter(cel => cel.preco <= orcamento);
        if (aparelhosNoOrcamento.length === 0) return null;
        aparelhosNoOrcamento.sort((a, b) => b.preco - a.preco);
        return aparelhosNoOrcamento[0];
    }

    /* --- MOTORES DE RENDERIZAÇÃO VISUAL --- */
    renderLoading() {
        this.resultadoContainer.style.display = 'block';
        this.resultadoContainer.innerHTML = `
            <div class="glass-card" style="max-width: 700px; margin: 0 auto; text-align: center;">
                <h3 style="color: var(--text-secondary); margin-bottom: 2rem;">Cruzando matrizes de dados...</h3>
                <div class="skeleton skeleton-title" style="margin: 0 auto;"></div>
                <div class="skeleton skeleton-text" style="width: 80%; margin: 0 auto;"></div>
                <div class="skeleton skeleton-block" style="margin-top: 2rem;"></div>
            </div>
        `;
        this.resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    renderResultado(aparelho, orcamento) {
        if (!aparelho) {
            this.resultadoContainer.innerHTML = `
                <div class="glass-card" style="max-width: 700px; margin: 0 auto; border-top: 4px solid var(--brand-error); text-align: center;">
                    <div class="success-icon" style="background: rgba(255,51,51,0.1); color: var(--brand-error); border-color: rgba(255,51,51,0.3); margin: 0 auto 1.5rem auto;">!</div>
                    <h2 style="font-size: var(--fs-h3); margin-bottom: 1rem;">Nenhum Match Encontrado</h2>
                    <p class="text-secondary">Não encontramos nenhum aparelho focado na sua prioridade atual que custe até <strong>R$ ${orcamento.toLocaleString('pt-BR')}</strong>.</p>
                    <p style="margin-top: 1.5rem; color: var(--brand-cyan); font-weight: 600;">Dica de Arquitetura: Aumente o orçamento no painel acima ou altere a prioridade.</p>
                </div>
            `;
            return;
        }

        const economia = orcamento - aparelho.preco;
        const seloEconomia = economia > 0 ? `<span class="badge success" style="margin-left: 10px;">Economia de R$ ${economia}</span>` : '';
        const specsHtml = aparelho.specs.map(spec => `<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-secondary); border-color: var(--border-glass); font-weight: 500;">${spec}</span>`).join('');

        this.resultadoContainer.innerHTML = `
            <div class="glass-card reveal-on-scroll ativo" style="max-width: 800px; margin: 0 auto; border-top: 4px solid var(--brand-cyan);">
                <span class="badge" style="margin-bottom: 1.5rem;">${aparelho.selo}</span>
                <h2 style="font-size: var(--fs-h2); color: var(--text-primary); margin-bottom: 0.5rem;">
                    ${aparelho.marca} <span style="color: var(--brand-cyan);">${aparelho.modelo}</span>
                </h2>
                <p class="text-secondary mb-4" style="font-size: var(--fs-base);">O algoritmo determinou que este é o hardware mais poderoso disponível para a sua prioridade, respeitando o limite do seu capital.</p>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2.5rem;">
                    ${specsHtml}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-glass);">
                    <div>
                        <p class="text-muted" style="font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 1px;">Investimento Recomendado</p>
                        <div style="font-size: var(--fs-h1); font-weight: 900; color:var(--text-primary); line-height: 1;">
                            ${aparelho.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <div style="margin-top: 0.5rem;">${seloEconomia}</div>
                    </div>
                    <button class="btn-principal" style="width: auto; padding: 1rem 2.5rem;" onclick="alert('Funcionalidade de compra simulada com sucesso!')">
                        Adquirir Hardware
                    </button>
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.MatchSystem = new MatchEngine();
    console.log('%c[Descomplica Celular] Algoritmo de Match Ativado (Com Firebase)', 'color: #FF5A00; font-weight: bold;');
});