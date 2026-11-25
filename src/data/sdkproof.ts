/**
 * “자체 SDK의 성능 증명” — 리벨리온 SDK가 이미 제공하는 것, 지금의 검증 방식, 공개된 도입 사례,
 * 그리고 이 사이트가 제안하는 공개 실증 프로그램(의견)을 구분해 담습니다.
 */
import type { ClaimKind } from './meta';

export interface SdkPart {
  name: string;
  does: string;
  meaning: string;
  src: string[];
}

export const sdkParts: SdkPart[] = [
  { name: 'RBLN (AI) Compiler', does: 'PyTorch·TensorFlow 모델을 NPU용으로 변환·최적화', meaning: '모델을 처음부터 다시 만들 필요를 줄임', src: ['rbln-quickstart'] },
  { name: 'RBLN Runtime', does: '변환된 모델을 NPU에서 실행', meaning: '기존 실행 코드를 RBLN API로 바꾸는 과정이 필요할 수 있음', src: ['rbln-quickstart'] },
  { name: 'Optimum RBLN', does: 'Hugging Face 모델의 컴파일·추론 지원', meaning: '지원 모델은 준비된 연동 경로로 옮길 수 있음', src: ['rbln-quickstart', 'rbln-optimum-pypi'] },
  { name: 'vLLM 연동', does: 'LLM을 서버로 실행하고 OpenAI 호환 API 제공', meaning: '기존 서비스와 연결하기 쉽게 지원', src: ['rbln-vllm-doc', 'rbln-quickstart'] },
];

export interface Fact { text: string; claim: ClaimKind; src: string[] }

/** 지금 리벨리온이 검증하는 방식 (공개 자료 기준) */
export const currentWays: { title: string; body: string; facts: Fact[] }[] = [
  {
    title: '고객사와 일대일로 실증(PoC)',
    body: '리벨리온 엔지니어가 고객팀과 함께 고객의 실제 작업을 돌려 보고 검증합니다.',
    facts: [
      { text: '사우디 아람코 SAIL에 랙 단위 서버를 납품하고, 현장에서 기술 세션을 진행하며 ATOM 기반 서버로 PoC를 진행 중이라고 발표(2025년 4월 당시)', claim: 'claim', src: ['rbln-aramco-li'] },
    ],
  },
  {
    title: '개발자 질문·문제 제보 창구',
    body: '공식 개발자 포럼과 SDK 문서를 운영합니다. 다만 정기 설문을 하거나, 받은 의견이 SDK 개선으로 이어지는 과정을 공개하지는 않습니다.',
    facts: [
      { text: '공식 개발자 포럼(discuss.rebellions.ai)과 RBLN SDK 문서(docs.rbln.ai) 운영', claim: 'fact', src: ['rbln-forum', 'rbln-quickstart'] },
      { text: '핵심 컴파일러(rebel-compiler)는 RBLN Portal 계정이 있는 승인된 사용자만 받을 수 있음', claim: 'fact', src: ['rbln-optimum-pypi', 'rbln-quickstart'] },
    ],
  },
];

export const compareRows: { item: string; now: string; proposal: string }[] = [
  { item: '참여 방식', now: '고객·파트너와 개별 실증', proposal: '공개 모집으로 참여 기업 확대' },
  { item: '기술 검증', now: '고객의 실제 모델을 함께 테스트', proposal: '같은 기준으로 이전 난이도까지 측정' },
  { item: '피드백', now: '현장 기술 논의, 포럼·지원 문의', proposal: '설문·인터뷰와 작업 기록을 함께 수집' },
  { item: '참여 보상', now: '지급 여부·조건 확인 불가', proposal: '참여 비용·사례비 지원' },
  { item: '결과 공개', now: '실증·도입 사례 공개', proposal: '수정량·작업 시간·실패 사례까지 공개' },
];

