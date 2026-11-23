// Single source of truth for the 3 demos. Copied from ../../menu-waffle-truck.md.
// Prices are strings in French format so they print exactly like the menu.

export const IMG = '/img/'

export const formulas = {
  sandwich: [
    { name: 'Seul', price: '9,90 €', detail: 'Sandwich uniquement' },
    { name: 'Menu', price: '12,90 €', detail: 'Sandwich + frites + boisson' },
    { name: 'Menu Gourmand', price: '15,90 €', detail: 'Menu + dessert + café', star: true },
  ],
  ovni: [
    { name: 'Seul', price: '9,90 €', detail: 'OVNI uniquement' },
    { name: 'Menu', price: '13,90 €', detail: 'OVNI + frites + boisson' },
    { name: 'Menu Gourmand', price: '16,90 €', detail: 'Menu + dessert + café', star: true },
  ],
  dessertChoice: 'Dessert au choix : crêpe Nutella, beignet ou coupe de glaces',
}

export const sandwiches = {
  bowls: [
    { name: 'Crousty Riz', price: '9,90 €', note: 'le bol', img: 'cut/crousty-riz.webp' },
    { name: 'Crousty Frites', price: '9,90 €', note: 'le bol', img: 'cut/crousty-frites.webp' },
  ],
  items: [
    { name: 'Kebab', desc: '', img: 'cut/kebab.webp' },
    { name: 'Poulet BBQ', desc: 'Sauce barbecue, salade, tomate, oignon', img: 'cut/poulet-bbq.webp' },
  ],
  kids: { name: 'Menu Enfant', price: '4 €', desc: 'Nuggets + frites + boisson' },
}

export const ovnis = [
  { name: 'Galaxie Kebab', desc: 'Viande kebab, salade, tomates, oignons rouges et sauce blanche', img: 'cut/galaxie-kebab.webp' },
  { name: 'Area 51', desc: 'Bœuf, cheddar, salade, tomates, oignons rouges et sauce Bigi', img: 'cut/area-51.webp' },
  { name: 'Comète', desc: 'Poulet croustillant, cheddar, salade, tomates, oignons rouges et sauce barbecue', img: 'cut/comete.webp' },
]

export const ovnisHiver = {
  items: [
    { name: 'Le Raclette', desc: 'Raclette fumée', img: 'cut/raclette.webp' },
    { name: 'Le Savoyard', desc: 'Reblochon de Savoie', img: 'cut/savoyard.webp' },
  ],
  menuComplet: { price: '14,50 €', detail: 'OVNI + frites + boisson froide + une boisson chaude au choix : expresso, allongé ou chocolat chaud' },
  areaExpress: { price: '9,90 €', detail: 'Sandwich + frites' },
}

export const bubbleWaffle = {
  base: 3.5,
  steps: [
    { n: 1, title: 'Choisis ta base', choices: ['Nature', 'Chocolat', 'Matcha'], price: '3,50 €', add: 3.5 },
    { n: 2, title: 'Ajoute un coulis', choices: ['Nutella', 'Chocolat', 'Caramel beurre salé', 'Fraise'], price: '+1,00 €', add: 1 },
    { n: 3, title: 'Ajoute une boule de glace', choices: ['Vanille', 'Chocolat', 'Fraise', 'Pistache', 'Café', 'Caramel', 'Coco'], price: '+1,80 €', add: 1.8 },
    { n: 4, title: 'Choisis ton topping', choices: ["M&M's", 'Oreo', 'Kinder Bueno', 'Spéculoos', 'Éclats de noisette', 'Kinder', 'Bueno White', 'Kit-Kat', 'Snickers'], price: '+1,20 €', add: 1.2 },
    { n: 5, title: 'Ajoute des fruits frais', choices: ['Banane', 'Mangue', 'Framboise', 'Fraise', 'Kiwi'], price: '+1,20 €', add: 1.2 },
    { n: 6, title: 'La touche Chantilly', choices: ['Chantilly'], price: '+1,50 €', add: 1.5 },
  ],
  tagline: 'Ta waffle, tes envies.',
  // Ready-made ideas shown with the kraft cups (23 Nov 2026). One value per step above
  // (null = step skipped); the price is computed from the steps, so it is always the kiosk price.
  idees: [
    { name: 'Oreo', img: 'cut/cup-1.webp', pick: ['Nature', 'Chocolat', 'Vanille', 'Oreo', null, 'Chantilly'] },
    { name: 'Fraise chantilly', img: 'cut/cup-2.webp', pick: ['Nature', 'Fraise', null, null, 'Fraise', 'Chantilly'] },
    { name: 'Choco noisette', img: 'cut/cup-3.webp', pick: ['Nature', 'Chocolat', 'Chocolat', 'Éclats de noisette', null, 'Chantilly'] },
    { name: 'Banane caramel', img: 'cut/cup-4.webp', pick: ['Nature', 'Caramel beurre salé', 'Vanille', null, 'Banane', 'Chantilly'] },
    { name: 'Fruits rouges', img: 'cut/cup-5.webp', pick: ['Nature', 'Fraise', 'Fraise', null, 'Framboise', 'Chantilly'] },
    { name: "M&M's", img: 'cut/cup-6.webp', pick: ['Nature', 'Chocolat', 'Vanille', "M&M's", null, 'Chantilly'] },
  ],
}

