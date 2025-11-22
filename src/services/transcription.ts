import { randomUUID } from "crypto";
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Tipo da resposta do Whisper quando não é apenas string
interface WhisperObjectResponse {
  text: string;
}

export async function transcribeAudio(
  buffer: Buffer,
  mimeType: string,
  lang: "pt" | "en" = "pt",
): Promise<string> {
  const tempPath = path.join(__dirname, "../../temp", `temp-${randomUUID()}.webm`);

  try {
    fs.writeFileSync(tempPath, buffer);

    const options: {
      file: fs.ReadStream;
      model: string;
      response_format: "text";
      language?: "pt";
    } = {
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
      response_format: "text",
    };

    if (lang === "pt") options.language = "pt";

    const result = await openai.audio.transcriptions.create(options);

    /**
     * Whisper pode retornar:
     *  - string
     *  - { text: string }
     *
     * Então tratamos ambos.
     */
    if (typeof result === "string") {
      return result;
    }

    const whisperObj = result as WhisperObjectResponse;
    return whisperObj.text;
  } catch (err) {
    console.error("Erro na transcrição:", err);
    throw new Error("Falha ao transcrever áudio");
  } finally {
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch {
        /* ignore */
      }
    }
  }
}
