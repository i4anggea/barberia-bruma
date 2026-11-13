# Plantilla de barbería — acuerdos de alcance

## Objetivo

Reducir el tiempo de personalización de sitios de barberías. Cada cliente tendrá un repositorio independiente creado a partir de esta plantilla. Primera entrega: sitio demostrativo navegable, estático, sin agenda ni panel administrativo.

## Stack y organización

- Astro, TypeScript estricto y CSS propio; dependencias proporcionales.
- Configuración principal que conecta identidad, servicios, promociones y horarios separados.
- Contenido separado de componentes para facilitar un futuro panel.
- Dos configuraciones ficticias que demuestren cambios de identidad, orden, visibilidad y variantes.
- Git local desde el comienzo; commits selectivos. Sin publicación remota autorizada.

## Interfaz

- Español, MXN, una sucursal sin perfiles de barberos.
- Portada, servicios, promociones y contacto con horarios y ubicación.
- Secciones reordenables y ocultables; navegación fija que refleja las secciones visibles.
- Servicios en lista o tarjetas; agrupación o filtros por categoría, configurables.
- Nombre, descripción, precio fijo y duración aproximada por servicio.
- Tema único configurable por proyecto; demostración crema, carbón y terracota.
- Animaciones discretas con respeto a movimiento reducido; responsive y accesibilidad como objetivo.
- Pie: nombre, año, navegación y contacto. Sin crédito de desarrollador.

## Contacto

- WhatsApp por servicio y promoción, mensaje combinado configurable.
- Mensaje general configurable, botón flotante y enlace telefónico.
- Solicitar una cita no confirma disponibilidad ni evita citas encimadas.
- Fuera de horario: conservar contacto e indicar que responderán al abrir.
- Dirección y enlace a Google Maps, sin mapa incrustado.

## Promociones

- Descuento porcentual, precio promocional fijo y paquetes.
- Una promoción vigente por servicio, incluyendo su participación en paquetes. Rechazar intervalos solapados durante validación.
- Servicio con descuento individual: precio habitual tachado y promocional.
- Servicio incluido en paquete: conservar precio individual y mostrar nombre y precio conjunto del paquete.
- Promociones muestran precio habitual/promocional, porcentaje, vigencia y condiciones informativas.
- Condiciones textuales no controlan visibilidad: esta depende solo del inicio/fin.
- Sin promociones activas: mostrar mensaje de próximas promociones.
- Fechas por días completos o fecha/hora local. Zona horaria IANA del dueño, configurable por proyecto.
- Arquitectura estática: el instante actual proviene del reloj del dispositivo, convertido a la zona del dueño. Obtener tiempo independiente del dispositivo requiere un servicio no incluido. No usar la zona del visitante para interpretar la vigencia.

## Horarios

- Intervalos continuos o partidos por día, cierres y excepciones por fecha.
- Indicador abierto/cerrado según zona del dueño, con horario semanal y excepciones.

## Recursos y buscadores

- Negocios ficticios, imágenes generadas y placeholders reemplazables; sin testimonios inventados.
- Título, descripción y datos estructurados del negocio configurables.
- Imagen específica para compartir cada proyecto. Sin analítica.
- Datos y contacto demostrativos claramente identificados; no dirigir solicitudes reales a números inventados.

## Calidad y entrega

- Configuración inválida bloquea generación con diagnóstico.
- Pruebas de zona horaria, límites de promociones, solapamientos, precios, horarios especiales y mensajes.
- Tipado, build, inspección local responsive, teclado e interacciones según herramientas disponibles.
- Guía rápida, referencia de configuración y checklist de entrega.
- Estados verificables PASS/FAIL/NOT_RUN/BLOCKED; no equiparar implementación con verificación.
