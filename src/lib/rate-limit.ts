type Bucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();

export function enforceRateLimit({
  key,
  limit,
  intervalMs,
}: {
  key: string;
  limit: number;
  intervalMs: number;
}) {
  const bucket = store.get(key);
  const now = Date.now();
  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + intervalMs });
    return { success: true, remaining: limit - 1 };
  }
  if (bucket.count >= limit) {
    return { success: false, remaining: 0, retryAfter: bucket.resetAt - now };
  }
  bucket.count += 1;
  store.set(key, bucket);
  return { success: true, remaining: limit - bucket.count };
}
