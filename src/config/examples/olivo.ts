import { site } from '../site.ts';
import type { SiteConfig } from '../types.ts';

export const olivo: SiteConfig = {
  ...site,
  id: 'olivo',
  demo: true,
  ownerTimeZone: 'America/Tijuana',
  siteUrl: 'https://olivo.example',
  business: {
    ...site.business,
    name: 'Olivo Estudio',
    shortName: 'OLIVO',
    tagline: 'ESTILO CON RAÍCES',
    address: 'Avenida de los Olivos 18, Col. Centro',
    locality: 'Tijuana',
    region: 'Baja California',
    postalCode: '22000',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tijuana',
  },
  hero: {
    ...site.hero,
    eyebrow: 'ESTUDIO DE BARBERÍA',
    title: 'El detalle',
    accent: 'hace el estilo.',
    description:
      'Cortes con intención y cuidado en cada detalle. Un espacio cercano para encontrar tu mejor versión.',
  },
  theme: {
    ...site.theme,
    background: '#f1f2e9',
    surface: '#e3e7d8',
    ink: '#29362b',
    muted: '#586653',
    accent: '#476144',
    accentContrast: '#ffffff',
    border: '#ccd4c2',
  },
  sections: [
    { id: 'inicio', label: 'Inicio', visible: true },
    { id: 'contacto', label: 'Encuéntranos', visible: true },
    { id: 'servicios', label: 'Nuestro oficio', visible: true },
    { id: 'promociones', label: 'Promociones', visible: false },
  ],
  servicesView: 'cards',
  promotions: [],
  categoriesView: 'grouped',
  typography: { display: 'classic', body: 'dm-sans' },
  seo: {
    title: 'Olivo Estudio · Barbería en Tijuana',
    description:
      'Conoce los cortes, servicios y horarios de Olivo Estudio. Demostración alternativa de la plantilla.',
    shareImage: '/images/olivo-social.png',
  },
};
