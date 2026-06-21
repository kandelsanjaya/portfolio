export async function onRequestGet(context) {
  const { env } = context;
  const row = await env.DB.prepare("SELECT * FROM profile LIMIT 1").first();
  if (!row) return Response.json({ name: "", roles: [], tech: [] });
  return Response.json({
    name: row.name,
    roles: JSON.parse(row.roles),
    tech: JSON.parse(row.tech)
  });
}
