# Epics — Spec 0002: Integrar el widget oficial de ElevenLabs

---

## Epic 1 — Widget oficial

### Story 1.1 — Cargador del widget

**Como** desarrollador,
**necesito** un módulo que inserte el widget oficial a partir de la configuración de entorno,
**para que** el Agent ID no quede escrito a mano y la página siga funcionando sin él.

**Criterios de aceptación:**
- [ ] Existe `src/voice/elevenlabsWidget.ts` con `createElevenLabsWidget(agentId, onUnavailable)` según `architecture.md`.
- [ ] Sin `agentId` devuelve `null` y no inserta nada en el DOM (AC7).
- [ ] Con `agentId` inserta `<elevenlabs-convai>` con `agent-id`, `placement="bottom-right"` y `language="es"` (F1, F5, F6).
- [ ] Los atributos `avatar-orb-color-1` y `avatar-orb-color-2` se leen de los tokens CSS (F7).
- [ ] El script se inserta tras el evento `load` con la URL `@0.18.3/dist/index.js`, `integrity`, `crossorigin="anonymous"` y `async` (F3, F4, AC3, AC4).
- [ ] Si el script falla al cargar se llama a `onUnavailable` (F12).
- [ ] `grep -r agent_9101 index.html src` no devuelve resultados (AC2).

### Story 1.2 — Abrir el widget desde la página

**Como** visitante,
**necesito** que los botones "Hablar con el asistente" abran la conversación,
**para** no tener que buscar el widget en la pantalla.

**Criterios de aceptación:**
- [ ] `open()` inserta el script si aún no se insertó (F9).
- [ ] `open()` espera `customElements.whenDefined('elevenlabs-convai')` y despacha `elevenlabs-agent:expand` con `detail.action = 'expand'`, reintentando hasta que el widget marque `detail._convaiEventHandled`.
- [ ] Los botones del header, el hero y la tarjeta del agente abren el panel (F8, AC5).
- [ ] Con red lenta, un clic inmediato en el hero abre el panel cuando el widget termina de cargar (AC6).
- [ ] Si el widget no está disponible, los botones llevan a la sección del agente (scroll) en lugar de no hacer nada.

### Story 1.3 — Tarjeta de la sección del agente

**Como** visitante,
**necesito** que la sección del asistente me diga dónde está y cómo usarlo,
**para** entender que el asistente vive en la esquina de la pantalla.

**Criterios de aceptación:**
- [ ] Se conservan el título, el texto y los ejemplos de preguntas (F10).
- [ ] En estado disponible la tarjeta muestra "Tu asistente está listo", la indicación de la esquina inferior derecha, el botón "Abrir asistente" y la nota sobre el micrófono.
- [ ] En estado no disponible muestra "Asistente no disponible" con correo y teléfono enlazados (F11, F12).
- [ ] La tarjeta pasa de disponible a no disponible si se invoca `onUnavailable` (AC8).
- [ ] El botón es operable con teclado (NF3).

### Story 1.4 — Ajustes visuales

**Como** visitante en móvil,
**necesito** que el widget flotante no tape contenido,
**para** poder leer toda la página.

**Criterios de aceptación:**
- [ ] El footer tiene `padding-bottom: 160px` por debajo de 760 px (F13).
- [ ] A 360 px el aviso de datos ficticios es legible con el widget colapsado (AC9).
- [ ] Los colores del orbe cambian con el modo oscuro (AC11).
- [ ] No quedan colores literales fuera de `tokens.css`.

---

## Epic 2 — Limpieza y documentación

### Story 2.1 — Eliminar el widget propio

**Como** desarrollador,
**necesito** retirar la integración anterior,
**para** no mantener código ni dependencias sin uso.

**Criterios de aceptación:**
- [ ] Se eliminan `VoiceProvider.ts`, `ElevenLabsProvider.ts`, `NullProvider.ts`, `createProvider.ts` y `VoiceWidget.ts` (F14).
- [ ] `@elevenlabs/client` desaparece de `package.json` y `package-lock.json` (AC12).
- [ ] `VITE_VOICE_PROVIDER` desaparece de `.env.example` y `vite-env.d.ts`.
- [ ] Se eliminan los estilos `.voice-*` de `main.css` que queden sin uso.
- [ ] `npm run build` termina sin errores (AC13).

### Story 2.2 — Actualizar documentación

**Como** responsable del proyecto,
**necesito** que la documentación describa la integración vigente,
**para que** nadie configure la versión anterior.

**Criterios de aceptación:**
- [ ] `README.md` explica que solo hace falta `VITE_ELEVENLABS_AGENT_ID` (F15).
- [ ] `agent/README.md` incluye el paso de configurar idioma español, lista de dominios y textos del widget en la consola.
- [ ] `docs/spec0001/architecture.md` marca D3 y D4 como sustituidas por Spec 0002.
- [ ] `docs/spec0001/epics.md` marca las Stories 3.1–3.3 como sustituidas por Spec 0002.

---

## Epic 3 — Verificación con el agente real

### Story 3.1 — Configuración y prueba conversacional

**Como** responsable de la demo,
**necesito** comprobar el agente real a través del widget,
**para** poder mostrar la página con confianza.

**Criterios de aceptación:**
- [ ] En la consola de ElevenLabs, la lista de dominios incluye `localhost` y el dominio de despliegue (P3).
- [ ] El prompt y la base de conocimiento cargados son los de `agent/` (P4).
- [ ] Con `.env` configurado, el widget permite conversar (AC1) y muestra textos en español (AC10).
- [ ] Se ejecuta `agent/test-script.md` (T0–T10) y se registran los resultados con fecha (AC14).
- [ ] Lighthouse móvil: Rendimiento ≥ 85 y Accesibilidad ≥ 90 con el widget cargado (NF2).
