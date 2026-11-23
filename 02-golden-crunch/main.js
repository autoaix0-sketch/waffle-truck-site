import { gsap, ScrollTrigger, reduced, isPhone, smoothScroll, split, reveals, counters, magnetic, img } from '../shared/motion.js'
import { fillInfo } from '../shared/render.js'
import { favoris, surUber } from '../shared/info.js'
import { formulas, sandwiches, ovnis, ovnisHiver, bubbleWaffle, desserts, glaces, boissonsChaudes, bubbleTea, boissonsFroides, euro } from '../shared/menu.js'

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const row = (name, price, sub = '', best = '') =>
  `<li><span>${name}${best ? `<span class="best">${best}</span>` : ''}${sub ? `<small>${sub}</small>` : ''}</span><span class="dots"></span><span class="pr">${price}</span></li>`
const fbox = (list) => `<div class="fbox">${list.map((f) => `<div class="${f.star ? 'star' : ''}">${f.name}<b>${f.price}</b>${f.detail}</div>`).join('')}</div>`

/* ---------- open / closed (Paris time) ---------- */
function status() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date()).map((x) => [x.type, x.value]))
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday)
  const t = +p.hour * 60 + +p.minute
  const open = day >= 1 && day <= 6 && t >= 660 && t < 1110
  let txt = 'Ouvert aujourd’hui · jusqu’à 18h30'
  if (!open) txt = day >= 1 && day <= 6 && t < 660 ? 'Fermé · ouvre à 11h' : day === 6 || day === 0 ? 'Fermé · ouvre lundi à 11h' : 'Fermé · ouvre demain à 11h'
  const el = $('[data-status]')
  el.classList.toggle('open', open); el.classList.toggle('closed', !open)
  $('[data-status-txt]').textContent = txt
}
status(); setInterval(status, 60000)

/* ---------- builder ---------- */
const steps = bubbleWaffle.steps
const sel = steps.map((s, i) => (i === 0 ? s.choices[0] : null))
const touched = steps.map(() => false)
$('[data-build]').innerHTML = steps.map((s, i) => `
  <li class="bstep" data-i="${i}">
    <header><span class="num">${s.n}</span><h3>${s.title}</h3><span class="add">${s.price}</span></header>
    <div class="chips" role="group" aria-label="${s.title}">
      ${s.choices.map((c) => `<button type="button" class="chip" aria-pressed="${sel[i] === c}" data-c="${c}">${c}</button>`).join('')}
    </div>
    ${i > 0 ? '<p class="skip-note">Optionnel · touche encore pour retirer</p>' : ''}
  </li>`).join('')

const sumEl = $('[data-sum]'), recapEl = $('[data-recap]'), tops = $('.toppings')
const tokColors = ['#3a1f12', '#e8445a', '#f2b544', '#3ee0a1', '#ffffff', '#c8691c']
const spots = [[8, 12], [62, 6], [70, 62], [4, 60], [36, 0], [40, 78]]
let shown = 3.5
function total() { return steps.reduce((t, s, i) => t + (sel[i] ? s.add : 0), 0) }
function update(changed) {
  const t = total(), o = { v: shown }
  gsap.to(o, { v: t, duration: reduced ? 0 : 0.6, ease: 'power2.out', onUpdate: () => (sumEl.textContent = euro(o.v)) })
  shown = t
  const words = ['Base', 'coulis', 'glace', 'topping', 'fruits', 'chantilly']
  recapEl.textContent = sel.map((c, i) => (c ? (i === 5 ? 'chantilly' : `${words[i]} ${c.toLowerCase()}`) : null)).filter(Boolean).join(' · ')
  document.querySelectorAll('.bstep').forEach((li, i) => li.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.c === sel[i]))))
  if (changed == null || changed === 0) return
  const old = tops.querySelector(`[data-s="${changed}"]`)
  if (old) old.remove()
  if (!sel[changed]) return
  const [lx, ly] = spots[changed]
  const isScoop = changed === 2
  const map = { Vanille: 'vanille', Chocolat: 'chocolat', Fraise: 'fraise', Pistache: 'pistache', Café: 'cafe', Caramel: 'caramel', Coco: 'coco' }
  const html = isScoop
    ? `<span class="tok pic" data-s="${changed}" style="left:${lx}%;top:${ly}%">${img(`cut/boule-${map[sel[changed]]}.webp`, '')}</span>`
    : `<span class="tok" data-s="${changed}" style="left:${lx}%;top:${ly}%;background:${tokColors[changed]};color:${changed === 0 || changed === 1 ? '#fff6e8' : '#3a1f12'}">${sel[changed]}</span>`
  tops.insertAdjacentHTML('beforeend', html)
  if (!reduced) gsap.from(tops.lastElementChild, { y: -120, rotate: -25, scale: 0.4, opacity: 0, duration: 0.9, ease: 'bounce.out' })
  if (!reduced) gsap.fromTo('.plate-waffle', { scale: 0.94 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,.4)' })
}
/* ready-made ideas (kraft cups): tap = fill every step, the plate shows that cup */
const plateImg = $('.plate-waffle'), plateSrc = plateImg.getAttribute('src'), plateAlt = plateImg.alt
const ideas = bubbleWaffle.idees
const ideaPrice = (pick) => euro(pick.reduce((t, c, i) => t + (c ? steps[i].add : 0), 0))
$('[data-idees]').innerHTML = ideas.map((d, k) => `
  <button type="button" class="idee" data-k="${k}" aria-pressed="false">
    ${img(d.img, '')}<span class="idee-name">${d.name}</span><span class="idee-pr">${ideaPrice(d.pick)}</span>
  </button>`).join('')
