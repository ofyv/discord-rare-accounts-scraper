/**
 * Verifica se um username é raro (2 ou 3 caracteres)
 * @param {string} username - Username a verificar
 * @returns {boolean} True se for raro
 */
export function checkUsernameRarity(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }

  const length = username.length;
  return length === 2 || length === 3;
}

/**
 * Verifica se o nível de boost é raro (≥ 3)
 * @param {string|null} boostLevel - Nível de boost (ex: 'BoostLevel3')
 * @returns {boolean} True se for raro
 */
export function checkBoostRarity(boostLevel) {
  if (!boostLevel || typeof boostLevel !== 'string') {
    return false;
  }

  const levelMatch = boostLevel.match(/BoostLevel(\d+)/);
  if (!levelMatch) {
    return false;
  }

  const level = parseInt(levelMatch[1], 10);
  return level >= 3;
}

/**
 * Lista de badges consideradas raras
 */
const RARE_BADGES = [
  'Staff',
  'Partner',
  'CertifiedModerator',
  'Hypesquad',
  'Developer',
  'PremiumEarlySupporter',
  'EarlySupporter',
  'early_supporter',
  'BugHunterLevel1',
  'BugHunterLevel2',
];

/**
 * Verifica se o usuário possui badges raras
 * @param {Array<string>} badges - Array de badges do usuário
 * @returns {boolean} True se possuir alguma badge rara
 */
export function checkBadgeRarity(badges) {
  if (!Array.isArray(badges) || badges.length === 0) {
    return false;
  }

  return badges.some(badge => RARE_BADGES.includes(badge));
}

/**
 * Verifica se uma conta é considerada rara baseado em todos os critérios
 * @param {Object} profileData - Dados processados do perfil
 * @returns {boolean} True se a conta for rara
 */
export function isRareAccount(profileData) {
  if (!profileData) {
    return false;
  }

  const usernameRare = checkUsernameRarity(profileData.username);
  const boostRare = profileData.boost ? checkBoostRarity(profileData.boost.level) : false;
  const badgeRare = checkBadgeRarity(profileData.badges);

  return usernameRare || boostRare || badgeRare;
}

/**
 * Retorna uma descrição dos critérios de raridade atendidos
 * @param {Object} profileData - Dados processados do perfil
 * @returns {Array<string>} Array com descrições dos critérios atendidos
 */
export function getRarityReasons(profileData) {
  const reasons = [];

  if (checkUsernameRarity(profileData.username)) {
    reasons.push(`Username raro (${profileData.username.length} caracteres)`);
  }

  if (profileData.boost && checkBoostRarity(profileData.boost.level)) {
    reasons.push(`Boost ${profileData.boost.level}`);
  }

  if (checkBadgeRarity(profileData.badges)) {
    const rareBadges = profileData.badges.filter(badge => RARE_BADGES.includes(badge));
    reasons.push(`Badges raras: ${rareBadges.join(', ')}`);
  }

  return reasons;
}
