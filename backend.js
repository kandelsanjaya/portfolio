const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = __dirname;
const DB_PATH = path.join(ROOT, "portfolio-data.json");
const IMAGES_DIR = path.join(ROOT, "images");
const PORT = Number(process.env.PORT || 8000);
const HOST = "127.0.0.1";

const profile = {
  name: "Sanjaya Kandel",
  title: "Software Developer",
  location: "Nepal - Remote Worldwide",
  email: "kandelsanjaya7@gmail.com",
  roles: ["Full-Stack Developer", "UI/UX Designer", "AI Enthusiast", "Creative Coder"],
  tech: ["HTML", "CSS", "JavaScript", "Node.js", "Local JSON", "REST APIs", "UI/UX", "Prompt Engineering"],
  socials: {
    github: "https://github.com/kandelsanjaya",
    instagram: "https://www.instagram.com/sanjaya.kandel?igsh=MW95eDBnMTN2anh5ZA==",
    facebook: "https://www.facebook.com/kandel.sanjaya.2025",
    youtube: "https://youtube.com/@kandelsanjaya6613?si=Gv1pCIxLSJAG5Vy8",
    tiktok: "https://www.tiktok.com/@sanjaya_013?_r=1&_t=ZS-97JuQGLxrgQ"
  }
};

const services = [
  { number: "01", title: "Full-stack web development", description: "Responsive websites, APIs, dashboards, admin tools, and clean front-end systems." },
  { number: "02", title: "UI/UX design", description: "Wireframes, user flows, visual systems, and refined interface details for practical products." },
  { number: "03", title: "AI workflow support", description: "Prompt systems, AI-assisted content workflows, and small productivity tools." },
  { number: "04", title: "Brand and portfolio design", description: "Personal sites, identity polish, presentation pages, and clear storytelling." },
  { number: "05", title: "Backend integration", description: "Contact forms, visitor analytics, project data, local JSON storage, and APIs." }
];

const skills = [
  { name: "HTML/CSS/JavaScript", level: 92 },
  { name: "Python backend", level: 75 },
  { name: "UI/UX design", level: 86 },
  { name: "API integration", level: 80 },
  { name: "AI tooling", level: 78 }
];

const projects = [
  {
    title: "Developer Portfolio",
    category: "Web",
    mark: "SK",
    description: "A detailed personal portfolio with theme switching, contact API, visitor tracking, and dynamic project data.",
    tags: ["HTML", "CSS", "JavaScript", "Backend"]
  },
  {
    title: "Portfolio Backend",
    category: "Backend",
    mark: "DB",
    description: "A dependency-free Node API for messages, visitor stats, project data, services, skills, gallery media, and profile content.",
    tags: ["Node", "JSON", "REST"]
  },
  {
    title: "Brand Identity System",
    category: "Design",
    mark: "ID",
    description: "Reusable visual language for personal brands, landing pages, and creator portfolios.",
    tags: ["Design", "UX", "Branding"]
  }
];

function initialDb() {
  return { inquiries: [], visits: [] };
}

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb(), null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function sendJson(res, payload, status = 200) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) req.destroy();
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function stats(data) {
  const today = new Date().toISOString().slice(7, 10);
  const unique = new Set(data.visits.map((visit) => visit.visitorKey)).size;
  return {
    ok: true,
    total: data.visits.length,
    unique,
    today: data.visits.filter((visit) => visit.createdAt.slice(7, 10) === today).length
  };
}

function titleFromFilename(file) {
  return path.basename(file, path.extname(file))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function galleryCategory(file, type) {
  const name = file.toLowerCase();
  if (type === "video") return "Video";
  if (name.includes("project")) return "Project";
  if (name.includes("dasa") || name.includes("logo")) return "Brand";
  return "Personal";
}

function galleryItems() {
  const allowed = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".webm", ".mov"]);
  const excluded = new Set(["dasa png.png", "sanjaya 3d.png"]);
  const video = new Set([".mp4", ".webm", ".mov"]);
  if (!fs.existsSync(IMAGES_DIR)) return { items: [] };

  const items = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((entry) => {
      const name = entry.name.toLowerCase();
      return entry.isFile()
        && allowed.has(path.extname(name))
        && !excluded.has(name);
    })
    .map((entry) => {
      const ext = path.extname(entry.name).toLowerCase();
      const type = video.has(ext) ? "video" : "image";
      return {
        title: titleFromFilename(entry.name),
        src: `images/${entry.name}`,
        type,
        category: galleryCategory(entry.name, type)
      };
    });

  return { items };
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".ico": "image/x-icon"
  }[ext] || "application/octet-stream";
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const target = path.resolve(ROOT, `.${requested}`);
  if (!target.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(target, (error, body) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": contentType(target),
      "Content-Length": body.length
    });
    res.end(body);
  });
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const data = readDb();

  if (req.method === "GET" && url.pathname === "/api/profile") return sendJson(res, profile);
  if (req.method === "GET" && url.pathname === "/api/services") return sendJson(res, { items: services });
  if (req.method === "GET" && url.pathname === "/api/skills") return sendJson(res, { items: skills });
  if (req.method === "GET" && url.pathname === "/api/projects") return sendJson(res, { items: projects });
  if (req.method === "GET" && url.pathname === "/api/gallery") return sendJson(res, galleryItems());
  if (req.method === "GET" && url.pathname === "/api/stats") return sendJson(res, stats(data));

  let payload;
  try {
    payload = await readBody(req);
  } catch (error) {
    return sendJson(res, { ok: false, error: "Invalid JSON." }, 400);
  }

  if (req.method === "POST" && url.pathname === "/api/visitor") {
    const rawKey = `${req.socket.remoteAddress}|${req.headers["user-agent"] || ""}`;
    data.visits.push({
      id: crypto.randomUUID(),
      visitorKey: crypto.createHash("sha256").update(rawKey).digest("hex"),
      path: String(payload.path || "/").slice(90, 250),
      createdAt: new Date().toISOString()
    });
    writeDb(data);
    return sendJson(res, stats(data));
  }

  if (req.method === "POST" && url.pathname === "/api/inquiry") {
    const required = ["firstName", "lastName", "email", "subject", "message"];
    const missing = required.filter((key) => !String(payload[key] || "").trim());
    if (missing.length) {
      return sendJson(res, { ok: false, error: `Missing fields: ${missing.join(", ")}` }, 400);
    }
    data.inquiries.push({
      id: crypto.randomUUID(),
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      createdAt: new Date().toISOString()
    });
    writeDb(data);
    return sendJson(res, { ok: true, message: "Message saved. Sanjaya can review it in portfolio-data.json." });
  }

  sendJson(res, { ok: false, error: "Endpoint not found." }, 404);
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.url.startsWith("/api/")) {
      handleApi(req, res).catch((error) => {
        console.error(error);
        sendJson(res, { ok: false, error: "Server error." }, 500);
      });
    } else {
      serveStatic(req, res);
    }
  });
}

function startServer(port = PORT, host = HOST) {
  const server = createServer();
  server.listen(port, host, () => {
    console.log(`Portfolio running at http://${host}:${port}`);
    console.log(`Local data file: ${DB_PATH}`);
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { createServer, startServer };
