(() => {
  "use strict";
  const base = "https://not4you-dev.github.io/NotMeter-Settings-Cache/";
  const schema = "notmeter-settings-cache-v1";
  const repairBase = new URL("./assets/settings-preview-repairs/", document.baseURI);
  let repairIndex;
  const labels = ["title", "loading", "empty", "error", "retry", "updated", "idle", "combat", "assist", "copy", "copied", "copyError", "note", "hidden", "import", "manual"];
  const words = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["NotMeter 설정", "공유 설정을 불러오는 중…", "아직 공개된 NotMeter 설정이 없습니다.", "공유 설정을 불러오지 못했습니다.", "다시 시도", "갱신", "대기", "전투", "전투 보조 UI", "설정 코드 복사", "복사 완료", "복사하지 못했습니다. 아래 코드를 직접 복사해 주세요.", "업로드한 설정으로 만든 실제 미터기 미리보기입니다. 본인 닉네임·직업은 공유한 캐릭터 기준이며, 다른 파티원과 수치는 예시입니다. 개인 사진은 포함하지 않습니다. 애니메이션은 정지 화면으로 표시합니다.", "이 미리보기에서 표시할 항목이 없습니다.", "NotMeter → 환경설정 → 백업·복원에서 코드를 붙여 넣고 적용할 항목을 선택하세요.", "45레벨 이상 캐릭터가 직접 공유한 설정입니다. 자동 동기화되지 않으며, 갱신 내용은 약 5~10분 후 표시됩니다."],
    en: ["NotMeter settings", "Loading shared settings…", "No public NotMeter settings yet.", "Could not load shared settings.", "Try again", "Updated", "Idle", "Combat", "Combat Assist", "Copy settings code", "Copied", "Could not copy. Please copy the code below manually.", "Rendered by NotMeter using the uploaded settings. Your character’s name and class are shown; other party members and values are examples. Personal photos are excluded. Animations appear as still images.", "There is nothing to display in this preview.", "In NotMeter, open Settings → Backup & Restore, paste the code and choose which settings to apply.", "Manually shared by a level 45+ character. Settings do not sync automatically. Updates appear in about 5–10 minutes."],
    "zh-TW": ["NotMeter 設定", "正在載入分享設定…", "尚無公開的 NotMeter 設定。", "無法載入分享設定。", "重試", "更新", "待機", "戰鬥", "戰鬥輔助 UI", "複製設定代碼", "已複製", "無法複製，請手動複製下方代碼。", "由 NotMeter 依上傳設定產生的實際預覽。本人名稱與職業依分享角色顯示，其他隊員與數值僅為範例。不包含個人照片。動畫以靜態畫面顯示。", "此預覽沒有可顯示的項目。", "在 NotMeter 開啟設定 → 備份與還原，貼上代碼並選擇要套用的設定。", "由 45 級以上角色手動分享，不會自動同步。更新約需 5～10 分鐘顯示。"],
    "ja-JP": ["NotMeter 設定", "共有設定を読み込み中…", "公開された NotMeter 設定はありません。", "共有設定を読み込めませんでした。", "再試行", "更新", "待機", "戦闘", "戦闘補助 UI", "設定コードをコピー", "コピーしました", "コピーできませんでした。下のコードを手動でコピーしてください。", "アップロードした設定を使い、NotMeter で描画したプレビューです。本人の名前とクラスは共有したキャラクターに合わせて表示し、ほかのパーティーメンバーと数値はサンプルです。個人の写真は含まれず、アニメーションは静止画で表示します。", "このプレビューに表示する項目はありません。", "NotMeter の設定 → バックアップと復元でコードを貼り付け、適用する項目を選択してください。", "レベル45以上のキャラクターが手動で共有した設定です。自動同期はされません。更新の反映には約5～10分かかります。"],
    "de-DE": ["NotMeter-Einstellungen", "Geteilte Einstellungen werden geladen…", "Noch keine öffentlichen NotMeter-Einstellungen.", "Geteilte Einstellungen konnten nicht geladen werden.", "Erneut versuchen", "Aktualisiert", "Außerhalb des Kampfes", "Kampf", "Kampfhilfe", "Einstellungscode kopieren", "Kopiert", "Kopieren fehlgeschlagen. Bitte den Code unten manuell kopieren.", "Von NotMeter mit den hochgeladenen Einstellungen gerendert. Name und Klasse stammen vom teilenden Charakter; andere Gruppenmitglieder und Werte sind Beispiele. Persönliche Fotos sind ausgeschlossen. Animationen werden als Standbilder gezeigt.", "In dieser Vorschau gibt es nichts anzuzeigen.", "In NotMeter: Einstellungen → Sichern und Wiederherstellen öffnen, den Code einfügen und die gewünschten Einstellungen auswählen.", "Manuell von einem Charakter ab Stufe 45 geteilt. Keine automatische Synchronisierung. Änderungen erscheinen nach etwa 5–10 Minuten."],
    "fr-FR": ["Paramètres NotMeter", "Chargement des paramètres partagés…", "Aucun paramètre NotMeter public pour le moment.", "Impossible de charger les paramètres partagés.", "Réessayer", "Mise à jour", "Hors combat", "Combat", "Aide au combat", "Copier le code", "Copié", "Échec de la copie. Copiez manuellement le code ci-dessous.", "Aperçu rendu par NotMeter avec les paramètres envoyés. Le nom et la classe correspondent au personnage qui partage ses paramètres ; les autres membres du groupe et les valeurs sont des exemples. Les photos personnelles sont exclues. Les animations sont affichées sous forme d’images fixes.", "Aucun élément à afficher dans cet aperçu.", "Dans NotMeter, ouvrez Paramètres → Sauvegarde et restauration, collez le code et choisissez les paramètres à appliquer.", "Partagé manuellement par un personnage de niveau 45 ou plus. Aucune synchronisation automatique. Les modifications apparaissent sous environ 5 à 10 minutes."],
    "es-ES": ["Ajustes de NotMeter", "Cargando ajustes compartidos…", "Aún no hay ajustes públicos de NotMeter.", "No se pudieron cargar los ajustes compartidos.", "Reintentar", "Actualizado", "Fuera de combate", "Combate", "Asistencia de combate", "Copiar código", "Copiado", "No se pudo copiar. Copia manualmente el código de abajo.", "Vista generada por NotMeter con los ajustes subidos. El nombre y la clase corresponden al personaje que comparte los ajustes; los demás miembros del grupo y los valores son ejemplos. No se incluyen fotos personales. Las animaciones se muestran como imágenes estáticas.", "No hay elementos que mostrar en esta vista.", "En NotMeter, abre Ajustes → Copia de seguridad y restauración, pega el código y elige los ajustes que quieras aplicar.", "Compartido manualmente por un personaje de nivel 45 o superior. No se sincroniza automáticamente. Los cambios aparecen en unos 5–10 minutos."],
    "pt-BR": ["Configurações do NotMeter", "Carregando configurações compartilhadas…", "Ainda não há configurações públicas do NotMeter.", "Não foi possível carregar as configurações compartilhadas.", "Tentar novamente", "Atualizado", "Fora de combate", "Combate", "Assistência de combate", "Copiar código", "Copiado", "Não foi possível copiar. Copie o código abaixo manualmente.", "Prévia renderizada pelo NotMeter com as configurações enviadas. O nome e a classe são do personagem que compartilhou as configurações; os demais membros do grupo e os valores são exemplos. Fotos pessoais não são incluídas. Animações aparecem como imagens estáticas.", "Não há itens para exibir nesta prévia.", "No NotMeter, abra Configurações → Backup e restauração, cole o código e escolha quais configurações aplicar.", "Compartilhado manualmente por um personagem de nível 45 ou superior. Não há sincronização automática. As alterações aparecem em cerca de 5–10 minutos."],
    "ru-RU": ["Настройки NotMeter", "Загрузка общих настроек…", "Публичных настроек NotMeter пока нет.", "Не удалось загрузить общие настройки.", "Повторить", "Обновлено", "Вне боя", "Бой", "Помощник в бою", "Скопировать код", "Скопировано", "Не удалось скопировать. Скопируйте код ниже вручную.", "Предпросмотр создан NotMeter по загруженным настройкам. Имя и класс соответствуют персонажу, опубликовавшему настройки; остальные участники группы и значения приведены для примера. Личные фотографии не включены. Анимации показаны как неподвижные изображения.", "В этом предпросмотре нет элементов для отображения.", "В NotMeter откройте Настройки → Резервное копирование и восстановление, вставьте код и выберите настройки для применения.", "Настройки вручную опубликованы персонажем уровня 45 или выше. Автоматической синхронизации нет. Изменения появляются примерно через 5–10 минут."],
  });
  const panelLabels = ["subtitle", "refresh", "refreshing", "preview", "apply", "code", "emptyHint", "errorHint", "checked", "retained"];
  const panelWords = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["공유한 화면을 살펴보고 내 미터기에도 적용해 보세요.", "새로고침", "확인 중…", "화면 미리보기", "내 미터기에 적용", "설정 코드 보기", "캐릭터가 설정을 공개하면 대기·전투·전투 보조 화면을 여기에서 확인할 수 있습니다.", "잠시 후 새로고침을 눌러 다시 확인해 주세요. 자동으로 재조회하지 않습니다.", "마지막 확인", "갱신하지 못해 이전에 불러온 설정을 표시합니다."],
    en: ["Preview this character’s setup and apply it to your own meter.", "Refresh", "Checking…", "Display preview", "Use this setup", "View settings code", "Once this character shares a setup, you can preview the idle, combat and Combat Assist displays here.", "Select Refresh to check again in a moment. This page does not retry automatically.", "Last checked", "Refresh failed. Showing the previously loaded settings."],
    "zh-TW": ["預覽此角色分享的畫面，並套用至自己的傷害計量器。", "重新整理", "確認中…", "畫面預覽", "套用至我的計量器", "查看設定代碼", "此角色公開設定後，即可在此預覽待機、戰鬥及戰鬥輔助畫面。", "請稍後按重新整理再確認。本頁不會自動重試。", "上次確認", "更新失敗，目前顯示先前載入的設定。"],
    "ja-JP": ["このキャラクターの表示設定を確認し、自分のメーターに適用できます。", "再読み込み", "確認中…", "表示プレビュー", "自分のメーターに適用", "設定コードを表示", "このキャラクターが設定を公開すると、待機・戦闘・戦闘補助の表示をここで確認できます。", "しばらくしてから再読み込みを押してください。自動で再試行はしません。", "最終確認", "更新できなかったため、前回読み込んだ設定を表示しています。"],
    "de-DE": ["Sieh dir das Layout dieses Charakters an und übernimm es für dein eigenes Meter.", "Aktualisieren", "Wird geprüft…", "Anzeigevorschau", "Layout übernehmen", "Einstellungscode anzeigen", "Sobald dieser Charakter Einstellungen teilt, siehst du hier die Anzeigen außerhalb des Kampfes, im Kampf und für die Kampfhilfe.", "Klicke später auf Aktualisieren. Die Seite versucht es nicht automatisch erneut.", "Zuletzt geprüft", "Aktualisierung fehlgeschlagen. Die zuvor geladenen Einstellungen werden angezeigt."],
    "fr-FR": ["Découvrez l’affichage de ce personnage et appliquez-le à votre propre compteur.", "Actualiser", "Vérification…", "Aperçu de l’affichage", "Utiliser ces paramètres", "Afficher le code", "Une fois les paramètres partagés, vous pourrez voir ici les affichages hors combat, en combat et de l’aide au combat.", "Cliquez sur Actualiser dans un instant. La page ne réessaie pas automatiquement.", "Dernière vérification", "Échec de l’actualisation. Les paramètres précédemment chargés sont affichés."],
    "es-ES": ["Previsualiza la configuración de este personaje y aplícala a tu medidor.", "Actualizar", "Comprobando…", "Vista previa", "Usar esta configuración", "Ver código de ajustes", "Cuando este personaje comparta sus ajustes, podrás ver aquí las pantallas de fuera de combate, combate y asistencia de combate.", "Pulsa Actualizar dentro de un momento. La página no reintenta la carga automáticamente.", "Última comprobación", "No se pudo actualizar. Se muestran los ajustes cargados anteriormente."],
    "pt-BR": ["Veja a configuração deste personagem e aplique-a ao seu medidor.", "Atualizar", "Verificando…", "Prévia da interface", "Usar esta configuração", "Ver código de configuração", "Quando este personagem compartilhar suas configurações, você poderá ver aqui as telas fora de combate, em combate e de assistência de combate.", "Clique em Atualizar em alguns instantes. A página não tenta novamente automaticamente.", "Última verificação", "Falha ao atualizar. Exibindo as configurações carregadas anteriormente."],
    "ru-RU": ["Посмотрите оформление этого персонажа и примените его к своему счётчику.", "Обновить", "Проверка…", "Предпросмотр интерфейса", "Применить настройки", "Показать код настроек", "Когда персонаж опубликует настройки, здесь появится предпросмотр интерфейса вне боя, в бою и помощника в бою.", "Нажмите «Обновить» немного позже. Автоматических повторных запросов не будет.", "Последняя проверка", "Не удалось обновить. Показаны ранее загруженные настройки."],
  });
  const viewerLabels = ["zoomIn", "zoomOut", "fit", "actualSize", "expand", "collapse", "gesture", "selectionNote"];
  const viewerWords = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["확대", "축소", "화면에 맞추기", "원본 크기", "크게 보기", "닫기", "휠로 확대·축소 · 드래그로 이동 · 터치로 벌려서 확대", "전투 보조 UI는 업로드 당시 켜 둔 스킬을 기준으로 표시합니다. 남은 시간은 예시입니다."],
    en: ["Zoom in", "Zoom out", "Fit to view", "Original size", "Expand", "Close", "Scroll to zoom · Drag to pan · Pinch to zoom", "Combat Assist shows the skills enabled when the settings were uploaded. Remaining times are examples."],
    "zh-TW": ["放大", "縮小", "符合視窗", "原始大小", "展開檢視", "關閉", "滾輪縮放 · 拖曳移動 · 雙指縮放", "戰鬥輔助依上傳設定時啟用的技能顯示。剩餘時間僅為範例。"],
    "ja-JP": ["拡大", "縮小", "画面に合わせる", "元のサイズ", "大きく表示", "閉じる", "ホイールで拡大・縮小 · ドラッグで移動 · ピンチで拡大・縮小", "戦闘補助には、設定をアップロードした時点で有効なスキルを表示します。残り時間はサンプルです。"],
    "de-DE": ["Vergrößern", "Verkleinern", "Ansicht einpassen", "Originalgröße", "Großansicht", "Schließen", "Scrollen zum Zoomen · Ziehen zum Verschieben · Mit zwei Fingern zoomen", "Die Kampfhilfe zeigt die beim Hochladen aktivierten Fertigkeiten. Verbleibende Zeiten sind Beispiele."],
    "fr-FR": ["Agrandir", "Réduire", "Ajuster à la vue", "Taille d’origine", "Agrandir la vue", "Fermer", "Molette pour zoomer · Glisser pour déplacer · Pincer pour zoomer", "L’aide au combat affiche les compétences activées lors de l’envoi des paramètres. Les temps restants sont des exemples."],
    "es-ES": ["Acercar", "Alejar", "Ajustar a la vista", "Tamaño original", "Ampliar vista", "Cerrar", "Rueda para ampliar · Arrastra para desplazar · Pellizca para ampliar", "La asistencia de combate muestra las habilidades activadas al subir los ajustes. Los tiempos restantes son ejemplos."],
    "pt-BR": ["Ampliar", "Reduzir", "Ajustar à tela", "Tamanho original", "Expandir", "Fechar", "Role para ampliar · Arraste para mover · Faça pinça para ampliar", "A assistência de combate mostra as habilidades ativadas ao enviar as configurações. Os tempos restantes são exemplos."],
    "ru-RU": ["Увеличить", "Уменьшить", "Вписать в окно", "Исходный размер", "Развернуть", "Закрыть", "Колесо — масштаб · Перетаскивание — перемещение · Щипок — масштаб", "Помощник в бою показывает навыки, включённые на момент загрузки настроек. Оставшееся время приведено для примера."],
  });
  const importLabels = ["applyIntro", "copyStep", "openStep", "openPath", "restoreStep", "restoreHelp", "afterCopy"];
  const importWords = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    ko: ["코드를 복사한 뒤 NotMeter에서 불러오면 이 설정을 사용할 수 있습니다.", "이 영역의 복사 버튼으로 설정 코드를 복사하세요.", "NotMeter에서 복원하기 열기", "환경설정 → 백업·복원 → 복원하기", "붙여넣고 원하는 항목 적용", "코드를 붙여넣고 ‘복원할 항목 확인’을 누르세요. 원하는 항목을 골라 ‘선택한 설정 복원’을 누르면 적용됩니다.", "코드를 복사했습니다. 이제 2단계부터 NotMeter에서 진행하세요."],
    en: ["Copy the code, then import it in NotMeter to use this setup.", "Use the copy button in this panel to copy the settings code.", "Open Restore in NotMeter", "Settings → Backup & restore → Restore", "Paste and apply your choices", "Paste the code and select ‘Review settings to restore’. Choose the settings you want, then select ‘Restore selected settings’ to apply them.", "Code copied. Continue with step 2 in NotMeter."],
    "zh-TW": ["複製代碼後，在 NotMeter 匯入即可使用此設定。", "按此區域的複製按鈕，複製設定代碼。", "在 NotMeter 開啟還原", "設定 → 備份與還原 → 還原", "貼上並套用所選項目", "貼上代碼並按「確認還原項目」，勾選想要的項目，再按「還原所選設定」即可套用。", "已複製代碼。請從第 2 步開始，在 NotMeter 中操作。"],
    "ja-JP": ["コードをコピーし、NotMeter で読み込むと、この設定を使えます。", "この欄のコピーボタンで設定コードをコピーしてください。", "NotMeter で復元を開く", "設定 → バックアップと復元 → 復元", "貼り付けて項目を選択", "コードを貼り付けて「復元する項目を確認」を押します。必要な項目を選び、「選択した設定を復元」を押すと適用されます。", "コードをコピーしました。NotMeter で手順 2 から進めてください。"],
    "de-DE": ["Kopiere den Code und importiere ihn in NotMeter, um diese Einstellungen zu verwenden.", "Kopiere den Einstellungscode mit der Kopiertaste in diesem Bereich.", "Wiederherstellen in NotMeter öffnen", "Einstellungen → Sichern und wiederherstellen → Wiederherstellen", "Einfügen und Auswahl übernehmen", "Füge den Code ein und wähle „Wiederherstellung prüfen“. Wähle die gewünschten Einstellungen und dann „Auswahl wiederherstellen“.", "Code kopiert. Fahre mit Schritt 2 in NotMeter fort."],
    "fr-FR": ["Copiez le code, puis importez-le dans NotMeter pour utiliser ces paramètres.", "Utilisez le bouton de copie de cette section pour copier le code.", "Ouvrir Restaurer dans NotMeter", "Paramètres → Sauvegarde et restauration → Restaurer", "Coller et appliquer votre sélection", "Collez le code, puis cliquez sur « Vérifier les éléments à restaurer ». Choisissez les paramètres souhaités et cliquez sur « Restaurer la sélection ».", "Code copié. Passez à l’étape 2 dans NotMeter."],
    "es-ES": ["Copia el código e impórtalo en NotMeter para usar esta configuración.", "Usa el botón de copia de esta sección para copiar el código.", "Abrir Restaurar en NotMeter", "Ajustes → Copia de seguridad y restauración → Restaurar", "Pegar y aplicar tu selección", "Pega el código y pulsa «Revisar qué restaurar». Elige los ajustes que quieras y pulsa «Restaurar selección» para aplicarlos.", "Código copiado. Continúa con el paso 2 en NotMeter."],
    "pt-BR": ["Copie o código e importe-o no NotMeter para usar esta configuração.", "Use o botão de cópia desta seção para copiar o código.", "Abrir Restaurar no NotMeter", "Configurações → Backup e restauração → Restaurar", "Colar e aplicar sua seleção", "Cole o código e clique em ‘Conferir o que restaurar’. Escolha as configurações desejadas e clique em ‘Restaurar seleção’ para aplicá-las.", "Código copiado. Continue a partir do passo 2 no NotMeter."],
    "ru-RU": ["Скопируйте код и импортируйте его в NotMeter, чтобы использовать эти настройки.", "Нажмите кнопку копирования в этом блоке, чтобы скопировать код настроек.", "Открыть восстановление в NotMeter", "Настройки → Резервное копирование и восстановление → Восстановить", "Вставить код и применить настройки", "Вставьте код и нажмите «Проверить настройки». Отметьте нужные пункты и нажмите «Восстановить выбранное», чтобы применить их.", "Код скопирован. Перейдите к шагу 2 в NotMeter."],
  });
  const copy = locale => Object.fromEntries([
    ...labels.map((key, i) => [key, (words[locale] || words.en)[i]]),
    ...panelLabels.map((key, i) => [key, (panelWords[locale] || panelWords.en)[i]]),
    ...viewerLabels.map((key, i) => [key, (viewerWords[locale] || viewerWords.en)[i]]),
    ...importLabels.map((key, i) => [key, (importWords[locale] || importWords.en)[i]]),
  ]);
  const sessions = new Map();
  let active = null;
  const node = (tag, text, className) => { const e = document.createElement(tag); if (text) e.textContent = text; if (className) e.className = className; return e; };
  const hex = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), b => b.toString(16).padStart(2,"0")).join("");
  function icon(kind) {
    const paths = {
      display: "M3 4h18v13H3z M8 21h8 M12 17v4 M6 8h7 M6 12h11",
      refresh: "M20 7a9 9 0 1 0 1 9 M20 3v5h-5",
      unavailable: "M3 4h18v13H3z M8 21h8 M12 17v4 M12 7v4 M12 14h.01",
      expand: "M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5",
      close: "M6 6l12 12 M18 6L6 18",
      copy: "M9 9h12v12H9z M5 15H3V3h12v2",
      check: "m5 12 4 4L19 6",
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(svg.namespaceURI, "path"); path.setAttribute("d", paths[kind]);
    svg.append(path); return svg;
  }
  function session(identity) {
    const key = `${identity?.region}:${identity?.serverId}:${identity?.characterId}`;
    let value = sessions.get(key);
    if (!value) {
      value = { key, identity: { ...identity }, data: null, error: false, checked: 0, pending: null, scene: "combat" };
      sessions.set(key, value);
      // Keep this page's recent characters without retaining unlimited SVG documents.
      for (const [oldKey, old] of sessions) {
        if (sessions.size <= 12) break;
        if (oldKey !== key && !old.pending && oldKey !== active?.key) sessions.delete(oldKey);
      }
    }
    return value;
  }
  function query(entry, force) {
    if (entry.pending) return entry.pending;
    if (entry.checked && !force) return Promise.resolve();
    entry.pending = load(entry.identity).then(data => {
      entry.data = data; entry.error = false;
    }).catch(() => { entry.error = true; }).finally(() => {
      entry.checked = Date.now(); entry.pending = null;
    });
    return entry.pending;
  }
  async function bounded(response, limit) {
    if (!response.ok) throw new Error("Cache unavailable");
    const reader = response.body.getReader(), chunks = []; let size = 0;
    try { for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > limit) throw new Error("Cache too large"); chunks.push(value); } }
    finally { await reader.cancel().catch(() => {}); }
    const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.length; } return bytes;
  }
  async function readFile(file, signal, refresh = "") {
    if (!file || !/^(?:entries\/[a-f0-9]{64}|catalog\/[0-9]{4}|(?:kr|tw|ww)\/[a-f0-9]{2})\.json\.gz$/.test(file.path) ||
        !Number.isSafeInteger(file.size) || file.size < 1 || file.size > 1048576 || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error("Invalid file");
    const address = file.path.startsWith("entries/") ? file.path : `objects/${file.sha256}.json.gz`;
    const bytes = await fetchBytes(address, file.size, signal);
    if (bytes.length !== file.size || await hex(bytes) !== file.sha256) throw new Error("Cache changed");
    const unpacked = await bounded(new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))), 2097152);
    const data = JSON.parse(new TextDecoder().decode(unpacked)); if (data.schema !== schema) throw new Error("Invalid schema"); return data;
  }
  async function fetchBytes(relative, limit, signal, cache = "default") {
    return fetchResource(base + relative, limit, signal, cache);
  }
  async function fetchResource(url, limit, signal, cache = "default") {
    const deadline = new AbortController();
    const cancel = () => deadline.abort();
    if (signal?.aborted) cancel();
    signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(cancel, 20000);
    try { return await bounded(await fetch(url, { signal: deadline.signal, credentials: "omit", cache }), limit); }
    finally { clearTimeout(timer); signal?.removeEventListener("abort", cancel); }
  }
  async function releaseManifest(signal) {
    const bytes = await fetchResource("https://api.github.com/repos/Not4You-Dev/NotMeter-Settings-Cache/releases/tags/settings-current",524288,signal,"no-store");
    const body = JSON.parse(new TextDecoder().decode(bytes)).body;
    const prefix = "NotMeter settings pointer v1\n";
    if (typeof body !== "string" || body.length > 60000 || !body.startsWith(prefix) ||
        !/^[A-Za-z0-9+/]+={0,2}$/.test(body.slice(prefix.length))) throw Error("Invalid settings pointer");
    const packed = Uint8Array.from(atob(body.slice(prefix.length)),c => c.charCodeAt(0));
    const unpacked = await bounded(new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream("gzip"))),262144);
    const manifest = JSON.parse(new TextDecoder().decode(unpacked));
    if (manifest.schema !== schema || !/^[a-f0-9]{32}$/.test(manifest.generation) ||
        !["settings-a","settings-b"].includes(manifest.tag)) throw Error("Invalid settings pointer");
    return manifest;
  }
  async function readSnapshot(read, signal) {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (signal?.aborted) throw new DOMException("Aborted","AbortError");
      const refresh = attempt ? Date.now().toString(36) + Math.random().toString(36).slice(2,8) : "";
      try {
        const manifest = attempt === 2 ? await releaseManifest(signal) : JSON.parse(new TextDecoder().decode(
          await fetchBytes("manifest.json" + (refresh ? "?refresh=" + refresh : ""),262144,signal,"no-cache")));
        return await read(manifest,file => readFile(file,signal,refresh));
      } catch (error) { if (attempt === 2 || signal?.aborted) throw error; }
    }
  }
  async function load(id, signal) {
    if (!["KR","TW","WW"].includes(id?.region) || !Number.isSafeInteger(id.serverId) || !/^[A-Za-z0-9_+/=-]{12,256}$/.test(id.characterId)) throw new Error("Invalid identity");
    return readSnapshot(async (manifest,read) => {
    if (manifest.schema !== schema || !Array.isArray(manifest.files) || manifest.files.length > 768 || !Number.isSafeInteger(manifest.generatedAt)) throw new Error("Invalid manifest");
    const key = await hex(new TextEncoder().encode(`${id.region}:${id.serverId}:${id.characterId}`));
    const file = manifest.files.find(f => f.path === `${id.region.toLowerCase()}/${key.slice(0,2)}.json.gz`);
    if (!file) return null;
    const index = await read(file), entry = index.entries?.[key];
    if (!entry) return null;
    if (entry.region !== id.region || entry.serverId !== id.serverId || entry.characterId !== id.characterId ||
        !Number.isSafeInteger(entry.updatedAt) || entry.updatedAt < 1 || entry.updatedAt > manifest.generatedAt) throw new Error("Identity mismatch");
    return loadEntry(entry, signal);
    },signal);
  }
  async function loadEntry(entry, signal) {
    const document = await readFile(entry.file, signal);
    if (!/^NM-SETTINGS-2:[A-Za-z0-9_-]{48,24000}$/.test(document.settingsCode) || !Array.isArray(document.groups) || !document.previews ||
        ["idle","combat","assist"].some(scene => typeof document.previews[scene] !== "string" || document.previews[scene].length > 524288 ||
          document.previews[scene] && !/^<svg[\s>]/.test(document.previews[scene]))) throw new Error("Invalid settings");
    const previews = await repairedPreviews(entry, document.settingsCode, signal);
    return { ...document, ...entry, previews: previews || document.previews };
  }
  async function repairedPreviews(entry, code, signal) {
    const { region, serverId, characterId, characterName, job } = entry, source = entry.file.sha256;
    const deadline = new AbortController(), cancel = () => deadline.abort();
    if (signal?.aborted) cancel();
    signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(cancel, 4000);
    try {
      const read = async (path, limit) => bounded(await fetch(new URL(path, repairBase), {
        credentials: "omit", signal: deadline.signal,
      }), limit);
      repairIndex ??= fetch(new URL("index.json?v=20261014-source-icons", repairBase), {
        credentials: "omit", signal: AbortSignal.timeout(4000),
      }).then(response => bounded(response, 65536)).then(bytes => JSON.parse(new TextDecoder().decode(bytes)))
        .catch(error => { repairIndex = null; throw error; });
      const index = await repairIndex;
      if (deadline.signal.aborted || index.schema !== "notmeter-preview-repairs-v1") return null;
      const codeSha256 = await hex(new TextEncoder().encode(code));
      const settingsKey = await hex(new TextEncoder().encode(JSON.stringify([region, serverId, characterId, characterName, job, codeSha256])));
      const exact = index.entries?.[`${region}:${source}`], file = exact || index.settings?.[settingsKey];
      if (!file) return null;
      if (!/^[a-f0-9]{64}\.json\.gz$/.test(file.path) || !/^[a-f0-9]{64}$/.test(file.sha256) ||
          !Number.isSafeInteger(file.size) || file.size < 1 || file.size > 262144) return null;
      const bytes = await read(file.path, file.size);
      if (bytes.length !== file.size || await hex(bytes) !== file.sha256) return null;
      const unpacked = await bounded(new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))), 1048576);
      const repair = JSON.parse(new TextDecoder().decode(unpacked));
      const ownerMatches = repair.owner && ["region", "serverId", "characterId", "characterName", "job"].every(key => repair.owner[key] === entry[key]);
      if (repair.schema !== "notmeter-preview-repairs-v1" || repair.region !== region || repair.codeSha256 !== codeSha256 ||
          (exact ? repair.source !== source || repair.owner && !ownerMatches : !ownerMatches)) return null;
      if (["idle", "combat", "assist"].some(scene => typeof repair.previews?.[scene] !== "string" ||
          repair.previews[scene].length > 524288 || repair.previews[scene] && !/^<svg[\s>]/.test(repair.previews[scene]))) return null;
      return repair.previews;
    } catch { return null; }
    finally { clearTimeout(timer); signal?.removeEventListener("abort", cancel); }
  }
  function dismissOnBackdrop(dialog) {
    let start = null;
    const outside = event => {
      const bounds = dialog.getBoundingClientRect();
      return event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
    };
    dialog.addEventListener("pointerdown",event => { start = event.isPrimary && event.button === 0 && outside(event) ? {id:event.pointerId,x:event.clientX,y:event.clientY} : null; });
    dialog.addEventListener("pointerup",event => {
      const down = start; start = null;
      if (down && down.id === event.pointerId && outside(event) && Math.hypot(event.clientX-down.x,event.clientY-down.y) < 8) dialog.close();
    });
    dialog.addEventListener("pointercancel",() => { start = null; });
  }
  function previewViewer(preview, c) {
    const element = node("div", "", "character-settings-viewer"), toolbar = node("div", "", "character-settings-tools");
    const stage = node("div", "", "character-settings-stage"), hint = node("p", c.gesture, "character-settings-gesture");
    stage.tabIndex = 0; stage.setAttribute("aria-label", `${c.preview}. ${c.gesture}`);
    let image = null, width = 0, height = 0, x = 0, y = 0, scale = 1, fitted = true, disposed = false;
    let dialog = null, placeholder = null, initialScale = 0;
    const pointers = new Map(), controls = [];
    function button(label, text, action, kind) {
      const b = node("button", text); b.type = "button"; b.title = label; b.setAttribute("aria-label", label);
      if (kind) b.prepend(icon(kind)); b.onclick = action; toolbar.append(b); return b;
    }
    const minus = button(c.zoomOut, "−", () => zoom(scale / 1.25));
    const percent = button(c.actualSize, "100%", () => zoom(1)); percent.className = "character-settings-zoom";
    const plus = button(c.zoomIn, "+", () => zoom(scale * 1.25));
    const fitButton = button(c.fit, c.fit, fit);
    const expand = button(c.expand, c.expand, toggleExpanded, "expand"); expand.className = "character-settings-expand";
    expand.setAttribute("aria-expanded", "false"); controls.push(minus, percent, plus, fitButton);
    element.append(toolbar, stage, hint);
    function fitScale() { return Math.min((width - 48) / image.naturalWidth, (height - 48) / image.naturalHeight); }
    function ready() { return image?.naturalWidth > 0 && width > 48 && height > 48; }
    function draw() {
      if (!ready()) return;
      const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
      x = w <= width - 32 ? (width - w) / 2 : Math.max(width - w - 16, Math.min(16, x));
      y = h <= height - 32 ? (height - h) / 2 : Math.max(height - h - 16, Math.min(16, y));
      // Resize the SVG viewport so the browser draws glyphs at the display resolution.
      image.style.width = `${w}px`; image.style.height = `${h}px`;
      image.style.transform = `translate(${x}px,${y}px)`;
      percent.textContent = `${Math.round(scale * 100)}%`;
      minus.disabled = scale <= Math.min(1, fitScale() * .25) + .0001;
      plus.disabled = scale >= Math.max(8, fitScale() * 4) - .0001;
    }
    function fit() { initialScale = 0; fitted = true; if (ready()) { scale = fitScale(); draw(); } }
    function zoom(next, px = width / 2, py = height / 2) {
      if (!ready()) return;
      next = Math.max(Math.min(1, fitScale() * .25), Math.min(Math.max(8, fitScale() * 4), next));
      x = px - (px - x) * next / scale; y = py - (py - y) * next / scale;
      scale = next; fitted = false; draw();
    }
    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      x += (w - width) / 2; y += (h - height) / 2; width = w; height = h;
      if (fitted) { if (ready()) { scale = Math.max(initialScale, fitScale()); draw(); } } else draw();
    }
    const observer = new ResizeObserver(resize); observer.observe(stage);
    stage.addEventListener("wheel", event => {
      if (!ready()) return;
      event.preventDefault(); const r = stage.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
      zoom(scale * Math.exp(-Math.max(-300, Math.min(300, delta)) * .0025), event.clientX-r.left, event.clientY-r.top);
    }, { passive: false });
    const midpoint = points => ({x:(points[0].x+points[1].x)/2, y:(points[0].y+points[1].y)/2});
    const distance = points => Math.hypot(points[1].x-points[0].x, points[1].y-points[0].y);
    stage.onpointerdown = event => {
      if (!ready() || event.button !== 0) return;
      stage.focus({preventScroll:true}); stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY}); stage.classList.add("is-dragging");
    };
    stage.onpointermove = event => {
      if (!pointers.has(event.pointerId)) return;
      const before = [...pointers.values()]; pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      const after = [...pointers.values()];
      if (after.length === 1) { x += after[0].x-before[0].x; y += after[0].y-before[0].y; }
      else {
        const old = midpoint(before), now = midpoint(after), r = stage.getBoundingClientRect();
        if (distance(before) > 0) zoom(scale * distance(after)/distance(before),old.x-r.left,old.y-r.top);
        x += now.x-old.x; y += now.y-old.y;
      }
      fitted = false; draw();
    };
    const release = event => { pointers.delete(event.pointerId); if (!pointers.size) stage.classList.remove("is-dragging"); };
    stage.onpointerup = stage.onpointercancel = stage.onlostpointercapture = release;
    stage.onkeydown = event => {
      if (!ready()) return;
      if (event.key === "+" || event.key === "=") zoom(scale*1.25);
      else if (event.key === "-") zoom(scale/1.25);
      else if (event.key === "0" || event.key === "Home") fit();
      else if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) {
        x += event.key === "ArrowLeft" ? 40 : event.key === "ArrowRight" ? -40 : 0;
        y += event.key === "ArrowUp" ? 40 : event.key === "ArrowDown" ? -40 : 0; fitted = false; draw();
      } else return;
      event.preventDefault();
    };
    function restore() {
      if (!dialog) return;
      placeholder.replaceWith(preview); dialog.remove(); dialog = placeholder = null;
      expand.replaceChildren(icon("expand"), document.createTextNode(c.expand)); expand.setAttribute("aria-label",c.expand); expand.title=c.expand;
      expand.setAttribute("aria-expanded","false"); resize();
      if (!disposed) expand.focus({preventScroll:true});
    }
    function toggleExpanded() {
      if (dialog) { dialog.close(); restore(); return; }
      placeholder = document.createComment("preview"); preview.before(placeholder);
      dialog = node("dialog","","character-settings character-settings-dialog"); dialog.setAttribute("aria-label",c.preview);
      const opened = dialog;
      dismissOnBackdrop(dialog);
      dialog.append(preview); document.body.append(dialog); dialog.addEventListener("close",() => { if (dialog === opened) restore(); },{once:true}); dialog.showModal();
      expand.replaceChildren(icon("close"),document.createTextNode(c.collapse)); expand.setAttribute("aria-label",c.collapse); expand.title=c.collapse;
      expand.setAttribute("aria-expanded","true"); resize(); expand.focus();
    }
    return {
      element,
      show(url, alt, preferOriginalSize = false) {
        pointers.clear(); stage.classList.remove("is-dragging"); image = null; fitted = true;
        initialScale = preferOriginalSize ? 1 : 0;
        controls.forEach(b => b.disabled = !url); percent.textContent = "100%";
        if (!url) { stage.replaceChildren(node("p",c.hidden)); return; }
        const next = node("img"); next.alt = alt; next.draggable = false;
        next.onload = () => { if (!disposed && image === next) resize(); };
        image = next; stage.replaceChildren(next); next.src = url;
      },
      dispose() { disposed = true; observer.disconnect(); restore(); image = null; },
    };
  }
  function create({ identity, locale }) {
    const entry = session(identity);
    if (active?.key === entry.key && active.locale === locale) return active.root;
    active?.close(); const urls = []; let observer, viewer, closed = false, rendered = null;
    const c = copy(locale), root = node("section", "", "character-settings"), header = node("div", "", "character-settings-heading");
    const heading = node("div", "", "character-settings-title"), mark = node("span", "", "character-settings-mark"); mark.append(icon("display"));
    const headingText = node("div"); headingText.append(node("h2",c.title),node("p",c.subtitle)); heading.append(mark,headingText);
    const refresh = node("button", "", "character-settings-refresh"), refreshText = node("span",c.refresh);
    refresh.type = "button"; refresh.append(icon("refresh"),refreshText); refresh.onclick = () => start(true);
    const body = node("div","","character-settings-body"), status = node("p","","character-settings-status"), footer = node("footer","","character-settings-footer");
    status.setAttribute("role","status"); const checked = node("span","","character-settings-checked");
    header.append(heading,refresh); footer.append(status,checked); root.append(header,body,footer);
    const close = () => { closed = true; observer?.disconnect(); viewer?.dispose(); urls.splice(0).forEach(url => URL.revokeObjectURL(url)); };
    function paint() {
      if (closed) return;
      const data = entry.data;
      refresh.disabled = !!entry.pending; refreshText.textContent = entry.pending ? c.refreshing : c.refresh;
      root.setAttribute("aria-busy", String(!!entry.pending));
      root.dataset.state = entry.error ? "error" : data ? "ready" : entry.checked ? "empty" : "loading";
      checked.textContent = entry.checked ? `${c.checked}: ${new Date(entry.checked).toLocaleTimeString(locale,{hour:"2-digit",minute:"2-digit"})}` : "";
      status.textContent = entry.error ? data ? c.retained : c.error : data ? `${c.updated}: ${new Date(data.updatedAt*1000).toLocaleString(locale)}` : entry.checked ? c.empty : c.loading;
      if (data && rendered === data) return;
      viewer?.dispose(); viewer = null; urls.splice(0).forEach(url => URL.revokeObjectURL(url)); body.replaceChildren(); rendered = data;
      if (data) {
        const workspace = node("div","","character-settings-workspace"), preview = node("div","","character-settings-preview");
        const previewHeader = node("div","","character-settings-preview-heading"); previewHeader.append(node("h3",c.preview));
        const navigation = node("div","","character-settings-scenes"); navigation.setAttribute("role","group"); navigation.setAttribute("aria-label",c.title);
        viewer = previewViewer(preview,c); const buttons = [], scenes = new Map();
        const sceneNote = node("p","","character-settings-selection-note");
        for (const scene of ["idle","combat","assist"]) {
          const tab = node("button",c[scene]); tab.type = "button"; buttons.push([scene,tab]); navigation.append(tab);
          tab.onclick = () => select(scene);
        }
        let selection = 0;
        async function select(scene) {
          const selected = ++selection;
          entry.scene = scene;
          for (const [key,tab] of buttons) tab.setAttribute("aria-pressed", String(key === scene));
          sceneNote.textContent = scene === "assist" ? c.selectionNote : ""; sceneNote.hidden = scene !== "assist";
          const original = data.previews?.[scene];
          let svg = globalThis.NotMeterPreviewLocale?.render(original,locale) ?? original;
          if (!svg) { viewer.show(null); return; }
          if (typeof svg !== "string" || svg.length > 524288 || !/^<svg[\s>]/.test(svg)) throw new Error("Invalid preview");
          if (globalThis.NotMeterPreviewIcons) svg = await globalThis.NotMeterPreviewIcons.restore(svg);
          if (selected !== selection || closed || rendered !== data) return;
          if (!scenes.has(scene)) { const url = URL.createObjectURL(new Blob([svg],{ type:"image/svg+xml" })); scenes.set(scene,url); urls.push(url); }
          viewer.show(scenes.get(scene), `${c.title} — ${c[scene]}`, scene === "assist");
        }
        select(entry.scene);
        previewHeader.append(navigation); preview.append(previewHeader,viewer.element,sceneNote,node("p",c.note,"character-settings-note"));
        const aside = node("section","","character-settings-apply"), button = node("button","","character-settings-copy"); button.type = "button";
        const applyHeading = node("div","","character-settings-apply-heading"), applyTitle = node("div");
        applyTitle.append(node("h3",c.apply),node("p",c.applyIntro,"character-settings-import"));
        button.append(icon("copy"),node("span",c.copy)); applyHeading.append(applyTitle,button);
        const steps = node("ol","","character-settings-import-steps");
        for (const [title,help] of [[c.copy,c.copyStep],[c.openStep,c.openPath],[c.restoreStep,c.restoreHelp]]) {
          const step = node("li"), stepText = node("div");
          stepText.append(node("h4",title),node("p",help)); step.append(stepText); steps.append(step);
        }
        const feedback = node("p","","character-settings-import-feedback");
        feedback.setAttribute("role","status"); feedback.setAttribute("aria-atomic","true"); feedback.hidden = true;
        const code = node("textarea"); code.value = data.settingsCode; code.readOnly = true; code.hidden = true; code.setAttribute("aria-label",c.copy);
        const details = node("details"), summary = node("summary",c.code); code.hidden = false; details.append(summary,code);
        button.onclick = async () => {
          if (button.disabled) return;
          button.disabled = true;
          try {
            await navigator.clipboard.writeText(data.settingsCode);
            if (!closed && rendered === data) {
              button.replaceChildren(icon("check"),node("span",c.copied));
              aside.dataset.copied = "true"; feedback.dataset.state = "success";
              feedback.hidden = false; feedback.textContent = c.afterCopy;
            }
          } catch {
            if (!closed && rendered === data) {
              button.replaceChildren(icon("copy"),node("span",c.copy));
              delete aside.dataset.copied; feedback.dataset.state = "error";
              feedback.hidden = false; feedback.textContent = c.copyError;
              details.open = true; code.focus(); code.select();
            }
          } finally { button.disabled = false; }
        };
        aside.append(applyHeading,steps,feedback,details);
        workspace.append(aside,preview); body.append(workspace,node("p",c.manual,"character-settings-note"));
      } else {
        const empty = node("div","","character-settings-message"), symbol = node("span","","character-settings-message-icon"), text = node("div");
        symbol.append(icon(entry.error ? "unavailable" : "display"));
        text.append(node("h3",entry.error ? c.error : entry.checked ? c.empty : c.loading));
        text.append(node("p",entry.error ? c.errorHint : c.emptyHint)); empty.append(symbol,text); body.append(empty,node("p",c.manual,"character-settings-note"));
      }
      const sharingGuide = globalThis.NotMeterSettingsShareGuide?.create(locale);
      if (sharingGuide) body.append(sharingGuide);
    }
    async function start(force = false) {
      if (closed || entry.pending && force) return;
      observer?.disconnect(); const pending = query(entry,force); paint(); await pending; paint();
    }
    active = { key: entry.key, locale, root, close, refresh: () => start(true) };
    paint();
    if (entry.pending) void entry.pending.then(paint);
    if (!entry.checked && !entry.pending) {
      observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) void start(); }); observer.observe(root);
    }
    return root;
  }
  globalThis.NotMeterCharacterSettings = Object.freeze({ create, copy, refresh: () => active?.refresh(), close: () => { active?.close(); active = null; }, load,
    loadEntry, readFile, readSnapshot, fetchBytes, dismissOnBackdrop, prime(identity, data) {
      const entry = session(identity); entry.data = data; entry.error = false; entry.checked = Date.now();
    } });
})();
