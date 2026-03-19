const DEVICES_DATA_PATH = './data/devices.json';

let devicesCache = null;

function isValidDevice(device) {
  return (
    device &&
    typeof device.id === 'string' &&
    typeof device.brand === 'string' &&
    typeof device.model === 'string' &&
    typeof device.price === 'number' &&
    device.scores &&
    typeof device.scores === 'object'
  );
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function normalizeArray(values) {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => normalizeText(value))
    .filter(Boolean);
}

function normalizeDevice(device) {
  return {
    ...device,
    id: String(device.id),
    brand: String(device.brand),
    model: String(device.model),
    slug: String(device.slug || device.id),
    price: Number(device.price),
    segment: normalizeText(device.segment),
    focusTags: normalizeArray(device.focusTags),
    profileTags: normalizeArray(device.profileTags),
    badge: String(device.badge || ''),
    summary: String(device.summary || ''),
    image: String(device.image || ''),
    specs: {
      screen: String(device.specs?.screen || ''),
      chipset: String(device.specs?.chipset || ''),
      battery: String(device.specs?.battery || ''),
      memory: String(device.specs?.memory || ''),
      storage: String(device.specs?.storage || ''),
      cameraMain: String(device.specs?.cameraMain || '')
    },
    scores: {
      camera: Number(device.scores?.camera || 0),
      performance: Number(device.scores?.performance || 0),
      battery: Number(device.scores?.battery || 0),
      display: Number(device.scores?.display || 0),
      durability: Number(device.scores?.durability || 0),
      longevity: Number(device.scores?.longevity || 0),
      costBenefit: Number(device.scores?.costBenefit || 0)
    }
  };
}

async function fetchDevices() {
  const response = await fetch(DEVICES_DATA_PATH, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Não foi possível carregar o catálogo de aparelhos.');
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('O catálogo de aparelhos está em formato inválido.');
  }

  return data.filter(isValidDevice).map(normalizeDevice);
}

export async function getAllDevices() {
  if (devicesCache) {
    return [...devicesCache];
  }

  const devices = await fetchDevices();
  devicesCache = devices;
  return [...devicesCache];
}

export async function refreshDevicesCache() {
  devicesCache = await fetchDevices();
  return [...devicesCache];
}

export async function getFeaturedDevices(limit = 6) {
  const devices = await getAllDevices();

  return devices
    .slice()
    .sort((a, b) => {
      const scoreA =
        a.scores.costBenefit +
        a.scores.performance +
        a.scores.camera +
        a.scores.battery;
      const scoreB =
        b.scores.costBenefit +
        b.scores.performance +
        b.scores.camera +
        b.scores.battery;

      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export async function getDeviceById(deviceId) {
  const normalizedId = normalizeText(deviceId);
  const devices = await getAllDevices();

  return devices.find((device) => normalizeText(device.id) === normalizedId) || null;
}

export async function getDeviceBySlug(slug) {
  const normalizedSlug = normalizeText(slug);
  const devices = await getAllDevices();

  return devices.find((device) => normalizeText(device.slug) === normalizedSlug) || null;
}

export async function getDevicesByBudget(maxPrice) {
  const budget = Number(maxPrice);

  if (!Number.isFinite(budget) || budget <= 0) {
    return [];
  }

  const devices = await getAllDevices();
  return devices.filter((device) => device.price <= budget);
}

export async function filterDevices(filters = {}) {
  const {
    maxPrice = null,
    brand = '',
    segment = '',
    focusTag = '',
    profileTag = '',
    search = ''
  } = filters;

  const normalizedBrand = normalizeText(brand);
  const normalizedSegment = normalizeText(segment);
  const normalizedFocusTag = normalizeText(focusTag);
  const normalizedProfileTag = normalizeText(profileTag);
  const normalizedSearch = normalizeText(search);

  const devices = await getAllDevices();

  return devices.filter((device) => {
    const matchesBudget =
      maxPrice === null || maxPrice === undefined
        ? true
        : device.price <= Number(maxPrice);

    const matchesBrand =
      !normalizedBrand || normalizeText(device.brand) === normalizedBrand;

    const matchesSegment =
      !normalizedSegment || normalizeText(device.segment) === normalizedSegment;

    const matchesFocusTag =
      !normalizedFocusTag || device.focusTags.includes(normalizedFocusTag);

    const matchesProfileTag =
      !normalizedProfileTag || device.profileTags.includes(normalizedProfileTag);

    const searchableText = normalizeText(
      `${device.brand} ${device.model} ${device.badge} ${device.summary}`
    );

    const matchesSearch =
      !normalizedSearch || searchableText.includes(normalizedSearch);

    return (
      matchesBudget &&
      matchesBrand &&
      matchesSegment &&
      matchesFocusTag &&
      matchesProfileTag &&
      matchesSearch
    );
  });
}

export async function getAvailableBrands() {
  const devices = await getAllDevices();

  return [...new Set(devices.map((device) => device.brand))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  );
}

export async function getAvailableSegments() {
  const devices = await getAllDevices();

  return [...new Set(devices.map((device) => device.segment))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  );
}

export async function getAvailableFocusTags() {
  const devices = await getAllDevices();

  return [...new Set(devices.flatMap((device) => device.focusTags))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  );
}

export async function getAvailableProfileTags() {
  const devices = await getAllDevices();

  return [...new Set(devices.flatMap((device) => device.profileTags))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  );
}