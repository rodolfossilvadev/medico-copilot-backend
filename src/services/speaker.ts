import OpenAI from "openai";
import dotenv from "dotenv";
import type { SpeakerMessage } from "../types/consultation.types";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Classifica trechos da transcrição como "paciente" ou "medico".
 * Retorna sempre um array JSON.
 */
export async function speaker(transcript: string): Promise<SpeakerMessage[]> {
  const prompt = `
Classifique o diálogo abaixo. Retorne APENAS um ARRAY JSON no formato:
[
  { "speaker": "paciente" | "medico", "text": "..." }
]

Regras:
- Separe por frases curtas.
- Não invente conteúdo.
- Nada fora do JSON.

Texto:
"${transcript}"
`;

  const result = await openai.chat.completions.create({
    model: process.env.MODEL || "gpt-4o-mini",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = result.choices[0]?.message?.content || "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1) return []; // fallback seguro

  return JSON.parse(cleaned.slice(start, end + 1)) as SpeakerMessage[];
}
