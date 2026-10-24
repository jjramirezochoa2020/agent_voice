# PRD — Spec 0001: Landing page con agente de voz embebido

## Problema / Necesidad

Se necesita una página web de demostración donde embeber un **agente de voz** que atienda a
visitantes de una agencia de seguros. Hoy no existe ni la página ni el contenido que el agente
debe conocer.

La agencia es ficticia y todo el contenido será **dummy**: el objetivo es mostrar la experiencia
de conversar por voz con un asesor virtual, no operar un negocio real.

## Objetivo

Publicar una landing page responsive de la agencia **Empire Lead Company** que presente
sus tres líneas de producto y permita al visitante iniciar una conversación por voz con un
asistente que responde sobre esos productos.

Las tres líneas de producto son:

1. Seguros de vida
2. Seguros educativos
3. Planificación financiera

## Alcance

**Esta spec cubre la página y la integración del widget de voz.** La configuración del agente en
el proveedor (prompt, voz y base de conocimiento) se entrega como contenido versionado en el
repositorio, listo para cargarse en el proveedor.

## Datos dummy

### Agencia

| Campo | Valor |
|---|---|
| Nombre | Empire Lead Company |
| Eslogan | "Protegemos hoy lo que más importa mañana" |
| Teléfono | +57 (601) 555 0100 |
| Correo | contacto@empireleadcompany.example |
| Horario | Lunes a viernes, 8:00 a. m. – 6:00 p. m. |
| País / moneda | Colombia / COP |

### Productos

| Código | Línea | Plan | Cobertura de referencia | Prima mensual desde |
|---|---|---|---|---|
| P1 | Vida | Vida Esencial | Hasta $100.000.000 COP por fallecimiento | $45.000 COP |
| P2 | Vida | Vida Plus | Hasta $300.000.000 COP + enfermedades graves | $95.000 COP |
| P3 | Educativo | Educa Futuro | Matrícula universitaria garantizada, hasta 10 semestres | $180.000 COP |
| P4 | Educativo | Educa Express | Ahorro a 5 años para educación técnica | $120.000 COP |
| P5 | Planificación financiera | Plan Retiro Tranquilo | Ahorro e inversión para pensión voluntaria | $250.000 COP |
| P6 | Planificación financiera | Asesoría Patrimonial | Sesión 1:1 con planificador certificado | Primera sesión gratis |

### Asesores

| Código | Nombre | Especialidad | Líneas que atiende |
|---|---|---|---|
| A1 | Guillermo Ramirez | Especialista en seguros de vida | P1, P2 |
| A2 | Jaime Ramirez | Especialista en seguros educativos | P3, P4 |
| A3 | Sergio Rojas | Planificador financiero y de retiro | P5 |
| A4 | Juan Trujillo | Asesor patrimonial certificado | P6 |

### Preguntas frecuentes

| Código | Pregunta | Respuesta de referencia |
|---|---|---|
| Q1 | ¿Qué diferencia hay entre Vida Esencial y Vida Plus? | Vida Plus amplía la cobertura hasta $300.000.000 COP e incluye enfermedades graves; Vida Esencial cubre solo fallecimiento hasta $100.000.000 COP. |
| Q2 | ¿Desde qué edad del hijo puedo contratar un seguro educativo? | Desde el nacimiento y hasta los 12 años para Educa Futuro; Educa Express no tiene límite de edad. |
| Q3 | ¿Qué pasa si dejo de pagar la prima? | Hay un periodo de gracia de 30 días; después la póliza se suspende hasta ponerse al día. |
| Q4 | ¿Cuánto debería ahorrar mensualmente para mi retiro? | Como referencia, entre el 10 % y el 15 % del ingreso mensual; Sergio Rojas puede hacer un cálculo personalizado. |
| Q5 | ¿Cómo agendo una cita con un asesor? | Desde el propio asistente o en la sección Asesores; la cita es simulada en esta demo. |

## Funcionalidades requeridas

| # | Descripción |
|---|---|
| F1 | La página tiene un header con logo, menú (Inicio, Productos, Asesores, Preguntas, Contacto) y botón "Hablar con el asistente". |
| F2 | El hero muestra el eslogan, un texto breve y una llamada a la acción que inicia el agente de voz. |
| F3 | La sección Productos muestra tres tarjetas, una por línea, con los planes P1–P6. |
| F4 | La sección Agente de voz contiene el widget embebido y ejemplos de preguntas que se le pueden hacer. |
| F5 | La sección Asesores muestra A1–A4 con nombre, especialidad y foto placeholder. |
| F6 | La sección Preguntas frecuentes muestra Q1–Q5 en un acordeón. |
| F7 | El footer muestra los datos de contacto y el aviso "Sitio de demostración con datos ficticios". |
| F8 | Todo el contenido dummy vive en un único archivo de datos; la página no tiene textos de negocio escritos a mano en el HTML. |
| F9 | El widget permite iniciar y finalizar la conversación. |
| F10 | El widget muestra su estado: inactivo, conectando, escuchando y hablando. |
| F11 | Antes de usar el micrófono se informa al visitante por qué se pide el permiso; si lo deniega, se muestra un mensaje y los datos de contacto. |
| F12 | El widget muestra la transcripción de la conversación, ocultable. |
| F13 | El agente saluda, se presenta como asistente virtual de Empire Lead Company y habla en español. |
| F14 | El agente responde solo con los datos de esta spec; si no conoce algo, lo dice y deriva a un asesor. Nunca inventa coberturas ni precios. |
| F15 | El agente recomienda la línea adecuada según la necesidad del visitante: proteger a la familia → vida, educación de los hijos → educativo, retiro o patrimonio → planificación financiera. |
| F16 | El agente ofrece agendar una cita simulada con el asesor de la línea correspondiente (A1–A4). |
| F17 | El prompt del sistema y la base de conocimiento del agente se generan a partir del mismo archivo de datos que la página. |
| F18 | El proveedor de voz se configura por variables de entorno; cambiar de proveedor no exige tocar las secciones de la página. |

