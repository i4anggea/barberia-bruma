import { identity } from './identity.ts';
import { services } from './services.ts';
import { promotions } from './promotions.ts';
import { schedule } from './schedule.ts';
import { content } from './content.ts';
import type { SiteConfig } from './types.ts';

export const site: SiteConfig = {
  ...identity,
  content,
  typography: { display: 'editorial', body: 'dm-sans' },
  sections: [
    { id: 'inicio', visible: true, label: 'Inicio' },
    { id: 'servicios', visible: true, label: 'Servicios' },
    { id: 'promociones', visible: true, label: 'Promociones' },
    { id: 'contacto', visible: true, label: 'Visítanos' },
  ],
  servicesView: 'list',
  categoriesView: 'filters',
  services,
  promotions,
  schedule,
};
