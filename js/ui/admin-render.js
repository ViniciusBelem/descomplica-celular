import { formatBRL } from '../utils/currency.js';
import { escapeHtml } from '../utils/security.js';

export function renderAdminDashboard(devices) {
  const total = devices.length;
  const active = devices.filter(d => d.active).length;
  const featured = devices.filter(d => d.featured).length;
  
  return `
    <div class="grid-3" style="margin-bottom: var(--space-8);">
      <div class="metric-card"><div class="metric-value">${total}</div><div class="metric-subtitle">Total de Aparelhos</div></div>
      <div class="metric-card"><div class="metric-value">${active}</div><div class="metric-subtitle">Aparelhos Ativos (Vitrine)</div></div>
      <div class="metric-card"><div class="metric-value">${featured}</div><div class="metric-subtitle">Em Destaque (Badges)</div></div>
    </div>
  `;
}

export function renderAdminTable(devices) {
  if (!devices.length) {
    return `<div class="feedback-box feedback-box--empty"><p class="text-center">Nenhum aparelho encontrado.</p></div>`;
  }

  const rows = devices.map(device => `
    <tr>
      <td style="width: 70px;"><img src="${escapeHtml(device.image)}" class="admin-table-img" alt="${escapeHtml(device.model)}"></td>
      <td>
        <strong style="color: var(--text-primary); font-size: 1.05rem;">${escapeHtml(device.brand)} ${escapeHtml(device.model)}</strong>
        <div style="color: var(--text-muted); font-size: var(--fs-xs); margin-top: 4px;">${escapeHtml(device.segment)}</div>
      </td>
      <td style="font-weight: 600; color: var(--text-primary);">${escapeHtml(formatBRL(device.price))}</td>
      <td>
        <div style="display: flex; gap: 8px;">
          ${device.active ? `<span class="badge" data-state="success">Ativo</span>` : `<span class="badge" data-state="error">Inativo</span>`}
          ${device.featured ? `<span class="badge" data-state="loading">${escapeHtml(device.badge || 'Destaque')}</span>` : ''}
        </div>
      </td>
      <td style="text-align: right;">
        <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${escapeHtml(device.id)}">Editar</button>
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${escapeHtml(device.id)}" style="margin-left: 8px;">Excluir</button>
      </td>
    </tr>
  `).join('');

  return `
    <div style="margin-bottom: 1.5rem; max-width: 400px;">
      <input type="text" id="admin-search" class="input" placeholder="Buscar modelo ou marca...">
    </div>
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Produto</th><th>Modelo</th><th>Preço</th><th>Status</th><th style="text-align: right;">Ações</th>
          </tr>
        </thead>
        <tbody id="admin-table-body">${rows}</tbody>
      </table>
    </div>
  `;
}

