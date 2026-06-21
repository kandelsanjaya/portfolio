export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT name, level FROM skills ORDER BY sort_order ASC"
  ).all();
  return Response.json({ items: results });
}
