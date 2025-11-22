import { Request, Response, Router } from "express";
import multer from "multer";
import { transcribeAudio } from "../services/transcription";
import { speaker } from "../services/speaker";

export const transcribeRouter = Router();

// Middleware para receber multipart/form-data
const upload = multer();

/**
 * Rota que recebe um arquivo de áudio e retorna:
 * - transcrição (no idioma correto)
 * - identificação de falantes
 * - info do arquivo
 */
transcribeRouter.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;

    console.log("REQ FILE =>", file);

    // Idioma recebido do frontend (pt | en)
    const lang: "pt" | "en" = (req.body.lang as "pt" | "en") ?? "pt";
    console.log("LANG FROM FRONT =>", lang);

    // Nenhum arquivo enviado
    if (!file) {
      return res.status(400).json({
        error: "Nenhum arquivo de áudio foi enviado / No audio file uploaded",
      });
    }

    // Transcrever áudio usando o idioma correto
    const transcript = await transcribeAudio(file.buffer, file.mimetype, lang);

    // Separar falas
    const transcriptSpeaker = await speaker(transcript);

    return res.json({
      text: transcript,
      speaker: transcriptSpeaker,
      mimeType: file.mimetype,
      size: file.size,
      lang,
    });
  } catch (err) {
    console.error("Erro na rota /api/transcribe:", err);

    return res.status(500).json({
      error: "Erro interno / Internal server error",
    });
  }
});
