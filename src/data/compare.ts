import type { ClaimKind } from './meta';
import type { ProductClass } from './products';

export interface Cell {
  text: string;
  claim: ClaimKind;
  src?: string[];
}

export interface MetricRow {
  key: string;
  label: string;
  plain: string;
  /** 이 차이가 사용자에게 왜 중요한가 — 한 문장 */
  why: string;
  /** true면 같은 조건의 근거가 없어 순위를 매길 수 없는 항목 */
  notComparable?: boolean;
  cells: Record<string, Cell>;
}

const NC = (extra?: string): Cell => ({
  text: '직접 비교 불가' + (extra ? ` — ${extra}` : ''),
  claim: 'unverified',
});

export const metricRows: Partial<Record<ProductClass, MetricRow[]>> = {
  pcie: [
    {
      key: 'throughput',
      label: '추론 처리량',
      plain: '정해진 시간에 몇 건의 질문(토큰)을 처리하나',
      why: '같은 장비로 더 많은 사용자를 받을수록 1건당 비용이 내려갑니다.',
      notComparable: true,
      cells: {
        'atom-max': {
          text: '동일 조건 독립 측정 없음. 참고: 1세대 ATOM이 2023년 MLPerf 언어 부문에서 상위 결과(모델·조건 다름)',
          claim: 'unverified',
          src: ['ked-mlperf'],
        },
        rngd: {
          text: '동일 조건 독립 측정 없음. MLPerf 공식 제출 확인 못 함',
          claim: 'unverified',
          src: ['ieee-mlperf', 'mlc-v61'],
        },
        l40s: NC('같은 모델·배치·정밀도로 한국 칩과 함께 측정한 공개 자료 없음'),
      },
    },
    {
      key: 'latency',
      label: '지연시간',
      plain: '질문 후 첫 글자가 나오기까지·답이 끝나기까지 걸리는 시간',
      why: '챗봇·상담처럼 실시간 서비스는 처리량보다 기다리는 시간이 체감 품질을 좌우합니다.',
      notComparable: true,
      cells: { 'atom-max': NC(), rngd: NC(), l40s: NC() },
    },
    {
      key: 'efficiency',
      label: '전력 효율',
      plain: '같은 일을 하는 데 전기를 얼마나 쓰나',
      why: '데이터센터는 전력 한도가 정해져 있어, 효율이 곧 증설 가능 규모와 전기요금을 결정합니다.',
      cells: {
        'atom-max': { text: '최대 350 W (효율은 동일 작업 측정이 없어 비교 불가)', claim: 'fact', src: ['rbln-atommax-brief'] },
        rngd: {
          text: '최대 180 W. LG AI연구원 평가에서 GPU 대비 와트당 성능 우위 발표(고객·제조사 발표, 독립 검증 아님)',
          claim: 'claim',
          src: ['furiosa-rngd', 'reg-lg'],
        },
        l40s: { text: '최대 350 W (효율은 동일 작업 측정이 없어 비교 불가)', claim: 'fact', src: ['nv-l40s'] },
      },
    },
    {
      key: 'memory',
      label: '메모리 용량·대역폭',
      plain: 'AI 모델을 얼마나 담고, 얼마나 빨리 읽어오나',
      why: '메모리가 부족하면 큰 모델을 아예 못 올리거나 칩을 여러 장 써야 합니다.',
      cells: {
        'atom-max': { text: '64GB GDDR6 · 1 TB/s', claim: 'fact', src: ['rbln-atommax-brief'] },
        rngd: { text: '48GB HBM3 · 1.5 TB/s', claim: 'fact', src: ['furiosa-rngd'] },
        l40s: { text: '48GB GDDR6 · 864 GB/s', claim: 'fact', src: ['nv-l40s'] },
      },
    },
    {
      key: 'precision',
      label: '지원 정밀도·모델',
      plain: '숫자를 얼마나 촘촘하게(FP16/FP8/INT8) 계산하나, 어떤 모델이 돌아가나',
      why: '낮은 정밀도는 빠르지만 품질 손실 위험이 있어, 쓰려는 모델이 그 정밀도로 검증됐는지가 중요합니다.',
      cells: {
        'atom-max': { text: 'FP16 · INT8 · INT4 (지원 모델 목록은 공식 SDK 문서 확인)', claim: 'fact', src: ['rbln-atommax-brief'] },
        rngd: { text: 'BF16 · FP8 · INT8 · INT4. LG EXAONE 서비스에 사용', claim: 'fact', src: ['furiosa-devdoc', 'reg-lg'] },
        l40s: { text: 'FP8 등 다수 정밀도. CUDA 기반 대부분의 공개 모델 지원', claim: 'fact', src: ['nv-l40s'] },
      },
    },
    {
      key: 'software',
      label: '소프트웨어 생태계',
      plain: '개발자가 익숙한 도구로 바로 쓸 수 있나',
      why: '칩이 빨라도 기존 코드를 옮기는 데 몇 달이 걸리면 실제 도입은 늦어집니다.',
      cells: {
        'atom-max': { text: '자체 SDK. 사용자·레퍼런스 규모는 CUDA보다 작음', claim: 'fact', src: ['rcr-skt'] },
        rngd: { text: '자체 SDK. 사용자·레퍼런스 규모는 CUDA보다 작음', claim: 'fact', src: ['furiosa-devdoc'] },
        l40s: { text: 'CUDA — 가장 넓은 개발자·라이브러리 기반', claim: 'fact', src: ['nv-l40s'] },
      },
    },
    {
      key: 'scale',
      label: '여러 칩 확장성',
      plain: '칩 여러 장을 묶어 큰 모델을 돌릴 수 있나',
      why: '모델이 커질수록 칩 사이 데이터 이동 속도가 전체 성능의 병목이 됩니다.',
      cells: {
        'atom-max': { text: '서버당 카드 8장 구성', claim: 'fact', src: ['rbln-atommax-server'] },
        rngd: { text: '서버당 카드 8장 구성 (NXT RNGD 서버)', claim: 'fact', src: ['furiosa-rngd'] },
        l40s: { text: 'NVLink 없이 PCIe로 연결', claim: 'fact', src: ['nv-l40s'] },
      },
    },
    {
      key: 'availability',
      label: '구매 가능·공급',
      plain: '지금 살 수 있나, 누가 운영을 지원하나',
      why: '물량을 제때 받지 못하면 성능 비교는 의미가 없습니다.',
      cells: {
        'atom-max': { text: '판매·납품 중. 조달청 혁신제품 지정, 2026-08 지자체 납품', claim: 'fact', src: ['wowtale-procurement'] },
        rngd: { text: '2026-01 양산 시작, 2026년 2만 장 생산 계획(계획치)', claim: 'claim', src: ['furiosa-seriesd'] },
        l40s: { text: '여러 서버 제조사를 통해 판매', claim: 'fact', src: ['nv-l40s'] },
      },
    },
  ],

  hbm: [
    {
      key: 'throughput',
      label: '추론 처리량',
      plain: '정해진 시간에 몇 건의 질문(토큰)을 처리하나',
      why: '같은 장비로 더 많은 사용자를 받을수록 1건당 비용이 내려갑니다.',
      notComparable: true,
      cells: {
        rebel100: { text: '“H200급 성능” 제조사 주장 — 독립 검증 없음', claim: 'claim', src: ['toms-isscc-rebel100'] },
        h200: { text: 'MLPerf 등 독립 벤치마크 다수(Rebel100과 같은 조건 비교 아님)', claim: 'unverified', src: ['mlc-v61'] },
        b300: { text: 'MLPerf 제출 이력 있음 — 한국 칩과 동일 조건 비교 없음', claim: 'unverified', src: ['mlc-v61'] },
        mi355x: { text: 'MLPerf 제출 이력 있음 — 한국 칩과 동일 조건 비교 없음', claim: 'unverified', src: ['mlc-v61'] },
      },
    },
    {
      key: 'latency',
      label: '지연시간',
      plain: '질문 후 답을 받기까지 걸리는 시간',
      why: '실시간 서비스에서는 기다리는 시간이 체감 품질을 좌우합니다.',
      notComparable: true,
      cells: { rebel100: NC(), h200: NC(), b300: NC(), mi355x: NC() },
    },
    {
      key: 'efficiency',
      label: '전력 효율',
      plain: '같은 일을 하는 데 전기를 얼마나 쓰나',
      why: '랙당 전력 한도 안에서 몇 개의 칩을 넣을 수 있는지가 결정됩니다.',
      cells: {
        rebel100: { text: '600 W(제조사). 공랭 랙 구성 가능', claim: 'claim', src: ['toms-isscc-rebel100', 'aac-rebellions-ceo'] },
        h200: { text: '최대 700 W', claim: 'fact', src: ['nv-h200'] },
        b300: { text: '약 1,400 W (2차 자료)', claim: 'unverified', src: ['spheron-b300'] },
        mi355x: { text: '1,400 W', claim: 'fact', src: ['amd-mi355x'] },
      },
    },
    {
      key: 'memory',
      label: '메모리 용량·대역폭',
      plain: 'AI 모델을 얼마나 담고, 얼마나 빨리 읽어오나',
      why: '대형 모델은 메모리 용량이 곧 필요한 칩 개수를 결정합니다.',
      cells: {
        rebel100: { text: '144GB HBM3E · 4.8 TB/s', claim: 'fact', src: ['rbln-rebel100'] },
        h200: { text: '141GB HBM3e · 4.8 TB/s', claim: 'fact', src: ['nv-h200'] },
        b300: { text: '288GB HBM3e · 8 TB/s (2차 자료)', claim: 'unverified', src: ['spheron-b300'] },
        mi355x: { text: '288GB HBM3E · 8 TB/s', claim: 'fact', src: ['amd-mi355x'] },
      },
    },
    {
      key: 'precision',
      label: '지원 정밀도·용도',
      plain: '학습까지 하나, 추론만 하나',
      why: '학습이 필요 없는 서비스 기업이라면 추론 전용 칩으로 충분할 수 있습니다.',
      cells: {
        rebel100: { text: 'FP8·FP16 등 · 추론 중심', claim: 'claim', src: ['toms-isscc-rebel100'] },
        h200: { text: '학습 + 추론', claim: 'fact', src: ['nv-h200'] },
        b300: { text: '학습 + 추론', claim: 'fact', src: ['nv-hgx'] },
        mi355x: { text: 'FP16~MXFP4 · 학습 + 추론', claim: 'fact', src: ['amd-mi355x'] },
      },
    },
    {
      key: 'software',
      label: '소프트웨어 생태계',
      plain: '개발자가 익숙한 도구로 바로 쓸 수 있나',
      why: '기존 GPU 코드를 옮기는 비용이 칩 가격 차이보다 클 수 있습니다.',
      cells: {
        rebel100: { text: '자체 SDK · 레퍼런스 고객 적음(초기 단계)', claim: 'fact', src: ['jpr-rbln'] },
        h200: { text: 'CUDA', claim: 'fact', src: ['nv-h200'] },
        b300: { text: 'CUDA', claim: 'fact', src: ['nv-hgx'] },
        mi355x: { text: 'ROCm — CUDA 다음으로 큰 오픈 생태계', claim: 'fact', src: ['amd-mi355x'] },
      },
    },
    {
      key: 'scale',
      label: '여러 칩 확장성',
      plain: '칩 여러 개를 묶어 하나처럼 쓰는가',
      why: '수백~수천 개를 묶어야 하는 대형 서비스는 연결 기술이 전체 성능을 좌우합니다.',
      cells: {
        rebel100: { text: '패키지 내 칩렛 4개 UCIe 연결 · 랙당 32개(RebelRack)', claim: 'unverified', src: ['rbln-rebel100', 'aac-rebellions-ceo'] },
        h200: { text: 'HGX 보드에서 NVLink로 8개 연결', claim: 'fact', src: ['nv-h200'] },
        b300: { text: 'HGX 8-GPU NVLink 총 14.4 TB/s', claim: 'fact', src: ['nv-hgx'] },
        mi355x: { text: '8-GPU 서버 · 72-GPU Helios 랙은 차세대(MI450)', claim: 'unverified', src: ['techinsider-helios'] },
      },
    },
    {
      key: 'availability',
      label: '구매 가능·공급',
      plain: '지금 살 수 있나',
      why: '발표된 제품과 실제로 받을 수 있는 제품은 다릅니다.',
      cells: {
        rebel100: { text: '공개(2026-02)·랙 출시 보도, 일본 ai& 최대 100랙 도입 계획 발표', claim: 'unverified', src: ['inferencechips-rbln', 'hpcwire-aiand'] },
        h200: { text: '판매 중', claim: 'fact', src: ['nv-h200'] },
        b300: { text: '판매 중', claim: 'fact', src: ['nv-hgx'] },
        mi355x: { text: '판매 중', claim: 'fact', src: ['amd-mi355x'] },
      },
    },
  ],
};

