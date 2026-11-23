import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Cite, Claim, More, Refs, RegionBadge } from '../components/ui';
import { CLASS_INFO, products, type ProductClass, type Product } from '../data/products';
import { classReadingNote, metricRows, simpleTables } from '../data/compare';

const CLASSES: ProductClass[] = ['pcie', 'hbm', 'cloud'];

function ProductCard({ p }: { p: Product }) {
  return (
    <article className={`card ${p.region}`}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
        <RegionBadge region={p.region} />
        <span className="xs muted">{p.kind}</span>
      </div>
      <h3>{p.name}</h3>
      <p className="small muted" style={{ marginBottom: 6 }}>{p.company} · {p.target}</p>
      <p className="small">{p.oneLiner}</p>
      <p className="small" style={{ marginBottom: 0 }}>
        <b>상태</b> {p.status} <Claim kind={p.statusClaim} /> <Cite ids={p.statusSrc} />
      </p>
      <More title="상세 사양 펼치기">
        <ul className="spec-list">
          {p.specs.map((s) => (
            <li key={s.label}>
              <span className="k">{s.label}</span>
              {s.value} <Claim kind={s.claim} /> <Cite ids={s.src} />
              {s.note && <div className="xs muted">{s.note}</div>}
            </li>
          ))}
        </ul>
      </More>
    </article>
  );
}

type View = 'simple' | 'detail';

