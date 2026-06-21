# Sanjaya Kandel — Portfolio

Personal portfolio site: static front end (HTML/CSS/JS) plus a small API backed
by a real database, designed to run entirely on Cloudflare so it works on
**www.kandelsanjaya.com.np**.

## What changed in this pass

1. **Visitor counter / contact form actually work now.** The old `backend.js`
   was a plain Node `http` server that reads/writes a local
   `portfolio-data.json` file. That only works if something keeps a Node
   process running with a writable disk — it can't run on Cloudflare Pages,
   which only serves static files plus short-lived serverless functions with
   no persistent filesystem. So every `fetch("/api/...")` from `app.js` on
   the live site was silently 404'ing, which is why visits and messages never
   showed up. `index.html` also had a second, broken visitor-counter script
   tag (pointing at an old, unrelated Workers URL, placed *after* `</body>`,
   with a duplicate `id="visitorCount"`) — removed.
2. **New backend**: Cloudflare Pages Functions (`/functions/api/*.js`) backed
   by **Cloudflare D1**, a real serverless SQLite database that's "yours" —
   you own the data, can query it with SQL, and it deploys as part of the same
   Cloudflare project as your static site. No separate server to babysit.
3. **Two real bugs fixed** in the stats logic (kept in `backend.js` too, in
   case you ever want to run it locally without Cloudflare):
   - `stats()` compared `slice(7, 10)` of an ISO date (`"-21"`, three
     characters from the middle of the string) instead of `slice(0, 10)`
     (`"2026-06-21"`), so "today" counts could match any date ending in the
     same two digits.
   - Visit paths were stored with `.slice(90, 250)`, which throws away
     everything before character 90 — for a short path like `/` that's an
     empty string. Fixed to `.slice(0, 250)`.
4. **3D model compressed**: `images/sanjaya-3d-model.glb` (previously a
   73.7 MB file with three uncompressed 4096×4096 textures and 841k
   vertices) is now **1.2 MB** — textures resized/converted to WebP, mesh
   simplified, geometry Draco-compressed. Visually it's the same model;
   it just no longer makes visitors download 73 MB to see a hero
   decoration, and it now fits comfortably under Cloudflare Pages' file
   size limits.

## Project structure

```
index.html, app.js, styles.css     → the static site (unchanged behavior,
                                      just bug-fixed)
images/sanjaya-3d-model.glb        → compressed 3D model
functions/api/*.js                 → Cloudflare Pages Functions (the API)
functions/_shared/*.js             → shared helpers + your editable content
migrations/0001_init.sql           → D1 database schema
wrangler.toml                      → Cloudflare project config (D1 binding)
backend.js                         → optional: old Node server, bug-fixed,
                                      for local-only testing without Cloudflare
portfolio-data.json.example        → sample data file backend.js writes to
```

> **Note:** this package only contains the files that changed. Your existing
> `images/` folder (gallery photos, `dasa png.png`, `sanjaya 3d.png`, etc.)
> isn't included here — copy these files into your existing repo rather than
> replacing the whole `images/` folder.

## API routes (same paths `app.js` already calls)

| Route | Method | What it does |
|---|---|---|
| `/api/profile` | GET | static profile info |
| `/api/services` | GET | services list |
| `/api/skills` | GET | skills list |
| `/api/projects` | GET | projects list |
| `/api/gallery` | GET | gallery items |
| `/api/stats` | GET | `{ total, unique, today }` from D1 |
| `/api/visitor` | POST | records a visit (hashed IP+UA, no raw IP stored), returns stats |
| `/api/inquiry` | POST | saves a contact-form submission to D1 |
| `/api/inquiries?token=...` | GET | **protected** — read submitted messages (set `ADMIN_TOKEN`, see below) |

Edit `functions/_shared/content.js` any time you want to change your profile,
services, skills, projects, or gallery list — no database needed for that
part, since it rarely changes.

## Local development

```bash
npx wrangler d1 execute DB --local --file=./migrations/0001_init.sql
npx wrangler pages dev .
```

Visit `http://127.0.0.1:8788`. This runs the real Functions code against a
local SQLite file (no Cloudflare account needed yet). Copy
`.dev.vars.example` to `.dev.vars` and set `ADMIN_TOKEN` if you want to test
the `/api/inquiries` admin route locally.

## Deploying to Cloudflare (one-time setup)

1. **Install Wrangler & log in**
   ```bash
   npm install -g wrangler
   wrangler login
   ```
2. **Create the D1 database**
   ```bash
   wrangler d1 create portfolio-db
   ```
   This prints a `database_id` — paste it into `wrangler.toml`, replacing
   `REPLACE_WITH_YOUR_D1_DATABASE_ID`.
3. **Apply the schema to the real (remote) database**
   ```bash
   wrangler d1 execute portfolio-db --remote --file=./migrations/0001_init.sql
   ```
4. **Create the Pages project and deploy**
   ```bash
   wrangler pages project create sanjaya-portfolio
   wrangler pages deploy . --project-name=sanjaya-portfolio
   ```
   (Or connect the GitHub repo in the Cloudflare dashboard under
   Workers & Pages → Create → Pages → Connect to Git, for automatic deploys
   on every push — build command: none/empty, output directory: `/`.)
5. **Bind the D1 database to the Pages project** — in the Cloudflare
   dashboard: your Pages project → Settings → Functions → D1 database
   bindings → add binding name `DB` → select `portfolio-db`. (If you used
   `wrangler.toml`'s `[[d1_databases]]` block and deployed via `wrangler
   pages deploy`, this is already wired up automatically.)
6. **Set the admin token secret** — Pages project → Settings → Environment
   variables → add `ADMIN_TOKEN` as a secret (any long random string). Then
   visit `https://your-site/api/inquiries?token=YOUR_TOKEN` any time to read
   contact-form messages.
7. **Point your domain at it** — Pages project → Custom domains → Add
   `www.kandelsanjaya.com.np` (and `kandelsanjaya.com.np` if you want the
   bare domain too). Since the domain's DNS is presumably already on
   Cloudflare, this is usually a one-click confirmation; Cloudflare issues
   the SSL certificate automatically.

After that, every visit calls `/api/visitor`, which writes to D1 and updates
the counters you see in the hero section and contact section in real time,
and the contact form's POST requests land in the `inquiries` table instead of
disappearing.
