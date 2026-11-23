import { useEffect, useRef, useState } from 'react';
import { useInView, useMotion } from './ui';

/** 질문이 내 기기 → 인터넷 → 데이터센터 → 서버 → AI 가속기로 갔다가 돌아오는 흐름 */
const NODES = [
  { x: 50, label: '내 기기' },
  { x: 175, label: '인터넷' },
  { x: 300, label: '데이터센터' },
  { x: 425, label: '서버(CPU)' },
  { x: 560, label: 'AI 가속기' },
];

const STEPS = [
  { node: 0, text: '질문을 입력하면 글자가 데이터 묶음(패킷)이 되어 출발합니다.' },
  { node: 1, text: '인터넷 회선을 타고 AI 회사의 데이터센터로 이동합니다.' },
  { node: 2, text: '데이터센터에 도착하면 수많은 서버 중 한가한 곳으로 배정됩니다.' },
  { node: 3, text: '서버의 CPU가 문장을 숫자 조각(토큰)으로 바꾸고 가속기에 일감을 넘깁니다.' },
  { node: 4, text: 'AI 가속기(GPU·NPU)가 메모리에서 수십억 개의 숫자(가중치)를 읽어 곱셈·덧셈을 반복하며 다음 단어를 하나씩 예측합니다.' },
  { node: 0, text: '예측된 단어 조각이 거꾸로 같은 길을 따라 돌아와 화면에 한 글자씩 나타납니다.' },
];

export default function RequestFlow({ question, startSignal }: { question: string; startSignal: number }) {
  const { reduced } = useMotion();
  const [ref, inView] = useInView<HTMLDivElement>('0px');
  const [step, setStep] = useState(-1);
  const [auto, setAuto] = useState(false);
  const timer = useRef<number>();
  const started = useRef(false);

  // 처음 화면에 보이면 자동 재생 (모션 줄임이면 수동)
  useEffect(() => {
    if (inView && !started.current && !reduced) { started.current = true; setStep(0); setAuto(true); }
  }, [inView, reduced]);

  // 첫 화면에서 질문을 보내면 처음부터 다시
  useEffect(() => {
    if (startSignal > 0) { started.current = true; setStep(0); setAuto(!reduced); }
  }, [startSignal, reduced]);

  useEffect(() => {
    if (!auto || reduced) return;
    if (step >= STEPS.length - 1) { setAuto(false); return; }
    timer.current = window.setTimeout(() => setStep((s) => s + 1), 1500);
    return () => window.clearTimeout(timer.current);
  }, [auto, step, reduced]);

  const cur = step >= 0 ? STEPS[step] : null;
  const packetX = cur ? NODES[cur.node].x : NODES[0].x;
  const returning = step === STEPS.length - 1;

  return (
    <div className="flow card" ref={ref} style={{ padding: 12 }}>
      <svg viewBox="0 0 620 130" role="img" aria-label="질문이 내 기기에서 인터넷, 데이터센터, 서버, AI 가속기로 이동했다가 답변으로 돌아오는 흐름도">
        <line x1={NODES[0].x} y1="50" x2={NODES[4].x} y2="50" stroke="#33415f" strokeWidth="3" />
        {cur && (
          <line x1={NODES[0].x} y1="50" x2={returning ? NODES[4].x : packetX} y2="50" stroke={returning ? '#c4b5fd' : '#7dd3fc'} strokeWidth="3" strokeDasharray={returning ? '6 5' : undefined} />
        )}
        {NODES.map((n, i) => {
          const on = cur?.node === i;
          return (
            <g key={n.label}>
              <circle cx={n.x} cy="50" r={i === 4 ? 22 : 17} fill={on ? '#1d3352' : '#131c31'} stroke={on ? '#fde047' : '#4b5b7c'} strokeWidth="2.5" />
              {i === 4 && (
                <g opacity={on && !returning ? 1 : 0.5}>
                  {[0, 1, 2].map((r) =>
                    [0, 1, 2].map((c) => (
                      <rect key={`${r}${c}`} x={n.x - 10 + c * 7} y={40 + r * 7} width="5" height="5" fill={on && !returning ? '#2dd4bf' : '#475569'} />
                    )),
                  )}
                </g>
              )}
              <text x={n.x} y="98" textAnchor="middle" fill={on ? '#eef2f8' : '#8b98b2'} fontSize="13">{n.label}</text>
            </g>
          );
        })}
        {cur && (
          <circle cx={packetX} cy="50" r="7" fill={returning ? '#c4b5fd' : '#7dd3fc'} style={{ transition: reduced ? 'none' : 'cx 1.1s ease-in-out' }} />
        )}
        {returning && <text x="50" y="22" textAnchor="start" fill="#c4b5fd" fontSize="12">← 답변이 조각조각 도착</text>}
      </svg>
      <ol className="flow-steps" aria-label="처리 단계">
        {STEPS.map((s, i) => (
          <li key={i} className={i === step ? 'on' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <span>{s.text}</span>
          </li>
        ))}
      </ol>
      <div className="btn-row" style={{ marginTop: 10 }}>
        <button className="btn" onClick={() => { setAuto(false); setStep((s) => Math.max(0, s - 1)); }} disabled={step <= 0}>이전 단계</button>
        <button className="btn" onClick={() => { setAuto(false); setStep((s) => Math.min(STEPS.length - 1, s + 1)); }} disabled={step >= STEPS.length - 1}>
          {step < 0 ? '단계별로 보기' : '다음 단계'}
        </button>
        <button className="btn" onClick={() => { setStep(0); setAuto(!reduced); }}>처음부터</button>
      </div>
      <p className="sr-only" aria-live="polite">{cur ? `${step + 1}단계: ${cur.text}` : ''}</p>
      {returning && (
        <p className="small" style={{ marginTop: 10, marginBottom: 0 }}>
          <b>(예시 답변)</b> {question ? `“${question}”에 대한 ` : ''}답변이 화면에 나타납니다. 이 한 번의 대답에도 가속기는 단어 하나마다 모델 전체의 숫자를 메모리에서 다시 읽습니다.
          그래서 <b>메모리 속도</b>와 <b>전력</b>이 AI 반도체 경쟁의 핵심이 됩니다. <a href="#proc-chip">5번 단계, 가속기 안에서 일어나는 일 자세히 보기 ↓</a>
        </p>
      )}
    </div>
  );
}