function showPlate(k) {
  const d = ideas[k]
  plateImg.src = d ? `/img/${d.img}` : plateSrc
  plateImg.alt = d ? `Bubble waffle ${d.name}` : plateAlt
  plateImg.classList.toggle('cup', !!d)
  document.querySelectorAll('.idee').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.k === k)))
}
$('[data-idees]').addEventListener('click', (e) => {
  const b = e.target.closest('.idee')
  if (!b) return
  const d = ideas[+b.dataset.k]
  d.pick.forEach((c, i) => { touched[i] = true; sel[i] = c; update(i) })
  showPlate(+b.dataset.k)
  if (!reduced) gsap.fromTo(plateImg, { y: -30, scale: 0.8, rotate: -8 }, { y: 0, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2)' })
})

document.querySelectorAll('.bstep').forEach((li) => li.addEventListener('click', (e) => {
  const b = e.target.closest('.chip')
  if (!b) return
  const i = +li.dataset.i
  touched[i] = true
  sel[i] = sel[i] === b.dataset.c && i > 0 ? null : b.dataset.c
  showPlate(-1)   // own recipe now: back to the plain waffle
  update(i)
}))
update()

/* ---------- carte panels ---------- */
const P = []
P.push(`<article class="panel"><div class="art">${img('photo/ue-crousty-frites.webp', 'Crousty frites : frites maison, poulet crousty, sauce cheddar et sauce blanche', 'art-photo')}</div><div>
  <h3>La pause qui croustille</h3><p class="sub">Bowls &amp; sandwichs</p>
  <ul class="mlist">${sandwiches.bowls.map((b) => row(b.name, b.price, b.note)).join('')}${sandwiches.items.map((s) => row(s.name, 'dès 9,90 €', s.desc)).join('')}${row(sandwiches.kids.name, sandwiches.kids.price, sandwiches.kids.desc)}</ul>
  <h4>Kebab ou Poulet BBQ en formule</h4>${fbox(formulas.sandwich)}<p class="note">${formulas.dessertChoice}</p></div></article>`)
P.push(`<article class="panel"><div class="art"><div class="duo">${img('cut/area-51.webp', 'OVNI Area 51')}${img('cut/comete.webp', 'OVNI Comète')}</div></div><div>
  <h3>Les OVNI</h3><p class="sub">Les burgers venus d'ailleurs · pain pressé</p>
  <ul class="mlist">${ovnis.map((o) => row(o.name, 'dès 9,90 €', o.desc)).join('')}</ul>${fbox(formulas.ovni)}
  <h4>OVNI d'hiver</h4><ul class="mlist">${ovnisHiver.items.map((o) => row(o.name, '', o.desc)).join('')}${row('Menu Complet', ovnisHiver.menuComplet.price, ovnisHiver.menuComplet.detail)}${row('Area Express', ovnisHiver.areaExpress.price, ovnisHiver.areaExpress.detail)}</ul></div></article>`)
P.push(`<article class="panel"><div class="art"><div class="duo">${img('cut/churros.webp', 'Churros')}${img('cut/crepe-nutella.webp', 'Crêpe Nutella')}</div></div><div>
  <h3>La pause ultra gourmande</h3><p class="sub">Waffles, churros, crêpes et beignets</p>
  <ul class="mlist">${row('Bubble Waffle', '3,50 €', 'Base nature, chocolat ou matcha, à composer')}${desserts.churros.map((c) => row(c.name, c.price)).join('')}${desserts.crepes.map((c) => row(c.name, c.price)).join('')}${row('Beignet', desserts.beignets.price, desserts.beignets.flavours.join(' · '))}${row('La Pause Café', desserts.pauseCafe.price, desserts.pauseCafe.detail)}</ul>
  <p class="note">${desserts.crepeExtras}</p></div></article>`)
P.push(`<article class="panel"><div class="art"><div class="duo">${img('cut/dame-blanche.webp', 'Dame blanche')}${img('cut/fraise-melba.webp', 'Fraise Melba')}</div></div><div>
  <h3>Glaces</h3><p class="sub">${glaces.parfums.join(' · ')}</p>
  <ul class="mlist">${glaces.formats.map((f) => row(f.name, f.price)).join('')}</ul>
  <h4>Coupes les plus vendues</h4><ul class="mlist cols">${glaces.coupes.map((c) => row(c.name, c.price, c.desc)).join('')}</ul><p class="note">${glaces.note}</p></div></article>`)
P.push(`<article class="panel"><div class="art">${img('cut/pause-cafe.webp', 'Café et crêpe')}</div><div>
  <h3>Cafés &amp; chocolats</h3><p class="sub">Pour la pause café, sur place ou à emporter</p>
  <ul class="mlist cols">${boissonsChaudes.cafes.map(([a, b, t]) => row(a, b, '', t)).join('')}</ul>
  <h4>Chocolats chauds</h4><ul class="mlist">${boissonsChaudes.chocolats.map(([a, b, t]) => row(a, b, '', t)).join('')}</ul></div></article>`)
P.push(`<article class="panel"><div class="art"><div class="duo">${img('cut/bt-mangue.webp', 'Bubble tea mangue')}${img('cut/bt-fruits-rouges.webp', 'Bubble tea fruits rouges')}</div></div><div>
  <h3>Bubble tea &amp; boissons fraîches</h3><p class="sub">Base fruitée ou lactée · ${bubbleTea.sirops.length} sirops · perles fruitées ou tapioca</p>
  <ul class="mlist">${bubbleTea.formats.map((f) => row(`Bubble tea ${f.name.toLowerCase()} ${f.size}`, f.price)).join('')}
  ${boissonsFroides.map((d) => row(d.name, d.prices.map((p) => p[1]).join(' / '), `${d.items}${d.prices.length > 1 ? ' · 35 cl / 75 cl' : ''}`)).join('')}</ul></div></article>`)
$('[data-panels]').innerHTML = P.join('')

/* ---------- les chouchous : swipe deck ---------- */
function deck() {
  const box = $('[data-deck]'), dots = $('[data-deck-dots]'), n = favoris.length
  box.innerHTML = favoris.map((f, i) => `
    <article class="dcard" data-i="${i}" aria-roledescription="carte" aria-label="${f.rank} : ${f.name}">
      <span class="dc-rank">${f.rank} le plus aimé</span>
      <div class="dc-art photo"><img src="/img/${f.photo}" alt="${f.name}" width="960" height="640" decoding="async"></div>
      <h3 class="dc-name">${f.name}</h3>
      <p class="dc-text">${f.text}</p>
      <div class="dc-foot"><span class="dc-price">${f.price}<small>au kiosque</small></span><a class="dc-link" href="#carte">Voir la carte</a></div>
    </article>`).join('')
  const cards = [...box.children]
  if (reduced) { box.classList.add('list'); return }
  dots.innerHTML = cards.map(() => '<i></i>').join('')
  let cur = 0, busy = false
  const depth = (i) => (i - cur + n) % n
  function layout(anim = true) {
    cards.forEach((c, i) => {
      const d = depth(i)
      c.classList.toggle('top', d === 0)
      c.setAttribute('aria-hidden', String(d !== 0))
      c.querySelectorAll('a').forEach((a) => (a.tabIndex = d === 0 ? 0 : -1))
      gsap.to(c, { x: 0, y: d * 16, scale: 1 - d * 0.06, rotate: d === 0 ? 0 : d % 2 ? 4 : -4, zIndex: n - d, duration: anim ? 0.5 : 0, ease: 'back.out(1.4)' })
    })
    ;[...dots.children].forEach((dot, i) => dot.classList.toggle('on', i === cur))
  }
  // the top card flies out left or right (dir = -1 / 1), then goes to the back: always the next item
  function go(dir) {
    if (busy) return
    busy = true
    const top = cards[cur]
    gsap.to(top, { x: dir * innerWidth * 0.9, rotate: dir * 18, duration: 0.35, ease: 'power2.in', onComplete: () => {
      cur = (cur + 1) % n
      gsap.set(top, { x: 0, rotate: 0 })
      layout(); busy = false
    } })
  }
  const next = () => go(1), prev = () => { if (busy) return; cur = (cur - 1 + n) % n; layout() }
  $('[data-deck-next]').addEventListener('click', next)
  $('[data-deck-prev]').addEventListener('click', prev)
  box.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev() })

  // drag the top card with the finger (vertical scroll still works: touch-action pan-y)
  let sx = 0, sy = 0, dx = 0, drag = false, card = null
  box.addEventListener('pointerdown', (e) => {
    card = e.target.closest('.dcard.top')
    if (!card || busy || e.target.closest('a')) return
    sx = e.clientX; sy = e.clientY; dx = 0; drag = true
    card.setPointerCapture(e.pointerId)
  })
  box.addEventListener('pointermove', (e) => {
    if (!drag) return
    dx = e.clientX - sx
    if (Math.abs(e.clientY - sy) > Math.abs(dx) && Math.abs(dx) < 10) return
    gsap.set(card, { x: dx, rotate: dx / 18 })
  })
  const end = () => {
    if (!drag) return
    drag = false
    if (Math.abs(dx) > 80) go(Math.sign(dx))
    else gsap.to(card, { x: 0, rotate: 0, duration: 0.45, ease: 'back.out(2)' })
  }
  box.addEventListener('pointerup', end)
  box.addEventListener('pointercancel', end)
  layout(false)
}
deck()

