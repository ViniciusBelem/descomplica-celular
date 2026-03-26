import { formatBRL } from '../utils/currency.js';
import { escapeHtml } from '../utils/security.js';

export function renderAdminDashboard(devices) {
  const total = devices.length;
  const active = devices.filter(d => d.active).length;
  const featured = devices.filter(d => d.featured).length;
  
  return `
    <!-- Top Hero Section -->
    <section class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div>
        <h2 class="text-5xl font-bold tracking-tighter text-primary mb-2">Platform Overview</h2>
        <p class="text-on-surface-variant max-w-lg">Monitorando a performance global e o fluxo de inventário em tempo real no servidor.</p>
      </div>
    </section>

    <!-- Bento Grid Stats -->
    <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="col-span-1 md:col-span-2 p-6 rounded-xl bg-surface-container-high shadow-xl space-y-4">
        <div class="flex justify-between items-start">
          <span class="text-secondary uppercase tracking-widest font-bold text-[10px]">Inventário Global</span>
          <span class="material-symbols-outlined text-secondary">inventory_2</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-bold tracking-tight text-on-surface">${total}</span>
          <span class="text-secondary text-xs font-bold">Aparelhos Cadastrados</span>
        </div>
        <div class="h-24 w-full bg-surface-container-low rounded-lg overflow-hidden flex items-end mt-4">
          <div class="w-full h-full opacity-40 bg-gradient-to-t from-secondary/20 to-transparent" style="clip-path: polygon(0 100%, 10% 80%, 20% 90%, 30% 60%, 40% 70%, 50% 40%, 60% 50%, 70% 20%, 80% 30%, 90% 10%, 100% 0, 100% 100%);"></div>
        </div>
      </div>
      
      <div class="p-6 rounded-xl bg-surface-container-high shadow-xl space-y-4">
        <span class="text-on-surface-variant uppercase tracking-widest font-bold text-[10px]">Aparelhos na Vitrine</span>
        <div class="text-4xl font-bold tracking-tight text-on-surface">${active}</div>
        <div class="mt-4 flex items-center justify-between text-xs text-on-surface-variant font-medium">
          <span>Visíveis para clientes</span>
          <span class="material-symbols-outlined text-sm text-primary">visibility</span>
        </div>
      </div>

      <div class="p-6 rounded-xl bg-surface-container-high shadow-xl flex flex-col justify-between">
        <div>
          <span class="text-on-surface-variant uppercase tracking-widest font-bold text-[10px]">Em Destaque (Badges)</span>
          <div class="text-4xl font-bold tracking-tight text-on-surface mt-4">${featured}</div>
          <div class="mt-4 flex items-center gap-4">
            <div class="flex-1 h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div class="h-full w-[82%] bg-primary"></div>
            </div>
            <span class="text-sm font-bold text-primary">Ranked</span>
          </div>
        </div>
        <p class="text-[10px] text-on-surface-variant leading-tight mt-6">Aparelhos selecionados para alta recomendação do algoritmo.</p>
      </div>
    </section>

    <!-- Bottom Content Grid -->
    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <!-- Activity Feed -->
      <div class="lg:col-span-1 space-y-6">
        <h3 class="text-sm font-black uppercase tracking-widest text-on-surface-variant/70 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">history</span>System Status
        </h3>
        <div class="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/20">
          <div class="relative">
            <div class="absolute -left-[19px] top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface"></div>
            <div class="space-y-1">
              <p class="text-xs font-bold text-on-surface">Servidor Firebase Ativo</p>
              <p class="text-[10px] text-on-surface-variant">Conectado ao Cloud Firestore e autenticado.</p>
              <span class="text-[9px] text-on-surface-variant/50 font-mono">Agorinha</span>
            </div>
          </div>
          <div class="relative">
            <div class="absolute -left-[19px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-surface"></div>
            <div class="space-y-1">
              <p class="text-xs font-bold text-on-surface">Algoritmo Motor Neural</p>
              <p class="text-[10px] text-on-surface-variant">Weights ajustados para perfil de consumo V3.0.</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Advisor Insights Graphic -->
      <div class="lg:col-span-2 rounded-xl overflow-hidden relative group min-h-[300px] flex flex-col justify-end p-8">
        <div class="absolute inset-0 z-0">
          <img class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7p8TYF7BaQXp0SSnz5P1XF6k9JSH8APQx0mjob74ve8yckt5C5W7V8ExYMCqRzxFR9LCBc95-IwiNtchNDzl8znZ58VOFY41k979ef7KfFA2crJhtY-E2yB41LdCDzPjkOh4ALf6zM56x7hlxa4w67UIEzNAa9CrsqWqE3yS4kpMDOZCNvhYTFW-efx5PfNPzOzsna-tszlg3iytWboY6Ao2ggLa2TXW0DCshpzzjdv7zrj0Q8xTr3r53n2xsxEN3kJIOXUui4hw"/>
          <div class="absolute inset-0 bg-gradient-to-t from-surface gap-4 via-surface/60 to-transparent"></div>
        </div>
        <div class="relative z-10 space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/50 backdrop-blur-md border border-primary/20">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-primary">Live Neural Map</span>
          </div>
          <h4 class="text-3xl font-bold tracking-tighter text-on-surface leading-tight">Advisor Neural Efficiency<br/>Reaches All-Time High</h4>
          <p class="text-on-surface-variant text-sm max-w-md">Our latest LLM integration has optimized the query layer for recommendations.</p>
        </div>
      </div>
    </section>
  `;
}

