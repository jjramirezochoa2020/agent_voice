# Architecture — Spec 0002: Integrar el widget oficial de ElevenLabs

## Estado actual

Implementación de Spec 0001:

```
src/main.ts
  ├─ sections/*            (render de la página desde agency.ts)
  └─ new VoiceWidget(root, createProvider())
        └─ createProvider()   lee VITE_VOICE_PROVIDER + VITE_ELEVENLABS_AGENT_ID
              ├─ ElevenLabsProvider   import('@elevenlabs/client') al pulsar "Hablar"
              └─ NullProvider         sin configuración → "Asistente no disponible"

document click [data-start-agent] → widget.start()
```

- Dependencia `@elevenlabs/client@1.26.0` (≈ 588 kB, carga diferida).
- `src/voice/` contiene `VoiceProvider.ts`, `ElevenLabsProvider.ts`, `NullProvider.ts`,
  `createProvider.ts` y `VoiceWidget.ts`.
- `main.css` incluye ≈ 150 líneas de estilos del widget propio (`.voice-*`).

## Estado objetivo

```
src/main.ts
  ├─ sections/*
  ├─ renderAgent(root, available)        tarjeta: "Abrir asistente" o "Asistente no disponible"
  └─ const widget = createElevenLabsWidget(agentId)     ← src/voice/elevenlabsWidget.ts
        ├─ sin agentId     → null (no descarga nada)
        └─ con agentId
              ├─ inserta <elevenlabs-convai agent-id placement language avatar-orb-color-*>
              ├─ window 'load' → inserta <script src=unpkg@0.18.3 integrity crossorigin async>
              ├─ script.onerror → callback onUnavailable → tarjeta "no disponible"
              └─ open() → carga si falta → whenDefined → dispatch 'elevenlabs-agent:expand' (reintenta hasta que se atienda)

document click [data-start-agent] → widget?.open()
```

## Archivos

| Acción | Archivo | Cambio |
|---|---|---|
| Crear | `src/voice/elevenlabsWidget.ts` | Cargador del widget oficial (contrato abajo). |
| Modificar | `src/main.ts` | Usa `createElevenLabsWidget`; elimina `VoiceWidget` y `createProvider`. |
| Modificar | `src/sections/agent.ts` | Tarjeta nueva con dos estados: disponible / no disponible. |
| Modificar | `src/styles/main.css` | Elimina estilos `.voice-*`; añade estilos de la tarjeta y padding inferior del footer en móvil. |
| Modificar | `src/vite-env.d.ts` | Elimina `VITE_VOICE_PROVIDER`. |
| Modificar | `.env.example` | Solo `VITE_ELEVENLABS_AGENT_ID`. |
| Modificar | `package.json` / `package-lock.json` | Elimina `@elevenlabs/client`. |
| Modificar | `README.md`, `agent/README.md` | Nueva configuración. |
| Modificar | `docs/spec0001/architecture.md`, `docs/spec0001/epics.md` | Marca D3, D4 y las Stories 3.1–3.3 como sustituidas por Spec 0002. |
| Eliminar | `src/voice/VoiceProvider.ts`, `ElevenLabsProvider.ts`, `NullProvider.ts`, `createProvider.ts`, `VoiceWidget.ts` | Sustituidos por el widget oficial. |

`index.html` **no cambia**: el elemento y el script se insertan desde TypeScript para poder leer
el Agent ID del entorno (F2).

## Contrato del cargador

```ts
// src/voice/elevenlabsWidget.ts
export interface ElevenLabsWidget {
  /** Abre el panel; si el script aún no cargó, adelanta la carga y abre al terminar. */
  open(): Promise<void>;
}

export function createElevenLabsWidget(
  agentId: string | undefined,
  onUnavailable: () => void,
): ElevenLabsWidget | null;
```

### Constantes

```ts
const WIDGET_SRC =
  'https://unpkg.com/@elevenlabs/convai-widget-embed@0.18.3/dist/index.js';
const WIDGET_SRI = 'sha384-BpmvKCW/TFrpO8oObmUgZzUCIMHI00QbpGA4/jfXcfTosbgtuEUN1wYT7nNIsV3v';
```

Se apunta directamente a `dist/index.js` para evitar la redirección 301 de unpkg. El hash se
calculó sobre el archivo servido por unpkg el 2026-10-23 y coincide con el del tarball de npm.
unpkg responde con `access-control-allow-origin: *`, requisito de SRI con `crossorigin="anonymous"`.

### Elemento insertado

