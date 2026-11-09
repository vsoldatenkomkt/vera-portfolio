/* Vera Soldatenko · site script. Language, hero typewriter, lanyard badge. */
const WORD_COLOURS = ['--w1', '--w2', '--w3', '--w4', '--w5', '--w6'];
let lang = (() => { try { const s = localStorage.getItem('site-lang'); if (s === 'fr' || s === 'en') return s; } catch (e) {} return 'fr'; })();

// ---------- language ----------
function relabel() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en][data-fr]').forEach(el => el.textContent = el.dataset[lang]);
  document.querySelectorAll('[data-lang-btn]').forEach(b => b.setAttribute('aria-pressed', b.dataset.langBtn === lang));
  resetTyping();
  document.querySelectorAll('[data-alt-en]').forEach(el => el.alt = el.dataset['alt' + (lang === 'fr' ? 'Fr' : 'En')]);
  if (lastCounts) showCounts(lastCounts);
  const m = document.getElementById('cvMonth');   // cover date: always the current month
  if (m) m.textContent = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric' }).format(new Date());
}

// ---------- "See my journey": a plain link that glides down to the next section ----------
// same gentle scroll for the hero button and the "next section" button at the end of the story
document.querySelectorAll('#journeyBtn, .jm-next').forEach(btn => btn.addEventListener('click', ev => {
  const target = document.querySelector(btn.getAttribute('href'));
  if (!target) return;
  ev.preventDefault();
  const head = document.getElementById('head').offsetHeight;
  const from = scrollY, to = Math.min(target.getBoundingClientRect().top + scrollY - head, document.documentElement.scrollHeight - innerHeight);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { scrollTo(0, to); return; }
  const html = document.documentElement, prev = html.style.scrollBehavior; html.style.scrollBehavior = 'auto';
  const dur = 1100, t0 = performance.now(), ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const step = now => { const t = Math.min(1, (now - t0) / dur); scrollTo(0, from + (to - from) * ease(t)); if (t < 1) requestAnimationFrame(step); else html.style.scrollBehavior = prev; };
  requestAnimationFrame(step);
}));

document.querySelectorAll('[data-lang-btn]').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.langBtn === lang) return;
  lang = b.dataset.langBtn;
  try { localStorage.setItem('site-lang', lang); } catch (e) {}
  relabel();
}));

// ---------- hero typewriter: "Every channel, one ___" ----------
const words = { en: ['experience', 'brand', 'story', 'voice', 'promise'], fr: ['expérience', 'marque', 'histoire', 'voix', 'promesse'] };
const tw = document.getElementById('tw');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let wi = 0, ci = 0, del = false, tmr = 0;
function paintWord() { document.documentElement.style.setProperty('--word', `var(${WORD_COLOURS[wi % WORD_COLOURS.length]})`); tw.parentElement.style.color = 'var(--word)'; }
function tick() {
  const w = words[lang][wi];
  if (reduceMotion) { tw.textContent = w; paintWord(); wi = (wi + 1) % words[lang].length; tmr = setTimeout(tick, 2600); return; }
  if (!del) { ci++; if (ci >= w.length) { del = true; tw.textContent = w; tmr = setTimeout(tick, 1600); return; } }
  else { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words[lang].length; paintWord(); } }
  tw.textContent = w.slice(0, ci);
  tmr = setTimeout(tick, del ? 45 : 85);
}
function resetTyping() { clearTimeout(tmr); wi = 0; ci = 0; del = false; paintWord(); tick(); }

// ---------- page visits and Follow clicks, counted by Vera's own Google Apps Script ----------
// Kept for later: the totals and the Follow button will live elsewhere on the site. Each part only runs when its elements exist.
// COUNTER_URL is the Apps Script web app URL; while it is empty the totals show "–" and nothing is sent anywhere.
const COUNTER_URL = 'https://script.google.com/macros/s/AKfycbxpqLousu4z0CiCL6SMDPftFR4gJo5u8fxrHCZecwtL-2_1uRJgnPBMo5Zw3Spbh1BFyw/exec';
const pcFollow = document.getElementById('pcFollow');
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
var lastCounts = null;
function showCounts(d) {
  if (!d) return;
  lastCounts = d;
  const live = document.getElementById('live');
  if (live && Number.isFinite(d.visits) && d.visits > 50) {   // stays hidden until the count passes 50
    const t = document.getElementById('liveTxt'), one = d.visits === 1;
    t.dataset.en = one ? 'visit so far' : 'visits so far'; t.dataset.fr = one ? 'visite à ce jour' : 'visites à ce jour'; t.textContent = t.dataset[lang];
    live.hidden = false;
  }
  ['visits', 'follows'].forEach(k => {
    if (!Number.isFinite(d[k])) return;
    const el = document.querySelector(`[data-count="${k}"]`);
    if (el) el.textContent = d[k].toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB');
  });
}
// only the live site counts visits and follows; previews and local copies just read the totals
const isLive = /(^|\.)vsoldatenko\.fr$/.test(location.hostname);
function counter(action) {
  if (!COUNTER_URL) return;
  if (!isLive) action = 'read';
  fetch(`${COUNTER_URL}?action=${action}`, { cache: 'no-store' }).then(r => r.json()).then(showCounts).catch(() => {});
}
function paintFollow() {
  if (!pcFollow) return;
  const on = store.get('followed') === '1';
  pcFollow.setAttribute('aria-pressed', on);
  pcFollow.classList.toggle('on', on);
  document.getElementById('pcFollowIco').textContent = on ? '✓' : '+';
  const t = document.getElementById('pcFollowTxt');
  t.dataset.en = on ? 'Subscribed' : 'Subscribe'; t.dataset.fr = on ? 'Abonné·e' : "S'abonner"; t.textContent = t.dataset[lang];
}
if (pcFollow) pcFollow.addEventListener('click', () => {
  if (store.get('followed') === '1') return;   // one follow per browser
  store.set('followed', '1'); paintFollow(); counter('follow');
});
// ---------- cover flip: the back is a short note with her real photo ----------
const cvFlip = document.getElementById('cvFlip'), cvTurn = document.getElementById('cvTurn');
function setFlip(on) {
  cvFlip.classList.toggle('flipped', on);
  document.getElementById('cvFront').inert = on;
  document.getElementById('cvBack').inert = !on;
  cvTurn.setAttribute('aria-pressed', on);
  const t = document.getElementById('cvTurnTxt');
  t.dataset.en = on ? 'Back to the cover' : 'Turn the page'; t.dataset.fr = on ? 'Retour à la couverture' : 'Tourner la page'; t.textContent = t.dataset[lang];
}
if (cvFlip && cvTurn) {
  cvFlip.addEventListener('click', () => setFlip(!cvFlip.classList.contains('flipped')));
  cvTurn.addEventListener('click', () => setFlip(!cvFlip.classList.contains('flipped')));
}

