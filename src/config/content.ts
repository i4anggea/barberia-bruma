import type { SiteConfig } from './types.ts';

export const content: SiteConfig['content'] = {
  services: {
    eyebrow: '01 / NUESTRO OFICIO',
    title: 'Lo que hacemos,',
    accent: 'lo hacemos bien.',
    description:
      'Cortes que hablan de ti. Rituales que se disfrutan.\nEncuentra tu servicio y déjanos cuidar el detalle.',
    note: 'Precios en pesos mexicanos. Cada cita se confirma personalmente por WhatsApp.',
  },
  promotions: {
    eyebrow: '02 / ALGO ESPECIAL PARA TI',
    title: 'Más cuidado.',
    accent: 'Un mejor momento.',
    description:
      'Pequeñas razones para volver.\nConoce nuestras promociones de temporada.',
    empty:
      'Próximamente nuevas promociones. Mientras tanto, encuentra tu próximo servicio.',
  },
  contact: {
    eyebrow: '03 / AQUÍ NOS ENCONTRAMOS',
    title: 'Tu próxima pausa',
    accent: 'empieza aquí.',
    description:
      'Ven por un corte. Quédate por la experiencia.\nNos dará gusto recibirte.',
  },
};