export function renderAccessControl(admins) {
  const rows = admins.map(a => `
    <tr>
      <td><strong>${escapeHtml(a.nome)}</strong></td>
      <td>${escapeHtml(a.email)}</td>
      <td><span class="badge" data-state="loading">${escapeHtml(a.role.toUpperCase())}</span></td>
      <td style="text-align: right;">
        ${a.role === 'superadmin' ? '' : `<button class="btn btn-danger btn-sm btn-revoke-admin" data-id="${escapeHtml(a.id)}" data-email="${escapeHtml(a.email)}">Revogar</button>`}
      </td>
    </tr>
  `).join('');

  return `
    <div class="feedback-box feedback-box--default" style="margin-bottom: var(--space-8);">
      <h3>Conceder Permissão</h3>
      <p style="margin-bottom: 1rem; font-size: var(--fs-sm); color: var(--text-muted);">O usuário já deve possuir cadastro na plataforma.</p>
      <form id="form-add-admin" style="display: flex; gap: 1rem; max-width: 500px;">
        <input type="email" id="admin-email-input" class="input" placeholder="e-mail do usuário" required style="flex: 1;">
        <button type="submit" class="btn btn-primary">Tornar Admin</button>
      </form>
    </div>
    
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr><th>Nome</th><th>E-mail</th><th>Nível</th><th style="text-align: right;">Ações</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

const ACTION_MAP = {
  'CREATE_DEVICE': { label: 'Adição de Produto', color: 'var(--green-400)' },
  'UPDATE_DEVICE': { label: 'Atualização de Produto', color: 'var(--brand-primary)' },
  'DELETE_DEVICE': { label: 'Exclusão de Produto', color: 'var(--red-400)' },
  'GRANT_ADMIN': { label: 'Concessão de Admin', color: 'var(--amber-400)' },
  'REVOKE_ADMIN': { label: 'Revogação de Admin', color: 'var(--red-400)' }
};

export function renderAuditFilters(activeFilter = 'all') {
  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'Catálogo', label: 'Catálogo' },
    { id: 'Exclusões', label: 'Exclusões' },
    { id: 'Segurança', label: 'Segurança' },
    { id: 'Arquivados', label: 'Arquivados' }
  ];
  
  const buttons = filters.map(f => 
    `<button class="btn btn-sm ${activeFilter === f.id ? 'btn-primary' : 'btn-ghost'}" data-filter-audit="${escapeHtml(f.id)}" style="white-space: nowrap; border-radius: 20px;">${escapeHtml(f.label)}</button>`
  ).join('');

  return `
    <div class="audit-filters-scroll" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 1rem; scrollbar-width: none;">
      ${buttons}
    </div>
  `;
}

export function renderAuditTable(logs) {
  if (!logs.length) return `<div class="feedback-box feedback-box--empty"><p class="text-center">Nenhum log de auditoria encontrado.</p></div>`;
  
  const rows = logs.map((log, index) => {
    const date = log.createdAt?.toDate ? log.createdAt.toDate().toLocaleString('pt-BR') : 'Sem data';
    const actionConfig = ACTION_MAP[log.action] || { label: log.action, color: 'var(--text-secondary)' };
    const hasComments = log.comments && log.comments.length > 0;
    const targetDisplay = escapeHtml(log.target?.desc || log.target?.email || log.target?.id || 'Desconhecido');

    return `
      <tr style="${log.archived ? 'opacity: 0.6;' : ''}">
        <td>
           <span class="badge" style="font-size: 0.7rem; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: ${actionConfig.color};">${escapeHtml(actionConfig.label)}</span>
           ${hasComments ? '<div style="display:inline-block; width:8px; height:8px; background:var(--green-400); border-radius:50%; margin-left:8px;" title="Anotações Inclusas"></div>' : ''}
        </td>
        <td style="font-size: 0.85rem;">
          <strong style="color:var(--text-primary);">${escapeHtml(log.actor?.email || 'Sistema')}</strong>
        </td>
        <td style="font-size: 0.85rem; color:var(--text-muted);">${targetDisplay}</td>
        <td style="font-size: 0.8rem; color:var(--text-muted);">${escapeHtml(date)}</td>
        <td style="text-align:right; position: relative; min-width: 90px; vertical-align: middle;">
          <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.2rem;">
             <button class="btn btn-ghost btn-sm" data-action="open-note-modal" data-index="${index}" title="Criar Anotação / Alerta" style="padding: 0.4rem; display: flex; align-items: center; justify-content: center; transform: translateY(-2px);"><i class="gg-pen" style="--ggs: 0.8; color: var(--text-primary); pointer-events: none;"></i></button>
             <button class="btn btn-ghost btn-sm" data-action="toggle-menu" data-index="${index}" style="padding: 0.2rem 0.5rem;">⋮</button>
          </div>
          
          <div class="audit-dropdown-menu" id="audit-menu-${index}" style="display: none; position: absolute; right: 0; top:calc(100% - 5px); background: var(--bg-card); border: 1px solid var(--border-soft); border-radius: 8px; padding: 0.5rem 0; z-index: 100; min-width: 150px; text-align: left; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
             <button class="dropdown-item-btn" style="width: 100%; padding: 0.5rem 1rem; border: none; background: transparent; text-align: left; color: var(--text-primary); cursor: pointer;" data-action="view-log" data-index="${index}">Ver Diferenças</button>
             ${hasComments ? `<button class="dropdown-item-btn" style="width: 100%; padding: 0.5rem 1rem; border: none; background: transparent; text-align: left; color: var(--green-400); cursor: pointer;" data-action="read-comments" data-index="${index}">Ler Anotações</button>` : ''}
             <button class="dropdown-item-btn" style="width: 100%; padding: 0.5rem 1rem; border: none; background: transparent; text-align: left; color: var(--text-primary); cursor: pointer;" data-action="archive-log" data-index="${index}">${log.archived ? 'Desarquivar' : 'Arquivar'}</button>
             <hr style="border-color: var(--border-soft); margin: 0.25rem 0;">
             <button class="dropdown-item-btn" style="width: 100%; padding: 0.5rem 1rem; border: none; background: transparent; text-align: left; color: var(--red-400); cursor: pointer;" data-action="undo-log" data-index="${index}">Desfazer (Rollback)</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <style>
      .dropdown-item-btn:hover { background: rgba(255,255,255,0.05) !important; }
    </style>
    <div class="admin-table-wrapper" style="overflow: visible;">
      <table class="admin-table">
        <thead>
          <tr><th>Ação</th><th>Autor</th><th>Alvo</th><th>Data</th><th style="text-align:right;">Opções</th></tr>
        </thead>
        <tbody style="font-family: var(--font-sans, system-ui);">${rows}</tbody>
      </table>
    </div>
  `;
}