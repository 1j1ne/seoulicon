import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ConceptBadge, More, Refs, useInView, useMotion } from '../components/ui';
import { answerTokens, demoTokenize, procStages } from '../data/process';
import RequestFlow from '../components/RequestFlow';

/* ───── 도식 좌표 (viewBox 960×400) ───── */
type Pt = [number, number];
const USER: Pt = [62, 200];
const CPU = { x: 150, y: 150, w: 140, h: 100 };
const PKG = { x: 365, y: 36, w: 560, h: 330 };
const HBM_L = { x: 392, y: 110, w: 92, h: 180 };
const HBM_R = { x: 806, y: 110, w: 92, h: 180 };
const DIE = { x: 515, y: 66, w: 260, h: 268 };
const SRAM = { x: 530, y: 186, w: 230, h: 28 };
const SLICE = (r: number, c: number) => ({ x: 532 + c * 58, y: r === 0 ? 86 : 228, w: 50, h: 86 });

const P_ARRIVE: Pt[] = [USER, [150, 200]];
const P_SEND: Pt[] = [[290, 200], [515, 200]];
const P_W_L: Pt[] = [[484, 200], [530, 200], [600, 200], [600, 160]];
const P_W_R: Pt[] = [[806, 200], [760, 200], [690, 200], [690, 240]];
const P_KV: Pt[] = [[560, 300], [500, 300], [440, 275]];
const P_OUT: Pt[] = [[515, 186], [290, 186], [150, 186], [USER[0], 186]];

function along(path: Pt[], f: number): Pt {
  const segs = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, f)) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const k = segs[i] === 0 ? 0 : d / segs[i];
      return [path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k];
    }
    d -= segs[i];
  }
  return path[path.length - 1];
}
const poly = (p: Pt[]) => p.map((q) => q.join(',')).join(' ');

/** 한 번 이동하는 점 묶음 */
function Burst({ path, t, n = 5, color, r = 5 }: { path: Pt[]; t: number; n?: number; color: string; r?: number }) {
  if (t <= 0 || t >= 1.25) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const f = t * 1.25 - i * 0.06;
        if (f <= 0 || f >= 1) return null;
        const [x, y] = along(path, f);
        return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={1 - i * 0.12} />;
      })}
    </>
  );
}
/** 계속 흐르는 점 */
function Stream({ path, t, n = 7, color, speed = 1.6 }: { path: Pt[]; t: number; n?: number; color: string; speed?: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const f = (t * speed + i / n) % 1;
        const [x, y] = along(path, f);
        return <circle key={i} cx={x} cy={y} r={4.5} fill={color} opacity={0.9} />;
      })}
    </>
  );
}

const K = answerTokens.length;
const DURS = procStages.map((s) => (s.key === 'decode' ? s.dur * K : s.dur));
const STARTS = DURS.map((_, i) => DURS.slice(0, i).reduce((a, b) => a + b, 0));
const TOTAL = DURS.reduce((a, b) => a + b, 0);

