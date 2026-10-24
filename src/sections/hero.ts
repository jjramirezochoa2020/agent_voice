import { agency } from '../data/agency';
import { esc } from './escape';

export function renderHero(root: HTMLElement): void {
  root.innerHTML = `
    <div class="container hero-inner">
      <div>
        <p class="eyebrow">Seguros de vida · Educativos · Planificación financiera</p>
        <h1>${esc(agency.slogan)}</h1>
        <p class="lead">${esc(agency.intro)}</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary btn-lg" data-start-agent>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-2.1A7 7 0 0 0 19 12h-2Z"/></svg>
            Habla con nuestro asistente
          </button>
          <a class="btn btn-ghost btn-lg" href="#productos">Ver productos</a>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="hero-wave"><span></span><span></span><span></span><span></span><span></span></div>
      </div>
    </div>`;
}
