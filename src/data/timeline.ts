import type { ClaimKind } from './meta';

export type PhaseKind = 'dev' | 'production' | 'adoption';
export const PHASE_LABEL: Record<PhaseKind, string> = {
  dev: '개발 기간',
  production: '생산·납품 기간',
  adoption: '고객 도입 기간',
};

/* ───── 10단계 공정표 ───── */
export interface ProcessStage {
  key: string;
  name: string;
  what: string;
  who: string;
  duration: string;
  durationClaim: ClaimKind;
  durationSrc: string[];
  krVsUs: string;
  delays: string;
  /** 이 단계가 속한 기간 묶음 */
  bucket: PhaseKind;
}

export const processStages: ProcessStage[] = [
  {
    key: 'demand',
    name: '시장 수요 파악',
    what: '어떤 AI 모델을 누가 얼마나 돌릴지 예측해 칩의 목표(추론 전용인지, 메모리를 얼마나 둘지)를 정합니다.',
    who: '팹리스(칩 설계 회사), 잠재 고객사',
    duration: '공개 자료 부족',
    durationClaim: 'unverified',
    durationSrc: [],
    krVsUs: '한국 기업은 통신사·클라우드·공공 등 국내 수요를 첫 고객으로 삼는 경우가 많고, 미국 기업은 대형 클라우드의 다년 선계약으로 수요를 미리 확보합니다.',
    delays: 'AI 모델 트렌드 변화(예: LLM 급부상)로 설계 목표가 바뀜',
    bucket: 'dev',
  },
  {
    key: 'design',
    name: '칩 설계',
    what: '연산 코어·메모리 연결·칩 사이 통로를 회로로 설계합니다. 건물의 설계도면을 그리는 단계에 해당합니다.',
    who: '팹리스 + 디자인하우스(예: SEMIFIVE–리벨리온, GUC–퓨리오사)',
    duration: '공개 자료 부족 — 퓨리오사는 RNGD에 “수년간” 설계·검증했다고 설명',
    durationClaim: 'claim',
    durationSrc: ['furiosa-hotchips', 'semifive-rbln'],
    krVsUs: '설계 역량 자체보다는 인력·예산 규모와 세대 교체 주기에서 차이가 납니다.',
    delays: '사양 변경, 설계 인력 부족',
    bucket: 'dev',
  },
  {
    key: 'verify',
    name: '검증',
    what: '실제로 만들기 전에 컴퓨터 시뮬레이션과 시제품으로 오류를 찾습니다. 한 번 만들면 고치기 어렵기 때문입니다.',
    who: '팹리스, 설계 소프트웨어(EDA) 업체',
    duration: '공개 자료 부족',
    durationClaim: 'unverified',
    durationSrc: [],
    krVsUs: '첫 칩이 나오자마자 작동하면(퓨리오사: 수주 만에 LLM 구동) 이후 일정이 크게 단축됩니다.',
    delays: '버그 발견 시 재설계·재제작',
    bucket: 'dev',
  },
  {
    key: 'fab',
    name: '파운드리 제조',
    what: '설계도를 받아 실리콘 웨이퍼 위에 회로를 새깁니다. 공장(파운드리)은 여러 회사의 주문을 순서대로 생산합니다.',
    who: '파운드리 — 삼성전자(리벨리온 ATOM·Rebel100), TSMC(퓨리오사·NVIDIA·AMD·Google)',
    duration: '웨이퍼 가공 통상 약 11~13주(일반 범위). 후공정·운송 포함 12주~6개월',
    durationClaim: 'fact',
    durationSrc: ['wiki-fab', 'ecia-leadtime'],
    krVsUs: '리벨리온은 국내 삼성 파운드리, 퓨리오사와 미국 기업들은 대만 TSMC를 씁니다. 국적보다 어느 공장의 생산 슬롯을 얼마나 확보했는지가 일정을 좌우합니다.',
    delays: '생산 슬롯 대기, 수율 문제, 마스크 수정(Blackwell 사례)',
    bucket: 'production',
  },
  {
    key: 'package',
    name: '패키징·검사',
    what: '잘라낸 칩을 기판에 붙이고 HBM 메모리와 연결해 보호 껍질을 씌운 뒤, 불량을 검사합니다.',
    who: '파운드리 첨단 패키징, 후공정(OSAT) 업체, 메모리 회사',
    duration: '위 12주~6개월 범위에 포함(일반 범위)',
    durationClaim: 'fact',
    durationSrc: ['ecia-leadtime'],
    krVsUs: 'HBM을 쓰는 칩은 첨단 2.5D 패키징이 필요해 용량 확보가 관건입니다. GDDR을 쓰는 칩(ATOM-Max)은 이 부담이 상대적으로 작습니다.',
    delays: 'HBM 메모리 확보, 첨단 패키징 용량',
    bucket: 'production',
  },
  {
    key: 'system',
    name: '보드·서버 통합',
    what: '칩을 카드(보드)에 올리고, 카드 여러 장을 서버와 랙에 넣어 전원·냉각을 맞춥니다.',
    who: '보드 제조사, 서버 제조사(OEM/ODM)',
    duration: '공개 자료 부족',
    durationClaim: 'unverified',
    durationSrc: [],
    krVsUs: '미국 GPU는 여러 서버 제조사가 표준 제품으로 판매합니다. 한국 NPU는 자체 서버·랙(ATOM-Max 서버, NXT RNGD 서버, RebelRack)을 직접 내놓는 방식이 많습니다.',
    delays: '서버 파트너 인증, 랙 전력·냉각 설계',
    bucket: 'production',
  },
  {
    key: 'software',
    name: '소프트웨어 최적화',
    what: '고객이 쓰는 AI 모델이 새 칩에서 빠르고 정확하게 돌아가도록 컴파일러·라이브러리를 맞춥니다.',
    who: '팹리스 소프트웨어팀, 고객사 개발자',
    duration: '공개 자료 부족',
    durationClaim: 'unverified',
    durationSrc: [],
    krVsUs: '미국 GPU는 CUDA 생태계가 이미 준비돼 있어 이 단계가 짧습니다. 한국 NPU는 고객 모델마다 최적화 작업이 필요한 경우가 많습니다.',
    delays: '새 모델 구조 지원, 정밀도(FP8 등) 검증',
    bucket: 'adoption',
  },
  {
    key: 'eval',
    name: '고객 평가',
    what: '고객이 소량을 들여와 실제 서비스와 같은 조건에서 시험(PoC)합니다.',
    who: '고객사',
    duration: '사례: SKT 시험→상용 약 6개월, 삼성SDS 협력→출시 약 10개월 (계산)',
    durationClaim: 'calc',
    durationSrc: ['kt-skt-pilot', 'rcr-skt', 'sds-npuaas'],
    krVsUs: '기존 고객 기반이 있는 기업은 평가를 건너뛰거나 짧게 합니다. 신규 진입 기업은 레퍼런스를 하나씩 쌓아야 합니다.',
    delays: '보안 인증(CSAP 등), 모델 호환성, 내부 승인',
    bucket: 'adoption',
  },
  {
    key: 'contract',
    name: '계약·납품',
    what: '구매 계약을 맺고 장비를 고객 데이터센터에 설치합니다.',
    who: '고객사, 조달 기관, 서버 공급사',
    duration: '사례별 상이 — 공개 자료 부족',
    durationClaim: 'unverified',
    durationSrc: [],
    krVsUs: '한국은 조달청 혁신제품 지정 같은 공공 경로가 초기 판로가 됩니다. 미국 대형 업체는 출하 1년 전 대형 선계약(AMD–OpenAI)을 맺기도 합니다.',
    delays: '예산 주기, 메모리 수급, 납품 일정 조율',
    bucket: 'adoption',
  },
  {
    key: 'operate',
    name: '상용 운영',
    what: '실제 사용자가 쓰는 서비스에서 칩이 돌아가며, 이때부터 서비스 매출이 발생합니다.',
    who: '고객사 서비스·운영팀',
    duration: '지속',
    durationClaim: 'fact',
    durationSrc: [],
    krVsUs: '상용 운영 사례가 다음 고객을 설득하는 근거(레퍼런스)가 됩니다.',
    delays: '운영 중 장애 대응, 모델 교체 시 재최적화',
    bucket: 'adoption',
  },
];

