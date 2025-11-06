
// script.js - interações do site (menus, modais, carrosséis, forms e chat com IA)
document.addEventListener('DOMContentLoaded', function(){
  // nav toggle
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  navToggle && navToggle.addEventListener('click', ()=> {
    if(getComputedStyle(navList).display === 'flex') navList.style.display = 'none';
    else navList.style.display = 'flex';
  });

  // services mega menu + fechamento automático
  const servicesBtn = document.getElementById('servicesBtn');
  const servicesMenu = document.getElementById('servicesMenu');
  const contactBtn = document.getElementById('contactBtn');
  const contactDrop = document.getElementById('contactDrop');
  let closeTimer; // controla o tempo de fechamento automático

  function toggleMenu(button, menu, displayType = 'flex') {
    const isHidden = menu.style.display === 'none' || menu.style.display === '';
    document.querySelectorAll('.mega, .contact-dropdown').forEach(el => el.style.display = 'none'); // fecha outros
    if (isHidden) {
      menu.style.display = displayType;
      button.setAttribute('aria-expanded', 'true');
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        menu.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
      }, 40000); // 40 segundos
    } else {
      menu.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
    }
  }

  servicesBtn && servicesBtn.addEventListener('click', (e)=> {
    e.stopPropagation();
    toggleMenu(servicesBtn, servicesMenu, 'flex');
  });

  contactBtn && contactBtn.addEventListener('click', (e)=> {
    e.stopPropagation();
    toggleMenu(contactBtn, contactDrop, 'block');
  });

  // fecha menus ao clicar fora
  document.addEventListener('click', () => {
    if (servicesMenu) servicesMenu.style.display = 'none';
    if (contactDrop) contactDrop.style.display = 'none';
  });

  // mega menu info buttons -> rolar até o serviço correspondente
  document.querySelectorAll('.info-btn').forEach(b=>{
    b.addEventListener('click', ()=> {
      const key = b.dataset.service;
      const el = document.getElementById('info-'+key) || document.querySelector('.service-info');
      if(el){
        el.removeAttribute('hidden');
        window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 60, behavior:'smooth'});
      }
    });
  });

  // abrir/fechar informações ao clicar e fechar quando mouse sair do cartão
  document.querySelectorAll('.info-toggle').forEach(btn => {
    const card = btn.closest('.service-card');
    const id = btn.dataset.target;
    const box = document.getElementById(id);
    if (!card || !box) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nowHidden = box.hasAttribute('hidden');
      document.querySelectorAll('.service-info').forEach(s => s.setAttribute('hidden',''));
      if (nowHidden) box.removeAttribute('hidden'); else box.setAttribute('hidden','');
    });

    card.addEventListener('mouseleave', () => {
      if (!box.hasAttribute('hidden')) box.setAttribute('hidden','');
    });
  });

  // contact modal
  const contactModal = document.getElementById('contactModal');
  const contactClose = document.getElementById('contactClose');
  const contactForm = document.getElementById('contactForm');
  contactBtn && contactBtn.addEventListener('dblclick', ()=> openModal(contactModal)); // atalho: duplo clique abre modal
  contactClose && contactClose.addEventListener('click', ()=> closeModal(contactModal));

  contactForm && contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const f=new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type=submit]');
    if(submitBtn) submitBtn.disabled = true;
    if(!f.get('name')||!f.get('phone')||!f.get('email')||!f.get('motivo')){
      alert('Por favor preencha todos os campos obrigatórios.');
      if(submitBtn) submitBtn.disabled = false;
      return;
    }
    const endpoint = contactForm.dataset.endpoint;
    if(endpoint){
      fetch(endpoint, {method:'POST', body: f, headers: {'Accept':'application/json'}})
        .then(r=>{ if(r.ok) return r.json(); throw new Error('Erro'); })
        .then(()=>{ alert('Mensagem enviada! Obrigado.'); contactForm.reset(); closeModal(contactModal); })
        .catch(()=> alert('Erro ao enviar. Tente novamente mais tarde.'))
        .finally(()=> { if(submitBtn) submitBtn.disabled = false; });
    } else {
      setTimeout(()=>{ alert('Mensagem enviada! Obrigado.'); contactForm.reset(); closeModal(contactModal); if(submitBtn) submitBtn.disabled = false; }, 600);
    }
  });

  // chat modal e bot com IA
  const chatModal = document.getElementById('chatModal');
  const chatBtn = document.getElementById('chatBtn');
  const chatClose = document.getElementById('chatClose');
  const chatInitForm = document.getElementById('chatInitForm');
  const chatWindow = document.getElementById('chatWindow');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  chatBtn && chatBtn.addEventListener('click', (e)=> { e.stopPropagation(); openModal(chatModal); });
  chatClose && chatClose.addEventListener('click', ()=> closeModal(chatModal));

  chatInitForm && chatInitForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const f=new FormData(chatInitForm);
    if(!f.get('name')||!f.get('phone')||!f.get('email')){
      alert('Preencha os campos de identificação para iniciar o chat.');
      return;
    }
    chatInitForm.style.display='none';
    chatWindow.removeAttribute('hidden');
    appendMessage('assistant','Olá! Sou o assistente virtual do Cartório Herrera. Em que posso ajudar hoje?');
    chatInput.focus();
  });

  chatSend && chatSend.addEventListener('click', sendChat);
  chatInput && chatInput.addEventListener('keydown', (e)=> { if(e.key==='Enter'){ e.preventDefault(); sendChat(); } });

  function sendChat(){
    const txt = (chatInput.value||'').trim();
    if(!txt) return;
    appendMessage('user', txt);
    chatInput.value='';

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: txt })
    })
      .then(res => res.json())
      .then(data => {
        appendMessage('assistant', data.reply || 'Desculpe, não consegui entender. Tente novamente.');
      })
      .catch(() => {
        appendMessage('assistant', 'Erro de conexão. Tente novamente em alguns instantes.');
      });
  }

  function appendMessage(role, text){
    const div = document.createElement('div');
    div.className = 'msg ' + role;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ouvidoria form
  const ouvidoriaForm = document.getElementById('ouvidoriaForm');
  const ouvidoriaMsg = document.getElementById('ouvidoriaMsg');
  ouvidoriaForm && ouvidoriaForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const f = new FormData(ouvidoriaForm);
    if(!f.get('name')||!f.get('phone')||!f.get('email')||!f.get('message')){
      alert('Por favor preencha todos os campos.');
      return;
    }
    const endpoint = ouvidoriaForm.dataset.endpoint;
    if(endpoint){
      fetch(endpoint, {method:'POST', body: f, headers: {'Accept':'application/json'}})
        .then(r=>{ if(r.ok) { ouvidoriaMsg.hidden=false; ouvidoriaForm.reset(); setTimeout(()=> ouvidoriaMsg.hidden=true,4000); } else throw new Error('Erro'); })
        .catch(()=> alert('Erro ao enviar. Tente novamente mais tarde.'));
    } else {
      ouvidoriaForm.reset();
      ouvidoriaMsg.hidden=false;
      setTimeout(()=> ouvidoriaMsg.hidden=true,4000);
    }
  });

  // LGPD toggle
  const lgpdToggle = document.getElementById('lgpdToggle');
  const lgpdText = document.getElementById('lgpdText');
  lgpdToggle && lgpdToggle.addEventListener('click', ()=> {
    const hidden = lgpdText.hasAttribute('hidden');
    if(hidden) { lgpdText.removeAttribute('hidden'); lgpdToggle.setAttribute('aria-expanded','true'); }
    else { lgpdText.setAttribute('hidden',''); lgpdToggle.setAttribute('aria-expanded','false'); }
  });

  // helpers modal
  function openModal(modal){
    if(!modal) return;
    modal.setAttribute('aria-hidden','false');
    const firstInput = modal.querySelector('input, textarea, button');
    if(firstInput) firstInput.focus();
  }
  function closeModal(modal){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    modal.querySelectorAll('form').forEach(f=>f.reset());
    const cw = document.getElementById('chatWindow');
    const ci = document.getElementById('chatInitForm');
    if(cw && ci) { cw.setAttribute('hidden',''); ci.style.display='block'; }
  }

  // carouséis
  document.querySelectorAll('.carousel').forEach(car => {
    const slides = car.querySelector('.slides');
    const imgs = slides ? slides.children : [];
    if(!slides || !imgs.length) return;
    let idx=0;
    const interval = parseInt(car.dataset.interval)||3000;
    const prev = car.querySelector('.prev');
    const next = car.querySelector('.next');

    function show(i){
      idx = (i+imgs.length)%imgs.length;
      slides.style.transform = `translateX(${ -idx * 100 }%)`;
    }
    prev && prev.addEventListener('click', ()=> show(idx-1), {passive:true});
    next && next.addEventListener('click', ()=> show(idx+1), {passive:true});
    let timer = setInterval(()=> show(idx+1), interval);
    car.addEventListener('mouseenter', ()=> clearInterval(timer), {passive:true});
    car.addEventListener('mouseleave', ()=> timer = setInterval(()=> show(idx+1), interval), {passive:true});
  });
});

/*JS ControlaDisplay*/
document.getElementById('navToggle').addEventListener('click', function() {
  const navList = document.getElementById('navList');
  navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
});