fillInfo()
$('[data-ue]').innerHTML = surUber.map(([n, src]) => `<figure>${img(src, n)}<figcaption>${n}</figcaption></figure>`).join('')
// reviews twice for a seamless loop
$('[data-reviews]').innerHTML += $('[data-reviews]').innerHTML
$('[data-reviews]').querySelectorAll('.quote').forEach((q, i) => i >= 4 && q.setAttribute('aria-hidden', 'true'))

/* ---------- motion ---------- */
smoothScroll()
document.querySelectorAll('[data-words]').forEach((el) => {
  const html = el.innerHTML
  split(el)
  // keep the <em> styling on "croustille"
  if (html.includes('<em>')) el.querySelectorAll('.wi').forEach((w) => { if (/croustille/.test(w.textContent)) w.innerHTML = `<em>${w.textContent}</em>` })
})
reveals(); counters(); magnetic()

const nav = $('.nav')
ScrollTrigger.create({ start: 40, onToggle: (st) => nav.classList.toggle('solid', st.isActive) })

// phone order bar: slides up once the hero (and its scroll camera) is behind us
const bar = $('.order-bar')
ScrollTrigger.create({ trigger: '#compose', start: 'top 85%', onToggle: (st) => bar.classList.toggle('show', st.isActive || st.progress > 0), end: 'max' })

