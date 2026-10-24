# PRD — Spec 0002: Integrar el widget oficial de ElevenLabs

## Problema / Necesidad

La landing de Empire Lead Company (Spec 0001) tiene un widget de voz propio construido sobre el SDK
`@elevenlabs/client`, pero aún no está conectado a ningún agente real. El agente ya existe en
ElevenLabs y el proveedor entrega un **widget oficial embebible** listo para usar:

```html
<elevenlabs-convai agent-id="agent_9101m5mtb0t0erb9rc22a6fpw2fn"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
```

El solicitante pide usar ese widget en la página.

## Objetivo

Sustituir el widget propio por el widget oficial de ElevenLabs, conectado al agente
`agent_9101m5mtb0t0erb9rc22a6fpw2fn`, sin perder lo que Spec 0001 ya garantiza: configuración por
entorno, página funcional sin agente configurado, carga que no penaliza el render y botones
"Hablar con el asistente" que llevan a la conversación.

## Alcance

**Esta spec cubre solo la integración del widget en la página.** El prompt, la voz y la base de
conocimiento del agente se configuran en la consola de ElevenLabs siguiendo `agent/README.md`
(Spec 0001), y no cambian aquí.

## Cambio respecto a Spec 0001

| Aspecto | Spec 0001 | Spec 0002 |
|---|---|---|
| UI de la conversación | Propia (`VoiceWidget.ts`) | Widget oficial `<elevenlabs-convai>` |
| Integración | SDK `@elevenlabs/client` | Script embed `@elevenlabs/convai-widget-embed` |
| Estados, transcripción, permiso de micrófono | Implementados en el proyecto | Los gestiona el widget |
| Ubicación | Dentro de la sección del agente | Flotante, esquina inferior derecha |
| Estilo | Tokens propios | Consola de ElevenLabs + colores del orbe desde los tokens |

Quedan **sustituidas** las decisiones D3 y D4 y las funcionalidades F9–F12 y F18 de Spec 0001.

## Funcionalidades requeridas

| # | Descripción |
|---|---|
| F1 | La página inserta el elemento `<elevenlabs-convai>` con el Agent ID configurado. |
| F2 | El Agent ID se lee de `VITE_ELEVENLABS_AGENT_ID`; no aparece escrito a mano en `index.html` ni en el código fuente. |
| F3 | El script del widget se carga desde unpkg con **versión exacta** (`0.18.3`) e integridad SRI. |
| F4 | El script se inserta después del evento `load` de la página, para no competir con el render inicial. |
| F5 | El widget es flotante, en la esquina inferior derecha (`placement="bottom-right"`). |
| F6 | El widget se muestra en español. |
| F7 | Los colores del orbe del widget salen de los tokens de diseño (`--color-accent`, `--color-primary`). |
| F8 | Los botones "Hablar con el asistente" del header y el hero, y el botón de la sección del agente, **abren el panel del widget**. |
| F9 | Si se pulsa un botón antes de que el widget termine de cargar, la carga se adelanta y el panel se abre cuando esté listo. |
| F10 | La sección "Habla con nuestro asistente" conserva el texto y los ejemplos de preguntas, y su tarjeta indica dónde está el asistente con un botón para abrirlo. |
| F11 | Sin Agent ID configurado no se descarga el script ni se inserta el widget, y la tarjeta muestra "Asistente no disponible" con correo y teléfono. |
| F12 | Si el script no carga (red, bloqueador), la tarjeta muestra "Asistente no disponible" con correo y teléfono, sin errores que rompan la página. |
| F13 | En móvil el widget flotante no tapa el aviso de datos ficticios del footer. |
| F14 | Se eliminan el SDK `@elevenlabs/client`, el widget propio y la variable `VITE_VOICE_PROVIDER`. |
| F15 | La documentación de Spec 0001 y los README reflejan la nueva integración. |

## Requisitos no funcionales

