# GUIA PRÁTICO DE IMPLEMENTAÇÃO

## Passo a Passo para Corrigir o Projeto

### ⏱️ Tempo estimado: 15 minutos

---

## PASSO 1: Atualizar arquivo login.js

Arquivo: `js/login.js`

**Linhas 1-12:** Substitua as imports:

```javascript
import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';

import { qs, setText, setDisabled, getValue } from './utils/dom.js';
import { normalizeText, escapeHtml, sanitizeRedirectPath } from './utils/security.js';
import { validateLoginForm } from './utils/validators.js';
import {
  setSessionItem,
  getSessionItem,
  removeSessionItem
} from './utils/storage.js';
```

**Depois, delete as funções duplicadas (linhas 14-84):**
- ❌ `function normalizeText(value)` 
- ❌ `function escapeHtml(value)`
- ❌ `function getRedirectParam()`
- ❌ `function sanitizeRedirectPath(path, fallback)`
- ❌ `function getSafeRedirectPath()`
- ❌ `function persistRedirectFromQueryIfNeeded()`

Deixe apenas:
- ✅ `function getLoginElements()`
- ✅ `function setFeedback()`
- ✅ `function setFormLoading()`
- ✅ `function mapFirebaseAuthError()`
- ✅ `function buildPayload()`
- ✅ `async function handleLoginSubmit()`
- ✅ `function attachSubmitHandler()`
- ✅ `function redirectIfAlreadyAuthenticated()`
- ✅ `function bootstrapLogin()`

**Resultado esperado:** Arquivo reduzido de ~210 linhas para ~140 linhas.

---

## PASSO 2: Atualizar arquivo auth.js (Registro)

Arquivo: `js/auth.js`

**Linhas 1-15:** Substitua as imports:

```javascript
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';
import {
  doc,
  setDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';

import { qs, setText, setDisabled, getValue } from './utils/dom.js';
import { normalizeText, escapeHtml, sanitizeRedirectPath } from './utils/security.js';
import { validateRegisterForm } from './utils/validators.js';
import {
  setSessionItem,
  getSessionItem,
  removeSessionItem
} from './utils/storage.js';
```

**Delete as funções duplicadas:**
- ❌ `function escapeHtml(value)`
- ❌ `function normalizeText(value)`
- ❌ `function getRedirectParam()`
- ❌ `function sanitizeRedirectPath()`
- ❌ Outras funções utility

---

## PASSO 3: Atualizar arquivo global-auth.js

Arquivo: `js/global-auth.js`

**Linhas 1-10:** Substitua:

```javascript
import { auth } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';

import {
  qs,
  qsa,
  setText,
  hideElement,
  showElement
} from './utils/dom.js';

import { normalizeText, escapeHtml } from './utils/security.js';

import {
  getSessionItem,
  setSessionItem,
  removeSessionItem
} from './utils/storage.js';
```

**Delete estas funções (duplicadas):**
- ❌ `function escapeHtml(value)`
- ❌ `function normalizeText(value)`

Mantenha tudo mais.

---

## PASSO 4: Atualizar index.html

Arquivo: `index.html`

**Procure pelas tags `<script>` no final do arquivo (linhas ~390-395):**

Garantir que tem:
```html
  <script type="module" src="./js/global-auth.js"></script>
  <script type="module" src="./js/home-controller.js"></script>
</body>
</html>
```

✅ Já está correto? Ótimo! Não precisa mudar.

---

## PASSO 5: Atualizar dashboard.html

Arquivo: `dashboard.html`

**Encontre as tags `<script>` no final do arquivo (linhas ~196-199):**

**Substitua:**
```html
<!-- ANTES: -->
  <script type="module" src="./js/global-auth.js"></script>
  <script type="module" src="./js/dashboard-controller.js"></script>

<!-- DEPOIS: -->
  <script type="module" src="./js/global-auth.js"></script>
  <script type="module" src="./js/dashboard-controller.js"></script>
```

✅ Se está igual, não precisa mudar!

**Garantir proteção:** A página será protegida automaticamente pelo novo `dashboard-controller.js`. Se não autenticado, redirecionará para login.

---

## PASSO 6: Implementar dos novos arquivos

Você já tem estes arquivos criados:
- ✅ `js/services/firebase-service.js` 
- ✅ `js/utils/security.js`
- ✅ `js/home-controller-v2.js`
- ✅ `js/dashboard-controller-v2.js`

**Agora:**

