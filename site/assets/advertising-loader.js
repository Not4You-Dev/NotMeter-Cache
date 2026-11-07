(() => {
  "use strict";
  if (navigator.globalPrivacyControl === true || window.top !== window.self) return;
  if (!document.querySelector('script[src^="https://fundingchoicesmessages.google.com/i/pub-7318383767094918"]')) {
    const measurement = document.createElement("script");
    measurement.async = true;
    measurement.src = "https://fundingchoicesmessages.google.com/i/pub-7318383767094918?ers=1";
    document.head.append(measurement);
  }
  function signalGooglefcPresent() {
    if (window.frames.googlefcPresent || document.querySelector('iframe[name="googlefcPresent"]')) return;
    const frame = document.createElement("iframe");
    frame.style.cssText = "width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px; display: none;";
    frame.name = "googlefcPresent";
    document.body.append(frame);
  }
  if (document.body) signalGooglefcPresent();
  else document.addEventListener("DOMContentLoaded", signalGooglefcPresent, { once: true });
  if (document.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7318383767094918";
  document.head.append(script);
})();