// ---------- "How I got here": each key moment gets its hand-drawn mark as it scrolls into view ----------
const marks = document.querySelectorAll('.mk');
if (marks.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-mk');
  const mio = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting && e.boundingClientRect.top > 0) return;   // also draw marks someone scrolled straight past
    const el = e.target;
    el.style.setProperty('--mk-t', Math.min(1.1, Math.max(.5, el.textContent.length * .045)) + 's');   // longer phrase, slower stroke
    el.classList.add('on'); mio.unobserve(el);
  }), { rootMargin: '0px 0px -15% 0px', threshold: 1 });
  marks.forEach(el => mio.observe(el));
}

// ---------- "How it all began": map of the route. Draws itself stop by stop once in view; tabs and pins pick a chapter ----------
(function journeyMap() {
  const svg = document.getElementById('jmSvg'), tabs = [...document.querySelectorAll('.jm-step')], panels = [...document.querySelectorAll('.jm-panel')];
  if (!svg || !tabs.length) return;
  document.documentElement.classList.add('js-jm');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Belarus is where the route starts (always shown); the three tabs are Canada, Milan, France (tab n = stop n + 1)
  // each stop has one or more places where she lived, studied or worked, joined in order by the route
  const STOPS = [
    { key: 'by', iso: '112', pin: '#E0559A', places: [{ at: [27.9, 53.6], en: 'Belarus', fr: 'Bélarus', side: 'l' }] },
    { key: 'ca', iso: '124', pin: '#3C8DEB', places: [{ at: [-75.70, 45.42], en: 'Ottawa', fr: 'Ottawa', side: 'r' }, { at: [-79.38, 43.65], en: 'Toronto', fr: 'Toronto', side: 'l' }] },
    { key: 'it', iso: '380', pin: '#8B6CF0', places: [{ at: [9.19, 45.46], en: 'Milan', fr: 'Milan', side: 'r' }] },
    { key: 'fr', iso: '250', pin: '#E0B400', places: [{ at: [0.2, 45.4], en: 'France', fr: 'France', side: 'l' }] }
  ];
  // places visited on trips: small open dots, name on hover, listed under the chapters
  // "Hidden hobby": cities she has travelled to, shown on their own when the button is pressed
  const TRIPS = [[27.56, 53.90, 'Minsk'], [-75.70, 45.42, 'Ottawa'], [-79.30, 43.45, 'Toronto & Niagara Falls', 'Toronto & chutes du Niagara'], [-71.21, 46.81, 'Quebec City', 'Québec'],
    [-74.01, 40.71, 'New York'], [2.25, 48.83, 'Paris & Versailles'], [0.69, 47.39, 'Tours'], [-0.58, 44.84, 'Bordeaux'], [4.84, 45.76, 'Lyon'], [6.13, 46.05, 'Annecy & Geneva', 'Annecy & Genève'],
    [12.50, 41.90, 'Rome'], [12.33, 45.44, 'Venice', 'Venise'], [11.26, 43.77, 'Florence'], [10.33, 44.80, 'Parma', 'Parme'], [16.37, 48.21, 'Vienna', 'Vienne'], [13.04, 47.81, 'Salzburg', 'Salzbourg']];
  const story = document.getElementById('jmStory'), travel = document.getElementById('jmTravel'), hobby = document.getElementById('jmHobby'), hobbyTxt = document.getElementById('jmHobbyTxt');
  const jmap = document.getElementById('jmap'), hobbyIco = document.getElementById('jmHobbyIco');
  if (hobby) hobby.addEventListener('click', () => {
    const on = hobby.getAttribute('aria-pressed') !== 'true';
    userPicked = true; clearTimeout(timer);
    // the map expands to the full width, the travel line sits above it; points name themselves on hover or tap
    const swap = () => {
      hobby.setAttribute('aria-pressed', on); svg.classList.toggle('trips', on); jmap.classList.toggle('expanded', on);
      story.hidden = on; travel.hidden = !on;
      hobbyIco.innerHTML = on ? '←' : '<svg class="ic-plus" viewBox="0 0 16 16" focusable="false"><path d="M8 3v10M3 8h10"/></svg>';
      hobbyTxt.dataset.en = on ? 'Back to my story' : 'Hidden hobby'; hobbyTxt.dataset.fr = on ? 'Retour à mon parcours' : 'Passion cachée'; hobbyTxt.textContent = hobbyTxt.dataset[lang];
      svg.querySelectorAll('.jm-trip.show').forEach(g => g.classList.remove('show'));
      // the city count runs up from 0 when the hobby opens
      const cnt = document.getElementById('jmCount');
      if (on && cnt && !reduce) { const end = 19, t0 = performance.now(); const tick = t => { const k = Math.min(1, (t - t0) / 900); cnt.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); }; cnt.textContent = '0'; requestAnimationFrame(tick); }
    };
    // phones: after the switch, bring the whole block (line, city list and map) into view
    const frame = () => { if (matchMedia('(max-width:959px)').matches) jmap.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); };
    if (document.startViewTransition && !reduce) document.startViewTransition(swap).updateCallbackDone.then(frame); else { swap(); frame(); }
  });
  let step = 0, routes = [], pins = [], userPicked = false, timer = 0, started = reduce;
  function show(i, fromUser) {
    step = i; const st = i + 1;
    if (fromUser) { userPicked = true; clearTimeout(timer); started = true; }
    tabs.forEach((t, n) => { t.setAttribute('aria-selected', n === i); t.tabIndex = n === i ? 0 : -1; });
    panels.forEach((p, n) => { p.hidden = n !== i; p.classList.toggle('on', n === i); });
    document.querySelectorAll('.jm-link').forEach((l, n) => l.classList.toggle('done', n < i));
    pins.forEach(p => { const s = +p.dataset.stop; p.classList.toggle('on', s === st); p.classList.toggle('seen', s <= st); });
    // a leg draws once its destination's chapter is reached (and the map has come into view); legs of one chapter draw one after another
    routes.forEach(r => {
      const draw = started && +r.dataset.stop <= st;
      r.style.transitionDelay = draw && +r.dataset.stop === st ? r.dataset.order * 1.2 + 's' : '0s';
      r.style.strokeDashoffset = draw ? 0 : r.dataset.len;
    });
  }
  // every screen size: one chapter at a time, picked with the stop tabs or the "Next stop" button at the end of a chapter
  tabs.forEach((t, n) => {
    t.addEventListener('click', () => show(n, true));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return; e.preventDefault(); const m = (n + d + tabs.length) % tabs.length; show(m, true); tabs[m].focus();
    });
  });
  // "Next stop": opens the next chapter, then brings the reader back up to the map so the new leg draws in view and the text starts from its first line
  document.querySelectorAll('.jm-go').forEach(b => b.addEventListener('click', () => {
    const n = +b.dataset.go; show(n, true); tabs[n].focus({ preventScroll: true });
    const headH = document.getElementById('head').offsetHeight, top = jmap.getBoundingClientRect().top;
    if (top < headH) scrollTo({ top: top + scrollY - headH - 16, behavior: reduce ? 'auto' : 'smooth' });
  }));
  show(0);
  if (!window.d3 || !window.topojson || !d3.geoMercator) return;   // map libraries unavailable: tabs and text still work
  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r => r.json()).then(world => {
    const NS = 'http://www.w3.org/2000/svg', el = (n, a) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const proj = d3.geoMercator().fitExtent([[24, 24], [776, 496]], { type: 'MultiPoint', coordinates: [[-98, 36], [40, 59]] });
    const path = d3.geoPath(proj);
    const land = el('g', { class: 'jm-lands' });
    topojson.feature(world, world.objects.countries).features.forEach(f => {
      const s = STOPS.find(s => s.iso === f.id);
      land.append(el('path', { d: path(f), class: 'jm-land ' + (s ? s.key : '') }));
    });
    svg.append(land);
    // route: every place in order, Belarus -> Ottawa -> Toronto -> Milan -> France
    const seq = STOPS.flatMap((s, n) => s.places.map(p => ({ ...p, stop: n })));
    for (let n = 1; n < seq.length; n++) {
      const r = el('path', { d: path({ type: 'LineString', coordinates: [seq[n - 1].at, seq[n].at] }), class: 'jm-route' });
      svg.append(r);
      const len = r.getTotalLength(); r.dataset.len = len; r.dataset.stop = seq[n].stop; r.dataset.order = routes.filter(o => o.dataset.stop == seq[n].stop).length;
      r.style.strokeDasharray = len; r.style.strokeDashoffset = len;
      if (!reduce) r.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.45,0,.2,1)';
      routes.push(r);
    }
    // points that sit almost on top of each other share one dot; each hit area stops halfway to its nearest neighbour
    const tp = TRIPS.map(([lon, lat]) => proj([lon, lat]));
    TRIPS.forEach(([lon, lat, en, fr = en], n) => {
      const [x, y] = tp[n], near = Math.min(...tp.filter((_, m) => m !== n).map(([a, b]) => Math.hypot(a - x, b - y)));
      const g = el('g', { class: 'jm-trip', transform: `translate(${x} ${y})`, style: `--i:${n}` });
      const label = el('text', { y: -12, 'text-anchor': 'middle' });
      label.textContent = lang === 'fr' ? fr : en; label.dataset.en = en; label.dataset.fr = fr;
      g.append(el('circle', { class: 'hit', r: Math.max(5, Math.min(14, near / 2)) }), el('circle', { class: 'pt', r: 5 }), label); svg.append(g);
      // touch screens: tap a point to show its name
      g.addEventListener('click', () => { const was = g.classList.contains('show'); svg.querySelectorAll('.jm-trip.show').forEach(o => o.classList.remove('show')); g.classList.toggle('show', !was); });
    });
    seq.forEach(p => {
      const [x, y] = proj(p.at), s = STOPS[p.stop], g = el('g', { class: 'jm-pin', transform: `translate(${x} ${y})`, style: `--pin:${s.pin}` });
      g.dataset.stop = p.stop;
      g.append(el('circle', { class: 'halo', r: 7 }), el('circle', { class: 'dot', r: 7 }));
      const r = p.side === 'r', t = el('text', { x: r ? 14 : -14, y: p.en === 'Milan' ? 20 : -10, 'text-anchor': r ? 'start' : 'end' });
      t.textContent = p[lang]; t.dataset.en = p.en; t.dataset.fr = p.fr;
      g.append(t); g.addEventListener('click', () => pick(Math.max(0, p.stop - 1)));
      svg.append(g); pins.push(g);
    });
    show(step);
    // when the map first comes into view, the line draws up to the chapter being read; it only moves on as the reader scrolls
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.disconnect();
      if (!started) { started = true; requestAnimationFrame(() => show(step)); }
    }), { threshold: .5 });
    io.observe(svg);
  }).catch(() => {});
})();

