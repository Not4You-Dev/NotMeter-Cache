(() => {
  'use strict';
  const data = globalThis.NotMeterCriticalAnalysisData;
  const policies = Object.fromEntries(Object.entries(data.regions).map(([key,value])=>[key,{...value,variants:new Set(value.variants)}]));
  const compact = value => {
    let code = Number(value);
    if (!Number.isSafeInteger(code) || code<=0) return 0;
    while(code>99999999)code=Math.floor(code/10);
    return code;
  };
  function excludes(skill, region) {
    const policy = policies[region];
    if (!policy) return false;
    const raw = compact(skill.rawSkillCode), code = compact(skill.skillCode);
    if (policy.variants.has(raw) || policy.variants.has(code)) return true;
    return [code,raw].some(value => (policy.traits[Math.floor(value/10000)*10000] || [])
      .some(index => skill.specializationFlags?.[index-1] === true));
  }
  function calculate(detail, region, unavailable=false) {
    const excluded = (Array.isArray(detail?.skills)?detail.skills:[]).filter(skill=>skill.hitCount>0 && excludes(skill,region));
    const excludedHits = excluded.reduce((sum,skill)=>sum+Number(skill.hitCount),0);
    const includedHits = Number(detail?.hitCount)-excludedHits;
    const invalid = () => ({available:false,rate:null,includedHits:0,excludedHits,excluded});
    const validRate = value => typeof value==='number' && Number.isFinite(value) && value>=0 && value<=100;
    if (unavailable || !policies[region] || !Number.isSafeInteger(detail?.hitCount) || detail.hitCount<=0 || includedHits<0 ||
        !validRate(detail.criticalRate) || excluded.some(skill=>!Number.isSafeInteger(skill.hitCount)||!validRate(skill.criticalRate))) return invalid();
    const critical = detail.hitCount*detail.criticalRate/100-excluded.reduce((sum,skill)=>sum+skill.hitCount*skill.criticalRate/100,0);
    const tolerance = Math.max(1,detail.hitCount)*1e-8;
    if (critical < -tolerance || critical > includedHits+tolerance) return invalid();
    return {available:true,rate:includedHits>0?Math.max(0,Math.min(100,critical/includedHits*100)):null,includedHits,excludedHits,excluded};
  }
  let enabled = false, current, panel, trigger, menu;
  function closeMenu(restoreFocus=false) {
    if(!menu)return;
    menu.hidden=true;
    trigger.setAttribute('aria-expanded','false');
    if(restoreFocus)trigger.focus();
  }
  function openMenu() {
    menu.hidden=false;
    menu.style.left='0px';
    const bounds=menu.getBoundingClientRect();
    menu.style.left=`${Math.min(0,window.innerWidth-12-bounds.right)-Math.min(0,bounds.left-12)}px`;
    trigger.setAttribute('aria-expanded','true');
    (menu.querySelector('[aria-checked="true"]:not(:disabled)') || menu.querySelector('button:not(:disabled)'))?.focus();
  }
  function sync(options) {
    current = options;
    if (!panel) {
      panel = document.createElement('div'); panel.className='critical-analysis'; panel.dataset.detailMetric='critical';
      panel.innerHTML='<div class="critical-analysis-result" aria-live="polite"></div><details><summary></summary><p></p><ul></ul></details>';
      document.querySelector('#combat-detail-modal .detail-summary').append(panel);
      trigger=document.querySelector('.critical-scope-trigger');
      menu=document.getElementById('critical-scope-menu');
      trigger.addEventListener('click',()=>menu.hidden?openMenu():closeMenu(true));
      trigger.addEventListener('keydown',event=>{
        if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();openMenu();}
      });
      menu.addEventListener('click',event=>{
        const option=event.target.closest('[data-critical-scope]');
        if(!option||option.disabled)return;
        enabled=option.dataset.criticalScope==='exclude';render();closeMenu(true);
      });
      menu.addEventListener('keydown',event=>{
        if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeMenu(true);return;}
        if(event.key==='Tab'){closeMenu(true);return;}
        if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
        event.preventDefault();
        const options=[...menu.querySelectorAll('button:not(:disabled)')],index=options.indexOf(document.activeElement);
        const next=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;
        options[next]?.focus();
      });
      document.addEventListener('pointerdown',event=>{if(!event.target.closest('.critical-scope'))closeMenu();});
      window.addEventListener('resize',()=>closeMenu());
      document.getElementById('combat-detail-modal').addEventListener('scroll',event=>{if(event.target!==menu)closeMenu();},true);
    }
    closeMenu();
    render();
  }
  function render() {
    const {detail,region,locale,unavailable,skillName,formatRate} = current;
    const result = calculate(detail,region,unavailable), copy = data.copy[locale] || data.copy.en;
    const number = value => new Intl.NumberFormat(locale).format(value);
    const text = (key,value) => copy[key].replace('{0}',number(value));
    const rate = value => value==null?'—':formatRate(value);
    const summary = panel.querySelector('.critical-analysis-result');
    trigger.title=copy.help;
    trigger.dataset.filtered=String(enabled);
    trigger.querySelector('.critical-scope-basis').textContent=enabled?copy.filtered:copy.all;
    for(const option of menu.querySelectorAll('button')) {
      const filtered=option.dataset.criticalScope==='exclude';
      option.setAttribute('aria-checked',String(filtered===enabled));
      option.disabled=filtered&&!result.available;
      option.querySelector('.critical-scope-label').textContent=filtered?copy.toggle:copy.all;
      option.querySelector('strong').textContent=filtered?rate(result.rate):unavailable?'—':rate(detail.criticalRate);
    }
    menu.setAttribute('aria-label',trigger.querySelector('[data-i18n]').textContent);
    const chip=document.getElementById('detail-critical-rate');
    chip.textContent = enabled?rate(result.rate):unavailable?'—':rate(detail.criticalRate);
    chip.title = enabled?copy.help:'';
    summary.hidden=!enabled&&result.available;
    panel.hidden=!current.visible||summary.hidden;
    summary.textContent=!result.available?copy.unavailable:!result.includedHits?copy.empty
      :`${copy.all} ${rate(detail.criticalRate)}  →  ${copy.filtered} ${rate(result.rate)}  ·  ${text('sample',result.includedHits)}  ·  ${text('excluded',result.excludedHits)}`;
    if(result.available&&enabled&&!result.excluded.length)summary.textContent+='  '+copy.none;
    const groups=new Map();
    for(const skill of result.excluded){const name=skillName(skill);groups.set(name,(groups.get(name)||0)+skill.hitCount);}
    const details=panel.querySelector('details'); details.hidden=!enabled||!groups.size;
    details.querySelector('summary').textContent=text('skills',groups.size);
    details.querySelector('p').textContent=copy.help;
    details.querySelector('ul').replaceChildren(...[...groups].map(([name,hits])=>{
      const item=document.createElement('li');item.textContent=`${name} · ${text('excluded',hits)}`;return item;
    }));
  }
  globalThis.NotMeterCriticalAnalysis={calculate,excludes,sync};
})();
