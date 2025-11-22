export interface Diagnosis {
  diagnosticoProvavel: string;
  doencasAssociadas: string[];
  examesSugeridos: string[];
  medicamentosComuns: string[];
  observacao: string;
  error?: string;
}
