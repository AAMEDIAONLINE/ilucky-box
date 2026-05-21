/* ==========================================================================
   cosmic-effects.js — purely additive visual layer for /gen1/

   Listens to clicks on .game (the tap-game phase) and spawns emoji + dot
   burst effects. Does NOT call stopPropagation, NOT touch constructor
   handlers, NOT modify game state. Constructor (common.js / main.js)
   handles all timing and exits as normal.

   Per constructor-ui-only-rule.md: additive parallel code only.
   ========================================================================== */
(function () {
  'use strict';

  // ---- Ambient sparkle layer ----
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

  // ---- Add ring decoration into .game__main ----
  function addRing() {
    var main = document.querySelector('.game__main');
    if (!main || main.querySelector('.cosmic-ring')) return;
    var r = document.createElement('div');
    r.className = 'cosmic-ring';
    r.setAttribute('aria-hidden', 'true');
    main.insertBefore(r, main.firstChild);
  }

  // ---- Tap burst (emoji + radial dots) ----
  var POP_EMOJI = ['🎁', '🎊', '💰', '✨', '🌟', '🎀'];
  var POP_COLORS = ['#FF6EE7', '#FFD700', '#7B5EFF', '#FF4499', '#00DDFF', '#FFAA00', '#CC44FF'];

  function spawnBurst(x, y) {
    // emoji
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

    // 8 radial dots
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

  function onTap(e) {
    // Only respond inside the tap-game phase, not the final screen or modal.
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
  }

  function init() {
    initSparkles();
    addRing();
    // passive listener — does NOT intercept the constructor's own handlers
    document.addEventListener('click', onTap, { passive: true });
    document.addEventListener('touchstart', onTap, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
