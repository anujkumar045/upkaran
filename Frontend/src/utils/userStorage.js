const storageKey = (collection, userId) => `upkaran_${collection}_${userId}`;

export const readUserCollection = (collection, userId, fallback = []) => {
  if (!userId) return fallback;

  try {
    const stored = localStorage.getItem(storageKey(collection, userId));
    const parsed = stored ? JSON.parse(stored) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const writeUserCollection = (collection, userId, value) => {
  if (!userId) return;
  localStorage.setItem(storageKey(collection, userId), JSON.stringify(value));
};
