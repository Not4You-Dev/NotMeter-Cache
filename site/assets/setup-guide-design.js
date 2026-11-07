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
  globalThis.NotMeterSetupGuideDesign = Object.freeze({
    text(key, locale) {
      const index = keys.indexOf(key);
      return index < 0 ? null : (copy[locale] || copy.en)[index];
    },
  });
})();
