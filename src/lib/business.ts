import type {
  Promotion,
  Schedule,
  Service,
  SiteConfig,
} from '../config/types.ts';
import { localParts, periodBounds, readableDate } from './time.ts';

export const dayNames = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
export const money = (cents: number): string =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);

export function promotionPrice(promotion: Promotion, services: Service[]) {
  const original = promotion.serviceIds.reduce(
    (sum, id) => sum + services.find((service) => service.id === id)!.price,
    0,
  );
  const price =
    promotion.kind === 'percentage'
      ? Math.round((original * (100 - promotion.value)) / 100)
      : promotion.value;
  return {
    original,
    price,
    discount: Math.round(((original - price) / original) * 100),
  };
}

export function discountLabel(
  promotion: Promotion,
  services: Service[],
): string {
  const { original, price, discount } = promotionPrice(promotion, services);
  const approximate = ((original - price) * 100) % original !== 0;
  return `${approximate ? '≈ ' : ''}${discount}%`;
}

export function activePromotions(
  config: SiteConfig,
  now = new Date(),
): Promotion[] {
  return config.promotions.filter((promotion) => {
    const { start, end } = periodBounds(promotion.period, config.ownerTimeZone);
    return now.getTime() >= start && now.getTime() < end;
  });
}

export function businessStatus(
  schedule: Schedule,
  timeZone: string,
  now = new Date(),
) {
  const parts = localParts(now, timeZone);
  const day = new Date(`${parts.date}T12:00:00Z`).getUTCDay();
  const exception = schedule.exceptions.find(
    (item) => item.date === parts.date,
  );
  const intervals =
    exception?.intervals ??
    schedule.weekly.find((item) => item.day === day)?.intervals ??
    [];
  return {
    open: intervals.some(
      ([start, end]) => parts.time >= start && parts.time < end,
    ),
    date: parts.date,
    day,
    intervals,
    exception,
  };
}

export function promotionPeriod(promotion: Promotion): string {
  const { start, end, mode } = promotion.period;
  if (mode === 'dates') return `${readableDate(start)} — ${readableDate(end)}`;
  return `${readableDate(start)} ${start.slice(11)} — ${readableDate(end)} ${end.slice(11)}`;
}

export function renderMessage(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(
    /\{(\w+)\}/g,
    (_match, key: string) => values[key] ?? '',
  );
}

export function contactLink(
  config: SiteConfig,
  service?: Service,
  promotion?: Promotion,
): string {
  const template = promotion
    ? config.business.promotionMessage
    : service
      ? config.business.serviceMessage
      : config.business.generalMessage;
  const message = renderMessage(template, {
    negocio: config.business.name,
    servicio:
      service?.name ??
      promotion?.serviceIds
        .map((id) => config.services.find((s) => s.id === id)!.name)
        .join(' + ') ??
      '',
    promocion: promotion?.name ?? '',
  });
  return `https://wa.me/${config.business.whatsapp}?text=${encodeURIComponent(message)}`;
}
