// Smooth, inertia scrolling (Lenis) for the whole page.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof Lenis === 'undefined') return;
  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
    anchors: { offset: -84 },
  });
  window.lenis = lenis;
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  // Let the 3D ring be dragged sideways without the page scrolling
  document.getElementById('ringstage')?.setAttribute('data-lenis-prevent-touch', '');
})();
