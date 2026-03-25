/**
 * DASHBOARD CONTROLLER - v2 CORRIGIDO
 * Gerencia a página de dashboard com autenticação robusta
 * e integração com firebase-service centralizado
 */

import { auth } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';

import {
  qs,
  setDisabled
} from './utils/dom.js';

import {
  normalizeText,
  escapeHtml
} from './utils/security.js';

import {
  renderDashboardUser,
  renderDashboardStatus,
  renderDashboardLoading,
  renderDashboardMetrics,
  renderDashboardChart,
  renderDashboardMatches,
  renderDashboardError
} from './ui/dashboard-render.js';

import {
  getUserRecommendations,
  getUserRecommendationStats
} from './services/firebase-service.js';

const DASHBOARD_REDIRECT_PATH = 'dashboard.html';

// ===== FUNÇÕES AUXILIARES =====

function getFocusLabel(focusTag) {
  const labels = {
    camera: 'Foco em câmera',
    performance: 'Foco em desempenho',
    bateria: 'Foco em bateria',
    jogos: 'Foco em jogos',
    premium: 'Experiência premium',
    equilibrio: 'Uso equilibrado',
    'custo-beneficio': 'Custo-benefício',
    longevidade: 'Longevidade'
  };

  return labels[normalizeText(focusTag)] || 'Perfil analisado';
}

function estimateLatencyLabel() {
  const latency = Math.floor(Math.random() * 16) + 5;
  return `${latency}ms`;
}

function resolveTimestampValue(value) {
  if (!value) return 0;

  if (typeof value?.toMillis === 'function') {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function getMatchPrice(data) {
  const candidates = [
    data?.price,
    data?.preco,
    data?.recommendedPrice,
    data?.bestMatch?.price,
    data?.recommendedDevice?.price,
    data?.orcamento,
    data?.budget
  ];

  const firstValid = candidates.find((value) => Number.isFinite(Number(value)) && Number(value) > 0);
  return Number(firstValid || 0);
}

function getMatchFocus(data) {
  return (
    data?.focusTag ||
    data?.perfil ||
    data?.priority ||
    data?.recommendedFocus ||
    data?.bestMatch?.focusTag ||
    ''
  );
}

function getMatchModel(data) {
  if (data?.brand && data?.model) {
    return `${data.brand} ${data.model}`;
  }

  if (data?.marca && data?.modelo) {
    return `${data.marca} ${data.modelo}`;
  }

  if (data?.bestMatch?.brand && data?.bestMatch?.model) {
    return `${data.bestMatch.brand} ${data.bestMatch.model}`;
  }

  if (data?.recommendedDevice?.brand && data?.recommendedDevice?.model) {
    return `${data.recommendedDevice.brand} ${data.recommendedDevice.model}`;
  }

  if (typeof data?.deviceName === 'string' && data.deviceName.trim()) {
    return data.deviceName.trim();
  }

  return 'Modelo não identificado';
}

function getProfileLabel(data) {
  return (
    data?.profile?.label ||
    data?.profileLabel ||
    data?.perfilLabel ||
    getFocusLabel(getMatchFocus(data))
  );
}

function buildMatchItem(docData = {}) {
  const price = getMatchPrice(docData);

  return {
    model: getMatchModel(docData),
    profileLabel: getProfileLabel(docData),
    price,
    focusTag: normalizeText(getMatchFocus(docData)),
    timestamp: resolveTimestampValue(docData?.createdAt || docData?.timestamp || 0)
  };
}

function buildTrendData(stats = {}) {
  const dist = stats.focusDistribution || {};
  const total = stats.totalAnalyses || 1; // Evita divisão por zero

  // Mapeamento dinâmico de todos os focos reais do sistema
  const focusLabels = {
    camera: 'Câmera',
    performance: 'Desempenho',
    bateria: 'Bateria',
    jogos: 'Jogos',
    equilibrio: 'Equilíbrio',
    'custo-beneficio': 'Custo-Benefício',
    premium: 'Premium',
    longevidade: 'Longevidade'
  };

  return Object.entries(dist)
    .map(([key, count]) => ({
      label: focusLabels[key] || key,
      value: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.value - a.value) // Ordena as barras da maior para a menor
    .slice(0, 5); // Exibe o top 5 dinâmico
}

function buildMetrics(stats = {}) {
  return {
    totalAnalyses: Number(stats.totalAnalyses || 0),
    averageBudget: Number(stats.averageBudget || 0),
    profilesUsed: Number(stats.profilesUsed?.length || 0)
  };
}

function sortMatchesByDate(matches = []) {
  return matches
    .slice()
    .sort((a, b) => (Number(b.timestamp || 0) - Number(a.timestamp || 0)));
}

// ===== ELEMENTOS DO DOM =====

function getDashboardElements() {
  return {
    apiStatusBadge: qs('#api-status-badge'),
    userAvatarTopbar: qs('#user-avatar-topbar'),
    userNameDisplay: qs('#user-name-display'),
    userAvatarSidebar: qs('[id*="user-avatar-sidebar"]'),
    userEmailDisplay: qs('#user-email-display'),
    apiLatencyContainer: qs('#api-latency-container'),
    devicesAnalyzedContainer: qs('#devices-analyzed-container'),
    avgBudgetContainer: qs('#avg-budget-container'),
    chartContainer: qs('#chart-container'),
    recentMatchesContainer: qs('#recent-matches-container'),
    profileMenuTrigger: qs('#profile-menu-trigger'),
    profileDropdown: qs('#profile-dropdown'),
    btnLogout: qs('#btn-logout'),
    btnRefreshData: qs('#btn-refresh-data')
  };
}

function closeProfileDropdown() {
  const { profileDropdown, profileMenuTrigger } = getDashboardElements();
  if (profileDropdown) {
    profileDropdown.classList.remove('active');
    profileDropdown.setAttribute('aria-hidden', 'true');
  }
  if (profileMenuTrigger) {
    profileMenuTrigger.setAttribute('aria-expanded', 'false');
  }
}

function bindProfileDropdown() {
  const { profileMenuTrigger, profileDropdown } = getDashboardElements();

  if (!profileMenuTrigger || !profileDropdown) return;

  profileMenuTrigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isActive = profileDropdown.classList.toggle('active');
    profileMenuTrigger.setAttribute('aria-expanded', String(isActive));
    profileDropdown.setAttribute('aria-hidden', String(!isActive));
  });

  document.addEventListener('click', (event) => {
    if (
      !profileMenuTrigger.contains(event.target) &&
      !profileDropdown.contains(event.target)
    ) {
      closeProfileDropdown();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeProfileDropdown();
    }
  });
}

function bindLogout() {
  const { btnLogout } = getDashboardElements();
  if (!btnLogout) return;

  btnLogout.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
      await signOut(auth);
      window.location.replace('./index.html');
    } catch (error) {
      console.error('[Dashboard] Erro ao fazer logout:', error);
    }
  });
}

