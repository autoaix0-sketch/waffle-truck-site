import { gsap, ScrollTrigger, reduced, isPhone, smoothScroll, reveals, counters, img } from '../shared/motion.js'
import { fillInfo } from '../shared/render.js'
import { formulas, sandwiches, ovnis, ovnisHiver, bubbleWaffle, desserts, glaces, boissonsChaudes, bubbleTea, boissonsFroides } from '../shared/menu.js'

const $ = (s, r = document) => r.querySelector(s)
const li = (a, b, sub = '', hot = '') => `<li><span>${a}${hot ? `<span class="hot">${hot}</span>` : ''}${sub ? `<small>${sub}</small>` : ''}</span><b>${b}</b></li>`
const forms = (list) => `<div class="forms">${list.map((f) => `<div class="${f.star ? 'star' : ''}">${f.name}<b>${f.price}</b>${f.detail}</div>`).join('')}</div>`

/* ---------- open / closed (Paris time) ---------- */
function status() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date()).map((x) => [x.type, x.value]))
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday)
  const t = +p.hour * 60 + +p.minute
  const open = day >= 1 && day <= 6 && t >= 660 && t < 1110
  let txt = 'Ouvert · jusqu’à 18h30'
  if (!open) txt = day >= 1 && day <= 6 && t < 660 ? 'Fermé · ouvre à 11h' : day === 6 || day === 0 ? 'Fermé · ouvre lundi 11h' : 'Fermé · ouvre demain 11h'
  const el = $('[data-status]')
  el.classList.toggle('open', open); el.classList.toggle('closed', !open)
  $('[data-status-txt]').textContent = txt
}
status(); setInterval(status, 60000)

/* ---------- marquees ---------- */
const words = ['OVNI burgers', 'Bubble waffle', 'Bubble tea', 'Churros', 'Glaces', 'Milkshakes', 'Good mood']
document.querySelectorAll('.mq-t').forEach((t, k) => {
  const one = words.map((w) => `<span>${w}</span><i>${k ? '★' : '✺'}</i>`).join('')
  t.innerHTML = one + one + one
})

/* ---------- stacking menu ---------- */
const cards = [
  { tag: 'Burgers pressés', title: 'Les OVNI', bg: '#ff8a5c', art: ['cut/area-51.webp', 'cut/galaxie-kebab.webp', 'cut/comete.webp'],
    tix: `<h4>Les OVNI · venus d'ailleurs</h4><ul>${ovnis.map((o) => li(o.name, 'dès 9,90 €', o.desc)).join('')}</ul>${forms(formulas.ovni)}
      <h4>OVNI d'hiver</h4><ul>${ovnisHiver.items.map((o) => li(o.name, '', o.desc)).join('')}${li('Menu Complet', ovnisHiver.menuComplet.price, ovnisHiver.menuComplet.detail)}${li('Area Express', ovnisHiver.areaExpress.price, ovnisHiver.areaExpress.detail)}</ul>` },
  { tag: 'La pause qui croustille', title: 'Bowls & sandwichs', bg: '#ff8cc6', art: ['cut/crousty-frites.webp', 'cut/kebab.webp', 'cut/poulet-bbq.webp'],
    tix: `<h4>Bowls</h4><ul>${sandwiches.bowls.map((b) => li(b.name, b.price, b.note)).join('')}</ul>
      <h4>Sandwichs</h4><ul>${sandwiches.items.map((s) => li(s.name, 'dès 9,90 €', s.desc)).join('')}</ul>${forms(formulas.sandwich)}
      <ul>${li(sandwiches.kids.name, sandwiches.kids.price, sandwiches.kids.desc)}</ul><p class="small">${formulas.dessertChoice}</p>` },
  { tag: 'Compose ton plaisir', title: 'Bubble waffle', bg: '#7eeec3', art: ['cut/bubble-waffle.webp', 'cut/boule-fraise.webp', 'cut/boule-pistache.webp'],
    tix: `<ul>${bubbleWaffle.steps.map((s) => li(`${s.n}. ${s.title}`, s.price, s.choices.join(', '))).join('')}</ul><p class="small">${bubbleWaffle.tagline}</p>` },
  { tag: 'La pause ultra gourmande', title: 'Desserts', bg: '#ffe066', art: ['cut/churros.webp', 'cut/crepe-nutella.webp', 'cut/beignets.webp'],
    tix: `<h4>Churros</h4><ul>${desserts.churros.map((c) => li(c.name, c.price)).join('')}</ul>
      <h4>Crêpes</h4><ul>${desserts.crepes.map((c) => li(c.name, c.price)).join('')}</ul><p class="small">${desserts.crepeExtras}</p>
      <ul>${li('Beignet', desserts.beignets.price, desserts.beignets.flavours.join(' · '))}${li('La Pause Café', desserts.pauseCafe.price, desserts.pauseCafe.detail)}</ul>` },
  { tag: 'Dès 11h tous les jours', title: 'Glaces', bg: '#ffc9a8', art: ['cut/dame-blanche.webp', 'cut/fraise-melba.webp', 'cut/pot-glaces.webp'],
    tix: `<h4>${glaces.parfums.join(' · ')}</h4><ul>${glaces.formats.map((f) => li(f.name, f.price)).join('')}</ul>
      <h4>Coupes les plus vendues</h4><ul>${glaces.coupes.map((c) => li(c.name, c.price, c.desc)).join('')}</ul>` },
  { tag: 'Chaud · gourmand · réconfortant', title: 'Cafés & chocos', bg: '#d2c2ff', art: ['cut/pause-cafe.webp', 'cut/frappe-latte.webp', 'cut/frappe-chocolat.webp'],
    tix: `<h4>Cafés</h4><ul>${boissonsChaudes.cafes.map(([a, b, h]) => li(a, b, '', h)).join('')}</ul>
      <h4>Chocolats chauds</h4><ul>${boissonsChaudes.chocolats.map(([a, b, h]) => li(a, b, '', h)).join('')}</ul>` },
]
$('[data-stack]').innerHTML = cards.map((c, i) => `
  <article class="scard" style="--i:${i};--bg:${c.bg}">
    <div><span class="tag">${c.tag}</span><h3>${c.title}</h3><div class="art">${c.art.map((a) => img(a, '')).join('')}</div></div>
    <div class="tix">${c.tix}</div>
  </article>`).join('')

