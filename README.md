# 💉 Médico Copilot (Backend)

Backend em **Node.js + TypeScript**.  
Responsável por:

- 🎙️ Receber áudio ou texto da consulta
- 🗣️ Transcrever e identificar falas (médico/paciente)
- 🧠 Gerar diagnóstico estruturado com IA (doenças, exames, medicamentos)

---

## ⚙️ Tecnologias

- Node.js + TypeScript
- Express
- Multer (upload de áudio)
- OpenAI (Whisper + LLM)
- Zod (validação)
- Deploy na Render

---
## 💎 Extras implementados

- 🔊 Suporte a múltiplos falantes (médico/paciente)
- 🌎 Suporte a múltiplos idiomas (PT/EN)
- 🧾 Estrutura pronta para geração de receita em PDF (usada pelo frontend)
- 🩺 Personalização por especialidade médica (influencia a resposta da IA)
- 🛜 Projeto Publicado

Repositório do **Front-end**
<a href="https://github.com/rodolfossilvadev/medic-copilot-frontend" target="_blank">Clique aqui</a> para acessar o repositório

## 🚀 Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/rodolfossilvadev/medico-copilot-backend.git
cd medico-copilot-backend

# 2. Instale as dependências
npm install

# 3. Configure o .env
cp .env.example .env    # se existir
# preencha as variáveis (ver abaixo)

# 4. Suba o servidor em modo dev
npm run dev
# o backend ficará disponível em http://localhost:10000 (ou na porta configurada)
🔐 Variáveis de ambiente (.env)
env
Copiar código
PORT=10000                 # opcional – a Render usa PORT automaticamente
OPENAI_API_KEY=sk-...      # chave da OpenAI
FRONTEND_URL=http://localhost:5173  # ou URL da Vercel em produção
OPENAI_DIAGNOSE_MODEL=gpt-4o-mini   # opcional
OPENAI_TRANSCRIBE_MODEL=whisper-1   # opcional

🌐 Endpoints
POST /api/transcribe
Descrição: recebe áudio e retorna a transcrição 

Body: multipart/form-data
Idioma
Falas separadas
campo do arquivo: file (ex.: .webm vindo do navegador)

POST /api/diagnose
Descrição: recebe o texto completo da consulta e devolve um objeto com:

diagnóstico provável
doenças associadas
exames sugeridos
medicamentos comuns
```

