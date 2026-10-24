globalThis.NotMeterApplyCurrentGuide = (copy, update) => {
  if (copy.guideVersion === update.version) return;
  if (update.version !== '1.0.297' || !update.articles || !update.locale) throw new Error('guide-version');
  const related = {
    Pvp: ['pvpHistory','dailyPoints','Hotkeys'],
    pvpHistory: ['Pvp','Backup','Hotkeys'],
    privacyChoices: ['CombatRecords','Backup','rankings'],
    menuVisibility: ['General','combatVisibility','Render','obs'],
    healing: ['Display','details','Backup'],
    dailyPoints: ['Pvp','resources','Display'],
    Render: ['Rtss','Design','Optimization','troubleshooting'],
    Backup: ['Presets','CloudSettings','privacyChoices','Storage'],
    assistBars: ['assistCompact','assistVoice','assistSkills','BuffUi'],
    assistCompact: ['assistBars','assistVoice','BuffUi'],
    assistVoice: ['assistSkills','assistBars','BuffUi'],
    assistSkills: ['assistVoice','assistBars','BuffUi'],
    releaseNotes: ['start','Language','General']
  };
  for (const [id, article] of Object.entries(update.articles)) {
    if (!Array.isArray(article) || article.length !== 5 || !article[2].length) throw new Error('guide-article');
    copy.articles[id] = {
      title: article[0], intro: article[1], steps: article[2], notes: article[3], check: article[4],
      related: related[id], screens: (update.screens?.[id] || []).map(shot => shot[0])
    };
  }
  copy.ui.edition = update.edition;
  copy.ui.sourceNote = update.sourceNote;
  copy.ui.languageNote = update.languageNote;
  copy.ui.latest = update.latest;
  copy.ui.galleryHelp = update.galleryHelp;
  copy.currentArticles = ['assistBars','assistCompact','assistVoice','assistSkills','releaseNotes',...Object.keys(update.articles).filter(id => !id.startsWith('assist') && id !== 'releaseNotes')];
  copy.currentScreens = Object.fromEntries(Object.values(update.screens || {}).flat());
  for (const [id, steps] of Object.entries(update.articleAppends || {})) copy.articles[id].steps.push(...steps);
  for (const [id, intro] of Object.entries(update.articleIntros || {})) copy.articles[id].intro = intro;
  copy.articles.start.steps.splice(2, 0, update.startStep);
  copy.articles.Language.steps.push(update.languageStep);
  copy.articles.IdlePhoto.notes[1] = update.photoNote;
  copy.articles.IdlePhoto.related = [...new Set(['Backup', ...copy.articles.IdlePhoto.related])];
  copy.articles.webBossAlerts.steps.push(update.bossAlertStep);
  copy.articles.character.notes.push(update.characterRankingNote);
  for (const [id, links] of Object.entries({
    start: ['privacyChoices','releaseNotes'], reading: ['Pvp','healing'], Display: ['healing','Pvp'],
    General: ['privacyChoices','menuVisibility'], Design: ['Render'],
    CombatRecords: ['privacyChoices','pvpHistory'], combatVisibility: ['menuVisibility'],
    BuffUi: ['assistBars','assistCompact','assistVoice','assistSkills'], Language: ['releaseNotes']
  })) copy.articles[id].related = [...new Set([...links, ...copy.articles[id].related])];
  copy.guideVersion = update.version;
};
