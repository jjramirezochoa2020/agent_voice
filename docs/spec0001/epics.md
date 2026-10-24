# Epics — Spec 0001: Landing page con agente de voz embebido

---

## Epic 1 — Base del proyecto y datos

### Story 1.1 — Scaffold del proyecto

**Como** desarrollador,
**necesito** un proyecto Vite + TypeScript con estructura definida,
**para que** el resto de stories tenga dónde construirse.

**Criterios de aceptación:**
- [ ] Existen `package.json`, `vite.config.ts`, `tsconfig.json` (modo `strict`) e `index.html`.
- [ ] `npm run dev` levanta el sitio y `npm run build` genera `dist/` sin errores.
- [ ] Existe `.env.example` con `VITE_VOICE_PROVIDER` y `VITE_ELEVENLABS_AGENT_ID`.
- [ ] `.env` está en `.gitignore`.
- [ ] La estructura de carpetas coincide con "Archivos a crear" de `architecture.md`.

### Story 1.2 — Datos dummy tipados

**Como** responsable de contenido,
**necesito** todos los datos de la agencia en un único archivo tipado,
**para que** un cambio de precio o de asesor se haga en un solo lugar.

**Criterios de aceptación:**
- [ ] `src/data/types.ts` define `Agency`, `Product`, `Advisor`, `Faq` y `ProductLine`.
- [ ] `src/data/agency.ts` contiene la agencia, P1–P6, A1–A4 y Q1–Q5 con los valores del PRD.
- [ ] Cada producto referencia un `advisorCode` existente.
- [ ] Un error de tipo en los datos hace fallar `npm run build`.

### Story 1.3 — Tokens de diseño

**Como** diseñador,
**necesito** la identidad visual definida como variables CSS,
**para que** sustituirla por la definitiva no exija tocar componentes.

**Criterios de aceptación:**
- [ ] `src/styles/tokens.css` define los tokens de `architecture.md` (color, tipografía, radio).
- [ ] Existe la variante de modo oscuro con `prefers-color-scheme: dark`.
- [ ] Ningún archivo de estilos fuera de `tokens.css` contiene colores literales.
- [ ] El contraste texto/fondo cumple AA en ambos modos.

---

## Epic 2 — Página

### Story 2.1 — Header y hero

**Como** visitante,
**necesito** ver de inmediato quién es la agencia y cómo hablar con el asistente,
**para** decidir si sigo explorando.

**Criterios de aceptación:**
- [ ] El header muestra logo, menú con anclas a cada sección y botón "Hablar con el asistente" (F1).
- [ ] En móvil el menú se colapsa en un botón accesible (`aria-expanded`).
- [ ] El hero muestra eslogan, texto breve y CTA (F2).
- [ ] El botón del header y el CTA del hero inician el agente (AC4).

### Story 2.2 — Productos

**Como** visitante,
**necesito** ver los planes de cada línea con su cobertura y precio,
**para** saber cuál me interesa.

**Criterios de aceptación:**
- [ ] Se renderizan tres tarjetas, una por línea, generadas desde `agency.ts` (F3, F8).
- [ ] Cada tarjeta lista sus planes con nombre, cobertura y prima "desde".
- [ ] Cambiar `monthlyFrom` de P1 en `agency.ts` se refleja tras el build (AC3).

### Story 2.3 — Asesores, preguntas frecuentes y footer

**Como** visitante,
**necesito** conocer a los asesores, resolver dudas comunes y encontrar el contacto,
**para** tener alternativas al asistente.

**Criterios de aceptación:**
- [ ] Asesores A1–A4 con nombre, especialidad y foto placeholder con `alt` (F5).
- [ ] Preguntas Q1–Q5 en acordeón operable con teclado (`<details>`/`<summary>` o equivalente ARIA) (F6).
- [ ] Footer con teléfono, correo, horario y aviso "Sitio de demostración con datos ficticios" (F7, AC14).

### Story 2.4 — Responsive y accesibilidad

**Como** visitante en móvil o con tecnología de asistencia,
**necesito** que la página funcione igual de bien,
**para** no quedar excluido.