// ---------- header: frosted once the page scrolls; menu marks the section in view ----------
const head = document.getElementById('head');
const onScroll = () => head.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const navLinks = [...document.querySelectorAll('.nav-link')];
const spyTargets = [...navLinks.filter(a => a.getAttribute('href').startsWith('#')).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean), ...document.querySelectorAll('section[data-nav]')];
if ('IntersectionObserver' in window && spyTargets.length) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    // the CV link is a download, so it stands for the "about" sections (references, timeline, off duty) via data-spy
    navLinks.forEach(a => a.toggleAttribute('aria-current', (a.dataset.spy || a.getAttribute('href')) === (e.target.dataset.nav || '#' + e.target.id)));
    navLinks.forEach(a => a.hasAttribute('aria-current') && a.setAttribute('aria-current', 'page'));
  }), { rootMargin: '-45% 0px -50% 0px' });
  spyTargets.forEach(t => io.observe(t));
}

let firstVisit = true; try { firstVisit = sessionStorage.getItem('visited') !== '1'; sessionStorage.setItem('visited', '1'); } catch (e) {}
counter(firstVisit ? 'visit' : 'read');
paintFollow();

relabel();

// ---------- hover bubbles on words (mouse: hover; keyboard: focus; touch: tap). The bubble is nudged to stay inside the screen ----------
document.querySelectorAll('.tip').forEach(t => {
  const w = t.querySelector('.tip-word'), b = t.querySelector('.tip-bubble');
  const fit = () => { b.style.setProperty('--dx', '0px'); const r = b.getBoundingClientRect(), m = 16; const dx = r.left < m ? m - r.left : r.right > innerWidth - m ? innerWidth - m - r.right : 0; b.style.setProperty('--dx', dx + 'px'); };
  t.addEventListener('mouseenter', fit); w.addEventListener('focus', fit);
  w.addEventListener('click', () => { fit(); t.classList.toggle('open'); });
  w.addEventListener('keydown', e => { if (e.key === 'Escape') { t.classList.remove('open'); w.blur(); } });
  document.addEventListener('click', e => { if (!t.contains(e.target)) t.classList.remove('open'); });
});