/** 공개된 실증 → 상용 사례 (SK텔레콤) */
export const sktTimeline: { when: string; title: string; stage: '실증' | '상용' | '확대'; body: string; claim: ClaimKind; src: string[] }[] = [
  {
    when: '2025.6',
    title: 'SKT 주요 AI 서비스에 ATOM 서버 테스트',
    stage: '실증',
    body: '에이닷 전화 통화요약, PASS 스팸필터링, PASS 금융비서, 엑스칼리버에 ATOM 서버를 테스트 중이라고 발표했습니다. 목표는 연내 ATOM-Max 상용 적용이었습니다.',
    claim: 'fact',
    src: ['skt-rbln-pilot-pr', 'kt-skt-pilot'],
  },
  {
    when: '2025.12',
    title: '첫 상용 적용',
    stage: '상용',
    body: '에이닷 통화요약의 ‘관계추정’ 기능에 ATOM-Max 서버가 처음 상용 적용됐습니다. 같은 달 리벨리온 측 인터뷰에서는 반려동물 영상진단 보조 서비스 엑스칼리버가 NVIDIA GPU에서 ATOM 기반 인프라로 전환해 상용 운영 중이라고 밝혔습니다.',
    claim: 'claim',
    src: ['rbln-skt-14m', 'skt-rbln-interview'],
  },
  {
    when: '2026.9',
    title: 'SKT 4개 AI 서비스로 적용 확대',
    stage: '확대',
    body: '에이닷 통화요약(한 줄 요약)·음성합성, AI 고객센터 상담 후처리, 스캠뱅가드 미끼문자 탐지 기능에 적용해, 합산 하루 약 1,400만 건(토큰 40억 개 이상)의 AI 요청을 처리한다고 발표했습니다.',
    claim: 'claim',
    src: ['rbln-skt-14m', 'rcr-skt'],
  },
];

export const sktCaveats: string[] = [
  '서비스 전체를 리벨리온 칩으로 바꾼 것이 아닙니다. SKT는 기능별로 GPU와 NPU를 골라 배치하고, NPU 수십 대를 묶은 공용 풀(NPU 팜)로 운영한다고 설명합니다.',
  '처리량(하루 1,400만 건)은 리벨리온 보도자료의 수치이며 독립 검증은 없습니다. 엑스칼리버 전환은 리벨리온 임원 인터뷰 내용으로, SKT 뉴스룸은 “SK텔레콤의 공식 입장과 다를 수 있다”고 밝혀 두었습니다.',
  '이 자료들은 “실제 서비스에서 돌아간다”는 근거입니다. 개발자가 코드를 얼마나 고쳤는지, 옮기는 데 몇 시간이 걸렸는지 같은 이전 난이도 수치는 공개되지 않았습니다.',
];

