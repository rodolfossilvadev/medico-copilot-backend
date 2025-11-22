import { z } from "zod";

/**
 * Estrutura da transcrição com identificação de falantes.
 * Usado reconstruir o diálogo no front.
 */
export const speakerMessageSchema = z.object({
  speaker: z.enum(["paciente", "medico"]),
  text: z.string(),
});

/**
 * Estrutura de cada pergunta feita na consulta (caso futuro).
 */
export const querySchema = z.object({
  id: z.string(),
  speaker: z.enum(["doctor", "patient"]), // inglês aqui pq vem do futuro backend/LLM
  text: z.string(),
  timestamp: z.number(),
});

/**
 * Schema principal da criação de uma consulta.
 * O backend valida tudo ANTES de salvar.
 */
export const consultationRequestSchema = z.object({
  patientName: z
    .string()
    .min(2, "Nome do paciente é obrigatório / Patient name is required"),

  // Transcrição completa
  transcript: z.string().min(10, "Texto muito curto / Transcript too short"),

  // Transcrição segmentada
  transcriptSpeaker: z.array(speakerMessageSchema).optional(),
  queries: z.array(querySchema),
  meta: z.object({
    language: z.enum(["pt", "en"]),
    specialty: z.string().min(2, "Especialidade muito curta / Specialty too short"),
  }),

  // Diagnóstico retornado pela IA (não validamos a estrutura interna)
  diagnosis: z.any(),
});

export type ConsultationRequestDTO = z.infer<typeof consultationRequestSchema>;
