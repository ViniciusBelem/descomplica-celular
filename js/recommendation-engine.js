import { getAllDevices } from './catalog-service.js';
import { normalizeText } from './utils/security.js';

const PROFILES_DATA_PATH = './data/profiles.json';

let profilesCache = null;

function isValidProfile(profile) {
  return (
    profile &&
    typeof profile.id === 'string' &&
    typeof profile.label === 'string' &&
    profile.weights &&
    typeof profile.weights === 'object'
  );
}

function normalizeProfile(profile) {
  return {
    ...profile,
    id: normalizeText(profile.id),
    label: String(profile.label),
    description: String(profile.description || ''),
    recommendedFocus: Array.isArray(profile.recommendedFocus)
      ? profile.recommendedFocus.map((item) => normalizeText(item))
      : [],
    priorityOrder: Array.isArray(profile.priorityOrder)
      ? profile.priorityOrder.map((item) => String(item))
      : [],
    weights: {
      camera: Number(profile.weights?.camera || 0),
      performance: Number(profile.weights?.performance || 0),
      battery: Number(profile.weights?.battery || 0),
      display: Number(profile.weights?.display || 0),
      durability: Number(profile.weights?.durability || 0),
      longevity: Number(profile.weights?.longevity || 0),
      costBenefit: Number(profile.weights?.costBenefit || 0)
    },
    tone: {
      headline: String(profile.tone?.headline || ''),
      summaryTemplate: String(profile.tone?.summaryTemplate || '')
    }
  };
}

async function fetchProfiles() {
  const response = await fetch(PROFILES_DATA_PATH, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar os perfis de recomendação.');
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Os perfis de recomendação estão em formato inválido.');
  }

  return data.filter(isValidProfile).map(normalizeProfile);
}

export async function getAllProfiles() {
  if (profilesCache) {
    return [...profilesCache];
  }

  profilesCache = await fetchProfiles();
  return [...profilesCache];
}

export async function getProfileById(profileId) {
  const normalizedId = normalizeText(profileId);
  const profiles = await getAllProfiles();

  return profiles.find((profile) => profile.id === normalizedId) || null;
}

function getDefaultWeights() {
  return {
    camera: 0.16,
    performance: 0.16,
    battery: 0.16,
    display: 0.14,
    durability: 0.10,
    longevity: 0.12,
    costBenefit: 0.16
  };
}

function buildWeights(profile, focusTag) {
  const weights = profile?.weights ? { ...profile.weights } : getDefaultWeights();
  const normalizedFocusTag = normalizeText(focusTag);

  const focusAdjustments = {
    camera: { camera: 0.12, display: 0.03, performance: 0.01 },
    bateria: { battery: 0.12, longevity: 0.03, costBenefit: 0.01 },
    autonomia: { battery: 0.12, longevity: 0.03, costBenefit: 0.01 },
    performance: { performance: 0.12, display: 0.03, battery: 0.01 },
    jogos: { performance: 0.12, display: 0.04, battery: 0.02 },
    'custo-beneficio': { costBenefit: 0.12, battery: 0.02, performance: 0.01 },
    equilibrio: { battery: 0.03, camera: 0.03, performance: 0.03, costBenefit: 0.03 },
    premium: { longevity: 0.04, performance: 0.03, durability: 0.03, camera: 0.02 },
    longevidade: { longevity: 0.12, durability: 0.03, performance: 0.01 },
    design: { display: 0.08, durability: 0.04 }
  };

  const adjustments = focusAdjustments[normalizedFocusTag];

  if (!adjustments) {
    return normalizeWeights(weights);
  }

  const adjustedWeights = { ...weights };

  Object.entries(adjustments).forEach(([key, value]) => {
    adjustedWeights[key] = Number(adjustedWeights[key] || 0) + value;
  });

  return normalizeWeights(adjustedWeights);
}

function normalizeWeights(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, value]) => sum + Number(value || 0), 0);

  if (!total) {
    return getDefaultWeights();
  }

  return entries.reduce((accumulator, [key, value]) => {
    accumulator[key] = Number(value || 0) / total;
    return accumulator;
  }, {});
}

function calculateWeightedScore(device, weights) {
  const criteria = [
    'camera',
    'performance',
    'battery',
    'display',
    'durability',
    'longevity',
    'costBenefit'
  ];

  const weightedScore = criteria.reduce((score, criterion) => {
    const deviceScore = Number(device.scores?.[criterion] || 0);
    const weight = Number(weights?.[criterion] || 0);
    return score + deviceScore * weight;
  }, 0);

  return Number(weightedScore.toFixed(2));
}

function buildReasonHighlights(device, weights) {
  const entries = Object.entries(weights)
    .map(([criterion, weight]) => ({
      criterion,
      weight,
      deviceScore: Number(device.scores?.[criterion] || 0),
      weightedImpact: Number(device.scores?.[criterion] || 0) * Number(weight || 0)
    }))
    .sort((a, b) => b.weightedImpact - a.weightedImpact);

  return entries.slice(0, 3);
}

function translateCriterion(criterion) {
  const labels = {
    camera: 'câmera',
    performance: 'desempenho',
    battery: 'bateria',
    display: 'tela',
    durability: 'durabilidade',
    longevity: 'longevidade',
    costBenefit: 'custo-benefício'
  };

  return labels[criterion] || criterion;
}