/* ---------- bubble tea builder ---------- */
const siropColor = { Fraise: '#ff4f6d', Framboise: '#d6266b', Cerise: '#a8123a', Pêche: '#ffab76', Mangue: '#ffb300', Passion: '#f7c531', Citron: '#f4e04d' }
const perleColor = { Fraise: '#ff3b5c', Framboise: '#c2185b', Pêche: '#ff9966', Passion: '#f9a825', Mangue: '#ff9f00', Litchi: '#fde2e4', Tapioca: '#2b1a12' }
const bt = { base: 'Fruitée', sirop: 'Mangue', perle: 'Tapioca', size: 'Petit' }
const groups = {
  base: bubbleTea.bases.map((b) => ({ v: b.name, label: `${b.name} <small>· ${b.note}</small>` })),
  sirop: bubbleTea.sirops.map((s) => ({ v: s, label: s, sw: siropColor[s] })),
  perle: bubbleTea.perles.map((s) => ({ v: s, label: s, sw: perleColor[s] })),
  size: bubbleTea.formats.map((f) => ({ v: f.name, label: `${f.name} ${f.size} · ${f.price}` })),
}
for (const [g, list] of Object.entries(groups)) {
  $(`[data-g="${g}"] .chips`).innerHTML = list.map((o) => `<button type="button" class="chip" data-v="${o.v}" aria-pressed="${bt[g] === o.v}">${o.sw ? `<span class="sw" style="background:${o.sw}"></span>` : ''}${o.label}</button>`).join('')
  $(`[data-g="${g}"]`).addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return
    bt[g] = b.dataset.v; renderCup(g)
  })
}
const pearls = $('.pearls')
pearls.innerHTML = Array.from({ length: 22 }, (_, i) => {
  const row = Math.floor(i / 8), y = 298 - row * 15, half = 46 - row * 3
  return `<circle cx="${110 - half + ((i % 8) * (half * 2)) / 7 + (row % 2) * 5}" cy="${y}" r="8"/>`
}).join('')
const mix = (hex, to = '#f3e2cc', k = 0.55) => {
  const a = hex.match(/\w\w/g).map((h) => parseInt(h, 16)), b = to.match(/\w\w/g).map((h) => parseInt(h, 16))
  return '#' + a.map((v, i) => Math.round(v * (1 - k) + b[i] * k).toString(16).padStart(2, '0')).join('')
}
function renderCup(changed) {
  document.querySelectorAll('.bt-group').forEach((grp) => grp.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(bt[grp.dataset.g] === c.dataset.v))))
  const tea = bt.base === 'Lactée' ? mix(siropColor[bt.sirop]) : siropColor[bt.sirop]
  $('.cup').style.setProperty('--tea', tea)
  pearls.querySelectorAll('circle').forEach((c) => c.setAttribute('fill', perleColor[bt.perle]))
  const f = bubbleTea.formats.find((x) => x.name === bt.size)
  $('[data-bt-price]').textContent = f.price
  $('[data-bt-recap]').textContent = `${bt.base} · sirop ${bt.sirop.toLowerCase()} · perles ${bt.perle.toLowerCase()} · ${f.size}`
  if (reduced || !changed) { gsap.set('.cup', { scale: bt.size === 'Grand' ? 1.08 : 1 }); return }
  if (changed === 'size') gsap.to('.cup', { scale: bt.size === 'Grand' ? 1.08 : 1, duration: 0.6, ease: 'elastic.out(1,.5)' })
  if (changed === 'perle') gsap.fromTo('.pearls circle', { y: -60 }, { y: 0, duration: 0.8, ease: 'bounce.out', stagger: { each: 0.02, from: 'random' } })
  if (changed === 'sirop' || changed === 'base') gsap.fromTo('.cup .tea', { y: 50 }, { y: 0, duration: 0.7, ease: 'power3.out' })
  gsap.fromTo('.cup', { rotate: -6 }, { rotate: 0, duration: 0.8, ease: 'elastic.out(1.2,.35)' })
}
renderCup()

