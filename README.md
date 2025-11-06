# Cartório Herrera — Site Responsivo + Chat IA

Arquivos incluídos:

- `index.html`
- `styles.css`
- `script.js`
- `api/chat.js` (Vercel Serverless Function)
- `package.json`
- `assets/logo.png` (placeholder)
- `assets/logo-footer.png` (placeholder)
- `assets/tabeliao.jpg` (placeholder)
- `.env.example`

## Como usar (local)

1. Instale dependências (somente para testar o backend em plataformas que suportem funções):
   ```bash
   npm install
   ```
2. Sirva o site estaticamente (frontend):
   ```bash
   npx serve
   ```
   Abra `http://localhost:3000`.

> Nota: Funções serverless (`/api/chat`) rodam automaticamente na Vercel. Localmente com `serve` você verá somente o frontend; para testar a função, faça deploy na Vercel.

## Deploy na Vercel

1. Crie uma conta em https://vercel.com e importe este projeto.
2. Em **Settings → Environment Variables**, adicione:
   - `OPENAI_API_KEY` = `sk-...` (sua chave da OpenAI)
3. Deploy. A função `/api/chat` ficará ativa em produção e o chat do site passará a responder com IA real.

## Configurar a chave da OpenAI

- Crie/veja sua chave em https://platform.openai.com/ → **API Keys**.
- Nunca exponha a chave no frontend. Use somente no servidor (`/api/chat.js`).

## Formulários (Contato / Ouvidoria)

- Por padrão, simulam envio e exibem mensagem de sucesso.
- Para envio real, coloque o endpoint do Formspree/EmailJS no atributo `data-endpoint` do `<form>`:
  ```html
  <form id="contactForm" data-endpoint="https://formspree.io/f/xxxx"></form>
  ```

## Personalização rápida

- **Cores/tema**: edite as variáveis em `:root` no `styles.css`.
- **Textos dos serviços**: atualize o conteúdo dentro de cada `.service-card`.
- **LGPD**: edite o texto em `#lgpdText`.

## Observações

- O carrossel pausa quando o mouse está sobre ele.
- O menu “Serviços” e o dropdown “Contato” se fecham ao clicar fora.
- Botão “Informações” abre detalhes e fecha automaticamente quando o mouse sai do cartão.

✅ Dica: sempre otimize imagens (máx. 150KB) e teste o site em mobile com Chrome DevTools → “Toggle Device Toolbar”.
