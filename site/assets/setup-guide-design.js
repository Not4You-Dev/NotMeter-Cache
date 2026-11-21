(() => {
  "use strict";
  const keys = ["setupGuideChooseJob", "setupGuideExploreHint", "setupGuideUsageLabel", "setupGuideCharacterCount", "setupGuideTraitsToggle", "setupGuideChooseSlot", "setupGuideSkillJump", "setupGuideUsageHelp"];
  const copy = {
    ko: ["내 직업 선택", "직업을 고르고, 비교할 세팅을 선택하세요.", "사용률", "{count}/{total}명 사용", "특성별 선택률 보기", "장비 부위 선택", "스킬 유형", "사용률은 해당 직업 표본 중 선택한 캐릭터의 비율입니다. 여러 옵션을 함께 사용하므로 합계는 100%를 넘을 수 있습니다."],
    en: ["Choose your class", "Choose a class, then explore its setup.", "Usage", "{count}/{total} characters", "View specialization choices", "Choose an equipment slot", "Skill type", "Usage is the share of sampled characters in this class using an option. Characters can use several options, so percentages may add up to more than 100%."],
    "zh-TW": ["選擇你的職業", "先選擇職業，再查看想比較的配裝項目。", "使用率", "{count}/{total} 位使用", "查看各特化選擇比例", "選擇裝備部位", "技能類型", "使用率是該職業樣本中採用此選項的角色比例。同一角色可同時使用多個選項，因此加總可能超過 100%。"],
    "ja-JP": ["職業を選択", "職業を選んで、比較したい装備・スキルを確認しましょう。", "使用率", "{count}/{total}人が使用", "特化の選択率を見る", "装備部位を選択", "スキルの種類", "使用率は、この職業のサンプル内で各項目を使っているキャラクターの割合です。複数の項目を併用できるため、合計が100%を超えることがあります。"],
    "de-DE": ["Klasse wählen", "Wähle eine Klasse und vergleiche ihre Ausrüstung und Fertigkeiten.", "Nutzung", "{count}/{total} Charaktere", "Spezialisierungen ansehen", "Ausrüstungsplatz wählen", "Fertigkeitstyp", "Die Nutzung zeigt den Anteil der erfassten Charaktere dieser Klasse, die eine Option verwenden. Da mehrere Optionen gleichzeitig möglich sind, kann die Summe über 100 % liegen."],
    "fr-FR": ["Choisir votre classe", "Choisissez une classe, puis comparez son équipement et ses compétences.", "Utilisation", "{count}/{total} personnages", "Voir les choix de spécialisation", "Choisir un emplacement", "Type de compétence", "Le taux indique la part des personnages de cette classe qui utilisent une option dans l’échantillon. Plusieurs options peuvent être utilisées à la fois ; le total peut donc dépasser 100 %."],
    "es-ES": ["Elige tu clase", "Elige una clase y compara su equipo y sus habilidades.", "Uso", "{count}/{total} personajes", "Ver elecciones de especialización", "Elige una ranura de equipo", "Tipo de habilidad", "El uso indica la proporción de personajes de esta clase que utilizan una opción en la muestra. Como pueden usar varias opciones a la vez, la suma puede superar el 100 %."],
    "pt-BR": ["Escolha sua classe", "Escolha uma classe e compare seus equipamentos e habilidades.", "Uso", "{count}/{total} personagens", "Ver escolhas de especialização", "Escolha um espaço de equipamento", "Tipo de habilidade", "O uso indica a proporção de personagens desta classe que usam uma opção na amostra. Como várias opções podem ser usadas ao mesmo tempo, a soma pode ultrapassar 100%."],
    vi: ["Chọn lớp nhân vật", "Chọn lớp nhân vật, rồi xem cách trang bị và chọn kỹ năng.", "Tỷ lệ sử dụng", "{count}/{total} nhân vật", "Xem tỷ lệ chọn từng Specialization", "Chọn vị trí trang bị", "Loại kỹ năng", "Tỷ lệ sử dụng là tỷ lệ nhân vật trong mẫu của lớp này dùng một lựa chọn. Một nhân vật có thể dùng nhiều lựa chọn cùng lúc, nên tổng tỷ lệ có thể vượt quá 100%."],
    "ru-RU": ["Выберите класс", "Выберите класс, затем сравните экипировку и умения.", "Использование", "{count}/{total} персонажей", "Посмотреть выбор специализаций", "Выберите ячейку экипировки", "Тип умений", "Показатель отражает долю персонажей этого класса в выборке, использующих вариант. Персонаж может использовать несколько вариантов, поэтому сумма может превышать 100 %."],
  };
  const regionKeys = ["setupGuideDomestic", "setupGuideGlobal", "setupGuideRegionHint", "setupGuidePending"];
  const regionCopy = {
  "ko": [
    "한국·대만",
    "글로벌",
    "선택한 서비스의 랭커 세팅만 집계합니다.",
    "이 서비스의 세팅 자료를 준비 중입니다. 자료가 게시되면 다시 확인할 수 있습니다."
  ],
  "en": [
    "Korea · Taiwan",
    "Global",
    "Builds are sampled only from the selected service.",
    "Build data for this service is not available yet. Check again after the next publication."
  ],
  "zh-TW": [
    "韓國・台灣",
    "全球",
    "僅統計所選服務的排行榜角色配裝。",
    "此服務的配裝資料尚未就緒，請於資料發布後再查看。"
  ],
  "ja-JP": [
    "韓国・台湾",
    "グローバル",
    "選択したサービスのランカーの構成のみを集計します。",
    "このサービスの構成データは準備中です。公開後に再度ご確認ください。"
  ],
  "de-DE": [
    "Korea · Taiwan",
    "Global",
    "Nur Builds aus dem gewählten Dienst werden ausgewertet.",
    "Für diesen Dienst liegen noch keine Build-Daten vor. Bitte nach der nächsten Veröffentlichung erneut prüfen."
  ],
  "fr-FR": [
    "Corée · Taïwan",
    "Global",
    "Seuls les équipements du service sélectionné sont analysés.",
    "Les données de ce service ne sont pas encore disponibles. Réessayez après leur publication."
  ],
  "es-ES": [
    "Corea · Taiwán",
    "Global",
    "Solo se analizan configuraciones del servicio seleccionado.",
    "Los datos de este servicio aún no están disponibles. Vuelve a consultar tras su publicación."
  ],
  "pt-BR": [
    "Coreia · Taiwan",
    "Global",
    "Apenas configurações do serviço selecionado são analisadas.",
    "Os dados deste serviço ainda não estão disponíveis. Confira novamente após a publicação."
  ],
  "vi": [
    "Hàn Quốc · Đài Loan",
    "Toàn cầu",
    "Chỉ thống kê trang bị của người chơi trong dịch vụ đã chọn.",
    "Dữ liệu của dịch vụ này chưa sẵn sàng. Vui lòng kiểm tra lại sau khi dữ liệu được công bố."
  ],
  "ru-RU": [
    "Корея · Тайвань",
    "Глобальный",
    "Учитываются только сборки игроков выбранного сервиса.",
    "Данные этого сервиса ещё не опубликованы. Проверьте снова после публикации."
  ]
};
  keys.push(...regionKeys);
  for (const [locale, values] of Object.entries(copy)) values.push(...(regionCopy[locale] || regionCopy.en));
  const browserKeys = ["setupGuideSearchSkill", "setupGuideSkillResults", "setupGuideSkillNoMatches", "setupGuideSkillReset", "setupGuideSkillHint", "setupGuideTraitsHeading"];
  const browserCopy = {
    ko: ["스킬 이름 검색", "{count}개 스킬", "일치하는 스킬이 없습니다.", "검색 지우기", "스킬을 선택하면 레벨과 특성 효과·선택률을 확인할 수 있습니다. 선택률은 추천 조합이 아닌 실제 표본의 사용 현황입니다.", "특성 효과 · 선택률"],
    en: ["Search skill names", "{count} skills", "No matching skills.", "Clear search", "Select a skill to read its levels, specialization effects and usage. These are observed choices, not a recommended combination.", "Specialization effects · usage"],
    "zh-TW": ["搜尋技能名稱", "{count} 個技能", "沒有符合的技能。", "清除搜尋", "選擇技能以查看等級、特化效果與選擇比例。比例反映樣本的實際選擇，並非推薦組合。", "特化效果・選擇比例"],
    "ja-JP": ["スキル名を検索", "{count}個のスキル", "一致するスキルがありません。", "検索をクリア", "スキルを選ぶとレベル・特化効果・選択率を確認できます。選択率はサンプルの使用状況であり、おすすめの組み合わせではありません。", "特化効果・選択率"],
    "de-DE": ["Fertigkeiten suchen", "{count} Fertigkeiten", "Keine passenden Fertigkeiten.", "Suche löschen", "Wähle eine Fertigkeit, um Stufen, Spezialisierungen und Nutzung zu sehen. Die Anteile zeigen tatsächliche Entscheidungen, keine empfohlene Kombination.", "Spezialisierungen · Nutzung"],
    "fr-FR": ["Rechercher une compétence", "{count} compétences", "Aucune compétence correspondante.", "Effacer la recherche", "Sélectionnez une compétence pour voir ses niveaux, spécialisations et taux d’utilisation. Il s’agit de choix observés, pas d’une combinaison recommandée.", "Effets des spécialisations · utilisation"],
    "es-ES": ["Buscar habilidades", "{count} habilidades", "No hay habilidades coincidentes.", "Borrar búsqueda", "Selecciona una habilidad para ver niveles, efectos de especialización y uso. Los porcentajes muestran elecciones reales, no una combinación recomendada.", "Efectos de especialización · uso"],
    "pt-BR": ["Buscar habilidades", "{count} habilidades", "Nenhuma habilidade encontrada.", "Limpar busca", "Selecione uma habilidade para ver níveis, efeitos de especialização e uso. As porcentagens mostram escolhas reais, não uma combinação recomendada.", "Efeitos de especialização · uso"],
    vi: ["Tìm tên kỹ năng", "{count} kỹ năng", "Không có kỹ năng phù hợp.", "Xóa tìm kiếm", "Chọn kỹ năng để xem cấp độ, hiệu ứng Specialization và tỷ lệ sử dụng. Đây là lựa chọn thực tế trong mẫu, không phải tổ hợp đề xuất.", "Hiệu ứng Specialization · tỷ lệ sử dụng"],
    "ru-RU": ["Поиск умений", "Умений: {count}", "Подходящие умения не найдены.", "Очистить поиск", "Выберите умение, чтобы увидеть уровни, эффекты специализаций и частоту выбора. Это данные выборки, а не рекомендуемая комбинация.", "Эффекты специализаций · частота выбора"],
  };
  keys.push(...browserKeys);
  for (const [locale, values] of Object.entries(copy)) values.push(...(browserCopy[locale] || browserCopy.en));
  keys.push("contributionEmpty");
  const emptyCopy = {
    ko: "선택한 직업의 세팅 표본이 아직 없습니다. 다른 직업을 선택해 확인하세요.",
    en: "No build samples for this class yet. Select another class to explore its builds.",
    "zh-TW": "所選職業尚無配裝樣本，請選擇其他職業查看。",
    "ja-JP": "選択した職業のサンプルはまだありません。他の職業を選んでご確認ください。",
    "de-DE": "Für diese Klasse gibt es noch keine Build-Daten. Wähle eine andere Klasse.",
    "fr-FR": "Aucun échantillon pour cette classe pour le moment. Choisissez une autre classe.",
    "es-ES": "Esta clase aún no tiene muestras. Elige otra clase para ver sus configuraciones.",
    "pt-BR": "Ainda não há amostras desta classe. Escolha outra classe para ver suas configurações.",
    vi: "Chưa có mẫu trang bị cho lớp này. Hãy chọn lớp khác để xem.",
    "ru-RU": "Для этого класса пока нет данных о сборках. Выберите другой класс.",
  };
  for (const [locale, values] of Object.entries(copy)) values.push(emptyCopy[locale] || emptyCopy.en);
  const selections = new Map();
  function text(key, locale) {
    const index = keys.indexOf(key);
    return index < 0 ? null : (copy[locale] || copy.en)[index];
  }
  function skillBrowser(grid, locale, scope) {
    const node = (tag, className, value = "") => {
      const element = document.createElement(tag);
      element.className = className;
      element.textContent = value;
      return element;
    };
    const root = node("div", "setup-guide-skill-browser");
    const sidebar = node("div", "setup-guide-skill-sidebar");
    const search = node("input", "setup-guide-skill-search");
    search.type = "search";
    search.placeholder = text("setupGuideSearchSkill", locale);
    search.setAttribute("aria-label", search.placeholder);
    const count = node("span", "setup-guide-skill-results");
    count.setAttribute("role", "status");
    const list = node("div", "setup-guide-skill-list");
    const empty = node("div", "setup-guide-skill-empty");
    const reset = node("button", "setup-guide-skill-reset", text("setupGuideSkillReset", locale));
    reset.type = "button";
    empty.append(node("p", "", text("setupGuideSkillNoMatches", locale)), reset);
    const entries = [...grid.children].map(card => {
      const name = card.querySelector("div > strong")?.textContent || "";
      const button = node("button", "setup-guide-skill-choice");
      button.type = "button";
      button.setAttribute("aria-controls", card.id);
      const icon = card.querySelector(".setup-guide-card-icon");
      if (icon) button.append(icon.cloneNode(true));
      button.append(node("span", "setup-guide-skill-name", name));
      const usage = card.querySelector(".setup-guide-usage-value");
      if (usage) {
        const value = node("span", "setup-guide-skill-rate", usage.textContent);
        value.setAttribute("aria-label", usage.getAttribute("aria-label"));
        button.append(value);
      }
      const disclosure = card.querySelector("details");
      if (disclosure) {
        disclosure.open = true;
        disclosure.querySelector("summary").textContent = text("setupGuideTraitsHeading", locale);
      }
      const entry = { card, button, name, key: card.dataset.guideSkillKey };
      button.addEventListener("click", () => select(entry));
      list.append(button);
      return entry;
    });
    let selected = entries.find(entry => entry.key === selections.get(scope)) || entries[0];
    function select(entry) {
      selected = entry;
      if (entry) selections.set(scope, entry.key);
      for (const item of entries) {
        item.card.hidden = item !== entry;
        item.button.setAttribute("aria-pressed", String(item === entry));
      }
    }
    function filter() {
      const query = search.value.normalize("NFKC").toLocaleLowerCase(locale).trim();
      const matches = entries.filter(entry => entry.name.normalize("NFKC").toLocaleLowerCase(locale).includes(query));
      for (const entry of entries) entry.button.hidden = !matches.includes(entry);
      if (!matches.includes(selected)) select(matches[0]);
      empty.hidden = matches.length > 0;
      grid.hidden = matches.length === 0;
      count.textContent = text("setupGuideSkillResults", locale).replace("{count}", new Intl.NumberFormat(locale).format(matches.length));
    }
    search.addEventListener("input", filter);
    search.addEventListener("keydown", event => {
      if (event.key === "Escape") { search.value = ""; filter(); }
    });
    reset.addEventListener("click", () => { search.value = ""; filter(); search.focus(); });
    sidebar.append(search, count, list);
    root.append(sidebar, grid, empty);
    select(selected);
    filter();
    return root;
  }
  globalThis.NotMeterSetupGuideDesign = Object.freeze({
    text,
    skillBrowser,
  });
})();
