import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  // Configuração SMTP do Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: "cartoriorv@gmail.com",
      subject: `📩 Mensagem do site - ${nome}`,
      text: mensagem,
      html: `
        <h3>Nova mensagem recebida pelo site:</h3>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Mensagem:</strong><br>${mensagem}</p>
      `,
    });

    return res.status(200).json({ message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return res.status(500).json({ message: "Erro ao enviar e-mail." });
  }
}

// Efeito rápido no clique do botão de e-mail
document.addEventListener('DOMContentLoaded', () => {
  const emailBtn = document.querySelector('.social-link.email');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      emailBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        emailBtn.style.transform = '';
      }, 150);
    });
  }
});

