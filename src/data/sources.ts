/**
 * 출처 레지스트리 — 모든 수치·기업 주장은 여기 id로 연결됩니다.
 * 자료를 갱신할 때는 이 파일과 각 데이터 파일만 수정하면 화면이 자동으로 바뀝니다.
 *
 * type
 *  - official    : 기업 공식 문서·보도자료·제품 페이지
 *  - independent : 독립 벤치마크·표준 단체(MLCommons 등)
 *  - press       : 언론 보도(기업 발표를 인용한 경우 포함)
 *  - secondary   : 2차 집계·분석 사이트(교차 확인 필요)
 */
export type SourceType = 'official' | 'independent' | 'press' | 'secondary';

export interface Source {
  title: string;
  publisher: string;
  url: string;
  /** 발표·게시 날짜. 정확한 일자를 모르면 연-월 또는 연도만 */
  date: string;
  type: SourceType;
}

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  official: '공식',
  independent: '독립 검증',
  press: '언론',
  secondary: '2차 자료',
};

export const sources: Record<string, Source> = {
  /* ───────── Rebellions ───────── */
  'rbln-atommax-brief': {
    title: 'ATOM-Max CA25 Product Brief 2025',
    publisher: 'Rebellions',
    url: 'https://rebellions.ai/wp-content/uploads/2024/11/Rebellions_ATOM-Max_CA25_Product-brief_2025.pdf',
    date: '2025',
    type: 'official',
  },
  'rbln-atommax-server': {
    title: 'ATOM-Max Server Brochure v1.4',
    publisher: 'Rebellions',
    url: 'https://rebellions.ai/wp-content/uploads/2025/08/RebellionsATOM-Max-server_brochure_v1.4_EN.pdf',
    date: '2025-08',
    type: 'official',
  },
  'rbln-rebel100': {
    title: 'Hierarchies of Interconnects Are as Important as Compute and Memory (Rebel100)',
    publisher: 'Rebellions',
    url: 'https://rebellions.ai/rebel100-chiplet-interconnects/',
    date: '2026',
    type: 'official',
  },
  'toms-isscc-rebel100': {
    title: 'ISSCC 2026: Rebellions details quad-chiplet AI solution with UCIe (Rebel100)',
    publisher: "Tom's Hardware",
    url: 'https://www.tomshardware.com/tech-industry/semiconductors/isscc-2026-rebellions-ucie-rebel-100',
    date: '2026-02',
    type: 'press',
  },
  'aac-rebellions-ceo': {
    title: "Exclusive CEO Interview: Rebellions' NPU Leverages Memory-Centric Chiplets",
    publisher: 'All About Circuits',
    url: 'https://www.allaboutcircuits.com/news/exclusive-ceo-interview-rebellions-npu-leverages-memory-centric-chiplets/',
    date: '2026',
    type: 'press',
  },
  'inferencechips-rbln': {
    title: 'Rebellions: Rebel100, RebelRack and Korea’s Sovereign AI Chip Champion',
    publisher: 'InferenceChips (트래커)',
    url: 'https://www.inferencechips.com/companies/rebellions/',
    date: '2026',
    type: 'secondary',
  },
  'cnbc-rbln-400m': {
    title: 'Samsung-backed AI chip firm Rebellions raises $400 million ahead of IPO',
    publisher: 'CNBC',
    url: 'https://www.cnbc.com/2026/03/30/ai-chip-startup-rebellions-raises-400-million-ipo.html',
    date: '2026-03-30',
    type: 'press',
  },
  'kh-rbln-revenue': {
    title: 'AI stock market boom brews as unicorns eye Korea listings',
    publisher: 'The Korea Herald',
    url: 'https://www.koreaherald.com/article/10711794',
    date: '2026',
    type: 'press',
  },
  'wiki-rbln': {
    title: 'Rebellions (company)',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Rebellions_(company)',
    date: '2026 열람',
    type: 'secondary',
  },
  'wowtale-procurement': {
    title: 'Rebellions secures public procurement fast track (ATOM-Max innovative product)',
    publisher: 'WOWTALE',
    url: 'https://en.wowtale.net/2026/08/18/234768/',
    date: '2026-08-18',
    type: 'press',
  },
  'sedaily-ktcloud': {
    title: 'KT Cloud launches public-sector NPU server using Rebellions chips',
    publisher: 'Seoul Economic Daily',
    url: 'https://en.sedaily.com/news/2026/06/04/kt-cloud-launches-public-sector-npu-server-using-rebellions',
    date: '2026-06-04',
    type: 'press',
  },
  'tc-rbln-2024': {
    title: 'Rebellions lands $124M for AI chip REBEL in collab with Samsung',
    publisher: 'TechCrunch',
    url: 'https://techcrunch.com/2024/01/29/rebellions-lands-124m-for-ai-chip-rebel-in-collab-with-samsung/',
    date: '2024-01-29',
    type: 'press',
  },
  'kt-rbln-masspro': {
    title: 'Rebellions seeks to become first Korean startup to mass-produce AI chips for language models',
    publisher: 'The Korea Times',
    url: 'https://www.koreatimes.co.kr/business/tech-science/20240316/rebellions-seeks-to-become-first-korean-startup-to-mass-produce-ai-chips-for-language-models',
    date: '2024-03-16',
    type: 'press',
  },
  'semifive-rbln': {
    title: 'SEMIFIVE announces commercialization of its 5nm HPC SoC Platform with lead partner Rebellions',
    publisher: 'SEMIFIVE (Business Wire)',
    url: 'https://businesswire.com/news/home/20230626820934/en/SEMIFIVE-announces-commercialization-of-its-5nm-HPC-SoC-Platform-with-lead-partner-Rebellions-AI-Chipmaker-startup-based-in-Korea',
    date: '2023-06-26',
    type: 'official',
  },
  'ked-mlperf': {
    title: 'Rebellions beats global chip giants in MLPerf tests',
    publisher: 'KED Global',
    url: 'https://www.kedglobal.com/korean-chipmakers/newsView/ked202304070010',
    date: '2023-04-07',
    type: 'press',
  },
  'kt-skt-pilot': {
    title: 'SK Telecom to pilot Rebellions NPU for AI services',
    publisher: 'The Korea Times',
    url: 'https://www.koreatimes.co.kr/amp/business/tech-science/20250625/sk-telecom-to-pilot-rebellions-npu-for-ai-services',
    date: '2025-06-25',
    type: 'press',
  },
  'rcr-skt': {
    title: 'Rebellions NPUs now run four SK Telecom AI services',
    publisher: 'RCR Wireless',
    url: 'https://rcrwireless.com/20260922/ai/rebellions-npus-sk-telecom',
    date: '2026-09-22',
    type: 'press',
  },
  'hpcwire-aiand': {
    title: 'Rebellions and ai& partner to bring energy-efficient AI inference infrastructure to Japan',
    publisher: 'HPCwire (보도자료 전재)',
    url: 'https://www.hpcwire.com/off-the-wire/rebellions-and-ai-partner-to-bring-energy-efficient-ai-inference-infrastructure-to-japan/',
    date: '2026-09-15',
    type: 'official',
  },
  'jpr-rbln': {
    title: 'Rebellions bets on memory-centric AI inference',
    publisher: 'Jon Peddie Research',
    url: 'https://www.jonpeddie.com/news/rebellions-bets-on-memory-centric-ai-inference/',
    date: '2026',
    type: 'press',
  },

  /* ───────── FuriosaAI ───────── */
  'furiosa-rngd': {
    title: 'RNGD 제품 페이지',
    publisher: 'FuriosaAI',
    url: 'https://furiosa.ai/rngd',
    date: '2026 열람',
    type: 'official',
  },
  'furiosa-devdoc': {
    title: 'FuriosaAI RNGD — Developer documentation',
    publisher: 'FuriosaAI',
    url: 'https://developer.furiosa.ai/latest/en/overview/rngd.html',
    date: '2026 열람',
    type: 'official',
  },
  'furiosa-hotchips': {
    title: 'FuriosaAI unveils RNGD at Hot Chips 2024',
    publisher: 'FuriosaAI',
    url: 'https://furiosa.ai/blog/furiosaai-rngd-hot-chips-2024',
    date: '2024-08',
    type: 'official',
  },
  'converge-rngd': {
    title: 'FuriosaAI reveals high-efficiency RNGD chip for AI inference',
    publisher: 'Converge Digest',
    url: 'https://convergedigest.com/furiosaai-reveals-high-efficiency-rngd-chip-for-ai-inference/',
    date: '2024',
    type: 'press',
  },
  'furiosa-seriesd': {
    title: 'FuriosaAI closes $620 million Series D',
    publisher: 'FuriosaAI',
    url: 'https://furiosa.ai/blog/furiosaai-620-million-series-d',
    date: '2026-11',
    type: 'official',
  },
  'thelec-rngd-masspro': {
    title: 'FuriosaAI to mass produce second-gen AI chip, supply to Samsung SDS cloud',
    publisher: 'The Elec',
    url: 'https://www.thelec.net/news/articleView.html?idxno=6320',
    date: '2026',
    type: 'press',
  },
  'reg-lg': {
    title: 'How AI chip upstart FuriosaAI won over LG with its power-sipping design',
    publisher: 'The Register',
    url: 'https://www.theregister.com/2025/07/22/sk_furiosa_ai_lg/',
    date: '2025-07-22',
    type: 'press',
  },
  'tc-lg': {
    title: 'Instead of selling to Meta, AI chip startup FuriosaAI signed a huge customer',
    publisher: 'TechCrunch',
    url: 'https://techcrunch.com/2025/07/21/instead-of-selling-to-meta-ai-chip-startup-furiosaai-signed-a-huge-customer',
    date: '2025-07-21',
    type: 'press',
  },
  'sds-npuaas': {
    title: 'Samsung SDS officially launches Korean NPU-based NPUaaS',
    publisher: 'Samsung SDS',
    url: 'https://www.samsungsds.com/en/news/1295097_5252.html',
    date: '2026-07-20',
    type: 'official',
  },
  'furiosa-sds': {
    title: 'FuriosaAI and Samsung SDS launch Korea’s first domestic NPUaaS',
    publisher: 'FuriosaAI',
    url: 'https://furiosa.ai/blog/furiosaai-and-samsung-sds',
    date: '2026-07',
    type: 'official',
  },
  'dcd-sweden': {
    title: 'Velox, I/ONX HPC to deploy 7,000 FuriosaAI RNGD accelerators at Swedish data center',
    publisher: 'DatacenterDynamics',
    url: 'https://www.datacenterdynamics.com/en/news/velox-ionx-hpc-to-deploy-7000-furiosaai-rngd-accelerators-at-swedish-data-center/',
    date: '2026-08',
    type: 'press',
  },
  'dt-sweden': {
    title: 'FuriosaAI to build 15MW data centre in Sweden with RNGD',
    publisher: 'Digital Today',
    url: 'https://www.digitaltoday.co.kr/en/view/89363/furiosaai-to-build-15mw-data-centre-in-sweden-with-rngd',
    date: '2026-08',
    type: 'press',
  },


  /* ───────── RNGD 형상 재현 근거 ───────── */
  'chipsandcheese-rngd': {
    title: "FuriosaAI's RNGD at Hot Chips 2024: Accelerating AI with a More Flexible Primitive",
    publisher: 'Chips and Cheese',
    url: 'https://chipsandcheese.com/p/furiosaais-rngd-at-hot-chips-2024-accelerating-ai-with-a-more-flexible-primitive',
    date: '2024-08',
    type: 'press',
  },
  'furiosa-datasheet': {
    title: 'RNGD Datasheet v1 — Powerfully Efficient AI Inference',
    publisher: 'FuriosaAI (전시회 배포 자료)',
    url: 'https://pub-mediabox-storage.rxweb-prd.com/exhibitor/products/exh-ea295036-8336-4ace-961d-28a779a97c5b/product-documents/pro-328d2fde-59b9-487e-9438-9d2650177140/85a1012f-80a5-4d3c-b73c-5adf122cf7fd.pdf',
    date: '열람 2026',
    type: 'official',
  },
  'abit-rngd': {
    title: 'FuriosaAI begins mass production of RNGD AI accelerators',
    publisher: 'abit.ee',
    url: 'https://abit.ee/en/graphics-cards/furiosaai-rngd-ai-accelerator-hbm3-energy-efficiency-data-center-air-cooling-nvidia-h100-alternative-en',
    date: '2026',
    type: 'secondary',
  },
  'tcp-micro25': {
    title: 'Tensor Contraction Processor (RNGD) — IEEE Micro paper',
    publisher: 'FuriosaAI 연구진 (IEEE Micro)',
    url: 'https://web.ist.utl.pt/nuno.lopes/pubs/tcp-micro25.pdf',
    date: '2025',
    type: 'official',
  },

  /* ───────── NVIDIA ───────── */
  'nv-h200': {
    title: 'NVIDIA H200 Tensor Core GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/h200/',
    date: '2026 열람',
    type: 'official',
  },
  'nv-l40s': {
    title: 'NVIDIA L40S GPU',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/l40s/',
    date: '2026 열람',
    type: 'official',
  },
  'nv-hgx': {
    title: 'NVIDIA HGX Platform (HGX B300)',
    publisher: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/data-center/hgx/',
    date: '2026 열람',
    type: 'official',
  },
  'spheron-b300': {
    title: 'NVIDIA B300 Specs: 288GB Blackwell Ultra',
    publisher: 'Spheron (클라우드 사업자 블로그)',
    url: 'https://www.spheron.network/blog/nvidia-b300-blackwell-ultra-guide/',
    date: '2026',
    type: 'secondary',
  },
  'dcd-blackwell': {
    title: 'Nvidia fixes Blackwell design issue, expects to ship several billion dollars’ worth in Q4',
    publisher: 'DatacenterDynamics',
    url: 'https://www.datacenterdynamics.com/en/news/nvidia-fixes-blackwell-design-issue-expects-to-ship-several-billion-dollars-worth-of-the-new-gpus-in-q4',
    date: '2024-08',
    type: 'press',
  },

  /* ───────── AMD ───────── */
  'amd-mi355x': {
    title: 'AMD Instinct MI355X',
    publisher: 'AMD',
    url: 'https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html',
    date: '2026 열람',
    type: 'official',
  },
  'amd-openai': {
    title: 'AMD and OpenAI announce strategic partnership to deploy 6 gigawatts of AMD GPUs',
    publisher: 'AMD',
    url: 'https://ir.amd.com/news-events/press-releases/detail/1260/amd-and-openai-announce-strategic-partnership-to-deploy-6-gigawatts-of-amd-gpus',
    date: '2025-10-06',
    type: 'official',
  },
  'techinsider-helios': {
    title: 'AMD Advancing AI 2026: Helios rack in production ramp',
    publisher: 'Tech Insider',
    url: 'https://tech-insider.org/amd-advancing-ai-2026/',
    date: '2026',
    type: 'secondary',
  },

  /* ───────── Google ───────── */
  'google-ironwood': {
    title: '3 things to know about Ironwood, our latest TPU',
    publisher: 'Google',
    url: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-google-tpu-things-to-know/',
    date: '2025',
    type: 'official',
  },
  'gcp-ironwood-ga': {
    title: 'Announcing Ironwood TPUs general availability and new Axion VMs',
    publisher: 'Google Cloud',
    url: 'https://cloud.google.com/blog/products/compute/ironwood-tpus-and-new-axion-based-vms-for-your-ai-workloads',
    date: '2025-11-06',
    type: 'official',
  },
  'reg-ironwood': {
    title: 'Google offers 7th-gen Ironwood TPUs for AI',
    publisher: 'The Register',
    url: 'https://www.theregister.com/2025/04/10/googles_7thgen_ironwood_tpus_debut/',
    date: '2025-04-10',
    type: 'press',
  },
  'anthropic-tpu': {
    title: 'Expanding our use of Google Cloud TPUs and services',
    publisher: 'Anthropic',
    url: 'https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services',
    date: '2025-10-23',
    type: 'official',
  },
  'techi-ironwood-price': {
    title: "Google's Ironwood TPU still has no public price",
    publisher: 'TECHi',
    url: 'https://www.techi.com/google-ironwood-tpu-no-public-price/',
    date: '2026',
    type: 'secondary',
  },
  'shattered-ironwood': {
    title: 'Google puts $12/hr price on Ironwood TPU',
    publisher: 'shattered.io',
    url: 'https://shattered.io/google-ironwood-tpu-pricing-vs-nvidia-2026/',
    date: '2026',
    type: 'secondary',
  },


  /* ───────── 후발주자 성공 사례 ───────── */
  'reg-amd-share': {
    title: 'AMD climbs in desktop and server CPUs while Intel battles supply squeeze (Mercury Research Q4 2025)',
    publisher: 'The Register',
    url: 'https://www.theregister.com/2026/02/13/amd_intel_market_share/',
    date: '2026-02-13',
    type: 'press',
  },
  'toms-amd-share': {
    title: '30 percent of x86 CPUs sold are now made by AMD (Mercury Research Q4 2025)',
    publisher: "Tom's Hardware",
    url: 'https://www.tomshardware.com/pc-components/cpus/30-percent-of-x86-cpus-sold-are-now-made-by-amd-as-companys-market-share-grows-thanks-to-a-flagging-intel-enjoys-growth-across-all-segments-as-competition-intensifies',
    date: '2026-02',
    type: 'press',
  },
  'wiki-epyc': {
    title: 'Epyc',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Epyc',
    date: '2026 열람',
    type: 'secondary',
  },
  'aws-bmw-graviton': {
    title: 'How BMW Group accelerated connected vehicle workloads on AWS Graviton',
    publisher: 'AWS Architecture Blog',
    url: 'https://aws.amazon.com/blogs/architecture/how-bmw-group-accelerated-connected-vehicle-workloads-on-aws-graviton/',
    date: '2026-10-29',
    type: 'official',
  },
  'engadget-android': {
    title: 'Canalys: Android overtakes Symbian as world\'s best-selling smartphone platform in Q4 2010',
    publisher: 'Engadget',
    url: 'https://www.engadget.com/2011/01/31/canalys-android-overtakes-symbian-as-worlds-best-selling-smart',
    date: '2011-01-31',
    type: 'press',
  },

  /* ───────── 자체 SDK·실증 사례 ───────── */
  'rbln-quickstart': {
    title: 'RBLN SDK Quick Start (rebel-compiler · RBLN Runtime · optimum-rbln · vllm-rbln)',
    publisher: 'Rebellions (RBLN SDK 문서)',
    url: 'https://docs.rbln.ai/latest/getting_started/quick_start.html',
    date: '2026 열람',
    type: 'official',
  },
  'rbln-vllm-doc': {
    title: 'RBLN vLLM: A vLLM Plugin for RBLN NPU',
    publisher: 'Rebellions (RBLN SDK 문서)',
    url: 'https://docs.rbln.ai/latest/software/model_serving/vllm_support/index.html',
    date: '2026 열람',
    type: 'official',
  },
  'rbln-optimum-pypi': {
    title: 'optimum-rbln (PyPI) — rebel-compiler는 승인된 사용자에게만 제공',
    publisher: 'PyPI',
    url: 'https://pypi.org/project/optimum-rbln/',
    date: '2026 열람',
    type: 'official',
  },
  'rbln-forum': {
    title: 'Rebellions Official Dev Forum',
    publisher: 'Rebellions',
    url: 'https://discuss.rebellions.ai/',
    date: '2026 열람',
    type: 'official',
  },
  'rbln-aramco-li': {
    title: 'A proud milestone for Team Rebellions in the Kingdom of Saudi Arabia (Aramco SAIL 납품·PoC)',
    publisher: 'Rebellions (LinkedIn)',
    url: 'https://www.linkedin.com/posts/rebellions-ai_a-proud-milestone-for-team-rebellions-in-activity-7320242884618633216-rziI',
    date: '2025-04',
    type: 'official',
  },
  'skt-rbln-pilot-pr': {
    title: 'SKT, 리벨리온과 ‘국산 AI 생태계’ 구축 나선다',
    publisher: 'SK텔레콤 뉴스룸',
    url: 'https://news.sktelecom.com/213376',
    date: '2025-06-25',
    type: 'official',
  },
  'skt-rbln-interview': {
    title: '“국산 NPU로 풀스택 K-AI 완성에 기여할 것”… 리벨리온 김홍석 총괄 인터뷰',
    publisher: 'SK텔레콤 뉴스룸',
    url: 'https://news.sktelecom.com/217388',
    date: '2025-12-10',
    type: 'official',
  },
  'rbln-skt-14m': {
    title: '리벨리온, SKT 주요 AI 서비스 4개에 자사 NPU 확대 적용… AI 트래픽 하루 1,400만 건 이상 소화',
    publisher: 'Rebellions 보도자료',
    url: 'https://kr.rebellions.ai/newsroom/rebellions_running_14000traffic_skt_commercialization/',
    date: '2026-09-21',
    type: 'official',
  },
  'skt-nv-rbln-mou': {
    title: 'SKT-엔비디아-리벨리온, 한국형 소버린 AI 인프라 구축 협력',
    publisher: 'SK텔레콤 뉴스룸',
    url: 'https://news.sktelecom.com/232944',
    date: '2026-11-09',
    type: 'official',
  },

  /* ───────── 벤치마크·일반 참고 ───────── */
  'mlc-v61': {
    title: 'Where the industry is investing: a look at MLPerf Inference v6.1',
    publisher: 'MLCommons',
    url: 'https://mlcommons.org/2026/09/chairs-mlperf-inference-v6-1/',
    date: '2026-09',
    type: 'independent',
  },
  'mlc-docs': {
    title: 'MLPerf Inference Benchmark Suite — Documentation',
    publisher: 'MLCommons',
    url: 'https://docs.mlcommons.org/inference/index_gh/',
    date: '2026 열람',
    type: 'independent',
  },
  'ieee-mlperf': {
    title: 'Blackwell, AMD Instinct, Untethered AI: first benchmarks',
    publisher: 'IEEE Spectrum',
    url: 'https://spectrum.ieee.org/new-inference-chips',
    date: '2024',
    type: 'press',
  },
  'wiki-fab': {
    title: 'Semiconductor device fabrication',
    publisher: 'Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Semiconductor_device_fabrication',
    date: '2026 열람',
    type: 'secondary',
  },
  'ecia-leadtime': {
    title: 'Understanding Lead Times',
    publisher: 'ECIA',
    url: 'https://ecianow.org/assets/docs/Stats/LeadTimes/Understanding%20Lead%20Times.pdf',
    date: '열람 2026',
    type: 'secondary',
  },
};
