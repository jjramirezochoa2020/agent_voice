# Implementation Readiness Report — Spec 0001

## Checklist de cobertura

| Artefacto | Estado | Observaciones |
|---|---|---|
| `spec0001.md` | ✅ Completo | Requerimiento original con datos dummy y preguntas abiertas. |
| `prd.md` | ✅ Completo | Problema, datos dummy codificados (P1–P6, A1–A4, Q1–Q5), 18 funcionalidades, 5 no funcionales, 4 puntos abiertos decididos, 14 criterios de aceptación, fuera de alcance explícito. |
| `architecture.md` | ✅ Completo | Diagrama, 22 archivos nuevos y 0 modificados, contratos de datos y de proveedor, flujo de conversación, reglas del agente, tokens visuales, 9 decisiones con alternativas. |
| `epics.md` | ✅ Completo | 3 epics, 12 stories con criterios verificables. |
| Trazabilidad PRD → epics | ✅ | F1-F2→2.1, F3→2.2, F4→3.2, F5-F7→2.3, F8→1.2/2.2, F9-F12→3.2, F13-F16→3.4/3.5, F17→3.4, F18→3.1. NF1-NF2→2.4/1.3, NF3→3.3, NF4→2.4, NF5→D9. |

## Análisis de riesgos

| # | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | **Proveedor de voz sin confirmar.** D2 asume ElevenLabs; si se elige otro, cambia la Story 3.3. | Media | Bajo | El adaptador (D3) aísla el cambio a un archivo. Las Epics 1 y 2 no dependen del proveedor. |
| R2 | **El agente inventa precios o coberturas.** Los LLM tienden a completar información faltante. | Media | Alto | Reglas 1-2 del prompt, base de conocimiento cerrada y caso AC8 en el guion. Revisar la transcripción en cada prueba. |
| R3 | **Desincronización entre página y agente.** Si se edita `agency.ts` y no se recarga la base de conocimiento en el proveedor, el agente queda desactualizado. | Media | Medio | `agent:build` en el flujo de build y paso explícito en `agent/README.md`. La carga al proveedor sigue siendo manual. |
| R4 | **Permiso de micrófono en Safari iOS.** Exige HTTPS y gesto del usuario; falla en `http://` fuera de `localhost`. | Alta | Medio | Pedir el permiso solo tras el clic (F11) y desplegar siempre en HTTPS. |
| R5 | **Abuso del agente público.** Cualquiera con el `agentId` puede consumir minutos. | Baja | Medio | Restricción por dominio en la consola (D9) y límite de gasto en la cuenta del proveedor. |
| R6 | **Latencia de voz.** Una respuesta lenta arruina la percepción de la demo. | Media | Medio | Respuestas cortas (regla 5), indicador "conectando" visible y prueba en red móvil. |
| R7 | **Confusión con una agencia real.** El nombre o los datos podrían coincidir con una empresa existente. | Baja | Medio | Dominio `.example`, aviso en el footer y en el saludo del agente al ofrecer cita. |

## Dependencias

| Dependencia | Estado |
|---|---|
| Node.js ≥ 20 y npm | ⚠️ Por verificar en el entorno de desarrollo. |
| Cuenta en ElevenLabs con agente creado y `agentId` | ⚠️ Pendiente. Bloquea la Story 3.3, no las anteriores. |
| Paquete `@elevenlabs/client` | ⚠️ Fijar versión exacta al instalar. |
| Hosting estático con HTTPS (Vercel, Netlify o similar) | ⚠️ Pendiente. Necesario para probar micrófono en móvil (R4). |
| Identidad visual definitiva | ➖ Opcional. Los tokens provisionales permiten avanzar. |

## Estimación

| Epic | Stories | Esfuerzo |
|---|---|---|
| 1 — Base del proyecto y datos | 1.1, 1.2, 1.3 | 0,5 día |
| 2 — Página | 2.1, 2.2, 2.3, 2.4 | 1,5 días |
| 3 — Agente de voz | 3.1, 3.2, 3.3, 3.4, 3.5 | 2 días |
| **Total** | **12 stories** | **4 días** |

## Orden de implementación recomendado

1. **Story 1.1 → 1.2 → 1.3**: sin base y datos no hay nada que renderizar.
2. **Story 3.1**: la interfaz y el `NullProvider` permiten construir el widget sin credenciales.
3. **Stories 2.1 → 2.2 → 2.3**: la página completa, con la sección del agente mostrando "no disponible".
4. **Story 3.2**: el widget sobre `NullProvider`, probando estados y permisos.
5. **Story 3.4**: prompt y base de conocimiento, listos para cargar en el proveedor.
6. **Story 3.3**: integración real, una vez exista el `agentId`.
7. **Story 2.4 y 3.5**: verificación de responsive, accesibilidad y guion conversacional al final, sobre el sitio completo.

## Veredicto

**Listo para implementar, con una condición.** Las Epics 1 y 2 y las Stories 3.1, 3.2 y 3.4 pueden
empezar ya. La Story 3.3 queda bloqueada hasta que el solicitante **confirme el proveedor de voz**
(R1) y se disponga del `agentId`.
