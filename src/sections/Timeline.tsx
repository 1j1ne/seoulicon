import { useState, type KeyboardEvent } from 'react';
import { Cite, Claim } from '../components/ui';
import { PHASE_LABEL, processStages, timelineQA, type PhaseKind } from '../data/timeline';

/* ───── 일반 흐름도 좌표 (길이는 실제 기간과 비례하지 않음) ───── */
const W = 1000;
const LANE_Y: Record<PhaseKind, number> = { dev: 96, production: 206, adoption: 316 };
const LANE_COLOR: Record<PhaseKind, string> = { dev: '#60a5fa', production: '#f59e0b', adoption: '#f472b6' };
const NODE_W = 112;
const NODE_H = 50;
/** 흐름도 상자에 넣을 짧은 이름 (패널에는 전체 이름) */
const SHORT: Record<string, string> = {
  demand: '수요 파악', design: '칩 설계', verify: '검증', fab: '파운드리 제조', package: '패키징·검사',
  system: '보드·서버', software: 'SW 최적화', eval: '고객 평가', contract: '계약·납품', operate: '상용 운영',
};

/** 단계별 위치(x 중심)와 레인 */
const POS: Record<string, { x: number; lane: PhaseKind }> = {
  demand: { x: 90, lane: 'dev' },
  design: { x: 215, lane: 'dev' },
  verify: { x: 340, lane: 'dev' },
  fab: { x: 465, lane: 'production' },
  package: { x: 590, lane: 'production' },
  system: { x: 715, lane: 'production' },
  software: { x: 465, lane: 'adoption' },
  eval: { x: 640, lane: 'adoption' },
  contract: { x: 790, lane: 'adoption' },
  operate: { x: 915, lane: 'adoption' },
};

const keyAct = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
};

