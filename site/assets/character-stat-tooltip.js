"use strict";
(() => {
  const descriptions = new WeakMap();
  let popup, anchor, leaveTimer, removalObserver, previousDescription;
  function hide() {
    clearTimeout(leaveTimer);
    if (anchor) {
      if (previousDescription) anchor.setAttribute('aria-describedby', previousDescription);
      else anchor.removeAttribute('aria-describedby');
    }
    anchor = null;
    removalObserver?.disconnect();
    if (popup) {
      if (popup.hidePopover && popup.matches(':popover-open')) popup.hidePopover();
      popup.hidden = true;
    }
  }
  function deferHide() { leaveTimer = setTimeout(hide, 120); }
  function position() {
    const rect = anchor.getBoundingClientRect(), box = popup.getBoundingClientRect();
    const width = document.documentElement.clientWidth, height = window.innerHeight, gap = 10;
    let left = rect.right + gap, top = rect.top + (rect.height - box.height) / 2;
    if (left + box.width > width - gap) left = rect.left - box.width - gap;
    if (left < gap) {
      left = (rect.left + rect.right - box.width) / 2;
      top = rect.bottom + gap;
      if (top + box.height > height - gap) top = rect.top - box.height - gap;
    }
    popup.style.left = `${Math.max(gap, Math.min(left, width - box.width - gap))}px`;
    popup.style.top = `${Math.max(gap, Math.min(top, height - box.height - gap))}px`;
  }
  function show(target) {
    const data = descriptions.get(target);
    if (!data || !target.isConnected) return;
    clearTimeout(leaveTimer);
    if (anchor === target && !popup.hidden) return;
    hide();
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'character-stat-effect-tooltip';
      popup.className = 'character-stat-effect-tooltip';
      popup.setAttribute('role', 'tooltip');
      if (popup.showPopover) popup.setAttribute('popover', 'manual');
      popup.addEventListener('pointerenter', () => clearTimeout(leaveTimer));
      popup.addEventListener('pointerleave', deferHide);
      document.body.append(popup);
      removalObserver = new MutationObserver(() => {
        if (anchor && (!anchor.isConnected || anchor.closest('[hidden]'))) hide();
      });
    }
    const heading = document.createElement('div');
    heading.className = 'character-stat-effect-heading';
    const title = document.createElement('strong'), value = document.createElement('span');
    title.textContent = data.name; value.textContent = data.value;
    heading.append(title, value);
    const lines = data.effects.map(effect => {
      const line = document.createElement('p'); line.textContent = effect; return line;
    });
    popup.replaceChildren(heading, ...lines);
    anchor = target;
    previousDescription = target.getAttribute('aria-describedby');
    target.setAttribute('aria-describedby', [previousDescription, popup.id].filter(Boolean).join(' '));
    popup.hidden = false;
    if (popup.showPopover) popup.showPopover();
    position();
    removalObserver.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['hidden']});
  }
  function attach(target, data) {
    const effects = data.effects.filter(text => typeof text === 'string' && text.trim());
    if (!effects.length) return;
    descriptions.set(target, {...data, effects});
    target.removeAttribute('title');
    target.tabIndex = 0;
    target.setAttribute('role', 'button');
    target.setAttribute('aria-label', `${data.name} ${data.value}`);
    target.classList.add('has-stat-effects');
    target.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') show(target); });
    target.addEventListener('pointerleave', () => { if (anchor === target) deferHide(); });
    target.addEventListener('focus', () => show(target));
    target.addEventListener('blur', () => { if (anchor === target) hide(); });
    target.addEventListener('click', event => {
      if (event.pointerType === 'touch' && anchor === target) return;
      show(target);
    });
    target.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(target); }
    });
  }
  document.addEventListener('pointerdown', event => {
    if (anchor && !anchor.contains(event.target) && !popup.contains(event.target)) hide();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
  window.addEventListener('scroll', event => {
    if (!anchor || (event.target instanceof Node && popup?.contains(event.target))) return;
    const rect = anchor.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) hide();
    else position();
  }, true);
  window.addEventListener('resize', hide);
  window.addEventListener('hashchange', hide);
  window.addEventListener('popstate', hide);
  globalThis.NotMeterStatTooltip = {attach, hide};
})();
