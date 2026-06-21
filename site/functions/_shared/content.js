// Static portfolio content shared by every /api/* function.
// Edit this file to update your profile, services, skills, projects, or gallery
// without touching any database — these values rarely change, so they live in
// code rather than D1.

export const profile = {
  name: "Sanjaya Kandel",
  title: "Software Developer",
  location: "Nepal - Remote Worldwide",
  email: "kandelsanjaya7@gmail.com",
  roles: ["Full-Stack Developer", "UI/UX Designer", "AI Enthusiast", "Creative Coder"],
  tech: ["HTML", "CSS", "JavaScript", "Node.js", "Cloudflare D1", "REST APIs", "UI/UX", "Prompt Engineering"],
  socials: {
    github: "https://github.com/kandelsanjaya",
    instagram: "https://www.instagram.com/sanjaya.kandel?igsh=MW95eDBnMTN2anh5ZA==",
    facebook: "https://www.facebook.com/kandel.sanjaya.2025",
    youtube: "https://youtube.com/@kandelsanjaya6613?si=Gv1pCIxLSJAG5Vy8",
    tiktok: "https://www.tiktok.com/@sanjaya_013?_r=1&_t=ZS-97JuQGLxrgQ"
  }
};

export const services = [
  { number: "01", title: "Full-stack web development", description: "Responsive websites, APIs, dashboards, admin tools, and clean front-end systems." },
  { number: "02", title: "UI/UX design", description: "Wireframes, user flows, visual systems, and refined interface details for practical products." },
  { number: "03", title: "AI workflow support", description: "Prompt systems, AI-assisted content workflows, and small productivity tools." },
  { number: "04", title: "Brand and portfolio design", description: "Personal sites, identity polish, presentation pages, and clear storytelling." },
  { number: "05", title: "Backend integration", description: "Contact forms, visitor analytics, project data, and Cloudflare D1-backed APIs." }
];

export const skills = [
  { name: "HTML/CSS/JavaScript", level: 92 },
  { name: "Python backend", level: 75 },
  { name: "UI/UX design", level: 86 },
  { name: "API integration", level: 80 },
  { name: "AI tooling", level: 78 }
];

export const projects = [
  {
    title: "Developer Portfolio",
    category: "Web",
    mark: "SK",
    description: "A detailed personal portfolio with theme switching, contact API, visitor tracking, and dynamic project data.",
    tags: ["HTML", "CSS", "JavaScript", "Cloudflare"]
  },
  {
    title: "Portfolio Backend",
    category: "Backend",
    mark: "DB",
    description: "A Cloudflare Pages Functions API backed by D1 for messages, visitor stats, project data, services, skills, and gallery media.",
    tags: ["Cloudflare", "D1", "REST"]
  },
  {
    title: "Brand Identity System",
    category: "Design",
    mark: "ID",
    description: "Reusable visual language for personal brands, landing pages, and creator portfolios.",
    tags: ["Design", "UX", "Branding"]
  }
];

// Keep this list in sync with the files actually committed under /images.
// (Cloudflare Pages Functions cannot list directory contents at runtime, so
// the gallery is declared explicitly rather than scanned from disk.)
export const gallery = [
  { title: "Baglung", src: "images/baglung.jpeg", type: "image", category: "Nepal" },
  { title: "Best Portrait", src: "images/best.jpeg", type: "image", category: "Portrait" },
  { title: "Bgl Vibe", src: "images/bgl.jpeg", type: "image", category: "Nepal" },
  { title: "Dhodeni Hills", src: "images/Dhodeni.jpeg", type: "image", category: "Nepal" },
  { title: "Dominar Ride", src: "images/dominar.jpeg", type: "image", category: "Travel" },
  { title: "Home View", src: "images/home.jpeg", type: "image", category: "Personal" },
  { title: "Creative Kid", src: "images/kid.jpeg", type: "image", category: "Portrait" },
  { title: "Old Days", src: "images/old.jpeg", type: "image", category: "Personal" },
  { title: "Professional Me", src: "images/professional.jpeg", type: "image", category: "Portrait" },
  { title: "Sitting Calm", src: "images/sitting.jpeg", type: "image", category: "Portrait" },
  { title: "Sometimes Thinker", src: "images/sometimes.jpeg", type: "image", category: "Nepal" },
  { title: "Upper Mustang 2", src: "images/upper 2.jpeg", type: "image", category: "Travel" },
  { title: "Upper Mustang Ride", src: "images/upper.jpeg", type: "image", category: "Travel" }
];
