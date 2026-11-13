import type { SiteConfig } from '../config/types.ts';
import {
  activePromotions,
  businessStatus,
  contactLink,
  money,
  promotionPrice,
  discountLabel,
} from '../lib/business.ts';

const node = document.querySelector('#site-config');
if (!node?.textContent) throw new Error('Falta la configuración de la página');
// JSON emitido por el componente Site después de validar la configuración durante el build.
const config: SiteConfig = JSON.parse(node.textContent);
const dialog = document.querySelector<HTMLDialogElement>(
  '[data-contact-dialog]',
);
let returnFocus: HTMLElement | null = null;

function updateTime() {
  const now = new Date();
  const status = businessStatus(config.schedule, config.ownerTimeZone, now);
  const active = activePromotions(config, now);
  document
    .querySelectorAll<HTMLElement>('[data-business-status]')
    .forEach((element) => {
      element.textContent = status.open ? 'Abierto ahora' : 'Cerrado ahora';
      element.classList.toggle('is-open', status.open);
    });
  document
    .querySelectorAll<HTMLElement>('[data-closed-note], [data-dialog-closed]')
    .forEach((element) => {
      element.hidden = status.open;
    });
  document
    .querySelectorAll<HTMLElement>('[data-hours-day]')
    .forEach((element) =>
      element.classList.toggle(
        'is-today',
        Number(element.dataset.hoursDay) === status.day,
      ),
    );
  const exception = document.querySelector<HTMLElement>(
    '[data-today-exception]',
  );
  if (exception) {
    exception.hidden = !status.exception;
    exception.textContent = status.exception
      ? `Hoy: ${status.exception.label} · ${status.intervals.length ? status.intervals.map(([start, end]) => `${start}–${end}`).join(' / ') : 'Cerrado'}`
      : '';
  }
  document
    .querySelectorAll<HTMLElement>('[data-promotion]')
    .forEach((element) => {
      element.hidden = !active.some((p) => p.id === element.dataset.promotion);
    });
  const empty = document.querySelector<HTMLElement>('[data-promotion-empty]');
  if (empty) empty.hidden = active.length > 0;
  const fallback = document.querySelector<HTMLElement>('[data-time-fallback]');
  if (fallback) fallback.hidden = true;
  for (const service of config.services) {
    const card = document.querySelector<HTMLElement>(
      `[data-service="${service.id}"]`,
    );
    if (!card) continue;
    const promotion = active.find((p) => p.serviceIds.includes(service.id));
    const price = card.querySelector<HTMLElement>('[data-service-price]');
    if (price) {
      price.replaceChildren();
      if (promotion && promotion.kind !== 'bundle') {
        const old = document.createElement('del');
        old.textContent = money(service.price);
        price.append(
          old,
          document.createTextNode(
            money(promotionPrice(promotion, config.services).price),
          ),
        );
      } else price.textContent = money(service.price);
    }
    const offer = card.querySelector<HTMLElement>('[data-service-offer]');
    if (offer) {
      offer.hidden = !promotion;
      offer.textContent = promotion
        ? promotion.kind === 'bundle'
          ? `${promotion.name} · ${money(promotionPrice(promotion, config.services).price)} / paquete`
          : `${promotion.name} · ${discountLabel(promotion, config.services)} de ahorro`
        : '';
    }
    const link = card.querySelector<HTMLAnchorElement>('[data-contact]');
    if (link) {
      link.href = contactLink(
        config,
        service,
        promotion?.kind === 'bundle' ? undefined : promotion,
      );
      if (promotion?.kind !== 'bundle' && promotion)
        link.dataset.promotionId = promotion.id;
      else delete link.dataset.promotionId;
    }
  }
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(now.getFullYear());
  });
}
updateTime();
window.setInterval(updateTime, 30_000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateTime();
});
window.addEventListener('focus', updateTime);

const filters = document.querySelector<HTMLElement>('[data-filters]');
if (filters) {
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>(
      '[data-filter]',
    );
    if (!button) return;
    let visible = 0;
    document.querySelectorAll<HTMLElement>('[data-service]').forEach((card) => {
      card.hidden =
        button.dataset.filter !== 'all' &&
        card.dataset.category !== button.dataset.filter;
      if (!card.hidden) visible++;
    });
    filters.querySelectorAll<HTMLButtonElement>('button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    const status = document.querySelector('[data-filter-status]');
    if (status)
      status.textContent = `${visible} servicios disponibles en ${button.textContent}.`;
  });
}

const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const nav = document.querySelector<HTMLElement>('#main-nav');
if (toggle && nav) {
  toggle.hidden = false;
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    nav.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>(
    '[data-contact], [data-phone]',
  );
  if (!link) return;
  updateTime();
  const service = config.services.find((s) => s.id === link.dataset.serviceId);
  const promotion = activePromotions(config).find(
    (p) => p.id === link.dataset.promotionId,
  );
  // La vigencia se comprueba otra vez al pulsar, incluso si la pestaña estuvo suspendida.
  if (link.dataset.promotionId && !promotion) {
    event.preventDefault();
    return;
  }
  if (!link.hasAttribute('data-phone'))
    link.href = contactLink(config, service, promotion);
  if (!config.demo || !dialog) return;
  event.preventDefault();
  const preview = dialog.querySelector('[data-message-preview]');
  if (preview)
    preview.textContent = link.hasAttribute('data-phone')
      ? 'Teléfono de demostración. Sustituye el número en la configuración para habilitar llamadas reales.'
      : new URL(contactLink(config, service, promotion)).searchParams.get(
          'text',
        );
  returnFocus = link;
  dialog.showModal();
});
if (config.demo && dialog) {
  dialog
    .querySelectorAll('[data-close-dialog]')
    .forEach((button) =>
      button.addEventListener('click', () => dialog.close()),
    );
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener('close', () => returnFocus?.focus());
}

if (
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  'IntersectionObserver' in window
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((element) => {
    element.classList.add('will-reveal');
    observer.observe(element);
  });
}
