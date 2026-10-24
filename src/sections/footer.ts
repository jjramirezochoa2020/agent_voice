import { agency } from '../data/agency';
import { esc } from './escape';

export function renderFooter(root: HTMLElement): void {
  const tel = agency.phone.replace(/[^\d+]/g, '');
  root.innerHTML = `
    <div class="container footer-inner">
      <div>
        <p class="footer-brand">${esc(agency.name)}</p>
        <p>${esc(agency.slogan)}</p>
      </div>
      <address>
        <p><a href="tel:${tel}">${esc(agency.phone)}</a></p>
        <p><a href="mailto:${esc(agency.email)}">${esc(agency.email)}</a></p>
        <p>${esc(agency.hours)}</p>
      </address>
    </div>
    <div class="container footer-legal">
      <p><strong>Sitio de demostración con datos ficticios.</strong>
      Los planes, precios y asesores son ilustrativos.</p>
      <p>© ${new Date().getFullYear()} ${esc(agency.name)}</p>
    </div>`;
}
