# Configuración del agente en ElevenLabs

Los archivos `system-prompt.md`, `knowledge-base.md` y `first-message.txt` se **generan** desde
`src/data/agency.ts`. No se editan a mano: cambia los datos y ejecuta:

```bash
npm run agent:build
```

## Crear el agente (una sola vez)

1. Entra a **ElevenLabs → Agents** y crea un agente en blanco.
2. **Idioma:** Español (idioma principal del agente).
3. **First message:** pega el contenido de `first-message.txt`. Es el saludo del agente; si se deja
   el de por defecto, el widget saluda en inglés.
4. **System prompt:** pega el contenido de `system-prompt.md` (sin el comentario HTML inicial).
5. **Knowledge base:** sube `knowledge-base.md` como documento.
6. **Voz:** elige una voz en español latino, cálida y pausada.
7. **Seguridad:** deja el agente público y, en *Allowlist*, añade solo los dominios de la demo
   (`localhost` y el dominio de despliegue) (D9). Fija un límite de gasto en la cuenta (R5).
8. Copia el **Agent ID** y ponlo en `.env`:

   ```bash
   VITE_ELEVENLABS_AGENT_ID=tu_agent_id
   ```

Los textos de la interfaz del widget (botones, estados, placeholder) ya están en español desde
`src/voice/elevenlabsWidget.ts` y tienen prioridad sobre los de la consola.

## Cada vez que cambien los datos

1. `npm run agent:build`
2. Vuelve a pegar el prompt y sustituye el documento de la base de conocimiento en el proveedor.
3. Repite el guion de `test-script.md`.

El paso 2 es manual: si se omite, el agente queda desactualizado respecto a la página (R3).
