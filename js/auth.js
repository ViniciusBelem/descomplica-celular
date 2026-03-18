/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - AUTHENTICATION SERVICE (FIREBASE)
   Projeto: Descomplica Celular
   Camada: Criação de Usuários Reais no Banco de Dados
   ========================================================================== */

// 1. Importações do motor do Firebase e da nossa conexão
import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

class AuthService {
    constructor() {
        this.form = document.getElementById('form-registro');
        this.loadingState = document.getElementById('loading-state');
        this.successState = document.getElementById('success-state');
        this.btnSubmit = document.getElementById('btn-submit-registro');
        
        this.fields = {
            nome: { input: document.getElementById('nome'), error: document.getElementById('error-nome') },
            email: { input: document.getElementById('email'), error: document.getElementById('error-email') },
            senha: { input: document.getElementById('senha'), error: document.getElementById('error-senha') },
            confirma: { input: document.getElementById('senha-confirma'), error: document.getElementById('error-confirma') }
        };

        if (this.form) {
            this.initListeners();
        }
    }

    initListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        Object.values(this.fields).forEach(field => {
            field.input.addEventListener('input', () => this.clearError(field));
        });
    }

    /* --- VALIDAÇÃO DE INTERFACE (Mantida do modelo anterior) --- */
    validateForm() {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (this.fields.nome.input.value.trim().length < 3) {
            this.showError(this.fields.nome, "O nome deve ter pelo menos 3 caracteres.");
            isValid = false;
        }

        if (!emailRegex.test(this.fields.email.input.value.trim())) {
            this.showError(this.fields.email, "Insira um e-mail válido.");
            isValid = false;
        }

        if (this.fields.senha.input.value.length < 8) {
            this.showError(this.fields.senha, "A arquitetura exige no mínimo 8 caracteres.");
            isValid = false;
        }

        if (this.fields.senha.input.value !== this.fields.confirma.input.value) {
            this.showError(this.fields.confirma, "As credenciais de segurança não coincidem.");
            isValid = false;
        }

        return isValid;
    }

    showError(field, message) {
        field.error.textContent = message;
        field.input.closest('.input-group').classList.add('has-error');
        field.input.setAttribute('aria-invalid', 'true'); 
    }

    clearError(field) {
        field.error.textContent = "";
        field.input.closest('.input-group').classList.remove('has-error');
        field.input.removeAttribute('aria-invalid');
    }

    /* --- INTEGRAÇÃO COM FIREBASE (O Motor Real) --- */
    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) return;

        const nome = this.fields.nome.input.value.trim();
        const email = this.fields.email.input.value.trim();
        const senha = this.fields.senha.input.value;

        // UI State: Entra em modo de carregamento
        this.btnSubmit.style.display = 'none';
        this.loadingState.style.display = 'flex';
        this.form.querySelectorAll('input').forEach(input => input.disabled = true);

        try {
            // 1. Tenta criar o usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // 2. Atualiza o perfil do usuário recém-criado com o Nome dele
            await updateProfile(user, {
                displayName: nome
            });

            // 3. Sucesso! Mantém o nome no sessionStorage para o Dashboard ler imediatamente
            sessionStorage.setItem('descomplica_user', nome);
            
            this.handleSuccess();

        } catch (error) {
            // Se falhar, restaura a interface e trata o erro do Google
            console.error("[Auth API] Erro do Firebase: ", error.code, error.message);
            
            this.loadingState.style.display = 'none';
            this.btnSubmit.style.display = 'flex';
            this.form.querySelectorAll('input').forEach(input => input.disabled = false);

            this.handleFirebaseError(error.code);
        }
    }

    /* --- TRATAMENTO DE ERROS DO SERVIDOR --- */
    handleFirebaseError(errorCode) {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                this.showError(this.fields.email, "Esta credencial já está em uso por outro usuário.");
                break;
            case 'auth/invalid-email':
                this.showError(this.fields.email, "Formato de e-mail inválido para o servidor.");
                break;
            case 'auth/weak-password':
                this.showError(this.fields.senha, "A senha fornecida é muito fraca (mínimo exigido pelo Google: 6).");
                break;
            case 'auth/network-request-failed':
                this.showError(this.fields.email, "Falha de rede. Verifique sua conexão com a internet.");
                break;
            default:
                this.showError(this.fields.email, "Erro interno na autenticação. Tente novamente mais tarde.");
        }
    }

    /* --- TRANSIÇÃO DE ESTADO (Sucesso) --- */
    handleSuccess() {
        this.form.style.display = 'none';
        this.successState.style.display = 'block';

        // Redireciona o utilizador para o Dashboard após 2 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
}

// Inicializa o módulo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Instancia a classe e deixa disponível globalmente se necessário
    window.DescomplicaAuth = new AuthService();
    console.log('%c[Descomplica Celular] Auth Service (Firebase) Conectado', 'color: #8A2BE2; font-weight: bold;');
});
