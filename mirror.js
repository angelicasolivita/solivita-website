// mirror.js — pressandpalm.com/aurea mirror behaviors
// Site is built on Showit (proprietary page-builder engine), not a JS framework.
// See ../reference/animation-audit.md for the full audit.
// Reimplemented behaviors: (1) popup menu toggle, (2) background-image parallax.

;(function () {
  let behaviorsOnline = 0

  function initMenuToggle() {
    const trigger = document.querySelector('[data-sid="black-menu-logo_0"]')
    const menu = document.getElementById('pop-up-menu')
    const closeTrigger = document.querySelector('[data-sid="pop-up-menu_8"], [data-sid="pop-up-menu_7"]')
    if (!trigger || !menu) return

    menu.style.transition = 'opacity 0.5s ease'
    menu.style.opacity = '1'
    menu.style.display = 'none'

    let open = false
    function setOpen(next) {
      open = next
      if (open) {
        menu.style.display = 'block'
        menu.style.pointerEvents = 'auto'
        requestAnimationFrame(() => { menu.style.opacity = '1' })
      } else {
        menu.style.opacity = '0'
        menu.style.pointerEvents = 'none'
        setTimeout(() => { if (!open) menu.style.display = 'none' }, 500)
      }
    }

    trigger.addEventListener('click', () => setOpen(!open))
    if (closeTrigger) closeTrigger.addEventListener('click', () => setOpen(false))
    menu.addEventListener('click', (e) => { if (e.target === menu) setOpen(false) })

    behaviorsOnline++
  }

  function initParallax() {
    // Observed ratio from live site: image moves ~0.45x the scroll delta (slower than page scroll).
    const RATIO = 0.45
    const sections = ['parallax-with-logo', 'parallax-with-design']
      .map(id => document.getElementById(id))
      .filter(Boolean)

    const targets = sections.map(section => {
      const img = section.querySelector('.sb-mc.sbg-i, img.slzy')
      if (!img) return null
      const baseOffset = section.id === 'parallax-with-logo' ? -150 : 0
      return { section, img, baseOffset }
    }).filter(Boolean)

    if (!targets.length) return

    function update() {
      const vh = window.innerHeight
      targets.forEach(({ section, img, baseOffset }) => {
        const rect = section.getBoundingClientRect()
        // Distance of section center from viewport center, used to drive the offset.
        const centerDelta = rect.top + rect.height / 2 - vh / 2
        const y = -centerDelta * RATIO + baseOffset
        img.style.transform = `translateY(${y.toFixed(2)}px)`
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()

    behaviorsOnline++
  }

  function init() {
    try { initMenuToggle() } catch (e) { console.error('[mirror] menu toggle failed', e) }
    try { initParallax() } catch (e) { console.error('[mirror] parallax failed', e) }
    console.log(`[pressandpalm-mirror] ${behaviorsOnline} behaviors online`)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
