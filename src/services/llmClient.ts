import dotenv from "dotenv";
import type { Diagnosis } from "../types/diagnosis.types";
import OpenAI from "openai";
import { ConsultationMeta } from "../types/consultation.types";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Modelo da IA
const MODEL = process.env.MODEL || "gpt-4";

/**
 * Gera diagnóstico médico em PT ou EN.
 */
async function getDiagnosis(
  transcript: string,
  specialty: ConsultationMeta["specialty"],
  lang: "pt" | "en" = "pt", // idioma vindo do front
): Promise<Diagnosis> {
  // Prompt em PT e EN
  const promptPT = `
Você é um médico especialista em ${specialty}.
Responda APENAS em JSON válido.

{
  "diagnosticoProvavel": string,
  "doencasAssociadas": string[],
  "examesSugeridos": string[],
  "medicamentosComuns": string[],
  "observacao": "uso educacional, não substitui decisão médica"
}

Analise o texto a seguir:
"${transcript}"
`;

  const promptEN = `
You are a medical doctor specialized in ${specialty}.
Answer ONLY in valid JSON.

{
  "diagnosticoProvavel": string,
  "doencasAssociadas": string[],
  "examesSugeridos": string[],
  "medicamentosComuns": string[],
  "observacao": "educational use only, not a medical decision"
}

Analyze the following text:
"${transcript}"
`;

  // Escolhe o prompt certo
  const prompt = lang === "pt" ? promptPT : promptEN;

  // Chamada ao modelo
  const completion = await openai.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const content = completion.choices[0]?.message?.content;
  console.log("LLM RAW CONTENT =>", content);

  try {
    if (!content) throw new Error("Resposta vazia da IA");

    // Isola apenas o JSON
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("JSON inválido");
    }

    const json = content.slice(start, end + 1);
    return JSON.parse(json) as Diagnosis;
  } catch (err) {
    console.error("Erro ao processar JSON:", err);

    // Fallback seguro
    return {
      diagnosticoProvavel: "",
      doencasAssociadas: [],
      examesSugeridos: [],
      medicamentosComuns: [],
      observacao: "",
      error: "Falha ao interpretar JSON da IA",
    };
  }
}

export { getDiagnosis };
