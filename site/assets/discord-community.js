(() => {
  "use strict";
  const button = document.getElementById("notmeter-discord");
  if (!button) return;
  const count = button.querySelector("[data-discord-count]");
  const label = button.querySelector("[data-discord-label]");
  const stats = button.querySelector("[data-discord-stats]");
  const online = button.querySelector("[data-discord-online]");
  const intro = button.querySelector("[data-discord-intro]");
  const join = button.querySelector("[data-discord-join]");
  const guildId = "1514906026581692516";
  const cacheKey = "notmeter-discord-community-v1";
  const refreshMs = 10 * 60 * 1000;
  const maxAgeMs = 24 * 60 * 60 * 1000;
  const copy = {
    ko: ["멤버", "참여하기", "약 {members}명 · 온라인 약 {online}명", "Discord 제공 인원수 · {time} 확인", "NotMeter Discord 참여"],
    en: ["members", "Join us", "About {members} members · About {online} online", "Counts from Discord · Checked {time}", "Join NotMeter on Discord"],
    "zh-TW": ["位成員", "加入", "約 {members} 位成員 · 約 {online} 位在線", "Discord 提供的人數 · {time} 更新", "加入 NotMeter Discord"],
    "ja-JP": ["人", "参加する", "メンバー約 {members} 人 · オンライン約 {online} 人", "Discord 提供の人数 · {time} 確認", "NotMeter Discord に参加"],
    "de-DE": ["Mitglieder", "Beitreten", "Etwa {members} Mitglieder · Etwa {online} online", "Zahlen von Discord · Geprüft: {time}", "NotMeter auf Discord beitreten"],
    "fr-FR": ["membres", "Rejoindre", "Environ {members} membres · Environ {online} en ligne", "Chiffres de Discord · Vérifiés à {time}", "Rejoindre NotMeter sur Discord"],
    "es-ES": ["miembros", "Unirse", "Unos {members} miembros · Unos {online} en línea", "Cifras de Discord · Consultadas: {time}", "Unirse a NotMeter en Discord"],
    "pt-BR": ["membros", "Participar", "Cerca de {members} membros · Cerca de {online} online", "Números do Discord · Consultados: {time}", "Entrar no Discord do NotMeter"],
    "ru-RU": ["участников", "Вступить", "Около {members} участников · Около {online} в сети", "Данные Discord · Проверено: {time}", "Присоединиться к NotMeter в Discord"],
  };
  const communityCopy = {
    ko: ["업데이트 소식과 이용 팁을 함께 나눠보세요.", "커뮤니티 참여", "{online}명 온라인"],
    en: ["Share updates and tips with the community.", "Join the community", "{online} online"],
    "zh-TW": ["一起交流更新消息與使用技巧。", "加入社群", "{online} 人在線"],
    "ja-JP": ["アップデート情報や使い方のヒントを共有しましょう。", "コミュニティに参加", "{online} 人がオンライン"],
    "de-DE": ["Tauscht Neuigkeiten und Tipps in der Community aus.", "Community beitreten", "{online} online"],
    "fr-FR": ["Partagez les nouveautés et vos astuces avec la communauté.", "Rejoindre la communauté", "{online} en ligne"],
    "es-ES": ["Comparte novedades y consejos con la comunidad.", "Unirse a la comunidad", "{online} en línea"],
    "pt-BR": ["Compartilhe novidades e dicas com a comunidade.", "Entrar na comunidade", "{online} online"],
    "ru-RU": ["Обсуждайте новости и делитесь советами с сообществом.", "Присоединиться", "{online} в сети"],
  };
  let snapshot = null;
  let pending = false;
  let nextAttempt = 0;
  const valid = value => value?.guildId === guildId &&
    Number.isSafeInteger(value.members) && value.members > 0 &&
    Number.isSafeInteger(value.online) && value.online >= 0 && value.online <= value.members &&
    Number.isFinite(value.checkedAt) && value.checkedAt <= Date.now() && Date.now() - value.checkedAt < maxAgeMs;
  try {
    const saved = JSON.parse(localStorage.getItem(cacheKey));
    if (valid(saved)) snapshot = saved;
  } catch { /* Counts also work without browser storage. */ }

  function render() {
    const locale = globalThis.NotMeterI18n?.normalize(document.documentElement.lang) || "en";
    const words = copy[locale] || copy.en;
    const community = communityCopy[locale] || communityCopy.en;
    const tag = globalThis.NotMeterI18n?.tag(locale) || "en-US";
    if (snapshot && !valid(snapshot)) snapshot = null;
    count.hidden = !snapshot;
    stats.hidden = !snapshot;
    intro.textContent = community[0];
    join.textContent = community[1];
    label.textContent = snapshot ? words[0] : words[1];
    if (!snapshot) {
      count.textContent = "";
      online.textContent = "";
      button.title = words[4];
      button.setAttribute("aria-label", words[4]);
      return;
    }
    const format = new Intl.NumberFormat(tag);
    count.textContent = format.format(snapshot.members);
    online.textContent = community[2].replace("{online}", format.format(snapshot.online));
    const summary = words[2].replace("{members}", count.textContent).replace("{online}", format.format(snapshot.online));
    const time = new Intl.DateTimeFormat(tag, { dateStyle: "short", timeStyle: "short" }).format(snapshot.checkedAt);
    button.title = `${summary}\n${words[3].replace("{time}", time)}`;
    button.setAttribute("aria-label", `${words[4]}. ${summary}`);
  }

  async function refresh() {
    render();
    if (document.hidden || pending || Date.now() < nextAttempt ||
        (snapshot && Date.now() - snapshot.checkedAt < refreshMs)) return;
    pending = true;
    nextAttempt = Date.now() + refreshMs;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch("https://discord.com/api/v10/invites/DuAuuhdrwy?with_counts=true", {
        signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer",
      });
      if (!response.ok) {
        if (response.status === 429) {
          const delay = Number(response.headers.get("Retry-After"));
          if (Number.isFinite(delay) && delay > 0) nextAttempt = Date.now() + Math.max(refreshMs, delay * 1000);
        }
        return;
      }
      const data = await response.json();
      const value = { guildId: data.guild?.id, members: data.approximate_member_count,
        online: data.approximate_presence_count, checkedAt: Date.now() };
      if (!valid(value)) return;
      snapshot = value;
      try { localStorage.setItem(cacheKey, JSON.stringify(value)); } catch { /* Optional cache. */ }
      render();
    } catch { /* Keep the invite usable when Discord is unavailable. */ }
    finally { clearTimeout(timeout); pending = false; }
  }

  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) void refresh(); });
  setInterval(() => { void refresh(); }, refreshMs);
  void refresh();
})();
