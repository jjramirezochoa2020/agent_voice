import { agency } from '../data/agency';
import { esc } from './escape';

const MENU = [
  ['#inicio', 'Inicio'],
  ['#productos', 'Productos'],
  ['#asesores', 'Asesores'],
  ['#preguntas', 'Preguntas'],
  ['#contacto', 'Contacto'],
];

export function renderHeader(root: HTMLElement): void {
  root.innerHTML = `
    <div class="container header-inner">
      <a class="logo" href="#inicio" aria-label="${esc(agency.name)}, inicio">
        <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="20" r="8"/><path d="M2 20h28" /></svg>
        <span>${esc(agency.name)}</span>
      </a>
      <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="main-menu" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
      <nav id="main-menu" class="main-menu" aria-label="Principal">
        <ul>${MENU.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
        <button type="button" class="btn btn-primary btn-sm" data-start-agent>Hablar con el asistente</button>
      </nav>
    </div>`;

  const toggle = root.querySelector<HTMLButtonElement>('.menu-toggle')!;
  const menu = root.querySelector<HTMLElement>('.main-menu')!;
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a, button')) setOpen(false);
  });
}
