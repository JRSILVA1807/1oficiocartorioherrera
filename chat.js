// /api/chat.js - Integração do Chat do Cartório Herrera com OpenAI (Vercel Serverless Function)
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensagem não fornecida" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY não configurada no ambiente" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // modelo rápido e econômico
      messages: [
        {
          role: "system",
          content:
            "Você é o assistente virtual do Cartório Herrera (1º Tabelionato de Notas de Rio Verde - GO). Responda de forma educada, clara e objetiva. Ajude com dúvidas sobre serviços, horários, documentos e contatos do cartório. Evite dar parecer jurídico; recomende sempre consultar um tabelião/advogado quando necessário."
        },
        { role: "user", content: message }
      ],
      temperature: 0.6,
    });

    const reply = response?.choices?.[0]?.message?.content?.trim() || "Desculpe, não consegui responder agora.";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao conectar com a IA" });
  }
}
