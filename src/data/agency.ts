import type { Advisor, Agency, ProductLine } from './types';

// Fuente única de datos dummy (PRD, sección "Datos dummy").
// La página y el agente de voz se generan a partir de este archivo.
export const agency: Agency = {
  name: 'Empire Lead Company',
  slogan: 'Protegemos hoy lo que más importa mañana',
  intro:
    'Seguros de vida, educativos y planificación financiera para que tu familia avance tranquila. ' +
    'Pregúntale a nuestro asistente de voz y encuentra el plan que se ajusta a ti.',
  phone: '+57 (601) 555 0100',
  email: 'contacto@empireleadcompany.example',
  hours: 'Lunes a viernes, 8:00 a. m. – 6:00 p. m.',
  country: 'Colombia',
  currency: 'COP',
  lines: [
    {
      line: 'vida',
      title: 'Seguros de vida',
      description: 'Respaldo económico para tu familia si llegas a faltar.',
      need: 'proteger a la familia',
    },
    {
      line: 'educativo',
      title: 'Seguros educativos',
      description: 'Garantiza los estudios de tus hijos pase lo que pase.',
      need: 'asegurar la educación de los hijos',
    },
    {
      line: 'planificacion',
      title: 'Planificación financiera',
      description: 'Ahorra, invierte y planea tu retiro con acompañamiento experto.',
      need: 'planear el retiro o el patrimonio',
    },
  ],
  products: [
    {
      code: 'P1',
      line: 'vida',
      name: 'Vida Esencial',
      coverage: 'Hasta $100.000.000 COP por fallecimiento',
      monthlyFrom: '$45.000 COP',
      advisorCode: 'A1',
    },
    {
      code: 'P2',
      line: 'vida',
      name: 'Vida Plus',
      coverage: 'Hasta $300.000.000 COP + enfermedades graves',
      monthlyFrom: '$95.000 COP',
      advisorCode: 'A1',
    },
    {
      code: 'P3',
      line: 'educativo',
      name: 'Educa Futuro',
      coverage: 'Matrícula universitaria garantizada, hasta 10 semestres',
      monthlyFrom: '$180.000 COP',
      advisorCode: 'A2',
    },
    {
      code: 'P4',
      line: 'educativo',
      name: 'Educa Express',
      coverage: 'Ahorro a 5 años para educación técnica',
      monthlyFrom: '$120.000 COP',
      advisorCode: 'A2',
    },
    {
      code: 'P5',
      line: 'planificacion',
      name: 'Plan Retiro Tranquilo',
      coverage: 'Ahorro e inversión para pensión voluntaria',
      monthlyFrom: '$250.000 COP',
      advisorCode: 'A3',
    },
    {
      code: 'P6',
      line: 'planificacion',
      name: 'Asesoría Patrimonial',
      coverage: 'Sesión 1:1 con planificador certificado',
      monthlyFrom: 'Primera sesión gratis',
      advisorCode: 'A4',
    },
  ],
  advisors: [
    { code: 'A1', name: 'Guillermo Ramirez', specialty: 'Especialista en seguros de vida', photo: '/img/advisors/a1.svg' },
    { code: 'A2', name: 'Jaime Ramirez', specialty: 'Especialista en seguros educativos', photo: '/img/advisors/a2.svg' },
    { code: 'A3', name: 'Sergio Rojas', specialty: 'Planificador financiero y de retiro', photo: '/img/advisors/a3.svg' },
    { code: 'A4', name: 'Juan Trujillo', specialty: 'Asesor patrimonial certificado', photo: '/img/advisors/a4.svg' },
  ],
  faqs: [
    {
      code: 'Q1',
      question: '¿Qué diferencia hay entre Vida Esencial y Vida Plus?',
      answer:
        'Vida Plus amplía la cobertura hasta $300.000.000 COP e incluye enfermedades graves; ' +
        'Vida Esencial cubre solo fallecimiento hasta $100.000.000 COP.',
    },
    {
      code: 'Q2',
      question: '¿Desde qué edad del hijo puedo contratar un seguro educativo?',
      answer: 'Desde el nacimiento y hasta los 12 años para Educa Futuro; Educa Express no tiene límite de edad.',
    },
    {
      code: 'Q3',
      question: '¿Qué pasa si dejo de pagar la prima?',
      answer: 'Hay un periodo de gracia de 30 días; después la póliza se suspende hasta ponerse al día.',
    },
    {
      code: 'Q4',
      question: '¿Cuánto debería ahorrar mensualmente para mi retiro?',
      answer:
        'Como referencia, entre el 10 % y el 15 % del ingreso mensual; ' +
        'Sergio Rojas puede hacer un cálculo personalizado.',
    },
    {
      code: 'Q5',
      question: '¿Cómo agendo una cita con un asesor?',
      answer: 'Desde el propio asistente o en la sección Asesores; la cita es simulada en esta demo.',
    },
  ],
  sampleQuestions: [
    '¿Qué diferencia hay entre Vida Esencial y Vida Plus?',
    'Quiero asegurar la universidad de mi hija',
    '¿Cuánto debería ahorrar para mi retiro?',
  ],
  greeting:
    'Hola, soy el asistente virtual de Empire Lead Company. ' +
    '¿Te interesa proteger a tu familia, la educación de tus hijos o planear tu retiro?',
};

/** Asesores distintos que atienden los planes de una línea, en orden. */
export function advisorsForLine(line: ProductLine): Advisor[] {
  const codes = [...new Set(agency.products.filter((p) => p.line === line).map((p) => p.advisorCode))];
  return codes.map(advisorFor);
}

export function advisorFor(advisorCode: string) {
  const advisor = agency.advisors.find((a) => a.code === advisorCode);
  if (!advisor) throw new Error(`Asesor desconocido: ${advisorCode}`);
  return advisor;
}
