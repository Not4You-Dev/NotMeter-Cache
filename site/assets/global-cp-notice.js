(() => {
  const key = "notmeter-global-25k-notice-279";
  const copy = (globalThis.NotMeterI18n?.withVietnamese || (copy => copy))({
    "ko": {
      "lossTitle": "혜택은 현재 CP 구간의 이번 주 순위에만 적용됩니다",
      "loss": "같은 캐릭터·직업이라도 다른 CP 구간의 순위는 현재 구간의 혜택으로 가져올 수 없습니다. 현재 CP 구간에서 지원 보스 중 하나라도 이번 주 TOP5이면 랭커 애니메이션과 닉네임 효과를 사용할 수 있습니다. 현재 구간의 TOP5 자격이 없으면 이 혜택은 해제되고, 주간 6~20위는 정적 테두리만, 21위 이하·순위 없음은 랭킹 테두리 없음입니다. 쿠폰 등 별도 혜택은 유지됩니다.",
      "faqTitle": "효과가 달라졌다면 먼저 확인하세요",
      "faq": [
        [
          "170K → 180K가 되면 어떻게 되나요?",
          "170K는 150K 이상~175K 미만 구간입니다. 여기서 이번 주 3위여도 180K가 되면 175K 이상~200K 미만 구간으로 이동하므로 이전 3위의 닉네임 효과와 랭커 애니메이션을 이어 쓰지 못합니다. 새 구간의 이번 주 순위가 1~5위면 효과 사용, 6~20위면 정적 테두리만, 순위가 없거나 21위 이하면 랭킹 혜택 없음입니다. 정확히 175K부터 새 구간이며 CP가 내려가 다른 구간에 들어가도 같습니다. 이전 기록은 원래 구간에 남고 새 구간으로 옮겨지지 않습니다. 쿠폰 혜택은 별개입니다."
        ],
        [
          "CP를 다시 낮추면 이전 구간 효과가 돌아오나요?",
          "돌아간 현재 구간에 이번 주 TOP5 자격이 아직 유효하고 새 CP가 확인되면 다시 사용할 수 있습니다. 지난주 순위이거나 이미 TOP5에서 밀려났다면 돌아오지 않습니다. 서버에는 미터기가 보낸 최신 CP가 반영되며, 장비 변경 직후의 즉시 표시 전환은 대응 미터기 업데이트가 필요합니다."
        ],
        [
          "5위에서 6위로 내려가면 어떻게 되나요?",
          "새 순위가 게시되고 자격 확인에 반영되면 TOP5 전용 애니메이션과 닉네임 효과가 해제됩니다. 6~20위는 정적 테두리만 표시합니다. 다른 유효한 TOP5나 쿠폰 권한이 있다면 그 혜택은 별개입니다. 한 번 받은 효과가 영구 혜택이 되는 것은 아닙니다."
        ],
        [
          "전체 기간 1위인데 왜 효과가 없나요?",
          "효과는 이번 주 원래 보스·직업·25K 구간의 순위로 정합니다. 전체 기간 1위나 전체 CP·전체 보스 화면의 1위만으로는 TOP5 효과가 생기지 않습니다. 다른 캐릭터·직업의 자격도 함께 적용되지 않습니다."
        ],
        [
          "전투 종료 후 ‘구간 N위’와 ‘상위 %’는 무엇인가요?",
          "방금 전투의 DPS를 같은 보스·직업·전투 당시 25K CP 구간의 최신 공개 ‘전체 기간’ 자료와 비교합니다. 해당 전투와 일치하는 개인 최고 기록이 공개 TOP20에 있으면 ‘구간 N위’를, 그렇지 않으면 비교 가능한 상위 %를 표시합니다. 상위 10%는 상위 80%보다 높은 기록이며 파티 피해량 점유율이 아닙니다. 전투 직후 표시만으로 등록 완료나 이번 주 TOP5 혜택이 확정되지는 않습니다. 홈페이지의 이번 주 순위와 효과 자격은 다음 정상 집계·게시·자격 확인 후 결정됩니다."
        ],
        [
          "왜 본인과 파티원의 전투 후 표시가 다른가요?",
          "본인은 비교 자료가 있으면 TOP20 밖의 상위 50%·80%도 볼 수 있습니다. 279 버전부터 파티원은 공개 TOP20 순위가 있거나 상위 10% 이내일 때 표시합니다. 즉 TOP20 순위는 별도 표시 대상이고, 순위 없는 파티원의 상위 %는 10%까지만 표시합니다. 표시가 없는 것을 전송 실패나 피해량 0으로 해석하지 마세요. ‘전투 종료 후 순위 표시’ 설정도 켜야 합니다."
        ],
        [
          "순위·상위 %가 비어 있거나 홈페이지와 다르면요?",
          "같은 조건의 통계가 없거나 아직 게시되지 않았거나 자료를 불러오지 못하면 비교 표시가 없을 수 있습니다. 지원 CP는 150K 이상 1000K 미만입니다. 전투 후 표시는 그 전투의 DPS·당시 CP·전체 기간 기준이고, 홈페이지는 선택한 보스·CP·기간 및 개인 최고 기록 기준이므로 값이 다를 수 있습니다. 전체 보스·전체 CP 화면의 순번도 효과 자격과 다릅니다. 비교 기준과 갱신 시각을 먼저 맞춰 보세요."
        ],
        [
          "홈페이지는 TOP5인데 왜 바로 안 보이나요?",
          "전투 전송 → 랭킹 게시 → 미터기의 자격 확인 순서로 반영됩니다. 게시 시각과 이번 주 순위를 확인하고, 닉네임 효과를 선택·저장한 뒤 ‘랭커 표시’를 켜세요. 상대방도 다른 캐릭터의 효과 표시를 켜야 합니다. 279 버전부터 지원합니다. 이전 버전 사용자는 업데이트해 주세요."
        ],
        [
          "주간 초기화가 되면 기록과 선택한 효과도 지워지나요?",
          "지난주 순위로 얻은 주간 자격은 종료됩니다. 이번 주 기록으로 다시 자격을 얻어야 합니다. 전체 기간 기록과 저장해 둔 효과 선택, 쿠폰 만료일은 지워지지 않지만, 별도 사용 자격이 없는 효과는 표시되지 않습니다."
        ],
        [
          "쿠폰이 있는데 순위에서 밀리면 애니메이션도 꺼지나요?",
          "닉네임 쿠폰의 남은 기간이 2개월 이상이면 순위와 별개로 애니메이션 혜택을 유지합니다. 처음 발급된 개월 수가 아니라 현재 남은 기간이 기준입니다. 2개월 미만이 되면 쿠폰 애니메이션 조건은 끝나지만 쿠폰 자체가 바로 만료되는 것은 아닙니다. 유효한 주간 TOP5라면 랭킹 애니메이션은 유지됩니다."
        ]
      ],
      "title": "글로벌 랭킹 이용 안내",
      "intro": "279 버전부터 지원합니다. 이전 버전 사용자는 업데이트해 주세요. 같은 보스·직업·전투력 조건에서 내 기록을 비교하는 랭킹입니다. 던전과 1분 훈련용 허수아비 모두 같은 25K 구간 규칙을 사용합니다.",
      "items": [
        [
          "내 전투력에 맞는 구간을 선택하세요",
          "전투 당시 CP가 150K 이상 1000K 미만인 기록을 25K씩 나눕니다. K는 1,000입니다. 예를 들어 162K는 150K 이상~175K 미만 구간입니다. 마지막 구간은 975K 이상~1000K 미만입니다."
        ],
        [
          "170K → 180K가 되면 어떻게 되나요?",
          "170K는 150K 이상~175K 미만 구간입니다. 여기서 이번 주 3위여도 180K가 되면 175K 이상~200K 미만 구간으로 이동하므로 이전 3위의 닉네임 효과와 랭커 애니메이션을 이어 쓰지 못합니다. 새 구간의 이번 주 순위가 1~5위면 효과 사용, 6~20위면 정적 테두리만, 순위가 없거나 21위 이하면 랭킹 혜택 없음입니다. 정확히 175K부터 새 구간이며 CP가 내려가 다른 구간에 들어가도 같습니다. 이전 기록은 원래 구간에 남고 새 구간으로 옮겨지지 않습니다. 쿠폰 혜택은 별개입니다."
        ],
        [
          "같은 캐릭터는 최고 기록 하나로 비교합니다",
          "같은 보스·직업·CP 구간·기간에서는 캐릭터별 최고 DPS 하나만 사용합니다. 더 높은 DPS를 기록하면 바뀌고, 낮은 기록을 여러 번 보내도 순위를 여러 칸 차지하거나 참가자 수가 늘어나지 않습니다."
        ],
        [
          "TOP20과 상위 10%·25%는 다릅니다",
          "TOP20에는 최대 20명의 순위와 보관된 전투 상세를 보여 줍니다. TOP20 밖의 캐릭터도 최고 DPS는 통계에 포함됩니다. 상위 10%·25%는 같은 조건으로 비교한 캐릭터들의 기준 DPS이며, 전투 횟수가 아닌 캐릭터별 최고 기록으로 계산합니다."
        ],
        [
          "전투 종료 후 ‘구간 N위’와 ‘상위 %’는 무엇인가요?",
          "방금 전투의 DPS를 같은 보스·직업·전투 당시 25K CP 구간의 최신 공개 ‘전체 기간’ 자료와 비교합니다. 해당 전투와 일치하는 개인 최고 기록이 공개 TOP20에 있으면 ‘구간 N위’를, 그렇지 않으면 비교 가능한 상위 %를 표시합니다. 상위 10%는 상위 80%보다 높은 기록이며 파티 피해량 점유율이 아닙니다. 전투 직후 표시만으로 등록 완료나 이번 주 TOP5 혜택이 확정되지는 않습니다. 홈페이지의 이번 주 순위와 효과 자격은 다음 정상 집계·게시·자격 확인 후 결정됩니다."
        ],
        [
          "전체 보기와 이번 주를 구분하세요",
          "처음에는 전체 CP·전체 보스로 보입니다. 전체 보기에서도 캐릭터별 가장 높은 DPS 하나를 비교하며 보스별 DPS를 더하지 않습니다. 전체 기간 기록은 유지되고 이번 주는 매주 새로 시작합니다. 글로벌 기준은 미국 태평양 시간 화요일 23:30이며, 화면에는 내 PC 시간대와 GMT 차이로 표시됩니다. 서머타임에 따라 한국 시간은 수요일 15:30 또는 16:30입니다."
        ],
        [
          "전송한 기록은 다음 랭킹 갱신에 반영됩니다",
          "전송 성공이 곧 순위 반영은 아닙니다. 한국·대만과 같은 갱신 작업에서 함께 집계합니다. 현재는 게시가 끝난 뒤 30분 후 다음 집계를 시작하고, 집계·게시 시간은 별도로 걸립니다. 기록이 몰리거나 게시가 지연되면 더 늦어질 수 있습니다. 화면의 ‘갱신’ 시각으로 확인하세요. 새로고침만으로 새 집계가 시작되지는 않습니다."
        ],
        [
          "이번 주 TOP5는 움직이는 효과, 6~20위는 정적 테두리",
          "지원 보스·직업·25K CP 구간의 게시된 이번 주 1~5위는 움직이는 랭커 이펙트와 모든 닉네임 효과를 사용할 수 있습니다. 6~20위는 애니메이션 없는 기존 테두리만 표시하고, 21위부터는 랭킹 테두리가 없습니다. 1분 허수아비도 같습니다. 전체 기간 순위만으로는 이 주간 혜택이 생기지 않으며, 전체 CP·전체 보스 화면의 순번이 아니라 원래 구간의 주간 순위를 봅니다. 단, 닉네임 쿠폰의 남은 기간이 2개월 이상이면 순위와 관계없이 랭커 애니메이션 혜택을 유지합니다."
        ],
        [
          "글로벌 랭킹은 NotMeter 1.0.279부터 지원",
          "글로벌 던전·1분 허수아비의 25K CP 구간 순위, 전투 종료 후 순위·상위 % 표시, 현재 CP 구간에 따른 랭커·닉네임 효과는 NotMeter 1.0.279부터 지원합니다. 이전 버전은 최신 버전으로 업데이트한 뒤 이용해 주세요."
        ]
      ],
      "history": "이전 방식에서 남아 있던 유효 기록과 변경 후 받은 기록을 사용합니다. 과거에 보관하지 않은 기록은 되살릴 수 없습니다. 게임 업데이트에 따라 지원 던전과 최소 CP가 바뀔 수 있습니다. 한국·대만 랭킹 규칙은 그대로입니다.",
      "effectTitle": "랭커 테두리 · 닉네임 효과",
      "effectUse": "혜택은 현재 CP 구간의 이번 주 순위에만 적용됩니다. 홈페이지에 기록이 반영되고 미터기가 새 자격을 확인한 뒤, 환경설정 → 닉네임 효과에서 사용할 효과를 선택해 저장하세요. 전투 직후 예상 순위만으로는 열리지 않습니다. TOP5에서 벗어나거나 주간 초기화가 되면 TOP5 전용 자격은 종료되지만 별도의 쿠폰 혜택은 유지됩니다. 선택한 효과와 쿠폰 기간은 바뀌지 않습니다. 랭커 테두리를 보려면 ‘랭커 표시’도 켜야 합니다.",
      "guideTitle": "글로벌 랭커 효과 이용 안내",
      "guideIntro": "279 버전부터 지원합니다. 이전 버전 사용자는 업데이트해 주세요. 혜택은 현재 CP 구간의 이번 주 순위에만 적용됩니다. 던전·1분 허수아비 모두 이번 주 구간별 TOP5는 움직이는 효과, 6~20위는 정적 테두리입니다. 쿠폰 혜택은 별도로 유지됩니다.",
      "timingTitle": "언제 순위와 효과가 반영되나요?",
      "shareTitle": "효과 선택과 다른 사용자에게 표시",
      "share": "사용 가능한 효과를 저장한 뒤 다른 사용자에게 보이기까지는 추가 갱신 시간이 걸립니다. 상대방도 다른 캐릭터의 닉네임 효과 표시를 켜야 합니다. 이 시간은 랭킹 집계·자격 확인 대기와 별개입니다. 쿠폰·칭찬 랭킹 등 별도로 얻은 유효한 권한은 유지됩니다.",
      "dummyTitle": "1분 훈련용 허수아비도 같은 규칙",
      "dummy": "정상적으로 완료한 60초 기록을 같은 직업·25K 구간에서 비교합니다. 150K 이상 1000K 미만이며 TOP20과 상위 비율을 보여 줍니다. 이번 주 1~5위는 랭커 애니메이션·닉네임 효과, 6~20위는 정적 테두리입니다. 남은 기간 2개월 이상 쿠폰의 랭커 애니메이션은 순위와 별개입니다.",
      "animatedTitle": "이번 주 1~5위 · 애니메이션",
      "animatedBody": "금색 테두리를 따라 빛이 움직입니다. 남은 기간 2개월 이상 쿠폰도 순위와 무관하게 이 애니메이션 혜택을 유지합니다.",
      "staticTitle": "이번 주 6~20위 · 정적 테두리",
      "staticBody": "6~10위는 하늘색, 11~20위는 보라색 테두리이며 움직이지 않습니다. 별도 쿠폰 자격이 있으면 애니메이션이 우선합니다.",
      "dungeons": "글로벌 지원 콘텐츠",
      "dismiss": "더 이상 보지 않기",
      "reopen": "글로벌 랭킹 이용 안내 다시 보기",
      "saved": "이 브라우저에만 저장됩니다. 숨긴 안내는 다시 열 수 있습니다.",
      "failed": "이 브라우저에서 숨김 설정을 저장할 수 없어, 새로 방문하면 안내가 다시 표시될 수 있습니다."
    },
    "en": {
      "lossTitle": "Benefits apply only to your current CP bracket’s weekly rank",
      "loss": "A rank from another CP bracket does not carry into your current bracket, even for the same character and class. Weekly TOP5 for any supported boss in your current bracket grants ranker animation and nickname effects. Without that current-bracket TOP5 eligibility, those benefits end: weekly places 6–20 keep a static border; place 21 or no rank has no ranking border. Separate coupon benefits remain.",
      "faqTitle": "Questions about changing effects",
      "faq": [
        [
          "What happens when I go from 170K to 180K?",
          "170K belongs to 150K–below 175K. Even if you are weekly 3rd there, 180K moves you to 175K–below 200K: the old 3rd-place nickname effects and animation do not carry over. In the new bracket, weekly places 1–5 grant effects, 6–20 grant only a static border, and place 21 or no rank grants neither. Exactly 175K starts the new bracket; moving down works the same way. Old records stay in their original bracket and are not moved into the new one. Coupon benefits are separate."
        ],
        [
          "Will lowering CP restore the old bracket’s effects?",
          "Yes, after your new CP is recognized, if weekly TOP5 eligibility in the bracket you returned to is still valid. Last week’s rank or a place that has fallen outside TOP5 will not restore it. The server uses the latest CP sent by the meter. Immediate display changes after changing equipment require the compatible meter update."
        ],
        [
          "What happens if I drop from 5th to 6th?",
          "After publication and the next eligibility check, TOP5-only animation and nickname effects end. Places 6–20 have a static border. Other valid TOP5 or coupon benefits are independent. Earning an effect once does not make it permanent."
        ],
        [
          "Why is there no effect for my all-time 1st place?",
          "Eligibility uses the weekly rank for the original boss, class and 25K bracket. An all-time 1st place or 1st in All CP / All bosses does not grant TOP5 effects by itself. Entitlements from other characters or classes do not transfer."
        ],
        [
          "What do the post-combat rank and top % mean?",
          "Your DPS from that fight is compared with the latest published all-time data for the same boss, class and combat-time 25K CP bracket. A personal-best record matching that fight shows its bracket rank if it is in the published TOP20; otherwise a comparable top % is shown. Top 10% is better than top 80%; it is not your share of party damage. This immediate display does not confirm registration or unlock weekly TOP5 benefits. Website weekly ranks and eligibility follow successful calculation, publication and eligibility checks."
        ],
        [
          "Why do my own and party members’ displays differ?",
          "With comparison data available, you can see your own top 50% or 80% even outside TOP20. From version 279, a party member is shown if they have a published TOP20 rank OR are in the top 10%. TOP20 ranks are a separate display case; unranked party percentiles are shown only through 10%. A missing badge does not mean an upload failed or damage was zero. Enable post-combat ranking display too."
        ],
        [
          "Why is the comparison missing or different from the website?",
          "There may be no matching statistics yet, publication may be pending, or data may be unavailable. Supported CP is 150K to below 1000K. Post-combat comparison uses that fight’s DPS, CP and all-time data; the website uses your chosen boss, CP, period and personal best. All bosses / All CP positions also do not grant effect eligibility. Check the comparison conditions and update time."
        ],
        [
          "The website shows TOP5. Why is the effect missing?",
          "Upload, ranking publication and the meter’s eligibility check happen in sequence. Check the publication time and weekly rank, save a nickname effect, and enable ranker indicators. Other users must allow other characters’ effects too. Supported from version 279. Please update if you are using an older version."
        ],
        [
          "Does a weekly reset erase records and my selected effect?",
          "Last week’s ranking entitlement expires; qualify again with this week’s records. All-time records, your saved effect selection and coupon expiry remain. An effect without another valid entitlement will not be shown."
        ],
        [
          "Does dropping in rank remove my coupon animation?",
          "A nickname coupon with at least 2 months remaining keeps animation independently of rank. Remaining time matters, not the original coupon duration. Falling below 2 months ends that animation benefit, not the coupon itself. Valid weekly TOP5 eligibility can still provide ranking animation."
        ]
      ],
      "title": "How Global rankings work",
      "intro": "Supported from version 279. Please update if you are using an older version. Compare your best DPS with the same boss, class and CP conditions. Supported dungeons and the 1-minute training dummy use the same 25K CP brackets.",
      "items": [
        [
          "Choose the bracket for your combat CP",
          "Records qualify from 150K CP up to, but not including, 1000K, in steps of 25K. K means 1,000. For example, 162K belongs to 150K–below 175K. The last bracket is 975K–below 1000K."
        ],
        [
          "What happens when I go from 170K to 180K?",
          "170K belongs to 150K–below 175K. Even if you are weekly 3rd there, 180K moves you to 175K–below 200K: the old 3rd-place nickname effects and animation do not carry over. In the new bracket, weekly places 1–5 grant effects, 6–20 grant only a static border, and place 21 or no rank grants neither. Exactly 175K starts the new bracket; moving down works the same way. Old records stay in their original bracket and are not moved into the new one. Coupon benefits are separate."
        ],
        [
          "One personal best per comparison",
          "Only your best DPS counts for each boss, class, CP bracket and period. A higher score replaces it. Repeating lower scores does not give you extra places or increase the participant count."
        ],
        [
          "TOP20 and top 10% / 25% are different",
          "TOP20 lists up to 20 characters and their available battle details. Characters outside TOP20 still contribute their best DPS to the statistics. The top 10% and 25% values are DPS thresholds for characters under the same conditions, not percentages of all fights uploaded."
        ],
        [
          "What do the post-combat rank and top % mean?",
          "Your DPS from that fight is compared with the latest published all-time data for the same boss, class and combat-time 25K CP bracket. A personal-best record matching that fight shows its bracket rank if it is in the published TOP20; otherwise a comparable top % is shown. Top 10% is better than top 80%; it is not your share of party damage. This immediate display does not confirm registration or unlock weekly TOP5 benefits. Website weekly ranks and eligibility follow successful calculation, publication and eligibility checks."
        ],
        [
          "All views and weekly rankings",
          "The default is All CP and All bosses. Combined views still use one highest DPS per character, not the sum of DPS across bosses. All-time records stay; the weekly ranking starts fresh each week at Tuesday 23:30 America/Los_Angeles time. The page converts this to your PC time zone and GMT offset, including daylight saving time."
        ],
        [
          "Records appear after a ranking refresh",
          "A successful upload does not update your rank instantly. Global is calculated alongside KR/TW. Currently, the next calculation starts 30 minutes after the previous publication finishes; calculation and publication take additional time. Heavy traffic or publication delays can extend the wait. Check the page’s updated time. Reloading the page does not start a new calculation."
        ],
        [
          "Weekly TOP5: animated effects; places 6–20: static border",
          "Published weekly places 1–5 for each supported boss, class and 25K CP bracket unlock the animated ranker effect and all nickname effects. Places 6–20 show the existing non-animated border only; place 21 and below have no ranking border. The 1-minute dummy follows the same rules. All-time ranks alone do not grant these weekly benefits. Use the original bracket’s weekly rank, not the position in All CP or All bosses. Separately, a nickname coupon with at least 2 months remaining keeps the animated ranker benefit regardless of rank."
        ],
        [
          "Global rankings require NotMeter 1.0.279 or later",
          "Global dungeon and 1-minute dummy rankings in 25K CP brackets, post-combat ranks and top %, and ranker/nickname effects for your current CP bracket are supported from NotMeter 1.0.279. Update to the latest version if you are using an older release."
        ]
      ],
      "history": "Rankings use valid records retained by the previous system and records received since the change. Previously discarded records cannot be recovered. Game updates may change supported dungeons and the minimum CP. KR/TW ranking rules are unchanged.",
      "effectTitle": "Rank borders and nickname effects",
      "effectUse": "Benefits apply only to your current CP bracket’s weekly rank. After publication and confirmation of your eligibility in NotMeter, choose and save an available effect in Settings → Nickname effects. An estimate immediately after combat does not unlock it. Leaving TOP5 or a weekly reset ends the TOP5 entitlement, but separate coupon benefits remain. Your saved selection and coupon expiry do not change. Enable ranker indicators to see rank borders.",
      "guideTitle": "Global ranker effects explained",
      "guideIntro": "Supported from version 279. Please update if you are using an older version. Benefits apply only to your current CP bracket’s weekly rank. Dungeons and the 1-minute dummy: weekly bracket TOP5 gets animated effects; places 6–20 get a static border. Coupon benefits are separate.",
      "timingTitle": "When do ranks and effects update?",
      "shareTitle": "Choosing an effect and showing it to others",
      "share": "After you save an available effect, other users need time to receive the update. They must also enable other characters’ nickname effects. This is separate from the wait for ranking publication and eligibility checks. Valid coupon and praise-ranking benefits remain independent.",
      "dummyTitle": "The 1-minute dummy follows the same rules",
      "dummy": "Valid completed 60-second records are compared by class and 25K bracket, from 150K to below 1000K CP, with TOP20 and percentiles. Weekly places 1–5 get animated ranker and nickname effects; 6–20 get a static border. Coupons with at least 2 months remaining grant ranker animation independently of rank.",
      "animatedTitle": "Weekly 1–5 · Animated border",
      "animatedBody": "Light moves around the gold frame. A coupon with at least 2 months remaining also grants this animation regardless of rank.",
      "staticTitle": "Weekly 6–20 · Static border",
      "staticBody": "Places 6–10 use a light-blue border; 11–20 use purple, with no animation. Separate coupon eligibility takes priority and keeps animation.",
      "dungeons": "Supported Global content",
      "dismiss": "Don’t show again",
      "reopen": "Read the Global ranking guide",
      "saved": "Saved in this browser only. You can reopen the guide after hiding it.",
      "failed": "This browser could not save your preference. The guide may appear again on your next visit."
    },
    "zh-TW": {
      "lossTitle": "福利只依目前 CP 區間的本週排名判定",
      "loss": "即使是同一角色與職業，其他 CP 區間的名次也不能帶到目前區間。只要目前區間任一支援首領達本週 TOP5，即可使用排名動畫與暱稱特效。沒有目前區間的 TOP5 資格時，這些福利便解除：本週第 6～20 名只有靜態外框，第 21 名起或無排名則沒有排名外框。獨立兌換券福利仍保留。",
      "faqTitle": "特效變更時的常見問題",
      "faq": [
        [
          "從 170K 升到 180K 會怎樣？",
          "170K 屬於 150K 以上、未滿 175K。即使在此區間為本週第 3 名，升到 180K 後也會改屬 175K 以上、未滿 200K，不能沿用舊第 3 名的暱稱特效與動畫。新區間本週第 1～5 名可用特效，第 6～20 名只有靜態外框，第 21 名起或無排名沒有排名福利。剛好 175K 即進入新區間，降低 CP 跨區間亦同。舊紀錄留在原區間，不會搬到新區間。兌換券福利獨立判定。"
        ],
        [
          "降低 CP 回舊區間，特效會恢復嗎？",
          "若回到的目前區間仍有有效本週 TOP5 資格，確認新 CP 後即可再次使用。上週名次或已跌出 TOP5 不會恢復。伺服器使用 NotMeter 最近傳送的 CP；換裝後立即切換顯示須有對應的 NotMeter 更新。"
        ],
        [
          "從第 5 名降到第 6 名會怎樣？",
          "新排名發布並完成資格確認後，TOP5 專屬動畫與暱稱特效會解除。第 6～20 名只顯示靜態外框，其他有效 TOP5 或兌換券福利不受影響。曾取得特效不代表永久擁有。"
        ],
        [
          "全部期間第 1 名，為何沒有特效？",
          "資格依原首領、職業、25K 區間的本週排名判定。僅有全部期間第 1 名，或全部 CP／全部首領畫面的第 1 名，不會取得 TOP5 特效。其他角色或職業的資格也不會轉移。"
        ],
        [
          "戰鬥結束後的「區間名次」與「前 %」是甚麼？",
          "以剛才戰鬥的 DPS，對照相同首領、職業、戰鬥當時 25K CP 區間最新公布的全部期間資料。若與該戰鬥相符的個人最佳紀錄在已公布 TOP20，便顯示區間名次；否則顯示可比較的前百分比。前 10% 比前 80% 高，不是隊伍傷害占比。即時顯示不代表已完成登錄，也不會立即解鎖本週 TOP5 福利；網站本週排名與資格須等正常統計、發布及資格確認。"
        ],
        [
          "為何自己與隊友的顯示不同？",
          "有可比較資料時，自己即使在 TOP20 外也可看前 50% 或 80%。NotMeter 自 279 版本起會顯示已公布 TOP20 名次，或前 10% 以內的隊友。TOP20 名次是獨立顯示條件，沒有名次的隊友百分比只顯示到 10%。沒有標示不代表傳送失敗或傷害為 0，也需開啟戰鬥結束後排名顯示。"
        ],
        [
          "為何沒有比較值，或與網站不同？",
          "可能尚無同條件統計、還未發布，或資料讀取失敗。支援 150K 以上、未滿 1000K。戰鬥後依該次 DPS、當時 CP 與全部期間比較；網站依所選首領、CP、期間及個人最佳紀錄。全部首領／全部 CP 的順序也不是特效資格。請先核對比較條件與更新時間。"
        ],
        [
          "網站已有 TOP5，為何還沒顯示？",
          "須依序完成傳送、排名發布與 NotMeter 資格確認。請確認發布時間和本週名次，選擇並儲存暱稱特效，開啟排名顯示。對方也須允許其他角色的特效。 279 版本起支援。使用舊版本的玩家請先更新。"
        ],
        [
          "每週重置會刪除紀錄和已選特效嗎？",
          "上週排名資格會到期，須以本週紀錄重新取得。全部期間紀錄、已儲存特效選擇與兌換券到期日不變；沒有其他有效資格的特效不會顯示。"
        ],
        [
          "有兌換券，掉名次也會失去動畫嗎？",
          "暱稱兌換券剩餘期限達 2 個月時，動畫福利不受名次影響。判定依目前剩餘期限，而非原始月份。低於 2 個月只結束該動畫福利，不代表兌換券立刻到期；有效本週 TOP5 仍可提供排名動畫。"
        ]
      ],
      "title": "全球排名使用說明",
      "intro": "279 版本起支援。使用舊版本的玩家請先更新。 以相同首領、職業與戰力條件比較自己的最高 DPS。支援的副本與 1 分鐘訓練稻草人均採用 25K CP 區間。",
      "items": [
        [
          "選擇戰鬥當時的 CP 區間",
          "支援 150K 以上、未滿 1000K，每 25K 一段。K 代表 1,000。例如 162K 屬於 150K 以上、未滿 175K；最後一段為 975K 以上、未滿 1000K。"
        ],
        [
          "從 170K 升到 180K 會怎樣？",
          "170K 屬於 150K 以上、未滿 175K。即使在此區間為本週第 3 名，升到 180K 後也會改屬 175K 以上、未滿 200K，不能沿用舊第 3 名的暱稱特效與動畫。新區間本週第 1～5 名可用特效，第 6～20 名只有靜態外框，第 21 名起或無排名沒有排名福利。剛好 175K 即進入新區間，降低 CP 跨區間亦同。舊紀錄留在原區間，不會搬到新區間。兌換券福利獨立判定。"
        ],
        [
          "每位角色只採用最佳成績",
          "相同首領、職業、CP 區間與期間，只計算每位角色的最高 DPS。更高的成績會替換原紀錄；重複上傳較低成績不會多佔名次，也不會增加參加人數。"
        ],
        [
          "TOP20 與前 10%／25% 不同",
          "TOP20 顯示最多 20 名角色及可用的戰鬥詳細資料。未進入 TOP20 的角色仍以最高 DPS 參與統計。前 10%／25% 是相同條件下角色的 DPS 門檻，不是所有上傳戰鬥的百分比。"
        ],
        [
          "戰鬥結束後的「區間名次」與「前 %」是甚麼？",
          "以剛才戰鬥的 DPS，對照相同首領、職業、戰鬥當時 25K CP 區間最新公布的全部期間資料。若與該戰鬥相符的個人最佳紀錄在已公布 TOP20，便顯示區間名次；否則顯示可比較的前百分比。前 10% 比前 80% 高，不是隊伍傷害占比。即時顯示不代表已完成登錄，也不會立即解鎖本週 TOP5 福利；網站本週排名與資格須等正常統計、發布及資格確認。"
        ],
        [
          "全部檢視與本週排名",
          "預設為全部 CP、全部首領；合併檢視仍只採用每位角色最高的一筆 DPS，不會將不同首領的 DPS 相加。全部期間紀錄保留，本週排名於美國太平洋時間每週二 23:30 重新開始。頁面依您的電腦時區顯示當地時間與 GMT 時差，並處理夏令時間。"
        ],
        [
          "上傳後等待排名更新",
          "傳送成功不代表名次立即更新。全球與韓國／台灣一起統計；目前每次發布完成後等待 30 分鐘再開始下一次統計，統計與發布另需時間。紀錄量大或發布延遲時可能更久。請查看頁面的更新時間；重新整理頁面不會啟動新統計。"
        ],
        [
          "本週 TOP5 有動態特效，第 6～20 名為靜態外框",
          "各支援首領、職業、25K CP 區間已公布的本週第 1～5 名，可使用動態排名特效與所有暱稱特效。第 6～20 名只顯示既有的無動畫外框，第 21 名起沒有排名外框。1 分鐘稻草人亦同。僅有全部期間名次不會取得這些本週福利；判定依原區間本週名次，而非全部 CP／全部首領畫面的順序。另外，暱稱兌換券剩餘期限達 2 個月時，不論排名都保有動態排名特效。"
        ],
        [
          "全球排名支援 NotMeter 1.0.279 以上版本",
          "全球副本與 1 分鐘訓練稻草人的 25K CP 區間排名、戰鬥後名次與百分比，以及依目前 CP 區間顯示的排名與暱稱特效，均自 NotMeter 1.0.279 起支援。使用舊版本時，請先更新至最新版本。"
        ]
      ],
      "history": "排名使用舊系統留下的有效紀錄與變更後收到的紀錄，無法還原過去未保留的內容。遊戲更新可能調整支援副本與最低 CP。韓國／台灣排名規則不變。",
      "effectTitle": "排名外框與暱稱特效",
      "effectUse": "福利只依目前 CP 區間的本週排名判定. 紀錄發布且 NotMeter 確認資格後，至設定 → 暱稱特效選擇可用特效並儲存。戰鬥後預估名次不會直接解鎖。跌出 TOP5 或每週重置會結束 TOP5 專屬資格，但獨立的兌換券福利不變。已選特效與兌換券到期日不會改變。須開啟排名顯示才會看到外框。",
      "guideTitle": "全球排名特效使用說明",
      "guideIntro": "279 版本起支援。使用舊版本的玩家請先更新。 福利只依目前 CP 區間的本週排名判定. 副本與 1 分鐘稻草人：區間本週 TOP5 為動態特效，第 6～20 名為靜態外框；兌換券福利獨立保留。",
      "timingTitle": "排名與特效何時更新？",
      "shareTitle": "選擇特效與讓其他人看見",
      "share": "儲存可用特效後，其他使用者還需要時間接收更新，且須開啟其他角色暱稱特效顯示。這與等待排名發布及資格確認的時間不同。有效的兌換券與稱讚排名福利仍獨立保留。",
      "dummyTitle": "1 分鐘稻草人適用相同規則",
      "dummy": "有效完成的 60 秒紀錄依職業與 25K 區間比較，支援 150K 以上、未滿 1000K CP，顯示 TOP20 與前百分比。本週第 1～5 名有動態排名與暱稱特效，第 6～20 名為靜態外框。剩餘期限達 2 個月的兌換券動畫福利不受名次限制。",
      "animatedTitle": "本週第 1～5 名 · 動態外框",
      "animatedBody": "金色外框有光點流動。兌換券剩餘期限達 2 個月時，也可不受名次限制保有此動畫。",
      "staticTitle": "本週第 6～20 名 · 靜態外框",
      "staticBody": "第 6～10 名為淺藍色、第 11～20 名為紫色，外框不會移動。有獨立兌換券資格時，優先保留動畫。",
      "dungeons": "全球伺服器支援內容",
      "dismiss": "不再顯示",
      "reopen": "再次查看全球排名說明",
      "saved": "僅儲存在此瀏覽器，隱藏後仍可再次開啟說明。",
      "failed": "此瀏覽器無法儲存偏好設定，下次造訪時可能再次顯示。"
    },
    "ja-JP": {
      "lossTitle": "特典は現在のCP帯の今週順位にだけ適用されます",
      "loss": "同じキャラクター・クラスでも、別のCP帯の順位を現在の帯の特典に引き継ぐことはできません。現在のCP帯で対象ボスのいずれかが今週TOP5なら、ランカーアニメーションとニックネーム効果を利用できます。その資格がなければ解除され、今週6～20位は静止枠のみ、21位以下・順位なしはランキング枠なしです。クーポンなど別の特典は維持します。",
      "faqTitle": "効果が変わったときの確認",
      "faq": [
        [
          "170Kから180Kになるとどうなりますか？",
          "170Kは150K以上175K未満です。そこで今週3位でも、180Kになると175K以上200K未満へ移るため、旧3位のニックネーム効果やアニメーションは引き継げません。新しい帯の今週1～5位なら効果、6～20位なら静止枠のみ、21位以下・順位なしならランキング特典なしです。175Kちょうどから新しい帯です。CPが下がって帯を移る場合も同じです。旧記録は元の帯に残り、新しい帯には移りません。クーポン特典は別扱いです。"
        ],
        [
          "CPを戻せば以前の帯の効果も戻りますか？",
          "戻った現在の帯で今週TOP5資格がまだ有効なら、新CPの確認後に再び使えます。先週の順位やTOP5から落ちた順位では戻りません。サーバーはミーターから受け取った最新CPを使用します。装備変更直後の即時表示切り替えには対応ミーター更新が必要です。"
        ],
        [
          "5位から6位に下がるとどうなりますか？",
          "新順位の公開と資格確認後に、TOP5専用アニメーションとニックネーム効果は解除されます。6～20位は静止枠です。他の有効なTOP5やクーポン特典は別扱いです。一度取得しても永久特典ではありません。"
        ],
        [
          "全期間1位なのに効果がないのはなぜ？",
          "元のボス・クラス・25K帯の今週順位で判定します。全期間1位や全CP・全ボス表示の1位だけではTOP5効果は得られません。他のキャラクターやクラスの資格も引き継ぎません。"
        ],
        [
          "戦闘終了後の順位と上位%は何を表しますか？",
          "その戦闘のDPSを、同じボス・クラス・戦闘時の25K CP帯の最新公開済み全期間データと比較します。その戦闘と一致する自己ベストが公開TOP20にあれば帯内順位、なければ比較可能な上位%を表示します。上位10%は上位80%より高い記録で、パーティー内の与ダメージ割合ではありません。即時表示は登録完了や今週TOP5特典の確定を意味しません。サイトの今週順位と資格は集計・公開・資格確認後に反映されます。"
        ],
        [
          "自分とパーティーメンバーの表示が違うのはなぜ？",
          "比較データがあれば、自分はTOP20外でも上位50%・80%を確認できます。279以降のミーターでは、パーティーメンバーは公開TOP20の順位があるか上位10%以内なら表示します。TOP20順位は別の表示条件で、順位のない仲間の上位%は10%までです。表示なしは送信失敗やダメージ0を意味しません。戦闘終了後の順位表示も有効にしてください。"
        ],
        [
          "表示が空、またはサイトと違う場合は？",
          "同条件の統計が未作成・未公開、または読み込みに失敗している場合があります。対象は150K以上1000K未満です。戦闘後はその戦闘のDPS・当時のCP・全期間で比較し、サイトは選択したボス・CP・期間と自己ベストで表示するため異なる場合があります。全ボス・全CPの表示順位も効果資格とは別です。比較条件と更新時刻を確認してください。"
        ],
        [
          "サイトではTOP5なのに表示されません",
          "送信、順位公開、ミーターの資格確認の順で反映されます。公開時刻と今週順位を確認し、ニックネーム効果を選択・保存してランカー表示を有効にしてください。相手側も他キャラクターの効果表示が必要です。 279以降で対応しています。旧バージョンをご利用の方は更新してください。"
        ],
        [
          "週のリセットで記録や選んだ効果も消えますか？",
          "先週の順位による資格は終了し、今週の記録で再取得が必要です。全期間記録、保存した効果選択、クーポン期限は残ります。ただし他の有効な資格がなければ効果は表示されません。"
        ],
        [
          "クーポンがあっても順位低下でアニメーションが消えますか？",
          "ニックネームクーポンの残り期間が2か月以上なら順位に関係なく維持します。発行時の月数ではなく現在の残り期間です。2か月未満になるとそのアニメーション特典は終了しますが、クーポン自体の即時失効ではありません。有効な今週TOP5なら順位によるアニメーションは残ります。"
        ]
      ],
      "title": "グローバルランキングの使い方",
      "intro": "279以降で対応しています。旧バージョンをご利用の方は更新してください。 同じボス・クラス・戦闘力の条件で最高DPSを比較します。対象ダンジョンと1分間の訓練用カカシは、共通の25K CP帯を使います。",
      "items": [
        [
          "戦闘時のCP帯を選ぶ",
          "150K以上1000K未満を25K刻みで比較します。Kは1,000です。162Kなら150K以上175K未満、最後は975K以上1000K未満です。"
        ],
        [
          "170Kから180Kになるとどうなりますか？",
          "170Kは150K以上175K未満です。そこで今週3位でも、180Kになると175K以上200K未満へ移るため、旧3位のニックネーム効果やアニメーションは引き継げません。新しい帯の今週1～5位なら効果、6～20位なら静止枠のみ、21位以下・順位なしならランキング特典なしです。175Kちょうどから新しい帯です。CPが下がって帯を移る場合も同じです。旧記録は元の帯に残り、新しい帯には移りません。クーポン特典は別扱いです。"
        ],
        [
          "キャラクターごとに最高記録1件",
          "同じボス・クラス・CP帯・期間では最高DPSのみを使います。より高い記録で更新され、低い記録を繰り返しても複数の順位を占めたり参加人数が増えたりしません。"
        ],
        [
          "TOP20と上位10%・25%の違い",
          "TOP20は最大20キャラクターと閲覧可能な戦闘詳細を表示します。圏外でも最高DPSは統計に含まれます。上位10%・25%は同じ条件のキャラクターを比べたDPSの目安で、送信された戦闘件数の割合ではありません。"
        ],
        [
          "戦闘終了後の順位と上位%は何を表しますか？",
          "その戦闘のDPSを、同じボス・クラス・戦闘時の25K CP帯の最新公開済み全期間データと比較します。その戦闘と一致する自己ベストが公開TOP20にあれば帯内順位、なければ比較可能な上位%を表示します。上位10%は上位80%より高い記録で、パーティー内の与ダメージ割合ではありません。即時表示は登録完了や今週TOP5特典の確定を意味しません。サイトの今週順位と資格は集計・公開・資格確認後に反映されます。"
        ],
        [
          "全体表示と今週のランキング",
          "初期表示は全CP・全ボスです。全体表示も各キャラクターの最高DPS1件を使い、ボスごとのDPSを合計しません。全期間の記録は残り、今週分は米国太平洋時間の毎週火曜日23:30に始まります。画面はPCのタイムゾーンとGMT差に換算し、夏時間も反映します。"
        ],
        [
          "送信後はランキング更新を待つ",
          "送信成功と順位反映は同時ではありません。韓国・台湾と同じ更新処理で集計し、現在は公開完了の30分後に次の集計を開始します。集計・公開には別途時間がかかり、混雑時は遅れる場合があります。画面の更新時刻を確認してください。再読み込みで集計は開始されません。"
        ],
        [
          "週間TOP5はアニメーション、6～20位は静止枠",
          "対象ボス・クラス・25K CP帯の公開済み週間1～5位は、動くランカーエフェクトとすべての名前エフェクトを使えます。6～20位は既存のアニメーションなしの枠のみ、21位以下にはランキング枠がありません。1分カカシも同様です。全期間順位だけでは週間特典を得られません。全CP・全ボス画面の順番ではなく、元のCP帯の週間順位で判定します。別途、名前クーポンの残り期間が2か月以上なら、順位に関係なくランカーアニメーションを利用できます。"
        ],
        [
          "グローバルランキングはNotMeter 1.0.279以降に対応",
          "グローバルのダンジョン・1分間訓練ダミーの25K CP帯別ランキング、戦闘終了後の順位・上位%、現在のCP帯に応じたランカー・ニックネーム効果はNotMeter 1.0.279以降に対応しています。旧バージョンの方は最新版に更新してご利用ください。"
        ]
      ],
      "history": "旧方式で残っていた有効記録と変更後に受信した記録を使います。過去に保存されなかった記録は復元できません。ゲーム更新により対象ダンジョンや最低CPが変わる場合があります。韓国・台湾の規則は変更しません。",
      "effectTitle": "ランカー枠と名前エフェクト",
      "effectUse": "特典は現在のCP帯の今週順位にだけ適用されます. 記録公開後にNotMeterが資格を確認したら、設定 → 名前エフェクトで利用可能なものを選んで保存してください。戦闘直後の推定順位だけでは解放されません。TOP5圏外や週間リセットではTOP5資格が終了しますが、別のクーポン特典は維持されます。保存した選択やクーポン期限は変わりません。枠を見るにはランカー表示を有効にしてください。",
      "guideTitle": "グローバルのランカー特典",
      "guideIntro": "279以降で対応しています。旧バージョンをご利用の方は更新してください。 特典は現在のCP帯の今週順位にだけ適用されます. ダンジョン・1分カカシとも、CP帯の週間TOP5は動くエフェクト、6～20位は静止枠です。クーポン特典は別です。",
      "timingTitle": "順位と特典はいつ反映されますか？",
      "shareTitle": "エフェクトを選び、他の人に表示する",
      "share": "利用可能なエフェクトを保存してから、他の利用者が更新を受け取るまで時間がかかります。相手も他キャラクターのエフェクト表示を有効にする必要があります。ランキング公開・資格確認の待ち時間とは別です。有効なクーポンや称賛ランキングの特典は独立して維持されます。",
      "dummyTitle": "1分カカシも同じ規則",
      "dummy": "有効な60秒記録をクラス・25K CP帯で比較します。150K以上1000K未満を対象にTOP20と上位割合を表示します。週間1～5位はランカーアニメーション・名前エフェクト、6～20位は静止枠です。残り期間2か月以上のクーポンによるアニメーションは順位と無関係です。",
      "animatedTitle": "今週1～5位 · 動く枠",
      "animatedBody": "金色の枠に沿って光が動きます。残り期間2か月以上のクーポンでも、順位に関係なくこのアニメーションを利用できます。",
      "staticTitle": "今週6～20位 · 静止枠",
      "staticBody": "6～10位は水色、11～20位は紫色の動かない枠です。別途クーポン資格がある場合はアニメーションが優先されます。",
      "dungeons": "グローバルの対象コンテンツ",
      "dismiss": "今後表示しない",
      "reopen": "グローバルランキングの案内を再表示",
      "saved": "このブラウザーにのみ保存します。非表示にした案内は再表示できます。",
      "failed": "設定を保存できませんでした。次回また表示される場合があります。"
    },
    "de-DE": {
      "lossTitle": "Vorteile gelten nur für den Wochenrang in deinem aktuellen CP-Bereich",
      "loss": "Ein Rang aus einem anderen CP-Bereich wird nicht übernommen, auch nicht für denselben Charakter und dieselbe Klasse. Wochen-TOP5 bei einem unterstützten Boss im aktuellen Bereich gewährt Ranganimation und Namenseffekte. Ohne diese Berechtigung entfallen sie: Wochenplätze 6–20 erhalten nur einen statischen Rahmen; ab Platz 21 oder ohne Rang gibt es keinen Rangrahmen. Separate Coupon-Vorteile bleiben bestehen.",
      "faqTitle": "Fragen zu veränderten Effekten",
      "faq": [
        [
          "Was passiert beim Wechsel von 170K auf 180K?",
          "170K gehört zu 150K bis unter 175K. Selbst mit Wochenplatz 3 dort wechselst du bei 180K in 175K bis unter 200K. Namenseffekte und Animation des alten 3. Platzes werden nicht übernommen. Im neuen Bereich geben Wochenplätze 1–5 Effekte, 6–20 nur einen statischen Rahmen und Platz 21 oder kein Rang keine Rangvorteile. Genau 175K beginnt den neuen Bereich; sinkende CP werden genauso behandelt. Alte Rekorde bleiben im ursprünglichen Bereich und werden nicht verschoben. Coupons gelten unabhängig."
        ],
        [
          "Kommen die alten Effekte zurück, wenn ich CP senke?",
          "Nach Erkennung der neuen CP ja, sofern im zurückgekehrten Bereich noch eine gültige Wochen-TOP5-Berechtigung besteht. Der Rang der Vorwoche oder ein Rang außerhalb TOP5 reicht nicht. Der Server nutzt die zuletzt vom Meter gesendeten CP. Sofortige Anzeigeänderungen nach einem Ausrüstungswechsel benötigen die kompatible Meter-Aktualisierung."
        ],
        [
          "Was passiert beim Abstieg von Platz 5 auf 6?",
          "Nach Veröffentlichung und Berechtigungsprüfung enden TOP5-Animation und Namenseffekte. Plätze 6–20 haben einen statischen Rahmen. Andere gültige TOP5- oder Gutscheinvorteile bleiben unabhängig. Ein einmal verdienter Effekt ist nicht dauerhaft."
        ],
        [
          "Warum bekomme ich als Erster der Gesamtwertung keinen Effekt?",
          "Es zählt der Wochenrang für den ursprünglichen Boss, die Klasse und das 25K-Intervall. Platz 1 der Gesamtwertung oder der Ansicht aller CP/Bosse allein reicht nicht. Rechte anderer Charaktere oder Klassen werden nicht übertragen."
        ],
        [
          "Was bedeuten Rang und Top-% nach dem Kampf?",
          "Der DPS dieses Kampfes wird mit den zuletzt veröffentlichten Allzeitdaten für denselben Boss, dieselbe Klasse und den 25K-CP-Bereich während des Kampfes verglichen. Entspricht der Kampf einem veröffentlichten persönlichen TOP20-Rekord, erscheint dessen Bereichsrang; andernfalls ein vergleichbarer Top-Prozentwert. Top 10% ist besser als Top 80% und kein Anteil am Gruppenschaden. Die Anzeige bestätigt weder die Registrierung noch Wochen-TOP5-Vorteile. Wochenrang und Berechtigung folgen Berechnung, Veröffentlichung und Prüfung."
        ],
        [
          "Warum unterscheidet sich meine Anzeige von der meiner Gruppe?",
          "Mit Vergleichsdaten siehst du selbst auch außerhalb der TOP20 etwa Top 50% oder 80%. NotMeter ab Version 279 zeigt Gruppenmitglieder bei einem veröffentlichten TOP20-Rang ODER innerhalb der Top 10%. TOP20-Ränge sind ein eigener Anzeigefall; Prozentwerte ohne Rang werden für Gruppenmitglieder nur bis 10% angezeigt. Kein Abzeichen bedeutet nicht fehlgeschlagenen Upload oder null Schaden. Aktiviere auch die Ranganzeige nach dem Kampf."
        ],
        [
          "Warum fehlen Werte oder weichen von der Website ab?",
          "Passende Statistiken können fehlen, noch nicht veröffentlicht oder nicht abrufbar sein. Unterstützt werden 150K bis unter 1000K. Nach dem Kampf gelten dessen DPS, damalige CP und Allzeitdaten; auf der Website der gewählte Boss, CP, Zeitraum und persönliche Bestwert. Auch die Reihenfolge unter Alle Bosse / Alle CP ist keine Effektberechtigung. Prüfe Bedingungen und Aktualisierungszeit."
        ],
        [
          "Die Website zeigt TOP5, aber kein Effekt erscheint",
          "Upload, Veröffentlichung und Prüfung im Meter erfolgen nacheinander. Prüfe Zeitpunkt und Wochenrang, speichere einen Namenseffekt und aktiviere Rangindikatoren. Andere Spieler müssen fremde Effekte ebenfalls zulassen. Ab Version 279 verfügbar. Bitte aktualisiere NotMeter, wenn du eine ältere Version nutzt."
        ],
        [
          "Löscht der Wochenreset meine Rekorde und Effektauswahl?",
          "Die Berechtigung der Vorwoche endet; qualifiziere dich mit neuen Wochenrekorden. Gesamtzeitrekorde, gespeicherte Auswahl und Gutscheinablauf bleiben erhalten. Ohne eine andere gültige Berechtigung wird der Effekt nicht angezeigt."
        ],
        [
          "Verliere ich bei schlechterem Rang meine Gutscheinanimation?",
          "Ein Namensgutschein mit mindestens 2 Monaten Restlaufzeit gewährt die Animation unabhängig vom Rang. Entscheidend ist die Restlaufzeit, nicht die ursprüngliche Dauer. Unter 2 Monaten endet nur dieser Animationsvorteil, nicht sofort der Gutschein. Gültige Wochen-TOP5 können weiterhin die Ranganimation gewähren."
        ]
      ],
      "title": "So funktionieren globale Ranglisten",
      "intro": "Ab Version 279 verfügbar. Bitte aktualisiere NotMeter, wenn du eine ältere Version nutzt. Vergleiche deine besten DPS bei gleichem Boss, gleicher Klasse und ähnlicher CP. Unterstützte Dungeons und der 1-Minuten-Test an der Trainingspuppe nutzen dieselben 25K-CP-Bereiche.",
      "items": [
        [
          "Wähle den CP-Bereich deines Kampfes",
          "Es zählen 150K bis unter 1000K CP in 25K-Schritten. K bedeutet 1.000. 162K gehört zum Bereich 150K bis unter 175K. Der letzte Bereich ist 975K bis unter 1000K."
        ],
        [
          "Was passiert beim Wechsel von 170K auf 180K?",
          "170K gehört zu 150K bis unter 175K. Selbst mit Wochenplatz 3 dort wechselst du bei 180K in 175K bis unter 200K. Namenseffekte und Animation des alten 3. Platzes werden nicht übernommen. Im neuen Bereich geben Wochenplätze 1–5 Effekte, 6–20 nur einen statischen Rahmen und Platz 21 oder kein Rang keine Rangvorteile. Genau 175K beginnt den neuen Bereich; sinkende CP werden genauso behandelt. Alte Rekorde bleiben im ursprünglichen Bereich und werden nicht verschoben. Coupons gelten unabhängig."
        ],
        [
          "Eine Bestleistung pro Charakter",
          "Für jeden Boss, jede Klasse, jeden CP-Bereich und Zeitraum zählt nur die höchste DPS. Ein besserer Wert ersetzt sie. Wiederholte niedrigere Werte belegen keine weiteren Plätze und erhöhen nicht die Teilnehmerzahl."
        ],
        [
          "TOP20 und beste 10% / 25% unterscheiden",
          "TOP20 zeigt bis zu 20 Charaktere und verfügbare Kampfdetails. Auch außerhalb der TOP20 zählt die persönliche Bestleistung für die Statistik. Die Werte der besten 10% und 25% sind DPS-Grenzen für Charaktere unter gleichen Bedingungen, nicht Anteile aller hochgeladenen Kämpfe."
        ],
        [
          "Was bedeuten Rang und Top-% nach dem Kampf?",
          "Der DPS dieses Kampfes wird mit den zuletzt veröffentlichten Allzeitdaten für denselben Boss, dieselbe Klasse und den 25K-CP-Bereich während des Kampfes verglichen. Entspricht der Kampf einem veröffentlichten persönlichen TOP20-Rekord, erscheint dessen Bereichsrang; andernfalls ein vergleichbarer Top-Prozentwert. Top 10% ist besser als Top 80% und kein Anteil am Gruppenschaden. Die Anzeige bestätigt weder die Registrierung noch Wochen-TOP5-Vorteile. Wochenrang und Berechtigung folgen Berechnung, Veröffentlichung und Prüfung."
        ],
        [
          "Gesamtansicht und Wochenrangliste",
          "Standardmäßig sind alle CP-Bereiche und Bosse ausgewählt. Auch hier zählt nur die höchste DPS pro Charakter; DPS verschiedener Bosse werden nicht addiert. Gesamtrekorde bleiben erhalten. Die Woche beginnt dienstags um 23:30 Uhr in America/Los_Angeles neu. Angezeigt wird die Zeit deiner PC-Zeitzone mit GMT-Abstand und Sommerzeit."
        ],
        [
          "Nach dem Senden auf die Aktualisierung warten",
          "Ein erfolgreicher Upload ändert den Rang nicht sofort. Global wird gemeinsam mit KR/TW berechnet. Aktuell beginnt die nächste Berechnung 30 Minuten nach Abschluss der Veröffentlichung; Berechnung und Veröffentlichung dauern zusätzlich. Bei hoher Last kann es länger dauern. Prüfe die Aktualisierungszeit auf der Seite. Neuladen startet keine Berechnung."
        ],
        [
          "Wochen-TOP5: Animation; Plätze 6–20: statischer Rahmen",
          "Veröffentlichte Wochenplätze 1–5 je unterstütztem Boss, Klasse und 25K-Bereich erhalten animierte Rang- und alle Namenseffekte. Plätze 6–20 zeigen nur den bisherigen statischen Rahmen; ab Platz 21 gibt es keinen Rangrahmen. Das gilt auch für die 1-Minuten-Puppe. Gesamtplätze allein gewähren diese Wochenboni nicht. Es zählt der Wochenrang im ursprünglichen Bereich, nicht die Position unter allen CP oder Bossen. Unabhängig davon gewährt ein Namenscoupon mit mindestens 2 Monaten Restlaufzeit die Ranganimation ohne Rangvoraussetzung."
        ],
        [
          "Globale Ranglisten ab NotMeter 1.0.279",
          "Globale Dungeon- und 1-Minuten-Trainingspuppen-Ranglisten in 25K-CP-Bereichen, Ränge und Top-% nach dem Kampf sowie Rang- und Namenseffekte für deinen aktuellen CP-Bereich werden ab NotMeter 1.0.279 unterstützt. Aktualisiere ältere Versionen auf die neueste Version."
        ]
      ],
      "history": "Es zählen gültige verbliebene Altdaten und seit der Änderung empfangene Aufzeichnungen. Früher verworfene Daten lassen sich nicht wiederherstellen. Spielupdates können unterstützte Dungeons und Mindest-CP ändern. KR/TW-Regeln bleiben gleich.",
      "effectTitle": "Rangrahmen und Namenseffekte",
      "effectUse": "Vorteile gelten nur für den Wochenrang in deinem aktuellen CP-Bereich. Nach Veröffentlichung und Bestätigung deiner Berechtigung in NotMeter wählst und speicherst du einen verfügbaren Effekt unter Einstellungen → Namenseffekte. Eine Schätzung nach dem Kampf reicht nicht. Außerhalb der TOP5 oder nach dem Wochenreset endet die TOP5-Berechtigung; separate Coupon-Boni bleiben erhalten. Auswahl und Coupon-Ablaufdatum ändern sich nicht. Aktiviere die Rangmarkierungen, um Rahmen zu sehen.",
      "guideTitle": "Globale Ranglisteneffekte erklärt",
      "guideIntro": "Ab Version 279 verfügbar. Bitte aktualisiere NotMeter, wenn du eine ältere Version nutzt. Vorteile gelten nur für den Wochenrang in deinem aktuellen CP-Bereich. Dungeons und 1-Minuten-Puppe: Wochen-TOP5 je Bereich mit Animation, Plätze 6–20 mit statischem Rahmen. Coupon-Boni gelten separat.",
      "timingTitle": "Wann werden Rang und Effekte aktualisiert?",
      "shareTitle": "Effekte wählen und anderen anzeigen",
      "share": "Nach dem Speichern brauchen andere Nutzer Zeit, um den Effekt zu empfangen. Sie müssen fremde Namenseffekte aktiviert haben. Das ist unabhängig von der Wartezeit auf Ranglisten und Berechtigungen. Gültige Coupons und Lob-Ranglistenboni bleiben unabhängig erhalten.",
      "dummyTitle": "Gleiche Regeln für den 1-Minuten-Test",
      "dummy": "Gültige abgeschlossene 60-Sekunden-Tests werden nach Klasse und 25K-Bereich verglichen, von 150K bis unter 1000K CP, mit TOP20 und Prozentwerten. Wochenplätze 1–5 erhalten Ranganimation und Namenseffekte, Plätze 6–20 einen statischen Rahmen. Coupons mit mindestens 2 Monaten Restlaufzeit gewähren Ranganimation unabhängig vom Rang.",
      "animatedTitle": "Wochenplätze 1–5 · Animation",
      "animatedBody": "Licht bewegt sich um den goldenen Rahmen. Ein Coupon mit mindestens 2 Monaten Restlaufzeit gewährt diese Animation unabhängig vom Rang.",
      "staticTitle": "Wochenplätze 6–20 · Statischer Rahmen",
      "staticBody": "Plätze 6–10 haben einen hellblauen, 11–20 einen violetten Rahmen ohne Animation. Eine separate Coupon-Berechtigung hat Vorrang und erhält die Animation.",
      "dungeons": "Unterstützte globale Inhalte",
      "dismiss": "Nicht mehr anzeigen",
      "reopen": "Globalen Ranglistenleitfaden öffnen",
      "saved": "Nur in diesem Browser gespeichert. Der ausgeblendete Leitfaden lässt sich erneut öffnen.",
      "failed": "Die Einstellung konnte nicht gespeichert werden. Der Hinweis kann beim nächsten Besuch erneut erscheinen."
    },
    "fr-FR": {
      "lossTitle": "Les avantages dépendent uniquement du rang hebdomadaire de votre tranche de CP actuelle",
      "loss": "Un rang dans une autre tranche de CP ne se transfère pas, même pour le même personnage et la même classe. Être dans le TOP5 hebdomadaire d’un boss pris en charge, dans votre tranche actuelle, donne l’animation et les effets de pseudo. Sans ce droit, ils cessent : les places 6–20 ont seulement un cadre fixe ; à partir de 21 ou sans rang, aucun cadre de classement. Les coupons restent indépendants.",
      "faqTitle": "Questions sur les changements d’effets",
      "faq": [
        [
          "Que se passe-t-il en passant de 170K à 180K ?",
          "170K appartient à la tranche 150K à moins de 175K. Même 3e de la semaine dans celle-ci, à 180K vous passez à 175K–moins de 200K : les effets de pseudo et l’animation de l’ancienne 3e place ne suivent pas. Dans la nouvelle tranche, les places hebdomadaires 1–5 donnent les effets, 6–20 seulement un cadre fixe, et 21 ou sans rang aucun avantage de classement. La nouvelle tranche commence exactement à 175K ; une baisse de CP suit la même règle. Les anciens records restent dans leur tranche. Les coupons sont séparés."
        ],
        [
          "Baisser mes CP rétablit-il les effets de l’ancienne tranche ?",
          "Oui après reconnaissance des nouveaux CP, si le TOP5 hebdomadaire de la tranche retrouvée est toujours valable. Un rang de la semaine passée ou sorti du TOP5 ne suffit pas. Le serveur utilise les derniers CP envoyés par le logiciel. Un changement immédiat d’affichage après avoir changé d’équipement nécessite la mise à jour compatible."
        ],
        [
          "Que se passe-t-il si je passe de la 5e à la 6e place ?",
          "Après publication et vérification des droits, l’animation et les effets de nom réservés au TOP5 prennent fin. Les places 6–20 ont une bordure fixe. Les autres droits TOP5 ou coupons restent indépendants. Obtenir un effet une fois ne le rend pas permanent."
        ],
        [
          "Pourquoi ma 1re place toutes périodes ne donne-t-elle aucun effet ?",
          "Seul le rang hebdomadaire du boss, de la classe et de la tranche 25K d’origine compte. Être premier toutes périodes ou dans Toutes les CP / Tous les boss ne suffit pas. Les droits d’autres personnages ou classes ne sont pas transférés."
        ],
        [
          "Que signifient le rang et le top % après un combat ?",
          "Le DPS de ce combat est comparé aux dernières données publiées sur toute la période, pour le même boss, la même classe et la tranche de 25K CP au moment du combat. Si ce combat correspond à un record personnel publié dans le TOP20, son rang de tranche apparaît ; sinon, un pourcentage comparable. Top 10% est meilleur que top 80% : ce n’est pas votre part des dégâts du groupe. Cet affichage ne confirme ni l’enregistrement ni les avantages du TOP5 hebdomadaire. Ceux-ci suivent le calcul, la publication et la vérification."
        ],
        [
          "Pourquoi mon affichage diffère-t-il de celui du groupe ?",
          "Avec des données comparables, vous voyez votre propre top 50% ou 80%, même hors TOP20. NotMeter à partir de la version 279 affiche un membre du groupe s’il possède un rang TOP20 publié OU s’il est dans le top 10%. Le TOP20 est un cas distinct ; les pourcentages sans rang des coéquipiers ne s’affichent que jusqu’à 10%. L’absence d’indication ne signifie ni échec d’envoi ni dégâts nuls. Activez aussi l’affichage après combat."
        ],
        [
          "Pourquoi une valeur manque-t-elle ou diffère-t-elle du site ?",
          "Les statistiques correspondantes peuvent être absentes, pas encore publiées ou indisponibles. La plage prise en charge va de 150K à moins de 1000K. Après combat, la comparaison utilise son DPS, ses CP et toute la période ; le site utilise les filtres boss, CP, période et le meilleur record personnel. L’ordre Tous les boss / Tous les CP ne donne pas non plus de droits aux effets. Vérifiez les conditions et l’heure de mise à jour."
        ],
        [
          "Le site indique TOP5, mais l’effet n’apparaît pas",
          "L’envoi, la publication et la vérification par le compteur se succèdent. Vérifiez la date et le rang hebdomadaire, choisissez et enregistrez un effet de nom, puis activez les indicateurs de classement. Les autres joueurs doivent autoriser les effets des autres personnages. Disponible à partir de la version 279. Mettez NotMeter à jour si vous utilisez une version antérieure."
        ],
        [
          "La réinitialisation hebdomadaire efface-t-elle mes records et mon choix ?",
          "Les droits obtenus la semaine précédente expirent ; il faut se qualifier avec les records de cette semaine. Les records toutes périodes, le choix enregistré et l’expiration du coupon restent inchangés. Sans autre droit valable, l’effet n’est pas affiché."
        ],
        [
          "Une baisse de rang retire-t-elle l’animation de mon coupon ?",
          "Un coupon de nom ayant au moins 2 mois restants conserve l’animation indépendamment du rang. C’est la durée restante qui compte, pas la durée initiale. Sous 2 mois, cet avantage d’animation prend fin, sans faire expirer immédiatement le coupon. Un TOP5 hebdomadaire valable peut toujours fournir l’animation de classement."
        ]
      ],
      "title": "Comprendre les classements Global",
      "intro": "Disponible à partir de la version 279. Mettez NotMeter à jour si vous utilisez une version antérieure. Comparez votre meilleur DPS à boss, classe et CP comparables. Les donjons pris en charge et le mannequin de 1 minute utilisent les mêmes tranches de 25K CP.",
      "items": [
        [
          "Choisissez votre CP pendant le combat",
          "Les tranches vont de 150K inclus à 1000K exclu, par pas de 25K. K signifie 1 000. Un CP de 162K appartient à la tranche 150K–moins de 175K. La dernière est 975K–moins de 1000K."
        ],
        [
          "Que se passe-t-il en passant de 170K à 180K ?",
          "170K appartient à la tranche 150K à moins de 175K. Même 3e de la semaine dans celle-ci, à 180K vous passez à 175K–moins de 200K : les effets de pseudo et l’animation de l’ancienne 3e place ne suivent pas. Dans la nouvelle tranche, les places hebdomadaires 1–5 donnent les effets, 6–20 seulement un cadre fixe, et 21 ou sans rang aucun avantage de classement. La nouvelle tranche commence exactement à 175K ; une baisse de CP suit la même règle. Les anciens records restent dans leur tranche. Les coupons sont séparés."
        ],
        [
          "Un meilleur score par personnage",
          "Seul votre meilleur DPS compte pour chaque boss, classe, tranche et période. Un meilleur score le remplace. Répéter des scores inférieurs ne prend pas de places supplémentaires et n’augmente pas le nombre de participants."
        ],
        [
          "TOP20 et meilleurs 10% / 25%",
          "Le TOP20 affiche jusqu’à 20 personnages et les détails de combat disponibles. Hors TOP20, le meilleur DPS participe toujours aux statistiques. Les valeurs des meilleurs 10% et 25% sont des seuils DPS entre personnages comparables, pas des pourcentages de tous les combats envoyés."
        ],
        [
          "Que signifient le rang et le top % après un combat ?",
          "Le DPS de ce combat est comparé aux dernières données publiées sur toute la période, pour le même boss, la même classe et la tranche de 25K CP au moment du combat. Si ce combat correspond à un record personnel publié dans le TOP20, son rang de tranche apparaît ; sinon, un pourcentage comparable. Top 10% est meilleur que top 80% : ce n’est pas votre part des dégâts du groupe. Cet affichage ne confirme ni l’enregistrement ni les avantages du TOP5 hebdomadaire. Ceux-ci suivent le calcul, la publication et la vérification."
        ],
        [
          "Vue globale et classement hebdomadaire",
          "Par défaut, tous les CP et tous les boss sont sélectionnés. La vue combinée utilise encore un seul meilleur DPS par personnage, sans additionner les boss. Les records de tous les temps restent. La semaine recommence le mardi à 23:30, heure America/Los_Angeles. La page affiche l’heure de votre PC avec le décalage GMT et tient compte de l’heure d’été."
        ],
        [
          "Attendez l’actualisation après l’envoi",
          "Un envoi réussi ne modifie pas immédiatement le classement. Global est calculé avec KR/TW. Actuellement, le calcul suivant débute 30 minutes après la fin de la publication ; calcul et publication prennent du temps supplémentaire. Une forte charge peut allonger l’attente. Consultez l’heure de mise à jour affichée. Recharger la page ne lance pas un calcul."
        ],
        [
          "TOP5 hebdomadaire : animation ; places 6 à 20 : cadre fixe",
          "Les places publiées 1 à 5 de la semaine, par boss pris en charge, classe et tranche de 25K, donnent l’effet de rang animé et tous les effets de pseudo. Les places 6 à 20 affichent uniquement le cadre fixe existant ; à partir de la 21e place, aucun cadre de classement. Le mannequin de 1 minute suit la même règle. Le classement de tous les temps seul ne donne pas ces avantages hebdomadaires. La tranche d’origine compte, pas la place dans la vue tous CP ou tous boss. Un coupon de pseudo avec au moins 2 mois restants donne séparément l’animation de rang, quel que soit le classement."
        ],
        [
          "Classements Global à partir de NotMeter 1.0.279",
          "Les classements Global des donjons et du mannequin de 1 minute par tranche de 25K CP, les rangs et pourcentages après combat ainsi que les effets de rang et de nom liés à votre tranche actuelle sont pris en charge depuis NotMeter 1.0.279. Mettez votre ancienne version à jour avant de les utiliser."
        ]
      ],
      "history": "Les classements utilisent les anciennes données valides encore conservées et les données reçues depuis le changement. Les données précédemment supprimées ne peuvent pas être récupérées. Les mises à jour du jeu peuvent changer les donjons pris en charge et le CP minimum. KR/TW reste inchangé.",
      "effectTitle": "Cadres de rang et effets de pseudo",
      "effectUse": "Les avantages dépendent uniquement du rang hebdomadaire de votre tranche de CP actuelle. Après publication et confirmation des droits par NotMeter, choisissez et enregistrez un effet disponible dans Paramètres → Effets de pseudo. L’estimation après combat ne suffit pas. Sortir du TOP5 ou le reset hebdomadaire met fin aux droits TOP5, mais pas aux avantages distincts des coupons. Votre choix et leur date d’expiration restent inchangés. Activez les indicateurs de rang pour voir les cadres.",
      "guideTitle": "Les effets de rang Global expliqués",
      "guideIntro": "Disponible à partir de la version 279. Mettez NotMeter à jour si vous utilisez une version antérieure. Les avantages dépendent uniquement du rang hebdomadaire de votre tranche de CP actuelle. Donjons et mannequin de 1 minute : TOP5 hebdomadaire par tranche animé, places 6 à 20 avec cadre fixe. Les coupons restent indépendants.",
      "timingTitle": "Quand les rangs et effets sont-ils actualisés ?",
      "shareTitle": "Choisir un effet et le montrer aux autres",
      "share": "Après l’enregistrement, les autres utilisateurs doivent recevoir la mise à jour et activer les effets des autres personnages. Ce délai est distinct de l’attente du classement et des droits. Les avantages valides des coupons et du classement de compliments restent indépendants.",
      "dummyTitle": "Même règle pour le mannequin de 1 minute",
      "dummy": "Les tests valides terminés de 60 secondes sont comparés par classe et tranche de 25K, de 150K à moins de 1000K CP, avec TOP20 et pourcentages. Les places hebdomadaires 1 à 5 donnent animation de rang et effets de pseudo ; 6 à 20, un cadre fixe. Un coupon avec au moins 2 mois restants donne l’animation indépendamment du rang.",
      "animatedTitle": "Places 1 à 5 de la semaine · Animation",
      "animatedBody": "La lumière se déplace autour du cadre doré. Un coupon avec au moins 2 mois restants donne aussi cette animation, quel que soit le rang.",
      "staticTitle": "Places 6 à 20 de la semaine · Cadre fixe",
      "staticBody": "Cadre bleu clair pour les places 6 à 10, violet pour les places 11 à 20, sans animation. Un droit distinct lié à un coupon est prioritaire et conserve l’animation.",
      "dungeons": "Contenus Global pris en charge",
      "dismiss": "Ne plus afficher",
      "reopen": "Relire le guide des classements Global",
      "saved": "Enregistré dans ce navigateur uniquement. Le guide masqué peut être rouvert.",
      "failed": "Impossible d’enregistrer ce choix. Le guide pourra réapparaître à la prochaine visite."
    },
    "es-ES": {
      "lossTitle": "Los beneficios solo corresponden al rango semanal de tu tramo de CP actual",
      "loss": "El puesto de otro tramo de CP no se traslada, aunque sea el mismo personaje y clase. Un TOP5 semanal de cualquier jefe admitido en tu tramo actual otorga animación y efectos de nombre. Sin esa condición se desactivan: puestos semanales 6–20 solo tienen borde estático; desde el 21 o sin puesto no hay borde de ranking. Los cupones se mantienen por separado.",
      "faqTitle": "Dudas sobre cambios en los efectos",
      "faq": [
        [
          "¿Qué pasa si subo de 170K a 180K?",
          "170K pertenece a 150K–menos de 175K. Aunque allí seas 3.º semanal, al llegar a 180K pasas a 175K–menos de 200K: no conservas los efectos de nombre ni la animación del antiguo 3.º puesto. En el nuevo tramo, los puestos semanales 1–5 dan efectos, 6–20 solo borde estático y 21 o sin puesto ningún beneficio de ranking. Exactamente 175K ya inicia el nuevo tramo; bajar de CP funciona igual. Los récords anteriores quedan en su tramo y no se trasladan. Los cupones son independientes."
        ],
        [
          "¿Vuelven los efectos si bajo al tramo anterior?",
          "Sí, al reconocerse los nuevos CP, si sigue vigente el TOP5 semanal del tramo al que vuelves. No sirve un puesto de la semana pasada o ya fuera del TOP5. El servidor usa los últimos CP enviados por el medidor. El cambio visual inmediato al cambiar equipo requiere la actualización compatible."
        ],
        [
          "¿Qué pasa si bajo del puesto 5 al 6?",
          "Tras publicarse el ranking y comprobarse los permisos, se desactivan la animación y los efectos de nombre exclusivos del TOP5. Los puestos 6–20 tienen borde estático. Otros derechos TOP5 o cupones son independientes. Ganar un efecto una vez no lo hace permanente."
        ],
        [
          "¿Por qué mi primer puesto histórico no da efectos?",
          "Se usa el puesto semanal del jefe, clase y tramo de 25K originales. Ser primero histórico o en Todos los CP / Todos los jefes no basta. Los permisos de otros personajes o clases no se transfieren."
        ],
        [
          "¿Qué significan el puesto y el top % tras el combate?",
          "El DPS de ese combate se compara con los últimos datos publicados de todo el período para el mismo jefe, clase y tramo de 25K CP durante el combate. Si coincide con una marca personal publicada en el TOP20, se muestra su puesto de tramo; en caso contrario, un top % comparable. Top 10% es mejor que top 80%; no es tu porcentaje de daño del grupo. Esta indicación no confirma el registro ni concede beneficios TOP5 semanales. Estos requieren cálculo, publicación y comprobación."
        ],
        [
          "¿Por qué mi indicación difiere de la del grupo?",
          "Con datos comparables, puedes ver tu propio top 50% u 80% incluso fuera del TOP20. NotMeter desde la versión 279 muestra a un compañero si tiene puesto TOP20 publicado O está dentro del top 10%. El TOP20 es un caso separado; los porcentajes sin puesto del grupo solo se muestran hasta el 10%. No ver una etiqueta no significa envío fallido ni daño cero. Activa también la visualización tras el combate."
        ],
        [
          "¿Por qué falta un valor o no coincide con la web?",
          "Puede que no existan estadísticas equivalentes, no estén publicadas o no se hayan podido cargar. Se admite desde 150K hasta menos de 1000K. Tras el combate se usan su DPS, CP de entonces y todo el período; la web usa los filtros de jefe, CP, período y mejor marca personal. Todos los jefes / Todos los CP tampoco decide los efectos. Compara las condiciones y la hora de actualización."
        ],
        [
          "La web muestra TOP5, pero no veo el efecto",
          "Envío, publicación y comprobación del medidor ocurren por separado. Revisa la hora publicada y el puesto semanal, guarda un efecto de nombre y activa los indicadores de ranking. Los demás deben permitir efectos ajenos. Disponible desde la versión 279. Actualiza NotMeter si usas una versión anterior."
        ],
        [
          "¿El reinicio semanal borra registros y mi efecto elegido?",
          "Caduca el permiso de la semana anterior; debes clasificarte con registros de esta semana. Los registros históricos, la selección guardada y la caducidad del cupón se mantienen. Sin otro permiso válido, el efecto no se muestra."
        ],
        [
          "¿Perder puestos elimina la animación del cupón?",
          "Un cupón de nombre con al menos 2 meses restantes mantiene la animación sin depender del puesto. Importa el tiempo restante, no la duración original. Bajar de 2 meses termina esa ventaja de animación, no el cupón de inmediato. Un TOP5 semanal válido puede seguir dando animación de ranking."
        ]
      ],
      "title": "Cómo funciona la clasificación Global",
      "intro": "Disponible desde la versión 279. Actualiza NotMeter si usas una versión anterior. Compara tu mejor DPS con el mismo jefe, clase y condiciones de CP. Las mazmorras compatibles y el muñeco de 1 minuto usan los mismos tramos de 25K CP.",
      "items": [
        [
          "Elige el tramo de tu CP durante el combate",
          "Se admiten registros desde 150K hasta menos de 1000K CP, en pasos de 25K. K significa 1.000. Por ejemplo, 162K pertenece a 150K–menos de 175K. El último tramo es 975K–menos de 1000K."
        ],
        [
          "¿Qué pasa si subo de 170K a 180K?",
          "170K pertenece a 150K–menos de 175K. Aunque allí seas 3.º semanal, al llegar a 180K pasas a 175K–menos de 200K: no conservas los efectos de nombre ni la animación del antiguo 3.º puesto. En el nuevo tramo, los puestos semanales 1–5 dan efectos, 6–20 solo borde estático y 21 o sin puesto ningún beneficio de ranking. Exactamente 175K ya inicia el nuevo tramo; bajar de CP funciona igual. Los récords anteriores quedan en su tramo y no se trasladan. Los cupones son independientes."
        ],
        [
          "Una mejor marca por personaje",
          "Solo cuenta tu mejor DPS por jefe, clase, tramo y periodo. Una puntuación superior lo sustituye. Repetir puntuaciones inferiores no ocupa más puestos ni aumenta el número de participantes."
        ],
        [
          "TOP20 y el 10% / 25% superior son distintos",
          "TOP20 muestra hasta 20 personajes y los detalles de combate disponibles. Fuera de TOP20, el mejor DPS sigue contando para las estadísticas. Los valores del 10% y 25% superior son umbrales de DPS entre personajes comparables, no porcentajes de todos los combates enviados."
        ],
        [
          "¿Qué significan el puesto y el top % tras el combate?",
          "El DPS de ese combate se compara con los últimos datos publicados de todo el período para el mismo jefe, clase y tramo de 25K CP durante el combate. Si coincide con una marca personal publicada en el TOP20, se muestra su puesto de tramo; en caso contrario, un top % comparable. Top 10% es mejor que top 80%; no es tu porcentaje de daño del grupo. Esta indicación no confirma el registro ni concede beneficios TOP5 semanales. Estos requieren cálculo, publicación y comprobación."
        ],
        [
          "Vista conjunta y clasificación semanal",
          "Por defecto se seleccionan todos los CP y todos los jefes. La vista conjunta también usa un solo mejor DPS por personaje; no suma DPS de varios jefes. Los récords históricos se conservan. La semana reinicia el martes a las 23:30 de America/Los_Angeles. La página lo convierte a la zona horaria del PC con su diferencia GMT y horario de verano."
        ],
        [
          "Espera a la actualización tras enviar",
          "Un envío correcto no cambia tu puesto al instante. Global se calcula junto con KR/TW. Actualmente, el siguiente cálculo empieza 30 minutos después de terminar la publicación; el cálculo y la publicación requieren tiempo adicional. Con mucha carga puede tardar más. Consulta la hora de actualización. Recargar la página no inicia un cálculo."
        ],
        [
          "TOP5 semanal: animación; puestos 6–20: borde estático",
          "Los puestos semanales publicados 1–5 de cada jefe compatible, clase y tramo de 25K obtienen el efecto de rango animado y todos los efectos de nombre. Los puestos 6–20 muestran solo el borde estático existente; a partir del 21 no hay borde de ranking. El muñeco de 1 minuto sigue las mismas reglas. El rango histórico por sí solo no concede estas ventajas semanales. Cuenta el tramo original, no la posición en todos los CP o jefes. Por separado, un cupón de nombre con al menos 2 meses restantes mantiene la animación de rango sin importar el puesto."
        ],
        [
          "Rankings Global desde NotMeter 1.0.279",
          "Los rankings Global de mazmorras y del muñeco de 1 minuto por tramos de 25K CP, los puestos y porcentajes tras el combate y los efectos de rango y nombre del tramo actual son compatibles desde NotMeter 1.0.279. Actualiza a la última versión si usas una anterior."
        ]
      ],
      "history": "Se usan los registros válidos conservados del sistema anterior y los recibidos desde el cambio. No se pueden recuperar registros ya descartados. Las actualizaciones del juego pueden cambiar las mazmorras compatibles y el CP mínimo. Las reglas KR/TW no cambian.",
      "effectTitle": "Bordes de rango y efectos de nombre",
      "effectUse": "Los beneficios solo corresponden al rango semanal de tu tramo de CP actual. Tras la publicación y la confirmación de elegibilidad en NotMeter, elige y guarda un efecto disponible en Ajustes → Efectos de nombre. La estimación tras el combate no lo desbloquea. Salir del TOP5 o el reinicio semanal termina el derecho TOP5, pero conserva las ventajas independientes de los cupones. No cambia tu selección ni su fecha de vencimiento. Activa los indicadores de rango para ver los bordes.",
      "guideTitle": "Guía de efectos de rango Global",
      "guideIntro": "Disponible desde la versión 279. Actualiza NotMeter si usas una versión anterior. Los beneficios solo corresponden al rango semanal de tu tramo de CP actual. Mazmorras y muñeco de 1 minuto: TOP5 semanal por tramo con animación; puestos 6–20 con borde estático. Los cupones son independientes.",
      "timingTitle": "¿Cuándo se actualizan puestos y efectos?",
      "shareTitle": "Elegir un efecto y mostrarlo a otros",
      "share": "Tras guardar un efecto disponible, otros usuarios necesitan recibir la actualización y activar los efectos de otros personajes. Este tiempo es distinto de la espera de clasificación y elegibilidad. Las ventajas válidas de cupones y elogios se mantienen por separado.",
      "dummyTitle": "El muñeco de 1 minuto usa las mismas reglas",
      "dummy": "Los registros válidos completos de 60 segundos se comparan por clase y tramo de 25K, de 150K a menos de 1000K CP, con TOP20 y porcentajes. Los puestos semanales 1–5 dan animación y efectos de nombre; 6–20, borde estático. Un cupón con al menos 2 meses restantes da animación independientemente del rango.",
      "animatedTitle": "Puestos semanales 1–5 · Animación",
      "animatedBody": "La luz recorre el marco dorado. Un cupón con al menos 2 meses restantes también concede esta animación sin importar el rango.",
      "staticTitle": "Puestos semanales 6–20 · Borde estático",
      "staticBody": "Los puestos 6–10 tienen borde azul claro; los 11–20, violeta, sin animación. La elegibilidad independiente de un cupón tiene prioridad y mantiene la animación.",
      "dungeons": "Contenido Global compatible",
      "dismiss": "No volver a mostrar",
      "reopen": "Volver a la guía de clasificación Global",
      "saved": "Se guarda solo en este navegador. Puedes reabrir la guía después de ocultarla.",
      "failed": "No se pudo guardar la preferencia. La guía puede reaparecer en la próxima visita."
    },
    "pt-BR": {
      "lossTitle": "Os benefícios valem só para a posição semanal da sua faixa de CP atual",
      "loss": "A posição de outra faixa de CP não é transferida, mesmo para o mesmo personagem e classe. TOP5 semanal em qualquer chefe compatível na faixa atual concede animação e efeitos de nome. Sem essa condição, eles terminam: posições semanais 6–20 têm apenas borda estática; a partir de 21 ou sem posição, nenhuma borda de ranking. Cupons continuam independentes.",
      "faqTitle": "Dúvidas sobre mudanças nos efeitos",
      "faq": [
        [
          "O que acontece ao passar de 170K para 180K?",
          "170K pertence a 150K–abaixo de 175K. Mesmo sendo 3.º semanal ali, ao chegar a 180K você entra em 175K–abaixo de 200K: a animação e os efeitos de nome do antigo 3.º lugar não são transferidos. Na nova faixa, posições semanais 1–5 dão efeitos, 6–20 só borda estática e 21 ou sem posição nenhum benefício de ranking. Exatamente 175K já inicia a nova faixa; reduzir CP segue a mesma regra. Os registros antigos ficam na faixa original. Cupons são separados."
        ],
        [
          "Reduzir CP restaura os efeitos da faixa antiga?",
          "Sim, após reconhecer os novos CP, se o TOP5 semanal da faixa para a qual voltou ainda for válido. Posição da semana passada ou fora do TOP5 não basta. O servidor usa os últimos CP enviados pelo medidor. A troca visual imediata após mudar equipamento exige a atualização compatível."
        ],
        [
          "O que acontece se eu cair do 5º para o 6º lugar?",
          "Após a publicação e a verificação dos direitos, a animação e os efeitos de nome exclusivos do TOP5 são desativados. As posições 6–20 têm borda estática. Outros direitos TOP5 ou cupons são independentes. Ganhar um efeito uma vez não o torna permanente."
        ],
        [
          "Por que meu 1º lugar de todos os tempos não dá efeito?",
          "Vale a posição semanal do chefe, classe e faixa de 25K originais. Ser primeiro de todos os tempos ou na visão Todos os CP / Todos os chefes não basta. Direitos de outros personagens ou classes não são transferidos."
        ],
        [
          "O que significam a posição e o top % após o combate?",
          "O DPS daquele combate é comparado aos últimos dados publicados de todo o período para o mesmo chefe, classe e faixa de 25K CP durante o combate. Se coincidir com um recorde pessoal publicado no TOP20, aparece a posição na faixa; caso contrário, um top % comparável. Top 10% é melhor que top 80%; não é sua parcela do dano do grupo. A indicação não confirma o registro nem libera benefícios semanais TOP5. Eles dependem do cálculo, publicação e verificação."
        ],
        [
          "Por que minha indicação é diferente da dos colegas?",
          "Com dados comparáveis, você vê seu próprio top 50% ou 80%, mesmo fora do TOP20. A partir da versão 279, colegas aparecem com posição TOP20 publicada OU dentro do top 10%. TOP20 é uma condição separada; percentuais sem posição dos colegas só aparecem até 10%. Ausência de indicação não significa falha no envio nem dano zero. Ative também a exibição após o combate."
        ],
        [
          "Por que falta uma comparação ou ela difere do site?",
          "Pode não haver estatísticas equivalentes, elas podem ainda não estar publicadas ou não terem sido carregadas. O intervalo vai de 150K até abaixo de 1000K. Após o combate, usam-se seu DPS, CP daquele momento e todo o período; o site usa chefe, CP e período selecionados e o recorde pessoal. Todos os chefes / Todos os CP também não define os efeitos. Confira condições e horário da atualização."
        ],
        [
          "O site mostra TOP5, mas não aparece o efeito",
          "Envio, publicação e verificação pelo medidor acontecem em sequência. Confira o horário e a posição semanal, salve um efeito de nome e ative os indicadores de ranking. Os outros também precisam permitir efeitos de outros personagens. Disponível a partir da versão 279. Atualize o NotMeter se estiver usando uma versão anterior."
        ],
        [
          "O reinício semanal apaga registros e o efeito escolhido?",
          "O direito obtido na semana anterior termina; é preciso se qualificar com registros desta semana. Registros de todos os tempos, escolha salva e vencimento do cupom permanecem. Sem outro direito válido, o efeito não será exibido."
        ],
        [
          "Perder posições remove a animação do cupom?",
          "Um cupom de nome com pelo menos 2 meses restantes mantém a animação independentemente da posição. Vale o prazo restante, não a duração original. Abaixo de 2 meses, esse benefício de animação termina, mas o cupom não vence imediatamente. Um TOP5 semanal válido ainda pode conceder a animação de ranking."
        ]
      ],
      "title": "Como funciona o ranking Global",
      "intro": "Disponível a partir da versão 279. Atualize o NotMeter se estiver usando uma versão anterior. Compare seu melhor DPS com o mesmo chefe, classe e condições de CP. As masmorras compatíveis e o boneco de 1 minuto usam as mesmas faixas de 25K CP.",
      "items": [
        [
          "Escolha a faixa do CP durante o combate",
          "Valem registros de 150K até menos de 1000K CP, em passos de 25K. K significa 1.000. Por exemplo, 162K entra em 150K–menos de 175K. A última faixa é 975K–menos de 1000K."
        ],
        [
          "O que acontece ao passar de 170K para 180K?",
          "170K pertence a 150K–abaixo de 175K. Mesmo sendo 3.º semanal ali, ao chegar a 180K você entra em 175K–abaixo de 200K: a animação e os efeitos de nome do antigo 3.º lugar não são transferidos. Na nova faixa, posições semanais 1–5 dão efeitos, 6–20 só borda estática e 21 ou sem posição nenhum benefício de ranking. Exatamente 175K já inicia a nova faixa; reduzir CP segue a mesma regra. Os registros antigos ficam na faixa original. Cupons são separados."
        ],
        [
          "Uma melhor marca por personagem",
          "Só conta o melhor DPS por chefe, classe, faixa e período. Um resultado superior substitui o anterior. Repetir resultados inferiores não ocupa outras posições nem aumenta o número de participantes."
        ],
        [
          "TOP20 e melhores 10% / 25% são diferentes",
          "TOP20 mostra até 20 personagens e os detalhes de combate disponíveis. Fora do TOP20, o melhor DPS ainda entra nas estatísticas. Os valores dos melhores 10% e 25% são limites de DPS entre personagens comparáveis, não porcentagens de todos os combates enviados."
        ],
        [
          "O que significam a posição e o top % após o combate?",
          "O DPS daquele combate é comparado aos últimos dados publicados de todo o período para o mesmo chefe, classe e faixa de 25K CP durante o combate. Se coincidir com um recorde pessoal publicado no TOP20, aparece a posição na faixa; caso contrário, um top % comparável. Top 10% é melhor que top 80%; não é sua parcela do dano do grupo. A indicação não confirma o registro nem libera benefícios semanais TOP5. Eles dependem do cálculo, publicação e verificação."
        ],
        [
          "Visão geral e ranking semanal",
          "Por padrão, são selecionados todos os CPs e chefes. A visão conjunta também usa apenas o maior DPS de cada personagem, sem somar DPS de chefes diferentes. Os recordes gerais permanecem. A semana reinicia na terça-feira às 23:30 em America/Los_Angeles. A página converte para o fuso do PC, com diferença GMT e horário de verão."
        ],
        [
          "Aguarde a atualização depois do envio",
          "Um envio bem-sucedido não muda a posição imediatamente. Global é calculado junto com KR/TW. Atualmente, o próximo cálculo começa 30 minutos após o fim da publicação; cálculo e publicação levam tempo adicional. Com alta demanda, a espera pode aumentar. Confira o horário de atualização na página. Recarregar não inicia um novo cálculo."
        ],
        [
          "TOP5 semanal: animação; posições 6–20: borda estática",
          "As posições semanais publicadas 1–5 por chefe compatível, classe e faixa de 25K recebem o efeito de ranking animado e todos os efeitos de nome. As posições 6–20 mostram apenas a borda estática existente; a partir da 21ª não há borda de ranking. O boneco de 1 minuto segue as mesmas regras. Apenas a posição geral não concede esses benefícios semanais. Vale a faixa original, não a posição na visão de todos os CPs ou chefes. Separadamente, um cupom de nome com pelo menos 2 meses restantes mantém a animação de ranking, independentemente da posição."
        ],
        [
          "Rankings Global a partir do NotMeter 1.0.279",
          "Os rankings Global de masmorras e do boneco de 1 minuto por faixas de 25K CP, as posições e percentuais após o combate e os efeitos de ranking e nome da faixa atual são compatíveis a partir do NotMeter 1.0.279. Atualize versões antigas para a versão mais recente."
        ]
      ],
      "history": "São usados registros válidos mantidos pelo sistema anterior e recebidos após a mudança. Registros já descartados não podem ser recuperados. Atualizações do jogo podem alterar as masmorras compatíveis e o CP mínimo. As regras KR/TW não mudam.",
      "effectTitle": "Bordas de ranking e efeitos de nome",
      "effectUse": "Os benefícios valem só para a posição semanal da sua faixa de CP atual. Após a publicação e a confirmação da elegibilidade pelo NotMeter, escolha e salve um efeito disponível em Configurações → Efeitos de nome. A estimativa após o combate não o desbloqueia. Sair do TOP5 ou o reinício semanal encerra o direito TOP5, mas preserva benefícios separados de cupons. A seleção e o vencimento dos cupons não mudam. Ative os indicadores de ranking para ver as bordas.",
      "guideTitle": "Entenda os efeitos de ranking Global",
      "guideIntro": "Disponível a partir da versão 279. Atualize o NotMeter se estiver usando uma versão anterior. Os benefícios valem só para a posição semanal da sua faixa de CP atual. Masmorras e boneco de 1 minuto: TOP5 semanal da faixa com animação; posições 6–20 com borda estática. Cupons têm benefícios separados.",
      "timingTitle": "Quando posições e efeitos são atualizados?",
      "shareTitle": "Escolher um efeito e mostrá-lo aos outros",
      "share": "Depois de salvar um efeito disponível, outros usuários precisam receber a atualização e habilitar os efeitos de outros personagens. Isso é separado da espera pelo ranking e pela elegibilidade. Vantagens válidas de cupons e elogios continuam independentes.",
      "dummyTitle": "O boneco de 1 minuto usa as mesmas regras",
      "dummy": "Registros válidos completos de 60 segundos são comparados por classe e faixa de 25K, de 150K até menos de 1000K CP, com TOP20 e porcentagens. Posições semanais 1–5 recebem animação e efeitos de nome; 6–20, borda estática. Cupons com pelo menos 2 meses restantes dão animação independentemente da posição.",
      "animatedTitle": "Posições semanais 1–5 · Animação",
      "animatedBody": "A luz percorre a moldura dourada. Um cupom com pelo menos 2 meses restantes também concede esta animação, independentemente da posição.",
      "staticTitle": "Posições semanais 6–20 · Borda estática",
      "staticBody": "Posições 6–10 usam borda azul-clara; 11–20, roxa, sem animação. A elegibilidade separada por cupom tem prioridade e mantém a animação.",
      "dungeons": "Conteúdo Global compatível",
      "dismiss": "Não mostrar novamente",
      "reopen": "Reabrir o guia de ranking Global",
      "saved": "Salvo apenas neste navegador. Você pode reabrir o guia depois de ocultá-lo.",
      "failed": "Não foi possível salvar a preferência. O guia pode aparecer na próxima visita."
    },
    "ru-RU": {
      "lossTitle": "Бонусы зависят только от недельного места в текущем диапазоне CP",
      "loss": "Место из другого диапазона CP не переносится, даже для того же персонажа и класса. Недельный TOP5 на любом поддерживаемом боссе в текущем диапазоне даёт ранговую анимацию и эффекты имени. Без этого права они отключаются: недельные места 6–20 дают только статичную рамку, место 21 и ниже или отсутствие места — без ранговой рамки. Купоны действуют отдельно.",
      "faqTitle": "Вопросы об изменении эффектов",
      "faq": [
        [
          "Что будет при переходе с 170K на 180K?",
          "170K относится к диапазону от 150K до 175K не включительно. Даже с недельным 3-м местом при 180K вы переходите в диапазон от 175K до 200K не включительно: эффекты имени и анимация старого 3-го места не сохраняются. В новом диапазоне недельные места 1–5 дают эффекты, 6–20 — только статичную рамку, 21 и ниже или отсутствие места — без ранговых бонусов. Ровно 175K уже начинает новый диапазон; снижение CP работает так же. Старые рекорды остаются в своём диапазоне и не переносятся. Купоны независимы."
        ],
        [
          "Вернутся ли старые эффекты при снижении CP?",
          "Да, после распознавания новых CP, если в диапазоне, куда вы вернулись, ещё действует недельный TOP5. Место прошлой недели или уже вне TOP5 не подходит. Сервер использует последние CP, отправленные приложением. Мгновенная смена отображения после смены экипировки требует совместимого обновления."
        ],
        [
          "Что произойдёт при переходе с 5-го места на 6-е?",
          "После публикации и проверки прав анимация и эффекты имени TOP5 отключаются. Места 6–20 показывают статичную рамку. Другие действующие права TOP5 или купоны независимы. Полученный однажды эффект не становится постоянным."
        ],
        [
          "Почему первое место за всё время не даёт эффект?",
          "Учитывается недельное место исходного босса, класса и диапазона 25K. Первого места за всё время или в общем виде всех CP/боссов недостаточно. Права других персонажей и классов не переносятся."
        ],
        [
          "Что означают место и верхние % после боя?",
          "DPS этого боя сравнивается с последними опубликованными данными за всё время для того же босса, класса и диапазона 25K CP во время боя. Если бой совпадает с опубликованным личным рекордом TOP20, показано место в диапазоне; иначе — доступное сравнение в процентах. Верхние 10% лучше верхних 80%; это не доля урона группы. Показатель не подтверждает регистрацию и не открывает недельные бонусы TOP5. Для них нужны расчёт, публикация и проверка прав."
        ],
        [
          "Почему отображение для меня и группы различается?",
          "При наличии данных вы видите собственные верхние 50% или 80% и вне TOP20. NotMeter начиная с версии 279 показывает участника группы при опубликованном месте TOP20 ИЛИ попадании в верхние 10%. TOP20 — отдельное условие; проценты участников без места показываются только до 10%. Отсутствие значка не означает ошибку отправки или нулевой урон. Включите отображение рейтинга после боя."
        ],
        [
          "Почему сравнения нет или оно отличается от сайта?",
          "Подходящих данных может ещё не быть, они могут ожидать публикации или не загрузиться. Поддерживается от 150K до 1000K не включительно. После боя используются его DPS, тогдашние CP и данные за всё время; сайт использует выбранные босса, CP, период и личный рекорд. Порядок Все боссы / Все CP тоже не определяет право на эффекты. Сверьте условия и время обновления."
        ],
        [
          "Сайт показывает TOP5, но эффекта нет",
          "Отправка, публикация и проверка в счётчике происходят последовательно. Проверьте время публикации и недельное место, сохраните эффект имени и включите ранговые индикаторы. Другие игроки тоже должны разрешить чужие эффекты. Поддерживается с версии 279. Если у вас более старая версия, обновите NotMeter."
        ],
        [
          "Недельный сброс удаляет рекорды и выбранный эффект?",
          "Право за прошлую неделю истекает; нужно снова пройти по результатам текущей. Рекорды за всё время, сохранённый выбор и срок купона остаются. Без другого действительного права эффект не показывается."
        ],
        [
          "Падение в рейтинге убирает анимацию купона?",
          "Купон имени с остатком срока не менее 2 месяцев сохраняет анимацию независимо от места. Важен оставшийся, а не исходный срок. При остатке менее 2 месяцев прекращается эта анимация, но сам купон сразу не истекает. Действительный недельный TOP5 всё ещё может давать ранговую анимацию."
        ]
      ],
      "title": "Как устроен глобальный рейтинг",
      "intro": "Поддерживается с версии 279. Если у вас более старая версия, обновите NotMeter. Сравнивайте лучший DPS при одинаковом боссе, классе и близком CP. Поддерживаемые подземелья и минутный манекен используют одинаковые диапазоны по 25K CP.",
      "items": [
        [
          "Выберите CP во время боя",
          "Учитываются записи от 150K включительно до 1000K не включительно с шагом 25K. K означает 1 000. Например, 162K относится к 150K–ниже 175K. Последний диапазон — 975K–ниже 1000K."
        ],
        [
          "Что будет при переходе с 170K на 180K?",
          "170K относится к диапазону от 150K до 175K не включительно. Даже с недельным 3-м местом при 180K вы переходите в диапазон от 175K до 200K не включительно: эффекты имени и анимация старого 3-го места не сохраняются. В новом диапазоне недельные места 1–5 дают эффекты, 6–20 — только статичную рамку, 21 и ниже или отсутствие места — без ранговых бонусов. Ровно 175K уже начинает новый диапазон; снижение CP работает так же. Старые рекорды остаются в своём диапазоне и не переносятся. Купоны независимы."
        ],
        [
          "Один лучший результат персонажа",
          "Для каждого босса, класса, диапазона и периода учитывается только лучший DPS. Более высокий результат заменяет его. Повторные низкие результаты не занимают дополнительные места и не увеличивают число участников."
        ],
        [
          "TOP20 и лучшие 10% / 25% — разные показатели",
          "TOP20 показывает до 20 персонажей и доступные подробности боя. Лучший DPS персонажей вне TOP20 тоже участвует в статистике. Значения лучших 10% и 25% — пороги DPS для персонажей в одинаковых условиях, а не доли всех отправленных боёв."
        ],
        [
          "Что означают место и верхние % после боя?",
          "DPS этого боя сравнивается с последними опубликованными данными за всё время для того же босса, класса и диапазона 25K CP во время боя. Если бой совпадает с опубликованным личным рекордом TOP20, показано место в диапазоне; иначе — доступное сравнение в процентах. Верхние 10% лучше верхних 80%; это не доля урона группы. Показатель не подтверждает регистрацию и не открывает недельные бонусы TOP5. Для них нужны расчёт, публикация и проверка прав."
        ],
        [
          "Общий вид и недельный рейтинг",
          "По умолчанию выбраны все CP и все боссы. Общий вид тоже использует один максимальный DPS персонажа, не складывая DPS разных боссов. Рекорды за всё время сохраняются. Неделя начинается заново во вторник в 23:30 по America/Los_Angeles. Страница переводит время в часовой пояс ПК с разницей GMT и учётом летнего времени."
        ],
        [
          "После отправки дождитесь обновления",
          "Успешная отправка не меняет место сразу. Global рассчитывается вместе с KR/TW. Сейчас следующий расчёт начинается через 30 минут после завершения публикации; расчёт и публикация требуют дополнительного времени. При большой нагрузке ожидание увеличивается. Проверяйте время обновления на странице. Перезагрузка страницы не запускает расчёт."
        ],
        [
          "Недельный TOP5: анимация; места 6–20: статичная рамка",
          "Опубликованные недельные места 1–5 по поддерживаемому боссу, классу и диапазону 25K дают анимированный ранговый эффект и все эффекты имени. Места 6–20 показывают только прежнюю статичную рамку; с 21-го места ранговой рамки нет. Для минутного манекена правила те же. Одного места за всё время недостаточно для недельных наград. Учитывается недельное место в исходном диапазоне, а не общий вид всех CP или боссов. Отдельно купон имени с остатком срока не менее 2 месяцев даёт ранговую анимацию независимо от места."
        ],
        [
          "Глобальный рейтинг с NotMeter 1.0.279",
          "Глобальные рейтинги подземелий и минутного манекена по диапазонам 25K CP, места и проценты после боя, ранговые эффекты и эффекты имени для текущего диапазона CP поддерживаются с NotMeter 1.0.279. Пользователям старых версий необходимо обновиться до последней версии."
        ]
      ],
      "history": "Используются сохранившиеся действительные записи старой системы и записи, полученные после изменения. Ранее удалённые данные восстановить нельзя. Обновления игры могут менять поддерживаемые подземелья и минимальный CP. Правила KR/TW не меняются.",
      "effectTitle": "Ранговые рамки и эффекты имени",
      "effectUse": "Бонусы зависят только от недельного места в текущем диапазоне CP. После публикации и подтверждения права в NotMeter выберите и сохраните доступный эффект в Настройки → Эффекты имени. Оценка сразу после боя его не открывает. Выход из TOP5 или недельный сброс прекращает право TOP5, но не отдельные преимущества купонов. Выбор и срок купона не меняются. Для отображения рамок включите ранговые индикаторы.",
      "guideTitle": "Глобальные ранговые эффекты",
      "guideIntro": "Поддерживается с версии 279. Если у вас более старая версия, обновите NotMeter. Бонусы зависят только от недельного места в текущем диапазоне CP. Подземелья и минутный манекен: недельный TOP5 диапазона с анимацией, места 6–20 со статичной рамкой. Купоны действуют отдельно.",
      "timingTitle": "Когда обновляются места и эффекты?",
      "shareTitle": "Выбор эффекта и отображение у других",
      "share": "После сохранения доступного эффекта другим пользователям нужно получить обновление и включить отображение эффектов чужих персонажей. Это отдельное ожидание от публикации рейтинга и проверки прав. Действующие купоны и награды рейтинга похвалы сохраняются независимо.",
      "dummyTitle": "Те же правила для минутного манекена",
      "dummy": "Действительные завершённые 60-секундные записи сравниваются по классу и диапазону 25K, от 150K до 1000K не включительно, с TOP20 и процентами. Недельные места 1–5 дают ранговую анимацию и эффекты имени; 6–20 — статичную рамку. Купон с остатком срока не менее 2 месяцев даёт анимацию независимо от места.",
      "animatedTitle": "Недельные места 1–5 · Анимация",
      "animatedBody": "Свет движется по золотой рамке. Купон с остатком срока не менее 2 месяцев тоже даёт эту анимацию независимо от места.",
      "staticTitle": "Недельные места 6–20 · Статичная рамка",
      "staticBody": "Места 6–10 отмечаются голубой, 11–20 — фиолетовой рамкой без анимации. Отдельное право по купону имеет приоритет и сохраняет анимацию.",
      "dungeons": "Поддерживаемый контент Global",
      "dismiss": "Больше не показывать",
      "reopen": "Открыть руководство по глобальному рейтингу",
      "saved": "Сохранено только в этом браузере. Скрытое описание можно открыть снова.",
      "failed": "Не удалось сохранить настройку. При следующем посещении описание может появиться снова."
    }
  });
  let dismissed = false, saved = true;
  try { dismissed = localStorage.getItem(key) === "hidden"; } catch { saved = false; }
  function sync(locale, active) {
    const host = document.getElementById("global-cp-notice");
    if (!host) return;
    host.hidden = !active;
    if (!active) return;
    const text = copy[locale] || copy.en;
    host.classList.toggle("is-dismissed", dismissed);
    host.setAttribute("aria-labelledby", dismissed ? "global-cp-notice-reopen" : "global-cp-notice-title");
    const button = document.createElement("button");
    button.type = "button";
    button.id = dismissed ? "global-cp-notice-reopen" : "global-cp-notice-dismiss";
    button.textContent = dismissed ? text.reopen : text.dismiss;
    button.addEventListener("click", () => {
      dismissed = !dismissed;
      try { if (dismissed) localStorage.setItem(key, "hidden"); else localStorage.removeItem(key); saved = true; } catch { saved = false; }
      sync(locale, true);
      host.querySelector("button")?.focus();
    });
    const note = document.createElement("small");
    note.textContent = saved ? text.saved : text.failed;
    if (dismissed) { host.replaceChildren(button, note); return; }
    const title = document.createElement("h2");
    title.id = "global-cp-notice-title";
    title.textContent = text.title;
    const intro = document.createElement("p");
    intro.textContent = text.intro;
    const loss = document.createElement("div"), lossTitle = document.createElement("strong"), lossBody = document.createElement("p");
    loss.className = "global-ranker-loss";
    lossTitle.textContent = text.lossTitle;
    lossBody.textContent = text.loss;
    loss.append(lossTitle, lossBody);
    const list = document.createElement("ol");
    for (const [heading, body] of text.items) {
      const item = document.createElement("li"), strong = document.createElement("strong");
      strong.textContent = heading;
      item.append(strong, document.createTextNode(body));
      list.append(item);
    }
    const history = document.createElement("p");
    history.textContent = text.history;
    host.replaceChildren(title, intro, loss, list, history, button, note);
  }
  const clientNote = locale => (copy[locale] || copy.en).items[8][1];
  globalThis.NotMeterGlobalCpNotice = { sync, clientNote, copy };
})();
