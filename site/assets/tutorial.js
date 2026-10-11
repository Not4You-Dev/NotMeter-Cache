(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const esc = text => String(text ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const i18n = globalThis.NotMeterI18n;
  const params = new URLSearchParams(location.search);
  let language = i18n.normalize(params.get('lang')) || i18n.read();
  let screenLanguage = i18n.normalize(params.get('screen')) || language;
  let copy, reference, generation = 0, galleryIndex = 0, galleryScreens = [], galleryTitle = '', imageOpener;
  const references = new Map(), entrances = new Map(), assistCaptures = new Map();
  const main = $('#guide-main');
  const search = $('#guide-search');
  const groups = [
    ['start','reading','locks','details','bossForecast','training','rankings','character','resources','dailyPoints'],
    ['Language','Meter','Display','Design','IdlePhoto','NicknameEffects','Presets','ColorFinder'],
    ['PartyLookup','BuffUi','CombatRecords','FieldBoss','artifact','Alerts','Bus'],
    ['General','combatVisibility','Backup','Hotkeys','Render','Optimization','Network','obs','proton','troubleshooting']
  ];
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${({
    start:'<path d="M7 4h10v16H7zM10 7h4M10 11h4M10 15h2"/>',
    settings:'<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    assist:'<path d="M12 3v4m0 10v4M3 12h4m10 0h4"/><circle cx="12" cy="12" r="6"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01"/>',
    arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
    folder:'<path d="M3 7h7l2 2h9v11H3zM3 7V4h7l2 3h8v2"/>'
  })[name] || ''}</svg>`;
  const href = (id, option) => `#${encodeURIComponent(id)}${option ? '/' + encodeURIComponent(option) : ''}`;
  const imagePath = file => `./assets/tutorial/${encodeURIComponent(screenLanguage)}/${encodeURIComponent(file)}?v=20261008-2`;
  const category = id => reference?.categories.find(item => item.id === id);
  const title = id => copy.articles[id]?.title || id;
  const route = () => {
    try { return location.hash.slice(1).split('/').map(decodeURIComponent); }
    catch { return ['']; }
  };
  const firstSteps=['start','reading','BuffUi','CombatRecords'];
  const beginner = () => globalThis.NotMeterTutorialBeginner[language];
  const walkthrough = () => globalThis.NotMeterTutorialWalkthrough[language];
  const entryCategory = id => category(id) || category(({bossForecast:'Display',combatVisibility:'General',obs:'General',proton:'Network',training:'CombatRecords',rankings:'Display',reading:'Display',details:'Display',resources:'Display',dailyPoints:'Display',locks:'General',artifact:'Hotkeys',start:'Language',troubleshooting:'Network'})[id]);
  function settingPath(cat) {
    return [copy.ui.settings,...(['Meter','Display','Design','IdlePhoto'].includes(cat?.id) ? [copy.ui.meterPath] : []),cat?.title].filter(Boolean).join(' → ');
  }
  function markedImage(target, label) {
    const box=entrances.get(screenLanguage)?.[target];
    const mark=box ? `<span class="guide-click-target" style="left:${box.x}%;top:${box.y}%;width:${box.w}%;height:${box.h}%" aria-hidden="true"></span>` : '';
    return `<button class="guide-entry-window" data-image="result-entry-idle.webp" aria-label="${esc(label)} — ${esc(copy.ui.zoom)}"><span class="guide-click-photo"><img src="${imagePath('result-entry-idle.webp')}" alt="${esc(label)}">${mark}</span></button>`;
  }
  function windowDirectory() {
    const t=walkthrough();
    const entries=['resources','dailyPoints','locks','CombatRecords','details','BuffUi','FieldBoss','artifact'];
    return `<section class="guide-open-directory"><h2>${esc(t.ui[0])}</h2><p>${esc(t.ui[1])}</p><div class="guide-open-links">${entries.map(id=>`<a href="${href(id)}"><span>${esc(title(id))}</span>${icon('arrow')}</a>`).join('')}</div></section>`;
  }
  function firstRun() {
    const text=beginner();
    return `<section class="guide-first-run"><h2>${esc(text[0])}</h2><p>${esc(text[1])}</p><ol>${firstSteps.map((id,index)=>`<li><a href="${href(id)}"><span>${index+1}</span>${esc(text[2][index])}</a></li>`).join('')}</ol></section>`;
  }
  function entry(id) {
    const text=globalThis.NotMeterTutorialEntry[language], t=walkthrough(), cat=entryCategory(id);
    if (id==='character') return `<section class="guide-entry" id="opening"><h2>${esc(t.ui[7])}</h2><button class="guide-entry-window" data-image="result-web-search.webp" aria-label="${esc(copy.ui.website)} — ${esc(copy.ui.zoom)}"><img src="${imagePath('result-web-search.webp')}" alt="${esc(copy.ui.website)}"></button><p>${copy.articles.character.steps[0]}</p><p><a href="./">${esc(copy.ui.website)} →</a></p></section>`;
    const target=({resources:'energy',dailyPoints:'points',locks:'lock',CombatRecords:'records'})[id] || 'settings';
    const combat=['reading','details'].includes(id);
    const lines=id==='resources' ? [t.energy[2][1],t.energy[2][5]] : id==='dailyPoints' ? [t.points[2][1],t.points[2][2]] : id==='locks' ? globalThis.NotMeterTutorialLocks[language][2].slice(0,3) : id==='CombatRecords' ? [t.opening[2],t.extra.CombatRecords] : combat ? [t.opening[id==='reading'?0:1]] : [t.ui[11],t.ui[12]];
    const picture=combat ? `<button class="guide-entry-window" data-image="feature-meter.webp"><img src="${imagePath('feature-meter.webp')}" alt="${esc(lines[0])}"></button>` : markedImage(target,t.ui[2]);
    const menu=['reading','start'].includes(id) ? `<ol class="guide-menu-labels">${text[7].map((label,index)=>`<li><img src="${imagePath('result-menu-'+['screenshot','records','settings','exit'][index]+'.webp')}" alt=""><span><b>${index+1}</b>${esc(label)}</span></li>`).join('')}</ol>` : '';
    return `<section class="guide-entry" id="opening"><h2>${esc(id==='locks' ? t.lockHeading : t.ui[7])}</h2><div class="guide-entry-grid"><div>${picture}<p class="guide-stage-note">${esc(t.ui[13])}</p>${menu}</div><div class="guide-entry-instructions"><ol>${lines.map(line=>`<li>${esc(line)}</li>`).join('')}</ol>${cat && !combat && target==='settings' ? `<p class="guide-entry-destination">${esc(settingPath(cat))}</p>` : ''}<p class="guide-entry-recovery">${esc(text[6])}${id==='locks' ? '' : ` <a href="#locks">${esc(title('locks'))}</a>`}</p></div></div></section>`;
  }
  function requiredSettings(id) {
    const ids=({resources:['showAetherStatusButton','showIdleAetherStatusAlwaysButton'],dailyPoints:['showDailyPointsButton'],details:['combatDetailButton']})[id];
    if(!ids) return '';
    const t=walkthrough(), cat=category('Display');
    const options=ids.map(key=>cat.options.find(option=>option.id===key)).filter(Boolean);
    return `<section class="guide-required"><h2>${esc(t.ui[14])}</h2><p>${esc(settingPath(cat))}</p><p>${esc(t.ui[4])}</p><ul>${options.map(option=>`<li><span>${esc(option.title)}</span><b>ON</b>${option.screen ? `<button data-image="${esc(option.screen)}" aria-label="${esc(option.title)} — ${esc(copy.ui.showScreen)}">${esc(copy.ui.showScreen)}</button>` : ''}</li>`).join('')}</ul><p class="guide-stage-note">${esc(t.ui[15])}</p></section>`;
  }
  const assistIds=['start','meaning','skills','party','pins','items','alerts','position','visibility','help'];
  const assistPictures=[
    ['assist-quick-start.webp','result-assist-both.webp'],
    ['result-assist-buff.webp','result-assist-cooldown.webp','result-assist-charges.webp'],
    ['result-assist-skill-options.webp'],
    ['result-assist-party-options.webp','result-assist-party-self.webp','result-assist-party-party.webp','result-assist-party-both.webp'],
    ['result-assist-ready.webp'],
    ['feature-potion.webp','feature-scroll.webp','result-assist-debuff.webp'],
    ['result-alert-ready.webp','result-alert-start.webp','result-alert-end.webp','feature-audio.webp'],
    ['result-assist-position.webp','BuffUi-Appearance-1.webp','result-assist-combined.webp'],
    ['result-target-self.webp','result-direction.webp'],[]
  ];
  function assistContents() {
    const guide=copy.assist;
    return `<nav class="guide-assist-contents" aria-label="${esc(guide.toc)}"><h2>${esc(guide.toc)}</h2><ol>${guide.chapters.map((chapter,i)=>`<li><a href="#BuffUi/assist-${assistIds[i]}"><span>${i+1}</span>${esc(chapter[0])}</a></li>`).join('')}</ol></nav>`;
  }
  function assistGuide() {
    const guide=copy.assist;
    return guide.chapters.map((chapter,i)=>`<section class="guide-assist-chapter" id="option-assist-${assistIds[i]}"><h2><span>${i+1}.</span> ${esc(chapter[0])}</h2><p class="guide-assist-path">${esc(chapter[1])}</p><ol>${chapter[2].map(step=>`<li>${esc(step)}</li>`).join('')}</ol>${i===3 ? `<div class="guide-assist-supported"><h3>${esc(guide.supported)}</h3><ul>${assistCaptures.get(screenLanguage).skills.map(skill=>`<li>${esc(skill.name)}</li>`).join('')}</ul></div>` : ''}${chapter[3].length ? `<aside class="guide-note">${chapter[3].map(note=>`<p>${esc(note)}</p>`).join('')}</aside>` : ''}${assistPictures[i].length ? `<div class="guide-assist-pictures ${i===3 ? 'guide-assist-party' : ''}">${assistPictures[i].map((file,n)=>`<figure><button data-image="${file}" aria-label="${esc(chapter[4][n])} — ${esc(copy.ui.zoom)}"><img src="${imagePath(file)}" alt="${esc(chapter[4][n])}" loading="lazy"></button><figcaption>${esc(chapter[4][n])}</figcaption></figure>`).join('')}</div><p class="guide-stage-note">${esc(guide.example)} ${esc(copy.ui.zoom)}</p>` : ''}</section>`).join('');
  }
  function footer() {
    return `<footer class="guide-footer"><span>${esc(copy.ui.sourceNote)}</span><div><a href="./privacy.html?lang=${encodeURIComponent(language)}">${esc(copy.ui.privacy)}</a><a href="https://discord.com/invite/DuAuuhdrwy" target="_blank" rel="noopener noreferrer">${esc(copy.ui.discord)}</a></div></footer>`;
  }
  function nav() {
    const current = route()[0] || '';
    $('#guide-navigation').innerHTML = `<div class="guide-nav-group"><a href="#" ${!current ? 'aria-current="page"' : ''}>${esc(copy.ui.home)}</a></div>` + groups.map((items,index) => `<div class="guide-nav-group"><h2>${esc(copy.ui.groups[index])}</h2>${items.map(id => `<a href="${href(id)}" ${current === id ? 'aria-current="page"' : ''}>${esc(title(id))}</a>`).join('')}</div>`).join('');
  }
  function caption() {
    return `<p class="guide-image-disclaimer">${esc(copy.ui.example)}</p>`;
  }
  function home() {
    const links = ['start','Meter','BuffUi','troubleshooting'];
    const icons = ['start','settings','assist','help'];
    main.innerHTML = `<section class="guide-cover"><div><h1>${esc(copy.ui.heading).replace('\n','<br>')}</h1><p class="guide-intro">${esc(copy.ui.intro)}</p><a class="guide-primary" href="#start">${esc(copy.ui.begin)}${icon('arrow')}</a></div><div class="guide-cover-media"><figure><button class="guide-hero-image" data-image="feature-meter.webp" aria-label="${esc(copy.ui.zoom)}"><img src="${imagePath('feature-meter.webp')}" alt="${esc(copy.ui.cover)}" width="800" height="260"></button><figcaption>${esc(copy.ui.cover)}</figcaption></figure></div></section>
      ${firstRun()}${windowDirectory()}<div class="guide-paths">${copy.ui.paths.map((path,index) => `<a class="guide-path" href="${href(links[index])}">${icon(icons[index])}<div><strong>${esc(path[0])}</strong><p>${esc(path[1])}</p></div><span aria-hidden="true">›</span></a>`).join('')}</div>
      <section class="guide-home-section"><div class="guide-section-header"><h2>${esc(copy.ui.contents)}</h2><p>${esc(copy.ui.contentsHint)}</p></div><div class="guide-category-list">${groups.flat().map(category).filter(Boolean).map(item => `<a href="${href(item.id)}">${esc(title(item.id))}<span aria-hidden="true">›</span></a>`).join('')}</div></section>
      <aside class="guide-note"><strong>${esc(copy.ui.important)}</strong>${esc(copy.ui.screenshotDefault)} ${esc(copy.ui.languageNote)}</aside>${footer()}`;
  }
  function screenSelect() {
    return `<label class="guide-screen-language">${esc(copy.ui.screenshotLanguage)}<select id="guide-screen-language">${i18n.languages.map(item => `<option value="${item.code}" ${screenLanguage === item.code ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</select></label>`;
  }
  function gallery(screens, name) {
    galleryScreens = [...new Set(screens)]; galleryTitle = name; galleryIndex = 0;
    if (!screens.length) return '';
    return `<figure class="guide-gallery" id="guide-gallery"><div class="guide-gallery-heading"><span>${esc(copy.ui.gallery)}</span>${globalThis.NotMeterTutorialSceneArticles[route()[0]] ? '' : screenSelect()}</div><button class="guide-screen" data-image="${esc(screens[0])}" aria-label="${esc(copy.ui.zoom)}"><img src="${imagePath(screens[0])}" width="1220" height="920" alt="${esc(name)} — ${esc(copy.ui.page)} 1" loading="lazy"></button><figcaption class="guide-gallery-footer"><span>${esc(copy.ui.zoom)}</span><div class="guide-gallery-controls"><button data-gallery-step="-1" aria-label="${esc(copy.ui.previous)}" disabled>‹</button><select class="guide-gallery-select" aria-label="${esc(copy.ui.page)}">${galleryScreens.map((file,index) => `<option value="${index}">${esc(copy.ui.page)} ${index+1} / ${galleryScreens.length}</option>`).join('')}</select><button data-gallery-step="1" aria-label="${esc(copy.ui.next)}" ${galleryScreens.length < 2 ? 'disabled' : ''}>›</button></div></figcaption>${caption()}</figure>`;
  }
  function describeGallery() {
    const file = galleryScreens[galleryIndex];
    const cat = category(route()[0]);
    const shot = cat?.screens.find(item => item.file === file);
    const labels = cat?.options.filter(option => shot?.text.includes(option.title)).map(option => option.title) || [];
    const node = document.getElementById('guide-gallery-description');
    if (node) node.remove();
    if (labels.length) $('.guide-gallery-footer').insertAdjacentHTML('afterend', `<div id="guide-gallery-description"><strong>${esc(copy.ui.showing)}</strong><p>${labels.slice(0,7).map(esc).join(' · ')}</p></div>`);
  }
  function sceneContent(id) {
    const scene = copy.scenes[id];
    const files = globalThis.NotMeterTutorialScenes[id];
    return `<div class="guide-scene-stage guide-scene-${esc(id)} ${files.length > 1 ? 'guide-scene-comparison' : ''}">${files.map((file,index) => `<figure><button data-image="${esc(file)}" aria-label="${esc(scene[4][index])} — ${esc(copy.ui.zoom)}"><span class="guide-annotated"><img src="${imagePath(file)}" alt="${esc(scene[4][index])}" loading="lazy">${id==='assist' ? '<span class="guide-pin" style="top:30%">1</span><span class="guide-pin" style="top:67%">2</span>' : ''}</span></button><figcaption>${esc(scene[4][index])}</figcaption></figure>`).join('')}</div>${id==='assist' ? `<ol class="guide-image-key">${beginner()[6].map((text,index)=>`<li><span>${index+1}</span>${esc(text)}</li>`).join('')}</ol>` : ''}<div class="guide-scene-explanation">${[copy.ui.when,copy.ui.read,copy.ui.check].map((label,index) => `<div><h3>${esc(label)}</h3><p>${esc(scene[index+1])}</p></div>`).join('')}</div>`;
  }
  function scenes(id) {
    const ids = globalThis.NotMeterTutorialSceneArticles[id];
    if (!ids?.length) return '';
    return `<section class="guide-outcomes"><div class="guide-section-header"><h2>${esc(copy.ui.results)}</h2>${screenSelect()}</div>${ids.length > 1 ? `<div class="guide-scene-tabs" role="tablist" aria-label="${esc(copy.ui.results)}">${ids.map((key,index) => `<button id="scene-tab-${key}" role="tab" aria-selected="${index===0}" aria-controls="guide-scene-panel" tabindex="${index===0 ? 0 : -1}" data-scene="${key}">${esc(copy.scenes[key][0])}</button>`).join('')}</div>` : `<h3 class="guide-scene-title">${esc(copy.scenes[ids[0]][0])}</h3>`}<div id="guide-scene-panel" ${ids.length>1 ? `role="tabpanel" aria-labelledby="scene-tab-${ids[0]}"` : ''}>${sceneContent(ids[0])}</div><p class="guide-stage-note">${esc(copy.ui.stageNote)}</p></section>`;
  }
  function selectScene(id,focus=false) {
    document.querySelectorAll('[data-scene]').forEach(button => { const active=button.dataset.scene === id; button.setAttribute('aria-selected',String(active)); button.tabIndex=active ? 0 : -1; if(active && focus) button.focus(); });
    const panel=$('#guide-scene-panel'); panel.innerHTML=sceneContent(id); panel.setAttribute('aria-labelledby','scene-tab-'+id);
  }
  function showGallery(index) {
    if (!galleryScreens.length) return;
    galleryIndex = Math.max(0, Math.min(galleryScreens.length-1, index));
    const button = $('.guide-screen');
    const img = button.querySelector('img');
    button.dataset.image = galleryScreens[galleryIndex];
    img.src = imagePath(galleryScreens[galleryIndex]);
    img.alt = `${galleryTitle} — ${copy.ui.page} ${galleryIndex+1}`;
    $('.guide-gallery-select').value = String(galleryIndex);
    $('[data-gallery-step="-1"]').disabled = galleryIndex === 0;
    $('[data-gallery-step="1"]').disabled = galleryIndex === galleryScreens.length-1;
    describeGallery();
  }
  function optionHtml(option) {
    const values = [];
    for (const control of option.controls) {
      if (control.value && !String(control.value).includes('System.Windows.')) values.push(`${copy.ui.default}: ${control.value}`);
      if (control.range) values.push(`${copy.ui.range}: ${Array.isArray(control.range) ? control.range.join('–') : control.range}`);
      if (control.choices?.length) values.push(`${copy.ui.choices}: ${control.choices.join(' / ')}`);
    }
    return `<details class="guide-option" id="option-${esc(option.id)}"><summary>${esc(option.title)}</summary><div class="guide-option-body"><p>${esc(option.detail || copy.ui.noDetails)}</p>${values.length ? `<div class="guide-option-values">${[...new Set(values)].map(value => `<span class="guide-value">${esc(value)}</span>`).join('')}</div>` : ''}${option.screen ? `<button class="guide-show-screen" data-show-screen="${esc(option.screen)}">${esc(copy.ui.showScreen)}</button>` : `<p>${esc(copy.ui.findOption)}</p>`}</div></details>`;
  }
  function pluginDownload(id) {
    const plugin = ({Network:'WinDivert',proton:'Proton'})[id];
    if (!plugin) return '';
    const text = ({
      ko: ['플러그인 다운로드 (ZIP)', '설정에서 연 WinDivert 플러그인 폴더에 ZIP 안의 파일을 바로 풀어 주세요.', 'NotMeter.exe 옆에 압축을 풀고 Plugins/Proton 폴더 구조를 유지해 주세요.'],
      en: ['Download plugin (ZIP)', 'Extract the ZIP contents directly into the WinDivert plugin folder opened from Settings.', 'Extract the ZIP next to NotMeter.exe, keeping the Plugins/Proton folder structure.'],
      'zh-TW': ['下載外掛程式 (ZIP)', '請將 ZIP 內的檔案直接解壓縮至從設定開啟的 WinDivert 外掛程式資料夾。', '請在 NotMeter.exe 所在的資料夾解壓縮 ZIP，並保留 Plugins/Proton 資料夾結構。'],
      'ja-JP': ['プラグインをダウンロード (ZIP)', '設定から開いた WinDivert プラグインフォルダーに、ZIP 内のファイルを直接展開してください。', 'NotMeter.exe と同じフォルダーに ZIP を展開し、Plugins/Proton のフォルダー構成を維持してください。'],
      'de-DE': ['Plugin herunterladen (ZIP)', 'Entpacke den Inhalt der ZIP-Datei direkt in den WinDivert-Plugin-Ordner, den du über die Einstellungen geöffnet hast.', 'Entpacke die ZIP-Datei im Ordner von NotMeter.exe und behalte die Ordnerstruktur Plugins/Proton bei.'],
      'fr-FR': ['Télécharger le plugin (ZIP)', 'Extrayez le contenu du ZIP directement dans le dossier du plugin WinDivert ouvert depuis les paramètres.', 'Extrayez le ZIP dans le dossier de NotMeter.exe en conservant la structure des dossiers Plugins/Proton.'],
      'es-ES': ['Descargar plugin (ZIP)', 'Extrae el contenido del ZIP directamente en la carpeta del plugin WinDivert que has abierto desde los ajustes.', 'Extrae el ZIP en la carpeta de NotMeter.exe y conserva la estructura de carpetas Plugins/Proton.'],
      'pt-BR': ['Baixar plugin (ZIP)', 'Extraia o conteúdo do ZIP diretamente na pasta do plugin WinDivert aberta pelas configurações.', 'Extraia o ZIP na pasta de NotMeter.exe, mantendo a estrutura de pastas Plugins/Proton.'],
      'ru-RU': ['Скачать плагин (ZIP)', 'Распакуйте содержимое ZIP-архива прямо в папку плагина WinDivert, открытую через настройки.', 'Распакуйте ZIP-архив в папку с NotMeter.exe, сохранив структуру папок Plugins/Proton.']
    })[language];
    const filename = `NotMeter-${plugin}-Plugin.zip`;
    const version = id==='proton' ? '?v=20261011-start' : '';
    return `<section class="guide-plugin-download" aria-labelledby="guide-plugin-title"><div><h2 id="guide-plugin-title">${plugin} · ${id==='Network' ? 'Windows' : 'Linux / Proton'}</h2><p>${esc(text[id==='Network' ? 1 : 2])}</p></div><a href="./assets/downloads/${filename}${version}" download="${filename}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg><span>${plugin} — ${esc(text[0])}</span></a></section>`;
  }
  function commands() {
    return `<div class="guide-command-block"><p>${esc(copy.ui.launchMeter)}</p><pre><code>python3 "$HOME/NotMeter/Plugins/Proton/notmeter_start.py"</code></pre></div>`;
  }
  function iconLegend() {
    const jobs = [['검성','Gladiator'],['수호성','Templar'],['궁성','Ranger'],['살성','Assassin'],['마도성','Sorcerer'],['치유성','Cleric'],['정령성','Spiritmaster'],['호법성','Chanter'],['권성','Brawler']];
    return `<section class="guide-icon-reference"><h2>${esc(copy.ui.iconTitle)}</h2><div class="guide-class-icons">${jobs.map((job,index) => `<div><img src="./assets/tutorial/icons/${encodeURIComponent(job[0])}.png" width="28" height="28" alt=""><span>${esc(copy.ui.jobs[index])}</span></div>`).join('')}</div><p><img src="./assets/tutorial/icons/combat-power.png" width="20" height="20" alt="CP"><b>${esc(copy.ui.cpTitle)}</b><span>${esc(copy.ui.cpDetail)}</span></p></section>`;
  }
  function renderArticle(id, optionId) {
    const item = copy.articles[id];
    if (!item) { main.innerHTML = `<h1>${esc(copy.ui.missing)}</h1><p class="guide-intro"><a href="#">${esc(copy.ui.home)}</a></p>`; return; }
    const cat = category(id);
    const featureScreens = {General:['feature-lock.webp'],Display:['feature-hit-statistics.webp'],BuffUi:['feature-skill-options.webp']};
    const shots = [...(item.screens || []), ...(featureScreens[id] || []), ...(cat?.screens.map(shot => shot.file) || [])];
    const group = groups.findIndex(items => items.includes(id));
    const sectionLinks=[['opening',id==='locks' ? walkthrough().lockHeading : walkthrough().ui[7]]];
    if(item.steps.length || id==='BuffUi') sectionLinks.push(['instructions',walkthrough().ui[8]]);
    if(globalThis.NotMeterTutorialSceneArticles[id]?.length) sectionLinks.push(['result',walkthrough().ui[9]]);
    else if(shots.length) sectionLinks.push(['guide-gallery',walkthrough().ui[10]]);
    main.innerHTML = `<div class="guide-crumb"><a href="#">${esc(copy.ui.home)}</a><span aria-hidden="true">/</span><span>${esc(copy.ui.groups[group])}</span></div><div class="guide-article-top"><div><h1>${esc(item.title)}</h1><p class="guide-intro">${esc(item.intro)}</p></div><button class="guide-copy-link">${esc(copy.ui.copyLink)}</button></div>
      ${pluginDownload(id)}
      ${id==='start' ? `<div class="guide-article-prose"><h2>${esc(copy.ui.setup)}</h2><ol>${item.steps.slice(0,2).map(step=>`<li>${step}</li>`).join('')}</ol></div>` : ''}
      <nav class="guide-article-index" aria-label="${esc(copy.ui.contents)}">${sectionLinks.map(([target,label])=>`<button data-scroll-to="${target}">${esc(label)}</button>`).join('')}</nav>
      ${entry(id)}${requiredSettings(id)}
      ${id==='BuffUi' ? assistContents() : ''}
      ${cat ? `<div class="guide-location">${icon('folder')}<span>${esc(copy.ui.location)}</span><code>${esc(copy.ui.settings)} › ${['Meter','Display','Design','IdlePhoto'].includes(id) ? (esc(copy.ui.meterPath)+' › ') : ''}${esc(cat.title)}</code></div>` : ''}
      <div class="guide-article-prose" id="instructions">${id==='BuffUi' ? assistGuide() : item.steps?.length ? `<h2>${esc(walkthrough().ui[8])}</h2><ol start="${id==='start' ? 3 : id==='locks' ? 4 : 1}" style="counter-reset:steps ${id==='start' ? 2 : id==='locks' ? 3 : 0}">${(id==='start' ? item.steps.slice(2) : id==='locks' ? item.steps.slice(3) : item.steps).map(step => `<li>${step}</li>`).join('')}</ol>` : ''}</div>
      ${id!=='BuffUi' && item.notes?.length ? `<aside class="guide-note"><strong>${esc(copy.ui.important)}</strong>${item.notes.map(note => `<p>${esc(note)}</p>`).join('')}</aside>` : ''}
      ${id === 'proton' ? commands() : ''}
      ${id === 'reading' ? iconLegend() : ''}
      <div id="result">${scenes(id)}</div>
      <section class="guide-verification"><h2>${esc(walkthrough().ui[5])}</h2><p>${esc(item.check || walkthrough().checks[id] || walkthrough().ui[6])}</p>${category(id) && walkthrough().checks[id] ? `<p>${esc(walkthrough().ui[6])}</p>` : ''}</section>
      ${id === 'troubleshooting' ? `<div class="guide-problems">${copy.problems.map((problem,index) => `<details class="guide-option" id="problem-${index}" ${index === 0 ? 'open' : ''}><summary>${esc(problem[0])}</summary><div class="guide-option-body"><p>${esc(problem[1])}</p></div></details>`).join('')}</div><p class="guide-intro">${esc(copy.ui.feedback)}</p>` : ''}
      ${gallery(shots,item.title)}
      ${cat?.options.length ? `<details class="guide-advanced" ${optionId ? 'open' : ''}><summary>${esc(beginner()[4])}</summary><p>${esc(beginner()[5])}</p><section class="guide-options"><div class="guide-options-header"><h2>${esc(copy.ui.reference)}</h2><span>${esc(copy.ui.referenceHint)}</span><button id="guide-expand-options">${esc(copy.ui.allOptions)}</button></div>${cat.options.map(optionHtml).join('')}</section></details>` : ''}
      ${firstSteps.includes(id) && firstSteps.indexOf(id)<firstSteps.length-1 ? `<a class="guide-next-step" href="${href(firstSteps[firstSteps.indexOf(id)+1])}"><small>${esc(beginner()[3])}</small><strong>${esc(beginner()[2][firstSteps.indexOf(id)+1])} →</strong></a>` : ''}
      ${item.related?.length ? `<section class="guide-related"><h2>${esc(copy.ui.more)}</h2><div class="guide-related-links">${item.related.map(other => `<a href="${href(other)}">${esc(title(other))}</a>`).join('')}</div></section>` : ''}${footer()}`;
    describeGallery();
    if (optionId) {
      const target = document.getElementById('option-'+optionId);
      if (target) { target.open = true; requestAnimationFrame(() => target.scrollIntoView({block:'start'})); }
    }
  }
  const plain = value => String(value).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  function searchable() {
    const rows = Object.entries(copy.articles).map(([id,item]) => ({id,title:item.title,detail:item.intro,body:[item.title,item.intro,...item.steps,...item.notes,...(globalThis.NotMeterTutorialSceneArticles[id] || []).flatMap(key=>copy.scenes[key].flat()),...(category(id)?.text || [])].join(' ')}));
    copy.assist.chapters.forEach((chapter,i)=>rows.push({id:'BuffUi',option:'assist-'+assistIds[i],title:chapter[0],detail:chapter[1],body:chapter.flat(2).join(' ')}));
    for (const cat of reference.categories) for (const option of cat.options) rows.push({id:cat.id,option:option.id,title:option.title,detail:option.detail,body:[option.title,option.detail,...option.controls.flatMap(control => control.choices || [])].join(' ')});
    copy.problems.forEach(problem => rows.push({id:'troubleshooting',title:problem[0],detail:problem[1],body:problem.join(' ')}));
    return rows;
  }
  function results(query) {
    const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const results = searchable().filter(item => words.every(word => plain(item.body).toLocaleLowerCase().includes(word))).sort((a,b) => Number(words.every(word => b.title.toLocaleLowerCase().includes(word)))-Number(words.every(word => a.title.toLocaleLowerCase().includes(word))));
    main.innerHTML = `<div class="guide-crumb"><a href="#">${esc(copy.ui.home)}</a></div><h1>${esc(copy.ui.searchTitle)}</h1><p class="guide-intro">“${esc(query)}” · ${results.length}${language === 'ko' ? '' : ' '}${esc(copy.ui.found)}</p><div class="guide-search-results">${results.length ? results.map(item => `<a class="guide-result" href="${href(item.id,item.option)}"><small>${esc(title(item.id))}</small><strong>${esc(item.title)}</strong><p>${esc(plain(item.detail))}</p></a>`).join('') : `<p class="guide-empty">${esc(copy.ui.empty)}</p>`}</div>${footer()}`;
  }
  function render({focus=false}={}) {
    if (!reference) return;
    nav();
    if (search.value.trim()) results(search.value); else {
      const [id,option] = route();
      if (!id) home(); else renderArticle(id,option);
    }
    document.title = `${search.value.trim() ? copy.ui.searchTitle : route()[0] ? title(route()[0]) : copy.ui.tutorial} | NotMeter`;
    if (focus) main.focus({preventScroll:true});
  }
  function toast(message) { const node = $('#guide-toast'); node.textContent=message; node.classList.add('visible'); setTimeout(() => node.classList.remove('visible'),2500); }
  async function load() {
    const ownGeneration = ++generation;
    const requestedScreenLanguage = screenLanguage;
    const requestedLanguage = language;
    reference = null;
    main.innerHTML = '<p class="guide-loading" role="status">NotMeter…</p>';
    try {
      if (!globalThis.NotMeterTutorial[requestedLanguage]) {
        const response=await fetch(`./assets/tutorial-text/${requestedLanguage}.json?v=20261011-proton-start`,{signal:AbortSignal.timeout(15000)});
        if (!response.ok) throw new Error('copy');
        const data=await response.json();
        if (data.locale !== requestedLanguage || !data.articles || !data.scenes) throw new Error('copy');
        for (const [id,article] of Object.entries(data.articles)) {
          if (Array.isArray(article)) data.articles[id]={...structuredClone(globalThis.NotMeterTutorial.en.articles[id]),title:article[0],intro:article[1],steps:article[2],notes:article[3],check:article[4]};
        }
        globalThis.NotMeterTutorial[requestedLanguage]=data;
      }
      if (ownGeneration !== generation) return;
    const nextCopy = globalThis.NotMeterTutorial[requestedLanguage];
    globalThis.NotMeterApplyWalkthrough(nextCopy,requestedLanguage);
    if(!nextCopy.assist) {
      const response=await fetch(`./assets/tutorial-assist/${requestedLanguage}.json?v=20261008-2`,{signal:AbortSignal.timeout(15000)});
      if(!response.ok) throw new Error('assist-copy');
      nextCopy.assist=await response.json();
    }
    if(ownGeneration!==generation) return;
    copy=nextCopy;
    copy.articles.BuffUi.title=copy.assist.title;
    copy.articles.BuffUi.intro=copy.assist.intro;
    document.documentElement.lang = language;
    $('#guide-language').innerHTML = i18n.languages.map(item=>`<option value="${item.code}">${esc(item.name)}</option>`).join('');
    $('#guide-language').value = language;
    $('#guide-language').setAttribute('aria-label',copy.ui.guideLanguage);
    document.querySelectorAll('[data-copy]').forEach(node => { node.textContent=copy.ui[node.dataset.copy]; });
    $('.skip-link').textContent = copy.ui.skip;
    $('.guide-sidebar').setAttribute('aria-label',copy.ui.menu);
    $('#guide-mobile-menu').textContent = copy.ui.menu;
    $('#guide-image-close').setAttribute('aria-label',copy.ui.close);
    search.placeholder=copy.ui.search; search.setAttribute('aria-label',copy.ui.search);
      if (!references.has(requestedScreenLanguage)) {
        const response = await fetch(`./assets/tutorial/${requestedScreenLanguage}/reference.json?v=20261008-2`, {signal:AbortSignal.timeout(15000)});
        if (!response.ok) throw new Error('reference');
        const data = await response.json();
        if (data.locale !== requestedScreenLanguage || !Array.isArray(data.categories)) throw new Error('reference');
        references.set(requestedScreenLanguage,data);
      }
      if (ownGeneration !== generation) return;
      if(!entrances.has(requestedScreenLanguage)) {
        const response=await fetch(`./assets/tutorial/${requestedScreenLanguage}/entrances.json?v=20261008-2`,{signal:AbortSignal.timeout(15000)});
        if(!response.ok) throw new Error('entrances');
        entrances.set(requestedScreenLanguage,await response.json());
      }
      if(ownGeneration!==generation) return;
      if(!assistCaptures.has(requestedScreenLanguage)) {
        const response=await fetch(`./assets/tutorial/${requestedScreenLanguage}/assist.json?v=20261008-2`,{signal:AbortSignal.timeout(15000)});
        if(!response.ok) throw new Error('assist-capture');
        assistCaptures.set(requestedScreenLanguage,await response.json());
      }
      if(ownGeneration!==generation) return;
      reference=references.get(screenLanguage); render();
    } catch {
      if (ownGeneration !== generation) return;
      const fallback = copy || globalThis.NotMeterTutorial.en;
      main.innerHTML=`<p class="guide-intro">${esc(fallback.ui.error)}</p><button class="guide-primary" id="guide-retry">${esc(fallback.ui.retry)}</button>`;
    }
  }
  function updateUrl() {
    const url=new URL(location.href); url.searchParams.set('lang',language); url.searchParams.set('screen',screenLanguage);
    history.replaceState(null,'',url);
  }
  document.addEventListener('click', async event => {
    const element=event.target.closest('button,a'); if (!element) return;
    if(element.dataset.scrollTo) { document.getElementById(element.dataset.scrollTo)?.scrollIntoView({block:'start',behavior:'instant'}); return; }
    if (element.dataset.scene) { selectScene(element.dataset.scene); return; }
    if (element.id === 'guide-retry') { load(); return; }
    if (element.dataset.image) {
      imageOpener=element; const img=$('#guide-full-image'); img.src=imagePath(element.dataset.image); img.alt=element.querySelector('img')?.alt || galleryTitle;
      $('#guide-image-dialog').classList.remove('full-resolution'); $('#guide-image-scale').setAttribute('aria-pressed','false'); $('#guide-image-scale').textContent='100%';
      $('#guide-image-caption').textContent=img.alt; $('#guide-image-dialog').showModal(); return;
    }
    if (element.id === 'guide-image-scale') {
      const full=$('#guide-image-dialog').classList.toggle('full-resolution'); element.setAttribute('aria-pressed',String(full)); element.textContent=full ? copy.ui.fit : '100%'; return;
    }
    if (element.id === 'guide-image-close') { $('#guide-image-dialog').close(); return; }
    if (element.classList.contains('guide-copy-link')) {
      try { await navigator.clipboard.writeText(location.href); toast(copy.ui.copied); } catch { toast(copy.ui.copyFailed); } return;
    }
    if (element.dataset.galleryStep) { showGallery(galleryIndex+Number(element.dataset.galleryStep)); return; }
    if (element.dataset.showScreen) {
      showGallery(Math.max(0,galleryScreens.indexOf(element.dataset.showScreen)));
      $('#guide-gallery')?.scrollIntoView({block:'start'}); $('.guide-screen')?.focus({preventScroll:true}); return;
    }
    if (element.id === 'guide-expand-options') {
      const nodes=[...document.querySelectorAll('.guide-options details')]; const open=nodes.some(node => !node.open);
      nodes.forEach(node => { node.open=open; }); element.textContent=open ? copy.ui.collapseOptions : copy.ui.allOptions; return;
    }
    if (element.id === 'guide-mobile-menu') {
      const expanded=element.getAttribute('aria-expanded') !== 'true'; element.setAttribute('aria-expanded',String(expanded)); $('#guide-navigation').classList.toggle('open',expanded); return;
    }
    if (element.dataset.download !== undefined) { event.preventDefault(); location.href='./?download=1'; return; }
    if (element.getAttribute('href')?.startsWith('#') && !element.classList.contains('skip-link')) {
      search.value=''; $('#guide-navigation').classList.remove('open'); $('#guide-mobile-menu').setAttribute('aria-expanded','false');
      if (element.hash === location.hash || element.getAttribute('href') === '#' && !location.hash) { render({focus:true}); window.scrollTo(0,0); }
    }
  });
  document.addEventListener('change', event => {
    if (event.target.id === 'guide-language') { language=event.target.value; screenLanguage=language; search.value=''; updateUrl(); load(); }
    if (event.target.id === 'guide-screen-language') { screenLanguage=event.target.value; updateUrl(); load(); }
    if (event.target.classList.contains('guide-gallery-select')) showGallery(Number(event.target.value));
  });
  search.addEventListener('input',() => render());
  search.addEventListener('search',() => render());
  document.addEventListener('keydown',event => {
    if (event.target.matches('[data-scene]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault(); const tabs=[...document.querySelectorAll('[data-scene]')]; let index=tabs.indexOf(event.target);
      index=event.key==='Home' ? 0 : event.key==='End' ? tabs.length-1 : (index+(event.key==='ArrowRight' ? 1 : -1)+tabs.length)%tabs.length;
      selectScene(tabs[index].dataset.scene,true); return;
    }
    const editing=event.target.matches('input,textarea,select,[contenteditable="true"]');
    if (event.key === '/' && !editing && !$('#guide-image-dialog').open) { event.preventDefault(); search.focus(); }
    if (event.key === 'Escape' && document.activeElement === search) { search.value=''; render({focus:true}); }
  });
  $('#guide-image-dialog').addEventListener('close',() => imageOpener?.isConnected && imageOpener.focus({preventScroll:true}));
  $('#guide-image-dialog').addEventListener('click',event => { if (event.target === event.currentTarget) event.currentTarget.close(); });
  window.addEventListener('hashchange',() => { search.value=''; render({focus:true}); if (!route()[1]) window.scrollTo(0,0); });
  load();
})();
