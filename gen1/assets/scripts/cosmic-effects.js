/* ==========================================================================
   cosmic-effects.js — purely additive visual layer for /gen1/
   Zeydoo-port pass: adds .tap-active wiggle (130ms), result-screen star
   field, and confetti burst when the final screen reveals. Still does NOT
   call stopPropagation, NOT touch constructor handlers, NOT mutate game
   state. Constructor (common.js / main.js) handles timing & exits as normal.
   Per constructor-ui-only-rule.md: additive parallel code only.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Ambient sparkle layer ---------- */
  function initSparkles() {
    if (document.querySelector('.cosmic-sparkle-layer')) return;
    var layer = document.createElement('div');
    layer.className = 'cosmic-sparkle-layer';
    layer.setAttribute('aria-hidden', 'true');
    var glyphs = ['✦', '★', '✨', '🌟', '💫', '🎊', '🎁'];
    for (var i = 0; i < 14; i++) {
      var s = document.createElement('div');
      s.className = 'cosmic-sparkle';
      s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      s.style.left = (Math.random() * 100) + '%';
      s.style.animationDuration = (5 + Math.random() * 8) + 's';
      s.style.animationDelay = (-Math.random() * 10) + 's';
      s.style.fontSize = (12 + Math.random() * 14) + 'px';
      s.style.opacity = String(0.3 + Math.random() * 0.4);
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
  }

  /* ---------- Decorative ring around .game__main ---------- */
  function addRing() {
    var main = document.querySelector('.game__main');
    if (!main || main.querySelector('.cosmic-ring')) return;
    var r = document.createElement('div');
    r.className = 'cosmic-ring';
    r.setAttribute('aria-hidden', 'true');
    main.insertBefore(r, main.firstChild);
  }

  /* ---------- Result-screen twinkle star field (Zeydoo-style) ---------- */
  function addResultStars() {
    var finalScreen = document.querySelector('.game-final-screen');
    if (!finalScreen || finalScreen.querySelector('.cosmic-result-stars')) return;
    var s = document.createElement('div');
    s.className = 'cosmic-result-stars';
    s.setAttribute('aria-hidden', 'true');
    finalScreen.insertBefore(s, finalScreen.firstChild);
  }

  /* ---------- Tap burst (emoji + radial dots) ---------- */
  var POP_EMOJI  = ['🎁', '🎊', '💰', '✨', '🌟', '🎀'];
  var POP_COLORS = ['#FF6EE7', '#FFD700', '#7B5EFF', '#FF4499', '#00DDFF', '#FFAA00', '#CC44FF'];

  function spawnBurst(x, y) {
    var em = document.createElement('div');
    em.className = 'cosmic-pop-emoji';
    em.textContent = POP_EMOJI[Math.floor(Math.random() * POP_EMOJI.length)];
    em.style.left = (x - 16) + 'px';
    em.style.top  = (y - 16) + 'px';
    em.style.setProperty('--dx',  (Math.random() * 100 - 50) + 'px');
    em.style.setProperty('--dy',  (-50 - Math.random() * 70) + 'px');
    em.style.setProperty('--rot', (Math.random() * 120 - 60) + 'deg');
    document.body.appendChild(em);
    setTimeout(function () { em.remove(); }, 800);

    for (var i = 0; i < 8; i++) {
      var dot = document.createElement('div');
      dot.className = 'cosmic-pop-dot';
      dot.style.left = x + 'px';
      dot.style.top  = y + 'px';
      var angle = (Math.PI * 2 / 8) * i + Math.random() * 0.4;
      var dist = 25 + Math.random() * 50;
      dot.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      dot.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      var col = POP_COLORS[Math.floor(Math.random() * POP_COLORS.length)];
      dot.style.background = col;
      dot.style.boxShadow = '0 0 10px ' + col;
      document.body.appendChild(dot);
      (function (d) { setTimeout(function () { d.remove(); }, 550); })(dot);
    }
  }

  /* ---------- Wiggle the gift box on tap (Zeydoo: .ctc-planet--tapped, 130ms) ---------- */
  var WIGGLE_MS = 130;
  function wiggleGift() {
    var img = document.querySelector('.game .game__main__image');
    if (!img) return;
    img.classList.remove('tap-active');
    void img.offsetWidth; // force reflow so the animation restarts
    img.classList.add('tap-active');
    setTimeout(function () { img.classList.remove('tap-active'); }, WIGGLE_MS);
  }

  function onTap(e) {
    if (!e.target.closest('.game') || e.target.closest('.game-final-screen') || e.target.closest('.modal')) return;
    var x, y;
    if (e.changedTouches && e.changedTouches[0]) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else if (typeof e.clientX === 'number') {
      x = e.clientX;
      y = e.clientY;
    } else {
      return;
    }
    spawnBurst(x, y);
    wiggleGift();
  }

  /* ---------- Confetti on final-screen reveal ---------- */
  var CONFETTI_COLORS = ['#FF6EE7', '#FFD700', '#7B5EFF', '#FF4499', '#00DDFF', '#FFAA00', '#CC44FF'];
  function fireConfetti() {
    var existing = document.getElementById('cosmic-confetti-canvas');
    if (existing) existing.remove();
    var canvas = document.createElement('canvas');
    canvas.id = 'cosmic-confetti-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    var pieces = [];
    for (var i = 0; i < 120; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: -(4 + Math.random() * 8),
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 12,
        w: 8 + Math.random() * 12,
        h: 5 + Math.random() * 8,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        alpha: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.vx *= 0.99;
        p.rot += p.rotV;
        p.alpha -= 0.012;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      pieces = pieces.filter(function (p) { return p.alpha > 0; });
      if (pieces.length > 0) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
      }
    }
    frame();
  }

  function watchForFinalScreen() {
    var finalScreen = document.querySelector('.game-final-screen');
    if (!finalScreen) return;
    var fired = false;
    var mo = new MutationObserver(function () {
      if (fired) return;
      if (!finalScreen.classList.contains('hidden')) {
        fired = true;
        setTimeout(fireConfetti, 250);
        mo.disconnect();
      }
    });
    mo.observe(finalScreen, { attributes: true, attributeFilter: ['class'] });
  }

  function init() {
    initSparkles();
    addRing();
    addResultStars();
    watchForFinalScreen();
    document.addEventListener('click',      onTap, { passive: true });
    document.addEventListener('touchstart', onTap, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
