const state = {
  profile: null,
  services: [],
  skills: [],
  projects: [],
  gallery: [],
  activeFilter: "All"
};

const fallbackData = {
  profile: {
    name: "Sanjaya Kandel",
    roles: ["Software Developer", "UI/UX Designer", "AI Enthusiast", "Creative Coder"],
    uniqueVisits: 0
  },
  services: [
    ["01", "Full-stack web development", "Responsive websites, APIs, dashboards, admin tools, and clean front-end systems."],
    ["02", "UI/UX design", "Wireframes, user flows, visual systems, and refined interface details for practical products."],
    ["03", "AI workflow support", "Prompt systems, AI-assisted content workflows, and small productivity tools."],
    ["04", "Brand and portfolio design", "Personal sites, identity polish, presentation pages, and clear storytelling."],
    ["05", "Backend integration", "Contact forms, visitor analytics, project data, local storage, and JSON APIs."]
  ],
  skills: [
    ["HTML/CSS/JS", 92], ["Python", 84], ["UI/UX", 86], ["Backend APIs", 80], ["AI tooling", 78]
  ],
  projects: [
    { title: "Developer Portfolio", category: "Web", mark: "SK", description: "A detailed portfolio with theme switching, contact API, visitor tracking, and project filtering.", tags: ["HTML", "CSS", "Node"] },
    { title: "Brand Identity System", category: "Design", mark: "ID", description: "Reusable visual language for personal brands, landing pages, and creator portfolios.", tags: ["Design", "UX"] }
  ],
  // ── GALLERY: design portfolio pieces — served as static files from /images/ ──
  gallery: [
    { src: "images/event_.jpg",         title: "Events by Esyfyn",        category: "Flyer Design",  type: "image" },
    { src: "images/food_ordering_.jpg",  title: "Food Delivery Poster",    category: "Print Design",  type: "image" },
    { src: "images/id_card.jpg",         title: "Company ID Card",         category: "Brand Design",  type: "image" },
    { src: "images/login_.jpg",          title: "EleCart Login UI",        category: "UI/UX Design",  type: "image" },
    { src: "images/page_2_.jpg",         title: "Primus Academic Agency",  category: "Flyer Design",  type: "image" },
    { src: "images/visiting_card_.jpg",  title: "Luxury Visiting Card",    category: "Brand Design",  type: "image" }
  ],
  tech: ["HTML", "CSS", "JavaScript", "Node.js", "REST APIs", "UI/UX", "Prompt Engineering"]
};

const qs = (selector) => document.querySelector(selector);

async function api(path, options = {}) {
  const res = await fetch(path, options);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function loadData() {
  try {
    const [profile, services, skills, projects] = await Promise.all([
      api("/api/profile"),
      api("/api/services"),
      api("/api/skills"),
      api("/api/projects")
    ]);
    state.profile = profile;
    state.services = services.items;
    state.skills = skills.items;
    state.projects = projects.items;
    state.tech = profile.tech;
  } catch (error) {
    state.profile = fallbackData.profile;
    state.services = fallbackData.services.map(([number, title, description]) => ({ number, title, description }));
    state.skills = fallbackData.skills.map(([name, level]) => ({ name, level }));
    state.projects = fallbackData.projects;
    state.tech = fallbackData.tech;
  }

  renderServices();
  renderSkills();
  renderProjects();
  renderFilters();
  renderTech();

  // Gallery is loaded separately via its own fetch
  renderGallery();
}

function renderServices() {
  const grid = qs("#servicesGrid");
  if (!grid) return;
  grid.innerHTML = state.services.map((service) => `
    <article class="service-card reveal">
      <span class="number">${service.number}</span>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </article>
  `).join("");
  observeReveal();
  setupCardMotion();
}

function renderSkills() {
  const container = qs("#skillBars");
  if (!container) return;
  container.innerHTML = state.skills.map((skill) => `
    <div class="skill-item">
      <div class="skill-top"><span>${skill.name}</span><span>${skill.level}%</span></div>
      <div class="skill-track"><div class="skill-fill" data-width="${skill.level}%"></div></div>
    </div>
  `).join("");
  requestAnimationFrame(() => {
    document.querySelectorAll(".skill-fill").forEach((bar) => {
      bar.style.width = bar.dataset.width;
    });
  });
}

function renderTech() {
  const container = qs("#techCloud");
  if (!container) return;
  container.innerHTML = (state.tech || fallbackData.tech).map((tech) => `<span>${tech}</span>`).join("");
}

function renderFilters() {
  const filterRow = qs("#projectFilters");
  if (!filterRow) return;
  const categories = ["All", ...new Set(state.projects.map((project) => project.category))];
  filterRow.innerHTML = categories.map((category) => `
    <button class="filter-btn ${category === state.activeFilter ? "active" : ""}" type="button" data-filter="${category}">${category}</button>
  `).join("");
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      renderFilters();
      renderProjects();
    });
  });
}

