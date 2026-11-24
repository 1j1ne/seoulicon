/**
 * 확대 여행 단계별 설명(데이터센터 → 칩 내부). 3D 장면은 퓨리오사AI RNGD(한국 NPU) 서버·카드의 공개 형상을 기준으로 재현했고,
 * 공개되지 않은 치수·내부 배치는 근사 또는 개념 모형입니다.
 */
import type { ClaimKind } from './meta';

export type PartRole = 'compute' | 'memory' | 'link' | 'package' | 'cooling' | 'other';

export const ROLE_LABEL: Record<PartRole, string> = {
  compute: '연산 코어',
  memory: '메모리',
  link: '연결 통로',
  package: '패키지·기판',
  cooling: '냉각 장치',
  other: '기타',
};

export interface Part {
  id: string;
  name: string;
  role: PartRole;
  what: string;
  why: string;
}

export interface Fact {
  text: string;
  claim: ClaimKind;
  src: string[];
}

/** reproduced: 공개 자료 기반 재현(치수 근사) · concept: 개념 모형 */
export type Fidelity = 'reproduced' | 'concept';

export interface Level {
  id: string;
  path: 'dc';
  title: string;
  scale: string;
  caption: string;
  fidelity: Fidelity;
  fidelityNote: string;
  facts: Fact[];
  parts: Part[];
}

