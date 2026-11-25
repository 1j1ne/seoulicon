import { useEffect, useState } from 'react';
import { MotionProvider, useMotion } from './components/ui';
import { DATA_AS_OF } from './data/meta';
import { sources, SOURCE_TYPE_LABEL } from './data/sources';
import Hero from './sections/Hero';
import Process from './sections/Process';
import Journey from './sections/Journey';
import Compare from './sections/Compare';
import Timeline from './sections/Timeline';
import Challengers from './sections/Challengers';
import SdkProof from './sections/SdkProof';
import Conclusion from './sections/Conclusion';

const NAV = [
  { id: 'hero', label: '시작' },
  { id: 'process', label: '처리 과정' },
  { id: 'explore', label: '3D 탐색' },
  { id: 'compare', label: '한국 vs 미국' },
  { id: 'timeline', label: '제작 과정' },
  { id: 'challengers', label: '도전 사례' },
  { id: 'sdk', label: 'SDK 증명' },
  { id: 'conclusion', label: '마무리' },
];

function TopBar() {
  const { reduced, setUserPref } = useMotion();
  const [active, setActive] = useState('hero');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <header className="topbar">
      <a className="brand" href="#hero" aria-label="SEOULICON 처음으로">SEOUL<span>ICON</span></a>
      <nav className="nav" aria-label="섹션 이동">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}>
            {n.label}
          </a>
        ))}
      </nav>
      <button className="toggle" aria-pressed={reduced} onClick={() => setUserPref(!reduced)}>
        {reduced ? '■ 모션 줄임' : '▶ 모션 켜짐'}
      </button>
    </header>
  );
}

function Footer() {
  const all = Object.entries(sources).sort((a, b) => a[1].publisher.localeCompare(b[1].publisher));
  return (
    <footer>
      <div className="wrap">
        <h3 style={{ color: 'var(--text)' }}>자료 기준과 한계</h3>
        <p>
          자료 기준일: <b>{DATA_AS_OF}</b>. 공식 제품 문서·보도자료를 우선했고, 2차 자료만 있는 수치는 “검증 필요”로 표시했습니다. 가격·판매량·
          점유율은 공개 자료가 없으면 비워 두었고 추정하지 않았습니다. 3D 장면은 모두 개념 모형이며 특정 제품의 실제 배치를 재현하지 않습니다.
        </p>
        <p>
          이 사이트는 투자 조언이 아닙니다. 칩 사양의 최고 연산값(TOPS·TFLOPS)은 실제 AI 서비스 성능을 뜻하지 않습니다.
        </p>
        <details className="more">
          <summary>전체 출처 목록 ({all.length}건)</summary>
          <div className="body">
            <ol>
              {all.map(([id, s]) => (
                <li key={id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.publisher} — {s.title}</a> · {s.date} · {SOURCE_TYPE_LABEL[s.type]}
                </li>
              ))}
            </ol>
          </div>
        </details>
      </div>
    </footer>
  );
}

export default function App() {
  // 주소에 #섹션이 있으면 렌더링 후 해당 위치로 이동 (첫 로딩 시 브라우저 기본 동작 보완)
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }), 60);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <MotionProvider>
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>
      <TopBar />
      <main id="main">
        <Hero />
        <Process />
        <Journey />
        <Compare />
        <Timeline />
        <Challengers />
        <SdkProof />
        <Conclusion />
      </main>
      <Footer />
    </MotionProvider>
  );
}