/** 이 사이트의 제안 (의견) */
export const proposal = {
  name: '비용 지원형 공개 실증 프로그램',
  idea: '광고로 참여 기업을 공개 모집해 실제 모델 이전을 함께 실험·검증하고, 리벨리온은 참여 기업에 사례비를 지원합니다. 그 과정에서 개발자 설문·인터뷰로 SDK의 부족한 점을 찾아 개선합니다.',
  gains: [
    '리벨리온: SDK 개선에 필요한 실제 데이터를 얻고, “옮기기 쉽다”는 주장을 숫자로 증명',
    '참여 기업: 비용 부담 없이 새 칩을 시험해 보고 도입 여부를 판단',
  ],
  steps: [
    { step: '① 모집·선정', how: '실제 서비스 모델이 있는 기업을 고르고, 표준 모델과 자체 수정 모델을 구분', learn: '어떤 고객에게 SDK가 잘 맞는지' },
    { step: '② 자체 이전', how: '문서와 SDK만으로 먼저 시도하고, 지원을 요청한 시점을 기록', learn: '고객이 혼자 어디까지 할 수 있는지' },
    { step: '③ 지원 후 재시험', how: '리벨리온 엔지니어가 지원하고, 투입한 작업량을 기록', learn: '수동 지원이 필요한 부분' },
    { step: '④ 설문·인터뷰', how: '어려웠던 단계, 오류 메시지, 문서의 빈틈을 질문', learn: '왜 어려웠고 무엇을 고쳐야 하는지' },
    { step: '⑤ 개선 후 재검증', how: '같은 모델로 다시 시험하고, 처음 접하는 개발자도 참여', learn: '개선 효과가 실제로 있는지' },
  ],
  metrics: ['첫 실행까지 걸린 시간', '코드 수정량', '지원 요청 횟수', '리벨리온 측 지원 시간', '정확도·안정성'],
  tool: {
    name: '이전 난이도 자동 기록 도구',
    why: '기업마다 사람이 손으로 기록하면 기준이 흔들리고 빠지는 값이 생깁니다. 시험 과정에서 지표를 자동으로 남기는 도구를 함께 만들면 모든 참여 기업을 같은 기준으로 비교할 수 있고, 프로그램이 끝난 뒤에도 SDK 새 버전마다 다시 돌려 볼 수 있습니다.',
    gap: '칩 성능을 재는 공개 벤치마크(MLPerf 등)는 있지만, “다른 칩으로 옮기기가 얼마나 쉬운가”를 같은 기준으로 재는 공개 도구는 이번 조사에서 찾지 못했습니다.',
    rows: [
      { metric: '코드 수정량', level: 'auto' as const, how: '원본 GPU 코드 커밋과 이전 완료 커밋을 자동 비교 (git diff)' },
      { metric: '정확도', level: 'auto' as const, how: '같은 입력을 GPU·NPU에 넣고 결과 차이를 계산 (lm-evaluation-harness 등)' },
      { metric: '안정성', level: 'auto' as const, how: '정해진 시간 동안 부하를 걸고 오류율·응답 지연 기록 (vLLM 벤치마크, Prometheus)' },
      { metric: '첫 실행까지 걸린 시간', level: 'semi' as const, how: '설치·컴파일·첫 추론 성공 시각을 도구가 기록 (참여 기업 동의 필요)' },
      { metric: '지원 요청 횟수', level: 'semi' as const, how: '티켓 시스템 API에서 기업별 문의 건수를 가져옴' },
      { metric: '리벨리온 측 지원 시간', level: 'manual' as const, how: '엔지니어가 티켓별 작업 시간을 입력하면 도구가 합산' },
      { metric: '개발자 체감 난이도', level: 'manual' as const, how: '마지막 단계에 표준 사용성 설문(SUS)을 도구 안에서 응답' },
    ],
    flow: [
      '참여 기업이 원래 GPU 코드와 모델을 등록',
      'SDK로 이전하는 동안 단계별 성공 시각 자동 기록',
      '이전이 끝나면 버튼 하나로 코드 수정량·정확도·부하 테스트 실행',
      '지원 기록·설문을 붙여 기업별 리포트 한 장 생성',
      '전체 리포트를 모아 잘 옮겨지는 모델과 막히는 지점 파악',
    ],
    cautions: [
      '리벨리온이 만든 도구로 리벨리온 SDK를 재는 구조이므로, 측정 코드와 기준을 공개하거나 대학·제3기관 검증을 받아야 결과를 믿을 수 있습니다.',
      '“첫 실행”, “이전 완료”의 정의를 미리 정해야 기업마다 숫자의 의미가 같아집니다.',
      '코드 수정량만 줄이려고 기능을 빼는 일이 없도록 정확도와 함께 봅니다.',
    ],
  },
  cautions: [
    '보상과 평가를 분리: 이전에 실패하거나 부정적 의견을 내도 약속한 보상은 그대로 지급해야 솔직한 피드백이 나옵니다.',
    '보상 형태는 현금 외에 테스트 장비·클라우드 사용권·참여 엔지니어 작업비 지원도 가능합니다.',
    '지원자가 많다고 기술력이 검증되는 것은 아닙니다. 이미 잘 지원되는 모델만 뽑히면 결과가 부풀려지므로, 선정·성공 기준을 미리 정하고 보상 여부와 실패·중단 사례도 함께 공개해야 합니다.',
  ],
  sentence: '잠재 고객사를 대상으로 비용 지원형 모델 이전 실증 프로그램을 운영한다. 실제 이전 과정의 작업 시간·코드 수정·기술지원 내역과 개발자 설문을 수집하여 SDK를 개선하고, 참여 기업의 동의를 받아 검증 결과를 공개해 도입 불확실성을 낮춘다.',
};