export const levels: Level[] = [
  {
    id: 'dc',
    path: 'dc',
    title: '데이터센터',
    scale: '건물 · 수십 m',
    caption: '질문을 보내면 이 건물 안 수많은 서버 중 일부가 답을 계산합니다. 스크롤하면 가운데 줄의 랙 하나로 들어갑니다.',
    fidelity: 'concept',
    fidelityNote: '홀 배치는 일반적인 데이터센터를 단순화한 개념 모형',
    facts: [],
    parts: [
      { id: 'dc-rack', name: '서버 랙 줄', role: 'other', what: '서버를 쌓아 둔 철제 캐비닛이 줄지어 있습니다.', why: '같은 공간에 최대한 많은 계산 장비를 넣기 위해서입니다.' },
      { id: 'dc-cool', name: '냉각 설비', role: 'cooling', what: '찬 공기를 랙 앞쪽으로 보내고 뜨거운 공기를 빼냅니다.', why: 'AI 칩은 쓰는 전기를 거의 모두 열로 내보냅니다. 식히지 않으면 멈춥니다.' },
      { id: 'dc-net', name: '케이블 트레이(네트워크)', role: 'link', what: '랙 위로 광케이블이 지나가는 선반입니다.', why: '서버끼리, 그리고 인터넷과 데이터를 주고받는 길입니다.' },
    ],
  },
  {
    id: 'rack',
    path: 'dc',
    title: '서버 랙',
    scale: '높이 약 2 m (42U)',
    caption: '랙 문을 열면 NXT RNGD 서버가 위아래로 쌓여 있습니다. 랙 하나가 쓸 수 있는 전력이 정해져 있어 몇 대를 넣을지가 결정됩니다.',
    fidelity: 'reproduced',
    fidelityNote: '서버 높이(4U)·대수는 공개 자료 기반, 랙 내부 배치는 근사',
    facts: [
      { text: '표준 15 kW 공랭 랙에 NXT RNGD 서버 최대 5대', claim: 'claim', src: ['abit-rngd'] },
    ],
    parts: [
      { id: 'rack-server', name: 'NXT RNGD 서버(4U)', role: 'other', what: '서랍처럼 꽂힌 서버 본체. 1U는 4.445 cm입니다.', why: '랙 전력 한도 ÷ 서버 전력 = 넣을 수 있는 서버 수입니다.' },
      { id: 'rack-switch', name: '네트워크 스위치', role: 'link', what: '랙 안 서버를 서로·외부와 연결하는 교차로입니다.', why: '여러 서버가 일을 나눠 할 때 결과를 주고받습니다.' },
      { id: 'rack-power', name: '전원 분배 장치(PDU)', role: 'other', what: '건물 전기를 각 서버에 나눠 주는 긴 콘센트 막대입니다.', why: '랙당 전력 한도를 넘지 않도록 관리합니다.' },
    ],
  },
  {
    id: 'server',
    path: 'dc',
    title: 'NXT RNGD 서버',
    scale: '4U · 높이 약 17.8 cm',
    caption: '서버를 레일로 앞으로 빼내 뚜껑을 연 모습입니다. 앞쪽 팬이 바람을 불어 뒤쪽 카드 8장을 식힙니다.',
    fidelity: 'reproduced',
    fidelityNote: '카드 8장·CPU 2개·공랭 구조는 공개 자료 기반, 부품 위치는 근사',
    facts: [
      { text: '4U 크기에 RNGD 카드 8장, 약 3 kW, 공랭', claim: 'claim', src: ['abit-rngd', 'furiosa-rngd'] },
      { text: 'CPU: AMD EPYC 9354 ×2, DDR5 1 TB (보도)', claim: 'unverified', src: ['abit-rngd'] },
    ],
    parts: [
      { id: 'srv-card', name: 'RNGD 카드 ×8', role: 'compute', what: 'NPU 칩이 올라간 가속기 카드입니다.', why: 'AI 계산 대부분이 여기서 일어납니다. 다음 단계에서 한 장을 꺼내 봅니다.' },
      { id: 'srv-cpu', name: 'CPU ×2 + 방열판', role: 'compute', what: '서버 전체를 지휘하는 범용 프로세서입니다.', why: '요청을 받아 카드에 일을 나누고 결과를 모읍니다.' },
      { id: 'srv-mem', name: '메모리(DDR5)', role: 'memory', what: 'CPU가 쓰는 주 메모리입니다.', why: '카드로 보낼 데이터와 모델 파일을 잠시 담아 둡니다.' },
      { id: 'srv-fan', name: '팬', role: 'cooling', what: '앞에서 뒤로 바람을 밀어내는 팬 벽입니다.', why: 'RNGD는 팬이 없는 패시브 카드라 서버 팬 바람으로 식습니다.' },
      { id: 'srv-pcie', name: 'PCIe 라이저', role: 'link', what: 'CPU와 카드를 잇는 표준 슬롯입니다.', why: '데이터와 명령이 카드로 들어가는 통로입니다.' },
    ],
  },
  {
    id: 'card',
    path: 'dc',
    title: 'RNGD 카드',
    scale: '길이 약 24 cm',
    caption: '카드 한 장을 위로 꺼냈습니다. 팬 없이 금속 방열판만 붙은 듀얼 슬롯 카드입니다.',
    fidelity: 'reproduced',
    fidelityNote: '듀얼 슬롯·풀하이트·패시브 냉각은 공개 자료 기반. 외관 디자인·길이·부품 배치는 근사',
    facts: [
      { text: 'PCIe Gen5 x16, 듀얼 슬롯·풀하이트, 패시브 냉각', claim: 'fact', src: ['furiosa-rngd', 'furiosa-datasheet'] },
      { text: '카드 길이 3/4 규격 — 2차 자료 기준, 모형 길이는 근사', claim: 'unverified', src: [] },
      { text: '최대 전력 180 W (초기 자료·데이터시트 일부는 150 W)', claim: 'fact', src: ['furiosa-rngd', 'furiosa-datasheet'] },
    ],
    parts: [
      { id: 'brd-heat', name: '패시브 방열판', role: 'cooling', what: '얇은 금속 핀이 촘촘히 붙은 냉각판입니다.', why: '칩 열을 넓은 면적으로 퍼뜨려, 서버 팬 바람에 실어 보냅니다.' },
      { id: 'brd-pcb', name: '카드 기판(PCB)', role: 'package', what: '부품을 올리고 배선을 연결하는 판입니다.', why: '칩·전원·단자를 하나로 묶습니다.' },
      { id: 'brd-edge', name: 'PCIe Gen5 x16 단자', role: 'link', what: '서버 슬롯에 꽂히는 금색 단자입니다.', why: 'CPU와 데이터를 주고받는 출입구입니다.' },
      { id: 'brd-vrm', name: '전원 회로', role: 'other', what: '전압을 칩이 쓰는 낮은 전압으로 바꾸는 인덕터·커패시터입니다.', why: '칩은 매우 낮은 전압에 큰 전류가 필요합니다.' },
      { id: 'brd-power', name: '보조 전원 커넥터(위치 근사)', role: 'other', what: '슬롯 전력 외에 추가 전기를 받는 단자입니다.', why: '슬롯만으로는 180 W를 다 공급할 수 없습니다.' },
    ],
  },
  {
    id: 'package',
    path: 'dc',
    title: '반도체 패키지',
    scale: '약 6~7 cm (근사)',
    caption: '방열판을 들어 올리면 패키지가 보입니다. 하나의 인터포저 위에 연산 칩과 HBM3 메모리 두 탑이 나란히 붙어 있습니다.',
    fidelity: 'reproduced',
    fidelityNote: '칩 1개 + HBM3 2스택 + 인터포저(2.5D) 구성은 공개 자료 기반. 패키지·다이 크기는 비공개라 근사',
    facts: [
      { text: '2.5D 패키징: 하나의 인터포저 위에 칩과 HBM 통합', claim: 'fact', src: ['chipsandcheese-rngd'] },
      { text: 'SK하이닉스 HBM3 2스택, 합계 48 GB · 1.5 TB/s', claim: 'fact', src: ['chipsandcheese-rngd', 'furiosa-rngd'] },
      { text: 'TSMC 5 nm 공정', claim: 'fact', src: ['furiosa-hotchips'] },
    ],
    parts: [
      { id: 'pkg-die', name: '연산 칩 다이 (NPU)', role: 'compute', what: '실제 계산 회로가 새겨진 실리콘 조각으로, 이것이 NPU입니다.', why: 'AI 모델의 곱셈·덧셈을 수행하는 핵심입니다.' },
      { id: 'pkg-hbm', name: 'HBM3 스택 ×2', role: 'memory', what: 'D램을 여러 층 쌓아 칩 바로 옆에 붙인 고대역 메모리입니다.', why: '거리가 짧고 통로가 넓어 모델 숫자를 아주 빨리 읽습니다.' },
      { id: 'pkg-interposer', name: '인터포저', role: 'link', what: '칩과 HBM을 수천 가닥 미세 배선으로 잇는 얇은 실리콘 판입니다.', why: '일반 기판으로는 이만큼 촘촘한 배선을 만들 수 없습니다.' },
      { id: 'pkg-sub', name: '패키지 기판', role: 'package', what: '전체를 받치고 카드 기판과 연결하는 바닥판입니다.', why: '부품을 보호하고 전기·신호를 카드로 전달합니다.' },
    ],
  },
  {
    id: 'die',
    path: 'dc',
    title: '칩 내부 개념도',
    scale: '손톱 크기 실리콘',
    caption: '칩 내부 배치는 공개되지 않았습니다. RNGD가 “여러 연산 슬라이스를 연결망으로 묶어 큰 하나처럼, 또는 여러 개로 나눠 쓴다”는 공개 설명만 개념적으로 표현했습니다.',
    fidelity: 'concept',
    fidelityNote: '내부 블록 수·위치·크기는 실제가 아닌 개념 모형',
    facts: [
      { text: '텐서 축약 프로세서(TCP) 구조: 슬라이스를 연결망으로 묶어 하나 또는 여러 처리 단위로 구성', claim: 'fact', src: ['tcp-micro25'] },
      { text: '온칩 SRAM 256 MB', claim: 'fact', src: ['furiosa-rngd'] },
    ],
    parts: [
      { id: 'die-pe', name: '연산 슬라이스', role: 'compute', what: '곱셈·덧셈 장치를 모은 계산 구역입니다.', why: 'AI 계산은 같은 종류의 계산을 대량으로 동시에 해야 합니다.' },
      { id: 'die-sram', name: '온칩 SRAM', role: 'memory', what: '칩 안에 있는 작고 매우 빠른 저장 공간입니다.', why: 'HBM까지 가지 않고 자주 쓰는 데이터를 곁에 둬 전기와 시간을 아낍니다.' },
      { id: 'die-noc', name: '내부 연결망', role: 'link', what: '슬라이스와 메모리 사이 데이터를 나르는 도로망입니다.', why: '데이터가 제때 오지 않으면 연산기가 놀게 됩니다.' },
      { id: 'die-phy', name: 'HBM 연결부', role: 'link', what: '칩 가장자리에서 HBM과 신호를 주고받는 회로입니다.', why: '칩 밖 메모리로 나가는 고속 출입구입니다.' },
    ],
  },
];