// ---------- Work: skill tabs (click or arrow keys); only the panel under the tabs changes ----------
(function skills() {
  const tabs = [...document.querySelectorAll('.sk-tab')], panels = [...document.querySelectorAll('.sk-panel')];
  if (!tabs.length) return;
  document.documentElement.classList.add('js-sk');
  const show = i => {
    tabs.forEach((t, n) => { t.setAttribute('aria-selected', n === i); t.tabIndex = n === i ? 0 : -1; });
    panels.forEach((p, n) => { p.hidden = n !== i; });
  };
  tabs.forEach((t, n) => {
    t.addEventListener('click', () => show(n));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return; e.preventDefault(); const m = (n + d + tabs.length) % tabs.length; show(m); tabs[m].focus();
    });
  });
})();

// ---------- two examples in one skill: click an example, or drag the logo star between them, to show its visual ----------
document.querySelectorAll('.sk-rail').forEach(rail => {
  const items = [...rail.querySelectorAll('.sk-item')], btns = items.map(i => i.querySelector('.sk-pick'));
  const star = rail.querySelector('.sk-star'), line = rail.querySelector('.sk-rail-line');
  const stack = rail.closest('.sk-panel').querySelector('.sk-stack');
  let cur = 0;
  const ys = () => btns.map(b => { const h = b.closest('.sk-h'); return h.offsetTop + Math.min(h.offsetHeight, 32) / 2; });
  const place = y => star.style.setProperty('--y', y + 'px');
  const layout = () => { const y = ys(); line.style.setProperty('--y0', y[0] + 'px'); line.style.setProperty('--y1', y[y.length - 1] + 'px'); place(y[cur]); };
  const pick = n => {
    cur = n; layout();
    items.forEach((it, m) => it.classList.toggle('on', m === n));
    btns.forEach((b, m) => b.setAttribute('aria-pressed', m === n));
    [...stack.children].forEach((c, m) => { if (c.classList.contains('on') !== (m === n)) c.classList.toggle('on', m === n); });
    const r = stack.getBoundingClientRect();
    if (r.bottom < 80 || r.top > innerHeight) stack.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  };
  items.forEach((it, n) => it.addEventListener('click', () => { if (n !== cur) pick(n); }));
  let drag = false;
  const at = e => { const y = ys(), top = rail.getBoundingClientRect().top; return Math.min(y[y.length - 1], Math.max(y[0], e.clientY - top)); };
  star.addEventListener('pointerdown', e => { drag = true; star.setPointerCapture(e.pointerId); star.classList.add('drag'); e.preventDefault(); });
  star.addEventListener('pointermove', e => { if (drag) place(at(e)); });
  const end = e => { if (!drag) return; drag = false; star.classList.remove('drag'); const v = at(e), y = ys(); let best = 0; y.forEach((q, m) => { if (Math.abs(q - v) < Math.abs(y[best] - v)) best = m; }); best === cur ? layout() : pick(best); };
  star.addEventListener('pointerup', end); star.addEventListener('pointercancel', end);
  new ResizeObserver(layout).observe(rail);
  layout();
});
// ---------- slide decks inside the Work panels: arrows step through the slides ----------
document.querySelectorAll('.sk-deck').forEach(d => {
  const slides = [...d.querySelectorAll('.deck-track img')], count = d.querySelector('.deck-count');
  let i = 0;
  const go = k => { i = (k + slides.length) % slides.length; slides.forEach((s, n) => s.classList.toggle('on', n === i)); count.textContent = (i + 1) + ' / ' + slides.length; };
  d.querySelectorAll('.deck-btn').forEach(b => b.addEventListener('click', () => go(i + +b.dataset.dir)));
});
// ---------- YouTube: a still and a play button; the player (privacy-enhanced mode) only loads on click ----------
document.querySelectorAll('.yt[data-yt]').forEach(b => b.addEventListener('click', () => {
  const f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
  f.title = b.dataset.title; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
  f.className = 'yt-frame'; b.replaceWith(f);
}));
// ---------- slide viewer: click a slide (or the enlarge button) to read it full screen; arrows, keys and swipe step through ----------
(() => {
  const decks = [...document.querySelectorAll('.sk-deck')]; if (!decks.length || !window.HTMLDialogElement) return;
  const T = { en: { open: 'Enlarge slide', prev: 'Previous slide', next: 'Next slide', close: 'Close', turn: 'Turn your phone sideways to read the slides' },
              fr: { open: 'Agrandir la diapositive', prev: 'Diapositive précédente', next: 'Diapositive suivante', close: 'Fermer', turn: 'Tournez votre téléphone pour lire les diapositives' } };
  const t = k => (T[lang] || T.fr)[k];
  const lb = document.createElement('dialog'); lb.className = 'lb';
  lb.innerHTML = '<button type="button" class="lb-x">✕</button><figure class="lb-fig"><img class="lb-img" alt=""></figure>'
    + '<div class="lb-nav"><button type="button" class="lb-btn" data-dir="-1">←</button><span class="lb-count" aria-live="polite"></span><button type="button" class="lb-btn" data-dir="1">→</button></div><p class="lb-turn"></p>';
  document.body.appendChild(lb);
  const img = lb.querySelector('.lb-img'), count = lb.querySelector('.lb-count'), btns = lb.querySelectorAll('.lb-btn');
  let slides = [], i = 0, deck = null;
  const label = () => { lb.setAttribute('aria-label', t('open')); lb.querySelector('.lb-x').setAttribute('aria-label', t('close'));
    btns[0].setAttribute('aria-label', t('prev')); btns[1].setAttribute('aria-label', t('next')); lb.querySelector('.lb-turn').textContent = t('turn');
    decks.forEach(d => { const z = d.querySelector('.deck-zoom'); if (z) z.setAttribute('aria-label', t('open')); }); };
  const show = k => { i = (k + slides.length) % slides.length; const s = slides[i];
    img.src = s.currentSrc || s.src; img.alt = s.alt; count.textContent = (i + 1) + ' / ' + slides.length;
    // keep the small deck in step, so closing lands on the same slide
    const b = deck.querySelectorAll('.deck-btn'); let guard = 0; while (+deck.querySelector('.deck-count').textContent.split(' / ')[0] - 1 !== i && guard++ < slides.length) b[1].click(); };
  const open = (d, k) => { deck = d; slides = [...d.querySelectorAll('.deck-track img')]; slides.forEach(s => { s.loading = 'eager'; }); label(); show(k); lb.showModal(); document.documentElement.classList.add('lb-open'); };
  lb.addEventListener('close', () => { document.documentElement.classList.remove('lb-open'); const z = deck && (deck.hidden ? deck.closest('.sk-case').querySelector('.cs-slides') : deck.querySelector('.deck-zoom')); if (z) z.focus(); });
  lb.querySelector('.lb-x').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-fig')) lb.close(); });
  btns.forEach(b => b.addEventListener('click', () => show(i + +b.dataset.dir)));
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1); });
  let x0 = null;
  img.addEventListener('pointerdown', e => { x0 = e.clientX; });
  img.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); });
  decks.forEach(d => {
    const track = d.querySelector('.deck-track'), z = document.createElement('button');
    z.type = 'button'; z.className = 'deck-zoom';
    z.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    d.querySelector('.deck-nav').insertBefore(z, d.querySelector('.deck-count').nextSibling);
    const cur = () => +d.querySelector('.deck-count').textContent.split(' / ')[0] - 1;
    z.addEventListener('click', () => open(d, cur()));
    track.addEventListener('click', () => open(d, cur()));
  });
  label();
  document.querySelectorAll('[data-lang-btn]').forEach(b => b.addEventListener('click', () => setTimeout(label, 0)));
})();
// ---------- master's cases: problem, process, data, solution as four steps; the full slides open in the viewer ----------
document.querySelectorAll('.cs').forEach(cs => {
  const steps = [...cs.querySelectorAll('.cs-step')], panes = [...cs.querySelectorAll('.cs-pane')];
  const go = n => {
    steps.forEach((s, k) => { s.classList.toggle('on', k === n); s.classList.toggle('done', k < n); s.setAttribute('aria-pressed', k === n); });
    panes.forEach((p, k) => p.classList.toggle('on', k === n));
  };
  steps.forEach((s, k) => s.addEventListener('click', () => go(k)));
  cs.querySelectorAll('.cs-next').forEach(b => b.addEventListener('click', () => { const n = +b.dataset.go; go(n); steps[n].focus({ preventScroll: true }); }));
  const z = () => cs.parentElement.querySelector('.cs-deck .deck-zoom');
  cs.querySelector('.cs-slides').addEventListener('click', () => { const b = z(); if (b) b.click(); });
});
// ---------- dialogs ("Relevant award"): open from their button, close on the ✕, Escape or a click outside ----------
document.querySelectorAll('[aria-haspopup="dialog"][aria-controls]').forEach(b => {
  const dlg = document.getElementById(b.getAttribute('aria-controls'));
  if (!dlg || !dlg.showModal) return;
  // the dialog grows out of the button that opened it
  b.addEventListener('click', () => { dlg._opener = b; dlg.showModal(); const r = dlg.getBoundingClientRect(), o = b.getBoundingClientRect();
    dlg.style.transformOrigin = (o.left + o.width / 2 - r.left) + 'px ' + (o.top + o.height / 2 - r.top) + 'px'; });
  dlg.querySelector('.dlg-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { if (dlg._opener === b) b.focus(); });
});
// award pop-up: "See the certificate" swipes the certificate in where the phone was, and back
document.querySelectorAll('.dlg-cert-btn').forEach(b => {
  const dlg = b.closest('.dlg'), pics = dlg.querySelector('.dlg-pics');
  const set = on => { dlg.classList.toggle('show-cert', on); b.setAttribute('aria-pressed', on); };
  b.addEventListener('click', () => {
    set(!dlg.classList.contains('show-cert'));
    if (pics.getBoundingClientRect().top < 0) pics.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
  dlg.addEventListener('close', () => set(false));
});
// aria-labels that follow the language
const ariaLang = () => document.querySelectorAll('[data-aria-en][data-aria-fr]').forEach(el => el.setAttribute('aria-label', el.dataset['aria' + (document.documentElement.lang === 'fr' ? 'Fr' : 'En')]));
ariaLang(); document.querySelectorAll('[data-lang-btn]').forEach(b => b.addEventListener('click', () => setTimeout(ariaLang)));

// ---------- "See the proof" links: open the right Work chapter (and example), then glide to it ----------
const smooth = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
document.querySelectorAll('.see-link[data-tab],.sx-link[data-tab]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const tab = document.getElementById('skTab' + a.dataset.tab); if (tab) tab.click();
  if (a.dataset.ex) { const panel = document.getElementById('skPanel' + a.dataset.tab), pick = panel && panel.querySelectorAll('.sk-pick')[+a.dataset.ex]; if (pick) pick.click(); }
  document.getElementById('work').scrollIntoView({ behavior: smooth(), block: 'start' });
}));
// ---------- Skills: filter by type, the count follows ----------
(function () {
  const sec = document.getElementById('skills'); if (!sec) return;
  const fs = [...sec.querySelectorAll('.sx-f')], items = [...sec.querySelectorAll('.sx-item')], n = sec.querySelector('.sx-count b');
  // tiles come in one after another (30ms apart): first when the grid scrolls into view, then after each filter
  const grid = sec.querySelector('.sx-grid');
  const order = () => { let k = 0; items.forEach(it => { if (!it.hidden) it.style.setProperty('--k', k++); }); };
  order();
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { grid.classList.add('sx-in'); io.disconnect(); } }, { threshold: 0 });
  io.observe(grid);
  fs.forEach(f => f.addEventListener('click', () => {
    const k = f.dataset.t; let c = 0;
    fs.forEach(g => g.setAttribute('aria-pressed', g === f));
    items.forEach(it => { const on = k === 'all' || it.dataset.t === k; it.hidden = !on; c += on; });
    n.textContent = c; order();
    const w = n.nextElementSibling; if (w) { w.dataset.en = c === 1 ? 'skill' : 'skills'; w.dataset.fr = c === 1 ? 'compétence' : 'compétences'; w.textContent = w.dataset[document.documentElement.lang === 'en' ? 'en' : 'fr']; }
  }));
})();
// ---------- career timeline (year grid): click a bar to fade in its story; "What happened next?" walks through them in order ----------
(function () {
  const sec = document.getElementById('resume'), tl = document.getElementById('tl'); if (!tl) return;
  const items = [...tl.querySelectorAll('.tl-item,.tl-cv')], walk = () => [...new Set(items.filter(b => !b.hasAttribute('data-side') && b.offsetParent).map(b => +b.dataset.i))], hint = document.getElementById('loHint'), next = document.getElementById('loNext');
  const cards = [...sec.querySelectorAll('.lo-card')];
  // each name goes inside its bar if it fits, beside the bar if there is room before the next entry, otherwise beneath
  const fit = () => {
    if (getComputedStyle(tl).display !== 'grid') return;
    const mo = (tl.clientWidth - 112) / 112;
    tl.querySelectorAll('.tl-item').forEach(b => {
      const bar = b.querySelector('.tl-bar'), txt = b.querySelector(':scope > .tl-txt'); if (!bar) return;
      b.classList.remove('in', 'side'); txt.style.maxWidth = '';
      const n = bar.querySelector('.tl-in-name'), w = bar.querySelector('.tl-in-when'), pad = parseFloat(getComputedStyle(bar).paddingLeft) + 10;
      // a bar with event stars keeps its name below it, so the stars never sit on the text
      if (!b.querySelector('.tl-ev') && Math.max(n.scrollWidth, w.scrollWidth) <= bar.clientWidth - pad) { b.classList.add('in'); return; }
      const room = (+b.style.getPropertyValue('--room')) * mo - b.offsetWidth - 14;
      if (room >= 150) { b.classList.add('side'); txt.style.maxWidth = room + 'px'; }
      else txt.style.maxWidth = (+b.style.getPropertyValue('--room')) * mo - 10 + 'px';
    });
    tl.querySelectorAll('.tl-flag').forEach(b => { b.querySelector('.tl-txt').style.maxWidth = (+b.style.getPropertyValue('--room')) * mo - 18 + 'px'; });
  };
  new ResizeObserver(fit).observe(tl); fit();
  document.addEventListener('click', e => { if (e.target.closest('[data-lang-btn]')) setTimeout(fit, 0); });
  let cur = -1;
  // side stories (volunteering, the world on hold) open on click but are not steps of the walk; "next" from one goes to the first step that starts after it
  const cs = i => +items.find(b => +b.dataset.i === i).style.getPropertyValue('--cs');
  // the walk only visits the moments on screen (phones show the main ones)
  const after = i => { const order = walk(), k = order.findIndex(j => cs(j) > cs(i)); return k < 0 ? 0 : k; };
  const label = () => { const order = walk(), k = order.indexOf(cur); next.dataset.mode = cur < 0 ? 'start' : (k === order.length - 1 ? 'again' : 'next'); };
  const open = i => {
    cur = i;
    items.forEach(b => b.setAttribute('aria-expanded', +b.dataset.i === i));
    cards.forEach(c => { c.hidden = c.id !== 'lore' + i; });
    hint.hidden = i >= 0; label();
  };
  items.forEach(b => b.addEventListener('click', () => open(+b.dataset.i)));
  next.addEventListener('click', () => { const order = walk(), k = order.indexOf(cur); open(order[cur < 0 ? 0 : k < 0 ? after(cur) : k === order.length - 1 ? 0 : k + 1]); });
  label();
})();
// ---------- references: kept in English; the link swaps in the French translation and back ----------
document.querySelectorAll('.rf-tr').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true', f = b.closest('.rf');
  b.setAttribute('aria-pressed', on);
  f.querySelectorAll('.rf-en').forEach(e => { e.hidden = on; });
  f.querySelectorAll('.rf-fr').forEach(e => { e.hidden = !on; });
}));
// references: the full letter excerpt opens under the highlights
document.querySelectorAll('.rf-more').forEach(b => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', on); b.closest('.rf').classList.toggle('open', on);
}));
// ---------- journey tracker: shows where the reader is on the page's journey (display only, not a menu) ----------
(function () {
  const jt = document.getElementById('jt'); if (!jt) return;
  const stops = [...jt.querySelectorAll('.jt-stop')], labs = [...jt.querySelectorAll('.jt-lab')], secs = stops.map(s => document.getElementById(s.dataset.for));
  let last = -1;
  const update = () => {
    let i = 0; secs.forEach((s, m) => { if (s && s.getBoundingClientRect().top <= innerHeight * .45) i = m; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) i = secs.length - 1;
    if (i === last) return; last = i;
    stops.forEach((s, m) => { s.classList.toggle('on', m === i); s.classList.toggle('past', m < i); });
    labs.forEach((l, m) => l.classList.toggle('on', m === i));
  };
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
})();

// ---------- marketing stack: "What's in my bag" ----------
(function(){
  const st=document.getElementById('bgStage'); if(!st) return;
  const btn=document.getElementById('bgOpen'), its=[...st.querySelectorAll('.bg-thing,.bg-hob,.bg-it')], bag=st.querySelector('.bg-bag');
  const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // every tool is aimed at the mouth of the bag (the tools' final places are already laid out, just not shown)
  const aim=()=>{const b=bag.getBoundingClientRect(),mx=b.left+b.width/2,my=b.top+b.height*.5;
    its.forEach((it,i)=>{const r=(it.querySelector('.bg-tile')||it).getBoundingClientRect();
      it.style.setProperty('--dx',(mx-(r.left+r.width/2))+'px');it.style.setProperty('--dy',(my-(r.top+r.height/2))+'px');
      it.style.setProperty('--k',i);it.style.setProperty('--j',its.length-1-i);});};
  let timer=0;
  btn.addEventListener('click',()=>{
    clearTimeout(timer);
    const open=btn.getAttribute('aria-expanded')!=='true';
    btn.setAttribute('aria-expanded',open);
    if(open){st.classList.remove('closing');aim();st.classList.add('open');return;}
    if(still){st.classList.remove('open');return;}
    aim();st.classList.add('closing');st.classList.remove('open');
    // the drawer folds up once the last tool is back in the bag
    st.querySelector('.bg-drawer').style.gridTemplateRows='1fr';
    timer=setTimeout(()=>{st.querySelectorAll('.bg-thing').forEach(t=>{t.classList.remove('settle');t.style.translate='';t.style.zIndex=t.dataset.z||'';});st.classList.remove('closing');st.querySelector('.bg-drawer').style.gridTemplateRows='';},560+its.length*30);
  });
  // drag the things around once they are out of the bag
  const sec=st.closest('section'), things=[...st.querySelectorAll('.bg-thing')]; let z=10;
  things.forEach(t=>{
    t.dataset.z=t.style.zIndex;
    let sx=0,sy=0,ox=0,oy=0,id=null;
    const pos=()=>{const m=(t.style.translate||'0px 0px').split(' ');return [parseFloat(m[0])||0,parseFloat(m[1])||0];};
    t.addEventListener('pointerdown',e=>{
      if(!st.classList.contains('open'))return;
      id=e.pointerId;t.setPointerCapture(id);[ox,oy]=pos();sx=e.clientX;sy=e.clientY;
      t.classList.remove('settle');t.classList.add('held');t.style.zIndex=++z;e.preventDefault();
    });
    t.addEventListener('pointermove',e=>{
      if(e.pointerId!==id)return;
      let nx=ox+e.clientX-sx, ny=oy+e.clientY-sy;
      // past the edge of the section it resists, like a rubber band
      const s=sec.getBoundingClientRect(), r=t.getBoundingClientRect(), cx=nx-pos()[0], cy=ny-pos()[1];
      const over=(lo,hi,a,b)=>a<lo?(a-lo):b>hi?(b-hi):0;
      const dx=over(s.left,s.right,r.left+cx,r.right+cx), dy=over(s.top,s.bottom,r.top+cy,r.bottom+cy);
      nx-=dx*.65; ny-=dy*.65;
      t.style.translate=nx+'px '+ny+'px';
    });
    const drop=e=>{
      if(e.pointerId!==id)return; id=null; t.classList.remove('held');
      const s=sec.getBoundingClientRect(), r=t.getBoundingClientRect(); let [nx,ny]=pos();
      if(r.left<s.left)nx+=s.left-r.left; if(r.right>s.right)nx-=r.right-s.right;
      if(r.top<s.top)ny+=s.top-r.top; if(r.bottom>s.bottom)ny-=r.bottom-s.bottom;
      t.classList.add('settle'); t.style.translate=nx+'px '+ny+'px';
    };
    t.addEventListener('pointerup',drop); t.addEventListener('pointercancel',drop);
  });
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){st.classList.add('hello');io.disconnect();}},{threshold:.6});
  io.observe(bag);
})();

