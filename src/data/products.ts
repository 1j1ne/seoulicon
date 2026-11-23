import type { ClaimKind, Region } from './meta';

/**
 * 비교 그룹 — 서로 다른 그룹끼리는 순위를 매기지 않습니다.
 *  pcie   : 일반 서버에 꽂는 PCIe 카드형 추론 가속기 (수백 W급)
 *  hbm    : 대용량 HBM을 쌓은 대형 데이터센터 가속기 (600 W 이상급)
 *  cloud  : 판매하지 않고 클라우드로만 빌려 쓰는 칩 / 한국 NPU 클라우드 서비스
 */
export type ProductClass = 'pcie' | 'hbm' | 'cloud';

export interface Spec {
  label: string;
  value: string;
  claim: ClaimKind;
  src: string[];
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  company: string;
  region: Region;
  cls: ProductClass;
  /** 칩 종류: GPU / 전용 AI 가속기(NPU·ASIC) */
  kind: string;
  status: string;
  statusClaim: ClaimKind;
  statusSrc: string[];
  target: string;
  memoryType: 'HBM' | 'GDDR';
  oneLiner: string;
  specs: Spec[];
}

export const CLASS_INFO: Record<ProductClass, { title: string; short: string; desc: string }> = {
  pcie: {
    title: 'PCIe 카드형 추론 가속기',
    short: '서버용 카드',
    desc: '일반 서버의 확장 슬롯(PCIe)에 꽂아 쓰는 카드. 기존 데이터센터 전력·냉각 설비를 크게 바꾸지 않고 도입하기 쉬운 체급입니다.',
  },
  hbm: {
    title: '대형 HBM 데이터센터 가속기',
    short: '대형 가속기',
    desc: '칩 바로 옆에 고대역 메모리(HBM)를 여러 층 쌓은 고성능 가속기. 큰 모델을 담고 여러 칩을 묶어 쓰는 데 초점이 있습니다.',
  },
  cloud: {
    title: '클라우드로 빌려 쓰는 칩',
    short: '클라우드',
    desc: '칩을 사지 않고 시간 단위로 빌려 씁니다. Google TPU처럼 외부 판매를 하지 않는 칩, 한국 NPU를 클라우드 서비스로 제공하는 사례를 함께 보여주되 순위는 매기지 않습니다.',
  },
};