// steps light up when they reach the middle of the screen; untouched steps get a default
document.querySelectorAll('.bstep').forEach((li, i) => ScrollTrigger.create({
  trigger: li, start: 'top 62%', end: 'bottom 38%',
  onToggle: (st) => li.classList.toggle('on', st.isActive),
  onEnter: () => { if (!touched[i] && !sel[i]) { sel[i] = steps[i].choices[0]; update(i) } },
  onLeaveBack: () => { if (!touched[i] && i > 0) { sel[i] = null; update(i) } },
}))

if (!reduced) {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-txt > :not(h1)', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.15)
  heroCamera(heroTitle())

  const mm = gsap.matchMedia()
  mm.add('(min-width: 901px)', () => {
    const track = $('.panels')
    gsap.timeline({ scrollTrigger: { trigger: '.carte', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth), scrub: 0.6, pin: '.carte-pin', invalidateOnRefresh: true } })
      .to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none' }, 0)
      .to('.carte-progress span', { scaleX: 1, ease: 'none' }, 0)
    gsap.utils.toArray('.panel .art img:not(.art-photo)').forEach((im) => gsap.fromTo(im, { rotate: -8, scale: 0.85 }, { rotate: 4, scale: 1.05, ease: 'none',
      scrollTrigger: { trigger: '.carte', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth), scrub: true } }))
  })
  mm.add('(max-width: 900px)', () => {
    const track = $('.panels'), bar = $('.carte-progress span')
    const on = () => gsap.set(bar, { scaleX: track.scrollLeft / (track.scrollWidth - track.clientWidth || 1) })
    track.addEventListener('scroll', on, { passive: true })
    return () => track.removeEventListener('scroll', on)
  })

  gsap.utils.toArray('.reveal-img').forEach((f) => {
    gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 90%', end: 'top 30%', scrub: 0.6 } })
      .fromTo(f, { clipPath: 'inset(18% 22% 18% 22% round 26px)' }, { clipPath: 'inset(0% 0% 0% 0% round 26px)', ease: 'none' }, 0)
      .fromTo(f.querySelector('img'), { scale: 1.35 }, { scale: 1, ease: 'none' }, 0)
  })
  gsap.utils.toArray('.lieu [data-words] .wi').length && gsap.from('.lieu [data-words] .wi', {
    yPercent: 110, stagger: 0.04, duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: '.lieu', start: 'top 75%', once: true },
  })

  gsap.to('.avis-track', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })

  // round sign badge next to "Le kiosque": rolls in and turns a little with the scroll
  gsap.fromTo('.badge-lieu', { rotate: -60, scale: 0.6, x: 60 }, { rotate: 6, scale: 1, x: 0, ease: 'none',
    scrollTrigger: { trigger: '.lieu', start: 'top 90%', end: 'top 35%', scrub: 0.6 } })

  // new photo sections: soft fade-up
  gsap.utils.toArray('.tcard, .galerie figure').forEach((el) => gsap.from(el, {
    y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true },
  }))
}