/** 그룹별 "읽는 법" 설명 */
export const classReadingNote: Record<ProductClass, string> = {
  pcie: '세 제품 모두 서버에 꽂는 카드이고 최대 전력이 180~350 W 범위라 같은 표에 둡니다. 다만 처리량·지연시간은 같은 모델·배치·정밀도로 함께 잰 공개 자료가 없어 “직접 비교 불가”로 표시합니다.',
  hbm: '대형 HBM 가속기끼리 비교합니다. Rebel100은 메모리 구성상 H200과 비슷한 체급이고, B300·MI355X는 전력·메모리가 약 2배인 상위 체급입니다. 체급이 다르면 “더 좋다”가 아니라 “용도가 다르다”로 읽어야 합니다.',
  cloud: 'Google TPU는 판매하지 않는 칩이고, KT Cloud·삼성SDS는 한국 NPU를 빌려주는 서비스입니다. 성격이 달라 순위표를 만들지 않고 각각의 특징만 정리합니다.',
};

/* ───── 간단히 보기 표 ─────
 * 값 끝의 '*'는 2차 자료 기준(검증 필요), '†'는 제조사 발표 수치를 뜻합니다.
 * 출처는 표 아래 출처 줄(simpleSources)과 “자세히 보기”에서 확인할 수 있습니다. */