function GeneralFlow({ sel, onSel }: { sel: string; onSel: (k: string) => void }) {
  const p = (k: string) => ({ x: POS[k].x, y: LANE_Y[POS[k].lane] });
  const arrow = (a: string, b: string, opts: { dashed?: boolean; bend?: number } = {}) => {
    const A = p(a);
    const B = p(b);
    const sameLane = A.y === B.y;
    const x1 = sameLane ? A.x + NODE_W / 2 : A.x;
    const y1 = sameLane ? A.y : A.y + NODE_H / 2;
    const x2 = sameLane ? B.x - NODE_W / 2 - 6 : B.x;
    const y2 = sameLane ? B.y : B.y - NODE_H / 2 - 6;
    const d = sameLane ? `M${x1} ${y1} L${x2} ${y2}` : `M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
    return <path d={d} fill="none" stroke="#64748b" strokeWidth={2} strokeDasharray={opts.dashed ? '5 5' : undefined} markerEnd="url(#arr)" />;
  };

  return (
    <svg viewBox={`0 0 ${W} 400`} role="group" aria-label="AI 반도체가 만들어져 팔리기까지의 일반적인 흐름도" className="flow-svg">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#64748b" />
        </marker>
        <marker id="arr-loop" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#fca5a5" />
        </marker>
      </defs>

      {/* 레인 */}
      {(['dev', 'production', 'adoption'] as PhaseKind[]).map((k, i) => (
        <g key={k}>
          <rect x="8" y={LANE_Y[k] - 46} width={W - 16} height="92" rx="14" fill="#0f1a30" />
          <rect x="8" y={LANE_Y[k] - 46} width="6" height="92" rx="3" fill={LANE_COLOR[k]} />
          <text x="24" y={LANE_Y[k] - 28} fontSize="12.5" fontWeight="800" fill={LANE_COLOR[k]}>{['①', '②', '③'][i]} {PHASE_LABEL[k]}</text>
        </g>
      ))}

      {/* 병행 구간: 소프트웨어 최적화는 설계 단계부터 고객 평가까지 계속 */}
      <rect x={530} y={LANE_Y.adoption - 37} width={170} height="6" rx="3" fill={LANE_COLOR.adoption} opacity="0.45" />
      <rect x={300} y={LANE_Y.adoption - 37} width={230} height="6" rx="3" fill={LANE_COLOR.adoption} opacity="0.2" />
      <text x={700} y={LANE_Y.adoption - 41} textAnchor="end" fontSize="10.5" fill="#f9a8d4">소프트웨어 최적화는 설계 단계부터 고객 평가까지 병행 →</text>

      {/* 흐름 화살표 */}
      {arrow('demand', 'design')}
      {arrow('design', 'verify')}
      {arrow('verify', 'fab')}
      {arrow('fab', 'package')}
      {arrow('package', 'system')}
      {arrow('system', 'eval')}
      {arrow('software', 'eval')}
      {arrow('eval', 'contract')}
      {arrow('contract', 'operate')}
      {/* 시제품 단계에서 SW 시작 */}
      <path d={`M${POS.verify.x} ${LANE_Y.dev + NODE_H / 2} C ${POS.verify.x} ${LANE_Y.adoption - 40}, ${POS.software.x} ${LANE_Y.adoption - 80}, ${POS.software.x} ${LANE_Y.adoption - NODE_H / 2 - 6}`}
        fill="none" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" markerEnd="url(#arr)" />
      {/* 되돌아가는 고리 */}
      <path d={`M${POS.verify.x - 20} ${LANE_Y.dev - NODE_H / 2} C ${POS.verify.x - 30} ${LANE_Y.dev - 62}, ${POS.design.x + 30} ${LANE_Y.dev - 62}, ${POS.design.x + 20} ${LANE_Y.dev - NODE_H / 2 - 4}`}
        fill="none" stroke="#fca5a5" strokeWidth={1.8} strokeDasharray="4 4" markerEnd="url(#arr-loop)" />
      <text x={(POS.design.x + POS.verify.x) / 2} y={LANE_Y.dev - 62} textAnchor="middle" fontSize="10.5" fill="#fca5a5">버그 발견 시 재설계</text>
      <path d={`M${POS.eval.x - 30} ${LANE_Y.adoption + NODE_H / 2} C ${POS.eval.x - 40} ${LANE_Y.adoption + 48}, ${POS.software.x + 40} ${LANE_Y.adoption + 48}, ${POS.software.x + 30} ${LANE_Y.adoption + NODE_H / 2 + 4}`}
        fill="none" stroke="#fca5a5" strokeWidth={1.8} strokeDasharray="4 4" markerEnd="url(#arr-loop)" />
      <text x={(POS.software.x + POS.eval.x) / 2} y={LANE_Y.adoption + 60} textAnchor="middle" fontSize="10.5" fill="#fca5a5">평가 결과로 다시 최적화</text>
      <path d={`M${POS.operate.x} ${LANE_Y.adoption - NODE_H / 2} C ${POS.operate.x} ${LANE_Y.production}, ${POS.operate.x} ${LANE_Y.production - 20}, ${POS.operate.x} ${LANE_Y.production - 40}`}
        fill="none" stroke="#86efac" strokeWidth={1.8} strokeDasharray="4 4" markerEnd="url(#arr)" />
      <text x={POS.operate.x} y={LANE_Y.production - 50} textAnchor="middle" fontSize="10.5" fill="#86efac">매출 발생 · 추가 주문</text>

      {/* 단계 노드 */}
      {processStages.map((st, i) => {
        const { x, y } = p(st.key);
        const on = sel === st.key;
        const col = LANE_COLOR[st.bucket];
        const act = () => onSel(st.key);
        return (
          <g
            key={st.key}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${i + 1}단계 ${st.name}`}
            onClick={act}
            onKeyDown={keyAct(act)}
            className="flow-node"
          >
            <rect x={x - NODE_W / 2} y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="12" fill={on ? '#1d2c4d' : '#131c31'} stroke={on ? '#fde047' : col} strokeWidth={on ? 3 : 1.6} />
            <circle cx={x - NODE_W / 2 + 16} cy={y} r="10" fill={col} />
            <text x={x - NODE_W / 2 + 16} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#0b1222">{i + 1}</text>
            <text x={x + 12} y={y + 4.5} textAnchor="middle" fontSize={SHORT[st.key].length > 5 ? 12 : 13} fontWeight="700" fill="#eef2f8">{SHORT[st.key]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Timeline() {
  const [sel, setSel] = useState(processStages[0].key);
  const stage = processStages.find((s) => s.key === sel)!;
  const idx = processStages.indexOf(stage);

  return (
    <section id="timeline" className="section" aria-labelledby="tl-title">
      <div className="wrap">
        <p className="eyebrow">05 · 만들어지고 팔리는 과정</p>
        <h2 id="tl-title">AI 반도체는 어떻게 만들어져 팔릴까?</h2>
        <div className="flow-layout" style={{ marginTop: 16 }}>
          <div className="card flow-card">
            <div className="flow-scroll">
              <GeneralFlow sel={sel} onSel={setSel} />
            </div>
            <div className="flow-legend xs">
              <span><i style={{ background: '#64748b' }} />다음 단계로</span>
              <span><i className="dash" style={{ borderColor: '#64748b' }} />함께 시작·병행</span>
              <span><i className="dash" style={{ borderColor: '#fca5a5' }} />되돌아가는 반복</span>
              <span><i className="dash" style={{ borderColor: '#86efac' }} />매출·추가 주문</span>
            </div>
          </div>

          <aside className="card flow-panel" aria-live="polite">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="phase-chip" style={{ color: LANE_COLOR[stage.bucket], borderColor: LANE_COLOR[stage.bucket] }}>{PHASE_LABEL[stage.bucket]}</span>
              <span className="xs muted" style={{ fontFamily: 'var(--mono)' }}>{idx + 1}/10</span>
            </div>
            <h3 style={{ margin: '6px 0' }}>{stage.name}</h3>
            <p className="small">{stage.what}</p>
            <dl className="flow-dl">
              <div><dt>담당 주체</dt><dd>{stage.who}</dd></div>
              <div><dt>소요 기간</dt><dd>{stage.duration} <Claim kind={stage.durationClaim} /> <Cite ids={stage.durationSrc} /></dd></div>
              <div><dt>한국과 미국의 차이</dt><dd>{stage.krVsUs}</dd></div>
              <div><dt>지연 요인</dt><dd>{stage.delays}</dd></div>
            </dl>
            <div className="btn-row" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => setSel(processStages[Math.max(0, idx - 1)].key)} disabled={idx === 0}>이전 단계</button>
              <button className="btn primary" onClick={() => setSel(processStages[Math.min(9, idx + 1)].key)} disabled={idx === 9}>다음 단계</button>
            </div>
          </aside>
        </div>

        <div className="grid g3" style={{ marginTop: 18 }}>
          <div className="card"><h4 style={{ color: LANE_COLOR.dev }}>① 개발 기간</h4><p className="small" style={{ margin: 0 }}>기획·설계 시작부터 작동하는 첫 칩과 양산 준비까지. 회사들은 대개 시작일을 공개하지 않아 전체 길이를 비교하기 어렵습니다.</p></div>
          <div className="card"><h4 style={{ color: LANE_COLOR.production }}>② 생산·납품 기간</h4><p className="small" style={{ margin: 0 }}>생산 발주부터 제조·패키징·검사를 거쳐 고객에게 전달되기까지. 웨이퍼 가공만 통상 수개월이 걸립니다.</p></div>
          <div className="card"><h4 style={{ color: LANE_COLOR.adoption }}>③ 고객 도입 기간</h4><p className="small" style={{ margin: 0 }}>시험 도입과 최적화부터 실제 상용 서비스 운영까지. 칩이 완성돼도 매출이 바로 나지 않는 이유입니다.</p></div>
        </div>
        <p className="small muted" style={{ marginTop: 8 }}>세 기간은 겹쳐서 진행되므로(예: 양산과 고객 평가가 동시에) 각 단계 기간을 더해 “전체 기간”으로 보면 안 됩니다.</p>

        <h3 style={{ marginTop: 44 }}>근거로 답해 보기</h3>
        <div className="grid g2" style={{ marginTop: 12 }}>
          {timelineQA.map((qa) => (
            <article className="card" key={qa.q}>
              <h4>Q. {qa.q}</h4>
              <p className="small" style={{ marginBottom: 6 }}>{qa.a}</p>
              <Cite ids={qa.src} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