```html
<elevenlabs-convai
  agent-id="${VITE_ELEVENLABS_AGENT_ID}"
  placement="bottom-right"
  language="es"
  avatar-orb-color-1="${--color-accent}"
  avatar-orb-color-2="${--color-primary}">
</elevenlabs-convai>
```

Además se pasa `text-contents` con los textos de la interfaz en español (JSON). En 0.18.3 tiene
prioridad sobre los textos de la consola y los valores por defecto en inglés. El saludo del agente
no es un texto de la interfaz: es el *first message* configurado en la consola.

Atributos verificados en la lista de atributos observados de la versión 0.18.3. Los colores se
leen con `getComputedStyle(document.documentElement)` para respetar la regla de Spec 0001 de no
tener colores literales fuera de `tokens.css`.

### Abrir el panel

El widget 0.18.3 escucha en `document` el evento:

```ts
document.dispatchEvent(
  new CustomEvent('elevenlabs-agent:expand', { detail: { action: 'expand' } }),
);
```

`open()`:

1. Si el script no se ha insertado, lo inserta (F9).
2. Espera `customElements.whenDefined('elevenlabs-convai')`.
3. Despacha el evento y comprueba `detail._convaiEventHandled`, que el widget marca al atenderlo.
4. Si no está marcado, reintenta cada 200 ms (máximo 50 intentos, 10 s).

El widget registra su listener cuando termina de cargar la configuración del agente desde
ElevenLabs, **después** de que el elemento se define. Un único evento tras `whenDefined` se pierde
si el visitante pulsa el botón nada más cargar la página (comprobado con el agente
`agent_9101m5mtb0t0erb9rc22a6fpw2fn`).

Este evento no está documentado como API pública: ver R1 del informe de preparación.

### Fallos

- `script.onerror` (red, bloqueador, SRI no coincide) → `onUnavailable()` → la tarjeta pasa a
  "Asistente no disponible" y `open()` deja de hacer nada.
- Sin `agentId` → `createElevenLabsWidget` devuelve `null`, no se inserta nada y la tarjeta se
  renderiza directamente como no disponible.

## Tarjeta de la sección del agente

| Estado | Contenido |
|---|---|
| Disponible | Orbe decorativo, "Tu asistente está listo", texto "Lo encuentras en la esquina inferior derecha", botón "Abrir asistente" (`data-start-agent`), nota "Usaremos tu micrófono solo durante la conversación". |
| No disponible | "Asistente no disponible", correo y teléfono enlazados. |

## Footer en móvil

El widget colapsado ocupa ≈ 140 px en la esquina inferior (medido a 360 px). Se añade `padding-bottom: 160px` al
footer por debajo de 760 px para que el aviso de datos ficticios quede siempre por encima (F13).

## Decisiones de diseño

| # | Decisión | Alternativas descartadas |
|---|---|---|
| D1 | Widget oficial en lugar de UI propia. Sustituye D3/D4 de Spec 0001. | Mantener la UI propia con el nuevo Agent ID: funciona hoy sin cambios, pero el solicitante pidió el widget oficial. |
| D2 | Insertar elemento y script desde TypeScript. | Pegarlos en `index.html`: obliga a escribir el Agent ID a mano y rompe AC7 de Spec 0001. Plugin de Vite para reemplazar en HTML: más piezas para el mismo resultado. |
| D3 | Versión fija `0.18.3` con SRI. | URL sin versión (la entregada): cambia sola. Instalar el paquete con npm y empaquetarlo: suma 1,5 MB al build y obliga a actualizarlo a mano igualmente. |
| D4 | Insertar el script tras `load`, o antes si el visitante pulsa un botón. | `async` en el `<head>`: no bloquea el parser pero compite por red con el LCP. Cargar solo al pulsar: el widget flotante no se vería hasta entonces. |
| D5 | Flotante en la esquina inferior derecha. | Incrustado en la sección: el widget no ofrece un modo de incrustación en un contenedor y quedaría fuera de vista al hacer scroll. |
| D6 | Abrir con `elevenlabs-agent:expand`. | Solo hacer scroll a la sección: el visitante tendría que localizar el widget por su cuenta. |
| D7 | Colores del orbe desde los tokens. | Configurarlos solo en la consola: se desincronizan del modo oscuro y de la identidad. |
| D8 | Eliminar el widget propio y el SDK. | Conservarlo como alternativa: dos integraciones que mantener. Queda en el historial de git si hiciera falta. |

## No requerido

- Backend ni URL firmada.
- Cambios en `index.html`.
- Tests automatizados de la conversación: la verificación de AC1 y AC14 es manual.
