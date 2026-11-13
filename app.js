/* Renders every page from data.json and wires up the interactions.
   Pages: index.html (home), project.html (?id=…), cv.html. Edit data.json to change content. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clean = function (s) { return String(s == null ? '' : s).replace(/ , /g, ' — '); };
  var enc = encodeURI;
  var PAGE = document.body.getAttribute('data-page');
  var D = null;

  var ICON = {
    github: '<path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/>',
    linkedin: '<path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.32 8.5h3.24V21H3.32V8.5zm6.02 0h3.11v1.71h.04c.43-.82 1.5-1.69 3.08-1.69 3.29 0 3.9 2.17 3.9 4.99V21h-3.24v-5.83c0-1.39-.02-3.18-1.94-3.18-1.94 0-2.24 1.51-2.24 3.08V21H9.34V8.5z"/>',
    orcid: '<path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.343 2.653 5.343 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.918V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/>',
    twitter: '<path d="M22 5.9c-.74.33-1.53.55-2.36.65a4.14 4.14 0 0 0 1.81-2.28 8.24 8.24 0 0 1-2.61 1c-.75-.8-1.82-1.3-3-1.3-2.27 0-4.11 1.84-4.11 4.11 0 .32.04.64.11.94A11.65 11.65 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.27 5.48c-.67-.02-1.3-.2-1.85-.51v.05c0 1.99 1.42 3.65 3.3 4.03-.35.1-.71.15-1.09.15-.27 0-.52-.03-.78-.07a4.12 4.12 0 0 0 3.84 2.86A8.3 8.3 0 0 1 2 18.58a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.35 8.35 0 0 0 22 5.9z"/>',
    mail: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.5 2v.5L12 13l7.5-5.5V7h-15z"/>'
  };
  var svgIcon = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICON[k] || ICON.mail) + '</svg>'; };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function hue(s) { var h = 0; for (var i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return Math.abs(h) % 360; }
  function logo(l) {
    if (!l) return '';
    var h = hue(l);
    return '<span class="logo" style="background:linear-gradient(150deg,hsl(' + h + ',55%,42%),hsl(' + ((h + 40) % 360) + ',55%,28%))">' + l + '</span>';
  }

  /* ------------------------------------------------------------ nav */
  var SECTIONS = [['research', 'Research'], ['experience', 'Experience'], ['projects', 'Projects'], ['skills', 'Skills'], ['credentials', 'Education'], ['contact', 'Contact']];

  function renderNav() {
    var base = PAGE === 'home' ? '' : 'index.html';
    var docs = D.site.docs;
    var links = SECTIONS.map(function (s) { return '<li><a href="' + base + '#' + s[0] + '" data-s="' + s[0] + '">' + s[1] + '</a></li>'; }).join('');
    $('#nav').innerHTML =
      '<div class="wrap">' +
      '<a class="brand" href="' + (PAGE === 'home' ? '#top' : 'index.html') + '"><i></i><span>vishnu@agder:~$</span></a>' +
      '<ul class="links" id="links">' + links + '</ul>' +
      '<div class="nav-right">' +
      '<div class="docs" id="docs">' +
      '<button class="btn-docs" id="docsBtn" aria-haspopup="true" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg><span class="lbl">Resume / CV</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M6 9l6 6 6-6"/></svg></button>' +
      '<div class="docs-menu" role="menu">' +
      '<a href="' + docs.resume + '" target="_blank" rel="noopener" role="menuitem"><div class="dm-ic">PDF</div><div><b>Resume</b><span>1-page-style industry resume (PDF)</span></div></a>' +
      '<a href="' + docs.cv + '" role="menuitem"><div class="dm-ic">CV</div><div><b>Academic CV</b><span>Research, publications and projects (web)</span></div></a>' +
      '<hr><a href="' + docs.cvPdf + '" download role="menuitem"><div class="dm-ic">&darr;</div><div><b>Download CV</b><span>Academic CV as PDF</span></div></a>' +
      '</div></div>' +
      '<button class="icon-btn" id="theme" aria-label="Toggle light / dark theme"><svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></svg><svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg></button>' +
      '<button class="icon-btn menu-toggle" id="menu" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>' +
      '</div></div>';

    $('#theme').onclick = function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', cur);
      try { localStorage.setItem('theme', cur); } catch (e) { }
      window.dispatchEvent(new Event('themechange'));
    };
    $('#menu').onclick = function () { $('#links').classList.toggle('open'); };
    $('#links').onclick = function (e) { if (e.target.tagName === 'A') $('#links').classList.remove('open'); };
    var dw = $('#docs');
    $('#docsBtn').onclick = function (e) { e.stopPropagation(); var o = dw.classList.toggle('open'); this.setAttribute('aria-expanded', o); };
    document.addEventListener('click', function (e) { if (!dw.contains(e.target)) dw.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dw.classList.remove('open'); });
  }

  /* ------------------------------------------------- animated thumbnails */
  var A = 'var(--acc)', S = 'var(--sig)', W = 'var(--warn)', P = 'var(--pink)', L = 'var(--line2)', C2 = 'var(--card2)', F = 'var(--faint)';
  var THUMBS = {
    vlm: function () {
      var toks = ['the', 'chef', 'pours', 'tea', '?'];
      var s = '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="vg" x1="0" x2="1"><stop offset="0" stop-color="' + S + '"/><stop offset="1" stop-color="' + A + '"/></linearGradient></defs>';
      // frames
      [0, 1, 2].forEach(function (i) {
        var y = 28 + i * 40;
        s += '<rect x="16" y="' + y + '" width="58" height="32" rx="5" fill="' + C2 + '" stroke="' + L + '"/>' +
          '<circle cx="' + (30 + i * 9) + '" cy="' + (y + 16) + '" r="6" fill="url(#vg)" opacity=".85"/><rect x="' + (46 + i * 2) + '" y="' + (y + 11) + '" width="20" height="4" rx="2" fill="' + F + '"/><rect x="' + (46 + i * 2) + '" y="' + (y + 19) + '" width="13" height="4" rx="2" fill="' + F + '"/>';
      });
      // tokens + attention
      toks.forEach(function (t, j) {
        var y = 22 + j * 28;
        s += '<rect x="254" y="' + y + '" width="52" height="18" rx="9" fill="' + C2 + '" stroke="' + L + '"/><text x="280" y="' + (y + 12.5) + '" text-anchor="middle" font-family="monospace" font-size="9" fill="' + F + '">' + t + '</text>';
      });
      [[44, 31], [44, 87], [84, 59], [84, 115], [124, 31], [124, 143]].forEach(function (p, k) {
        var y1 = 44 + (k % 3) * 40, y2 = 31 + [0, 2, 1, 3, 4, 3][k] * 28;
        s += '<path class="fl" d="M74 ' + y1 + ' C 150 ' + y1 + ' 180 ' + y2 + ' 254 ' + y2 + '" fill="none" stroke="' + (k % 2 ? S : A) + '" stroke-width="1.3" opacity=".6" style="animation-duration:' + (0.9 + k * .17) + 's"/>';
      });
      // LoRA blocks
      s += '<g class="bob"><rect x="116" y="58" width="50" height="50" rx="6" fill="' + C2 + '" stroke="' + L + '"/><text x="141" y="89" text-anchor="middle" font-family="serif" font-style="italic" font-size="22" fill="' + F + '">W</text>' +
        '<text x="176" y="89" text-anchor="middle" font-family="monospace" font-size="16" fill="' + A + '">+</text>' +
        '<rect class="blink" x="190" y="58" width="12" height="50" rx="3" fill="' + A + '"/><rect class="blink" x="190" y="112" width="50" height="12" rx="3" fill="' + S + '" style="animation-delay:-.8s"/>' +
        '<text x="196" y="52" font-family="monospace" font-size="8" fill="' + A + '">B</text><text x="236" y="136" font-family="monospace" font-size="8" fill="' + S + '">A</text></g>' +
        '<text x="160" y="164" text-anchor="middle" font-family="monospace" font-size="9" fill="' + F + '">ΔW = B·A   (rank r ≪ d)</text></svg>';
      return s;
    },
    dist: function () {
      var s = '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
      var ys = [28, 59, 90, 121, 152];
      ys.forEach(function (y, i) {
        s += '<path class="fl" d="M52 ' + y + ' C 110 ' + y + ' 110 90 150 90" fill="none" stroke="' + (i % 2 ? S : A) + '" stroke-width="1.4" opacity=".65" style="animation-duration:' + (.8 + i * .2) + 's"/>' +
          '<circle cx="38" cy="' + y + '" r="13" fill="' + C2 + '" stroke="' + (i % 2 ? S : A) + '"/>' +
          '<text x="38" y="' + (y + 3.5) + '" text-anchor="middle" font-family="monospace" font-size="9" fill="' + F + '">θ' + (i + 1) + '</text>';
      });
      s += '<circle class="spin" cx="170" cy="90" r="27" fill="none" stroke="' + A + '" stroke-width="1.5" stroke-dasharray="4 6"/>' +
        '<circle cx="170" cy="90" r="19" fill="' + C2 + '" stroke="' + A + '"/><text x="170" y="94" text-anchor="middle" font-family="monospace" font-size="10" fill="' + A + '">⊕</text>' +
        '<path class="fl" d="M197 90 L 246 90" stroke="' + A + '" stroke-width="2"/>' +
        '<rect x="246" y="66" width="62" height="48" rx="8" fill="' + C2 + '" stroke="' + A + '"/>' +
        '<text x="277" y="86" text-anchor="middle" font-family="monospace" font-size="8.5" fill="' + F + '">trustworthy</text><text x="277" y="98" text-anchor="middle" font-family="monospace" font-size="8.5" fill="' + F + '">decision</text>' +
        '<path class="blink" d="M265 106 l5 5 10-11" fill="none" stroke="' + A + '" stroke-width="2.2"/>' +
        '<text x="160" y="172" text-anchor="middle" font-family="monospace" font-size="8.5" fill="' + F + '">distributed learners → one explainable model</text></svg>';
      return s;
    },
    seg: function () {
      var s = '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' +
        '<linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a7d44"/><stop offset="1" stop-color="#1e4a2a"/></linearGradient>' +
        '<linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b1055"/><stop offset=".6" stop-color="#d4406a"/><stop offset="1" stop-color="#ffb454"/></linearGradient>' +
        '<linearGradient id="sg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#555"/><stop offset="1" stop-color="#ddd"/></linearGradient></defs>';
      [['sg1', 'RGB'], ['sg2', 'THERMAL'], ['sg3', 'NIR']].forEach(function (t, i) {
        var y = 20 + i * 52;
        s += '<rect x="16" y="' + y + '" width="64" height="42" rx="5" fill="url(#' + t[0] + ')" stroke="' + L + '"/>' +
          '<ellipse cx="' + (44 + i * 3) + '" cy="' + (y + 24) + '" rx="12" ry="8" fill="' + (i == 1 ? '#fff2a0' : i == 2 ? '#fff' : '#e0612b') + '" opacity=".85" class="blink" style="animation-delay:-' + i * .7 + 's"/>' +
          '<text x="22" y="' + (y + 11) + '" font-family="monospace" font-size="7.5" fill="#fff" opacity=".9">' + t[1] + '</text>' +
          '<path class="fl" d="M80 ' + (y + 21) + ' C 105 ' + (y + 21) + ' 110 90 130 90" fill="none" stroke="' + A + '" stroke-width="1.3" opacity=".7"/>';
      });
      s += '<g class="bob"><rect x="130" y="58" width="12" height="64" rx="3" fill="' + C2 + '" stroke="' + S + '"/><rect x="148" y="66" width="12" height="48" rx="3" fill="' + C2 + '" stroke="' + S + '"/><rect x="166" y="74" width="12" height="32" rx="3" fill="' + C2 + '" stroke="' + A + '"/><rect x="184" y="66" width="12" height="48" rx="3" fill="' + C2 + '" stroke="' + S + '"/><rect x="202" y="58" width="12" height="64" rx="3" fill="' + C2 + '" stroke="' + S + '"/></g>' +
        '<path class="fl" d="M214 90 L 238 90" stroke="' + A + '" stroke-width="2"/>' +
        '<rect x="238" y="38" width="68" height="104" rx="6" fill="#0b100e" stroke="' + A + '"/>' +
        '<path d="M250 112 C 252 80 270 70 282 78 C 296 86 290 112 276 122 C 264 128 252 124 250 112Z" fill="' + A + '" opacity=".75"/>' +
        '<path d="M262 64 C 270 56 282 60 280 68 C 276 74 264 72 262 64Z" fill="' + P + '" opacity=".8"/>' +
        '<rect class="scan" x="238" y="38" width="2" height="104" fill="' + A + '" style="animation-name:scan2"/>' +
        '<text x="160" y="164" text-anchor="middle" font-family="monospace" font-size="8.5" fill="' + F + '">one lightweight net · any sensor</text></svg>';
      return s;
    },
    terrain: function () {
      var s = '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
      // grid
      for (var i = 0; i < 6; i++) s += '<path d="M16 ' + (30 + i * 20) + ' H304" stroke="' + L + '" stroke-width=".5" opacity=".6"/>';
      // IMU trace: smooth / rough / periodic
      var pts = '', x;
      for (x = 16; x <= 304; x += 4) {
        var seg = x < 108 ? 0 : x < 208 ? 1 : 2, y = 70;
        if (seg === 0) y += Math.sin(x / 9) * 4;
        if (seg === 1) y += (Math.sin(x * 1.9) + Math.sin(x * .7)) * 15 * Math.sin(x * .13 + 1);
        if (seg === 2) y += Math.sin(x / 4) * 14;
        pts += x + ',' + y.toFixed(1) + ' ';
      }
      s += '<polyline points="' + pts + '" fill="none" stroke="' + S + '" stroke-width="1.7"/>' +
        '<rect class="scan" x="16" y="30" width="3" height="80" fill="' + A + '" style="animation-name:scan3"/>';
      [['tile', 16, 108], ['gravel', 108, 208], ['grass', 208, 304]].forEach(function (c, k) {
        s += '<rect x="' + (c[1] + 3) + '" y="120" width="' + (c[2] - c[1] - 6) + '" height="22" rx="11" fill="' + C2 + '" stroke="' + [A, W, S][k] + '"/>' +
          '<text x="' + ((c[1] + c[2]) / 2) + '" y="134.5" text-anchor="middle" font-family="monospace" font-size="9.5" fill="' + [A, W, S][k] + '">' + c[0] + '</text>';
      });
      s += '<text x="160" y="164" text-anchor="middle" font-family="monospace" font-size="8.5" fill="' + F + '">onboard IMU / force signal → surface class, in real time</text></svg>';
      return s;
    },
    agent: function () {
      var s = '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        '<circle cx="160" cy="88" r="64" fill="none" stroke="' + L + '" stroke-dasharray="2 5"/>' +
        '<g class="spin" style="transform-origin:160px 88px"><circle cx="160" cy="88" r="25" fill="none" stroke="' + A + '" stroke-width="9" stroke-dasharray="7 6.8" opacity=".9"/></g>' +
        '<circle cx="160" cy="88" r="17" fill="' + C2 + '" stroke="' + A + '"/><text x="160" y="92" text-anchor="middle" font-family="monospace" font-size="10" fill="' + A + '">LLM</text>';
      s += '<g class="orbit r" style="transform-origin:160px 88px">';
      [0, 1, 2, 3].forEach(function (i) {
        var a = i * Math.PI / 2, x = 160 + Math.cos(a) * 64, y = 88 + Math.sin(a) * 64;
        s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="8" fill="' + C2 + '" stroke="' + [S, A, W, P][i] + '" stroke-width="2"/>';
      });
      s += '</g>' +
        '<g font-family="monospace" font-size="8.5" fill="' + F + '"><text x="20" y="40">CAD</text><text x="20" y="54">simulator</text><text x="262" y="40">firmware</text><text x="262" y="54">test rigs</text>' +
        '<text x="262" y="132" fill="' + P + '">human</text><text x="262" y="145" fill="' + P + '">review ✓</text></g>' +
        '<path class="fl" d="M60 62 C 90 70 110 80 134 84 M260 62 C 230 70 210 80 186 84" fill="none" stroke="' + S + '" stroke-width="1.2" opacity=".7"/>' +
        '<text x="160" y="172" text-anchor="middle" font-family="monospace" font-size="8.5" fill="' + F + '">plan → act in design software → human review</text></svg>';
      return s;
    }
  };
  // extra keyframes for thumbs that scan at different widths
  (function () {
    var st = document.createElement('style');
    st.textContent = '@keyframes scan2{0%,100%{transform:translateX(0)}50%{transform:translateX(66px)}}@keyframes scan3{0%,100%{transform:translateX(0)}50%{transform:translateX(284px)}}';
    document.head.appendChild(st);
  })();

  /* ------------------------------------------------------------- home */
  function marquee() {
    var words = ['Vision-language models', 'LoRA', 'Interpretable ML', 'Tsetlin Machines', 'Edge AI', 'Multimodal learning', 'Agentic systems', 'RAG', 'Segmentation', 'Humanoid robotics', 'Distributed learning', 'Production ML'];
    var line = words.map(function (w) { return '<span>' + w + '</span>'; }).join('');
    return '<div class="marquee" aria-hidden="true"><div class="track">' + line + line + '</div></div>';
  }

  function renderHome() {
    var h = D.hero, docs = D.site.docs;
    var stats = h.stats.map(function (s) {
      return '<div class="stat"><b data-count="' + s.value + '">0</b><span>' + s.label + '</span><small>' + s.note + '</small></div>';
    }).join('');
    var hero =
      '<header class="hero" id="top"><canvas id="net" aria-hidden="true"></canvas><div class="wrap"><div>' +
      '<div class="eyebrow">' + h.eyebrow + '</div>' +
      '<h1>Vishnu Vardhan <em>Addanki&nbsp;Tirumala</em></h1>' +
      '<div class="typed">&gt; ' + h.typePrefix + ' <span class="w" id="typed"></span></div>' +
      '<p class="sub">' + h.sub + '</p>' +
      '<div class="cta">' +
      '<a class="btn primary" href="#research">See my research ↓</a>' +
      '<a class="btn" href="' + docs.resume + '" target="_blank" rel="noopener">' + svgInline('doc') + 'Resume</a>' +
      '<a class="btn" href="' + docs.cv + '">' + svgInline('doc') + 'CV</a>' +
      '<a class="btn" href="#contact">Get in touch</a></div></div>' +
      '<div class="portrait"><div class="ring2"></div><div class="ring"></div>' +
      '<img src="assets/vishnu.jpg" alt="Portrait of Vishnu Vardhan Addanki Tirumala" width="320" height="320">' +
      '<span class="tag t1">VLMs · <b>LoRA</b></span><span class="tag t2">Tsetlin · <b>interpretable</b></span><span class="tag t3">edge · <b>agents</b></span></div>' +
      '</div></header>' +
      '<div class="wrap"><div class="stats rv">' + stats + '</div></div>';

    var r = D.research;
    var counts = { accepted: 1, review: 0, planned: 0, ongoing: 0 };
    r.items.forEach(function (i) { counts[i.status]++; });
    var cards = r.items.map(function (it) {
      return '<article class="r-card tilt rv" id="r-' + it.id + '">' +
        '<div class="r-thumb">' + THUMBS[it.thumb]() + '</div>' +
        '<div class="r-body"><div class="r-top"><span class="badge ' + it.status + '"><i></i>' + it.statusLabel + '</span><span class="r-kind">' + it.kind + '</span></div><h3>' + it.title + '</h3>' +
        '<p>' + it.desc + '</p><div class="r-venue">' + it.venue + '</div>' +
        '<div class="tags">' + it.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div></div></article>';
    }).join('');
    var pubs = r.published.map(function (p) {
      return '<div class="pub rv"><span class="ok">● ' + p.status.toUpperCase() + '</span><b>' + p.title + '</b><span>' + p.venue + ' · ' + p.year + '</span></div>';
    }).join('');
    var pipe = '<div class="pipe rv">' +
      pipeCell('Accepted', 1, 'Clause sanitization for Tsetlin Machines, ISTM 2026') +
      pipeCell('Communicated', counts.review, 'CVPR 2027 · IEEE TAI · JAG') +
      pipeCell('Planned', counts.planned, 'IEEE Internet of Things Journal') +
      pipeCell('Ongoing', counts.ongoing, 'Agentic AI for mechatronics (coursework)') + '</div>';

    var about = '<section id="about"><div class="wrap about-grid"><div class="rv">' +
      D.about.paragraphs.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
      '<div class="term rv"><div class="term-bar"><i></i><i></i><i></i><span>research_status.py</span></div><pre>' +
      '<span class="c"># where my work is right now</span>\n' +
      '<span class="k">status</span> = {\n' +
      '  <span class="s">"thesis"</span>:     <span class="n">"LoRA × video-language models"</span>,\n' +
      '  <span class="s">"cvpr_2027"</span>:  <span class="n">"communicated"</span>,\n' +
      '  <span class="s">"ieee_tai"</span>:   <span class="n">"communicated"</span>,\n' +
      '  <span class="s">"jag"</span>:        <span class="n">"communicated"</span>,\n' +
      '  <span class="s">"ieee_iot"</span>:   <span class="n">"planning"</span>,\n' +
      '  <span class="s">"istm_2026"</span>:  <span class="n">"accepted"</span>,\n' +
      '}\n\n<span class="k">while</span> research:\n    build()\n    <span class="k">ask</span>(<span class="n">"why does it fail?"</span>)</pre></div></div></section>';

    var research = '<section id="research"><div class="wrap">' +
      '<div class="sec-head rv"><span class="idx">01</span><div class="eyebrow">research</div></div><h2 class="rv">What I\'m working on</h2><p class="lede rv" style="margin-top:14px">' + r.intro + '</p>' +
      '<div class="r-grid">' + cards + '</div>' + pubs + pipe +
      '<p class="rv" style="margin-top:22px"><a class="btn" href="' + r.orcidUrl + '" target="_blank" rel="noopener">' + svgIcon('orcid').replace('<svg', '<svg fill="currentColor"') + 'ORCID profile</a></p></div></section>';

    var exp = '<section id="experience"><div class="wrap"><div class="sec-head rv"><span class="idx">02</span><div class="eyebrow">experience</div></div><h2 class="rv">Where I\'ve worked</h2><p class="lede rv" style="margin-top:14px">Research now, two years of production ML before it. Each role shaped how I ask research questions.</p><div class="tl">' +
      D.experience.items.map(tlItem).join('') + '</div></div></section>';

    var filters = D.projects.filters.map(function (f, i) { return '<button class="' + (i ? '' : 'on') + '" data-f="' + f.key + '">' + f.label + '</button>'; }).join('');
    var projects = '<section id="projects"><div class="wrap"><div class="sec-head rv"><span class="idx">03</span><div class="eyebrow">projects</div></div><h2 class="rv">Things I\'ve built</h2><p class="lede rv" style="margin-top:14px">Agents, RAG systems, assistive hardware and vision projects. Click a card for the full write-up.</p>' +
      '<div class="filters rv" id="filters">' + filters + '</div><div class="p-grid" id="pgrid">' + D.projects.items.map(projectCard).join('') + '</div></div></section>';

    var skills = '<section id="skills"><div class="wrap"><div class="sec-head rv"><span class="idx">04</span><div class="eyebrow">skills</div></div><h2 class="rv">Toolbox</h2><div class="sk-grid" style="margin-top:34px">' +
      D.skills.groups.map(function (g) { return '<div class="sk rv"><h4>' + g.category + '</h4><div class="chips">' + g.items.map(function (i) { return '<span class="chip">' + i + '</span>'; }).join('') + '</div></div>'; }).join('') + '</div></div></section>';

    var cr = D.credentials;
    var cred = '<section id="credentials"><div class="wrap"><div class="sec-head rv"><span class="idx">05</span><div class="eyebrow">education &amp; credentials</div></div><h2 class="rv">The paper trail</h2>' +
      '<div class="two" style="margin-top:40px"><div class="rv"><div class="sub-h">Education</div><div class="tl">' + cr.education.map(tlItem).join('') + '</div></div>' +
      '<div class="rv"><div class="sub-h">Honours &amp; awards</div><div class="cards">' + cr.awards.map(function (a) { return '<div class="mini"><b>' + clean(a.title) + '</b><p>' + a.desc + '</p></div>'; }).join('') + '</div>' +
      '<div class="sub-h" style="margin-top:34px">Events &amp; hackathons</div><div class="cards">' + cr.events.map(function (a) { return '<div class="mini"><b>' + clean(a.title) + '</b><small>' + a.meta + '</small><p>' + a.desc + '</p></div>'; }).join('') + '</div>' +
      '<div class="sub-h" style="margin-top:34px">Volunteering</div><div class="cards">' + cr.volunteering.map(function (a) { return '<div class="mini"><b>' + a.role + '</b><small>' + a.date + '</small><p>' + a.org + ' — ' + a.bullets[0] + '</p></div>'; }).join('') + '</div>' +
      '<div class="sub-h" style="margin-top:34px">Languages</div>' +
      '<div class="lang"><small>Mother tongue</small>' + D.languages.mother.map(function (l) { return '<span class="chip">' + l + '</span>'; }).join('') + '</div>' +
      '<div class="lang"><small>Other</small>' + D.languages.other.map(function (l) { return '<span class="chip">' + l + '</span>'; }).join('') + '</div></div></div>' +
      '<div class="sub-h rv" style="margin-top:56px">Certifications</div><div class="rv">' +
      cr.certifications.map(function (c) {
        return '<details class="cert">' + '<summary>' + logo(c.logo) + c.issuer + ' <em>' + c.items.length + '</em></summary><ul>' +
          c.items.map(function (i) { return '<li>' + clean(i.title) + '<span>' + i.meta + '</span></li>'; }).join('') + '</ul></details>';
      }).join('') + '</div></div></section>';

    var c = D.contact;
    var contact = '<section id="contact"><div class="wrap"><div class="contact rv"><div class="eyebrow" style="position:relative">let\'s talk</div><h2>' + c.heading + '</h2><p>' + c.text + '</p>' +
      '<div class="cta"><a class="btn primary" href="mailto:' + c.email + '?subject=Hello%20Vishnu">Email me →</a><a class="btn" href="' + docs.resume + '" target="_blank" rel="noopener">Resume</a><a class="btn" href="' + docs.cv + '">CV</a></div>' +
      '<div class="soc">' + c.links.filter(function (l) { return l.label !== 'Email'; }).map(function (l) {
        return '<a href="' + l.href + '" target="_blank" rel="noopener">' + svgIcon(l.label.toLowerCase()) + l.label + '</a>';
      }).join('') + '</div></div></div></section>';

    $('#app').innerHTML = hero + marquee() + about + research + exp + projects + skills + cred + contact;
    wireFilters();
  }

  function pipeCell(t, n, d) { return '<div><small>' + t + '</small><b data-count="' + n + '">0</b><p>' + d + '</p></div>'; }
  function svgInline(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>'; }

  function tlItem(it) {
    return '<div class="tl-item"><div class="tl-date">' + clean(it.date) + '</div><div class="tl-role">' + clean(it.role) + '</div><div class="tl-org">' + logo(it.logo) + '<span>' + clean(it.org) + '</span></div>' +
      (it.bullets && it.bullets.length ? '<ul>' + it.bullets.map(function (b) { return '<li>' + clean(b) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
  }

  var EMOJI_RE = /^(\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)\s*/u;
  function splitTitle(t) { var m = t.match(EMOJI_RE); return { emoji: m ? m[1] : '', name: clean(m ? t.slice(m[0].length) : t) }; }

  function projectCard(p) {
    var t = splitTitle(p.title);
    var imgs = (p.images || []).map(function (i) { return typeof i === 'string' ? i : i.src; });
    var vids = (p.videos || []).map(function (v) { return typeof v === 'string' ? v : v.src; });
    var thumb;
    if (imgs.length) thumb = '<div class="p-thumb"><img src="' + enc(imgs[0]) + '" alt="" loading="lazy"></div>';
    else if (vids.length) thumb = '<div class="p-thumb"><video src="' + enc(vids[0]) + '#t=1.2" muted playsinline preload="metadata"></video><span class="p-play">▶ demo</span></div>';
    else {
      var h = hue(p.id);
      thumb = '<div class="p-thumb gen" style="--g:linear-gradient(135deg,hsl(' + h + ',55%,32%),hsl(' + ((h + 60) % 360) + ',60%,18%))"><span class="em">' + (t.emoji || '✦') + '</span></div>';
    }
    return '<a class="p-card tilt rv" data-tag="' + p.tag + '" href="project.html?id=' + encodeURIComponent(p.id) + '">' +
      thumb.replace('<div class="p-thumb', '<div class="p-thumb').replace('</div>', '<span class="p-tag">' + p.tagLabel + '</span></div>') +
      '<div class="p-body"><h3>' + t.name + '</h3><p>' + clean(p.desc.replace(/^[^\w<]+/u, '')) + '</p><span class="p-more">Read more</span></div></a>';
  }

  function wireFilters() {
    var bar = $('#filters'); if (!bar) return;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', bar).forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on');
      var f = b.getAttribute('data-f');
      $$('.p-card').forEach(function (c) {
        var tag = c.getAttribute('data-tag');
        var ok = f === 'all' || tag === f || (f === 'vision' && (tag === 'python'));
        c.classList.toggle('hide', !ok);
      });
    });
    // hover-play video thumbs
    $$('.p-card').forEach(function (c) {
      var v = $('video', c); if (!v) return;
      c.addEventListener('mouseenter', function () { v.play().catch(function () { }); });
      c.addEventListener('mouseleave', function () { v.pause(); });
    });
  }

  /* -------------------------------------------------- project detail */
  function renderProject() {
    var root = $('#app');
    var id = new URLSearchParams(location.search).get('id');
    var p = D.projects.items.filter(function (x) { return x.id === id; })[0];
    if (!p) { root.innerHTML = '<div class="wrap page-pad"><a class="back" href="index.html#projects">← All projects</a><h1 style="margin-top:20px">Project not found</h1></div>'; return; }
    var t = splitTitle(p.title);
    document.title = t.name + ' — Vishnu Vardhan Addanki Tirumala';
    var images = (p.images || []).map(function (it, i) { return typeof it === 'string' ? { id: 'i' + i, src: it, caption: '' } : { id: it.id || 'i' + i, src: it.src, caption: it.caption || '' }; });
    var videos = (p.videos || []).map(function (it, i) { return typeof it === 'string' ? { id: 'v' + i, src: it, caption: '' } : { id: it.id || 'v' + i, src: it.src, caption: it.caption || '' }; });
    var usedI = {}, usedV = {};
    var body = (p.detail && p.detail.length ? p.detail : [p.desc]).map(function (para) {
      var s = clean(para).replace(/\{\{img:([\w-]+)\}\}/g, function (m, k) {
        var im = images.filter(function (x) { return x.id === k; })[0]; if (!im) return '';
        usedI[k] = 1;
        return '<figure class="fig" data-lb="' + images.indexOf(im) + '"><img src="' + enc(im.src) + '" alt="' + (im.caption || '') + '" loading="lazy">' + (im.caption ? '<figcaption>' + im.caption + '</figcaption>' : '') + '</figure>';
      }).replace(/\{\{vid:([\w-]+)\}\}/g, function (m, k) {
        var v = videos.filter(function (x) { return x.id === k; })[0]; if (!v) return '';
        usedV[k] = 1;
        return '<figure class="fig" style="cursor:default"><video src="' + enc(v.src) + '" controls preload="metadata"></video>' + (v.caption ? '<figcaption>' + v.caption + '</figcaption>' : '') + '</figure>';
      });
      return '<div>' + s + '</div>';
    }).join('');
    var restI = images.filter(function (x) { return !usedI[x.id]; });
    var restV = videos.filter(function (x) { return !usedV[x.id]; });
    var links = !p.link ? [] : (Array.isArray(p.link) ? p.link : [p.link]);
    root.innerHTML = '<div class="wrap page-pad proj"><a class="back" href="index.html#projects">← All projects</a>' +
      '<div style="margin-top:28px"><span class="p-tag" style="position:static;display:inline-block">' + p.tagLabel + '</span></div>' +
      '<h1>' + (t.emoji ? '<span style="font-size:.7em">' + t.emoji + '</span> ' : '') + t.name + '</h1>' +
      (links.length ? '<div class="cta" style="margin-bottom:30px">' + links.map(function (l, i) { return '<a class="btn' + (i ? '' : ' primary') + '" href="' + l.href + '" target="_blank" rel="noopener">' + l.label + '</a>'; }).join('') + '</div>' : '') +
      '<div class="prose">' + body + '</div>' +
      (restV.length ? '<div class="sub-h" style="margin-top:40px">Videos</div><div class="prose" style="max-width:900px">' + restV.map(function (v) { return '<figure class="fig" style="cursor:default"><video src="' + enc(v.src) + '" controls preload="metadata"></video>' + (v.caption ? '<figcaption>' + v.caption + '</figcaption>' : '') + '</figure>'; }).join('') + '</div>' : '') +
      (restI.length ? '<div class="sub-h" style="margin-top:40px">Screenshots</div><div class="thumbs">' + restI.map(function (im) { return '<button data-lb="' + images.indexOf(im) + '"><img src="' + enc(im.src) + '" alt="" loading="lazy"><span>' + (im.caption || '') + '</span></button>'; }).join('') + '</div>' : '') +
      '</div>' +
      '<div class="lb" id="lb"><button class="x" aria-label="Close">×</button><button class="pv" aria-label="Previous">‹</button><img alt=""><button class="nx" aria-label="Next">›</button><p></p></div>';
    var lb = $('#lb'), idx = 0;
    function show(i) { idx = (i + images.length) % images.length; $('img', lb).src = enc(images[idx].src); $('p', lb).textContent = images[idx].caption; lb.classList.add('open'); }
    root.addEventListener('click', function (e) { var f = e.target.closest('[data-lb]'); if (f) show(+f.getAttribute('data-lb')); });
    $('.x', lb).onclick = function () { lb.classList.remove('open'); };
    $('.pv', lb).onclick = function () { show(idx - 1); }; $('.nx', lb).onclick = function () { show(idx + 1); };
    lb.onclick = function (e) { if (e.target === lb) lb.classList.remove('open'); };
    document.addEventListener('keydown', function (e) { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') lb.classList.remove('open'); if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  }

  /* --------------------------------------------------------------- CV */
  function renderCV() {
    var r = D.research, docs = D.site.docs;
    var link = function (u) { return u.replace(/^https?:\/\//, '').replace(/\/$/, ''); };
    var sec = function (t, body) { return '<section class="cv-sec"><h2>' + t + '</h2>' + body + '</section>'; };
    var row = function (l, rr) { return '<div class="cv-row"><div class="cv-l">' + l + '</div><div class="cv-r">' + rr + '</div></div>'; };
    var exp = D.experience.items;
    var uoa = exp[0];
    var researchRows = r.items.map(function (i) {
      return row(i.statusLabel.replace(' · ', '<br>'), '<b>' + i.title + '</b><div class="cv-sub">' + i.kind + ' · ' + i.venue + '</div><div>' + i.desc + '</div>');
    }).join('');
    var pubRows = r.published.map(function (p) {
      return row(p.year, '<b>' + p.title + '</b><div class="cv-sub">' + p.venue + ' (' + p.status + ')</div>');
    }).join('');
    var subRows = r.items.filter(function (i) { return i.status === 'review' || i.status === 'planned'; }).map(function (i) {
      return row(i.status === 'review' ? 'Communicated' : 'In preparation', '<b>' + i.title + '</b><div class="cv-sub">' + i.venue + '</div>');
    }).join('');
    var work = exp.map(function (e) {
      return row(clean(e.date), '<b>' + e.role + '</b>, ' + e.org + '<ul>' + e.bullets.map(function (b) { return '<li>' + clean(b) + '</li>'; }).join('') + '</ul>');
    }).join('');
    var edu = D.credentials.education.map(function (e) { return row(clean(e.date), '<b>' + e.role + '</b><div class="cv-sub">' + e.org + '</div>' + (e.role.indexOf('MTech') === 0 ? '<div>Research track: vision-language models, interpretable ML and edge perception.</div>' : '')); }).join('');
    var pick = ['agentic-codesign', 'deep-research-agent', 'ai-video-generator', 'sight-sphere', 'edubot', 'medintelbot', 'face-recognition'];
    var projs = pick.map(function (id) { var p = D.projects.items.filter(function (x) { return x.id === id; })[0]; if (!p) return ''; var t = splitTitle(p.title); return '<li><b>' + t.name + '</b> — ' + clean(p.desc.replace(/^[^\w<]+/u, '')) + '</li>'; }).join('');
    var skills = D.skills.groups.map(function (g) { return '<div><b>' + g.category + ':</b> ' + g.items.join(', ') + '</div>'; }).join('');
    var awards = D.credentials.awards.map(function (a) { return '<li><b>' + clean(a.title) + '</b> — ' + a.desc + '</li>'; }).join('');
    var vol = D.credentials.volunteering.map(function (a) { return '<li><b>' + a.role + '</b>, ' + a.org + ' (' + clean(a.date) + ')</li>'; }).join('');

    document.title = 'Curriculum Vitae — Vishnu Vardhan Addanki Tirumala';
    $('#app').innerHTML =
      '<div class="cv-bar no-print"><a class="back" href="index.html">← Back to site</a><div><a class="btn" href="' + docs.resume + '" target="_blank" rel="noopener">Resume (PDF)</a> <a class="btn" href="' + docs.cvPdf + '" download>Download CV (PDF)</a> <button class="btn primary" onclick="window.print()">Print</button></div></div>' +
      '<article class="cv">' +
      '<header class="cv-head"><div><h1>Vishnu Vardhan Addanki Tirumala</h1><div class="cv-tag">Curriculum Vitae · MSc Artificial Intelligence &amp; Data Science · University Research Assistant</div></div>' +
      '<div class="cv-contact"><div>Grimstad, Norway</div><div>' + D.contact.email + '</div><div>' + link('https://vishnu-add.github.io/') + '</div><div>github.com/Vishnu-add</div><div>orcid.org/0009-0003-4496-0054</div><div>linkedin.com/in/a-vishnu-vardhan</div></div></header>' +
      sec('Research interests', '<p>Interpretability and robustness of vision-language models; multimodal learning and parameter-efficient fine-tuning (LoRA); interpretable and distributed learning (Tsetlin Machines); lightweight, sensor-agnostic perception for edge and robotic platforms; agentic AI systems.</p>') +
      sec('Education', edu) +
      sec('Publications', pubRows) +
      sec('Manuscripts under review &amp; in preparation', subRows) +
      sec('Research projects', researchRows) +
      sec('Experience', work) +
      sec('Selected projects', '<ul class="cv-list">' + projs + '</ul>') +
      sec('Technical skills', '<div class="cv-skills">' + skills + '</div>') +
      sec('Honours &amp; awards', '<ul class="cv-list">' + awards + '</ul>') +
      sec('Service &amp; activities', '<ul class="cv-list">' + vol + '</ul>') +
      sec('Languages', '<p>Telugu and Hindi (native); English (professional).</p>') +
      '</article>';
  }

  /* ------------------------------------------------------------ effects */
  function initFX() {
    // scroll progress
    var bar = document.createElement('div'); bar.id = 'progress'; document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
      var h = document.documentElement; bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    }, { passive: true });

    // reveal
    var rv = $$('.rv');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
      rv.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 70 + 'ms'; io.observe(el); });
    } else rv.forEach(function (el) { el.classList.add('in'); });

    // counters
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, to = +el.getAttribute('data-count'), t0 = null;
        (function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: .4 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });

    // tilt
    if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
      $$('.tilt').forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          el.style.transform = 'perspective(900px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg) translateY(-4px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });
    }

    // typed text
    var te = $('#typed');
    if (te) {
      var words = D.hero.typeWords, wi = 0, ci = 0, del = false;
      (function tick() {
        var w = words[wi];
        if (!del) { ci++; if (ci >= w.length) { del = true; te.textContent = w; return void setTimeout(tick, 1500); } }
        else { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words.length; } }
        te.textContent = w.slice(0, ci);
        setTimeout(tick, del ? 32 : 70);
      })();
    }

    // scroll-spy
    if (PAGE === 'home') {
      var map = {};
      $$('#links a').forEach(function (a) { map[a.getAttribute('data-s')] = a; });
      var spy = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { $$('#links a').forEach(function (a) { a.classList.remove('active'); }); var a = map[e.target.id]; if (a) a.classList.add('active'); }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      SECTIONS.forEach(function (s) { var el = document.getElementById(s[0]); if (el) spy.observe(el); });
    }
    initNet();
  }

  /* hero: neural-network field that reacts to the pointer */
  function initNet() {
    var cv = $('#net'); if (!cv) return;
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    var ctx = cv.getContext('2d'), W, H, nodes = [], pulses = [], mouse = { x: -999, y: -999 }, dpr = Math.min(2, devicePixelRatio || 1);
    var col = function (n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };
    var cA, cS, cL;
    function colors() { cA = col('--acc'); cS = col('--sig'); cL = col('--faint'); }
    function size() {
      var r = cv.parentNode.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(110, Math.max(36, W * H / 14000)));
      nodes = []; for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .8, c: Math.random() < .25 });
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, d, link = 130;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
        var dx = a.x - mouse.x, dy = a.y - mouse.y, dm = Math.sqrt(dx * dx + dy * dy);
        if (dm < 120 && dm > 0) { a.x += dx / dm * 1.2; a.y += dy / dm * 1.2; }
      }
      ctx.lineWidth = .8;
      for (i = 0; i < nodes.length; i++) for (j = i + 1; j < nodes.length; j++) {
        a = nodes[i]; b = nodes[j]; d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) { ctx.globalAlpha = (1 - d / link) * .35; ctx.strokeStyle = cL; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      if (!reduce && Math.random() < .06 && nodes.length > 2) {
        a = nodes[Math.floor(Math.random() * nodes.length)];
        var best = null, bd = link; nodes.forEach(function (n) { var dd = Math.hypot(a.x - n.x, a.y - n.y); if (n !== a && dd < bd) { bd = dd; best = n; } });
        if (best) pulses.push({ a: a, b: best, t: 0 });
      }
      pulses = pulses.filter(function (p) {
        p.t += .03; if (p.t >= 1) return false;
        var x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.globalAlpha = 1 - p.t * .4; ctx.fillStyle = cA; ctx.shadowColor = cA; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.3); ctx.fill(); ctx.shadowBlur = 0; return true;
      });
      nodes.forEach(function (n) { ctx.globalAlpha = .75; ctx.fillStyle = n.c ? cS : cA; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.3); ctx.fill(); });
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(frame);
    }
    colors(); size(); frame();
    if (reduce) window.addEventListener('resize', function () { size(); frame(); });
    else window.addEventListener('resize', size);
    window.addEventListener('themechange', colors);
    cv.parentNode.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    cv.parentNode.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
  }

  /* -------------------------------------------------------------- boot */
  function footer() {
    var f = $('#footer'); if (!f) return;
    f.innerHTML = '<div class="wrap"><span>© ' + new Date().getFullYear() + ' ' + D.site.name + '</span><span>Grimstad, Norway · ' + D.site.footerText + '</span></div>';
  }

  fetch('data.json').then(function (r) { return r.json(); }).then(function (d) {
    D = d;
    renderNav();
    if (PAGE === 'home') renderHome(); else if (PAGE === 'project') renderProject(); else if (PAGE === 'cv') renderCV();
    footer(); initFX();
    if (location.hash && PAGE === 'home') { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
  }).catch(function (e) {
    $('#app').innerHTML = '<div class="wrap page-pad"><h1>Could not load content</h1><p class="lede">Open this site over http(s) (e.g. <code>python3 -m http.server</code>) — browsers block fetch() on file:// pages.</p></div>';
    console.error(e);
  });
})();
