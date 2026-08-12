// Solivita Assisted Living — shared site behaviors.
// Used by index.html, about.html, care-services.html.

(function () {
  // Nav goes glass (blurred translucent card) once scrolled past the
  // hero; transparent while still over the hero.
  function initNav() {
    var nav = document.getElementById('site-nav');
    var hero = document.querySelector('.cs-hero-stage');
    if (!nav) return;
    var threshold = hero ? hero.offsetHeight : 400;

    function onScroll() {
      nav.classList.toggle('site-nav-glass', window.scrollY > threshold - 80);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Pins the hero to the viewport once you scroll past it: writes
  // position:fixed on scroll and never releases it, so the hero stays
  // fixed behind everything while the next section scrolls over it
  // (the "lift" effect). Disabled below the mobile breakpoint, where
  // the hero reverts to a normal stacked layout.
  function initHeroPin() {
    var hero = document.getElementById('cs-hero');
    var spacer = document.getElementById('cs-hero-spacer');
    if (!hero || !spacer) return;

    function onScroll() {
      if (window.matchMedia('(max-width: 900px)').matches) return;
      var pinned = window.scrollY > 0;
      hero.classList.toggle('cs-hero-fixed', pinned);
      spacer.classList.toggle('cs-hero-spacer-active', pinned);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Background photo drifts slower than page scroll (ratio observed
  // against the original reference site: ~0.45x scroll delta).
  function initParallax() {
    var RATIO = 0.45;
    var bands = Array.prototype.slice.call(document.querySelectorAll('.cs-parallax-band'));
    if (!bands.length) return;

    var targets = bands.map(function (band) {
      var img = band.querySelector('img');
      return img ? { band: band, img: img } : null;
    }).filter(Boolean);

    // Unclamped by design — the image is oversized (145% of the band's
    // height, ~157px of overflow top and bottom at 694px) specifically
    // so a large offset while off-screen still stays covered once the
    // band scrolls into view. The band's own overflow:hidden clips
    // anything beyond that. Matches the original's inline
    // `transform: translateY(...)` values exactly (verified against
    // the pre-rebuild page at multiple scroll positions).
    // BASE_OFFSET aligns the resting frame with the original: its image
    // is anchored so that at centerDelta=0 (band vertically centered in
    // viewport) the crop matches exactly, which sits ~150px above a
    // naive centerDelta*RATIO calculation once the image's own
    // overflow (145% of band height) is accounted for.
    var BASE_OFFSET = -150;
    function update() {
      var vh = window.innerHeight;
      targets.forEach(function (t) {
        var rect = t.band.getBoundingClientRect();
        var centerDelta = rect.top + rect.height / 2 - vh / 2;
        var y = BASE_OFFSET - centerDelta * RATIO;
        t.img.style.transform = 'translateY(' + y.toFixed(2) + 'px)';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function init() {
    initNav();
    initHeroPin();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
