import { json, hashKey } from "../_shared/utils.js";
import { computeStats } from "../_shared/stats.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return json({ ok: false, error: "Database not bound." }, { status: 500 });
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ua = request.headers.get("User-Agent") || "unknown";
  const visitorKey = await hashKey(`${ip}|${ua}`);
  const path = String(payload.path || "/").slice(0, 250);

  await env.DB.prepare(
    "INSERT INTO visits (id, visitor_key, path, created_at) VALUES (?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), visitorKey, path, new Date().toISOString()).run();

  const stats = await computeStats(env.DB);
  return json(stats);
}
