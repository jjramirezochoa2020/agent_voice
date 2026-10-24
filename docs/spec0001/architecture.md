# Architecture — Spec 0001: Landing page con agente de voz embebido

## Estado actual

El repositorio `agent_voice` solo contiene `docs/`. No hay código, dependencias ni configuración
de build. Todo lo descrito aquí es nuevo.

## Estado objetivo

```
┌───────────────────────── Navegador ─────────────────────────┐
│                                                             │
│  index.html                                                 │
│   ├─ secciones (header, hero, productos, asesores, faq…)    │
│   │     ▲ renderizadas desde                                │
│   │     │                                                   │
│   │  src/data/agency.ts  ◄──── fuente única de datos dummy  │
│   │     │                                                   │
│   │     ▼ genera (script de build)                          │
│   │  agent/system-prompt.md + agent/knowledge-base.md       │
│   │                                                         │
│   └─ sección Agente                                         │
│         └─ VoiceWidget (UI propia: botón, estado, transcr.) │
│               └─ VoiceProvider (interfaz)                   │
│                     └─ ElevenLabsProvider ──────────────────┼──► ElevenLabs
│                                                             │    Conversational AI
└─────────────────────────────────────────────────────────────┘
```

- La página es **estática**: no hay backend propio.
- `agency.ts` es la **única fuente** de agencia, productos, asesores y preguntas (F8, F17).
- El widget de voz habla con el proveedor a través de una **interfaz `VoiceProvider`** (F18).

## Archivos a crear

| Archivo | Propósito |
|---|---|
| `package.json` | Scripts `dev`, `build`, `preview`, `agent:build`, `lint`. |
| `vite.config.ts` | Configuración de Vite. |
| `tsconfig.json` | TypeScript estricto. |
| `.env.example` | `VITE_VOICE_PROVIDER`, `VITE_ELEVENLABS_AGENT_ID`. |
| `index.html` | Estructura semántica de la página y puntos de montaje. |
| `src/main.ts` | Arranque: renderiza secciones y monta el widget. |
| `src/data/agency.ts` | Datos dummy tipados (PRD, sección "Datos dummy"). |
| `src/data/types.ts` | Tipos `Agency`, `Product`, `Advisor`, `Faq`. |
| `src/sections/*.ts` | Una función de render por sección: `header`, `hero`, `products`, `agent`, `advisors`, `faq`, `footer`. |
| `src/voice/VoiceProvider.ts` | Interfaz del proveedor y tipo `VoiceState`. |
| `src/voice/ElevenLabsProvider.ts` | Implementación para ElevenLabs. |
| `src/voice/NullProvider.ts` | Implementación vacía cuando no hay configuración (AC10). |
| `src/voice/createProvider.ts` | Elige la implementación según `VITE_VOICE_PROVIDER`. |
| `src/voice/VoiceWidget.ts` | UI del widget: botón, indicador de estado, transcripción, manejo de permisos. |
| `src/styles/tokens.css` | Colores, tipografía y espaciado como variables CSS. |
| `src/styles/main.css` | Estilos de layout y componentes. |
| `scripts/build-agent.ts` | Genera los archivos de `agent/` a partir de `agency.ts`. |
| `agent/system-prompt.md` | Prompt del sistema del agente (generado). |
| `agent/knowledge-base.md` | Base de conocimiento para cargar en el proveedor (generado). |
| `agent/README.md` | Cómo cargar prompt y base de conocimiento en el proveedor. |
| `agent/test-script.md` | Guion de prueba conversacional y registro de resultados (AC7–AC9). |
| `public/img/advisors/*.svg` | Fotos placeholder de los asesores. |

## Contratos

### Datos

```ts
// src/data/types.ts
export type ProductLine = 'vida' | 'educativo' | 'planificacion';

export interface Product {
  code: string;          // 'P1'…'P6'
  line: ProductLine;
  name: string;
  coverage: string;
  monthlyFrom: string;   // texto ya formateado: '$45.000 COP'
  advisorCode: string;   // 'A1'…'A4'
}

export interface Advisor { code: string; name: string; specialty: string; photo: string; }
export interface Faq     { code: string; question: string; answer: string; }

export interface Agency {
  name: string; slogan: string; phone: string; email: string; hours: string;
  products: Product[]; advisors: Advisor[]; faqs: Faq[];
}
```

### Proveedor de voz

```ts
// src/voice/VoiceProvider.ts
export type VoiceState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';

export interface TranscriptLine { role: 'user' | 'agent'; text: string; }

export interface VoiceProvider {
  readonly available: boolean;
  start(): Promise<void>;
  stop(): Promise<void>;
  onState(cb: (s: VoiceState) => void): void;
  onTranscript(cb: (line: TranscriptLine) => void): void;
}
```