**Criterios de aceptación:**
- [ ] Sin scroll horizontal a 360 px (AC11).
- [ ] Navegación completa por teclado con foco visible (AC13).
- [ ] Jerarquía de encabezados correcta (un único `h1`).
- [ ] Lighthouse móvil: Accesibilidad ≥ 90, Rendimiento ≥ 85 (AC12).

---

## Epic 3 — Agente de voz

### Story 3.1 — Interfaz de proveedor y NullProvider

> **Sustituida por Spec 0002** (widget oficial de ElevenLabs). Se conserva como registro histórico.

**Como** desarrollador,
**necesito** una interfaz común para proveedores de voz,
**para** poder cambiar de proveedor sin tocar la página.

**Criterios de aceptación:**
- [ ] `VoiceProvider`, `VoiceState` y `TranscriptLine` definidos según `architecture.md`.
- [ ] `createProvider()` devuelve la implementación según `VITE_VOICE_PROVIDER`.
- [ ] Sin configuración devuelve `NullProvider` con `available = false` (D8).
- [ ] Ninguna sección importa directamente una implementación concreta.

### Story 3.2 — Widget de voz

> **Sustituida por Spec 0002** (widget oficial de ElevenLabs). Se conserva como registro histórico.

**Como** visitante,
**necesito** un control claro para hablar con el asistente,
**para** saber en todo momento si me está escuchando.

**Criterios de aceptación:**
- [ ] Botón iniciar/finalizar; Esc finaliza la conversación (F9).
- [ ] Indicador con los estados inactivo, conectando, escuchando, hablando y error, con texto y color (F10).
- [ ] Los cambios de estado se anuncian en una región `aria-live="polite"` (NF2).
- [ ] Aviso previo al permiso de micrófono; si se deniega, mensaje con teléfono y correo (F11, AC6).
- [ ] Transcripción visible y ocultable (F12).
- [ ] Con `NullProvider` la sección muestra "Asistente no disponible" (AC10).
- [ ] La sección muestra 3 ejemplos de preguntas (F4).

### Story 3.3 — Integración con ElevenLabs

> **Sustituida por Spec 0002** (widget oficial de ElevenLabs). Se conserva como registro histórico.

**Como** visitante,
**necesito** que el asistente me responda por voz,
**para** resolver mis dudas conversando.

**Criterios de aceptación:**
- [ ] `ElevenLabsProvider` implementa `VoiceProvider` usando `@elevenlabs/client`.
- [ ] El SDK se carga con `import()` dinámico al iniciar la conversación (D7).
- [ ] Los eventos del SDK se traducen a `VoiceState` y `TranscriptLine`.
- [ ] Un fallo de conexión deja el widget en estado `error` con opción de reintentar.
- [ ] El agente está restringido al dominio de la demo en la consola del proveedor (D9).

### Story 3.4 — Prompt y base de conocimiento

**Como** responsable de contenido,
**necesito** que el agente use exactamente los mismos datos que la página,
**para** que nunca diga un precio distinto al publicado.

**Criterios de aceptación:**
- [ ] `npm run agent:build` genera `agent/system-prompt.md` y `agent/knowledge-base.md` desde `agency.ts` (F17).
- [ ] El prompt incluye las 5 reglas obligatorias y el primer mensaje de `architecture.md`.
- [ ] El prompt incluye el mapa necesidad → línea → asesor (F15, F16).
- [ ] Los archivos generados están versionados.
- [ ] Hay instrucciones en `agent/README.md` para cargarlos en el proveedor.

### Story 3.5 — Validación conversacional

**Como** responsable de la demo,
**necesito** comprobar que el agente se comporta según la spec,
**para** poder mostrarla con confianza.

**Criterios de aceptación:**
- [ ] Existe `agent/test-script.md` con los casos de AC7, AC8 y AC9.
- [ ] El agente responde Q1–Q5 de forma coherente con la respuesta de referencia (AC7).
- [ ] Ante una pregunta fuera de catálogo reconoce no saber y deriva a un asesor (AC8).
- [ ] Ante una necesidad educativa recomienda Educa Futuro y ofrece cita con Jaime Ramirez (AC9).
- [ ] Los resultados de la prueba quedan registrados en el mismo archivo con fecha.
