/**
 * 3D 탐색 부품 설명에 붙는 실제 사진 (모두 Wikimedia Commons의 자유 라이선스 사진).
 * 대부분 같은 역할을 하는 다른 제품의 사진이며, 캡션에 무엇을 찍은 사진인지 밝힙니다.
 * 퓨리오사AI RNGD 자체 사진은 저작권 문제로 싣지 않고 공식 페이지로 연결합니다.
 */
export interface Photo {
  src: string;
  alt: string;
  caption: string;
  author: string;
  license: string;
  page: string;
}

const T = (path: string) => `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}`;

const FIJI: Omit<Photo, 'alt' | 'caption'> = {
  src: T('e/e7/AMD_Fiji_GPU_package_with_GPU%2C_HBM_memory_and_interposer.jpg/960px-AMD_Fiji_GPU_package_with_GPU%2C_HBM_memory_and_interposer.jpg'),
  author: 'C. Spille / pcgameshardware.de',
  license: 'CC BY-SA 4.0',
  page: 'https://commons.wikimedia.org/wiki/File:AMD_Fiji_GPU_package_with_GPU,_HBM_memory_and_interposer.jpg',
};
const FIJI_NOTE = 'AMD Fiji GPU 패키지(가운데 칩 + HBM 4개 + 인터포저). RNGD는 같은 방식으로 칩 1개 옆에 HBM3 2개를 붙입니다.';

