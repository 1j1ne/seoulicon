import { lazy, Suspense, useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { Cite, Claim, ConceptBadge, useInView, useMotion, useWebGL } from '../components/ui';
import { levels, ROLE_LABEL, type Level, type PartRole } from '../data/explorer';
import { effective } from '../three/progress';
import { noPhotoNote, officialPhotoLink, photos } from '../data/photos';

const JourneyScene = lazy(() => import('../three/JourneyScene'));

const N = levels.length;
const ROLE_COLOR: Record<PartRole, string> = {
  compute: '#fb923c',
  memory: '#60a5fa',
  link: '#f472b6',
  package: '#9ca3af',
  cooling: '#cbd5e1',
  other: '#64748b',
};

function FidelityBadge({ level }: { level: Level }) {
  return level.fidelity === 'reproduced' ? (
    <span className="concept-badge repro" role="note" title={level.fidelityNote}>◆ 공개 자료 기반 재현 · 치수 근사</span>
  ) : (
    <ConceptBadge />
  );
}

function PartPhoto({ id }: { id: string }) {
  const ph = photos[id];
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [id]);
  if (!ph) return noPhotoNote[id] ? <p className="xs muted">{noPhotoNote[id]}</p> : null;
  return (
    <figure className="part-photo">
      {!failed ? (
        <img src={ph.src} alt={ph.alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : (
        <div className="part-photo-fail xs">사진을 불러오지 못했습니다. <a href={ph.page} target="_blank" rel="noopener noreferrer">원본 보기 ↗</a></div>
      )}
      <figcaption>
        <span className="photo-tag">실제 사진 · 대표 예시</span> {ph.caption}
        <span className="photo-credit">
          사진: <a href={ph.page} target="_blank" rel="noopener noreferrer">{ph.author}</a> · {ph.license} · Wikimedia Commons
        </span>
      </figcaption>
    </figure>
  );
}

function Panel({
  level, idx, sel, setSel, goto, collapsed, setCollapsed,
}: {
  level: Level; idx: number; sel: string | null; setSel: (id: string | null) => void; goto: (i: number) => void; collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  const part = level.parts.find((p) => p.id === sel) ?? null;
  const infoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (part) infoRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [part]);
  return (
    <aside className={`journey-panel ${collapsed ? 'collapsed' : ''}`} aria-live="polite" aria-label="현재 단계 설명">
      <div className="jp-head">
        <span className="xs muted" style={{ fontFamily: 'var(--mono)' }}>
          {idx + 1}/{N} · {level.scale}
        </span>
        <button className="btn jp-toggle" onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed}>
          {collapsed ? '설명 펼치기' : '접기'}
        </button>
      </div>
      <h3 style={{ margin: '4px 0 6px' }}>{level.title}</h3>
      <div className="jp-body">
        <p className="small">{level.caption}</p>
        <p className="xs" style={{ color: level.fidelity === 'reproduced' ? '#a5f3fc' : '#fde68a' }}>
          {level.fidelity === 'reproduced' ? '◆ ' : '◇ '}{level.fidelityNote}
        </p>
        {level.facts.length > 0 && (
          <ul className="jp-facts">
            {level.facts.map((f) => (
              <li key={f.text} className="small">
                {f.text} <Claim kind={f.claim} /> <Cite ids={f.src} />
              </li>
            ))}
          </ul>
        )}
        <p className="xs muted" style={{ margin: '8px 0 4px' }}>부품을 누르면 설명과 실제 사진이 나옵니다.</p>
        <div className="parts" role="group" aria-label={`${level.title} 부품 목록`}>
          {level.parts.map((p) => (
            <button key={p.id} className="part-btn" aria-pressed={sel === p.id} onClick={() => setSel(sel === p.id ? null : p.id)}>
              <span>
                <span aria-hidden="true" style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: ROLE_COLOR[p.role], marginRight: 8 }} />
                {p.name}
              </span>
              <span className="role">{ROLE_LABEL[p.role]}</span>
            </button>
          ))}
        </div>
        {part && (
          <div className="part-info" ref={infoRef}>
            <h4>{part.name} <span className="role">· {ROLE_LABEL[part.role]}</span></h4>
            <PartPhoto id={part.id} />
            <p className="small"><b>무엇인가</b> {part.what}</p>
            <p className="small" style={{ marginBottom: 0 }}><b>왜 필요한가</b> {part.why}</p>
          </div>
        )}
        {['server', 'card', 'package'].includes(level.id) && (
          <p className="xs" style={{ marginTop: 10 }}>
            <a href={officialPhotoLink.url} target="_blank" rel="noopener noreferrer">{officialPhotoLink.label} ↗</a>
          </p>
        )}
      </div>
      <div className="btn-row jp-nav">
        <button className="btn" onClick={() => goto(idx - 1)} disabled={idx === 0}>－ 축소(이전)</button>
        <button className="btn primary" onClick={() => goto(idx + 1)} disabled={idx === N - 1}>＋ 확대(다음)</button>
      </div>
    </aside>
  );
}

