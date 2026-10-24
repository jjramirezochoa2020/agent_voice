import './styles/tokens.css';
import './styles/main.css';
import { renderAdvisors } from './sections/advisors';
import { renderAgent, renderAgentCard } from './sections/agent';
import { renderFaq } from './sections/faq';
import { renderFooter } from './sections/footer';
import { renderHeader } from './sections/header';
import { renderHero } from './sections/hero';
import { renderProducts } from './sections/products';
import { createElevenLabsWidget } from './voice/elevenlabsWidget';

const el = (id: string) => document.getElementById(id)!;

renderHeader(el('site-header'));
renderHero(el('inicio'));
renderProducts(el('productos'));
const agentCard = renderAgent(el('asistente'));
renderAdvisors(el('asesores'));
renderFaq(el('preguntas'));
renderFooter(el('contacto'));

let available = false;
const widget = createElevenLabsWidget(import.meta.env.VITE_ELEVENLABS_AGENT_ID, () => {
  available = false;
  renderAgentCard(agentCard, false);
});
available = widget !== null;
renderAgentCard(agentCard, available);

document.addEventListener('click', (e) => {
  if (!(e.target as HTMLElement).closest('[data-start-agent]')) return;
  if (widget && available) widget.open();
  else el('asistente').scrollIntoView({ behavior: 'smooth' });
});
