import { CatalogRepository } from './services/catalog-repository.js';
import { renderAdminDashboard, renderAdminTable, renderAccessControl } from './ui/admin-render.js';
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';
import { getUserProfile, getUserByEmailForAdmin, changeUserRole, getAllAdmins } from './services/firebase-service.js';
import { showToast } from './ui/toast.js';

class AdminController {
  constructor() {
    this.currentView = 'dashboard';
    this.devices = [];
    this.userProfile = null;
    
    // Cache DOM Elements
    this.contentEl = document.getElementById('admin-content');
    this.titleEl = document.getElementById('admin-page-title');
    this.actionsEl = document.getElementById('admin-header-actions');
    this.modalEl = document.getElementById('product-modal');
    this.formEl = document.getElementById('product-form');
  }

  init() {
    // Route Guard: Previne renderização se não for autorizado
    document.body.style.display = 'none';
    
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.replace('login.html?redirect=admin.html');
        return;
      }
      
      this.userProfile = await getUserProfile(user.uid);
      if (this.userProfile?.role !== 'admin' && this.userProfile?.role !== 'superadmin') {
        showToast({ tone: 'error', title: 'Acesso Restrito', message: 'Apenas administradores podem acessar esta área.' });
        setTimeout(() => { window.location.replace('dashboard.html'); }, 1500);
        return;
      }
      
      // Acesso Concedido
      document.body.style.display = 'flex';
      
      showToast({ tone: 'success', title: 'Sistema conectado', message: 'Painel sincronizado com Firestore.', duration: 2800 });
      
      this.setupSuperAdminFeatures();
      
      await CatalogRepository.init();
      this.bindNav();
      this.bindModal();
      this.bindForm();
      await this.loadDataAndRender();
      
