import { gsap, ScrollTrigger, reduced, isPhone, smoothScroll, split, reveals, counters, magnetic, img } from '../shared/motion.js'
import { fillInfo, fillFormulas } from '../shared/render.js'
import { ovnis, ovnisHiver, sandwiches, bubbleWaffle, boissonsFroides, boissonsChaudes, bubbleTea, desserts, glaces, euro } from '../shared/menu.js'

const $ = (s, r = document) => r.querySelector(s)
const li = (a, b, tag = '') => `<li><span>${a}${tag ? `<em class="tag">${tag}</em>` : ''}</span><span>${b}</span></li>`

/* ---------- render ---------- */
$('.track').innerHTML = Array(3).fill('<span>Good food.</span><span>Good mood.</span><span>OVNI</span><span>Bubble waffle</span><span>Bubble tea</span>').join('')

$('[data-ovni]').innerHTML = ovnis.map((o, i) => `
  <article class="ovni"><span class="code">OVNI-0${i + 1}</span>${img(o.img, o.name)}
  <h3>${o.name}</h3><p>${o.desc}</p></article>`).join('')

$('[data-winter]').innerHTML = ovnisHiver.items.map((o) => `<li><b>${o.name}</b> — ${o.desc}</li>`).join('')
$('[data-winter-menus]').innerHTML = `
  <span class="pill"><b>${ovnisHiver.menuComplet.price}</b>Menu Complet : ${ovnisHiver.menuComplet.detail}</span>
  <span class="pill"><b>${ovnisHiver.areaExpress.price}</b>Area Express : ${ovnisHiver.areaExpress.detail}</span>`
$('[data-winter-img]').innerHTML = ovnisHiver.items.map((o) => img(o.img, o.name)).join('')

$('[data-savory]').innerHTML = [
  ...sandwiches.bowls.map((b) => `<article class="card">${img(b.img, b.name)}<h3>${b.name}</h3><p>Bowl croustillant</p><p class="price">${b.price} <small>${b.note}</small></p></article>`),
  ...sandwiches.items.map((s) => `<article class="card">${img(s.img, 'Sandwich ' + s.name)}<h3>${s.name}</h3><p>${s.desc || 'Le classique, généreux'}</p><p class="price">dès 9,90 €</p></article>`),
].join('')
$('[data-kids]').innerHTML = `<b>${sandwiches.kids.name} ${sandwiches.kids.price}</b><span>${sandwiches.kids.desc}</span>`

const angle = (i) => (i / 6) * Math.PI * 2 - Math.PI / 2
$('[data-steps]').innerHTML = bubbleWaffle.steps.map((s, i) => {
  const R = isPhone() ? 36 : 47
  const x = 50 + R * Math.cos(angle(i)), y = 50 + R * Math.sin(angle(i))
  return `<li class="step" style="left:${x}%;top:${y}%"><span class="n">${s.n}</span><b>${s.title}</b><span class="p">${s.price}</span><span class="c">${s.choices.join(', ')}</span></li>`
}).join('')

const bt = `<article class="drink wide"><div class="imgs">${img('cut/bt-mangue.webp', 'Bubble tea mangue')}${img('cut/bt-lacte.webp', 'Bubble tea lacté')}${img('cut/bt-fruits-rouges.webp', 'Bubble tea fruits rouges')}</div>
  <h3>Bubble Tea</h3><p>Base ${bubbleTea.bases.map((b) => `${b.name.toLowerCase()} (${b.note})`).join(' ou ')}. Sirops : ${bubbleTea.sirops.join(', ')}. Perles : ${bubbleTea.perles.join(', ')}.</p>
  <ul>${bubbleTea.formats.map((f) => li(`${f.name} ${f.size}`, f.price)).join('')}</ul></article>`
const cold = boissonsFroides.map((d) => `<article class="drink"><div class="imgs">${img(d.img, d.name)}</div><h3>${d.name}</h3><p>${d.items}</p>
  <ul>${d.prices.map(([a, b]) => li(a || 'Le verre', b)).join('')}</ul></article>`).join('')
