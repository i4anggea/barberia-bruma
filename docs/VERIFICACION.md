# Verificación de la primera entrega

Fecha de trabajo: 23 de octubre de 2026, zona del usuario America/Mexico_City.

## Entorno

- macOS; Node.js 26.5.0; npm 11.17.0.
- Astro 7.4.2; TypeScript 6.0.3; versiones exactas transitivas en `package-lock.json`.
- Instalación desde npm con `--ignore-scripts`; se comprobó funcionamiento real de build y herramientas.
- Primera revisión encontró tipos de Node faltantes y globals del linter sin declarar: corregidos. Las ejecuciones finales no conservan esos errores.

## Comprobaciones

| Estado  | Método                                                                       | Resultado                                                                                                                                               |
| ------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PASS    | `npm run validate` (también dentro de build)                                 | Las dos configuraciones y todos sus recursos existen y son válidos                                                                                      |
| PASS    | `npm run check` (también dentro de build)                                    | Sin errores, advertencias ni hints                                                                                                                      |
| PASS    | `npm run lint`                                                               | ESLint, salida 0                                                                                                                                        |
| PASS    | `npm run format:check`                                                       | Archivos de texto con formato consistente                                                                                                               |
| PASS    | `npm test`                                                                   | 19 pruebas de reglas de negocio                                                                                                                         |
| PASS    | `TZ=Pacific/Auckland npm test`                                               | Las mismas 19 pruebas pasan con otra zona del proceso; no se depende de la zona local del host                                                          |
| PASS    | `npm run build`                                                              | Generación estática de inicio, Olivo y 404                                                                                                              |
| PASS    | `npm run test:static`                                                        | 4 pruebas del HTML generado: SEO, datos estructurados, recursos locales, IDs únicos, variantes y secciones                                              |
| PASS    | `npm run test:production`                                                    | Build en copia temporal, dominio y números sustituidos; elimina barra demo, noindex y ruta secundaria                                                   |
| PASS    | `npm audit --audit-level=high`                                               | 0 vulnerabilidades conocidas reportadas por el registro en la ejecución; no constituye garantía de ausencia de fallos                                   |
| PASS    | `git diff --check`                                                           | Sin errores de whitespace                                                                                                                               |
| PASS    | Navegador local                                                              | Bruma y Olivo, sin errores de consola observados durante los flujos revisados                                                                           |
| PASS    | Medición DOM en ambas configuraciones                                        | 320, 390, 768, 1024 y 1440 px: sin elementos de `main` fuera del ancho ni desbordamiento horizontal del documento                                       |
| PASS    | Revisión visual                                                              | Portada móvil/escritorio, imágenes, navegación y variantes de servicios                                                                                 |
| PASS    | Interacciones                                                                | Filtro Barba muestra dos servicios; Todos restaura cinco. Diálogo muestra servicio individual y paquete con contenido correcto                          |
| PASS    | Teclado y móvil                                                              | Escape cierra el diálogo y devuelve foco al servicio. Menú móvil abre y cierra al navegar. Fechas especiales se despliegan                              |
| PASS    | Contraste de paletas                                                         | Se midieron las combinaciones base de texto/fondo de ambos temas; se oscureció `muted` en Bruma tras detectar 4.48:1 sobre surface, hasta superar 4.5:1 |
| NOT_RUN | Publicación remota y contacto real                                           | Fuera del alcance de la entrega local; no se enviaron mensajes ni se hicieron llamadas                                                                  |
| NOT_RUN | Auditoría completa WCAG con tecnologías de asistencia y dispositivos físicos | Revisión focalizada de teclado, semántica, foco, paleta y anchuras; no se afirma certificación WCAG                                                     |
| NOT_RUN | Ensayo de rendimiento en hosting real                                        | No hay destino de alojamiento elegido; no se inventan puntuaciones Lighthouse ni tiempos de carga externos                                              |

## Cobertura funcional crítica

Las pruebas comprueban: zona del dueño frente a zonas distintas; fecha local y cambio de día; primer y último instante de promociones; fin exclusivo; día de 25 horas; horas inexistentes/ambiguas; fechas inválidas; solapamientos de paquetes e individuales; promociones consecutivas; referencias inexistentes; IDs duplicados; importes/porcentajes inválidos; cálculo en centavos; descansos y cierres; festivos; mensajes codificados con caracteres especiales; enlaces/colores/configuración inseguros; protección frente a entrega accidental con datos de demostración.

Capturas locales en `docs/capturas/`: Bruma móvil, Bruma escritorio y Olivo con tarjetas. Son evidencia del desarrollo local, no de publicación externa.

## Límites observados y operación

- La zona horaria del dueño gobierna el calendario; el instante actual procede del reloj del dispositivo. Una fuente de tiempo independiente requiere integración adicional.
- Las condiciones escritas no son reglas automáticas. WhatsApp no confirma reservas.
- Los porcentajes de paquetes/precios fijos se redondean y se identifican como aproximados cuando corresponde.
- Sitio inicial en modo demostración; cambiar datos y aplicar `docs/ENTREGA.md` antes de una entrega real.
- Durante una recarga de desarrollo, una pestaña quedó en error de conexión. Se confirmó HTTP 200 y se abrió una pestaña nueva con la página correcta. No fue un error del build estático.
- No se han creado remoto, push, despliegue ni recursos facturables.
