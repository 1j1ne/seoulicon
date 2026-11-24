import { lazy, Suspense, useRef } from 'react';
import { Cite, ConceptBadge, useInView, useMotion, useWebGL } from './ui';
import type { ViewerHandle } from '../three/ChipModel';

const ChipModel = lazy(() => import('../three/ChipModel'));

export function ChipFallback2D() {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="RNGD 패키지 2D 도식: 가운데 연산 칩(NPU), 양옆 HBM3 2개, 아래 기판">
      <rect x="20" y="40" width="360" height="220" rx="10" fill="#1f3b34" stroke="#2dd4bf" strokeOpacity=".4" />
      <rect x="45" y="60" width="310" height="180" rx="6" fill="#374151" />
      <rect x="140" y="80" width="120" height="140" rx="4" fill="#0f172a" stroke="#2dd4bf" />
      <text x="200" y="155" textAnchor="middle" fill="#e2e8f0" fontSize="15">연산 칩</text>
      <text x="200" y="175" textAnchor="middle" fill="#2dd4bf" fontSize="13">(NPU)</text>
      {[
        [62, 120],
        [273, 120],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="65" height="60" rx="4" fill="#64748b" />
          <text x={x + 32} y={y + 35} textAnchor="middle" fill="#0b1220" fontSize="12" fontWeight="700">HBM</text>
        </g>
      ))}
      <text x="200" y="285" textAnchor="middle" fill="#b9c4d8" fontSize="13">기판·인터포저가 칩과 메모리를 연결</text>
    </svg>
  );
}

export default function ChipViewer() {
  const webgl = useWebGL();
  const { reduced } = useMotion();
  const [ref, seen] = useInView<HTMLDivElement>();
  const h = useRef<ViewerHandle>(null);

  return (
    <div>
      <div className="viewer" ref={ref}>
        <div className="badge-pos">
          <ConceptBadge text="RNGD 패키지 구성 재현 · 치수 근사" />
        </div>
        {webgl === false ? (
          <div style={{ padding: '44px 12px 12px' }}>
            <ChipFallback2D />
            <p className="small muted">3D를 실행할 수 없는 환경이라 2D 도식으로 보여드립니다.</p>
          </div>
        ) : seen && webgl ? (
          <Suspense fallback={<div className="loading">3D 모형 불러오는 중…</div>}>
            <ChipModel ref={h} reduced={reduced} />
          </Suspense>
        ) : (
          <div className="loading">3D 모형 준비 중…</div>
        )}
        {webgl && (
          <div className="controls" role="group" aria-label="3D 모형 조작">
            <button className="btn" onClick={() => h.current?.rotate(-1)} aria-label="왼쪽으로 회전" title="왼쪽으로 회전">←</button>
            <button className="btn" onClick={() => h.current?.rotate(1)} aria-label="오른쪽으로 회전" title="오른쪽으로 회전">→</button>
            <button className="btn" onClick={() => h.current?.zoom(1)} aria-label="확대">＋</button>
            <button className="btn" onClick={() => h.current?.zoom(-1)} aria-label="축소">－</button>
            <button className="btn" onClick={() => h.current?.reset()} aria-label="시점 초기화">초기화</button>
          </div>
        )}
      </div>
      <p className="xs muted" style={{ marginTop: 6 }}>
        마우스 드래그·손가락으로 돌려보세요. 한국 NPU 퓨리오사AI RNGD의 공개된 패키지 구성(인터포저 위 연산 칩 1개 + SK하이닉스 HBM3 2스택)을 재현했습니다. 크기 비율과 외관은 근사입니다. <Cite ids={['chipsandcheese-rngd', 'furiosa-rngd']} />
      </p>
    </div>
  );
}