| # | Descripción |
|---|---|
| NF1 | El script del widget (≈ 465 kB gzip) no se descarga antes del evento `load`. |
| NF2 | Lighthouse móvil mantiene Rendimiento ≥ 85 y Accesibilidad ≥ 90 (AC12 de Spec 0001). |
| NF3 | Los botones que abren el widget siguen siendo operables con teclado. |

## Decisiones sobre los puntos abiertos de la spec original

| Punto | Decisión | Justificación |
|---|---|---|
| P1 — Widget flotante o incrustado | **Flotante, esquina inferior derecha.** Los botones de la página lo abren con el evento `elevenlabs-agent:expand`. | Es el modo nativo del widget y sigue visible al hacer scroll. El evento permite que los tres botones de Spec 0001 sigan teniendo sentido. |
| P2 — Conservar el widget propio | **Se elimina.** | Mantener dos integraciones duplica el mantenimiento y el peso de la página. |
| P3 — Dominios permitidos en ElevenLabs | **Requisito previo a publicar**: `localhost` y el dominio de despliegue. | El Agent ID es público por diseño; la lista de dominios es lo que impide que otro sitio consuma minutos. |
| P4 — Prompt y base de conocimiento | **Se usan los generados en `agent/`.** | Mantiene página y agente con los mismos datos (D5 de Spec 0001). |
| Versión del script | **`0.18.3`, con SRI.** La URL entregada no fija versión. | Sin versión, una publicación nueva del paquete cambia la página sin aviso. `0.18.3` es la última estable con más de dos semanas. |

## Criterios de aceptación

| ID | Condición | Verificación |
|---|---|---|
| AC1 | Con `.env` configurado, el widget aparece en la esquina inferior derecha y permite conversar con el agente. | Prueba manual con micrófono. |
| AC2 | `agent_9101m5mtb0t0erb9rc22a6fpw2fn` no aparece en `index.html` ni en `src/`. | `grep -r agent_9101 index.html src` → sin resultados. |
| AC3 | El `<script>` insertado apunta a `…/convai-widget-embed@0.18.3/dist/index.js` y lleva `integrity` y `crossorigin`. | Inspección del DOM. |
| AC4 | El script no se pide antes del evento `load`. | Pestaña Network: la petición a unpkg empieza después de `load`. |
| AC5 | Los tres botones abren el panel del widget. | Prueba manual de cada uno. |
| AC6 | Pulsar el botón del hero nada más cargar la página abre el panel cuando el widget termina de cargar. | Throttling "Slow 4G" y clic inmediato. |
| AC7 | Sin `.env`: no hay petición a unpkg, no hay `<elevenlabs-convai>` en el DOM, la tarjeta muestra "Asistente no disponible" y la consola no tiene errores. | Build sin `.env`. |
| AC8 | Con unpkg bloqueado, la tarjeta muestra "Asistente no disponible" y la página sigue operativa. | DevTools → bloquear `unpkg.com`. |
| AC9 | A 360 px, con el widget cerrado, el aviso de datos ficticios del footer es legible. | Vista responsive, scroll al final. |
| AC10 | El widget muestra sus textos en español. | Revisión visual. |
| AC11 | El orbe usa los colores de los tokens. | Revisión visual en modo claro y oscuro. |
| AC12 | `@elevenlabs/client` no está en `package.json` y `src/voice/` solo contiene el cargador del widget. | Inspección. |
| AC13 | `npm run build` termina sin errores. | Ejecución. |
| AC14 | El guion `agent/test-script.md` (T0–T10) se ejecuta con el agente real y los resultados quedan registrados. | Registro en el archivo. |

## Fuera de alcance

- Cambios en el prompt, la voz o la base de conocimiento del agente.
- Personalización visual del widget más allá de los colores del orbe y lo que permite la consola de ElevenLabs.
- URL firmada o autenticación del agente (D9 de Spec 0001 se mantiene: agente público con lista de dominios).
- Analítica de conversaciones.
