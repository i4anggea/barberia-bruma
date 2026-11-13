import type { SiteConfig } from './types.ts';

export const identity: Pick<
  SiteConfig,
  | 'id'
  | 'demo'
  | 'ownerTimeZone'
  | 'siteUrl'
  | 'business'
  | 'hero'
  | 'theme'
  | 'seo'
> = {
  id: 'bruma',
  demo: true,
  ownerTimeZone: 'America/Mexico_City',
  siteUrl: 'https://bruma.example',
  business: {
    name: 'Bruma Barbería',
    shortName: 'BRUMA',
    tagline: 'EL ARTE DE VERTE BIEN',
    address: 'Calle del Olivo 24, Col. Centro',
    locality: 'Ciudad de México',
    region: 'CDMX',
    postalCode: '06000',
    country: 'MX',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ciudad+de+Mexico',
    phone: '+520000000000',
    phoneDisplay: '55 0000 0000',
    whatsapp: '520000000000',
    generalMessage: 'Hola, me gustaría solicitar una cita en {negocio}.',
    serviceMessage:
      'Hola, me gustaría solicitar una cita para {servicio} en {negocio}.',
    promotionMessage:
      'Hola, me interesa la promoción «{promocion}» ({servicio}) en {negocio}. Me gustaría solicitar una cita.',
    closedMessage:
      'Ahora estamos fuera de horario. Déjanos un mensaje y te responderemos en nuestro próximo horario de atención.',
  },
  hero: {
    eyebrow: 'BARBERÍA · CUIDADO · ESTILO',
    title: 'Tu estilo.',
    accent: 'Nuestro oficio.',
    description:
      'Un buen corte no necesita prisa. Encuentra tu momento, toma asiento y deja el resto en nuestras manos.',
    image: '/images/barberia.jpg',
    imageAlt:
      'Sillón de barbería de cuero cálido frente a un espejo y una estación de madera.',
    imageNote: 'Un espacio para bajar el ritmo.',
  },
  theme: {
    background: '#f5f1e9',
    surface: '#ebe4d8',
    ink: '#282923',
    muted: '#626356',
    accent: '#97573c',
    accentContrast: '#ffffff',
    border: '#d8d1c4',
  },
  seo: {
    title: 'Bruma Barbería · Cortes, barba y un momento para ti',
    description:
      'Descubre los servicios, precios, promociones y horarios de Bruma Barbería. Solicita tu cita por WhatsApp. Demostración de plantilla.',
    shareImage: '/images/bruma-social.png',
  },
};
