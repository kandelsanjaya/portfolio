export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {})
    }
  });
}

export function dayKey(isoString) {
  // "2026-06-21T06:40:53.667Z" -> "2026-06-21"
  return isoString.slice(0, 10);
}

export async function hashKey(rawKey) {
  const data = new TextEncoder().encode(rawKey);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