export interface SimpleTable {
  /** 표 머리글에 쓸 짧은 제품명 */
  heads: Record<string, string>;
  rows: { label: string; values: Record<string, string> }[];
  sources: Record<string, string[]>;
}

export const simpleTables: Record<ProductClass, SimpleTable> = {
  pcie: {
    heads: { 'atom-max': 'ATOM-Max', rngd: 'RNGD', l40s: 'L40S' },
    rows: [
      { label: '최대 전력', values: { 'atom-max': '350W', rngd: '180W', l40s: '350W' } },
      { label: '메모리', values: { 'atom-max': '64GB GDDR6', rngd: '48GB HBM3', l40s: '48GB GDDR6' } },
      { label: '메모리 대역폭', values: { 'atom-max': '1 TB/s', rngd: '1.5 TB/s', l40s: '864 GB/s' } },
      { label: '소프트웨어', values: { 'atom-max': '자체 SDK', rngd: '자체 SDK', l40s: 'CUDA' } },
      { label: '주요 용도', values: { 'atom-max': 'AI 추론', rngd: 'AI 추론', l40s: 'AI 추론 및 범용 GPU 작업' } },
    ],
    sources: { 'atom-max': ['rbln-atommax-brief'], rngd: ['furiosa-rngd'], l40s: ['nv-l40s'] },
  },
  hbm: {
    heads: { rebel100: 'Rebel100', h200: 'H200', b300: 'B300', mi355x: 'MI355X' },
    rows: [
      { label: '최대 전력', values: { rebel100: '600W†', h200: '최대 700W', b300: '약 1,400W*', mi355x: '1,400W' } },
      { label: '메모리', values: { rebel100: '144GB HBM3E', h200: '141GB HBM3e', b300: '288GB HBM3e*', mi355x: '288GB HBM3E' } },
      { label: '메모리 대역폭', values: { rebel100: '4.8 TB/s', h200: '4.8 TB/s', b300: '8 TB/s*', mi355x: '8 TB/s' } },
      { label: '소프트웨어', values: { rebel100: '자체 SDK', h200: 'CUDA', b300: 'CUDA', mi355x: 'ROCm' } },
      { label: '주요 용도', values: { rebel100: '대형 AI 추론', h200: 'AI 학습·추론', b300: 'AI 학습·추론', mi355x: 'AI 학습·추론' } },
    ],
    sources: { rebel100: ['rbln-rebel100', 'toms-isscc-rebel100'], h200: ['nv-h200'], b300: ['spheron-b300', 'nv-hgx'], mi355x: ['amd-mi355x'] },
  },
  cloud: {
    heads: { ironwood: 'Google TPU Ironwood', 'kt-atom': 'KT Cloud NPU', 'sds-rngd': '삼성SDS NPUaaS' },
    rows: [
      { label: '형태', values: { ironwood: '판매 안 하는 칩, 클라우드 임대', 'kt-atom': '한국 NPU 클라우드 서비스', 'sds-rngd': '한국 NPU 클라우드 서비스' } },
      { label: '사용 칩', values: { ironwood: 'TPU Ironwood', 'kt-atom': '리벨리온 ATOM 계열', 'sds-rngd': '퓨리오사AI RNGD' } },
      { label: '칩당 메모리', values: { ironwood: '192GB HBM', 'kt-atom': '칩 사양 참고', 'sds-rngd': '48GB HBM3' } },
      { label: '시간당 요금', values: { ironwood: '출처 상충*', 'kt-atom': '확인 못 함', 'sds-rngd': '확인 못 함' } },
      { label: '주요 용도', values: { ironwood: 'AI 학습·추론', 'kt-atom': '공공·기업 AI 추론', 'sds-rngd': '공공·기업 AI 추론' } },
    ],
    sources: { ironwood: ['google-ironwood', 'techi-ironwood-price', 'shattered-ironwood'], 'kt-atom': ['sedaily-ktcloud'], 'sds-rngd': ['sds-npuaas'] },
  },
};
