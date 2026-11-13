# Referencia de configuración

`src/config/types.ts` define `SiteConfig`. `site.ts` es el punto de entrada; conecta archivos temáticos. No se evalúan instrucciones procedentes del contenido ni se inyecta HTML configurable. Textos se escapan por Astro y mensajes dinámicos usan `textContent`.

## Identidad (`identity.ts`)

| Campo                                                    | Uso                                                                                                                              |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                                     | Identificador en minúsculas, números y guiones                                                                                   |
| `demo`                                                   | `true`: aviso de demostración, noindex y vista previa de contacto. `false`: contactos reales y eliminación de ejemplo secundario |
| `ownerTimeZone`                                          | Zona IANA del dueño: `America/Mexico_City`, `America/Tijuana`, etc.                                                              |
| `siteUrl`                                                | Dominio HTTPS real; fuente de canonical, imagen social y datos estructurados                                                     |
| `business.name`, `shortName`, `tagline`                  | Marca completa, marca breve y lema                                                                                               |
| `address`, `locality`, `region`, `postalCode`, `country` | Dirección y datos estructurados; país ISO, por ejemplo `MX`                                                                      |
| `mapsUrl`                                                | Enlace HTTPS de Google Maps a la ubicación                                                                                       |
| `phone`                                                  | Número internacional con `+`, sin separadores                                                                                    |
| `phoneDisplay`                                           | Versión legible del número                                                                                                       |
| `whatsapp`                                               | Número internacional, solo dígitos, sin `+`                                                                                      |
| `generalMessage`                                         | Mensaje general de portada, cabecera y botón flotante                                                                            |
| `serviceMessage`                                         | Mensaje al solicitar un servicio individual                                                                                      |
| `promotionMessage`                                       | Mensaje para servicio con descuento o paquete                                                                                    |
| `closedMessage`                                          | Aviso fuera de horario                                                                                                           |
| `hero.*`                                                 | Antetítulo, título, acento, descripción, imagen, texto alternativo y nota                                                        |
| `theme.*`                                                | Colores de seis dígitos hexadecimales; revisar contraste después de cambiar                                                      |
| `seo.title`, `description`, `shareImage`                 | Presentación en buscadores y al compartir; imagen local de 1200 × 630 recomendada                                                |

Variables de mensaje: `{negocio}`, `{servicio}`, `{promocion}`. Una variable desconocida bloquea generación. El mensaje de paquete sin servicio individual incluye la lista de sus servicios. No se incluyen datos de clientes.

## Presentación (`site.ts`, `content.ts`)

```ts
typography: { display: 'editorial', body: 'dm-sans' },
servicesView: 'list', // o 'cards'
categoriesView: 'filters', // o 'grouped'
sections: [
  { id: 'inicio', visible: true, label: 'Inicio' },
  { id: 'servicios', visible: true, label: 'Servicios' },
  { id: 'promociones', visible: false, label: 'Promociones' },
  { id: 'contacto', visible: true, label: 'Visítanos' },
],
```

El orden del arreglo determina el orden visual y la navegación. No repetir identificadores. `typography.display`: `editorial` (Cormorant Garamond), `classic` (Georgia), `sans` (DM Sans). `body`: `dm-sans` o `system`. Para otra fuente local: instalar o guardar sus archivos con licencia adecuada, importarla en `Site.astro` y añadir su variante al contrato y al mapa de fuentes.

`content.services`, `content.promotions` y `content.contact` contienen encabezados y descripciones. `\n` permite saltos de línea. Las etiquetas funcionales generales permanecen en español en componentes.

`business.logo` es opcional: una ruta local como `/images/logo.svg` sustituye el símbolo de tijeras junto al nombre. El logo se presenta como un emblema de 28 × 28 px; el nombre y lema siguen siendo configurables.

## Servicios (`services.ts`)

