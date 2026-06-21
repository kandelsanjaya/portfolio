import { json } from "../_shared/utils.js";
import { computeStats } from "../_shared/stats.js";

export async function onRequestGet({ env }) {
  if (!env.DB) {
    return json({ ok: false, error: "Database not bound." }, { status: 500 });
  }
  const stats = await computeStats(env.DB);
  return json(stats);
}
