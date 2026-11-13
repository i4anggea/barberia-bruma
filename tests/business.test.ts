import { test } from 'node:test';
import assert from 'node:assert/strict';
import { site } from '../src/config/site.ts';
import { olivo } from '../src/config/examples/olivo.ts';
import { validateConfig } from '../src/lib/validate.ts';
import {
  activePromotions,
  businessStatus,
  contactLink,
  money,
  promotionPrice,
  discountLabel,
} from '../src/lib/business.ts';
import {
  localParts,
  periodBounds,
  validDate,
  zonedEpoch,
} from '../src/lib/time.ts';

const clone = () => structuredClone(site);

test('el ahorro redondeado se identifica como aproximado', () => {
  assert.equal(discountLabel(site.promotions[0]!, site.services), '≈ 21%');
  assert.equal(discountLabel(site.promotions[1]!, site.services), '20%');
});

test('una entrega real bloquea dominio y contacto de demostración', () => {
  const config = clone();
  config.demo = false;
  assert.throws(() => validateConfig(config), /dominio de demostración/);
  config.siteUrl = 'https://cliente.invalid';
  assert.throws(() => validateConfig(config), /números de demostración/);
  config.business.phone = '+525512345678';
  config.business.whatsapp = '525512345678';
  assert.doesNotThrow(() => validateConfig(config));
});

test('ambas configuraciones son válidas y tienen variantes diferentes', () => {
  assert.doesNotThrow(() => validateConfig(site));
  assert.doesNotThrow(() => validateConfig(olivo));
  assert.notEqual(site.servicesView, olivo.servicesView);
  assert.notDeepEqual(site.sections, olivo.sections);
});

test('una fecha local se interpreta en la zona del dueño', () => {
  assert.equal(
    new Date(
      zonedEpoch('2026-10-23T10:00', 'America/Mexico_City'),
    ).toISOString(),
    '2026-10-23T16:00:00.000Z',
  );
  assert.equal(
    new Date(zonedEpoch('2026-10-23T10:00', 'America/Tijuana')).toISOString(),
    '2026-10-23T17:00:00.000Z',
  );
});

test('el mismo instante da fechas distintas según la zona configurada', () => {
  const instant = new Date('2026-10-24T06:30:00Z');
  assert.equal(localParts(instant, 'America/Mexico_City').date, '2026-10-24');
  assert.equal(localParts(instant, 'America/Tijuana').date, '2026-10-23');
});

test('vigencia por días incluye todo el último día en la zona del dueño', () => {
  const config = clone();
  config.promotions = [
    {
      ...config.promotions[0]!,
      period: { mode: 'dates', start: '2026-10-23', end: '2026-10-23' },
    },
  ];
  assert.equal(
    activePromotions(config, new Date('2026-10-23T05:59:59Z')).length,
    0,
  );
  assert.equal(
    activePromotions(config, new Date('2026-10-23T06:00:00Z')).length,
    1,
  );
  assert.equal(
    activePromotions(config, new Date('2026-10-24T05:59:59Z')).length,
    1,
  );
  assert.equal(
    activePromotions(config, new Date('2026-10-24T06:00:00Z')).length,
    0,
  );
});

test('vigencia con hora exacta tiene inicio inclusivo y fin exclusivo', () => {
  const config = clone();
  config.promotions = [
    {
      ...config.promotions[0]!,
      period: {
        mode: 'datetime',
        start: '2026-10-23T10:00',
        end: '2026-10-23T11:00',
      },
    },
  ];
  assert.equal(
    activePromotions(config, new Date('2026-10-23T15:59:59Z')).length,
    0,
  );
  assert.equal(
    activePromotions(config, new Date('2026-10-23T16:00:00Z')).length,
    1,
  );
  assert.equal(
    activePromotions(config, new Date('2026-10-23T17:00:00Z')).length,
    0,
  );
});

test('la duración de un día respeta el cambio horario de la zona del dueño', () => {
  const bounds = periodBounds(
    { mode: 'dates', start: '2026-11-01', end: '2026-11-01' },
    'America/Tijuana',
  );
  assert.equal((bounds.end - bounds.start) / 3_600_000, 25);
});

test('horas inexistentes o ambiguas por cambio horario se rechazan', () => {
  assert.throws(
    () => zonedEpoch('2026-03-08T02:30', 'America/Tijuana'),
    /inexistente o ambigua/,
  );
  assert.throws(
    () => zonedEpoch('2026-11-01T01:30', 'America/Tijuana'),
    /inexistente o ambigua/,
  );
});

test('fechas imposibles y zonas inválidas bloquean la configuración', () => {
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2028-02-29'), true);
  let config = clone();
  config.ownerTimeZone = 'zona/inventada';
  assert.throws(() => validateConfig(config), /zona horaria/);
  config = clone();
  config.promotions[0]!.period.end = '2026-02-30';
  assert.throws(() => validateConfig(config), /fechas/);
});

test('paquetes y descuentos individuales no pueden solaparse por servicio', () => {
  const config = clone();
  config.promotions.push({
    ...config.promotions[0]!,
    id: 'conflicto',
    kind: 'percentage',
    value: 10,
    serviceIds: ['corte-clasico'],
  });
  assert.throws(() => validateConfig(config), /vigencias solapadas/);
});

