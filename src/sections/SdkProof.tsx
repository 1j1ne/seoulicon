import { useState } from 'react';
import { Cite, Claim } from '../components/ui';
import { compareRows, currentWays, proposal, sdkParts, sktCaveats, sktTimeline } from '../data/sdkproof';

const AUTO_LABEL = { auto: '완전 자동', semi: '반자동', manual: '사람 입력 + 자동 합산' } as const;

export default function SdkProof() {
  const [view, setView] = useState<'simple' | 'detail'>('simple');
  return (
    <section id="sdk" className="section" aria-labelledby="sdk-title">
      <div className="wrap">
        <p className="eyebrow">07 · 자체 SDK의 성능 증명</p>
        <h2 id="sdk-title">“옮기기 쉽다”를 어떻게 증명할까?</h2>
        <div className="view-switch" role="radiogroup" aria-label="설명 보기 방식">
          <button role="radio" aria-checked={view === 'simple'} className={view === 'simple' ? 'on' : ''} onClick={() => setView('simple')}>간단히 보기</button>
          <button role="radio" aria-checked={view === 'detail'} className={view === 'detail' ? 'on' : ''} onClick={() => setView('detail')}>자세히 보기</button>
        </div>
        {view === 'detail' && (
          <p className="lead" style={{ marginTop: 14 }}>
            현재 공개된 공식 문서 기준으로, <b>리벨리온은 이미 AI 컴파일러와 모델 실행용 SDK를 제공하고 있습니다.</b> 모델을 자동으로 변환하는 도구는 이미 있다는 뜻입니다.
            다만 기존 코드를 전부 그대로 실행할 수 있는 수준이라고 보기는 어렵습니다. 남은 숙제는 SDK가 얼마나 쉽게 쓰이는지를 고객이 믿을 수 있게 증명하는 일입니다.
          </p>
        )}

        {/* SDK 구성 */}
        <h3 className="sdk-h">RBLN SDK(Software Development Kit)가 지금 제공하는 것</h3>
        <div className="table-wrap simple-table">
          <table>
            <thead><tr><th>구성 요소</th><th>현재 제공하는 기능</th><th>고객 입장에서의 의미</th></tr></thead>
            <tbody>
              {sdkParts.map((p) => (
                <tr key={p.name}>
                  <td><b style={{ color: 'var(--text)' }}>{p.name}</b></td>
                  <td>{p.does} <Cite ids={p.src} /></td>
                  <td>{p.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 1. 지금의 검증 방식 */}
        <h3 className="sdk-h">① 지금은 어떻게 검증하고 있나</h3>
        {view === 'detail' && (
          <p className="small muted" style={{ maxWidth: 760 }}>
            공개 자료로 확인한 방식은 고객사별 개별 실증과 개발자 지원 창구입니다. 공개 모집, 참여 보상, 같은 기준의 테스트·설문을 묶은 프로그램은 이번 조사에서 찾지 못했습니다(비공개로 진행하는지는 알 수 없습니다).
          </p>
        )}
        <div className="grid g2">
          {currentWays.map((w) => (
            <article key={w.title} className="card">
              <h4 style={{ margin: '0 0 6px' }}>{w.title}</h4>
              <p className="small">{w.body}</p>
              <ul className="ch-facts">
                {w.facts.map((f) => (
                  <li key={f.text} className="small">{f.text} <Claim kind={f.claim} /> <Cite ids={f.src} /></li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* 2. 공개된 도입 사례 */}
        <h3 className="sdk-h">② 실증에서 상용까지 — 공개된 사례 (SK텔레콤)</h3>
        <ol className="sdk-timeline">
          {sktTimeline.map((t) => (
            <li key={t.when} className="card">
              <div className="sdk-tl-head">
                <span className="sdk-when">{t.when}</span>
                <span className={`sdk-stage s-${t.stage}`}>{t.stage}</span>
              </div>
              <h4 style={{ margin: '6px 0' }}>{t.title}</h4>
              <p className="small">{t.body} <Claim kind={t.claim} /></p>
              <Cite ids={t.src} />
            </li>
          ))}
        </ol>
        {view === 'detail' && (
          <ul className="sdk-caveats">
            {sktCaveats.map((c) => <li key={c} className="small">{c}</li>)}
          </ul>
        )}

        {/* 3. 제안 */}
        <div className="card ch-analysis sdk-proposal">
          <h3 style={{ margin: '0 0 6px' }}>③ 제안: {proposal.name}</h3>
          <p className="small">{proposal.idea}</p>
          <ul className="ch-facts">
            {proposal.gains.map((g) => <li key={g} className="small">{g}</li>)}
          </ul>

          <div className="table-wrap simple-table" style={{ marginTop: 10 }}>
            <table>
              <thead><tr><th>단계</th><th>진행 방식</th><th>알 수 있는 것</th></tr></thead>
              <tbody>
                {proposal.steps.map((s) => (
                  <tr key={s.step}><td>{s.step}</td><td>{s.how}</td><td>{s.learn}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sdk-tool">
            <p className="small" style={{ margin: '0 0 6px' }}><b>설문만으로는 부족 — 함께 측정할 것</b></p>
            <div className="sdk-metrics">
              {proposal.metrics.map((m) => <span key={m}>{m}</span>)}
            </div>
            <p className="sdk-link xs"><span aria-hidden="true">↓ </span>이 지표들을 시험 과정에서 자동으로 기록하려면</p>
            <h4 style={{ margin: '0 0 6px' }}>함께 만들 것: {proposal.tool.name}</h4>
            <p className="small">{proposal.tool.why}</p>
            <p className="xs muted" style={{ marginTop: 0 }}>{proposal.tool.gap}</p>
            <div className="table-wrap simple-table">
              <table>
                <thead><tr><th>지표</th><th>자동화</th><th>기록 방법</th></tr></thead>
                <tbody>
                  {proposal.tool.rows.map((r) => (
                    <tr key={r.metric}>
                      <td>{r.metric}</td>
                      <td><span className={`sdk-auto a-${r.level}`}>{AUTO_LABEL[r.level]}</span></td>
                      <td>{r.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {view === 'detail' && (
              <>
                <p className="small" style={{ margin: '12px 0 6px' }}><b>도구 사용 흐름</b></p>
                <ol className="ch-steps">
                  {proposal.tool.flow.map((f) => <li key={f} className="small">{f}</li>)}
                </ol>
                <ul className="ch-facts" style={{ marginBottom: 0 }}>
                  {proposal.tool.cautions.map((c) => <li key={c} className="small">{c}</li>)}
                </ul>
              </>
            )}
          </div>

          {view === 'detail' && (
            <>
              <p className="small" style={{ margin: '14px 0 6px' }}><b>설계할 때 주의할 점</b></p>
              <ul className="ch-facts">
                {proposal.cautions.map((c) => <li key={c} className="small">{c}</li>)}
              </ul>
            </>
          )}

          <h4 style={{ margin: '14px 0 6px' }}>지금 방식과 비교하면</h4>
          <div className="table-wrap simple-table">
            <table>
              <thead><tr><th>항목</th><th>공개 자료로 확인한 현재 방식</th><th>제안</th></tr></thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr key={r.item}><td>{r.item}</td><td>{r.now}</td><td>{r.proposal}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {view === 'detail' && (
            <>
              <blockquote className="sdk-quote small">{proposal.sentence}</blockquote>
              <p className="small" style={{ marginBottom: 0 }}>
                <b>정리</b> 리벨리온은 “실제 서비스에서 돌아간다”는 사례는 공개했지만, “얼마나 쉽게 옮길 수 있는가”는 아직 숫자로 보여 주지 않았습니다. 실증을 새로 하자는 것이 아니라,
                참여 기회를 넓히고 이 빈칸을 같은 기준으로 측정해 공개하자는 제안입니다.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
