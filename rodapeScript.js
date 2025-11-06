const form = document.getElementById('contatoForm');
const status = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = "Enviando mensagem...";

  const data = {
    nome: form.nome.value,
    email: form.email.value,
    mensagem: form.mensagem.value,
  };

  try {
    const res = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    status.textContent = result.message;
    status.style.color = res.ok ? "green" : "red";
    form.reset();
  } catch (err) {
    status.textContent = "Erro ao enviar. Tente novamente.";
    status.style.color = "red";
  }
});