const hot = `<article class="drink wide"><div class="imgs">${img('cut/frappe-latte.webp', 'Café gourmand')}</div><h3>Cafés</h3><ul>${boissonsChaudes.cafes.map(([a, b, t]) => li(a, b, t)).join('')}</ul></article>
  <article class="drink"><div class="imgs">${img('cut/frappe-chocolat.webp', 'Chocolat chaud')}</div><h3>Chocolats chauds</h3><ul>${boissonsChaudes.chocolats.map(([a, b, t]) => li(a, b, t)).join('')}</ul></article>`
$('[data-drinks]').innerHTML = bt + hot + cold

$('[data-desserts]').innerHTML = `
  <article class="card">${img('cut/churros.webp', 'Churros')}<h3>Churros</h3><ul>${desserts.churros.map((c) => li(c.name, c.price)).join('')}</ul></article>
  <article class="card">${img('cut/crepe-nutella.webp', 'Crêpe Nutella banane')}<h3>Crêpes</h3><ul>${desserts.crepes.map((c) => li(c.name, c.price)).join('')}</ul><p style="margin-top:8px">${desserts.crepeExtras}</p></article>
  <article class="card">${img('cut/beignets.webp', 'Beignets')}<h3>Beignets</h3><p>${desserts.beignets.flavours.join(' · ')}</p><p class="price">${desserts.beignets.price} <small>${desserts.beignets.note}</small></p></article>
  <article class="card">${img('cut/pause-cafe.webp', 'Café et crêpe au sucre')}<h3>La Pause Café</h3><p>${desserts.pauseCafe.detail}</p><p class="price">${desserts.pauseCafe.price}</p></article>`
$('[data-glace-note]').textContent = glaces.note
$('[data-scoops]').innerHTML = glaces.parfums.map((p, i) => `<div class="scoop">${img(`cut/${glaces.scoopImg[i]}.webp`, `Glace ${p}`)}${p}</div>`).join('')
$('[data-glace-formats]').innerHTML = glaces.formats.map((f) => `<span class="pill"><b>${f.price}</b>${f.name}</span>`).join('')
$('[data-coupes]').innerHTML = glaces.coupes.map((c) => `<article class="coupe">${c.img ? img(c.img, c.name) : `<div class="trio" aria-hidden="true">${['vanille', 'chocolat', 'fraise'].map((p) => img(`cut/boule-${p}.webp`, '')).join('')}</div>`}<h3>${c.name}</h3><p>${c.desc}</p><p class="price">${c.price}</p></article>`).join('')

fillInfo()
fillFormulas()

/* ---------- starfield ---------- */
const cv = $('.stars'), ctx = cv.getContext('2d')
let W, H, stars, speed = 0.15, visible = true
function size() {
  const dpr = Math.min(devicePixelRatio, 2)
  W = cv.width = cv.offsetWidth * dpr; H = cv.height = cv.offsetHeight * dpr
  stars = Array.from({ length: isPhone() ? 140 : 260 }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * 0.9 + 0.1 }))
}
function draw() {
  ctx.clearRect(0, 0, W, H)
  for (const s of stars) {
    s.y += speed * s.z * 6
    if (s.y > H) { s.y = 0; s.x = Math.random() * W }
    const len = Math.max(1, speed * s.z * 14)
    ctx.fillStyle = s.z > 0.75 ? '#c6ff3d' : `rgba(255,243,224,${s.z})`
    ctx.fillRect(s.x, s.y, s.z * 2, len)
  }
}
size(); draw()
addEventListener('resize', size)
if (!reduced) {
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(cv)
  gsap.ticker.add(() => visible && draw())
  ScrollTrigger.create({ onUpdate: (st) => { speed = gsap.utils.clamp(0.15, 4, Math.abs(st.getVelocity()) / 600) } })
  gsap.ticker.add(() => { speed += (0.15 - speed) * 0.04 })
}

/* ---------- motion ---------- */
smoothScroll()
document.querySelectorAll('[data-split]').forEach((el) => split(el, el.tagName === 'H1'))
reveals()
counters()
magnetic()

