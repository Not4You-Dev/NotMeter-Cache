globalThis.NotMeterTutorial.en = {
  "ui": {
    "tutorial": "User guide",
    "website": "Website",
    "home": "Guide home",
    "edition": "Updated October 17, 2026",
    "search": "Search features and settings",
    "menu": "Contents",
    "heading": "NotMeter\nUser guide",
    "intro": "From your first connection to reading a combat report. Follow along with real NotMeter screens, one feature at a time.",
    "begin": "Get started",
    "cover": "Actual meter preview with sample combat data",
    "contents": "Browse by setting",
    "contentsHint": "In the same order as the app.",
    "groups": [
      "Getting started",
      "Meter settings",
      "In-game tools",
      "System and connection"
    ],
    "paths": [
      [
        "Connect your character",
        "Install, choose a language and check the game connection."
      ],
      [
        "Make the meter fit your screen",
        "Adjust size, text and the information you want to see."
      ],
      [
        "Track buffs and cooldowns",
        "Choose your skills, alerts and overlay layout."
      ],
      [
        "Something not working?",
        "Check detection, click-through and update issues."
      ]
    ],
    "reference": "Settings reference",
    "referenceHint": "Open an item for its description and screen location.",
    "location": "Where to find it",
    "settings": "Settings",
    "gallery": "Actual app screen",
    "example": "Names and numbers are examples. Connection status and feature availability depend on your server and PC.",
    "zoom": "Select the image to enlarge it.",
    "previous": "Previous screen",
    "next": "Next screen",
    "page": "Screen",
    "showScreen": "Show this setting in the screenshot",
    "default": "Value shown",
    "range": "Range",
    "choices": "Available choices",
    "more": "Related guides",
    "copyLink": "Copy page link",
    "copied": "Link copied.",
    "copyFailed": "Please copy the address from your browser.",
    "searchTitle": "Search results",
    "found": "results",
    "empty": "No matching items. Try a shorter feature or setting name.",
    "error": "Could not load the guide. Check your connection, then try again.",
    "retry": "Try again",
    "close": "Close",
    "screenshotLanguage": "App screen language",
    "guideLanguage": "Guide language",
    "languageNote": "Instructions and app screenshots are available in all nine website languages. You can select a different language for the screenshots.",
    "sourceNote": "Based on the actual NotMeter 1.0.279 interface and behavior.",
    "discord": "Get help",
    "feedback": "If the issue continues, share your version, server, symptoms and a screenshot.",
    "skip": "Skip to content",
    "important": "Before you continue",
    "allOptions": "Expand all settings",
    "collapseOptions": "Collapse all settings",
    "screenshotDefault": "Screenshots illustrate the controls; the values shown are not a recommended preset.",
    "noDetails": "See the steps and actual app screen above for this control.",
    "missing": "Page not found",
    "support": "Troubleshooting",
    "sample": "Example",
    "privacy": "Privacy policy",
    "fit": "Fit",
    "iconTitle": "Class marks and the CP icon",
    "cpTitle": "Combat Power (CP)",
    "cpDetail": "The number beside a character name. It is separate from DPS and from the class mark.",
    "jobs": [
      "Gladiator",
      "Templar",
      "Ranger",
      "Assassin",
      "Sorcerer",
      "Cleric",
      "Spiritmaster",
      "Chanter",
      "Brawler"
    ],
    "findOption": "Enter this setting name in the app’s option search to find it.",
    "helper": "Linux capture helper",
    "launchMeter": "Launch NotMeter",
    "meterPath": "Meter",
    "results": "What you will see",
    "when": "When it appears",
    "read": "How to read it",
    "check": "If it is missing or different",
    "setup": "How to set it up",
    "confirmation": "Check after saving",
    "stageNote": "Still images rendered by the actual app using sample values, enlarged for readability.",
    "showing": "Controls to look for in this image"
  },
  "articles": {
    "start": {
      "title": "Get started",
      "intro": "Check your connection first, then enable the features you need. You do not have to configure everything at once.",
      "steps": [
        "Open the <a href=\"./?download=1\" data-download>download instructions</a> on the website and download Npcap and NotMeter. If Npcap is already installed, you can skip installing it again.",
        "Extract the entire ZIP into a folder and run <code>NotMeter.exe</code>. Do not run it from inside the ZIP.",
        "Use the <b>Language</b> card at the top left of Settings. Choose English for a quick switch, or open All languages to choose another language. Headings, descriptions and previews change immediately while Settings stays open. You do not need to close and reopen it. Save to keep the change.",
        "Enter the game world, past character selection, and move or attack. Check that your character name appears in the idle meter.",
        "If it does not connect, open <b>Settings → Network → Find your adapter</b> while moving or attacking. A green “In use” label means a game connection has been confirmed.",
        "Hover over the meter to reveal its menu, then click the <b>sliders icon</b> to open Settings. Adjust the size and text, then click <b>Save</b>. On Windows, you can also right-click the NotMeter icon in the notification area and choose Settings."
      ],
      "notes": [
        "Hotkeys are unassigned by default. Set shortcuts for opening Settings and showing/hiding the meter so you can access them while it is locked."
      ],
      "related": [
        "Language",
        "Network",
        "Hotkeys",
        "Meter"
      ],
      "screens": [
        "Language-1.webp",
        "Network-1.webp",
        "Meter-1.webp"
      ]
    },
    "reading": {
      "title": "Read and control the meter",
      "intro": "Learn where to find boss information, player statistics and the bottom menu.",
      "steps": [
        "<b>Boss information</b> shows the target, remaining HP and combat time. You can toggle the HP number, percentage and bar separately.",
        "<b>Player rows</b> show name, class, CP, DPS and contribution. DPS is recorded damage divided by combat duration. The contribution percentage depends on the basis selected in Settings.",
        "Hover over a player for a summary, or select the row to open combat details. These two features have separate toggles.",
        "The menu shown on hover provides screenshots, combat records, Settings and Exit. You can also keep these buttons visible.",
        "Position and resize the meter, then lock it. To keep certain controls clickable while locked, use <b>General → Click permissions while locked</b>.",
        "Enable HPS under Meter → Display items to show it beside DPS without increasing row height. It is off by default. Choose specific classes, yourself only, positive HPS only, and a display color."
      ],
      "notes": [
        "Check whether contribution uses boss maximum HP or recorded party damage. Percentages calculated with different bases are not directly comparable.",
        "“Show only my damage” hides other rows but keeps party tracking and combat records."
      ],
      "related": [
        "Display",
        "General",
        "details"
      ],
      "screens": [
        "Meter-1.webp",
        "Display-10.webp"
      ]
    },
    "details": {
      "title": "Read skill-by-skill combat details",
      "intro": "Look beyond total damage to see skill contribution and hit results.",
      "steps": [
        "Enable <b>Settings → Meter → Display fields → Combat details</b> and save.",
        "Select a player row during or after combat. Use the player tabs at the top to switch between party members.",
        "Review skill damage, uses, hits, average and best damage, plus critical, Double Chance, Perfect Chance, front/back and parry statistics. Choose visible metrics at the top right of the detail window.",
        "Check the buff uptime area for buffs that were detected. Missing observations are displayed as unavailable rather than reconstructed.",
        "Enable <b>Save combat records</b> if you want to revisit these details later. Saved player rows also open the detail window.",
        "Under Settings → Meter → Display fields, the player-row hover preview can use <b>Auto / Left / Right</b>. Auto is the default and uses available space. A chosen side is preserved while keeping the preview within the screen.",
        "HPS in app and website combat details is healing cast by that character divided by combat time. Healing received from other characters is not added to the recipient's HPS.",
        "Enable Exclude guaranteed-critical skills to calculate the average critical rate without confirmed guaranteed-critical specialization skills. Total damage and DPS stay unchanged. Check the separate choices in post-combat statistics and the detail window.",
        "Expand Automatic Stigma traits to inspect them. Active traits use color and a check mark; locked and unknown are separate states. Unknown means the available skill information is insufficient, not that the trait is inactive."
      ],
      "notes": [
        "Starting the meter or enabling collection partway through a fight cannot recover earlier hits. A dash for nDPS or ranking data does not mean zero.",
        "Names in the game client: Double Chance · Perfect Chance · Critical Hit · Parry."
      ],
      "related": [
        "CombatRecords",
        "Display"
      ],
      "screens": [
        "feature-detail.webp",
        "feature-records.webp"
      ]
    },
    "training": {
      "title": "Training Scarecrow and 1-minute rankings",
      "intro": "Local practice records and website rankings have different requirements.",
      "steps": [
        "For a local practice record, enable <b>Settings → Combat records → Save Training Scarecrow records</b> and choose a recording duration. This does not change the fixed 1-minute ranking duration.",
        "Global 1-minute rankings require the <b>Legion Airship</b>. Both the melee dummy and Training Scarecrow are accepted and appear together in the website’s Training Scarecrow tab.",
        "Confirm character detection before starting. Measure without outside effects: records are excluded when party buffs or debuffs from another class are detected.",
        "The ranking snapshot is taken at exactly one minute of combat time. Continuing to attack does not replace it with a longer-duration result.",
        "On the website, select Global, Training Scarecrow, your class and a CP bracket. Records from 150K up to, but not including, 1000K use 25K brackets, with TOP20 and top 10% / 25% DPS thresholds.",
        "The 60-second snapshot is saved automatically, so you do not need to stop attacking at exactly one minute. <b>Saved / Waiting to send / Registered</b> are different states. A save notification does not confirm ranking registration; check the record card’s registration status.",
        "In the training dummy tab, use Select for comparison on two eligible 1-minute records to assign baseline A and comparison B, then compare the selected records. Swap baseline switches A and B.",
        "To compare with a website ranker, copy your 1-minute comparison code from a record, open a training dummy ranker's combat details for the same class, and paste it into Compare with my record."
      ],
      "notes": [
        "Global training dummy weekly places 1–5 in your class and 25K CP bracket get animated ranker and nickname effects; places 6–20 get the existing static border. All-time ranks alone do not grant weekly benefits. Nickname coupons with at least 2 months remaining keep ranker animation regardless of rank. Supported from version 279. Please update if you are using an older version.",
        "Ranks use published statistics. Recording a new fight does not immediately refresh every table on the website.",
        "In-game names: Training Scarecrow · Melee Training Scarecrow · Verteron Legion Airship · Morheim Legion Airship."
      ],
      "related": [
        "CombatRecords",
        "rankings",
        "character"
      ],
      "screens": [
        "CombatRecords-1.webp"
      ]
    },
    "rankings": {
      "title": "Ranks, percentiles and nickname effects",
      "intro": "A result shown after combat, a published rank and effect eligibility are different things.",
      "steps": [
        "In <b>Meter → Display fields</b>, configure ranker markers and post-combat rank/percentile displays separately. Choose DPS, nDPS or both where available.",
        "Select <b>Ranking statistics</b> in combat records to open the website. Check region, time period, boss, class and any CP filter.",
        "Global compares one best DPS per character, boss, class, 25K CP bracket and period. Only TOP20 retains battle details; other characters still contribute their best DPS to percentile calculations. All CP and All bosses are selected by default, without adding DPS across bosses.",
        "To use an effect, open <b>Settings → Nickname Effects</b>, verify the detected character and current eligibility, select an effect and save.",
        "Global dungeons and the 1-minute dummy grant animated ranker and nickname effects for weekly TOP5, and a static border for places 6–20 in the original boss, class and 25K CP bracket. The position in All CP or All bosses is not used. Coupons with at least 2 months remaining grant ranker animation separately. Global refreshes alongside KR/TW: the next calculation currently starts 30 minutes after publication finishes, with calculation and publication taking additional time. An estimate immediately after combat does not unlock effects."
      ],
      "notes": [
        "Reaching a bracket rank once does not activate an effect immediately. Published ranks and your current character eligibility must be checked. KR/TW also has current CP-bracket requirements.",
        "A dash can mean comparison data or a verified result is unavailable. It is not a zero-damage result.",
        "Global CP-bracket ranks, post-combat top % and effect transitions require version 279 or later. Update older versions. With comparison data, your own percentile can be shown through 100%; party members appear with a published TOP20 rank or a top-10% result."
      ],
      "related": [
        "NicknameEffects",
        "CombatRecords",
        "training",
        "character"
      ],
      "screens": [
        "result-web-home.webp",
        "NicknameEffects-1.webp"
      ]
    },
    "resources": {
      "title": "Energy, entry tickets and daily points",
      "intro": "Choose which resources appear on the meter and open character summaries.",
      "steps": [
        "Under <b>Meter → Display fields</b>, choose energy, Shugo Festival keys and resource display while idle.",
        "Enable the entry tickets, dimensional keys and today’s Abyss/ranking points that you need. Base and bonus values depend on what the game has reported.",
        "Select today’s points display to open the character summary. The energy status window can also be opened with a hotkey.",
        "Assign hotkeys for the artifact and field-boss status windows. Published status is also available from the corresponding website menus."
      ],
      "notes": [
        "For a dash, first check character and server detection. Resource information that has not arrived is not assumed to be zero."
      ],
      "related": [
        "Display",
        "Hotkeys",
        "FieldBoss",
        "troubleshooting"
      ],
      "screens": [
        "Display-5.webp",
        "Display-6.webp"
      ]
    },
    "obs": {
      "title": "Add the meter to OBS",
      "intro": "Use a browser source to show the main meter in OBS running on the same PC.",
      "steps": [
        "Enable <b>Settings → General → OBS browser source</b> and <b>Save</b>.",
        "Select <b>Copy URL</b> beside the address in General settings.",
        "In OBS, add a <b>Browser</b> source and paste the address into its URL field.",
        "Start with width <b>1000</b> and height <b>1000</b>, then position it in your scene. Adjust meter size and visible information in NotMeter.",
        "If you change the port, save and copy the new address into OBS as well."
      ],
      "notes": [
        "This source includes the main meter only, not separate Combat Assist or detail windows. It works on the same PC; the address cannot be copied directly to OBS on another computer.",
        "For a blank source, check that NotMeter is running, that you saved after enabling the source, and that the URL and port match."
      ],
      "related": [
        "General",
        "Optimization",
        "Meter"
      ],
      "screens": [
        "feature-obs.webp"
      ]
    },
    "proton": {
      "title": "Connect on Linux / Proton",
      "intro": "Run the NotMeter interface under Proton and receive game traffic through the optional Linux capture plugin.",
      "steps": [
        "First confirm that AION 2 runs in your existing Proton setup. You may start the new launcher before the game; it waits for the actual game process before opening NotMeter.",
        "Download the <b>Proton plugin ZIP</b> above and extract it next to NotMeter.exe. Make sure <code>Plugins/Proton/notmeter_start.py</code> is present. The EXE alone is not enough.",
        "Prepare Python 3.9 or later, dumpcap and a native Linux installation of Protontricks. Run <code>dumpcap -D</code> to check capture access as your normal user. Flatpak setups require separate validation.",
        "Run just the <b>notmeter_start.py</b> command below in a Linux terminal. If several network interfaces are available, choose the one carrying game traffic on first use. Your choice is saved; use <code>--interface NAME</code> to change it. There is no need to start the capture helper separately.",
        "Once the game is running, the script starts capture and NotMeter automatically. Keep the terminal open while using NotMeter. The default Steam Global app ID is 3393110. Use <code>--appid NUMBER</code> for another installation or <code>--exe \"path/NotMeter.exe\"</code> for a different meter location.",
        "Move or attack in the game and check that your character and damage appear. Closing NotMeter also stops the capture helper started by this script. Use the same command next time."
      ],
      "notes": [
        "“NotMeter connected” and a growing packet count do not by themselves confirm character detection. FPS, window rendering and other features can still depend on your Proton environment.",
        "Normal capture does not write diagnostic files. Add NOTMETER_PROTON_DIAGNOSTICS=1 only when requested for troubleshooting, then remove it afterward. Do not share connection.json.",
        "Close NotMeter and any capture helper started with the old commands before using this launcher. Ctrl+C stops this launcher’s capture helper; close NotMeter normally yourself. Close NotMeter before restarting the game as well."
      ],
      "related": [
        "Network",
        "troubleshooting"
      ],
      "screens": []
    },
    "troubleshooting": {
      "title": "Troubleshooting",
      "intro": "Start with the symptom. You do not need to reset every setting or reinstall as your first step.",
      "steps": [],
      "notes": [],
      "related": [
        "Network",
        "General",
        "Backup",
        "Hotkeys",
        "proton"
      ],
      "screens": [
        "Network-1.webp",
        "General-1.webp"
      ]
    },
    "Language": {
      "title": "Language",
      "intro": "The language menu is always at the top of the settings sidebar.",
      "steps": [
        "Use the <b>Language</b> card at the top left of Settings. Choose English for a quick switch, or open All languages to choose another language.",
        "Headings, descriptions and previews change immediately while Settings stays open. You do not need to close and reopen it. Save to keep the change.",
        "Interface language and game service region are separate. Selecting English does not turn a Korean-server connection into Global."
      ],
      "notes": [
        "Changing the interface language does not force a different game region. The service region is detected from the game connection."
      ],
      "related": [
        "start",
        "Network"
      ],
      "screens": []
    },
    "Meter": {
      "title": "Meter size and layout",
      "intro": "Keep the rows readable without covering the game.",
      "steps": [
        "Open <b>Settings → Meter → Layout</b>. Choose Theme A or B and compare them in the actual live preview.",
        "Theme B has its own 70–120% size control. Adjust scale, player count and scrolling, then check the combat and idle previews. Class icon themes A/B are a separate choice under Display fields.",
        "Choose whether extra rows extend upward. Enable a fixed player count and scrolling if you want a steady window height.",
        "Optionally show only your row or expand all rows after combat. Position the meter, save, then lock it."
      ],
      "notes": [
        "Use the Combat/Idle preview switch and zoom controls to check both states. Text and backgrounds are adjusted under Colors & fonts."
      ],
      "related": [
        "Design",
        "Display",
        "General",
        "IdlePhoto"
      ],
      "screens": []
    },
    "Display": {
      "title": "Choose what the meter shows",
      "intro": "Configure boss information, player rows, resources and performance indicators separately.",
      "steps": [
        "Choose boss name, HP, combat time, party DPS and cumulative damage. Separate mode lets you place boss HP in its own window.",
        "Choose CP, server names, online status and ranker markers. Disabling <b>Show my status</b> hides status indicators for both you and other users.",
        "In Theme A, choose post-combat statistics individually: Front Attack · Back Attack · Double Chance · Perfect Chance · Critical Hit · Parry. You can show only your own statistics.",
        "Enable <b>Combat details</b> to open skill information by selecting a row. Choose compact or expanded hover previews separately.",
        "Set contribution basis, damage gauge basis and number formatting, check the preview, then save.",
        "Under Settings → Meter → Display fields, the player-row hover preview can use <b>Auto / Left / Right</b>. Auto is the default and uses available space. A chosen side is preserved while keeping the preview within the screen.",
        "Enable HPS under Meter → Display items to show it beside DPS without increasing row height. It is off by default. Choose specific classes, yourself only, positive HPS only, and a display color.",
        "Enable Exclude guaranteed-critical skills to calculate the average critical rate without confirmed guaranteed-critical specialization skills. Total damage and DPS stay unchanged. Check the separate choices in post-combat statistics and the detail window."
      ],
      "notes": [
        "Post-combat hit statistics are available in Theme A. Showing only your statistics still keeps other players’ damage rows.",
        "Ping, FPS and CPU/RAM measure different things. Disabling FPS also stops its measurement. Unsupported or unavailable readings can appear as a dash.",
        "If FPS shows a dash and a permission notice appears, close NotMeter normally and run it again as administrator. A dash while the game process or a measurement is unavailable does not mean 0 FPS.",
        "If FPS still shows — after saving and restarting, search settings for FPS and run FPS test while the game is running. Send Copy diagnostic log along with your exact NotMeter version when requesting help."
      ],
      "related": [
        "reading",
        "details",
        "resources",
        "rankings",
        "bossForecast"
      ],
      "screens": []
    },
    "Design": {
      "title": "Colors, fonts and opacity",
      "intro": "Make the text readable first, then adjust backgrounds and gauges.",
      "steps": [
        "Choose the font and weight, then adjust name, DPS and boss-information text sizes independently.",
        "Enter a color directly or choose a target and color in <b>Color Finder</b>.",
        "Distinguish gauge opacity, row background, overall background and whole-window opacity. A 0% gauge setting hides the gauge itself.",
        "Choose class colors and an optional personal color, check Combat and Idle previews, then save.",
        "After installing a font, refresh the font list to find it. On 4K displays, adjust meter size, text size and Combat Assist icon scale separately, then check the actual display.",
        "Settings, Combat records and Combat details each have a Use selected font ON/OFF control. It defaults to OFF; enable it to use your meter font. Each window remembers its choice after restarting."
      ],
      "notes": [
        "If letters are missing or appear as squares, check the font fallback option. If text is blurry, try the sharp text-rendering option. At the lowest whole-window visibility setting, the meter remains faintly visible so you can find it again."
      ],
      "related": [
        "ColorFinder",
        "Meter",
        "Display"
      ],
      "screens": []
    },
    "ColorFinder": {
      "title": "Color Finder",
      "intro": "Apply colors without memorizing their codes.",
      "steps": [
        "Choose what to change from the <b>Apply to</b> selector.",
        "Select a color in the palette. It is applied to the preview and its code is copied.",
        "Check contrast in the combat preview and save. Paste the copied code into another color field to reuse it."
      ],
      "notes": [],
      "related": [
        "Design"
      ],
      "screens": []
    },
    "Presets": {
      "title": "Character presets",
      "intro": "Register separate settings for characters and switch automatically. Up to five presets can be stored.",
      "steps": [
        "Once the game character is detected, check the name in Character presets and click Register with current settings. Your current setup becomes its starting configuration.",
        "Use the design or Combat Assist shortcuts to customize it, then click Save at the bottom. The linked preset applies when that character is detected again.",
        "Use Copy current settings for another setup. Open Manage on a preset to rename it, change its character link or remove it."
      ],
      "notes": [
        "Registration, renaming and linking save immediately. Normal setting changes still require the bottom Save button. Presets do not change network settings."
      ],
      "related": [
        "Backup",
        "BuffUi",
        "Network"
      ],
      "screens": [
        "Presets-1.webp"
      ]
    },
    "NicknameEffects": {
      "title": "Nickname effects",
      "intro": "Control effects for your character and other players separately.",
      "steps": [
        "Choose whether to display your own and other players’ nickname effects.",
        "Select a design and inspect it in the combat-row preview. Adjust animation speed and brightness if needed.",
        "Once your character is detected, check current eligibility. Verify the character name before redeeming a coupon.",
        "With eligibility confirmed, choose the effect and save. Select the default appearance to stop using an effect."
      ],
      "notes": [
        "Losing ranking eligibility hides the effect but preserves your selected design. KR/TW bracket eligibility and Global weekly rewards have different requirements; see the ranking guide.",
        "If you rename a character after redeeming a coupon, restart NotMeter and let it detect the character again. The existing coupon benefits then transfer to the new name."
      ],
      "related": [
        "rankings"
      ],
      "screens": []
    },
    "BuffUi": {
      "title": "Set up Combat Assist",
      "intro": "Display buffs and cooldowns separately and receive the alerts you need.",
      "steps": [
        "In <b>Quick start</b>, select your class and apply the starter setup. Also check that <b>Show Combat Assist UI</b> at the top is ON.",
        "In <b>Skills</b>, switch between class skills, common effects, potions, scrolls and debuffs. Enable buff and cooldown displays separately for each skill.",
        "Click <b>Show settings</b> on the skill card to choose pinned icons, buff start/end alerts and cooldown alerts. Only that card expands. A disabled switch means that option is not supported for the skill.",
        "In <b>Alerts & voice</b>, enable voice, select the voice and volume, and choose the lead time. A skill’s card also lets you change its spoken name and individual alert timing.",
        "In <b>Appearance</b>, adjust size, expansion direction, opacity and colors. You can separate buffs from cooldowns or give notification popups their own position.",
        "Use <b>Position</b> and previews to place the overlay, then save. Notification previews let you position alerts without waiting for a real trigger.",
        "At the top of Combat Assist UI → Alerts & voice, enable and adjust <b>Sound effects</b> and <b>Voice</b> separately. Use their preview buttons before saving.",
        "To raise notifications without raising your headset’s overall volume, adjust <b>Alert sound boost</b> from 100% to 300%. Start at 100% and increase gradually. The boost also applies to other NotMeter alerts; it does not override mute or a volume of 0%.",
        "For a 4K screen, increase the icon scale in Appearance up to 400%. The preview’s viewing zoom only changes the editor view. Save and check the actual overlay size in game."
      ],
      "notes": [
        "Enabling a skill is not enough if the whole overlay is OFF. Also check “only during combat,” “only when active” and “keep visible when the meter is hidden.”",
        "For a sound only when the boss targets you, enable target-change sound and “only when I am the target” in Boss current target settings. Its sound, volume and repeat interval are separate from buff alerts.",
        "Hit-direction alerts use your direct hits. Summon, placed and damage-over-time hits are excluded from that check."
      ],
      "related": [
        "Hotkeys",
        "General",
        "Optimization"
      ],
      "screens": [
        "BuffUi-Start-1.webp",
        "feature-skills.webp",
        "feature-common.webp",
        "feature-potion.webp",
        "feature-scroll.webp",
        "feature-debuff.webp",
        "BuffUi-Alerts-1.webp",
        "BuffUi-Appearance-1.webp"
      ]
    },
    "PartyLookup": {
      "title": "Party and character lookup",
      "intro": "Party Lookup is hidden from Settings when a Global server is detected. It is a Korea/Taiwan feature and is separate from party cooldown tracking in Combat Assist.",
      "steps": [
        "Choose a separate lookup window or results inside the meter.",
        "Enable applicant lookup, current party lookup or character-detail lookup as needed.",
        "Choose the placement of new applicants, notification sound, text size and skill-card size.",
        "Optionally add character notes and skill aliases, then save."
      ],
      "notes": [
        "Party Lookup is hidden from Settings when a Global server is detected. It is a Korea/Taiwan feature and is separate from party cooldown tracking in Combat Assist."
      ],
      "related": [
        "Hotkeys",
        "Language"
      ],
      "screens": []
    },
    "CombatRecords": {
      "title": "Keep kill and attempt records",
      "intro": "Revisit completed fights and attempts after combat.",
      "steps": [
        "Enable <b>Save combat records</b> and choose the maximum count. Older records are pruned when the limit is exceeded.",
        "Open <b>Kill/Attempt records</b> using the meter’s record button or a hotkey. Check the Kill, Attempt, Dummy and Archive tabs separately.",
        "Filter by boss, then select a player to inspect skill details. Archive records you want to keep. Check before deleting; deletion is not reversible.",
        "Use screenshots and Copy my stats to share information. <b>Ranking statistics</b> opens website statistics for the relevant region.",
        "To clear the meter after a fight, enable <b>Auto reset after combat</b> and set the delay. This delay does not reset an ongoing fight or a newly started boss.",
        "In the training dummy tab, use Select for comparison on two eligible 1-minute records to assign baseline A and comparison B, then compare the selected records. Swap baseline switches A and B.",
        "To compare with a website ranker, copy your 1-minute comparison code from a record, open a training dummy ranker's combat details for the same class, and paste it into Compare with my record.",
        "Settings, Combat records and Combat details each have a Use selected font ON/OFF control. It defaults to OFF; enable it to use your meter font. Each window remembers its choice after restarting.",
        "Field-boss combat details defaults to OFF. Turning it ON collects details and saves kill records starting with the next field-boss fight, separately from normal detail/history settings. OFF keeps DPS measurement and existing records."
      ],
      "notes": [
        "The auto-reset delay begins after combat ends. It is different from the inactivity rules used to decide that combat has ended.",
        "Local dummy records support a duration of 5–120 seconds. Global rankings use a separate fixed 1-minute snapshot."
      ],
      "related": [
        "details",
        "training",
        "rankings"
      ],
      "screens": [
        "CombatRecords-1.webp",
        "feature-records.webp"
      ]
    },
    "FieldBoss": {
      "title": "Field-boss times and alerts",
      "intro": "Receive notifications for chosen bosses using schedules received from the game.",
      "steps": [
        "Enable field-boss alerts and select times such as 10 or 5 minutes before spawn. You may select multiple times.",
        "Choose KR/TW or Global and the area, then enable the bosses you want. Assign importance from zero to five stars.",
        "Open the relevant area’s <b>world map (M)</b> in the game to detect its schedule. If detection is incomplete, revisit that area on the map.",
        "Set position, duration and volume, check visual and sound previews, then save.",
        "At field bosses, Party members only OFF shows detected participants; ON shows you and your current party. This filters the display, not damage collection. Field-boss participants do not receive death indicators or death alerts.",
        "Field-boss combat details defaults to OFF. Turning it ON collects details and saves kill records starting with the next field-boss fight, separately from normal detail/history settings. OFF keeps DPS measurement and existing records."
      ],
      "notes": [
        "Boss selections and importance are saved separately by service. Alert times, sound and volume are shared.",
        "Field-boss damage tracking and spawn notifications are separate features. Damage tracking displays up to ten players and does not support Abyss tracking."
      ],
      "related": [
        "Alerts",
        "Hotkeys",
        "resources",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts"
      ],
      "screens": []
    },
    "Alerts": {
      "title": "Scheduled alerts and custom alarms",
      "intro": "Choose notification times and sounds for each event type.",
      "steps": [
        "At the top of Settings → Alert, <b>Game alert time basis</b> automatically detects the connected server by default. Korea, Taiwan, Global Asia, NA West, NA East, Europe and South America use their own schedules.",
        "Check the detected region, server time and <b>Next alert / My time</b>. Scheduled game alerts wait until the server is known. If necessary, manually choose the region you play in and Save.",
        "Battlefield, rift and Shugo Festival alerts use this server basis. Personal custom alarms still use your PC’s local time. You do not need to change the PC time zone.",
        "Enable only the alerts you need for Battlegrounds, Rifts and Shugo Festival, then choose when to be notified.",
        "Check each notification’s sound and volume. At 0% volume, only the visual popup appears.",
        "Use <b>Custom alarms → Manage alarms</b> to set days, times and advance notice.",
        "If popups obscure the game, enable separate mode, move the position preview and save.",
        "For low-contribution highlighting, set both the boss-HP threshold and contribution threshold. Your own row is excluded.",
        "Keep alerts until scheduled time holds advance custom, Shugo, rift, invasion and battlefield alerts with a countdown. Close early with ×. OFF or an alert at the scheduled time closes after about 10 seconds. Field bosses use their own duration setting."
      ],
      "notes": [
        "Rift alerts use the detected server’s time. Global also requires character-server detection. Fixed-time alerts may not reflect temporary maintenance or event schedule changes.",
        "Shugo Festival and Spacetime Rift have separate sound and volume settings. Save after moving alerts and check whether detached display is enabled. At 0%, only the notification window is shown."
      ],
      "related": [
        "FieldBoss",
        "General"
      ],
      "screens": [
        "feature-server-clock.webp"
      ]
    },
    "Bus": {
      "title": "Count boss kills",
      "intro": "Count selected boss kills and start again at your target count.",
      "steps": [
        "Enable <b>Bus count mode</b>.",
        "Enable only the bosses to count and set the target number.",
        "Adjust the current count if needed. Reaching the target automatically returns the count to zero.",
        "Save and check the counter after a selected boss is killed."
      ],
      "notes": [],
      "related": [
        "Display",
        "CombatRecords"
      ],
      "screens": []
    },
    "General": {
      "title": "Startup, locking and updates",
      "intro": "Control startup behavior and what remains clickable while locked.",
      "steps": [
        "Choose startup, taskbar visibility and whether the meter stays visible when you switch to another app.",
        "To keep the position fixed but use menus, enable <b>Show menus while locked</b> and allow only the menu actions you need.",
        "To select player rows, enable <b>Open character combat details while locked</b>. Combat details under Display fields must also be enabled.",
        "To interact with the meter temporarily by hovering, enable automatic click-through unlock and choose a hover delay. After that delay, clicks go to the meter instead of passing through to the game.",
        "Choose update checks during use and update notifications, then save. The startup update check is separate.",
        "<b>Fullscreen overlay recovery</b> under Settings → General is ON by default. It attempts to bring the main meter back when it falls behind the game. Some exclusive fullscreen modes still prevent overlays; use borderless windowed mode in that case.",
        "If the window has moved off screen, right-click the NotMeter system tray icon and choose <b>Reset meter window position</b>. You do not need to reset all settings.",
        "Settings remembers the last panel, subtab and scroll position when reopened. The User guide button at the top opens the guide in your current language after you confirm; the settings window closes.",
        "Search Settings by feature or option name, then click a result or press Enter. The matching tab and collapsed section open at that option. Searching does not change values; save after editing.",
        "Right-click the Windows tray icon and choose Reset all settings to open a confirmation before resetting. If you only lost the window position, use Reset meter window position first."
      ],
      "notes": [
        "By default, locking passes clicks through to the game. Dragging an allowed menu or player row while locked does not move or resize the meter.",
        "When click permissions while locked are in use, hover-to-unlock does not apply to a manual lock. Treat it as a separate setting."
      ],
      "related": [
        "Hotkeys",
        "obs",
        "troubleshooting",
        "combatVisibility",
        "Storage",
        "Storage",
        "Storage",
        "Storage",
        "Storage",
        "Storage",
        "Storage",
        "Storage"
      ],
      "screens": []
    },
    "Hotkeys": {
      "title": "Assign hotkeys",
      "intro": "Access settings and windows while the meter is locked.",
      "steps": [
        "Enable an action, choose a key and any Ctrl, Alt, Shift or Win modifiers.",
        "Start with <b>Open Settings</b>, <b>Show/hide meter</b> and <b>Click-through</b> for easy access and recovery.",
        "Optionally add combat reset, Combat Assist visibility, and shortcuts for records, energy, field-boss and artifact windows.",
        "Check for conflicts with game shortcuts, save and test the combination."
      ],
      "notes": [
        "All hotkeys are disabled initially. Example keys in this guide are not assigned automatically. For Exit and Restart, choose combinations you are unlikely to press accidentally."
      ],
      "related": [
        "General",
        "resources"
      ],
      "screens": []
    },
    "Render": {
      "title": "GPU / CPU rendering",
      "intro": "Adjust rendering when the display is broken or performance is affected.",
      "steps": [
        "If the current mode works well, keep it.",
        "For broken rendering or black windows, change the rendering mode, <b>save and restart</b>.",
        "Low-latency main-meter and buff-overlay modes are experimental. Change one at a time and compare the same scene.",
        "If row movement or numbers stutter in GPU mode, switch to CPU mode, Save and restart, then compare the same scene. Rank-change and number/gauge animations can be disabled separately. This does not guarantee compatibility between frame generation and overlays on every PC."
      ],
      "notes": [
        "Experimental modes are not guaranteed to improve every GPU or Proton setup. If a mode causes problems, disable it and restart."
      ],
      "related": [
        "Optimization",
        "troubleshooting"
      ],
      "screens": []
    },
    "Optimization": {
      "title": "Reduce display overhead",
      "intro": "Adjust presentation settings separately from combat measurements.",
      "steps": [
        "Try low-spec mode first. Turning it off restores the previous presentation settings.",
        "Increase the refresh intervals for numbers and Combat Assist to update them less often and reduce rendering work. Changes may take longer to appear on screen.",
        "Disable gauge/number animations and rank-change animations if needed.",
        "Optionally hide the meter during boss combat. It reappears afterward while auxiliary overlays and alerts remain available."
      ],
      "notes": [
        "Turning off the performance bar stops CPU/RAM measurement. FPS has a separate setting under Meter → Display fields."
      ],
      "related": [
        "Render",
        "Display",
        "obs"
      ],
      "screens": []
    },
    "Network": {
      "title": "Game connection and capture methods",
      "intro": "Try automatic detection first. If your character is not detected, check the network adapter and change the capture method only if needed.",
      "steps": [
        "The Windows default is <b>Npcap</b>. Run <b>Find your adapter</b> while moving or attacking in the game world.",
        "After changing a VPN or accelerator, refresh the list and search again. Look for the confirmed “In use” connection, not simply the busiest adapter.",
        "If Npcap is unsuitable, download the official <b>WinDivert plugin ZIP</b> and select <b>Open plugin folder</b>. Extract its files directly there without adding an extra nested folder.",
        "Select <b>Check installation</b>, choose <b>WinDivert · Optional plugin</b> and save. Exit NotMeter completely, then run it as administrator.",
        "For a second game PC, configure bidirectional port mirroring on your network equipment first. Choose the receiving adapter and the single game PC’s IPv4 address, then verify mirroring in Settings."
      ],
      "notes": [
        "You do not need WinDivert if Npcap works. Changing capture methods may not resolve a VPN or accelerator that hides the original game traffic.",
        "Port mirroring supports one game PC. Do not mirror a whole WAN uplink or multiple PCs. Separate internet and mirror-receiving adapters are recommended on the receiving PC.",
        "Once automatic detection has connected, you do not need to run Find your adapter at every launch. If you select an adapter manually, save and check the selection after restarting. Network settings do not transfer through backup codes or character presets."
      ],
      "related": [
        "start",
        "proton",
        "troubleshooting"
      ],
      "screens": []
    },
    "Backup": {
      "title": "Back up and restore the settings you choose",
      "intro": "Back up your chosen settings or share a design from one screen. Choose which categories to back up and which to restore. Network settings and idle background photos are excluded.",
      "steps": [
        "Open Settings → Backup & restore and select <b>Back up</b>. All categories are selected by default.",
        "Keep only the categories you need checked. To share appearance alone, select only <b>design</b>. Include <b>Combat Assist UI</b> to share your skill and cooldown setup too. The second image shows these two categories selected.",
        "Select <b>Create backup code</b>, then <b>Copy code</b> or <b>Save to file</b>. New codes are compressed to make them shorter. If you change the selection, create a new code.",
        "To import, select <b>Restore</b> on the same screen. Paste the complete code or use <b>Import from file</b> to open its text file, then select <b>Review settings to restore</b>.",
        "Select normal restore groups, then review the separate caution cards. Compare current and incoming values for automatic idle/reset, hiding, display limits, alerts and hotkeys. Keep mine is the default; choose Import only for the cards you want. Select all for normal groups does not approve caution cards.",
        "Select <b>Restore selected settings</b>. The changes take effect and Settings closes; no separate Save is needed. Reopen Settings to check the result."
      ],
      "notes": [
        "All network settings, including adapters, capture method and VPN settings, are excluded. Restoring an older code also preserves this PC’s current network settings.",
        "Window positions and the current lock state are preserved. Saved combat record files are not included; the combat record category contains settings such as saving and auto reset.",
        "Use the same Restore screen for new NM-SETTINGS-2 codes, older NM-SETTINGS-1 full backups and NM-SKIN-1 design codes. If a new code is not recognized, update NotMeter first.",
        "Idle-background photos and their settings are also excluded from backup codes.",
        "Caution cards appear only for values that differ. Unselected cards keep your settings. Changing the code or deselecting its restore group clears that approval. If the meter disappears after import, check automatic hiding, combat-only visibility and hotkeys."
      ],
      "related": [
        "Presets",
        "General",
        "troubleshooting",
        "Storage",
        "Storage",
        "Storage",
        "Storage",
        "Storage",
        "Storage",
        "Storage",
        "Storage"
      ],
      "screens": [
        "Backup-1.webp",
        "backup-code.webp",
        "backup-restore.webp"
      ]
    },
    "IdlePhoto": {
      "title": "Customize the idle background",
      "intro": "Choose your own photo or a built-in sample, then position it so your character information stays readable.",
      "steps": [
        "Open Settings → Meter → Background photo. Select a built-in sample from the photo library or choose a JPG, PNG or BMP file. Files can be up to 25 MB; a landscape image around 2000 × 800 px is recommended.",
        "Turn the background photo ON and choose <b>Full background / Photo left / Photo right</b>. Fill covers the available space and may crop the image; Fit keeps the whole image visible.",
        "Drag the photo in the preview to change its position and framing. Use the mouse wheel or zoom slider to resize it. Dragging does not rotate the photo.",
        "Adjust opacity, darkening, and the strength and extent of the text shading. Check that the name, server and resource values remain legible.",
        "Check both the detected-character and detecting-character previews, then Save. Switching photos restores the last framing and adjustments saved for each photo.",
        "The Default background (shared) editing target is used before character detection and for characters without a custom background. Keep it while adding individual character photos.",
        "After your character is detected, select Set this character’s background, choose the photo, framing and visibility, then save. Repeat with another character to switch automatically on detection. Restore default background removes that character’s override without deleting the image file."
      ],
      "notes": [
        "Photos appear only while idle. Enabling combat-only meter visibility hides the idle screen entirely.",
        "Character backgrounds are shared across all presets on this PC. Photo files and framing are excluded from backup and sharing codes."
      ],
      "check": "After saving, check the idle photo and character name. The photo should disappear when combat starts.",
      "related": [
        "Meter",
        "Design",
        "combatVisibility"
      ],
      "screens": [
        "feature-idle-photo.webp"
      ]
    },
    "bossForecast": {
      "title": "Boss time to kill and Frenzy (TTK)",
      "intro": "Estimate how long the current boss will take to defeat from its remaining HP and the party damage observed by NotMeter.",
      "steps": [
        "Open Settings → Meter → Display fields, enable <b>Estimated time to kill (TTK)</b> and/or <b>Estimated time to Frenzy</b>, then Save. Enabling both also shows how far ahead of or over the timer the estimate is.",
        "Attack a boss. Estimates appear below its HP as soon as the first damage and remaining HP are known. You do not have to wait 30 seconds; the first readings are marked as an initial estimate.",
        "<b>Kill</b> is the estimated time remaining from now. It uses up to 30 seconds of recent damage to this boss plus time since the last hit. Invulnerability or a mechanic that interrupts damage can increase it.",
        "<b>Frenzy</b> estimates the remaining time using confirmed boss timing data and the first attack. <b>Ahead</b> is the predicted margin before Frenzy; <b>Over</b> means the projected kill is later.",
        "If the boss is confirmed to have no Frenzy timer, Frenzy and the margin show ∞. Unknown timing data or an unconfirmed combat start are shown as unavailable, not as infinity."
      ],
      "notes": [
        "Supported on KR, TW and Global. After combat ends, the final TTK and enrage margin/overrun remain frozen. They do not keep counting down; a reset or new fight uses new values. Not shown for training dummies.",
        "This is a forecast, not a guaranteed clear time. Healing, changing damage output and joining a fight late can affect it."
      ],
      "check": "Check that estimates update during a boss fight and stay at the end-of-fight values afterward. Distinguish the enrage margin from unknown and ∞.",
      "related": [
        "Display",
        "details",
        "training"
      ],
      "screens": []
    },
    "combatVisibility": {
      "title": "Show the meter only during combat",
      "intro": "Hide the idle screen and bring the meter back automatically when combat begins.",
      "steps": [
        "Open Settings → General and turn ON <b>Show meter only during combat</b>. This option is OFF by default.",
        "Set the post-combat hide delay from 0 to 300 seconds. Zero hides it immediately; allow a few seconds if you want to read the results.",
        "Save. The main meter hides while idle, appears for combat and hides after the chosen delay. A new fight cancels a pending hide.",
        "While hidden, right-click the NotMeter icon in the Windows system tray to open Settings or presets. <b>Show</b> temporarily reveals the meter until the next fight. You can also assign a show/hide hotkey in advance."
      ],
      "notes": [
        "A meter you manually hide will not automatically reappear when combat starts. Combat Assist overlays have their own visibility settings.",
        "This cannot be enabled together with Hide meter during boss combat under Optimization."
      ],
      "check": "Check the full sequence: hidden while idle, visible during combat, then hidden after the selected delay.",
      "related": [
        "General",
        "Hotkeys",
        "locks"
      ],
      "screens": [
        "feature-combat-visibility.webp"
      ]
    },
    "character": {
      "title": "Character profiles and ranked combat details",
      "intro": "In Skills, select the character’s uploaded PVE/PVP build. If no submitted build exists, recorded ranking specializations are shown; skills missing from the latest fight may use earlier records. Check the selected source and record dates.",
      "steps": [
        "On the website, open <b>Character Search</b> and choose Korea, Taiwan or Global. For Global, also select the game region. Search by name and open the character on the correct server.",
        "Check <b>This week</b> and <b>All time</b> separately. A character without a record this week may still have all-time records.",
        "Use a record’s <b>Combat details</b> button to view player damage, skills and buffs from that specific fight. Selecting another record opens that fight’s details.",
        "In Skills, select the character’s uploaded PVE/PVP build. If no submitted build exists, recorded ranking specializations are shown; skills missing from the latest fight may use earlier records. Check the selected source and record dates.",
        "Only active and passive skills are uploaded; Stigma skills are excluded. Manual entry does not change skills in the game. Choose Use detected build to return to automatic data.",
        "HPS in app and website combat details is healing cast by that character divided by combat time. Healing received from other characters is not added to the recipient's HPS.",
        "In Daevanion, choose a board and select nodes to inspect effects and active status. Search for effects, scroll to zoom, drag to move, or use Fit to view and Expand. A board cannot be shown when official public data is unavailable.",
        "Expand Automatic Stigma traits to inspect them. Active traits use color and a check mark; locked and unknown are separate states. Unknown means the available skill information is insufficient, not that the trait is inactive."
      ],
      "notes": [
        "After a successful upload, open Character search → your character → Skills on the website. PVE and PVP share a 30-second upload interval; website changes can take about 5–10 minutes."
      ],
      "check": "Check the character’s region and server, and confirm that the detail view matches the record you selected.",
      "related": [
        "rankings",
        "details",
        "SkillTrees",
        "CloudSettings",
        "website"
      ],
      "screens": []
    },
    "CloudSettings": {
      "title": "Save & share settings",
      "intro": "Store your setup privately, publish it, or preview and import another player's meter.",
      "steps": [
        "Open Settings → Save/share settings and check the detected character. The character must be level 45 or above.",
        "Choose the settings to include. Enable publication in character search and click Update settings to share them; leave publication unchecked for private storage.",
        "Wait for confirmation that the upload succeeded. Editing or saving settings alone does not upload them. Publish later changes with Update settings; successful uploads can be repeated every 30 minutes.",
        "Open Meter sharing on the website and filter by class, region or name. Setups appear in like order, with 20 per page. Switch between Idle, Combat and Combat Assist previews. Likes cannot be undone.",
        "Open a card to zoom or expand the preview. Copy its setup code, then choose which sections to restore in NotMeter's Backup/restore screen. Click outside the popup to close it."
      ],
      "notes": [
        "Website updates can take about 5–10 minutes, including unpublishing and deletion. Codes already copied by other people cannot be recalled.",
        "Public sharing excludes personal notes, custom speech text, file paths, window positions, network settings, hotkeys and combat records. Your recovery code unlocks private storage: keep it private.",
        "Select normal restore groups, then review the separate caution cards. Compare current and incoming values for automatic idle/reset, hiding, display limits, alerts and hotkeys. Keep mine is the default; choose Import only for the cards you want. Select all for normal groups does not approve caution cards."
      ],
      "related": [
        "Backup",
        "Presets",
        "character",
        "website"
      ],
      "screens": [
        "CloudSettings-1.webp",
        "result-web-sharing.webp"
      ]
    },
    "SkillTrees": {
      "title": "Share skill build",
      "intro": "Publish your current skill levels and specializations as separate PVE and PVP builds.",
      "steps": [
        "Start NotMeter before entering the game from character selection with a level 45+ character. If already in the game, return to character selection and enter again.",
        "Use detected build shows detected levels and selected traits. If no data arrives, wait for character/class detection, choose Enter manually and fill in each skill’s level and traits. Enter 0 for unlearned skills and complete all required fields before sending.",
        "Equip the intended build in the game, then click Send as PVE or Send as PVP. Each mode is stored separately; sending the same mode updates its previous build.",
        "After a successful upload, open Character search → your character → Skills on the website. PVE and PVP share a 30-second upload interval; website changes can take about 5–10 minutes."
      ],
      "notes": [
        "Only active and passive skills are uploaded; Stigma skills are excluded. Manual entry does not change skills in the game. Choose Use detected build to return to automatic data."
      ],
      "related": [
        "character",
        "CloudSettings"
      ],
      "screens": [
        "SkillTrees-1.webp",
        "result-web-skills.webp"
      ]
    },
    "Rtss": {
      "title": "RTSS (TEST)",
      "intro": "An optional output mode draws the meter, Combat Assist and alerts inside the game.",
      "steps": [
        "Use the official download button in Settings → RTSS (TEST) to install and run RTSS 7.3.7 or later. MSI Afterburner and CapFrameX are not required.",
        "Add an Aion2.exe profile in RTSS. Set Application detection level to Low, On-Screen Display support to ON, and rendering to Raster 3D.",
        "Choose the displayed items and placement in NotMeter, enable RTSS output and save. Run the in-game output test and return to the game within 20 seconds to check the text.",
        "Use the tray menu or assigned hotkeys to open settings and records; the in-game display is not directly clickable. Adjust positions in placement mode, then save."
      ],
      "notes": [
        "Leave this off if your current display works well. It does not increase FPS. If nothing appears, check permissions and the game profile, then copy RTSS diagnostics when requesting help."
      ],
      "related": [
        "Render",
        "General",
        "BuffUi"
      ],
      "screens": [
        "Rtss-1.webp"
      ]
    },
    "website": {
      "title": "Finding features on the website",
      "intro": "Choose a website menu according to the information you need.",
      "steps": [
        "In rankings, select KR/TW or Global, then the period, dungeon, boss and class. Global uses DPS; check the DPS/nDPS choice for KR/TW. This week and All time represent different records.",
        "In the setup guide, choose a class and the stones, soul imprints, Arcana or skill specialization tab. Read the actual specialization options alongside their selection rates and popular-choice markers. Check sample size and update time.",
        "For the stat efficiency calculator, paste Copy my stats from a combat record and enter only the changes. Effects such as Double Chance depend on target resistance and probability caps; check the explanation and current values if the predicted gain is zero.",
        "Compare class statistics, overall class rankings and boss resistances under matching regions, periods and conditions. Praise rankings and Meter sharing likes are separate from combat DPS rankings.",
        "Set the server region and time zone for Field bosses. Use Artifacts to inspect supported servers' ownership. Website views and the meter's alert switches are configured separately."
      ],
      "notes": [],
      "related": [
        "rankings",
        "character",
        "CloudSettings",
        "SkillTrees",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts",
        "webBossAlerts"
      ],
      "screens": [
        "result-web-home.webp",
        "result-web-setup.webp"
      ]
    },
    "Storage": {
      "title": "Change data storage location",
      "intro": "Move settings, presets, combat records, photos and audio to another local folder.",
      "steps": [
        "Open Settings → Backup & restore → Data storage location. The default is %LOCALAPPDATA%\\Not4You-Meter\\. Choose Change folder, select an empty local folder and confirm.",
        "The move is scheduled immediately. Exit NotMeter normally and restart; it copies and verifies files before switching. Original files remain as a safety copy. The EXE installation location does not change.",
        "After restarting, use Open current folder and check your settings and records. If a move fails, inspect its status and retry or cancel the scheduled move. Sharing codes and presets do not change another PC’s storage location."
      ],
      "notes": [],
      "check": "After restarting, use Open current folder and check your settings and records. If a move fails, inspect its status and retry or cancel the scheduled move. Sharing codes and presets do not change another PC’s storage location.",
      "related": [
        "Backup",
        "CombatRecords",
        "IdlePhoto"
      ],
      "screens": [
        "Backup-1.webp"
      ]
    },
    "webBossAlerts": {
      "title": "Website field-boss alerts",
      "intro": "Alerts are available in desktop browsers only. On mobile, you can still view the field boss schedule. Track selected bosses and receive alerts while the website is open, even when the game and meter are closed.",
      "steps": [
        "On the website Field bosses page, choose KR, TW or Global; for Global, also choose the game region. Select your server, then Alert beside each boss you want. Check the server to avoid selecting the same name on another server.",
        "In My boss alerts, choose timing, sound and volume, then Start alerts. Choose server & bosses to change targets, or remove a boss with ×.",
        "Check that browser notification permission says Allowed. If permission is needed, select Allow browser notifications and accept the browser prompt. If blocked, change this site’s browser permissions and check again. Use Test alert to confirm sound and notifications.",
        "Timers keep refreshing for your chosen server on other website pages. Pause stops notifications, not schedule refreshes. Waiting for spawn data means no confirmed schedule is available; check the selected server and update status."
      ],
      "notes": [
        "No game or meter needed. Keep a NotMeter tab open. Alerts stop when the tab closes or the device sleeps, and may be delayed in the background.",
        "Saved automatically in this browser."
      ],
      "check": "Permission is granted. Send a test alert to check that it appears.",
      "related": [
        "website",
        "FieldBoss",
        "Alerts"
      ],
      "screens": [
        "result-web-boss-alerts.webp"
      ]
    }
  },
  "problems": [
    [
      "Stuck on “Detecting character”",
      "Enter the world and move or attack, then refresh the adapter list and run Find your adapter. With a VPN, check that original game traffic is visible on the selected path. On Proton, verify that both the plugin and Python helper are connected."
    ],
    [
      "The window is invisible or I cannot click it",
      "Open Settings from the Windows system tray icon. Check visibility, whole-window opacity, game-only display, locking and click-through. If already assigned, use the Open Settings hotkey."
    ],
    [
      "I enabled a skill but Combat Assist is missing",
      "Check the master Combat Assist toggle, the individual skill, only-during-combat and only-when-active settings. Unsupported options are disabled. Use the position preview to check whether the overlay is off screen."
    ],
    [
      "Popups appear but there is no sound",
      "Check both the skill’s alert choices and the master sound/voice options. Check for 0% volume, per-skill voice disabled, and the boss-target “only when I am the target” condition. Test the sound preview."
    ],
    [
      "The updater repeats or fails",
      "Select Update diagnostics at the top of Settings and copy the complete report. The current version and the version recorded in a previous failure can differ. Include the failure stage and error code."
    ],
    [
      "FPS, points or ranks show a dash",
      "Identify which value is missing. FPS depends on the game process and PC environment; points need character/resource detection; ranks need published data for those conditions. A dash is not zero, and these values do not necessarily share a cause."
    ],
    [
      "The meter does not reset immediately after combat",
      "Check Auto reset and its post-combat delay. A pause followed by new attacks or a new boss affects the reset conditions. If the timer stops while damage continues, share your version, boss, reproduction steps and screenshot."
    ],
    [
      "My backup code is rejected",
      "Use Backup & restore → Restore in the latest NotMeter and paste the complete code. New backups, older full backups and older design codes all use this screen. If copying lost part of the code, import the original text file. Keep your original backup."
    ]
  ],
  "scenes": {
    "assist": [
      "Buffs and cooldowns",
      "Appears when a selected skill’s buff or cooldown is detected. This example shows several skills together.",
      "In the Buff row, 24 means the effect has 24 seconds left. In the CD row, 41 means 41 seconds until reuse. 1:12 means one minute and 12 seconds. The same icon can appear in both rows with different timers.",
      "Check the master display switch and the skill’s separate buff/cooldown switches. Icon and timer colors depend on your settings.",
      [
        "Buff duration above, cooldown below"
      ]
    ],
    "pinned": [
      "Pinned icons and ready state",
      "Enable Always show cooldown for a skill to keep its slot visible after the cooldown ends.",
      "The left example has 24 seconds remaining. On the right, the timer has disappeared but the pinned icon remains. Always show buff is a separate option that keeps the buff slot when no effect is active.",
      "A pinned icon alone does not mean a buff is active. The cooldown icon color inversion setting can also reverse which state looks bright or dim.",
      [
        "Cooling down · 24 seconds",
        "Pinned · no cooldown timer"
      ]
    ],
    "combined": [
      "Two timers on one icon",
      "Select the combined theme under Appearance and track both buff and cooldown for the same skill.",
      "In this example, 12 at the bottom left is the remaining buff duration; 24 at the top right is the cooldown. They are separate timers.",
      "To place buffs and cooldowns in separate windows, use the default ring theme, which supports split mode.",
      [
        "12-second buff / 24-second cooldown"
      ]
    ],
    "debuff": [
      "Debuff markers",
      "Appears when a supported, enabled debuff is detected.",
      "The D badge identifies a debuff. The 12 below is its remaining duration. A green number badge elsewhere can represent effect stacks; not every badge is a charge count.",
      "Unsupported switches on a skill card are disabled. Available timers depend on which effects can be observed.",
      [
        "D badge and remaining duration"
      ]
    ],
    "alerts": [
      "Messages beside the icons",
      "Enable per-skill buff-start, buff-end or cooldown alerts to show a message at the configured moment.",
      "Apply indicates a buff starting; 3 sec in this example means three seconds until it ends; Ready means the cooldown has finished. These temporary messages are separate from pinned icons.",
      "Visual alerts and voice alerts have separate switches. For speech, check both the skill’s voice selection and the master voice switch and volume.",
      [
        "Buff starts",
        "Buff is about to end",
        "Skill is ready again"
      ]
    ],
    "target": [
      "Who the boss is targeting",
      "Enable the boss target display. A class icon and name appear when the target is identified during combat.",
      "Noel represents another party member; Aster represents you. Your own target color is configurable. Target-change effects and sounds can be enabled separately.",
      "With Only alert when I am the target, changes to another player are silent. This sound option does not hide the current target.",
      [
        "Another party member is targeted",
        "Your character is targeted"
      ]
    ],
    "direction": [
      "A hit from the wrong direction",
      "With Rear selected as your preferred direction, this appears when a confirmed direct hit is not from the rear.",
      "Not rear describes the observed hit. It is not a navigation arrow or an indicator of where the boss is currently looking.",
      "Check that direction alerts are enabled and review the preferred direction and placement. Summon, placed and damage-over-time hits are not treated like your direct hits.",
      [
        "Warning with Rear selected"
      ]
    ],
    "meter": [
      "Reading the combat view",
      "Player rows appear as damage to a boss or dummy is recorded.",
      "The header shows target, combat time and HP. Each row has class, name and CP on the left, with DPS and contribution on the right. Ranking information at the far right requires comparison data.",
      "Items and positions vary by theme and settings. Names, numbers and ranks here are illustrative sample data.",
      [
        "Combat view from the actual meter renderer"
      ]
    ],
    "detail": [
      "After selecting a player row",
      "Opens when Combat details is enabled and you select a player row.",
      "Switch players using the tabs above. The skill table compares damage, contribution and hit statistics. Selecting different metrics changes the visible columns.",
      "If clicks pass through, check lock settings and Allow combat details while locked. Starting the meter mid-fight does not recover earlier hits.",
      [
        "Skill damage and hit statistics"
      ]
    ],
    "records": [
      "Opening a saved fight",
      "Enable record saving, complete a recorded fight, then select the records button.",
      "Use the kill, attempt, dummy and archived tabs plus the boss filter. Select a player to open the details of that recorded fight.",
      "If empty, check saving and the recording trigger. Enabling saving now does not create records of past fights.",
      [
        "Record window with a sample fight"
      ]
    ],
    "resources": [
      "Resources in a separate window",
      "Appears when resource and split display are enabled and the resource has been detected.",
      "Numbers beside the key and energy icons belong to those resources. Read the bonus quantity in parentheses separately from the base amount. The field-boss button and energy icon open their status windows.",
      "Check each resource switch and character detection. A dash for information not yet received does not mean zero.",
      [
        "Shugo Festival keys and energy"
      ]
    ],
    "field": [
      "Field-boss spawn reminder",
      "Appears as a selected boss approaches one of your configured reminder times.",
      "Read the boss name, time remaining and importance stars. Three stars here are a user preference, not a boss difficulty or ranking.",
      "Check that the game world map has supplied the schedule and that alerts are enabled for this region and boss.",
      [
        "Five-minute reminder, three importance stars"
      ]
    ],
    "custom": [
      "A scheduled reminder",
      "Appears when an enabled custom alarm matches its weekday, time and advance reminder setting.",
      "Shows the title, target time and reminder timing. A memo appears under the title when provided.",
      "Check the enabled state and weekday. At zero volume the message still appears without sound.",
      [
        "Five minutes before a 21:00 alarm"
      ]
    ],
    "bus": [
      "Reaching the run target",
      "Appears when kills of the selected boss reach the configured run target.",
      "The completion message appears briefly, and the count resets to zero for the next cycle.",
      "Check the selected boss, target and current count. This does not count every monster kill.",
      [
        "Run target completion alert"
      ]
    ],
    "idle": [
      "Confirm character detection",
      "After entering the world, the idle view shows your name and server once your character is identified.",
      "This view focuses on your character, daily points and resources rather than combat rows. Visible items depend on your settings.",
      "If it still says Detecting character, check the network connection first. Some resource values can remain unavailable even after your name appears.",
      [
        "Idle view with a detected character"
      ]
    ],
    "hp": [
      "Place boss HP separately",
      "Enable separate boss HP display to show boss information in its own small window.",
      "Read the boss name, HP number, percentage and bar. Place it where you can check it without looking away from combat.",
      "Check boss HP and separate display settings. Use the position preview to find a window that may be off screen.",
      [
        "Separate boss HP window"
      ]
    ],
    "hits": [
      "Expand hit statistics after combat",
      "In Theme A, enable post-combat hit statistics to show selected metrics under each player. This image uses the same renderer’s statistics preview.",
      "Front, back, Double Chance, Perfect Chance, critical and parry can be selected individually. Some categories overlap, so do not add every percentage together expecting 100%.",
      "Choose the metrics you need, or limit statistics to your row. Theme B does not support these expanded statistics below player rows.",
      [
        "Six hit metrics beneath each player"
      ]
    ],
    "energy": [
      "Review energy and Kinah by character",
      "Open energy status to see characters whose resource information has been detected and saved.",
      "Read base and bonus energy separately from the Kinah columns. Values here are examples. Global uses observed resource values; do not treat them as the KR/TW recharge estimates. Global characters show Region - Server Name below their name, so Asia’s Siel and NA East’s Siel are easy to distinguish. Hover over a shortened label to read it in full. Korea and Taiwan keep their existing server labels.",
      "For a missing character, log in with that character and check detection and resource updates. Other characters’ values are not necessarily live.",
      [
        "Energy and Kinah by character"
      ]
    ],
    "points": [
      "Review daily points by character",
      "Select today’s points display to open Abyss and ranking point summaries.",
      "Compare observed gains, losses and totals per character. Distinguish changes detected today from your overall balance in the game.",
      "Character and server detection does not guarantee that point information has arrived. A dash is not zero.",
      [
        "Point changes detected today"
      ]
    ],
    "timers": [
      "See upcoming field bosses",
      "Open field-boss status using the field-boss button or an assigned hotkey.",
      "Compare each boss’s expected spawn time and countdown. Importance stars mark your preferences. Check the selected server and area first.",
      "Open the relevant game world map (M) to supply the schedule. Unobserved times are not filled in with guesses.",
      [
        "Bosses with detected spawn schedules"
      ]
    ],
    "party": [
      "Review an applicant’s skills",
      "On KR/TW, enable Party Lookup. This appears when information for an applicant or queried character is received.",
      "Selected skills and levels appear below the class mark, name, server and CP. Choose which skills to display in Party Lookup settings.",
      "This feature is unavailable on Global. For missing skills, check your skill selection and whether official character information was retrieved.",
      [
        "An applicant’s class, CP and selected skill levels"
      ]
    ],
    "forecast": [
      "Read the boss forecast",
      "Shown when you enable estimates during a boss fight.",
      "Kill is the time remaining to defeat the boss. Frenzy is the estimated timer remaining; Ahead or Over compares the two.",
      "Estimates continue to update during damage gaps. Infinity is used only when the boss is confirmed to have no Frenzy timer.",
      [
        "Normal: projected kill before Frenzy",
        "Damage gap: the kill estimate increases",
        "Boss confirmed to have no Frenzy timer",
        "Combat start unknown: waiting for a timer"
      ]
    ],
    "photo": [
      "Three photo layouts",
      "Actual idle-screen previews after character detection.",
      "Full background puts information over the photo. Left and right layouts separate the photo from the information.",
      "After changing the framing, check that the name, server and resource text stay readable.",
      [
        "Full background",
        "Photo left",
        "Photo right"
      ]
    ],
    "character": [
      "Character profiles and ranked combat details",
      "In Skills, select the character’s uploaded PVE/PVP build. If no submitted build exists, recorded ranking specializations are shown; skills missing from the latest fight may use earlier records. Check the selected source and record dates.",
      "Use a record’s Combat details button to view player damage, skills and buffs from that specific fight. Selecting another record opens that fight’s details.",
      "Expand Automatic Stigma traits to inspect them. Active traits use color and a check mark; locked and unknown are separate states. Unknown means the available skill information is insufficient, not that the trait is inactive.",
      [
        "Check This week and All time separately. A character without a record this week may still have all-time records.",
        "In Skills, select the character’s uploaded PVE/PVP build. If no submitted build exists, recorded ranking specializations are shown; skills missing from the latest fight may use earlier records. Check the selected source and record dates."
      ]
    ]
  }
};
