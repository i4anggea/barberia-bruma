import type { Service } from './types.ts';

// Los importes se expresan en centavos de MXN: 28000 = $280.
export const services: Service[] = [
  {
    id: 'corte-clasico',
    name: 'Corte clásico',
    description:
      'Tijera, máquina y los detalles que hacen tu estilo. Incluye peinado.',
    category: 'Cortes',
    price: 28000,
    duration: 40,
    image: '/images/corte.svg',
    imageAlt: 'Ilustración de tijeras de barbería.',
  },
  {
    id: 'fade',
    name: 'Fade & textura',
    description: 'Degradado preciso y acabado con textura, hecho a tu medida.',
    category: 'Cortes',
    price: 32000,
    duration: 50,
    image: '/images/fade.svg',
    imageAlt: 'Ilustración de máquina de corte.',
  },
  {
    id: 'barba',
    name: 'Diseño de barba',
    description:
      'Perfilado, simetría y cuidado para una barba con personalidad.',
    category: 'Barba',
    price: 20000,
    duration: 30,
    image: '/images/barba.svg',
    imageAlt: 'Ilustración de navaja de barbería.',
  },
  {
    id: 'ritual',
    name: 'Afeitado tradicional',
    description: 'Toalla caliente, navaja y un ritual que se toma su tiempo.',
    category: 'Barba',
    price: 26000,
    duration: 40,
    image: '/images/ritual.svg',
    imageAlt: 'Ilustración de brocha y espuma de afeitado.',
  },
  {
    id: 'cuidado',
    name: 'Cuidado capilar',
    description: 'Limpieza e hidratación para darle un respiro a tu cabello.',
    category: 'Cuidado',
    price: 18000,
    duration: 25,
    image: '/images/cuidado.svg',
    imageAlt: 'Ilustración de frasco de cuidado capilar.',
  },
];
