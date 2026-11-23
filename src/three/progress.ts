// three.js에 의존하지 않는 진행률 계산 (첫 화면 번들에서 3D 라이브러리를 분리하기 위해 따로 둠)
/** 스텝 사이 0~1 구간에서 앞부분은 머무르고 뒷부분에서 이동 */
export const HOLD = 0.4;
export const smooth = (t: number) => t * t * (3 - 2 * t);
export function effective(progress: number) {
  const s = Math.floor(progress);
  const f = progress - s;
  return s + (f < HOLD ? 0 : smooth((f - HOLD) / (1 - HOLD)));
}
export const phase = (eff: number, from: number) => smooth(Math.min(1, Math.max(0, eff - from)));
