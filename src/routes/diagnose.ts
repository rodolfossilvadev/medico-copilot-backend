import { Router } from "express";
import { getDiagnosis } from "../services/llmClient";
import type { Response, Request } from "express";
import { DiagnoseRequestDTO, diagnoseRequestSchema } from "../schemas/diagnose.schema";

export const diagnoseRouter = Router();

/**
 * Recebe transcript + specialty + lang e envia ao LLM.
 */
diagnoseRouter.post(
  "/",
  async (req: Request<{}, any, DiagnoseRequestDTO>, res: Response) => {
    try {
      console.log("REQ BODY =>", req.body);

      // Validação (inclui lang agora)
      const { transcript, specialty, lang } = diagnoseRequestSchema.parse(req.body);

      // Chama IA com idioma correto
      const result = await getDiagnosis(transcript, specialty, lang);

      // Retorno para o frontend
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },
);
