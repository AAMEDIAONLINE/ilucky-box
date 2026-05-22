/* ==========================================================================
   confetti-oneshot.js — CSS-driven confetti drop from the top.

   Fires ONCE when final screen reveals. Each piece is a DOM div with a
   pure CSS animation (transform: translate + rotate). No canvas, no
   requestAnimationFrame, no per-frame JS math. iPhone Safari composites
   transforms on the GPU directly, so this stays smooth on weak devices.
   ========================================================================== */
(function () {
  'use strict';

  var COLORS = ['#FF6EE7', '#FFD700', '#7B5EFF', '#FF4499', '#00DDFF', '#FFAA00', '#CC44FF', '#A78BFF', '#5AE8FF'];
  var COUNT  = 22;

  // Inject keyframes once at startup
  var style = document.createElement('style');
  style.textContent =
    '@keyframes confetti-drop {' +
      '0%   { transform: translate3d(0, 0, 0) rotate(0deg);   opacity: 1; }' +
      '100% { transform: translate3d(var(--sway, 0px), 105vh, 0) rotate(720deg); opacity: 0.85; }' +
    '}';
  document.head.appendChild(style);

  function fire() {
    var container = document.createElement('div');
    container.id = 'confetti-oneshot-container';
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden;contain:strict;';

    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('div');
      var size     = 8 + Math.random() * 8;
      var leftPct  = Math.random() * 100;
      var duration = 2.2 + Math.random() * 2.0;          // 2.2s–4.2s fall
      var delay    = Math.random() * 0.5;                // first 0.5s staggered start
      var color    = COLORS[Math.floor(Math.random() * COLORS.length)];
      var radius   = Math.random() > 0.5 ? '0' : '50%';  // mix of rects and dots
      var sway     = ((Math.random() - 0.5) * 240) | 0;  // ±120px lateral drift

      p.style.cssText =
        'position:absolute;' +
        'top:-30px;' +
        'left:' + leftPct + '%;' +
        'width:' + size + 'px;' +
        'height:' + (size * 0.7) + 'px;' +
        'background:' + color + ';' +
        'border-radius:' + radius + ';' +
        'will-change:transform,opacity;' +
        'animation:confetti-drop ' + duration + 's linear ' + delay + 's forwards;' +
        '--sway:' + sway + 'px;';
      container.appendChild(p);
    }
    document.body.appendChild(container);
    // Garbage-collect the whole container after the longest piece finishes
    setTimeout(function () { container.remove(); }, 5500);
  }

  function init() {
    var finalScreen = document.querySelector('.game-final-screen');
    if (!finalScreen) return;
    var mo = new MutationObserver(function () {
      if (!finalScreen.classList.contains('hidden')) {
        mo.disconnect();            // ONE-SHOT — never observes again
        setTimeout(fire, 200);
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
