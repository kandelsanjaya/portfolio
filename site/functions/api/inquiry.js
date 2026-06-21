import { json } from "../_shared/utils.js";

const REQUIRED = ["firstName", "lastName", "email", "subject", "message"];

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return json({ ok: false, error: "Database not bound." }, { status: 500 });
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const missing = REQUIRED.filter((key) => !String(payload[key] || "").trim());
  if (missing.length) {
    return json({ ok: false, error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
  }

  await env.DB.prepare(
    `INSERT INTO inquiries (id, first_name, last_name, email, subject, message, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(),
    payload.firstName.trim(),
    payload.lastName.trim(),
    payload.email.trim(),
    payload.subject.trim(),
    payload.message.trim(),
    new Date().toISOString()
  ).run();

  return json({ ok: true, message: "Message saved. Sanjaya will get back to you soon." });
}