function SimpleTableView({ cls }: { cls: ProductClass }) {
  const t = simpleTables[cls];
  const ids = Object.keys(t.heads);
  const region = (id: string) => products.find((p) => p.id === id)?.region ?? 'kr';
  const marks = t.rows.some((r) => Object.values(r.values).some((v) => /[*†]/.test(v)));
  return (
    <>
      <div className="table-wrap simple-table" style={{ marginTop: 14 }}>
        <table>
          <thead>
            <tr>
              <th>항목</th>
              {ids.map((id) => (
                <th key={id}>
                  <span className={`sdot ${region(id)}`} aria-label={region(id) === 'kr' ? '한국' : '미국'} />{t.heads[id]}
                  <span className="th-company">{products.find((p) => p.id === id)?.company}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                {ids.map((id) => <td key={id}>{r.values[id]}</td>)}
              </tr>
            ))}
            <tr className="src-row">
              <td>출처</td>
              {ids.map((id) => <td key={id}><Cite ids={t.sources[id]} /></td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="xs muted" style={{ marginTop: 8 }}>
        <span className="sdot kr" />한국 <span className="sdot us" style={{ marginLeft: 8 }} />미국 · 색은 국가 구분일 뿐 우열이 아닙니다.
        {marks && ' * 2차 자료 기준(검증 필요) · † 제조사 발표 수치.'}
        {cls !== 'cloud' && ' 처리량·지연시간은 같은 조건의 비교 자료가 없어 이 표에서 뺐습니다.'} 근거와 상세 항목은 “자세히 보기”에서 확인하세요.
      </p>
    </>
  );
}

export default function Compare() {
  const [cls, setCls] = useState<ProductClass>('pcie');
  const [view, setView] = useState<View>(() => {
    try {
      return (localStorage.getItem('compare-view') as View) || 'simple';
    } catch {
      return 'simple';
    }
  });
  useEffect(() => {
    try { localStorage.setItem('compare-view', view); } catch { /* 저장 불가 무시 */ }
  }, [view]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = products.filter((p) => p.cls === cls);
  const rows = metricRows[cls];

  const onKey = (e: KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % CLASSES.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + CLASSES.length) % CLASSES.length;
    else return;
    e.preventDefault();
    setCls(CLASSES[n]);
    tabRefs.current[n]?.focus();
  };

  return (
    <section id="compare" className="section" aria-labelledby="cmp-title">
      <div className="wrap">
        <p className="eyebrow">04 · 한국 vs 미국</p>
        <h2 id="cmp-title">무엇에서 앞서고, 무엇에서 밀릴까?</h2>
        <p className="lead">
          칩마다 체급과 용도가 달라 한 줄로 순위를 매길 수 없습니다. 비슷한 제품끼리 묶어 비교하고, 같은 조건의 측정이 없는 항목은 “직접 비교 불가”로 표시했습니다.
        </p>

        <div className="view-switch" role="radiogroup" aria-label="표 보기 방식">
          <button role="radio" aria-checked={view === 'simple'} className={view === 'simple' ? 'on' : ''} onClick={() => setView('simple')}>간단히 보기</button>
          <button role="radio" aria-checked={view === 'detail'} className={view === 'detail' ? 'on' : ''} onClick={() => setView('detail')}>자세히 보기</button>
        </div>

        {view === 'detail' && (
          <>
        <div className="grid g3" style={{ marginTop: 18 }}>
          <div className="card">
            <h4>제조사 발표</h4>
            <p className="small">사양표의 최고 연산값, “H200급” 같은 비교 주장. 회사가 고른 조건이라 그대로 비교하면 안 됩니다.</p>
            <p className="xs">예: Rebel100 “H200급” <Claim kind="claim" /> <Cite ids={['toms-isscc-rebel100']} /></p>
          </div>
          <div className="card">
            <h4>독립 벤치마크</h4>
            <p className="small">MLPerf처럼 같은 규칙으로 측정·공개. 2026년 결과에서 한국 칩의 제출은 확인하지 못했습니다.</p>
            <p className="xs">ATOM 2023 MLPerf 결과 <Cite ids={['ked-mlperf']} /> · MLPerf v6.1 <Cite ids={['mlc-v61']} /></p>
          </div>
          <div className="card">
            <h4>실서비스 측정치</h4>
            <p className="small">실제 서비스 운영 수치. 칩 한 개의 성능이 아니라 시스템 전체 결과라 칩끼리 비교할 수 없습니다.</p>
            <p className="xs">SKT 하루 약 1,400만 요청(회사 발표) <Claim kind="claim" /> <Cite ids={['rcr-skt']} /></p>
          </div>
        </div>

        <div className="warn" style={{ marginTop: 16 }} role="note">
          TOPS·TFLOPS는 “연산기만 놓고 본 이론상 최고치”입니다. 실제 AI 서비스 속도는 메모리 대역폭, 소프트웨어, 배치 크기, 정밀도에 따라 크게 달라지므로 이 숫자만으로 우열을 판단하지 마세요.
        </div>

          </>
        )}

        <div className="tabs" role="tablist" aria-label="비교 그룹">
          {CLASSES.map((c, i) => (
            <button
              key={c}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              id={`tab-${c}`}
              aria-selected={cls === c}
              aria-controls={`panel-${c}`}
              tabIndex={cls === c ? 0 : -1}
              className={`btn ${cls === c ? 'active' : ''}`}
              onClick={() => setCls(c)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {CLASS_INFO[c].title}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${cls}`} aria-labelledby={`tab-${cls}`}>
          {view === 'simple' ? (
            <>
              <p className="small muted" style={{ marginBottom: 0 }}>{CLASS_INFO[cls].desc}</p>
              <SimpleTableView cls={cls} />
            </>
          ) : (
            <>
          <p className="small">{CLASS_INFO[cls].desc}</p>
          <p className="small muted">{classReadingNote[cls]}</p>

          <div className={`grid ${list.length >= 4 ? 'g4' : list.length === 3 ? 'g3' : 'g2'}`} style={{ marginTop: 12 }}>
            {list.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          {rows && (
            <>
              <h3 style={{ marginTop: 32 }}>항목별 비교</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ minWidth: 200 }}>항목 · 왜 중요한가</th>
                      {list.map((p) => (
                        <th key={p.id} style={{ minWidth: 180 }}>
                          <RegionBadge region={p.region} /> {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.key}>
                        <td>
                          <b>{r.label}</b> {r.notComparable && <span className="tag unverified">직접 비교 불가</span>}
                          <div className="xs muted">{r.plain}</div>
                          <div className="why" style={{ marginTop: 4 }}>→ {r.why}</div>
                        </td>
                        {list.map((p) => {
                          const c = r.cells[p.id];
                          return (
                            <td key={p.id} className="small">
                              {c ? (
                                <>
                                  {c.text} <Claim kind={c.claim} /> <Cite ids={c.src} />
                                </>
                              ) : (
                                <span className="muted">자료 없음</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {cls === 'cloud' && (
            <div className="card" style={{ marginTop: 16 }}>
              <h4>왜 Google TPU는 따로 보나요?</h4>
              <p className="small" style={{ marginBottom: 0 }}>
                Google은 TPU를 외부에 판매하지 않고 자사 서비스와 Google Cloud 고객에게 빌려줍니다. 칩 가격·납품 개념이 없으므로 판매용 가속기(NVIDIA·AMD·리벨리온·퓨리오사)와
                같은 표에서 순위를 매기지 않습니다. Anthropic처럼 대규모 사용 계약을 맺는 방식으로 쓰입니다. <Cite ids={['gcp-ironwood-ga', 'anthropic-tpu']} />
              </p>
            </div>
          )}
            </>
          )}
        </div>

        <Refs ids={['mlc-docs', 'mlc-v61']} title="비교 방법 참고자료" />
      </div>
    </section>
  );
}