export const photos: Record<string, Photo> = {
  'dc-rack': {
    src: T('9/98/Cern_datacenter.jpg/960px-Cern_datacenter.jpg'),
    alt: '서버 랙이 줄지어 늘어선 데이터센터 내부',
    caption: 'CERN 데이터센터의 서버 랙 줄',
    author: 'Hugovanmeijeren',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:Cern_datacenter.jpg',
  },
  'dc-cool': {
    src: T('5/5f/CRAC_Cabinets_2.jpg/960px-CRAC_Cabinets_2.jpg'),
    alt: '데이터센터 바닥 위의 대형 냉각 장치 캐비닛',
    caption: '데이터센터 냉각 장치(CRAC). 바닥 아래로 찬 공기를 보냅니다.',
    author: 'Robert.Harker',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:CRAC_Cabinets_2.jpg',
  },
  'dc-net': {
    src: T('4/4d/Comp_lab_cables_20171121_131906.jpg/960px-Comp_lab_cables_20171121_131906.jpg'),
    alt: '천장 트레이와 랙으로 이어지는 수많은 네트워크 케이블',
    caption: '랙 위로 지나가는 네트워크 케이블 묶음',
    author: 'Kbh3rd',
    license: 'CC BY 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Comp_lab_cables_20171121_131906.jpg',
  },
  'rack-server': {
    src: T('6/69/Wikimedia_Foundation_Servers-8055_35.jpg/960px-Wikimedia_Foundation_Servers-8055_35.jpg'),
    alt: '랙에 위아래로 꽂힌 서버들',
    caption: '랙에 서랍처럼 꽂힌 서버들 (위키미디어 재단 서버 — NXT RNGD 서버 아님)',
    author: 'Victor Grigas',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:Wikimedia_Foundation_Servers-8055_35.jpg',
  },
  'rack-switch': {
    src: T('1/1a/DE-CIX_GERMANY_-_Switch_Rack_%286218137120%29.jpg/960px-DE-CIX_GERMANY_-_Switch_Rack_%286218137120%29.jpg'),
    alt: '인터넷 교환 시설의 네트워크 스위치 랙',
    caption: '네트워크 스위치가 들어 있는 랙 (DE-CIX 인터넷 교환 시설)',
    author: 'Stefan Funke',
    license: 'CC BY-SA 2.0',
    page: 'https://commons.wikimedia.org/wiki/File:DE-CIX_GERMANY_-_Switch_Rack_(6218137120).jpg',
  },
  'rack-power': {
    src: T('f/fa/Schleifenbauer_PDU_Power_Distribution_Unit_in_operation.jpg/960px-Schleifenbauer_PDU_Power_Distribution_Unit_in_operation.jpg'),
    alt: '랙 양옆에 세로로 달린 전원 분배 장치',
    caption: '랙 양옆에 세로로 달린 전원 분배 장치(PDU)',
    author: 'Schleifenbauer',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Schleifenbauer_PDU_Power_Distribution_Unit_in_operation.jpg',
  },
  'srv-card': {
    src: T('b/be/Tensor_Processing_Unit_3.0.jpg/960px-Tensor_Processing_Unit_3.0.jpg'),
    alt: 'Google TPU v3 가속기 보드',
    caption: 'AI 가속기 보드의 예: Google TPU v3 (RNGD 아님)',
    author: 'Zinskauf',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Tensor_Processing_Unit_3.0.jpg',
  },
  'srv-cpu': {
    src: T('a/a1/Amd_epyc_7302_top_side_IMGP3332_smial_wp.jpg/960px-Amd_epyc_7302_top_side_IMGP3332_smial_wp.jpg'),
    alt: 'AMD EPYC 서버용 CPU 윗면',
    caption: '서버용 CPU의 예: AMD EPYC 7302 (NXT RNGD 서버는 EPYC 9354 사용 보도)',
    author: 'Smial',
    license: 'FAL',
    page: 'https://commons.wikimedia.org/wiki/File:Amd_epyc_7302_top_side_IMGP3332_smial_wp.jpg',
  },
  'srv-mem': {
    src: T('9/93/SK_Hynix_DDR5_form_factors.jpg/960px-SK_Hynix_DDR5_form_factors.jpg'),
    alt: '여러 형태의 DDR5 메모리 모듈',
    caption: 'SK하이닉스 DDR5 서버 메모리 모듈 종류',
    author: '4300streetcar',
    license: 'CC BY 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:SK_Hynix_DDR5_form_factors.jpg',
  },
  'srv-fan': {
    src: T('c/c2/1U_rack_mount_server_cooling_system_fan_heat-sink.jpg/960px-1U_rack_mount_server_cooling_system_fan_heat-sink.jpg'),
    alt: '뚜껑을 연 서버 내부의 팬 줄과 방열판',
    caption: '뚜껑을 연 랙 서버 내부 — 아래쪽에 팬이 한 줄로 서 있습니다',
    author: 'Tobias Maier',
    license: 'CC0',
    page: 'https://commons.wikimedia.org/wiki/File:1U_rack_mount_server_cooling_system_fan_heat-sink.jpg',
  },
  'srv-pcie': {
    src: T('e/ed/GigabyteH170-HD3-PCH-and-Slots.jpg/960px-GigabyteH170-HD3-PCH-and-Slots.jpg'),
    alt: '메인보드의 PCIe 슬롯',
    caption: '메인보드의 PCIe 슬롯 (PC용 — 서버도 같은 규격의 슬롯 사용)',
    author: 'TheStriker',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:GigabyteH170-HD3-PCH-and-Slots.jpg',
  },
  'brd-heat': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Moderate-Pin-Fin-Heatsink-Aluminium-.jpg',
    alt: '금속 핀이 촘촘한 알루미늄 방열판',
    caption: '알루미늄 방열판 — 표면적을 넓혀 열을 공기로 내보냅니다',
    author: 'Sebastian high',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:Moderate-Pin-Fin-Heatsink-Aluminium-.jpg',
  },
  'brd-pcb': {
    src: T('9/93/Printed_Circuit_Board.jpg/960px-Printed_Circuit_Board.jpg'),
    alt: '부품이 납땜된 인쇄회로기판',
    caption: '인쇄회로기판(PCB)의 예',
    author: 'Zephyris',
    license: 'CC BY-SA 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:Printed_Circuit_Board.jpg',
  },
  'brd-edge': {
    src: T('5/57/Sapphire_Radeon_HD_5870_%E2%80%93_PCIe_x16_connection_PNr%C2%B00314.jpg/960px-Sapphire_Radeon_HD_5870_%E2%80%93_PCIe_x16_connection_PNr%C2%B00314.jpg'),
    alt: '그래픽카드 아래쪽의 금색 PCIe x16 단자',
    caption: '카드 아래쪽의 금색 PCIe x16 단자 (그래픽카드)',
    author: 'D-Kuru',
    license: 'CC BY-SA 3.0 AT',
    page: 'https://commons.wikimedia.org/wiki/File:Sapphire_Radeon_HD_5870_%E2%80%93_PCIe_x16_connection_PNr%C2%B00314.jpg',
  },
  'brd-vrm': {
    src: T('1/11/Voltage_regulator_module_on_a_computer_motherboard.jpg/960px-Voltage_regulator_module_on_a_computer_motherboard.jpg'),
    alt: '메인보드 위의 전원 회로(인덕터와 커패시터)',
    caption: '전원 회로(VRM)의 예 — 검은 사각형이 인덕터입니다',
    author: 'Dsimic',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Voltage_regulator_module_on_a_computer_motherboard.jpg',
  },
  'brd-power': {
    src: T('f/fc/Intel_Arc_Pro_B70_-_side_view_with_8-pin_power_connector.jpg/960px-Intel_Arc_Pro_B70_-_side_view_with_8-pin_power_connector.jpg'),
    alt: '카드 끝에 있는 8핀 보조 전원 커넥터',
    caption: '보조 전원 커넥터의 예: 8핀 단자가 달린 GPU 카드',
    author: 'Biggo Finance',
    license: 'CC BY-SA 4.0',
    page: 'https://commons.wikimedia.org/wiki/File:Intel_Arc_Pro_B70_-_side_view_with_8-pin_power_connector.jpg',
  },
  'pkg-die': { ...FIJI, alt: '가운데 큰 연산 칩과 옆의 HBM 메모리', caption: `가운데 큰 사각형이 연산 칩(다이). ${FIJI_NOTE}` },
  'pkg-hbm': { ...FIJI, alt: '연산 칩 양옆의 작은 HBM 메모리 스택', caption: `칩 옆의 작은 사각형 4개가 HBM 스택. ${FIJI_NOTE}` },
  'pkg-interposer': { ...FIJI, alt: '칩과 HBM 아래의 은색 인터포저', caption: `칩과 HBM을 받치는 은색 판이 인터포저. ${FIJI_NOTE}` },
  'pkg-sub': { ...FIJI, alt: '인터포저 아래의 녹색 패키지 기판', caption: `가장 바깥의 초록색 판이 패키지 기판. ${FIJI_NOTE}` },
  'die-pe': {
    src: T('0/0c/ATI_RV350_die_shot_-_39650393583.jpg/960px-ATI_RV350_die_shot_-_39650393583.jpg'),
    alt: '칩 내부 회로가 보이는 다이 사진',
    caption: '칩 다이를 확대한 사진(ATI RV350 그래픽 칩) — 반복되는 연산 블록이 보입니다. RNGD 아님',
    author: 'Martijn Boer',
    license: 'Public domain',
    page: 'https://commons.wikimedia.org/wiki/File:ATI_RV350_die_shot_-_39650393583.jpg',
  },
  'die-sram': {
    src: T('4/4b/STM32F103VGT6-SRAM.jpg/960px-STM32F103VGT6-SRAM.jpg'),
    alt: '규칙적인 격자로 보이는 SRAM 영역 현미경 사진',
    caption: 'SRAM 영역의 현미경 사진(마이크로컨트롤러) — 같은 셀이 격자처럼 반복됩니다',
    author: 'ZeptoBars',
    license: 'CC BY 3.0',
    page: 'https://commons.wikimedia.org/wiki/File:STM32F103VGT6-SRAM.jpg',
  },
};

/** 사진이 없는 부품에 대한 안내 */
export const noPhotoNote: Record<string, string> = {
  'die-noc': '칩 내부 연결망은 사진으로 구분하기 어려워 싣지 않았습니다.',
  'die-phy': 'HBM 연결부는 공개된 RNGD 다이 사진이 없어 싣지 않았습니다.',
};

/** 실제 RNGD 외관은 공식 페이지에서 */
export const officialPhotoLink = { label: '실제 RNGD 카드·서버 사진은 퓨리오사AI 공식 페이지에서', url: 'https://furiosa.ai/rngd' };
