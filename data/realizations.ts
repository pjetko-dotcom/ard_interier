import { RealizationItem } from '../types';

export const realizations: RealizationItem[] = [
  // Bytový dizajn (Residential)
  {
    id: 1,
    image: 'images/realization-1.jpg',
    title: 'Moderná kuchyňa v rodinnom dome',
    category: 'Bytový dizajn',
    categoryKey: 'residential',
    location: 'Bratislava - Ružinov'
  },
  { 
    id: 2, 
    image: 'images/realization-2.jpg', 
    title: 'Vstavaná skriňa a chodba', 
    category: 'Úložné priestory', 
    categoryKey: 'residential',
    location: 'Pezinok' 
  },
  {
    id: 3,
    image: 'images/realization-3.jpg',
    title: 'Luxusná obývačka',
    category: 'Bytový dizajn',
    categoryKey: 'residential',
    location: 'Bratislava - Staré Mesto'
  },
  {
    id: 7,
    image: 'images/realization-7.jpg',
    title: 'Detská izba na mieru',
    category: 'Bytový dizajn',
    categoryKey: 'residential',
    location: 'Stupava'
  },
  {
    id: 9,
    image: 'images/realization-9.jpg',
    title: 'Kúpeľňový nábytok',
    category: 'Kúpeľne',
    categoryKey: 'residential',
    location: 'Bratislava - Koliba'
  },
  {
    id: 10,
    image: 'images/realization-10.jpg',
    title: 'Knižnica v podkroví',
    category: 'Interiér',
    categoryKey: 'residential',
    location: 'Modra'
  },
  { 
    id: 12, 
    image: 'images/realization-12.jpg', 
    title: 'Šatník walk-in', 
    category: 'Úložné priestory', 
    categoryKey: 'residential',
    location: 'Dunajská Lužná' 
  },

  // Kancelárie a verejné priestory (Commercial)
  {
    id: 4,
    image: 'images/realization-4.jpg',
    title: 'Kancelárske priestory Business',
    category: 'Kancelárie',
    categoryKey: 'commercial',
    location: 'Trnava'
  },
  {
    id: 6,
    image: 'images/realization-6.jpg',
    title: 'Interiér Reštaurácie a Baru',
    category: 'Verejné priestory',
    categoryKey: 'commercial',
    location: 'Bratislava'
  },
  {
    id: 8,
    image: 'images/realization-8.jpg',
    title: 'Recepcia hotela',
    category: 'Verejné priestory',
    categoryKey: 'commercial',
    location: 'Piešťany'
  },
  {
    id: 11,
    image: 'images/realization-11.jpg',
    title: 'Zasadacia miestnosť',
    category: 'Kancelárie',
    categoryKey: 'commercial',
    location: 'Bratislava'
  },
  {
    id: 13,
    image: 'images/realization-13.jpg', // Placeholder ID
    title: 'Zariadenie predajne',
    category: 'Obchodné priestory',
    categoryKey: 'commercial',
    location: 'Nitra'
  },
  { 
    id: 14, 
    image: 'images/realization-14.jpg', // Placeholder ID
    title: 'Advokátska kancelária', 
    category: 'Kancelárie', 
    categoryKey: 'commercial',
    location: 'Bratislava - Centrum' 
  },
];