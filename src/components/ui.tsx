import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { sources, SOURCE_TYPE_LABEL } from '../data/sources';
import { CLAIM_LABEL, REGION_LABEL, type ClaimKind, type Region } from '../data/meta';

/* ───── 모션 감소 설정 (OS 설정 + 사용자 토글) ───── */
interface MotionCtx { reduced: boolean; setUserPref: (v: boolean | null) => void; userPref: boolean | null }
const MotionContext = createContext<MotionCtx>({ reduced: false, setUserPref: () => {}, userPref: null });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [osReduced, setOsReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [userPref, setUserPref] = useState<boolean | null>(() => {
    try {
      const v = localStorage.getItem('reduce-motion');
      return v === null ? null : v === 'true';
    } catch {
      return null;
    }
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setOsReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const reduced = userPref ?? osReduced;
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduced);
    try {
      if (userPref === null) localStorage.removeItem('reduce-motion');
      else localStorage.setItem('reduce-motion', String(userPref));
    } catch {
      /* 저장 불가 환경 무시 */
    }
  }, [reduced, userPref]);
  return <MotionContext.Provider value={{ reduced, setUserPref, userPref }}>{children}</MotionContext.Provider>;
}
export const useMotion = () => useContext(MotionContext);

/* ───── WebGL 지원 확인 ───── */
export function useWebGL(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      setOk(!!(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

/* ───── 화면에 보이는지 ───── */
export function useInView<T extends Element>(rootMargin = '200px') {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, seen]);
  return [ref, seen] as const;
}

/* ───── 출처 칩 ───── */
export function Cite({ ids }: { ids?: string[] }) {
  if (!ids || ids.length === 0) return null;
  return (
    <span className="cite">
      {ids.map((id) => {
        const s = sources[id];
        if (!s) {
          if (import.meta.env.DEV) console.warn('Unknown source id', id);
          return null;
        }
        return (
          <a key={id} href={s.url} target="_blank" rel="noopener noreferrer" title={`${s.publisher} — ${s.title} (${s.date})`}>
            <span className={`t-${s.type}`}>{SOURCE_TYPE_LABEL[s.type]}</span> {s.publisher} · {s.date}
            <span className="sr-only"> (새 창에서 출처 열기)</span>
          </a>
        );
      })}
    </span>
  );
}

export function Claim({ kind }: { kind: ClaimKind }) {
  return <span className={`tag ${kind}`}>{CLAIM_LABEL[kind]}</span>;
}

export function RegionBadge({ region }: { region: Region }) {
  return <span className={`region ${region}`}>{REGION_LABEL[region]}</span>;
}

export function ConceptBadge({ text = '이해를 돕기 위한 개념 모형' }: { text?: string }) {
  return <span className="concept-badge" role="note">◇ {text}</span>;
}

export function More({ title, children, open }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="more" open={open}>
      <summary>{title}</summary>
      <div className="body">{children}</div>
    </details>
  );
}

/** 섹션 하단 참고자료 묶음 (기본 개념·일반 원리용) */
export function Refs({ ids, title = '이 섹션의 참고자료' }: { ids: string[]; title?: string }) {
  return (
    <div className="refs">
      <h4>{title}</h4>
      <ol>
        {ids.map((id) => {
          const s = sources[id];
          if (!s) return null;
          return (
            <li key={id}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">{s.publisher} — {s.title}</a> ({s.date}, {SOURCE_TYPE_LABEL[s.type]})
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ClaimLegend() {
  return (
    <div className="legend-claims small" aria-label="표시 기준">
      <Claim kind="fact" /> <Claim kind="claim" /> <Claim kind="calc" /> <Claim kind="assume" /> <Claim kind="unverified" />
      <span className="muted xs">출처 칩: 공식 · 독립 검증 · 언론 · 2차 자료</span>
    </div>
  );
}
