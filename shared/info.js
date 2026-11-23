// Public info from Google Maps (15 Nov 2026). See ../../business-info.md
export const info = {
  name: 'Waffle Truck',
  slogan: 'Good food. Good mood.',
  promise: 'Fait maison tous les jours · Des produits de qualité',
  address: 'Grand Mail, 1040 Bd Saint-Vincent-de-Paul',
  city: '40990 Saint-Paul-lès-Dax',
  phone: '07 69 60 31 02',
  tel: '+33769603102',
  maps: 'https://maps.app.goo.gl/bZzdWJZgccyrbjD76',
  rating: 4.3,
  reviews: 220,
  since: 2019,
  hours: [
    ['Lundi – Vendredi', '11h – 18h30'],
    ['Samedi', '11h – 18h30'],
    ['Dimanche', 'Fermé'],
  ],
  services: ['Sur place', 'À emporter', 'Livraison'],
  // Uber Eats store page, read 23 Nov 2026. Uber prices are higher than the kiosk: never show them here.
  uberEats: 'https://www.ubereats.com/fr/store/waffle-truck/DHx6ysFpVGKnBqg_wTnE5w',
  delivery: '12h – 21h45',
  tickets: ['Ticket Restaurant', 'Swile', 'UpDéjeuner', 'Bimpli'],
  // given by KOS, 20 Nov 2026
  socials: [
    ['Instagram', 'https://www.instagram.com/waffletruck/'],
    ['Facebook', 'https://www.facebook.com/Waffletruck40'],
  ],
}

// "Les chouchous": the 3 most loved items on Uber Eats (23 Nov 2026), in that order.
// Kiosk price only when the kiosk menu has it (menu.js); never the Uber price.
export const favoris = [
  { rank: 'N°1', name: 'Crousty Frites', text: 'Frites maison, poulet crousty, sauce cheddar et sauce blanche, oignons frits.', price: '9,90 €', img: ['cut/crousty-frites.webp'] },
  { rank: 'N°2', name: 'Bubble Banane Nutella', text: 'La bubble waffle croustillante, Nutella et banane fraîche.', price: '5,70 €', img: ['cut/bubble-banane-cup.webp'] }, // 5,70 = base 3,50 + coulis Nutella 1 + fruits 1,20
  { rank: 'N°3', name: 'Menu Kebab', text: 'Le kebab avec salade, tomates, oignons et sauce au choix. Frites maison et boisson.', price: '12,90 €', img: ['cut/kebab.webp', 'cut/frites-box.webp'] },
]

// Short paraphrases of public Google reviews (not verbatim quotes).
export const reviews = [
  { text: 'Les OVNI sont top : le pain pressé et le fromage fondu font toute la différence.', who: 'Avis Google' },
  { text: 'Une équipe super sympa, on revient avec plaisir.', who: 'Avis Google' },
  { text: 'Les trompe-l’œil sont aussi beaux que bons. Une vraie découverte.', who: 'Avis Google' },
  { text: 'Parfait pour une pause goûter, les boissons chaudes sont excellentes.', who: 'Avis Google' },
]
