import { randomUUID } from "crypto";
import OpenAI from "openai";
import path from "path";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcreve áudio com suporte a PT/EN.
 */
export const transcribeAudio = async (
  buffer: Buffer,
  mimeType: string,
  lang: "pt" | "en" = "pt",
): Promise<string> => {
  try {
    // Caminho da pasta TEMP (Render permite escrever apenas dentro de /tmp)
    const tempDir = "/tmp/medicocontrol";

    // Garante que a pasta existe
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Caminho do arquivo temporário
    const tempFilePath = path.join(tempDir, `temp-${randomUUID()}.webm`);

    // Escreve na área permitida
    fs.writeFileSync(tempFilePath, buffer);

    // Configuração Whisper
    const whisperOptions: any = {
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
      response_format: "text",
    };

    if (lang === "pt") whisperOptions.language = "pt";

    const response = await openai.audio.transcriptions.create(whisperOptions);

    fs.unlinkSync(tempFilePath);

    return typeof response === "string" ? response : response.text;
  } catch (error: any) {
    console.error("Erro na transcrição:", error.message);
    throw new Error("Falha ao transcrever áudio");
  }
};
