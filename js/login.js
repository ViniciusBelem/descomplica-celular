/* ==========================================================================
   ARQUITETURA PREMIUM v4.0 - LOGIN SERVICE (FIREBASE)
   Projeto: Descomplica Celular
   Camada: Autenticação de Usuários Existentes
   ========================================================================== */

// 1. importações do Firebase e da nossa configuração
import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

class LoginService {
    constructor() {
        this.form = document.getElementById('form-login');
        this.loadingState = document.getElementById('loading-state');
        this.successState = document.getElementById('success-state');
        this.btnSubmit = document.getElementById('btn-submit-login');

        this.fields = {
            email: { input: document.getElementById('email'), error: document.getElementById('error-email') },
            senha: { input: document.getElementById('senha'), error: document.getElementById('error-senha') }
        };

        if (this.form) {
            this.initListeners();
            this.checkAlreadyAuthenticated();
        }
    }

    initListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        Object.values(this.fields).forEach(field => {
            field.input.addEventListener('input', () => this.clearError(field));
        });
    }

    checkAlreadyAuthenticated() {
        const name = sessionStorage.getItem('descomplica_user');
        if (name) {
            // Usuário já logado, manda direto ao dashboard
            window.location.href = 'dashboard.html';
        }
    }

    /* --- simples validação de interface --- */
    validateForm() {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(this.fields.email.input.value.trim())) {
            this.showError(this.fields.email, "Insira um e-mail válido.");
            isValid = false;
        }

        if (this.fields.senha.input.value.length < 6) {
            // firebase exige ao menos 6 caracteres para login também
            this.showError(this.fields.senha, "A senha deve ter pelo menos 6 caracteres.");
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

    /* --- comunicação com o Firebase --- */
    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) return;

        const email = this.fields.email.input.value.trim();
        const senha = this.fields.senha.input.value;

        // UI
        this.btnSubmit.style.display = 'none';
        this.loadingState.style.display = 'flex';
        this.form.querySelectorAll('input').forEach(i => i.disabled = true);

        try {
            const cred = await signInWithEmailAndPassword(auth, email, senha);
            const user = cred.user;

            // grava o nome para mostrar no dashboard (fallback para e-mail)
            sessionStorage.setItem('descomplica_user', user.displayName || email);
            this.handleSuccess();
        } catch (error) {
            console.error('[Login API] Erro do Firebase:', error.code, error.message);
            this.loadingState.style.display = 'none';
            this.btnSubmit.style.display = 'flex';
            this.form.querySelectorAll('input').forEach(i => i.disabled = false);

            this.handleFirebaseError(error.code);
        }
    }

    handleFirebaseError(code) {
        switch (code) {
            case 'auth/wrong-password':
                this.showError(this.fields.senha, "Senha incorreta. Tente novamente.");
                break;
            case 'auth/user-not-found':
                this.showError(this.fields.email, "Nenhum usuário encontrado com este e-mail.");
                break;
            case 'auth/invalid-email':
                this.showError(this.fields.email, "Formato de e-mail inválido para o servidor.");
                break;
            case 'auth/network-request-failed':
                this.showError(this.fields.email, "Falha de rede. Verifique sua conexão.");
                break;
            default:
                this.showError(this.fields.email, "Erro de autenticação. Tente novamente mais tarde.");
        }
    }

    handleSuccess() {
        this.form.style.display = 'none';
        this.successState.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

// inicializa o módulo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.DescomplicaLogin = new LoginService();
    console.log('%c[Descomplica Celular] Login Service (Firebase) Conectado', 'color: #8A2BE2; font-weight: bold;');
});
