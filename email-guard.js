// Builds the email address in the browser instead of writing it in
// the HTML, so spam bots that harvest addresses from page source
// don't find it. Links marked data-email become mailto: links;
// elements marked data-email-text show the address.
(function () {
  var address = ['vsoldate', 'icloud.com'].join('@');
  document.querySelectorAll('[data-email]').forEach(function (a) {
    a.setAttribute('href', 'mailto:' + address);
  });
  document.querySelectorAll('[data-email-text]').forEach(function (el) {
    el.textContent = address;
  });
})();