// ===== CARREGAMENTO DE DADOS =====

async function loadDashboardData(user, { showLoading = true } = {}) {
  const els = getDashboardElements();

  if (!user) {
    renderDashboardError('Usuário não autenticado');
    return;
  }

  if (showLoading) {
    renderDashboardLoading();
  }

  try {
    // Atualizar usuário
    renderDashboardUser(user);

    // Fetch paralelo
    const [recommendations, stats] = await Promise.all([
      getUserRecommendations(user.uid, { limit: 20 }),
      getUserRecommendationStats(user.uid)
    ]);

    // Atualizar status
    renderDashboardStatus({
      label: 'Conectado',
      tone: 'success'
    });

    // Renderizar métricas
    const metrics = buildMetrics(stats);
    renderDashboardMetrics({
      latencyLabel: estimateLatencyLabel(),
      totalMatches: metrics.totalAnalyses,
      averageBudget: metrics.averageBudget
    });

    // Renderizar gráfico de tendências
    const trendData = buildTrendData(stats);
    renderDashboardChart(trendData); // Chamada direta sem o if para exibir o 'Empty State'

    // Renderizar análises recentes
    const matches = sortMatchesByDate(
      recommendations.map((rec) => buildMatchItem(rec))
    );
    renderDashboardMatches(matches);

  } catch (error) {
    console.error('[Dashboard] Erro ao carregar dados:', error);
    
    // Tratamento explícito de falta de índice do Firestore
    if (error.message === 'FALTA_INDICE_FIRESTORE') {
      renderDashboardError('Falta de Índice no Firestore. Por favor, crie um índice composto para "userId" (Ascendente) e "createdAt" (Descendente) na coleção "recommendations".');
    } else {
      renderDashboardError('Erro de conexão com o servidor. Tente atualizar a página.');
    }
    
    renderDashboardStatus({ label: 'Erro', tone: 'error' });
  }
}

function bindRefreshButton(currentUserRef) {
  const { btnRefreshData } = getDashboardElements();
  if (!btnRefreshData || !currentUserRef) return;

  btnRefreshData.addEventListener('click', async () => {
    setDisabled(btnRefreshData, true);
    try {
      await loadDashboardData(currentUserRef, { showLoading: true });
    } finally {
      setDisabled(btnRefreshData, false);
    }
  });
}

// ===== AUTENTICAÇÃO E INICIALIZAÇÃO =====

function ensureAuthenticatedAccess() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      if (!user) {
        console.warn('[Dashboard] Acesso negado - usuário não autenticado');
        window.location.replace('./index.html?redirect=dashboard.html');
        return;
      }

      resolve(user);
    });

    // Timeout de segurança
    setTimeout(() => {
      if (!auth.currentUser) {
        console.warn('[Dashboard] Timeout de autenticação');
        window.location.replace('./index.html?redirect=dashboard.html');
      }
    }, 5000);
  });
}

function bootstrapDashboard() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.warn('[Dashboard] Redirecionando para login');
      window.location.replace('./index.html?redirect=dashboard.html');
      return;
    }

    // Usuário autenticado
    renderDashboardUser(user);
    bindProfileDropdown();
    bindLogout();
    bindRefreshButton(user);

    await loadDashboardData(user, { showLoading: true });

    console.log('[Dashboard] Inicializado para:', user.email);
  });
}

document.addEventListener('DOMContentLoaded', bootstrapDashboard);
