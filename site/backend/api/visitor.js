export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json().catch(() => ({}));
  const page = body.path || "/";

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const enc = new TextEncoder().encode(ip + day);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  const visitorHash = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");

  await env.DB.prepare(
    "INSERT INTO visitors(page, visitor_hash) VALUES(?, ?)"
  ).bind(page, visitorHash).run();

  return Response.json({ ok: true });
}