function renderProjects() {
  const grid = qs("#projectGrid");
  if (!grid) return;
  const projects = state.activeFilter === "All"
    ? state.projects
    : state.projects.filter((project) => project.category === state.activeFilter);
  grid.innerHTML = projects.map((project) => `
    <article class="project-card reveal">
      <div class="project-thumb">${project.mark || "PROJ"}</div>
      <p class="eyebrow">${project.category}</p>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tag-row">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </article>
  `).join("");
  observeReveal();
  setupCardMotion();
}

// ══════════════════════════════════════════════════════════════════
// GALLERY 
// ══════════════════════════════════════════════════════════════════

function renderGallery() {
  const grid = qs("#galleryGrid");
  if (!grid) return;

  const items = fallbackData.gallery;

  grid.innerHTML = items.map((item, index) => {
    const heightClass = index % 2 === 0 ? "gallery-card-tall" : "gallery-card-short";
    const media = item.type === "video"
      ? `<video src="${item.src}" controls preload="metadata"></video>`
      : `<img src="${item.src}" alt="${item.title}" loading="lazy">`;

    return `
      <article class="gallery-card reveal ${heightClass}" style="--i:${index};">
        <div class="gallery-media-wrapper">
          <div class="gallery-media">${media}</div>
          <div class="gallery-info">
            <span class="gallery-category">${item.category || "Design"}</span>
            <h4 class="gallery-title">${item.title}</h4>
          </div>
        </div>
      </article>
    `;
  }).join("");

  observeReveal();
  setupGalleryScroll();
}

// ══════════════════════════════════════════════════════════════════
// END GALLERY SECTION
// ══════════════════════════════════════════════════════════════════

function setupGalleryScroll() {
  const container = qs(".gallery-scroll-container");
  const track = qs("#galleryGrid");
  const prevBtn = qs("#galleryPrev");
  const nextBtn = qs("#galleryNext");
  if (!container || !track || !prevBtn || !nextBtn) return;

  const getScrollAmount = () => {
    const card = track.querySelector(".gallery-card");
    if (!card) return container.clientWidth * 0.8;
    const style = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    return cardWidth * 2;
  };

  prevBtn.addEventListener("click", () => {
    container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });

  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("dragging");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("dragging");
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("dragging");
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });
}

async function trackVisitor() {
  try {
    await fetch("/api/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: location.pathname })
    });
    const stats = await api("/api/stats");
    setStats(stats);
  } catch (e) {
    console.warn("Visitor tracking failed:", e);
  }
}

function setStats(data) {
  const today = qs("#todayVisits");
  const total = qs("#totalVisits");
  const unique = qs("#uniqueVisits");
  if (today) today.textContent = `${data.today} today`;
  if (total) total.textContent = `${data.total} total`;
  if (unique) unique.textContent = `${data.unique} unique`;

  const todayHero = qs("#todayVisitsHero");
  const totalHero = qs("#totalVisitsHero");
  const uniqueHero = qs("#uniqueVisitsHero");
  if (todayHero) todayHero.textContent = data.today;
  if (totalHero) totalHero.textContent = data.total;
  if (uniqueHero) uniqueHero.textContent = data.unique;
}

function setupTheme() {
  const themes = ["dark", "purple", "neon", "hacker", "candy-blue", "carbon-lime", "royal", "light"];
  const labels = {
    dark: "Dark",
    purple: "AI Purple",
    neon: "Cyber",
    hacker: "Hacker",
    "candy-blue": "Candy Blue",
    "carbon-lime": "Carbon + Lime",
    royal: "Royal",
    light: "White"
  };
  const saved = themes.includes(localStorage.getItem("theme")) ? localStorage.getItem("theme") : "dark";
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    const themeIcon = qs("#themeIcon");
    if (themeIcon) themeIcon.textContent = labels[theme];
    const themeToggle = qs("#themeToggle");
    if (themeToggle) themeToggle.setAttribute("aria-label", `Cycle color theme. Current theme: ${labels[theme]}`);
  };
  apply(saved);

  const toggle = qs("#themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || "dark";
      const next = themes[(themes.indexOf(current) + 1) % themes.length];
      apply(next);
    });
  }
}

