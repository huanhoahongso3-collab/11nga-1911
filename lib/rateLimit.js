// Best-effort limiter: serverless instances don't share memory, so this only slows down a single warm instance.
export function createLimiter(max, windowMs) {
  const hits = new Map();

  return function limited(key) {
    const now = Date.now();
    if (hits.size > 1000) {
      for (const [k, list] of hits) {
        if (!list.some((t) => now - t < windowMs)) hits.delete(k);
      }
    }
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    return recent.length > max;
  };
}