export const desserts = {
  churros: [{ name: 'Churros 6 pièces', price: '5,00 €' }, { name: 'Supplément Nutella', price: '+1,00 €' }],
  crepes: [{ name: 'Crêpe sucre', price: '3,00 €' }, { name: 'Crêpe Nutella', price: '4,00 €' }],
  crepeExtras: 'Suppléments +1 € chacun : Chantilly, Bueno, Banane',
  beignets: { price: '4,00 €', note: 'la pièce', flavours: ['Nutella', 'Abricot', 'Pomme'] },
  pauseCafe: { price: '4,00 €', detail: 'Café + crêpe au sucre' },
}

export const glaces = {
  note: 'Disponible à partir de 11h tous les jours.',
  parfums: ['Vanille', 'Chocolat', 'Fraise', 'Pistache', 'Café', 'Caramel', 'Coco'],
  scoopImg: ['boule-vanille', 'boule-chocolat', 'boule-fraise', 'boule-pistache', 'boule-cafe', 'boule-caramel', 'boule-coco'],
  formats: [{ name: '1 boule', price: '1,80 €' }, { name: '2 boules', price: '3,60 €' }, { name: '3 boules', price: '5,40 €' }],
  coupes: [
    { name: 'Dame Blanche', desc: 'Glace vanille, sauce chocolat, chantilly, amandes', price: '6,50 €', img: 'cut/dame-blanche.webp' },
    { name: 'Chocolat Liégeois', desc: 'Glace chocolat, sauce chocolat, chantilly, amandes', price: '6,50 €', img: 'cut/chocolat-liegeois.webp' },
    { name: 'Café Liégeois', desc: 'Glace café, sauce café, chantilly, amandes', price: '6,50 €', img: 'cut/cafe-liegeois.webp' },
    { name: 'Banana Split', desc: 'Glaces vanille, chocolat, fraise, banane, chantilly, sauce chocolat, amandes, cerise', price: '7,50 €', img: null },
    { name: 'Fraise Melba', desc: 'Glace vanille, coulis de fraise, fraises fraîches, chantilly, amandes', price: '7,50 €', img: 'cut/fraise-melba.webp' },
  ],
}

export const boissonsChaudes = {
  cafes: [
    ['Expresso', '1,30 €'], ['Noisette', '1,50 €'], ['Allongé', '1,60 €'], ['Double expresso', '2,60 €'],
    ['Cappuccino', '3,20 €'], ['Café latte', '3,20 €'], ['Macchiato Caramel', '4,80 €', 'Best seller'],
    ['Café vanille', '4,30 €'], ['Café latte noisette', '4,50 €'], ['Café caramel', '4,30 €'],
  ],
  chocolats: [
    ['Chocolat chaud', '4,00 €'], ['Nutella', '5,80 €'], ['Bueno', '5,80 €', 'Notre gourmandise'],
    ['Caramel', '4,80 €'], ['Chantilly', '4,50 €'],
  ],
}

export const bubbleTea = {
  bases: [{ name: 'Fruitée', note: 'fraîche & fruitée' }, { name: 'Lactée', note: 'douce & onctueuse' }],
  sirops: ['Fraise', 'Framboise', 'Cerise', 'Pêche', 'Mangue', 'Passion', 'Citron'],
  perles: ['Fraise', 'Framboise', 'Pêche', 'Passion', 'Mangue', 'Litchi', 'Tapioca'],
  formats: [{ name: 'Petit', size: '55 cl', price: '5,00 €' }, { name: 'Grand', size: '75 cl', price: '7,00 €' }],
}

export const boissonsFroides = [
  { name: 'Frappés', items: 'Café · Latte · Chocolat', prices: [['Petit 35 cl', '5,50 €'], ['Grand 75 cl', '7,00 €']], img: 'cut/frappe-chocolat.webp' },
  { name: 'Milkshakes gourmands', items: 'Bueno · Nutella Vanille · Oreo', prices: [['Petit 35 cl', '5,90 €'], ['Grand 75 cl', '7,90 €']], img: 'cut/milkshake-oreo.webp' },
  { name: 'Milkshakes classiques', items: 'Vanille · Chocolat · Caramel · Fraise · Café', prices: [['', '5,00 €']], img: 'cut/milkshake-1.webp' },
  { name: 'Citronnades', items: 'Citron · Fraise · Framboise', prices: [['Petit 35 cl', '5,00 €'], ['Grand 75 cl', '7,00 €']], img: 'cut/citronnade-3.webp' },
  { name: 'Thés glacés', items: 'Pêche · Passion · Mangue', prices: [['Petit 35 cl', '4,50 €'], ['Grand 75 cl', '6,00 €']], img: 'cut/the-glace-1.webp' },
]

export const euro = (n) => n.toFixed(2).replace('.', ',') + ' €'