if (reduced) document.documentElement.classList.add('no-camera')

/* ---------- hero scroll camera ----------
   The real photo zooms into the round Waffle Truck sign, then the sign "opens" on the bubble waffle scene.
   Sign position measured in each photo (natural pixels): x, y, radius. */
/* ---------- hero title "WAFFLE TRUCK" (KOS chose "Aspiré", 23 Nov 2026) ----------
   On load the letters bounce in. With the scroll camera, they spin and get pulled one by one
   into the round sign (cx, cy = where the sign is on screen at that moment). */
function heroTitle() {
  const h1 = $('#h1'), text = h1.textContent.trim()
  h1.setAttribute('aria-label', text)
  h1.innerHTML = text.split(' ').map((w) => `<span class="tw" aria-hidden="true">${[...w].map((c) => `<span class="tl">${c}</span>`).join('')}</span>`).join(' ')
  const L = [...h1.querySelectorAll('.tl')]
  const clamp = gsap.utils.clamp(0, 1), inE = gsap.parseEase('power2.in')
  const BASE = { x: 0, y: 0, yPercent: 0, scale: 1, scaleY: 1, rotate: 0, opacity: 1 }

  const intro = gsap.from(L, { yPercent: 120, scaleY: 1.7, rotate: (i) => (i % 2 ? 14 : -14), opacity: 0, transformOrigin: '50% 100%',
    duration: 1.2, ease: 'elastic.out(1, .5)', stagger: 0.05, delay: 0.25 })

  let live = false, pos = null
  const where = () => { // letter centres on screen with no transform (offsets ignore transforms)
    const box = $('.hero-txt').getBoundingClientRect()
    pos = L.map((el) => [box.left + el.offsetLeft + el.offsetWidth / 2, box.top + el.offsetTop + el.offsetHeight / 2])
  }
  addEventListener('resize', () => (pos = null))
  return function titleFrame(p, cx, cy) {
    if (p <= 0.002) { if (live) { gsap.set(L, BASE); live = false } return }
    if (!live) { intro.progress(1).kill(); gsap.set(L, BASE); live = true }
    if (!pos) where() // also after a resize mid-scroll (phone address bar, rotation)
    L.forEach((el, i) => {
      const k = clamp((p - i * 0.012) / 0.2), e = inE(k)
      gsap.set(el, { x: (cx - pos[i][0]) * e, y: (cy - pos[i][1]) * e, scale: 1 - 0.92 * e, rotate: (i % 2 ? 1 : -1) * 240 * e, opacity: 1 - clamp((k - 0.75) / 0.25) })
    })
  }
}

