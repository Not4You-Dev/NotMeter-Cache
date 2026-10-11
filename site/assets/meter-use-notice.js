(() => {
  "use strict";
  const title = document.getElementById("meter-use-notice-title");
  const message = document.getElementById("meter-use-notice-message");
  if (!title || !message) return;
  const copy = {
    ko: ["딜미터기 이용 시 주의사항", "DPS가 낮다는 이유로 파티원을 비난하거나 추방하면 운영정책에 따라 아이온2 게임 계정이 제재될 수 있습니다."],
    en: ["Important: Use DPS meters responsibly", "Insulting or kicking party members because of low DPS may result in sanctions against your AION 2 game account under the game’s rules."],
    "zh-TW": ["傷害統計工具使用注意事項", "若因 DPS 較低而指責或踢除隊友，您的 AION 2 遊戲帳號可能依營運規範受到處分。"],
    "ja-JP": ["DPSメーター利用時の注意事項", "DPSが低いことを理由にパーティーメンバーを非難したり追放したりすると、運営規約に基づきAION 2のゲームアカウントが処分の対象となる場合があります。"],
    "de-DE": ["Wichtig: DPS-Meter verantwortungsvoll nutzen", "Wenn du Gruppenmitglieder wegen niedriger DPS beleidigst oder aus der Gruppe wirfst, können gemäß den Spielregeln Sanktionen gegen dein AION 2-Spielkonto verhängt werden."],
    "fr-FR": ["Important : utilisez les compteurs de DPS de manière responsable", "Insulter ou exclure des membres du groupe en raison de leur faible DPS peut entraîner des sanctions contre votre compte de jeu AION 2, conformément aux règles du jeu."],
    "es-ES": ["Importante: usa los medidores de DPS con responsabilidad", "Insultar o expulsar a miembros del grupo por tener un DPS bajo puede dar lugar a sanciones contra tu cuenta de juego de AION 2, conforme a las normas del juego."],
    "pt-BR": ["Importante: use medidores de DPS com responsabilidade", "Insultar ou expulsar membros do grupo por terem DPS baixo pode resultar em punições à sua conta de jogo do AION 2, conforme as regras do jogo."],
    "ru-RU": ["Важно: используйте DPS-метр ответственно", "Оскорбления участников группы или исключение их из группы из-за низкого DPS могут повлечь санкции в отношении вашей игровой учётной записи AION 2 в соответствии с правилами игры."],
  };
  function render() {
    const locale = globalThis.NotMeterI18n?.normalize(document.documentElement.lang) || "en";
    const words = copy[locale] || copy.en;
    title.textContent = words[0];
    message.textContent = words[1];
  }
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  render();
})();
