(() => {
  "use strict";
  const expiresAt = Date.parse("2026-10-12T00:00:00+09:00");
  const storageKey = "notmeter.notice.statistics-reset-20261011.hidden-until";
  const copy = {
    ko: {
      title: "통계 초기화 및 서버 증설 안내",
      lead: "오늘, 10월 11일(한국 시간) 중 NotMeter의 모든 통계 데이터가 초기화될 예정입니다.",
      growth: "중복을 제외한 누적 전투 기록이 5,000만 건에 도달했습니다. 현재는 상위 던전 위주로 통계를 제공하고 있지만, 앞으로 추가될 신규 던전과 계속 증가하는 데이터를 안정적으로 관리하려면 통계 데이터 구조를 개선해야 하는 상황입니다.",
      plan: "이번 작업에서는 통계 데이터 구조 개편과 함께 서버 증설을 진행합니다. 증설이 완료되면 확장된 서버 자원을 활용해 다음 기능을 순차적으로 제공할 예정입니다.",
      impactTitle: "점검 완료",
      impact: "점검 중에는 닉네임 효과 변경과 온라인 상태 표시 기능을 이용할 수 없습니다.",
      features: "준비 중인 기능",
      settingsTitle: "NotMeter 환경설정 저장 및 공유",
      settings: "사용 중인 NotMeter 환경설정을 서버에 보관하거나 다른 사용자에게 공유할 수 있게 됩니다. 캐릭터 검색에서 해당 캐릭터가 공유한 NotMeter 설정을 확인할 수 있습니다.",
      manual: "설정은 자동으로 동기화되지 않습니다. 설정을 보관하거나 공유 내용을 갱신하려면 새로 추가될 ‘환경설정 갱신’ 버튼을 눌러 직접 업로드해야 합니다.",
      skillsTitle: "캐릭터 검색에서 스킬 특성 공유 — 개발 완료",
      skills: "캐릭터 검색의 스킬 탭에서 해당 캐릭터가 업로드한 PVE·PVP 스킬트리와 선택한 스킬 특성을 확인할 수 있습니다.",
      today: "오늘 더 이상 보지 않기", close: "닫기",
      until: "공지 표시 종료: 10월 12일 00:00 · 한국 시간(UTC+9)",
    },
    en: {
      title: "Statistics reset & server expansion",
      lead: "All NotMeter statistics data is scheduled to be reset on October 11 (Korea Standard Time, UTC+9).",
      growth: "We have now accumulated 50 million unique combat records, excluding duplicates. Although our statistics currently focus on higher-level dungeons, the existing data structure needs to be improved to handle continued growth and the addition of new dungeons reliably.",
      plan: "As part of this work, we will expand our server capacity and restructure the statistics data. Once the expansion is complete, we plan to use the additional capacity to roll out the following features.",
      impactTitle: "Maintenance completed",
      impact: "During maintenance, nickname effect changes and online status indicators will be unavailable.",
      features: "Upcoming features",
      settingsTitle: "Save and share your NotMeter settings",
      settings: "You will be able to back up your NotMeter settings to the server or share them with other users. Shared settings will be available on the corresponding character’s page in Character Search.",
      manual: "Settings will not sync automatically. A new settings upload/update button will let you manually back up your current settings or update the version you have shared.",
      skillsTitle: "Share skill builds in Character Search — development completed",
      skills: "The Skills tab in Character Search lets users view a character’s uploaded PVE and PVP builds, including their selected skill specializations.",
      today: "Don’t show again today", close: "Close",
      until: "This notice expires on October 12 at 00:00 KST (UTC+9).",
    },
    "zh-TW": {
      title: "統計資料重置與伺服器擴充公告",
      lead: "NotMeter 的所有統計資料預計於 10 月 11 日（韓國時間，UTC+9）內重置。",
      growth: "扣除重複資料後，累積戰鬥紀錄已達 5,000 萬筆。目前雖然主要提供高階副本的統計，但為了穩定處理持續增加的資料，並支援未來推出的新副本，我們需要改善現有的統計資料結構。",
      plan: "本次作業將同時進行統計資料結構改版與伺服器擴充。擴充完成後，我們將運用新增的伺服器資源，陸續推出以下功能。",
      impactTitle: "維護完成",
      impact: "維護期間將無法變更暱稱特效，也無法使用線上狀態顯示功能。",
      features: "準備推出的功能",
      settingsTitle: "儲存與分享 NotMeter 設定",
      settings: "您將能夠把目前使用的 NotMeter 設定備份到伺服器，或分享給其他使用者。在角色搜尋頁面中，也能查看該角色所分享的 NotMeter 設定。",
      manual: "設定不會自動同步。若要備份設定或更新已分享的內容，請使用即將新增的「更新設定」按鈕，手動上傳目前的設定。",
      skillsTitle: "在角色搜尋中分享技能配置 — 已完成開發",
      skills: "在角色搜尋的技能分頁中，可查看該角色上傳的 PVE、PVP 技能配置，以及所選擇的技能特化。",
      today: "今天不再顯示", close: "關閉",
      until: "公告顯示截止：10 月 12 日 00:00，韓國時間（UTC+9）。",
    },
    "ja-JP": {
      title: "統計データのリセットとサーバー増強のお知らせ",
      lead: "NotMeterのすべての統計データを、10月11日中（韓国標準時・UTC+9）にリセットする予定です。",
      growth: "重複を除いた累計戦闘記録が5,000万件に達しました。現在は主に高レベルのダンジョンを対象に統計を提供していますが、増え続けるデータと今後追加されるダンジョンに安定して対応するため、統計データの構造を改善する必要があります。",
      plan: "今回の作業では、統計データの構造を見直すとともにサーバーを増強します。増強後は、拡張したサーバーリソースを活用し、以下の機能を順次提供する予定です。",
      impactTitle: "メンテナンス完了",
      impact: "メンテナンス中は、ニックネームエフェクトの変更とオンライン状態の表示をご利用いただけません。",
      features: "準備中の機能",
      settingsTitle: "NotMeterの設定を保存・共有",
      settings: "使用中のNotMeterの設定をサーバーにバックアップしたり、ほかのユーザーと共有したりできるようになります。キャラクター検索では、そのキャラクターが共有したNotMeterの設定を確認できます。",
      manual: "設定は自動では同期されません。バックアップや共有内容の更新には、新たに追加される「設定を更新」ボタンから手動でアップロードする必要があります。",
      skillsTitle: "キャラクター検索でスキル構成を共有 — 開発完了",
      skills: "キャラクター検索のスキルタブで、そのキャラクターがアップロードしたPVE・PVPのスキル構成と、選択したスキル特化を確認できます。",
      today: "今日は表示しない", close: "閉じる",
      until: "お知らせの表示期限：10月12日 00:00（韓国標準時・UTC+9）。",
    },
    "de-DE": {
      title: "Zurücksetzen der Statistiken und Servererweiterung",
      lead: "Alle Statistikdaten von NotMeter werden voraussichtlich im Laufe des 11. Oktober zurückgesetzt (koreanische Standardzeit, UTC+9).",
      growth: "Inzwischen haben wir 50 Millionen eindeutige Kampfaufzeichnungen gesammelt, ohne Duplikate. Unsere Statistiken konzentrieren sich derzeit auf höherstufige Dungeons. Damit wir die weiter wachsende Datenmenge und zukünftige Dungeons zuverlässig unterstützen können, müssen wir die bestehende Datenstruktur verbessern.",
      plan: "Im Zuge dieser Arbeiten erweitern wir die Serverkapazität und überarbeiten die Struktur der Statistikdaten. Anschließend wollen wir die zusätzlichen Ressourcen nutzen, um die folgenden Funktionen schrittweise bereitzustellen.",
      impactTitle: "Wartung abgeschlossen",
      impact: "Während der Wartung sind Änderungen an Namenseffekten und die Anzeige des Online-Status nicht verfügbar.",
      features: "Geplante Funktionen",
      settingsTitle: "NotMeter-Einstellungen speichern und teilen",
      settings: "Ihr könnt eure NotMeter-Einstellungen auf dem Server sichern oder mit anderen teilen. Geteilte Einstellungen lassen sich auf der Seite des jeweiligen Charakters in der Charaktersuche ansehen.",
      manual: "Die Einstellungen werden nicht automatisch synchronisiert. Über eine neue Schaltfläche zum Hochladen und Aktualisieren könnt ihr eure aktuellen Einstellungen manuell sichern oder die geteilte Version aktualisieren.",
      skillsTitle: "Skill-Builds in der Charaktersuche teilen — Entwicklung abgeschlossen",
      skills: "Im Tab „Skills“ der Charaktersuche könnt ihr die hochgeladenen PVE- und PVP-Builds eines Charakters einschließlich seiner ausgewählten Spezialisierungen ansehen.",
      today: "Heute nicht mehr anzeigen", close: "Schließen",
      until: "Dieser Hinweis wird bis zum 12. Oktober, 00:00 Uhr KST (UTC+9), angezeigt.",
    },
    "fr-FR": {
      title: "Réinitialisation des statistiques et extension des serveurs",
      lead: "Toutes les données statistiques de NotMeter seront réinitialisées dans la journée du 11 octobre (heure de Corée, UTC+9).",
      growth: "Nous avons désormais accumulé 50 millions de rapports de combat uniques, hors doublons. Nos statistiques portent actuellement surtout sur les donjons de haut niveau. Il est nécessaire d’améliorer la structure des données pour gérer leur croissance et prendre en charge les futurs donjons de manière fiable.",
      plan: "Ces travaux comprennent une restructuration des données statistiques et une augmentation de la capacité de nos serveurs. Une fois l’extension terminée, nous prévoyons de déployer progressivement les fonctionnalités suivantes grâce aux ressources supplémentaires.",
      impactTitle: "Maintenance terminée",
      impact: "Pendant la maintenance, la modification des effets de pseudo et l’affichage du statut en ligne seront indisponibles.",
      features: "Fonctionnalités à venir",
      settingsTitle: "Sauvegarder et partager vos paramètres NotMeter",
      settings: "Vous pourrez sauvegarder vos paramètres NotMeter sur le serveur ou les partager avec d’autres utilisateurs. Les paramètres partagés seront consultables sur la page du personnage concerné dans la recherche de personnages.",
      manual: "Les paramètres ne seront pas synchronisés automatiquement. Un nouveau bouton d’envoi et de mise à jour vous permettra de sauvegarder manuellement vos paramètres actuels ou d’actualiser la version partagée.",
      skillsTitle: "Partager des builds dans la recherche de personnages — développement terminé",
      skills: "L’onglet Compétences de la recherche de personnages permet de consulter les builds PVE et PVP envoyés par le propriétaire du personnage, ainsi que les spécialisations sélectionnées.",
      today: "Ne plus afficher aujourd’hui", close: "Fermer",
      until: "Cette annonce sera affichée jusqu’au 12 octobre à 00 h 00, heure de Corée (UTC+9).",
    },
    "es-ES": {
      title: "Reinicio de estadísticas y ampliación de servidores",
      lead: "Está previsto reiniciar todos los datos estadísticos de NotMeter a lo largo del 11 de octubre (hora de Corea, UTC+9).",
      growth: "Ya hemos acumulado 50 millones de registros de combate únicos, sin contar duplicados. Aunque las estadísticas se centran actualmente en las mazmorras de nivel alto, necesitamos mejorar la estructura de los datos para gestionar su crecimiento y la incorporación de nuevas mazmorras de forma fiable.",
      plan: "Estos trabajos incluyen una reestructuración de los datos estadísticos y una ampliación de la capacidad de los servidores. Una vez terminada la ampliación, aprovecharemos los nuevos recursos para incorporar progresivamente las siguientes funciones.",
      impactTitle: "Mantenimiento completado",
      impact: "Durante el mantenimiento no estarán disponibles los cambios de efectos del nombre ni los indicadores de estado en línea.",
      features: "Próximas funciones",
      settingsTitle: "Guardar y compartir los ajustes de NotMeter",
      settings: "Podrás guardar una copia de tus ajustes de NotMeter en el servidor o compartirlos con otros usuarios. Los ajustes compartidos se podrán consultar en la página del personaje correspondiente en la búsqueda de personajes.",
      manual: "Los ajustes no se sincronizarán automáticamente. Un nuevo botón para subir y actualizar ajustes te permitirá guardar manualmente tu configuración actual o actualizar la versión que hayas compartido.",
      skillsTitle: "Compartir builds en la búsqueda de personajes — desarrollo completado",
      skills: "La pestaña Habilidades de la búsqueda de personajes permite consultar las builds PVE y PVP subidas por el propietario del personaje, incluidas las especializaciones seleccionadas.",
      today: "No volver a mostrar hoy", close: "Cerrar",
      until: "Este aviso se mostrará hasta el 12 de octubre a las 00:00, hora de Corea (UTC+9).",
    },
    "pt-BR": {
      title: "Redefinição das estatísticas e expansão dos servidores",
      lead: "Todos os dados estatísticos do NotMeter serão redefinidos ao longo do dia 11 de outubro (horário da Coreia, UTC+9).",
      growth: "Já acumulamos 50 milhões de registros de combate únicos, sem contar duplicatas. Embora as estatísticas atualmente se concentrem nas masmorras de nível mais alto, precisamos melhorar a estrutura dos dados para lidar com seu crescimento e com a chegada de novas masmorras de forma confiável.",
      plan: "Este trabalho inclui a reestruturação dos dados estatísticos e a ampliação da capacidade dos servidores. Após a expansão, usaremos os recursos adicionais para disponibilizar gradualmente as funcionalidades a seguir.",
      impactTitle: "Manutenção concluída",
      impact: "Durante a manutenção, a alteração dos efeitos de apelido e a exibição do status online ficarão indisponíveis.",
      features: "Próximas funcionalidades",
      settingsTitle: "Salvar e compartilhar suas configurações do NotMeter",
      settings: "Você poderá fazer backup das suas configurações do NotMeter no servidor ou compartilhá-las com outros usuários. As configurações compartilhadas poderão ser consultadas na página do respectivo personagem na busca de personagens.",
      manual: "As configurações não serão sincronizadas automaticamente. Um novo botão de envio e atualização permitirá fazer backup manual das configurações atuais ou atualizar a versão compartilhada.",
      skillsTitle: "Compartilhar builds na busca de personagens — desenvolvimento concluído",
      skills: "A aba Habilidades da busca de personagens permite consultar as builds PVE e PVP enviadas pelo dono do personagem, incluindo as especializações selecionadas.",
      today: "Não mostrar novamente hoje", close: "Fechar",
      until: "Este aviso será exibido até 12 de outubro, às 00:00, no horário da Coreia (UTC+9).",
    },
    "ru-RU": {
      title: "Сброс статистики и расширение серверов",
      lead: "Все статистические данные NotMeter будут сброшены в течение 11 октября по корейскому времени (UTC+9).",
      growth: "Мы накопили уже 50 миллионов уникальных записей о боях, без учёта дубликатов. Сейчас статистика охватывает преимущественно высокоуровневые подземелья. Чтобы надёжно обрабатывать растущий объём данных и поддерживать новые подземелья, необходимо улучшить структуру хранения статистики.",
      plan: "В рамках этих работ мы переработаем структуру статистических данных и увеличим серверные мощности. После расширения серверов планируем использовать дополнительные ресурсы для постепенного внедрения следующих функций.",
      impactTitle: "Техработы завершены",
      impact: "Во время техработ изменение эффектов никнейма и отображение статуса «в сети» будут недоступны.",
      features: "Готовящиеся функции",
      settingsTitle: "Сохранение настроек NotMeter и обмен ими",
      settings: "Вы сможете сохранять резервную копию настроек NotMeter на сервере или делиться ими с другими пользователями. Опубликованные настройки будут доступны на странице соответствующего персонажа в поиске персонажей.",
      manual: "Настройки не будут синхронизироваться автоматически. Новая кнопка загрузки и обновления позволит вручную сохранять текущие настройки или обновлять опубликованную версию.",
      skillsTitle: "Публикация сборок навыков в поиске персонажей — разработка завершена",
      skills: "На вкладке «Навыки» в поиске персонажей можно просмотреть загруженные владельцем персонажа сборки для PVE и PVP, включая выбранные специализации навыков.",
      today: "Больше не показывать сегодня", close: "Закрыть",
      until: "Объявление будет отображаться до 12 октября, 00:00 по корейскому времени (UTC+9).",
    },
  };

  function init() {
    if (Date.now() >= expiresAt) return;
    const notice = document.createElement("dialog");
    notice.id = "maintenance-notice";
    notice.setAttribute("aria-labelledby", "maintenance-title");
    notice.setAttribute("aria-describedby", "maintenance-lead");
    notice.innerHTML = `
      <header class="maintenance-header">
        <h2 id="maintenance-title" tabindex="-1" data-maintenance="title"></h2>
        <button type="button" class="maintenance-close" data-maintenance-close>×</button>
      </header>
      <div class="maintenance-body" tabindex="0">
        <p id="maintenance-lead" class="maintenance-lead" data-maintenance="lead"></p>
        <p class="maintenance-explanation" data-maintenance="growth"></p>
        <p class="maintenance-explanation" data-maintenance="plan"></p>
        <aside class="maintenance-impact">
          <strong data-maintenance="impactTitle"></strong><p data-maintenance="impact"></p>
        </aside>
        <h3 data-maintenance="features"></h3>
        <ul>
          <li><strong data-maintenance="settingsTitle"></strong><p data-maintenance="settings"></p><p data-maintenance="manual"></p></li>
          <li><strong data-maintenance="skillsTitle"></strong><p data-maintenance="skills"></p></li>
        </ul>
      </div>
      <footer class="maintenance-footer">
        <div class="maintenance-actions">
          <button type="button" class="maintenance-dismiss-today" data-maintenance="today"></button>
          <button type="button" class="maintenance-confirm" data-maintenance="close" data-maintenance-close></button>
        </div>
        <p class="maintenance-until" data-maintenance="until"></p>
      </footer>`;
    document.body.append(notice);
    let closedThisVisit = false, timer;

    function render() {
      const locale = globalThis.NotMeterI18n?.normalize(document.documentElement.lang) || "en";
      const words = copy[locale] || copy.en;
      notice.lang = locale;
      notice.querySelectorAll("[data-maintenance]").forEach(node => {
        node.textContent = words[node.dataset.maintenance];
      });
      notice.querySelector(".maintenance-close").setAttribute("aria-label", words.close);
    }
    function hiddenToday() {
      try {
        const until = Number(localStorage.getItem(storageKey));
        return Number.isFinite(until) && until > Date.now() && until <= expiresAt;
      } catch { return false; }
    }
    function sync() {
      clearTimeout(timer);
      const remaining = expiresAt - Date.now();
      if (remaining <= 0 || closedThisVisit || hiddenToday()) {
        if (notice.open) notice.close();
        return;
      }
      if (!notice.open) {
        notice.showModal();
        document.body.classList.add("maintenance-notice-open");
        notice.querySelector("h2").focus({ preventScroll: true });
      }
      timer = setTimeout(sync, Math.min(remaining, 60_000));
    }
    notice.querySelectorAll("[data-maintenance-close]").forEach(button => {
      button.addEventListener("click", () => notice.close());
    });
    notice.querySelector(".maintenance-dismiss-today").addEventListener("click", () => {
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      try { localStorage.setItem(storageKey, String(Math.min(midnight.getTime(), expiresAt))); }
      catch { /* Still close the notice when browser storage is unavailable. */ }
      notice.close();
    });
    notice.addEventListener("close", () => {
      closedThisVisit = true;
      clearTimeout(timer);
      document.body.classList.remove("maintenance-notice-open");
    });
    notice.addEventListener("keydown", event => {
      if (event.key === "Escape") event.stopPropagation();
      if (event.key !== "Tab") return;
      const stops = [...notice.querySelectorAll('button, [tabindex="0"]')];
      const index = stops.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0 || !event.shiftKey && index === stops.length - 1) {
        event.preventDefault();
        stops[event.shiftKey ? stops.length - 1 : 0].focus();
      }
    });
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    addEventListener("storage", event => {
      if (event.key === storageKey || event.key === null) sync();
    });
    addEventListener("pageshow", sync);
    document.addEventListener("visibilitychange", sync);
    render();
    sync();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
