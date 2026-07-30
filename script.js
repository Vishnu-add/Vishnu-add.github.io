// All page content is injected by render.js from data.jsonc. These functions wire up
// interactivity — they're safe to call multiple times and no-op if their elements
// aren't present, but must run AFTER content exists in the DOM. See render.js.
window.SiteFX = (function(){

  function initThemeToggle(){
    var btn = document.getElementById('themeToggle');
    if(!btn || btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', function(){
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try{ localStorage.setItem('theme', next); }catch(e){}
      window.dispatchEvent(new CustomEvent('themechange', {detail:{theme:next}}));
    });
  }

  function initMobileNav(){
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if(!toggle || !links || toggle.dataset.wired) return;
    toggle.dataset.wired = '1';
    toggle.addEventListener('click', function(){
      links.classList.toggle('open');
    });
    links.addEventListener('click', function(e){
      if(e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  function initReveal(){
    var items = document.querySelectorAll('.reveal:not([data-revealed])');
    if(!items.length) return;
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.12});
    items.forEach(function(el){ el.setAttribute('data-revealed', '1'); io.observe(el); });
  }

  function initTypingEffect(){
    var el = document.getElementById('typeWord');
    if(!el || el.dataset.wired) return;
    var words = (el.getAttribute('data-words') || '').split('|').filter(Boolean);
    if(!words.length) return;
    el.dataset.wired = '1';
    var wi = 0, ci = 0, deleting = false;
    function tick(){
      var word = words[wi];
      if(!deleting){
        ci++;
        el.textContent = word.slice(0, ci);
        if(ci === word.length){ deleting = true; setTimeout(tick, 1400); return; }
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if(ci === 0){ deleting = false; wi = (wi+1) % words.length; }
      }
      setTimeout(tick, deleting ? 35 : 60);
    }
    tick();
  }

  function initStatCounters(){
    var stats = document.querySelectorAll('.stat-num[data-count]:not([data-wired])');
    if(!stats.length) return;
    var animated = false;
    function animate(){
      if(animated) return;
      animated = true;
      stats.forEach(function(el){
        el.setAttribute('data-wired', '1');
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var startTime = null, duration = 1200;
        function step(ts){
          if(!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          el.textContent = Math.floor(progress * target) + suffix;
          if(progress < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
      });
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) animate(); });
    }, {threshold:0.3});
    io.observe(stats[0]);
  }

  function initProjectFilter(){
    var bar = document.querySelector('.filter-bar');
    if(!bar || bar.dataset.wired) return;
    bar.dataset.wired = '1';
    var buttons = bar.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.proj-card');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        cards.forEach(function(card){
          card.classList.toggle('hidden', !(f === 'all' || card.getAttribute('data-tag') === f));
        });
      });
    });
  }

  function initTilt(){
    var els = document.querySelectorAll('.tilt:not([data-wired])');
    if(!els.length) return;
    var canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!canHover || reduced) return;
    var MAX = 8;
    els.forEach(function(el){
      el.setAttribute('data-wired', '1');
      el.addEventListener('mouseenter', function(){ el.classList.add('tilt-active'); });
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        var rx = (-py * MAX).toFixed(2);
        var ry = (px * MAX).toFixed(2);
        el.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(8px)';
      });
      el.addEventListener('mouseleave', function(){
        el.classList.remove('tilt-active');
        el.style.transform = '';
      });
    });
  }

  function initScrollSpy(){
    var links = document.querySelectorAll('.nav-links a[data-section]');
    if(!links.length || links[0].dataset.spyWired) return;
    var sections = [];
    links.forEach(function(a){
      a.dataset.spyWired = '1';
      var name = a.getAttribute('data-section');
      if(name === 'home') return;
      var el = document.getElementById(name);
      if(el) sections.push({name:name, el:el, link:a});
    });
    if(!sections.length) return;
    var homeLink = document.querySelector('.nav-links a[data-section="home"]');

    function setActive(name){
      links.forEach(function(a){ a.classList.remove('active'); });
      if(name === 'home' && homeLink){ homeLink.classList.add('active'); return; }
      sections.forEach(function(s){ if(s.name === name) s.link.classList.add('active'); });
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var match = sections.filter(function(s){ return s.el === entry.target; })[0];
          if(match) setActive(match.name);
        }
      });
    }, {rootMargin:'-45% 0px -50% 0px', threshold:0});

    sections.forEach(function(s){ io.observe(s.el); });

    window.addEventListener('scroll', function(){
      if(window.scrollY < 120) setActive('home');
    }, {passive:true});
  }

  function initAccordion(){
    var items = document.querySelectorAll('.accordion-item:not([data-wired])');
    if(!items.length) return;
    items.forEach(function(item){
      item.setAttribute('data-wired', '1');
      var head = item.querySelector('.accordion-head');
      var body = item.querySelector('.accordion-body');
      head.addEventListener('click', function(){
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.accordion-item').forEach(function(other){
          other.classList.remove('open');
          other.querySelector('.accordion-body').style.maxHeight = null;
        });
        if(!isOpen){
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  function initOrgLogos(){
    var badges = document.querySelectorAll('.org-logo:not([data-wired])');
    if(!badges.length) return;
    badges.forEach(function(b){
      b.setAttribute('data-wired', '1');
      var s = b.textContent || '';
      var hash = 0;
      for(var i=0;i<s.length;i++){ hash = s.charCodeAt(i) + ((hash << 5) - hash); }
      var hue = Math.abs(hash) % 360;
      b.style.background = 'linear-gradient(155deg, hsl(' + hue + ',58%,40%), hsl(' + hue + ',58%,26%))';
    });
  }

  function initAll(){
    initThemeToggle();
    initMobileNav();
    initReveal();
    initTypingEffect();
    initStatCounters();
    initProjectFilter();
    initScrollSpy();
    initAccordion();
    initOrgLogos();
    initTilt();
  }

  // Theme toggle and mobile nav are static markup present on first parse —
  // wire them immediately rather than waiting for render.js to fetch data.jsonc.
  initThemeToggle();
  initMobileNav();

  return {
    initThemeToggle: initThemeToggle,
    initMobileNav: initMobileNav,
    initReveal: initReveal,
    initTypingEffect: initTypingEffect,
    initStatCounters: initStatCounters,
    initProjectFilter: initProjectFilter,
    initTilt: initTilt,
    initScrollSpy: initScrollSpy,
    initAccordion: initAccordion,
    initOrgLogos: initOrgLogos,
    initAll: initAll
  };
})();
