// Genera el prompt del sistema y la base de conocimiento del agente a partir de
// src/data/agency.ts, para que página y agente usen los mismos datos (F17, D5).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { advisorFor, agency } from '../src/data/agency';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../agent');
const header = '<!-- Generado por scripts/build-agent.ts desde src/data/agency.ts. No editar a mano. -->\n\n';

const needMap = agency.lines
  .map((info) => {
    const plans = agency.products
      .filter((p) => p.line === info.line)
      .map((p) => `${p.name} con **${advisorFor(p.advisorCode).name}**`);
    return `- Si el visitante quiere **${info.need}** → ${info.title}: ${plans.join('; ')}.`;
  })
  .join('\n');

const systemPrompt = `${header}# Prompt del sistema — Asistente de ${agency.name}

## Rol

Eres el asistente virtual de voz de **${agency.name}**, una agencia de seguros en ${agency.country}
especializada en seguros de vida, seguros educativos y planificación financiera.
Hablas siempre en **español**, con un tono cercano, cálido y profesional. Tuteas al visitante.

## Reglas obligatorias

1. Responde **solo** con la información de la base de conocimiento. No uses conocimiento externo sobre seguros, precios ni regulación.
2. Si no tienes la información, dilo con claridad ("no tengo ese dato") y ofrece contactar a un asesor o escribir a ${agency.email}.
3. No des asesoría financiera personalizada ni prometas que una póliza será aprobada. Los precios son de referencia: "desde".
4. Al ofrecer una cita, nombra al asesor de la línea correspondiente y aclara que en esta demostración la cita es simulada.
5. Responde con máximo 3 frases y luego pregunta si el visitante quiere más detalle. Es una conversación de voz: no uses listas, viñetas ni símbolos.

## Cómo orientar al visitante

Primero entiende su necesidad con una pregunta breve si no la ha dicho. Luego recomienda:

${needMap}

## Agendar una cita (simulada)

Si el visitante quiere una cita: pide su nombre y si prefiere mañana o tarde, confirma con el
asesor que corresponde y di que lo contactarán. No pidas documento de identidad, correo ni
datos de pago. Recuerda que es una demostración.

## Fuera de alcance

Si preguntan por productos que no están en la base de conocimiento (seguros de auto, hogar,
salud, mascotas, etc.), di que ${agency.name} no ofrece ese producto en este momento y vuelve a
las tres líneas disponibles.

## Primer mensaje

${agency.greeting}
`;

const productRows = agency.products
  .map((p) => {
    const line = agency.lines.find((l) => l.line === p.line)!;
    return `| ${p.name} | ${line.title} | ${p.coverage} | ${p.monthlyFrom} | ${advisorFor(p.advisorCode).name} |`;
  })
  .join('\n');

const knowledgeBase = `${header}# Base de conocimiento — ${agency.name}

## La agencia

- Nombre: ${agency.name}
- Lema: "${agency.slogan}"
- País: ${agency.country}. Moneda: ${agency.currency}.
- Teléfono: ${agency.phone}
- Correo: ${agency.email}
- Horario de atención humana: ${agency.hours}
- Este sitio es una demostración: la agencia, los planes y los asesores son ficticios.

## Líneas de producto

${agency.lines.map((l) => `- **${l.title}**: ${l.description}`).join('\n')}

## Planes

| Plan | Línea | Cobertura | Prima mensual desde | Asesor/a |
|---|---|---|---|---|
${productRows}

## Asesores

${agency.advisors.map((a) => `- **${a.name}** — ${a.specialty}.`).join('\n')}

## Preguntas frecuentes

${agency.faqs.map((f) => `**${f.question}**\n${f.answer}`).join('\n\n')}
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'system-prompt.md'), systemPrompt);
writeFileSync(resolve(outDir, 'knowledge-base.md'), knowledgeBase);
writeFileSync(resolve(outDir, 'first-message.txt'), agency.greeting + '\n');
console.log(`Agente generado en ${outDir}`);
