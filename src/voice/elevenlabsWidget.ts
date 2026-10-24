// Widget oficial de ElevenLabs (Spec 0002). Versión fija con SRI: al actualizarla,
// recalcular el hash y comprobar que el evento `elevenlabs-agent:expand` sigue existiendo.
const WIDGET_SRC = 'https://unpkg.com/@elevenlabs/convai-widget-embed@0.18.3/dist/index.js';
const WIDGET_SRI = 'sha384-BpmvKCW/TFrpO8oObmUgZzUCIMHI00QbpGA4/jfXcfTosbgtuEUN1wYT7nNIsV3v';
const TAG = 'elevenlabs-convai';

// Textos de la interfaz del widget; tienen prioridad sobre los de la consola de ElevenLabs.
// El saludo del agente no está aquí: es el "first message" configurado en la consola.
const TEXTS = {
  main_label: '¿Necesitas ayuda?',
  start_call: 'Hablar con el asistente',
  start_chat: 'Escribir',
  send_message: 'Enviar',
  new_call: 'Nueva llamada',
  end_call: 'Finalizar',
  end_chat: 'Terminar chat',
  mute_microphone: 'Silenciar micrófono',
  text_mode: 'Cambiar a texto',
  voice_mode: 'Cambiar a voz',
  switched_to_text_mode: 'Cambiaste a modo texto',
  switched_to_voice_mode: 'Cambiaste a modo voz',
  change_language: 'Cambiar idioma',
  collapse: 'Contraer',
  expand: 'Expandir',
  copied: '¡Copiado!',
  accept_terms: 'Aceptar',
  dismiss_terms: 'Cancelar',
  listening_status: 'Te escucho',
  speaking_status: 'Habla para interrumpir',
  connecting_status: 'Conectando',
  chatting_status: 'Conversando con el asistente',
  input_label: 'Mensaje de texto',
  input_placeholder: 'Escribe un mensaje...',
  input_placeholder_text_only: 'Escribe un mensaje...',
  input_placeholder_new_conversation: 'Inicia una nueva conversación',
  user_ended_conversation: 'Terminaste la conversación',
  agent_ended_conversation: 'El asistente terminó la conversación',
  error_occurred: 'Ocurrió un error',
  typing_indicator: 'El asistente está escribiendo...',
};

export interface ElevenLabsWidget {
  /** Abre el panel; si el script aún no cargó, adelanta la carga y abre al terminar. */
  open(): Promise<void>;
}

export function createElevenLabsWidget(
  agentId: string | undefined,
  onUnavailable: () => void,
): ElevenLabsWidget | null {
  if (!agentId) return null;

  let failed = false;
  let script: HTMLScriptElement | null = null;

  const element = document.createElement(TAG);
  element.setAttribute('agent-id', agentId);
  element.setAttribute('placement', 'bottom-right');
  element.setAttribute('language', 'es');
  element.setAttribute('text-contents', JSON.stringify(TEXTS));
  applyOrbColors(element);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyOrbColors(element));
  document.body.append(element);

  const loadScript = () => {
    if (script) return;
    script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.integrity = WIDGET_SRI;
    script.crossOrigin = 'anonymous';
    script.async = true;
    script.addEventListener('error', () => {
      failed = true;
      element.remove();
      onUnavailable();
    });
    document.head.append(script);
  };

  // Tras `load` para no competir con el render inicial (D4).
  if (document.readyState === 'complete') loadScript();
  else window.addEventListener('load', loadScript, { once: true });

  return {
    async open() {
      if (failed) return;
      loadScript();
      await customElements.whenDefined(TAG);
      // El widget registra su listener cuando termina de cargar la configuración del agente,
      // después de definirse; reintentar hasta que marque el evento como atendido.
      for (let attempt = 0; attempt < 50; attempt++) {
        const detail: { action: string; _convaiEventHandled?: boolean } = { action: 'expand' };
        document.dispatchEvent(new CustomEvent('elevenlabs-agent:expand', { detail }));
        if (detail._convaiEventHandled) return;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    },
  };
}

function applyOrbColors(element: HTMLElement): void {
  const tokens = getComputedStyle(document.documentElement);
  element.setAttribute('avatar-orb-color-1', tokens.getPropertyValue('--color-accent').trim());
  element.setAttribute('avatar-orb-color-2', tokens.getPropertyValue('--color-primary').trim());
}
