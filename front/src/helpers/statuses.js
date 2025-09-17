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