/* Renders every page from data.json and wires up the interactions.
   Pages: index.html (home), project.html (?id=…), cv.html. Edit data.json to change content. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clean = function (s) { return String(s == null ? '' : s).replace(/ , /g, ' – '); };
  var enc = function (u) { return encodeURI(String(u).trim()); };   /* a stray space in data.json must never 404 an image */
  var PAGE = document.body.getAttribute('data-page');
  var D = null;

  var ICON = {
    github: '<path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/>',
    linkedin: '<path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.32 8.5h3.24V21H3.32V8.5zm6.02 0h3.11v1.71h.04c.43-.82 1.5-1.69 3.08-1.69 3.29 0 3.9 2.17 3.9 4.99V21h-3.24v-5.83c0-1.39-.02-3.18-1.94-3.18-1.94 0-2.24 1.51-2.24 3.08V21H9.34V8.5z"/>',
    orcid: '<path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.343 2.653 5.343 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.918V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/>',
    twitter: '<path d="M22 5.9c-.74.33-1.53.55-2.36.65a4.14 4.14 0 0 0 1.81-2.28 8.24 8.24 0 0 1-2.61 1c-.75-.8-1.82-1.3-3-1.3-2.27 0-4.11 1.84-4.11 4.11 0 .32.04.64.11.94A11.65 11.65 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.27 5.48c-.67-.02-1.3-.2-1.85-.51v.05c0 1.99 1.42 3.65 3.3 4.03-.35.1-.71.15-1.09.15-.27 0-.52-.03-.78-.07a4.12 4.12 0 0 0 3.84 2.86A8.3 8.3 0 0 1 2 18.58a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.35 8.35 0 0 0 22 5.9z"/>',
    link: '<path d="M10.6 13.4a1 1 0 0 1 0-1.4l3-3a3 3 0 0 1 4.2 4.2l-1.5 1.5-1.4-1.4 1.5-1.5a1 1 0 0 0-1.4-1.4l-3 3a1 1 0 0 1-1.4 0zM13.4 10.6a1 1 0 0 1 0 1.4l-3 3a3 3 0 0 1-4.2-4.2l1.5-1.5 1.4 1.4-1.5 1.5a1 1 0 0 0 1.4 1.4l3-3a1 1 0 0 1 1.4 0z"/>',
    mail: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.5 2v.5L12 13l7.5-5.5V7h-15z"/>'
  };
  var svgIcon = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICON[k] || ICON.mail) + '</svg>'; };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function hue(s) { var h = 0; for (var i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return Math.abs(h) % 360; }
  function logo(l) { return l ? '<span class="logo">' + l + '</span>' : ''; }

  /* ------------------------------------------------------------ nav */
  var SECTIONS = [['research', 'Research'], ['experience', 'Experience'], ['projects', 'Projects'], ['skills', 'Skills'], ['credentials', 'Education'], ['contact', 'Contact']];

  var BRAND = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 9h10l6 6h6" stroke="var(--l-m)"/><path d="M3 19h22" stroke="var(--l-i)"/><path d="M14 3v22" stroke="var(--l-e)"/><rect x="10" y="15" width="8" height="8" rx="2.5" class="bm"/></svg>';

  function renderNav() {
    var base = PAGE === 'home' ? '' : 'index.html';
    var docs = D.site.docs;
    /* Contact is the one action, so it is a button rather than a sixth link */
    var links = SECTIONS.filter(function (s) { return s[0] !== 'contact'; }).map(function (s) { return '<li><a href="' + base + '#' + s[0] + '" data-s="' + s[0] + '">' + s[1] + '</a></li>'; }).join('');
    $('#nav').innerHTML =
      '<div class="wrap">' +
      '<a class="brand" href="' + (PAGE === 'home' ? '#top' : 'index.html') + '" aria-label="Vishnu Vardhan Addanki Tirumala, home">' + BRAND + '<span>Vishnu Vardhan</span></a>' +
      '<ul class="links" id="links">' + links + '</ul>' +
      '<div class="nav-right">' +
      '<a class="btn-nav ghost" href="' + docs.cv + '" title="Open academic CV">' + svgInline('doc') + '<span>CV</span></a>' +
      '<a class="btn-nav" href="' + base + '#contact">Contact</a>' +
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
  }

  /* ------------------------------------------------- animated thumbnails */
  var A = 'var(--acc)', S = 'var(--sig)', W = 'var(--warn)', P = 'var(--pink)', L = 'var(--line2)', C2 = 'var(--card2)', F = 'var(--faint)';
  var BG = 'var(--bg2)';
  var SV = 'viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" aria-hidden="true"';
  var tx = function (x, y, t, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" font-family="Archivo, system-ui, sans-serif" font-size="' + (o.s || 7.5) + '" fill="' + (o.f || F) + '"' + (o.x || '') + '>' + t + '</text>'; };
  var THUMBS = {
    /* Master's thesis: video + text -> VLM with a LoRA adapter (frozen W, trainable low-rank B·A) */
    vlm: function () {
      var s = '<svg ' + SV + '><defs><linearGradient id="vg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + S + '"/><stop offset="1" stop-color="' + A + '"/></linearGradient></defs>';
      // video deck
      [2, 1, 0].forEach(function (i) {
        s += '<rect x="' + (10 + i * 5) + '" y="' + (18 + i * 6) + '" width="50" height="32" rx="4" fill="' + C2 + '" stroke="' + S + '" stroke-width="1.2"/>';
      });
      s += '<circle cx="28" cy="38" r="8" fill="url(#vg1)" opacity=".9"/><path d="M26 34 L33 38 L26 42Z" fill="' + BG + '"/><rect x="40" y="31" width="16" height="3" rx="1.5" fill="' + F + '"/><rect x="40" y="38" width="11" height="3" rx="1.5" fill="' + F + '"/>';
      s += tx(34, 68, 'video frames', { f: S });
      // text prompt
      s += '<rect x="10" y="112" width="58" height="32" rx="7" fill="' + C2 + '" stroke="' + A + '" stroke-width="1.2"/><rect x="17" y="119" width="44" height="3" rx="1.5" fill="' + F + '"/><rect x="17" y="126" width="34" height="3" rx="1.5" fill="' + F + '"/><rect x="17" y="133" width="40" height="3" rx="1.5" fill="' + F + '"/>';
      s += tx(39, 158, 'text prompt', { f: A });
      // flows into the model
      s += '<path class="fl" d="M64 40 C 86 40 90 64 106 68" fill="none" stroke="' + S + '" stroke-width="1.5"/><path class="fl" d="M70 128 C 88 128 90 112 106 108" fill="none" stroke="' + A + '" stroke-width="1.5"/>';
      s += '<rect width="5" height="5" rx="1" fill="' + S + '"><animateMotion dur="2.1s" repeatCount="indefinite" path="M64 40 C 86 40 90 64 106 68"/></rect><rect width="5" height="5" rx="1" fill="' + S + '"><animateMotion dur="2.1s" begin="-1s" repeatCount="indefinite" path="M64 40 C 86 40 90 64 106 68"/></rect>';
      s += '<rect width="5" height="5" rx="1" fill="' + A + '"><animateMotion dur="2.1s" begin="-.5s" repeatCount="indefinite" path="M70 128 C 88 128 90 112 106 108"/></rect><rect width="5" height="5" rx="1" fill="' + A + '"><animateMotion dur="2.1s" begin="-1.5s" repeatCount="indefinite" path="M70 128 C 88 128 90 112 106 108"/></rect>';
      // model box
      s += '<rect x="104" y="12" width="112" height="156" rx="10" fill="' + C2 + '" stroke="' + L + '"/>' + tx(160, 26, 'VLM  ·  one layer', { f: F, s: 7 });
      s += '<circle cx="160" cy="40" r="3" fill="' + F + '"/><path d="M160 43 L134 56 M160 43 L186 56" stroke="' + F + '" fill="none"/>';
      // frozen W
      s += '<rect x="118" y="56" width="32" height="64" rx="4" fill="' + BG + '" stroke="' + L + '" stroke-width="1.4"/>' +
        '<rect x="130" y="64" width="8" height="6" rx="1" fill="' + F + '"/><path d="M131.5 64 v-2 a2.5 2.5 0 0 1 5 0 v2" stroke="' + F + '" fill="none"/>' +
        '<text x="134" y="98" text-anchor="middle" font-family="Archivo, system-ui, sans-serif" font-style="italic" font-weight="700" font-size="20" fill="' + F + '">W</text>' + tx(134, 112, 'frozen', { s: 6.5 });
      // LoRA branch
      s += '<g class="blink"><rect x="170" y="56" width="32" height="16" rx="3" fill="none" stroke="' + A + '" stroke-width="1.6"/><rect x="170" y="104" width="32" height="16" rx="3" fill="none" stroke="' + A + '" stroke-width="1.6"/></g>' +
        tx(186, 67.5, 'A', { f: A, s: 9 }) + tx(186, 115.5, 'B', { f: A, s: 9 }) +
        '<rect x="183" y="74" width="6" height="28" rx="3" fill="' + A + '" opacity=".55"/>' + tx(198, 91, 'r', { f: A, s: 8, a: 'start' }) + tx(186, 129, 'trained', { f: A, s: 6.5 });
      // sum
      s += '<path d="M134 120 L154 138 M186 120 L166 138" stroke="' + F + '" fill="none"/><circle cx="160" cy="141" r="7" fill="' + BG + '" stroke="' + A + '"/>' + tx(160, 144.5, '+', { f: A, s: 10 }) + tx(160, 160, 'h = Wx + B·A·x', { s: 7 });
      // output
      s += '<path class="fl" d="M216 90 H 234" stroke="' + A + '" stroke-width="2"/><rect x="234" y="52" width="76" height="76" rx="8" fill="' + C2 + '" stroke="' + A + '"/>' +
        tx(272, 74, 'a chef pours', { s: 7.5, f: 'var(--text)' }) + tx(272, 87, 'tea into a cup', { s: 7.5, f: 'var(--text)' }) +
        '<rect class="blink" x="256" y="96" width="32" height="3" rx="1.5" fill="' + A + '"/>' + tx(272, 142, 'text answer', { f: A }) + '</svg>';
      return s;
    },
    /* distributed learners vs. one big centralized model trained on the complete data */
    dist: function () {
      var s = '<svg ' + SV + '>';
      // centralized row
      [0, 1, 2].forEach(function (i) { s += '<rect x="12" y="' + (24 + i * 10) + '" width="36" height="8" rx="3" fill="' + C2 + '" stroke="' + F + '"/>'; });
      s += tx(30, 66, 'complete data', { s: 6.5 }) + '<path class="fl" d="M50 40 H 82" stroke="' + W + '" stroke-width="1.8"/>';
      s += '<rect x="82" y="16" width="86" height="56" rx="8" fill="' + C2 + '" stroke="' + W + '" stroke-width="1.5"/>';
      var cols = [98, 125, 152], ys = [[28, 44, 60], [24, 38, 52, 66], [28, 44, 60]];
      cols.forEach(function (x, ci) { if (ci < 2) ys[ci].forEach(function (y1) { ys[ci + 1].forEach(function (y2) { s += '<path d="M' + x + ' ' + y1 + ' L' + cols[ci + 1] + ' ' + y2 + '" stroke="' + F + '" stroke-width=".5" opacity=".6"/>'; }); }); });
      cols.forEach(function (x, ci) { ys[ci].forEach(function (y) { s += '<circle class="blink" cx="' + x + '" cy="' + y + '" r="3.2" fill="' + W + '" style="animation-delay:-' + ((x + y) % 7) * .3 + 's"/>'; }); });
      s += tx(125, 84, 'big centralized model', { f: W, s: 6.5 });
      // distributed row
      [[24, A], [44, S], [64, A]].forEach(function (p, i) {
        var y = 106 + i * 24;
        s += '<circle cx="24" cy="' + y + '" r="9" fill="' + C2 + '" stroke="' + p[1] + '"/>' + tx(24, y + 3, 'θ' + (i + 1), { s: 7 }) + '<path class="fl" d="M33 ' + y + ' C 56 ' + y + ' 56 130 78 130" fill="none" stroke="' + p[1] + '" stroke-width="1.3" style="animation-duration:' + (.9 + i * .2) + 's"/>';
      });
      s += tx(24, 88, 'partitions', { s: 6.5 }) + '<circle class="spin" cx="88" cy="130" r="11" fill="none" stroke="' + A + '" stroke-dasharray="3 4"/><circle cx="88" cy="130" r="7" fill="' + BG + '" stroke="' + A + '"/>' + tx(88, 133.5, '⊕', { f: A, s: 9 });
      s += '<path class="fl" d="M99 130 H 118" stroke="' + A + '" stroke-width="1.6"/><rect x="118" y="106" width="50" height="48" rx="8" fill="' + C2 + '" stroke="' + A + '" stroke-width="1.5"/>';
      [0, 1, 2].forEach(function (i) { s += '<rect x="126" y="' + (115 + i * 11) + '" width="' + [30, 22, 26][i] + '" height="5" rx="2.5" fill="' + A + '" opacity=".75"/>'; });
      s += tx(143, 166, 'combined learners', { f: A, s: 6.5 });
      // compare
      s += '<rect x="196" y="20" width="116" height="140" rx="10" fill="' + C2 + '" stroke="' + L + '"/>' + tx(254, 35, 'compare', { s: 7.5, f: 'var(--text)' });
      s += '<path class="fl" d="M168 44 H 196" stroke="' + W + '" stroke-width="1.6"/><path class="fl" d="M168 130 H 196" stroke="' + A + '" stroke-width="1.6"/>';
      s += tx(204, 52, 'centralized', { a: 'start', s: 6.5 }) + '<rect x="204" y="56" width="98" height="8" rx="4" fill="' + BG + '"/><rect x="204" y="56" width="90" height="8" rx="4" fill="' + W + '"/>';
      s += tx(204, 124, 'distributed', { a: 'start', s: 6.5 }) + '<rect x="204" y="128" width="98" height="8" rx="4" fill="' + BG + '"/><rect x="204" y="128" width="88" height="8" rx="4" fill="' + A + '"/>';
      s += tx(254, 100, '≈', { s: 22, f: 'var(--text)' }) + tx(254, 112, 'same accuracy', { s: 6.5 }) + tx(254, 148, 'same explanations', { s: 6.5, f: A, x: ' class="blink"' }) + '</svg>';
      return s;
    },
    /* one lightweight net, switching between RGB / thermal / NIR, for wildfire + smoke segmentation */
    seg: function () {
      var s = '<svg ' + SV + '><defs>' +
        '<linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b7c91"/><stop offset=".55" stop-color="#2f5a3a"/><stop offset="1" stop-color="#173a24"/></linearGradient>' +
        '<linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a0f55"/><stop offset=".6" stop-color="#a1366f"/><stop offset="1" stop-color="#e8873a"/></linearGradient>' +
        '<linearGradient id="sg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e8e8e"/><stop offset="1" stop-color="#3b3b3b"/></linearGradient></defs>';
      s += tx(160, 13, 'WILDFIRE &amp; SMOKE SEGMENTATION · EDGE', { s: 7, f: A });
      var tiles = [['sg1', 'RGB'], ['sg2', 'THERMAL'], ['sg3', 'NIR']];
      tiles.forEach(function (t, i) {
        var y = 22 + i * 49, d = i * 1.2;
        s += '<rect x="12" y="' + y + '" width="64" height="42" rx="5" fill="url(#' + t[0] + ')"/>';
        // scene per modality: fire + smoke
        if (i === 0) s += '<path d="M30 ' + (y + 38) + ' L36 ' + (y + 22) + ' L40 ' + (y + 30) + ' L45 ' + (y + 16) + ' L52 ' + (y + 38) + 'Z" fill="#ff7a1a"/><ellipse cx="46" cy="' + (y + 12) + '" rx="18" ry="7" fill="#cfd6da" opacity=".65"/>';
        if (i === 1) s += '<path d="M28 ' + (y + 38) + ' L36 ' + (y + 20) + ' L42 ' + (y + 28) + ' L47 ' + (y + 14) + ' L56 ' + (y + 38) + 'Z" fill="#fff6a8"/><ellipse cx="46" cy="' + (y + 12) + '" rx="16" ry="6" fill="#8a3f8f" opacity=".5"/>';
        if (i === 2) s += '<ellipse cx="44" cy="' + (y + 28) + '" rx="16" ry="9" fill="#111" opacity=".8"/><ellipse cx="44" cy="' + (y + 12) + '" rx="18" ry="6" fill="#ddd" opacity=".35"/>';
        s += '<text x="17" y="' + (y + 10) + '" font-family="Archivo, system-ui, sans-serif" font-size="6.5" fill="#fff" opacity=".95">' + t[1] + '</text>';
        s += '<rect class="cyc" x="12" y="' + y + '" width="64" height="42" rx="5" fill="none" stroke="' + A + '" stroke-width="2.2" style="animation-delay:' + d + 's"/>';
        s += '<path class="fl cyc2" d="M76 ' + (y + 21) + ' C 100 ' + (y + 21) + ' 106 90 126 90" fill="none" stroke="' + A + '" stroke-width="1.6" style="animation-delay:' + d + 's"/>';
      });
      // shared lightweight net
      s += '<rect x="122" y="48" width="80" height="84" rx="8" fill="' + C2 + '" stroke="' + L + '"/>';
      [0, 1, 2, 3, 4].forEach(function (i) { var h = [52, 38, 24, 38, 52][i]; s += '<rect class="blink" x="' + (130 + i * 14) + '" y="' + (90 - h / 2) + '" width="9" height="' + h + '" rx="2.5" fill="none" stroke="' + S + '" style="animation-delay:-' + i * .35 + 's"/>'; });
      s += tx(162, 144, 'one shared model', { s: 6.8, f: S }) + '<path class="fl" d="M202 90 H 232" stroke="' + A + '" stroke-width="2"/>';
      // output mask
      s += '<rect x="232" y="30" width="78" height="112" rx="6" fill="#0b100e" stroke="' + A + '"/><ellipse cx="271" cy="52" rx="28" ry="12" fill="#9aa5ab" opacity=".55"/><path d="M246 128 L256 92 L264 108 L272 78 L284 106 L292 96 L300 128Z" fill="' + P + '" opacity=".9"/><path d="M256 128 L264 108 L272 118 L280 100 L290 128Z" fill="' + W + '"/>' +
        '<rect class="scan" x="232" y="30" width="2" height="112" fill="' + A + '" style="animation-name:scan2"/>' + tx(271, 156, 'fire + smoke mask', { s: 6.8, f: A }) + tx(160, 172, 'any sensor in · same weights', { s: 7 }) + '</svg>';
      return s;
    },
    /* small humanoid walking over tile / gravel / grass while an onboard signal is classified */
    terrain: function () {
      var s = '<svg ' + SV + '><defs><clipPath id="tc"><rect x="16" y="128" width="288" height="26"/></clipPath></defs>';
      for (var i = 0; i < 3; i++) s += '<path d="M16 ' + (20 + i * 16) + ' H304" stroke="' + L + '" stroke-width=".5" opacity=".6"/>';
      var pts = '', x;
      for (x = 16; x <= 304; x += 3) {
        var seg = x < 112 ? 0 : x < 208 ? 1 : 2, y = 38;
        if (seg === 0) y += Math.sin(x / 8) * 3;
        if (seg === 1) y += (Math.sin(x * 1.9) + Math.sin(x * .7)) * 9 * Math.sin(x * .13 + 1);
        if (seg === 2) y += Math.sin(x / 4) * 9;
        pts += x + ',' + y.toFixed(1) + ' ';
      }
      s += tx(16, 14, 'onboard IMU / force signal', { a: 'start', s: 6.8 }) + '<polyline points="' + pts + '" fill="none" stroke="' + S + '" stroke-width="1.6"/><rect class="scan" x="16" y="16" width="2.5" height="46" fill="' + A + '" style="animation-name:scan3"/>';
      // robot
      s += '<g class="bob" style="animation-duration:1.1s">' +
        '<path d="M160 62 V55" stroke="' + S + '" stroke-width="1.5"/><circle class="blink" cx="160" cy="53" r="2.4" fill="' + P + '"/>' +
        '<rect x="151" y="62" width="18" height="13" rx="5" fill="' + C2 + '" stroke="' + S + '" stroke-width="1.4"/><rect class="blink" x="154" y="66" width="12" height="3.5" rx="1.7" fill="' + A + '"/>' +
        '<rect x="149" y="77" width="22" height="26" rx="6" fill="' + C2 + '" stroke="' + S + '" stroke-width="1.4"/><circle class="blink" cx="160" cy="90" r="3.4" fill="' + A + '"/>' +
        '<g class="swing" style="transform-origin:148px 80px"><rect x="143" y="79" width="6" height="19" rx="3" fill="' + C2 + '" stroke="' + S + '"/></g>' +
        '<g class="swing b" style="transform-origin:172px 80px"><rect x="171" y="79" width="6" height="19" rx="3" fill="' + C2 + '" stroke="' + S + '"/></g>' +
        '<g class="swing" style="transform-origin:155px 102px"><rect x="152" y="102" width="7" height="20" rx="3" fill="' + C2 + '" stroke="' + A + '"/><rect x="149" y="120" width="12" height="5" rx="2" fill="' + A + '"/></g>' +
        '<g class="swing b" style="transform-origin:165px 102px"><rect x="161" y="102" width="7" height="20" rx="3" fill="' + C2 + '" stroke="' + A + '"/><rect x="159" y="120" width="12" height="5" rx="2" fill="' + A + '"/></g></g>';
      // scrolling ground
      s += '<g clip-path="url(#tc)"><g class="walk">';
      for (var k = 0; k < 6; k++) {
        var gx = 16 + k * 96, t = k % 3;
        if (t === 0) { s += '<rect x="' + gx + '" y="128" width="96" height="26" fill="' + C2 + '"/>'; for (var g = 0; g < 8; g++) s += '<path d="M' + (gx + g * 12) + ' 128 V154" stroke="' + A + '" stroke-width=".6" opacity=".6"/>'; s += '<path d="M' + gx + ' 141 H' + (gx + 96) + '" stroke="' + A + '" stroke-width=".6" opacity=".6"/>'; }
        if (t === 1) { s += '<rect x="' + gx + '" y="128" width="96" height="26" fill="' + C2 + '"/>'; for (var d = 0; d < 26; d++) s += '<circle cx="' + (gx + (d * 37) % 94 + 2) + '" cy="' + (131 + (d * 17) % 21) + '" r="' + (1 + d % 3 * .5) + '" fill="' + W + '" opacity=".8"/>'; }
        if (t === 2) { s += '<rect x="' + gx + '" y="128" width="96" height="26" fill="' + C2 + '"/>'; for (var b = 0; b < 24; b++) s += '<path d="M' + (gx + b * 4 + 2) + ' 154 l' + ((b % 3) - 1) * 2 + ' -' + (8 + (b % 4) * 3) + '" stroke="' + S + '" stroke-width="1"/>'; }
      }
      s += '</g></g><path d="M16 128 H304" stroke="' + L + '"/>';
      s += '<g font-family="Archivo, system-ui, sans-serif" font-size="7.5" text-anchor="middle">' +
        '<rect x="30" y="159" width="62" height="14" rx="7" fill="none" stroke="' + A + '"/><text x="61" y="168.5" fill="' + A + '" class="ct">tile</text>' +
        '<rect x="129" y="159" width="62" height="14" rx="7" fill="none" stroke="' + W + '"/><text x="160" y="168.5" fill="' + W + '" class="cg">gravel</text>' +
        '<rect x="228" y="159" width="62" height="14" rx="7" fill="none" stroke="' + S + '"/><text x="259" y="168.5" fill="' + S + '" class="cgr">grass</text></g></svg>';
      return s;
    },
    /* agentic AI loop acting on a mechatronic build (gears + PCB) with a human in the loop */
    agent: function () {
      var s = '<svg ' + SV + '>' + tx(16, 20, 'mechatronics build', { a: 'start', s: 7, f: S }) + tx(240, 12, 'agentic AI loop', { s: 7, f: A });
      // gears
      s += '<g class="spin" style="transform-origin:50px 62px"><circle cx="50" cy="62" r="19" fill="none" stroke="' + S + '" stroke-width="8" stroke-dasharray="5.2 4.1"/><circle cx="50" cy="62" r="11" fill="' + C2 + '" stroke="' + L + '"/><circle cx="50" cy="62" r="3" fill="' + S + '"/></g>' +
        '<g class="spin r" style="transform-origin:90px 80px;animation-duration:5s"><circle cx="90" cy="80" r="12" fill="none" stroke="' + A + '" stroke-width="6" stroke-dasharray="4.5 3.7"/><circle cx="90" cy="80" r="7" fill="' + C2 + '" stroke="' + L + '"/><circle cx="90" cy="80" r="2.2" fill="' + A + '"/></g>';
      // motor
      s += '<rect x="108" y="36" width="26" height="18" rx="3" fill="' + C2 + '" stroke="' + L + '"/><rect x="134" y="42" width="8" height="6" fill="' + F + '"/><g class="spin" style="transform-origin:142px 45px;animation-duration:1.4s"><path d="M138 45 H146 M142 41 V49" stroke="' + W + '" stroke-width="1.5"/></g>';
      // PCB
      s += '<rect x="14" y="108" width="122" height="52" rx="5" fill="' + C2 + '" stroke="' + L + '"/>' +
        '<path class="fl" d="M22 120 H46 V134 H70 M22 148 H60 M100 114 V128 H128 M84 150 H128" fill="none" stroke="' + S + '" stroke-width="1" opacity=".8"/>' +
        '<rect x="46" y="120" width="22" height="14" rx="2" fill="' + BG + '" stroke="' + A + '"/><rect x="76" y="124" width="34" height="20" rx="2" fill="' + BG + '" stroke="' + A + '"/><circle class="blink" cx="124" cy="118" r="3" fill="' + P + '"/><circle cx="26" cy="124" r="2" fill="' + F + '"/><circle cx="118" cy="150" r="2" fill="' + F + '"/>' + tx(75, 170, 'electronics', { s: 6.8, f: S });
      // agent -> hardware links
      s += '<path class="fl" d="M183 98 C 166 96 152 88 104 80" fill="none" stroke="' + A + '" stroke-width="1.2" opacity=".8"/><path class="fl" d="M183 104 C 162 118 150 132 138 134" fill="none" stroke="' + A + '" stroke-width="1.2" opacity=".8"/>';
      // loop
      s += '<circle cx="240" cy="68" r="46" fill="none" stroke="' + L + '" stroke-dasharray="2 5"/><g class="spin" style="transform-origin:240px 68px;animation-duration:12s"><circle cx="240" cy="68" r="24" fill="none" stroke="' + A + '" stroke-width="1" stroke-dasharray="4 6"/></g>' +
        '<circle cx="240" cy="68" r="15" fill="' + C2 + '" stroke="' + A + '" stroke-width="1.5"/>' + tx(240, 71, 'LLM', { s: 8, f: A });
      [[240, 24, 'plan', S], [282, 96, 'act', A], [198, 96, 'observe', W]].forEach(function (n) {
        s += '<rect x="' + (n[0] - 19) + '" y="' + (n[1] - 9) + '" width="38" height="18" rx="9" fill="' + BG + '" stroke="' + n[3] + '" stroke-width="1.3"/>' + tx(n[0], n[1] + 3, n[2], { s: 7.5, f: n[3] });
      });
      s += '<path class="fl" d="M258 28 C 284 34 288 62 284 85" fill="none" stroke="' + A + '" stroke-width="1.3"/><path class="fl" d="M262 102 Q 240 120 218 102" fill="none" stroke="' + A + '" stroke-width="1.3"/><path class="fl" d="M196 85 C 192 58 208 38 222 29" fill="none" stroke="' + A + '" stroke-width="1.3"/>';
      s += '<rect x="212" y="130" width="86" height="18" rx="9" fill="none" stroke="' + P + '"/>' + tx(255, 142, 'human review ✓', { s: 7.5, f: P, x: ' class="blink"' }) + tx(255, 163, 'CAD · simulator · firmware', { s: 6.5 }) + '</svg>';
      return s;
    }
  };
  /* ---------- project thumbnails: one small animated illustration per project ---------- */
  var PV = 'viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true"';
  var win = function (x, y, w, h, t) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="' + C2 + '" stroke="' + L + '"/><path d="M' + x + ' ' + (y + 12) + ' H' + (x + w) + '" stroke="' + L + '"/>' +
      '<circle cx="' + (x + 8) + '" cy="' + (y + 6) + '" r="1.8" fill="' + P + '"/><circle cx="' + (x + 15) + '" cy="' + (y + 6) + '" r="1.8" fill="' + W + '"/><circle cx="' + (x + 22) + '" cy="' + (y + 6) + '" r="1.8" fill="' + A + '"/>' +
      (t ? tx(x + w - 6, y + 8.5, t, { a: 'end', s: 5.5 }) : '');
  };
  var bars = function (x, y, ws, gap, col) { return ws.map(function (w, i) { return '<rect x="' + x + '" y="' + (y + i * gap) + '" width="' + w + '" height="3" rx="1.5" fill="' + (col || F) + '" opacity=".85"/>'; }).join(''); };
  var pill = function (x, y, w, t, col, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="14" rx="7" fill="' + BG + '" stroke="' + col + '"/>' + tx(x + w / 2, y + 9.8, t, { s: 6.8, f: col, x: (o || '') }); };
  var face = function (cx, cy, k, mouth) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + 26 * k + '" ry="' + 32 * k + '" fill="' + C2 + '" stroke="' + F + '" stroke-width="1.4"/><circle cx="' + (cx - 9 * k) + '" cy="' + (cy - 7 * k) + '" r="' + 2.4 * k + '" fill="' + F + '"/><circle cx="' + (cx + 9 * k) + '" cy="' + (cy - 7 * k) + '" r="' + 2.4 * k + '" fill="' + F + '"/><path d="M' + cx + ' ' + (cy - 3 * k) + ' v' + 8 * k + '" stroke="' + F + '"/>' +
      (mouth ? '<path d="M' + (cx - 8 * k) + ' ' + (cy + 15 * k) + ' Q' + cx + ' ' + (cy + 20 * k) + ' ' + (cx + 8 * k) + ' ' + (cy + 15 * k) + '" fill="none" stroke="' + F + '"/>' : '');
  };
  var smiley = function (cx, cy, r, mood, col) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + BG + '" stroke="' + col + '" stroke-width="1.4"/><circle cx="' + (cx - r / 3) + '" cy="' + (cy - r / 4) + '" r="1.4" fill="' + col + '"/><circle cx="' + (cx + r / 3) + '" cy="' + (cy - r / 4) + '" r="1.4" fill="' + col + '"/>' +
      '<path d="M' + (cx - r / 2.5) + ' ' + (cy + r / 3) + ' Q' + cx + ' ' + (cy + r / 3 + mood * r / 2.5) + ' ' + (cx + r / 2.5) + ' ' + (cy + r / 3) + '" fill="none" stroke="' + col + '" stroke-width="1.4"/>';
  };
  var cap = function (t) { return tx(160, 192, t, { s: 7, f: F }); };

  var PT = {
    'agentic-codesign': function () {
      var s = '<svg ' + PV + '>' + win(14, 22, 196, 128, 'CAD · bracket.prt');
      s += '<g class="spin" style="transform-origin:74px 92px"><circle cx="74" cy="92" r="26" fill="none" stroke="' + S + '" stroke-width="8" stroke-dasharray="6 5.1"/><circle cx="74" cy="92" r="14" fill="' + BG + '" stroke="' + L + '"/><circle cx="74" cy="92" r="4" fill="' + S + '"/></g>';
      s += '<rect x="124" y="60" width="72" height="58" rx="5" fill="none" stroke="' + A + '" stroke-dasharray="4 3"/><circle cx="138" cy="74" r="4" fill="none" stroke="' + A + '"/><circle cx="182" cy="74" r="4" fill="none" stroke="' + A + '"/><circle cx="138" cy="104" r="4" fill="none" stroke="' + A + '"/><circle cx="182" cy="104" r="4" fill="none" stroke="' + A + '"/>';
      s += '<path d="M124 128 H196 M124 124 V132 M196 124 V132" stroke="' + F + '"/>' + tx(160, 140, '42 mm', { s: 6.5 });
      s += '<path d="M0 0 L0 12 L4 9 L7 15 L9 14 L6 8 L11 8Z" fill="' + P + '" stroke="' + BG + '" stroke-width=".6"><animateMotion dur="6s" repeatCount="indefinite" path="M150 50 L 100 96 L 176 112 L 138 74 L 150 50"/></path>';
      s += win(218, 22, 88, 62, 'agent') + bars(226, 42, [52, 38, 60, 30], 9, A) + '<rect class="blink" x="226" y="76" width="6" height="3" fill="' + A + '"/>';
      s += '<rect x="218" y="96" width="88" height="54" rx="8" fill="none" stroke="' + P + '"/>' + tx(262, 114, 'human review', { s: 7.5, f: P }) + tx(262, 133, '✓ approved', { s: 9, f: A, x: ' class="blink"' });
      s += pill(14, 160, 46, 'plan', S) + pill(66, 160, 46, 'CAD', A) + pill(118, 160, 58, 'firmware', W) + pill(182, 160, 46, 'review', P) + '<path class="fl" d="M60 167 H66 M112 167 H118 M176 167 H182" stroke="' + F + '"/>' + cap('LLM agents operating real design software') + '</svg>';
      return s;
    },
    'deep-research-agent': function () {
      var s = '<svg ' + PV + '>';
      [[34, 'web', S], [100, 'arXiv', W], [166, 'wiki', A]].forEach(function (n, i) {
        s += '<circle cx="34" cy="' + (n[0] - 12 + 14) + '" r="17" fill="' + C2 + '" stroke="' + n[2] + '" stroke-width="1.4"/>' + tx(34, n[0] + 4, n[1], { s: 7, f: n[2] });
        s += '<path class="fl" d="M51 ' + (n[0] + 2) + ' C 84 ' + (n[0] + 2) + ' 84 100 108 100" fill="none" stroke="' + n[2] + '" stroke-width="1.3" style="animation-duration:' + (1 + i * .25) + 's"/>';
      });
      s += '<polygon points="130,82 146,91 146,109 130,118 114,109 114,91" fill="' + C2 + '" stroke="' + A + '" stroke-width="1.5"/><circle class="spin" cx="130" cy="100" r="25" fill="none" stroke="' + A + '" stroke-dasharray="3 5"/>' + tx(130, 103, 'plan', { s: 7.5, f: A });
      [[56, 40], [76, 28], [96, 46], [116, 18], [136, 34]].forEach(function (b, i) {
        s += '<rect x="176" y="' + (60 + i * 18) + '" width="50" height="8" rx="4" fill="' + BG + '"/><rect x="176" y="' + (60 + i * 18) + '" width="' + b[1] + '" height="8" rx="4" fill="' + (b[1] > 30 ? A : W) + '" opacity=".9"/>';
      });
      s += tx(201, 52, 'evidence scores', { s: 6.5 }) + '<path class="fl" d="M146 100 C 156 100 164 96 174 90" fill="none" stroke="' + A + '" stroke-width="1.3"/>';
      s += '<path class="fl" d="M200 156 C 170 176 130 176 124 126" fill="none" stroke="' + S + '" stroke-width="1.3"/>' + tx(160, 176, 'reflect: enough evidence?', { s: 6.5, f: S });
      s += '<path class="fl" d="M228 100 H 244" stroke="' + A + '" stroke-width="1.6"/><rect x="244" y="46" width="64" height="108" rx="6" fill="' + C2 + '" stroke="' + A + '"/>' + tx(276, 60, 'cited answer', { s: 6.5, f: A }) + bars(252, 70, [46, 40, 48, 34, 44, 30], 9, F);
      s += '<rect x="252" y="130" width="14" height="10" rx="3" fill="none" stroke="' + S + '"/>' + tx(259, 137.5, '[1]', { s: 5.5, f: S }) + '<rect x="270" y="130" width="14" height="10" rx="3" fill="none" stroke="' + W + '"/>' + tx(277, 137.5, '[2]', { s: 5.5, f: W }) + cap('plan → search in parallel → validate → reflect → cite') + '</svg>';
      return s;
    },
    'ai-video-generator': function () {
      var s = '<svg ' + PV + '><defs><linearGradient id="pv1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + S + '" stop-opacity=".55"/><stop offset="1" stop-color="' + A + '" stop-opacity=".25"/></linearGradient></defs>';
      s += '<rect x="14" y="18" width="190" height="102" rx="6" fill="url(#pv1)" stroke="' + L + '"/><circle class="blink" cx="168" cy="44" r="11" fill="' + W + '"/><path d="M14 120 L60 74 L96 104 L132 66 L176 106 L204 90 V120Z" fill="' + BG + '" opacity=".85"/>';
      s += '<g class="bob"><circle cx="82" cy="84" r="8" fill="' + A + '"/><path d="M72 112 Q82 90 92 112Z" fill="' + A + '"/></g><rect x="30" y="102" width="158" height="13" rx="4" fill="' + BG + '" opacity=".8"/>' + tx(109, 111, 'Once upon a time, a blue panther…', { s: 6.2, f: 'var(--text)' });
      s += '<rect x="214" y="18" width="92" height="22" rx="3" fill="' + C2 + '" stroke="' + L + '"/><path d="M222 18 l10 22 M240 18 l10 22 M258 18 l10 22 M276 18 l10 22" stroke="' + F + '" stroke-width="3"/>';
      [['story', S], ['scenes', A], ['voice', W], ['music', P]].forEach(function (p, i) { s += pill(214 + (i % 2) * 48, 50 + Math.floor(i / 2) * 20, 44, p[0], p[1]); });
      s += tx(260, 108, 'LangChain · FastAPI', { s: 6.2 });
      var tr = [['video', S], ['voice', W], ['music', P]];
      tr.forEach(function (t, i) { var y = 130 + i * 20; s += tx(14, y + 10, t[0], { a: 'start', s: 6 }) + '<rect x="40" y="' + y + '" width="266" height="14" rx="3" fill="' + C2 + '" stroke="' + L + '"/>';
        if (i === 0) [0, 1, 2, 3].forEach(function (k) { s += '<rect x="' + (43 + k * 66) + '" y="' + (y + 2) + '" width="60" height="10" rx="2" fill="' + S + '" opacity="' + (.35 + k * .15) + '"/>'; });
        if (i === 1) { var d = 'M42 ' + (y + 7); for (var x = 42; x < 304; x += 4) d += ' L' + x + ' ' + (y + 7 + Math.sin(x * 1.3) * (3 + (x % 11) / 4)); s += '<path d="' + d + '" fill="none" stroke="' + W + '"/>'; }
        if (i === 2) for (var m = 0; m < 44; m++) s += '<rect x="' + (44 + m * 6) + '" y="' + (y + 12 - (2 + (m * 7) % 10)) + '" width="3" height="' + (2 + (m * 7) % 10) + '" fill="' + P + '" opacity=".8"/>'; });
      s += '<rect class="scan" x="40" y="126" width="2" height="62" fill="' + A + '" style="animation-name:scan3;transform:none"/></svg>';
      return s;
    },
    'sight-sphere': function () {
      var s = '<svg ' + PV + '><path d="M10 152 H310" stroke="' + L + '"/>';
      s += '<circle cx="52" cy="74" r="11" fill="' + C2 + '" stroke="' + F + '" stroke-width="1.4"/><rect x="40" y="88" width="24" height="46" rx="9" fill="' + C2 + '" stroke="' + F + '" stroke-width="1.4"/><path d="M46 134 V152 M58 134 V152" stroke="' + F + '" stroke-width="3" stroke-linecap="round"/>';
      s += '<rect x="56" y="68" width="22" height="9" rx="3" fill="' + BG + '" stroke="' + A + '"/><circle cx="73" cy="72.5" r="2.4" fill="' + A + '"/><circle cx="62" cy="72.5" r="1.8" fill="' + S + '"/>';
      [0, 1, 2].forEach(function (i) { s += '<path class="blink" d="M' + (84 + i * 16) + ' ' + (60 - i * 5) + ' A' + (14 + i * 6) + ' ' + (14 + i * 6) + ' 0 0 1 ' + (84 + i * 16) + ' ' + (84 + i * 5) + '" fill="none" stroke="' + S + '" stroke-width="1.6" style="animation-delay:-' + i * .5 + 's"/>'; });
      s += '<rect x="196" y="98" width="42" height="54" rx="4" fill="' + C2 + '" stroke="' + W + '" stroke-width="1.4"/><path d="M196 112 H238" stroke="' + W + '"/><path d="M118 126 H190 M118 122 V130 M190 122 V130" stroke="' + A + '" stroke-dasharray="3 3"/>' + tx(154, 120, '2 m', { s: 8, f: A });
      s += '<rect x="86" y="14" width="150" height="34" rx="12" fill="' + C2 + '" stroke="' + A + '"/><path d="M110 48 l-6 10 l14 -10" fill="' + C2 + '" stroke="' + A + '"/>' + tx(168, 28, 'Chair ahead,', { s: 8.5, f: 'var(--text)' }) + tx(168, 40, 'two metres, move left', { s: 7.5, f: A });
      [0, 1, 2, 3].forEach(function (i) { s += '<rect class="blink" x="' + (248 + i * 6) + '" y="' + (24 - (i % 2) * 4) + '" width="3" height="' + (10 + (i % 2) * 8) + '" rx="1.5" fill="' + A + '" style="animation-delay:-' + i * .3 + 's"/>'; });
      s += '<rect x="248" y="112" width="64" height="38" rx="5" fill="' + C2 + '" stroke="' + L + '"/><rect x="256" y="120" width="18" height="12" rx="2" fill="' + BG + '" stroke="' + S + '"/><circle cx="293" cy="126" r="5" fill="none" stroke="' + A + '"/><path d="M256 142 H306" stroke="' + F + '"/>' + tx(280, 160, 'ESP32-CAM · Pi', { s: 6.2 }) + cap('assistive navigation: camera + ultrasonic + multimodal LLM → audio') + '</svg>';
      return s;
    },
    'edubot': function () {
      var s = '<svg ' + PV + '>' + win(14, 24, 92, 62, 'lecture.mp4') + '<path d="M52 44 L68 54 L52 64Z" fill="' + A + '"/><rect x="22" y="76" width="76" height="3" rx="1.5" fill="' + L + '"/><rect x="22" y="76" width="40" height="3" rx="1.5" fill="' + A + '"/>';
      [2, 1, 0].forEach(function (i) { s += '<rect x="' + (18 + i * 6) + '" y="' + (98 + i * 6) + '" width="72" height="58" rx="4" fill="' + C2 + '" stroke="' + L + '"/>'; });
      s += bars(30, 112, [48, 36, 52, 30], 9, F) + '<rect x="30" y="121" width="48" height="3" rx="1.5" fill="' + A + '"/>';
      var pts = [[132, 60], [150, 82], [172, 56], [190, 92], [144, 112], [168, 128], [196, 130], [128, 140], [210, 62], [182, 108], [156, 98], [206, 110]];
      pts.forEach(function (p, i) { var hot = i === 5 || i === 10 || i === 9; s += '<circle ' + (hot ? 'class="blink" ' : '') + 'cx="' + p[0] + '" cy="' + p[1] + '" r="' + (hot ? 5 : 3) + '" fill="' + (hot ? A : F) + '" opacity="' + (hot ? 1 : .6) + '"/>'; });
      s += '<circle class="spin" cx="170" cy="100" r="42" fill="none" stroke="' + A + '" stroke-dasharray="2 6"/>' + tx(170, 176, 'top-k chunks', { s: 6.5, f: A });
      s += '<path class="fl" d="M112 56 C 120 56 124 60 128 60 M112 124 C 124 124 130 120 140 114" fill="none" stroke="' + S + '" stroke-width="1.2"/><path class="fl" d="M214 100 H 226" stroke="' + A + '" stroke-width="1.6"/>';
      s += '<rect x="228" y="34" width="80" height="26" rx="10" fill="' + C2 + '" stroke="' + S + '"/>' + tx(268, 51, 'When is the exam?', { s: 6.6, f: 'var(--text)' });
      s += '<rect x="228" y="72" width="80" height="52" rx="10" fill="' + C2 + '" stroke="' + A + '"/>' + tx(268, 90, 'Dec 12, Hall B.', { s: 7.2, f: 'var(--text)' }) + tx(268, 102, 'See syllabus p.4', { s: 6.6, f: A }) + '<rect x="238" y="110" width="30" height="9" rx="4" fill="none" stroke="' + S + '"/>' + tx(253, 117, 'source', { s: 5.2, f: S });
      s += [0, 1, 2].map(function (i) { return '<circle class="blink" cx="' + (236 + i * 8) + '" cy="142" r="2.4" fill="' + A + '" style="animation-delay:-' + i * .3 + 's"/>'; }).join('') + cap('RAG over lecture videos and documents') + '</svg>';
      return s;
    },
    'polydub': function () {
      var s = '<svg ' + PV + '><rect x="14" y="22" width="120" height="70" rx="6" fill="' + C2 + '" stroke="' + L + '"/><circle cx="74" cy="52" r="14" fill="' + P + '"/><path d="M70 45 L84 52 L70 59Z" fill="' + BG + '"/>' + tx(74, 84, 'youtu.be/…', { s: 6.2 });
      var wave = function (x0, y0, col, amp, ph) { var d = 'M' + x0 + ' ' + y0; for (var x = 0; x <= 110; x += 3) d += ' L' + (x0 + x) + ' ' + (y0 + Math.sin(x / 5 + ph) * amp * (0.5 + Math.abs(Math.sin(x / 17)))); return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="1.6"/>'; };
      s += wave(18, 118, S, 12, 0) + tx(72, 144, 'original voice', { s: 6.5, f: S });
      s += '<path class="fl" d="M136 56 H 168" stroke="' + A + '" stroke-width="1.6"/><path class="fl" d="M72 130 C 72 150 150 150 176 150" fill="none" stroke="' + A + '" stroke-width="1.3"/>';
      [['ES', 'Hola', S], ['FR', 'Bonjour', W], ['HI', 'Namaste', A]].forEach(function (l, i) { var y = 28 + i * 34; s += '<rect x="170" y="' + y + '" width="136" height="26" rx="10" fill="' + C2 + '" stroke="' + l[2] + '"/>' + tx(186, y + 16.5, l[0], { s: 7.5, f: l[2] }) + tx(240, y + 16.5, l[1] + '!', { s: 9, f: 'var(--text)' });
        for (var k = 0; k < 5; k++) s += '<rect class="blink" x="' + (276 + k * 5) + '" y="' + (y + 13 - (3 + (k * 3 + i) % 6)) + '" width="2.4" height="' + (6 + (k * 3 + i) % 6 * 2) + '" rx="1" fill="' + l[2] + '" style="animation-delay:-' + (k * .25 + i * .2) + 's"/>'; });
      s += wave(176, 150, A, 12, 1.5) + tx(231, 176, 'dubbed voice · target language', { s: 6.5, f: A }) + '<circle cx="30" cy="150" r="0" fill="none"/>' + cap('YouTube URL → transcribe → translate → synthesize') + '</svg>';
      return s;
    },
    'face-recognition': function () {
      var s = '<svg ' + PV + '><rect x="14" y="22" width="176" height="124" rx="6" fill="' + BG + '" stroke="' + L + '"/>' + face(102, 84, 1.15, true);
      [[-14, -12], [14, -12], [0, 6], [-10, 20], [10, 20], [-24, 0], [24, 0]].forEach(function (p, i) { s += '<circle class="blink" cx="' + (102 + p[0] * 1.15) + '" cy="' + (84 + p[1] * 1.15) + '" r="1.8" fill="' + A + '" style="animation-delay:-' + i * .2 + 's"/>'; });
      s += '<path d="M64 46 v-10 h12 M128 36 h12 v10 M64 124 v10 h12 M128 134 h12 v-10" fill="none" stroke="' + A + '" stroke-width="2"/>' + pill(66, 24, 72, 'Vishnu · 98%', A);
      s += '<rect class="scan" x="14" y="22" width="176" height="2" fill="' + A + '" opacity=".7" style="animation-name:scanv"/><circle class="blink" cx="24" cy="32" r="3" fill="' + P + '"/>' + tx(34, 35, 'LIVE', { a: 'start', s: 6, f: P });
      s += win(202, 22, 106, 124, 'attendance');
      [['Vishnu', 1], ['Student 02', 1], ['Student 03', 1], ['Student 04', 0], ['Student 05', 0]].forEach(function (r, i) { var y = 44 + i * 20; s += '<rect x="210" y="' + y + '" width="90" height="15" rx="4" fill="' + BG + '" stroke="' + L + '"/>' + tx(218, y + 10.5, r[0], { a: 'start', s: 7, f: 'var(--text)' }) + (r[1] ? '<path ' + (i === 0 ? 'class="blink" ' : '') + 'd="M280 ' + (y + 8) + ' l4 4 l8 -9" fill="none" stroke="' + A + '" stroke-width="1.8"/>' : tx(288, y + 10.5, '–', { s: 8 })); });
      s += cap('face recognition attendance · Django + OpenFace') + '</svg>';
      return s;
    },
    'medintelbot': function () {
      var s = '<svg ' + PV + '>';
      [2, 1, 0].forEach(function (i) { s += '<rect x="' + (16 + i * 7) + '" y="' + (28 + i * 6) + '" width="62" height="78" rx="4" fill="' + C2 + '" stroke="' + L + '"/>'; });
      s += '<rect x="16" y="28" width="62" height="78" rx="4" fill="' + C2 + '" stroke="' + P + '"/><path d="M47 33 v22 M36 44 h22" stroke="' + P + '" stroke-width="5" stroke-linecap="round"/>' + bars(26, 64, [42, 34, 44, 28], 9, F) + '<rect class="blink" x="26" y="73" width="34" height="3" rx="1.5" fill="' + A + '"/>' + tx(47, 120, 'medical PDFs', { s: 6.5 });
      s += '<path class="fl" d="M82 70 H 116" stroke="' + A + '" stroke-width="1.6"/>';
      s += '<rect x="116" y="48" width="64" height="48" rx="8" fill="' + C2 + '" stroke="' + A + '" stroke-width="1.5"/>';
      for (var i = 0; i < 4; i++) s += '<path d="M' + (128 + i * 14) + ' 48 v-8 M' + (128 + i * 14) + ' 96 v8 M116 ' + (58 + i * 10) + ' h-8 M180 ' + (58 + i * 10) + ' h8" stroke="' + F + '"/>';
      s += tx(148, 76, 'LLM', { s: 9, f: A }) + tx(148, 88, 'local', { s: 6.5 });
      s += '<g opacity=".9"><path d="M222 38 a8 8 0 0 1 4 -14 a11 11 0 0 1 21 2 a8 8 0 0 1 1 12z" fill="none" stroke="' + F + '" stroke-width="1.5"/><path d="M216 44 L254 18" stroke="' + P + '" stroke-width="2.4"/></g>' + tx(236, 58, 'no cloud API', { s: 6.5, f: P });
      s += '<path class="fl" d="M184 72 H 214" stroke="' + A + '" stroke-width="1.6"/><rect x="214" y="68" width="94" height="52" rx="10" fill="' + C2 + '" stroke="' + A + '"/>' + tx(261, 84, 'Likely causes:', { s: 7.4, f: 'var(--text)' }) + bars(224, 92, [66, 52, 60], 8, A);
      s += '<path class="ecg" d="M10 160 H70 L78 140 L88 176 L98 150 L104 160 H170 L178 142 L188 178 L198 152 L204 160 H310" fill="none" stroke="' + P + '" stroke-width="1.8" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>' + cap('local RAG medical assistant · private by design') + '</svg>';
      return s;
    },
    'embedding-finetune': function () {
      var s = '<svg ' + PV + '><path d="M30 24 V150 H300" stroke="' + L + '" fill="none"/>' + tx(165, 164, 'embedding space  ·  before ⇄ after fine-tuning', { s: 7 });
      var cl = [[90, 90, S], [170, 66, W], [236, 112, A]];
      var seeds = [[-14, -8], [8, -14], [14, 6], [-6, 14], [-18, 8], [4, 2], [18, -10]];
      var jit = [[60, 40], [-70, 30], [40, -60], [-50, -50], [90, 20], [-30, 60], [70, -30]];
      cl.forEach(function (c, ci) {
        s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="30" fill="' + c[2] + '" opacity=".08"/>';
        seeds.forEach(function (d, i) { var j = jit[(i + ci * 2) % 7]; s += '<circle class="settle" cx="' + (c[0] + d[0]) + '" cy="' + (c[1] + d[1]) + '" r="4.2" fill="' + c[2] + '" style="--x:' + j[0] + 'px;--y:' + j[1] + 'px"/>'; });
      });
      s += '<g class="bob"><path d="M160 112 l3 7 l7 .6 l-5.4 4.6 l1.8 7 l-6.4 -4 l-6.4 4 l1.8 -7 l-5.4 -4.6 l7 -.6z" fill="' + P + '"/></g>' + tx(160, 150, 'query', { s: 6.5, f: P }) + tx(90, 40, 'cardiology', { s: 6.8, f: S }) + tx(170, 30, 'oncology', { s: 6.8, f: W }) + tx(236, 70, 'radiology', { s: 6.8, f: A }) + '</svg>';
      return s;
    },
    'knowledge-graph': function () {
      var s = '<svg ' + PV + '>' + win(10, 24, 82, 64) + bars(18, 44, [56, 62, 48, 58, 40], 9, F) + '<path class="fl" d="M96 56 H 124" stroke="' + A + '" stroke-width="1.6"/>';
      var N = [[216, 100, 15, A, 'LLM'], [160, 52, 9, S, ''], [270, 52, 9, W, ''], [286, 124, 9, P, ''], [236, 160, 9, S, ''], [166, 142, 9, W, ''], [140, 98, 9, P, ''], [200, 44, 6, F, ''], [258, 150, 6, F, '']];
      var E = [[0, 1, 'causes'], [0, 2, 'treats'], [0, 3, 'part of'], [0, 4, 'uses'], [0, 5, 'linked'], [0, 6, 'is a'], [1, 7, ''], [3, 8, '']];
      E.forEach(function (e, i) { var a = N[e[0]], b = N[e[1]]; s += '<path class="fl" d="M' + a[0] + ' ' + a[1] + ' L' + b[0] + ' ' + b[1] + '" stroke="' + F + '" stroke-width="1" style="animation-duration:' + (1.2 + i * .15) + 's"/>'; if (e[2]) s += tx((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 3, e[2], { s: 5.8 }); });
      N.forEach(function (n, i) { s += '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="' + n[2] + '" fill="' + C2 + '" stroke="' + n[3] + '" stroke-width="1.6"' + (i === 0 ? ' class="blink"' : '') + '/>' + (n[4] ? tx(n[0], n[1] + 3, n[4], { s: 7, f: n[3] }) : ''); });
      s += cap('unstructured text → entities + relations → interactive graph') + '</svg>';
      return s;
    },
    'medextract': function () {
      var W5 = 5.2;
      var s = '<svg ' + PV + '>' + win(10, 26, 300, 112, 'spaCy · custom NER');
      s += '<text x="22" y="82" font-family="Archivo, system-ui, sans-serif" font-size="8.6" fill="var(--text)" textLength="' + (31 * W5) + '" lengthAdjust="spacing">Patient with type 2 diabetes was</text>';
      s += '<text x="22" y="112" font-family="Archivo, system-ui, sans-serif" font-size="8.6" fill="var(--text)" textLength="' + (34 * W5) + '" lengthAdjust="spacing">prescribed metformin 500 mg daily.</text>';
      var hl = function (x, y, w, lab, col, d) { return '<rect class="blink" x="' + x + '" y="' + (y - 9) + '" width="' + w + '" height="13" rx="3" fill="' + col + '" opacity=".25" style="animation-delay:-' + d + 's"/><path d="M' + x + ' ' + (y + 5) + ' H' + (x + w) + '" stroke="' + col + '" stroke-width="1.6"/>' + tx(x + w / 2, y - 14, lab, { s: 6.2, f: col }); };
      s += hl(22 + 13 * W5, 82, 15 * W5, 'DISEASE', P, 0) + hl(22 + 11 * W5, 112, 9 * W5, 'DRUG', A, .6) + hl(22 + 21 * W5, 112, 6 * W5, 'DOSE', W, 1.2);
      s += pill(14, 152, 60, 'tokenize', S) + pill(80, 152, 60, 'embed', A) + pill(146, 152, 60, 'tag spans', W) + pill(212, 152, 98, 'train on clinical text', P) + cap('training a medical NER model') + '</svg>';
      return s;
    },
    'docuchat': function () {
      var s = '<svg ' + PV + '><rect x="16" y="20" width="118" height="146" rx="5" fill="' + C2 + '" stroke="' + L + '"/>' + tx(75, 34, 'report.pdf', { s: 6.5 });
      for (var i = 0; i < 10; i++) s += '<rect x="26" y="' + (44 + i * 11) + '" width="' + (80 + (i * 17) % 24) + '" height="3.4" rx="1.7" fill="' + F + '" opacity=".7"/>';
      s += '<rect class="scan" x="22" y="42" width="106" height="14" rx="3" fill="' + A + '" opacity=".28" style="animation-name:scanv2"/><path class="fl" d="M136 90 H 166" stroke="' + A + '" stroke-width="1.6"/>';
      s += '<circle cx="190" cy="90" r="22" fill="' + C2 + '" stroke="' + S + '"/>';
      [[180, 82], [196, 80], [186, 96], [200, 98], [190, 88]].forEach(function (p, i) { s += '<circle class="blink" cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="' + (i == 4 ? A : S) + '" style="animation-delay:-' + i * .3 + 's"/>'; });
      s += tx(190, 128, 'vector search', { s: 6.5, f: S }) + '<path class="fl" d="M214 90 H 232" stroke="' + A + '" stroke-width="1.6"/>';
      s += win(232, 22, 78, 140, 'chat') + '<rect x="250" y="42" width="52" height="20" rx="8" fill="' + BG + '" stroke="' + S + '"/>' + tx(276, 55, 'Summarize p.3', { s: 5.6 }) + '<rect x="240" y="70" width="60" height="44" rx="8" fill="' + BG + '" stroke="' + A + '"/>' + bars(247, 80, [44, 36, 42, 26], 8, A);
      s += [0, 1, 2].map(function (i) { return '<circle class="blink" cx="' + (248 + i * 8) + '" cy="132" r="2.4" fill="' + A + '" style="animation-delay:-' + i * .3 + 's"/>'; }).join('') + cap('chat with your PDF · open-source LLM + vector search') + '</svg>';
      return s;
    },
    'indian-food-classification-showcase': function () {
      var s = '<svg ' + PV + '><circle cx="92" cy="96" r="62" fill="' + C2 + '" stroke="' + L + '" stroke-width="1.6"/><circle cx="92" cy="96" r="50" fill="none" stroke="' + L + '"/>';
      s += '<ellipse cx="76" cy="100" rx="26" ry="20" fill="#f3e3b0"/><g fill="#d9a441">' + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return '<circle cx="' + (62 + (i * 13) % 30) + '" cy="' + (92 + (i * 7) % 20) + '" r="2.4"/>'; }).join('') + '</g><circle cx="118" cy="82" r="16" fill="#c4521b"/><circle cx="118" cy="82" r="11" fill="#e07a2d"/>';
      for (var i = 1; i < 4; i++) s += '<path d="M' + (30 + i * 31) + ' 34 V158 M30 ' + (34 + i * 31) + ' H154" stroke="' + A + '" stroke-width=".7" opacity=".55"/>';
      s += '<rect class="blink" x="61" y="65" width="31" height="31" fill="' + A + '" opacity=".25"/><rect class="blink" x="92" y="96" width="31" height="31" fill="' + A + '" opacity=".25" style="animation-delay:-1s"/><path class="fl" d="M156 96 H 176" stroke="' + A + '" stroke-width="1.6"/>';
      s += '<rect x="176" y="40" width="134" height="112" rx="8" fill="' + C2 + '" stroke="' + A + '"/>' + tx(243, 56, 'Vision Transformer · top-3', { s: 6.8 });
      [['Fried rice', 94, A], ['Biryani', 4, S], ['Pulao', 2, W]].forEach(function (r, i) { var y = 70 + i * 26; s += tx(184, y + 4, r[0], { a: 'start', s: 7.5, f: 'var(--text)' }) + '<rect x="184" y="' + (y + 8) + '" width="118" height="6" rx="3" fill="' + BG + '"/><rect x="184" y="' + (y + 8) + '" width="' + (r[1] * 1.18) + '" height="6" rx="3" fill="' + r[2] + '"/>' + tx(302, y + 4, r[1] + '%', { a: 'end', s: 7.5, f: r[2] }); });
      s += cap('fine-tuned ViT · 94% on Indian food images') + '</svg>';
      return s;
    },
    'face-mask-detector-showcase': function () {
      var s = '<svg ' + PV + '><rect x="10" y="20" width="300" height="144" rx="6" fill="' + BG + '" stroke="' + L + '"/>' + face(86, 90, 1.1, false);
      s += '<path d="M64 98 Q86 90 108 98 L106 116 Q86 126 66 116Z" fill="' + S + '" opacity=".9"/><path d="M64 100 H52 M108 100 H120" stroke="' + S + '"/>';
      s += '<rect class="blink" x="52" y="48" width="68" height="84" fill="none" stroke="' + A + '" stroke-width="2"/>' + pill(52, 32, 68, 'mask 0.98', A);
      s += face(224, 90, 1.1, true) + '<rect class="blink" x="190" y="48" width="68" height="84" fill="none" stroke="' + P + '" stroke-width="2" style="animation-delay:-.7s"/>' + pill(184, 32, 80, 'no mask 0.91', P);
      s += '<rect class="scan" x="10" y="20" width="2" height="144" fill="' + A + '" style="animation-name:scan5"/><circle class="blink" cx="26" cy="32" r="3" fill="' + P + '"/>' + tx(36, 35, 'REC', { a: 'start', s: 6, f: P }) + tx(302, 156, 'OpenCV · TF', { a: 'end', s: 6 }) + cap('real-time face-mask detection from a webcam stream') + '</svg>';
      return s;
    },
    'sentiment-analysis-showcase': function () {
      var s = '<svg ' + PV + '>';
      [[18, 'love this phone!', A, 1], [58, 'it is okay i guess', W, 0], [98, 'worst service ever', P, -1]].forEach(function (t, i) {
        s += '<rect x="' + (14 + (i % 2) * 8) + '" y="' + t[0] + '" width="130" height="34" rx="9" fill="' + C2 + '" stroke="' + t[2] + '"/>' + smiley(34 + (i % 2) * 8, t[0] + 17, 9, t[3], t[2]) + tx(52 + (i % 2) * 8, t[0] + 20, t[1], { a: 'start', s: 7.4, f: 'var(--text)' });
      });
      s += '<defs><linearGradient id="pg1" x1="0" x2="1"><stop offset="0" stop-color="' + P + '"/><stop offset=".5" stop-color="' + W + '"/><stop offset="1" stop-color="' + A + '"/></linearGradient></defs>';
      s += '<path d="M180 128 A56 56 0 0 1 292 128" fill="none" stroke="url(#pg1)" stroke-width="10" stroke-linecap="round"/><g class="needle"><path d="M236 128 L236 82" stroke="var(--text)" stroke-width="2.4" stroke-linecap="round"/><circle cx="236" cy="128" r="5" fill="var(--text)"/></g>';
      s += tx(176, 144, 'negative', { s: 6.5, f: P, a: 'start' }) + tx(296, 144, 'positive', { s: 6.5, f: A, a: 'end' }) + tx(236, 160, 'sentiment', { s: 7 });
      s += tx(236, 36, 'NLP + ML classifier', { s: 7, f: S }) + '<path class="fl" d="M146 76 C 164 76 168 60 180 56" fill="none" stroke="' + A + '" stroke-width="1.3"/>' + cap('classifying tweets as positive, neutral or negative') + '</svg>';
      return s;
    },
    'textreaderaudiobook': function () {
      var s = '<svg ' + PV + '><path d="M20 40 Q80 28 140 44 V150 Q80 134 20 148Z" fill="' + C2 + '" stroke="' + L + '"/><path d="M140 44 Q200 28 260 40 V148 Q200 134 140 150Z" fill="' + C2 + '" stroke="' + L + '"/>';
      for (var i = 0; i < 7; i++) s += '<rect x="34" y="' + (58 + i * 12) + '" width="' + (84 - (i % 3) * 10) + '" height="3.4" rx="1.7" fill="' + F + '" opacity=".7"/><rect x="156" y="' + (58 + i * 12) + '" width="' + (84 - (i % 2) * 14) + '" height="3.4" rx="1.7" fill="' + F + '" opacity=".7"/>';
      s += '<rect class="scan" x="30" y="55" width="92" height="9" rx="3" fill="' + A + '" opacity=".35" style="animation-name:scanv3"/>';
      s += '<path d="M276 90 a26 26 0 0 1 36 0" fill="none" stroke="' + S + '" stroke-width="5" stroke-linecap="round" transform="translate(-26 -8)"/><rect x="250" y="82" width="10" height="20" rx="5" fill="' + S + '"/><rect x="288" y="82" width="10" height="20" rx="5" fill="' + S + '"/>';
      [0, 1, 2].forEach(function (i) { s += '<path class="blink" d="M' + (270 + i * 6) + ' ' + (118 + i * 3) + ' q8 -8 0 -16" fill="none" stroke="' + A + '" stroke-width="1.6" style="animation-delay:-' + i * .4 + 's" transform="translate(' + (4 + i * 4) + ' 18)"/>'; });
      s += tx(274, 160, 'text → speech', { s: 6.8, f: A }) + cap('Python app that reads any text aloud and builds audiobooks') + '</svg>';
      return s;
    },
    'virtualmouse': function () {
      var s = '<svg ' + PV + '>' + win(176, 24, 134, 92, 'screen') + '<rect x="186" y="44" width="42" height="26" rx="3" fill="' + BG + '" stroke="' + L + '"/><rect x="236" y="44" width="64" height="8" rx="3" fill="' + BG + '" stroke="' + L + '"/><rect x="236" y="60" width="50" height="8" rx="3" fill="' + BG + '" stroke="' + L + '"/><rect x="186" y="82" width="114" height="24" rx="3" fill="' + BG + '" stroke="' + L + '"/>';
      s += '<path d="M0 0 L0 13 L4 10 L7 16 L10 15 L7 9 L12 9Z" fill="' + A + '" stroke="' + BG + '" stroke-width=".7"><animateMotion dur="5s" repeatCount="indefinite" path="M200 56 L 250 56 L 262 88 L 214 94 L 200 56"/></path>';
      s += '<circle class="blink" cx="250" cy="56" r="8" fill="none" stroke="' + A + '"/>';
      var P5 = { palm: [[70, 150], [58, 126], [72, 112], [88, 108], [100, 116], [102, 136], [96, 152]], idx: [[72, 112], [74, 90], [76, 70], [78, 54]], mid: [[88, 108], [92, 84], [94, 62]], rng: [[100, 116], [106, 96], [108, 78]], pnk: [[102, 136], [114, 120], [120, 106]], thm: [[58, 126], [44, 112], [38, 96]] };
      s += '<path d="' + P5.palm.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' ') + 'Z" fill="' + C2 + '" stroke="' + F + '"/>';
      Object.keys(P5).forEach(function (k) { if (k === 'palm') return; var pts = P5[k]; s += '<polyline points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="none" stroke="' + S + '" stroke-width="1.6"/>'; pts.forEach(function (p, i) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === pts.length - 1 ? 3.2 : 2) + '" fill="' + (k === 'idx' && i === 3 ? A : S) + '"' + (k === 'idx' && i === 3 ? ' class="blink"' : '') + '/>'; }); });
      s += '<path class="fl" d="M80 54 C 120 30 160 40 196 54" fill="none" stroke="' + A + '" stroke-width="1.4"/>' + tx(120, 28, 'fingertip → cursor', { s: 6.6, f: A }) + tx(70, 168, 'hand landmarks', { s: 6.6, f: S }) + cap('control the cursor with hand gestures · OpenCV + MediaPipe') + '</svg>';
      return s;
    }
  };

  // extra keyframes for thumbs that scan at different widths
  (function () {
    var st = document.createElement('style');
    st.textContent = '@keyframes scan2{0%,100%{transform:translateX(0)}50%{transform:translateX(76px)}}@keyframes scan3{0%,100%{transform:translateX(0)}50%{transform:translateX(284px)}}';
    document.head.appendChild(st);
  })();

  /* ------------------------------------------------------- research map
     The research drawn as a transit network (data.json → map): themes are lines,
     papers and projects are stations, and the station marker is the publication status. */
  var STATUS_TEXT = { accepted: 'Accepted', review: 'Under review', planned: 'Planned', ongoing: 'Ongoing', project: 'Project' };
  function lineVar(k) { return 'var(--l-' + k.toLowerCase() + ')'; }
  function bulletHTML(k, cls) { return '<i class="' + (cls || 'lnb') + ' k-' + k.toLowerCase() + '" style="--lc:' + lineVar(k) + '">' + k + '</i>'; }

  /* turn a station's ref ("research:id", "published:0", "project:id") into what the page shows */
  function resolveStation(st) {
    var kind = st.ref.split(':')[0], key = st.ref.slice(kind.length + 1), o;
    if (kind === 'research') {
      var it = D.research.items.filter(function (x) { return x.id === key; })[0]; if (!it) return null;
      o = { status: it.status, statusText: it.statusLabel, title: it.title, desc: it.desc, href: '#r-' + it.id, go: 'See the research', art: THUMBS[it.thumb] };
    } else if (kind === 'published') {
      var p = D.research.published[+key]; if (!p) return null;
      o = { status: 'accepted', statusText: 'Accepted · ' + (p.venue.match(/\(([^)]+)\)/) || [0, p.venue])[1] + ' ' + p.year, title: p.title, desc: p.venue + ', ' + p.year + '.', href: '#pub-' + key, go: 'See the paper', art: null, badge: (p.venue.match(/\(([^)]+)\)/) || [0, 'Paper'])[1] + ' ' + p.year };
    } else {
      var pr = D.projects.items.filter(function (x) { return x.id === key; })[0]; if (!pr) return null;
      o = { status: 'project', statusText: 'Project · ' + pr.tagLabel, title: splitTitle(pr.title).name, desc: clean(pr.desc.replace(/^[^\w<]+/u, '')), href: 'project.html?id=' + encodeURIComponent(pr.id), go: 'Read the write-up', art: PT[pr.id] };
    }
    o.lines = st.lines; o.ref = st.ref; o.label = st.label;
    return o;
  }

  function markerSVG(x, y, status, interchange) {
    if (interchange) return '<rect class="mk xchg" x="' + (x - 17) + '" y="' + (y - 11) + '" width="34" height="22" rx="11"/>';
    if (status === 'project') return '<rect class="mk" x="' + (x - 9.5) + '" y="' + (y - 9.5) + '" width="19" height="19" rx="5"/>';
    return '<circle class="mk ' + status + '" cx="' + x + '" cy="' + y + '" r="10"/>' + (status === 'ongoing' ? '<circle class="mk-in" cx="' + x + '" cy="' + y + '" r="3.6"/>' : '');
  }

  function mapSVG(M, info) {
    var s = '<svg class="tmap" viewBox="0 26 760 362" role="group" aria-label="Research map. Lines are research themes; stations are papers and projects.">';
    M.lines.forEach(function (l, i) {
      s += '<polyline class="route" pathLength="1" style="--d:' + i + '" stroke="' + lineVar(l.key) + '" points="' + l.points.map(function (p) { return p.join(','); }).join(' ') + '"/>';
    });
    M.lines.forEach(function (l, i) {
      var e = l.points[l.points.length - 1], q = l.points[l.points.length - 2];
      var atStation = M.stations.some(function (st) { return Math.abs(st.x - e[0]) < 3 && Math.abs(st.y - e[1]) < 3; });
      if (atStation) return;
      var horiz = Math.abs(e[1] - q[1]) < Math.abs(e[0] - q[0]);
      s += '<line class="term" style="--d:' + i + '" stroke="' + lineVar(l.key) + '" x1="' + (horiz ? e[0] : e[0] - 13) + '" y1="' + (horiz ? e[1] - 13 : e[1]) + '" x2="' + (horiz ? e[0] : e[0] + 13) + '" y2="' + (horiz ? e[1] + 13 : e[1]) + '"/>';
    });
    M.lines.forEach(function (l) {
      var p = l.points[0];
      s += '<g class="bullet k-' + l.key.toLowerCase() + '" aria-hidden="true"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="' + lineVar(l.key) + '"/><text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle">' + l.key + '</text></g>';
    });
    M.stations.forEach(function (st, i) {
      var o = info[i]; if (!o) return;
      var x = st.x, y = st.y, lx = x, ly = y, anchor = 'middle';
      if (st.place === 'above') ly = y - 22; else if (st.place === 'below') ly = y + 32; else { lx = x + (st.lines.length > 1 ? 28 : 22); ly = y + 5; anchor = 'start'; }
      s += '<a class="st" href="' + o.href + '" data-i="' + i + '" aria-label="' + esc(o.title).replace(/"/g, '&quot;') + ', ' + STATUS_TEXT[o.status] + '">' +
        '<circle class="hit" cx="' + x + '" cy="' + y + '" r="20"/>' + markerSVG(x, y, o.status, st.lines.length > 1) +
        '<text class="st-l" x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '">' + esc(st.label) + '</text></a>';
    });
    return s + '</svg>';
  }

  /* phone: the same network as a vertical list per line */
  function mapList(M, info) {
    return '<div class="map-list">' + M.lines.map(function (l) {
      /* an interchange is listed in full on its first line; later lines name it in one row */
      var rows = M.stations.map(function (st, i) { return st.lines[0] === l.key && info[i] ? { st: st, o: info[i] } : null; }).filter(Boolean);
      var xs = M.stations.filter(function (st) { return st.lines.indexOf(l.key) > 0; });
      return '<div class="ml-line" style="--lc:' + lineVar(l.key) + '"><h2>' + bulletHTML(l.key) + l.name + '</h2><ol>' + rows.map(function (r) {
        return '<li><a href="' + r.o.href + '"><span class="mks ' + r.o.status + (r.st.lines.length > 1 ? ' xchg' : '') + '"></span><span class="ml-t">' + esc(r.st.label) + '<small>' + r.o.statusText + (r.st.lines.length > 1 ? ' · also on ' + r.st.lines.filter(function (k) { return k !== l.key; }).map(function (k) { return M.lines.filter(function (x) { return x.key === k; })[0].name; }).join(', ') : '') + '</small></span></a></li>';
      }).join('') + (xs.length ? '<li class="ml-x">Also serves ' + xs.map(function (st) { return esc(st.label); }).join(' and ') + ' (interchanges, listed above)</li>' : '') + '</ol></div>';
    }).join('') + '</div>';
  }

  function mapLegend(M, info) {
    var n = {}; info.forEach(function (o) { if (o) n[o.status] = (n[o.status] || 0) + 1; });
    var mk = function (st) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + markerSVG(12, 12, st, false) + '</svg>'; };
    return '<ul class="legend" aria-label="Map key">' +
      M.lines.map(function (l) { return '<li>' + bulletHTML(l.key, 'lg-b') + l.name + '</li>'; }).join('') +
      '<li class="lg-break" aria-hidden="true"></li>' +
      ['accepted', 'review', 'planned', 'ongoing', 'project'].filter(function (k) { return n[k]; }).map(function (k) {
        return '<li>' + mk(k) + STATUS_TEXT[k] + (k === 'project' ? 's' : '') + ' <b>' + n[k] + '</b></li>';
      }).join('') + (M.stations.some(function (s) { return s.lines.length > 1; }) ? '<li><svg viewBox="0 0 36 24" class="lg-x" aria-hidden="true"><rect class="mk xchg" x="1" y="1" width="34" height="22" rx="11"/></svg>Interchange</li>' : '') + '</ul>';
  }

  function panelHTML(o) {
    var art = o.art ? '<div class="mp-art">' + o.art() + '</div>' : '<div class="mp-art txt"><span>' + esc(o.badge || '') + '</span></div>';
    return art + '<div class="mp-body"><b>' + o.title + '</b><div class="mp-status">' + o.lines.map(function (k) { return bulletHTML(k); }).join('') + '<span>' + o.statusText + '</span></div>' +
      '<a class="mp-go" href="' + o.href + '">' + o.go + arr() + '</a></div>';
  }

  function wireMap(info, start) {
    var panel = $('#map-panel'); if (!panel) return;
    var cur = -1;
    function show(i) {
      if (i === cur || !info[i]) return; cur = i;
      panel.innerHTML = panelHTML(info[i]);
      $$('.tmap .st').forEach(function (a) { a.classList.toggle('on', +a.getAttribute('data-i') === i); });
    }
    $$('.tmap .st').forEach(function (a) {
      var i = +a.getAttribute('data-i');
      a.addEventListener('mouseenter', function () { show(i); });
      a.addEventListener('focus', function () { show(i); });
    });
    show(start);
  }

  function band(title, keys) {
    return '<div class="band rv"><h2>' + title + '</h2>' + (keys ? '<span class="bullets" aria-hidden="true">' + keys.map(function (k) { return bulletHTML(k, 'bb'); }).join('') + '</span>' : '') + '</div>';
  }

  /* ------------------------------------------------------------- home */
  function renderHome() {
    var h = D.hero, docs = D.site.docs, M = D.map, r = D.research;
    var info = M.stations.map(resolveStation);
    var start = Math.max(0, M.stations.map(function (s) { return s.ref; }).indexOf('research:vlm-lora'));
    var acc = r.published[0];
    var hero =
      '<header class="hero" id="top"><div class="wrap hero-grid">' +
      '<div class="hero-copy">' +
      '<img class="avatar" src="assets/vishnu.jpg" alt="Portrait of Vishnu Vardhan Addanki Tirumala" width="80" height="80">' +
      '<h1>Vishnu Vardhan<br>Addanki Tirumala</h1>' +
      '<p class="affil">' + h.eyebrow + '</p>' +
      '<p class="sub">' + h.sub + '</p>' +
      (acc ? '<a class="acc-row" href="#pub-0"><i class="mk-dot" aria-hidden="true"></i><span><b>' + acc.status + ' · ISTM ' + acc.year + '</b>' + acc.title + '</span></a>' : '') +
      '<div class="cta"><a class="btn primary" href="mailto:' + D.contact.email + '?subject=Hello%20Vishnu">Email me</a>' +
      '<a class="btn" href="' + docs.cv + '">' + svgInline('doc') + 'CV</a></div></div>' +
      '<div class="hero-map">' + mapSVG(M, info) + mapList(M, info) +
      '<div class="map-panel" id="map-panel" aria-live="polite"></div>' + mapLegend(M, info) + '</div>' +
      '</div></header>';

    /* line each research thread runs on, for its card bullet */
    var lineOf = {};
    M.stations.forEach(function (s) { if (s.ref.indexOf('research:') === 0) lineOf[s.ref.slice(9)] = s.lines[0]; });
    var cards = r.items.map(function (it) {
      return '<article class="r-card rv" id="r-' + it.id + '">' +
        '<div class="r-thumb">' + THUMBS[it.thumb]() + '</div>' +
        '<div class="r-body"><h3>' + it.title + '</h3><div class="r-top">' + (lineOf[it.id] ? bulletHTML(lineOf[it.id]) : '') + '<span class="badge ' + it.status + '"><i></i>' + it.statusLabel + '</span><span class="r-kind">' + it.kind + '</span></div>' +
        '<p>' + it.desc + '</p>' + (it.statusLabel.indexOf(it.venue) < 0 ? '<div class="r-venue">' + it.venue + '</div>' : '') +
        '<div class="tags">' + it.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div></div></article>';
    }).join('');
    var pubs = r.published.map(function (p, i) {
      return '<div class="pub rv" id="pub-' + i + '"><span class="ok"><i class="mk-dot" aria-hidden="true"></i>' + p.status + '</span><b>' + p.title + '</b><span>' + p.venue + ' · ' + p.year + '</span></div>';
    }).join('');

    var about = '<section id="about"><div class="wrap about-grid"><div class="rv">' +
      D.about.paragraphs.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div></div></section>';

    var research = '<section id="research"><div class="wrap">' +
      band('What I\'m working on', ['M', 'I', 'E', 'A']) + '<p class="lede rv">' + r.intro + '</p>' +
      pubs + '<div class="r-grid">' + cards + '</div>' +
      '<p class="rv" style="margin-top:22px"><a class="btn" href="' + r.orcidUrl + '" target="_blank" rel="noopener">' + svgIcon('orcid').replace('<svg', '<svg fill="currentColor"') + 'ORCID profile</a></p></div></section>';

    var exp = '<section id="experience"><div class="wrap">' + band('Where I\'ve worked', null) + '<p class="lede rv">Research now, two years of production ML before it. Each role shaped how I ask research questions.</p><div class="tl">' +
      D.experience.items.map(tlItem).join('') + '</div></div></section>';

    /* four flagships get full cards; the rest stay one click away as compact rows */
    var flag = D.projects.flagshipIds, byId = {};
    D.projects.items.forEach(function (p) { byId[p.id] = p; });
    var flagItems = flag.map(function (id) { return byId[id]; }).filter(Boolean);
    var restItems = D.projects.items.filter(function (p) { return flag.indexOf(p.id) < 0; });
    var projects = '<section id="projects"><div class="wrap">' + band('Things I\'ve built', ['S']) + '<p class="lede rv">Agents, RAG systems and assistive hardware. Click a card for the full write-up.</p>' +
      '<div class="p-grid" id="pgrid">' + flagItems.map(projectCard).join('') + '</div>' +
      '<details class="more-p rv"><summary>' + restItems.length + ' more projects</summary><div class="p-rows">' + restItems.map(projectRow).join('') + '</div></details></div></section>';

    var skills = '<section id="skills"><div class="wrap">' + band('Toolbox', null) + '<div class="sk-grid" style="margin-top:34px">' +
      D.skills.groups.map(function (g) { return '<div class="sk rv"><h3>' + g.category + '</h3><div class="chips">' + g.items.map(function (i) { return '<span class="chip">' + i + '</span>'; }).join('') + '</div></div>'; }).join('') + '</div></div></section>';

    var cr = D.credentials;
    var nCerts = cr.certifications.reduce(function (n, c) { return n + c.items.length; }, 0);
    var cred = '<section id="credentials"><div class="wrap">' + band('The paper trail', null) + '' +
      '<div class="two" style="margin-top:40px"><div class="rv"><div class="sub-h">Education</div><div class="tl">' + cr.education.map(tlItem).join('') + '</div></div>' +
      '<div class="rv"><div class="sub-h">Honours &amp; awards</div><div class="cards">' + cr.awards.map(function (a) { return '<div class="mini"><b>' + clean(a.title) + '</b><p>' + a.desc + '</p></div>'; }).join('') + '</div></div></div>' +
      /* secondary credentials stay on the page but fold away so Contact comes sooner */
      '<details class="beyond rv"><summary>Events, volunteering, languages &amp; ' + nCerts + ' certificates</summary><div class="beyond-body">' +
      '<div class="two"><div><div class="sub-h">Events &amp; hackathons</div><div class="cards">' + cr.events.map(function (a) { return '<div class="mini"><b>' + clean(a.title) + '</b><small>' + clean(a.meta) + '</small><p>' + a.desc + '</p></div>'; }).join('') + '</div></div>' +
      '<div><div class="sub-h">Volunteering</div><div class="cards">' + cr.volunteering.map(function (a) { return '<div class="mini"><b>' + clean(a.role) + '</b><small>' + clean(a.date) + '</small><p>' + clean(a.org) + ' — ' + clean(a.bullets[0]) + '</p></div>'; }).join('') + '</div>' +
      '<div class="sub-h" style="margin-top:34px">Languages</div>' +
      '<div class="lang"><small>Mother tongue</small>' + D.languages.mother.map(function (l) { return '<span class="chip">' + l + '</span>'; }).join('') + '</div>' +
      '<div class="lang"><small>Other</small>' + D.languages.other.map(function (l) { return '<span class="chip">' + l + '</span>'; }).join('') + '</div></div></div>' +
      '<div class="sub-h" style="margin-top:44px">Certifications</div>' +
      cr.certifications.map(function (c) {
        return '<details class="cert">' + '<summary>' + logo(c.logo) + c.issuer + ' <em>' + c.items.length + '</em></summary><ul>' +
          c.items.map(function (i) { return '<li>' + clean(i.title) + '<span>' + i.meta + '</span></li>'; }).join('') + '</ul></details>';
      }).join('') + '</div></details></div></section>';

    var c = D.contact;
    var contact = '<section id="contact"><div class="wrap"><div class="contact rv"><span class="routes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><h2>' + c.heading + '</h2><p>' + c.text + '</p>' +
      '<div class="cta"><a class="btn primary" href="mailto:' + c.email + '?subject=Hello%20Vishnu">Email me' + arr() + '</a><a class="btn" href="' + docs.cv + '">CV</a><a class="btn" href="' + docs.resume + '" target="_blank" rel="noopener">Resume (PDF)</a></div>' +
      '<div class="soc">' + c.links.filter(function (l) { return l.label !== 'Email'; }).map(function (l) {
        return '<a href="' + l.href + '" target="_blank" rel="noopener">' + svgIcon(l.label.toLowerCase()) + l.label + '</a>';
      }).join('') + '</div></div></div></section>';

    $('#app').innerHTML = hero + research + about + exp + projects + skills + cred + contact;
    wireHoverVideo();
    wireMap(info, start);
  }

  /* drawn arrow in the same stroke as the doc icon */
  function arr(d) { return '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + (d === 'l' ? '<path d="M19 12H5M11 6l-6 6 6 6"/>' : '<path d="M5 12h14M13 6l6 6-6 6"/>') + '</svg>'; }
  function svgInline(k) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>'; }

  function tlItem(it) {
    return '<div class="tl-item"><div class="tl-role">' + clean(it.role) + '</div><div class="tl-org">' + logo(it.logo) + '<span>' + clean(it.org) + '</span></div><div class="tl-date">' + clean(it.date) + '</div>' +
      (it.bullets && it.bullets.length ? '<ul>' + it.bullets.map(function (b) { return '<li>' + clean(b) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
  }

  var EMOJI_RE = /^(\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)\s*/u;
  function splitTitle(t) { var m = t.match(EMOJI_RE); return { emoji: m ? m[1] : '', name: clean(m ? t.slice(m[0].length) : t) }; }

  function projectCard(p) {
    var t = splitTitle(p.title), art = PT[p.id], thumb;
    if (art) thumb = '<div class="p-thumb art">' + art() + '</div>';
    else {
      var h = hue(p.id);
      thumb = '<div class="p-thumb gen" style="--g:linear-gradient(135deg,hsl(' + h + ',55%,32%),hsl(' + ((h + 60) % 360) + ',60%,18%))"><span class="em">' + (t.emoji || '✦') + '</span></div>';
    }
    return '<a class="p-card rv" data-tag="' + p.tag + '" href="project.html?id=' + encodeURIComponent(p.id) + '">' + thumb +
      '<div class="p-body"><h3>' + t.name + '</h3><span class="p-tag">' + p.tagLabel + '</span><p>' + clean(p.desc.replace(/^[^\w<]+/u, '')) + '</p><span class="p-more">Read more' + arr() + '</span></div></a>';
  }

  /* compact row for the non-flagship projects */
  function projectRow(p) {
    var t = splitTitle(p.title);
    return '<a class="p-row" href="project.html?id=' + encodeURIComponent(p.id) + '"><span class="p-tag">' + p.tagLabel + '</span><b>' + t.name + '</b><span class="p-row-d">' + clean(p.desc.replace(/^[^\w<]+/u, '')) + '</span></a>';
  }

  function wireHoverVideo() {
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
    if (!p) { root.innerHTML = '<div class="wrap page-pad"><a class="back" href="index.html#projects">' + arr('l') + 'All projects</a><h1 style="margin-top:20px">That project isn\'t here</h1><p class="lede" style="margin-top:14px">The link may be old or mistyped. Every project is listed on the home page.</p><div class="cta" style="margin-top:24px"><a class="btn primary" href="index.html#projects">See all projects</a><a class="btn" href="index.html">Home</a></div></div>'; return; }
    var t = splitTitle(p.title);
    document.title = t.name + ' — Vishnu Vardhan Addanki Tirumala';
    var images = (p.images || []).map(function (it, i) { return typeof it === 'string' ? { id: 'i' + i, src: it, caption: '' } : { id: it.id || 'i' + i, src: it.src, caption: clean(it.caption || '') }; });
    var videos = (p.videos || []).map(function (it, i) { return typeof it === 'string' ? { id: 'v' + i, src: it, caption: '' } : { id: it.id || 'v' + i, src: it.src, caption: clean(it.caption || '') }; });
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
      /* decorative emoji that lead each paragraph label ("💡 Motivation:") add noise, not meaning */
      s = s.replace(/(<strong>)\s*(?:\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)\s*/gu, '$1');
      return '<div>' + s + '</div>';
    }).join('');
    var restI = images.filter(function (x) { return !usedI[x.id]; });
    var restV = videos.filter(function (x) { return !usedV[x.id]; });
    var links = !p.link ? [] : (Array.isArray(p.link) ? p.link : [p.link]);
    var art = PT[p.id];
    root.innerHTML = '<div class="wrap page-pad proj"><a class="back" href="index.html#projects">' + arr('l') + 'All projects</a>' +
      '<div class="proj-head' + (art ? ' has-art' : '') + '"><div class="proj-title">' +
      '<h1>' + t.name + '</h1>' +
      '<span class="p-tag">' + p.tagLabel + '</span>' +
      '<p class="lede proj-lede">' + clean(p.desc.replace(/^[^\w<]+/u, '')) + '</p>' +
      (links.length ? '<div class="cta">' + links.map(function (l, i) { return '<a class="btn' + (i ? '' : ' primary') + '" href="' + l.href + '" target="_blank" rel="noopener">' + l.label + '</a>'; }).join('') + '</div>' : '') +
      '</div>' + (art ? '<div class="proj-art" role="img" aria-label="Animated diagram of how ' + t.name.replace(/"/g, '') + ' works">' + art() + '</div>' : '') + '</div>' +
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
      return row(i.status === 'review' ? 'Under review' : 'In preparation', '<b>' + i.title + '</b><div class="cv-sub">' + i.venue + '</div>');
    }).join('');
    var work = exp.map(function (e) {
      return row(clean(e.date), '<b>' + clean(e.role) + '</b>, ' + clean(e.org) + '<ul>' + e.bullets.map(function (b) { return '<li>' + clean(b) + '</li>'; }).join('') + '</ul>');
    }).join('');
    var edu = D.credentials.education.map(function (e) { return row(clean(e.date), '<b>' + clean(e.role) + '</b><div class="cv-sub">' + clean(e.org) + '</div>' + (e.role.indexOf('Masters') === 0 ? '<div>Research track: vision-language models, interpretable ML and edge perception.</div>' : '')); }).join('');
    var pick = ['agentic-codesign', 'deep-research-agent', 'ai-video-generator', 'sight-sphere', 'edubot', 'medintelbot', 'face-recognition'];
    var projs = pick.map(function (id) { var p = D.projects.items.filter(function (x) { return x.id === id; })[0]; if (!p) return ''; var t = splitTitle(p.title); return '<li><b>' + t.name + '</b> — ' + clean(p.desc.replace(/^[^\w<]+/u, '')) + '</li>'; }).join('');
    var skills = D.skills.groups.map(function (g) { return '<div><b>' + g.category + ':</b> ' + g.items.join(', ') + '</div>'; }).join('');
    var awards = D.credentials.awards.map(function (a) { return '<li><b>' + clean(a.title) + '</b> — ' + a.desc + '</li>'; }).join('');
    var vol = D.credentials.volunteering.map(function (a) { return '<li><b>' + clean(a.role) + '</b>, ' + clean(a.org) + ' (' + clean(a.date) + ')</li>'; }).join('');

    document.title = 'Curriculum Vitae — Vishnu Vardhan Addanki Tirumala';
    $('#app').innerHTML =
      '<div class="cv-bar no-print"><a class="back" href="index.html">' + arr('l') + 'Back to site</a><div><a class="btn" href="' + docs.resume + '" target="_blank" rel="noopener">Resume (PDF)</a> <a class="btn" href="' + docs.cvPdf + '" download>Download CV (PDF)</a> <button class="btn primary" onclick="window.print()">Print</button></div></div>' +
      '<article class="cv">' +
      '<header class="cv-head"><div><h1>Vishnu Vardhan Addanki Tirumala</h1><div class="cv-tag">Curriculum Vitae · M.Tech in AI &amp; Data Science, IIITDM Kurnool (research exchange at UiA) · University Research Assistant, ACPS Lab</div></div>' +
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


  /* ------------------------------------------------- profile / business card */
  function renderCard() {
    var LI = 'https://www.linkedin.com/in/a-vishnu-vardhan', docs = D.site.docs, r = D.research;
    document.title = 'Profile card — Vishnu Vardhan Addanki Tirumala';
    var chips = ['Vision-language models', 'Interpretable ML', 'Edge AI', 'Agentic systems'].map(function (c) { return '<span class="chip">' + c + '</span>'; }).join('');
    var rows = [['mail', D.contact.email], ['link', 'vishnu-add.github.io'], ['github', 'github.com/Vishnu-add'], ['linkedin', 'linkedin.com/in/a-vishnu-vardhan']].map(function (x) {
      return '<div class="bc-row">' + svgIcon(x[0]).replace('<svg', '<svg fill="currentColor"') + '<span>' + x[1] + '</span></div>';
    }).join('');
    var card = '<div class="bcard">' +
      '<div class="bc-photo"><img src="assets/vishnu.jpg" alt="Portrait of Vishnu Vardhan Addanki Tirumala" width="640" height="640"></div>' +
      '<div class="bc-main"><span class="routes" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><div class="bc-id"><div><h1>Vishnu Vardhan Addanki&nbsp;Tirumala</h1></div></div>' +
      '<p class="bc-role">AI researcher &amp; engineer<br><span>Masters in AI &amp; Data Science · University Research Assistant<br>Exchange at University of Agder (UiA) · Grimstad, Norway</span></p>' +
      '<div class="chips bc-chips">' + chips + '</div><div class="bc-rows">' + rows + '</div></div>' +
      '<a class="bc-qr" href="' + LI + '" target="_blank" rel="noopener" aria-label="Open LinkedIn profile"><div class="qr-tile"><img src="assets/linkedin-qr.svg" alt="QR code for linkedin.com/in/a-vishnu-vardhan" width="190" height="190"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i></div>' +
      '<span>Scan to connect on <strong>LinkedIn</strong></span></a></div>';
    var actions = '<div class="cta bc-actions"><a class="btn primary" href="' + LI + '" target="_blank" rel="noopener">' + svgIcon('linkedin').replace('<svg', '<svg fill="currentColor"') + 'Open LinkedIn</a>' +
      '<button class="btn" id="vcf" type="button">Save contact (.vcf)</button><button class="btn" id="copyli" type="button">Copy LinkedIn link</button>' +
      '<a class="btn" href="' + docs.resume + '" target="_blank" rel="noopener">Resume</a><a class="btn" href="' + docs.cv + '">CV</a></div>';
    var research = r.items.map(function (i) {
      return '<div class="mini"><b>' + i.title + '</b><span class="badge ' + i.status + '" style="margin:6px 0 2px"><i></i>' + i.statusLabel + '</span><p>' + i.kind + '</p></div>';
    }).join('');
    var slim = function (it) { return { date: it.date, role: it.role, org: it.org, logo: it.logo, bullets: [] }; };
    var skills = D.skills.groups.map(function (g) { return '<div class="sk"><h2>' + g.category + '</h2><div class="chips">' + g.items.map(function (i) { return '<span class="chip">' + i + '</span>'; }).join('') + '</div></div>'; }).join('');
    var links = D.contact.links.map(function (l) { return '<a class="chip" href="' + l.href + '" target="_blank" rel="noopener">' + l.label + '</a>'; }).join('');
    $('#app').innerHTML = '<div class="wrap page-pad card-page">' +
      '<a class="back" href="index.html">' + arr('l') + 'Back to site</a><div class="card-stage rv">' + card + actions + '</div>' +
      '<div class="two" style="margin-top:80px"><div class="rv"><div class="sub-h">Summary</div><div class="prose">' + D.about.paragraphs.map(function (p) { return '<div>' + p + '</div>'; }).join('') + '</div>' +
      '<div class="sub-h" style="margin-top:40px">Research</div><div class="cards">' + research + '</div></div>' +
      '<div class="rv"><div class="sub-h">Experience</div><div class="tl">' + D.experience.items.map(function (e) { return tlItem(slim(e)); }).join('') + '</div>' +
      '<div class="sub-h" style="margin-top:30px">Education</div><div class="tl">' + D.credentials.education.map(function (e) { return tlItem(slim(e)); }).join('') + '</div></div></div>' +
      '<div class="sub-h rv" style="margin-top:50px">Skills</div><div class="sk-grid rv">' + skills + '</div>' +
      '<div class="sub-h rv" style="margin-top:50px">Find me online</div><div class="chips rv">' + links + '</div></div>';

    $('#vcf').onclick = function () {
      var v = ['BEGIN:VCARD', 'VERSION:3.0', 'N:Addanki Tirumala;Vishnu Vardhan;;;', 'FN:Vishnu Vardhan Addanki Tirumala', 'ORG:University of Agder', 'TITLE:University Research Assistant',
        'EMAIL;TYPE=INTERNET:' + D.contact.email, 'URL:https://vishnu-add.github.io/', 'URL:' + LI, 'URL:https://github.com/Vishnu-add',
        'NOTE:AI researcher and engineer. Vision-language models\\, interpretable ML\\, edge AI and agentic systems.', 'END:VCARD'].join('\r\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([v], { type: 'text/vcard' })); a.download = 'Vishnu_Vardhan_Addanki_Tirumala.vcf';
      document.body.appendChild(a); a.click(); a.remove();
    };
    $('#copyli').onclick = function () {
      var b = this, done = function () { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = 'Copy LinkedIn link'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(LI).then(done, function () { fallback(); });
      else fallback();
      function fallback() { var t = document.createElement('textarea'); t.value = LI; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { b.textContent = LI; } t.remove(); }
    };
  }

  /* ------------------------------------------------------------ effects */
  function initFX() {
    // scroll progress
    var bar = document.createElement('div'); bar.id = 'progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
    window.addEventListener('scroll', function () {
      var h = document.documentElement; bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    }, { passive: true });

    // reveal
    /* No hide-until-scrolled reveal: every section is on the page from first paint, so anchor jumps,
       print, screenshots and find-in-page all see the real content. */
    $$('.rv').forEach(function (el) { el.classList.add('in'); });

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
  }

  /* -------------------------------------------------------------- boot */
  function footer() {
    var f = $('#footer'); if (!f) return;
    f.innerHTML = '<div class="wrap"><span>© ' + new Date().getFullYear() + ' ' + D.site.name + '</span><span><a href="card.html">Profile card</a> · Grimstad, Norway · ' + D.site.footerText + '</span></div>';
  }

  fetch('data.json').then(function (r) { return r.json(); }).then(function (d) {
    D = d;
    renderNav();
    if (PAGE === 'home') renderHome(); else if (PAGE === 'project') renderProject(); else if (PAGE === 'cv') renderCV(); else if (PAGE === 'card') renderCard();
    footer(); initFX();
    if (location.hash && PAGE === 'home') { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
  }).catch(function (e) {
    $('#app').innerHTML = '<div class="wrap page-pad"><h1>Could not load content</h1><p class="lede">Open this site over http(s) (e.g. <code>python3 -m http.server</code>) — browsers block fetch() on file:// pages.</p></div>';
    console.error(e);
  });
})();
