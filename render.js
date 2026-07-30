// Fetches data.jsonc and renders every content section on the page from it.
// Edit data.jsonc to change site content — no HTML edits needed. The .jsonc
// extension means // and /* */ comments are allowed; stripJsonComments()
// below strips them before JSON.parse (there's no native JSONC parser in the
// browser).
// Note: fetch() requires the page to be served over http(s) (GitHub Pages works
// fine); opening index.html directly via file:// will not load the JSON in most
// browsers. Run a local server (e.g. `python -m http.server`) to preview changes.
(function(){

  // Strips // and /* */ comments from a JSONC string while leaving string
  // contents (and // or /* inside strings) untouched.
  function stripJsonComments(text){
    var out = '';
    var inString = false, inLine = false, inBlock = false, escaped = false;
    for(var i = 0; i < text.length; i++){
      var c = text[i], next = text[i+1];
      if(inLine){
        if(c === '\n'){ inLine = false; out += c; }
        continue;
      }
      if(inBlock){
        if(c === '*' && next === '/'){ inBlock = false; i++; }
        continue;
      }
      if(inString){
        out += c;
        if(escaped) escaped = false;
        else if(c === '\\') escaped = true;
        else if(c === '"') inString = false;
        continue;
      }
      if(c === '"'){ inString = true; out += c; continue; }
      if(c === '/' && next === '/'){ inLine = true; i++; continue; }
      if(c === '/' && next === '*'){ inBlock = true; i++; continue; }
      out += c;
    }
    return out;
  }

  // SVG paths for known nav icon-link keys; unrecognized keys fall back to LINK.
  var ICONS = {
    scholar: '<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>',
    github: '<path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/>',
    linkedin: '<path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.32 8.5h3.24V21H3.32V8.5zm6.02 0h3.11v1.71h.04c.43-.82 1.5-1.69 3.08-1.69 3.29 0 3.9 2.17 3.9 4.99V21h-3.24v-5.83c0-1.39-.02-3.18-1.94-3.18-1.94 0-2.24 1.51-2.24 3.08V21H9.34V8.5z"/>',
    twitter: '<path d="M22 5.9c-.74.33-1.53.55-2.36.65a4.14 4.14 0 0 0 1.81-2.28 8.24 8.24 0 0 1-2.61 1c-.75-.8-1.82-1.3-3-1.3-2.27 0-4.11 1.84-4.11 4.11 0 .32.04.64.11.94A11.65 11.65 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.27 5.48c-.67-.02-1.3-.2-1.85-.51v.05c0 1.99 1.42 3.65 3.3 4.03-.35.1-.71.15-1.09.15-.27 0-.52-.03-.78-.07a4.12 4.12 0 0 0 3.84 2.86A8.3 8.3 0 0 1 2 18.58a11.62 11.62 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.35 8.35 0 0 0 22 5.9z"/>',
    link: '<path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h5v2H5v12h12v-5h2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>'
  };

  function el(html){
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content;
  }

  // A logo value that looks like a file path/URL renders as an <img>; anything
  // else (e.g. "UA") renders as a colored initials badge.
  function isImagePath(logo){
    return /\.(png|jpe?g|svg|webp|gif)(\?.*)?$/i.test(logo) || /^https?:\/\//i.test(logo);
  }

  function orgLine(className, logo, text){
    var badge = '';
    if(logo){
      badge = isImagePath(logo)
        ? '<img class="org-logo-img" src="' + logo + '" alt="" loading="lazy" onerror="this.remove()">'
        : '<span class="org-logo">' + logo + '</span>';
    }
    return '<div class="' + className + '">' + badge + text + '</div>';
  }

  function timelineItem(item){
    var bullets = (item.bullets && item.bullets.length)
      ? '<ul>' + item.bullets.map(function(b){ return '<li>' + b + '</li>'; }).join('') + '</ul>'
      : '';
    return '<div class="tl-item">' +
      '<div class="tl-date">' + item.date + '</div>' +
      '<div class="tl-role">' + item.role + '</div>' +
      orgLine('tl-org', item.logo, item.org) +
      bullets +
      '</div>';
  }

  function projectCard(p){
    return '<a class="proj-card tilt" data-tag="' + p.tag + '" href="project.html?id=' + encodeURIComponent(p.id) + '">' +
      '<span class="proj-tag">' + p.tagLabel + '</span>' +
      '<h3>' + p.title + '</h3>' +
      '<p>' + p.desc + '</p>' +
      '<span class="proj-link">View project →</span>' +
      '</a>';
  }

  // ---- NAV (shared across every page) ----
  // Reorders items that map to a sectionNum in `data`, leaving items with
  // no matching sectionNum (e.g. "home", "contact", "capabilities") pinned
  // to their original slot in the array.
  function orderBySectionNum(items, getNum){
    var slots = [];
    var sortable = [];
    items.forEach(function(item, i){
      var n = getNum(item);
      if(n != null && !isNaN(n)){ slots.push(i); sortable.push({ item: item, n: n }); }
    });
    sortable.sort(function(a, b){ return a.n - b.n; });
    var result = items.slice();
    slots.forEach(function(slot, k){ result[slot] = sortable[k].item; });
    return result;
  }

  function renderNav(site, currentPage, data){
    document.body.classList.toggle('nav-side', site.navLayout === 'side');

    var nameEl = document.getElementById('navName');
    if(nameEl) nameEl.textContent = site.navName;

    var linksEl = document.getElementById('navLinks');
    if(linksEl){
      var navItems = orderBySectionNum(site.nav, function(item){
        var section = data && data[item.key];
        return section ? parseInt(section.sectionNum, 10) : null;
      });
      linksEl.innerHTML = navItems.map(function(item){
        var href, section = item.type === 'page' ? item.key : item.key;
        if(item.type === 'page'){
          href = item.file;
        } else {
          href = currentPage === 'home' ? '#' + item.key : 'index.html#' + item.key;
        }
        var isActive = (item.type === 'page' && item.key === currentPage);
        return '<li><a href="' + href + '"' +
          (isActive ? ' class="active"' : '') +
          ' data-section="' + (item.key === 'home' ? 'home' : item.key) + '">' +
          item.label + '</a></li>';
      }).join('');
    }

    var iconsEl = document.getElementById('navIcons');
    if(iconsEl){
      iconsEl.innerHTML = (site.social || []).map(function(s){
        return '<a class="icon-btn" href="' + s.href + '" target="_blank" rel="noopener" title="' + s.label + '" aria-label="' + s.label + '">' +
          '<svg viewBox="0 0 24 24" fill="currentColor">' + (ICONS[s.key] || ICONS.link) + '</svg>' +
          '</a>';
      }).join('');
    }
    var hireBtn = document.getElementById('hireBtn');
    if(hireBtn) hireBtn.href = site.hireLink;

    var footer = document.getElementById('siteFooter');
    if(footer) footer.innerHTML = site.footerText;
  }

  var QUICKNAV_DATA_KEY = { 'projects-preview': 'projects' };

  function renderQuicknav(site, data){
    var wrap = document.getElementById('quicknavPills');
    if(!wrap) return;
    var items = orderBySectionNum(site.quicknav, function(q){
      var section = data && data[QUICKNAV_DATA_KEY[q.key] || q.key];
      return section ? parseInt(section.sectionNum, 10) : null;
    });
    var pills = items.map(function(q){
      return '<a href="#' + q.key + '">' + q.label + '</a>';
    });
    pills.push('<a href="contact.html">Contact →</a>');
    wrap.innerHTML = pills.join('');
  }

  // ---- HOME PAGE SECTIONS ----
  function renderHero(hero){
    var root = document.getElementById('heroContent');
    if(!root) return;
    root.innerHTML =
      '<div class="eyebrow">' + hero.eyebrow + '</div>' +
      '<h1>' + hero.name + '</h1>' +
      '<div class="type-line">' + hero.typePrefix + ' <span class="type-word" id="typeWord" data-words="' + hero.typeWords.join('|') + '"></span></div>' +
      '<p class="sub">' + hero.sub + '</p>' +
      '<div class="cta">' + hero.cta.map(function(c){
        return '<a class="btn ' + c.style + '" href="' + c.href + '">' + c.label + '</a>';
      }).join('') + '</div>' +
      '<div class="stats">' + hero.stats.map(function(s){
        return '<div class="stat-card tilt"><div class="stat-num" data-count="' + s.value + '"' +
          (s.suffix ? ' data-suffix="' + s.suffix + '"' : '') + '>0</div>' +
          '<div class="stat-label">' + s.label + '</div></div>';
      }).join('') + '</div>';
  }

  function renderCapabilities(capabilities){
    var secNum = document.getElementById('capabilitiesSecNum');
    if(secNum) secNum.textContent = capabilities.sectionNum;
    var eyebrow = document.getElementById('capabilitiesEyebrow');
    if(eyebrow) eyebrow.textContent = capabilities.eyebrow;
    capabilities.items.forEach(function(item){
      var canvas = document.querySelector('.cap-canvas[data-scene="' + item.scene + '"]');
      if(!canvas) return;
      var card = canvas.closest('.cap-card');
      var h3 = card.querySelector('h3');
      var p = card.querySelector('p');
      if(h3) h3.textContent = item.title;
      if(p) p.textContent = item.desc;
    });
  }

  function renderAbout(about){
    var root = document.getElementById('aboutContent');
    if(!root) return;
    document.getElementById('aboutSecNum').textContent = about.sectionNum;
    root.innerHTML = about.paragraphs.map(function(p, i){
      var style = 'max-width:680px; color:var(--text-dim); font-size:16px;' + (i < about.paragraphs.length - 1 ? ' margin-bottom:16px;' : '');
      return '<p style="' + style + '">' + p + '</p>';
    }).join('');
  }

  function renderExperience(experience){
    var root = document.getElementById('experienceTimeline');
    if(!root) return;
    document.getElementById('experienceSecNum').textContent = experience.sectionNum;
    document.getElementById('experienceIntro').innerHTML = experience.intro;
    root.innerHTML = experience.items.map(timelineItem).join('');
  }

  function renderResearch(research){
    var tracksRoot = document.getElementById('researchTracks');
    if(!tracksRoot) return;
    document.getElementById('researchSecNum').textContent = research.sectionNum;
    document.getElementById('researchIntro').innerHTML = research.intro;
    document.getElementById('researchScholarLink').href = research.scholarUrl;
    var tracks = research.tracks || [];
    tracksRoot.innerHTML = tracks.map(function(t){
      return '<div class="track-card tilt"><h3>' + t.title + '</h3><p>' + t.desc + '</p></div>';
    }).join('');
    tracksRoot.style.display = tracks.length ? '' : 'none';

    var publications = research.publications || [];
    toggleSection('publicationsSection', publications.length > 0);

    var pubRoot = document.getElementById('publicationsList');
    if(pubRoot){
      pubRoot.innerHTML = publications.map(function(p){
        return '<div class="accordion-item">' +
          '<button class="accordion-head">' +
            '<div class="accordion-head-text">' +
              '<span class="accordion-title">' + p.title + '</span>' +
              '<span class="accordion-status">' + p.status + '</span>' +
            '</div>' +
            '<svg class="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
          '</button>' +
          '<div class="accordion-body"><div class="accordion-body-inner">' + p.desc + '</div></div>' +
          '</div>';
      }).join('');
    }
  }

  function renderSkills(skills){
    var root = document.getElementById('skillsGroups');
    if(!root) return;
    document.getElementById('skillsSecNum').textContent = skills.sectionNum;
    document.getElementById('skillsIntro').innerHTML = skills.intro;
    root.innerHTML = skills.groups.map(function(g){
      return '<div class="skill-group"><div class="skill-cat">' + g.category + '</div><div class="chips">' +
        g.items.map(function(i){ return '<span class="chip">' + i + '</span>'; }).join('') +
        '</div></div>';
    }).join('');
  }

  function renderProjectsPreview(projects){
    var root = document.getElementById('projectsPreviewGrid');
    if(!root) return;
    document.getElementById('projectsPreviewSecNum').textContent = projects.sectionNum;
    document.getElementById('projectsPreviewIntro').innerHTML = projects.previewIntro;
    var byId = {};
    projects.items.forEach(function(p){ byId[p.id] = p; });
    root.innerHTML = projects.previewIds.map(function(id){ return projectCard(byId[id]); }).join('');
    document.getElementById('projectsPreviewLink').textContent = 'View all ' + projects.items.length + ' projects →';
  }

  function toggleSection(id, visible){
    var section = document.getElementById(id);
    if(section) section.style.display = visible ? '' : 'none';
  }

  function renderCredentials(credentials){
    var root = document.getElementById('credentialsEducation');
    if(!root) return;
    document.getElementById('credentialsSecNum').textContent = credentials.sectionNum;
    document.getElementById('credentialsIntro').innerHTML = credentials.intro;
    root.innerHTML = credentials.education.map(timelineItem).join('');

    var events = credentials.events || [];
    document.getElementById('credentialsEvents').innerHTML = events.map(function(ev){
      return '<div class="event-item tilt"><h3>' + ev.title + '</h3>' +
        '<div class="event-meta">' + ev.meta + '</div><p>' + ev.desc + '</p></div>';
    }).join('');
    toggleSection('credentialsEventsSection', events.length > 0);

    var certifications = credentials.certifications || [];
    document.getElementById('credentialsCertifications').innerHTML = certifications.map(function(group){
      return '<div class="cert-block">' + orgLine('cert-issuer', group.logo, group.issuer) +
        '<ul class="cert-list">' + group.items.map(function(it){
          return '<li><span>' + it.title + '</span><span>' + it.meta + '</span></li>';
        }).join('') + '</ul></div>';
    }).join('');
    toggleSection('credentialsCertificationsSection', certifications.length > 0);

    var awards = credentials.awards || [];
    document.getElementById('credentialsAwards').innerHTML = awards.map(function(a){
      return '<div class="track-card tilt"><h3>' + a.title + '</h3><p>' + a.desc + '</p></div>';
    }).join('');
    toggleSection('credentialsAwardsSection', awards.length > 0);

    var volunteering = credentials.volunteering || [];
    document.getElementById('credentialsVolunteering').innerHTML = volunteering.map(timelineItem).join('');
    toggleSection('credentialsVolunteeringSection', volunteering.length > 0);

    var langMother = (credentials.languages && credentials.languages.mother) || [];
    var langOther = (credentials.languages && credentials.languages.other) || [];
    document.getElementById('credentialsLangMother').innerHTML = langMother.map(function(l){ return '<span class="chip">' + l + '</span>'; }).join('');
    document.getElementById('credentialsLangOther').innerHTML = langOther.map(function(l){ return '<span class="chip">' + l + '</span>'; }).join('');
    toggleSection('credentialsLanguagesSection', langMother.length > 0 || langOther.length > 0);
    var motherGroup = document.getElementById('credentialsLangMotherGroup');
    if(motherGroup) motherGroup.style.display = langMother.length ? '' : 'none';
    var otherGroup = document.getElementById('credentialsLangOtherGroup');
    if(otherGroup) otherGroup.style.display = langOther.length ? '' : 'none';
  }

  function renderHireTeaser(teaser){
    var root = document.getElementById('hireTeaser');
    if(!root) return;
    root.querySelector('h2').textContent = teaser.heading;
    root.querySelector('p').innerHTML = teaser.text;
    var cta = root.querySelector('.btn');
    cta.href = teaser.cta.href;
    cta.textContent = teaser.cta.label;
  }

  // ---- PROJECTS PAGE ----
  function renderProjectsPage(projects){
    var filterBar = document.getElementById('filterBar');
    if(!filterBar) return;
    var eyebrow = document.getElementById('projectsPageEyebrow');
    if(eyebrow) eyebrow.textContent = projects.pageEyebrow;
    var sub = document.getElementById('projectsPageSub');
    if(sub) sub.textContent = projects.pageSub;

    filterBar.innerHTML = projects.filters.map(function(f, i){
      return '<button class="filter-btn' + (i === 0 ? ' active' : '') + '" data-filter="' + f.key + '">' + f.label + '</button>';
    }).join('');

    document.getElementById('projectsGrid').innerHTML = projects.items.map(projectCard).join('');
  }

  // ---- PROJECT DETAIL PAGE ----
  function renderProjectDetail(projects){
    var root = document.getElementById('projectDetail');
    if(!root) return;
    var id = new URLSearchParams(window.location.search).get('id');
    var project = projects.items.filter(function(p){ return p.id === id; })[0];

    if(!project){
      root.innerHTML = '<div class="sec-head"><h2>Project not found</h2></div>' +
        '<p style="color:var(--text-dim);">That project doesn\'t exist or may have moved.</p>' +
        '<a class="btn btn-ghost" style="margin-top:20px;" href="projects.html">← All projects</a>';
      return;
    }

    document.title = project.title + ' — Vishnu Vardhan Addanki Tirumala';

    // project.images is the master list of images for the page: each entry is
    // { "id": "login", "src": "path/to.png", "caption": "..." }. Plain strings
    // or {src, caption} objects (no id) are also accepted for backwards
    // compatibility and get an auto-generated id.
    // To place an image inline inside a "detail" string, reference its id with
    // {{img:ID}} anywhere in the text — it renders full-width at that spot with
    // its caption below it, at the same size as every other inline image.
    // Any image whose id is never referenced this way is instead shown in a
    // "More screenshots" strip of small thumbnails at the end of the page;
    // clicking any thumbnail (or any inline image) opens a lightbox that can
    // page through every image in the list.
    var images = (project.images || []).map(function(item, i){
      if(typeof item === 'string') return { id: 'img' + i, src: item, caption: '' };
      return { id: item.id || ('img' + i), src: item.src, caption: item.caption || '' };
    });
    var imagesById = {};
    images.forEach(function(img){ imagesById[img.id] = img; });

    // project.videos accepts the same shapes as project.images: plain strings
    // or { id, src, caption } objects. Reference one inline in "detail" text
    // via {{vid:ID}}; any video whose id is never referenced that way is
    // instead shown in a captioned "Videos" strip at the end of the page.
    var videosRaw = project.videos || [];
    var videos = videosRaw.map(function(item, i){
      if(typeof item === 'string') return { id: 'vid' + i, src: item, caption: '' };
      return { id: item.id || ('vid' + i), src: item.src, caption: item.caption || '' };
    });
    var videosById = {};
    videos.forEach(function(v){ videosById[v.id] = v; });

    var usedIds = {}, usedVidIds = {};
    var detailItems = project.detail && project.detail.length ? project.detail : [project.desc];
    var detailParas = detailItems.map(function(item){
      var text = String(item);
      text = text.replace(/\{\{img:([\w-]+)\}\}/g, function(match, imgId){
        var img = imagesById[imgId];
        if(!img) return '';
        usedIds[imgId] = true;
        var idx = images.indexOf(img);
        var captionHtml = img.caption ? '<figcaption class="inline-figcaption">' + img.caption + '</figcaption>' : '';
        return '<figure class="inline-figure" data-lightbox-idx="' + idx + '">' +
          '<img src="' + encodeURI(img.src) + '" alt="' + (img.caption || project.title) + '" loading="lazy" onerror="this.parentNode.remove()">' +
          captionHtml +
          '</figure>';
      });
      text = text.replace(/\{\{vid:([\w-]+)\}\}/g, function(match, vidId){
        var vid = videosById[vidId];
        if(!vid) return '';
        usedVidIds[vidId] = true;
        var captionHtml = vid.caption ? '<figcaption class="inline-figcaption">' + vid.caption + '</figcaption>' : '';
        return '<figure class="inline-figure">' +
          '<video src="' + encodeURI(vid.src) + '" controls preload="metadata"></video>' +
          captionHtml +
          '</figure>';
      });
      return '<div style="color:var(--text-dim); font-size:16px; max-width:680px; margin-bottom:16px; line-height:1.6;">' + text + '</div>';
    }).join('');

    var leftoverImages = images.filter(function(img){ return !usedIds[img.id]; });
    var leftoverVideos = videos.filter(function(v){ return !usedVidIds[v.id]; });

    var moreGallery = '';
    if(leftoverImages.length){
      var thumbHtml = leftoverImages.map(function(img){
        var idx = images.indexOf(img);
        return '<button type="button" class="gallery-thumb" data-lightbox-idx="' + idx + '">' +
          '<img src="' + encodeURI(img.src) + '" alt="' + (img.caption || project.title) + '" loading="lazy" onerror="this.parentNode.remove()">' +
          (img.caption ? '<span class="gallery-thumb-cap">' + img.caption + '</span>' : '') +
          '</button>';
      }).join('');
      moreGallery = '<div class="sec-head" style="margin-top:36px;"><h2 style="font-size:18px; margin:0;">Images</h2></div>' +
        '<div class="thumb-grid" style="margin-top:16px;">' + thumbHtml + '</div>';
    } else if(!images.length && !videos.length){
      moreGallery = '<div class="project-gallery-empty" style="margin-top:24px;">No images added yet.</div>';
    }

    var vidHtml = leftoverVideos.length ? '<div class="sec-head" style="margin-top:36px;"><h2 style="font-size:18px; margin:0;">Videos</h2></div>' +
      '<div class="project-gallery" style="margin-top:16px;">' + leftoverVideos.map(function(v){
        var captionHtml = v.caption ? '<div class="gallery-thumb-cap">' + v.caption + '</div>' : '';
        return '<div class="gallery-item"><video src="' + encodeURI(v.src) + '" controls preload="metadata"></video>' + captionHtml + '</div>';
      }).join('') + '</div>' : '';

    // project.link accepts either a single { label, href } object or a list of
    // them, so a project can surface more than one external link (repo, demo, ...).
    var links = !project.link ? [] : (Array.isArray(project.link) ? project.link : [project.link]);
    var link = links.map(function(l, i){
      var cls = i === 0 ? 'btn btn-primary' : 'btn btn-ghost';
      return '<a class="' + cls + '" style="margin-top:8px; margin-right:10px;" href="' + l.href + '" target="_blank" rel="noopener">' + l.label + '</a>';
    }).join('');

    root.innerHTML =
      '<a class="proj-link" href="projects.html">← All projects</a>' +
      '<div class="sec-head" style="margin-top:20px;"><span class="proj-tag" style="margin:0;">' + project.tagLabel + '</span></div>' +
      '<h1 style="margin-top:6px;">' + project.title + '</h1>' +
      '<div style="margin-top:24px;">' + detailParas + link + '</div>' +
      vidHtml +
      moreGallery;

    setupLightbox(root, images);
  }

  // Builds (once) a fullscreen lightbox overlay and wires click-to-open on any
  // element carrying data-lightbox-idx, plus prev/next/close via buttons,
  // clicking the backdrop, and arrow/Escape keys. Reused across renders.
  function setupLightbox(root, images){
    var overlay = document.getElementById('lightboxOverlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'lightboxOverlay';
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="Close">✕</button>' +
        '<button type="button" class="lightbox-prev" aria-label="Previous image">‹</button>' +
        '<div class="lightbox-content"><img class="lightbox-img" alt=""><div class="lightbox-cap"></div></div>' +
        '<button type="button" class="lightbox-next" aria-label="Next image">›</button>';
      document.body.appendChild(overlay);

      overlay.querySelector('.lightbox-close').addEventListener('click', close);
      overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
      overlay.querySelector('.lightbox-prev').addEventListener('click', function(){ step(-1); });
      overlay.querySelector('.lightbox-next').addEventListener('click', function(){ step(1); });
      document.addEventListener('keydown', function(e){
        if(!overlay.classList.contains('open')) return;
        if(e.key === 'Escape') close();
        else if(e.key === 'ArrowLeft') step(-1);
        else if(e.key === 'ArrowRight') step(1);
      });
    }

    var curImages = images, curIdx = 0;

    function show(i){
      curIdx = (i + curImages.length) % curImages.length;
      var img = curImages[curIdx];
      overlay.querySelector('.lightbox-img').src = encodeURI(img.src);
      overlay.querySelector('.lightbox-img').alt = img.caption || '';
      overlay.querySelector('.lightbox-cap').textContent = img.caption || '';
      overlay.classList.add('open');
    }
    function step(dir){ show(curIdx + dir); }
    function close(){ overlay.classList.remove('open'); }

    root.addEventListener('click', function(e){
      var el = e.target.closest('[data-lightbox-idx]');
      if(!el) return;
      curImages = images;
      show(parseInt(el.getAttribute('data-lightbox-idx'), 10));
    });
  }

  // ---- CONTACT PAGE ----
  function renderContactPage(contact){
    var root = document.getElementById('hirePanel');
    if(!root) return;
    var eyebrow = document.getElementById('contactPageEyebrow');
    if(eyebrow) eyebrow.textContent = contact.pageEyebrow;
    var sub = document.getElementById('contactPageSub');
    if(sub) sub.textContent = contact.pageSub;

    root.querySelector('h2').textContent = contact.heading;
    root.querySelector('p').innerHTML = contact.text;
    var emailCta = root.querySelector('.btn-primary');
    emailCta.href = contact.emailCta.href;
    emailCta.textContent = contact.emailCta.label;

    document.getElementById('contactLinks').innerHTML = contact.links.map(function(l){
      return '<a href="' + l.href + '"' + (l.external ? ' target="_blank" rel="noopener"' : '') + '>' + l.label + '</a>';
    }).join('');
  }

  // Groups of <section> ids that move together, keyed by the data object
  // whose sectionNum decides ordering. Sections are reordered in place
  // between #quicknav and #hireTeaser, lowest sectionNum first.
  var SECTION_GROUPS = [
    { data: 'about', ids: ['about'] },
    { data: 'capabilities', ids: ['capabilities'] },
    { data: 'experience', ids: ['experience'] },
    { data: 'research', ids: ['research', 'publicationsSection'] },
    { data: 'skills', ids: ['skills'] },
    { data: 'projects', ids: ['projects-preview'] },
    { data: 'credentials', ids: [
      'credentials',
      'credentialsEventsSection',
      'credentialsCertificationsSection',
      'credentialsAwardsSection',
      'credentialsVolunteeringSection',
      'credentialsLanguagesSection'
    ] }
  ];

  function reorderSections(data){
    var anchor = document.getElementById('hireTeaser');
    if(!anchor) return;
    var groups = SECTION_GROUPS
      .map(function(g){ return { num: parseInt((data[g.data] || {}).sectionNum, 10), ids: g.ids }; })
      .filter(function(g){ return !isNaN(g.num); })
      .sort(function(a, b){ return a.num - b.num; });

    groups.forEach(function(g){
      g.ids.forEach(function(id){
        var el = document.getElementById(id);
        if(el) anchor.parentNode.insertBefore(el, anchor);
      });
    });
  }

  // ---- BOOT ----
  function render(data){
    var page = document.body.getAttribute('data-page') || 'home';
    renderNav(data.site, page, data);

    if(page === 'home'){
      renderQuicknav(data.site, data);
      renderHero(data.hero);
      renderCapabilities(data.capabilities);
      renderAbout(data.about);
      renderExperience(data.experience);
      renderResearch(data.research);
      renderSkills(data.skills);
      renderProjectsPreview(data.projects);
      renderCredentials(data.credentials);
      renderHireTeaser(data.hireTeaser);
      reorderSections(data);
    } else if(page === 'projects'){
      renderProjectsPage(data.projects);
    } else if(page === 'project'){
      renderProjectDetail(data.projects);
    } else if(page === 'contact'){
      renderContactPage(data.contact);
    }

    if(window.SiteFX) window.SiteFX.initAll();
  }

  fetch('data.jsonc')
    .then(function(res){
      if(!res.ok) throw new Error('data.jsonc responded with ' + res.status);
      return res.text();
    })
    .then(function(text){ return JSON.parse(stripJsonComments(text)); })
    .then(render)
    .catch(function(err){
      console.error('Failed to load data.jsonc — the site needs to be served over http(s), not opened directly as a file.', err);
    });
})();
