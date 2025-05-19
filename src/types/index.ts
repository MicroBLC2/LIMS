export interface Client {
  name: string;
  email: string;
  institution?: string;
  address?: string;
  phone?: string;
}

export interface MicroorganismCount {
  name: string;
  count: number;
  unit: string;
}

export interface TestResult {
  testName: string;
  result: string;
  normalRange?: string;
  interpretation?: string;
}

export enum SampleType {
  WATER = 'Water',
  FOOD = 'Food',
  SOIL = 'Soil',
  CLINICAL = 'Clinical',
  AIR = 'Air',
  SURFACE = 'Surface',
  OTHER = 'Other'
}

export interface Report {
  id: string;
  title: string;
  date: string;
  client: Client;
  sampleId: string;
  sampleType: SampleType;
  sampleDescription?: string;
  collectionDate: string;
  analysisDate: string;
  microorganisms: MicroorganismCount[];
  additionalTests?: TestResult[];
  conclusion: string;
  recommendations?: string;
  analyst: string;
  supervisor?: string;
  notes?: string;
  status: 'draft' | 'completed' | 'sent';
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sampleType: SampleType;
  defaultTests: string[];
}