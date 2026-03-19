import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';

import {
  qs,
  setDisabled
} from './utils/dom.js';

import {
  renderDashboardUser,
  renderDashboardStatus,
  renderDashboardLoading,
  renderDashboardMetrics,
  renderDashboardChart,
  renderDashboardMatches,
  renderDashboardError
} from './ui/dashboard-render.js';

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

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

  return 0;
}

function getMatchPrice(data) {
  const candidates = [
    data?.price,
    data?.preco,
    data?.recommendedPrice,
    data?.orcamento,
    data?.budget
  ];

  const firstValid = candidates.find((value) => Number.isFinite(Number(value)));
  return Number(firstValid || 0);
}

function getMatchFocus(data) {
  return (
    data?.focusTag ||
    data?.perfil ||
    data?.priority ||
    data?.recommendedFocus ||
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

  if (data?.recommendedDevice?.brand && data?.recommendedDevice?.model) {
    return `${data.recommendedDevice.brand} ${data.recommendedDevice.model}`;
  }

  if (typeof data?.deviceName === 'string') {
    return data.deviceName;
  }

  return 'Modelo não identificado';
}

function buildMatchItem(docData = {}) {
  const price = getMatchPrice(docData);
  const focus = getMatchFocus(docData);

  return {
    model: getMatchModel(docData),
    profileLabel: getFocusLabel(focus),
    price,
    focusTag: normalizeText(focus),
    timestamp: resolveTimestampValue(
      docData.data_pesquisa ||
        docData.createdAt ||
        docData.updatedAt ||
        docData.timestamp
    )
  };
}

function buildTrendData(matches = []) {
  const counters = {
    camera: 0,
    performance: 0,
    bateria: 0,
    jogos: 0,
    premium: 0,
    equilibrio: 0,
    'custo-beneficio': 0,
    longevidade: 0
  };

  matches.forEach((match) => {
    const focus = normalizeText(match.focusTag);
    if (focus in counters) {
      counters[focus] += 1;
    }
  });

  const total = matches.length || 1;

  const chartCandidates = [
    { label: 'Câmera', key: 'camera' },
    { label: 'Desempenho', key: 'performance' },
    { label: 'Bateria', key: 'bateria' },
    { label: 'Jogos', key: 'jogos' }
  ];

  return chartCandidates.map((item) => ({
    label: item.label,
    value: Math.round((counters[item.key] / total) * 100)
  }));
}

function buildMetrics(matches = []) {
  const totalMatches = matches.length;
  const totalBudget = matches.reduce((sum, match) => sum + Number(match.price || 0), 0);
  const averageBudget = totalMatches ? totalBudget / totalMatches : 0;

  return {
    latencyLabel: estimateLatencyLabel(),
    totalMatches,
    averageBudget
  };
}

function sortMatchesByDate(matches = []) {
  return matches
    .slice()
    .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
}

async function fetchUserMatches(userId) {
  const collectionCandidates = [
    'historico_matches',
    'match_history'
  ];

  let lastError = null;

  for (const collectionName of collectionCandidates) {
    try {
      const matchesQuery = query(
        collection(db, collectionName),
        where('uid', '==', userId),
        orderBy('data_pesquisa', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(matchesQuery);

      return snapshot.docs.map((doc) => buildMatchItem(doc.data()));
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return [];
}

function getDashboardElements() {
  return {
    profileTrigger: qs('#profile-menu-trigger'),
    profileDropdown: qs('#profile-dropdown'),
    logoutButton: qs('#btn-logout'),
    refreshButton: qs('#btn-refresh-data')
  };
}

function bindProfileDropdown() {
  const { profileTrigger, profileDropdown } = getDashboardElements();

  if (!profileTrigger || !profileDropdown) return;

  profileTrigger.addEventListener('click', (event) => {
    event.stopPropagation();

    const isActive = profileDropdown.classList.toggle('active');
    profileTrigger.setAttribute('aria-expanded', String(isActive));
    profileDropdown.setAttribute('aria-hidden', String(!isActive));
  });

  document.addEventListener('click', (event) => {
    const clickedOutside =
      !profileDropdown.contains(event.target) &&
      !profileTrigger.contains(event.target);

    if (clickedOutside) {
      profileDropdown.classList.remove('active');
      profileTrigger.setAttribute('aria-expanded', 'false');
      profileDropdown.setAttribute('aria-hidden', 'true');
    }
  });
}

function bindLogout() {
  const { logoutButton } = getDashboardElements();
  if (!logoutButton) return;

  logoutButton.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
      await signOut(auth);
      window.location.replace('login.html');
    } catch (error) {
      console.error('[Dashboard] Erro ao encerrar sessão:', error);
    }
  });
}

async function loadDashboardData(user, { showLoading = true } = {}) {
  const { refreshButton } = getDashboardElements();

  try {
    if (showLoading) {
      renderDashboardLoading();
    }

    setDisabled(refreshButton, true);

    const matches = await fetchUserMatches(user.uid);
    const orderedMatches = sortMatchesByDate(matches);
    const metrics = buildMetrics(orderedMatches);
    const trendData = buildTrendData(orderedMatches);

    renderDashboardMetrics(metrics);
    renderDashboardChart(trendData);
    renderDashboardMatches(orderedMatches);

    renderDashboardStatus({
      label: 'Sincronizado',
      tone: 'success'
    });
  } catch (error) {
    console.error('[Dashboard] Falha ao carregar dados:', error);
    renderDashboardError(
      'Não foi possível sincronizar o histórico do painel neste momento.'
    );
  } finally {
    setDisabled(refreshButton, false);
  }
}

function bindRefreshButton(currentUserRef) {
  const { refreshButton } = getDashboardElements();
  if (!refreshButton) return;

  refreshButton.addEventListener('click', async () => {
    if (!currentUserRef.value) return;
    await loadDashboardData(currentUserRef.value, { showLoading: true });
  });
}

function ensureAuthenticatedAccess() {
  const currentUserRef = { value: null };

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.replace('login.html');
      return;
    }

    currentUserRef.value = user;
    renderDashboardUser(user);
    await loadDashboardData(user, { showLoading: true });
  });

  return currentUserRef;
}

function bootstrapDashboard() {
  if (!qs('#api-status-badge')) return;

  bindProfileDropdown();
  bindLogout();

  const currentUserRef = ensureAuthenticatedAccess();
  bindRefreshButton(currentUserRef);

  renderDashboardStatus({
    label: 'Conectando...',
    tone: 'loading'
  });
}

document.addEventListener('DOMContentLoaded', bootstrapDashboard);