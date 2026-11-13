import type { Promotion } from './types.ts';

// Vigencias ilustrativas. Actualízalas por proyecto; no se desplazan con cada build.
export const promotions: Promotion[] = [
  {
    id: 'ritual-completo',
    name: 'El ritual completo',
    description:
      'Un corte que te representa. Una barba que lo acompaña. Tu momento completo en una sola visita.',
    kind: 'bundle',
    serviceIds: ['corte-clasico', 'barba'],
    value: 38000,
    period: { mode: 'dates', start: '2026-01-01', end: '2027-12-31' },
    conditions:
      'Corte clásico + diseño de barba. Sujeto a confirmación de cita. No acumulable con otras promociones.',
    image: '/images/ritual.jpg',
    imageAlt:
      'Navaja, brocha y herramientas de afeitado sobre una estación de barbería.',
  },
  {
    id: 'cuidado-especial',
    name: 'Un extra de cuidado',
    description:
      'Dale a tu cabello el cuidado que merece, con un precio especial.',
    kind: 'percentage',
    serviceIds: ['cuidado'],
    value: 20,
    period: { mode: 'dates', start: '2026-01-01', end: '2027-12-31' },
    conditions: 'Aplicable al servicio de cuidado capilar. No acumulable.',
    image: '/images/cuidado.svg',
    imageAlt: 'Ilustración de cuidado capilar.',
  },
  {
    id: 'fade-especial',
    name: 'Tu próximo fade',
    description: 'Estrena textura y un degradado preciso a precio especial.',
    kind: 'fixed',
    serviceIds: ['fade'],
    value: 29000,
    period: {
      mode: 'datetime',
      start: '2026-01-01T09:00',
      end: '2027-12-31T20:00',
    },
    conditions: 'Consulta disponibilidad por WhatsApp. No acumulable.',
    image: '/images/fade.svg',
    imageAlt: 'Ilustración de máquina de corte.',
  },
];
