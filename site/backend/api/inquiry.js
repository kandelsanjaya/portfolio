export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json().catch(() => ({}));

  const hasName = body.name || body.firstName;
  const hasEmail = body.email;
  const hasMessage = body.message;

  if (!hasName || !hasEmail || !hasMessage) {
    return Response.json({ message: "Please fill in all required fields." }, { status: 400 });
  }

  await env.DB.prepare(
    "INSERT INTO inquiries(data) VALUES(?)"
  ).bind(JSON.stringify(body)).run();

  return Response.json({ message: "Thanks — your message has been sent!" });
}
