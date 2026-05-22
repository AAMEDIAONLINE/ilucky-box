/* ==========================================================================
   confetti-oneshot.js — fires ONCE when the final screen reveals, then dies.
   No persistent listeners, no tap-interference. Mirrors Zeydoo's wi(t) burst
   but at 30 pieces (down from 120) for iPhone Safari headroom.
   ========================================================================== */
(function () {
  'use strict';

  var COLORS = ['#FF6EE7', '#FFD700', '#7B5EFF', '#FF4499', '#00DDFF', '#FFAA00', '#CC44FF'];
  var PIECE_COUNT = 30;

  function fire() {
    var canvas = document.createElement('canvas');
    canvas.id = 'confetti-oneshot-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;will-change:transform;transform:translateZ(0);';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) { canvas.remove(); return; }
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var pieces = [];
    for (var i = 0; i < PIECE_COUNT; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: -(4 + Math.random() * 8),
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 12,
        w: 8 + Math.random() * 12,
        h: 5 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.vx *= 0.99;
        p.rot += p.rotV; p.alpha -= 0.012;
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
        canvas.remove(); // gone — no lingering memory or layers
      }
    }
    frame();
  }

  function init() {
    var finalScreen = document.querySelector('.game-final-screen');
    if (!finalScreen) return;
    var mo = new MutationObserver(function () {
      if (!finalScreen.classList.contains('hidden')) {
        mo.disconnect(); // ONE-SHOT — never observes again
        setTimeout(fire, 250);
      }
    });
    mo.observe(finalScreen, { attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