// ---------- "What's in my bag": the hidden-hobby pill drops a sticky note on the bag; the pill, a click on the note or Esc takes it off ----------
(function () {
  const b = document.getElementById('bgHobby'), n = document.getElementById('bgNote'); if (!b) return;
  const set = on => { n.classList.toggle('on', on); b.setAttribute('aria-pressed', on); };
  b.addEventListener('click', () => set(!n.classList.contains('on')));
  n.addEventListener('click', () => set(false));
  // closing the bag puts the note away too
  document.getElementById('bgOpen').addEventListener('click', e => { if (e.currentTarget.getAttribute('aria-expanded') !== 'true') set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && n.classList.contains('on')) set(false); });
})();

// ---------- frameworks and methods: hover, focus or tap a chip to read what it means in plain words ----------
(() => {
  const tip = document.getElementById('fwTip'); if (!tip) return;
  const chips = [...document.querySelectorAll('.fw-chip')];
  let cur = null, hideT = 0;
  const place = c => {
    const r = c.getBoundingClientRect(), t = tip.getBoundingClientRect(), pad = 16, top0 = (document.querySelector('.head')?.offsetHeight || 0) + 8;
    let x = r.left + r.width / 2 - t.width / 2; x = Math.max(pad, Math.min(x, innerWidth - pad - t.width));
    let y = r.top - t.height - 10, below = y < top0; if (below) y = r.bottom + 10;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    tip.style.transformOrigin = (r.left + r.width / 2 - x) + 'px ' + (below ? '0' : '100%');
  };
  const show = c => {
    clearTimeout(hideT);
    if (cur && cur !== c) cur.classList.remove('on');
    cur = c; c.classList.add('on');
    tip.textContent = c.dataset[document.documentElement.lang === 'en' ? 'tipEn' : 'tipFr'];
    tip.hidden = false; place(c);
    requestAnimationFrame(() => tip.classList.add('on'));
  };
  const hide = () => {
    if (!cur) return; cur.classList.remove('on'); cur = null;
    tip.classList.remove('on'); hideT = setTimeout(() => { if (!cur) tip.hidden = true; }, 130);
  };
  // phones: no floating tooltip; each chip opens its meaning in place, and the whole list folds into one row
  const phone = matchMedia('(max-width:767px)');
  const fw = document.querySelector('.sx-fw'), tog = fw && fw.querySelector('.sx-fw-tog');
  if (tog) tog.addEventListener('click', () => { const o = !fw.classList.contains('open'); fw.classList.toggle('open', o); tog.setAttribute('aria-expanded', o); });
  const syncDefs = () => chips.forEach(c => { const d = document.getElementById(c.getAttribute('aria-controls')); if (!d) return;
    if (phone.matches) c.setAttribute('aria-expanded', d.hidden ? 'false' : 'true'); else { c.removeAttribute('aria-expanded'); d.hidden = true; } });
  phone.addEventListener('change', () => { hide(); syncDefs(); }); syncDefs();
  chips.forEach(c => {
    c.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !phone.matches) show(c); });
    c.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && !phone.matches) hide(); });
    c.addEventListener('focus', () => { if (!phone.matches) show(c); });
    c.addEventListener('blur', hide);
    c.addEventListener('click', () => {
      if (phone.matches) { const d = document.getElementById(c.getAttribute('aria-controls')); if (d) { d.hidden = !d.hidden; c.setAttribute('aria-expanded', !d.hidden); } return; }
      if (cur === c && document.activeElement !== c) hide(); else show(c);
    });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  addEventListener('scroll', () => { if (cur) place(cur); }, { passive: true });
  addEventListener('resize', hide);
  document.addEventListener('pointerdown', e => { if (cur && !e.target.closest('.fw-chip')) hide(); });
})();

