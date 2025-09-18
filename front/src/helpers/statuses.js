const VALID_STATUSES = new Set(['owned', 'duplicated']);

export function normalizeStatuses(statusesObject = {}) {
  const normalizedMap = Object.create(null);
  
  for (const [cardIdAsString, status] of Object.entries(statusesObject || {})) {
    const cardId = Number(cardIdAsString);
    const isValidCardId = Number.isInteger(cardId);
    const isValidStatus = VALID_STATUSES.has(status);
  
    if (isValidCardId && isValidStatus) {
      normalizedMap[cardId] = status;
    }
  }
  
  return normalizedMap;
}

export function replaceStatuses(arg1, arg2) {
  const nextStatuses = (arg2 === undefined) ? arg1 : arg2;
  return normalizeStatuses(nextStatuses);
}
 
export function mergeStatuses(previousStatuses = {}, patchStatuses = {}) {
  const resultMap = { ...previousStatuses };
  
  for (const [cardIdAsString, status] of Object.entries(patchStatuses || {})) {
    const cardId = Number(cardIdAsString);
    const isValidCardId = Number.isInteger(cardId);
  
    if (!isValidCardId) continue;
  
    if (VALID_STATUSES.has(status)) {
      resultMap[cardId] = status;
    } else {
      delete resultMap[cardId];
    }
  }
 
  return resultMap;
}

export function snapshotToStatusesMap(snapshotArray = []) {
  const statusesMap = Object.create(null);
  
  for (const snapshotItem of snapshotArray) {
    if (!snapshotItem) continue;
  
    const cardId = Number(snapshotItem.card_id);
    const status = snapshotItem.status;
  
    const isValidCardId = Number.isInteger(cardId);
    const isValidStatus = VALID_STATUSES.has(status);
  
    if (isValidCardId && isValidStatus) {
      statusesMap[cardId] = status;
    }
  }
 
  return statusesMap;
}

export function makeAllDuplicated(cardIdList = []) {
  const map = Object.create(null);
 
  for (const rawCardId of cardIdList) {
    const cardId = Number(rawCardId);
    if (Number.isInteger(cardId)) {
      map[cardId] = 'duplicated';
    }
  }
 
  return map;
}

// Build a snapshot from the current map for ALL cards you care about
// -> [{ card_id, status: 'owned'|'duplicated'|'default' }]
export function statusesMapToSnapshot(allCardIds = [], currentMap = {}) {
    const snapshot = [];
    for (const rawId of allCardIds) {
      const cardId = Number(rawId);
      if (!Number.isInteger(cardId)) continue;
      const status = currentMap[cardId];
      if (status === 'owned' || status === 'duplicated') {
        snapshot.push({ card_id: cardId, status });
      } else {
        snapshot.push({ card_id: cardId, status: 'default' });
      }
    }
    return snapshot;
  }

export function makeAllOwnedPreservingDuplicated(allCardIds = [], currentMap = {}) {
    const map = Object.create(null);
    for (const rawId of allCardIds) {
      const id = Number(rawId);
      if (!Number.isInteger(id)) continue;
      map[id] = currentMap[id] === 'duplicated' ? 'duplicated' : 'owned';
    }
    return map;
}