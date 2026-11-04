/* DTaQ kiosk -> LED adapter. Load AFTER index.js, business.js and kiosk.js. */
(function () {
  'use strict';
  if (window.DTAQ_LED_BRIDGE) return;
  var welcomeLoaded = false;
  function send(type, id = '') {
    id = String(id ?? '').trim();
    const wireType = { rolling: 'ROLLING', welcome: 'WELCOME', employee: 'EMP', weapon: 'WEP', project: 'WEP' }[type];
    if (!wireType || /[|\x00-\x1f]/.test(id)) throw Error('지원하지 않는 LED 명령입니다.');
    const message = `SEND|MSG|${wireType}` + (id && ['EMP', 'WEP'].includes(wireType) ? `|${id}` : '');
    // Prefer a host-provided function; otherwise use the existing WebView function-call protocol.
    if (typeof window.SetUDPMsg === 'function') window.SetUDPMsg(message);
    else if (window.chrome?.webview && typeof window.setCallWebToApp === 'function') window.setCallWebToApp('SetUDPMsg', message);
    else console.info('[DTaQ LED] SetUDPMsg:', message);
    return message;
  }
  function wrap(name, hook) {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function (...args) { const result = original.apply(this, args); hook.apply(this, args); return result; };
  }
  wrap('showPage', function (pageId) {
    if (pageId === 'page-search' && window.g_searchMode === 'employee') send('employee');
    else if (pageId === 'page-business') send('weapon');
    else if (pageId === 'page-landing' || pageId === 'page-standby') {
      // Wait for kiosk_contents.json so a welcome startup does not send ROLLING first.
      if (pageId === 'page-standby' && !welcomeLoaded) return;
      const welcome = document.getElementById('welcome-screen');
      send(pageId === 'page-standby' && welcome && !welcome.hidden ? 'welcome' : 'rolling');
    }
  });
  wrap('showLedScreen', function (id) { if (id) send('employee', id); });
  wrap('applyKioskWelcome', function (content) {
    welcomeLoaded = true;
    if (window.g_currentScreen === 'page-standby') send(content?.show === true ? 'welcome' : 'rolling');
  });
  // Business UI is created on DOM ready. A delegated listener works for both existing and new buttons.
  document.addEventListener('click', event => {
    if (!event.target.closest('#weapon-enlarge')) return;
    const id = window.businessState?.selected;
    if (id && window.businessState.items.some(item => item.id === id)) send('weapon', id);
  });
  window.DTAQ_LED_BRIDGE = Object.freeze({ send });
})();
