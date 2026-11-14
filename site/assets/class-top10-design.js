(() => {
  "use strict";
  const keys = ["classTop10Method","classTop10Scope","classTop10Explore","classTop10Roster","classTop10Updated","classTop10Breakdown","classTop10BreakdownAria","classTop10Content","classTop10ScoreScale","classTop10Points","classTop10PlacementRank","classTop10PlacementBasis","classTop10OpenPlacement"];
  const copy = {
    "ko": ["집계 기준","전체 기간 · 모든 CP","성적을 펼쳐 콘텐츠별 순위와 DPS를 확인하세요.","{job} TOP 10","갱신 {time}","성적 {count}개","{name}의 콘텐츠별 성적","콘텐츠","막대 길이는 해당 클래스 1위의 종합 점수 대비 비율입니다.","점수","전체 기간 순위","전체 기간 · 모든 CP 기준입니다. 이번 주 순위와 다를 수 있습니다. 콘텐츠 이름을 누르면 같은 조건의 랭킹을 확인할 수 있습니다.","전체 기간·모든 CP 랭킹 보기"],
    "en": ["How scores work","All time · All CP","Expand a result to see ranks and DPS for each encounter.","{job} TOP 10","Updated {time}","{count} results","Results by encounter for {name}","Encounter","Bar length shows the score relative to the leader in this class.","Points","All-time rank","These results use all time and all CP. This week’s ranks can differ. Select an encounter to view its leaderboard with the same filters.","View all-time, all-CP rankings"],
    "zh-TW": ["計分方式","全期間 · 所有 CP","展開成績，查看各項內容的排名與 DPS。","{job} TOP 10","更新於 {time}","{count} 項成績","{name} 的各項成績","內容","長條長度表示綜合分數相對於該職業第一名的比例。","分數","全期間排名","以下成績以全期間、所有 CP 為準，可能與本週排名不同。點選內容名稱，即可查看相同條件的排行榜。","查看全期間、所有 CP 排行榜"],
    "ja-JP": ["集計ルール","全期間 · 全CP","成績を開くと、コンテンツ別の順位とDPSを確認できます。","{job} TOP 10","更新 {time}","成績 {count}件","{name}のコンテンツ別成績","コンテンツ","バーの長さは、この職業の1位の総合スコアに対する割合です。","得点","全期間順位","全期間・全CPの成績です。今週の順位とは異なる場合があります。コンテンツ名を選ぶと、同じ条件のランキングを確認できます。","全期間・全CPのランキングを見る"],
    "de-DE": ["Punktevergabe","Alle Zeiten · Alle CP","Klappe ein Ergebnis auf, um Rang und DPS pro Begegnung zu sehen.","{job} TOP 10","Aktualisiert: {time}","{count} Ergebnisse","Ergebnisse von {name} je Begegnung","Begegnung","Die Balkenlänge zeigt die Punktzahl im Verhältnis zum Erstplatzierten dieser Klasse.","Punkte","Allzeit-Rang","Diese Ergebnisse gelten für alle Zeiten und alle CP-Werte. Wochenränge können abweichen. Wähle eine Begegnung, um die Rangliste mit denselben Filtern zu öffnen.","Allzeit-Rangliste für alle CP öffnen"],
    "fr-FR": ["Calcul des points","Toutes périodes · Tous CP","Dépliez un résultat pour voir le rang et le DPS de chaque combat.","{job} TOP 10","Mise à jour : {time}","{count} résultats","Résultats de {name} par combat","Combat","La longueur de la barre représente le score par rapport au premier de cette classe.","Points","Rang historique","Ces résultats portent sur toutes les périodes et tous les CP. Les rangs de cette semaine peuvent différer. Sélectionnez un combat pour ouvrir son classement avec les mêmes filtres.","Voir le classement historique, tous CP"],
    "es-ES": ["Cómo se puntúa","Histórico · Todos los CP","Despliega un resultado para ver el puesto y el DPS de cada combate.","{job} TOP 10","Actualizado: {time}","{count} resultados","Resultados de {name} por combate","Combate","La longitud de la barra muestra la puntuación respecto al primer puesto de esta clase.","Puntos","Puesto histórico","Estos resultados incluyen todo el historial y todos los CP. Los puestos de esta semana pueden ser distintos. Selecciona un combate para ver su clasificación con los mismos filtros.","Ver clasificación histórica de todos los CP"],
    "pt-BR": ["Como funciona a pontuação","Todos os tempos · Todos os CP","Expanda um resultado para ver a posição e o DPS de cada combate.","{job} TOP 10","Atualizado: {time}","{count} resultados","Resultados de {name} por combate","Combate","O comprimento da barra mostra a pontuação em relação ao primeiro colocado desta classe.","Pontos","Posição histórica","Estes resultados consideram todos os tempos e todos os CP. As posições desta semana podem ser diferentes. Selecione um combate para abrir o ranking com os mesmos filtros.","Ver ranking histórico de todos os CP"],
    "ru-RU": ["Как начисляются очки","Всё время · Все CP","Разверните результат, чтобы увидеть место и DPS в каждом бою.","{job} TOP 10","Обновлено: {time}","Результатов: {count}","Результаты {name} по боям","Бой","Длина полосы показывает долю очков от результата лидера этого класса.","Очки","Место за всё время","Результаты учитывают всё время и все значения CP. Места за эту неделю могут отличаться. Выберите бой, чтобы открыть рейтинг с теми же фильтрами.","Открыть рейтинг за всё время со всеми CP"],
    "vi": ["Cách tính điểm","Toàn thời gian · Mọi mức CP","Mở rộng kết quả để xem thứ hạng và DPS trong từng nội dung.","{job} TOP 10","Cập nhật: {time}","{count} kết quả","Kết quả theo từng nội dung của {name}","Nội dung","Độ dài thanh thể hiện điểm số so với người đứng đầu lớp nhân vật này.","Điểm","Hạng toàn thời gian","Kết quả tính theo toàn thời gian và mọi mức CP. Thứ hạng tuần này có thể khác. Chọn nội dung để xem bảng xếp hạng với cùng bộ lọc.","Xem xếp hạng toàn thời gian, mọi mức CP"],
  };
  const layoutCopy = {
    ko: ["랭킹 · 통계", "직업 종합 TOP 10", "여러 던전의 성적을 합산한 직업별 종합 순위", "종합 순위", "막대 색 = 던전별 획득 점수 · 행을 누르면 상세", "던전별 점수 구성", "종합", "최다 획득 던전", "주력", "{job} TOP 10 · 던전별 점수 비중", "상위 10명이 어느 던전에서 점수를 얻었는지 합산했습니다. 항목에 마우스를 올리면 표에서 강조됩니다.", "정확한 주간 종합 순위를 표시할 수 없습니다.", "이번 주 집계 대상 기록이 아직 없습니다.", "던전 전체"],
    en: ["Rankings & stats", "Class Overall TOP 10", "Overall class rankings based on results across multiple dungeons", "Overall rankings", "Bar colors show points by dungeon · Select a row for details", "Points by dungeon", "Total", "Top dungeon", "Best", "{job} TOP 10 · Points by dungeon", "Points earned by the top 10 across all dungeons. Hover over a dungeon to highlight it in the table.", "An accurate weekly overall ranking is unavailable.", "There are no qualifying records this week yet.", "All bosses"],
    "zh-TW": ["排行與統計", "職業綜合 TOP 10", "合計多個副本成績的各職業綜合排名", "綜合排名", "長條顏色代表各副本得分 · 點選列查看詳情", "副本得分組成", "總分", "最高得分副本", "最佳", "{job} TOP 10 · 各副本得分占比", "合計前 10 名在各副本獲得的分數。將游標移至副本可在表格中突顯。", "目前無法顯示準確的本週綜合排名。", "本週尚無符合條件的紀錄。", "所有首領"],
    "ja-JP": ["ランキング・統計", "クラス総合 TOP 10", "複数のダンジョンの成績を合算したクラス別総合順位", "総合順位", "バーの色はダンジョン別の得点 · 行を選択して詳細を表示", "ダンジョン別得点", "合計", "最高得点のダンジョン", "最高", "{job} TOP 10 · ダンジョン別得点比率", "上位10人のダンジョン別得点を合算しました。項目にカーソルを合わせると表内で強調します。", "正確な週間総合順位を表示できません。", "今週は対象記録がまだありません。", "全ボス"],
    "de-DE": ["Ranglisten und Statistik", "Klassenwertung TOP 10", "Klassenwertung aus den Ergebnissen mehrerer Dungeons", "Gesamtwertung", "Balkenfarben zeigen Punkte pro Dungeon · Zeile für Details auswählen", "Punkte pro Dungeon", "Gesamt", "Bester Dungeon", "Beste", "{job} TOP 10 · Punkte pro Dungeon", "Punkte der besten zehn je Dungeon. Bewege den Mauszeiger auf einen Dungeon, um ihn in der Tabelle hervorzuheben.", "Eine genaue Wochenwertung ist nicht verfügbar.", "Diese Woche gibt es noch keine gültigen Einträge.", "Alle Bosse"],
    "fr-FR": ["Classements et statistiques", "TOP 10 par classe", "Classement par classe calculé à partir de plusieurs donjons", "Classement général", "La couleur indique les points par donjon · Sélectionnez une ligne pour les détails", "Points par donjon", "Total", "Meilleur donjon", "Meilleur", "{job} TOP 10 · Points par donjon", "Points des dix premiers par donjon. Survolez un donjon pour le mettre en évidence dans le tableau.", "Le classement général de la semaine ne peut pas être établi avec précision.", "Aucun résultat admissible cette semaine.", "Tous les boss"],
    "es-ES": ["Clasificaciones y estadísticas", "TOP 10 por clase", "Clasificación por clase según los resultados en varias mazmorras", "Clasificación general", "El color indica los puntos por mazmorra · Selecciona una fila para ver los detalles", "Puntos por mazmorra", "Total", "Mejor mazmorra", "Mejor", "{job} TOP 10 · Puntos por mazmorra", "Puntos de los diez primeros en cada mazmorra. Pasa el cursor por una mazmorra para resaltarla en la tabla.", "No se puede mostrar una clasificación semanal exacta.", "Aún no hay registros válidos esta semana.", "Todos los jefes"],
    "pt-BR": ["Rankings e estatísticas", "TOP 10 por classe", "Ranking por classe com base nos resultados de várias masmorras", "Ranking geral", "As cores mostram os pontos por masmorra · Selecione uma linha para ver detalhes", "Pontos por masmorra", "Total", "Melhor masmorra", "Melhor", "{job} TOP 10 · Pontos por masmorra", "Pontos dos dez primeiros por masmorra. Passe o cursor sobre uma masmorra para destacá-la na tabela.", "Não há um ranking semanal geral preciso disponível.", "Ainda não há registros válidos nesta semana.", "Todos os chefes"],
    "ru-RU": ["Рейтинги и статистика", "ТОП 10 по классам", "Общий рейтинг класса по результатам в нескольких подземельях", "Общий рейтинг", "Цвет показывает очки за подземелье · Выберите строку для подробностей", "Очки по подземельям", "Итого", "Лучшее подземелье", "Лучший результат", "{job} ТОП 10 · Очки по подземельям", "Очки десяти лидеров по подземельям. Наведите курсор на подземелье, чтобы выделить его в таблице.", "Точный общий рейтинг за неделю недоступен.", "На этой неделе пока нет подходящих записей.", "Все боссы"],
    "th-TH": ["อันดับและสถิติ", "TOP 10 ประจำคลาส", "อันดับรวมของแต่ละคลาสจากผลงานในหลายดันเจี้ยน", "อันดับรวม", "สีแถบแสดงคะแนนแต่ละดันเจี้ยน · เลือกแถวเพื่อดูรายละเอียด", "คะแนนแต่ละดันเจี้ยน", "รวม", "ดันเจี้ยนคะแนนสูงสุด", "สูงสุด", "{job} TOP 10 · สัดส่วนคะแนนแต่ละดันเจี้ยน", "รวมคะแนนสิบอันดับแรกในแต่ละดันเจี้ยน วางเมาส์เหนือชื่อดันเจี้ยนเพื่อเน้นในตาราง", "ไม่สามารถแสดงอันดับรวมรายสัปดาห์ที่แม่นยำได้", "ยังไม่มีสถิติที่เข้าเกณฑ์ในสัปดาห์นี้", "บอสทั้งหมด"],
    vi: ["Xếp hạng và thống kê", "TOP 10 theo lớp", "Xếp hạng tổng hợp theo lớp từ thành tích ở nhiều phụ bản", "Xếp hạng tổng hợp", "Màu thanh thể hiện điểm theo phụ bản · Chọn hàng để xem chi tiết", "Điểm theo phụ bản", "Tổng", "Phụ bản nhiều điểm nhất", "Cao nhất", "{job} TOP 10 · Tỷ trọng điểm theo phụ bản", "Tổng điểm của 10 người đứng đầu theo từng phụ bản. Di chuột qua phụ bản để làm nổi bật trong bảng.", "Hiện không có xếp hạng tổng hợp chính xác cho tuần này.", "Tuần này chưa có bản ghi hợp lệ.", "Tất cả trùm"],
  };
  const layoutKeys = ["group", "title", "description", "overall", "hint", "distribution", "total", "bestDungeon", "best", "share", "shareHint", "unavailable", "emptyWeek", "allBosses"];
  const jobTints = new Map([["마도성", 300], ["살성", 15], ["호법성", 70], ["궁성", 150], ["검성", 200], ["수호성", 240], ["정령성", 180], ["치유성", 95], ["권성", 35]]);
  const dungeonHues = [["snow", 220], ["deus", 285], ["noiran", 160], ["fire", 30], ["deva", 330], ["horn", 115], ["night", 260], ["dummy", 60]];
  const scriptUrl = typeof document === "object" && document.currentScript ? new URL(document.currentScript.src) : null;
  const stylesheet = scriptUrl ? new URL(`./class-top10-reference.css${scriptUrl.search}`, scriptUrl).href : "";
  const weekly = new WeakMap();
  let context, root, host, job = "검성", period = "Weekly", openRank = 0;

  function element(tag, className, label) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (label != null) node.textContent = label;
    return node;
  }

  function label(key, values = {}) {
    const language = context.locale === "th" ? "th-TH" : context.locale;
    return (layoutCopy[language] || layoutCopy.en)[layoutKeys.indexOf(key)].replace(/\{(\w+)\}/g, (_, name) => values[name]);
  }

  function points(snapshot, rank) {
    const limit = snapshot.topRankLimit || (context.service === "Global" ? 50 : 20);
    const step = snapshot.pointsPerRankStep || (context.service === "Global" ? 2 : 5);
    return Math.max(0, limit + 1 - rank) * step;
  }

  function aggregateWeekly(boards, snapshot, service) {
    if (!boards) return null;
    const jobs = new Map();
    for (const board of boards) {
      if (!jobs.has(board.job)) jobs.set(board.job, new Map());
      const players = jobs.get(board.job);
      for (const player of board.players) {
        const { rank, dps, combatPower } = player;
        if (!(rank > 0 && dps > 0 && player.serverId > 0) || !points(snapshot, rank)) continue;
        const hidden = (service === "Global" ? player.nameHidden !== false : player.nameHidden === true) ||
          /[*＊]/u.test(player.name || "");
        // A masked name is not a cross-dungeon identity. Never merge distinct private players.
        if (!player.identityKey && (hidden || !player.name?.trim())) return null;
        const name = player.name?.normalize("NFC").trim() || "";
        const region = player.serverRegion || player.region || (/^\[TW\]/i.test(name) ? "tw" : "");
        const key = JSON.stringify([region, player.serverId, player.identityKey || name.toLowerCase()]);
        const entry = players.get(key) || { ...player, name: hidden ? "***" : name,
          nameHidden: hidden, characterId: hidden ? "" : player.characterId,
          score: 0, totalDps: 0, firstPlaceCount: 0, placements: [] };
        entry.score += points(snapshot, rank);
        entry.totalDps += dps;
        entry.firstPlaceCount += Number(rank === 1);
        entry.placements.push({ dungeonKey: board.dungeonKey, dungeonName: board.dungeonName,
          bossKey: board.bossKey, bossIndex: board.bossIndex, bossName: player.bossName, rank, dps, combatPower });
        players.set(key, entry);
      }
    }
    return { ...snapshot, jobs: [...jobs].map(([jobName, players]) => ({ jobName,
      players: [...players.values()].sort((a, b) => b.score - a.score || b.totalDps - a.totalDps ||
        b.firstPlaceCount - a.firstPlaceCount || b.placements.length - a.placements.length || a.serverId - b.serverId ||
        (globalThis.NotMeterChapterNames?.nameOrder(a, b, true) ?? (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)))
        .slice(0, 10).map((player, i) => ({ ...player, rank: i + 1 })),
    })) };
  }

  function weeklySnapshot() {
    const { data, snapshot, weeklyBoards, weeklyCurrent, service } = context;
    if (!snapshot || !data) return undefined;
    if (!weeklyCurrent) return null;
    let result = weekly.get(data);
    if (!result) {
      result = { snapshot: undefined };
      weekly.set(data, result);
      Promise.resolve().then(weeklyBoards).then(boards => {
        result.snapshot = aggregateWeekly(boards, snapshot, service);
      }).catch(error => {
        console.warn("TOP 10 weekly rankings unavailable", error);
        result.snapshot = null;
        weekly.delete(data);
      }).finally(() => {
        if (context.data === data && context.weeklyCurrent && period === "Weekly" && !host.parentElement.hidden) {
          drawResults(result.snapshot);
        }
      });
    }
    return result.snapshot;
  }

  function rankBadge(rank) {
    const badge = element("span", `rk rk-${rank <= 5 ? "gold" : "sky"}`);
    badge.append(element("span", "rk-dia"), element("span", "rk-n mono", rank));
    return badge;
  }

  function color(key) {
    const hue = dungeonHues.find(([id]) => key.includes(id))?.[1] ?? 205;
    return `oklch(0.72 0.12 ${hue})`;
  }

  function groupPlacements(player, snapshot) {
    const parts = new Map();
    for (const placement of player.placements || []) {
      const { dungeonKey, dungeonName } = placement;
      if (!dungeonKey) continue;
      const score = points(snapshot, placement.rank);
      if (!score) continue;
      const part = parts.get(dungeonKey) || { key: dungeonKey, name: context.dungeonName(dungeonKey, dungeonName), score: 0, placements: [] };
      part.score += score;
      part.placements.push({ ...placement, score });
      parts.set(dungeonKey, part);
    }
    return [...parts.values()].sort((a, b) => b.score - a.score);
  }

  function stack(parts, width, thin = false) {
    const bar = element("span", thin ? "stack thin" : "stack");
    bar.style.width = `${width}%`;
    bar.setAttribute("aria-label", parts.map(part => `${part.name} ${pointText(part.score)}`).join(" · "));
    for (const part of parts) {
      const segment = element("i");
      segment.dataset.dungeon = part.key;
      segment.style.flex = part.score;
      segment.style.background = color(part.key);
      segment.title = `${part.name} ${pointText(part.score)}`;
      bar.append(segment);
    }
    return bar;
  }

  function pointText(value) {
    return context.t("pointsUnit", { value: context.formatInteger(value) });
  }

  function playerName(player) {
    globalThis.NotMeterChapterNames?.prepare(player);
    return String(player.name || "").replace(/^\[TW\]\s*/i, "").trim();
  }

  function playerIdentity(player) {
    const name = playerName(player);
    const identity = element("span", "t10-identity");
    const privateNames = globalThis.NotMeterPrivateName;
    const isPrivate = privateNames.isPrivate(player, context.service === "Global");
    const title = element("b");
    if (isPrivate) title.append(privateNames.create(player, context.locale));
    else title.textContent = name;
    identity.append(title);
    const href = isPrivate ? "" : context.characterProfileHref(player);
    if (href) {
      const profileLabel = context.t("characterProfile");
      const profile = element("a", "t10-profile", profileLabel);
      profile.href = href;
      profile.setAttribute("aria-label", `${name} ${profileLabel}`);
      identity.append(profile);
    }
    return identity;
  }

  function playerMeta(player, tag = "span") {
    const server = context.serverName(player);
    const meta = element(tag, "", server);
    const cp = Math.max(0, ...(player.placements || []).map(p => Number(p.combatPower) || 0));
    if (cp > 0) {
      const badge = element("span", "t10-cp mono");
      const icon = element("img");
      icon.src = "./assets/combat-power.png";
      icon.alt = "CP";
      badge.title = context.t("classTop10ObservedCp", { value: context.formatInteger(cp) });
      badge.append(icon, context.formatCombatPower(cp));
      if (server) meta.append(" · ");
      meta.append(badge);
    }
    return meta;
  }

  function diamond(key) {
    const icon = element("i");
    icon.style.background = color(key);
    return icon;
  }

  function podium(player, parts) {
    const { rank, score } = player;
    const card = element("div", `pod pod-${rank}`);
    const value = element("span", "pod-score mono");
    const number = context.formatInteger(score);
    value.append(number, element("small", "", pointText(score).replace(number, "").trim()));
    card.append(rankBadge(rank), playerIdentity(player), playerMeta(player), value);
    const top = parts[0];
    if (top) {
      const best = element("span", "pod-best");
      best.append(diamond(top.key), element("span", "", `${label("best")} · ${top.name}`), element("b", "mono", pointText(top.score)));
      card.append(best, stack(parts, 100, true));
    }
    return card;
  }

  function detail(player, parts) {
    const { t, formatInteger } = context;
    const panel = element("div", "t10-detail");
    panel.id = `t10-detail-${player.rank}`;
    const grid = element("div", "td-grid");
    for (const part of parts) {
      const card = element("div", "td-dg");
      card.style.setProperty("--c", color(part.key));
      const head = element("div", "td-head");
      head.append(element("i"), element("b", "", part.name), element("span", "mono", pointText(part.score)));
      const bar = element("span", "td-bar");
      const fill = element("span");
      fill.style.width = `${100 * part.score / parts[0].score}%`;
      bar.append(fill);
      const list = element("ul");
      for (const placement of part.placements) {
        const li = element("li");
        const name = placement.bossKey || placement.bossName ? context.bossName(placement) : "";
        const link = element("button", "td-link");
        link.type = "button";
        const dps = `${formatInteger(placement.dps)} DPS`;
        function setBoss(title) {
          link.textContent = title;
          link.title = `${part.name} · ${title} · ${dps}`;
          link.setAttribute("aria-label", link.title);
        }
        setBoss(name || label("allBosses"));
        if (!name && period === "All" && context.resolveBossName) {
          void context.resolveBossName(placement, job, player).then(title => {
            if (title && link.isConnected) setBoss(title);
          }).catch(() => {});
        }
        link.onclick = () => context.openPlacement(placement, job, period);
        const rank = element("span", "td-rank mono", `#${placement.rank}`);
        rank.title = period === "Weekly" ? t("thisWeek") : t("classTop10PlacementRank");
        li.append(link, rank, element("b", "mono", `+${formatInteger(placement.score)}`), element("small", "td-dps mono", dps));
        list.append(li);
      }
      card.append(head, bar, list);
      grid.append(card);
    }
    panel.append(grid);
    return panel;
  }

  function resultsRow(player, parts, leadingScore) {
    const row = element("div", "tr t10-row");
    row.dataset.rank = player.rank;
    const toggle = element("button", "t10-toggle");
    toggle.type = "button";
    const privateNames = globalThis.NotMeterPrivateName;
    const name = privateNames.isPrivate(player, context.service === "Global") ? privateNames.label(context.locale) : playerName(player);
    toggle.setAttribute("aria-label", context.t("classTop10BreakdownAria", { name }));
    toggle.setAttribute("aria-controls", `t10-detail-${player.rank}`);
    toggle.setAttribute("aria-expanded", "false");
    toggle.append(element("span", "chev"));
    const who = element("span", "who");
    who.append(playerIdentity(player), playerMeta(player, "small"));
    const cell = element("span", "stackcell");
    cell.append(stack(parts, leadingScore ? 100 * player.score / leadingScore : 0));
    const best = element("span", "bestdg");
    const top = parts[0];
    if (top) {
      const info = element("span");
      info.append(element("b", "", top.name), element("small", "mono", `${pointText(top.score)} · ${Math.round(100 * top.score / player.score)}%`));
      best.title = top.name;
      best.append(diamond(top.key), info);
    }
    row.append(rankBadge(player.rank), who, cell, element("b", "r mono", context.formatInteger(player.score)), best, toggle);
    row.onclick = event => {
      if (event.target.closest(".t10-profile, .nmask")) return;
      openRank = openRank === player.rank ? 0 : player.rank;
      root.querySelector(".t10-row.open")?.classList.remove("open");
      root.querySelector('.t10-toggle[aria-expanded="true"]')?.setAttribute("aria-expanded", "false");
      root.querySelector(".t10-detail")?.remove();
      if (openRank) openRow(row, player, parts);
    };
    return row;
  }

  function openRow(row, player, parts) {
    row.classList.add("open");
    row.querySelector(".t10-toggle").setAttribute("aria-expanded", "true");
    row.after(detail(player, parts));
  }

  function distribution(byPlayer, snapshot) {
    const totals = new Map((snapshot.contents || []).map(content => [content.dungeonKey, {
      name: context.dungeonName(content.dungeonKey, content.displayName), score: 0,
    }]));
    for (const parts of byPlayer) for (const { key, name, score } of parts) {
      const previous = totals.get(key)?.score || 0;
      totals.set(key, { name, score: previous + score });
    }
    const rows = [...totals].sort(([, a], [, b]) => b.score - a.score);
    const total = rows.reduce((sum, [, row]) => sum + row.score, 0);
    const max = rows[0]?.[1].score || 1;
    const list = element("div", "dg-share");
    function highlight(key) {
      for (const segment of root.querySelectorAll(".t10-tbl .stack i")) {
        segment.classList.toggle("fade", Boolean(key && segment.dataset.dungeon !== key));
      }
    }
    for (const [key, { name, score }] of rows) {
      const item = element("div", "dgs");
      item.tabIndex = 0;
      item.title = name;
      item.style.setProperty("--c", color(key));
      const title = element("span", "dgs-name");
      title.append(element("i"), element("span", "", name));
      const bar = element("span", "dgs-bar");
      const fill = element("span");
      fill.style.width = `${100 * score / max}%`;
      bar.append(fill);
      item.append(title, bar, element("span", "dgs-v mono", `${total ? Math.round(100 * score / total) : 0}%`));
      item.onmouseenter = item.onfocus = () => highlight(key);
      item.onmouseleave = item.onblur = () => highlight(null);
      list.append(item);
    }
    return list;
  }

  function drawResults(snapshot) {
    const output = root.querySelector(".t10");
    output.replaceChildren();
    renderResultRows(output, snapshot);
    context.projectRankingProfileLinks(host, output);
  }

  function renderResultRows(output, snapshot) {
    output.style.setProperty("--tint", `oklch(0.74 0.12 ${jobTints.get(job) || 200})`);
    const { t } = context;
    if (context.paused) {
      const empty = element("div", "nm-card t10-empty", t("dungeonStatisticsPending"));
      empty.setAttribute("role", "status");
      output.append(empty);
      return;
    }
    const players = [...(snapshot?.jobs.find(item => item.jobName === job)?.players || [])].sort((a, b) => a.rank - b.rank).slice(0, 10);
    if (!players.length) {
      const message = snapshot === undefined ? t("classTop10Pending") : snapshot === null ? label("unavailable")
        : period === "Weekly" ? label("emptyWeek") : t("classTop10Empty");
      const empty = element("div", "nm-card t10-empty", message);
      empty.setAttribute("role", "status");
      output.append(empty);
      return;
    }
    const byPlayer = players.map(player => groupPlacements(player, snapshot));
    const podiums = element("div", "t10-podium");
    for (const index of [1, 0, 2]) if (players[index]) podiums.append(podium(players[index], byPlayer[index]));
    const main = element("div", "t10-main");
    const card = element("section", "nm-card");
    const header = element("div", "nm-card-head");
    header.append(element("h2", "", label("overall")), element("span", "sub", label("hint")));
    const table = element("div", "tbl t10-tbl");
    const columns = element("div", "tr th");
    columns.append(...["#", t("character"), label("distribution"), label("total"), label("bestDungeon"), ""]
      .map((title, i) => element("span", i === 3 ? "r" : "", title)));
    table.append(columns);
    players.forEach((player, i) => {
      const row = resultsRow(player, byPlayer[i], players[0].score);
      table.append(row);
      if (player.rank === openRank) openRow(row, player, byPlayer[i]);
    });
    card.append(header, table);
    const side = element("aside", "side-card t10-side");
    side.append(element("h4", "", label("share", { job: context.jobName(job) })), element("p", "tiny", label("shareHint")), distribution(byPlayer, snapshot));
    main.append(card, side);
    const foot = element("p", "foot-note", t("classTop10ScoreText"));
    const timestamp = context.service === "Global" ? Number(context.data.generatedAt) * 1000 : context.data.classOverallGeneratedAt || context.data.generatedAt;
    const date = new Date(timestamp);
    if (timestamp && Number.isFinite(date.getTime())) {
      const updated = element("time", "", t("classTop10Updated", { time: context.formatDateTime(date) }));
      updated.dateTime = date.toISOString();
      foot.append(" · ", updated);
    }
    output.append(podiums, main, foot);
  }

  function selectPeriod(value, reset = true) {
    period = value;
    if (reset) openRank = 0;
    for (const button of root.querySelectorAll("[data-period]")) {
      const active = button.dataset.period === period;
      button.classList.toggle("on", active);
      button.setAttribute("aria-pressed", String(active));
    }
    drawResults(period === "Weekly" ? weeklySnapshot() : context.snapshot);
  }

  function render(next) {
    const surface = document.getElementById("class-top10-surface");
    if (!surface || !stylesheet) return;
    if (!root) {
      host = element("div", "t10-host");
      root = host.attachShadow({ mode: "open" });
      const css = element("link");
      css.rel = "stylesheet";
      css.href = stylesheet;
      const page = element("div", "t10-page");
      page.innerHTML = `<section class="pg"><div class="pg-l"><div class="crumb"><span></span><i></i><b></b></div><h1></h1><p></p></div>
        <div class="pg-r"><div class="nm-seg" role="group"></div><notmeter-ranking-chapter hidden></notmeter-ranking-chapter></div></section>
        <nav class="cls-picker"></nav><div class="t10"></div>`;
      root.append(css, page);
      surface.append(host);
      surface.dataset.redesign = "";
    }
    const previous = context;
    context = next;
    if (next.chapter === "1-1" && globalThis.NotMeterDomesticChapterRelease) period = "All";
    if (previous?.chapter !== next.chapter || previous?.locale !== next.locale) {
      root.querySelector("notmeter-ranking-chapter").update?.(next.chapter, next.upcomingChapter, next.locale, next.availableChapters);
    }
    if (previous?.service !== next.service) openRank = 0;
    if (!next.jobs.includes(job)) job = next.jobs.includes("검성") ? "검성" : next.jobs[0];
    if (previous?.chapter === next.chapter && previous?.paused === next.paused && previous?.namesRevision === next.namesRevision && previous?.data === next.data && previous?.weeklyCurrent === next.weeklyCurrent &&
        Boolean(previous?.snapshot) === Boolean(next.snapshot) &&
        previous?.locale === next.locale && previous?.service === next.service) return;
    const { t } = next;
    root.querySelector(".crumb span").textContent = label("group");
    root.querySelector(".crumb b").textContent = label("title");
    root.querySelector("h1").textContent = label("title");
    root.querySelector(".pg p").textContent = label("description");
    const periods = root.querySelector(".pg-r .nm-seg");
    periods.setAttribute("aria-label", t("period"));
    const periodOptions = next.chapter === "1-1" && globalThis.NotMeterDomesticChapterRelease
      ? [["All", "allPeriod"]] : [["Weekly", "thisWeek"], ["All", "allPeriod"]];
    periods.replaceChildren(...periodOptions.map(([value, key]) => {
      const button = element("button", "", t(key));
      button.type = "button";
      button.dataset.period = value;
      button.onclick = () => { if (period !== value) selectPeriod(value); };
      return button;
    }));
    const classes = root.querySelector(".cls-picker");
    classes.setAttribute("aria-label", t("classTabsAria"));
    classes.replaceChildren(...next.jobs.map(name => {
      const button = element("button", name === job ? "cp-pill on" : "cp-pill");
      button.type = "button";
      button.dataset.job = name;
      button.style.setProperty("--tint", `oklch(0.74 0.12 ${jobTints.get(name)})`);
      button.setAttribute("aria-pressed", String(name === job));
      const icon = element("img");
      icon.src = `./assets/jobs/${encodeURIComponent(name)}.png`;
      icon.alt = "";
      button.append(icon, element("span", "", next.jobName(name)));
      button.onclick = () => {
        if (job === name) return;
        const active = classes.querySelector(".on");
        active?.classList.remove("on");
        active?.setAttribute("aria-pressed", "false");
        button.classList.add("on");
        button.setAttribute("aria-pressed", "true");
        job = name;
        selectPeriod(period);
      };
      return button;
    }));
    selectPeriod(period, false);
  }

  globalThis.NotMeterClassTop10Design = Object.freeze({
    render,
    text(key, locale) {
      const index = keys.indexOf(key);
      return index < 0 ? null : (copy[locale] || copy.en)[index];
    },
  });
})();
