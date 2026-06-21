export async function onRequestGet(context) {
  const { env } = context;

  const total = await env.DB.prepare("SELECT COUNT(*) as c FROM visitors").first();
  const unique = await env.DB.prepare("SELECT COUNT(DISTINCT visitor_hash) as c FROM visitors").first();
  const today = await env.DB.prepare(
    "SELECT COUNT(*) as c FROM visitors WHERE created_at >= datetime('now', 'start of day')"
  ).first();

  return Response.json({
    ok: true,
    total: total.c,
    unique: unique.c,
    today: today.c
  });
}
