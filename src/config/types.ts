export type SectionId = 'inicio' | 'servicios' | 'promociones' | 'contacto';
export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  image: string;
  imageAlt: string;
}
export interface Promotion {
  id: string;
  name: string;
  description: string;
  kind: 'percentage' | 'fixed' | 'bundle';
  serviceIds: string[];
  value: number;
  period: { mode: 'dates' | 'datetime'; start: string; end: string };
  conditions: string;
  image: string;
  imageAlt: string;
}
export interface DayHours {
  day: number;
  intervals: [string, string][];
}
export interface Schedule {
  weekly: DayHours[];
  exceptions: { date: string; label: string; intervals: [string, string][] }[];
}
export interface SiteConfig {
  id: string;
  demo: boolean;
  ownerTimeZone: string;
  siteUrl: string;
  business: {
    name: string;
    shortName: string;
    tagline: string;
    logo?: string;
    address: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    mapsUrl: string;
    phone: string;
    phoneDisplay: string;
    whatsapp: string;
    generalMessage: string;
    serviceMessage: string;
    promotionMessage: string;
    closedMessage: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    image: string;
    imageAlt: string;
    imageNote: string;
  };
  theme: {
    background: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    accentContrast: string;
    border: string;
  };
  sections: { id: SectionId; visible: boolean; label: string }[];
  servicesView: 'list' | 'cards';
  categoriesView: 'grouped' | 'filters';
  services: Service[];
  promotions: Promotion[];
  schedule: Schedule;
  seo: { title: string; description: string; shareImage: string };
  typography: {
    display: 'editorial' | 'classic' | 'sans';
    body: 'dm-sans' | 'system';
  };
  content: {
    services: {
      eyebrow: string;
      title: string;
      accent: string;
      description: string;
      note: string;
    };
    promotions: {
      eyebrow: string;
      title: string;
      accent: string;
      description: string;
      empty: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      accent: string;
      description: string;
    };
  };
}