function setupLiveClock() {
  const dateTarget = qs("#liveDate");
  const timeTarget = qs("#liveTime");
  if (!dateTarget || !timeTarget) return;

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  function update() {
    const now = new Date();
    dateTarget.textContent = dateFormatter.format(now);
    timeTarget.textContent = timeFormatter.format(now);
  }

  update();
  setInterval(update, 1000);
}

function setupTypewriter() {
  const target = qs("#typewriterText");
  if (!target) return;

  const words = [
    "building thoughtful digital products",
    "crafting polished web experiences",
    "turning ideas into useful interfaces",
    "creating clear product journeys",
    "shaping modern online experiences"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];
    target.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex += 1;
      setTimeout(tick, 72);
      return;
    }

    if (!deleting && charIndex === word.length) {
      deleting = true;
      setTimeout(tick, 1200);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(tick, 34);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(tick, 220);
  }

  tick();
}

function setupNetworkCanvas() {
  const canvas = qs("#networkCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = matchMedia("(pointer: coarse)").matches;
  if (reduceMotion || !ctx) {
    canvas.hidden = true;
    return;
  }
  const pointer = { x: 0, y: 0, active: false };
  let width = 0;
  let height = 0;
  let particles = [];
  let rafId = 0;

  function color(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, coarsePointer ? 1.25 : 1.75);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const density = coarsePointer ? 28000 : 21000;
    const maxParticles = width < 720 ? 42 : 78;
    const minParticles = width < 720 ? 24 : 36;
    const count = Math.min(maxParticles, Math.max(minParticles, Math.floor((width * height) / density)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.35 + 0.65
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const dot = color("--canvas-dot");
    const line = color("--canvas-line");
    const accent = color("--accent");

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dot;
      ctx.fill();

      if (!coarsePointer) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 118) {
            ctx.globalAlpha = 1 - dist / 118;
            ctx.strokeStyle = line;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      if (pointer.active) {
        const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        if (dist < 180) {
          ctx.globalAlpha = 1 - dist / 180;
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    rafId = requestAnimationFrame(draw);
  }

  addEventListener("resize", resize);
  addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });
  addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      draw();
    }
  });

  resize();
  draw();
}

function setupLoader() {
  const loader = qs("#loaderScreen");
  const percentText = qs("#loaderPercent");
  const progressFill = qs("#loaderBarFill");
  const sparksCanvas = qs("#loaderSparks");
  if (!loader) return;

  let sparksCtx = sparksCanvas ? sparksCanvas.getContext("2d") : null;
  let sparks = [];
  let sparksInterval;
  let canvasW, canvasH;

  function resizeCanvas() {
    if (!sparksCanvas) return;
    canvasW = sparksCanvas.width = loader.clientWidth;
    canvasH = sparksCanvas.height = loader.clientHeight;
  }

  if (sparksCtx) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Spark {
      constructor() {
        this.x = Math.random() * canvasW;
        this.y = canvasH + 10;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * -3 - 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.color = `hsla(${Math.random() * 360}, 100%, 75%, ${Math.random() * 0.5 + 0.5})`;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.005;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.life -= this.decay;
      }
      draw() {
        if (!sparksCtx) return;
        sparksCtx.fillStyle = this.color;
        sparksCtx.shadowBlur = 10;
        sparksCtx.shadowColor = this.color;
        sparksCtx.beginPath();
        sparksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        sparksCtx.fill();
        sparksCtx.shadowBlur = 0;
      }
    }

    function animateSparks() {
      if (!sparksCtx) return;
      sparksCtx.clearRect(0, 0, canvasW, canvasH);

      if (sparks.length < 60) {
        sparks.push(new Spark());
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw();
        if (sparks[i].life <= 0 || sparks[i].y < -10) {
          sparks.splice(i, 1);
        }
      }
      sparksInterval = requestAnimationFrame(animateSparks);
    }
    animateSparks();
  }

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 4) + 1;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("hide");
        if (sparksInterval) cancelAnimationFrame(sparksInterval);
      }, 500);
    }
    if (percentText) percentText.textContent = `${progress}%`;
    if (progressFill) progressFill.style.width = `${progress}%`;
  }, 35);
}