// ---------- Marketer off duty: an instant camera. Each click prints the next photo: it slides out of the slot,
// rises out of the slot on top, develops (dark to clear), then lands on top of the pile. The window on the camera counts the photos left.
(function(){
  const cam=document.getElementById('cam'), board=document.getElementById('offBoard'), play=document.getElementById('offPlay'); if(!cam||!board||!play) return;
  const pols=[...board.querySelectorAll('.pol')], live=document.getElementById('camLive');
  const num=cam.querySelector('.cam-n'), slot=cam.querySelector('.cam-slot'), left=document.querySelector('.cam-left');
  const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches, E='cubic-bezier(.2,.7,.2,1)';
  let n=0, z=0, cur=null, t1=0, t2=0;
  document.documentElement.classList.add('js-cam');
  const say=(en,fr)=>{live.textContent=lang==='fr'?fr:en;};
  const label=(el,en,fr)=>{el.dataset.en=en;el.dataset.fr=fr;el.textContent=el.dataset[lang];};
  const count=()=>{const k=pols.length-n;num.textContent=k;
    label(left,k===0?'All photos printed':k+(k===1?' photo left':' photos left'),k===0?'Toutes les photos sont sorties':k+(k===1?' photo restante':' photos restantes'));};
  const top=p=>{p.style.zIndex=++z;board.classList.add('has');};
  const empty=()=>{pols.forEach(p=>{p.classList.add('pol-wait');p.classList.remove('pol-dev','pol-on');p.style.zIndex='';});board.classList.remove('has');z=0;};
  empty();
  const land=()=>{ if(!cur) return; clearTimeout(t1); clearTimeout(t2);
    const p=cur, c=p.querySelector('.pol-card'); cur=null; top(p);
    c.style.transition=`transform .45s ${E}`; c.style.transform=''; c.style.clipPath='';
    t2=setTimeout(()=>{c.style.transition='';c.style.transformOrigin='';p.classList.remove('pol-dev','pol-on');},470);};
  const shoot=()=>{
    land();
    if(n>=pols.length){ empty(); n=0; count(); say('New film loaded.','Nouvelle pellicule.'); return; }
    board.classList.add('has'); // phones keep the board folded until the first photo, so it opens before the print is measured
    const p=pols[n++]; count();
    const t=p.querySelector('.pol-cap').textContent; say(`Photo ${n} of ${pols.length}: ${t}`,`Photo ${n} sur ${pols.length}\u00a0: ${t}`);
    if(still()){ p.classList.remove('pol-wait'); top(p); return; }
    cam.classList.remove('flash'); void cam.offsetWidth; cam.classList.add('flash');
    const c=p.querySelector('.pol-card'), r=c.getBoundingClientRect(), s0=slot.getBoundingClientRect();
    const s=Math.min(1,(s0.width*.92)/r.width), tx=s0.left+s0.width/2-(r.left+r.width/2), ty=s0.top+s0.height/2-r.top;
    c.style.transition='none'; c.style.transformOrigin='50% 0';
    // the film slot is on top, like a real Instax: the print rises out of it, its lower part still hidden inside the camera
    c.style.transform=`translate(${tx}px,${ty}px) scale(${s})`; c.style.clipPath='inset(0 0 100% 0)';
    p.classList.remove('pol-wait'); p.classList.add('pol-dev'); void c.offsetWidth;
    c.style.transition=`transform .6s ${E},clip-path .6s ${E}`;
    c.style.transform=`translate(${tx}px,${ty-r.height*s}px) scale(${s})`; c.style.clipPath='inset(0 0 0 0)';
    requestAnimationFrame(()=>p.classList.add('pol-on'));
    cur=p; t1=setTimeout(land,1300);
  };
  cam.addEventListener('click',shoot);
  addEventListener('resize',land);
})();

// ---------- contact: the address is put together on click, so it never sits in the page ----------
document.querySelectorAll('[data-mail]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); location.href = 'mailto:' + ['portfolio.vs.contact', 'icloud.com'].join('@'); }));
