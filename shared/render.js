import { info, reviews } from './info.js'
import { formulas } from './menu.js'

/** Fill every info hook: [data-maps] [data-tel] [data-address] [data-hours] [data-services] [data-reviews] [data-dessert] */
export function fillInfo() {
  document.querySelectorAll('[data-maps]').forEach((a) => { a.href = info.maps })
  document.querySelectorAll('[data-tel]').forEach((a) => {
    a.href = `tel:${info.tel}`
    if (!a.textContent.trim()) a.textContent = info.phone
    a.setAttribute('aria-label', `Appeler le ${info.phone}`)
  })
  document.querySelectorAll('[data-address]').forEach((el) => {
    el.innerHTML = `${info.address}<br>${info.city}<br><a href="tel:${info.tel}">${info.phone}</a>`
  })
  document.querySelectorAll('[data-hours]').forEach((t) => {
    const today = new Date().getDay() // 0 = Sunday
    const row = today === 0 ? 2 : today === 6 ? 1 : 0
    t.innerHTML = info.hours
      .map(([d, h], i) => `<tr${i === row ? ' class="today"' : ''}><th scope="row">${d}</th><td>${h}</td></tr>`)
      .join('')
  })
  document.querySelectorAll('[data-services]').forEach((el) => { el.textContent = info.services.join(' · ') })
  document.querySelectorAll('[data-socials]').forEach((el) => {
    el.innerHTML = (info.socials || []).map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join('')
  })
  document.querySelectorAll('[data-dessert]').forEach((el) => { el.textContent = formulas.dessertChoice })
  document.querySelectorAll('[data-reviews]').forEach((el) => {
    el.innerHTML = reviews.map((r) => `<figure class="quote"><blockquote>${r.text}</blockquote><figcaption>${r.who}</figcaption></figure>`).join('')
  })
}

/** Formula cards: Seul / Menu / Menu Gourmand */
export function fillFormulas() {
  document.querySelectorAll('[data-formulas]').forEach((el) => {
    const list = formulas[el.dataset.formulas]
    el.innerHTML = list
      .map((f) => `<div class="formula${f.star ? ' star' : ''}">
        ${f.star ? '<span class="badge">La pause complète</span>' : ''}
        <p class="f-name">${f.name}</p><p class="f-price">${f.price}</p><p class="f-detail">${f.detail}</p></div>`)
      .join('')
  })
}
