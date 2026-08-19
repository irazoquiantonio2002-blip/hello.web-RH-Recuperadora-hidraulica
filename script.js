/* RH Recuperadora Hidráulica — interactions */
(function(){
  'use strict';

  /* ---------- LOADER ---------- */
  var loader = document.getElementById('loader');
  var fill = document.querySelector('.ld-fill');
  if (loader) {
    var p = 0;
    var iv = setInterval(function(){
      p += Math.random() * 18;
      if (p > 96) p = 96;
      if (fill) fill.style.width = p + '%';
    }, 160);
    window.addEventListener('load', function(){
      clearInterval(iv);
      if (fill) fill.style.width = '100%';
      setTimeout(function(){ loader.classList.add('hide'); }, 320);
    });
    // safety fallback in case 'load' never fires cleanly
    setTimeout(function(){
      clearInterval(iv);
      loader.classList.add('hide');
    }, 3200);
  }

  /* ---------- NAV SCROLL STATE ---------- */
  var nav = document.getElementById('nav');
  function onScroll(){
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  var ham = document.getElementById('ham');
  var mob = document.getElementById('mob');
  if (ham && mob) {
    ham.addEventListener('click', function(){
      var open = mob.classList.toggle('open');
      ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mob.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var revEls = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window && revEls.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revEls.forEach(function(el){ io.observe(el); });
  } else {
    revEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- HERO TYPEWRITER ---------- */
  var twEl = document.getElementById('twText');
  if (twEl) {
    var words = [
      'construcción', 'industria alimentaria', 'minería',
      'industria textil', 'manufactura', 'ganadería'
    ];
    var wi = 0, ci = 0, deleting = false;
    function tick(){
      var word = words[wi];
      if (!deleting) {
        ci++;
        twEl.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        ci--;
        twEl.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 75);
    }
    tick();
  }

  /* ---------- COUNTERS ---------- */
  function animateCounter(el){
    var target = parseFloat(el.getAttribute('data-count') || el.getAttribute('data-hero-count') || '0');
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (!target) return;
    var start = 0;
    var dur = 1400;
    var t0 = null;
    function frame(ts){
      if (!t0) t0 = ts;
      var prog = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      var val = Math.round(start + (target - start) * eased);
      el.textContent = prefix + val + suffix;
      if (prog < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('[data-count], [data-hero-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el){ cio.observe(el); });
  }

  /* ---------- PARTICLE CANVAS (torque sparks) ---------- */
  function initParticles(id){
    var canvas = document.getElementById(id);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h, particles;

    function resize(){
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function makeParticles(){
      var count = Math.min(46, Math.floor((w * h) / 26000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }
    function draw(){
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function(p){
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244,169,0,' + p.a + ')';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize();
    makeParticles();
    draw();
    window.addEventListener('resize', function(){
      resize();
      makeParticles();
    });
  }
  ['pcanvas', 'pcanvasWhy', 'pcanvasGaleria'].forEach(initParticles);
})();
