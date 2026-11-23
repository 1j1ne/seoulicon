import ChipViewer from '../components/ChipViewer';
import { ClaimLegend } from '../components/ui';
import { DATA_AS_OF } from '../data/meta';

const NPU_POINTS = [
  { title: '무엇을 하나', text: '이미 학습된 AI 모델로 사용자의 질문에 답을 계산하는 일(추론)을 주로 맡습니다.' },
  { title: '어떻게 효율을 내나', text: 'AI 계산의 대부분인 행렬 곱셈·덧셈 회로를 촘촘히 배치하고, 칩 안 빠른 메모리(SRAM)에서 데이터를 재사용해 전기와 시간을 아낍니다.' },
  { title: '어디에 쓰이나', text: '데이터센터 서버에 꽂는 카드 형태로 쓰입니다. 한국에서는 리벨리온(ATOM·Rebel), 퓨리오사AI(RNGD)가 만듭니다.' },
];

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div>
          <p className="eyebrow">한국 NPU × 미국 AI 반도체 · 자료 기준일 {DATA_AS_OF}</p>
          <h1 id="hero-title">AI가 대답하는 순간,<br />칩 안에서는 무슨 일이 일어날까?</h1>
          <p className="lead">
            한국의 NPU는 무엇이고, 미국의 AI 반도체와 어떻게 다를까요? 질문 하나가 AI 칩에서 처리되는 과정부터 실제 칩의 생김새, 한국과 미국 제품 비교까지 차례로 살펴봅니다.
          </p>
          <div className="card npu-intro">
            <p className="eyebrow" style={{ margin: 0 }}>먼저, NPU란?</p>
            <h2 className="npu-title">AI 계산만 하도록 만든 <span>전용 계산기</span></h2>
            <p className="small">
              <b>비유</b> AI 계산이라는 한 가지 요리만 대량으로, 빠르고 적은 전기로 만들도록 설계된 전용 주방입니다.
            </p>
            <p className="small">
              <b>정의</b> NPU(Neural Processing Unit, 신경망 처리 장치)는 AI 모델의 핵심 계산인 행렬 곱셈·덧셈에 맞춰 회로를 특화한 반도체입니다.
            </p>
            <div className="npu-procs">
              {NPU_POINTS.map((p) => (
                <div key={p.title} className="npu-proc">
                  <b>{p.title}</b>
                  <p className="xs" style={{ margin: '4px 0 0' }}>{p.text}</p>
                </div>
              ))}
            </div>
            <p className="xs npu-caution">
              <b>알아 둘 점</b> 이름은 회사마다 다릅니다 — Google은 TPU라고 부르지만 같은 종류의 AI 전용 칩입니다. 실제 성능은 제품과 쓰는 모델·조건에 따라 달라집니다.
            </p>
            <p className="xs" style={{ margin: 0 }}>
              <a href="#process">질문을 보내고 처리 과정 보기 ↓</a> · <a href="#explore">실제 NPU 서버·칩을 3D로 보기 ↓</a>
            </p>
          </div>
        </div>

        <div>
          <ChipViewer />
          <nav className="next-q" aria-label="다음 질문으로 이동">
            <a href="#explore">NPU는 어떻게 생겼나?<small>데이터센터에서 칩 속까지 3D로</small></a>
            <a href="#compare">한국 기업은 어떤 제품을?<small>리벨리온·퓨리오사AI</small></a>
            <a href="#compare">미국 제품과 무엇이 다른가?<small>체급별로 나눠 비교</small></a>
            <a href="#timeline">어떻게 만들어지나?<small>기획부터 서비스까지</small></a>
          </nav>
          <div style={{ marginTop: 16 }}>
            <p className="xs muted" style={{ marginBottom: 6 }}>이 사이트의 표시 기준</p>
            <ClaimLegend />
          </div>
        </div>
      </div>
    </section>
  );
}
