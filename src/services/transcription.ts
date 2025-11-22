import { randomUUID } from "crypto";
import OpenAI from "openai";
import path from "path";
import * as fs from "fs";
import os from "os";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (
  buffer: Buffer,
  mimeType: string,
  lang: "pt" | "en" = "pt",
): Promise<string> => {
  try {
    // Diretório temporário permitido no Render
    const tempDir = process.env.TMPDIR || os.tmpdir();
    const tempFilePath = path.join(tempDir, `temp-${randomUUID()}.webm`);

    // Salva arquivo temporário
    fs.writeFileSync(tempFilePath, buffer);

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
    throw new Error("Falha ao transcrever o áudio");
  }
};
