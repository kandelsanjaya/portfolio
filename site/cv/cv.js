/* =================================================================
   cv.js  —  Sanjaya Kandel CV
   All interactive behaviour:
     1. Loading screen
     2. Eye pupil tracking
     3. Golden spark cursor
     4. Download button (Flask /download-pdf + local fallback)
   ================================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. LOADING SCREEN
  --------------------------------------------------------------- */
  function initLoadingScreen() {
    window.addEventListener('load', function () {
      setTimeout(function () {
        var screen = document.getElementById('loading-screen');
        var cv     = document.getElementById('resume');
        if (screen) screen.classList.add('hidden');
        if (cv)     cv.classList.add('visible');
      }, 2600);
    });
  }

  /* ---------------------------------------------------------------
     2. EYE PUPIL TRACKING
  --------------------------------------------------------------- */
  function initEyeTracking() {
    var eyeIds = ['l', 'm'];
    document.addEventListener('mousemove', function (e) {
      eyeIds.forEach(function (id) {
        var eye = document.getElementById(id);
        if (!eye) return;
        var r     = eye.getBoundingClientRect();
        var cx    = r.left + r.width  / 2;
        var cy    = r.top  + r.height / 2;
        var angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        var dist  = Math.min(Math.hypot(e.clientX - cx, e.clientY - cy) * 0.08, 12);
        var px    = Math.cos(angle) * dist;
        var py    = Math.sin(angle) * dist;
        eye.querySelectorAll('.pupil, .pupl2, .p5').forEach(function (p) {
          p.style.transform = 'translate(calc(-50% + ' + px + 'px), calc(-50% + ' + py + 'px))';
        });
      });
    });
  }

  /* ---------------------------------------------------------------
     3. GOLDEN SPARK CURSOR
  --------------------------------------------------------------- */
  function initCursor() {
    var dot  = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    var mx = 0, my = 0;
    var rx = 0, ry = 0;
    var lastSpark = 0;
    var SPARK_GAP   = 30;
    var SPARK_COUNT = 5;

    var COLORS = [
      '#FFD700', '#FFA500', '#FFB800',
      '#FF8C00', '#FFEC6E', '#FFC107', '#FF6B00'
    ];

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      var now = performance.now();
      if (now - lastSpark > SPARK_GAP) {
        lastSpark = now;
        spawnSparks(mx, my);
      }
    });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();

    function spawnSparks(x, y) {
      for (var i = 0; i < SPARK_COUNT; i++) {
        var s     = document.createElement('div');
        s.className = 'spark';
        var size  = Math.random() * 6 + 3;
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 45 + 20;
        var dx    = Math.cos(angle) * speed;
        var dy    = Math.sin(angle) * speed - Math.random() * 20;
        var dur   = Math.random() * 400 + 400;
        var color = COLORS[Math.floor(Math.random() * COLORS.length)];
        s.style.cssText = [
          'width:'  + size + 'px',
          'height:' + size + 'px',
          'left:'   + x   + 'px',
          'top:'    + y   + 'px',
          'background:' + color,
          'box-shadow: 0 0 ' + (size * 2) + 'px ' + color + ', 0 0 ' + (size * 4) + 'px ' + color + '88',
          'animation-duration:' + dur + 'ms',
          '--dx:' + dx + 'px',
          '--dy:' + dy + 'px'
        ].join(';');
        document.body.appendChild(s);
        setTimeout(function () { s.remove(); }, dur + 50);
      }
    }

    var interactables = 'a, button, .dl-label, .skill, .project, .art-card, .interest, .badge';
    document.querySelectorAll(interactables).forEach(function (el) {
      el.style.cursor = 'none';
      el.addEventListener('mouseenter', function () {
        dot.style.transform    = 'translate(-50%,-50%) scale(1.8)';
        ring.style.width       = '50px';
        ring.style.height      = '50px';
        ring.style.borderColor = 'rgba(255,215,0,0.9)';
      });
      el.addEventListener('mouseleave', function () {
        dot.style.transform    = 'translate(-50%,-50%) scale(1)';
        ring.style.width       = '30px';
        ring.style.height      = '30px';
        ring.style.borderColor = 'rgba(255,215,0,0.5)';
      });
    });
  }

  /* ---------------------------------------------------------------
     4. DOWNLOAD BUTTON
  --------------------------------------------------------------- */
  function initDownload() {
    var input = document.getElementById('dlInput');
    var toast = document.getElementById('toast');
    if (!input) return;

    input.addEventListener('change', function () {
      if (!this.checked) return;
      if (toast) toast.classList.add('show');
      var self = this;
      setTimeout(function () {
        if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
          var a = document.createElement('a');
          a.href     = '/download-pdf';
          a.download = 'Sanjaya_Kandel_CV.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          window.print();
        }
        setTimeout(function () {
          if (toast) toast.classList.remove('show');
        }, 2500);
        setTimeout(function () {
          self.checked = false;
        }, 1000);
      }, 3800);
    });
  }

  /* ---------------------------------------------------------------
     5. SCROLL-IN ANIMATIONS for sections
  --------------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('.project, .art-card, .exp-item, .edu-item');
    if (!window.IntersectionObserver) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity    = '1';
          entry.target.style.transform  = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (el) {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      obs.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     INIT
  --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initLoadingScreen();
    initEyeTracking();
    initCursor();
    initDownload();
    initScrollReveal();
  });

})();