function buildReasonText(device, profile, focusTag, highlights) {
  const highlightText = highlights
    .map((item) => translateCriterion(item.criterion))
    .join(', ');

  const parts = [];

  if (profile?.label) {
    parts.push(`Para o perfil "${profile.label}",`);
  } else {
    parts.push('Com base na análise do seu uso,');
  }

  parts.push(`${device.brand} ${device.model} se destacou principalmente em ${highlightText}.`);

  if (focusTag) {
    parts.push(`Ele também conversa bem com a prioridade "${focusTag}".`);
  }

  parts.push(device.summary);

  return parts.join(' ');
}

function buildAlternativeText(device, position) {
  if (position === 2) {
    return `Boa alternativa se você quiser uma opção próxima da melhor recomendação, com proposta semelhante.`;
  }

  if (position === 3) {
    return `Alternativa interessante para comparar custo, proposta e pontos fortes antes da decisão final.`;
  }

  return `Opção complementar para análise.`;
}

function applyBusinessRules(devices, budget, focusTag, profileId) {
  const numericBudget = Number(budget);

  return devices.filter((device) => {
    const matchesBudget =
      Number.isFinite(numericBudget) && numericBudget > 0
        ? device.price <= numericBudget
        : true;

    // O sistema de pesos (Weighted Score) já cuida de colocar os celulares mais aderentes no topo.
    // Filtrar rigidamente apenas pelo orçamento garante que nenhuma recomendação venha vazia!
    return matchesBudget;
  });
}

function enrichRankedDevice(device, profile, focusTag, weights, position) {
  const score = calculateWeightedScore(device, weights);
  const highlights = buildReasonHighlights(device, weights);

  return {
    ...device,
    recommendation: {
      position,
      finalScore: score,
      highlights,
      reason: buildReasonText(device, profile, focusTag, highlights),
      alternativeNote: position === 1 ? '' : buildAlternativeText(device, position)
    }
  };
}

function sortRankedDevices(devices) {
  return devices
    .slice()
    .sort((a, b) => {
      const scoreDifference =
        Number(b.recommendation?.finalScore || 0) - Number(a.recommendation?.finalScore || 0);

      if (scoreDifference !== 0) return scoreDifference;

      return a.price - b.price;
    });
}

function buildFallbackResponse(profile, focusTag, budget) {
  return {
    success: false,
    message:
      'Nenhum aparelho do catálogo correspondeu ao seu orçamento e aos filtros escolhidos.',
    profile: profile
      ? {
          id: profile.id,
          label: profile.label,
          description: profile.description,
          tone: profile.tone
        }
      : null,
    focusTag: normalizeText(focusTag),
    budget: Number(budget) || 0,
    bestMatch: null,
    alternatives: [],
    ranking: []
  };
}

export async function recommendDevices({
  budget = 0,
  profileId = '',
  focusTag = '',
  limit = 3
} = {}) {
  const [devices, profile] = await Promise.all([
    getAllDevices(),
    getProfileById(profileId)
  ]);

  const candidateDevices = applyBusinessRules(devices, budget, focusTag, profileId);
  const weights = buildWeights(profile, focusTag);

  if (!candidateDevices.length) {
    return buildFallbackResponse(profile, focusTag, budget);
  }

  const rankedDevices = sortRankedDevices(
    candidateDevices.map((device, index) =>
      enrichRankedDevice(device, profile, focusTag, weights, index + 1)
    )
  ).map((device, index) => ({
    ...device,
    recommendation: {
      ...device.recommendation,
      position: index + 1,
      alternativeNote: index === 0 ? '' : buildAlternativeText(device, index + 1)
    }
  }));

  const limitedRanking = rankedDevices.slice(0, Math.max(1, Number(limit) || 3));

  return {
    success: true,
    message: 'Recomendação gerada com sucesso.',
    profile: profile
      ? {
          id: profile.id,
          label: profile.label,
          description: profile.description,
          tone: profile.tone,
          recommendedFocus: profile.recommendedFocus
        }
      : null,
    focusTag: normalizeText(focusTag),
    budget: Number(budget) || 0,
    appliedWeights: weights,
    bestMatch: limitedRanking[0] || null,
    alternatives: limitedRanking.slice(1),
    ranking: limitedRanking
  };
}

export async function explainRecommendation({
  budget = 0,
  profileId = '',
  focusTag = '',
  limit = 3
} = {}) {
  const result = await recommendDevices({
    budget,
    profileId,
    focusTag,
    limit
  });

  if (!result.success || !result.bestMatch) {
    return {
      ...result,
      explanation:
        'Não foi possível gerar uma explicação porque nenhum aparelho compatível foi encontrado.'
    };
  }

  const bestDevice = result.bestMatch;
  const profileHeadline = result.profile?.tone?.headline || 'Recomendação personalizada';
  const profileSummary =
    result.profile?.tone?.summaryTemplate ||
    'A recomendação foi gerada com base nos critérios mais relevantes para o seu perfil.';

  const highlightsText = bestDevice.recommendation.highlights
    .map((item) => translateCriterion(item.criterion))
    .join(', ');

  return {
    ...result,
    explanation: `${profileHeadline}. ${profileSummary} A melhor escolha foi ${bestDevice.brand} ${bestDevice.model}, principalmente por se destacar em ${highlightsText}.`
  };
}

export async function getRecommendationProfiles() {
  return getAllProfiles();
}