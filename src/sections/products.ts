import { advisorsForLine, agency } from '../data/agency';
import { esc } from './escape';

export function renderProducts(root: HTMLElement): void {
  const cards = agency.lines
    .map((info) => {
      const plans = agency.products.filter((p) => p.line === info.line);
      const advisors = advisorsForLine(info.line).map((a) => `<strong>${esc(a.name)}</strong>`);
      return `
        <article class="card product-card product-${info.line}">
          <h3>${esc(info.title)}</h3>
          <p class="muted">${esc(info.description)}</p>
          <ul class="plans">
            ${plans
              .map(
                (p) => `
              <li>
                <h4>${esc(p.name)}</h4>
                <p>${esc(p.coverage)}</p>
                <p class="price">${
                  p.monthlyFrom.includes('COP')
                    ? `<span>Desde</span> ${esc(p.monthlyFrom)}<span>/mes</span>`
                    : esc(p.monthlyFrom)
                }</p>
              </li>`,
              )
              .join('')}
          </ul>
          <p class="card-foot">${advisors.length > 1 ? 'Te asesoran' : 'Te asesora'} ${advisors.join(' y ')}</p>
        </article>`;
    })
    .join('');

  root.innerHTML = `
    <div class="container">
      <h2 id="productos-title">Nuestros productos</h2>
      <p class="section-lead">Precios de referencia. Tu prima final depende de tu perfil.</p>
      <div class="grid grid-3">${cards}</div>
    </div>`;
}