export default function Journey() {
  const { reduced } = useMotion();
  const webgl = useWebGL();
  const [viewRef, seen] = useInView<HTMLDivElement>('600px');
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const azimuth = useRef(0);
  const tween = useRef<number>();
  const [step, setStep] = useState(0);
  const [settled, setSettled] = useState(true);
  const [sel, setSel] = useState<string | null>(null);
  const [labels, setLabels] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [fs, setFs] = useState(false);

  /** progress → 화면 상태 반영 */
  const sync = useCallback(() => {
    const eff = effective(progress.current);
    const s = Math.min(N - 1, Math.floor(eff + 0.5));
    setStep((old) => (old === s ? old : s));
    const st = Math.abs(eff - Math.round(eff)) < 0.03;
    setSettled((old) => (old === st ? old : st));
  }, []);

  /* 스크롤 → progress */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (document.fullscreenElement) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const tr = trackRef.current;
        const sg = stageRef.current;
        if (!tr || !sg) return;
        const total = tr.offsetHeight - sg.offsetHeight;
        const raw = Math.min(1, Math.max(0, -tr.getBoundingClientRect().top / Math.max(1, total)));
        progress.current = raw * (N - 1);
        sync();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sync]);

  useEffect(() => setSel(null), [step]);

  const scrollTopFor = (p: number) => {
    const tr = trackRef.current!;
    const sg = stageRef.current!;
    const top = tr.getBoundingClientRect().top + window.scrollY;
    return top + (p / (N - 1)) * (tr.offsetHeight - sg.offsetHeight);
  };

  const goto = (i: number) => {
    const target = Math.max(0, Math.min(N - 1, i));
    if (document.fullscreenElement) {
      cancelAnimationFrame(tween.current!);
      const from = progress.current;
      const t0 = performance.now();
      const dur = reduced ? 0 : 1100;
      const tick = (t: number) => {
        const k = dur === 0 ? 1 : Math.min(1, (t - t0) / dur);
        progress.current = from + (target - from) * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
        sync();
        if (k < 1) tween.current = requestAnimationFrame(tick);
      };
      tween.current = requestAnimationFrame(tick);
    } else {
      window.scrollTo({ top: scrollTopFor(target), behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  /* 전체 화면 */
  useEffect(() => {
    const on = () => {
      const isFs = document.fullscreenElement === stageRef.current;
      setFs(isFs);
      if (!isFs && trackRef.current) window.scrollTo({ top: scrollTopFor(progress.current), behavior: 'auto' });
    };
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggleFs = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else stageRef.current?.requestFullscreen?.().catch(() => {});
  };
  // 전체 화면에서는 휠·키보드·세로 스와이프로 확대/축소
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !fs) return;
    let touchY = 0;
    const move = (d: number) => {
      cancelAnimationFrame(tween.current!);
      progress.current = Math.max(0, Math.min(N - 1, progress.current + d));
      sync();
    };
    const wheel = (e: WheelEvent) => { e.preventDefault(); move(e.deltaY / 900); };
    const key = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goto(Math.floor(effective(progress.current) + 0.5) + 1); }
      if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); goto(Math.floor(effective(progress.current) + 0.5) - 1); }
    };
    const ts = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const tm = (e: TouchEvent) => { const y = e.touches[0].clientY; move((touchY - y) / 500); touchY = y; };
    el.addEventListener('wheel', wheel, { passive: false });
    window.addEventListener('keydown', key);
    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: true });
    return () => {
      el.removeEventListener('wheel', wheel);
      window.removeEventListener('keydown', key);
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove', tm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fs, sync]);

  /* 드래그로 좌우 회전 */
  const drag = useRef<{ x: number; id: number } | null>(null);
  const onDown = (e: RPointerEvent) => { drag.current = { x: e.clientX, id: e.pointerId }; };
  const onMove = (e: RPointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    azimuth.current -= (e.clientX - drag.current.x) * 0.006;
    drag.current.x = e.clientX;
  };
  const onUp = () => { drag.current = null; };

  const level = levels[step];

  if (webgl === false) {
    return (
      <section id="explore" className="section" aria-labelledby="exp-title">
        <div className="wrap">
          <p className="eyebrow">03 · 생김새·위치·역할</p>
          <h2 id="exp-title">데이터센터에서 칩 속까지</h2>
          <p className="small muted">3D를 실행할 수 없는 환경이라 단계별 설명으로 보여드립니다.</p>
          <div className="grid" style={{ marginTop: 16 }}>
            {levels.map((l, i) => (
              <article key={l.id} className="card">
                <p className="xs muted">{i + 1}/{N} · {l.scale}</p>
                <h3>{l.title}</h3>
                <p className="small">{l.caption}</p>
                <ul className="small">
                  {l.parts.map((p) => <li key={p.id}><b>{p.name}</b> — {p.what} {p.why}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="explore" className="journey" aria-labelledby="exp-title">
      <div className="wrap journey-intro">
        <p className="eyebrow">03 · 생김새·위치·역할</p>
        <h2 id="exp-title">데이터센터에서 칩 속까지, 한 번에 확대해 보기</h2>
        <p className="lead">
          한국 NPU인 <b>퓨리오사AI RNGD</b>의 서버와 카드를 공개 자료로 재현했습니다. 아래로 스크롤하면 데이터센터 → 랙 → 서버 → 카드 → 패키지 → 칩 내부로 계속 확대됩니다.
          드래그하면 좌우로 돌아갑니다.
        </p>
      </div>

      <div ref={trackRef} className="journey-track" style={{ height: `${(N - 1) * 95 + 100}vh` }}>
        <div ref={stageRef} className={`journey-stage ${collapsed ? 'panel-collapsed' : ''}`}>
          <div
            ref={viewRef}
            className="journey-canvas"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {seen && webgl ? (
              <Suspense fallback={<div className="loading">3D 장면 불러오는 중…</div>}>
                <JourneyScene
                  progress={progress}
                  azimuth={azimuth}
                  step={step}
                  settled={settled}
                  labels={labels}
                  sel={sel}
                  onSelect={(id) => setSel(id || null)}
                  collapsed={collapsed}
                />
              </Suspense>
            ) : (
              <div className="loading">3D 장면 준비 중…</div>
            )}
          </div>

          <div className="journey-top">
            <FidelityBadge level={level} />
            <ol className="journey-dots" aria-label="확대 단계">
              {levels.map((l, i) => (
                <li key={l.id}>
                  <button
                    className={i === step ? 'on' : ''}
                    aria-current={i === step ? 'step' : undefined}
                    onClick={() => goto(i)}
                    title={l.title}
                    aria-label={`${i + 1}단계 ${l.title}로 이동`}
                  >
                    <span className="dot-label">{l.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="journey-controls" role="group" aria-label="3D 조작">
            <button className="btn" onClick={() => (azimuth.current += 0.4)} aria-label="왼쪽으로 회전" title="왼쪽으로 회전">←</button>
            <button className="btn" onClick={() => (azimuth.current -= 0.4)} aria-label="오른쪽으로 회전" title="오른쪽으로 회전">→</button>
            <button className="btn" onClick={() => goto(step - 1)} disabled={step === 0} aria-label="축소(이전 단계)" title="축소">－</button>
            <button className="btn" onClick={() => goto(step + 1)} disabled={step === N - 1} aria-label="확대(다음 단계)" title="확대">＋</button>
            <button className="btn" onClick={() => { azimuth.current = 0; goto(0); }} aria-label="처음 시점으로 초기화">초기화</button>
            <button className="btn" aria-pressed={labels} onClick={() => setLabels((v) => !v)}>라벨</button>
            <button className="btn" aria-pressed={fs} onClick={toggleFs}>{fs ? '전체 화면 종료' : '⛶ 전체 화면'}</button>
          </div>

          <Panel level={level} idx={step} sel={sel} setSel={setSel} goto={goto} collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
      </div>
    </section>
  );
}