      // Boot do Inbox System
      await this.initInbox();
    });
  }

  async loadDataAndRender() {
    this.devices = await CatalogRepository.getAll();
    // Ordena alfabeticamente pela marca para organizar visualmente
    this.devices.sort((a, b) => a.brand.localeCompare(b.brand)); 
    this.renderView();
  }

  bindNav() {
    document.querySelectorAll('.admin-nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentView = e.target.dataset.view;
        this.renderView();
      });
    });
  }

  setupSuperAdminFeatures() {
    if (this.userProfile.role !== 'superadmin') return;
    
    const nav = document.querySelector('.admin-nav');
    if (nav.querySelector('[data-view="access"]')) return; // Previne duplicação no refresh do token
    
    const accessBtn = document.createElement('button');
    accessBtn.className = 'admin-nav-item';
    accessBtn.dataset.view = 'access';
    accessBtn.innerHTML = '🛡️ Gestão de Acessos';
    nav.insertBefore(accessBtn, nav.querySelector('a'));

    const auditBtn = document.createElement('button');
    auditBtn.className = 'admin-nav-item';
    auditBtn.dataset.view = 'audit';
    auditBtn.innerHTML = '📋 Auditoria de Eventos';
    nav.insertBefore(auditBtn, nav.querySelector('a'));
  }

  renderView() {
    if (this.currentView === 'dashboard') {
      this.titleEl.textContent = 'Visão Geral';
      this.actionsEl.innerHTML = '';
      this.contentEl.innerHTML = renderAdminDashboard(this.devices);
    } else if (this.currentView === 'catalog') {
      this.titleEl.textContent = 'Gestão do Catálogo';
      this.actionsEl.innerHTML = `<button class="btn btn-primary" id="btn-new-product">Adicionar Produto</button>`;
      this.contentEl.innerHTML = renderAdminTable(this.devices);
      
      document.getElementById('btn-new-product').addEventListener('click', () => this.openModal());
      this.bindTableActions();
      this.bindSearch();
    } else if (this.currentView === 'access' && this.userProfile.role === 'superadmin') {
      this.titleEl.textContent = 'Gestão de Administradores';
      this.actionsEl.innerHTML = '';
      this.renderAccessView();
    } else if (this.currentView === 'audit' && this.userProfile.role === 'superadmin') {
      this.titleEl.textContent = 'Auditoria do Sistema';
      this.actionsEl.innerHTML = '';
      this.renderAuditView('all', true);
    }
  }
  
  async renderAuditView(filter = 'all', forceRefresh = false) {
    const { getAuditLogs } = await import('./services/firebase-service.js');
    const { renderAuditTable, renderAuditFilters } = await import('./ui/admin-render.js');
    
    // Armazena Logs Globais se vaciado
    if(!this.rawLogs || forceRefresh) this.rawLogs = await getAuditLogs();
    
    // Filtragem Local
    let filteredLogs = this.rawLogs;
    if (filter === 'Arquivados') {
       filteredLogs = this.rawLogs.filter(l => l.archived);
    } else {
       if (filter !== 'all') {
          filteredLogs = this.rawLogs.filter(l => l.category === filter && !l.archived);
       } else {
          filteredLogs = this.rawLogs.filter(l => !l.archived);
       }
    }
    this.logs = filteredLogs;
    
    this.contentEl.innerHTML = renderAuditFilters(filter) + renderAuditTable(this.logs);
    this.bindAuditActions();
  }

  bindAuditActions() {
    // Filtros adaptativos (botões na interface local recriada, então está seguro anexar toda vez)
    this.contentEl.querySelectorAll('[data-filter-audit]').forEach(btn => {
       btn.addEventListener('click', (e) => {
         this.renderAuditView(e.target.dataset.filterAudit);
       });
    });

    // Guard Clause para evitar Memory Leak (Multiplicadores de Eventos Globais)
    if (this.auditEventsBound) return;
    this.auditEventsBound = true;

    // Fechar dropdowns se clicar fora
    document.addEventListener('click', (e) => {
       if(!e.target.closest('[data-action="toggle-menu"]')) {
          document.querySelectorAll('.audit-dropdown-menu').forEach(menu => menu.style.display = 'none');
       }
    });

    this.contentEl.addEventListener('click', async (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      
      if (target.dataset.action === 'toggle-menu') {
         const index = target.dataset.index;
         document.querySelectorAll('.audit-dropdown-menu').forEach(m => m.style.display = 'none');
         document.getElementById(`audit-menu-${index}`).style.display = 'block';
      }
      
      if (target.dataset.action === 'open-note-modal') {
         const log = this.logs[target.dataset.index];
         this.openRichNoteModal(log.id);
      }
      
      if (target.dataset.action === 'view-log') {
         this.openAuditModal(this.logs[target.dataset.index]);
      }

      if (target.dataset.action === 'archive-log') {
         const log = this.logs[target.dataset.index];
         const { updateLogArchiveStatus } = await import('./services/firebase-service.js');
         try {
           const novoStatus = !log.archived;
           await updateLogArchiveStatus(log.id, novoStatus);
           showToast({ tone: 'success', message: novoStatus ? 'Registro Arquivado com sucesso.' : 'Registro restaurado.' });
           
           const rawLog = this.rawLogs.find(l => l.id === log.id);
           if (rawLog) rawLog.archived = novoStatus; // Sync UI memory
           const activeFilter = document.querySelector('.audit-filters-scroll .btn-primary')?.dataset.filterAudit || 'all';
           this.renderAuditView(activeFilter);
         } catch(err) { showToast({ tone: 'error', message: 'Erro de permissão no Firestore.' }); }
      }

      if (target.dataset.action === 'read-comments') {
         const log = this.logs[target.dataset.index];
         const commentsHtml = log.comments.map(c => `
           <div style="margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-soft);">
             <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem;">
               <strong style="font-size: 0.8rem; color: var(--brand-primary);">${c.author}</strong>
               <span style="font-size: 0.7rem; color: var(--text-muted);">${new Date(c.date).toLocaleString('pt-BR')}</span>
             </div>
             <p style="margin: 0; font-size: 0.9rem; color: var(--text-primary);">${c.text}</p>
           </div>
         `).join('');
         
         // Reaproveitando o modal da auditoria, trocando o conteudo principal
         document.getElementById('audit-modal-content').innerHTML = `
           <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 8px; max-height: 500px; overflow: auto; border: 1px solid var(--border-soft);">
              <h4 style="color: var(--text-primary); margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-soft); padding-bottom:0.5rem;">Histórico de Anotações</h4>
              ${commentsHtml}
           </div>
         `;
         document.getElementById('audit-modal').setAttribute('aria-hidden', 'false');
      }

      if (target.dataset.action === 'comment-log') {
         const text = prompt('Anotação restrita para este evento:');
         if (text && text.trim()) {
           const log = this.logs[target.dataset.index];
           const { addLogComment } = await import('./services/firebase-service.js');
           try {
             await addLogComment(log.id, text.trim());
             showToast({ tone: 'success', message: 'Comentário salvo em nuvem.' });
             
             const rawLog = this.rawLogs.find(l => l.id === log.id);
             if (rawLog) {
                if(!rawLog.comments) rawLog.comments = [];
                rawLog.comments.push({ text: text.trim(), author: "Admin" });
             }
             const activeFilter = document.querySelector('.audit-filters-scroll .btn-primary')?.dataset.filterAudit || 'all';
             this.renderAuditView(activeFilter);
           } catch(err) { showToast({ tone: 'error', message: 'Erro ao despachar comentário.' }); }
         }
      }

      if (target.dataset.action === 'undo-log') {
         const log = this.logs[target.dataset.index];
         if (!confirm('🔥 ATENÇÃO: Isso forçará os dados a voltarem exatamente como eram antes desta ação (Rollback Absoluto). Continuar?')) return;
         
         const { revertAdminAction } = await import('./services/firebase-service.js');
         try {
           await revertAdminAction(log);
           showToast({ tone: 'success', title: 'Rollback Executado', message: 'Operação de restauração concluída.' });
           this.rawLogs = null; // força flush na memória, refaz o call da rede
           const activeFilter = document.querySelector('.audit-filters-scroll .btn-primary')?.dataset.filterAudit || 'all';
           this.renderAuditView(activeFilter);
         } catch (err) {
           showToast({ tone: 'error', title: 'Falha no Rollback', message: err.message });
         }
      }
    });
  }

  openAuditModal(log) {
    const modal = document.getElementById('audit-modal');
    if(!modal) return;
    
    let beforeRender = {};
    let afterRender = {};
    const beforeData = log.before || {};
    const afterData = log.after || log.target || {};

    if (log.action === 'UPDATE_DEVICE' && Object.keys(beforeData).length > 0 && Object.keys(afterData).length > 0) {
      for (const key in afterData) {
        if (key === 'updatedAt' || key === 'createdAt') continue;
        
        if (typeof afterData[key] === 'object' && afterData[key] !== null && beforeData[key] && !Array.isArray(afterData[key])) {
          let nestedChanged = false;
          let tempBefore = {};
          let tempAfter = {};
          
          for (const k in afterData[key]) {
            if (afterData[key][k] !== beforeData[key][k]) {
              nestedChanged = true;
              tempBefore[k] = beforeData[key][k] !== undefined ? beforeData[key][k] : null;
              tempAfter[k] = afterData[key][k];
            }
          }
          if (nestedChanged) {
             beforeRender[key] = tempBefore;
             afterRender[key] = tempAfter;
          }
        } else {
          if (JSON.stringify(beforeData[key]) !== JSON.stringify(afterData[key])) {
             beforeRender[key] = beforeData[key] !== undefined ? beforeData[key] : null;
             afterRender[key] = afterData[key];
          }
        }
      }
      
      if (Object.keys(beforeRender).length === 0) {
         beforeRender = { info: "Salvo sem nenhuma alteração no conteúdo." };
         afterRender = { info: "Objeto idêntico ao estado anterior." };
      }
    } else {
      beforeRender = beforeData;
      afterRender = afterData;
    }

    const KEY_MAP = {
      price: 'Preço', model: 'Modelo', brand: 'Marca', segment: 'Segmento', featured: 'Destaque',
      summary: 'Resumo', active: 'Ativo', specs: 'Ficha Técnica', scores: 'Pontuações',
      screen: 'Tela', cameraMain: 'Câmera', storage: 'Armazenamento', memory: 'Memória',
      battery: 'Bateria', chipset: 'Processador', longevity: 'Longevidade', durability: 'Durabilidade',
      performance: 'Desempenho', display: 'Tela (Nota)', camera: 'Câmera (Nota)', costBenefit: 'Custo Benefício'
    };

    const formatAuditData = (data) => {
      if (!data || Object.keys(data).length === 0) return '<p style="color: var(--text-muted); font-style: italic; font-size: 0.8rem; margin: 0;">Nenhum registro correspondente.</p>';
      if (data.info) return `<p style="color: var(--text-muted); font-size: 0.8rem; margin: 0;">${data.info}</p>`;

      let html = '<ul style="list-style: none; padding: 0; margin: 0; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.5rem;">';
      for (const [key, value] of Object.entries(data)) {
        const label = KEY_MAP[key] || key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          html += `<li style="background: rgba(255,255,255,0.02); padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-soft);">
            <strong style="color: var(--text-primary); display: block; margin-bottom: 0.4rem; font-size: 0.75rem; text-transform: uppercase;">${label}</strong>
            <ul style="list-style: none; padding-left: 0.5rem; margin: 0; display: flex; flex-direction: column; gap: 0.2rem; border-left: 2px solid var(--border-soft);">`;
          for (const [subKey, subVal] of Object.entries(value)) {
            const subLabel = KEY_MAP[subKey] || subKey;
            html += `<li><span style="color: var(--text-muted);">${subLabel}:</span> <span style="color: var(--text-primary); font-weight: 500;">${subVal}</span></li>`;
          }
          html += `</ul></li>`;
        } else {
          let displayValue = value;
          if (typeof value === 'boolean') displayValue = value ? 'Sim' : 'Não';
          if (Array.isArray(value)) displayValue = value.join(', ');
          html += `<li style="background: rgba(255,255,255,0.02); padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-soft);">
            <span style="color: var(--text-muted);">${label}:</span> <span style="color: var(--text-primary); font-weight: 500;">${displayValue}</span>
          </li>`;
        }
      }
      return html + '</ul>';
    };

    const beforeStr = formatAuditData(beforeRender);
    const afterStr = formatAuditData(afterRender);
    
    let modalContentHtml = '';

    if (log.action === 'CREATE_DEVICE') {
      modalContentHtml = `
        <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 8px; max-height: 500px; overflow: auto; border: 1px solid var(--border-soft); margin: 1rem auto; max-width: 600px;">
           <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; justify-content: center;">
             <span style="background: var(--green-400); color: black; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.7rem; text-transform: uppercase;">✨ Novo Produto Adicionado</span>
           </div>
           ${afterStr}
        </div>
      `;
    } else if (log.action === 'DELETE_DEVICE') {
      modalContentHtml = `
        <div style="background: var(--bg-card); padding: 1.5rem; border-radius: 8px; max-height: 500px; overflow: auto; border: 1px solid var(--border-soft); margin: 1rem auto; max-width: 600px;">
           <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; justify-content: center;">
             <span style="background: var(--red-400); color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.7rem; text-transform: uppercase;">🗑️ Produto Excluído</span>
           </div>
           ${beforeStr}
        </div>
      `;
    } else {
      modalContentHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
          <div>
             <h4 style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.5rem; text-transform: uppercase;">Estado Anterior</h4>
             <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; max-height: 400px; overflow: auto; border: 1px solid var(--border-soft); margin: 0;">${beforeStr}</div>
          </div>
          <div>
             <h4 style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.5rem; text-transform: uppercase;">Estado Atual / Novo</h4>
             <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; max-height: 400px; overflow: auto; border: 1px solid var(--border-soft); margin: 0;">${afterStr}</div>
          </div>
        </div>
      `;
    }

    document.getElementById('audit-modal-content').innerHTML = modalContentHtml;
    modal.setAttribute('aria-hidden', 'false');
  }
  
  async renderAccessView() {
    const admins = await getAllAdmins();
    this.contentEl.innerHTML = renderAccessControl(admins);
    
    // Bind Gestão de Acessos
    document.getElementById('form-add-admin').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email-input').value;
      const targetUser = await getUserByEmailForAdmin(email);
      
      if (!targetUser) {
        showToast({ tone: 'error', title: 'Erro', message: 'Usuário não encontrado. Crie uma conta comum primeiro.' });
        return;
      }
      
      await changeUserRole(targetUser.id, email, 'admin');
      showToast({ tone: 'success', title: 'Sucesso', message: `Permissão concedida para ${email}` });
      this.renderAccessView();
    });
    
    this.contentEl.querySelectorAll('.btn-revoke-admin').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if(confirm('Revogar acesso administrativo desta conta?')) {
          await changeUserRole(e.target.dataset.id, e.target.dataset.email, 'user');
          showToast({ tone: 'success', message: 'O acesso do usuário foi revogado.' });
          this.renderAccessView();
        }
      });
    });
  }

  bindTableActions() {
    // Guard Clause para evitar Memory Leak de Eventos Globais do Catálogo
    if (this.tableEventsBound) return;
    this.tableEventsBound = true;
    
    this.contentEl.addEventListener('click', async (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      
      if (target.dataset.action === 'edit') {
        const device = await CatalogRepository.getById(target.dataset.id);
        this.openModal(device);
      } else if (target.dataset.action === 'delete') {
        if (confirm('Atenção: Excluir este produto vai removê-lo instantaneamente da loja pública. Tem certeza?')) {
          await CatalogRepository.delete(target.dataset.id);
          showToast({ tone: 'success', message: 'Produto excluído da loja.' });
          await this.loadDataAndRender();
        }
      }
    });
  }

  bindSearch() {
    const searchInput = document.getElementById('admin-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = this.devices.filter(d => 
          d.model.toLowerCase().includes(term) || d.brand.toLowerCase().includes(term)
        );
        const tbody = document.getElementById('admin-table-body');
        if(tbody) {
           // Atualiza apenas a tabela mantendo o HTML base da listagem
           const tempHtml = renderAdminTable(filtered);
           const tempDiv = document.createElement('div');
           tempDiv.innerHTML = tempHtml;
           tbody.innerHTML = tempDiv.querySelector('tbody')?.innerHTML || '<tr><td colspan="5" class="text-center text-muted">Nenhum resultado</td></tr>';
        }
      });
    }
  }

  bindModal() {
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = e.target.closest('.admin-modal');
        if (modal) modal.setAttribute('aria-hidden', 'true');
      });
    });
  }

  openModal(device = null) {
    document.getElementById('modal-title').textContent = device ? 'Editar Aparelho' : 'Novo Aparelho';
    this.formEl.reset();

    // Limpeza forçada de campos hidden, pois form.reset() ignora hiddens nativamente
    if (this.formEl.elements['id']) this.formEl.elements['id'].value = '';
    if (this.formEl.elements['slug']) this.formEl.elements['slug'].value = '';

    if (device) {
      // Preenchimento de Form (Serialização Flat -> Objeto)
      this.formEl.elements['id'].value = device.id;
      this.formEl.elements['slug'].value = device.slug;
      
      // Basic info
      ['brand', 'model', 'price', 'segment', 'image', 'summary', 'badge'].forEach(field => {
        if(this.formEl.elements[field]) this.formEl.elements[field].value = device[field] || '';
      });

      this.formEl.elements['active'].checked = device.active !== false;
      this.formEl.elements['featured'].checked = device.featured === true;
      
      this.formEl.elements['focusTags'].value = (device.focusTags || []).join(', ');
      this.formEl.elements['profileTags'].value = (device.profileTags || []).join(', ');
      
      // Nested objects
      for(let key in device.specs || {}) { if(this.formEl.elements[`specs.${key}`]) this.formEl.elements[`specs.${key}`].value = device.specs[key]; }
      for(let key in device.scores || {}) { if(this.formEl.elements[`scores.${key}`]) this.formEl.elements[`scores.${key}`].value = device.scores[key]; }
    }
    this.modalEl.setAttribute('aria-hidden', 'false');
  }

  bindForm() {
    this.formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(this.formEl);
      const data = Object.fromEntries(formData.entries());
      
      // Parse e reconstrução de objetos complexos (Specs, Scores, Arrays)
      const deviceData = { specs: {}, scores: {} };
      
      // Varre as keys do form para recriar a hierarquia de Specs e Scores limpando a raiz
      for(let [key, val] of Object.entries(data)) {
        if(key.startsWith('specs.')) {
          deviceData.specs[key.split('.')[1]] = val;
        } else if(key.startsWith('scores.')) {
          deviceData.scores[key.split('.')[1]] = Number(val);
        } else {
          deviceData[key] = val;
        }
      }

      deviceData.active = formData.has('active');
      deviceData.featured = formData.has('featured');
      deviceData.price = Number(data.price);
      
      const isNew = !data.id;
      deviceData.id = data.id || CatalogRepository.generateSlug(data.brand, data.model);
      deviceData.slug = data.slug || deviceData.id;
      
      deviceData.focusTags = data.focusTags.split(',').map(s=>s.trim()).filter(Boolean);
      deviceData.profileTags = data.profileTags.split(',').map(s=>s.trim()).filter(Boolean);
      
      try {
        await CatalogRepository.save(deviceData, isNew);
        showToast({ tone: 'success', title: 'Sucesso', message: 'Catálogo atualizado!' });
        this.modalEl.setAttribute('aria-hidden', 'true');
        await this.loadDataAndRender();
      } catch (err) {
        showToast({ tone: 'error', title: 'Erro', message: err.message });
      }
    });
  }

  // ====== INBOX & ANNOTATIONS SYSTEM ======
  async initInbox() {
    const { getInboxMessages, getOutboxMessages, getMyNotes, getTrashMessages, markMessageAsRead, sendAdminMessage, saveAdminNote, deleteAdminNote, trashAdminMessage } = await import('./services/message-service.js');
    this.msgService = { getInboxMessages, getOutboxMessages, getMyNotes, getTrashMessages, markMessageAsRead, sendAdminMessage, saveAdminNote, deleteAdminNote, trashAdminMessage };
    
    this.inboxModal = document.getElementById('inbox-modal');
    this.richNoteModal = document.getElementById('rich-note-modal');
    this.currentInboxTab = 'inbox'; // inbox, outbox, notes, trash
    
    // Abrir Centro de Notificações
    document.getElementById('btn-inbox-header').addEventListener('click', () => {
       this.currentInboxTab = 'inbox';
       document.querySelectorAll('.inbox-tab').forEach(b => b.classList.remove('active'));
       document.querySelector('[data-tab="inbox"]').classList.add('active');
       this.openInboxTabs();
    });
    // Fechar Modais
    document.querySelectorAll('[data-close-inbox]').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.inboxModal.setAttribute('aria-hidden', 'true');
    }));
    document.querySelectorAll('[data-close-note]').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      this.richNoteModal.setAttribute('aria-hidden', 'true');
    }));
    
    // Troca de Abas
    document.querySelectorAll('.inbox-tab').forEach(btn => {
       btn.addEventListener('click', (e) => {
          document.querySelectorAll('.inbox-tab').forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.currentInboxTab = e.currentTarget.dataset.tab;
          this.openInboxTabs();
       });
    });

    // Abrir Modal de Nova Anotação/Mensagem
    document.getElementById('btn-compose-global').addEventListener('click', () => {
       this.openRichNoteModal();
    });

    // Submissão do Formulário Rich Text
    document.getElementById('rich-note-form').addEventListener('submit', async (e) => {
       e.preventDefault();
       const type = document.getElementById('note-type').value;
       const subject = document.getElementById('note-subject').value;
       const body = document.getElementById('note-body').innerHTML;
       const refLogId = document.getElementById('note-ref-log').value || null;
       
       if(!body || body.trim() === '') return showToast({ tone: 'error', message: 'O corpo do texto não pode ser vazio.'});

       try {
         if (type === 'public') {
            const toEmail = document.getElementById('note-target-email').value;
            if(!toEmail) return showToast({ tone: 'error', message: 'E-mail alvo é obrigatório para mensagens transmissíveis.'});
            await this.msgService.sendAdminMessage(toEmail, subject, body);
            showToast({ tone: 'success', message: 'Mensagem corporativa enviada!' });
         } else {
            await this.msgService.saveAdminNote(subject, body, refLogId);
            showToast({ tone: 'success', message: 'Anotação particular salva em nuvem!' });
         }
         
         this.richNoteModal.setAttribute('aria-hidden', 'true');
         if(this.inboxModal.getAttribute('aria-hidden') === 'false') {
            this.openInboxTabs(); // refresh view automaticamente
         }
       } catch(err) {
         showToast({ tone: 'error', message: 'Falha ao processar operação: ' + err.message });
       }
    });

    // UX Híbrida de Ocultação
    document.getElementById('note-type').addEventListener('change', (e) => {
       const w = document.getElementById('note-target-wrapper');
       if (e.target.value === 'public') {
           w.style.display = 'grid';
           document.getElementById('note-target-email').required = true;
       } else {
           w.style.display = 'none';
           document.getElementById('note-target-email').required = false;
           document.getElementById('note-target-email').value = '';
       }
    });

    // Conexão nativa do Editor ExecCommand de Fonte Rica (WYSIWYG)
    const fontSelect = document.getElementById('rt-font');
    if (fontSelect) fontSelect.addEventListener('change', (e) => document.execCommand('fontName', false, e.target.value));
    
    const sizeSelect = document.getElementById('rt-size');
    if (sizeSelect) sizeSelect.addEventListener('change', (e) => document.execCommand('fontSize', false, e.target.value));
    
    const colorInput = document.getElementById('rt-color');
    if (colorInput) colorInput.addEventListener('input', (e) => document.execCommand('foreColor', false, e.target.value));

    // Polling a cada 40 segundos e carga inicial
    await this.refreshInboxBadge();
    setInterval(() => this.refreshInboxBadge(), 40000);
  }

  openRichNoteModal(refLogId = null) {
      document.getElementById('rich-note-form').reset();
      document.getElementById('note-body').innerHTML = '';
      document.getElementById('note-ref-log').value = refLogId || '';
      document.getElementById('note-target-wrapper').style.display = 'none';
      document.getElementById('note-target-email').required = false;
      this.richNoteModal.setAttribute('aria-hidden', 'false');
  }

  async openInboxTabs() {
    this.inboxModal.setAttribute('aria-hidden', 'false');
    const contentEl = document.getElementById('inbox-pane-content');
    const titleEl = document.getElementById('inbox-pane-title');
    
    contentEl.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Consultando arquitetura blindada...</p>';
    
    let msgs = [];
    if (this.currentInboxTab === 'inbox') {
        titleEl.innerHTML = '📥 Caixa de Entrada (Correio)';
        msgs = await this.msgService.getInboxMessages();
    } else if (this.currentInboxTab === 'outbox') {
        titleEl.innerHTML = '📤 Histórico Enviado';
        msgs = await this.msgService.getOutboxMessages();
    } else if (this.currentInboxTab === 'notes') {
        titleEl.innerHTML = '📝 Minhas Anotações Privadas';
        msgs = await this.msgService.getMyNotes();
    } else if (this.currentInboxTab === 'trash') {
        titleEl.innerHTML = '🗑️ Armazenamento Lixeira';
        msgs = await this.msgService.getTrashMessages();
    }
    
    if (msgs.length === 0) {
      contentEl.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-muted); opacity: 0.7;">
          <span style="font-size:3.5rem; margin-bottom:1rem; opacity:0.6;">📭</span>
          <p style="font-size:1.1rem; font-weight:500;">Diretório totalmente vazio.</p>
        </div>`;
      return;
    }
    
    let html = '<div style="display:flex; flex-direction:column; gap:0.9rem;">';
    for(const msg of msgs) {
       const isUnread = (this.currentInboxTab === 'inbox' && !msg.read);
       const dateStr = msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleString('pt-BR') : 'Sem data';
       let actorInfo = '';
       let actionBtn = '';
       
       if (this.currentInboxTab === 'inbox') {
           actorInfo = `Remetente: ${msg.from}`;
           actionBtn = `<button class="btn btn-ghost btn-sm btn-trash" data-id="${msg.id}" style="color:var(--red-400); padding: 0.2rem 0.6rem; background:rgba(255,100,100,0.1);" title="Mover para Lixeira">🗑️ Lixeira</button>`;
       } else if (this.currentInboxTab === 'outbox') {
           actorInfo = `Destinatário Fim: ${msg.to}`;
       } else if (this.currentInboxTab === 'notes') {
           actorInfo = `Log Enriquecido: Anotação Segura`;
           actionBtn = `<button class="btn btn-ghost btn-sm btn-del-note" data-id="${msg.id}" style="color:var(--red-400); padding: 0.2rem 0.6rem; background:rgba(255,100,100,0.1);" title="Excluir Definitivo">Deletar</button>`;
       } else if (this.currentInboxTab === 'trash') {
           actorInfo = `Flag Descartado (${msg.from === this.userProfile.email ? 'Enviada' : 'Recebida'})`;
       }

       // Sanitize Output - O texto base nativamente armazena codificação HTML via Rich Text Div
       html += `
         <div data-msg-id="${msg.id}" data-unread="${isUnread}" class="inbox-msg-card ${this.currentInboxTab === 'inbox' && isUnread ? 'pulse-unread' : ''}" style="padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-soft); background: ${isUnread ? 'var(--bg-card)' : 'var(--bg-card-elevated)'}; position: relative; transition: all 0.2s;">
            ${isUnread ? '<div style="position:absolute; top:1.2rem; right:1.2rem; width:12px; height:12px; background:var(--brand-primary); border-radius:50%; box-shadow: 0 0 10px var(--brand-primary);"></div>' : ''}
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.8rem; display:flex; justify-content:space-between; align-items:center;">
              <span style="color:var(--text-primary); font-weight:600; display:flex; align-items:center; gap:0.4rem; font-size: 0.85rem;">${actorInfo}</span> 
              <div style="display:flex; align-items:center; gap:0.8rem;">
                <span style="font-size:0.75rem; color:var(--text-muted); padding:3px 6px; border:1px solid var(--border-soft); border-radius:4px;">${dateStr}</span>
                ${actionBtn}
              </div>
            </div>
            ${msg.subject ? `<h4 style="margin: 0 0 0.8rem 0; font-size: 1.1rem; color:var(--text-primary); font-weight:600;">${msg.subject}</h4>` : ''}
            <div style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; word-wrap: break-word; background:var(--bg-main); padding: 1rem; border-radius:4px; border-left:3px solid var(--brand-primary);">${msg.text || msg.body}</div>
         </div>
       `;
    }
    html += '</div>';
    contentEl.innerHTML = html;
    
    // Bind mark-as-read
    if(this.currentInboxTab === 'inbox') {
        contentEl.querySelectorAll('.inbox-msg-card').forEach(card => {
           card.addEventListener('click', async (e) => {
              if(e.target.closest('.btn-trash')) return; // ignora clipe de exclusao
              if(card.dataset.unread === 'true') {
                 await this.msgService.markMessageAsRead(card.dataset.msgId);
                 card.dataset.unread = 'false';
                 card.style.background = 'var(--bg-card-elevated)';
                 const dot = card.querySelector('div[style*="border-radius:50%"]');
                 if(dot) dot.remove();
                 await this.refreshInboxBadge();
              }
           });
        });
    }

    // Bind Operações Locais do CRUD
    contentEl.querySelectorAll('.btn-trash').forEach(btn => btn.addEventListener('click', async (e) => {
        try {
            await this.msgService.trashAdminMessage(e.currentTarget.dataset.id);
            showToast({ tone: 'success', message: 'Correio ocultado para a Lixeira.' });
            this.openInboxTabs();
            this.refreshInboxBadge();
        } catch(err) { console.error(err); }
    }));
    
    contentEl.querySelectorAll('.btn-del-note').forEach(btn => btn.addEventListener('click', async (e) => {
        if(!confirm('Excluir esta Anotação Avançada definitivamente da rede neural?')) return;
        try {
            await this.msgService.deleteAdminNote(e.currentTarget.dataset.id);
            showToast({ tone: 'success', message: 'Anotação fragmentada e excluída.' });
            this.openInboxTabs(); 
        } catch(err) { console.error(err); }
    }));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminController().init();
});