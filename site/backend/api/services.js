export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT number, title, description FROM services ORDER BY sort_order ASC"
  ).all();
  return Response.json({ items: results });
}