## Requisitos no funcionales

| # | Descripción |
|---|---|
| NF1 | Responsive: funcional desde 360 px de ancho, sin scroll horizontal. |
| NF2 | Accesibilidad: contraste WCAG AA, navegación completa por teclado, textos alternativos y estados del widget anunciados con `aria-live`. |
| NF3 | Rendimiento: LCP < 2,5 s en 4G simulada; el script del proveedor de voz se carga de forma diferida. |
| NF4 | Compatibilidad: últimas dos versiones de Chrome, Safari, Edge y Firefox, en escritorio y móvil. |
| NF5 | Privacidad: la página no almacena datos personales del visitante. |

## Decisiones sobre los puntos abiertos de la spec original

| Punto | Decisión | Justificación |
|---|---|---|
| Proveedor del agente de voz | **ElevenLabs Conversational AI**, detrás de un adaptador. **Pendiente de confirmar por el solicitante.** | Ofrece widget embebible con un `<script>` y un elemento HTML, sin backend propio para la demo. El adaptador (F18) permite cambiar a Vapi, Retell u OpenAI Realtime. |
| Stack de la página | **Sitio estático con Vite + HTML/CSS/TypeScript**, sin framework de UI. | Es una sola página sin estado de servidor; un framework añade peso sin beneficio. Vite da build, variables de entorno y servidor de desarrollo. |
| País y moneda | **Colombia / COP.** | Asumido en la spec original; afecta solo al archivo de datos. |
| Identidad visual | **Paleta propia provisional**: azul marino (confianza) y verde (crecimiento), tipografía Inter. | No se recibió identidad; se definen tokens CSS para sustituirla sin tocar componentes. |

## Criterios de aceptación

| ID | Condición | Verificación |
|---|---|---|
| AC1 | Se ven las 7 secciones (header, hero, productos, agente, asesores, preguntas, footer). | Revisión visual en escritorio y móvil. |
| AC2 | Los 6 planes, 3 asesores y 5 preguntas aparecen con los valores de este PRD. | Comparación contra las tablas de datos dummy. |
| AC3 | Cambiar un precio en el archivo de datos lo cambia en la página tras el build. | Editar P1, `npm run build`, revisar. |
| AC4 | El agente se inicia desde el hero, desde el header y desde la sección dedicada. | Prueba manual de los tres puntos de entrada. |
| AC5 | El widget muestra los cuatro estados de F10. | Prueba manual con micrófono. |
| AC6 | Si se deniega el micrófono, aparece el mensaje con datos de contacto y la página no se rompe. | Denegar el permiso en el navegador. |
| AC7 | El agente responde Q1–Q5 de forma coherente con las respuestas de referencia. | Guion de prueba por voz. |
| AC8 | Ante "¿cubren mascotas?" el agente dice que no tiene esa información y deriva a un asesor. | Guion de prueba por voz. |
| AC9 | Ante "quiero asegurar la universidad de mi hija" el agente recomienda Educa Futuro y ofrece cita con Jaime Ramirez. | Guion de prueba por voz. |
| AC10 | Sin variable de entorno del proveedor, la sección del agente muestra "Asistente no disponible" en lugar de un error. | Build sin `.env`. |
| AC11 | No hay scroll horizontal a 360 px. | DevTools, modo responsive. |
| AC12 | Lighthouse: Accesibilidad ≥ 90 y Rendimiento ≥ 85 en móvil. | Informe Lighthouse. |
| AC13 | Toda la página es navegable con teclado, incluido el botón del widget. | Prueba manual con Tab / Enter / Esc. |
| AC14 | El footer muestra el aviso de sitio de demostración. | Revisión visual. |

## Fuera de alcance

- Cotización, emisión o pago real de pólizas.
- Autenticación y área de clientes.
- Integración con CRM, calendario o correo: la cita del agente es simulada.
- Almacenamiento o analítica de conversaciones.
- Soporte multilenguaje.
- Panel de administración de contenidos: los datos se editan en el archivo de datos.
