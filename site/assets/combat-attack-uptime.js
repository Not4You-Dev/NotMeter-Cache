(() => {
  "use strict";
  const labels = {"ko":["보스 공격 가동률","전체 전투 기준","확인된 무적 제외","공격","공백","무적","전체 보기","파티원 비교","직접 적중 후 3초간 공격으로 집계합니다. 공백을 선택하면 앞뒤 5초를 확대합니다.","이 기록에는 타격 시간 자료가 없습니다.","최장 공백"],"en":["Boss hit uptime","Full fight","Confirmed immunity excluded","Active","Gap","Immune","Full timeline","Party comparison","Each direct hit covers 3 seconds. Select a gap to zoom in with 5 seconds of context on each side.","Hit timing is unavailable for this record.","Longest gap"],"zh-TW":["首領攻擊覆蓋率","以整場戰鬥計算","已扣除確認的無敵時間","攻擊","空檔","無敵","完整時間軸","隊員比較","每次直接命中計入 3 秒。選取空檔可放大查看前後各 5 秒。","此紀錄沒有命中時間資料。","最長空檔"],"ja-JP":["ボス攻撃稼働率","戦闘全体が対象","確認済みの無敵時間を除外","攻撃","空白","無敵","全体表示","パーティ比較","直接命中から3秒を集計します。空白を選ぶと前後5秒を拡大します。","この記録には命中時刻がありません。","最長の空白"],"de-DE":["Angriffszeit am Boss","Gesamter Kampf","Bestätigte Immunität abgezogen","Aktiv","Pause","Immun","Gesamte Zeitachse","Gruppenvergleich","Jeder direkte Treffer zählt für 3 Sekunden. Eine Pause zeigt je 5 Sekunden davor und danach.","Für diesen Kampf fehlen Trefferzeiten.","Längste Pause"],"fr-FR":["Temps d’attaque du boss","Combat entier","Immunité confirmée déduite","Actif","Pause","Immunisé","Vue complète","Comparaison du groupe","Chaque coup direct couvre 3 s. Sélectionnez une pause pour voir les 5 s avant et après.","Les horaires des coups sont indisponibles.","Pause la plus longue"],"es-ES":["Tiempo de ataque al jefe","Combate completo","Sin inmunidad confirmada en el cómputo","Activo","Pausa","Inmune","Ver todo","Comparar grupo","Cada impacto directo cuenta 3 s. Selecciona una pausa para ver los 5 s anteriores y posteriores.","Este registro no incluye los tiempos de impacto.","Pausa más larga"],"pt-BR":["Tempo de ataque ao chefe","Combate inteiro","Imunidade confirmada descontada","Ativo","Pausa","Imune","Ver tudo","Comparar grupo","Cada acerto direto conta por 3 s. Selecione uma pausa para ver os 5 s antes e depois.","Este registro não contém os horários dos acertos.","Maior pausa"],"ru-RU":["Время атак по боссу","Весь бой","Без подтверждённой неуязвимости","Атака","Пауза","Неуязвимость","Весь бой","Сравнение группы","Прямое попадание засчитывает 3 с. Выберите паузу, чтобы увидеть по 5 с до и после неё.","В записи нет времени попаданий.","Самая долгая пауза"],"th-TH":["เวลาที่โจมตีบอส","ตลอดการต่อสู้","หักช่วงอมตะที่ยืนยันแล้ว","โจมตี","ช่วงว่าง","อมตะ","ดูทั้งหมด","เปรียบเทียบสมาชิก","นับ 3 วินาทีต่อการโจมตีโดยตรง เลือกช่วงว่างเพื่อดูเวลา 5 วินาทีก่อนและหลัง","ไม่มีข้อมูลเวลาที่โจมตีโดนในบันทึกนี้","ช่วงว่างนานที่สุด"],"vi-VN":["Thời gian đánh trúng boss","Toàn bộ trận","Đã trừ thời gian miễn nhiễm được xác nhận","Tấn công","Khoảng trống","Miễn nhiễm","Xem toàn bộ","So sánh tổ đội","Mỗi đòn trúng trực tiếp được tính 3 giây. Chọn khoảng trống để xem 5 giây trước và sau.","Bản ghi này không có thời điểm đánh trúng.","Khoảng trống dài nhất"]};
  function model(data, seconds) {
    if (!data || !Number.isFinite(seconds) || seconds <= 0 || !Number.isInteger(data.durationMs) ||
        data.durationMs <= 0 || data.durationMs > 86400000 || Math.abs(seconds * 1000 - data.durationMs) > 1.01) return null;
    const occupied = [];
    for (const [key, kind] of [["active", 0], ["immune", 2]]) {
      const list = data[key];
      if (!Array.isArray(list) || list.length % 2 || list.length > 65536) return null;
      let end = -1;
      for (let i = 0; i < list.length; i += 2) {
        const a = list[i], b = list[i + 1];
        if (!Number.isInteger(a) || !Number.isInteger(b) || a <= end || b <= a || b > data.durationMs) return null;
        occupied.push({ a, b, kind }); end = b;
      }
    }
    const spans = [];
    let end = 0, active = 0, immune = 0;
    for (const s of occupied.sort((x, y) => x.a - y.a)) {
      if (s.a < end) return null;
      if (s.a > end) spans.push({ a: end, b: s.a, kind: 1 });
      spans.push(s); end = s.b;
      if (s.kind === 0) active += s.b - s.a;
      else immune += s.b - s.a;
    }
    if (end < data.durationMs) spans.push({ a: end, b: data.durationMs, kind: 1 });
    return { spans, active, immune, duration: data.durationMs, available: data.durationMs - immune };
  }
  function node(tag, text, cls) {
    const el = document.createElement(tag);
    if (text != null) el.textContent = text;
    if (cls) el.className = cls;
    return el;
  }
  function clock(ms) {
    return Math.floor(ms / 60000) + ":" + String(Math.floor(ms / 1000) % 60).padStart(2, "0") + "." + Math.floor(ms / 100) % 10;
  }
  function track(data, t, from, to, select) {
    const el = node("div", null, "attack-uptime-track");
    // A single painted track keeps long fights and large parties cheap. Buttons below provide keyboard access.
    const stops = [], colors = ["#5bd2bb", "#ab7954", "#596576"];
    for (const s of data.spans) {
      const a = Math.max(from, s.a), b = Math.min(to, s.b);
      if (a >= b) continue;
      stops.push(colors[s.kind] + " " + (100 * (a-from)/(to-from)) + "% " + (100*(b-from)/(to-from)) + "%");
    }
    el.style.background = stops.length === 1 ? stops[0].split(" ")[0] : "linear-gradient(to right," + stops.join(",") + ")";
    if (select) {
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", t[8]);
      el.onclick = e => {
        const bounds = el.getBoundingClientRect();
        const at = from + (e.clientX - bounds.left) / bounds.width * (to - from);
        const s = data.spans.find(s => s.kind === 1 && at >= s.a && at < s.b);
        if (s) select(s);
      };
    }
    return el;
  }
  let previousRecord, previousActor, focus = null, expanded = false;
  function sync({record, detail, locale, unavailable, identity, selectPlayer, durationSeconds}) {
    const host = document.getElementById("detail-attack-uptime");
    if (!host) return;
    const t = labels[locale] || labels[Object.keys(labels).find(k => k.split("-")[0] === String(locale).split("-")[0])] || labels.en;
    const sameRecord = record === previousRecord;
    if (!sameRecord || detail?.actorId !== previousActor) focus = null;
    if (!sameRecord) expanded = false;
    previousRecord = record; previousActor = detail?.actorId;
    host.hidden = unavailable;
    if (unavailable) { host.replaceChildren(); return; }

    let toggle = host.querySelector(".attack-uptime-toggle");
    let panel = host.querySelector(".attack-uptime-content");
    if (!toggle) {
      toggle = node("button", null, "attack-uptime-toggle");
      toggle.type = "button";
      panel = node("div", null, "attack-uptime-content");
      panel.id = "detail-attack-uptime-content";
      toggle.setAttribute("aria-controls", panel.id);
      host.replaceChildren(toggle, panel);
    }
    toggle.setAttribute("aria-label", t[0]);
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.replaceChildren(node("strong", t[0]));
      panel.hidden = !open;
      panel.replaceChildren();
      if (open) renderTimeline(panel, toggle, t, {record, detail, locale, identity, selectPlayer, durationSeconds});
    }
    toggle.onclick = () => setOpen(toggle.getAttribute("aria-expanded") !== "true");
    setOpen(sameRecord && toggle.getAttribute("aria-expanded") === "true");
  }
  function renderTimeline(host, head, t, {record, detail, locale, identity, selectPlayer, durationSeconds}) {
    const data = model(detail?.attackUptime, durationSeconds);
    host.title = data ? t[8] : "";
    if (!data) { host.append(node("small", t[9])); return; }
    const pct = d => d.available ? (d.active / d.available).toLocaleString(locale, {style:"percent",maximumFractionDigits:1}) : "—";
    head.append(node("strong", pct(data), "attack-uptime-percent"));
    host.append(node("small", t[data.immune ? 2 : 1] + "  ·  " + data.active/1000 + " / " + data.available/1000 + " s"));
    const legend = node("div",null,"attack-uptime-legend");
    for (const k of (data.immune ? [0,1,2] : [0,1])) legend.append(node("span",t[3+k],"kind-"+k));
    host.append(legend);
    const body = node("div", null, "attack-uptime-timeline"); host.append(body);
    const gaps = data.spans.filter(s => s.kind === 1);
    const longest = gaps.reduce((p, g) => !p || g.b - g.a > p.b - p.a ? g : p, null);
    function draw(gap, keyboard = false) {
      focus = gap; body.replaceChildren();
      const start = gap ? Math.max(0, gap.a - 5000) : 0, end = gap ? Math.min(data.duration, gap.b + 5000) : data.duration;
      const bar = track(data,t,start,end,g => draw(g)); body.append(bar);
      bar.onkeydown = e => {
        if (e.key === "Escape") { e.preventDefault(); draw(null,true); return; }
        if (!["ArrowLeft","ArrowRight","Enter"," "].includes(e.key) || !gaps.length) return;
        e.preventDefault(); const i = gaps.findIndex(s => s.a === gap?.a);
        draw(gaps[e.key === "ArrowLeft" ? (i <= 0 ? gaps.length-1 : i-1) : (i+1)%gaps.length],true);
      };
      const details = node("div",null,"attack-uptime-axis");
      details.append(node("span",clock(start)), node("span", gap ? t[4]+"  "+clock(gap.a)+" – "+clock(gap.b)+"  ·  "+(gap.b-gap.a)/1000+" s" : t[4]+" "+(data.available-data.active)/1000+" s"+(data.immune ? " · "+t[5]+" "+data.immune/1000+" s" : "")), node("span",clock(end)));
      body.append(details);
      if (gap) {
        const picker = node("select");
        picker.setAttribute("aria-label", t[4]);
        for (const g of gaps) {
          const option = node("option", clock(g.a)+" – "+clock(g.b));
          option.value = String(g.a); option.selected = g.a === gap.a; picker.append(option);
        }
        picker.onchange = () => { draw(gaps[picker.selectedIndex]); body.querySelector("select")?.focus(); };
        body.append(picker);
        const reset=node("button",t[6]); reset.type="button"; reset.onclick=()=>draw(null,true); body.append(reset);
      }
      if (!gap && longest) {
        const jump = node("button",t[10]+"  "+(longest.b-longest.a)/1000+" s");
        jump.type = "button"; jump.onclick = () => draw(longest,true); body.append(jump);
      }
      if (keyboard) bar.focus();
    }
    draw(focus && gaps.find(s => s.a === focus.a));
    if (record.players?.length > 1) {
      const party = node("details");
      party.open = expanded; party.ontoggle = () => { if (party.isConnected) expanded = party.open; };
      party.append(node("summary",t[7]));
      for (const p of record.players) {
        const row = node("button",null,"attack-uptime-party"); row.type="button";
        row.setAttribute("aria-pressed",String(p.actorId === detail.actorId));
        row.onclick=e=>{ if(!e.target.closest(".nmask")) selectPlayer(p.actorId); };
        const name = node("span"); identity(name,p); row.append(name);
        const other = model(p.attackUptime, durationSeconds);
        row.append(other ? track(other,t,0,other.duration) : node("span"), node("strong",other ? pct(other) : "—"));
        party.append(row);
      }
      host.append(party);
    }
  }
  globalThis.NotMeterAttackUptime = { model, sync };
})();
