import { json } from "../_shared/utils.js";

// Visit /api/inquiries?token=YOUR_ADMIN_TOKEN to read messages people sent
// through the contact form. Set ADMIN_TOKEN as a Cloudflare Pages secret
// (Settings -> Environment variables -> Add secret) so this isn't public.
export async function onRequestGet({ request, env }) {
  if (!env.DB) {
    return json({ ok: false, error: "Database not bound." }, { status: 500 });
  }
  if (!env.ADMIN_TOKEN) {
    return json({ ok: false, error: "ADMIN_TOKEN secret not configured." }, { status: 500 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token") || request.headers.get("x-admin-token");
  if (token !== env.ADMIN_TOKEN) {
    return json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const { results } = await env.DB.prepare(
    "SELECT id, first_name, last_name, email, subject, message, created_at, read FROM inquiries ORDER BY created_at DESC LIMIT 200"
  ).all();

  return json({ ok: true, items: results });
}
