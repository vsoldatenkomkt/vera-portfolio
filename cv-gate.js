// ============================================================
// CV DOWNLOAD: no name or email. A CV link that offers both files
// (data-cv-fr and data-cv-en) opens a small dialog to pick the
// language (the site's current one is pre-selected), then the
// download starts straight away. A link with a single file just
// downloads.
//
// Each download is logged anonymously to Vera's Google Apps Script:
// which file, the site language and the page. Nothing that identifies
// the visitor is sent. Only the live site logs, so previews and local
// copies don't add lines. The log is fire-and-forget: the download
// never waits for it.
//
// Loaded by index.html. To point it at a new Apps Script deployment,
// only ENDPOINT needs to change.
// ============================================================
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzm3Gs4oJj4fzPtIQCeBYCGvEtqUMJIfKyY5I-TueaPmJG_Jwo0XgCGkZeX_AJlhv8I/exec';
  var IS_LIVE = /(^|\.)vsoldatenko\.fr$/.test(location.hostname);

  var TEXT = {
    en: { title: 'Download my CV', intro: 'Choose the language, then the download starts.', cvLang: 'CV language', langFr: 'French', langEn: 'English', submit: 'Download CV', cancel: 'Cancel' },
    fr: { title: 'Télécharger mon CV', intro: 'Choisissez la langue, puis le téléchargement démarre.', cvLang: 'Langue du CV', langFr: 'Français', langEn: 'Anglais', submit: 'Télécharger le CV', cancel: 'Annuler' },
    ru: { title: 'Скачать моё резюме', intro: 'Выберите язык, и загрузка начнётся.', cvLang: 'Язык резюме', langFr: 'Французский', langEn: 'Английский', submit: 'Скачать резюме', cancel: 'Отмена' }
  };

  var CSS =
    '.cv-form-overlay{position:fixed;inset:0;background:rgba(20,24,28,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:70}' +
    '.cv-form-overlay[hidden]{display:none}' +
    '.cv-form{width:min(400px,100%);background:var(--color-bg);color:var(--color-text);border:1px solid var(--color-border);border-radius:14px;box-shadow:0 18px 48px rgba(0,0,0,.2);padding:24px;font-family:var(--font-body)}' +
    '.cv-form h3{margin:0 0 6px;font-size:18px;color:var(--color-accent)}' +
    '.cv-form-intro{margin:0 0 18px;font-size:14px;color:var(--color-text-muted)}' +
    '.cv-form-lang{margin:0 0 18px;padding:0;border:0}' +
    '.cv-form-lang legend{padding:0;margin:0 0 8px;font-size:13px;font-weight:600}' +
    '.cv-form-lang label{display:inline-flex;align-items:center;gap:8px;min-height:44px;margin:0 18px 0 0;font-weight:400;font-size:15px;cursor:pointer}' +
    '.cv-form-lang input{display:inline-block;width:auto;margin:0;accent-color:var(--color-accent)}' +
    '.cv-form-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
    '.cv-form-actions .btn{cursor:pointer;font-family:inherit}';

  function currentLang() {
    var lang = document.documentElement.getAttribute('lang');
    return TEXT[lang] ? lang : 'en';
  }

  // Anonymous line in the download log: no name, no email.
  function log(href) {
    if (!ENDPOINT || !IS_LIVE) return;
    var body = new URLSearchParams({ name: '', email: '', website: '', cv: href, page: 'main', lang: currentLang() });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, body)) return;
    } catch (e) {}
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', keepalive: true, body: body }).catch(function () {});
  }

  function startDownload(href) {
    log(href);
    var a = document.createElement('a');
    a.href = href;
    a.setAttribute('download', href.split('/').pop());
    a.setAttribute('data-cv-go', '');   // marks our own click so the listener below lets it through (otherwise it loops)
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  var overlay, form, title, intro, langLegend, langFrLabel, langEnLabel, submitBtn, cancelBtn;
  var pendingLink = null;
  var lastFocus = null;

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.className = 'cv-form-overlay';
    overlay.hidden = true;
    overlay.innerHTML =
      '<form class="cv-form" role="dialog" aria-modal="true" aria-labelledby="cv-form-title">' +
        '<h3 id="cv-form-title"></h3>' +
        '<p class="cv-form-intro"></p>' +
        '<fieldset class="cv-form-lang"><legend></legend>' +
          '<label><input type="radio" name="cv-lang" value="fr"><span data-cv-lang-fr></span></label>' +
          '<label><input type="radio" name="cv-lang" value="en"><span data-cv-lang-en></span></label>' +
        '</fieldset>' +
        '<div class="cv-form-actions">' +
          '<button type="button" class="btn btn-secondary" data-cv-cancel></button>' +
          '<button type="submit" class="btn btn-primary" data-cv-submit></button>' +
        '</div>' +
      '</form>';
    document.body.appendChild(overlay);

    form = overlay.querySelector('form');
    title = form.querySelector('h3');
    intro = form.querySelector('.cv-form-intro');
    langLegend = form.querySelector('legend');
    langFrLabel = form.querySelector('[data-cv-lang-fr]');
    langEnLabel = form.querySelector('[data-cv-lang-en]');
    submitBtn = form.querySelector('[data-cv-submit]');
    cancelBtn = form.querySelector('[data-cv-cancel]');

    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) close();
    });
    form.addEventListener('submit', submit);
  }

  function hasChoice(link) {
    return link.hasAttribute('data-cv-fr') && link.hasAttribute('data-cv-en');
  }

  function open(link) {
    if (!overlay) build();
    var t = TEXT[currentLang()];
    title.textContent = t.title;
    intro.textContent = t.intro;
    langLegend.textContent = t.cvLang;
    langFrLabel.textContent = t.langFr;
    langEnLabel.textContent = t.langEn;
    submitBtn.textContent = t.submit;
    cancelBtn.textContent = t.cancel;
    var checked = form.querySelector('input[name="cv-lang"][value="' + (currentLang() === 'fr' ? 'fr' : 'en') + '"]');
    checked.checked = true;
    pendingLink = link;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    checked.focus();
  }

  function close() {
    overlay.hidden = true;
    pendingLink = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function submit(e) {
    e.preventDefault();
    var link = pendingLink;
    if (!link) return;
    var picked = form.querySelector('input[name="cv-lang"]:checked');
    var href = link.getAttribute(picked && picked.value === 'en' ? 'data-cv-en' : 'data-cv-fr');
    close();
    startDownload(href);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[download][href$=".pdf"]:not([data-cv-go])');
    if (!link) return;
    e.preventDefault();
    if (hasChoice(link)) open(link);
    else startDownload(link.getAttribute('href'));
  });
})();
