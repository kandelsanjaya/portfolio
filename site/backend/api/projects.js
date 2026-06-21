export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT title, category, mark, description, tags FROM projects ORDER BY sort_order ASC"
  ).all();
  const items = results.map(p => ({ ...p, tags: JSON.parse(p.tags || "[]") }));
  return Response.json({ items });
}
