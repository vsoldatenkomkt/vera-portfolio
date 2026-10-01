// ============================================================
// CV DOWNLOAD FORM: every CV link (any <a download> pointing at a
// .pdf) asks for a name and email first. They're sent to a Google
// Apps Script that adds a line to a private text file in Google
// Drive, then the download starts. Someone who has filled it in
// once isn't asked again in that browser.
//
// Loaded by index.html and technical-marketing.html. To point it at
// a new Apps Script deployment, only ENDPOINT needs to change.
// ============================================================
(function () {
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzm3Gs4oJj4fzPtIQCeBYCGvEtqUMJIfKyY5I-TueaPmJG_Jwo0XgCGkZeX_AJlhv8I/exec';
  var DONE_KEY = 'cv-form-done';
  var PAGE = /technical-marketing/.test(location.pathname) ? 'technical-marketing' : 'main';

  var TEXT = {
    en: {
      title: 'Download my CV',
      intro: 'Just your name and email, then the download starts.',
      name: 'Name',
      email: 'Email',
      notice: 'Your details are only used to follow up on your interest in my profile. They stay private and are deleted on request.',
      submit: 'Download CV',
      sending: 'Starting download…',
      cancel: 'Cancel',
      checking: 'Checking…',
      invalid: "This email address doesn't seem to exist. Please check it.",
      disposable: 'Please use a permanent email address, not a temporary one.',
      typo: 'Did you mean ',
      typoEnd: '?'
    },
    fr: {
      title: 'Télécharger mon CV',
      intro: 'Votre nom et votre e-mail, puis le téléchargement démarre.',
      name: 'Nom',
      email: 'E-mail',
      notice: 'Vos coordonnées servent uniquement à donner suite à votre intérêt pour mon profil. Elles restent confidentielles et sont supprimées sur simple demande.',
      submit: 'Télécharger le CV',
      sending: 'Téléchargement en cours…',
      cancel: 'Annuler',
      checking: 'Vérification…',
      invalid: 'Cette adresse e-mail ne semble pas exister. Merci de la vérifier.',
      disposable: "Merci d'utiliser une adresse e-mail permanente, pas une adresse temporaire.",
      typo: 'Vouliez-vous dire ',
      typoEnd: ' ?'
    },
    ru: {
      title: 'Скачать моё резюме',
      intro: 'Укажите имя и email, и загрузка начнётся.',
      name: 'Имя',
      email: 'Email',
      notice: 'Ваши данные используются только для того, чтобы связаться с вами по поводу моей кандидатуры. Они не передаются третьим лицам и удаляются по запросу.',
      submit: 'Скачать резюме',
      sending: 'Начинаю загрузку…',
      cancel: 'Отмена',
      checking: 'Проверка…',
      invalid: 'Похоже, такой email не существует. Пожалуйста, проверьте адрес.',
      disposable: 'Пожалуйста, укажите постоянный email, а не временный.',
      typo: 'Вы имели в виду ',
      typoEnd: '?'
    }
  };

  // Common misspellings of big providers, answered with "Did you mean...?"
  var TYPOS = {
    'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com',
    'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmaill.com': 'gmail.com',
    'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.fr': 'gmail.com',
    'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.co': 'hotmail.com',
    'hotmail.con': 'hotmail.com', 'hotmial.fr': 'hotmail.fr',
    'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.co': 'outlook.com',
    'outlook.con': 'outlook.com', 'outlok.fr': 'outlook.fr',
    'yaho.com': 'yahoo.com', 'yahoo.con': 'yahoo.com', 'yaho.fr': 'yahoo.fr',
    'iclod.com': 'icloud.com', 'icloud.co': 'icloud.com', 'icloud.con': 'icloud.com',
    'orange.f': 'orange.fr', 'oranges.fr': 'orange.fr', 'wanadoo.f': 'wanadoo.fr'
  };

  // Throwaway inbox services. Subdomains count too (e.g. x.yopmail.com).
  var DISPOSABLE = [
    'yopmail.com', 'yopmail.fr', 'yopmail.net', 'jetable.org', 'mailinator.com',
    'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', 'grr.la',
    '10minutemail.com', 'temp-mail.org', 'tempmail.com', 'tempmail.net', 'tempail.com',
    'trashmail.com', 'trashmail.de', 'getnada.com', 'dispostable.com', 'maildrop.cc',
    'throwawaymail.com', 'fakeinbox.com', 'mailnesia.com', 'mintemail.com',
    'emailondeck.com', 'moakt.com', 'burnermail.io', 'mohmal.com', 'discard.email',
    'tempr.email', 'spamgourmet.com', 'mailcatch.com', 'mytemp.email', 'inboxkitten.com'
  ];

  function isDisposable(domain) {
    return DISPOSABLE.some(function (d) { return domain === d || domain.slice(-(d.length + 1)) === '.' + d; });
  }

  // Asks a public DNS service whether the domain is set up to receive
  // email (has MX records). Only a clear "no" rejects: if the lookup
  // fails or is slow, the visitor gets the benefit of the doubt.
  function domainReceivesMail(domain) {
    var lookup = fetch('https://dns.google/resolve?name=' + encodeURIComponent(domain) + '&type=MX')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.Status === 3) return false;
        if (d.Status !== 0) return true;
        var mx = (d.Answer || []).filter(function (a) { return a.type === 15; });
        if (!mx.length) return false;
        return mx.some(function (a) { return !/^0\s+\.?$/.test(String(a.data).trim()); });
      })
      .catch(function () { return true; });
    var timeout = new Promise(function (resolve) { setTimeout(function () { resolve(true); }, 3500); });
    return Promise.race([lookup, timeout]);
  }

  var CSS =
    '.cv-form-overlay{position:fixed;inset:0;background:rgba(20,24,28,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:70}' +
    '.cv-form-overlay[hidden]{display:none}' +
    '.cv-form{width:min(400px,100%);background:var(--color-bg);color:var(--color-text);border:1px solid var(--color-border);border-radius:14px;box-shadow:0 18px 48px rgba(0,0,0,.2);padding:24px;font-family:var(--font-body)}' +
    '.cv-form h3{margin:0 0 6px;font-size:18px;color:var(--color-accent)}' +
    '.cv-form-intro{margin:0 0 18px;font-size:14px;color:var(--color-text-muted)}' +
    '.cv-form label{display:block;margin:0 0 12px;font-size:13px;font-weight:600}' +
    '.cv-form input{display:block;width:100%;margin-top:6px;padding:10px 12px;font:inherit;font-weight:400;font-size:15px;color:var(--color-text);background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px}' +
    '.cv-form input:focus{outline:2px solid var(--color-accent);outline-offset:1px}' +
    '.cv-form-trap{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}' +
    '.cv-form-error{margin:-4px 0 12px;font-size:13px;color:#B3261E}' +
    'html.dark-mode .cv-form-error{color:#F2B8B5}' +
    '.cv-form-error[hidden]{display:none}' +
    '.cv-form-error button{padding:0;border:0;background:none;font:inherit;font-weight:600;color:var(--color-accent);text-decoration:underline;cursor:pointer}' +
    '.cv-form-notice{margin:4px 0 18px;font-size:12px;line-height:1.5;color:var(--color-text-muted)}' +
    '.cv-form-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
    '.cv-form-actions .btn{cursor:pointer;font-family:inherit}' +
    '.cv-form-actions .btn[disabled]{opacity:.7;cursor:default;transform:none}';

  function isDone() {
    try { return localStorage.getItem(DONE_KEY) === '1'; } catch (e) { return false; }
  }

  function markDone() {
    try { localStorage.setItem(DONE_KEY, '1'); } catch (e) {}
  }

  function currentLang() {
    var lang = document.documentElement.getAttribute('lang');
    return TEXT[lang] ? lang : 'en';
  }

  function startDownload(link) {
    var a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.setAttribute('download', link.getAttribute('download') || '');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  var overlay, form, title, intro, nameLabel, emailLabel, nameInput, emailInput, trapInput, errorBox, notice, submitBtn, cancelBtn;
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
        '<label><span data-cv-name-label></span><input type="text" name="name" autocomplete="name" maxlength="100" required></label>' +
        '<label><span data-cv-email-label></span><input type="email" name="email" autocomplete="email" maxlength="200" required></label>' +
        '<div class="cv-form-trap" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>' +
        '<p class="cv-form-error" role="alert" hidden></p>' +
        '<p class="cv-form-notice"></p>' +
        '<div class="cv-form-actions">' +
          '<button type="button" class="btn btn-secondary" data-cv-cancel></button>' +
          '<button type="submit" class="btn btn-primary" data-cv-submit></button>' +
        '</div>' +
      '</form>';
    document.body.appendChild(overlay);

    form = overlay.querySelector('form');
    title = form.querySelector('h3');
    intro = form.querySelector('.cv-form-intro');
    nameLabel = form.querySelector('[data-cv-name-label]');
    emailLabel = form.querySelector('[data-cv-email-label]');
    nameInput = form.querySelector('input[name="name"]');
    emailInput = form.querySelector('input[name="email"]');
    trapInput = form.querySelector('input[name="website"]');
    errorBox = form.querySelector('.cv-form-error');
    notice = form.querySelector('.cv-form-notice');
    submitBtn = form.querySelector('[data-cv-submit]');
    cancelBtn = form.querySelector('[data-cv-cancel]');

    cancelBtn.addEventListener('click', close);
    emailInput.addEventListener('input', clearError);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) close();
    });
    form.addEventListener('submit', submit);
  }

  function open(link) {
    if (!overlay) build();
    var t = TEXT[currentLang()];
    title.textContent = t.title;
    intro.textContent = t.intro;
    nameLabel.textContent = t.name;
    emailLabel.textContent = t.email;
    notice.textContent = t.notice;
    submitBtn.textContent = t.submit;
    submitBtn.disabled = false;
    cancelBtn.textContent = t.cancel;
    clearError();
    pendingLink = link;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    nameInput.focus();
  }

  function close() {
    overlay.hidden = true;
    pendingLink = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function clearError() {
    errorBox.hidden = true;
    errorBox.textContent = '';
    emailInput.removeAttribute('aria-invalid');
  }

  function showError(message, suggestion) {
    errorBox.textContent = message;
    if (suggestion) {
      var fix = document.createElement('button');
      fix.type = 'button';
      fix.textContent = suggestion;
      fix.addEventListener('click', function () {
        emailInput.value = suggestion;
        clearError();
        emailInput.focus();
      });
      errorBox.appendChild(fix);
      errorBox.appendChild(document.createTextNode(TEXT[currentLang()].typoEnd));
    }
    errorBox.hidden = false;
    emailInput.setAttribute('aria-invalid', 'true');
    emailInput.focus();
  }

  function resetSubmit() {
    submitBtn.disabled = false;
    submitBtn.textContent = TEXT[currentLang()].submit;
  }

  function submit(e) {
    e.preventDefault();
    var link = pendingLink;
    if (!link) return;
    var t = TEXT[currentLang()];
    var email = emailInput.value.trim();
    var at = email.lastIndexOf('@');
    var local = email.slice(0, at);
    var domain = email.slice(at + 1).toLowerCase();

    if (at < 1 || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) return showError(t.invalid);
    if (TYPOS[domain]) return showError(t.typo, local + '@' + TYPOS[domain]);
    if (isDisposable(domain)) return showError(t.disposable);

    submitBtn.disabled = true;
    submitBtn.textContent = t.checking;

    domainReceivesMail(domain).then(function (ok) {
      if (!ok) {
        resetSubmit();
        return showError(t.invalid);
      }
      submitBtn.textContent = t.sending;
      send(link, email);
    });
  }

  function send(link, email) {
    var body = new URLSearchParams({
      name: nameInput.value.trim(),
      email: email,
      website: trapInput.value,
      cv: link.getAttribute('href'),
      page: PAGE,
      lang: currentLang()
    });

    // no-cors: Apps Script doesn't send CORS headers, and the response
    // isn't needed. A failed request still lets the download happen,
    // so a network hiccup never blocks a recruiter from the CV.
    var request = ENDPOINT
      ? fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: body }).catch(function () {})
      : Promise.resolve();
    var timeout = new Promise(function (resolve) { setTimeout(resolve, 4000); });

    Promise.race([request, timeout]).then(function () {
      markDone();
      close();
      startDownload(link);
    });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[download][href$=".pdf"]');
    if (!link || isDone()) return;
    e.preventDefault();
    open(link);
  });
})();
