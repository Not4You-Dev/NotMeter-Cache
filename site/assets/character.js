(() => {
  "use strict";

  const LOCAL_CHARACTER_API_ROOT = "http://127.0.0.1:5080/character/v1";
  const CURRENT_HOME_CHARACTER_API_ROOTS = Object.freeze([
    "https://notmeter.59-27-108-81.sslip.io/character/v1",
    "https://notmeter.59-27-108-81.nip.io/character/v1",
  ]);
  const RETIRED_CHARACTER_API_HOSTS = new Set([
    "notmeter.112-168-140-142.sslip.io",
    "notmeter.112-168-140-142.nip.io",
  ]);
  const TRANSIENT_CHARACTER_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
  const RECENT_KEY = "notmeter-character-recent-v1";
  const FAVORITE_KEY = "notmeter-character-favorites-v1";
  const OFFICIAL_NAME_CATALOG_URL = "./assets/game-data.zh-TW.json?v=20261008-client-terms-2";
  const ENGLISH_NAME_CATALOG_URL = "./assets/character-names.en.json?v=20261008-client-terms";
  const OFFICIAL_TERMS_KO_TO_ZH_TW = Object.freeze({
    "천족": "天族", "마족": "魔族",
    "공격력": "攻擊力", "추가 공격력": "追加攻擊力", "최대 공격력": "最大攻擊力",
    "명중": "命中", "추가 명중": "追加命中", "치명타": "暴擊", "치명타 저항": "暴擊抵抗",
    "방어력": "防禦力", "추가 방어력": "追加防禦力", "회피": "迴避", "추가 회피": "追加迴避",
    "생명력": "生命力", "정신력": "精神力", "전투 속도": "戰鬥速度", "이동 속도": "移動速度",
    "피해 증폭": "傷害增幅", "무기 피해 증폭": "武器傷害增幅", "치명타 피해 증폭": "暴擊傷害增幅",
    "전방 피해 증폭": "前方傷害增幅", "후방 피해 증폭": "後方傷害增幅",
    "PVE 공격력": "PVE攻擊力", "PVE 명중": "PVE命中", "PVE 피해 증폭": "PVE傷害增幅",
    "보스 공격력": "首領攻擊力", "보스 피해 증폭": "首領傷害增幅",
    "봉혼석 추가 피해": "封魂石追加傷害", "막기": "格擋", "관통": "貫穿",
    "다단 히트 적중": "多段打擊命中", "재시전 시간": "再次施展時間",
  });
  const RECENT_LIMIT = 10;
  const FAVORITE_LIMIT = 30;
  const REQUEST_TIMEOUT_MS = 45_000;
  const SEARCH_REQUEST_TIMEOUT_MS = 8_000;
  const SEARCH_TOTAL_TIMEOUT_MS = 20_000;
  const SEARCH_POLL_TIMEOUT_MS = 60_000;
  const TRANSIENT_RETRY_DELAY_MS = 1_000;
  const MAX_RETRY_AFTER_MS = 3_000;
  const SEARCH_SESSION_TTL_MS = 5 * 60_000;
  const PROFILE_SESSION_TTL_MS = 10 * 60_000;
  const SESSION_PROFILE_LIMIT = 4;
  const PROFILE_SESSION_INDEX_KEY = "notmeter-character-profile-session-index-v1";
  let discoveredCharacterApiRoots = [];
  let characterEndpointRefresh = null;
  const CORE_STAT_TYPES = new Set(["STR", "DEX", "INT", "CON", "AGI", "WIS"]);
  const DIVINE_STAT_TYPES = new Set([
    "Justice", "Freedom", "Illusion", "Life", "Time", "Destruction",
    "Death", "Wisdom", "Destiny", "Space",
  ]);
  const ACCESSORY_SLOT_TYPES = new Set([
    "Pendant", "Necklace", "Earring1", "Earring2", "Ring1", "Ring2", "Bracelet1",
    "Bracelet2", "Belt", "Brooch1", "Brooch2", "Amulet", "Rune1", "Rune2", "Seal1", "Seal2",
  ]);
  const ITEM_GRADE_PRIORITY = Object.freeze({ Mythic: 6, Epic: 5, Unique: 4, Legend: 3, Rare: 2, Common: 1 });
  const COPY = {
    ko: {
      searchKicker: "CHARACTER LOOKUP", searchTitle: "캐릭터 검색",
      searchDescription: "닉네임으로 장비·스킬·랭킹을 바로 확인하세요",
      searchRegion: "검색 지역", regionKr: "한국", regionTw: "대만", regionGlobal: "Global",
      comingSoon: "준비 중",
      globalSearchGuide: "글로벌은 45레벨 캐릭터만 검색됩니다.",
      globalRegionLabel: "글로벌 지역",
      globalServerLabel: "서버",
      globalAllServers: "전체 서버",
      globalServersLoading: "서버 목록을 불러오는 중",
      globalServersError: "서버 목록을 불러오지 못했습니다. 전체 서버 검색은 이용할 수 있습니다.",
      globalResults: "검색 결과 · 정확히 일치 · CP 높은 순 · 45레벨만 표시",
      globalDescription: "닉네임으로 현재 장비와 스킬을 확인하세요",
      placeholder: "캐릭터 이름을 입력하세요", search: "검색", saved: "즐겨찾기 · 최근 검색",
      favorites: "즐겨찾기", recent: "최근 검색", recentGuide: "즐겨찾기는 고정 · 최근 검색은 최대 10개",
      addFavorite: "즐겨찾기에 추가", removeFavorite: "즐겨찾기에서 제거", deleteRecent: "최근 검색에서 삭제",
      results: "검색 결과 · 정확히 일치 · CP 높은 순 · 50레벨만 표시",
      searchAll: "전체", searchElyos: "천족", searchAsmodian: "마족", searchRaceFilter: "종족 필터",
      searching: "공식 캐릭터를 검색하고 있습니다", sortingCp: "CP 확인 후 자동 정렬 중",
      cpPending: "확인 중", noRecent: "즐겨찾기 또는 최근 검색한 캐릭터가 없습니다.",
      noResults: "검색 결과가 없습니다.", searchError: "검색 응답을 받지 못했습니다. 잠시 후 다시 검색해 주세요.",
      searchSlow: "검색이 지연되고 있습니다. 다른 이름으로 다시 검색할 수 있습니다.",
      searchPending: "추가 정보를 아직 받지 못했습니다. 잠시 후 다시 검색해 주세요.",
      invalidName: "캐릭터 이름을 입력해 주세요.", pageTitle: "NotMeter 캐릭터 정보",
      pageSubtitle: "장비 · 영혼 각인 · 마석 · 스킬", heading: "캐릭터 정보",
      headingDescription: "장비 옵션과 영혼 각인, 마석을 한 화면에서 비교할 수 있습니다.",
      back: "랭킹으로 돌아가기", loading: "공식 캐릭터 정보를 불러오는 중입니다",
      loadingSub: "장비별 영혼 각인과 마석을 함께 확인하고 있습니다.",
      loadingDetails: "장비 상세 옵션을 빠르게 불러오는 중",
      loadError: "캐릭터 정보를 불러오지 못했습니다", retry: "다시 시도",
      overview: "한눈에 보기", stats: "스탯", equipment: "장비", arcana: "아르카나",
      skills: "스킬", activeSkills: "스킬", stigmaSkills: "스티그마", passiveSkills: "패시브",
      collection: "탈것 · 날개 · 타이틀",
      ranking: "랭킹", rankingEyebrow: "NOTMETER PUBLIC RANKING", rankingTitle: "구간별 TOP 20",
      rankingNote: "현재 PVE 장비 전투력이 속한 동일 직업·25K 구간의 TOP 20을 보스별로 표시합니다. 일반 던전은 전체 기간 DPS와 이번 주 nDPS, 악몽은 전투 시간 순위입니다.",
      rankingAllTime: "전체 기간", rankingWeekly: "이번 주",
      rankingLoading: "공개 랭킹을 확인하고 있습니다.",
      rankingEmpty: "현재 PVE 장비 전투력이 속한 동일 직업·25K 구간에 공개 TOP 20 기록이 없습니다.",
      rankingError: "랭킹 정보를 불러오지 못했습니다.", rank: "순위", dungeon: "던전", boss: "보스", dps: "DPS",
      combatPower: "전투력", itemLevel: "아이템 레벨", legion: "레기온", none: "없음",
      updatedAt: "최근 갱신", refreshProfile: "정보 새로고침", refreshingProfile: "갱신 중",
      refreshComplete: "최신 정보로 갱신했습니다.", refreshCooldown: "최근 갱신 후 5분부터 다시 갱신할 수 있습니다.",
      refreshFailed: "공식 정보 갱신에 실패해 기존 정보를 유지합니다.",
      server: "서버", job: "직업", race: "종족", level: "레벨", title: "타이틀",
      coreStats: "주요 스탯", divineStats: "주신 스탯", generalStats: "일반·전투 스탯",
      generalStatsNote: "장착 장비의 공식 옵션·영혼 각인·마석을 합산한 값입니다.",
      equipmentNote: "아이템별 기본 옵션, 영혼 각인, 장착 마석을 같은 행에서 비교할 수 있습니다.",
      soulSummary: "영혼 각인 한눈에 보기", stoneSummary: "마석 한눈에 보기",
      basicOptions: "기본·추가 옵션", soulEngraving: "영혼 각인", manastones: "마석 · 신석",
      stoneTotal: "장착 마석 총합", stoneTotalNote: "모든 착용 장비 기준 · 피해 증폭 계열은 100당 1%로 환산",
      soulSkillTotal: "영혼 각인 스킬 총합", soulSkillTotalNote: "동일 스킬의 증가 레벨을 장비 전체에서 합산",
      soulSkillLevel: "+{value}", equippedItems: "{value}개 장비",
      arcanaSkillTotal: "아르카나 스킬 증가 총합", arcanaSkillTotalNote: "장착 중인 모든 아르카나의 동일 스킬 증가 레벨을 합산",
      arcanaCards: "{value}개 아르카나",
      gearTab: "장비", accessoryTab: "장신구",
      emptyOption: "표시할 옵션 없음", acquired: "습득", notAcquired: "미습득",
      equipped: "장착", ownedTitles: "보유 타이틀", mount: "탈것", wing: "날개",
      wingSkin: "날개 외형", boards: "개 주신", unlocked: "개 노드 개방",
      itemCount: "{value}개", itemCountPair: "{visible} / {total}개",
      statsDescription: "게임에서 익숙한 배치로 주요 스탯과 주신 스탯을 한눈에 확인합니다.",
      arcanaDescription: "장착 중인 아르카나와 강화 수치를 슬롯 순서대로 표시합니다.",
      skillsDescription: "현재 스킬 레벨만 빠르게 비교할 수 있습니다.",
      exceedStage: "돌파 {value}단계", stoneOriginal: "{count}개 · 원본 +{value}",
      stoneCount: "{count}개 마석",
      loadoutTitle: "장비 세팅", loadoutNote: "마지막으로 확인된 PVE·PVP 장비를 비교합니다.",
      pveLoadout: "PVE", pvpLoadout: "PVP", currentLoadout: "현재", unavailableLoadout: "미수집",
      loadoutCapturedAt: "마지막 확인 {value}", unknownLoadout: "현재 장비의 PVE/PVP 구분을 확인할 수 없습니다.",
      equipmentSnapshot: "장비 스냅샷", equipmentSnapshotBusy: "이미지 만드는 중",
      equipmentSnapshotCopied: "이미지를 클립보드에 복사했습니다.",
      equipmentSnapshotDownloaded: "클립보드를 사용할 수 없어 PNG로 저장했습니다.",
      equipmentSnapshotFailed: "장비 스냅샷을 만들지 못했습니다.",
      equipmentSnapshotWaiting: "장비 상세 정보를 모두 불러온 뒤 사용할 수 있습니다.",
      skillSnapshot: "스킬 스냅샷", skillSnapshotFailed: "스킬 스냅샷을 만들지 못했습니다.",
      arcanaSnapshot: "아르카나 스냅샷", arcanaSnapshotFailed: "아르카나 스냅샷을 만들지 못했습니다.",
      characterSnapshotBusy: "이미지 만드는 중", characterSnapshotCopied: "이미지를 클립보드에 복사했습니다.",
      characterSnapshotDownloaded: "클립보드를 사용할 수 없어 PNG로 저장했습니다.",
      snapshotKicker: "NOTMETER · EQUIPMENT SNAPSHOT", snapshotSoulSkills: "영혼 각인 스킬",
      snapshotSoulSkillsNote: "장착 장비 전체의 동일 스킬 증가 레벨 합계",
      snapshotManastones: "장착 마석 총수치", snapshotManastonesNote: "현재 세팅에 장착된 마석 합계",
      snapshotItemSoul: "각인", snapshotItemStones: "마석",
      snapshotSkillKicker: "NOTMETER · SKILL SNAPSHOT", snapshotSkillTotal: "총 레벨 {value}",
      snapshotSkillCount: "{value}개 스킬", snapshotSkillGrandTotal: "전체 스킬 총레벨",
      snapshotArcanaKicker: "NOTMETER · ARCANA SNAPSHOT", snapshotArcanaGrandTotal: "아르카나 스킬 총레벨",
      snapshotArcanaSkills: "아르카나 스킬 총레벨", snapshotArcanaSkillsNote: "같은 스킬의 증가 레벨을 모든 장착 카드에서 합산",
      snapshotArcanaStats: "아르카나 스탯 총합", snapshotArcanaStatsNote: "모든 장착 카드의 기본 수치와 강화 수치를 합산",
      snapshotArcanaStatBreakdown: "기본 {base} + 강화 {extra}", snapshotArcanaStatCards: "{value}개 카드",
      snapshotFooter: "현재 선택한 {loadout} 세팅 · 아이온2 공식 공개 정보 기준",
      officialNote: "캐릭터 정보는 아이온2 공식 공개 정보 기준이며, 게임 내 정보 공개 상태와 갱신 시점에 따라 일부 항목이 비어 있을 수 있습니다.",
    },
    en: {
      searchKicker: "CHARACTER LOOKUP", searchTitle: "Character Search",
      searchDescription: "View gear, skills, and rankings by character name",
      searchRegion: "Search region", regionKr: "Korea", regionTw: "Taiwan", regionGlobal: "Global",
      comingSoon: "Coming soon",
      globalSearchGuide: "Global search shows level 45 characters only.",
      globalRegionLabel: "Global region",
      globalServerLabel: "Server",
      globalAllServers: "All servers",
      globalServersLoading: "Loading servers",
      globalServersError: "Could not load the server list. You can still search all servers.",
      globalResults: "Results · Exact name · Highest CP first · Level 45 only",
      globalDescription: "Look up current gear and skills by character name",
      placeholder: "Enter a character name", search: "Search", saved: "Favorites · Recent",
      favorites: "Favorites", recent: "Recent", recentGuide: "Favorites stay pinned · Up to 10 recent characters",
      addFavorite: "Add to favorites", removeFavorite: "Remove from favorites", deleteRecent: "Remove from recent",
      results: "Results · Exact name · Highest CP first · Level 50 only",
      searchAll: "All", searchElyos: "Elyos", searchAsmodian: "Asmodian", searchRaceFilter: "Race filter",
      searching: "Searching official character data", sortingCp: "Checking CP and sorting automatically",
      cpPending: "Checking", noRecent: "No recent characters.",
      noResults: "No characters found.", searchError: "No search response received. Please try again shortly.",
      searchSlow: "Search is taking longer. You can search for another name.",
      searchPending: "Additional information is delayed. Please search again shortly.",
      invalidName: "Enter a character name.", pageTitle: "NotMeter Character Profile",
      pageSubtitle: "Gear · Soul Bind · Manastones · Skills", heading: "Character profile",
      headingDescription: "Compare gear options, Soul Bind, and manastones in one view.",
      back: "Back to rankings", loading: "Loading official character data",
      loadingSub: "Checking Soul Bind effects and manastones.", loadError: "Could not load this character",
      loadingDetails: "Loading detailed gear options",
      retry: "Retry", overview: "Overview", stats: "Stats", equipment: "Equipment",
      arcana: "Arcana", skills: "Skills", activeSkills: "Skills", stigmaSkills: "Stigma", passiveSkills: "Passive",
      collection: "Mount · Wings · Titles",
      ranking: "Ranking", rankingEyebrow: "NOTMETER PUBLIC RANKING", rankingTitle: "Top 20 by CP bracket",
      rankingNote: "Shows Top 20 records by boss for the same class and 25K bracket as the current PVE loadout. Regular dungeons use all-time DPS and current-week nDPS; Nightmare uses combat time.",
      rankingAllTime: "All-time", rankingWeekly: "This week",
      rankingLoading: "Checking public rankings.", rankingEmpty: "No public Top 20 record was found for the same class and 25K bracket as the current PVE loadout.",
      rankingError: "Could not load ranking data.", rank: "Rank", dungeon: "Dungeon", boss: "Boss", dps: "DPS",
      combatPower: "Combat Power", itemLevel: "Item Level", legion: "Legion", none: "None",
      updatedAt: "Last updated", refreshProfile: "Refresh profile", refreshingProfile: "Refreshing",
      refreshComplete: "Profile refreshed.", refreshCooldown: "You can refresh again five minutes after the last update.",
      refreshFailed: "Refresh failed. The cached profile is still displayed.",
      server: "Server", job: "Class", race: "Race", level: "Level", title: "Title",
      coreStats: "Core stats", divineStats: "Divine stats", generalStats: "Combat stats",
      generalStatsNote: "Totals from official equipped item options, Soul Bind effects, and manastones.",
      equipmentNote: "Compare base options, Soul Bind, and socketed stones on one row.",
      soulSummary: "Soul Bind summary", stoneSummary: "Manastone summary",
      basicOptions: "Base & bonus options", soulEngraving: "Soul Bind", manastones: "Manastone · Theostone",
      stoneTotal: "Equipped manastone totals", stoneTotalNote: "All equipped gear · Damage Boost converts at 100 = 1%",
      soulSkillTotal: "Soul Bind skill totals", soulSkillTotalNote: "Combined skill levels across all equipped gear",
      soulSkillLevel: "+{value}", equippedItems: "{value} items",
      arcanaSkillTotal: "Arcana skill level totals", arcanaSkillTotalNote: "Combined skill level increases across all equipped Arcana",
      arcanaCards: "{value} Arcana",
      gearTab: "Gear", accessoryTab: "Accessories",
      emptyOption: "No visible option", acquired: "Acquired", notAcquired: "Not acquired",
      equipped: "Equipped", ownedTitles: "Owned titles", mount: "Mount", wing: "Wings",
      wingSkin: "Wing skin", boards: " boards", unlocked: " nodes open",
      itemCount: "{value}", itemCountPair: "{visible} / {total}",
      statsDescription: "See core and divine stats in the same familiar layout as the game.",
      arcanaDescription: "Equipped Arcana and enhancement levels in slot order.",
      skillsDescription: "Quickly compare current skill levels.",
      exceedStage: "Breakthrough stage {value}", stoneOriginal: "{count} · raw +{value}",
      stoneCount: "{count} manastones",
      loadoutTitle: "Gear loadouts", loadoutNote: "Compare the latest detected PVE and PVP equipment.",
      pveLoadout: "PVE", pvpLoadout: "PVP", currentLoadout: "Current", unavailableLoadout: "Not captured",
      loadoutCapturedAt: "Last detected {value}", unknownLoadout: "The current equipment could not be classified as PVE or PVP.",
      equipmentSnapshot: "Gear snapshot", equipmentSnapshotBusy: "Creating image",
      equipmentSnapshotCopied: "Image copied to the clipboard.",
      equipmentSnapshotDownloaded: "Clipboard unavailable. The PNG was downloaded instead.",
      equipmentSnapshotFailed: "Could not create the gear snapshot.",
      equipmentSnapshotWaiting: "Available after all equipment details finish loading.",
      skillSnapshot: "Skill snapshot", skillSnapshotFailed: "Could not create the skill snapshot.",
      arcanaSnapshot: "Arcana snapshot", arcanaSnapshotFailed: "Could not create the Arcana snapshot.",
      characterSnapshotBusy: "Creating image", characterSnapshotCopied: "Image copied to the clipboard.",
      characterSnapshotDownloaded: "Clipboard unavailable. The PNG was downloaded instead.",
      snapshotKicker: "NOTMETER · EQUIPMENT SNAPSHOT", snapshotSoulSkills: "Soul Bind skills",
      snapshotSoulSkillsNote: "Combined skill levels across all equipped items",
      snapshotManastones: "Equipped manastone totals", snapshotManastonesNote: "Totals for the selected loadout",
      snapshotItemSoul: "Soul Bind", snapshotItemStones: "Manastone",
      snapshotSkillKicker: "NOTMETER · SKILL SNAPSHOT", snapshotSkillTotal: "Total levels {value}",
      snapshotSkillCount: "{value} skills", snapshotSkillGrandTotal: "Total skill levels",
      snapshotArcanaKicker: "NOTMETER · ARCANA SNAPSHOT", snapshotArcanaGrandTotal: "Total Arcana skill levels",
      snapshotArcanaSkills: "Arcana skill level totals", snapshotArcanaSkillsNote: "Combined increases for matching skills across equipped cards",
      snapshotArcanaStats: "Arcana stat totals", snapshotArcanaStatsNote: "Combined base and enhancement values across equipped cards",
      snapshotArcanaStatBreakdown: "Base {base} + Enhance {extra}", snapshotArcanaStatCards: "{value} cards",
      snapshotFooter: "Selected {loadout} loadout · AION2 official public profile",
      officialNote: "Character data comes from AION2's official public profile. Some fields can be empty depending on visibility and refresh time.",
    },
    "zh-TW": {
      searchKicker: "CHARACTER LOOKUP", searchTitle: "角色搜尋",
      searchDescription: "輸入角色名稱，快速查看裝備、技能與排名",
      searchRegion: "搜尋地區", regionKr: "韓國", regionTw: "台灣", regionGlobal: "全球",
      comingSoon: "即將推出",
      globalSearchGuide: "全球服僅顯示 45 級角色。",
      globalRegionLabel: "全球服地區",
      globalServerLabel: "伺服器",
      globalAllServers: "全部伺服器",
      globalServersLoading: "正在載入伺服器",
      globalServersError: "無法載入伺服器清單，仍可搜尋所有伺服器。",
      globalResults: "搜尋結果 · 名稱完全相符 · 戰力由高至低 · 僅限 45 級",
      globalDescription: "輸入角色名稱，查看目前的裝備與技能",
      placeholder: "輸入角色名稱", search: "搜尋", saved: "我的最愛 · 最近搜尋",
      favorites: "我的最愛", recent: "最近搜尋", recentGuide: "我的最愛固定顯示 · 最近搜尋最多 10 個",
      addFavorite: "加入我的最愛", removeFavorite: "從我的最愛移除", deleteRecent: "從最近搜尋刪除",
      results: "搜尋結果 · 名稱完全相符 · 戰鬥力由高至低 · 僅顯示 50 級", searching: "正在搜尋官方角色資料",
      sortingCp: "正在確認戰鬥力並自動排序", cpPending: "確認中", noRecent: "沒有最近搜尋角色。",
      searchAll: "全部", searchElyos: "天族", searchAsmodian: "魔族", searchRaceFilter: "種族篩選",
      noResults: "找不到角色。", searchError: "尚未收到搜尋回應，請稍後重新搜尋。", invalidName: "請輸入角色名稱。",
      searchSlow: "搜尋時間較長，您可以搜尋其他角色名稱。",
      searchPending: "尚未收到其他資料，請稍後重新搜尋。",
      pageTitle: "NotMeter 角色資料", pageSubtitle: "裝備 · 靈魂刻印 · 魔石 · 技能", heading: "角色資料",
      headingDescription: "在同一畫面比較裝備選項、靈魂刻印與魔石。", back: "返回排名",
      loading: "正在載入官方角色資料", loadingSub: "正在確認各裝備的靈魂刻印與魔石。",
      loadingDetails: "正在快速載入裝備詳細選項",
      loadError: "無法載入角色資料", retry: "重試", overview: "總覽", stats: "屬性",
      equipment: "裝備", arcana: "阿爾卡納", skills: "技能", activeSkills: "技能", stigmaSkills: "烙印技能",
      passiveSkills: "被動技能",
      ranking: "排名", rankingEyebrow: "NOTMETER PUBLIC RANKING", rankingTitle: "區間 TOP 20",
      rankingNote: "依目前 PVE 裝備戰鬥力所屬的同職業 25K 區間，按首領顯示 TOP 20。一般副本採全期間 DPS 與本週 nDPS；惡夢採戰鬥時間。",
      rankingAllTime: "全部期間", rankingWeekly: "本週",
      rankingLoading: "正在確認公開排名。", rankingEmpty: "目前 PVE 裝備戰鬥力所屬的同職業 25K 區間，沒有公開暱稱的 TOP 20 紀錄。",
      rankingError: "無法載入排名資料。", rank: "名次", dungeon: "副本", boss: "首領", dps: "DPS",
      collection: "坐騎 · 翅膀 · 稱號", combatPower: "戰鬥力", itemLevel: "道具等級",
      updatedAt: "最近更新", refreshProfile: "更新資料", refreshingProfile: "更新中",
      refreshComplete: "已更新為最新資料。", refreshCooldown: "最近更新五分鐘後可再次更新。",
      refreshFailed: "官方資料更新失敗，將繼續顯示快取資料。",
      legion: "軍團", none: "無", server: "伺服器", job: "職業", race: "種族", level: "等級",
      title: "稱號", coreStats: "主要屬性", divineStats: "主神屬性", generalStats: "一般·戰鬥屬性",
      generalStatsNote: "合計官方已裝備道具的選項、靈魂刻印與魔石。", equipmentNote: "同列比較基本選項、靈魂刻印與已鑲嵌魔石。",
      soulSummary: "靈魂刻印總覽", stoneSummary: "魔石總覽", basicOptions: "基本·追加選項",
      soulEngraving: "靈魂刻印", manastones: "魔石 · 神石", stoneTotal: "已裝備魔石合計",
      stoneTotalNote: "所有已裝備道具 · 傷害增幅以 100 = 1% 換算", emptyOption: "無可顯示選項",
      soulSkillTotal: "靈魂刻印技能合計", soulSkillTotalNote: "合計所有已裝備道具的相同技能等級",
      soulSkillLevel: "+{value}", equippedItems: "{value}件裝備",
      arcanaSkillTotal: "阿爾卡納技能提升合計", arcanaSkillTotalNote: "合計所有已裝備阿爾卡納的相同技能提升等級",
      arcanaCards: "{value}個阿爾卡納",
      gearTab: "裝備", accessoryTab: "飾品",
      acquired: "已學習", notAcquired: "未學習", equipped: "裝備中", ownedTitles: "持有稱號",
      mount: "坐騎", wing: "翅膀", wingSkin: "翅膀外觀", boards: " 個主神",
      unlocked: " 個節點開放", itemCount: "{value}個", itemCountPair: "{visible} / {total}個",
      statsDescription: "以遊戲中熟悉的配置，一覽主要屬性與主神屬性。",
      arcanaDescription: "依欄位順序顯示已裝備的阿爾卡納與強化數值。",
      skillsDescription: "快速比較目前技能等級。",
      exceedStage: "突破 {value}階段", stoneOriginal: "{count}個 · 原始 +{value}",
      stoneCount: "{count}個魔石",
      loadoutTitle: "裝備配置", loadoutNote: "比較最後確認的 PVE 與 PVP 裝備。",
      pveLoadout: "PVE", pvpLoadout: "PVP", currentLoadout: "目前", unavailableLoadout: "尚未收集",
      loadoutCapturedAt: "最後確認 {value}", unknownLoadout: "目前裝備無法判定為 PVE 或 PVP。",
      equipmentSnapshot: "裝備快照", equipmentSnapshotBusy: "正在建立圖片",
      equipmentSnapshotCopied: "圖片已複製到剪貼簿。",
      equipmentSnapshotDownloaded: "無法使用剪貼簿，已改為下載 PNG。",
      equipmentSnapshotFailed: "無法建立裝備快照。",
      equipmentSnapshotWaiting: "裝備詳細資料全部載入後即可使用。",
      skillSnapshot: "技能快照", skillSnapshotFailed: "無法建立技能快照。",
      arcanaSnapshot: "阿爾卡納快照", arcanaSnapshotFailed: "無法建立阿爾卡納快照。",
      characterSnapshotBusy: "正在建立圖片", characterSnapshotCopied: "圖片已複製到剪貼簿。",
      characterSnapshotDownloaded: "無法使用剪貼簿，已改為下載 PNG。",
      snapshotKicker: "NOTMETER · EQUIPMENT SNAPSHOT", snapshotSoulSkills: "靈魂刻印技能",
      snapshotSoulSkillsNote: "合計所有已裝備道具的相同技能等級",
      snapshotManastones: "已裝備魔石總數值", snapshotManastonesNote: "目前配置的已鑲嵌魔石合計",
      snapshotItemSoul: "刻印", snapshotItemStones: "魔石",
      snapshotSkillKicker: "NOTMETER · SKILL SNAPSHOT", snapshotSkillTotal: "總等級 {value}",
      snapshotSkillCount: "{value}個技能", snapshotSkillGrandTotal: "全部技能總等級",
      snapshotArcanaKicker: "NOTMETER · ARCANA SNAPSHOT", snapshotArcanaGrandTotal: "阿爾卡納技能總等級",
      snapshotArcanaSkills: "阿爾卡納技能總等級", snapshotArcanaSkillsNote: "合計所有已裝備卡片的相同技能提升等級",
      snapshotArcanaStats: "阿爾卡納屬性總合", snapshotArcanaStatsNote: "合計所有已裝備卡片的基本與強化數值",
      snapshotArcanaStatBreakdown: "基本 {base} + 強化 {extra}", snapshotArcanaStatCards: "{value}張卡片",
      snapshotFooter: "目前選擇的 {loadout} 配置 · AION2 官方公開資料",
      officialNote: "角色資料以 AION2 官方公開資料為準；依公開設定與更新時間，部分項目可能為空白。",
    },
  };

  globalThis.NotMeterI18n?.extend(COPY, "character");

  const searchScopeCopy = {
    ko: ["캐릭터 검색 전용", "검색할 캐릭터의 지역", "글로벌"],
    en: ["Character search only", "Character region to search", "Global"],
    "zh-TW": ["僅用於角色搜尋", "角色搜尋地區", "全球"],
    "ja-JP": ["キャラクター検索専用", "検索するキャラクターの地域", "グローバル"],
    "de-DE": ["Nur für die Charaktersuche", "Region des gesuchten Charakters", "Global"],
    "fr-FR": ["Recherche de personnages uniquement", "Région du personnage recherché", "Global"],
    "es-ES": ["Solo para buscar personajes", "Región del personaje", "Global"],
    "pt-BR": ["Apenas para buscar personagens", "Região do personagem", "Global"],
    "ru-RU": ["Только для поиска персонажей", "Регион искомого персонажа", "Глобальный"],
  };
  for (const [locale, [searchScopeNote, searchScopeLabel, searchGlobalLabel]] of Object.entries(searchScopeCopy))
    Object.assign(COPY[locale] ||= {}, { searchScopeNote, searchScopeLabel, searchGlobalLabel });

  const serverPickerCopy = {
    ko: ["서버 필터", "서버명 또는 초성 검색", "일치하는 서버가 없습니다.", "전체 서버로 검색", "서버 선택 닫기", "서버 {count}개", "서버를 몰라도 검색할 수 있어요. 선택한 지역의 전체 서버에서 45레벨 캐릭터를 찾습니다."],
    en: ["Server filter", "Search servers by name", "No matching servers.", "Search all servers", "Close server picker", "{count} servers", "No need to choose a server. Search level 45 characters across all servers in your selected region."],
    "zh-TW": ["伺服器篩選", "搜尋伺服器名稱", "沒有符合的伺服器。", "搜尋全部伺服器", "關閉伺服器選單", "{count} 個伺服器", "不必指定伺服器，即可搜尋所選地區全部伺服器的 45 級角色。"],
    "ja-JP": ["サーバー絞り込み", "サーバー名で検索", "一致するサーバーがありません。", "全サーバーを検索", "サーバー選択を閉じる", "{count} サーバー", "サーバーを選ばなくても検索できます。選択した地域の全サーバーからレベル45のキャラクターを検索します。"],
    "de-DE": ["Serverfilter", "Server nach Namen suchen", "Keine passenden Server.", "Alle Server durchsuchen", "Serverauswahl schließen", "{count} Server", "Du musst keinen Server auswählen. Suche Charaktere auf Stufe 45 auf allen Servern der gewählten Region."],
    "fr-FR": ["Filtre de serveur", "Rechercher un serveur par nom", "Aucun serveur correspondant.", "Rechercher sur tous les serveurs", "Fermer la sélection du serveur", "{count} serveurs", "Pas besoin de choisir un serveur. Recherchez les personnages de niveau 45 sur tous les serveurs de la région sélectionnée."],
    "es-ES": ["Filtro de servidor", "Buscar servidor por nombre", "No hay servidores coincidentes.", "Buscar en todos los servidores", "Cerrar selección de servidor", "{count} servidores", "No necesitas elegir un servidor. Busca personajes de nivel 45 en todos los servidores de la región seleccionada."],
    "pt-BR": ["Filtro de servidor", "Buscar servidor pelo nome", "Nenhum servidor correspondente.", "Buscar em todos os servidores", "Fechar seleção de servidor", "{count} servidores", "Não é preciso escolher um servidor. Busque personagens de nível 45 em todos os servidores da região selecionada."],
    "ru-RU": ["Фильтр серверов", "Поиск сервера по названию", "Подходящие серверы не найдены.", "Искать на всех серверах", "Закрыть выбор сервера", "Серверов: {count}", "Выбирать сервер необязательно. Поиск персонажей 45-го уровня охватывает все серверы выбранного региона."],
  };
  for (const [locale, values] of Object.entries(serverPickerCopy)) {
    Object.assign(COPY[locale] ||= {}, Object.fromEntries(
      ["serverFilter", "serverSearch", "serverNoMatch", "serverReset", "serverClose", "serverCount", "globalAllServersGuide"].map((key, index) => [key, values[index]])));
  }

  const globalRankingCopy = {
    ko: ["Global · TOP 50", "전체 기간과 이번 주의 보스별 DPS 순위를 각각 표시합니다. 글로벌 전 지역의 동일 직업을 통합하며, CP 구간 없이 공개된 TOP 50 기록만 표시합니다.", "이 캐릭터는 해당 기간에 공개된 글로벌 TOP 50 기록이 없습니다.", "글로벌 랭킹을 준비 중입니다. 게시되면 표시됩니다.", "이번 주 글로벌 랭킹을 집계 중입니다. 새 랭킹이 게시되면 표시됩니다."],
    en: ["Global · TOP 50", "All-time and current-week DPS ranks are shown separately for each boss. Rankings include the same class across all Global regions, with no CP brackets. Only published TOP 50 records are shown.", "This character has no published Global TOP 50 records for this period.", "Global rankings are being prepared. Results will appear once published.", "This week’s Global rankings are being prepared. Results will appear once published."],
    "zh-TW": ["Global · TOP 50", "分別顯示各首領的歷史與本週 DPS 名次。合併全球服所有地區的同職業，不分 CP 區間，僅顯示已公布的 TOP 50 紀錄。", "此角色在此期間沒有已公布的全球服 TOP 50 紀錄。", "全球服排名準備中，公布後將顯示結果。", "本週全球服排名統計中，公布後將顯示結果。"],
    "ja-JP": ["Global · TOP 50", "全期間と今週のDPS順位をボス別に分けて表示します。グローバルの全地域の同クラスを対象に、CP帯で区分せず、公開済みのTOP 50の記録のみを表示します。", "このキャラクターには、この期間のグローバルTOP 50に公開済みの記録がありません。", "グローバルランキングを準備中です。公開されると結果が表示されます。", "今週のグローバルランキングを集計中です。公開されると結果が表示されます。"],
    "de-DE": ["Global · TOP 50", "DPS-Ränge pro Boss werden für den gesamten Zeitraum und die aktuelle Woche getrennt angezeigt. Die Ranglisten umfassen dieselbe Klasse aus allen globalen Regionen, ohne CP-Gruppen. Es werden nur veröffentlichte TOP-50-Ergebnisse angezeigt.", "Für diesen Charakter gibt es in diesem Zeitraum keine veröffentlichten globalen TOP-50-Ergebnisse.", "Die globalen Ranglisten werden vorbereitet. Die Ergebnisse erscheinen nach der Veröffentlichung.", "Die globalen Ranglisten dieser Woche werden vorbereitet. Die Ergebnisse erscheinen nach der Veröffentlichung."],
    "fr-FR": ["Global · TOP 50", "Les rangs DPS par boss sont présentés séparément pour toutes les périodes et pour la semaine en cours. Ils regroupent les joueurs de la même classe de toutes les régions mondiales, sans tranches de CP. Seuls les résultats publiés du TOP 50 sont affichés.", "Ce personnage n’a aucun résultat publié dans le TOP 50 mondial pour cette période.", "Le classement mondial est en cours de préparation. Les résultats apparaîtront après publication.", "Le classement mondial de cette semaine est en cours de préparation. Les résultats apparaîtront après publication."],
    "es-ES": ["Global · TOP 50", "Los puestos de DPS por jefe se muestran por separado para todo el historial y la semana actual. Incluyen la misma clase de todas las regiones globales, sin franjas de CP. Solo se muestran resultados publicados del TOP 50.", "Este personaje no tiene resultados publicados en el TOP 50 global para este período.", "Se está preparando la clasificación global. Los resultados aparecerán cuando se publiquen.", "Se está preparando la clasificación global de esta semana. Los resultados aparecerán cuando se publiquen."],
    "pt-BR": ["Global · TOP 50", "As posições de DPS por chefe são exibidas separadamente para todo o período e para a semana atual. Incluem a mesma classe de todas as regiões globais, sem faixas de CP. Apenas resultados publicados do TOP 50 são exibidos.", "Este personagem não tem resultados publicados no TOP 50 global neste período.", "O ranking global está sendo preparado. Os resultados aparecerão após a publicação.", "O ranking global desta semana está sendo preparado. Os resultados aparecerão após a publicação."],
    "ru-RU": ["Global · ТОП-50", "Места по DPS для каждого босса показаны отдельно за всё время и за текущую неделю. Учитываются игроки того же класса из всех глобальных регионов, без разделения по CP. Отображаются только опубликованные результаты ТОП-50.", "У этого персонажа нет опубликованных результатов в глобальном ТОП-50 за этот период.", "Глобальный рейтинг готовится. Результаты появятся после публикации.", "Глобальный рейтинг этой недели готовится. Результаты появятся после публикации."],
  };
  for (const [locale, [globalRankingTitle, globalRankingNote, globalRankingEmpty, globalRankingPending, globalRankingWeeklyPending]] of Object.entries(globalRankingCopy)) {
    Object.assign(COPY[locale] ||= {}, { globalRankingTitle, globalRankingNote, globalRankingEmpty, globalRankingPending, globalRankingWeeklyPending });
  }

  const rankingLayoutCopy = {
    ko: ["랭킹 기록", "CP 구간", "현재 PVE 장비와 같은 직업 · 25K CP 구간의 TOP 20 기록입니다.", "일반 던전은 전체 기간 DPS · 이번 주 nDPS, 악몽은 처치시간 기준입니다.", "글로벌 전 지역의 동일 직업 TOP 50입니다. 전체 기간과 이번 주를 구분하며 CP 구간은 나누지 않습니다."],
    en: ["Ranking records", "CP bracket", "Top 20 for the same class and 25K CP bracket as your current PVE setup.", "Dungeons: all-time DPS / weekly nDPS. Nightmare: clear time.", "Top 50 for the same class across all Global regions, with no CP brackets. All-time and this week are shown separately."],
    "zh-TW": ["排名紀錄", "CP 區間", "目前 PVE 裝備所屬的同職業、25K CP 區間 TOP 20 紀錄。", "一般副本採全期間 DPS／本週 nDPS；惡夢採通關時間。", "合併全球服所有地區的同職業 TOP 50，不分 CP 區間。全期間與本週分開顯示。"],
    "ja-JP": ["ランキング記録", "CP帯", "現在のPVE装備と同じクラス・25K CP帯のTOP 20記録です。", "通常ダンジョンは全期間DPS・今週nDPS、悪夢は討伐時間を基準にしています。", "グローバル全地域の同クラスTOP 50です。CP帯は区分せず、全期間と今週を分けて表示します。"],
    "de-DE": ["Ranglisteneinträge", "CP-Bereich", "Top 20 derselben Klasse im 25K-CP-Bereich deiner aktuellen PvE-Ausrüstung.", "Dungeons: DPS für alle Zeiten / wöchentliche nDPS. Albtraum: Besiegungszeit.", "Top 50 derselben Klasse aus allen globalen Regionen, ohne CP-Bereiche. Alle Zeiten und diese Woche werden getrennt angezeigt."],
    "fr-FR": ["Résultats classés", "Tranche de CP", "Top 20 de la même classe et de la tranche de 25K CP de votre équipement JcE actuel.", "Donjons : DPS toutes périodes / nDPS hebdomadaire. Cauchemar : temps pour vaincre le boss.", "Top 50 de la même classe dans toutes les régions mondiales, sans tranches de CP. Toutes périodes et cette semaine sont présentées séparément."],
    "es-ES": ["Registros de clasificación", "Franja de CP", "Top 20 de la misma clase y franja de 25K CP que tu equipo JcE actual.", "Mazmorras: DPS histórico / nDPS semanal. Pesadilla: tiempo para derrotar al jefe.", "Top 50 de la misma clase en todas las regiones globales, sin franjas de CP. El historial y esta semana se muestran por separado."],
    "pt-BR": ["Registros do ranking", "Faixa de CP", "Top 20 da mesma classe e faixa de 25K CP do seu equipamento JxA atual.", "Masmorras: DPS de todo o período / nDPS semanal. Pesadelo: tempo para derrotar o chefe.", "Top 50 da mesma classe em todas as regiões globais, sem faixas de CP. Todo o período e esta semana são exibidos separadamente."],
    "ru-RU": ["Результаты в рейтинге", "Диапазон CP", "Топ-20 того же класса в диапазоне 25K CP вашего текущего PvE-снаряжения.", "Подземелья: DPS за всё время / nDPS за неделю. Кошмар: время победы над боссом.", "Топ-50 того же класса во всех глобальных регионах, без разделения по CP. Всё время и текущая неделя показаны отдельно."],
  };
  for (const [locale, values] of Object.entries(rankingLayoutCopy)) {
    Object.assign(COPY[locale] ||= {}, Object.fromEntries(
      ["rankingRecords", "rankingCpBracket", "rankingScopeNote", "rankingMetricNote", "rankingGlobalScopeNote"].map((key, index) => [key, values[index]])));
  }
  for (const [locale, value] of Object.entries({
    ko: "갱신 대기", en: "Awaiting update", "zh-TW": "等待更新", "ja-JP": "更新待ち",
    "de-DE": "Aktualisierung ausstehend", "fr-FR": "Mise à jour en attente", "es-ES": "Actualización pendiente",
    "pt-BR": "Aguardando atualização", "ru-RU": "Ожидание обновления",
  })) COPY[locale].rankingAwaitingUpdate = value;

  const state = {
    locale: readLocale(), searchRegion: readSearchRegion(readLocale()), searchResults: [], searchRace: "all", searchComplete: true,
    searchRequest: 0, searchTask: null, searchKey: "", profile: null, profileLoad: null, profileRequest: 0,
    profileRenderSignature: "",
    globalRegion: readGlobalRegion(), globalServerId: "", globalServers: [], globalServersLoaded: "", globalServersLoading: "", globalServersError: false, globalServersRequest: 0,
    globalServerQuery: "", globalServerRace: "all",
    rankingKey: "", rankingStatus: "idle", rankingRows: [], rankingLoad: null, rankingPeriod: "weekly",
    traits: { status: "idle", row: null, flags: new Map(), load: null },
    skillBuilds: null,
    activeLoadout: null, activeEquipmentTab: "gear",
    officialNameCatalog: null, officialNameCatalogLoad: null, koreanNamesByTraditionalChinese: null,
    englishNameCatalog: null, englishNameCatalogLoad: null,
  };
  const elements = {};

  document.addEventListener("DOMContentLoaded", () => {
    bindElements();
    bindEvents();
    applyCopy();
    void ensureOfficialNameCatalog().then(refreshLocalizedContent);
    if (isCharacterView()) activate();
    window.addEventListener("notmeter-global-ranking-change", () => {
      if (!isCharacterView() || currentOfficialRegion() !== "ww" || !state.profile ||
          globalThis.NotMeterGlobalRanking?.state.loading) return;
      const section = document.getElementById("character-rankings");
      if (!section) return;
      state.rankingStatus = "idle";
      section.replaceWith(renderCharacterRankings(state.profile));
    });
  });

  function bindElements() {
    for (const id of [
      "character-search-form", "character-search-input", "character-search-submit",
      "character-search-kicker", "character-search-title", "character-search-description",
      "character-search-scope-note",
      "character-search-regions", "character-search-region-label", "character-search-region-note",
      "character-global-filters", "character-global-region", "character-global-server",
      "character-global-region-label", "character-global-server-label", "character-global-retry",
      "character-global-server-value", "character-global-server-reset", "character-server-picker",
      "character-server-query", "character-server-close", "character-server-races",
      "character-server-all", "character-server-options", "character-server-status",
      "character-search-popover", "character-search-popover-title", "character-search-status",
      "character-search-results", "character-search-race-filters", "character-surface", "character-page-title",
      "character-page-description", "character-back-button", "character-loading-state",
      "character-error-state", "character-error-title", "character-error-message",
      "character-retry-button", "character-profile-content",
    ]) elements[id] = document.getElementById(id);
  }

  function bindEvents() {
    elements["character-global-server"]?.addEventListener("click", () => setServerPickerOpen(elements["character-server-picker"].hidden));
    elements["character-global-server-reset"]?.addEventListener("click", () => selectGlobalServer(""));
    elements["character-server-close"]?.addEventListener("click", () => setServerPickerOpen(false, true));
    elements["character-server-all"]?.addEventListener("click", () => selectGlobalServer(""));
    elements["character-server-query"]?.addEventListener("input", event => {
      state.globalServerQuery = event.target.value;
      renderServerOptions();
    });
    elements["character-server-races"]?.addEventListener("click", event => {
      const button = event.target.closest("[data-server-race]");
      if (!button) return;
      state.globalServerRace = button.dataset.serverRace;
      renderServerOptions();
    });
    elements["character-server-picker"]?.addEventListener("keydown", handleServerPickerKey);
    elements["character-server-picker"]?.addEventListener("focusout", event => {
      if (event.relatedTarget && !event.currentTarget.closest(".character-server-field").contains(event.relatedTarget)) setServerPickerOpen(false);
    });
    window.addEventListener?.("resize", positionServerPicker);
    window.visualViewport?.addEventListener("resize", positionServerPicker);
    elements["character-global-retry"]?.addEventListener("click", () => void loadGlobalServers(true));
    elements["character-search-regions"]?.addEventListener("change", event => {
      const input = event.target.closest("[data-character-region]");
      if (!input?.checked) return;
      if (input.dataset.characterGlobalRegion) selectGlobalSearchRegion(input.dataset.characterGlobalRegion);
      else selectSearchRegion(input.dataset.characterRegion);
    });
    elements["character-search-form"]?.addEventListener("submit", event => {
      event.preventDefault();
      void search(elements["character-search-input"].value);
    });
    elements["character-search-input"]?.addEventListener("focus", () => {
      setServerPickerOpen(false);
      const query = elements["character-search-input"].value.trim();
      if (query && state.searchResults.length) renderSearchRows(state.searchResults, false);
      else if (!state.searchTask) renderRecent();
      setPopover(true);
      void ensureOfficialNameCatalog().then(refreshLocalizedContent);
    });
    elements["character-search-input"]?.addEventListener("input", () => {
      cancelSearch();
      state.searchKey = "";
      state.searchResults = [];
      state.searchComplete = true;
      renderRecent();
    });
    elements["character-search-race-filters"]?.addEventListener("click", event => {
      const button = event.target.closest("[data-search-race]");
      if (!button) return;
      state.searchRace = button.dataset.searchRace || "all";
      renderSearchRows(state.searchResults, false);
    });
    elements["character-retry-button"]?.addEventListener("click", () => void loadProfile(true, false));
    document.addEventListener("pointerdown", event => {
      if (!event.target.closest("#global-character-search")) setPopover(false);
      if (!event.target.closest(".character-server-field")) setServerPickerOpen(false);
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") setPopover(false);
    });
  }

  function applyCopy() {
    const copy = currentCopy();
    document.getElementById("global-character-search")?.setAttribute("aria-label", copy.searchTitle);
    const searchLabel = document.querySelector('label[for="character-search-input"]');
    if (searchLabel) searchLabel.textContent = copy.placeholder;
    if (elements["character-search-kicker"]) elements["character-search-kicker"].textContent = copy.searchKicker;
    if (elements["character-search-title"]) elements["character-search-title"].textContent = copy.searchTitle;
    if (elements["character-search-scope-note"]) elements["character-search-scope-note"].textContent = copy.searchScopeNote;
    if (elements["character-search-description"]) elements["character-search-description"].textContent = copy.searchDescription;
    elements["character-search-input"]?.setAttribute("placeholder", copy.placeholder);
    if (elements["character-search-submit"]) elements["character-search-submit"].textContent = copy.search;
    renderSearchRegion();
    const raceFilters = elements["character-search-race-filters"];
    if (raceFilters) {
      raceFilters.setAttribute("aria-label", copy.searchRaceFilter);
      const labels = { all: copy.searchAll, elyos: copy.searchElyos, asmodian: copy.searchAsmodian };
      for (const button of raceFilters.querySelectorAll("[data-search-race]")) {
        button.textContent = labels[button.dataset.searchRace] || copy.searchAll;
      }
    }
    if (elements["character-page-title"]) elements["character-page-title"].textContent = copy.heading;
    if (elements["character-page-description"]) elements["character-page-description"].textContent = copy.headingDescription;
    const backLabel = elements["character-back-button"]?.querySelector("span:last-child");
    if (backLabel) backLabel.textContent = copy.back;
    if (elements["character-error-title"]) elements["character-error-title"].textContent = copy.loadError;
    if (elements["character-retry-button"]) elements["character-retry-button"].textContent = copy.retry;
    const loading = elements["character-loading-state"];
    if (loading) {
      const strong = loading.querySelector("strong");
      const span = loading.querySelector("span");
      if (strong) strong.textContent = copy.loading;
      if (span) span.textContent = copy.loadingSub;
    }
    refreshLocalizedContent();
  }

  function cancelSearch() {
    state.searchRequest += 1;
    state.searchTask?.controller.abort();
    state.searchTask = null;
    elements["character-search-results"]?.setAttribute("aria-busy", "false");
  }

  async function search(rawName) {
    const name = String(rawName || "").trim();
    const copy = currentCopy();
    const region = searchOfficialRegion();
    const globalRegion = state.globalRegion;
    const sessionKey = searchSessionKey(name, region, globalRegion);
    if (state.searchTask?.key === sessionKey) {
      setPopover(true);
      return;
    }
    cancelSearch();
    if (!name) {
      renderMessage(copy.invalidName);
      setPopover(true);
      return;
    }
    elements["character-search-popover-title"].textContent = region === "ww" ? copy.globalResults : copy.results;
    elements["character-search-status"].textContent = copy.searching;
    state.searchRace = "all";
    state.searchComplete = true;
    state.searchResults = [];
    const requestId = state.searchRequest;
    const task = { key: sessionKey, controller: new AbortController() };
    state.searchTask = task;
    state.searchKey = sessionKey;
    elements["character-search-results"].setAttribute("aria-busy", "true");
    setRaceFiltersVisible(true);
    renderLoadingRows();
    setPopover(true);
    const sessionPayload = readSessionPayload(sessionKey, SEARCH_SESSION_TTL_MS);
    if (sessionPayload) applySearchPayload(sessionPayload, region, globalRegion);
    const slowTimer = window.setTimeout(() => {
      if (requestId === state.searchRequest && !state.searchResults.length) {
        elements["character-search-status"].textContent = currentCopy().searchSlow;
      }
    }, 4_000);
    try {
      const data = await fetchCharacterJson(
        `/search?name=${encodeURIComponent(name)}&region=${region}&lang=${officialLanguage(region)}${globalRegionQuery(region, globalRegion)}&fast=1`,
        { signal: task.controller.signal, requestTimeoutMs: SEARCH_REQUEST_TIMEOUT_MS, timeoutMs: SEARCH_TOTAL_TIMEOUT_MS });
      if (requestId !== state.searchRequest) return;
      window.clearTimeout(slowTimer);
      const preserveCompleteSession = sessionPayload?.results?.length > 0 && sessionPayload.complete !== false && data?.complete === false;
      if (!preserveCompleteSession) {
        writeSessionPayload(sessionKey, data);
        applySearchPayload(data, region, globalRegion);
      }
      if (data?.complete === false) {
        await pollSearchResults(name, region, requestId, globalRegion);
      }
    } catch {
      if (requestId !== state.searchRequest) return;
      if (state.searchResults.length) {
        elements["character-search-status"].textContent = currentCopy().searchPending;
        return;
      }
      setRaceFiltersVisible(false);
      elements["character-search-status"].textContent = copy.searchError;
      renderMessage(copy.searchError);
    } finally {
      window.clearTimeout(slowTimer);
      if (requestId === state.searchRequest) {
        state.searchTask = null;
        elements["character-search-results"].setAttribute("aria-busy", "false");
      }
    }
  }

  function applySearchPayload(data, region = searchOfficialRegion(), globalRegion = state.globalRegion) {
    state.searchComplete = data?.complete !== false;
    state.searchResults = Array.isArray(data?.results)
      ? data.results.filter(item => region !== "ww" || Number(item.level) === 45)
        .map(item => ({ ...item, region, globalRegion: region === "ww" ? globalRegion : "" })).sort((a, b) =>
        Number(b.combatPower) - Number(a.combatPower) ||
        String(a.name || "").localeCompare(String(b.name || ""), "ko"))
      : [];
    renderSearchRows(state.searchResults, false);
  }

  async function pollSearchResults(name, region, requestId, globalRegion) {
    const signal = state.searchTask.controller.signal;
    const deadline = Date.now() + SEARCH_POLL_TIMEOUT_MS;
    let failures = 0;
    for (let attempt = 0; requestId === state.searchRequest && Date.now() < deadline; attempt += 1) {
      await waitForCharacterDelay(Math.min(attempt < 4 ? 1_500 : 3_000, deadline - Date.now()), signal);
      if (requestId !== state.searchRequest) return;
      const remaining = deadline - Date.now();
      if (remaining <= 0) break;
      try {
        const data = await fetchCharacterJson(
          `/search?name=${encodeURIComponent(name)}&region=${region}&lang=${officialLanguage(region)}${globalRegionQuery(region, globalRegion)}&fast=1&_=${Date.now()}`,
          { cache: "no-store", signal, requestTimeoutMs: SEARCH_REQUEST_TIMEOUT_MS,
            timeoutMs: Math.min(SEARCH_TOTAL_TIMEOUT_MS, remaining) },
        );
        if (requestId !== state.searchRequest) return;
        const preserveCompletePayload = state.searchComplete && state.searchResults.length > 0 && data?.complete === false;
        if (!preserveCompletePayload) {
          writeSessionPayload(searchSessionKey(name, region, globalRegion), data);
          applySearchPayload(data, region, globalRegion);
        }
        failures = 0;
        if (data?.complete !== false) return;
      } catch {
        if (requestId !== state.searchRequest) return;
        if (++failures >= 2) break;
      }
    }
    if (requestId !== state.searchRequest) return;
    elements["character-search-status"].textContent = currentCopy().searchPending;
    if (!state.searchResults.length) renderMessage(currentCopy().searchPending);
  }

  function renderRecent() {
    const copy = currentCopy();
    elements["character-search-popover-title"].textContent = copy.saved;
    elements["character-search-status"].textContent = copy.recentGuide;
    setRaceFiltersVisible(false);
    renderSavedRows();
  }

  function renderSavedRows() {
    const container = elements["character-search-results"];
    container.replaceChildren();
    const region = searchOfficialRegion();
    const favorites = readFavorites().filter(item => matchesSearchScope(item, region));
    const favoriteKeys = new Set(favorites.map(characterKey));
    const recent = readRecent().filter(item => matchesSearchScope(item, region) && !favoriteKeys.has(characterKey(item)));
    if (!favorites.length && !recent.length) {
      renderMessage(currentCopy().noRecent);
      return;
    }
    appendSavedGroup(container, currentCopy().favorites, favorites, "favorite");
    appendSavedGroup(container, currentCopy().recent, recent, "recent");
  }

  function appendSavedGroup(container, title, rows, context) {
    if (!rows.length) return;
    const heading = node("div", "character-search-group-head");
    heading.append(textNode("strong", title), textNode("span", formatNumber(rows.length)));
    container.append(heading);
    for (const item of rows) container.append(createSearchRow(item, context));
  }

  function renderSearchRows(rows, recent) {
    const container = elements["character-search-results"];
    container.replaceChildren();
    const serverRows = searchOfficialRegion() === "ww" && state.globalServerId
      ? rows.filter(item => Number(item.serverId) === Number(state.globalServerId)) : rows;
    const filteredRows = recent || state.searchRace === "all"
      ? serverRows
      : serverRows.filter(item => state.searchRace === "elyos"
        ? /(?:천족|天族|Elyos)/i.test(String(item.raceName || ""))
        : /(?:마족|魔族|Asmodian)/i.test(String(item.raceName || "")));
    if (!recent) {
      elements["character-search-popover-title"].textContent = searchOfficialRegion() === "ww"
        ? currentCopy().globalResults : currentCopy().results;
      const count = state.searchRace === "all"
        ? formatCopy("itemCount", { value: formatNumber(filteredRows.length) })
        : formatCopy("itemCountPair", {
          visible: formatNumber(filteredRows.length), total: formatNumber(rows.length),
        });
      elements["character-search-status"].textContent = state.searchComplete
        ? count
        : `${count} · ${currentCopy().sortingCp}`;
      for (const button of elements["character-search-race-filters"]?.querySelectorAll("[data-search-race]") || []) {
        button.setAttribute("aria-pressed", String(button.dataset.searchRace === state.searchRace));
      }
    }
    if (!filteredRows.length) {
      renderMessage(recent ? currentCopy().noRecent : currentCopy().noResults);
      if (!recent && state.globalServerId && rows.length && !serverRows.length) {
        const reset = textNode("button", currentCopy().serverReset, "character-search-clear-server");
        reset.type = "button";
        reset.addEventListener("click", () => selectGlobalServer(""));
        container.append(reset);
      }
      return;
    }
    for (const item of filteredRows) container.append(createSearchRow(item, "search"));
  }

  function setRaceFiltersVisible(visible) {
    if (elements["character-search-race-filters"]) {
      elements["character-search-race-filters"].hidden = !visible;
    }
  }

  function createSearchRow(item, context = "search") {
    const row = node("div", "character-search-row");
    const button = node("button", "character-search-open");
    button.type = "button";
    const avatar = node("span", "character-search-avatar");
    avatar.append(createImage(item.profileImage, item.name));
    const identity = node("span", "character-search-name");
    const serverName = characterServerName(item) || String(item.serverId || "—");
    const nameLine = node("span", "character-search-name-line");
    nameLine.append(textNode("strong", item.name || "—"));
    const cp = node("strong", "character-search-cp cp-badge");
    const hasCp = Number(item.combatPower) > 0;
    cp.title = hasCp ? `${formatNumber(item.combatPower)} CP` : currentCopy().sortingCp;
    cp.append(createImage("./assets/combat-power.png", ""),
      textNode("span", hasCp ? formatCompactCombatPower(item.combatPower) : currentCopy().cpPending));
    nameLine.append(cp);
    identity.append(nameLine, textNode("span",
      `${serverName} - ${localizeOfficialText(item.raceName) || "—"}`, "character-search-meta"));
    const job = node("span", "character-search-job");
    job.append(createImage(jobIcon(item.className), ""),
      document.createTextNode(localizeOfficialText(item.className) || "—"));
    button.append(avatar, identity, job);
    button.addEventListener("click", () => openCharacter(item));
    const actions = node("span", "character-search-actions");
    const favorite = node("button", "character-search-action character-favorite-button");
    const favoriteActive = isFavorite(item);
    favorite.type = "button";
    favorite.textContent = favoriteActive ? "★" : "☆";
    favorite.title = favoriteActive ? currentCopy().removeFavorite : currentCopy().addFavorite;
    favorite.setAttribute("aria-label", favorite.title);
    favorite.setAttribute("aria-pressed", String(favoriteActive));
    favorite.addEventListener("click", event => {
      event.stopPropagation();
      toggleFavorite(item);
      if (context === "search") renderSearchRows(state.searchResults, false);
      else renderRecent();
    });
    actions.append(favorite);
    if (context === "recent") {
      const remove = node("button", "character-search-action character-recent-delete");
      remove.type = "button";
      remove.textContent = "×";
      remove.title = currentCopy().deleteRecent;
      remove.setAttribute("aria-label", remove.title);
      remove.addEventListener("click", event => {
        event.stopPropagation();
        removeRecent(item);
        renderRecent();
      });
      actions.append(remove);
    }
    row.append(button, actions);
    return row;
  }

  function renderLoadingRows() {
    const container = elements["character-search-results"];
    container.replaceChildren();
    const row = node("div", "character-search-empty");
    row.append(node("div", "spinner"), textNode("p", currentCopy().searching));
    container.append(row);
  }

  function renderMessage(message) {
    elements["character-search-results"].replaceChildren(textNode("div", message, "character-search-empty"));
  }

  function openCharacter(item) {
    saveRecent(item);
    const url = new URL("./", window.location.href);
    url.searchParams.set("view", "character");
    url.searchParams.set("serverId", String(item.serverId));
    url.searchParams.set("characterId", item.characterId);
    url.searchParams.set("name", item.name || "");
    const region = normalizeOfficialRegion(item.region);
    if (region !== "kr") url.searchParams.set("region", region);
    if (region === "ww") url.searchParams.set("globalRegion", normalizeGlobalRegion(item.globalRegion));
    window.location.assign(url.href);
  }

  function activate() {
    const params = new URLSearchParams(window.location.search);
    const serverId = Number(params.get("serverId"));
    const characterId = params.get("characterId") || "";
    const name = String(params.get("name") || "").trim();
    if (!characterId && serverId > 0 && name) {
      void resolveLinkedCharacter(name, serverId);
      return;
    }
    void loadProfile(false, false);
  }

  async function resolveLinkedCharacter(name, serverId) {
    showProfileState("loading");
    try {
      const region = currentOfficialRegion();
      const globalRegion = currentGlobalRegion();
      const data = await fetchCharacterJson(
        `/search?name=${encodeURIComponent(name)}&region=${region}&lang=${officialLanguage(region)}${globalRegionQuery(region, globalRegion)}&fast=1`);
      const candidates = Array.isArray(data.results) ? data.results : [];
      const normalizedName = name.normalize("NFC").toLocaleLowerCase();
      const match = candidates.find(item =>
        Number(item.serverId) === Number(serverId) &&
        String(item.name || "").normalize("NFC").toLocaleLowerCase() === normalizedName) ||
        candidates.find(item => Number(item.serverId) === Number(serverId));
      if (!match?.characterId) throw new Error(currentCopy().noResults);
      const url = new URL(window.location.href);
      url.searchParams.set("characterId", String(match.characterId));
      url.searchParams.set("name", String(match.name || name));
      window.history.replaceState({}, "", url.href);
      await loadProfile(true, false);
    } catch (error) {
      showProfileState("error", error?.message || currentCopy().loadError);
    }
  }

  async function loadProfile(force, refreshOfficial) {
    const params = new URLSearchParams(window.location.search);
    const serverId = Number(params.get("serverId"));
    const characterId = params.get("characterId") || "";
    const region = currentOfficialRegion(params);
    const globalRegion = currentGlobalRegion(params);
    if (!serverId || !characterId) {
      showProfileState("error", currentCopy().invalidName);
      return;
    }
    if (state.profileLoad && !force) return state.profileLoad;
    const sessionKey = profileSessionKey(region, serverId, characterId, globalRegion);
    const sessionPayload = !force
      ? readSessionPayload(sessionKey, PROFILE_SESSION_TTL_MS)
      : null;
    if (sessionPayload) applyProfilePayload(sessionPayload, params, serverId, characterId);
    if ((!refreshOfficial || !state.profile) && !sessionPayload) showProfileState("loading");
    const refreshSuffix = refreshOfficial ? "&refresh=1" : "";
    const fastSuffix = refreshOfficial ? "" : "&fast=1";
    const requestId = ++state.profileRequest;
    state.profileLoad = fetchCharacterJson(
      `/profile?serverId=${encodeURIComponent(serverId)}&characterId=${encodeURIComponent(characterId)}&region=${region}&lang=${officialLanguage(region)}${globalRegionQuery(region, globalRegion)}${refreshSuffix}${fastSuffix}`,
      { cache: "no-store" },
    ).then(data => {
      writeProfileSessionPayload(sessionKey, data);
      applyProfilePayload(data, params, serverId, characterId);
      if (data?.complete === false) void pollProfile(params, region, serverId, characterId, requestId);
      return true;
    }).catch(error => {
      if (refreshOfficial && state.profile) showProfileState("content");
      else showProfileState("error", error?.message || currentCopy().loadError);
      return false;
    }).finally(() => { state.profileLoad = null; });
    return state.profileLoad;
  }

  async function pollProfile(params, region, serverId, characterId, requestId) {
    const globalRegion = currentGlobalRegion(params);
    for (let attempt = 0; attempt < 90 && requestId === state.profileRequest; attempt += 1) {
      await new Promise(resolve => window.setTimeout(resolve, attempt < 6 ? 600 : 1250));
      if (requestId !== state.profileRequest) return;
      try {
        const data = await fetchCharacterJson(
          `/profile?serverId=${encodeURIComponent(serverId)}&characterId=${encodeURIComponent(characterId)}&region=${region}&lang=${officialLanguage(region)}${globalRegionQuery(region, globalRegion)}&fast=1&_=${Date.now()}`,
          { cache: "no-store" },
        );
        if (requestId !== state.profileRequest) return;
        writeProfileSessionPayload(profileSessionKey(region, serverId, characterId, globalRegion), data);
        applyProfilePayload(data, params, serverId, characterId);
        if (data?.complete !== false) return;
      } catch {
        // The profile shell remains usable while detailed item options finish loading.
      }
    }
  }

  function applyProfilePayload(data, params, serverId, characterId) {
    const previousCharacterId = state.profile?.info?.profile?.characterId || "";
    const nextCharacterId = data?.info?.profile?.characterId || characterId;
    if (previousCharacterId === nextCharacterId && state.profile?.complete !== false && data?.complete === false) {
      return;
    }
    if (previousCharacterId && previousCharacterId !== nextCharacterId) {
      state.activeLoadout = null;
      state.activeEquipmentTab = "gear";
    }
    const renderSignature = profilePayloadSignature(data, characterId);
    state.profile = data;
    const profile = data?.info?.profile || {};
    saveRecent({
      characterId: profile.characterId || characterId,
      name: profile.characterName || params.get("name") || "",
      serverId: profile.serverId || serverId,
      serverName: profile.serverName || "",
      className: profile.className || "",
      raceName: profile.raceName || "",
      level: profile.characterLevel || 0,
      combatPower: profile.combatPower || 0,
      profileImage: profile.profileImage || "",
      region: currentOfficialRegion(params),
      globalRegion: currentGlobalRegion(params),
    });
    if (renderSignature !== state.profileRenderSignature) {
      state.profileRenderSignature = renderSignature;
      renderProfile(data);
    }
    showProfileState("content");
  }

  function showProfileState(name, message = "") {
    elements["character-loading-state"].hidden = name !== "loading";
    elements["character-error-state"].hidden = name !== "error";
    elements["character-profile-content"].hidden = name !== "content";
    if (message) elements["character-error-message"].textContent = message;
  }

  function renderProfile(data) {
    globalThis.NotMeterDaevanion?.close();
    const copy = currentCopy();
    const content = elements["character-profile-content"];
    const loadoutView = resolveLoadoutView(data);
    const visibleData = loadoutView.data;
    const info = visibleData?.info || {};
    const profile = info.profile || {};
    const statList = Array.isArray(info.stat?.statList) ? info.stat.statList : [];
    const allEquipment = Array.isArray(visibleData?.equipment?.equipment?.equipmentList)
      ? visibleData.equipment.equipment.equipmentList : [];
    const itemDetails = visibleData?.itemDetails || {};
    const regularEquipment = allEquipment.filter(item => !String(item.slotPosName).startsWith("Arcana"));
    const arcana = allEquipment.filter(item => String(item.slotPosName).startsWith("Arcana"));
    const itemLevel = statList.find(item => item.type === "ItemLevel")?.value || 0;

    document.title = `${profile.characterName || copy.heading} · NotMeter`;
    const hero = renderHero(profile, itemLevel, visibleData?.equipment?.petwing || {}, info.title || {},
      visibleData?.fetchedAt, visibleData?.complete !== false);
    ensureCharacterBuilds(data);
    // Ranking selections are the fallback when no submitted build exists.
    const rankings = renderCharacterRankings(data);
    const equipment = renderEquipment(regularEquipment, itemDetails, data, loadoutView.type);
    const tabs = [
      { key: "equipment", label: copy.equipment, content: equipment },
      { key: "skills", label: copy.skills, content: renderSkills(visibleData?.equipment?.skill?.skillList || []) },
      ...(globalThis.NotMeterDaevanion ? [{ key: "daevanion",
        label: globalThis.NotMeterDaevanion.title(state.locale, currentOfficialRegion()),
        content: globalThis.NotMeterDaevanion.create({
          profile: data?.info?.profile || {}, boards: data?.info?.daevanion?.boardList || [],
          skills: data?.equipment?.skill?.skillList || [], locale: state.locale,
          jobIcon: jobIcon(data?.info?.profile?.className),
          region: currentOfficialRegion(), globalRegion: currentGlobalRegion(),
          request: fetchCharacterJson, translate: localizeOfficialText,
        }),
      }] : []),
      { key: "stats", label: copy.stats, content: renderStats(statList) },
      { key: "arcana", label: copy.arcana, content: renderArcana(arcana, itemDetails) },
    ];
    content.replaceChildren();
    content.append(
      hero, rankings,
      globalThis.NotMeterCharacterTabs?.create(tabs, copy.heading) || renderSectionFallback(tabs),
      textNode("p", copy.officialNote, "character-data-note"),
    );
  }

  function resolveLoadoutView(data) {
    if (currentOfficialRegion() === "ww") return { type: null, data };
    const currentType = normalizeLoadoutType(data?.currentLoadoutType);
    const loadouts = data?.loadouts && typeof data.loadouts === "object" ? data.loadouts : {};
    let selectedType = normalizeLoadoutType(state.activeLoadout);
    if (!selectedType || (selectedType !== currentType && !loadouts[selectedType])) {
      selectedType = currentType;
    }
    state.activeLoadout = selectedType;

    const snapshot = selectedType && selectedType !== currentType ? loadouts[selectedType] : null;
    if (!snapshot) return { type: selectedType, data };

    const rootInfo = data?.info || {};
    return {
      type: selectedType,
      data: {
        ...data,
        fetchedAt: snapshot.capturedAt || data?.fetchedAt,
        info: {
          ...rootInfo,
          profile: snapshot.profile || rootInfo.profile || {},
          stat: snapshot.stat || rootInfo.stat || {},
        },
        equipment: snapshot.equipment || {},
        itemDetails: snapshot.itemDetails || {},
        complete: true,
      },
    };
  }

  function normalizeLoadoutType(value) {
    const normalized = String(value || "").trim().toUpperCase();
    return normalized === "PVE" || normalized === "PVP" ? normalized : null;
  }

  function renderCompactLoadoutSelector(data, selectedType) {
    const copy = currentCopy();
    const currentType = normalizeLoadoutType(data?.currentLoadoutType);
    const loadouts = data?.loadouts && typeof data.loadouts === "object" ? data.loadouts : {};
    const selector = node("div", "equipment-loadout-tabs");
    selector.setAttribute("aria-label", copy.loadoutTitle);
    for (const type of ["PVE", "PVP"]) {
      const available = type === currentType || Boolean(loadouts[type]);
      const button = node("button", `equipment-loadout-tab loadout-${type.toLowerCase()}`);
      button.type = "button";
      button.disabled = !available;
      button.textContent = type === "PVE" ? copy.pveLoadout : copy.pvpLoadout;
      button.setAttribute("aria-pressed", String(type === selectedType));
      if (type === selectedType) button.classList.add("selected");
      if (type === currentType) button.dataset.current = "true";
      if (!available) button.title = copy.unavailableLoadout;
      if (available) button.addEventListener("click", () => switchEquipmentLoadout(type));
      selector.append(button);
    }
    return selector;
  }

  function switchEquipmentLoadout(type) {
    const scrollTop = window.scrollY;
    state.activeLoadout = type;
    renderProfile(state.profile);
    window.requestAnimationFrame(() => window.scrollTo(0, scrollTop));
  }

  function isKanonCharacter(profile = state.profile?.info?.profile) {
    const params = new URLSearchParams(window.location.search);
    return globalThis.NotMeterCharacterCombat.matches(profile, params,
      currentOfficialRegion(params), currentGlobalRegion(params));
  }

  function renderCharacterSocialLinks(profile) {
    if (!isKanonCharacter(profile)) return [];

    return [
      { type: "twitch", title: "Kanonxo · Twitch", href: "https://www.twitch.tv/kanonxo",
        path: "M11.571 4.714h1.715v5.143h-1.715zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" },
      { type: "discord", title: "Kanonxo · Discord", href: "https://discord.gg/1hp",
        path: "M19.5 5.34A17.2 17.2 0 0 0 15.44 4l-.5 1.02a15.7 15.7 0 0 0-5.86 0L8.56 4A17.4 17.4 0 0 0 4.5 5.35C1.93 9.12 1.23 12.8 1.58 16.43a16.5 16.5 0 0 0 4.98 2.52l1.2-1.64a10.8 10.8 0 0 1-1.9-.92l.47-.36c3.67 1.7 7.65 1.7 11.27 0l.48.36c-.61.36-1.25.67-1.91.92l1.2 1.64a16.4 16.4 0 0 0 4.98-2.52c.42-4.2-.72-7.84-2.85-11.09ZM8.87 14.22c-1.1 0-2.01-1.01-2.01-2.25s.89-2.26 2.01-2.26c1.13 0 2.03 1.02 2.01 2.26 0 1.24-.89 2.25-2.01 2.25Zm6.26 0c-1.1 0-2.01-1.01-2.01-2.25s.89-2.26 2.01-2.26c1.13 0 2.03 1.02 2.01 2.26 0 1.24-.88 2.25-2.01 2.25Z" },
      { type: "youtube", title: "Kanonxo · YouTube", href: "https://www.youtube.com/@KanonXO",
        path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.121 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" },
    ].map(social => {
      const link = node("a", `character-social-link character-${social.type}-link`);
      link.href = social.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = social.title;
      link.setAttribute("aria-label", link.title);
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("focusable", "false");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", social.path);
      icon.append(path);
      link.append(icon);
      return link;
    });
  }

  function renderHero(profile, itemLevel, petwing, titles, fetchedAt, profileComplete) {
    const copy = currentCopy();
    const hero = node("section", "character-hero");
    const avatar = node("div", "character-profile-avatar");
    avatar.append(createImage(profile.profileImage || jobIcon(profile.className), profile.characterName || ""));
    const copyBox = node("div", "character-hero-copy");
    const appearanceTitle = window.NotMeterCharacterTitles?.create(profile, currentOfficialRegion(), state.locale);
    if (appearanceTitle) copyBox.append(appearanceTitle);
    const nameRow = node("div", "character-hero-name");
    const heroJobIcon = createImage(jobIcon(profile.className), "");
    heroJobIcon.className = "character-hero-job-icon";
    const name = textNode("h3", profile.characterName || "—");
    const socialLinks = renderCharacterSocialLinks(profile);
    if (socialLinks.length) {
      const linkedName = node("div", "character-linked-name");
      const links = node("span", "character-social-links");
      links.append(...socialLinks);
      linkedName.append(name, links);
      nameRow.append(heroJobIcon, linkedName);
    } else nameRow.append(heroJobIcon, name);
    const meta = node("div", "character-hero-meta");
    for (const [label, value] of [
      [copy.server, characterServerName({ ...profile, region: currentOfficialRegion(), globalRegion: currentGlobalRegion() })],
      [copy.legion, profile.regionName || copy.none], [copy.level, profile.characterLevel],
    ]) {
      const item = node("span");
      item.append(document.createTextNode(`${label} `), textNode("b", String(value || "—")));
      meta.append(item);
    }
    copyBox.append(nameRow, meta);
    const equippedItems = [
      [copy.mount, localizeOfficialText(petwing?.pet?.name) || copy.none,
        petwing?.pet?.level ? `Lv.${petwing.pet.level}` : "", ""],
      [copy.wing, localizeOfficialText(petwing?.wing?.name) || copy.none,
        petwing?.wing?.enchantLevel ? `+${petwing.wing.enchantLevel}` : "", ""],
    ];
    const titleOrder = { Attack: 0, Defense: 1, Etc: 2 };
    const equippedTitles = (Array.isArray(titles?.titleList) ? titles.titleList.slice() : [])
      .sort((left, right) => (titleOrder[left.equipCategory] ?? 9) - (titleOrder[right.equipCategory] ?? 9));
    for (const title of equippedTitles) {
      const options = (Array.isArray(title.equipStatList) ? title.equipStatList : [])
        .map(item => localizeOfficialText(item.desc)).filter(Boolean).join(" · ");
      equippedItems.push([
        `${copy.equipped} ${copy.title} · ${titleCategoryLabel(title.equipCategory)}`,
        localizeOfficialText(title.name) || copy.none,
        "",
        options,
      ]);
    }
    if (!equippedTitles.length) equippedItems.push([`${copy.equipped} ${copy.title}`, copy.none, "", ""]);
    const collection = node("div", "character-equipped-collection");
    for (const [index, [label, value, suffix, detail]] of equippedItems.entries()) {
      const isTitle = index >= 2;
      const item = node("span", `character-equipped-item${isTitle ? " character-equipped-title-item" : ""}${index === 2 ? " title-row-start" : ""}`);
      item.append(textNode("small", label), textNode("strong", value));
      if (suffix) item.append(textNode("em", suffix));
      if (detail) item.append(textNode("i", detail));
      collection.append(item);
    }
    copyBox.append(collection);
    const cp = node("div", "character-cp-card");
    const cpValue = node("span", "character-profile-cp-badge cp-badge");
    cpValue.title = `${formatNumber(profile.combatPower)} CP`;
    cpValue.append(createImage("./assets/combat-power.png", ""),
      textNode("strong", formatCompactCombatPower(profile.combatPower)));
    cp.append(textNode("span", copy.combatPower), cpValue,
      textNode("small", `${formatNumber(profile.combatPower)} CP · ${copy.itemLevel} ${formatNumber(itemLevel)}`));
    const refresh = node("div", "character-profile-refresh");
    const refreshStatus = textNode("span", profileComplete
      ? `${copy.updatedAt} ${formatDateTime(fetchedAt)}`
      : copy.loadingDetails);
    const refreshButton = textNode("button", copy.refreshProfile, "character-profile-refresh-button");
    refreshButton.type = "button";
    refreshButton.addEventListener("click", async () => {
      const previousFetchedAt = state.profile?.fetchedAt || "";
      refreshButton.disabled = true;
      refreshButton.textContent = copy.refreshingProfile;
      refreshStatus.textContent = copy.refreshingProfile;
      const succeeded = await loadProfile(true, true);
      const visibleRefresh = elements["character-profile-content"]
        ?.querySelector(".character-profile-refresh");
      const visibleStatus = visibleRefresh?.querySelector("span");
      const visibleButton = visibleRefresh?.querySelector("button");
      if (visibleButton) {
        visibleButton.disabled = false;
        visibleButton.textContent = copy.refreshProfile;
      }
      if (!succeeded) {
        if (visibleStatus) visibleStatus.textContent = copy.refreshFailed;
        return;
      }
      const refreshedAt = state.profile?.fetchedAt || "";
      if (visibleStatus) {
        visibleStatus.textContent = refreshedAt === previousFetchedAt
          ? copy.refreshCooldown
          : copy.refreshComplete;
      }
    });
    refresh.append(refreshStatus, refreshButton);
    cp.append(refresh);
    hero.append(avatar, copyBox, cp);
    return hero;
  }

  function renderSectionFallback(tabs) {
    const root = node("div");
    const nav = node("nav", "character-section-nav");
    for (const tab of tabs) {
      const link = textNode("a", tab.label);
      link.href = `#character-${tab.key}`;
      nav.append(link);
    }
    root.append(nav, ...tabs.map(tab => tab.content));
    return root;
  }

  function renderCharacterRankings(data) {
    const copy = currentCopy();
    const global = currentOfficialRegion() === "ww";
    const section = createSection(
      "character-rankings", "", copy.rankingRecords,
      global ? copy.rankingGlobalScopeNote : copy.rankingScopeNote);
    section.querySelector(".character-section-kicker").remove();
    section.querySelector(".character-section-head").append(node("div", "character-ranking-context"));
    const body = node("div", "character-ranking-body");
    const rankingKey = rankingProfileKey(data);
    if (state.rankingKey !== rankingKey) {
      state.rankingKey = rankingKey;
      state.rankingStatus = "idle";
      state.rankingRows = [];
      state.rankingLoad = null;
      state.traits = { status: "idle", row: null, flags: new Map(), load: null };
    }
    body.dataset.rankingKey = rankingKey;
    section.append(body);
    if (!global) section.append(textNode("p", copy.rankingMetricNote, "character-ranking-footnote"));
    renderCharacterRankingBody(body);

    if (state.rankingStatus === "idle") startCharacterRankingLoad(data, rankingKey);
    return section;
  }

  function rankingProfileKey(data) {
    const profile = data?.info?.profile || {};
    const params = new URLSearchParams(window.location.search);
    return [
      state.locale,
      currentOfficialRegion(params),
      currentGlobalRegion(params),
      currentOfficialRegion(params) === "ww" ? String(data?.fetchedAt || "") : "",
      Number(profile?.serverId) || Number(params.get("serverId")) || 0,
      String(profile?.characterId || params.get("characterId") || profile?.characterName || "").trim(),
      canonicalJobName(profile?.className),
      resolvePveCombatPower(data),
    ].join("|");
  }

  function startCharacterRankingLoad(data, rankingKey) {
    state.rankingStatus = "loading";
    state.traits = { status: "loading", row: null, flags: new Map(), load: null };
    refreshCharacterTraits();
    const load = loadCharacterRankings(data);
    state.rankingLoad = load;
    void load.then(rows => {
      if (state.rankingKey !== rankingKey || state.rankingLoad !== load) return;
      state.rankingRows = rows;
      state.rankingStatus = "ready";
      refreshCharacterRankingBody(rankingKey);
      startCharacterTraitsLoad(rankingKey);
    }).catch(error => {
      if (state.rankingKey !== rankingKey || state.rankingLoad !== load) return;
      state.rankingRows = [];
      state.rankingStatus = error.pending ? "pending" : "error";
      state.traits.status = error.pending ? "empty" : "error";
      refreshCharacterRankingBody(rankingKey);
      refreshCharacterTraits();
    });
  }

  function refreshCharacterRankingBody(rankingKey) {
    const body = document.querySelector("#character-rankings .character-ranking-body");
    if (!body || body.dataset.rankingKey !== rankingKey) return;
    renderCharacterRankingBody(body);
  }

  function renderCharacterRankingBody(body) {
    const copy = currentCopy();
    const global = currentOfficialRegion() === "ww";
    const commonTier = !global && state.rankingStatus === "ready" && state.rankingRows.length &&
      state.rankingRows.every(row => row.cpTierLabel && row.cpTierLabel === state.rankingRows[0].cpTierLabel)
      ? state.rankingRows[0].cpTierLabel : "";
    const context = body.parentElement?.querySelector(".character-ranking-context");
    if (context) {
      context.replaceChildren();
      if (commonTier) {
        const tier = node("div", "character-ranking-cp");
        const label = node("span");
        label.append(textNode("small", copy.rankingCpBracket), textNode("strong", commonTier));
        tier.append(createImage("./assets/combat-power.png", ""), label);
        context.append(tier);
      }
      context.append(textNode("span", global ? copy.globalRankingTitle : "TOP 20", "character-ranking-limit"));
    }
    const periods = [["weekly", copy.rankingWeekly], ["allTime", copy.rankingAllTime]];
    const tabs = node("div", "character-ranking-tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", copy.rankingRecords);
    for (const [periodKey, periodLabel] of periods) {
      const tab = node("button", "character-ranking-tab");
      tab.type = "button";
      tab.id = `character-ranking-tab-${periodKey}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", `character-ranking-panel-${periodKey}`);
      const awaitingUpdate = periodKey === "weekly" && global && (state.rankingStatus === "pending" ||
        state.rankingStatus === "ready" && !globalThis.NotMeterGlobalRanking.isCurrentWeek());
      const count = state.rankingStatus === "ready" && !awaitingUpdate
        ? state.rankingRows.filter(row => row.periodKey === periodKey).length : "—";
      tab.append(textNode("span", periodLabel), textNode("span", String(count), "character-ranking-tab-count"));
      if (awaitingUpdate) {
        tab.append(textNode("small", copy.rankingAwaitingUpdate, "character-ranking-tab-status"));
      }
      tab.addEventListener("click", () => selectCharacterRankingPeriod(body, periodKey));
      tab.addEventListener("keydown", event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? "weekly" : event.key === "End" ? "allTime"
          : periodKey === "allTime" ? "weekly" : "allTime";
        selectCharacterRankingPeriod(body, next);
        body.querySelector(`#character-ranking-tab-${next}`).focus({ preventScroll: true });
      });
      tabs.append(tab);
    }
    const showState = message => {
      const panels = periods.map(([key]) => {
        const panel = createCharacterRankingPanel(key);
        panel.append(textNode("p", message, "character-ranking-state"));
        return panel;
      });
      body.replaceChildren(tabs, ...panels);
      syncCharacterRankingPeriod(body);
    };
    if (state.rankingStatus === "idle" || state.rankingStatus === "loading") {
      showState(copy.rankingLoading);
      return;
    }
    if (state.rankingStatus === "error") {
      showState(copy.rankingError);
      return;
    }
    if (state.rankingStatus === "pending") {
      showState(copy.globalRankingPending);
      return;
    }
    const groups = node("div", "character-ranking-periods");
    for (const [periodKey] of periods) {
      const periodRows = state.rankingRows.filter(row => row.periodKey === periodKey);
      const period = createCharacterRankingPanel(periodKey);
      if (!periodRows.length) {
        const pending = global && periodKey === "weekly" && !globalThis.NotMeterGlobalRanking.isCurrentWeek();
        period.append(textNode("p", pending ? copy.globalRankingWeeklyPending
          : global ? copy.globalRankingEmpty : copy.rankingEmpty, "character-ranking-state"));
        groups.append(period);
        continue;
      }
      for (const dungeonRows of groupCharacterRankingRows(periodRows)) {
        const first = dungeonRows[0];
        const group = node("article", "character-ranking-dungeon");
        const identity = node("header", "character-ranking-dungeon-heading");
        const name = node("div", "character-ranking-dungeon-name");
        const [title, mode] = splitCharacterRankingDungeonName(first.dungeonName);
        name.append(textNode("h6", title));
        if (mode) name.append(textNode("span", mode));
        identity.append(characterRankingIcon(first.dungeonKey), name);
        const list = node("div", "character-ranking-records");
        for (const row of dungeonRows) {
          const item = node("div", "character-ranking-row");
          const rank = node("span", `character-ranking-rank character-ranking-rank-${row.rank}`);
          const position = textNode("strong", String(row.rank));
          position.prepend(textNode("small", "#"));
          rank.setAttribute("aria-label", `${copy.rank} ${row.rank}`);
          rank.append(position);
          if (!commonTier && row.cpTierLabel) rank.append(textNode("span", row.cpTierLabel, "character-ranking-row-cp"));
          const value = node("span", "character-ranking-result");
          value.append(
            textNode("strong", row.rankingValue > 0
              ? formatNumber(row.rankingUnit === "s" ? Math.round(row.rankingValue * 10) / 10 : Math.round(row.rankingValue))
              : "—", "character-ranking-dps"),
            textNode("small", row.rankingUnit));
          const button = characterCombatButton(row);
          button.prepend(characterRankingIcon("detail"));
          item.append(rank, textNode("strong", row.bossName, "character-ranking-boss"), value, button);
          list.append(item);
        }
        group.append(identity, list);
        period.append(group);
      }
      groups.append(period);
    }
    body.replaceChildren(tabs, groups);
    syncCharacterRankingPeriod(body);
  }

  function createCharacterRankingPanel(key) {
    const panel = node("section", `character-ranking-period character-ranking-period-${key}`);
    panel.id = `character-ranking-panel-${key}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `character-ranking-tab-${key}`);
    panel.tabIndex = 0;
    return panel;
  }

  function syncCharacterRankingPeriod(body) {
    for (const key of ["weekly", "allTime"]) {
      const selected = key === (state.rankingPeriod || "weekly");
      const tab = body.querySelector(`#character-ranking-tab-${key}`);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      body.querySelector(`#character-ranking-panel-${key}`).hidden = !selected;
    }
  }

  function selectCharacterRankingPeriod(body, key) {
    const top = window.scrollY;
    state.rankingPeriod = key;
    syncCharacterRankingPeriod(body);
    window.scrollTo({ top, behavior: "instant" });
  }

  function groupCharacterRankingRows(rows) {
    const groups = new Map();
    for (const row of rows) {
      const key = row.dungeonKey || Symbol();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    }
    return [...groups.values()];
  }

  function splitCharacterRankingDungeonName(value) {
    const name = String(value || "—").trim();
    const match = name.match(/^(.+?)\s*[（(]([^()（）]+)[）)]\s*$/u);
    return match ? [match[1].trim(), match[2].trim()] : [name, ""];
  }

  function characterRankingIcon(key) {
    if (key !== "detail") {
      const image = node("img", "character-ranking-client-icon");
      image.src = "./assets/client-ranking-menu.png";
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      image.width = 36; image.height = 36;
      return image;
    }
    const type = "detail";
    const paths = {
      detail: "M5 3h10l4 4v14H5zM14 3v5h5M8 16h2v2H8zm4-3h2v5h-2zm4-2h1v7h-1z",
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 26");
    svg.setAttribute("class", `character-ranking-icon character-ranking-icon-${type}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", paths[type]);
    svg.append(path);
    return svg;
  }

  function resolvePveCombatPower(data) {
    const currentType = normalizeLoadoutType(data?.currentLoadoutType);
    if (currentType === "PVE") {
      return Math.max(0, Math.trunc(number(data?.info?.profile?.combatPower)));
    }
    return Math.max(0, Math.trunc(number(data?.loadouts?.PVE?.profile?.combatPower)));
  }

  async function loadCharacterRankings(data) {
    if (currentOfficialRegion() === "ww") return loadGlobalCharacterRankings(data);
    const pveCombatPower = resolvePveCombatPower(data);
    const profile = data?.info?.profile || {};
    const params = new URLSearchParams(window.location.search);
    const characterName = String(profile?.characterName || params.get("name") || "").trim();
    const queryServerId = Number(params.get("serverId"));
    const serverId = Number(profile?.serverId) || queryServerId;
    const jobName = canonicalJobName(profile?.className);
    if (!characterName || !serverId || !jobName || !pveCombatPower) return [];
    const characterId = String(profile?.characterId || params.get("characterId") || "").trim();
    const rankingCacheApi = globalThis.NotMeterPublicRankingCache;
    if (typeof rankingCacheApi?.load !== "function" ||
        typeof rankingCacheApi?.loadCharacterRankings !== "function") {
      throw new Error("public ranking cache unavailable");
    }
    const metadata = await rankingCacheApi.load(false);
    const payload = await rankingCacheApi.loadCharacterRankings(metadata.generatedAt, false);
    const [nameToken, officialToken] = await Promise.all([
      buildPublicRankerLookupToken(
        currentOfficialRegion() === "tw" ? `[TW] ${characterName}` : characterName,
        serverId, jobName, pveCombatPower),
      buildPublicOfficialRankerLookupToken(characterId, jobName, pveCombatPower),
    ]);
    const results = [
      ...resolveCharacterRankingRows(payload.rankers, "allTime", nameToken, officialToken, payload),
      ...resolveCharacterRankingRows(payload.weeklyRankers, "weekly", nameToken, officialToken, payload),
    ];
    const bestByPeriodDungeonAndBoss = new Map();
    for (const row of results) {
      const key = `${row.periodKey}|${row.dungeonKey}|${row.bossIndex}`;
      const current = bestByPeriodDungeonAndBoss.get(key);
      if (!current || row.rank < current.rank || (row.rank === current.rank && row.dps > current.dps)) {
        bestByPeriodDungeonAndBoss.set(key, row);
      }
    }
    const rows = [...bestByPeriodDungeonAndBoss.values()].sort((left, right) =>
      (left.periodKey === right.periodKey ? 0 : left.periodKey === "allTime" ? -1 : 1) ||
      left.dungeonOrder - right.dungeonOrder || left.bossIndex - right.bossIndex ||
      left.rank - right.rank || right.dps - left.dps);
    const identity = { name: currentOfficialRegion() === "tw" ? `[TW] ${characterName}` : characterName, serverId, job: jobName };
    for (const row of rows) Object.assign(row, {
      name: identity.name, serverId, job: jobName, detailRegion: currentOfficialRegion(),
      detailGeneration: String(metadata.generatedAt),
    });
    return rows;
  }

  async function loadGlobalCharacterRankings(data) {
    const api = globalThis.NotMeterGlobalRanking;
    if (!api?.characterRows) throw new Error("Global ranking cache unavailable");
    const profile = data?.info?.profile || {};
    const params = new URLSearchParams(window.location.search);
    const locale = state.locale;
    const identity = {
      name: String(profile.characterName || params.get("name") || "").trim(),
      serverId: Number(profile.serverId) || Number(params.get("serverId")),
      characterId: String(profile.characterId || params.get("characterId") || "").trim(),
      globalRegion: currentGlobalRegion(params),
      job: canonicalJobName(profile.className),
    };
    await api.load();
    if (!api.state.data && !api.state.pending) throw new Error("Global ranking cache unavailable");
    if (!api.state.data) {
      const error = new Error("Global rankings pending");
      error.pending = true;
      throw error;
    }
    const label = names => names[locale] || names.en;
    return api.characterRows(identity).map(row => {
      const dungeon = api.catalog.dungeons[row.dungeonOrder];
      const boss = dungeon.bosses[row.bossIndex - 1];
      return {
        ...row, periodKey: row.period === "all" ? "allTime" : "weekly", cpTierLabel: "", rankingValue: row.dps, rankingUnit: "DPS",
        dungeonName: `${label(dungeon.names)} (${(api.copy[locale] || api.copy.en)[dungeon.kind]})`,
        bossName: dungeon.targets ? api.targetName(row) : label(boss.names),
        detailGeneration: String(api.state.data.generatedAt), detailRoot: api.state.pagesRoot, detailRegion: "ww",
      };
    });
  }

  function resolveCharacterRankingRows(entries, periodKey, nameToken, officialToken, metadata) {
    if (!nameToken && !officialToken) return [];
    const matched = (Array.isArray(entries) ? entries : []).filter(entry =>
      (String(entry?.T || "") === nameToken && (!officialToken || !entry?.O)) ||
      (officialToken && String(entry?.O || "") === officialToken));
    const dungeons = Array.isArray(metadata?.dungeons) ? metadata.dungeons : [];
    const cpTiers = Array.isArray(metadata?.cpTiers) ? metadata.cpTiers : [];
    const rows = [];
    for (const entry of matched) {
      for (const placement of [entry, ...(Array.isArray(entry?.A) ? entry.A : [])]) {
        const dungeonOrder = Number(placement?.D);
        const bossIndex = Number(placement?.B);
        const dungeon = dungeons[dungeonOrder];
        const dungeonKey = String(dungeon?.key || "");
        const rank = Number(placement?.R);
        const dps = number(placement?.P);
        if (!dungeonKey || !Number.isInteger(bossIndex) || bossIndex < 1 ||
            rank < 1 || rank > 20 || dps <= 0) continue;
        if ((dungeonKey === "sorrow-snowfield-normal" || dungeonKey === "sorrow-snowfield-hard") && bossIndex > 2) continue;
        const combatPower = Math.max(0, Math.trunc(number(placement?.C)));
        const tierIndex = resolveRankerCombatPowerTierIndex(combatPower);
        const cpTier = cpTiers.find(tier => Number(tier?.index) === tierIndex);
        rows.push({
          rank,
          dps,
          combatPower,
          durationSeconds: number(placement?.U),
          rankingValue: dungeonKey === "nightmare-atheron-10" ? number(placement?.U)
            : periodKey === "weekly" ? number(placement?.N) : dps,
          rankingUnit: dungeonKey === "nightmare-atheron-10" ? "s" : periodKey === "weekly" ? "nDPS" : "DPS",
          dungeonKey,
          dungeonName: localizeGameName(dungeon?.displayName || dungeonKey),
          bossName: cleanBossName(localizeGameName(dungeon?.bossNames?.[bossIndex - 1] || "—", "mob")),
          cpTierLabel: String(cpTier?.label || ""),
          dungeonOrder,
          bossIndex,
          periodKey,
        });
      }
    }
    return rows;
  }

  function resolveRankerCombatPowerTierIndex(combatPower) {
    const value = Math.trunc(Number(combatPower) || 0);
    if (value <= 0) return -1;
    if (value < 400_000) return 100;
    if (value >= 2_000_000) return 165;
    return 101 + Math.floor((value - 400_000) / 25_000);
  }

  async function buildPublicRankerLookupToken(characterName, serverId, jobName, combatPower) {
    const normalizedName = String(characterName || "").trim().normalize("NFC").toUpperCase();
    const normalizedJob = canonicalJobName(jobName).normalize("NFC");
    const tierIndex = resolveRankerCombatPowerTierIndex(combatPower);
    if (!normalizedName || !normalizedJob || Number(serverId) <= 0 || tierIndex < 0) return "";
    return publicRankerToken([
      "notmeter-public-ranker-identity-v1",
      String(Math.trunc(Number(serverId))),
      normalizedName,
      normalizedJob,
      String(tierIndex),
    ].join("\n"));
  }

  async function buildPublicOfficialRankerLookupToken(characterId, jobName, combatPower) {
    const normalizedCharacterId = normalizeOfficialCharacterId(characterId);
    const normalizedJob = canonicalJobName(jobName).normalize("NFC");
    const tierIndex = resolveRankerCombatPowerTierIndex(combatPower);
    if (!normalizedCharacterId || !normalizedJob || tierIndex < 0) return "";
    return publicRankerToken([
      "notmeter-public-ranker-character-id-v1",
      normalizedCharacterId,
      normalizedJob,
      String(tierIndex),
    ].join("\n"));
  }

  function normalizeOfficialCharacterId(value) {
    try {
      const normalized = decodeURIComponent(String(value || "").trim());
      return normalized.length >= 16 && normalized.length <= 128 &&
        /^[A-Za-z0-9_+\/=\-]+$/.test(normalized) ? normalized : "";
    } catch {
      return "";
    }
  }

  async function publicRankerToken(canonical) {
    if (!globalThis.crypto?.subtle) throw new Error("secure hash unavailable");
    const digest = new Uint8Array(await globalThis.crypto.subtle.digest(
      "SHA-256", new TextEncoder().encode(canonical)));
    let binary = "";
    for (const value of digest.subarray(0, 16)) binary += String.fromCharCode(value);
    return btoa(binary).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }

  function cleanBossName(value) {
    return String(value || "—")
      .replace(/^\s*\d+\s*(?:네임드|보스|首領|Boss)\s*(?:[·:：-]\s*)?/i, "")
      .trim() || "—";
  }

  function renderStats(statList) {
    const copy = currentCopy();
    const section = createSection("character-stats", "ALL STATS", copy.stats, copy.statsDescription);
    const wheel = node("div", "character-stat-wheel");
    wheel.append(node("div", "character-stat-orbit-lines"));
    const coreRing = node("div", "character-core-ring");
    const divineRing = node("div", "character-divine-ring");
    const coreStats = statList.filter(item => CORE_STAT_TYPES.has(item.type));
    const divineStats = statList.filter(item => DIVINE_STAT_TYPES.has(item.type));
    for (const [index, stat] of coreStats.entries()) coreRing.append(renderOrbitStat(stat, "core", index));
    for (const [index, stat] of divineStats.entries()) divineRing.append(renderOrbitStat(stat, "divine", index));
    wheel.append(coreRing, divineRing);
    section.append(wheel);
    return section;
  }

  function renderOrbitStat(stat, kind, index) {
    const item = node("div", `character-orbit-stat ${kind} stat-position-${index}`);
    const descriptions = Array.isArray(stat.statSecondList) ? stat.statSecondList : [];
    const sigil = node("span", `character-stat-sigil stat-sigil-${stat.type}`);
    sigil.setAttribute("aria-hidden", "true");
    item.append(sigil);
    const copy = node("span", "character-orbit-copy");
    const statName = globalThis.NotMeterClientTerms?.labels?.[state.locale]?.[stat.type]
      || localizeOfficialText(stat.name || "—");
    copy.append(textNode("b", statName.replace(/\[[^\]]+\]/g, "").trim()),
      textNode("strong", formatNumber(stat.value)));
    item.append(copy);
    globalThis.NotMeterStatTooltip?.attach(item, {
      name: statName.replace(/\[[^\]]+\]/g, "").trim(),
      value: formatNumber(stat.value),
      effects: descriptions.map(localizeOfficialText),
    });
    return item;
  }

  function renderEquipment(items, details, loadoutData, selectedLoadoutType) {
    const copy = currentCopy();
    const section = createSection("character-equipment", "EQUIPMENT LOADOUT", copy.equipment, copy.equipmentNote,
      formatCopy("itemCount", { value: items.length }));
    const sorted = items.slice().sort((a, b) => Number(a.slotPos) - Number(b.slotPos));
    const gear = sorted.filter(item => !ACCESSORY_SLOT_TYPES.has(String(item.slotPosName)));
    const accessories = sorted.filter(item => ACCESSORY_SLOT_TYPES.has(String(item.slotPosName)))
      .sort((a, b) => equipmentDetailPriority(b, details) - equipmentDetailPriority(a, details) ||
        Number(a.slotPos) - Number(b.slotPos));
    const tabs = node("div", "equipment-tabs");
    tabs.setAttribute("role", "tablist");
    const stickyControls = node("div", "equipment-sticky-controls");
    const panels = node("div", "equipment-tab-panels");
    const groups = [
      ["gear", copy.gearTab, gear],
      ["accessories", copy.accessoryTab, accessories],
    ];
    const selectedEquipmentTab = groups.some(([key]) => key === state.activeEquipmentTab)
      ? state.activeEquipmentTab : "gear";
    for (const [index, [key, label, groupItems]] of groups.entries()) {
      const selected = key === selectedEquipmentTab;
      const button = node("button", "equipment-tab");
      button.type = "button";
      button.dataset.equipmentTab = key;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(selected));
      button.append(textNode("span", label), textNode("strong", String(groupItems.length)));
      const list = node("div", "equipment-list");
      list.dataset.equipmentPanel = key;
      list.setAttribute("role", "tabpanel");
      list.hidden = !selected;
      for (const item of groupItems) list.append(renderEquipmentCard(item, details[String(item.slotPos)] || {}));
      button.addEventListener("click", () => {
        state.activeEquipmentTab = key;
        for (const tab of tabs.querySelectorAll(".equipment-tab")) {
          tab.setAttribute("aria-selected", String(tab === button));
        }
        for (const panel of panels.querySelectorAll(".equipment-list")) {
          panel.hidden = panel.dataset.equipmentPanel !== key;
        }
      });
      tabs.append(button);
      panels.append(list);
    }
    const sectionHead = section.querySelector(".character-section-head");
    const headActions = node("div", "character-section-actions");
    const itemCount = sectionHead?.querySelector(".character-section-count");
    if (itemCount) headActions.append(itemCount);
    const snapshotStatus = node("span", "equipment-snapshot-status");
    snapshotStatus.setAttribute("role", "status");
    snapshotStatus.setAttribute("aria-live", "polite");
    const snapshotButton = node("button", "equipment-snapshot-button");
    snapshotButton.type = "button";
    const snapshotIcon = node("span", "equipment-snapshot-button-icon");
    snapshotIcon.setAttribute("aria-hidden", "true");
    snapshotButton.append(snapshotIcon, textNode("span", copy.equipmentSnapshot));
    const currentType = normalizeLoadoutType(loadoutData?.currentLoadoutType);
    const waitingForDetails = selectedLoadoutType === currentType && loadoutData?.complete === false;
    snapshotButton.disabled = waitingForDetails;
    if (waitingForDetails) snapshotButton.title = copy.equipmentSnapshotWaiting;
    snapshotButton.addEventListener("click", () => void copyEquipmentSnapshot(snapshotButton, snapshotStatus));
    if (currentOfficialRegion() !== "ww") headActions.append(snapshotStatus, snapshotButton);
    sectionHead?.append(headActions);
    if (currentOfficialRegion() !== "ww") stickyControls.append(renderCompactLoadoutSelector(loadoutData, selectedLoadoutType));
    stickyControls.append(tabs);
    section.append(stickyControls,
      renderSoulSkillSummary(items, details), renderMagicStoneSummary(items, details), panels);
    return section;
  }

  function renderSoulSkillSummary(items, details) {
    const copy = currentCopy();
    const rows = collectSoulSkillTotals(items, details);
    const summary = node("section", "equipment-soul-skill-summary");
    const heading = node("div", "equipment-summary-heading");
    heading.append(textNode("strong", copy.soulSkillTotal), textNode("span", copy.soulSkillTotalNote));
    const grid = node("div", "equipment-soul-skill-grid");
    for (const row of rows) {
      const item = node("div", "equipment-soul-skill-item");
      item.append(createImage(row.icon, ""));
      const identity = node("span");
      identity.append(textNode("strong", row.name), textNode("small", copy.equippedItems.replace("{value}", row.count)));
      item.append(identity, textNode("b", copy.soulSkillLevel.replace("{value}", row.level)));
      grid.append(item);
    }
    if (!rows.length) grid.append(textNode("span", copy.emptyOption, "empty-detail"));
    summary.append(heading, grid);
    return summary;
  }

  function renderMagicStoneSummary(items, details) {
    const copy = currentCopy();
    const summary = node("section", "equipment-stone-summary");
    const heading = node("div", "equipment-summary-heading");
    heading.append(textNode("strong", copy.stoneTotal), textNode("span", copy.stoneTotalNote));
    const rows = collectMagicStoneTotals(items, details);
    const grid = node("div", "equipment-stone-summary-grid");
    for (const row of rows) {
      const item = node("div", `equipment-stone-summary-item${row.isAmplification ? " amplification" : ""}`);
      item.append(
        textNode("span", row.name),
        textNode("strong", row.valueText),
        textNode("small", row.detailText),
      );
      grid.append(item);
    }
    if (!rows.length) grid.append(textNode("span", copy.emptyOption, "empty-detail"));
    summary.append(heading, grid);
    return summary;
  }

  function collectSoulSkillTotals(items, details) {
    const totals = new Map();
    for (const item of items) {
      const detail = details[String(item.slotPos)] || {};
      for (const skill of Array.isArray(detail.subSkills) ? detail.subSkills : []) {
        const name = localizeOfficialText(skill?.name, skill?.id);
        if (!name) continue;
        const key = String(skill.id || name);
        const current = totals.get(key) || { name, icon: skill.icon || "", level: 0, count: 0 };
        current.level += number(skill.level);
        current.count += 1;
        if (!current.icon && skill.icon) current.icon = skill.icon;
        totals.set(key, current);
      }
    }
    return [...totals.values()].sort((left, right) =>
      right.level - left.level || left.name.localeCompare(right.name, "ko"));
  }

  function collectMagicStoneTotals(items, details) {
    const totals = new Map();
    for (const item of items) {
      const detail = details[String(item.slotPos)] || {};
      for (const stone of Array.isArray(detail.magicStoneStat) ? detail.magicStoneStat : []) {
        const name = localizeOfficialText(stone?.name);
        const rawValue = String(stone?.value ?? "").replace(/,/g, "");
        const match = rawValue.match(/[+-]?\d+(?:\.\d+)?/);
        if (!name || !match) continue;
        const unit = rawValue.includes("%") ? "%" : "";
        const key = `${name}|${unit}`;
        const current = totals.get(key) || { name, sourceName: String(stone.name || name), unit, value: 0, count: 0 };
        current.value += Number(match[0]);
        current.count += 1;
        totals.set(key, current);
      }
    }
    return [...totals.values()].sort((left, right) => {
      const priority = stoneEffectPriority(left) - stoneEffectPriority(right);
      if (priority) return priority;
      if (stoneEffectPriority(left) === 0) {
        const leftPercent = left.unit === "%" ? left.value : left.value / 100;
        const rightPercent = right.unit === "%" ? right.value : right.value / 100;
        if (leftPercent !== rightPercent) return rightPercent - leftPercent;
      }
      return left.name.localeCompare(right.name, "ko");
    })
      .map(row => {
        const isAmplification = stoneEffectPriority(row) === 0;
        const shouldConvert = isAmplification && row.unit !== "%";
        const displayedValue = shouldConvert ? row.value / 100 : row.value;
        const value = Number.isInteger(displayedValue)
          ? String(displayedValue)
          : displayedValue.toFixed(2).replace(/\.?0+$/, "");
        return {
          ...row,
          isAmplification,
          valueText: `+${value}${shouldConvert ? "%" : row.unit}`,
          detailText: shouldConvert
            ? formatCopy("stoneOriginal", { count: row.count, value: row.value })
            : formatCopy("stoneCount", { count: row.count }),
        };
      });
  }

  async function copyEquipmentSnapshot(button, status) {
    if (currentOfficialRegion() === "ww") return;
    const copy = currentCopy();
    const originalLabel = copy.equipmentSnapshot;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    const label = button.querySelector("span:last-child");
    if (label) label.textContent = copy.equipmentSnapshotBusy;
    status.textContent = "";
    status.className = "equipment-snapshot-status";

    let blobPromise;
    try {
      if (!globalThis.NotMeterEquipmentSnapshot?.createBlob) throw new Error("Snapshot renderer unavailable");
      blobPromise = globalThis.NotMeterEquipmentSnapshot.createBlob(buildEquipmentSnapshotModel());
      if (!navigator.clipboard?.write || typeof globalThis.ClipboardItem !== "function") {
        throw new Error("Image clipboard unavailable");
      }
      await navigator.clipboard.write([
        new globalThis.ClipboardItem({ "image/png": blobPromise }),
      ]);
      showEquipmentSnapshotStatus(status, copy.equipmentSnapshotCopied, "success");
    } catch {
      try {
        const blob = await (blobPromise || globalThis.NotMeterEquipmentSnapshot.createBlob(buildEquipmentSnapshotModel()));
        downloadEquipmentSnapshot(blob);
        showEquipmentSnapshotStatus(status, copy.equipmentSnapshotDownloaded, "fallback");
      } catch {
        showEquipmentSnapshotStatus(status, copy.equipmentSnapshotFailed, "error");
      }
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      if (label) label.textContent = originalLabel;
    }
  }

  function buildEquipmentSnapshotModel() {
    const copy = currentCopy();
    const loadoutView = resolveLoadoutView(state.profile);
    const visibleData = loadoutView.data;
    const info = visibleData?.info || {};
    const profile = info.profile || {};
    const statList = Array.isArray(info.stat?.statList) ? info.stat.statList : [];
    const itemLevel = statList.find(item => item.type === "ItemLevel")?.value || 0;
    const allEquipment = Array.isArray(visibleData?.equipment?.equipment?.equipmentList)
      ? visibleData.equipment.equipment.equipmentList : [];
    const items = allEquipment.filter(item => !String(item.slotPosName).startsWith("Arcana"))
      .sort((left, right) => Number(left.slotPos) - Number(right.slotPos));
    const details = visibleData?.itemDetails || {};
    const gear = items.filter(item => !ACCESSORY_SLOT_TYPES.has(String(item.slotPosName)));
    const accessories = items.filter(item => ACCESSORY_SLOT_TYPES.has(String(item.slotPosName)))
      .sort((left, right) => equipmentDetailPriority(right, details) - equipmentDetailPriority(left, details) ||
        Number(left.slotPos) - Number(right.slotPos));
    const loadoutType = loadoutView.type || copy.currentLoadout;
    return {
      locale: state.locale,
      brandIcon: safeImageUrl("./assets/notmeter-icon.png?v=20260927-split"),
      jobIcon: safeImageUrl(jobIcon(profile.className)),
      characterName: profile.characterName || "—",
      serverName: characterServerName(profile) || "—",
      className: localizeOfficialText(profile.className) || "—",
      combatPowerText: `${formatNumber(profile.combatPower)} CP`,
      itemLevelText: formatNumber(itemLevel),
      loadoutType,
      updatedAtText: `${copy.updatedAt} ${formatDateTime(visibleData?.fetchedAt)}`,
      soulSkills: collectSoulSkillTotals(items, details).map(row => ({
        ...row,
        icon: safeImageUrl(row.icon),
        valueText: copy.soulSkillLevel.replace("{value}", row.level),
      })),
      stones: collectMagicStoneTotals(items, details).map(row => ({
        ...row,
        highlight: row.isAmplification,
      })),
      gear: gear.map(item => buildEquipmentSnapshotItem(item, details[String(item.slotPos)] || {})),
      accessories: accessories.map(item => buildEquipmentSnapshotItem(item, details[String(item.slotPos)] || {})),
      labels: {
        snapshotKicker: copy.snapshotKicker,
        combatPower: copy.combatPower,
        itemLevel: copy.itemLevel,
        soulSkills: copy.snapshotSoulSkills,
        soulSkillsNote: copy.snapshotSoulSkillsNote,
        manastoneTotals: copy.snapshotManastones,
        manastoneTotalsNote: copy.snapshotManastonesNote,
        gear: copy.gearTab,
        accessories: copy.accessoryTab,
        itemSoul: copy.snapshotItemSoul,
        itemStones: copy.snapshotItemStones,
        itemCount: copy.itemCount,
        none: copy.none,
        footer: copy.snapshotFooter.replace("{loadout}", loadoutType),
      },
    };
  }

  function buildEquipmentSnapshotItem(item, detail) {
    const soulSkills = (Array.isArray(detail?.subSkills) ? detail.subSkills : [])
      .map(skill => `${localizeOfficialText(skill.name, skill.id) || "—"} +${number(skill.level)}`);
    const soulStats = (Array.isArray(detail?.subStats) ? detail.subStats : [])
      .map(statParts)
      .filter(stat => stat.name || stat.value)
      .map(stat => `${stat.name} ${stat.value}`.trim());
    const magicStones = (Array.isArray(detail?.magicStoneStat) ? detail.magicStoneStat : [])
      .map((stone, index) => equipmentSnapshotStone(stone, index))
      .sort((left, right) => left.priority - right.priority ||
        (left.priority === 0 ? right.percentValue - left.percentValue : 0) ||
        left.index - right.index)
      .map(stone => stone.text);
    const godStones = (Array.isArray(detail?.godStoneStat) ? detail.godStoneStat : [])
      .map(stone => `${localizeOfficialText(stone.name) || "—"} ${String(stone.value || "")}`.trim());
    const exceedLevel = Math.max(0, Math.trunc(number(item.exceedLevel)));
    return {
      name: localizeOfficialText(item.name) || "—",
      icon: safeImageUrl(item.icon),
      grade: String(item.grade || "Common"),
      enhanceText: `+${number(item.enchantLevel)}`,
      exceedLevel,
      slotName: equipmentSnapshotSlotLabel(item.slotPosName),
      soulText: [...soulSkills, ...soulStats].join(" · "),
      stoneText: [...magicStones, ...godStones].join(" · "),
    };
  }

  function equipmentSnapshotStone(stone, index) {
    const name = localizeOfficialText(stone?.name) || "—";
    const rawValue = String(stone?.value || "").replace(/,/g, "").trim();
    const match = rawValue.match(/[+-]?\d+(?:\.\d+)?/);
    const priority = stoneEffectPriority({ name });
    let valueText = rawValue;
    let percentValue = 0;
    if (match) {
      const numericValue = Number(match[0]);
      percentValue = rawValue.includes("%") ? numericValue : numericValue / 100;
      if (priority === 0 && !rawValue.includes("%")) {
        const converted = Number.isInteger(percentValue)
          ? String(percentValue)
          : percentValue.toFixed(2).replace(/\.?0+$/, "");
        valueText = `${percentValue > 0 ? "+" : ""}${converted}%`;
      }
    }
    return {
      index,
      priority,
      percentValue,
      text: `${name} ${valueText}`.trim(),
    };
  }

  function equipmentSnapshotSlotLabel(value) {
    const slot = String(value || "").trim();
    const labels = {
      ko: {
        MainHand: "무기", SubHand: "가더", Helmet: "투구", Head: "투구", Shoulder: "견갑",
        Torso: "상의", Pants: "하의", Gloves: "장갑", Boots: "장화", Cape: "망토",
        Pendant: "펜던트", Necklace: "목걸이", Earring1: "귀걸이 1", Earring2: "귀걸이 2",
        Ring1: "반지 1", Ring2: "반지 2", Bracelet1: "팔찌 1", Bracelet2: "팔찌 2",
        Belt: "허리띠", Waist: "허리띠", Shoes: "장화", Brooch1: "브로치 1", Brooch2: "브로치 2", Amulet: "아뮬렛",
        Rune1: "룬 1", Rune2: "룬 2", Seal1: "인장 1", Seal2: "인장 2",
      },
      en: {
        MainHand: "Main hand", SubHand: "Off hand", Helmet: "Helmet", Head: "Helmet", Shoulder: "Shoulders",
        Torso: "Chest", Pants: "Legs", Gloves: "Gloves", Boots: "Boots", Cape: "Cape",
        Pendant: "Pendant", Necklace: "Necklace", Earring1: "Earring 1", Earring2: "Earring 2",
        Ring1: "Ring 1", Ring2: "Ring 2", Bracelet1: "Bracelet 1", Bracelet2: "Bracelet 2",
        Belt: "Belt", Waist: "Belt", Shoes: "Boots", Brooch1: "Brooch 1", Brooch2: "Brooch 2", Amulet: "Amulet",
        Rune1: "Rune 1", Rune2: "Rune 2", Seal1: "Seal 1", Seal2: "Seal 2",
      },
      "zh-TW": {
        MainHand: "主手武器", SubHand: "副手武器", Helmet: "頭盔", Shoulder: "護肩",
        Torso: "上衣", Pants: "下衣", Gloves: "手套", Boots: "鞋子", Cape: "披風",
        Pendant: "墜飾", Necklace: "項鍊", Earring1: "耳環 1", Earring2: "耳環 2",
        Ring1: "戒指 1", Ring2: "戒指 2", Bracelet1: "手鐲 1", Bracelet2: "手鐲 2",
        Belt: "腰帶", Brooch1: "胸針 1", Brooch2: "胸針 2", Amulet: "護符",
        Rune1: "符文 1", Rune2: "符文 2", Seal1: "印章 1", Seal2: "印章 2",
      },
    };
    if (globalThis.NotMeterI18n?.supported.indexOf(state.locale) > 2) {
      const name = labels.ko[slot] || labels.en[slot] || slot;
      const parts = name.match(/^(.*?)(\s+\d+)$/);
      return parts ? globalThis.NotMeterI18n.game(parts[1], state.locale) + parts[2] : globalThis.NotMeterI18n.game(name, state.locale);
    }
    return labels[state.locale]?.[slot] || labels.ko[slot] ||
      slot.replace(/([a-z])([A-Z0-9])/g, "$1 $2");
  }

  function downloadEquipmentSnapshot(blob) {
    const profile = state.profile?.info?.profile || {};
    const fileName = `${String(profile.characterName || "NotMeter").replace(/[\\/:*?"<>|]/g, "-")}-장비-스냅샷.png`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function showEquipmentSnapshotStatus(status, message, kind) {
    status.textContent = message;
    status.className = `equipment-snapshot-status ${kind}`;
    window.setTimeout(() => {
      if (status.textContent === message) {
        status.textContent = "";
        status.className = "equipment-snapshot-status";
      }
    }, 5000);
  }

  function appendCharacterSnapshotAction(section, label, waiting, waitingMessage, handler, extraClass) {
    const head = section.querySelector(".character-section-head");
    if (!head) return;
    let actions = head.querySelector(".character-section-actions");
    if (!actions) {
      actions = node("div", "character-section-actions");
      const count = head.querySelector(".character-section-count");
      if (count) actions.append(count);
      head.append(actions);
    }
    const status = node("span", "equipment-snapshot-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const button = node("button", `equipment-snapshot-button ${extraClass}`);
    button.type = "button";
    const icon = node("span", "equipment-snapshot-button-icon");
    icon.setAttribute("aria-hidden", "true");
    button.append(icon, textNode("span", label));
    button.disabled = waiting;
    if (waiting && waitingMessage) button.title = waitingMessage;
    button.addEventListener("click", () => void handler(button, status));
    actions.append(status, button);
  }

  async function copySkillSnapshot(button, status) {
    const copy = currentCopy();
    await copyCharacterSnapshot(button, status, {
      label: copy.skillSnapshot,
      failed: copy.skillSnapshotFailed,
      renderer: "createSkillBlob",
      model: buildSkillSnapshotModel,
      suffix: "스킬-스냅샷",
    });
  }

  async function copyArcanaSnapshot(button, status) {
    const copy = currentCopy();
    await copyCharacterSnapshot(button, status, {
      label: copy.arcanaSnapshot,
      failed: copy.arcanaSnapshotFailed,
      renderer: "createArcanaBlob",
      model: buildArcanaSnapshotModel,
      suffix: "아르카나-스냅샷",
    });
  }

  async function copyCharacterSnapshot(button, status, options) {
    const copy = currentCopy();
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    const label = button.querySelector("span:last-child");
    if (label) label.textContent = copy.characterSnapshotBusy;
    status.textContent = "";
    status.className = "equipment-snapshot-status";

    let blobPromise;
    try {
      const createBlob = globalThis.NotMeterEquipmentSnapshot?.[options.renderer];
      if (typeof createBlob !== "function") throw new Error("Snapshot renderer unavailable");
      blobPromise = createBlob(options.model());
      if (!navigator.clipboard?.write || typeof globalThis.ClipboardItem !== "function") {
        throw new Error("Image clipboard unavailable");
      }
      await navigator.clipboard.write([
        new globalThis.ClipboardItem({ "image/png": blobPromise }),
      ]);
      showEquipmentSnapshotStatus(status, copy.characterSnapshotCopied, "success");
    } catch {
      try {
        const createBlob = globalThis.NotMeterEquipmentSnapshot?.[options.renderer];
        if (typeof createBlob !== "function") throw new Error("Snapshot renderer unavailable");
        const blob = await (blobPromise || createBlob(options.model()));
        downloadCharacterSnapshot(blob, options.suffix);
        showEquipmentSnapshotStatus(status, copy.characterSnapshotDownloaded, "fallback");
      } catch {
        showEquipmentSnapshotStatus(status, options.failed, "error");
      }
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      if (label) label.textContent = options.label;
    }
  }

  function buildSkillSnapshotModel() {
    const copy = currentCopy();
    const loadoutView = resolveLoadoutView(state.profile);
    const visibleData = loadoutView.data;
    const levels = currentCharacterTraits().levels;
    const skills = Array.isArray(visibleData?.equipment?.skill?.skillList)
      ? visibleData.equipment.skill.skillList.map(skill => ({ ...skill, skillLevel: levels?.get(Number(skill.id)) ?? skill.skillLevel })) : [];
    const groups = [
      [copy.activeSkills, skills.filter(skill => !["dp", "passive"].includes(String(skill.category).toLowerCase()))],
      [copy.stigmaSkills, skills.filter(skill => String(skill.category).toLowerCase() === "dp")],
      [copy.passiveSkills, skills.filter(skill => String(skill.category).toLowerCase() === "passive")],
    ].map(([name, rows]) => {
      rows.sort((left, right) => Number(right.skillLevel) - Number(left.skillLevel) ||
        String(left.name).localeCompare(String(right.name), "ko"));
      const totalLevel = rows.reduce((sum, skill) => sum + number(skill.skillLevel), 0);
      return {
        name,
        totalLevel,
        totalText: copy.snapshotSkillTotal.replace("{value}", formatNumber(totalLevel)),
        countText: copy.snapshotSkillCount.replace("{value}", rows.length),
        skills: rows.map(skill => ({
          name: localizeOfficialText(skill.name, skill.id) || "—",
          icon: safeImageUrl(skill.icon),
          levelText: `Lv.${number(skill.skillLevel)}`,
        })),
      };
    });
    return {
      ...buildCharacterSnapshotHeader(visibleData, loadoutView.type, copy.snapshotSkillKicker),
      headerMetric: {
        label: copy.snapshotSkillGrandTotal,
        valueText: `Lv.${formatNumber(groups.reduce((sum, group) => sum + group.totalLevel, 0))}`,
      },
      groups,
      labels: {
        snapshotKicker: copy.snapshotSkillKicker,
        combatPower: copy.combatPower,
        itemLevel: copy.itemLevel,
        none: copy.none,
        footer: copy.snapshotFooter.replace("{loadout}", loadoutView.type || copy.currentLoadout),
      },
    };
  }

  function buildArcanaSnapshotModel() {
    const copy = currentCopy();
    const loadoutView = resolveLoadoutView(state.profile);
    const visibleData = loadoutView.data;
    const allEquipment = Array.isArray(visibleData?.equipment?.equipment?.equipmentList)
      ? visibleData.equipment.equipment.equipmentList : [];
    const arcana = allEquipment.filter(item => String(item.slotPosName).startsWith("Arcana"))
      .sort((left, right) => Number(left.slotPos) - Number(right.slotPos));
    const details = visibleData?.itemDetails || {};
    const skillTotals = collectArcanaSkillTotals(arcana, details);
    return {
      ...buildCharacterSnapshotHeader(visibleData, loadoutView.type, copy.snapshotArcanaKicker),
      headerMetric: {
        label: copy.snapshotArcanaGrandTotal,
        valueText: `+${formatNumber(skillTotals.reduce((sum, row) => sum + row.level, 0))}`,
      },
      skillTotals: skillTotals.map(row => ({
        ...row,
        icon: safeImageUrl(row.icon),
        valueText: copy.soulSkillLevel.replace("{value}", row.level),
      })),
      statTotals: collectArcanaStatTotals(arcana, details),
      cards: arcana.map(item => buildArcanaSnapshotItem(item, details[String(item.slotPos)] || {})),
      labels: {
        snapshotKicker: copy.snapshotArcanaKicker,
        combatPower: copy.combatPower,
        itemLevel: copy.itemLevel,
        skillTotals: copy.snapshotArcanaSkills,
        skillTotalsNote: copy.snapshotArcanaSkillsNote,
        statTotals: copy.snapshotArcanaStats,
        statTotalsNote: copy.snapshotArcanaStatsNote,
        cards: copy.arcana,
        cardCount: copy.arcanaCards.replace("{value}", arcana.length),
        none: copy.none,
        footer: copy.snapshotFooter.replace("{loadout}", loadoutView.type || copy.currentLoadout),
      },
    };
  }

  function buildCharacterSnapshotHeader(visibleData, loadoutType, snapshotKicker) {
    const copy = currentCopy();
    const info = visibleData?.info || {};
    const profile = info.profile || {};
    const statList = Array.isArray(info.stat?.statList) ? info.stat.statList : [];
    const itemLevel = statList.find(item => item.type === "ItemLevel")?.value || 0;
    return {
      locale: state.locale,
      brandIcon: safeImageUrl("./assets/notmeter-icon.png?v=20260927-split"),
      jobIcon: safeImageUrl(jobIcon(profile.className)),
      characterName: profile.characterName || "—",
      serverName: characterServerName(profile) || "—",
      className: localizeOfficialText(profile.className) || "—",
      combatPowerText: `${formatNumber(profile.combatPower)} CP`,
      itemLevelText: formatNumber(itemLevel),
      loadoutType: loadoutType || copy.currentLoadout,
      updatedAtText: `${copy.updatedAt} ${formatDateTime(visibleData?.fetchedAt)}`,
      snapshotKicker,
    };
  }

  function collectArcanaStatTotals(items, details) {
    const copy = currentCopy();
    const totals = new Map();
    for (const item of items) {
      const detail = details[String(item.slotPos)] || {};
      const stats = [
        ...(Array.isArray(detail.mainStats) ? detail.mainStats : []),
        ...(Array.isArray(detail.subStats) ? detail.subStats : []),
      ];
      for (const stat of stats) {
        const name = localizeOfficialText(stat?.name);
        const base = snapshotNumericValue(stat?.value);
        const extra = snapshotNumericValue(stat?.extra);
        const unit = `${stat?.value ?? ""}${stat?.extra ?? ""}`.includes("%") ? "%" : "";
        if (!name || (!base && !extra)) continue;
        const key = `${stat?.id || name}|${unit}`;
        const current = totals.get(key) || { name, unit, base: 0, extra: 0, count: 0 };
        current.base += base;
        current.extra += extra;
        current.count += 1;
        totals.set(key, current);
      }
    }
    return [...totals.values()]
      .map(row => {
        const total = row.base + row.extra;
        return {
          ...row,
          valueText: snapshotSignedValue(total, row.unit),
          detailText: row.extra
            ? formatCopy("snapshotArcanaStatBreakdown", {
              base: snapshotPlainValue(row.base, row.unit),
              extra: snapshotPlainValue(row.extra, row.unit),
            })
            : copy.snapshotArcanaStatCards.replace("{value}", row.count),
        };
      })
      .sort((left, right) => right.base + right.extra - left.base - left.extra ||
        left.name.localeCompare(right.name, "ko"));
  }

  function buildArcanaSnapshotItem(item, detail) {
    const stats = [
      ...(Array.isArray(detail.mainStats) ? detail.mainStats : []),
      ...(Array.isArray(detail.subStats) ? detail.subStats : []),
    ].map(statParts).filter(stat => stat.name || stat.value)
      .map(stat => `${stat.name} ${stat.value}`.trim());
    const skills = (Array.isArray(detail.subSkills) ? detail.subSkills : []).map(skill => ({
      name: localizeOfficialText(skill.name, skill.id) || "—",
      icon: safeImageUrl(skill.icon),
      levelText: `+${number(skill.level)}`,
    }));
    return {
      name: localizeOfficialText(item.name) || "—",
      icon: safeImageUrl(item.icon),
      grade: String(item.grade || "Common"),
      enhanceText: `+${number(item.enchantLevel)}`,
      slotText: String(item.slotPosName || "").replace(/^Arcana/i, `${currentCopy().arcana} `),
      stats,
      skills,
    };
  }

  function snapshotNumericValue(value) {
    const match = String(value ?? "").replace(/,/g, "").match(/[+-]?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : 0;
  }

  function snapshotPlainValue(value, unit) {
    const text = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
    return `${text}${unit}`;
  }

  function snapshotSignedValue(value, unit) {
    return `${value > 0 ? "+" : ""}${snapshotPlainValue(value, unit)}`;
  }

  function downloadCharacterSnapshot(blob, suffix) {
    const profile = state.profile?.info?.profile || {};
    const safeName = String(profile.characterName || "NotMeter").replace(/[\\/:*?"<>|]/g, "-");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeName}-${suffix}.png`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function equipmentDetailPriority(item, details) {
    const detail = details[String(item.slotPos)] || {};
    const hasSoulEngraving = (Array.isArray(detail.subStats) && detail.subStats.length > 0) ||
      (Array.isArray(detail.subSkills) && detail.subSkills.length > 0);
    const hasStone = (Array.isArray(detail.magicStoneStat) && detail.magicStoneStat.length > 0) ||
      (Array.isArray(detail.godStoneStat) && detail.godStoneStat.length > 0);
    return Number(hasSoulEngraving) + Number(hasStone);
  }

  function renderEquipmentCard(item, detail) {
    const copy = currentCopy();
    const card = node("article", `equipment-card equipment-grade-${item.grade || "Common"}`);
    const identity = node("div", "equipment-identity");
    const icon = node("div", "equipment-icon");
    const itemName = localizeOfficialText(item.name);
    icon.append(createImage(item.icon, itemName));
    const itemCopy = node("div", "equipment-copy");
    const title = node("div", "equipment-title");
    if (number(item.exceedLevel)) {
      const exceed = node("span", "equipment-exceed-mark");
      exceed.setAttribute("aria-label", formatCopy("exceedStage", { value: number(item.exceedLevel) }));
      exceed.append(textNode("span", String(number(item.exceedLevel))));
      title.append(exceed);
    }
    title.append(
      textNode("span", `+${number(item.enchantLevel)}`, "equipment-enhance-value"),
      textNode("strong", itemName || "—"),
    );
    const basicOptions = node("div", "equipment-identity-options");
    basicOptions.append(textNode("h6", copy.basicOptions));
    const basicList = node("ul");
    const optionLines = basicItemOptions(detail);
    if (!optionLines.length) basicList.append(textNode("li", copy.emptyOption, "empty-detail"));
    for (const line of optionLines.slice(0, 12)) basicList.append(textNode("li", line));
    basicOptions.append(basicList);
    itemCopy.append(title, basicOptions);
    identity.append(icon, itemCopy);
    card.append(identity,
      renderSoulEngravingColumn(copy.soulEngraving, detail),
      renderStoneColumn(copy.manastones, detail),
    );
    return card;
  }

  function renderEquipmentColumn(title, lines) {
    const column = node("div", "equipment-detail-column");
    column.append(textNode("h6", title));
    const list = node("ul");
    if (!lines.length) list.append(textNode("li", currentCopy().emptyOption, "empty-detail"));
    for (const line of lines.slice(0, 12)) list.append(textNode("li", line));
    column.append(list);
    return column;
  }

  function renderSoulEngravingColumn(title, detail) {
    const column = node("div", "equipment-detail-column equipment-soul-column");
    column.append(textNode("h6", title));
    const list = node("ul");
    const stats = (Array.isArray(detail?.subStats) ? detail.subStats : [])
      .map(statParts)
      .filter(stat => stat.name || stat.value)
      .slice(0, 12);
    for (const stat of stats) {
      const option = node("li", "equipment-soul-stat");
      option.append(textNode("span", localizeOfficialText(stat.name) || "—"),
        textNode("b", stat.value || "—"));
      list.append(option);
    }
    const skills = (Array.isArray(detail?.subSkills) ? detail.subSkills : [])
      .slice(0, Math.max(0, 12 - stats.length));
    for (const skill of skills) {
      const option = node("li", "equipment-skill-option");
      option.append(createImage(skill.icon, ""),
        textNode("span", localizeOfficialText(skill.name, skill.id) || "—"),
        textNode("b", `Lv.${number(skill.level)}`));
      list.append(option);
    }
    if (!stats.length && !skills.length) list.append(textNode("li", currentCopy().emptyOption, "empty-detail"));
    column.append(list);
    return column;
  }

  function renderStoneColumn(title, detail) {
    const column = node("div", "equipment-detail-column equipment-stone-column");
    column.append(textNode("h6", title));
    const stones = node("div", "equipment-stone-grid");
    const entries = [
      ...(Array.isArray(detail?.magicStoneStat) ? detail.magicStoneStat.map(stone => ({ ...stone, kind: "magic" })) : []),
      ...(Array.isArray(detail?.godStoneStat) ? detail.godStoneStat.map(stone => ({ ...stone, kind: "god" })) : []),
    ].sort(compareStones);
    if (!entries.length) stones.append(textNode("span", currentCopy().emptyOption, "empty-detail"));
    for (const stone of entries.slice(0, 8)) {
      const tile = node("div", `equipment-stone equipment-stone-grade-${stone.grade || "Common"}${stone.kind === "god" ? " godstone" : stoneEffectPriority(stone) === 0 ? " amplification" : ""}`);
      const stoneName = localizeOfficialText(stone.name);
      tile.append(createStoneImage(stone.icon, stoneName));
      const stoneCopy = node("span");
      stoneCopy.append(textNode("b", stoneName || "—"));
      if (stone.value) stoneCopy.append(textNode("em", String(stone.value)));
      tile.append(stoneCopy);
      stones.append(tile);
    }
    column.append(stones);
    return column;
  }

  function createStoneImage(src, alt) {
    // Official fallback, kept locally: https://assets.playnccdn.com/static-aion2/item/img/stone.png
    const fallback = new URL("./assets/character-stone.png", window.location.href).href;
    const image = createImage(src || fallback, alt);
    image.addEventListener("error", () => {
      if (image.src !== fallback) image.src = fallback;
      else image.style.visibility = "hidden";
    });
    return image;
  }

  function compareStones(left, right) {
    return Number(left.kind === "god") - Number(right.kind === "god") ||
      stoneGradePriority(right) - stoneGradePriority(left) ||
      stoneEffectPriority(left) - stoneEffectPriority(right) ||
      String(left.name || "").localeCompare(String(right.name || ""), "ko") ||
      String(left.value || "").localeCompare(String(right.value || ""), "ko");
  }

  function stoneGradePriority(stone) {
    const grade = String(stone?.grade || "Common");
    return ITEM_GRADE_PRIORITY[grade] || 0;
  }

  function stoneEffectPriority(stone) {
    const name = String(stone?.sourceName || stone?.name || "").replace(/\s+/g, " ");
    if (/피해\s*(?:량\s*)?증폭|Damage\s*(?:Amplification|Boost)|傷害增幅/i.test(name)) return 0;
    if (/공격력|Attack(?:\s*Power)?|攻擊力/i.test(name)) return 1;
    if (/치명타|Crit(?:ical)?|暴擊/i.test(name)) return 2;
    if (/명중|Accuracy|命中/i.test(name)) return 3;
    if (/방어|저항|막기|회피|생명력|Defense|Resistance|Block|Evasion|HP|防禦|抵抗|格擋|迴避|生命/i.test(name)) return 4;
    return 5;
  }

  function renderArcana(items, details) {
    const copy = currentCopy();
    const section = createSection("character-arcana", "ARCANA SET", copy.arcana,
      copy.arcanaDescription, formatCopy("itemCount", { value: items.length }));
    appendCharacterSnapshotAction(
      section,
      copy.arcanaSnapshot,
      resolveLoadoutView(state.profile).data?.complete === false,
      copy.equipmentSnapshotWaiting,
      copyArcanaSnapshot,
      "arcana-snapshot-button");
    const grid = node("div", "character-arcana-grid");
    for (const item of items.slice().sort((a, b) => Number(a.slotPos) - Number(b.slotPos))) {
      const card = node("article", "character-arcana-card");
      const itemName = localizeOfficialText(item.name);
      card.append(createImage(item.icon, itemName));
      const body = node("div");
      const detail = details[String(item.slotPos)] || {};
      body.append(textNode("strong", `+${number(item.enchantLevel)} ${itemName || "—"}`));
      const options = node("ul", "arcana-option-list");
      for (const line of basicItemOptions(detail)) options.append(textNode("li", line));
      for (const skill of Array.isArray(detail.subSkills) ? detail.subSkills : []) {
        const option = node("li", "arcana-skill-option");
        option.append(createImage(skill.icon, ""), textNode("b", `+${number(skill.level)}`),
          textNode("span", localizeOfficialText(skill.name, skill.id) || "—"));
        options.append(option);
      }
      if (!options.childElementCount) options.append(textNode("li", copy.emptyOption, "empty-detail"));
      card.append(body, options);
      grid.append(card);
    }
    if (!items.length) grid.append(textNode("div", copy.none, "character-search-empty"));
    section.append(renderArcanaSkillSummary(items, details), grid);
    return section;
  }

  function collectArcanaSkillTotals(items, details) {
    const totals = new Map();
    for (const item of items) {
      const detail = details[String(item.slotPos)] || {};
      for (const skill of Array.isArray(detail.subSkills) ? detail.subSkills : []) {
        const name = localizeOfficialText(skill?.name, skill?.id);
        if (!name) continue;
        const key = String(skill.id || name);
        const current = totals.get(key) || { name, icon: skill.icon || "", level: 0, count: 0 };
        current.level += number(skill.level);
        current.count += 1;
        if (!current.icon && skill.icon) current.icon = skill.icon;
        totals.set(key, current);
      }
    }
    return [...totals.values()].sort((left, right) =>
      right.level - left.level || left.name.localeCompare(right.name, "ko"));
  }

  function renderArcanaSkillSummary(items, details) {
    const copy = currentCopy();
    const rows = collectArcanaSkillTotals(items, details);
    const summary = node("section", "arcana-skill-summary");
    const heading = node("div", "equipment-summary-heading");
    heading.append(textNode("strong", copy.arcanaSkillTotal), textNode("span", copy.arcanaSkillTotalNote));
    const grid = node("div", "arcana-skill-summary-grid");
    for (const row of rows) {
      const item = node("div", "arcana-skill-summary-item");
      item.append(createImage(row.icon, ""));
      const identity = node("span");
      identity.append(textNode("strong", row.name),
        textNode("small", copy.arcanaCards.replace("{value}", row.count)));
      item.append(identity, textNode("b", copy.soulSkillLevel.replace("{value}", row.level)));
      grid.append(item);
    }
    if (!rows.length) grid.append(textNode("span", copy.emptyOption, "empty-detail"));
    summary.append(heading, grid);
    return summary;
  }

  function characterCombatButton(row) {
    const copy = globalThis.NotMeterCharacterCombat.copy(state.locale);
    const button = textNode("button", copy.detail, "character-combat-button");
    button.type = "button";
    button.disabled = row.detailRegion !== "ww" && state.traits.status === "loading" && !row.detailResolved;
    const time = Number(row.battleEnd) > 0 ? ` · ${formatDateTime(Number(row.battleEnd))}` : "";
    button.setAttribute("aria-label", `${copy.detail} · ${row.bossName}${time}`);
    button.addEventListener("click", () => void globalThis.NotMeterRankingCombatDetail.openCharacter(row, button));
    return button;
  }

  function startCharacterTraitsLoad(rankingKey) {
    const submitted = state.skillBuilds;
    if (submitted?.status === "loading") {
      void submitted.load.then(() => {
        if (state.rankingKey === rankingKey && state.skillBuilds === submitted) startCharacterTraitsLoad(rankingKey);
      });
      return;
    }
    if (globalThis.NotMeterCharacterBuilds?.select(submitted?.cache, submitted?.mode)) {
      refreshCharacterTraits();
      return;
    }
    const rows = state.rankingRows;
    const api = globalThis.NotMeterCharacterCombat;
    const row = rows[0]?.detailRegion === "ww" ? api.latest(rows) : null;
    const traits = state.traits = { status: rows.length ? "loading" : "empty", row, flags: new Map(), load: null };
    const isCurrent = () => state.traits === traits && state.rankingKey === rankingKey && isCharacterView();
    const apply = result => {
      if (!isCurrent() || !result) return;
      const wasLoading = traits.status === "loading";
      Object.assign(traits, { row: result.row, partial: result.partial, flags: result.flags, sources: result.sources,
        loadingHistory: result.loadingHistory, historyFailed: result.historyFailed,
        status: result.document ? "ready" : "unavailable" });
      if (wasLoading) refreshCharacterRankingBody(rankingKey);
      refreshCharacterTraits();
    };
    refreshCharacterTraits();
    if (!rows.length) return;
    traits.load = (async () => {
      if (rows[0].detailRegion !== "ww") {
        const keys = [...new Set(rows.filter(value => !value.detailResolved).map(value => value.dungeonKey))];
        await api.forEachLimited(keys, async dungeonKey => {
          const group = rows.filter(value => value.dungeonKey === dungeonKey);
          const first = group[0];
          try {
            const ranking = await globalThis.NotMeterPublicRankingCache.loadClass(dungeonKey, first.detailGeneration);
            if (!isCurrent()) return;
            for (const value of group) {
              const player = api.regionalPlayer(value, ranking, first);
              value.detailLookupKey = String(player?.Q || "");
              value.detailResolved = true;
            }
          } catch { /* Keep the rankings usable; a retry can resolve this shard later. */ }
        }, isCurrent);
        if (!isCurrent()) return null;
        refreshCharacterRankingBody(rankingKey);
      }
      const skills = [state.profile, ...Object.values(state.profile?.loadouts || {})]
        .flatMap(data => data?.equipment?.skill?.skillList || [])
        .filter(skill => !["dp", "passive"].includes(String(skill.category).toLowerCase()));
      return api.loadSpecializations(rows, value => globalThis.NotMeterRankingCombatDetail.loadCharacter(value), {
        skillIds: skills.length ? skills.map(skill => Number(skill.id)) : null, isCurrent, onProgress: apply,
      });
    })();
    void traits.load.then(apply).catch(() => {
      if (!isCurrent()) return;
      traits.status = "error";
      refreshCharacterRankingBody(rankingKey);
      refreshCharacterTraits();
    });
  }

  function ensureCharacterBuilds(data, force = false) {
    const api = globalThis.NotMeterCharacterBuilds;
    const id = api.identity(data?.info?.profile, new URLSearchParams(window.location.search), currentOfficialRegion());
    const key = api.key(id), revision = String(data?.fetchedAt || "");
    if (!force && state.skillBuilds?.key === key && state.skillBuilds.revision === revision) return;
    const previous = state.skillBuilds?.key === key ? state.skillBuilds : null;
    const request = state.skillBuilds = { key, revision, mode: previous?.mode || "PVE", status: "loading", cache: previous?.cache || null, load: null };
    request.load = fetchCharacterJson(`/skill-trees?region=${id.region.toLowerCase()}&serverId=${id.serverId}&characterId=${encodeURIComponent(id.characterId)}`,
      { timeoutMs: 12000, cache: "no-cache" }).then(cache => {
        const received = api.validate(cache, id);
        if (!request.cache || received.generatedAt >= request.cache.generatedAt) request.cache = received;
        request.status = "ready";
      }).catch(() => { request.status = "error"; }).finally(() => {
        if (state.skillBuilds !== request || !isCharacterView()) return;
        refreshCharacterTraits();
        if (!api.select(request.cache, request.mode) && state.rankingStatus === "ready" && state.traits.status !== "loading")
          startCharacterTraitsLoad(state.rankingKey);
      });
  }

  function currentCharacterTraits() {
    return globalThis.NotMeterCharacterBuilds?.select(state.skillBuilds?.cache, state.skillBuilds?.mode) || state.traits;
  }

  function characterBuildIcon(kind) {
    const paths = {
      PVE: "M12 3 20 6v5c0 5-4 8-8 10-4-2-8-5-8-10V6Z M8 12l3 3 5-6",
      PVP: "m4 3 5 2 11 13-2 2L5 9Z M20 3l-5 2-3 4 M9 12l-5 6 2 2 5-4 M3 15l6 6m6 0 6-6",
      check: "m5 12 4 4 10-10",
    };
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", `character-build-icon${kind === "check" ? " character-build-check" : ""}`);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", paths[kind]);
    svg.append(path);
    return svg;
  }

  function renderCharacterTraitsSource() {
    const traits = currentCharacterTraits();
    const buildCopy = globalThis.NotMeterCharacterBuilds.copy(state.locale);
    if (traits.kind === "submitted") {
      const box = node("div", "character-traits-source character-shared-build");
      box.dataset.source = "submitted";
      box.dataset.mode = traits.mode;
      const body = node("div", "character-traits-source-copy");
      const title = textNode("strong", buildCopy.title, "character-build-title");
      title.append(textNode("span", traits.mode, "character-build-mode"));
      body.append(title, textNode("p", buildCopy.note));
      const time = textNode("time", `${buildCopy.updated} · ${formatDateTime(traits.submittedAt * 1000)}`, "character-traits-record");
      time.dateTime = new Date(traits.submittedAt * 1000).toISOString();
      body.append(time);
      if (traits.showTabs) {
        const tabs = node("div", "character-build-tabs");
        tabs.setAttribute("role", "group"); tabs.setAttribute("aria-label", buildCopy.title);
        for (const mode of ["PVE", "PVP"]) {
          const button = node("button", "character-combat-button character-build-tab");
          button.dataset.mode = mode;
          button.append(characterBuildIcon(mode), textNode("span", mode), characterBuildIcon("check"));
          button.type = "button"; button.setAttribute("aria-pressed", String(mode === traits.mode));
          button.addEventListener("click", () => {
            if (mode === currentCharacterTraits().mode) return;
            state.skillBuilds.mode = mode;
            refreshCharacterTraits();
          });
          tabs.append(button);
        }
        box.append(tabs);
      }
      box.append(body);
      return box;
    }
    const copy = globalThis.NotMeterCharacterCombat.copy(state.locale);
    const { status, row, partial, sources, loadingHistory, historyFailed } = state.traits;
    const hasHistory = [...(sources?.values() || [])].some(source => source !== row);
    const box = node("div", "character-traits-source");
    box.hidden = state.rankingStatus !== "ready" || !state.rankingRows.length;
    box.dataset.status = status;
    const body = node("div", "character-traits-source-copy");
    body.append(textNode("strong", hasHistory ? copy.historyTitle : partial ? copy.partialTitle : copy.title),
      textNode("p", hasHistory ? copy.historyNote : partial ? copy.partialNote : copy.note));
    if (row) {
      const record = node("div", "character-traits-record");
      const time = textNode("time", formatDateTime(Number(row.battleEnd)));
      time.dateTime = new Date(Number(row.battleEnd)).toISOString();
      record.append(time, textNode("span", row.bossName));
      body.append(record);
    }
    if (status !== "ready") {
      const message = textNode("p", copy[["error", "unavailable"].includes(status) ? "unavailable" : status === "empty" ? "empty" : "loading"], "character-traits-status");
      message.setAttribute("role", "status");
      body.append(message);
    }
    if (loadingHistory || historyFailed) {
      const message = textNode("p", copy[historyFailed ? "historyUnavailable" : "historyLoading"], "character-traits-status");
      message.setAttribute("role", "status");
      body.append(message);
    }
    box.append(body);
    if (["loading", "error"].includes(state.skillBuilds?.status)) {
      box.hidden = false;
      body.prepend(textNode("p", buildCopy[state.skillBuilds.status], "character-traits-status"));
      if (state.skillBuilds.status === "error") {
        const retry = textNode("button", buildCopy.retry, "character-combat-button");
        retry.type = "button"; retry.addEventListener("click", () => ensureCharacterBuilds(state.profile, true));
        box.append(retry);
      }
    }
    if (row) box.append(characterCombatButton(row));
    if (status === "error" || historyFailed) {
      const retry = textNode("button", currentCopy().retry, "character-combat-button");
      retry.type = "button";
      retry.addEventListener("click", () => state.rankingStatus === "ready"
        ? startCharacterTraitsLoad(state.rankingKey) : startCharacterRankingLoad(state.profile, state.rankingKey));
      box.append(retry);
    }
    return box;
  }

  function renderSkillTraits(host) {
    const copy = globalThis.NotMeterCharacterCombat.copy(state.locale);
    const catalog = globalThis.NotMeterSkillTraits;
    const text = catalog.copy(state.locale);
    host.replaceChildren();
    const skillId = Number(host.dataset.skillId);
    const traits = currentCharacterTraits();
    const flags = traits.status === "ready"
      ? traits.flags.get(skillId) || (traits.kind === "submitted" ? [false, false, false, false, false] : null) : null;
    const known = Array.isArray(flags) && flags.length === 5;
    const pending = traits.status === "loading" || (traits.loadingHistory && !traits.flags.has(skillId));
    const header = node("div", "character-trait-heading");
    header.append(textNode("small", copy.label), textNode("small", known
      ? `${text.selected} ${flags.filter(Boolean).length} / 5` : pending ? "…" : copy.unknown,
      known ? "character-traits-selected-count" : "character-traits-unknown"));
    host.append(header);
    const options = catalog.options(skillId, currentOfficialRegion(), state.locale);
    if (options.length) {
      const list = node("ol", "character-trait-options");
      list.setAttribute("aria-label", copy.label);
      for (const option of options) {
        const active = known && flags[option.number - 1];
        const item = node("li", active ? "selected" : "");
        item.dataset.selected = known ? String(active) : "unknown";
        const description = option.description || text.missing;
        item.setAttribute("aria-label", `${option.number}. ${description} · ${known ? active ? text.selected : text.unselected : copy.unknown}`);
        const badge = textNode("b", option.number, "character-trait-number");
        const body = textNode("p", description, "character-trait-description");
        if (option.language) body.append(textNode("small", text.english, "character-trait-language"));
        item.append(badge, body);
        if (active) {
          const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          check.setAttribute("viewBox", "0 0 16 16");
          check.setAttribute("aria-hidden", "true");
          check.innerHTML = '<path d="m3 8 3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
          item.append(check);
        }
        list.append(item);
      }
      host.append(list);
    } else {
      if (known) {
        const numbers = node("div", "character-trait-numbers");
        numbers.setAttribute("aria-label", `${copy.selected}: ${flags.flatMap((value, i) => value ? [i + 1] : []).join(", ") || currentCopy().none}`);
        flags.forEach((value, i) => numbers.append(textNode("b", i + 1, value ? "selected" : "")));
        host.append(numbers);
      }
      host.append(textNode("p", state.traitDescriptions?.status === "loading" ? text.loading : text.missing, "character-trait-description-state"));
    }
    const source = traits.sources?.get(Number(host.dataset.skillId));
    if (source && source !== traits.row) {
      const record = characterCombatButton(source);
      record.className = "character-trait-history";
      record.textContent = `${copy.earlier} · ${formatDateTime(Number(source.battleEnd))}`;
      record.title = `${source.bossName} · ${record.textContent}`;
      host.append(record);
    }
  }

  function refreshCharacterTraits() {
    if (!isCharacterView()) return;
    const source = document.querySelector("#character-skills .character-traits-source");
    if (source) {
      const focusedMode = source.contains(document.activeElement) ? document.activeElement.dataset.mode : null;
      const replacement = renderCharacterTraitsSource();
      source.replaceWith(replacement);
      if (focusedMode === "PVE" || focusedMode === "PVP")
        replacement.querySelector(`.character-build-tab[data-mode="${focusedMode}"]`)?.focus({ preventScroll: true });
    }
    renderTraitDescriptionStatus();
    document.querySelectorAll("#character-skills .character-skill-traits").forEach(renderSkillTraits);
    const levels = currentCharacterTraits().levels;
    document.querySelectorAll("#character-skills [data-skill-level-id]").forEach(label => {
      label.textContent = `Lv.${levels?.get(Number(label.dataset.skillLevelId)) ?? label.dataset.officialLevel}`;
    });
  }

  function ensureSkillTraitDescriptions() {
    const api = globalThis.NotMeterSkillTraits;
    const region = currentOfficialRegion(), locale = state.locale;
    const key = api.key(region, locale);
    if (state.traitDescriptions?.key === key) return;
    const request = state.traitDescriptions = { key, status: "loading" };
    void api.load(region, locale).then(() => { request.status = "ready"; })
      .catch(() => { request.status = "error"; }).finally(() => {
        if (state.traitDescriptions === request) refreshCharacterTraits();
      });
  }

  function renderTraitDescriptionStatus(host = document.querySelector("#character-trait-description-status")) {
    if (!host) return;
    host.replaceChildren();
    host.hidden = state.traitDescriptions?.status !== "error";
    if (host.hidden) return;
    const copy = globalThis.NotMeterSkillTraits.copy(state.locale);
    const retry = textNode("button", copy.retry, "character-combat-button");
    retry.type = "button";
    retry.addEventListener("click", () => {
      state.traitDescriptions = null;
      ensureSkillTraitDescriptions();
      refreshCharacterTraits();
    });
    host.append(textNode("p", copy.error), retry);
  }

  function renderSkills(rawSkills) {
    ensureSkillTraitDescriptions();
    const copy = currentCopy();
    const skills = Array.isArray(rawSkills) ? rawSkills.slice() : [];
    skills.sort((a, b) => Number(b.skillLevel) - Number(a.skillLevel) || String(a.name).localeCompare(String(b.name)));
    const section = createSection("character-skills", "SKILL LIBRARY", copy.skills,
      globalThis.NotMeterSkillTraits.copy(state.locale).description, formatCopy("itemCount", { value: skills.length }));
    appendCharacterSnapshotAction(
      section,
      copy.skillSnapshot,
      false,
      "",
      copySkillSnapshot,
      "skill-snapshot-button");
    section.append(renderCharacterTraitsSource());
    const descriptionStatus = node("div", "character-trait-description-status");
    descriptionStatus.id = "character-trait-description-status";
    descriptionStatus.setAttribute("role", "status");
    descriptionStatus.hidden = true;
    renderTraitDescriptionStatus(descriptionStatus);
    section.append(descriptionStatus);
    const groups = [
      ["active", copy.activeSkills, skills.filter(skill => !["dp", "passive"].includes(String(skill.category).toLowerCase()))],
      ["stigma", copy.stigmaSkills, skills.filter(skill => String(skill.category).toLowerCase() === "dp")],
      ["passive", copy.passiveSkills, skills.filter(skill => String(skill.category).toLowerCase() === "passive")],
    ];
    const groupsContainer = node("div", "skill-groups");
    groups.forEach(([kind, label, groupSkills]) => {
      const group = node("section", "skill-group");
      const heading = node("div", "skill-group-heading");
      heading.append(textNode("h5", label), textNode("span",
        formatCopy("itemCount", { value: groupSkills.length })));
      const grid = node("div", "character-skill-grid");
      if (kind === "active") grid.classList.add("character-active-skill-grid");
      for (const skill of groupSkills) {
        const card = node("article", "character-skill-card");
        const skillName = localizeOfficialText(skill.name, skill.id);
        card.append(createImage(skill.icon, skillName));
        const body = node("div");
        const level = textNode("span", `Lv.${currentCharacterTraits().levels?.get(Number(skill.id)) ?? number(skill.skillLevel)}`);
        level.dataset.skillLevelId = String(skill.id); level.dataset.officialLevel = String(number(skill.skillLevel));
        body.append(textNode("strong", skillName || "—"), level);
        card.append(body);
        if (kind === "active") {
          const traits = node("div", "character-skill-traits");
          traits.dataset.skillId = String(skill.id);
          renderSkillTraits(traits);
          card.append(traits);
        }
        grid.append(card);
      }
      if (!groupSkills.length) grid.append(textNode("div", copy.none, "character-search-empty"));
      group.append(heading, grid);
      groupsContainer.append(group);
    });
    section.append(groupsContainer);
    return section;
  }

  function createSection(id, kicker, title, description, count = "") {
    const section = node("section", "character-section");
    section.id = id;
    const head = node("div", "character-section-head");
    const copy = node("div");
    copy.append(textNode("span", kicker, "character-section-kicker"), textNode("h4", title), textNode("p", description));
    head.append(copy);
    if (count) head.append(textNode("span", count, "character-section-count"));
    section.append(head);
    return section;
  }

  function basicItemOptions(detail) {
    return statLines(detail?.mainStats);
  }

  function statLines(stats) {
    if (!Array.isArray(stats)) return [];
    return stats.map(statParts)
      .map(stat => `${stat.name} ${stat.value}`.trim())
      .filter(Boolean);
  }

  function statParts(stat) {
    const name = localizeOfficialText(stat?.name);
    let value = stat?.value ?? "";
    if (stat?.minValue && String(stat.minValue) !== String(stat.value)) value = `${stat.minValue}~${stat.value}`;
    const extra = String(stat?.extra ?? "");
    if (extra && extra !== "0" && extra !== "0%") value = `${value} (+${extra.replace(/^\+/, "")})`;
    return { name, value: String(value) };
  }

  function normalizeCharacterApiRoot(value) {
    try {
      const endpoint = new URL(String(value || "").trim());
      if (endpoint.protocol !== "https:" || endpoint.username || endpoint.password ||
          (endpoint.port && endpoint.port !== "443") || RETIRED_CHARACTER_API_HOSTS.has(endpoint.hostname.toLowerCase())) {
        return "";
      }
      return `${endpoint.protocol}//${endpoint.hostname}/character/v1`;
    } catch {
      return "";
    }
  }

  function currentCharacterApiRoots() {
    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) return [LOCAL_CHARACTER_API_ROOT];
    return [...new Set([...discoveredCharacterApiRoots, ...CURRENT_HOME_CHARACTER_API_ROOTS])];
  }

  async function refreshCharacterApiRoots(force = false) {
    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) return currentCharacterApiRoots();
    if (characterEndpointRefresh) return characterEndpointRefresh;
    characterEndpointRefresh = (async () => {
      const resolver = globalThis.NotMeterControlEndpoint;
      if (!resolver?.getEndpoints) return currentCharacterApiRoots();
      try {
        if (force && resolver.refresh) await resolver.refresh(true);
        const endpoints = await resolver.getEndpoints();
        const roots = Array.isArray(endpoints) ? endpoints.map(normalizeCharacterApiRoot).filter(Boolean) : [];
        if (roots.length) discoveredCharacterApiRoots = [...new Set(roots)];
      } catch {
        // The current home aliases remain available if the signed manifest cannot be refreshed.
      }
      return currentCharacterApiRoots();
    })().finally(() => { characterEndpointRefresh = null; });
    return characterEndpointRefresh;
  }

  function isTransientCharacterError(error) {
    return !Number.isInteger(error?.status) || TRANSIENT_CHARACTER_STATUS_CODES.has(error.status);
  }

  async function fetchCharacterJson(path, options = {}) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (options.signal?.aborted) abort();
    else options.signal?.addEventListener("abort", abort, { once: true });
    const timer = options.timeoutMs > 0 ? window.setTimeout(abort, options.timeoutMs) : null;
    try {
      return await withCharacterAbort(requestCharacterJson(path, { ...options, signal: controller.signal }), controller.signal);
    } finally {
      window.clearTimeout(timer);
      options.signal?.removeEventListener("abort", abort);
    }
  }

  async function requestCharacterJson(path, options) {
    const attempted = new Set();
    let lastError = null;
    const attempt = async roots => {
      for (const root of roots) {
        options.signal.throwIfAborted();
        if (!root || attempted.has(root)) continue;
        attempted.add(root);
        try {
          return await fetchJson(`${root}${path}`, options);
        } catch (error) {
          options.signal.throwIfAborted();
          lastError = error;
          if (!isTransientCharacterError(error)) throw error;
          if (error?.status === 429) {
            await waitForCharacterRetry(error, options.signal);
            try {
              return await fetchJson(`${root}${path}`, options);
            } catch (retryError) {
              options.signal.throwIfAborted();
              lastError = retryError;
              if (!isTransientCharacterError(retryError)) throw retryError;
            }
          }
        }
      }
      return null;
    };

    const initial = await attempt(currentCharacterApiRoots());
    if (initial !== null) return initial;
    const refreshed = await attempt(await refreshCharacterApiRoots(true));
    if (refreshed !== null) return refreshed;
    options.signal.throwIfAborted();
    const status = Number(lastError?.status);
    if ([429, 500, 502, 503, 504].includes(status)) {
      const recoveryRoot = currentCharacterApiRoots().find(Boolean);
      if (recoveryRoot) {
        await waitForCharacterRetry(lastError, options.signal);
        return fetchJson(`${recoveryRoot}${path}`, options);
      }
    }
    throw lastError || new Error(currentCopy().loadError);
  }

  function waitForCharacterRetry(error, signal) {
    const requestedDelay = Number(error?.retryAfterMs);
    const delay = Number.isFinite(requestedDelay) && requestedDelay > 0
      ? Math.min(MAX_RETRY_AFTER_MS, Math.max(TRANSIENT_RETRY_DELAY_MS, requestedDelay))
      : TRANSIENT_RETRY_DELAY_MS;
    return waitForCharacterDelay(delay, signal);
  }

  function waitForCharacterDelay(delay, signal) {
    let timer;
    return withCharacterAbort(new Promise(resolve => { timer = window.setTimeout(resolve, delay); }), signal)
      .finally(() => window.clearTimeout(timer));
  }

  function withCharacterAbort(operation, signal) {
    if (!signal) return operation;
    return new Promise((resolve, reject) => {
      const abort = () => reject(signal.reason);
      if (signal.aborted) abort();
      else signal.addEventListener("abort", abort, { once: true });
      Promise.resolve(operation).then(
        value => { signal.removeEventListener("abort", abort); resolve(value); },
        error => { signal.removeEventListener("abort", abort); reject(error); },
      );
    });
  }

  async function fetchJson(url, options = {}) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (options.signal?.aborted) abort();
    else options.signal?.addEventListener("abort", abort, { once: true });
    const timer = window.setTimeout(abort, options.requestTimeoutMs || REQUEST_TIMEOUT_MS);
    try {
      controller.signal.throwIfAborted();
      const response = await fetch(url, {
        cache: options.cache || "default", headers: { Accept: "application/json" }, signal: controller.signal,
      });
      if (!response.ok) {
        const error = new Error(response.status === 404 ? currentCopy().noResults : currentCopy().loadError);
        error.status = response.status;
        const retryAfterSeconds = Number(response.headers.get("Retry-After"));
        if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
          error.retryAfterMs = retryAfterSeconds * 1000;
        }
        throw error;
      }
      return await response.json();
    } finally {
      window.clearTimeout(timer);
      options.signal?.removeEventListener("abort", abort);
    }
  }

  void refreshCharacterApiRoots();

  function searchSessionKey(name, region, globalRegion = state.globalRegion) {
    const normalizedName = String(name || "").trim().normalize("NFC").toLocaleLowerCase();
    return `notmeter-character-search-session-v1:${characterRegionKey(region, globalRegion)}:${officialLanguage(region)}:${normalizedName}`;
  }

  function profileSessionKey(region, serverId, characterId, globalRegion = currentGlobalRegion()) {
    return `notmeter-character-profile-session-v1:${characterRegionKey(region, globalRegion)}:${officialLanguage(region)}:${Number(serverId) || 0}:${String(characterId || "")}`;
  }

  function readSessionPayload(key, ttlMs) {
    try {
      const entry = JSON.parse(sessionStorage.getItem(key) || "null");
      if (!entry || !entry.savedAt || Date.now() - Number(entry.savedAt) > ttlMs) {
        sessionStorage.removeItem(key);
        return null;
      }
      return entry.payload || null;
    } catch {
      return null;
    }
  }

  function writeSessionPayload(key, payload) {
    if (!key || !payload) return;
    try {
      sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), payload }));
    } catch {
      // A full or disabled session store must not block character lookup.
    }
  }

  function writeProfileSessionPayload(key, payload) {
    const existing = readSessionPayload(key, PROFILE_SESSION_TTL_MS);
    if (existing?.complete !== false && payload?.complete === false) return;
    writeSessionPayload(key, payload);
    try {
      const parsed = JSON.parse(sessionStorage.getItem(PROFILE_SESSION_INDEX_KEY) || "[]");
      const keys = Array.isArray(parsed) ? parsed.filter(item => item !== key) : [];
      keys.unshift(key);
      for (const staleKey of keys.slice(SESSION_PROFILE_LIMIT)) sessionStorage.removeItem(staleKey);
      sessionStorage.setItem(PROFILE_SESSION_INDEX_KEY, JSON.stringify(keys.slice(0, SESSION_PROFILE_LIMIT)));
    } catch {
      // The profile remains usable even when the optional session index cannot be saved.
    }
  }

  function profilePayloadSignature(data, fallbackCharacterId = "") {
    const profile = data?.info?.profile || {};
    const detailKeys = Object.keys(data?.itemDetails || {}).sort().join(",");
    const loadoutSignature = Object.entries(data?.loadouts || {})
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}:${value?.contentHash || value?.capturedAt || ""}`)
      .join(",");
    return [
      profile.characterId || fallbackCharacterId,
      data?.fetchedAt || "",
      data?.complete !== false ? "complete" : "partial",
      detailKeys,
      data?.currentLoadoutType || "",
      loadoutSignature,
    ].join("|");
  }

  function readRecent() {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.slice(0, RECENT_LIMIT) : [];
    } catch { return []; }
  }

  function readFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.slice(0, FAVORITE_LIMIT) : [];
    } catch { return []; }
  }

  function characterKey(item) {
    return `${characterRegionKey(item?.region, item?.globalRegion)}:${Number(item?.serverId) || 0}:${String(item?.characterId || "")}`;
  }

  function savedCharacter(item) {
    return {
      characterId: String(item?.characterId || ""), name: String(item?.name || ""),
      serverId: Number(item?.serverId), serverName: String(item?.serverName || ""),
      className: String(item?.className || ""), raceName: String(item?.raceName || ""),
      level: number(item?.level), combatPower: number(item?.combatPower),
      profileImage: String(item?.profileImage || ""),
      region: normalizeOfficialRegion(item?.region),
      globalRegion: normalizeOfficialRegion(item?.region) === "ww" ? normalizeGlobalRegion(item?.globalRegion) : "",
    };
  }

  function writeFavorites(items) {
    try { localStorage.setItem(FAVORITE_KEY, JSON.stringify(items.slice(0, FAVORITE_LIMIT))); } catch { /* ignored */ }
  }

  function isFavorite(item) {
    const key = characterKey(item);
    return readFavorites().some(entry => characterKey(entry) === key);
  }

  function toggleFavorite(item) {
    if (!item?.characterId || !item?.serverId) return;
    const key = characterKey(item);
    const favorites = readFavorites();
    const existing = favorites.findIndex(entry => characterKey(entry) === key);
    if (existing >= 0) favorites.splice(existing, 1);
    else favorites.unshift(savedCharacter(item));
    writeFavorites(favorites);
  }

  function removeRecent(item) {
    const key = characterKey(item);
    const recent = readRecent().filter(entry => characterKey(entry) !== key);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); } catch { /* ignored */ }
  }

  function saveRecent(item) {
    if (!item?.characterId || !item?.serverId) return;
    const saved = savedCharacter(item);
    const key = characterKey(saved);
    const recent = readRecent().filter(entry => characterKey(entry) !== key);
    recent.unshift(saved);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, RECENT_LIMIT))); } catch { /* ignored */ }
    const favorites = readFavorites();
    const favoriteIndex = favorites.findIndex(entry => characterKey(entry) === key);
    if (favoriteIndex >= 0) {
      favorites[favoriteIndex] = saved;
      writeFavorites(favorites);
    }
  }

  function setPopover(open) {
    elements["character-search-popover"].hidden = !open;
    elements["character-search-input"].setAttribute("aria-expanded", String(open));
  }

  function currentCopy() { return COPY[state.locale] || COPY.ko; }
  function officialLanguage(region = currentOfficialRegion()) {
    if (region === "ww") return "en-US";
    if (state.locale === "zh-TW") return "zh";
    if (state.locale === "ko") return "ko";
    return region === "tw" ? "zh" : "ko";
  }
  async function ensureOfficialNameCatalog() {
    if (state.locale !== "en" && (searchOfficialRegion() === "ww" || currentOfficialRegion() === "ww")) await ensureEnglishNameCatalog();
    if (globalThis.NotMeterI18n?.supported.indexOf(state.locale) > 2) return globalThis.NotMeterI18n.loadGame(state.locale);
    if (state.locale === "en") {
      if (!isCharacterView() && elements["character-search-popover"]?.hidden !== false) return null;
      return ensureEnglishNameCatalog();
    }
    if ((state.locale !== "ko" && state.locale !== "zh-TW") || state.officialNameCatalog) {
      return state.officialNameCatalog;
    }
    if (state.officialNameCatalogLoad) return state.officialNameCatalogLoad;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);
    state.officialNameCatalogLoad = fetch(OFFICIAL_NAME_CATALOG_URL, {
      cache: "force-cache",
      signal: controller.signal,
    }).then(response => {
      if (!response.ok) throw new Error(`Official name catalog HTTP ${response.status}`);
      return response.json();
    }).then(payload => {
      if (payload?.locale !== "zh-TW" || !payload.names || !payload.aliases) {
        throw new Error("Official name catalog format is invalid");
      }
      state.officialNameCatalog = payload;
      state.koreanNamesByTraditionalChinese = buildKoreanOfficialNameIndex(payload);
      return payload;
    }).catch(() => null).finally(() => {
      window.clearTimeout(timeoutId);
      state.officialNameCatalogLoad = null;
    });
    return state.officialNameCatalogLoad;
  }
  async function ensureEnglishNameCatalog() {
    if (state.englishNameCatalog) return state.englishNameCatalog;
    if (state.englishNameCatalogLoad) return state.englishNameCatalogLoad;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 6000);
    state.englishNameCatalogLoad = fetch(ENGLISH_NAME_CATALOG_URL, {
      cache: "force-cache", signal: controller.signal,
    }).then(response => {
      if (!response.ok) throw new Error(`English name catalog HTTP ${response.status}`);
      return response.json();
    }).then(payload => {
      if (payload?.locale !== "en" || !payload.names) throw new Error("Invalid English name catalog");
      state.englishNameCatalog = payload;
      state.koreanNamesByEnglish = buildKoreanGlobalNameIndex(payload);
      return payload;
    }).catch(() => null).finally(() => {
      window.clearTimeout(timeoutId);
      state.englishNameCatalogLoad = null;
    });
    return state.englishNameCatalogLoad;
  }
  function buildKoreanGlobalNameIndex(payload) {
    const guide = globalThis.NotMeterSetupGuideCatalog?.en;
    const candidates = new Map();
    for (const names of [guide?.stats, guide?.equipment, guide?.skills, guide?.arcana, payload?.names]) {
      for (const [korean, english] of Object.entries(names || {})) {
        if (!/[가-힣]/u.test(korean) || !english) continue;
        const key = normalizeOfficialName(english);
        if (!candidates.has(key)) candidates.set(key, new Set());
        candidates.get(key).add(korean);
      }
    }
    const result = new Map([...candidates]
      .filter(([, names]) => new Set([...names].map(name => name.replace(/\s+/gu, ""))).size === 1)
      .map(([english, names]) => [english, [...names].sort((a, b) => a.length - b.length)[0]]));
    for (const [korean, english] of Object.entries(guide?.stats || {})) {
      if (/[가-힣]/u.test(korean)) result.set(normalizeOfficialName(english), korean);
    }
    for (const [english, korean] of Object.entries({ Elyos: "천족", Asmodian: "마족", Asmodians: "마족",
      Gladiator: "검성", Templar: "수호성", Assassin: "살성", Ranger: "궁성", Sorcerer: "마도성",
      Spiritmaster: "정령성", Cleric: "치유성", Chanter: "호법성" })) result.set(english, korean);
    return result;
  }
  function buildKoreanOfficialNameIndex(payload) {
    const candidates = new Map();
    const add = (korean, traditionalChinese) => {
      const ko = normalizeOfficialName(korean);
      const zh = normalizeOfficialName(traditionalChinese);
      if (!ko || !zh) return;
      if (!candidates.has(zh)) candidates.set(zh, new Set());
      candidates.get(zh).add(ko);
    };
    for (const [korean, traditionalChinese] of Object.entries(payload?.names || {})) {
      add(korean, traditionalChinese);
    }
    const index = new Map([...candidates]
      .filter(([, koreanNames]) => koreanNames.size === 1)
      .map(([traditionalChinese, koreanNames]) => [traditionalChinese, [...koreanNames][0]]));
    for (const [korean, traditionalChinese] of Object.entries(payload?.aliases || {})) {
      index.set(normalizeOfficialName(traditionalChinese), normalizeOfficialName(korean));
    }
    for (const [korean, traditionalChinese] of Object.entries(OFFICIAL_TERMS_KO_TO_ZH_TW)) {
      index.set(normalizeOfficialName(traditionalChinese), normalizeOfficialName(korean));
    }
    return index;
  }
  function normalizeOfficialName(value) {
    return String(value || "").normalize("NFC").replace(/\s+/g, " ").trim();
  }
  function translateOfficialName(value) {
    if (globalThis.NotMeterI18n?.supported.indexOf(state.locale) > 2) return globalThis.NotMeterI18n.game(value, state.locale);
    let original = normalizeOfficialName(value);
    if (!original) return original;
    if (state.locale !== "en") original = state.koreanNamesByEnglish?.get(original) || original;
    if (state.locale === "en") {
      const guide = globalThis.NotMeterSetupGuideCatalog?.en;
      for (const names of [guide?.stats, guide?.equipment, guide?.skills, guide?.arcana, state.englishNameCatalog?.names]) {
        if (names && Object.hasOwn(names, original)) return names[original];
      }
      return original;
    }
    if (state.locale === "ko") {
      return state.koreanNamesByTraditionalChinese?.get(original) || original;
    }
    return String(OFFICIAL_TERMS_KO_TO_ZH_TW[original] ||
      state.officialNameCatalog?.aliases?.[original] ||
      state.officialNameCatalog?.names?.[original] ||
      original);
  }
  function localizeOfficialText(value, skillId = 0) {
    let code = Math.trunc(Number(skillId) || 0);
    while (code > 99999999) code = Math.trunc(code / 10);
    const catalog = state.englishNameCatalog;
    const skill = catalog?.skillNames?.[catalog?.skillReports?.[code] || code];
    if (skill?.[state.locale] && currentOfficialRegion() === "ww") return skill[state.locale];
    const original = normalizeOfficialName(value);
    if (!original) return "";
    const direct = translateOfficialName(original);
    if (direct !== original) return direct;
    const match = original.match(/^(.+?)(\s+[+\-]?\d[\d,.]*(?:\.\d+)?%?(?:\s*[~–]\s*[+\-]?\d[\d,.]*%?)?(?:\s*\([^)]*\))?)$/u);
    if (!match) return original;
    const translatedPrefix = translateOfficialName(match[1]);
    return translatedPrefix === match[1] ? original : `${translatedPrefix}${match[2]}`;
  }
  function characterServerName(character) {
    if (normalizeOfficialRegion(character?.region) === "ww") {
      const region = globalRegionName(character?.globalRegion);
      return [region, globalServerName(character)].filter(Boolean).join(" · ");
    }
    return globalThis.NotMeterServerName?.(character?.serverId, state.locale)
      || localizeOfficialText(character?.serverName);
  }
  function refreshLocalizedContent() {
    if (state.profile) renderProfile(state.profile);
    if (elements["character-search-popover"]?.hidden) return;
    if (elements["character-search-input"]?.value.trim() && state.searchResults.length) {
      renderSearchRows(state.searchResults, false);
    } else if (!state.searchKey) {
      renderRecent();
    }
  }
  function normalizeGlobalRegion(value) {
    const code = String(value || "").trim().toLowerCase();
    return ["as", "naw", "nae", "eu", "la"].includes(code) ? code : "";
  }
  function currentGlobalRegion(params = new URLSearchParams(window.location.search)) {
    return normalizeGlobalRegion(params.get("globalRegion"));
  }
  function readGlobalRegion() {
    const linked = currentGlobalRegion();
    if (linked) return linked;
    try {
      const saved = normalizeGlobalRegion(sessionStorage.getItem("notmeter-character-global-region-v1"));
      if (saved) return saved;
    } catch { /* ignored */ }
    return readLocale() === "en" ? "naw" : "as";
  }
  function characterRegionKey(region, globalRegion) {
    return normalizeOfficialRegion(region) === "ww"
      ? `ww-${normalizeGlobalRegion(globalRegion)}` : normalizeOfficialRegion(region);
  }
  function globalRegionQuery(region, globalRegion) {
    return region === "ww" ? `&globalRegion=${encodeURIComponent(normalizeGlobalRegion(globalRegion))}` : "";
  }
  function globalRegionName(region) {
    const names = globalThis.NotMeterGlobalFieldBossCatalog?.serviceRegions
      .find(item => item.key === normalizeGlobalRegion(region))?.names;
    return names?.[state.locale] || names?.en || "";
  }
  function globalServerName(character) {
    const serverId = Number(character?.serverId);
    const names = globalThis.NotMeterGlobalFieldBossCatalog?.serviceRegions
      .flatMap(region => region.servers).find(server => server.id === serverId)?.names;
    if (names) return names[state.locale] || names.en;
    const localizedId = Math.floor(serverId / 1000) * 1000 + serverId % 100;
    const officialName = String(character?.serverName || "");
    const catalogName = globalThis.NotMeterServerName?.(localizedId, "en");
    return catalogName === officialName
      ? globalThis.NotMeterServerName(localizedId, state.locale) : officialName;
  }
  function matchesSearchScope(item, region) {
    return normalizeOfficialRegion(item.region) === region && (region !== "ww" ||
      (normalizeGlobalRegion(item.globalRegion) === state.globalRegion &&
       (!state.globalServerId || Number(item.serverId) === Number(state.globalServerId))));
  }
  function selectGlobalSearchRegion(value) {
    const region = normalizeGlobalRegion(value);
    if (!region || (region === state.globalRegion && searchOfficialRegion() === "ww")) return;
    const name = state.searchKey ? elements["character-search-input"].value.trim() : "";
    resetSearchRegion("ww");
    state.globalRegion = region;
    state.globalServerId = "";
    state.globalServers = [];
    state.globalServersLoaded = "";
    state.globalServersError = false;
    try { sessionStorage.setItem("notmeter-character-global-region-v1", region); } catch { /* ignored */ }
    selectSearchRegion("ww");
    if (name) void search(name);
  }
  function selectGlobalServer(value) {
    if (value && !state.globalServers.some(server => String(server.serverId) === String(value))) return;
    state.globalServerId = String(value || "");
    setServerPickerOpen(false, true);
    renderSearchRegion();
    if (state.searchKey) {
      renderSearchRows(state.searchResults, false);
      setPopover(true);
    }
  }
  function setServerPickerOpen(open, restoreFocus = false) {
    const popup = elements["character-server-picker"];
    if (!popup) return;
    popup.hidden = !open;
    elements["character-global-server"].setAttribute("aria-expanded", String(open));
    if (open) {
      setPopover(false);
      state.globalServerQuery = "";
      state.globalServerRace = "all";
      elements["character-server-query"].value = "";
      renderServerOptions();
      elements["character-server-query"].focus();
    } else if (restoreFocus) elements["character-global-server"].focus();
  }
  function positionServerPicker() {
    const popup = elements["character-server-picker"];
    if (!popup || popup.hidden) return;
    const rect = elements["character-global-filters"].getBoundingClientRect();
    const viewport = window.visualViewport;
    const top = viewport?.offsetTop || 0, height = viewport?.height || window.innerHeight;
    const below = top + height - rect.bottom - 16, above = rect.top - top - 16;
    const openAbove = below < 260 && above > below;
    const available = Math.max(120, openAbove ? above : below);
    popup.classList.toggle("is-above", openAbove);
    popup.style.maxHeight = `${available}px`;
    elements["character-server-options"].style.maxHeight = `${Math.max(70, Math.min(270, available - 225))}px`;
  }
  function handleServerPickerKey(event) {
    if (event.isComposing) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setServerPickerOpen(false, true);
      return;
    }
    const options = Array.from(elements["character-server-options"].querySelectorAll("[data-character-server]"));
    const index = options.indexOf(event.target);
    const query = event.target === elements["character-server-query"];
    if ((query || index >= 0) && ["ArrowDown", "ArrowUp"].includes(event.key) && options.length) {
      event.preventDefault();
      const next = index < 0 ? (event.key === "ArrowDown" ? 0 : options.length - 1)
        : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
      options[next].focus();
    } else if (query && event.key === "Enter" && options.length === 1) {
      event.preventDefault();
      options[0].click();
    }
  }
  function globalServerMatches(server, query) {
    const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC").toLowerCase().replace(/\s+/g, "");
    const initials = value => Array.from(String(value || ""), character => {
      const code = character.charCodeAt(0) - 0xac00;
      return code >= 0 && code <= 11171 ? "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"[Math.floor(code / 588)] : character;
    }).join("");
    const globalNames = globalThis.NotMeterGlobalFieldBossCatalog?.serviceRegions
      .flatMap(region => region.servers).find(item => item.id === Number(server.serverId))?.names;
    const names = [server.serverName, globalServerName(server), ...Object.values(globalNames || {})];
    const serverId = Number(server.serverId), localizedId = Math.floor(serverId / 1000) * 1000 + serverId % 100;
    if (globalThis.NotMeterServerName?.(localizedId, "en") === server.serverName) {
      for (const locale of Object.keys(COPY)) names.push(globalThis.NotMeterServerName(localizedId, locale));
    }
    const needle = normalize(query);
    return names.some(name => normalize(name).includes(needle) || normalize(initials(name)).includes(needle));
  }
  function renderServerOptions() {
    const container = elements["character-server-options"];
    if (!container) return;
    const copy = currentCopy();
    const race = state.globalServerRace || "all";
    const labels = { all: copy.searchAll, 1: copy.searchElyos, 2: copy.searchAsmodian };
    for (const button of elements["character-server-races"].querySelectorAll("[data-server-race]")) {
      button.textContent = labels[button.dataset.serverRace];
      button.setAttribute("aria-pressed", String(button.dataset.serverRace === race));
    }
    const all = elements["character-server-all"];
    all.textContent = copy.serverReset;
    all.setAttribute("aria-pressed", String(!state.globalServerId));
    const matches = state.globalServers.filter(server => (race === "all" || String(server.raceId) === race)
      && globalServerMatches(server, state.globalServerQuery));
    container.replaceChildren();
    for (const raceId of [1, 2]) {
      const servers = matches.filter(server => Number(server.raceId) === raceId);
      if (!servers.length) continue;
      const group = node("section", "character-server-group");
      const heading = textNode("h3", labels[raceId]);
      heading.append(textNode("span", formatNumber(servers.length)));
      group.append(heading);
      const grid = node("div", "character-server-grid");
      for (const server of servers) {
        const option = textNode("button", globalServerName(server));
        option.type = "button";
        option.dataset.characterServer = String(server.serverId);
        option.setAttribute("aria-pressed", String(String(server.serverId) === state.globalServerId));
        option.addEventListener("click", () => selectGlobalServer(String(server.serverId)));
        grid.append(option);
      }
      group.append(grid);
      container.append(group);
    }
    const loading = state.globalServersLoading === state.globalRegion;
    const message = loading ? copy.globalServersLoading : state.globalServersError ? copy.globalServersError : copy.serverNoMatch;
    if (!matches.length) container.append(textNode("p", message, "character-server-empty"));
    elements["character-server-status"].textContent = loading ? copy.globalServersLoading
      : copy.serverCount.replace("{count}", formatNumber(matches.length));
    positionServerPicker();
  }
  function renderGlobalFilters() {
    const controls = elements["character-global-filters"];
    if (!controls) return;
    controls.hidden = searchOfficialRegion() !== "ww";
    const copy = currentCopy();
    elements["character-global-region-label"].textContent = copy.searchGlobalLabel;
    elements["character-global-server-label"].textContent = copy.serverFilter;
    const selected = state.globalServers.find(server => String(server.serverId) === state.globalServerId);
    const selectedName = selected ? `${globalServerName(selected)} · ${Number(selected.raceId) === 1 ? copy.searchElyos : copy.searchAsmodian}` : copy.globalAllServers;
    elements["character-global-server-value"].textContent = selectedName;
    elements["character-global-server"].title = selectedName;
    elements["character-global-server"].classList.toggle("is-filtered", !!selected);
    const reset = elements["character-global-server-reset"];
    reset.hidden = !selected;
    reset.setAttribute("aria-label", copy.serverReset);
    reset.title = copy.serverReset;
    const query = elements["character-server-query"];
    query.placeholder = copy.serverSearch;
    query.setAttribute("aria-label", copy.serverSearch);
    elements["character-server-close"].setAttribute("aria-label", copy.serverClose);
    elements["character-server-races"].setAttribute("aria-label", copy.searchRaceFilter);
    renderServerOptions();
    const retry = elements["character-global-retry"];
    retry.textContent = copy.retry;
    retry.hidden = !state.globalServersError;
  }
  async function loadGlobalServers(force = false) {
    const region = state.globalRegion;
    if (!region || (!force && (state.globalServersLoaded === region || state.globalServersError)) ||
        state.globalServersLoading === region) return;
    const requestId = ++state.globalServersRequest;
    state.globalServersLoading = region;
    state.globalServersError = false;
    renderGlobalFilters();
    try {
      const data = await fetchCharacterJson(`/servers?region=ww&globalRegion=${encodeURIComponent(region)}`);
      if (state.globalRegion !== region || requestId !== state.globalServersRequest) return;
      if (!Array.isArray(data?.serverList) || !data.serverList.length) throw new Error("empty server list");
      state.globalServers = data.serverList;
      state.globalServersLoaded = region;
    } catch {
      if (state.globalRegion === region && requestId === state.globalServersRequest) state.globalServersError = true;
    } finally {
      if (requestId === state.globalServersRequest) {
        state.globalServersLoading = "";
        if (state.globalRegion === region) renderSearchRegion();
      }
    }
  }
  function normalizeOfficialRegion(value) {
    if (/^(ww|global)$/i.test(String(value || "").trim())) return "ww";
    return /^(tw|taiwan|zh-tw)$/i.test(String(value || "").trim()) ? "tw" : "kr";
  }
  function currentOfficialRegion(params = new URLSearchParams(window.location.search)) {
    return normalizeOfficialRegion(params.get("region"));
  }
  function searchOfficialRegion() { return state.searchRegion || defaultSearchRegion(state.locale); }
  function defaultSearchRegion(locale) {
    return locale === "ko" ? "kr" : locale === "zh-TW" ? "tw" : "ww";
  }
  function readSearchRegion(locale) {
    try {
      const saved = sessionStorage.getItem(`notmeter-character-search-region-v1:${locale}`);
      if (["kr", "tw", "ww"].includes(saved)) return saved;
    } catch { /* Storage may be unavailable in private browsing. */ }
    return defaultSearchRegion(locale);
  }
  function resetSearchRegion(region) {
    cancelSearch();
    setServerPickerOpen(false);
    state.searchRegion = region;
    state.searchKey = "";
    state.searchResults = [];
    state.searchComplete = true;
    state.searchRace = "all";
    setPopover(false);
  }
  function selectSearchRegion(region) {
    if (!["kr", "tw", "ww"].includes(region)) return;
    if (region !== searchOfficialRegion()) resetSearchRegion(region);
    try { sessionStorage.setItem(`notmeter-character-search-region-v1:${state.locale}`, region); } catch { /* ignored */ }
    renderSearchRegion();
    if (region === "ww") void ensureOfficialNameCatalog().then(refreshLocalizedContent);
  }
  function renderSearchRegion() {
    const copy = currentCopy();
    const region = searchOfficialRegion();
    const global = region === "ww";
    elements["character-search-form"]?.closest?.(".global-character-search")?.classList.toggle("has-global-region", global);
    const group = elements["character-search-regions"];
    if (elements["character-search-region-label"]) elements["character-search-region-label"].textContent = copy.searchScopeLabel;
    const names = { kr: copy.regionKr, tw: copy.regionTw, ww: copy.regionGlobal };
    for (const input of group?.querySelectorAll("[data-character-region]") || []) {
      const geography = input.dataset.characterGlobalRegion;
      input.checked = input.dataset.characterRegion === region && (!geography || geography === state.globalRegion);
      input.closest("label").querySelector("[data-region-name]").textContent = geography
        ? globalRegionName(geography) : names[input.dataset.characterRegion];
    }
    const input = elements["character-search-input"];
    if (input) {
      input.disabled = false;
      input.setAttribute("placeholder", copy.placeholder);
    }
    if (elements["character-search-submit"]) elements["character-search-submit"].disabled = false;
    elements["character-search-form"]?.classList.toggle("is-unavailable", false);
    const note = elements["character-search-region-note"];
    if (note) {
      note.hidden = !global;
      const guide = state.globalServerId ? copy.globalSearchGuide : copy.globalAllServersGuide;
      note.textContent = state.globalServersError ? `${guide} ${copy.globalServersError}` : guide;
    }
    if (elements["character-search-description"]) elements["character-search-description"].textContent = global ? copy.globalDescription : copy.searchDescription;
    renderGlobalFilters();
    if (global) void loadGlobalServers();
    window.NotMeterCouponNotice?.refreshVisibility?.();
  }
  function readLocale() {
    if (globalThis.NotMeterI18n) return globalThis.NotMeterI18n.read();
    try {
      const saved = localStorage.getItem("notmeter-stats-locale");
      if (COPY[saved]) return saved;
    } catch { /* ignored */ }
    const languages = [
      ...(Array.isArray(navigator.languages) ? navigator.languages : []),
      navigator.language,
    ].map(value => String(value || "").trim().toLowerCase()).filter(Boolean);
    for (const language of languages) {
      if (language.startsWith("zh-tw") || language.startsWith("zh-hant") ||
          language.startsWith("zh-hk") || language.startsWith("zh-mo") || language === "zh") return "zh-TW";
      if (language.startsWith("ko")) return "ko";
      if (language.startsWith("en")) return "en";
      if (language.startsWith("zh")) return "zh-TW";
    }
    return "en";
  }
  function titleCategoryLabel(category) {
    if (globalThis.NotMeterI18n?.supported.indexOf(state.locale) > 2) return globalThis.NotMeterI18n.text(({Attack:"Attack type",Defense:"Defense type",Etc:"Utility type"})[category] || "Utility type", state.locale);
    const key = String(category || "Etc");
    const labels = state.locale === "zh-TW"
      ? { Attack: "攻擊系列", Defense: "防禦系列", Etc: "其他系列" }
      : state.locale === "en"
        ? { Attack: "Attack type", Defense: "Defense type", Etc: "Utility type" }
        : { Attack: "공격계열", Defense: "방어계열", Etc: "기타계열" };
    return labels[key] || labels.Etc;
  }
  function isCharacterView() { return new URLSearchParams(window.location.search).get("view") === "character"; }
  function number(value) { return Number.isFinite(Number(value)) ? Number(value) : 0; }
  function formatNumber(value) { return new Intl.NumberFormat(state.locale === "zh-TW" ? "zh-TW" : state.locale).format(number(value)); }
  function formatDateTime(value) {
    const date = new Date(value || 0);
    if (!Number.isFinite(date.getTime())) return "—";
    return new Intl.DateTimeFormat(state.locale === "zh-TW" ? "zh-TW" : state.locale, {
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    }).format(date);
  }
  function formatCompactCombatPower(value) {
    const combatPower = Math.max(0, number(value));
    if (combatPower >= 1_000_000) return `${formatNumber(Math.floor(combatPower / 1_000))}M`;
    if (combatPower >= 1_000) return `${(combatPower / 1_000).toFixed(1).replace(/\.?0+$/, "")}K`;
    return formatNumber(Math.round(combatPower));
  }
  function canonicalJobName(job) {
    const value = String(job || "").trim();
    const aliases = {
      "劍星": "검성", "殺星": "살성", "弓星": "궁성", "魔道星": "마도성",
      "精靈星": "정령성", "守護星": "수호성", "治癒星": "치유성",
      "護法星": "호법성", "拳星": "권성",
      "Gladiator": "검성", "Templar": "수호성", "Assassin": "살성",
      "Ranger": "궁성", "Sorcerer": "마도성", "Spiritmaster": "정령성",
      "Cleric": "치유성", "Chanter": "호법성", "Brawler": "권성",
    };
    return aliases[value] || value;
  }
  function jobIcon(job) {
    const canonical = canonicalJobName(job);
    return canonical ? `./assets/jobs/${encodeURIComponent(canonical)}.png` : "./assets/notmeter-icon.png?v=20260927-split";
  }
  function formatCopy(key, values = {}) {
    let value = currentCopy()[key] || COPY.ko[key] || key;
    for (const [name, replacement] of Object.entries(values)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
    return value;
  }
  function localizeGameName(value, type = "") {
    return globalThis.NotMeterStatsLocalization?.gameName?.(value, type) || String(value || "");
  }

  function safeImageUrl(value) {
    try {
      const url = new URL(String(value || ""), window.location.href);
      if (url.origin === window.location.origin ||
          (url.protocol === "https:" && ["plaync.com", "playnccdn.com", "ncsoft.com"].some(domain =>
            url.hostname === domain || url.hostname.endsWith(`.${domain}`)))) return url.href;
    } catch { /* ignored */ }
    return "./assets/notmeter-icon.png?v=20260927-split";
  }

  function createImage(src, alt) {
    const image = document.createElement("img");
    image.src = safeImageUrl(src);
    image.alt = alt || "";
    image.loading = "lazy";
    image.decoding = "async";
    return image;
  }
  function node(tag, className = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }
  function textNode(tag, text, className = "") {
    const element = node(tag, className);
    element.textContent = text == null ? "" : String(text);
    return element;
  }

  window.NotMeterCharacter = {
    activate,
    getSearchRegion: searchOfficialRegion,
    setLocale(locale) {
      if (!COPY[locale]) return;
      const changed = state.locale !== locale;
      state.locale = locale;
      if (changed) resetSearchRegion(readSearchRegion(locale));
      applyCopy();
      void ensureOfficialNameCatalog().then(refreshLocalizedContent);
      if (changed && isCharacterView() && state.profile) void loadProfile(true, false);
    },
  };
})();
