export type ProductLine = 'vida' | 'educativo' | 'planificacion';

export interface Product {
  code: string;
  line: ProductLine;
  name: string;
  coverage: string;
  /** Texto ya formateado, p. ej. '$45.000 COP'. */
  monthlyFrom: string;
  advisorCode: string;
}

export interface Advisor {
  code: string;
  name: string;
  specialty: string;
  photo: string;
}

export interface Faq {
  code: string;
  question: string;
  answer: string;
}

export interface LineInfo {
  line: ProductLine;
  title: string;
  description: string;
  /** Necesidad del visitante que lleva a recomendar esta línea. */
  need: string;
}

export interface Agency {
  name: string;
  slogan: string;
  intro: string;
  phone: string;
  email: string;
  hours: string;
  country: string;
  currency: string;
  lines: LineInfo[];
  products: Product[];
  advisors: Advisor[];
  faqs: Faq[];
  sampleQuestions: string[];
  greeting: string;
}
