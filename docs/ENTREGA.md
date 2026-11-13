# Lista de revisión por cliente

## Datos y contenido

- [ ] Repositorio independiente y dominio acordados.
- [ ] Nombre, lema, textos, precios y duraciones revisados con el dueño.
- [ ] Dirección, teléfono, WhatsApp y Google Maps reales y correctos.
- [ ] Zona IANA del dueño correcta; horarios semanales y excepciones revisados.
- [ ] Promociones con fechas reales y condiciones claras, sin solapamientos.
- [ ] Paquetes con servicios y precio conjunto correctos.
- [ ] Imagen social, logo/favicon e imágenes propios o con licencia adecuada; textos alternativos revisados.
- [ ] `demo: false` después de reemplazar datos ficticios; título, descripción, canonical y datos estructurados correctos.

## Verificación

- [ ] `npm ci` desde el lockfile.
- [ ] `npm run validate`, `npm run check`, `npm run lint`, `npm test`, `npm run format:check` y `npm run build` pasan.
- [ ] Preview de `dist/` revisado en escritorio y móvil, sin desbordamientos.
- [ ] Navegación, filtros, menú móvil, WhatsApp y teléfono revisados (sin enviar mensajes de prueba reales).
- [ ] Fechas de inicio/fin y abierto/cerrado comprobados en la zona del dueño.
- [ ] Teclado, foco, contraste, textos alternativos y movimiento reducido revisados con la identidad final.
- [ ] Sin configuración secundaria demostrativa publicada ni etiquetas de demostración.
- [ ] HTML sin JavaScript conserva información esencial.

## Entrega y operación

- [ ] Explicar que WhatsApp solicita cita; no reserva ni confirma disponibilidad.
- [ ] Explicar que el reloj del dispositivo aporta el instante actual; la zona del dueño gobierna su interpretación.
- [ ] Explicar cambios de contenido, nueva generación y publicación del sitio estático.
- [ ] Guardar commit de entrega y resultados reales de verificación.
- [ ] Acordar hosting, dominio y publicación por separado; no activar servicios facturables sin autorización.
- [ ] Compartir guía, alcance de mantenimiento y posibles mejoras futuras del panel.
