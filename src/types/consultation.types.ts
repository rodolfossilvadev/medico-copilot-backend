import type { Diagnosis } from "./diagnosis.types";

/** Mensagem da transcrição com identificação do falante */
export type SpeakerMessage = {
  speaker: "paciente" | "medico";
  text: string;
};

/** Perguntas feitas durante a consulta */
export interface Queries {
  id: string;
  speaker: "medico" | "paciente";
  text: string;
  timestamp: number;
}

/** Metadados da consulta */
export interface ConsultationMeta {
  language: "pt" | "en";
  specialty:
    | "general"
    | "cardiology"
    | "pediatrics"
    | "psychiatry"
    | "endocrinology"
    | "gynecology"
    | "orthopedics"
    | "neurology";
  createdAt: string;
}

/** Estrutura completa de uma consulta salva */
export interface Consultation {
  id: string;
  patientName: string;
  transcript: string;
  transcriptSpeaker?: SpeakerMessage[];
  queries: Queries[];
  diagnosis: Diagnosis;
  meta: ConsultationMeta;
}
