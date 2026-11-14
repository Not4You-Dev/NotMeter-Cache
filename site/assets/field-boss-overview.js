(() => {
  "use strict";
  const hour = 3600000;
  const copy = {
    ko: ["가장 가까운 출현", "다음 출현 · 서버", "내 시간", "고정 일정", "출현 타임라인", "임박 구간은 1시간 눈금, 이후 구간은 12시간 눈금", "마커를 누르면 알림이 켜집니다", "임박", "이후", "지금", "2시간 이내", "그 이후", "고정 일정은 게임 클라이언트 기준이며, 점검·실시간 변경으로 달라질 수 있습니다.", "일", "시간", "분", "초"],
    en: ["Next to spawn", "Next spawn · Server", "Your time", "Fixed schedule", "Spawn timeline", "Hourly ticks for upcoming spawns, then 12-hour ticks", "Select a marker to add alerts", "Upcoming", "Later", "Now", "Within 2 hours", "After that", "Fixed schedules may change with maintenance or live updates.", "Days", "Hours", "Min", "Sec"],
    "zh-TW": ["最近的出現", "下次出現 · 伺服器", "我的時間", "固定時程", "出現時間軸", "近期每小時一格，之後每 12 小時一格", "點選標記即可新增通知", "近期", "之後", "現在", "2 小時內", "2 小時後", "固定時程可能因維護或即時調整而變更。", "天", "時", "分", "秒"],
    "ja-JP": ["次の出現", "次の出現 · サーバー", "現地時刻", "固定スケジュール", "出現タイムライン", "直近は1時間刻み、その後は12時間刻み", "マーカーを押すと通知を追加できます", "直近", "以降", "現在", "2時間以内", "それ以降", "固定スケジュールはメンテナンスなどで変更される場合があります。", "日", "時間", "分", "秒"],
    "de-DE": ["Nächster Spawn", "Nächster Spawn · Server", "Ortszeit", "Fester Zeitplan", "Spawn-Zeitachse", "Zunächst stündlich, danach alle 12 Stunden", "Marker auswählen, um Alarme hinzuzufügen", "Demnächst", "Später", "Jetzt", "Innerhalb von 2 Stunden", "Danach", "Feste Zeiten können sich durch Wartung oder Updates ändern.", "Tage", "Std.", "Min.", "Sek."],
    "fr-FR": ["Prochaine apparition", "Prochaine apparition · Serveur", "Heure locale", "Horaire fixe", "Chronologie des apparitions", "Graduations horaires, puis toutes les 12 heures", "Sélectionnez un repère pour ajouter des alertes", "Bientôt", "Plus tard", "Maintenant", "Dans les 2 heures", "Au-delà", "Les horaires fixes peuvent changer avec la maintenance ou les mises à jour.", "Jours", "Heures", "Min", "Sec"],
    "es-ES": ["Próxima aparición", "Próxima aparición · Servidor", "Hora local", "Horario fijo", "Cronología de apariciones", "Marcas de una hora y luego de 12 horas", "Selecciona un marcador para añadir alertas", "Pronto", "Más tarde", "Ahora", "En 2 horas o menos", "Después", "Los horarios fijos pueden cambiar por mantenimiento o actualizaciones.", "Días", "Horas", "Min", "Seg"],
    "pt-BR": ["Próxima aparição", "Próxima aparição · Servidor", "Hora local", "Horário fixo", "Linha do tempo", "Marcas de uma hora e depois de 12 horas", "Selecione um marcador para adicionar alertas", "Em breve", "Mais tarde", "Agora", "Em até 2 horas", "Depois", "Os horários fixos podem mudar com manutenções ou atualizações.", "Dias", "Horas", "Min", "Seg"],
    "ru-RU": ["Ближайшее появление", "Следующее появление · Сервер", "Местное время", "Фиксированное расписание", "График появлений", "Сначала шаг в час, затем в 12 часов", "Нажмите на метку, чтобы добавить уведомления", "Скоро", "Позже", "Сейчас", "В течение 2 часов", "Позже", "Фиксированное расписание может меняться при обслуживании или обновлениях.", "Дни", "Часы", "Мин", "Сек"],
    vi: ["Sắp xuất hiện nhất", "Lần tới · Máy chủ", "Giờ địa phương", "Lịch cố định", "Dòng thời gian xuất hiện", "Mốc mỗi giờ, sau đó mỗi 12 giờ", "Chọn mốc để thêm thông báo", "Sắp tới", "Sau đó", "Bây giờ", "Trong 2 giờ", "Sau đó", "Lịch cố định có thể thay đổi do bảo trì hoặc cập nhật.", "Ngày", "Giờ", "Phút", "Giây"],
    th: ["การเกิดครั้งถัดไป", "เกิดครั้งถัดไป · เซิร์ฟเวอร์", "เวลาท้องถิ่น", "กำหนดการคงที่", "ไทม์ไลน์การเกิด", "แบ่งทุกชั่วโมง จากนั้นแบ่งทุก 12 ชั่วโมง", "เลือกจุดเพื่อเพิ่มการแจ้งเตือน", "เร็ว ๆ นี้", "ภายหลัง", "ตอนนี้", "ภายใน 2 ชั่วโมง", "หลังจากนั้น", "กำหนดการอาจเปลี่ยนได้จากการปิดปรับปรุงหรืออัปเดต", "วัน", "ชม.", "นาที", "วินาที"],
  };
  const node = (tag, cls, text) => {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const bossIcon = () => {
    const icon = node("img", "fbx-ic");
    icon.src = "./assets/boss-icon.png";
    icon.alt = "";
    return icon;
  };
  const pad = value => String(value).padStart(2, "0");
  const groupCopy = {
    ko: ["곧 출현", "오늘 안", "그 이후", "남음", "주기 대기", "3시간 주기 중 {pct}% 경과", "서버", "표시할 출현 예정 정보가 없습니다.", "알림 켜짐", "{n}개", "출현 알림 받기"],
    en: ["Spawning soon", "Within a day", "Later", "Remaining", "Waiting for cycle", "{pct}% of the 3-hour window", "Server", "No upcoming spawn information.", "Alert on", "{n}", "Get spawn alert"],
    "zh-TW": ["即將出現", "一天內", "之後", "剩餘", "等待週期", "3 小時週期已過 {pct}%", "伺服器", "沒有即將出現的資訊。", "通知已開啟", "{n} 個", "接收出現通知"],
    "ja-JP": ["まもなく出現", "24時間以内", "それ以降", "残り", "周期待ち", "3時間周期の {pct}% 経過", "サーバー", "次の出現情報はありません。", "通知オン", "{n}件", "出現通知を受け取る"],
    "de-DE": ["Erscheint bald", "Innerhalb eines Tages", "Später", "Verbleibend", "Wartezeit", "{pct}% des 3-Stunden-Fensters", "Server", "Keine bevorstehenden Spawn-Daten.", "Alarm an", "{n}", "Spawn-Alarm erhalten"],
    "fr-FR": ["Apparition imminente", "Dans la journée", "Plus tard", "Restant", "Cycle en attente", "{pct}% de la fenêtre de 3 heures", "Serveur", "Aucune apparition à venir.", "Alerte active", "{n}", "Recevoir une alerte"],
    "es-ES": ["Aparece pronto", "En un día", "Más tarde", "Restante", "En espera", "{pct}% de la ventana de 3 horas", "Servidor", "No hay próximas apariciones.", "Alerta activa", "{n}", "Recibir alerta"],
    "pt-BR": ["Aparece em breve", "Em um dia", "Mais tarde", "Restante", "Aguardando ciclo", "{pct}% da janela de 3 horas", "Servidor", "Sem próximas aparições.", "Alerta ativo", "{n}", "Receber alerta"],
    "ru-RU": ["Скоро появится", "В течение суток", "Позже", "Осталось", "Ожидание цикла", "{pct}% трёхчасового окна", "Сервер", "Нет данных о ближайших появлениях.", "Уведомление включено", "{n}", "Получать уведомления"],
    vi: ["Sắp xuất hiện", "Trong ngày", "Sau đó", "Còn lại", "Chờ chu kỳ", "Đã qua {pct}% cửa sổ 3 giờ", "Máy chủ", "Chưa có lịch xuất hiện sắp tới.", "Đã bật thông báo", "{n}", "Nhận thông báo"],
    th: ["ใกล้จะเกิด", "ภายในหนึ่งวัน", "ภายหลัง", "เหลือ", "รอรอบ", "ผ่านไป {pct}% ของช่วง 3 ชั่วโมง", "เซิร์ฟเวอร์", "ไม่มีข้อมูลการเกิดที่กำลังจะมาถึง", "เปิดแจ้งเตือน", "{n}", "รับการแจ้งเตือน"],
  };
  const areaCopy = { ko: "전체 지역", en: "All areas", "zh-TW": "所有區域", "ja-JP": "全エリア", "de-DE": "Alle Gebiete",
    "fr-FR": "Toutes les zones", "es-ES": "Todas las zonas", "pt-BR": "Todas as áreas", "ru-RU": "Все зоны",
    vi: "Tất cả khu vực", th: "ทุกพื้นที่" };
  const parts = ms => {
    const sec = Math.max(0, Math.floor(ms / 1000));
    return [Math.floor(sec / 86400), Math.floor(sec / 3600) % 24, Math.floor(sec / 60) % 60, sec % 60];
  };
  function short(ms) {
    const [d, h, m] = parts(ms);
    return d ? d + "d " + h + "h" : h ? h + "h " + pad(m) + "m" : m + "m";
  }

  function fitMarkerLabels(track, markers, inset) {
    const { left, width } = track.getBoundingClientRect();
    const labels = markers.map(marker => {
      const label = marker.querySelector("em");
      const rect = label.getBoundingClientRect();
      return { label, width: rect.width, start: rect.left - left };
    });
    const gap = 4;
    const crowded = labels.reduce((total, label) => total + label.width + gap, -gap) > width - inset;
    const lines = crowded ? [labels.filter((_, i) => i % 2 === 0), labels.filter((_, i) => i % 2 === 1)] : [labels];
    for (const [lineIndex, line] of lines.entries()) {
      let end = inset;
      for (const label of line) {
        label.x = Math.max(end, label.start);
        end = label.x + label.width + gap;
      }
      end = width;
      for (let i = line.length - 1; i >= 0; i--) {
        const label = line[i];
        label.x = Math.min(label.x, end - label.width);
        end = label.x - gap;
      }
      for (const label of line) {
        const x = Math.max(inset, label.x);
        if (Math.abs(x - label.start) > 0.5) label.label.style.setProperty("--fbx-label-shift", (x - label.start) + "px");
        if (lineIndex) label.label.style.setProperty("--fbx-label-rise", "14px");
      }
    }
  }

  function mount(host, panel) {
    const hero = node("section", "fbx-hero"), timeline = node("section", "fbx-tl");
    const areaNav = node("nav", "fbx-area-nav");
    const groups = node("div", "fbx-groups");
    host.replaceChildren(hero, timeline, areaNav, groups);
    hero.hidden = timeline.hidden = areaNav.hidden = groups.hidden = true;
    let context, activeHero, heroKey, lanes, unitValues, dates;
    let previousTitle, groupViews, groupEmpty, dateFormatter, areaScope, area = "";
    const rows = new Map();
    let timelineKey = "";
    const watch = () => globalThis.NotMeterBossAlerts;
    const entry = item => ({ ...item.alert, targetAt: item.time });
    const watching = item => Boolean(item.alert && watch()?.isWatching?.(item.alert));
    const visible = item => !panel.classList.contains("fbx-mine") || watching(item);
    function timeFormat(zone) {
      return new Intl.DateTimeFormat(context.locale, {
        month: "numeric", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: zone,
      });
    }

    function buildHero(item, words) {
      const badge = node("span", "fbx-hero-k");
      badge.append(node("i"), document.createTextNode(words[0] + " · " + context.server));
      const title = node("h2", "fbx-next-title", item.name);
      if (item.name !== previousTitle) title.classList.add("fbx-title-enter");
      previousTitle = item.name;
      const titleLine = node("div", "fbx-hero-name");
      titleLine.append(bossIcon(), title);
      const meta = [item.fixed && words[3], item.schedule || item.location].filter(Boolean).join(" · ");
      const clock = node("div", "fbx-clock");
      clock.setAttribute("aria-hidden", "true");
      unitValues = [0, 1, 2, 3].map(index => {
        const unit = node("span", "fbx-unit"), number = node("b");
        const colon = index < 3 ? node("span", "fbx-colon", ":") : null;
        unit.append(number, node("span", "", words[13 + index])); clock.append(unit);
        if (colon) clock.append(colon);
        return { unit, number, colon };
      });
      const main = node("div");
      main.append(badge, titleLine);
      if (meta) main.append(node("span", "fbx-hero-meta", meta));
      main.append(clock);
      const side = node("div", "fbx-hero-side"), detail = node("dl");
      dates = [1, 2].map(index => {
        const pair = node("div"), date = node("dd", "mono");
        pair.append(node("dt", "", words[index]), date); detail.append(pair); return date;
      });
      side.append(detail);
      const alert = item.alert && watch()?.createButton(entry(item));
      if (alert) {
        const labels = groupCopy[context.locale] || groupCopy.en;
        alert.classList.add("fbx-alert");
        alert.dataset.bossWatchAddLabel = labels[10];
        if (alert.getAttribute("aria-pressed") !== "true") alert.querySelector("span").textContent = labels[10];
        side.append(alert);
      }
      hero.replaceChildren(main, side);
    }

    function buildTimeline(words) {
      const head = node("div", "fbx-tl-head");
      const hint = node("span", "", words[6]);
      hint.className = "fbx-tl-hint";
      head.append(node("b", "", words[4]), node("small", "", words[5]), hint);
      const legend = node("div", "fbx-tl-legend");
      [words[10], words[11], (groupCopy[context.locale] || groupCopy.en)[8]].forEach((text, i) => {
        const item = node("span");
        item.append(node("i", ["soon", "today", "on"][i]), document.createTextNode(text)); legend.append(item);
      });
      legend.append(node("span", "fbx-tl-note", words[12]));
      lanes = [[0, 6, 1], [6, 60, 12]].map(([from, to, step], index) => {
        const lane = node("div", "fbx-lane " + (index ? "far" : "near"));
        const label = node("span", "fbx-lane-l"), track = node("div", "fbx-lane-track");
        label.append(node("b", "", words[7 + index]), node("small", "", from + "–" + to + (context.locale === "ko" ? "시간" : "h")));
        track.append(node("div", "fbx-tl-rule"));
        const tickValues = [];
        for (let tick = from; tick <= to; tick += step) tickValues.push(tick);
        for (const tick of tickValues) {
          const mark = node("div", "fbx-tl-tick");
          mark.classList.toggle("first", tick === from);
          mark.classList.toggle("last", tick === to);
          mark.classList.toggle("now-t", !index && tick === 1);
          mark.style.left = (tick - from) / (to - from) * 100 + "%";
          mark.append(node("span", "", tick ? "+" + tick + "h" : words[9])); track.append(mark);
        }
        if (!index) track.append(node("div", "fbx-tl-now"));
        const markers = node("div", "fbx-tl-markers");
        track.append(markers); lane.append(label, track);
        return { lane, markers, from, to };
      });
      timeline.replaceChildren(head, ...lanes.map(lane => lane.lane), legend);
    }

    function buildGroups(labels, words) {
      const hourCount = new Intl.NumberFormat(context.locale, { style: "unit", unit: "hour" });
      const limits = [words[10], context.locale === "ko" ? "24시간 이내" : "≤ " + hourCount.format(24),
        context.locale === "ko" ? "24시간 초과" : "> " + hourCount.format(24)];
      groupViews = [0, 1, 2].map(index => {
        const section = node("section", "fbx-group"), head = node("div", "fbx-group-h");
        const count = node("small"), list = node("div", "fbx-group-rows");
        head.append(node("b", "", labels[index]), count, node("span", "", limits[index]));
        section.append(head, list);
        return { section, count, list, ids: "" };
      });
      groupEmpty = node("p", "fbx-empty", labels[7]);
      groups.replaceChildren(...groupViews.map(group => group.section), groupEmpty);
      dateFormatter = timeFormat(context.zone);
    }
    function buildRow(item, labels, words) {
      const row = node("div", "fbx-row");
      const who = node("span", "fbx-who");
      const schedule = [item.schedule || (item.fixed ? words[3] : ""), item.location].filter(Boolean).join(" · ");
      who.append(node("b", "", item.name));
      if (schedule) who.append(node("small", "", schedule));
      who.title = [item.name, schedule].filter(Boolean).join(" · ");
      const left = node("span", "fbx-left"), remaining = node("b");
      left.append(remaining, node("small", "", labels[3]));
      const progress = node("span", "fbx-prog"), track = node("span", "fbx-prog-track");
      const fill = node("i"), progressText = node("small");
      track.append(fill); progress.append(track, progressText);
      const when = node("span", "fbx-when"), date = node("b");
      when.append(date, node("span", "", labels[6]));
      const action = node("span", "fbx-act");
      const alert = item.alert && watch()?.createButton(entry(item));
      if (alert) { alert.classList.add("fbx-alert", "sm"); action.append(alert); }
      row.append(bossIcon(), who, left, progress, when, action);
      return { row, remaining, fill, progressText, date, time: item.time };
    }
    function updateGroups(items, now, words) {
      const labels = groupCopy[context.locale] || groupCopy.en;
      if (!groupViews) buildGroups(labels, words);
      const shown = items.filter(visible);
      const liveIds = new Set(items.map(item => item.id));
      for (const id of rows.keys()) if (!liveIds.has(id)) rows.delete(id);
      const buckets = [[], [], []];
      for (const item of shown) {
        const delta = item.time - now;
        const bucket = delta <= 2 * hour ? 0 : delta <= 24 * hour ? 1 : 2;
        let refs = rows.get(item.id);
        if (!refs || refs.time !== item.time) {
          refs = buildRow(item, labels, words); rows.set(item.id, refs);
          refs.date.textContent = dateFormatter.format(item.time);
        }
        const units = parts(delta);
        const leading = units.findIndex(value => value !== 0);
        const start = leading < 0 ? 3 : Math.min(leading, 2);
        refs.remaining.textContent = units.slice(start, Math.min(start + 2, 4))
          .map((value, index) => (index ? pad(value) : value) + (context.locale === "ko" ? "" : " ") + words[13 + start + index]).join(" ");
        const ratio = Math.max(0, 1 - delta / (3 * hour));
        refs.fill.style.width = (ratio * 100) + "%";
        refs.progressText.textContent = ratio ? labels[5].replace("{pct}", Math.round(ratio * 100)) : labels[4];
        refs.row.classList.toggle("soon", bucket === 0);
        buckets[bucket].push({ item, row: refs.row });
      }
      for (const [index, group] of groupViews.entries()) {
        const items = buckets[index];
        const key = items.map(({ item }) => item.id + ":" + item.time).join("|");
        if (key !== group.ids) {
          const focused = group.list.contains(document.activeElement) ? document.activeElement : null;
          group.ids = key;
          group.list.replaceChildren(...items.map(item => item.row));
          if (focused && group.list.contains(focused)) focused.focus({ preventScroll: true });
        }
        group.section.hidden = !items.length;
        group.count.textContent = items.length;
      }
      groups.hidden = false;
      groupEmpty.hidden = shown.length > 0;
    }
    function buildAreas() {
      const all = areaCopy[context.locale] || areaCopy.en;
      areaNav.setAttribute("aria-label", all);
      const choices = [{ id: "", name: all }, ...context.areas];
      areaNav.replaceChildren(...choices.map(({ id, name }) => {
        const button = node("button", "fbx-area", name);
        button.type = "button";
        button.dataset.area = id;
        button.setAttribute("aria-pressed", String(area === id));
        button.addEventListener("click", () => {
          area = id;
          try { localStorage.setItem("nm-fbx-area:" + areaScope, area); } catch {}
          for (const option of areaNav.children) option.setAttribute("aria-pressed", String(option.dataset.area === area));
          update();
        });
        return button;
      }));
      areaNav.hidden = false;
    }

    function update(now = Date.now()) {
      if (!context || host.closest("[hidden]")) return;
      const words = copy[context.locale] || copy.en;
      for (const item of context.items) {
        if (item.renew && item.time <= now) item.time = item.renew(now);
      }
      const upcoming = context.items.filter(item => item.time > now && (!area || item.area === area)).sort((a, b) => a.time - b.time);
      updateGroups(upcoming, now, words);
      const next = upcoming[0];
      hero.hidden = !next;
      const nextKey = next && [context.key, context.locale, next.id, next.name, next.fixed, next.schedule, next.time].join("|");
      if (next && (heroKey !== nextKey || !unitValues)) {
        heroKey = nextKey;
        buildHero(next, words);
      }
      if (next) {
        const remaining = parts(next.time - now);
        unitValues.forEach(({ unit, number, colon }, index) => {
          if (index === 0) unit.hidden = colon.hidden = remaining[0] === 0;
          const value = pad(remaining[index]);
          if (number.textContent !== value) number.textContent = value;
        });
        if (activeHero !== next.time) {
          activeHero = next.time;
          dates[0].textContent = timeFormat(context.zone).format(next.time);
          dates[1].textContent = timeFormat(undefined).format(next.time);
        }
      }
      if (!lanes) buildTimeline(words);
      timeline.hidden = false;
      timeline.classList.toggle("fbx-alerts-disabled", !watch()?.canWatch?.());
      const key = upcoming.map(item => item.id + ":" + item.time + ":" + watching(item)).join("|");
      const frame = [key, Math.floor(now / 60000), Math.round(host.clientWidth), watch()?.canWatch?.()].join("|");
      if (frame === timelineKey) return;
      timelineKey = frame;
      const date = timeFormat(context.zone);
      for (const { markers, from, to } of lanes) {
        const focused = markers.contains(document.activeElement) ? document.activeElement.dataset.marker : "";
        const gap = from ? 4.5 : 9;
        const clusters = [];
        for (const item of upcoming) {
          const left = item.time - now;
          if (left < from * hour || left > to * hour || (!from && left === to * hour)) continue;
          const position = ((left / hour - from) / (to - from)) * 100;
          const last = clusters.at(-1);
          if (last && position - last.position < gap) last.items.push(item);
          else clusters.push({ position, items: [item] });
        }
        const controls = clusters.map(cluster => {
          const first = cluster.items[0], left = first.time - now, many = cluster.items.length > 1;
          const button = node("button", "fbx-tl-hit");
          button.type = "button";
          button.disabled = !watch()?.canWatch?.();
          button.dataset.marker = first.id;
          button.style.left = cluster.position + "%";
          button.classList.toggle("r", cluster.position > 92);
          button.classList.toggle("fbx-tl-edge-start", cluster.position < 4);
          button.classList.toggle("fbx-tl-edge-end", cluster.position > 96);
          const list = cluster.items.map(item => item.name + " · " + date.format(item.time)).join("\n");
          button.title = list;
          button.setAttribute("aria-label", list);
          const on = cluster.items.every(watching);
          const marker = node("span", "fbx-tl-m " + (left <= 2 * hour ? "soon" : "today") + (many ? " many" : "") + (on ? " on" : ""));
          button.setAttribute("aria-pressed", String(on));
          if (many) marker.append(node("b", "", String(cluster.items.length)));
          const count = (groupCopy[context.locale] || groupCopy.en)[9].replace("{n}", cluster.items.length);
          const label = node("em", "", short(left) + (many ? " · " + count : ""));
          button.append(marker, label);
          button.addEventListener("click", () => { watch()?.enableEntries?.(cluster.items.filter(item => item.alert).map(entry)); update(); });
          return button;
        });
        markers.replaceChildren(...controls);
        fitMarkerLabels(markers, controls, from ? 0 : 7);
        if (focused) controls.find(button => button.dataset.marker === focused)?.focus({ preventScroll: true });
      }
    }
    function set(next) {
      const differentView = !context || context.key !== next.key || context.locale !== next.locale || context.zone !== next.zone;
      context = next;
      if (differentView) {
        const scope = context.key.split(":")[0];
        if (scope !== areaScope) {
          areaScope = scope;
          try { area = localStorage.getItem("nm-fbx-area:" + areaScope) || ""; } catch { area = ""; }
        }
        if (!context.areas.some(item => item.id === area)) area = "";
        buildAreas();
        lanes = null; heroKey = null; groupViews = null; rows.clear();
      }
      else {
        rows.clear();
        if (groupViews) for (const group of groupViews) group.ids = "reset";
      }
      activeHero = null;
      timelineKey = "";
    }
    return { set, update };
  }
  const headingCopy = {
    ko: ["실시간", "서버별 출현 시간·남은 시간과 내 알림", "지역", "한국", "대만", "글로벌"],
    en: ["Live", "Server spawn schedules, countdowns, and your alerts", "Region", "Korea", "Taiwan", "Global"],
    "zh-TW": ["即時", "各伺服器的出現時間、倒數與我的通知", "地區", "韓國", "台灣", "全球"],
    "ja-JP": ["リアルタイム", "サーバー別の出現時刻・残り時間とマイ通知", "地域", "韓国", "台湾", "グローバル"],
    "de-DE": ["Live", "Spawn-Zeiten, Countdown und eigene Alarme pro Server", "Region", "Korea", "Taiwan", "Global"],
    "fr-FR": ["En direct", "Horaires, comptes à rebours et alertes par serveur", "Région", "Corée", "Taïwan", "Global"],
    "es-ES": ["En directo", "Horarios, cuenta atrás y alertas por servidor", "Región", "Corea", "Taiwán", "Global"],
    "pt-BR": ["Ao vivo", "Horários, contagem regressiva e alertas por servidor", "Região", "Coreia", "Taiwan", "Global"],
    "ru-RU": ["В реальном времени", "Время появления, отсчёт и уведомления по серверам", "Регион", "Корея", "Тайвань", "Глобальный"],
    vi: ["Trực tiếp", "Lịch xuất hiện, đếm ngược và thông báo theo máy chủ", "Khu vực", "Hàn Quốc", "Đài Loan", "Toàn cầu"],
    th: ["สด", "เวลาเกิด เวลาที่เหลือ และการแจ้งเตือนของแต่ละเซิร์ฟเวอร์", "ภูมิภาค", "เกาหลี", "ไต้หวัน", "ทั่วโลก"],
  };
  const service = document.getElementById("field-boss-service-field");
  const heading = document.querySelector(".fbx-page-heading");
  if (service && heading) {
    const renderHeading = () => {
      const locale = globalThis.NotMeterI18n?.normalize(document.documentElement.lang);
      const [live, intro, region, ...names] = headingCopy[locale] || headingCopy.en;
      heading.querySelector(".fbx-crumb span").textContent = live;
      heading.querySelector(".fbx-intro").textContent = intro;
      service.querySelector(".fbx-service-label").textContent = region;
      const tabs = service.querySelector(".fbx-service-tabs");
      tabs.setAttribute("aria-label", region);
      tabs.querySelectorAll("button").forEach((button, index) => { button.textContent = names[index]; });
    };
    renderHeading();
    new MutationObserver(renderHeading).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  globalThis.NotMeterFieldBossOverview = { mount };
})();
