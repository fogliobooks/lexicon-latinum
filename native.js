/* Native shell bridge (Capacitor). Does nothing in a browser. */
(function () {
  const C = window.Capacitor; if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  const P = C.Plugins || {}; const plat = C.getPlatform ? C.getPlatform() : '';
  document.documentElement.dataset.native = '1'; document.documentElement.dataset.platform = plat;
  const hex = c => { const m = c.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return null; let h = m[1]; if (h.length === 3) h = h.split('').map(x => x + x).join(''); return '#' + h; };
  const luma = h => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  window.LXNative = {
    theme(color, dark) {
      const h = hex(color || '') || '#ffffff'; const light = luma(h) > 0.6;
      try { if (P.StatusBar) { P.StatusBar.setStyle({ style: light ? 'LIGHT' : 'DARK' }); if (plat === 'android') P.StatusBar.setBackgroundColor({ color: h }); } } catch (e) { }
    },
    open(url) { try { if (P.Browser) P.Browser.open({ url, presentationStyle: 'popover' }); else window.open(url, '_system'); } catch (e) { } },
  };
  // Android hardware back: walk back through the app's own history, exit at the root.
  try { if (P.App) P.App.addListener('backButton', ({ canGoBack }) => { const sheet = document.getElementById('sheet'); if (sheet && !sheet.hidden) { sheet.hidden = true; document.body.style.overflow = ''; return; } if (canGoBack && location.hash && location.hash !== '#/') history.back(); else P.App.exitApp(); }); } catch (e) { }
  // Hide the launch screen once the first view has rendered.
  window.addEventListener('load', () => { setTimeout(() => { try { if (P.SplashScreen) P.SplashScreen.hide(); } catch (e) { } }, 250); });
  // No pinch zoom, no long-press callouts: handled in CSS and the viewport; also swallow gesture events.
  document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
})();
