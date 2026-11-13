import type { SiteConfig } from '../config/types.ts';
import { periodBounds, validDate, validTime } from './time.ts';
import { promotionPrice } from './business.ts';

/** Validación compartida por CLI y generación. Arroja diagnósticos y bloquea el build. */
export function validateConfig(config: SiteConfig): void {
  const errors: string[] = [];
  const require = (condition: boolean, message: string) => {
    if (!condition) errors.push(message);
  };
  const unique = (items: string[], label: string) =>
    require(new Set(items).size ===
      items.length, `${label}: identificadores duplicados`);
  const localAsset = (path: string) =>
    /^\/(?!\/)[\w/.-]+\.(avif|webp|png|jpg|jpeg|svg)$/.test(path) &&
    !path.includes('..');
  const ids = config.services.map((s) => s.id);
  if (config.business.logo)
    require(localAsset(
      config.business.logo,
    ), 'business.logo: usar una imagen local válida');
  let validZone = true;
  try {
    new Intl.DateTimeFormat('es-MX', {
      timeZone: config.ownerTimeZone,
    }).format();
  } catch {
    validZone = false;
    errors.push('ownerTimeZone: zona horaria IANA inválida');
  }
  require(/^[a-z0-9-]+$/.test(config.id), 'id: usar minúsculas y guiones');
  require(/^https:\/\/[^\s]+$/.test(
    config.siteUrl,
  ), 'siteUrl: se requiere URL HTTPS');
  try {
    const url = new URL(config.siteUrl);
    require(url.protocol === 'https:' &&
      !url.username &&
      !url.password, 'siteUrl: usar HTTPS sin credenciales');
    if (!config.demo)
      require(!url.hostname.endsWith('.example') &&
        url.hostname !==
          'example.com', 'siteUrl: sustituir el dominio de demostración antes de desactivar demo');
  } catch {
    errors.push('siteUrl: URL inválida');
  }
  if (!config.demo) {
    require(!/0{8,}$/.test(config.business.phone) &&
      !/0{8,}$/.test(
        config.business.whatsapp,
      ), 'Contacto: sustituir los números de demostración antes de desactivar demo');
  }
  require(/^https:\/\/(www\.)?(google\.com|maps\.google\.com|maps\.app\.goo\.gl)\//.test(
    config.business.mapsUrl,
  ), 'mapsUrl: usar enlace HTTPS de Google Maps');
  require(/^\+\d{8,15}$/.test(
    config.business.phone,
  ), 'phone: usar formato internacional + y dígitos');
  require(/^\d{8,15}$/.test(
    config.business.whatsapp,
  ), 'whatsapp: usar solo dígitos internacionales');
  for (const [key, value] of Object.entries(config.business))
    require(value.trim().length > 0, `business.${key}: no puede estar vacío`);
  for (const [key, value] of Object.entries(config.hero))
    require(value.trim().length > 0, `hero.${key}: no puede estar vacío`);
  for (const [key, value] of Object.entries(config.theme))
    require(/^#[\da-f]{6}$/i.test(
      value,
    ), `theme.${key}: usar color hexadecimal de seis dígitos`);
  require(config.seo.title.length > 0 &&
    config.seo.description.length >
      0, 'seo: título y descripción obligatorios');
  require(localAsset(config.hero.image) &&
    localAsset(
      config.seo.shareImage,
    ), 'Imágenes de portada y SEO: usar rutas locales válidas');
  require(['list', 'cards'].includes(
    config.servicesView,
  ), 'servicesView: usar list o cards');
  require(['grouped', 'filters'].includes(
    config.categoriesView,
  ), 'categoriesView: usar grouped o filters');
  require(['editorial', 'classic', 'sans'].includes(
    config.typography.display,
  ) &&
    ['dm-sans', 'system'].includes(
      config.typography.body,
    ), 'typography: variante de fuente inválida');
  for (const [section, fields] of Object.entries(config.content))
    for (const [field, value] of Object.entries(fields))
      require(value.trim().length >
        0, `content.${section}.${field}: no puede estar vacío`);
  unique(
    config.sections.map((s) => s.id),
    'sections',
  );
  require(config.sections.length > 0 &&
    config.sections.some(
      (s) => s.visible,
    ), 'sections: debe haber alguna sección visible');
  require(config.sections.every(
    (s) =>
      ['inicio', 'servicios', 'promociones', 'contacto'].includes(s.id) &&
      s.label.trim().length > 0,
  ), 'sections: identificador o etiqueta inválidos');
  unique(ids, 'services');
  require(ids.length > 0, 'services: agregar al menos un servicio');
  for (const service of config.services) {
    require(/^[a-z0-9-]+$/.test(
      service.id,
    ), `Servicio ${service.id}: id inválido`);
    require(service.name.trim().length > 0 &&
      service.category.trim().length > 0 &&
      service.description.trim().length >
        0, `Servicio ${service.id}: falta nombre, descripción o categoría`);
    require(Number.isSafeInteger(service.price) &&
      service.price > 0, `Servicio ${service.id}: precio positivo en centavos`);
    require(Number.isInteger(service.duration) &&
      service.duration >
        0, `Servicio ${service.id}: duración positiva en minutos`);
    require(localAsset(service.image) &&
      service.imageAlt.trim().length >
        0, `Servicio ${service.id}: imagen local y texto alternativo obligatorios`);
  }
  const intervals = (rows: [string, string][], label: string) => {
    const sorted = [...rows].sort(([a], [b]) => a.localeCompare(b));
    for (const [index, [start, end]] of sorted.entries()) {
      require(validTime(start) &&
        validTime(end) &&
        start < end, `${label}: intervalo inválido ${start}–${end}`);
      if (index > 0)
        require(sorted[index - 1]![1] <= start, `${label}: horarios solapados`);
    }
  };
  unique(
    config.schedule.weekly.map((d) => String(d.day)),
    'weekly',
  );
  require(config.schedule.weekly.length ===
    7, 'weekly: configurar los siete días (0=domingo)');
  for (const day of config.schedule.weekly) {
    require(Number.isInteger(day.day) &&
      day.day >= 0 &&
      day.day <= 6, 'weekly: día inválido');
    intervals(day.intervals, `Día ${day.day}`);
  }
  unique(
    config.schedule.exceptions.map((e) => e.date),
    'exceptions',
  );
  for (const exception of config.schedule.exceptions) {
    require(validDate(exception.date) &&
      exception.label.trim().length >
        0, `Excepción ${exception.date}: fecha/etiqueta inválida`);
    intervals(exception.intervals, `Excepción ${exception.date}`);
  }
  unique(
    config.promotions.map((p) => p.id),
    'promotions',
  );
  const periods: { id: string; ids: string[]; start: number; end: number }[] =
    [];
  for (const promotion of config.promotions) {
    const label = `Promoción ${promotion.id}`;
    require(/^[a-z0-9-]+$/.test(promotion.id) &&
      promotion.name.trim().length > 0 &&
      promotion.description.trim().length >
        0, `${label}: id, nombre o descripción inválidos`);
    require(['percentage', 'fixed', 'bundle'].includes(
      promotion.kind,
    ), `${label}: tipo inválido`);
    require(['dates', 'datetime'].includes(
      promotion.period.mode,
    ), `${label}: modalidad de fechas inválida`);
    unique(promotion.serviceIds, label);
    const referencesValid =
      promotion.serviceIds.length > 0 &&
      promotion.serviceIds.every((id) => ids.includes(id));
    require(referencesValid, `${label}: servicios inexistentes o vacíos`);
    require(promotion.kind === 'bundle'
      ? promotion.serviceIds.length >= 2
      : promotion.serviceIds.length ===
          1, `${label}: cantidad de servicios incompatible con el tipo`);
    require(Number.isSafeInteger(promotion.value) &&
      promotion.value > 0, `${label}: valor entero positivo requerido`);
    if (promotion.kind === 'percentage')
      require(promotion.value <= 100, `${label}: porcentaje máximo 100`);
    if (referencesValid) {
      const price = promotionPrice(promotion, config.services);
      require(price.price >= 0 &&
        price.price <
          price.original, `${label}: el precio debe ser menor al habitual`);
    }
    require(localAsset(promotion.image) &&
      promotion.imageAlt.trim().length >
        0, `${label}: imagen local y texto alternativo obligatorios`);
    if (validZone)
      try {
        const bounds = periodBounds(promotion.period, config.ownerTimeZone);
        require(bounds.start <
          bounds.end, `${label}: el inicio debe preceder al final`);
        periods.push({
          id: promotion.id,
          ids: promotion.serviceIds,
          ...bounds,
        });
      } catch (error) {
        errors.push(
          `${label}: ${error instanceof Error ? error.message : 'fecha inválida'}`,
        );
      }
  }
  for (let i = 0; i < periods.length; i++)
    for (let j = i + 1; j < periods.length; j++) {
      const a = periods[i]!,
        b = periods[j]!;
      require(!(
        a.start < b.end &&
        b.start < a.end &&
        a.ids.some((id) => b.ids.includes(id))
      ), `Promociones ${a.id} y ${b.id}: vigencias solapadas para un mismo servicio`);
    }
  for (const [label, template] of [
    ['generalMessage', config.business.generalMessage],
    ['serviceMessage', config.business.serviceMessage],
    ['promotionMessage', config.business.promotionMessage],
  ]) {
    const placeholders = [...template!.matchAll(/\{([^}]+)\}/g)].map(
      (match) => match[1],
    );
    require(placeholders.every((key) =>
      ['negocio', 'servicio', 'promocion'].includes(key!),
    ), `${label}: variables permitidas {negocio}, {servicio}, {promocion}`);
  }
  if (errors.length)
    throw new Error(
      `Configuración «${config.id}» inválida:\n- ${errors.join('\n- ')}`,
    );
}