`VoiceWidget` solo conoce esta interfaz. `ElevenLabsProvider` usa el SDK web `@elevenlabs/client`
(`Conversation.startSession({ agentId })`) y traduce sus eventos `onModeChange`, `onStatusChange`
y `onMessage` a `VoiceState` y `TranscriptLine`. El SDK se importa con `import()` dinámico al
pulsar "Hablar", para no penalizar la carga inicial (NF3).

### Flujo de una conversación

```
Visitante pulsa "Hablar"
  → VoiceWidget muestra aviso de micrófono (F11)
  → navigator.mediaDevices.getUserMedia({ audio: true })
       ├─ denegado → estado 'error' + mensaje con teléfono y correo (AC6)
       └─ concedido → provider.start()  → 'connecting' → 'listening' ⇄ 'speaking'
Visitante pulsa "Finalizar" o Esc
  → provider.stop() → 'idle'
```

## Agente

El script `scripts/build-agent.ts` produce dos archivos que se cargan en el proveedor:

- **`system-prompt.md`**: rol (asistente virtual de Empire Lead Company), idioma español, tono
  cercano y breve, reglas de F14–F16 y mapa necesidad → línea → asesor.
- **`knowledge-base.md`**: agencia, tabla de productos, asesores y preguntas frecuentes,
  volcados desde `agency.ts`.

Reglas obligatorias del prompt:

1. Responder solo con información de la base de conocimiento.
2. Si falta información: decirlo y ofrecer contacto con un asesor.
3. No dar asesoría financiera personalizada ni prometer aprobación de pólizas.
4. Al ofrecer cita, nombrar al asesor de la línea y aclarar que es una demo.
5. Respuestas de máximo 3 frases antes de preguntar si el visitante quiere más detalle.

Primer mensaje: *"Hola, soy el asistente virtual de Empire Lead Company. ¿Te interesa proteger a tu
familia, la educación de tus hijos o planear tu retiro?"*

## Diseño visual

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#0B2545` | Header, títulos, botón principal |
| `--color-accent` | `#13A07A` | Llamadas a la acción, estado "escuchando" |
| `--color-surface` | `#F5F7FA` | Fondos de sección alternos |
| `--color-text` | `#1F2933` | Texto |
| `--font-base` | Inter, system-ui | Todo el sitio |
| `--radius` | `12px` | Tarjetas y botones |

Se incluye variante de modo oscuro con `prefers-color-scheme`. El indicador de estado del widget
usa color **y** texto, nunca solo color (NF2).

## Decisiones de diseño

| # | Decisión | Alternativas descartadas |
|---|---|---|
| D1 | Sitio estático con Vite + TypeScript, sin framework. | Next.js / Astro: añaden SSR y tooling que una página sin estado no necesita. |
| D2 | ElevenLabs Conversational AI como proveedor inicial. | Vapi, Retell, OpenAI Realtime: válidos, intercambiables por D3. OpenAI Realtime exige un backend para emitir tokens efímeros. |
| D3 | ~~Sustituida por Spec 0002 (widget oficial).~~ Interfaz `VoiceProvider` con implementaciones por proveedor. | Usar el widget nativo `<elevenlabs-convai>`: más rápido, pero acopla la UI al proveedor e impide cumplir F10–F12 con estilo propio. |
| D4 | ~~Sustituida por Spec 0002 (widget oficial).~~ UI del widget propia en vez de la del proveedor. | Ver D3. |
| D5 | `agency.ts` como fuente única para página y agente. | Duplicar textos en HTML y en el proveedor: se desincronizan al primer cambio de precio. |
| D6 | Prompt y base de conocimiento generados y versionados en `agent/`. | Editarlos solo en la consola del proveedor: no quedan en control de versiones. |
| D7 | Carga diferida del SDK de voz. | Cargar en el `<head>`: penaliza LCP sin que el visitante haya pedido hablar. |
| D8 | `NullProvider` cuando falta configuración. | Fallar en tiempo de ejecución: rompe la página en entornos sin credenciales. |
| D9 | Agente público (sin autenticación) en el proveedor, restringido por dominio permitido. | URL firmada desde backend: necesaria en producción real, innecesaria para una demo. |

## No requerido

- Backend propio, base de datos o API.
- Router o múltiples páginas.
- Librería de componentes o CSS framework.
- Tests end-to-end automatizados de voz: la verificación de AC7–AC9 es manual con guion.
- Internacionalización.
