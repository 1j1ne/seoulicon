import { Cite, Claim } from '../components/ui';
import { analysis, caseTable, challengeCases, strategies, type ChallengeCase } from '../data/challengers';

function Bars({ c }: { c: NonNullable<ChallengeCase['bars']> }) {
  const max = c.unit === '%' ? 100 : Math.max(...c.items.map((b) => b.value)) * 1.15;
  return (
    <figure className="ch-bars">
      <figcaption className="xs muted">{c.title} <Cite ids={c.src} /></figcaption>
      {c.items.map((b) => (
        <div key={b.label} className="ch-bar">
          <span className="ch-bar-label">{b.label}</span>
          <span className="ch-bar-track" role="img" aria-label={`${b.label} ${b.note ?? b.value}`}>
            <span className="ch-bar-fill" style={{ width: `${(b.value / max) * 100}%` }} />
            {c.unit === '%' && <span className="ch-bar-rest" style={{ width: `${100 - b.value}%` }} />}
          </span>
          <span className="ch-bar-note">{b.note ?? b.value}</span>
        </div>
      ))}
    </figure>
  );
}

export default function Challengers() {
  return (
    <section id="challengers" className="section" aria-labelledby="ch-title">
      <div className="wrap">
        <p className="eyebrow">06 · 후발주자는 어떻게 이겼나</p>
        <h2 id="ch-title">CUDA라는 벽, 넘어선 사례가 있을까?</h2>
        <p className="lead">
          한국 NPU의 가장 큰 숙제는 칩 성능보다 <b>CUDA</b>입니다. CUDA가 이미 AI 산업의 표준 개발 환경으로 자리 잡아, 개발자와 기업이 다른 칩으로 옮기기 어렵기 때문입니다.
          그런데 강한 소프트웨어 생태계와 시장 지배력을 가진 기존 강자에게 후발주자가 도전해 성공한 사례는 실제로 있습니다.
        </p>

        <div className="table-wrap simple-table" style={{ marginTop: 18 }}>
          <table>
            <thead><tr><th>분야</th><th>기존 강자</th><th>도전자</th><th>결과</th></tr></thead>
            <tbody>
              {caseTable.map((r) => (
                <tr key={r.area} className={r.open ? 'ch-open' : ''}>
                  <td>{r.area}</td>
                  <td>{r.incumbent}</td>
                  <td>{r.challenger}</td>
                  <td>{r.open ? <span className="ch-pending">{r.result}</span> : r.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ch-cases">
          {challengeCases.map((c) => (
            <article key={c.id} className="card ch-case">
              <h3>{c.title}</h3>
              {c.story.map((p) => <p key={p} className="small">{p}</p>)}
              <ul className="ch-facts">
                {c.facts.map((f) => (
                  <li key={f.text} className="small">{f.text} <Claim kind={f.claim} /> <Cite ids={f.src} /></li>
                ))}
              </ul>
              {c.bars && <Bars c={c.bars} />}
              <div className="ch-lesson">
                <b>한국 NPU에 주는 교훈</b>
                <p className="small" style={{ margin: '4px 0 0' }}>{c.lesson}</p>
              </div>
              <p className="xs ch-caveat"><b>그대로 적용하기 어려운 점</b> {c.caveat}</p>
            </article>
          ))}
        </div>

        <h3 style={{ marginTop: 40 }}>세 사례를 한국 NPU에 적용하면</h3>
        <div className="table-wrap simple-table">
          <table>
            <thead><tr><th>성공 전략</th><th>역사적 사례</th><th>한국 NPU에 적용하면</th></tr></thead>
            <tbody>
              {strategies.map((s) => (
                <tr key={s.strategy}><td>{s.strategy}</td><td>{s.example}</td><td>{s.apply}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card ch-analysis">
          <h3 style={{ margin: '0 0 12px' }}>비슷한 성공을 거두려면 필요한 순서</h3>
          <ol className="ch-steps-strong">
            {analysis.steps.map((s, i) => (
              <li key={s}><span className="ch-step-no" aria-hidden="true">{i + 1}.</span><span>{s}</span></li>
            ))}
          </ol>
          <p className="small" style={{ marginBottom: 0 }}><b>정리</b> {analysis.conclusion}</p>
        </div>
      </div>
    </section>
  );
}