test('promociones consecutivas sin solapamiento son válidas', () => {
  const config = clone();
  config.promotions = [
    {
      ...config.promotions[0]!,
      period: { mode: 'dates', start: '2026-10-01', end: '2026-10-15' },
    },
    {
      ...config.promotions[0]!,
      id: 'segunda',
      period: { mode: 'dates', start: '2026-10-16', end: '2026-10-31' },
    },
  ];
  assert.doesNotThrow(() => validateConfig(config));
});

test('valida referencias, IDs duplicados, precios y porcentajes', () => {
  let config = clone();
  config.promotions[0]!.serviceIds = ['no-existe'];
  assert.throws(() => validateConfig(config), /servicios inexistentes/);
  config = clone();
  config.services.push(config.services[0]!);
  assert.throws(() => validateConfig(config), /duplicados/);
  config = clone();
  config.services[0]!.price = -100;
  assert.throws(() => validateConfig(config), /precio positivo/);
  config = clone();
  config.promotions[1]!.value = 101;
  assert.throws(() => validateConfig(config), /porcentaje máximo/);
  config = clone();
  config.promotions[2]!.value = 999999;
  assert.throws(() => validateConfig(config), /menor al habitual/);
});

test('porcentaje, precio fijo y paquete se calculan en centavos', () => {
  assert.deepEqual(promotionPrice(site.promotions[0]!, site.services), {
    original: 48000,
    price: 38000,
    discount: 21,
  });
  assert.equal(promotionPrice(site.promotions[1]!, site.services).price, 14400);
  assert.equal(promotionPrice(site.promotions[2]!, site.services).price, 29000);
  const config = clone();
  config.services[4]!.price = 18001;
  assert.equal(
    promotionPrice(config.promotions[1]!, config.services).price,
    14401,
  );
  assert.match(money(14401), /144\.01/);
});

test('horario partido cierra en el descanso y al final del intervalo', () => {
  const at = (time: string) =>
    businessStatus(
      site.schedule,
      site.ownerTimeZone,
      new Date(`2026-10-23T${time}:00Z`),
    ).open;
  assert.equal(at('15:59'), false);
  assert.equal(at('16:00'), true);
  assert.equal(at('20:00'), false);
  assert.equal(at('22:00'), true);
  assert.equal(
    businessStatus(
      site.schedule,
      site.ownerTimeZone,
      new Date('2026-10-24T02:00:00Z'),
    ).open,
    false,
  );
});

test('el cierre dominical y las excepciones reemplazan el horario semanal', () => {
  assert.equal(
    businessStatus(
      site.schedule,
      site.ownerTimeZone,
      new Date('2026-10-25T18:00:00Z'),
    ).open,
    false,
  );
  const christmas = businessStatus(
    site.schedule,
    site.ownerTimeZone,
    new Date('2026-12-25T18:00:00Z'),
  );
  assert.equal(christmas.open, false);
  assert.equal(christmas.exception?.label, 'Navidad');
  assert.equal(
    businessStatus(
      site.schedule,
      site.ownerTimeZone,
      new Date('2026-12-24T19:59:00Z'),
    ).open,
    true,
  );
  assert.equal(
    businessStatus(
      site.schedule,
      site.ownerTimeZone,
      new Date('2026-12-24T20:00:00Z'),
    ).open,
    false,
  );
});

test('horarios inválidos, solapados y excepciones duplicadas se rechazan', () => {
  let config = clone();
  config.schedule.weekly[1]!.intervals = [
    ['10:00', '14:00'],
    ['13:00', '17:00'],
  ];
  assert.throws(() => validateConfig(config), /horarios solapados/);
  config = clone();
  config.schedule.weekly[1]!.intervals = [['25:00', '26:00']];
  assert.throws(() => validateConfig(config), /intervalo inválido/);
  config = clone();
  config.schedule.exceptions.push(config.schedule.exceptions[0]!);
  assert.throws(() => validateConfig(config), /duplicados/);
});

test('WhatsApp codifica servicio, paquete y caracteres especiales sin perder contenido', () => {
  const service = { ...site.services[0]!, name: 'Corte & estilo + acabado' };
  const serviceUrl = new URL(contactLink(site, service));
  assert.equal(serviceUrl.hostname, 'wa.me');
  assert.match(
    serviceUrl.searchParams.get('text')!,
    /Corte & estilo \+ acabado/,
  );
  const promoUrl = new URL(
    contactLink(site, site.services[0], site.promotions[0]),
  );
  assert.match(
    promoUrl.searchParams.get('text')!,
    /El ritual completo.*Corte clásico/,
  );
  const bundleUrl = new URL(contactLink(site, undefined, site.promotions[0]));
  assert.match(
    bundleUrl.searchParams.get('text')!,
    /Corte clásico \+ Diseño de barba/,
  );
});

test('configuración bloquea enlaces inseguros, temas arbitrarios y variables de mensaje desconocidas', () => {
  let config = clone();
  config.business.mapsUrl = 'javascript:alert(1)';
  assert.throws(() => validateConfig(config), /mapsUrl/);
  config = clone();
  config.theme.accent = 'red; background:url(https://example.com)';
  assert.throws(() => validateConfig(config), /hexadecimal/);
  config = clone();
  config.business.generalMessage = 'Hola {variable-invalida}';
  assert.throws(() => validateConfig(config), /variables permitidas/);
});