export default function Process() {
  const { reduced } = useMotion();
  const [chipRef, inView] = useInView<HTMLDivElement>('0px');
  const [askCount, setAskCount] = useState(0);
  const [draft, setDraft] = useState('');
  const [question, setQuestion] = useState('내일 서울 날씨 어때?');
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const raf = useRef<number>();
  const last = useRef(0);
  const started = useRef(false);

  // 질문 보내기: 두 애니메이션을 입력한 질문으로 처음부터 다시
  const ask = (e: FormEvent) => {
    e.preventDefault();
    const q = draft.trim().slice(0, 60);
    if (q) setQuestion(q);
    setTime(0);
    setPlaying(false);
    started.current = false;
    setAskCount((c) => c + 1);
  };

  // 처음 화면에 들어오면 자동 재생 (모션 줄임 설정이면 수동)
  useEffect(() => {
    if (inView && !started.current && !reduced) { started.current = true; setPlaying(true); }
  }, [inView, reduced, askCount]);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.max(0, ((now - last.current) / 1000) * speed);
      last.current = now;
      setTime((t) => {
        const nt = t + dt;
        if (nt >= TOTAL) { setPlaying(false); return TOTAL; }
        return nt;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [playing, speed]);

  const tokens = useMemo(() => demoTokenize(question), [question]);
  const svgWrap = useRef<HTMLDivElement>(null);

  // 현재 단계·진행률
  let si = STARTS.findIndex((s, i) => time >= s && time < s + DURS[i]);
  if (si < 0) si = procStages.length - 1;
  const stage = procStages[si];
  const lt = Math.min(1, (time - STARTS[si]) / DURS[si]);
  const key = stage.key;

  // 디코드 상태
  const decodeT = key === 'decode' ? lt * K : key === 'stream' ? K : 0;
  const k = Math.min(K - 1, Math.floor(decodeT));
  const u = key === 'decode' ? decodeT - Math.floor(decodeT) : 1;
  const emitted = key === 'stream' ? K : key === 'decode' ? k + (u > 0.85 ? 1 : 0) : 0;
  const tokShown = key === 'tokenize' ? Math.ceil(lt * tokens.length) : si > 1 ? tokens.length : 0;
  const weightReads = (si > 3 || (key === 'prefill' && lt > 0.3) ? 1 : 0) + (key === 'decode' ? k + (u > 0.1 ? 1 : 0) : key === 'stream' ? K : 0);
  const kv = si > 3 || (key === 'prefill' && lt > 0.7) ? tokens.length + emitted : 0;
  const animate = !reduced || playing;

  const coresOn = (key === 'prefill' && lt > 0.25) || (key === 'decode' && u > 0.2 && u < 0.6);
  const sramOn = (key === 'prefill' && lt > 0.15) || (key === 'decode' && u < 0.55);
  const hbmOn = (key === 'prefill' && lt < 0.8) || (key === 'decode' && u < 0.45);
  const cpuOn = key === 'tokenize' || key === 'arrive' || key === 'stream' || (key === 'decode' && u > 0.75);

  // 좁은 화면: 도식을 좌우로 밀 수 있게 하고, 단계가 바뀌면 해당 위치로 자동 이동
  useEffect(() => {
    const el = svgWrap.current;
    if (!el || el.scrollWidth <= el.clientWidth + 2) return;
    const focus: Record<string, number> = { arrive: 0, tokenize: 0.1, send: 0.35, prefill: 0.7, decode: 0.7, stream: 0.25 };
    el.scrollTo({ left: (focus[key] ?? 0) * (el.scrollWidth - el.clientWidth), behavior: reduced ? 'auto' : 'smooth' });
  }, [key, reduced]);

  const jump = (i: number) => {
    // 모션 줄임: 단계의 완료 상태를 바로 보여줌 / 일반: 단계 시작점으로 이동
    // (디코드는 첫 단어 완료 상태부터 한 단어씩 넘김)
    const span = procStages[i].key === 'decode' ? DURS[i] / K : DURS[i];
    setTime(reduced ? STARTS[i] + span * 0.999 : STARTS[i] + 0.001);
  };
  const stepNext = () => {
    setPlaying(false);
    if (reduced && key === 'decode' && emitted < K) {
      setTime(STARTS[si] + (DURS[si] / K) * (emitted + 0.999));
      return;
    }
    jump(Math.min(procStages.length - 1, si + (lt > 0.98 || !reduced ? 1 : 0)));
  };
  const stepPrev = () => { setPlaying(false); jump(Math.max(0, si - 1)); };
  const restart = () => { setTime(0); setPlaying(!reduced); };

  const box = (b: { x: number; y: number; w: number; h: number }, on: boolean, fill: string, stroke: string) => (
    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={8} fill={fill} stroke={on ? '#fde047' : stroke} strokeWidth={on ? 3 : 1.5} />
  );
  const alt = answerTokens[k].alts;

  return (
    <section id="process" className="section" aria-labelledby="proc-title">
      <div className="wrap">
        <p className="eyebrow">02 · 질문을 받은 AI 칩의 처리 과정</p>
        <h2 id="proc-title">LLM한테 질문하면 답이 나오는 과정</h2>
        <p className="lead">
          질문을 입력하고 보내 보세요. 먼저 질문이 내 기기에서 데이터센터의 AI 칩까지 가는 길을 보고, 이어서 그 칩 안에서 토큰으로 쪼개지고 계산되어 단어가 하나씩 만들어지는 과정을 따라가 보세요.
        </p>

        <form className="ask" onSubmit={ask} role="search" aria-label="예시 질문 보내기">
          <label htmlFor="q" className="sr-only">AI에게 보낼 질문</label>
          <input id="q" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="예: 내일 서울 날씨 어때?" autoComplete="off" maxLength={60} />
          <button className="btn primary" type="submit">보내기</button>
        </form>
        <p className="xs muted">실제 AI에 연결되지 않습니다. 입력한 질문은 어디에도 전송·저장되지 않고 아래 애니메이션에만 쓰입니다.</p>

        <h3 className="proc-part">① 질문이 AI 칩까지 가는 길</h3>
        <RequestFlow question={question} startSignal={askCount} />

        <h3 className="proc-part" id="proc-chip">② AI 칩 안에서 일어나는 일</h3>

        <div className="proc-top">
          <ConceptBadge text="개념 애니메이션 — 실제 속도·토큰 분할·답변과 다릅니다" />
          <span className="small muted">지금 처리 중인 질문: <b style={{ color: 'var(--text)' }}>“{question}”</b></span>
        </div>

        <div className="proc-layout" ref={chipRef}>
          <div className="card proc-stage">
            <div className="proc-svg" ref={svgWrap}>
            <svg viewBox="0 0 960 400" role="img" aria-label={`처리 과정 도식. 현재 단계: ${stage.title}, 위치: ${stage.where}`}>
              {/* 사용자 */}
              <circle cx={USER[0]} cy={USER[1]} r={30} fill="#131c31" stroke={key === 'arrive' || (key === 'decode' && u > 0.9) || key === 'stream' ? '#fde047' : '#4b5b7c'} strokeWidth={2.5} />
              <text x={USER[0]} y={USER[1] + 5} textAnchor="middle" fontSize="20">👤</text>
              <text x={USER[0]} y={USER[1] + 52} textAnchor="middle" fill="#b9c4d8" fontSize="14">내 기기</text>

              {/* 서버 CPU */}
              {box(CPU, cpuOn, '#18233d', '#4b5b7c')}
              <text x={CPU.x + CPU.w / 2} y={CPU.y + 42} textAnchor="middle" fill="#eef2f8" fontSize="16" fontWeight="700">서버 CPU</text>
              <text x={CPU.x + CPU.w / 2} y={CPU.y + 64} textAnchor="middle" fill="#8b98b2" fontSize="12.5">토큰화 · 일감 배분</text>

              {/* PCIe */}
              <line x1={290} y1={200} x2={PKG.x} y2={200} stroke={key === 'send' ? '#f472b6' : '#4b3a55'} strokeWidth={6} strokeLinecap="round" />
              <text x={328} y={226} textAnchor="middle" fill="#f9a8d4" fontSize="12">PCIe</text>

              {/* NPU 패키지 */}
              <rect x={PKG.x} y={PKG.y} width={PKG.w} height={PKG.h} rx={14} fill="#1b2a22" stroke="#2c3d32" />
              <text x={PKG.x + 14} y={PKG.y + 22} fill="#a5f3fc" fontSize="13" fontWeight="700">NPU 카드 (예: RNGD) — 패키지</text>

              {[HBM_L, HBM_R].map((h, i) => (
                <g key={i}>
                  {box(h, hbmOn, '#1e3a5f', '#3b5b8a')}
                  {Array.from({ length: 6 }).map((_, j) => (
                    <line key={j} x1={h.x + 8} x2={h.x + h.w - 8} y1={h.y + 18 + j * 14} y2={h.y + 18 + j * 14} stroke="#60a5fa" strokeOpacity={0.35} />
                  ))}
                  <text x={h.x + h.w / 2} y={h.y - 8} textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="700">HBM3</text>
                  <text x={h.x + h.w / 2} y={h.y + 116} textAnchor="middle" fill="#bfdbfe" fontSize="11">모델 가중치</text>
                </g>
              ))}
              {/* KV 캐시 표시 (왼쪽 HBM 아래) */}
              <rect x={HBM_L.x + 8} y={HBM_L.y + 132} width={HBM_L.w - 16} height={36} rx={4} fill="#0f172a" stroke="#3b5b8a" />
              <rect x={HBM_L.x + 8} y={HBM_L.y + 132} width={(HBM_L.w - 16) * Math.min(1, kv / (tokens.length + K))} height={36} rx={4} fill="#a78bfa" opacity={0.8} />
              <text x={HBM_L.x + HBM_L.w / 2} y={HBM_L.y + 155} textAnchor="middle" fill="#eef2f8" fontSize="11">KV 캐시</text>

              {/* 칩(다이) */}
              {box(DIE, coresOn || sramOn, '#20242c', '#3a404d')}
              <text x={DIE.x + DIE.w / 2} y={DIE.y - 8} textAnchor="middle" fill="#fdba74" fontSize="13" fontWeight="700">NPU 칩(다이)</text>
              {[0, 1].map((r) => [0, 1, 2, 3].map((c) => {
                const s = SLICE(r, c);
                return <rect key={`${r}${c}`} x={s.x} y={s.y} width={s.w} height={s.h} rx={4} fill={coresOn ? '#fb923c' : '#5a3a22'} opacity={coresOn ? 0.55 + 0.45 * Math.abs(Math.sin((time * 6 + r + c) )) : 0.9} />;
              }))}
              <rect x={SRAM.x} y={SRAM.y} width={SRAM.w} height={SRAM.h} rx={4} fill={sramOn ? '#3b82f6' : '#1e3a5f'} />
              <text x={SRAM.x + SRAM.w / 2} y={SRAM.y + 19} textAnchor="middle" fill="#eef2f8" fontSize="12">온칩 SRAM</text>
              <text x={SLICE(0, 0).x + 4} y={SLICE(0, 0).y + 16} fill="#fff7ed" fontSize="11">연산 슬라이스</text>

              {/* 경로 강조 */}
              {key === 'arrive' && <polyline points={poly(P_ARRIVE)} fill="none" stroke="#7dd3fc" strokeDasharray="6 6" strokeWidth={2} />}
              {key === 'send' && <polyline points={poly(P_SEND)} fill="none" stroke="#f472b6" strokeDasharray="6 6" strokeWidth={2} />}
              {(key === 'prefill' || (key === 'decode' && u < 0.45)) && (
                <>
                  <polyline points={poly(P_W_L)} fill="none" stroke="#60a5fa" strokeDasharray="5 5" strokeWidth={2} />
                  <polyline points={poly(P_W_R)} fill="none" stroke="#60a5fa" strokeDasharray="5 5" strokeWidth={2} />
                </>
              )}
              {(key === 'stream' || (key === 'decode' && u > 0.7)) && <polyline points={poly(P_OUT)} fill="none" stroke="#c4b5fd" strokeDasharray="6 6" strokeWidth={2} />}

              {/* 움직이는 데이터 */}
              {animate && (
                <>
                  {key === 'arrive' && <Burst path={P_ARRIVE} t={lt} color="#7dd3fc" />}
                  {key === 'send' && <Burst path={P_SEND} t={lt} color="#f472b6" n={tokens.length > 6 ? 6 : tokens.length} />}
                  {key === 'prefill' && lt < 0.85 && (
                    <>
                      <Stream path={P_W_L} t={time} color="#60a5fa" n={9} />
                      <Stream path={P_W_R} t={time} color="#60a5fa" n={9} />
                    </>
                  )}
                  {key === 'prefill' && <Burst path={P_KV} t={(lt - 0.6) / 0.4} color="#a78bfa" n={4} />}
                  {key === 'decode' && u < 0.45 && (
                    <>
                      <Burst path={P_W_L} t={u / 0.45} color="#60a5fa" n={7} />
                      <Burst path={P_W_R} t={u / 0.45} color="#60a5fa" n={7} />
                    </>
                  )}
                  {key === 'decode' && <Burst path={P_KV} t={(u - 0.5) / 0.2} color="#a78bfa" n={2} r={4} />}
                  {key === 'decode' && <Burst path={P_OUT} t={(u - 0.7) / 0.3} color="#c4b5fd" n={1} r={7} />}
                  {key === 'stream' && <Burst path={P_OUT} t={lt} color="#c4b5fd" n={6} />}
                </>
              )}

              {key === 'decode' && (
                <text x={DIE.x + DIE.w / 2} y={DIE.y + DIE.h + 26} textAnchor="middle" fill="#fde68a" fontSize="13">
                  단어 {k + 1}/{K}: {u < 0.45 ? 'HBM에서 가중치 읽는 중' : u < 0.7 ? '다음 단어 확률 계산' : '단어 내보내기'}
                </text>
              )}
            </svg>
            </div>

            <ol className="proc-steps" aria-label="처리 단계">
              {procStages.map((s, i) => (
                <li key={s.key}>
                  <button className={i === si ? 'on' : i < si ? 'done' : ''} onClick={() => { setPlaying(false); jump(i); }} aria-current={i === si ? 'step' : undefined}>
                    <span className="bar"><span style={{ width: `${i < si ? 100 : i === si ? lt * 100 : 0}%` }} /></span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
            <div className="btn-row" style={{ marginTop: 10 }}>
              <button className="btn primary" onClick={() => { if (time >= TOTAL) setTime(0); setPlaying((p) => !p); }}>
                {playing ? '일시정지' : time >= TOTAL ? '다시 재생' : time > 0 ? '이어서 재생' : '재생'}
              </button>
              <button className="btn" onClick={stepPrev} disabled={si === 0 && lt < 0.01}>이전 단계</button>
              <button className="btn" onClick={stepNext} disabled={si === procStages.length - 1 && lt > 0.98}>다음 단계</button>
              <button className="btn" onClick={restart}>처음부터</button>
              <button className="btn" aria-pressed={speed < 1} onClick={() => setSpeed((s) => (s < 1 ? 1 : 0.5))}>{speed < 1 ? '보통 속도' : '천천히'}</button>
            </div>
          </div>

          <aside className="card proc-panel" aria-live="polite">
            <p className="xs muted" style={{ fontFamily: 'var(--mono)', margin: 0 }}>어디서: {stage.where}</p>
            <h3 style={{ margin: '4px 0 6px' }}>{stage.title}</h3>
            <p className="small">{stage.plain}</p>
            <p className="xs muted">{stage.detail}</p>

            <h4 className="proc-h">토큰 <span className="xs muted">(설명용 분할·번호)</span></h4>
            <div className="tok-row">
              {tokens.slice(0, tokShown).map((tk, i) => (
                <span key={i} className="tok"><b>{tk.t.replace(/^ /, '␣')}</b><i>#{tk.id}</i></span>
              ))}
              {tokShown === 0 && <span className="xs muted">아직 쪼개기 전</span>}
            </div>

            {key === 'decode' && (
              <>
                <h4 className="proc-h">다음 단어 후보 <span className="xs muted">(예시 확률)</span></h4>
                <div className="probs">
                  {alt.map(([w, p], i) => {
                    const chosen = i === 0 && u > 0.6;
                    return (
                      <div key={w} className={`prob ${chosen ? 'chosen' : ''}`}>
                        <span className="w">{w.replace(/^ /, '␣')}</span>
                        <span className="b"><span style={{ width: `${(u > 0.45 ? p : p * Math.max(0, (u - 0.2) / 0.25)) * 100}%` }} /></span>
                        <span className="p">{u > 0.45 ? `${Math.round(p * 100)}%` : '…'}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <h4 className="proc-h">화면에 보이는 답 <span className="xs muted">(예시 답변 — 실제 AI 아님)</span></h4>
            <div className="answer-box">
              {answerTokens.slice(0, emitted).map((a) => a.tok).join('')}
              {emitted < K && si >= 4 && <span className="caret" aria-hidden="true">▍</span>}
              {emitted === 0 && si < 4 && <span className="muted xs">아직 답을 만들기 전</span>}
            </div>

            <div className="proc-counters">
              <div><b>{weightReads}</b><span>가중치 전체 읽기</span></div>
              <div><b>{kv}</b><span>KV 캐시에 쌓인 토큰</span></div>
              <div><b>{emitted}/{K}</b><span>만든 단어</span></div>
            </div>
          </aside>
        </div>

        <More title="왜 답이 한 글자씩 나올까요? (상세)">
          <p className="small">
            언어모델은 “지금까지의 문장 다음에 올 토큰”을 하나씩 예측합니다. 토큰 하나가 정해져야 그다음을 계산할 수 있어서 순서대로 만들 수밖에 없고,
            토큰 하나마다 모델 가중치 전체(수십억~수천억 개 숫자)를 메모리에서 다시 읽습니다.
          </p>
          <p className="small">
            그래서 ① 질문을 이해하는 프리필은 계산량이, ② 답을 만드는 디코드는 메모리 대역폭이 속도를 주로 좌우합니다. HBM처럼 빠른 메모리와 칩 안 SRAM이 AI 반도체에서 중요한 이유입니다.
            KV 캐시는 앞에서 계산한 결과를 저장해 두고 재사용해 같은 계산을 반복하지 않게 하는 장치로, 대화가 길어질수록 메모리를 더 차지합니다.
          </p>
          <p className="small" style={{ marginBottom: 0 }}>
            실제 서비스는 여러 사용자의 요청을 묶어(배치) 한 번 읽은 가중치로 여러 사람의 다음 단어를 동시에 계산해 효율을 높입니다. 이 애니메이션은 한 명의 질문만 보여줍니다.
          </p>
        </More>

        <Refs ids={['chipsandcheese-rngd', 'furiosa-rngd', 'mlc-docs']} />
      </div>
    </section>
  );
}