/* ---------- fresh ---------- */
$('[data-fresh]').innerHTML = boissonsFroides.map((d) => `<article class="fcard">${img(d.img, d.name)}<h3>${d.name}</h3><p>${d.items}</p><ul>${d.prices.map(([a, b]) => `<li><span>${a || 'Le verre'}</span><b>${b}</b></li>`).join('')}</ul></article>`).join('')

fillInfo()

/* ---------- motion ---------- */
smoothScroll()
reveals(); counters()

// cards taller than the screen must not stick, or their bottom would never be seen
function stickySafe() {
  document.querySelectorAll('.scard').forEach((c) => {
    c.style.position = ''
    if (isPhone() || c.offsetHeight > innerHeight - 110) c.style.position = 'relative'
  })
}
stickySafe(); addEventListener('resize', stickySafe)

if (!reduced) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.mega span', { yPercent: 100, rotate: (i) => (i ? 6 : -6), opacity: 0, duration: 1.1, stagger: 0.12 })
    .from('.polaroid.main', { y: 200, rotate: -20, opacity: 0, duration: 1.2 }, 0.2)
    .from('.stk', { scale: 0, rotate: -50, duration: 1, stagger: 0.1, ease: 'elastic.out(1,.5)' }, 0.5)
    .from('.badge', { scale: 0, duration: 0.9, ease: 'back.out(2)' }, 0.8)
    .from('.hero-lead, .hero-cta', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.6)
  gsap.to('.badge', { rotate: 360, duration: 18, ease: 'none', repeat: -1 })
  gsap.utils.toArray('.stk').forEach((s, i) => gsap.to(s, { y: [-12, 10, -8, 14][i], rotate: [6, -8, 5, -6][i], duration: 2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }))

  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } })
    .to('.stickers', { yPercent: -25, ease: 'none' }, 0)
    .to('.polaroid.main', { yPercent: 12, rotate: 9, ease: 'none' }, 0)
    .to('.mega .l1', { xPercent: -12, ease: 'none' }, 0)
    .to('.mega .l2', { xPercent: 10, ease: 'none' }, 0)

  const mqA = gsap.to('.mq.a .mq-t', { xPercent: -33.333, duration: 20, ease: 'none', repeat: -1 })
  const mqB = gsap.fromTo('.mq.b .mq-t', { xPercent: -33.333 }, { xPercent: 0, duration: 20, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    onUpdate: (st) => {
      const v = 1 + Math.min(Math.abs(st.getVelocity()) / 300, 6)
      gsap.to([mqA, mqB], { timeScale: v * (st.direction || 1) > 0 ? v : v, duration: 0.2, overwrite: true })
      gsap.to([mqA, mqB], { timeScale: 1, duration: 1.2, delay: 0.25, overwrite: false })
    },
  })

  // stacked cards shrink as the next one covers them
  const sc = gsap.utils.toArray('.scard')
  sc.forEach((c, i) => {
    gsap.from(c.querySelectorAll('.art img'), { scale: 0, rotate: -40, duration: 0.9, stagger: 0.08, ease: 'back.out(2)', scrollTrigger: { trigger: c, start: 'top 75%', once: true } })
    if (i === sc.length - 1) return
    gsap.to(c, { scale: 0.92, filter: 'brightness(.88)', ease: 'none', scrollTrigger: { trigger: sc[i + 1], start: 'top bottom', end: 'top 20%', scrub: true } })
  })

  gsap.from('.fcard', { y: 80, rotate: (i) => (i % 2 ? 8 : -8), opacity: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.fresh-grid', start: 'top 85%', once: true } })
  document.querySelectorAll('.fcard, .scard .art img').forEach((el) => el.addEventListener('pointerenter', () =>
    gsap.fromTo(el, { rotate: 0 }, { keyframes: { rotate: [-5, 4, -2, 0] }, duration: 0.5, ease: 'none' })))

  gsap.timeline({ scrollTrigger: { trigger: '.spot', start: 'top 85%', end: 'bottom 60%', scrub: 0.6 } })
    .from('.polaroid.p1', { yPercent: 30, rotate: -16, ease: 'none' }, 0)
    .from('.polaroid.p2', { yPercent: 50, rotate: 18, ease: 'none' }, 0)
  gsap.from('.quote', { y: 40, opacity: 0, rotate: 0, stagger: 0.1, duration: 0.7, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.quotes', start: 'top 88%', once: true } })
}

addEventListener('load', () => { stickySafe(); ScrollTrigger.refresh() })
