export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

export enum AiTone {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  CONCISE = 'Concise',
  EXPANDED = 'Expanded',
  GRAMMAR_FIX = 'Fix Grammar'
}

export interface ConversionLog {
  id: string;
  tool: string;
  timestamp: Date;
  status: 'success' | 'error';
}