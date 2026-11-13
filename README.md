# Plantilla de landing page para barberías

Astro estático, TypeScript estricto y CSS propio. Configura una sucursal, presenta servicios y promociones, y prepara solicitudes de cita por WhatsApp. Una copia independiente del repositorio por cliente.

## Empezar

Requiere Node.js **22.23.4 o superior** y npm. Entorno de desarrollo inicial: Node 26.5.0 / npm 11.17.0. No necesita base de datos, cuentas ni variables secretas.

```sh
npm ci
npm run dev
```

Abre la dirección local que indique Astro, habitualmente `http://127.0.0.1:4321`.

- `/`: **Bruma**, tema cálido, lista de servicios y filtros.
- `/ejemplos/olivo/`: **Olivo**, otra identidad, zona horaria, tarjetas, agrupación, orden y visibilidad.

Los negocios, números y direcciones son ficticios. En modo demostración, los botones muestran el mensaje que se enviaría, sin abrir contactos ficticios. Las fotos se generaron con IA. `demo: false` habilita los enlaces reales y omite la ruta secundaria del build. Primero sustituye todos los datos de contacto y dominio.

## Personalizar un cliente

1. Crea un repositorio independiente a partir de la plantilla. No se sincroniza automáticamente con ella.
2. Abre `src/config/site.ts`: selecciona variantes, orden y secciones visibles.
3. Cambia identidad, colores, teléfono, WhatsApp, dominio y zona horaria del dueño en `src/config/identity.ts`.
4. Edita textos en `content.ts`, servicios en `services.ts`, promociones en `promotions.ts` y horarios en `schedule.ts`.
5. Sustituye imágenes en `public/images/`; actualiza rutas, textos alternativos y la imagen social.
6. Ejecuta las comprobaciones y aplica [la lista de entrega](docs/ENTREGA.md).

Referencia completa y ejemplos: [docs/CONFIGURACION.md](docs/CONFIGURACION.md). Acuerdos del cuestionario: [docs/REQUISITOS.md](docs/REQUISITOS.md).

## Comandos

| Comando                   | Propósito                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run dev`             | Desarrollo local con recarga                                                                      |
| `npm run validate`        | Validar ambas configuraciones y sus recursos                                                      |
| `npm run check`           | Tipado de Astro y TypeScript                                                                      |
| `npm run lint`            | Revisión estática del código                                                                      |
| `npm test`                | Pruebas de fechas, horarios, promociones, precios y contacto                                      |
| `npm run test:static`     | Comprobar el HTML y los recursos de `dist/` después de generar                                    |
| `npm run test:production` | Ensayar una entrega con datos sustituidos en una copia temporal aislada, sin publicar             |
| `npm run format:check`    | Comprobar formato                                                                                 |
| `npm run format`          | Formatear el proyecto; en proyectos con cambios ajenos, usar Prettier solo sobre archivos propios |
| `npm run build`           | Validación, tipado y generación de `dist/`                                                        |
| `npm run preview`         | Revisar el resultado estático localmente                                                          |
| `npm run assets:demo`     | Regenerar SVG de ejemplo y tarjetas sociales de las dos marcas ficticias                          |

## Fechas y funcionamiento

La **zona horaria IANA configurada por el dueño** gobierna promociones, excepciones y abierto/cerrado. El instante actual se obtiene del dispositivo y se convierte a esa zona; no se usa la zona del visitante para interpretar las fechas. Un sitio estático no puede garantizar una hora independiente del reloj del dispositivo sin consultar un servicio externo. Si el reloj está mal, el estado puede ser incorrecto.

Las promociones por fechas incluyen el último día completo; por fecha/hora terminan exactamente en la hora indicada (fin exclusivo). Las horas inexistentes o ambiguas por cambio horario se rechazan. La interfaz recalcula cada 30 segundos, al regresar a la pestaña y al enfocar la ventana.

Los horarios especiales reemplazan todo el horario del día. Las condiciones escritas de una promoción son informativas; no crean reglas de disponibilidad. Una misma prestación no puede pertenecer a promociones con vigencias solapadas, incluso dentro de paquetes. Los importes se almacenan en **centavos de MXN** y los porcentajes de ahorro visibles se redondean al entero más cercano.

Sin JavaScript, los servicios, horarios y enlaces generales siguen disponibles. Las promociones muestran una invitación a consultar su vigencia; los filtros y abierto/cerrado requieren JavaScript. Los enlaces en HTML conservan sus precios habituales como alternativa conservadora.

## Arquitectura y alcance

```text
src/config/       contenido y contratos tipados
src/components/   secciones y elementos compartidos
src/lib/          reglas de negocio, tiempo y validación
src/scripts/      interacciones pequeñas del navegador
src/styles/       estilos y variables del tema
src/pages/        rutas estáticas
tests/           pruebas de reglas críticas con node:test
public/images/   imágenes locales reemplazables
```

Los componentes reciben una configuración por propiedades. Las reglas de negocio no dependen de Astro ni del DOM; un futuro panel podría producir el mismo contrato y disparar una nueva generación. No se incluye un panel, agenda, autenticación, pagos ni analítica. Contactar por WhatsApp **solicita** una cita; no la confirma ni comprueba disponibilidad.

Se usan fuentes locales DM Sans y Cormorant Garamond (SIL OFL), Astro y herramientas de desarrollo con sus licencias respectivas en `node_modules`. Conserva los avisos de licencia cuando redistribuyas recursos. El repositorio no impone una licencia comercial al código de tus proyectos; define la política de distribución antes de compartir la plantilla externamente.

## Git y publicación

Commits locales selectivos para requisitos, implementación y verificación. No hay remoto ni despliegue automático configurados. Generar `dist/` no publica el sitio. Puede alojarse en un servicio de hosting estático que admita las rutas generadas; el destino se decide por cliente.

Los commits creados por el agente usan la identidad de automatización `Codex <codex@local.invalid>` cuando no hay identidad de Git del usuario configurada, sin cambiar configuración global.

Resultados reales de verificación: [docs/VERIFICACION.md](docs/VERIFICACION.md).
