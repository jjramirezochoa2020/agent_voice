import { agency } from '../data/agency';
import { esc } from './escape';

export function renderAdvisors(root: HTMLElement): void {
  root.innerHTML = `
    <div class="container">
      <h2 id="asesores-title">Nuestros asesores</h2>
      <p class="section-lead">Personas reales detrás de cada plan. Agenda una cita a través del asistente.</p>
      <div class="grid grid-4">
        ${agency.advisors
          .map(
            (a) => `
          <article class="card advisor-card">
            <img src="${a.photo}" alt="Foto de ${esc(a.name)}" width="96" height="96" loading="lazy" />
            <h3>${esc(a.name)}</h3>
            <p class="muted">${esc(a.specialty)}</p>
          </article>`,
          )
          .join('')}
      </div>
    </div>`;
}
