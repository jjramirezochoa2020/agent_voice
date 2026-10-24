# Implementation Readiness Report — Spec 0002

## Checklist de cobertura

| Artefacto | Estado | Observaciones |
|---|---|---|
| `spec0002.md` | ✅ Completo | Código entregado por ElevenLabs, alcance, cambio respecto a Spec 0001 y 4 preguntas abiertas. |
| `prd.md` | ✅ Completo | 15 funcionalidades, 3 no funcionales, decisión sobre cada pregunta abierta y sobre la versión del script, 14 criterios de aceptación. |
| `architecture.md` | ✅ Completo | Estado actual y objetivo, 1 archivo nuevo, 11 modificados, 5 eliminados, contrato del cargador, URL y SRI verificados, 8 decisiones con alternativas. |
| `epics.md` | ✅ Completo | 3 epics, 7 stories con criterios verificables. |
| Trazabilidad PRD → epics | ✅ | F1-F7→1.1, F8-F9→1.2, F10-F12→1.1/1.3, F13→1.4, F14→2.1, F15→2.2. NF1→1.1, NF2→3.1, NF3→1.3. |

## Análisis de riesgos

| # | Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | **`elevenlabs-agent:expand` no es API documentada.** Se identificó leyendo el código de la versión 0.18.3; una versión futura podría quitarlo o cambiarlo. | Media | Medio | La versión está fijada (D3), así que no cambia sin una actualización deliberada. Si el evento deja de funcionar, los botones siguen llevando a la sección del agente y el widget flotante sigue visible. Revisar al subir de versión. |
| R2 | **Peso del widget.** ≈ 1,5 MB sin comprimir y ≈ 465 kB gzip, frente a 16 kB de la página. | Alta | Medio | Inserción tras `load` (D4). Verificar NF2 con Lighthouse; si no se cumple, pasar a cargar solo al pulsar un botón. |
| R3 | **Dependencia de unpkg.** Si unpkg cae o un bloqueador lo filtra, no hay asistente. | Baja | Medio | `onerror` muestra "Asistente no disponible" con contacto (F12, AC8). |
| R4 | **SRI y publicación del paquete.** Si unpkg sirviera un archivo distinto para `0.18.3`, el navegador lo bloquea. | Muy baja | Medio | Las versiones de npm son inmutables. El bloqueo cae en el caso de R3. Es el comportamiento deseado frente a una manipulación. |
| R5 | **Idioma del widget.** `language="es"` solo surte efecto si el agente admite español en la consola. | Media | Bajo | Story 3.1 verifica AC10; configurar idioma y textos del widget en la consola. |
| R6 | **Consumo de minutos por terceros.** El Agent ID es visible en el DOM de cualquier visitante. | Baja | Medio | Lista de dominios permitidos (P3) y límite de gasto en la cuenta. Es la misma situación que en Spec 0001 (D9). |
| R7 | **El widget tapa contenido en móvil.** | Media | Bajo | Padding inferior del footer (Story 1.4) y verificación AC9. |
| R8 | **Pérdida del control visual.** Estados, transcripción y permiso de micrófono dejan de seguir la identidad y los criterios de accesibilidad propios. | Alta | Bajo | Aceptado al elegir el widget oficial. Los colores del orbe siguen los tokens (D7). |

## Dependencias verificadas

Verificadas el 2026-10-23.

| Dependencia | Estado |
|---|---|
| `@elevenlabs/convai-widget-embed@0.18.3` publicado en npm el 2026-09-29 | ✅ Última estable con más de dos semanas (la siguiente, 0.19.0, es del 2026-10-06). |
| unpkg sirve `…@0.18.3/dist/index.js` con `access-control-allow-origin: *` | ✅ `curl -I`; la URL sin ruta responde 301 hacia ese archivo. |
| SHA-384 del archivo servido = SHA-384 del tarball de npm | ✅ `sha384-BpmvKCW/TFrpO8oObmUgZzUCIMHI00QbpGA4/jfXcfTosbgtuEUN1wYT7nNIsV3v` |
| Atributos `agent-id`, `placement`, `language`, `avatar-orb-color-1`, `avatar-orb-color-2` admitidos | ✅ Presentes en la lista de atributos observados del componente. |
| Valor por defecto `placement: bottom-right` | ✅ Configuración por defecto del componente. |
| Evento `elevenlabs-agent:expand` escuchado en `document` con `action: expand / collapse / toggle` | ⚠️ Confirmado en el código; no documentado (R1). |
| Agent ID `agent_9101m5mtb0t0erb9rc22a6fpw2fn` | ⚠️ Entregado por el solicitante; no probado aún con una conversación real. |
| Lista de dominios permitidos configurada en ElevenLabs | ⚠️ Pendiente (P3). |
| Prompt y base de conocimiento de `agent/` cargados en el agente | ⚠️ Pendiente de confirmar (P4). |

## Estimación

| Epic | Stories | Esfuerzo |
|---|---|---|
| 1 — Widget oficial | 1.1, 1.2, 1.3, 1.4 | 0,5 día |
| 2 — Limpieza y documentación | 2.1, 2.2 | 0,25 día |
| 3 — Verificación con el agente real | 3.1 | 0,25 día |
| **Total** | **7 stories** | **1 día** |

## Orden de implementación recomendado

1. **Story 1.1**: el cargador es la pieza de la que dependen las demás.
2. **Story 1.3**: la tarjeta con sus dos estados, conectada a `onUnavailable`.
3. **Story 1.2**: los botones, una vez existe `open()`.
4. **Story 2.1**: eliminar la integración anterior cuando la nueva ya funciona.
5. **Story 1.4**: ajustes visuales con el widget real en pantalla.
6. **Story 2.2**: documentación.
7. **Story 3.1**: configuración en la consola y prueba conversacional al final.

## Veredicto

**Listo para implementar.** Las Epics 1 y 2 no tienen bloqueos. La Story 3.1 requiere que el
solicitante configure en ElevenLabs la lista de dominios y confirme el prompt cargado (P3, P4).
El único riesgo técnico relevante es R1, acotado por la versión fija y con degradación aceptable.
