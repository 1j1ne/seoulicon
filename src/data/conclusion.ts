export interface Point {
  text: string;
  src: string[];
}

export const conclusion: { key: string; title: string; tone: 'ok' | 'limit' | 'unknown' | 'fit'; points: Point[] }[] = [
  {
    key: 'ok',
    title: '상용화 성과와 확인된 강점',
    tone: 'ok',
    points: [
      { text: '실제 상용 서비스 가동: 리벨리온 칩이 SK텔레콤 4개 상용 AI 서비스에서, 퓨리오사 RNGD가 삼성SDS NPU 구독 서비스에서 운영 중입니다.', src: ['rcr-skt', 'sds-npuaas'] },
      { text: '저전력 PCIe 카드 체급: RNGD는 최대 180 W로 HBM3 48GB를 담아, 기존 공랭 데이터센터에 넣기 쉬운 사양입니다(공식 사양).', src: ['furiosa-rngd'] },
      { text: '양산·공급 진입: RNGD는 2026년 1월 양산을 시작했고, ATOM-Max는 공공 조달 경로로 지자체에 납품되기 시작했습니다.', src: ['furiosa-seriesd', 'wowtale-procurement'] },
      { text: '공공·소버린 수요: 국내 공공 클라우드 보안 인증(CSAP)을 받은 NPU 서비스가 나왔습니다.', src: ['sedaily-ktcloud'] },
    ],
  },
  {
    key: 'limit',
    title: '아직 제약이 있는 영역',
    tone: 'limit',
    points: [
      { text: '소프트웨어 생태계: NVIDIA는 CUDA를 중심으로 TensorRT 같은 자체 도구를 갖췄고, PyTorch 등 주요 AI 프레임워크도 CUDA를 기본으로 지원해 사실상의 표준 개발 생태계가 됐습니다. 한국 NPU는 자체 SDK를 제공하지만, 모델과 연산에 따라 추가적인 변환·최적화·검증이 필요할 수 있습니다. 따라서 반도체 성능뿐 아니라 기존 AI 소프트웨어와의 호환성도 중요한 경쟁 요소입니다.', src: ['rcr-skt', 'jpr-rbln', 'furiosa-devdoc'] },
      { text: '학습(training) 시장: 한국 NPU 제품은 추론 중심으로 설계됐고, 대규모 학습은 미국 GPU·TPU가 맡고 있습니다.', src: ['furiosa-rngd', 'toms-isscc-rebel100'] },
      { text: '대규모 확장: 수천 칩을 묶는 랙·포드 단위 시스템은 미국 업체가 먼저 대량 공급 중이며, 한국 랙 제품(RebelRack)은 초기 배치 단계입니다.', src: ['nv-hgx', 'google-ironwood', 'hpcwire-aiand'] },
      { text: '매출 규모: 리벨리온 2025년 매출은 270억 원 이상으로 보도돼, 투자 유치 규모에 비해 아직 작습니다.', src: ['kh-rbln-revenue', 'cnbc-rbln-400m'] },
    ],
  },
  {
    key: 'unknown',
    title: '공개 자료가 부족해 판단하기 어려운 영역',
    tone: 'unknown',
    points: [
      { text: '같은 조건의 성능: 2026년 MLPerf 등 독립 벤치마크에서 한국 칩과 미국 칩을 같은 조건으로 비교한 결과를 확인하지 못했습니다.', src: ['mlc-v61', 'ieee-mlperf'] },
      { text: '가격과 총소유비용(TCO): 한국·미국 판매용 가속기 모두 공식 가격이 없어 비용 우위를 판단할 수 없습니다.', src: ['furiosa-rngd'] },
      { text: '판매 물량·점유율: 출하 대수와 고객별 수량이 대부분 비공개입니다. 이 사이트는 추정치를 만들지 않았습니다.', src: [] },
      { text: '해외 계약의 실제 이행: 일본 ai&(최대 100랙), 스웨덴(수량 보도 상충) 건은 계획 발표 단계입니다.', src: ['hpcwire-aiand', 'dt-sweden', 'dcd-sweden'] },
    ],
  },
  {
    key: 'fit',
    title: '어떤 고객·환경에 맞을까',
    tone: 'fit',
    points: [
      { text: '이미 학습된 모델을 대량으로 서비스하는 기업(챗봇·요약·상담 등 추론 위주).', src: ['rcr-skt', 'tc-lg'] },
      { text: '전력·냉각 여유가 적은 기존 데이터센터 — 저전력 PCIe 카드나 공랭 랙이 유리할 수 있음(회사 설명 기반).', src: ['furiosa-rngd', 'aac-rebellions-ceo'] },
      { text: '데이터 주권·보안 인증이 중요한 공공기관과 규제 산업.', src: ['sedaily-ktcloud', 'sds-npuaas'] },
      { text: '반대로, 대규모 모델 학습이나 CUDA 전용 코드가 많은 조직은 GPU가 현실적인 선택일 가능성이 큽니다.', src: ['nv-hgx'] },
    ],
  },
];
