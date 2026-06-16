
(function(){
  "use strict";

  /* ---- tahun otomatis di footer ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- navbar: efek scroll + menu mobile ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const iconMenu = document.getElementById('iconMenu');
  const iconClose = document.getElementById('iconClose');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function(){
    const scrolled = window.scrollY > 12;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, {passive:true});

  navToggle.addEventListener('click', function(){
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    iconMenu.style.display = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    iconMenu.style.display = 'block';
    iconClose.style.display = 'none';
  }));

  backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  /* ---- highlight nav link aktif sesuai posisi scroll ---- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, {rootMargin:'-40% 0px -50% 0px'});
  sections.forEach(s => navObserver.observe(s));

  /* ---- scroll reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---- efek mengetik di hero ---- */
  const roles = ['Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'React Enthusiast'];
  const typingEl = document.getElementById('typingText');
  let roleIndex = 0, charIndex = 0, deleting = false;
  function typeLoop(){
    const current = roles[roleIndex];
    if (!deleting){
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0){ deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 35 : 70);
  }
  typeLoop();

  /* ---- count-up angka statistik ---- */
  const statEls = document.querySelectorAll('[data-count]');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        current += step;
        if (current >= target){ el.textContent = target; return; }
        el.textContent = current;
        requestAnimationFrame(tick);
      };
      tick();
      statObserver.unobserve(el);
    });
  }, {threshold:0.4});
  statEls.forEach(el => statObserver.observe(el));

  /* ---- filter proyek ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---- salin email ---- */
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailValue = document.getElementById('emailValue').textContent.trim();
  copyBtn.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(emailValue);
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Tersalin!';
      setTimeout(() => copyBtn.textContent = original, 1800);
    }catch(e){
      alert('Email: ' + emailValue);
    }
  });

  /* ---- validasi & kirim form kontak (mailto) ---- */
  const TUJUAN_EMAIL = 'raka.pratama@email.com'; // GANTI dengan email tujuan Anda
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setInvalid(rowId, invalid){
    document.getElementById(rowId).classList.toggle('invalid', invalid);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    setInvalid('row-name', !name);
    setInvalid('row-email', !emailOk);
    setInvalid('row-subject', !subject);
    setInvalid('row-message', message.length < 10);

    if (!name || !emailOk || !subject || message.length < 10){
      formSuccess.classList.remove('show');
      return;
    }

    const body = `Nama: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${TUJUAN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    formSuccess.classList.add('show');
  });

  ['name','email','subject','message'].forEach(field => {
    form[field].addEventListener('input', () => {
      const rowMap = {name:'row-name', email:'row-email', subject:'row-subject', message:'row-message'};
      document.getElementById(rowMap[field]).classList.remove('invalid');
    });
  });

  /* ---- tombol unduh CV (placeholder) ---- */
  document.getElementById('downloadCv').addEventListener('click', function(e){
    e.preventDefault();
    alert('Tambahkan file CV Anda dan ubah tautan tombol ini agar mengarah ke file tersebut.');
  });

})();
