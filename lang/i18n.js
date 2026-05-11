(function () {
  'use strict';

  const translations = {};
  let ready = false;
  let readyResolve;
  const promise = new Promise(function (resolve) { readyResolve = resolve; });

  var lang = (navigator.language || 'en').split('-')[0];

  async function load() {
    try {
      var res = await fetch('lang/' + lang + '.json');
      if (res.ok) {
        Object.assign(translations, await res.json());
      } else {
        throw new Error();
      }
    } catch (_) {
      try {
        var res = await fetch('lang/en.json');
        if (res.ok) {
          Object.assign(translations, await res.json());
        }
      } catch (_) {}
    }
    ready = true;
    readyResolve();
  }

  function t(key, vars) {
    var keys = key.split('.');
    var val = translations;
    for (var i = 0; i < keys.length; i++) {
      if (val == null || typeof val !== 'object') return key;
      val = val[keys[i]];
    }
    if (val == null) return key;
    if (!vars) return val;
    return val.replace(/\{\{(\w+)\}\}/g, function (_, k) {
      return vars[k] !== undefined ? vars[k] : '{{' + k + '}}';
    });
  }

  function applyTranslations() {
    if (Object.keys(translations).length === 0) return;

    if (translations.meta && translations.meta.title) {
      document.title = translations.meta.title;
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
  }

  load().then(applyTranslations);

  window.i18n = { t: t, promise: promise };
})();
