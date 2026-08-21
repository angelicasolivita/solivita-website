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
  // (the "lift" effect). Disabled below the tablet breakpoint (see
  // the matching 1100px cutoff in css/styles.css), where the hero
  // reverts to a normal stacked layout.
  function initHeroPin() {
    var hero = document.getElementById('cs-hero');
    var spacer = document.getElementById('cs-hero-spacer');
    if (!hero || !spacer) return;

    function onScroll() {
      if (window.matchMedia('(max-width: 1100px)').matches) return;
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

  // "About the House" photo slot (homepage): crossfades between
  // slides on a timer rather than a scrolling carousel — one photo
  // visible at a time, no user interaction required.
  function initHouseRotator() {
    var rotator = document.getElementById('house-rotator');
    if (!rotator) return;
    var slides = Array.prototype.slice.call(rotator.querySelectorAll('.cs-house-rotator-slide'));
    if (slides.length < 2) return;

    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('cs-house-rotator-slide-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('cs-house-rotator-slide-active');
    }, 3500);
  }

  // Hamburger toggle (tablet/mobile): opens/closes the full-screen
  // overlay menu. Closes automatically on link tap and on resize past
  // the collapse breakpoint, so it can't get stuck open if the
  // viewport grows back to desktop width.
  function initNavToggle() {
    var toggle = document.getElementById('site-nav-toggle');
    var links = document.getElementById('site-nav-links');
    if (!toggle || !links) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      links.classList.toggle('site-nav-links-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) setOpen(false);
    });
  }

  function init() {
    initNav();
    initHeroPin();
    initParallax();
    initHouseRotator();
    initNavToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
