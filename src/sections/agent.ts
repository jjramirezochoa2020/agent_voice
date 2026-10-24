import { agency } from '../data/agency';
import { esc } from './escape';

/** Renderiza la sección y devuelve la tarjeta que indica el estado del asistente. */
export function renderAgent(root: HTMLElement): HTMLElement {
  root.innerHTML = `
    <div class="container agent-inner">
      <div>
        <h2 id="asistente-title">Habla con nuestro asistente</h2>
        <p class="section-lead">
          Resuelve tus dudas por voz, en español, cuando quieras. El asistente te orienta
          y te conecta con el asesor indicado.
        </p>
        <p class="examples-title">Prueba a preguntarle:</p>
        <ul class="examples">
          ${agency.sampleQuestions.map((q) => `<li>“${esc(q)}”</li>`).join('')}
        </ul>
      </div>
      <div class="card agent-card" aria-live="polite"></div>
    </div>`;
  return root.querySelector('.agent-card')!;
}

export function renderAgentCard(card: HTMLElement, available: boolean): void {
  const tel = agency.phone.replace(/[^\d+]/g, '');
  card.dataset.state = available ? 'available' : 'unavailable';
  card.innerHTML = available
    ? `
      <div class="agent-orb" aria-hidden="true"><span></span></div>
      <p class="agent-status">Tu asistente está listo</p>
      <p class="muted">Lo encuentras en la esquina inferior derecha de la pantalla.</p>
      <button type="button" class="btn btn-primary" data-start-agent>Abrir asistente</button>
      <p class="agent-note">Usaremos tu micrófono solo durante la conversación. No guardamos tus datos.</p>`
    : `
      <div class="agent-orb" aria-hidden="true"><span></span></div>
      <p class="agent-status">Asistente no disponible</p>
      <p class="agent-note">
        Mientras tanto, escríbenos a <a href="mailto:${esc(agency.email)}">${esc(agency.email)}</a>
        o llámanos al <a href="tel:${tel}">${esc(agency.phone)}</a>.
      </p>`;
}
