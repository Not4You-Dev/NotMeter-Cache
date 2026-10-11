(() => {
  'use strict';
  const words = {
    ko: ['주신을 선택하고 노드를 눌러 효과를 확인하세요.', '활성', '미활성', '시작점', '선택한 노드', '스킬', '스탯', '활성 효과', '보드 전체', '크게 보기', '닫기', '보드를 불러오는 중…', '보드를 불러오지 못했습니다.', '다시 시도', '공개된 데바니온 정보가 없습니다.', '아직 개방되지 않은 보드입니다.', '활성화된 효과가 없습니다.', '공식 공개 정보 기준 · 캐릭터의 현재 보드', '이 보드', '노드', '화면 맞춤', '확대', '축소'],
    en: ['Choose a board, then select a node to inspect its effects.', 'Active', 'Inactive', 'Starting point', 'Selected node', 'Skills', 'Stats', 'Active effects', 'All nodes', 'Expand board', 'Close', 'Loading board…', 'Could not load this board.', 'Try again', 'No public Daevanion information.', 'This board has not been unlocked.', 'No active effects.', 'Official public data · Current character board', 'This board', 'nodes', 'Fit to view', 'Zoom in', 'Zoom out'],
    'zh-TW': ['選擇主神，點選節點查看效果。', '已啟用', '未啟用', '起點', '選取的節點', '技能', '能力值', '已啟用效果', '全部節點', '放大檢視', '關閉', '正在載入面板…', '無法載入此面板。', '重試', '暫無公開的守護力資訊。', '此面板尚未開放。', '沒有已啟用效果。', '官方公開資料 · 角色目前的面板', '此面板', '節點', '符合畫面', '放大', '縮小'],
    'ja-JP': ['主神を選び、ノードを押すと効果を確認できます。', '有効', '無効', '開始点', '選択したノード', 'スキル', 'ステータス', '有効な効果', 'すべてのノード', '拡大表示', '閉じる', 'ボードを読み込み中…', 'ボードを読み込めませんでした。', '再試行', '公開されている情報がありません。', 'このボードは未開放です。', '有効な効果はありません。', '公式公開情報 · 現在のキャラクターのボード', 'このボード', 'ノード', '画面に合わせる', '拡大', '縮小'],
    'de-DE': ['Wähle ein Brett und einen Knoten, um seine Effekte zu sehen.', 'Aktiv', 'Inaktiv', 'Startpunkt', 'Gewählter Knoten', 'Skills', 'Werte', 'Aktive Effekte', 'Alle Knoten', 'Brett vergrößern', 'Schließen', 'Brett wird geladen…', 'Dieses Brett konnte nicht geladen werden.', 'Erneut versuchen', 'Keine öffentlichen Daevanion-Daten.', 'Dieses Brett ist noch nicht freigeschaltet.', 'Keine aktiven Effekte.', 'Öffentliche offizielle Daten · Aktuelles Charakterbrett', 'Dieses Brett', 'Knoten', 'Ansicht anpassen', 'Vergrößern', 'Verkleinern'],
    'fr-FR': ['Choisissez un plateau, puis un nœud pour voir ses effets.', 'Actif', 'Inactif', 'Point de départ', 'Nœud sélectionné', 'Compétences', 'Statistiques', 'Effets actifs', 'Tous les nœuds', 'Agrandir le plateau', 'Fermer', 'Chargement du plateau…', 'Impossible de charger ce plateau.', 'Réessayer', 'Aucune donnée publique de Daevanion.', 'Ce plateau n’est pas encore débloqué.', 'Aucun effet actif.', 'Données officielles publiques · Plateau actuel du personnage', 'Ce plateau', 'nœuds', 'Ajuster à la vue', 'Agrandir', 'Réduire'],
    'es-ES': ['Elige un tablero y selecciona un nodo para ver sus efectos.', 'Activo', 'Inactivo', 'Punto de inicio', 'Nodo seleccionado', 'Habilidades', 'Estadísticas', 'Efectos activos', 'Todos los nodos', 'Ampliar tablero', 'Cerrar', 'Cargando tablero…', 'No se pudo cargar este tablero.', 'Reintentar', 'No hay datos públicos de Daevanion.', 'Este tablero aún no está desbloqueado.', 'No hay efectos activos.', 'Datos públicos oficiales · Tablero actual del personaje', 'Este tablero', 'nodos', 'Ajustar a la vista', 'Acercar', 'Alejar'],
    'pt-BR': ['Escolha um tabuleiro e selecione um nó para ver seus efeitos.', 'Ativo', 'Inativo', 'Ponto inicial', 'Nó selecionado', 'Habilidades', 'Atributos', 'Efeitos ativos', 'Todos os nós', 'Ampliar tabuleiro', 'Fechar', 'Carregando tabuleiro…', 'Não foi possível carregar este tabuleiro.', 'Tentar novamente', 'Não há dados públicos de Daevanion.', 'Este tabuleiro ainda não foi desbloqueado.', 'Não há efeitos ativos.', 'Dados públicos oficiais · Tabuleiro atual do personagem', 'Este tabuleiro', 'nós', 'Ajustar à tela', 'Ampliar', 'Reduzir'],
    'ru-RU': ['Выберите поле, затем узел, чтобы посмотреть его эффекты.', 'Активен', 'Неактивен', 'Начальная точка', 'Выбранный узел', 'Навыки', 'Характеристики', 'Активные эффекты', 'Все узлы', 'Увеличить поле', 'Закрыть', 'Загрузка поля…', 'Не удалось загрузить поле.', 'Повторить', 'Нет публичных данных Даэваниона.', 'Это поле ещё не открыто.', 'Нет активных эффектов.', 'Официальные открытые данные · Текущее поле персонажа', 'Это поле', 'узлов', 'Вписать в экран', 'Увеличить', 'Уменьшить'],
  };
  const searchWords = {
    ko: ['스킬·스탯 효과 찾기', '일치하는 노드', '일치하는 효과가 없습니다.', '이 보드의 효과', '누르면 해당 효과의 노드를 차례로 확인합니다.'],
    en: ['Find a skill or stat effect', 'Matching nodes', 'No matching effects.', 'Effects on this board', 'Select to cycle through nodes with this effect.'],
    'zh-TW': ['尋找技能或能力值效果', '符合的節點', '找不到符合的效果。', '此面板的效果', '點選可依序查看具有此效果的節點。'],
    'ja-JP': ['スキル・ステータス効果を検索', '一致するノード', '一致する効果がありません。', 'このボードの効果', '押すと、この効果を持つノードを順番に確認できます。'],
    'de-DE': ['Skill- oder Werteffekt suchen', 'Passende Knoten', 'Keine passenden Effekte.', 'Effekte auf diesem Brett', 'Anklicken, um die Knoten mit diesem Effekt durchzugehen.'],
    'fr-FR': ['Rechercher un effet', 'Nœuds correspondants', 'Aucun effet correspondant.', 'Effets de ce plateau', 'Cliquez pour parcourir les nœuds ayant cet effet.'],
    'es-ES': ['Buscar un efecto de habilidad o estadística', 'Nodos coincidentes', 'No hay efectos coincidentes.', 'Efectos de este tablero', 'Selecciona para recorrer los nodos con este efecto.'],
    'pt-BR': ['Buscar efeito de habilidade ou atributo', 'Nós correspondentes', 'Nenhum efeito encontrado.', 'Efeitos deste tabuleiro', 'Selecione para percorrer os nós com este efeito.'],
    'ru-RU': ['Найти эффект навыка или характеристики', 'Найденные узлы', 'Совпадений нет.', 'Эффекты этого поля', 'Нажмите, чтобы по очереди посмотреть узлы с этим эффектом.'],
  };
  const cache = new Map(), pending = new Map(), nameLoads = new Map(), iconLoads = new Map(), selections = new Map();
  const gestureWords = {
    ko: '휠로 확대·축소 · 드래그로 이동', en: 'Scroll to zoom · Drag to move',
    'zh-TW': '滾輪縮放 · 拖曳移動', 'ja-JP': 'ホイールで拡大・縮小 · ドラッグで移動',
    'de-DE': 'Mausrad zum Zoomen · Ziehen zum Verschieben', 'fr-FR': 'Molette pour zoomer · Glisser pour déplacer',
    'es-ES': 'Rueda para ampliar · Arrastra para mover', 'pt-BR': 'Role para ampliar · Arraste para mover',
    'ru-RU': 'Колесо — масштаб · Перетаскивание — перемещение',
  };
  const ttl = 5 * 60_000;
  let requestStarts = Promise.resolve(), nextRequestAt = 0;
  const warmedImages = new Set();
  let activeObserver = null, dismissTooltip = null, disposeViewport = null;
  const element = (tag, cls, text) => {
    const value = document.createElement(tag); value.className = cls || '';
    if (text !== undefined) value.textContent = text;
    return value;
  };
  const button = (label, cls, action) => {
    const value = element('button', cls, label); value.type = 'button';
    value.addEventListener('click', action); return value;
  };
  function mark(type) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', type === 'Start' ? 'm12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z'
      : type === 'SkillLevel' ? 'm7 17 10-10m-4-3 7 0 0 7M4 13v7h7' : 'm12 3 8 9-8 9-8-9Z M8 12h8');
    svg.append(path); return svg;
  }
  function identity(options) {
    return [options.region, options.globalRegion, options.profile?.serverId, options.profile?.characterId].join(':');
  }
  function validate(data, options, boardId) {
    if (data?.schema !== 'notmeter-character-daevanion-v1' || data.region !== (options.region === 'ww' ? `ww-${options.globalRegion}` : options.region) || data.serverId !== Number(options.profile.serverId) ||
        data.characterId !== options.profile.characterId || data.boardId !== boardId || !Array.isArray(data.nodes) ||
        !data.nodes.length || data.nodes.length > 1024) throw new Error('Invalid board identity');
    const ids = new Set(), positions = new Set();
    for (const n of data.nodes) {
      const position = `${n.row}:${n.col}`;
      if (!Number.isInteger(n.nodeId) || n.nodeId <= 0 || ids.has(n.nodeId) || positions.has(position) ||
          !Number.isInteger(n.row) || !Number.isInteger(n.col) || n.row < 1 || n.col < 1 || n.row > 32 || n.col > 32 ||
          typeof n.open !== 'boolean' || !Array.isArray(n.effects) || n.effects.some(x => typeof x !== 'string')) throw new Error('Invalid board nodes');
      ids.add(n.nodeId); positions.add(position);
    }
    return data;
  }
  function scheduleRequest(action, shouldStart) {
    const start = requestStarts.then(async () => {
      const delay = nextRequestAt - Date.now();
      if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
      if (shouldStart && !shouldStart()) throw new Error('Board prefetch cancelled');
      nextRequestAt = Date.now() + 350;
      return {response: action()};
    });
    requestStarts = start.then(() => {}, () => {});
    return start.then(result => result.response);
  }
  async function load(options, boardId, refresh, shouldStart) {
    const key = `${identity(options)}:${options.locale}:${boardId}`;
    const saved = cache.get(key);
    if (!refresh && saved && Date.now() - saved.savedAt < ttl) return saved.data;
    if (pending.has(key)) return pending.get(key);
    const query = new URLSearchParams({region: options.region, globalRegion: options.globalRegion || '',
      serverId: options.profile.serverId, characterId: options.profile.characterId, boardId, lang: options.locale});
    if (refresh) query.set('refresh', '1');
    const task = scheduleRequest(() => options.request(`/daevanion?${query}`, {timeoutMs: 20_000, cache: 'no-store'}), shouldStart)
      .then(data => {
        validate(data, options, boardId);
        cache.set(key, {data, savedAt: Date.now()});
        if (cache.size > 48) cache.delete(cache.keys().next().value);
        return data;
      }).finally(() => pending.delete(key));
    pending.set(key, task); return task;
  }
  async function prefetchBoards(options, boards, currentId, isCurrent) {
    const requests = boards.filter(b => Number(b.open) === 1 && b.id !== currentId)
      .map(b => load(options, b.id, false, isCurrent));
    const results = await Promise.allSettled(requests);
    if (!isCurrent()) return;
    const images = await icons(options.region);
    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      for (const n of result.value.nodes) {
        const frame = assetIcon(images.frames[n.type === 'Start' ? 'Start' : n.grade]?.[n.open ? 0 : 1]);
        for (const src of [frame, skillIcon(images, n), startIcon(images, n, result.value.boardId)].filter(Boolean)) {
          if (warmedImages.has(src)) continue;
          warmedImages.add(src);
          const image = new Image(); image.decoding = 'async';
          image.onerror = () => warmedImages.delete(src); image.src = src;
        }
      }
    }
  }
  async function names(region, locale) {
    const key = `${region === 'ww' ? 'ww' : 'kr'}.${locale}`;
    if (nameLoads.has(key)) return nameLoads.get(key);
    const task = fetch(`./assets/daevanion/${key}.json?v=20261009-2`, {cache: 'force-cache', signal: AbortSignal.timeout(10000)})
      .then(r => { if (!r.ok) throw new Error('Node names unavailable'); return r.json(); })
      .then(data => {
        if (data.region !== (region === 'ww' ? 'ww' : 'kr') || data.locale !== locale || !data.names) throw new Error('Wrong node language');
        return data.names;
      }).catch(error => { nameLoads.delete(key); throw error; });
    nameLoads.set(key, task); return task;
  }
  async function icons(region) {
    const key = region === 'ww' ? 'ww' : 'kr';
    if (iconLoads.has(key)) return iconLoads.get(key);
    const task = fetch(`./assets/daevanion/${key}.icons.json?v=20261009-start-class`, {cache: 'force-cache', signal: AbortSignal.timeout(10000)})
      .then(r => { if (!r.ok) throw new Error('Icons unavailable'); return r.json(); })
      .then(data => { if (data.region !== key || !data.nodes || !data.skills || !data.frames) throw new Error('Wrong icon region'); return data; })
      .catch(error => { iconLoads.delete(key); throw error; });
    iconLoads.set(key, task); return task;
  }
  function skillIcon(catalog, node) {
    const mapping = catalog?.nodes?.[node.nodeId];
    if (node.type !== 'SkillLevel' || !mapping || mapping[0] !== node.row || mapping[1] !== node.col) return '';
    const skill = catalog.skills[mapping[2]];
    const name = (node.effects[0] || '').replace(/\s+\+\d+$/, '').normalize('NFKC').trim().toLowerCase();
    return skill?.names?.some(value => value.normalize('NFKC').trim().toLowerCase() === name) ? assetIcon(skill.icon) : '';
  }
  function assetIcon(filename) {
    return /^[a-f0-9]{64}\.webp$/.test(filename || '') ? `./assets/daevanion/icons/${filename}` : '';
  }
  function startIcon(catalog, node, boardId) {
    const mapping = catalog?.starts?.[node.nodeId];
    if (node.type !== 'Start' || !mapping || mapping[0] !== node.row || mapping[1] !== node.col || mapping[2] !== boardId) return '';
    return assetIcon(catalog.classes?.[mapping[3]]);
  }
  function iconImage(source, cls, type) {
    const image = element('img', cls); image.src = source; image.alt = ''; image.loading = 'eager';
    image.addEventListener('error', () => image.replaceWith(mark(type)), {once: true}); return image;
  }
  function summarize(nodes, translate, includeInactive = false) {
    const groups = new Map();
    for (const n of nodes.filter(n => (n.open || includeInactive) && n.type !== 'Start')) {
      for (const effect of n.effects) {
        const text = translate(effect);
        const match = text.match(/^(.*?)\s+\+(\d+(?:[.,]\d+)?)(%)?$/u);
        const kind = n.type === 'SkillLevel' ? 'skill' : 'stat';
        const key = `${kind}:${match ? match[1] + (match[3] || '') : text}`;
        const item = groups.get(key) || {kind, name: match?.[1] || text, value: 0, unit: match?.[3] || '', numeric: Boolean(match), nodes: []};
        if (match && n.open) item.value += Number(match[2].replace(',', '.'));
        if (includeInactive) { item.activeNodes ||= []; if (n.open) item.activeNodes.push(n.nodeId); }
        item.nodes.push(n.nodeId); groups.set(key, item);
      }
    }
    return [...groups.values()];
  }
  function create(options) {
    dismissTooltip?.();
    disposeViewport?.();
    activeObserver?.disconnect(); activeObserver = null;
    const locale = words[options.locale] ? options.locale : 'en', w = words[locale], sw = searchWords[locale];
    const catalog = globalThis.NotMeterDaevanionCatalog?.[options.region === 'ww' ? 'ww' : 'kr']?.[locale];
    const section = element('section', 'character-section character-daevanion'); section.id = 'character-daevanion';
    const heading = element('div', 'character-section-head');
    const headingText = element('div'); headingText.append(element('h4', '', catalog?.title || 'Daevanion'), element('p', '', w[0]));
    heading.append(headingText); section.append(heading);
    const boards = (options.boards || []).filter(b => Number.isInteger(b.id) && b.id > 0);
    if (!boards.length) { section.append(element('p', 'daev-empty', w[14])); return section; }
    const body = element('div', 'daev-layout'), rail = element('div', 'daev-boards'), panel = element('div', 'daev-workspace');
    rail.setAttribute('role', 'tablist'); rail.setAttribute('aria-label', catalog?.title || 'Daevanion');
    panel.id = 'daev-board-panel'; panel.setAttribute('role', 'tabpanel');
    body.append(rail, panel); section.append(body);
    const footer = element('p', 'daev-source', w[17]); section.append(footer);
    const key = identity(options);
    let prefetchStarted = false;
    let boardId = selections.get(key), serial = 0, nodeNames = {}, iconData = null, data = null, chosen = null, filter = 'all', searchQuery = '';
    const boardName = b => catalog?.boards?.[b.id % 10] || options.translate(b.name);
    const translate = text => {
      if (Object.hasOwn(nodeNames, text)) return nodeNames[text];
      const match = String(text).match(/^(.*?)\s+([+\-]\d[\d.,]*%?)$/u);
      return match && Object.hasOwn(nodeNames, match[1]) ? `${nodeNames[match[1]]} ${match[2]}` : options.translate(text);
    };
    const nodeName = n => n.type === 'Start' ? w[3] : n.type === 'SkillLevel' ? translate(n.effects[0] || n.name).replace(/\s+\+\d+$/, '') : translate(n.name);
    const nodeSkillIcon = n => {
      const source = skillIcon(iconData, n); if (source) return source;
      const name = (n.effects[0] || '').replace(/\s+\+\d+$/, '');
      const skill = n.type === 'SkillLevel' && options.skills?.find(s => s.name === name || translate(s.name) === translate(name));
      return skill?.icon && /^https:\/\/assets\.playnccdn\.com\//.test(skill.icon) ? skill.icon : '';
    };
    const boardButtons = new Map();
    function draw() {
      if (!data) return;
      dismissTooltip?.();
      disposeViewport?.();
      const realNodes = data.nodes.filter(n => n.type !== 'Start');
      const active = realNodes.filter(n => n.open).length;
      boardButtons.get(boardId).querySelector('small').textContent = `${active} / ${realNodes.length}`;
      const content = document.createDocumentFragment(), stage = element('div', 'daev-stage');
      const toolbar = element('div', 'daev-toolbar'), filters = element('div', 'daev-filters');
      for (const [value, label] of [['all', w[8]], ['skill', w[5]], ['stat', w[6]]]) {
        const control = button(label, '', () => { filter = value; applyFilter(); });
        control.dataset.filter = value; filters.append(control);
      }
      toolbar.append(filters); content.append(toolbar);
      const columns = element('div', 'daev-columns'); content.append(columns);
      columns.append(stage);
      const viewport = element('div', 'daev-viewport'), grid = element('div', 'daev-grid');
      let moving = false;
      const finder = element('div', 'daev-finder'), search = element('input'), resultCount = element('span', 'daev-search-count');
      search.type = 'search'; search.placeholder = sw[0]; search.setAttribute('aria-label', sw[0]);
      search.value = searchQuery;
      search.autocomplete = 'off'; search.maxLength = 80; resultCount.setAttribute('aria-live', 'polite');
      finder.append(search, resultCount); stage.append(finder);
      const minRow = Math.min(...data.nodes.map(n => n.row)), minCol = Math.min(...data.nodes.map(n => n.col));
      const rows = Math.max(...data.nodes.map(n => n.row)) - minRow + 1, cols = Math.max(...data.nodes.map(n => n.col)) - minCol + 1;
      grid.style.setProperty('--daev-cols', cols); grid.style.setProperty('--daev-rows', rows);
      const nodeButtons = new Map();
      const tooltip = element('div', 'daev-tooltip');
      tooltip.id = `daev-tooltip-${boardId}`; tooltip.hidden = true; tooltip.setAttribute('role', 'tooltip');
      const usesPopover = typeof tooltip.showPopover === 'function';
      if (usesPopover) tooltip.setAttribute('popover', 'manual');
      stage.append(tooltip);
      let tooltipAnchor = null;
      function hideTooltip() {
        tooltipAnchor?.removeAttribute('aria-describedby'); tooltipAnchor = null;
        if (usesPopover && tooltip.matches(':popover-open')) tooltip.hidePopover();
        tooltip.hidden = true;
        window.removeEventListener('scroll', hideTooltip, true);
        window.removeEventListener('resize', hideTooltip);
        window.removeEventListener('keydown', dismissOnEscape);
        window.removeEventListener('hashchange', hideTooltip);
        window.removeEventListener('popstate', hideTooltip);
        if (dismissTooltip === hideTooltip) dismissTooltip = null;
      }
      function dismissOnEscape(event) { if (event.key === 'Escape') hideTooltip(); }
      function showTooltip(n, anchor) {
        if (moving) return;
        dismissTooltip?.(); tooltipAnchor = anchor;
        const title = element('div', 'daev-tooltip-title');
        const source = nodeSkillIcon(n);
        if (source) title.append(iconImage(source, 'daev-tooltip-icon', n.type));
        title.append(element('strong', '', nodeName(n)));
        const status = element('span', `daev-node-status ${n.open ? 'is-active' : ''}`, n.type === 'Start' ? w[3] : n.open ? w[1] : w[2]);
        tooltip.replaceChildren(title, status, ...n.effects.map(text => element('p', '', translate(text))));
        tooltip.hidden = false;
        if (usesPopover) tooltip.showPopover();
        const rect = anchor.getBoundingClientRect(), box = tooltip.getBoundingClientRect();
        const width = document.documentElement.clientWidth, height = window.innerHeight, gap = 12;
        let left = rect.right + gap;
        if (left + box.width > width - gap) left = rect.left - box.width - gap;
        let top = rect.top + (rect.height - box.height) / 2;
        if (left < gap) { left = (rect.left + rect.right - box.width) / 2; top = rect.bottom + gap;
          if (top + box.height > height - gap) top = rect.top - box.height - gap; }
        tooltip.style.left = `${Math.max(gap, Math.min(left, width - box.width - gap))}px`;
        tooltip.style.top = `${Math.max(gap, Math.min(top, height - box.height - gap))}px`;
        anchor.setAttribute('aria-describedby', tooltip.id); dismissTooltip = hideTooltip;
        window.addEventListener('scroll', hideTooltip, true);
        window.addEventListener('resize', hideTooltip);
        window.addEventListener('keydown', dismissOnEscape);
        window.addEventListener('hashchange', hideTooltip);
        window.addEventListener('popstate', hideTooltip);
      }
      const sorted = [...data.nodes].sort((a, b) => a.row - b.row || a.col - b.col);
      chosen = sorted.find(n => n.nodeId === chosen?.nodeId) || sorted.find(n => n.open && n.type === 'SkillLevel') || sorted[0];
      for (const n of sorted) {
        const b = button('', `daev-node ${n.open ? 'is-active' : 'is-inactive'} type-${n.type === 'SkillLevel' ? 'skill' : n.type === 'Start' ? 'start' : 'stat'}`, () => choose(n, true));
        b.style.gridRow = n.row - minRow + 1; b.style.gridColumn = n.col - minCol + 1;
        b.dataset.kind = n.type === 'SkillLevel' ? 'skill' : 'stat'; b.dataset.grade = n.grade;
        b.setAttribute('aria-label', `${nodeName(n)} · ${n.type === 'Start' ? w[3] : n.open ? w[1] : w[2]}`);
        b.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') showTooltip(n, b); });
        b.addEventListener('pointerleave', () => { if (tooltipAnchor === b) hideTooltip(); });
        b.addEventListener('focus', () => showTooltip(n, b));
        b.addEventListener('blur', () => { if (tooltipAnchor === b) hideTooltip(); });
        const frame = assetIcon(iconData.frames[n.type === 'Start' ? 'Start' : n.grade]?.[n.open ? 0 : 1]);
        const skillSource = nodeSkillIcon(n);
        const startSource = startIcon(iconData, n, data.boardId);
        if (frame) { b.classList.add('has-frame'); b.append(iconImage(frame, 'daev-frame', n.type)); }
        if (skillSource) b.append(iconImage(skillSource, 'daev-skill-image', n.type));
        else if (startSource) b.append(iconImage(startSource, 'daev-start-image', n.type));
        else if (!frame) b.append(mark(n.type));
        b.addEventListener('keydown', e => {
          const i = sorted.indexOf(n);
          const next = e.key === 'Home' ? sorted[0] : e.key === 'End' ? sorted.at(-1) : e.key === 'ArrowRight' ? sorted[i + 1] : e.key === 'ArrowLeft' ? sorted[i - 1]
            : e.key === 'ArrowUp' ? [...sorted].reverse().find(x => x.row < n.row && x.col === n.col)
            : e.key === 'ArrowDown' ? sorted.find(x => x.row > n.row && x.col === n.col) : null;
          if (next) { e.preventDefault(); choose(next, true); }
        });
        nodeButtons.set(n.nodeId, b); grid.append(b);
      }
      viewport.append(grid); stage.append(viewport);
      const zoomControls = element('div', 'daev-zoom');
      const camera = boardCamera(cols * 50 + 10, rows * 50 + 10);
      const zoomLabel = element('output');
      function paintCamera() {
        const {x, y, scale} = camera.view;
        grid.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        zoomLabel.textContent = `${Math.round(scale * 100)}%`;
      }
      const hint = element('p', 'daev-gesture-hint', gestureWords[locale]); hint.id = `daev-gesture-${boardId}`;
      viewport.setAttribute('aria-describedby', hint.id);
      const fit = button(w[20], '', () => { hideTooltip(); camera.fit(); paintCamera(); });
      zoomControls.append(zoomLabel, fit, hint); stage.append(zoomControls);
      const resize = new ResizeObserver(() => {
        if (!viewport.clientWidth || !viewport.clientHeight) return;
        hideTooltip(); camera.resize(viewport.clientWidth, viewport.clientHeight); paintCamera();
      });
      disposeViewport = () => { resize.disconnect(); disposeViewport = null; };
      viewport.addEventListener('wheel', event => {
        event.preventDefault(); hideTooltip();
        const rect = viewport.getBoundingClientRect();
        const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1);
        camera.zoomAt(Math.exp(-Math.max(-240, Math.min(240, pixels)) * .0025), event.clientX - rect.left, event.clientY - rect.top);
        paintCamera();
      }, {passive: false});
      const pointers = new Map(); let dragOrigin = null, suppressClick = false;
      viewport.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
        dragOrigin = {x: event.clientX, y: event.clientY}; suppressClick = false;
        if (pointers.size > 1) { moving = true; suppressClick = true; hideTooltip(); }
      });
      viewport.addEventListener('pointermove', event => {
        const previous = pointers.get(event.pointerId); if (!previous) return;
        const next = {x: event.clientX, y: event.clientY};
        if (!moving && Math.hypot(next.x - dragOrigin.x, next.y - dragOrigin.y) < 5) return;
        moving = true; suppressClick = true; hideTooltip(); viewport.classList.add('is-dragging');
        if (!viewport.hasPointerCapture(event.pointerId)) viewport.setPointerCapture(event.pointerId);
        const other = [...pointers].find(([id]) => id !== event.pointerId)?.[1];
        if (other) {
          const rect = viewport.getBoundingClientRect();
          const before = Math.hypot(previous.x - other.x, previous.y - other.y);
          const after = Math.hypot(next.x - other.x, next.y - other.y);
          if (before > 4) camera.zoomAt(after / before, (previous.x + other.x) / 2 - rect.left, (previous.y + other.y) / 2 - rect.top);
          camera.move((next.x - previous.x) / 2, (next.y - previous.y) / 2);
        } else camera.move(next.x - previous.x, next.y - previous.y);
        pointers.set(event.pointerId, next); paintCamera();
      });
      function stopPointer(event) {
        pointers.delete(event.pointerId);
        if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
        if (!pointers.size) { moving = false; dragOrigin = null; viewport.classList.remove('is-dragging'); }
      }
      viewport.addEventListener('pointerup', stopPointer);
      viewport.addEventListener('pointercancel', stopPointer);
      viewport.addEventListener('lostpointercapture', stopPointer);
      viewport.addEventListener('pointerleave', event => { if (!moving) stopPointer(event); });
      viewport.addEventListener('dragstart', event => event.preventDefault());
      viewport.addEventListener('click', event => {
        if (suppressClick && event.detail !== 0) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; }
      }, true);
      viewport.addEventListener('keydown', event => {
        if (!['+', '=', '-', '0'].includes(event.key)) return;
        event.preventDefault(); hideTooltip();
        if (event.key === '0') camera.fit();
        else camera.zoomAt(event.key === '-' ? .8 : 1.25, viewport.clientWidth / 2, viewport.clientHeight / 2);
        paintCamera();
      });
      const aside = element('aside', 'daev-inspector'), selection = element('div', 'daev-selection');
      selection.setAttribute('aria-live', 'polite'); aside.append(selection);
      aside.append(element('h5', 'daev-effects-title', `${sw[3]} · ${boardName(boards.find(b => b.id === boardId))}`));
      const effects = element('div', 'daev-effects'), groups = summarize(data.nodes, translate, true), effectRows = [];
      for (const kind of ['skill', 'stat']) {
        const rows = groups.filter(g => g.kind === kind); if (!rows.length) continue;
        effects.append(element('h6', '', kind === 'skill' ? w[5] : w[6]));
        for (const row of rows) {
          const line = button('', 'daev-effect', () => {
            const index = row.nodes.indexOf(chosen.nodeId);
            choose(data.nodes.find(n => n.nodeId === row.nodes[(index + 1) % row.nodes.length]), false);
          });
          line.title = sw[4];
          const icon = row.kind === 'skill' ? nodeSkillIcon(data.nodes.find(n => n.nodeId === row.nodes[0])) : '';
          if (icon) line.append(iconImage(icon, 'daev-effect-icon', 'SkillLevel'));
          const label = element('span', 'daev-effect-label', row.name);
          label.append(element('small', '', `${w[1]} ${row.activeNodes.length} / ${row.nodes.length}`));
          line.append(label);
          if (row.numeric) line.append(element('strong', '', `+${Number(row.value.toFixed(3)).toLocaleString(locale)}${row.unit}`));
          effects.append(line);
          effectRows.push({line, row});
        }
      }
      if (!groups.length) effects.append(element('p', 'daev-empty', w[16]));
      aside.append(effects); columns.append(aside);
      function choose(n, focus, reveal = true) {
        chosen = n;
        for (const [id, b] of nodeButtons) { b.setAttribute('aria-pressed', String(id === n.nodeId)); b.tabIndex = id === n.nodeId ? 0 : -1; }
        const state = element('span', `daev-node-status ${n.open ? 'is-active' : ''}`, n.type === 'Start' ? w[3] : n.open ? w[1] : w[2]);
        const detail = element('div', 'daev-selection-effects');
        for (const text of n.effects) detail.append(element('p', '', translate(text)));
        const title = element('div', 'daev-selection-title');
        const icon = nodeSkillIcon(n);
        if (icon) title.append(iconImage(icon, 'daev-selection-icon', n.type));
        title.append(element('h5', '', nodeName(n)));
        selection.replaceChildren(element('small', '', w[4]), title, state, detail);
        if (reveal) camera.reveal((n.col - minCol) * 50 + 8, (n.row - minRow) * 50 + 8, 44, 44);
        paintCamera();
        if (focus) nodeButtons.get(n.nodeId)?.focus({preventScroll: true});
      }
      function applyFilter() {
        for (const b of filters.children) b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
        const term = search.value.trim().toLocaleLowerCase(locale);
        const matches = sorted.filter(n => (filter === 'all' || (filter === 'skill') === (n.type === 'SkillLevel')) &&
          [nodeName(n), ...n.effects.map(translate)].some(text => text.toLocaleLowerCase(locale).includes(term)));
        const ids = new Set(matches.map(n => n.nodeId));
        for (const [id, control] of nodeButtons) control.classList.toggle('is-dimmed', !ids.has(id));
        resultCount.textContent = term || filter !== 'all' ? `${sw[1]} ${matches.length}` : '';
        for (const {line, row} of effectRows) line.hidden = !row.nodes.some(id => ids.has(id));
        for (const title of effects.querySelectorAll('h6')) {
          let sibling = title.nextElementSibling, visible = false;
          while (sibling && sibling.tagName !== 'H6') { visible ||= !sibling.hidden; sibling = sibling.nextElementSibling; }
          title.hidden = !visible;
        }
        if (matches.length && !ids.has(chosen.nodeId)) choose(matches[0], false);
        selection.hidden = !matches.length;
        noMatches.hidden = matches.length > 0;
      }
      const noMatches = element('p', 'daev-empty', sw[2]); aside.prepend(noMatches);
      search.addEventListener('input', () => { searchQuery = search.value; applyFilter(); });
      // Swap the complete board once, before measuring its camera.
      panel.replaceChildren(content); panel.style.removeProperty('min-height');
      camera.resize(viewport.clientWidth, viewport.clientHeight);
      choose(chosen, false, false); applyFilter();
      resize.observe(viewport);
    }
    async function select(b, refresh = false) {
      if (!refresh && boardId === b.id && (data?.boardId === b.id || panel.hasAttribute('aria-busy'))) return;
      dismissTooltip?.();
      boardId = b.id; selections.set(key, boardId);
      if (selections.size > 24) selections.delete(selections.keys().next().value);
      const version = ++serial;
      for (const [id, control] of boardButtons) { control.setAttribute('aria-selected', String(id === b.id)); control.tabIndex = id === b.id ? 0 : -1; }
      panel.setAttribute('aria-labelledby', `daev-tab-${b.id}`);
      if (panel.querySelector('.daev-columns')) panel.style.minHeight = `${panel.getBoundingClientRect().height}px`;
      if (Number(b.open) !== 1) {
        disposeViewport?.(); data = null; chosen = null;
        panel.removeAttribute('aria-busy'); panel.replaceChildren(element('p', 'daev-empty', w[15])); return;
      }
      panel.setAttribute('aria-busy', 'true');
      if (panel.querySelector('.daev-columns')) {
        for (const child of panel.children) child.inert = true;
        if (!panel.querySelector('.daev-loading')) {
          const loading = element('p', 'daev-loading', w[11]); loading.setAttribute('role', 'status'); panel.append(loading);
        }
      } else panel.replaceChildren(element('p', 'daev-empty', w[11]));
      try {
        const localized = {...options, locale};
        const requested = load(localized, b.id, refresh);
        if (!prefetchStarted) {
          prefetchStarted = true;
          void prefetchBoards(localized, boards, b.id, () => section.isConnected).catch(() => {});
        }
        const [payload, dictionary, images] = await Promise.all([requested, names(options.region, locale), icons(options.region)]);
        if (version !== serial || !section.isConnected) return;
        data = payload; chosen = null; nodeNames = dictionary; iconData = images; draw();
      } catch {
        if (version !== serial || !section.isConnected) return;
        disposeViewport?.(); data = null; chosen = null;
        const error = element('div', 'daev-empty'); error.setAttribute('role', 'status');
        error.append(element('p', '', w[12]), button(w[13], 'daev-retry', () => select(b, true))); panel.replaceChildren(error);
      } finally { if (version === serial) panel.removeAttribute('aria-busy'); }
    }
    for (const b of boards) {
      const control = button('', 'daev-board-tab', () => select(b));
      control.id = `daev-tab-${b.id}`; control.setAttribute('role', 'tab'); control.setAttribute('aria-controls', panel.id);
      control.append(element('strong', '', boardName(b)), element('small', '', `${Number(b.openNodeCount) || 0} / ${Number(b.totalNodeCount) || 0}`));
      control.addEventListener('keydown', e => {
        const index = boards.indexOf(b);
        const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? boards[(index + 1) % boards.length]
          : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? boards[(index + boards.length - 1) % boards.length] : null;
        if (next) { e.preventDefault(); boardButtons.get(next.id).focus(); select(next); }
      });
      rail.append(control); boardButtons.set(b.id, control);
    }
    const initial = boards.find(b => b.id === boardId) || boards.find(b => Number(b.open) === 1) || boards[0];
    // Fetch only when this section is about to enter the viewport.
    if ('IntersectionObserver' in globalThis) {
      const observer = new IntersectionObserver(entries => {
        if (!section.isConnected && serial > 0) { observer.disconnect(); return; }
        if (entries.some(e => e.isIntersecting)) { observer.disconnect(); if (!serial) void select(initial); }
      }, {rootMargin: '300px'});
      activeObserver = observer;
      observer.observe(section);
    } else queueMicrotask(() => select(initial));
    return section;
  }
  function boardCamera(boardWidth, boardHeight) {
    let width = 0, height = 0, fitScale = 1, edited = false;
    const view = {x: 0, y: 0, scale: 1};
    function clamp() {
      const axis = (offset, size, extent) => extent <= size ? (size - extent) / 2 : Math.max(size - extent - 12, Math.min(12, offset));
      view.x = axis(view.x, width, boardWidth * view.scale);
      view.y = axis(view.y, height, boardHeight * view.scale);
    }
    return {
      view,
      resize(w, h) {
        const cx = (width / 2 - view.x) / view.scale, cy = (height / 2 - view.y) / view.scale;
        width = w; height = h; fitScale = Math.min((w - 16) / boardWidth, (h - 16) / boardHeight, 1.65);
        if (!edited) { view.scale = Math.max(.95, fitScale); view.x = (w - boardWidth * view.scale) / 2; view.y = (h - boardHeight * view.scale) / 2; }
        else { view.x = w / 2 - cx * view.scale; view.y = h / 2 - cy * view.scale; }
        clamp();
      },
      fit() { edited = true; view.scale = fitScale; view.x = (width - boardWidth * view.scale) / 2; view.y = (height - boardHeight * view.scale) / 2; clamp(); },
      zoomAt(factor, x, y) {
        edited = true;
        const scale = Math.max(Math.min(fitScale, .78) * .65, Math.min(3, view.scale * factor));
        view.x = x - (x - view.x) * scale / view.scale; view.y = y - (y - view.y) * scale / view.scale;
        view.scale = scale; clamp();
      },
      move(dx, dy) { edited = true; view.x += dx; view.y += dy; clamp(); },
      reveal(x, y, w, h) {
        if (!width || !height) return;
        if (view.x + x * view.scale < 12) view.x = 12 - x * view.scale;
        else if (view.x + (x + w) * view.scale > width - 12) view.x = width - 12 - (x + w) * view.scale;
        if (view.y + y * view.scale < 12) view.y = 12 - y * view.scale;
        else if (view.y + (y + h) * view.scale > height - 12) view.y = height - 12 - (y + h) * view.scale;
        clamp();
      },
    };
  }
  globalThis.NotMeterDaevanion = Object.freeze({create, validate, summarize, skillIcon, startIcon, boardCamera,
    title: (locale, region) => globalThis.NotMeterDaevanionCatalog?.[region === 'ww' ? 'ww' : 'kr']?.[locale]?.title || 'Daevanion',
    close: () => { dismissTooltip?.(); disposeViewport?.(); activeObserver?.disconnect(); activeObserver = null; }});
})();