if (!reduced) {
  // hero intro: letters + UFO arrives and hovers
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
  intro.from('.title .ch', { yPercent: 120, rotate: 12, duration: 1.1, stagger: 0.025 })
    .from('.hero .kicker, .hero .lead, .hero .cta-row', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=.8')
    .from('.ufo', { yPercent: -160, rotate: -18, scale: 0.6, duration: 1.8, ease: 'power4.out' }, 0.1)
  gsap.to('.ufo', { y: -14, rotate: 2, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.9 })

  // scroll: the beam turns on, the UFO lands, text drifts away
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=90%', scrub: 0.6, pin: true } })
    .to('.beam', { opacity: 1, scaleY: 1, duration: 1 }, 0)
    .fromTo('.beam', { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
    .to('.ground', { opacity: 1, duration: 1 }, 0.4)
    .to('.ufo-wrap', { yPercent: 12, scale: 1.08, duration: 1 }, 0)
    .to('.hero-inner', { yPercent: -18, opacity: 0.15, duration: 1 }, 0.3)

  // marquee follows scroll speed
  const mq = gsap.to('.track', { xPercent: -33.333, duration: 22, ease: 'none', repeat: -1 })
  ScrollTrigger.create({ onUpdate: (st) => gsap.to(mq, { timeScale: 1 + Math.min(Math.abs(st.getVelocity()) / 400, 5), duration: 0.2, overwrite: true, onComplete: () => gsap.to(mq, { timeScale: 1, duration: 1 }) }) })

  // section titles: words rise
  gsap.utils.toArray('.sec-head [data-split]').forEach((h) => gsap.from(h.querySelectorAll('.wi'), {
    yPercent: 110, duration: 0.9, ease: 'power4.out', stagger: 0.05, scrollTrigger: { trigger: h, start: 'top 85%', once: true },
  }))

  // OVNI cards fly in on an orbit + pointer tilt
  gsap.from('.ovni', {
    y: 160, x: (i) => (i - 1) * 120, rotateX: -50, rotateZ: (i) => (i - 1) * 10, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.12,
    scrollTrigger: { trigger: '.ovni-cards', start: 'top 80%', once: true },
  })
  if (matchMedia('(hover: hover)').matches) document.querySelectorAll('.ovni').forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect()
      gsap.to(c, { rotateY: ((e.clientX - r.left) / r.width - 0.5) * 16, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 16, duration: 0.4 })
    })
    c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,.5)' }))
  })
  gsap.from('.formula', { y: 40, opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.8, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.formulas', start: 'top 85%', once: true } })

  // planet: pinned, steps light up one by one, total counts up
  const steps = gsap.utils.toArray('.step'), totalEl = $('[data-total]')
  let last = -1
  gsap.timeline({
    scrollTrigger: {
      trigger: '.planet', start: 'top top', end: '+=260%', scrub: 0.5, pin: '.planet-pin',
      onUpdate: (st) => {
        const k = Math.min(5, Math.floor(st.progress * 6.2))
        if (k === last) return
        last = k
        steps.forEach((s, i) => s.classList.toggle('on', i <= k))
        totalEl.textContent = euro(bubbleWaffle.steps.slice(0, k + 1).reduce((t, s) => t + s.add, 0))
      },
    },
  })
    .fromTo('.planet-img', { scale: 0.55, rotate: -30 }, { scale: 1.05, rotate: 8, ease: 'none' }, 0)
    .to('.ring', { rotate: 120, ease: 'none' }, 0)
    .from('.step', { scale: 0, opacity: 0, stagger: 0.12, ease: 'back.out(2)', duration: 0.3 }, 0)

  // drinks galaxy: vertical scroll drives a horizontal track
  const track = $('.hz-track')
  gsap.to(track, {
    x: () => -(track.scrollWidth - innerWidth), ease: 'none',
    scrollTrigger: { trigger: '.hz', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth), scrub: 0.6, pin: '.hz-pin', invalidateOnRefresh: true },
  })

  // scoops float
  gsap.utils.toArray('.scoop img').forEach((s, i) => gsap.to(s, { y: -10, duration: 1.6 + (i % 3) * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.15 }))

  // porthole: image zooms out as it enters
  gsap.fromTo('.porthole img', { scale: 1.5 }, { scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.porthole', start: 'top bottom', end: 'bottom top', scrub: true } })
} else {
  document.querySelectorAll('.step').forEach((s) => s.classList.add('on'))
  $('[data-total]').textContent = euro(bubbleWaffle.steps.reduce((t, s) => t + s.add, 0))
}

addEventListener('load', () => ScrollTrigger.refresh())