/* ───── 결론 Q&A ───── */
export const timelineQA: { q: string; a: string; src: string[] }[] = [
  {
    q: '한국과 미국 기업은 어느 단계에서 시간이 더 걸리는가?',
    a: '공개 날짜로 보면 차이가 가장 뚜렷한 곳은 “칩 완성 이후” 구간입니다. 퓨리오사 RNGD는 첫 칩(2024-05) 뒤 양산(2026-01)까지 약 20개월이 걸렸고, 그 사이 샘플 공급·고객 평가가 진행됐습니다. 반면 Google Ironwood는 공개 후 약 7개월 만에 자사 클라우드에서 출시됐고, NVIDIA Blackwell은 마스크 수정이 있었는데도 발표 후 약 9개월 만에 생산 확대 단계에 들어갔습니다. 다만 미국 기업의 개발 시작일도 공개되지 않아 “전체 개발 기간”은 비교할 수 없습니다.',
    src: ['converge-rngd', 'furiosa-seriesd', 'gcp-ironwood-ga', 'dcd-blackwell'],
  },
  {
    q: '차이는 국적 때문인가, 기업 규모·제품 복잡도·공급 계약·생태계 때문인가?',
    a: '국적보다는 구조적 요인으로 설명됩니다. 리벨리온·퓨리오사와 NVIDIA·AMD는 같은 종류의 파운드리(삼성·TSMC)를 쓰므로 제조 단계 자체는 크게 다르지 않습니다. 차이는 ① 출하 전 대형 선계약 여부(AMD–OpenAI 6 GW), ② 자사 서비스가 첫 고객인지(Google), ③ CUDA 같은 기존 소프트웨어 기반, ④ 회사 규모와 자금 조달 시점에서 생깁니다.',
    src: ['amd-openai', 'gcp-ironwood-ga', 'kt-rbln-masspro', 'furiosa-hotchips'],
  },
  {
    q: '칩이 완성되어도 실제 매출과 상용 운영까지 시간이 걸리는 이유는?',
    a: '고객은 칩이 아니라 “서비스가 안정적으로 돌아가는지”를 삽니다. 그래서 소프트웨어 최적화 → 시험 도입 → 보안 인증 → 계약 → 설치 → 운영 단계를 차례로 거칩니다. 예: SKT는 시험 도입 발표 후 상용까지 약 6개월, 삼성SDS는 협력 시작 후 서비스 출시까지 약 10개월이 걸렸습니다. 리벨리온 매출은 2025년 270억 원 이상으로 보도됐지만, 같은 기간 받은 투자금보다 훨씬 작다는 점도 이 시차를 보여줍니다.',
    src: ['kt-skt-pilot', 'rcr-skt', 'sds-npuaas', 'kh-rbln-revenue'],
  },
  {
    q: '기존 소프트웨어와 고객 기반은 도입 기간에 어떤 영향을 주는가?',
    a: 'CUDA로 이미 서비스를 운영하는 고객은 NVIDIA 신제품을 도입할 때 코드를 거의 바꾸지 않아도 됩니다. 한국 NPU를 도입하려면 모델별 이식·검증이 필요해 평가 기간이 길어집니다. 반대로 공공·보안 요구로 국산 칩을 선호하는 고객(공공 클라우드, 지자체)이나 관계사 고객(SKT)에서는 도입이 상대적으로 빨랐습니다.',
    src: ['sedaily-ktcloud', 'wowtale-procurement', 'rcr-skt'],
  },
];
