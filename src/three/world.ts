/**
 * 확대 여행(데이터센터 → 칩 내부)의 공통 좌표계. 단위는 미터.
 * 퓨리오사AI RNGD 카드·NXT RNGD 서버의 공개 형상(4U·카드 8장, 듀얼 슬롯·풀하이트·3/4 길이,
 * 인터포저 위 칩 1개 + HBM3 2스택)을 기준으로 했고, 공개되지 않은 세부 치수는 근사값입니다.
 */
import { Vector3 } from 'three';

export const U = 0.04445; // 랙 1U 높이

/* 데이터센터 홀 */
export const HALL = { w: 28, d: 18 };
export const ROW_Z = [-5, 0.5, 6];
export const RACKS_PER_ROW = 16;
export const RACK = { w: 0.6, d: 1.2, h: 2.0, pitch: 0.62 };
export const rackX = (i: number) => (i - 8) * RACK.pitch;
export const TARGET_ROW = 1;
export const TARGET_RACK = 8; // x = 0
export const RACK_FRONT_Z = ROW_Z[TARGET_ROW] + RACK.d / 2; // 1.1

/* 랙 안의 서버 (NXT RNGD: 4U) */
export const SERVER = { w: 0.44, h: 4 * U - 0.003, d: 0.8 };
export const SERVERS_IN_RACK = 5; // 15 kW 공랭 랙에 최대 5대(제조사 주장)
export const serverBottomY = (k: number) => 0.3 + k * (4 * U + U);
export const TARGET_SERVER = 2;
export const SERVER_FRONT_Z = RACK_FRONT_Z - 0.02;
export const SERVER_CZ = SERVER_FRONT_Z - SERVER.d / 2;
export const SERVER_SLIDE = 0.92; // 정비할 때처럼 레일로 앞으로 빼냄

/* RNGD 카드 (듀얼 슬롯, 풀하이트, 3/4 길이 — 치수 근사) */
export const CARD = { len: 0.242, h: 0.111, t: 0.037 };
export const CARDS = 8;
export const cardX = (j: number) => -0.175 + j * 0.05;
export const TARGET_CARD = 3;
export const CARD_CZ = SERVER_FRONT_Z - SERVER.d + 0.03 + CARD.len / 2;
export const CARD_LIFT = 0.17;
export const cardCY = () => serverBottomY(TARGET_SERVER) + 0.014 + CARD.h / 2;

/* 카드 로컬 좌표(길이=x, 높이=y, 부품 면=+z) 안의 패키지 위치 */
export const PKG_LOCAL = new Vector3(0.012, 0.006, 0.0016);
export const PKG = { sub: [0.065, 0.05, 0.0022], ip: [0.05, 0.03, 0.0011], die: [0.024, 0.026, 0.0008], hbm: [0.011, 0.01, 0.0009] } as const;
export const HBM_X = 0.0185;

/** 카드 로컬 좌표 → 월드 좌표 (카드는 y축으로 +90° 회전: 로컬 +z → 월드 +x, 로컬 +x → 월드 -z) */
export function cardLocalToWorld(local: Vector3, slide: number, lift: number) {
  return new Vector3(
    cardX(TARGET_CARD) + local.z,
    cardCY() + lift + local.y,
    CARD_CZ + slide - local.x,
  );
}

/* ───── 단계별 카메라 키프레임 ───── */
export interface Key { target: Vector3; dir: Vector3; dist: number }

const n = (x: number, y: number, z: number) => new Vector3(x, y, z).normalize();

export function keyframes(): Key[] {
  const serverOutZ = SERVER_CZ + SERVER_SLIDE;
  const sy = serverBottomY(TARGET_SERVER) + SERVER.h / 2;
  const cardC = cardLocalToWorld(new Vector3(0, 0, 0.01), SERVER_SLIDE, CARD_LIFT);
  const pkgC = cardLocalToWorld(PKG_LOCAL.clone().add(new Vector3(0, 0, 0.002)), SERVER_SLIDE, CARD_LIFT);
  const dieC = cardLocalToWorld(PKG_LOCAL.clone().add(new Vector3(0, 0, 0.004)), SERVER_SLIDE, CARD_LIFT);
  return [
    { target: new Vector3(0, 0.6, 0.5), dir: n(0.9, 0.85, 1.25), dist: 17 },
    { target: new Vector3(0, 1.0, RACK_FRONT_Z), dir: n(0.4, 0.2, 1), dist: 2.6 },
    { target: new Vector3(0, sy, serverOutZ), dir: n(0.45, 1.05, 0.95), dist: 1.05 },
    { target: cardC, dir: n(1, 0.38, 0.32), dist: 0.44 },
    { target: pkgC, dir: n(1, 0.42, 0.3), dist: 0.115 },
    { target: dieC, dir: n(1, 0.75, 0.25), dist: 0.04 },
  ];
}

export { HOLD, smooth, effective, phase } from './progress';
