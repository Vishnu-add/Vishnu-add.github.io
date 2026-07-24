// Mobile nav toggle
(function(){
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', function(){
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ links.classList.remove('open'); });
    });
  }
})();

// Scroll reveal
(function(){
  var items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.12});
  items.forEach(function(el){ io.observe(el); });
})();

// Frame strip (signature animation)
(function(){
  var strip = document.getElementById('frameStrip');
  if(!strip) return;
  var count = 28;
  for(var i=0;i<count;i++){
    var s = document.createElement('span');
    strip.appendChild(s);
  }
  var frames = strip.children;
  var active = 0;
  frames[0].classList.add('active');
  setInterval(function(){
    frames[active].classList.remove('active');
    active = (active+1) % frames.length;
    frames[active].classList.add('active');
  }, 220);
})();

// Typing effect (home hero)
(function(){
  var el = document.getElementById('typeWord');
  if(!el) return;
  var words = ['vision-language models', 'domain generalization', 'RAG pipelines', 'voice AI agents', 'interpretable ML'];
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
})();

// Stat counters
(function(){
  var stats = document.querySelectorAll('.stat-num[data-count]');
  if(!stats.length) return;
  var animated = false;
  function animate(){
    if(animated) return;
    animated = true;
    stats.forEach(function(el){
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0, duration = 1200, startTime = null;
      function step(ts){
        if(!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var val = Math.floor(progress * target);
        el.textContent = val + suffix;
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
})();

// Project filter
(function(){
  var bar = document.querySelector('.filter-bar');
  if(!bar) return;
  var buttons = bar.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.proj-card');
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      buttons.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function(card){
        if(f === 'all' || card.getAttribute('data-tag') === f){
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

// Accordion (research page)
(function(){
  var items = document.querySelectorAll('.accordion-item');
  if(!items.length) return;
  items.forEach(function(item){
    var head = item.querySelector('.accordion-head');
    var body = item.querySelector('.accordion-body');
    head.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      items.forEach(function(other){
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
})();
