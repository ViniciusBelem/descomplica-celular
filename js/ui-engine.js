/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - UI ENGINE (Motor de Interface)
   Projeto: Descomplica Celular
   Camada: Interatividade Visual, Física 3D e Acessibilidade
   ========================================================================== */

// Utilitário de Performance: Throttle (Garante que eventos rápidos não travem a thread principal)

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

class UIEngine {
    constructor() {
        // Verifica se o utilizador prefere navegação sem animações (Acessibilidade)
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.initScrollReveal();
        this.initRangeSlider();
        this.initThemeManager();
        this.initModals();
        
        // Só inicializa física pesada se o utilizador permitir animações
        if (!this.prefersReducedMotion) {
            this.initCarousel3D();
            this.initTiltEffect();
        }
    }

    /* --- 1. MOTOR DE REVELAÇÃO AO ROLAR (SCROLL REVEAL) --- */
    initScrollReveal() {
        const elements = document.querySelectorAll('.reveal-on-scroll');
        if (!elements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px', // Dispara um pouco antes de aparecer totalmente
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona classe que aciona a transição no CSS
                    entry.target.classList.add('ativo');
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // Para de observar após revelar
                }
            });
        }, observerOptions);

        elements.forEach(el => {
            // Estado inicial invisível manipulado via JS para não quebrar SEO
            if(!this.prefersReducedMotion) {
                el.style.opacity = 0;
                el.style.transform = 'translateY(40px)';
                el.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
            }
            observer.observe(el);
        });
    }

    /* --- 2. SINCRONIZAÇÃO DO SLIDER DE ORÇAMENTO --- */
    initRangeSlider() {
        const slider = document.getElementById('orcamento');
        const bubble = document.getElementById('orcamento-output');
        
        if (!slider || !bubble) return;

        const updateBubble = () => {
            const val = Number(slider.value);
            const min = Number(slider.min) || 1000;
            const max = Number(slider.max) || 8000;
            
            // Calcula a percentagem exata para posicionar a bolha
            const percent = ((val - min) / (max - min)) * 100;
            
            // Formata para a moeda local
            bubble.textContent = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
            
            // Ajuste matemático fino para o centro do 'thumb' (botão)
            bubble.style.left = `calc(${percent}% + (${12 - percent * 0.24}px))`;
        };

        slider.addEventListener('input', updateBubble);
        updateBubble(); // Chamada inicial para posicionar corretamente
    }

    /* --- 3. MOTOR COVERFLOW 3D (CARROSSEL) --- */
    initCarousel3D() {
        const cards = document.querySelectorAll('.carousel-item');
        if (cards.length === 0) return;

        let currentIndex = 0;

        const updateCarousel = () => {
            cards.forEach((card, index) => {
                card.style.zIndex = 1;
                card.style.opacity = 0;
                
                // Lógica circular de posicionamento 3D
                if (index === currentIndex) {
                    // Carta Central (Ativa)
                    card.style.transform = 'translateX(0) scale(1) translateZ(0)';
                    card.style.opacity = 1;
                    card.style.zIndex = 10;
                    card.style.borderColor = 'var(--brand-cyan)';
                    card.style.boxShadow = 'var(--glow-cyan)';
                } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                    // Carta da Esquerda
                    card.style.transform = 'translateX(-70%) scale(0.8) translateZ(-150px)';
                    card.style.opacity = 0.4;
                    card.style.zIndex = 5;
                    card.style.borderColor = 'var(--border-glass)';
                    card.style.boxShadow = 'none';
                } else if (index === (currentIndex + 1) % cards.length) {
                    // Carta da Direita
                    card.style.transform = 'translateX(70%) scale(0.8) translateZ(-150px)';
                    card.style.opacity = 0.4;
                    card.style.zIndex = 5;
                    card.style.borderColor = 'var(--border-glass)';
                    card.style.boxShadow = 'none';
                } else {
                    // Cartas Ocultas no fundo
                    card.style.transform = 'translateX(0) scale(0.6) translateZ(-300px)';
                }
            });
        };

        updateCarousel();

        // Gira automaticamente a cada 3.5 segundos
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 3500);
    }

    /* --- 4. FÍSICA DE INCLINAÇÃO (TILT EFFECT) ACELERADA POR GPU --- */
    initTiltEffect() {
        const tiltCards = document.querySelectorAll('.glass-card.interactive');
        
        tiltCards.forEach(card => {
            const handleMouseMove = throttle((e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10; // Máx 10 graus
                const rotateY = ((x - centerX) / centerX) * 10;

                // Usa requestAnimationFrame para renderizar no próximo frame do monitor (60fps/120fps fluidos)
                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
            }, 1000 / 60); // Limita a 60 execuções por segundo

            const handleMouseLeave = () => {
                requestAnimationFrame(() => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                });
            };

            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    /* --- 5. GESTOR DE TEMA COM INTEGRAÇÃO FIRESTORE (À PROVA DE BALAS) --- */
    initThemeManager() {
        // 1. APLICAÇÃO OBRIGATÓRIA: Lê a memória e pinta a tela, independentemente de haver botão
        const localTheme = localStorage.getItem('descomplica_theme') || 'dark';
        if (localTheme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }

        // 2. Procura os botões na tela e acerta a posição deles (Sol ou Lua)
        const themeToggles = document.querySelectorAll('.theme-toggle-input');
        themeToggles.forEach(t => t.checked = (localTheme !== 'light'));

        // 3. SINCRONIZAÇÃO COM A NUVEM DO GOOGLE
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "user_preferences", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const cloudTheme = docSnap.data().theme;
                        if (cloudTheme && cloudTheme !== localTheme) {
                            if (cloudTheme === 'light') {
                                document.body.classList.add('light-theme');
                                themeToggles.forEach(t => t.checked = false);
                            } else {
                                document.body.classList.remove('light-theme');
                                themeToggles.forEach(t => t.checked = true);
                            }
                            localStorage.setItem('descomplica_theme', cloudTheme);
                        }
                    }
                } catch (error) {
                    console.error("[Tema] Falha ao ler nuvem:", error);
                }
            }
        });

        // 4. Se esta página específica não tiver o botão, paramos a função aqui em paz.
        if (themeToggles.length === 0) return;

        // 5. O QUE ACONTECE QUANDO O UTILIZADOR CLICA NO BOTÃO
        themeToggles.forEach(toggle => {
            toggle.addEventListener('change', async (e) => {
                const novoTema = e.target.checked ? 'dark' : 'light';
                
                if (novoTema === 'light') {
                    document.body.classList.add('light-theme');
                    themeToggles.forEach(t => t.checked = false);
                } else {
                    document.body.classList.remove('light-theme');
                    themeToggles.forEach(t => t.checked = true);
                }
                
                localStorage.setItem('descomplica_theme', novoTema);

                if (auth.currentUser) {
                    try {
                        const docRef = doc(db, "user_preferences", auth.currentUser.uid);
                        await setDoc(docRef, { theme: novoTema }, { merge: true });
                        console.log(`%c[Firestore] Preferência '${novoTema}' salva!`, 'color: #0CF2E7;');
                    } catch (error) {
                        console.error("[Tema] Erro ao gravar:", error);
                    }
                }
            });
        });
    

        // 3. GATILHO DE MUDANÇA (QUANDO O UTILIZADOR CLICA NO SWITCH)
        themeToggles.forEach(toggle => {
            toggle.addEventListener('change', async (e) => {
                // Se a caixa estiver marcada = dark (Lua). Desmarcada = light (Sol).
                const novoTema = e.target.checked ? 'dark' : 'light';
                
                // Aplica visualmente na hora
                this.aplicarTema(novoTema, themeToggles);

                // Grava na nuvem em background (se estiver logado)
                if (auth.currentUser) {
                    try {
                        const docRef = doc(db, "user_preferences", auth.currentUser.uid);
                        // O { merge: true } garante que não apaga outras configurações que possamos criar no futuro
                        await setDoc(docRef, { theme: novoTema }, { merge: true });
                        console.log(`%c[Firestore] Preferência '${novoTema}' guardada na nuvem!`, 'color: #0CF2E7; font-weight: bold;');
                    } catch (error) {
                        console.error("[Tema] Erro ao gravar na nuvem:", error);
                    }
                }
            });
        });
    }

    // Função auxiliar para mudar as cores e o estado do botão
    aplicarTema(tema, toggles) {
        if (tema === 'light') {
            document.body.classList.add('light-theme');
            toggles.forEach(t => t.checked = false); // Mostra o Sol
        } else {
            document.body.classList.remove('light-theme');
            toggles.forEach(t => t.checked = true);  // Mostra a Lua
        }
        // Guarda sempre no cache local como backup
        localStorage.setItem('descomplica_theme', tema);
    }

    /* --- 6. SISTEMA DE MODAIS DINÂMICOS --- */
    initModals() {
        // Encontra os links no menu de perfil
        const btnConfig = document.querySelectorAll('#btn-menu-config');
        const btnSecurity = document.querySelectorAll('#btn-menu-security');

        btnConfig.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.buildAndShowModal('⚙️ Configurações da Conta', `
                    <div class="input-group">
                        <label class="input-label">Alterar Nome de Exibição</label>
                        <input type="text" class="input-text" placeholder="Seu nome atual" disabled>
                    </div>
                    <div class="input-group">
                        <label class="input-label">Notificações por Email</label>
                        <select class="input-text">
                            <option>Receber relatórios semanais</option>
                            <option>Apenas alertas de segurança</option>
                            <option>Desativar tudo</option>
                        </select>
                    </div>
                    <button class="btn-principal" onclick="alert('Configurações atualizadas!')" style="padding: 0.75rem;">Salvar Preferências</button>
                `);
            });
        });

        btnSecurity.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.buildAndShowModal('🛡️ Segurança e Privacidade', `
                    <p class="text-secondary mb-4" style="font-size: 0.9rem;">Gerencie o tratamento dos seus dados de acordo com a LGPD e GDPR.</p>
                    <div style="background: rgba(255,51,51,0.05); border: 1px solid var(--brand-error); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.5rem;">
                        <h4 style="color: var(--brand-error); font-size: 0.9rem; margin-bottom: 0.5rem;">Zona de Perigo</h4>
                        <p class="text-secondary mb-2" style="font-size: 0.8rem;">Ao apagar o seu histórico, o algoritmo perderá as métricas de calibração do seu perfil.</p>
                        <button class="btn-secundario" style="color: var(--brand-error); border-color: var(--brand-error); width: 100%;" onclick="alert('Funcionalidade protegida por autenticação dupla na versão final.')">Apagar todo o Histórico</button>
                    </div>
                `);
            });
        });
    }

    // Fábrica de Modais Injetados
    buildAndShowModal(title, contentHTML) {
        // Se já houver um modal na tela, remove-o
        const existingModal = document.getElementById('dynamic-modal');
        if (existingModal) existingModal.remove();

        const modalHTML = `
            <div id="dynamic-modal" class="modal-overlay">
                <div class="glass-card modal-content-box">
                    <div class="modal-header">
                        <h3 style="font-size: var(--fs-h3); color: var(--text-primary); margin: 0;">${title}</h3>
                        <button class="btn-close-modal" aria-label="Fechar">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${contentHTML}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById('dynamic-modal');
        const closeBtn = modal.querySelector('.btn-close-modal');

        // Animação de entrada
        setTimeout(() => modal.classList.add('active'), 10);

        // Funções para fechar
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 400); // Espera a animação terminar para deletar do DOM
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(); // Fecha se clicar fora da caixa
        });
    }
}

// Inicializa a Engine assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.DescomplicaUI = new UIEngine();
    console.log('%c[Descomplica Celular] UI Engine Inicializada', 'color: #00E5FF; font-weight: bold;');
});