```ts
{
  id: 'corte-clasico',
  name: 'Corte clásico',
  description: 'Corte y peinado a tu medida.',
  category: 'Cortes',
  price: 28000, // $280 MXN: siempre centavos enteros
  duration: 40, // minutos aproximados
  image: '/images/corte.svg',
  imageAlt: 'Ilustración de tijeras de barbería.',
}
```

Las categorías se obtienen de los servicios; conserva el orden de primera aparición. Todos los servicios requieren imagen válida, aunque la lista la muestre pequeña. Los placeholders SVG son recursos de ejemplo reemplazables.

## Promociones (`promotions.ts`)

| `kind`       | `serviceIds`                       | `value`                           |
| ------------ | ---------------------------------- | --------------------------------- |
| `percentage` | Exactamente un servicio            | Porcentaje entero, 1 a 100        |
| `fixed`      | Exactamente un servicio            | Precio final en centavos          |
| `bundle`     | Dos o más servicios, sin repetidos | Precio final conjunto en centavos |

Todas incluyen `id`, `name`, `description`, `conditions`, `image`, `imageAlt` y `period`. El precio final debe ser menor al precio habitual o suma de precios habituales.

```ts
period: { mode: 'dates', start: '2026-12-01', end: '2026-12-31' }
// Incluye todo el 31 de diciembre en ownerTimeZone.

period: { mode: 'datetime', start: '2026-12-01T10:00', end: '2026-12-01T14:00' }
// Disponible desde las 10:00 hasta antes de las 14:00, en ownerTimeZone.
```

No añadir `Z` ni offset: son horas locales del dueño. No se permiten solapamientos para un servicio, ni siquiera si una promoción es un paquete. Promociones consecutivas con fin exclusivo e inicio en el mismo instante son válidas. En fechas completas, la siguiente promoción puede empezar el día posterior al último día de la anterior.

Las promociones vencidas/futuras no se muestran. Con cero vigentes se muestra `content.promotions.empty`. La barra de navegación permanece porque la sección tiene un mensaje visible. En servicios, descuentos individuales sustituyen el precio mostrado; un paquete mantiene el precio individual y muestra el nombre y precio conjunto. Para solicitar el paquete se usa su botón en promociones.

Los descuentos porcentuales se redondean al centavo; el porcentaje de ahorro de precios fijos y paquetes se redondea para presentación y se marca aproximado cuando no es entero. Las condiciones son texto: escribir “solo los lunes” no implementa un filtro por día.

## Horarios (`schedule.ts`)

`weekly` debe contener exactamente siete días, `0` domingo a `6` sábado. Cada día admite cero o más intervalos ordenables, sin solapamientos. Un arreglo vacío significa cerrado.

```ts
{ day: 1, intervals: [['10:00', '14:00'], ['16:00', '20:00']] }
```

`exceptions` reemplaza los intervalos del día completo:

```ts
{ date: '2026-12-25', label: 'Navidad', intervals: [] }
```

Usar horas `HH:mm`, entre `00:00` y `23:59`, con inicio menor al fin. Para atención nocturna, dividir los intervalos entre los dos días correspondientes; esta versión no admite un único intervalo que cruce medianoche. No se permiten fechas de excepción duplicadas.

## Recursos y demostraciones

Las rutas de imágenes son locales desde `public`, por ejemplo `/images/barberia.jpg`. Se admiten SVG, JPG, PNG, WebP y AVIF. La validación de generación comprueba existencia.

Las fotografías ya están incluidas; `assets:demo` regenera solo placeholders y tarjetas sociales, sin llamadas a Imagegen. El script trabaja con las dos marcas ficticias; para un cliente usa su imagen social propia. Procedencia: [RECURSOS.md](RECURSOS.md).

La configuración alternativa está en `src/config/examples/olivo.ts`. Demuestra composición reutilizable sin mutar la configuración base. Puedes usar su estructura al crear otro proyecto. Si eliminas ejemplos del repositorio, actualiza también las importaciones en `scripts/validate.ts`, las pruebas y la ruta de ejemplos.
