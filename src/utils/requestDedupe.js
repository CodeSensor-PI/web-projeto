// Utilitário simples para deduplicar requisições em andamento por chave
// Uso: const data = await dedupeRequest(key, () => axios.get(...))
const inFlight = new Map();

export async function dedupeRequest(key, factory) {
  if (!key) throw new Error('dedupeRequest requires a key');

  if (inFlight.has(key)) {
    return inFlight.get(key);
  }

  const promise = (async () => {
    try {
      const result = await factory();
      return result;
    } finally {
      // remove after settled to avoid memory growth
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, promise);
  return promise;
}

export function buildKeyFromUrl(url, params) {
  try {
    const p = params ? JSON.stringify(params) : '';
    return `${url}|${p}`;
  } catch (e) {
    return String(url);
  }
}

export default { dedupeRequest, buildKeyFromUrl };