1. Renomeie os controllers v2:
   ```bash
   # No Visual Studio Code ou terminal:
   # Deletar antigos
   rm js/home-controller.js
   rm js/dashboard-controller.js
   
   # Renomear v2
   mv js/home-controller-v2.js js/home-controller.js
   mv js/dashboard-controller-v2.js js/dashboard-controller.js
   ```

   **OU** (se não tiver acesso terminal):
   - Delete `js/home-controller.js`
   - Delete `js/dashboard-controller.js`
   - Renomeie `js/home-controller-v2.js` → `js/home-controller.js`
   - Renomeie `js/dashboard-controller-v2.js` → `js/dashboard-controller.js`

---

## PASSO 7: Testar tudo

### Teste 1: Home Page
1. Abra `http://localhost:PORT/index.html`
2. Verifique no console:
   ```
   [Home] Inicialização concluída
   ```
3. Preencha o formulário:
   - Orçamento: 2000
   - Perfil: Uso equilibrado
   - Prioridade: Equilíbrio geral
4. Clique "Encontrar meu celular ideal"
5. Deve aparecer recomendações

✅ **Passou?** Continue.

### Teste 2: Recomendação Salva
1. **Crie conta** se não tiver: `registro.html`
2. Volte para home e refaça recomendação
3. Abra Firebase Console → Firestore
4. Procure collection `recommendations`
5. Deve ter 1 documento novo

✅ **Apareceu documento?** Continue.

### Teste 3: Dashboard
1. Clique **Dashboard** (ou vá para `dashboard.html`)
2. Verifique:
   - ✅ Seu email aparece
   - ✅ Mostra "1 Análises registradas" (ou número que fez)
   - ✅ Mostra orçamento médio
   - ✅ Mostra gráfico de tendências

✅ **Tudo funcionando?** Sucesso!

### Teste 4: Redirecionamento Proteção
1. **Abra incógnita/privada**
2. Acesse `dashboard.html` direto
3. Deve redirecionar para `index.html?redirect=dashboard.html`

✅ **Redirecionou?** Proteção está ativa!

---

## PASSO 8: Configurar Firestore (Opcional mas Recomendado)

Se ainda não fez, crie as regras de segurança no Firebase:

**Firebase Console → Firestore → Regras**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Análises - apenas o proprietário pode ler/escrever
    match /recommendations/{document=**} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null && 
                       request.auth.uid == request.resource.data.userId;
    }
    
    // Perfis - apenas o proprietário pode ler/escrever
    match /userProfiles/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

Clique **Publicar**.

---

## ✅ CHECKLIST FINAL

Marque quando concluir:

- [ ] Atualizou `js/login.js` (removeu duplicatas)
- [ ] Atualizou `js/auth.js` (removeu duplicatas)
- [ ] Atualizou `js/global-auth.js` (removeu duplicatas)
- [ ] Verificou `index.html` (scripts corretos)
- [ ] 🆕 Criou `js/services/firebase-service.js`
- [ ] 🆕 Criou `js/utils/security.js`
- [ ] Renomeou controllers v2 para versão final
- [ ] Testou Home Page (recomendação funciona)
- [ ] Testou Recomendação Salva (aparece em Firestore)
- [ ] Testou Dashboard (mostra dados)
- [ ] Testou Proteção (redireciona se não autenticado)

---

## 🐛 Se algo não funcionar:

### "Erro: Cannot find module './utils/security.js'"
```
Solução: Garantir que security.js foi criado em js/utils/
```

### "Erro: Cannot find module './services/firebase-service.js'"
```
Solução: Garantir que firebase-service.js foi criado em js/services/
```

### "Nada aparece no Dashboard"
```
1. Abra console (F12)
2. Procure por erros
3. Verifique se está autenticado
4. Verifique se Firestore tem dados
5. Tente fazer uma nova recomendação
```

### "Documento não salva em Firestore"
```
1. Abra console
2. Procure por "[Home] Análise salva com sucesso"
3. Se não vir, pode ser que Firestore tenha rejeitado
4. Verificar regras de segurança do Firestore
```

---

## 📞 Próximos Passos

Após validar tudo funciona:

1. ✅ Commit das mudanças no Git
2. ✅ Deploy em staging
3. ✅ Teste com usuários reais
4. ✅ Deploy em produção

Recomendado: Fazer em outro document/conversa separada para deployment.

---

**Documento:** GUIA PRÁTICO
**Versão:** 1.0
**ultima atualização:** 19 de Março de 2026