function heroCamera(titleFrame) {
  const SIGNS = { terrasse: [655, 276, 53], 'kiosque-grand-mail': [455.5, 359.5, 60] }
  const hero = $('.hero'), photo = $('.hero-photo img'), portal = $('.portal'), hint = $('.scroll-hint')
  const txt = $$('.hero-txt > :not(h1)'), waffle = $('.portal-waffle'), line = $('.portal-line'), tagsBox = $('.portal-tags')
  tagsBox.innerHTML = steps.map((st, i) => `<span class="ptag">${i === 0 ? 'Base' : ['Coulis', 'Glace', 'Topping', 'Fruits frais', 'Chantilly'][i - 1]} <b>${st.price}</b></span>`).join('')
  const tags = [...tagsBox.children]
  const clamp = gsap.utils.clamp(0, 1), inE = gsap.parseEase('power2.in'), ioE = gsap.parseEase('power2.inOut'), outE = gsap.parseEase('power3.out')
  const seg = (p, a, b) => clamp((p - a) / (b - a))
  let geo = null, last = 0

  function measure() {
    const key = Object.keys(SIGNS).find((k) => (photo.currentSrc || photo.src).includes(k))
    if (!key || !photo.naturalWidth) return (geo = null)
    const [X, Y, R] = SIGNS[key]
    const W = hero.clientWidth, H = hero.clientHeight, nw = photo.naturalWidth, nh = photo.naturalHeight
    const cs = Math.max(W / nw, H / nh)                     // object-fit: cover
    const ox = (W - nw * cs) * 0.5, oy = (H - nh * cs) * 0.45 // object-position: 50% 45%
    const sx = ox + X * cs, sy = oy + Y * cs, sr = R * cs
    const rOpen = 0.3 * Math.min(W, H)                      // sign radius on screen when the zoom ends
    geo = { W, H, sx, sy, sr, sMax: rOpen / sr, rCover: Math.hypot(W, H) / 2 + 10 }
  }

  function frame(p) {
    last = p
    if (!geo) return
    const { W, H, sx, sy, sr, sMax, rCover } = geo
    const z = inE(seg(p, 0, 0.55))              // fly to the sign
    const o = ioE(seg(p, 0.5, 0.78))            // the sign opens
    const S = (1 + (sMax - 1) * z) * (1 + 1.6 * o)
    const tx = (W / 2 - sx) * z, ty = (H / 2 - sy) * z
    gsap.set(photo, { transformOrigin: `${sx}px ${sy}px`, x: tx, y: ty, scale: S, filter: !isPhone() && S > 2.5 ? `blur(${Math.min(6, (S - 2.5) * 0.5).toFixed(1)}px)` : 'none' })
    const t = seg(p, 0, 0.14)
    gsap.set(txt, { opacity: 1 - t, y: -50 * t })
    hero.style.setProperty('--shade', String(1 - seg(p, 0, 0.3)))
    gsap.set(hint, { opacity: 1 - seg(p, 0, 0.06) })
    // portal = the white face of the sign, inside its rim
    const cx = sx + tx, cy = sy + ty, rFace = sr * S * 0.84
    titleFrame(p, cx, cy)
    const r = rFace + (rCover - rFace) * o
    const fade = seg(p, 0.32, 0.5)
    portal.style.visibility = fade > 0 ? 'visible' : 'hidden'
    portal.style.opacity = String(fade)
    portal.style.clipPath = `circle(${r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`
    const w = outE(seg(p, 0.58, 0.82))
    gsap.set(waffle, { scale: 0.55 + 0.45 * w, rotate: -14 * (1 - w), y: 60 * (1 - w) })
    tags.forEach((el, i) => { const k = outE(seg(p, 0.7 + i * 0.045, 0.78 + i * 0.045)); gsap.set(el, { opacity: k, y: 18 * (1 - k), scale: 0.9 + 0.1 * k }) })
    const l = outE(seg(p, 0.9, 1))
    gsap.set(line, { opacity: l, y: 20 * (1 - l) })
  }

  const st = ScrollTrigger.create({
    trigger: hero, start: 'top top', end: () => '+=' + Math.round(innerHeight * 2.2), pin: true, anticipatePin: 1, refreshPriority: 10,
    onUpdate: (self) => frame(self.progress),
    onRefresh: (self) => { measure(); frame(self.progress) },
  })
  const ready = () => { measure(); frame(st.progress) }
  photo.complete ? ready() : photo.addEventListener('load', ready, { once: true })
  addEventListener('resize', () => { measure(); frame(last) })
}

addEventListener('load', () => ScrollTrigger.refresh())
