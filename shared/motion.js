import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isPhone = () => window.matchMedia('(max-width: 760px)').matches
export { gsap, ScrollTrigger }

/** Smooth scroll synced with ScrollTrigger. Returns the Lenis instance (or null). */
export function smoothScroll() {
  if (reduced) return null
  const lenis = new Lenis({ lerp: 0.11, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const el = document.querySelector(a.getAttribute('href'))
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -60 })
    }),
  )
  return lenis
}

/** Wrap each word (and optionally each letter) in spans. Keeps the text readable for screen readers. */
export function split(el, letters = false) {
  const text = el.textContent.trim()
  el.setAttribute('aria-label', text)
  el.innerHTML = text
    .split(/\s+/)
    .map((w) => {
      const inner = letters ? [...w].map((c) => `<span class="ch" aria-hidden="true">${c}</span>`).join('') : w
      return `<span class="w" aria-hidden="true"><span class="wi">${inner}</span></span>`
    })
    .join(' ')
  return el
}

/** Fade-up for every [data-reveal] element, staggered inside [data-reveal-group]. */
export function reveals() {
  if (reduced) return
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  })
  gsap.utils.toArray('[data-reveal-group]').forEach((g) => {
    gsap.from(g.children, {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: g, start: 'top 85%', once: true },
    })
  })
}

/** Count a number up when it enters the screen. data-count="4.3" data-dec="1" */
export function counters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count)
    const dec = parseInt(el.dataset.dec || '0', 10)
    const fmt = (v) => v.toFixed(dec).replace('.', ',')
    if (reduced) { el.textContent = fmt(end); return }
    const o = { v: 0 }
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'power2.out',
      onUpdate: () => (el.textContent = fmt(o.v)),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })
}

/** Buttons follow the pointer a little (desktop only). */
export function magnetic(sel = '[data-magnetic]') {
  if (reduced || !window.matchMedia('(hover: hover)').matches) return
  document.querySelectorAll(sel).forEach((b) => {
    const xTo = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' })
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * 0.3)
      yTo((e.clientY - r.top - r.height / 2) * 0.4)
    })
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0) })
  })
}

export const img = (src, alt, cls = '', eager = false) =>
  `<img src="/img/${src}" alt="${alt}" class="${cls}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`
