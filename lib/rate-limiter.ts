// Simple in-memory rate limiter
// Note: In a serverless environment (e.g. Vercel) global variables can be reset occasionally, 
// but for simple brute-force prevention and abuse protection on a portfolio site, this is sufficient.

type RateLimitStore = Map<string, { count: number; timestamp: number }>;

const store: RateLimitStore = new Map();

export async function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  
  if (!store.has(ip)) {
    store.set(ip, { count: 1, timestamp: now });
    return { success: true };
  }

  const record = store.get(ip)!;

  if (now - record.timestamp > windowMs) {
    // Reset window
    record.count = 1;
    record.timestamp = now;
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false };
  }

  record.count += 1;
  return { success: true };
}
