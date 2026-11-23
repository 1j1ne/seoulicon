/**
 * “강한 생태계를 가진 기존 강자에게 후발주자가 도전해 성공한 사례” — 한국 NPU가 CUDA에 도전하는 상황과 비교.
 * 수치는 출처가 있는 것만 넣고, 한국 NPU에 대한 적용은 이 사이트의 분석(의견)으로 구분합니다.
 */
import type { ClaimKind } from './meta';

export interface CaseRow {
  area: string;
  incumbent: string;
  challenger: string;
  result: string;
  open?: boolean;
}

export const caseTable: CaseRow[] = [
  { area: '서버 CPU', incumbent: 'Intel Xeon', challenger: 'AMD EPYC', result: '기존 강자의 매출 점유율 상당 부분 확보' },
  { area: '클라우드 CPU', incumbent: 'Intel·AMD의 x86', challenger: 'AWS Graviton (ARM)', result: '비용·효율이 유리한 작업부터 채택 확대' },
  { area: '스마트폰 운영체제', incumbent: 'Nokia Symbian', challenger: 'Google Android', result: '시장 선두 교체' },
  { area: 'AI 반도체', incumbent: 'NVIDIA CUDA 생태계', challenger: '리벨리온 등 한국 NPU', result: '현재 도전 중 · 승패 미확정', open: true },
];

export interface Bar { label: string; value: number; note?: string }

export interface ChallengeCase {
  id: string;
  title: string;
  story: string[];
  facts: { text: string; claim: ClaimKind; src: string[] }[];
  bars?: { title: string; unit: string; items: Bar[]; src: string[] };
  lesson: string;
  caveat: string;
}

export const challengeCases: ChallengeCase[] = [
  {
    id: 'amd',
    title: 'A. AMD EPYC — Intel이 지배하던 서버 CPU 시장 공략',
    story: [
      'Intel은 오랫동안 서버 CPU 시장을 지배했고, 서버 제조사와 기업들은 Intel 제품에 맞춰 시스템을 만들어 왔습니다.',
      'AMD는 EPYC 프로세서로 성능과 가격 대비 성능을 앞세워 서버 시장에 다시 들어왔습니다.',
    ],
    facts: [
      { text: 'EPYC 첫 세대 출시: 2017년', claim: 'fact', src: ['wiki-epyc'] },
      { text: '2025년 4분기 서버 CPU 매출 점유율 41.3% (출하 대수 기준은 28.8%)', claim: 'fact', src: ['reg-amd-share', 'toms-amd-share'] },
    ],
    bars: {
      title: '2025년 4분기 x86 서버 CPU 점유율 (Mercury Research 집계 보도)',
      unit: '%',
      items: [
        { label: '매출 기준', value: 41.3, note: 'AMD 41.3% · Intel 58.7%' },
        { label: '출하 대수 기준', value: 28.8, note: 'AMD 28.8% · Intel 71.2%' },
      ],
      src: ['reg-amd-share', 'toms-amd-share'],
    },
    lesson: '시장 전체를 한꺼번에 장악할 필요는 없습니다. 특정 고객과 작업에서 더 나은 경제성을 보여 주며 점유율을 쌓을 수 있습니다.',
    caveat: 'EPYC와 Xeon은 둘 다 x86 계열이라 기존 소프트웨어를 대부분 그대로 쓸 수 있었습니다. 한국 NPU는 CUDA와 다른 실행 환경이라는 장벽까지 넘어야 합니다.',
  },
  {
    id: 'graviton',
    title: 'B. AWS Graviton — 다른 설계(ARM)로 x86 생태계에 도전',
    story: [
      'AWS는 Intel·AMD의 x86 CPU 대신 ARM 기반 Graviton 프로세서를 자사 클라우드에 도입했습니다.',
      'x86과 ARM은 명령어 구조가 달라 기존 소프트웨어를 그대로 옮기기 어려운 경우가 있지만, 비용 절감 효과가 충분한 고객부터 Graviton을 쓰기 시작했습니다.',
    ],
    facts: [
      { text: 'BMW 그룹: 커넥티드카 서비스 서버를 Graviton으로 옮겨 연간 약 60만 달러 인프라 비용 절감(연환산 추정치)', claim: 'claim', src: ['aws-bmw-graviton'] },
      { text: '이전은 한 번에 하지 않고, x86 서버를 남겨 둔 채 팀별로 단계적으로 진행', claim: 'claim', src: ['aws-bmw-graviton'] },
    ],
    lesson: '코드를 옮기는 부담이 있어도 장기 운영비 절감이 크면 새 반도체를 고를 이유가 생깁니다. NVIDIA와 다른 하드웨어·소프트웨어라도 비용·효율 이점이 충분하면 고객을 설득할 수 있다는 뜻입니다.',
    caveat: 'AWS는 이미 거대한 자체 클라우드 고객 기반이 있어 초기 도입을 밀어붙이기 유리했습니다. 한국 NPU 스타트업은 이 조건이 없습니다.',
  },
  {
    id: 'android',
    title: 'C. Android — 더 큰 생태계를 새로 만들어 선두 교체',
    story: [
      'Nokia의 Symbian은 한때 세계 스마트폰 운영체제 시장의 강자였습니다.',
      'Google은 Android를 여러 제조사가 쓸 수 있는 플랫폼으로 만들었고, 삼성·HTC 등이 참여하면서 생태계가 빠르게 커졌습니다.',
    ],
    facts: [
      { text: '2010년 4분기 스마트폰 출하량에서 Android가 Symbian을 처음 추월(Canalys)', claim: 'fact', src: ['engadget-android'] },
    ],
    bars: {
      title: '2010년 4분기 스마트폰 플랫폼별 출하량 (Canalys, 백만 대)',
      unit: '백만 대',
      items: [
        { label: 'Android', value: 33.3, note: '33.3 (OMS·Tapas 포함, 일부 보도 32.9)' },
        { label: 'Symbian', value: 31.0, note: '31.0' },
      ],
      src: ['engadget-android'],
    },
    lesson: '후발주자가 기존 생태계보다 더 큰 생태계를 새로 만들 수도 있습니다. 개발자·파트너를 많이 끌어들이는 것이 핵심이었습니다.',
    caveat: '스마트폰 시장 자체가 폭발적으로 커지던 시기라 기존 강자의 지위가 빠르게 바뀔 수 있었습니다. 반도체 시장과 똑같이 보기는 어렵습니다.',
  },
];

