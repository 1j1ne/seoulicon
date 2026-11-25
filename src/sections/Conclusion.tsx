import { Cite, Refs } from '../components/ui';
import { conclusion } from '../data/conclusion';
import { DATA_AS_OF } from '../data/meta';

const ICON: Record<string, string> = { ok: '✓', limit: '△', unknown: '?', fit: '→' };

export default function Conclusion() {
  return (
    <section id="conclusion" className="section concl" aria-labelledby="concl-title">
      <div className="wrap">
        <p className="eyebrow">08 · 마무리</p>
        <h2 id="concl-title">그래서 한국 NPU를 어떻게 봐야 할까?</h2>
        <p className="lead">
          “한국이 이긴다 / 진다”보다 “어떤 제품이, 어떤 고객에게, 어떤 조건에서 맞는가”로 보는 것이 정확합니다. 아래는 {DATA_AS_OF} 기준 공개 자료로 확인한 내용입니다.
        </p>
        <div className="grid g2" style={{ marginTop: 18 }}>
          {conclusion.map((c) => (
            <article key={c.key} className={`card ${c.tone}`}>
              <h3><span aria-hidden="true">{ICON[c.tone]} </span>{c.title}</h3>
              <ul>
                {c.points.map((p) => (
                  <li key={p.text}>
                    {p.text} <Cite ids={p.src} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="card" style={{ marginTop: 18 }}>
          <h3>한 문장 요약</h3>
          <p style={{ marginBottom: 0 }}>
            한국 NPU는 <b>추론 전용·저전력·국내 공공/통신 수요</b>에서 실제 상용 사례를 만들기 시작한 단계이고, <b>소프트웨어 생태계·대규모 확장·공급 실적</b>에서는 미국 GPU와의 격차가 남아 있으며,
            <b> 같은 조건의 성능·가격</b>은 공개 자료가 부족해 아직 판단할 수 없습니다.
          </p>
        </div>
        <Refs ids={['mlc-v61', 'rcr-skt', 'sds-npuaas', 'furiosa-seriesd', 'kh-rbln-revenue']} title="마무리 참고자료" />
      </div>
    </section>
  );
}
