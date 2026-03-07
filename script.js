const form = document.getElementById('form-assistente');
const areaResultados = document.querySelector('.area-resultados');
const valorInput = document.getElementById('valor');
const bubble = document.getElementById('valor-bubble');

const setBubble = () => {
    const val = valorInput.value;
    const min = valorInput.min ? valorInput.min : 1000;
    const max = valorInput.max ? valorInput.max : 6000;
    const percent = Number(((val - min) * 100) / (max - min));
    
    bubble.innerHTML = Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
    bubble.style.left = `calc(${percent}% + (${15 - percent * 0.3}px))`;
};

valorInput.addEventListener('input', setBubble);
setBubble(); 

const init3DEffect = () => {
    const card = document.querySelector('.card-produto');
    if(!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        
        const xRotation = ((y - rect.height / 2) / rect.height) * -15; 
        const yRotation = ((x - rect.width / 2) / rect.width) * 15;
        
        card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.boxShadow = `0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0, 229, 255, 0.2)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.boxShadow = `0 24px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)`;
    });
};

const fetchRecomendacao = async (foco, orcamento) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const db = {
                'camera': { nome: "Samsung Galaxy S23 FE", desc: "Processamento neural de imagem para fotos noturnas cinematográficas.", selo: "📷 Câmera Profissional", preco: "R$ 2.499,00" },
                'jogos': { nome: "POCO X6 Pro", desc: "Chipset de arquitetura 4nm e câmara de vapor. Taxa de quadros máxima sem thermal throttling.", selo: "🎮 Alta Performance", preco: "R$ 1.899,00" },
                'bateria': { nome: "Galaxy M54 5G", desc: "Célula de energia de 6000mAh. Esqueça o carregador por 48 horas de uso contínuo.", selo: "🔋 Autonomia Extrema", preco: "R$ 1.599,00" }
            };
            resolve(db[foco]);
        }, 1800); 
    });
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const orcamento = valorInput.value;
    const focoSelecionado = document.querySelector('input[name="foco"]:checked').value;

    areaResultados.style.display = 'block'; // Garante que a seção apareça
    areaResultados.innerHTML = `
        <h2 style="color: var(--text-secondary); font-size: 24px; margin-bottom: 20px;">Analisando matriz de hardwares...</h2>
        <article class="card-produto" style="transform: none;">
            <div class="skeleton-box skeleton-title"></div>
            <div class="skeleton-box skeleton-desc"></div>
            <div class="skeleton-box skeleton-price"></div>
        </article>
    `;
    areaResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const celular = await fetchRecomendacao(focoSelecionado, orcamento);

    areaResultados.innerHTML = `
        <h2 class="stagger-item" style="transition-delay: 0.1s; color: var(--brand-cyan); font-size: 28px; margin-bottom: 20px;">🏆 Match de Alta Precisão</h2>
        <p class="stagger-item" style="transition-delay: 0.2s; color: var(--text-secondary); margin-bottom: 30px;">Alinhamos seu investimento de <strong>R$ ${Number(orcamento).toLocaleString('pt-BR')}</strong> à sua prioridade sistêmica:</p>
        
        <article class="card-produto stagger-item" style="transition-delay: 0.3s; transition-duration: 0.8s;">
            <div class="card-info">
                <h3 class="stagger-item" style="transition-delay: 0.4s;">${celular.nome}</h3>
                <p class="stagger-item" style="transition-delay: 0.5s; color: var(--text-secondary);">${celular.desc}</p>
                
                <div class="area-selos stagger-item" style="transition-delay: 0.6s;">
                    <span class="selo">${celular.selo}</span>
                    <span class="selo bateria">✓ Otimizado</span>
                </div>
                
                <div class="preco stagger-item" style="transition-delay: 0.7s;">${celular.preco}</div>
                
                <div class="stagger-item" style="transition-delay: 0.8s;">
                    <button class="btn-principal" style="width: max-content; padding: 12px 32px;">Adquirir Tecnologia</button>
                </div>
            </div>
        </article>
    `;

    setTimeout(() => {
        document.querySelectorAll('.stagger-item').forEach(item => item.classList.add('visible'));
        init3DEffect(); 
    }, 50);
});