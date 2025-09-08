// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navList = document.querySelector('.nav-list');

mobileToggle && mobileToggle.addEventListener('click', () => {
  navList.classList.toggle('open');
  mobileToggle.querySelector('i').classList.toggle('fa-bars');
  mobileToggle.querySelector('i').classList.toggle('fa-xmark');
});

// Simple smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile menu after click (if open)
      if(navList.classList.contains('open')){
        navList.classList.remove('open');
        mobileToggle.querySelector('i').classList.remove('fa-xmark');
        mobileToggle.querySelector('i').classList.add('fa-bars');
      }
    }
  });
});

// Contact form basic validation + fake submit (since no backend)
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form && form.addEventListener('submit', (e)=>{
  e.preventDefault();
  formMsg.textContent = '';
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if(!name || !email || !message){
    formMsg.style.color = '#c00';
    formMsg.textContent = 'Zəhmət olmasa bütün sahələri doldurun.';
    return;
  }
  // Email rudimentary check
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!emailValid){
    formMsg.style.color = '#c00';
    formMsg.textContent = 'Zəhmət olmasa düzgün email daxil edin.';
    return;
  }

  // Simulate success
  formMsg.style.color = 'var(--accent)';
  formMsg.textContent = 'Mesajınız göndərildi — təşəkkürlər!';

  // clear fields
  form.name.value = '';
  form.email.value = '';
  form.message.value = '';
});

// Optional: simple reveal on scroll (tiny)
const reveals = document.querySelectorAll('.section, .hero, .tech-card, .p-item, .balance-card');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('reveal');
    }
  });
},{threshold:0.08});
reveals.forEach(r => observer.observe(r));