// Golden Cursor Sparkles Trail Simulation
function setupCursorSparksTrail() {
  const canvas = qs("#trailCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const mouse = { x: null, y: null };

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 2;
      this.speedY = (Math.random() - 0.5) * 2 - 0.5;
      this.color = `rgba(255, 215, 0, ${Math.random() * 0.4 + 0.6})`;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.015;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(255, 215, 0, 0.8)";

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    for (let i = 0; i < 3; i++) {
      particles.push(new Sparkle(mouse.x, mouse.y));
    }
  });

  function animateTrail() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
}

// Center Portrait opposite magnet direction and click elastic wobble spring simulation
function setupPortraitMagnet() {
  const panel = document.querySelector(".portrait-panel");
  const image = panel?.querySelector("#heroPortrait");
  if (!panel || !image) return;

  const current = { x: 0, y: 0, ry: 0, rx: 0 };
  const target = { x: 0, y: 0, ry: 0, rx: 0 };

  // Spring Wobble parameters (Simulating magnetic poles oscillation)
  let wobbleAngleX = 0;
  let wobbleAngleY = 0;
  let wobbleVelX = 0;
  let wobbleVelY = 0;
  const springK = 0.07;        // Spring stiffness
  const springDamping = 0.88;  // Resistance factor

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animate() {
    if (reduceMotion) return;

    // Smooth pointer magnet tracking (Opposite direction)
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    current.ry += (target.ry - current.ry) * 0.08;
    current.rx += (target.rx - current.rx) * 0.08;

    // Wobble spring equations
    const ax = -springK * wobbleAngleX;
    const ay = -springK * wobbleAngleY;
    wobbleVelX = (wobbleVelX + ax) * springDamping;
    wobbleVelY = (wobbleVelY + ay) * springDamping;
    wobbleAngleX += wobbleVelX;
    wobbleAngleY += wobbleVelY;

    // Accumulate pointer shifts + magnetic click oscillations
    const finalRx = current.rx + wobbleAngleX;
    const finalRy = current.ry + wobbleAngleY;

    // Apply translations in document layout flow (no collapses)
    image.style.transform = `translate3d(${current.x}px, ${current.y}px, 0px) rotateY(${finalRy}deg) rotateX(${finalRx}deg)`;

    requestAnimationFrame(animate);
  }

  // Mouse positioning handlers
  panel.addEventListener("pointermove", (event) => {
    const rect = panel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    // Set target positions in the opposite direction
    target.x = x * -40;
    target.y = y * -40;
    target.ry = x * -28;
    target.rx = y * 28;
  }, { passive: true });

  panel.addEventListener("pointerleave", () => {
    target.x = 0;
    target.y = 0;
    target.ry = 0;
    target.rx = 0;
  });

  // Apply a sudden magnetic pole impulse when clicked to trigger spring wobble
  image.addEventListener("click", () => {
    // Random magnetic tilt forces
    wobbleVelY = (Math.random() - 0.5) * 45 + 30; // degrees impulse
    wobbleVelX = (Math.random() - 0.5) * 45;
  });

  animate();
}

function setupCardMotion() {
  const cards = document.querySelectorAll(".service-card, .project-card");
  cards.forEach((card) => {
    if (card.dataset.motionReady) return;
    card.dataset.motionReady = "true";

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const rotateY = (x - 50) / 12;
      const rotateX = (50 - y) / 14;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
      card.style.setProperty("--tilt-x", `${rotateX}deg`);
      card.style.setProperty("--tilt-y", `${rotateY}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "0%");
    });
  });
}

function setupNav() {
  const navToggle = qs("#navToggle");
  const navLinks = qs("#navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const sections = [...document.querySelectorAll("main section")];
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const progressEl = qs("#progress");
    if (progressEl) progressEl.style.width = `${(scrollY / max) * 100}%`;

    const current = sections.findLast((section) => scrollY + 180 >= section.offsetTop);
    document.querySelectorAll(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href");
      const active = current && href === `#${current.id}`;
      link.classList.toggle("active", active);
    });
  }, { passive: true });
}

function observeReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal:not(.visible)").forEach((element) => observer.observe(element));
}

function setupContactForm() {
  const form = qs("#contactForm");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    const status = qs("#formStatus");
    if (status) status.textContent = "Sending...";
    try {
      const data = await api("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (status) status.textContent = data.message;
      form.reset();
    } catch (error) {
      if (status) status.textContent = "Could not send right now. Please email directly.";
    }
  });
}

// Initialize Everything
setupLoader();
setupTheme();
setupLiveClock();
setupTypewriter();
setupNetworkCanvas();
setupCursorSparksTrail();
setupPortraitMagnet();
setupNav();
setupContactForm();
observeReveal();
loadData();
trackVisitor();