import { z } from "zod";

/**
 * Schema de validação do diagnóstico.
 * Agora inclui suporte a PT/EN.
 */
export const diagnoseRequestSchema = z.object({
  transcript: z.string().min(10, "Texto muito curto"),

  // Especialidades suportadas pelo backend
  specialty: z.enum([
    "general",
    "cardiology",
    "pediatrics",
    "psychiatry",
    "endocrinology",
    "gynecology",
    "orthopedics",
    "neurology",
  ]),

  // Idioma da resposta
  lang: z.enum(["pt", "en"]).default("pt"),
});

export type DiagnoseRequestDTO = z.infer<typeof diagnoseRequestSchema>;
