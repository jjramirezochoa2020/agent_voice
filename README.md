# Empire Lead Company — Agente de voz

Landing page de demostración de una agencia de seguros ficticia con un agente de voz embebido.
Especificación en [`docs/spec0001/`](docs/spec0001/).

## Requisitos

- Node.js ≥ 20

## Uso

```bash
npm install
cp .env.example .env   # añade VITE_ELEVENLABS_AGENT_ID
npm run dev            # http://localhost:5173
```

Sin `VITE_ELEVENLABS_AGENT_ID`, la página funciona y la sección del agente muestra
"Asistente no disponible".

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Genera el agente, comprueba tipos y construye `dist/`. |
| `npm run preview` | Sirve `dist/`. |
| `npm run agent:build` | Regenera `agent/` desde `src/data/agency.ts`. |
| `npm run lint` | Comprobación de tipos. |

## Estructura

- `src/data/agency.ts` — **fuente única** de datos dummy (agencia, planes, asesores, preguntas).
- `src/sections/` — una función de render por sección de la página.
- `src/voice/elevenlabsWidget.ts` — carga el widget oficial de ElevenLabs (versión fija con SRI) y lo abre desde los botones de la página.
- `src/styles/tokens.css` — identidad visual; único archivo con colores.
- `agent/` — prompt y base de conocimiento generados, instrucciones de carga y guion de prueba.

## Configurar el agente

Ver [`agent/README.md`](agent/README.md).

El micrófono requiere HTTPS fuera de `localhost`.
