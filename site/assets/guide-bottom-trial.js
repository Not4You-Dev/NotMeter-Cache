(() => {
  'use strict';
  if (window.top !== window.self || navigator.globalPrivacyControl === true) return;
  let group;
  try {
    group = sessionStorage.getItem('nm.guide.bottom.v1');
    if (group !== 'control' && group !== 'bottom') {
      group = (crypto.getRandomValues(new Uint8Array(1))[0] < 128) ? 'bottom' : 'control';
      sessionStorage.setItem('nm.guide.bottom.v1', group);
    }
  } catch { return; }
  const holder = document.getElementById('guide-bottom-trial');
  if (!holder) return;
  holder.dataset.adCohort = group;
  if (group !== 'bottom' || !('IntersectionObserver' in window)) return;
  function init() {
    const slot = document.getElementById('guide-bottom-trial');
    const main = document.getElementById('guide-main');
    if (!main || !slot) return;
    const labels = {ko:'광고',en:'Advertisement',zh:'廣告',ja:'広告',de:'Anzeige',fr:'Publicité',es:'Publicidad',pt:'Publicidade',ru:'Реклама',vi:'Quảng cáo',th:'โฆษณา'};
    const label = document.createElement('span');
    slot.append(label);
    let requested = false, failed = false;
    const eligible = () => !!main.querySelector('.guide-cover, .guide-article-top');
    const io = new IntersectionObserver(entries => {
      if (requested || slot.hidden || !eligible() || !entries.some(e => e.isIntersecting) || slot.clientWidth < 1) return;
      requested = true;
      io.disconnect();
      const ad = document.createElement('ins');
      ad.className = 'adsbygoogle';
      ad.style.display = 'block';
      Object.assign(ad.dataset, {adClient:'ca-pub-7318383767094918',adSlot:'7994522501',adFormat:'auto',fullWidthResponsive:'true'});
      globalThis.NotMeterAdRoutes?.applyTo(ad);
      slot.append(ad);
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); }
      catch { failed = true; slot.hidden = true; }
    }, {rootMargin:'0px 0px 150px 0px'});
    function sync() {
      label.textContent = labels[document.documentElement.lang.toLowerCase().split('-')[0]] || labels.en;
      slot.hidden = failed || !eligible();
      if (!requested) {
        io.unobserve(slot);
        if (!slot.hidden) io.observe(slot);
      }
    }
    new MutationObserver(sync).observe(main, {childList:true});
    new MutationObserver(sync).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