export const products: Product[] = [
  /* ── PCIe 카드형 ── */
  {
    id: 'atom-max',
    name: 'ATOM-Max',
    company: '리벨리온',
    region: 'kr',
    cls: 'pcie',
    kind: '전용 AI 가속기 (NPU)',
    status: '판매·납품 중',
    statusClaim: 'fact',
    statusSrc: ['wowtale-procurement', 'rcr-skt'],
    target: '데이터센터 추론',
    memoryType: 'GDDR',
    oneLiner: 'GDDR6 메모리를 쓰는 리벨리온의 1세대 계열 추론 카드. SK텔레콤 상용 서비스와 공공 조달에 쓰입니다.',
    specs: [
      { label: '메모리', value: '64GB GDDR6', claim: 'fact', src: ['rbln-atommax-brief'] },
      { label: '메모리 대역폭', value: '1 TB/s', claim: 'fact', src: ['rbln-atommax-brief'] },
      {
        label: '이론상 최고 연산',
        value: '128 TFLOPS(FP16) · 512 TOPS(INT8) · 1,024 TOPS(INT4)',
        claim: 'fact',
        src: ['rbln-atommax-brief'],
        note: '공식 사양의 최고치. 실제 서비스 성능과 다릅니다.',
      },
      { label: '최대 전력', value: '350 W', claim: 'fact', src: ['rbln-atommax-brief'] },
      {
        label: '제조',
        value: '삼성전자 5nm (ATOM 칩 기준)',
        claim: 'fact',
        src: ['kt-rbln-masspro', 'semifive-rbln'],
      },
      {
        label: '서버 구성 예',
        value: '4U 서버에 카드 8장 · 512GB · 일반 약 3.4 kW',
        claim: 'fact',
        src: ['rbln-atommax-server'],
      },
    ],
  },
  {
    id: 'rngd',
    name: 'RNGD (레니게이드)',
    company: '퓨리오사AI',
    region: 'kr',
    cls: 'pcie',
    kind: '전용 AI 가속기 (NPU)',
    status: '양산 중 (2026년 1월~)',
    statusClaim: 'fact',
    statusSrc: ['furiosa-seriesd', 'thelec-rngd-masspro'],
    target: '데이터센터 LLM 추론',
    memoryType: 'HBM',
    oneLiner: 'PCIe 카드이면서 HBM3를 탑재한 퓨리오사AI의 2세대 칩. 낮은 전력(180 W)을 강점으로 내세웁니다.',
    specs: [
      { label: '메모리', value: '48GB HBM3', claim: 'fact', src: ['furiosa-rngd', 'furiosa-devdoc'] },
      { label: '메모리 대역폭', value: '1.5 TB/s', claim: 'fact', src: ['furiosa-rngd'] },
      {
        label: '이론상 최고 연산',
        value: '512 TFLOPS(FP8) · 256 TFLOPS(BF16) · 1,024 TOPS(INT4)',
        claim: 'fact',
        src: ['furiosa-devdoc', 'furiosa-rngd'],
        note: '공식 사양의 최고치. 실제 서비스 성능과 다릅니다.',
      },
      {
        label: '최대 전력(TDP)',
        value: '180 W',
        claim: 'fact',
        src: ['furiosa-rngd'],
        note: '2024년 Hot Chips 발표 당시에는 150 W로 소개됨',
      },
      { label: '온칩 SRAM', value: '256 MB', claim: 'fact', src: ['furiosa-rngd'] },
      { label: '제조', value: 'TSMC 5nm', claim: 'fact', src: ['furiosa-hotchips', 'converge-rngd'] },
    ],
  },
  {
    id: 'l40s',
    name: 'L40S',
    company: 'NVIDIA',
    region: 'us',
    cls: 'pcie',
    kind: 'GPU (그래픽·AI 범용)',
    status: '판매 중',
    statusClaim: 'fact',
    statusSrc: ['nv-l40s'],
    target: '추론·그래픽·소규모 학습',
    memoryType: 'GDDR',
    oneLiner: '그래픽과 AI를 함께 처리하는 PCIe GPU. 한국 PCIe NPU와 체급(전력·메모리)이 비슷해 비교 기준으로 둡니다.',
    specs: [
      { label: '메모리', value: '48GB GDDR6', claim: 'fact', src: ['nv-l40s'] },
      { label: '메모리 대역폭', value: '864 GB/s', claim: 'fact', src: ['nv-l40s'] },
      { label: '최대 전력', value: '350 W', claim: 'fact', src: ['nv-l40s'] },
      {
        label: '칩 간 직접 연결',
        value: 'NVLink 미지원 (PCIe로 연결)',
        claim: 'fact',
        src: ['nv-l40s'],
      },
    ],
  },

  /* ── 대형 HBM 가속기 ── */
  {
    id: 'rebel100',
    name: 'Rebel100 (RebelRack)',
    company: '리벨리온',
    region: 'kr',
    cls: 'hbm',
    kind: '전용 AI 가속기 (NPU, 칩렛)',
    status: '2026년 공개·초기 공급 단계',
    statusClaim: 'unverified',
    statusSrc: ['toms-isscc-rebel100', 'inferencechips-rbln', 'hpcwire-aiand'],
    target: '데이터센터 대형 LLM 추론',
    memoryType: 'HBM',
    oneLiner: '작은 칩(칩렛) 4개를 UCIe로 이어 한 패키지로 만든 리벨리온 차세대 가속기. 대량 출하 규모는 아직 공개되지 않았습니다.',
    specs: [
      {
        label: '메모리',
        value: '144GB HBM3E (칩렛당 36GB×4)',
        claim: 'fact',
        src: ['rbln-rebel100', 'toms-isscc-rebel100'],
      },
      { label: '메모리 대역폭', value: '4.8 TB/s', claim: 'fact', src: ['rbln-rebel100', 'toms-isscc-rebel100'] },
      {
        label: '이론상 최고 연산',
        value: '약 2 PFLOPS(FP8) · 약 1 PFLOPS(FP16)',
        claim: 'claim',
        src: ['toms-isscc-rebel100'],
        note: '제조사 발표 수치',
      },
      { label: '최대 전력', value: '600 W', claim: 'claim', src: ['toms-isscc-rebel100'] },
      {
        label: '제조',
        value: '삼성 파운드리 4nm급(SF4X)',
        claim: 'unverified',
        src: ['toms-isscc-rebel100', 'wiki-rbln'],
        note: '일부 자료는 3nm급으로 표기 — 출처 상충',
      },
      {
        label: '랙 구성(RebelRack)',
        value: '가속기 32개 · 약 64 PFLOPS(FP8) · 공랭',
        claim: 'unverified',
        src: ['aac-rebellions-ceo', 'inferencechips-rbln'],
        note: '랙 전력(약 5~7 kW)·총 메모리는 자료마다 다름',
      },
    ],
  },
  {
    id: 'h200',
    name: 'H200',
    company: 'NVIDIA',
    region: 'us',
    cls: 'hbm',
    kind: 'GPU',
    status: '판매 중',
    statusClaim: 'fact',
    statusSrc: ['nv-h200'],
    target: '학습 + 추론',
    memoryType: 'HBM',
    oneLiner: '리벨리온이 Rebel100의 비교 대상으로 지목한 GPU. 메모리 대역폭이 같은 체급입니다.',
    specs: [
      { label: '메모리', value: '141GB HBM3e', claim: 'fact', src: ['nv-h200'] },
      { label: '메모리 대역폭', value: '4.8 TB/s', claim: 'fact', src: ['nv-h200'] },
      { label: '최대 전력', value: '최대 700 W (SXM, 설정 가능)', claim: 'fact', src: ['nv-h200'] },
    ],
  },
  {
    id: 'b300',
    name: 'B300 (Blackwell Ultra)',
    company: 'NVIDIA',
    region: 'us',
    cls: 'hbm',
    kind: 'GPU',
    status: '판매 중 (HGX B300 출하)',
    statusClaim: 'fact',
    statusSrc: ['nv-hgx'],
    target: '학습 + 추론',
    memoryType: 'HBM',
    oneLiner: 'NVIDIA의 2026년 주력 출하 제품군. 차세대 Vera Rubin은 2026년 하반기 생산 단계로 보도됩니다.',
    specs: [
      { label: '메모리', value: '288GB HBM3e', claim: 'unverified', src: ['spheron-b300'], note: '2차 자료 기준' },
      { label: '메모리 대역폭', value: '8 TB/s', claim: 'unverified', src: ['spheron-b300'] },
      { label: '최대 전력', value: '약 1,400 W', claim: 'unverified', src: ['spheron-b300'] },
      {
        label: '8-GPU 보드(HGX B300)',
        value: '총 메모리 2.1TB · NVLink 총 14.4 TB/s',
        claim: 'fact',
        src: ['nv-hgx'],
      },
    ],
  },
  {
    id: 'mi355x',
    name: 'Instinct MI355X',
    company: 'AMD',
    region: 'us',
    cls: 'hbm',
    kind: 'GPU',
    status: '판매 중',
    statusClaim: 'fact',
    statusSrc: ['amd-mi355x'],
    target: '학습 + 추론',
    memoryType: 'HBM',
    oneLiner: 'NVIDIA의 대안으로 쓰이는 AMD GPU. 차세대 MI450(Helios 랙)은 2026년 하반기 첫 공급 예정입니다.',
    specs: [
      { label: '메모리', value: '288GB HBM3E', claim: 'fact', src: ['amd-mi355x'] },
      { label: '메모리 대역폭', value: '8 TB/s', claim: 'fact', src: ['amd-mi355x'] },
      {
        label: '이론상 최고 연산',
        value: '2.5 PFLOPS(FP16 dense) · 10.1 PFLOPS(MXFP4)',
        claim: 'fact',
        src: ['amd-mi355x'],
      },
      { label: '최대 전력', value: '1,400 W', claim: 'fact', src: ['amd-mi355x'] },
    ],
  },

  /* ── 클라우드 ── */
  {
    id: 'ironwood',
    name: 'TPU Ironwood (7세대)',
    company: 'Google',
    region: 'us',
    cls: 'cloud',
    kind: '전용 AI 가속기 (ASIC) — 자체 사용·클라우드 임대',
    status: 'Google Cloud에서만 사용 (2025-11 GA)',
    statusClaim: 'fact',
    statusSrc: ['gcp-ironwood-ga'],
    target: '학습 + 추론 (추론 강조)',
    memoryType: 'HBM',
    oneLiner: '칩을 팔지 않고 Google 자체 서비스와 Google Cloud 고객에게 빌려주는 칩. 판매용 가속기와 같은 표에서 순위를 매기지 않습니다.',
    specs: [
      { label: '메모리', value: '192GB HBM', claim: 'fact', src: ['google-ironwood', 'gcp-ironwood-ga'] },
      { label: '메모리 대역폭', value: '약 7.37 TB/s', claim: 'fact', src: ['google-ironwood'] },
      { label: '이론상 최고 연산', value: '4,614 TFLOPS(FP8)', claim: 'fact', src: ['google-ironwood'] },
      { label: '최대 묶음 단위', value: '1개 포드에 최대 9,216칩', claim: 'fact', src: ['google-ironwood', 'reg-ironwood'] },
    ],
  },
  {
    id: 'kt-atom',
    name: 'KT Cloud NPU (리벨리온 ATOM 계열)',
    company: 'KT Cloud × 리벨리온',
    region: 'kr',
    cls: 'cloud',
    kind: '한국 NPU 기반 클라우드 서비스',
    status: '서비스 중 (공공용 CSAP 인증)',
    statusClaim: 'fact',
    statusSrc: ['sedaily-ktcloud'],
    target: '공공·기업 추론',
    memoryType: 'GDDR',
    oneLiner: '칩 자체가 아니라 한국 NPU를 빌려 쓰는 클라우드 서비스. 2023년부터 KT 데이터센터에 ATOM이 설치됐습니다.',
    specs: [
      { label: '최초 설치', value: '2023년 5월 KT 클라우드 NPU 인프라', claim: 'fact', src: ['tc-rbln-2024'] },
      { label: '공공 서비스', value: 'ATOM 계열 공공용 NPU 서버, CSAP 인증', claim: 'fact', src: ['sedaily-ktcloud'] },
      { label: '시간당 요금', value: '이번 조사에서 확인 못 함', claim: 'unverified', src: [] },
    ],
  },
  {
    id: 'sds-rngd',
    name: 'Samsung SDS NPUaaS (퓨리오사 RNGD)',
    company: '삼성SDS × 퓨리오사AI',
    region: 'kr',
    cls: 'cloud',
    kind: '한국 NPU 기반 클라우드 서비스',
    status: '서비스 중 (2026-07 출시)',
    statusClaim: 'fact',
    statusSrc: ['sds-npuaas'],
    target: '공공·보안 중시 기업 추론',
    memoryType: 'HBM',
    oneLiner: '삼성클라우드플랫폼에서 RNGD를 1·2·4·8장 단위로 빌려 쓰는 서비스입니다.',
    specs: [
      { label: '출시', value: '2026년 7월 20일 발표', claim: 'fact', src: ['sds-npuaas'] },
      { label: '구성', value: '1·2·4·8 카드 인스턴스', claim: 'fact', src: ['sds-npuaas', 'furiosa-sds'] },
      { label: '시간당 요금', value: '이번 조사에서 확인 못 함', claim: 'unverified', src: [] },
    ],
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);