export function renderAdminTable(devices) {
  if (!devices.length) {
    return `<div class="p-10 text-center text-on-surface-variant font-medium bg-surface-container-high rounded-xl">Nenhum aparelho encontrado.</div>`;
  }

  const rows = devices.map(device => {
    const statusPill = device.active 
       ? \`<span class="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase border border-secondary/20">Ativo</span>\` 
       : \`<span class="px-2 py-1 rounded-full bg-error-container/20 text-error text-[10px] font-black uppercase border border-error/20">Inativo</span>\`;

    const featuredPill = device.featured 
       ? \`<span class="whitespace-nowrap px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase mt-1 inline-block border border-primary/20">⭐ \${escapeHtml(device.badge || 'Destaque')}</span>\` 
       : '';

    return \`
      <tr class="hover:bg-surface-container-high group transition-all duration-200">
        <td class="px-6 py-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-surface-variant overflow-hidden flex-shrink-0 flex items-center justify-center border border-outline-variant/10 shadow-lg p-1 bg-white">
              <img class="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" src="\${escapeHtml(device.image)}" alt="\${escapeHtml(device.model)}"/>
            </div>
            <div>
              <div class="text-sm font-bold text-on-surface tracking-tight">\${escapeHtml(device.brand)} \${escapeHtml(device.model)}</div>
              <div class="text-[10px] text-on-surface-variant font-medium">\${escapeHtml(device.segment.toUpperCase())}</div>
              \${featuredPill}
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          \${statusPill}
        </td>
        <td class="px-6 py-4 text-sm font-bold text-on-surface-variant">
          \${escapeHtml(formatBRL(device.price))}
        </td>
        <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
          <button class="px-3 py-1.5 rounded bg-surface-container-highest border border-outline-variant/10 hover:bg-surface-variant text-on-surface-variant text-xs font-bold transition-colors" data-action="edit" data-id="\${escapeHtml(device.id)}">Editar</button>
          <button class="px-3 py-1.5 rounded bg-error/10 hover:bg-error/20 text-error text-xs font-bold transition-colors" data-action="delete" data-id="\${escapeHtml(device.id)}">Excluir</button>
        </td>
      </tr>
    \`;
  }).join('');

  return `
    <section class="bg-surface-container-low rounded-xl shadow-2xl overflow-hidden border border-outline-variant/5">
      <div class="px-6 py-5 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-surface-container-low">
        <h3 class="text-lg font-bold tracking-tight text-on-surface">Base de Produtos</h3>
        <div class="flex items-center gap-3 bg-surface-container-highest/50 px-3 py-2 rounded-lg border border-outline-variant/20 focus-within:border-primary/50 transition-colors">
          <span class="material-symbols-outlined text-sm text-on-surface-variant/50">search</span>
          <input id="admin-search" class="bg-transparent border-none text-sm focus:ring-0 w-full lg:w-64 text-on-surface placeholder:text-on-surface-variant/40 outline-none" placeholder="Buscar aparelho ou marca..." type="text"/>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60 border-b border-outline-variant/5 bg-surface-container-lowest/30">
              <th class="px-6 py-4">Aparelho</th>
              <th class="px-6 py-4">Status da Loja</th>
              <th class="px-6 py-4">Preço (R$)</th>
              <th class="px-6 py-4 text-right">Ações de Gerenciamento</th>
            </tr>
          </thead>
          <tbody id="admin-table-body" class="divide-y divide-outline-variant/5">
            ${rows}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

export function renderAccessControl(admins) {
  const rows = admins.map(a => `
    <tr class="hover:bg-surface-container-high transition-colors border-b border-outline-variant/5">
      <td class="px-6 py-4 text-sm font-bold text-on-surface">${escapeHtml(a.nome)}</td>
      <td class="px-6 py-4 text-sm text-on-surface-variant">${escapeHtml(a.email)}</td>
      <td class="px-6 py-4"><span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">${escapeHtml(a.role)}</span></td>
      <td class="px-6 py-4 text-right">
        ${a.role === 'superadmin' ? '' : `<button class="px-3 py-1.5 rounded bg-error/10 hover:bg-error/20 text-error text-xs font-bold transition-colors btn-revoke-admin" data-id="${escapeHtml(a.id)}" data-email="${escapeHtml(a.email)}">Revogar Nível</button>`}
      </td>
    </tr>
  `).join('');

  return `
    <div class="p-6 bg-surface-container-high rounded-xl mb-8 border border-outline-variant/10 shadow-lg">
      <h3 class="text-lg font-bold tracking-tight text-on-surface mb-2">Conceder Permissão Administrativa</h3>
      <p class="text-xs text-on-surface-variant mb-6">Insira o e-mail exato do usuário. (O usuário já deve possuir cadastro padrão finalizado no banco de dados via Registro).</p>
      <form id="form-add-admin" class="flex flex-col sm:flex-row gap-4 max-w-2xl">
        <input type="email" id="admin-email-input" class="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-md py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none" placeholder="auditor@descomplica.com" required>
        <button type="submit" class="whitespace-nowrap px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">Validar Privilégio</button>
      </form>
    </div>
    
    <div class="bg-surface-container-low rounded-xl shadow-xl overflow-hidden border border-outline-variant/5">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-surface-container-lowest/50 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60 border-b border-outline-variant/5">
              <th class="px-6 py-4">Membro (Nome)</th>
              <th class="px-6 py-4">Identificador B2B</th>
              <th class="px-6 py-4">Privilégio</th>
              <th class="px-6 py-4 text-right">Controle de Credenciais</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

const ACTION_MAP = {
  'CREATE_DEVICE': { label: 'Inclusão de Produto', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  'UPDATE_DEVICE': { label: 'Atualização de Sistema', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  'DELETE_DEVICE': { label: 'Exclusão Crítica', color: 'text-error', bg: 'bg-error-container/20', border: 'border-error/20' },
  'GRANT_ADMIN': { label: 'Escalonamento Admin', color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/20' },
  'REVOKE_ADMIN': { label: 'Quebra de Privilégio', color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' }
};

export function renderAuditFilters(activeFilter = 'all') {
  const filters = [
    { id: 'all', label: 'Feed Completo' },
    { id: 'Catálogo', label: 'Manipulações de Catálogo' },
    { id: 'Exclusões', label: 'Monitor de Exclusões' },
    { id: 'Segurança', label: 'Tráfego de Segurança' },
    { id: 'Arquivados', label: 'Logs Arquivados (Frios)' }
  ];
  
  const buttons = filters.map(f => {
    const isActive = activeFilter === f.id;
    const baseClasses = "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm border whitespace-nowrap";
    const activeClasses = isActive ? "bg-primary text-on-primary border-transparent shadow-primary/20 scale-105" : "bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:bg-surface-variant hover:text-on-surface";
    return `<button class="${baseClasses} ${activeClasses}" data-filter-audit="${escapeHtml(f.id)}">${escapeHtml(f.label)}</button>`;
  }).join('');

  return `
    <div class="flex gap-3 overflow-x-auto pb-4 mb-6 custom-scrollbar">
      ${buttons}
    </div>
  `;
}

export function renderAuditTable(logs) {
  if (!logs.length) return `<div class="p-10 text-center text-on-surface-variant font-medium bg-surface-container-high rounded-xl">Sem logs registrados para este filtro.</div>`;
  
  const rows = logs.map((log, index) => {
    const date = log.createdAt?.toDate ? log.createdAt.toDate().toLocaleString('pt-BR') : 'Sem data';
    const actionConfig = ACTION_MAP[log.action] || { label: log.action, color: 'text-on-surface-variant', bg: 'bg-surface-variant', border: 'border-outline-variant/20' };
    const hasComments = log.comments && log.comments.length > 0;
    const targetDisplay = escapeHtml(log.target?.desc || log.target?.email || log.target?.id || 'Desconhecido');

    return `
      <tr class="hover:bg-surface-container-high transition-colors ${log.archived ? 'opacity-50 grayscale mt-blur' : ''} border-b border-outline-variant/5">
        <td class="px-6 py-4 relative">
           <div class="flex items-center gap-2">
             <span class="px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${actionConfig.bg} ${actionConfig.color} ${actionConfig.border}">${escapeHtml(actionConfig.label)}</span>
             ${hasComments ? '<div class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" title="Feedback / Anotação Anexa"></div>' : ''}
           </div>
        </td>
        <td class="px-6 py-4 text-xs font-bold text-on-surface">
          ${escapeHtml(log.actor?.email || 'System Daemon')}
        </td>
        <td class="px-6 py-4 text-xs font-medium text-on-surface-variant tracking-tight">${targetDisplay}</td>
        <td class="px-6 py-4 text-xs font-mono text-on-surface-variant/80">${escapeHtml(date)}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex justify-end items-center gap-2 relative">
             <button class="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors group" data-action="open-note-modal" data-index="${index}" title="Injétar Parecer / Note">
               <span class="material-symbols-outlined text-[1rem] group-hover:text-primary">edit_note</span>
             </button>
             <button class="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" data-action="toggle-menu" data-index="${index}">
               <span class="material-symbols-outlined text-sm">more_vert</span>
             </button>
             
             <!-- Dropdown escondido nativo via tailwind via JS absolute pos -->
             <div class="audit-dropdown-menu" id="audit-menu-${index}" style="display: none; position: absolute; right: 0; top:calc(100% + 5px); background: #2a2a2c; border: 1px solid rgba(144, 143, 160, 0.2); border-radius: 0.5rem; padding: 0.5rem 0; z-index: 50; min-width: 170px; text-align: left; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);">
                <button class="w-full px-4 py-2 text-left text-xs text-on-surface hover:bg-surface-variant transition-colors" data-action="view-log" data-index="${index}">🕵️ Analisar Diferenças</button>
                ${hasComments ? `<button class="w-full px-4 py-2 text-left text-xs text-secondary hover:bg-surface-variant transition-colors" data-action="read-comments" data-index="${index}">💬 Visualizar Feedbacks</button>` : ''}
                <button class="w-full px-4 py-2 text-left text-xs text-on-surface hover:bg-surface-variant transition-colors" data-action="archive-log" data-index="${index}">📦 ${log.archived ? 'Restaurar Log' : 'Arquivar Log'}</button>
                <div class="w-full h-px bg-outline-variant/10 my-1"></div>
                <button class="w-full px-4 py-2 text-left text-xs font-bold text-error hover:bg-error/10 transition-colors" data-action="undo-log" data-index="${index}">⚠️ Soft-Rollback</button>
             </div>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div class="bg-surface-container-low rounded-xl shadow-xl border border-outline-variant/5">
      <div class="overflow-x-auto" style="min-height: 250px;">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-surface-container-lowest/50 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60 border-b border-outline-variant/5">
              <th class="px-6 py-4">Gatilho / Evento</th>
              <th class="px-6 py-4">Responsável Operacional</th>
              <th class="px-6 py-4">Alvo Manipulado</th>
              <th class="px-6 py-4">Timestamp do Core</th>
              <th class="px-6 py-4 text-right">Administração</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/5">${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}