export const strategies: { strategy: string; example: string; apply: string }[] = [
  { strategy: '기존 소프트웨어와의 호환성', example: 'AMD EPYC', apply: 'CUDA·PyTorch 등 기존 개발 환경에서 옮겨 오는 장벽을 낮추기' },
  { strategy: '확실한 비용 절감', example: 'AWS Graviton', apply: '같은 추론 작업의 총비용이 더 낮다는 것을 고객 환경에서 입증하기' },
  { strategy: '개발자·파트너 생태계 확대', example: 'Android', apply: 'SDK·프레임워크 지원과 클라우드·서버 회사 협력 넓히기' },
  { strategy: '특정 시장부터 공략', example: 'AMD · Graviton', apply: '학습 전체가 아니라 LLM 추론 시장에 먼저 집중하기' },
];

export const analysis = {
  pick: 'AWS Graviton',
  why: 'Graviton도 강력한 기존 소프트웨어 기반(x86)과 다른 설계를 썼지만, 특정 작업에서 비용 이점을 보여 주고 고객의 이전 부담을 줄이는 방식으로 채택을 넓혔습니다. 한국 NPU가 CUDA와 다른 환경에서 출발한다는 점에서 가장 닮았습니다.',
  steps: [
    'AI 추론이라는 특정 시장에서 실제 비용·성능 우위를 검증한다.',
    '고객이 모델을 쉽게 옮길 수 있도록 SDK와 기존 프레임워크 호환성을 높인다.',
    '대기업 시험 도입(PoC)을 실제 상용 서비스와 반복 구매로 연결한다.',
    '개발자와 클라우드 사업자가 스스로 지원하는 생태계를 넓힌다.',
  ],
  conclusion: 'CUDA처럼 강한 생태계가 이미 있어도 후발주자가 성공한 사례는 있습니다. 다만 NVIDIA와 경쟁하려면 칩 하나가 뛰어난 것만으로는 부족하고, 고객이 새 환경으로 옮길 이유와 옮기기 쉬운 방법을 함께 제공해야 합니다.',
};
