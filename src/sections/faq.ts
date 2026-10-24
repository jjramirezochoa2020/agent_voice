import { agency } from '../data/agency';
import { esc } from './escape';

export function renderFaq(root: HTMLElement): void {
  root.innerHTML = `
    <div class="container narrow">
      <h2 id="preguntas-title">Preguntas frecuentes</h2>
      <div class="faq">
        ${agency.faqs
          .map(
            (f) => `
          <details>
            <summary>${esc(f.question)}</summary>
            <p>${esc(f.answer)}</p>
          </details>`,
          )
          .join('')}
      </div>
    </div>`;
}
