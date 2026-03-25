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
      this.renderAuditView();
    }
  }
  
  async renderAuditView(filter = 'all') {
    const { getAuditLogs } = await import('./services/firebase-service.js');
    const { renderAuditTable, renderAuditFilters } = await import('./ui/admin-render.js');
    
    // Armazena Logs Globais se vaciado
    if(!this.rawLogs) this.rawLogs = await getAuditLogs();
    
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
    // Filtros adaptativos
    this.contentEl.querySelectorAll('[data-filter-audit]').forEach(btn => {
       btn.addEventListener('click', (e) => {
         this.renderAuditView(e.target.dataset.filterAudit);
       });
    });

    // Fechar dropdowns se clicar fora
    document.addEventListener('click', (e) => {
       if(!e.target.closest('[data-action="toggle-menu"]')) {
          document.querySelectorAll('.audit-dropdown-menu').forEach(menu => menu.style.display = 'none');
       }
    });

    this.contentEl.addEventListener('click', (e) => {
      const target = e.target;
      if (target.dataset.action === 'toggle-menu') {
         const index = target.dataset.index;
         document.querySelectorAll('.audit-dropdown-menu').forEach(m => m.style.display = 'none');
         document.getElementById(`audit-menu-${index}`).style.display = 'block';
      }
      
      if (target.dataset.action === 'view-log') {
         this.openAuditModal(this.logs[target.dataset.index]);
      }
      if (target.dataset.action === 'archive-log') {
         alert('Função arquivar em progresso...');
      }
      if (target.dataset.action === 'comment-log') {
         alert('Função comentar em progresso...');
      }
      if (target.dataset.action === 'undo-log') {
         alert('Função de rollback avançada em progresso...');
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
    this.contentEl.addEventListener('click', async (e) => {
      const target = e.target;
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
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminController().init();
});