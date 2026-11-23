/** 사이트 전체에 표시되는 자료 기준일 */
export const DATA_AS_OF = '2026-11-22';

/**
 * 주장의 성격 — 화면의 작은 태그로 표시됩니다.
 *  fact     : 공식 문서·다수 보도로 확인된 사실
 *  claim    : 제조사·당사자의 주장(독립 검증 없음)
 *  calc     : 이 사이트가 공개 수치로 계산한 결과
 *  assume   : 설명용 가정 / 사용자가 입력한 가정
 *  unverified: 2차 자료만 있거나 출처가 엇갈려 추가 확인이 필요한 수치
 */
export type ClaimKind = 'fact' | 'claim' | 'calc' | 'assume' | 'unverified';

export const CLAIM_LABEL: Record<ClaimKind, string> = {
  fact: '확인된 사실',
  claim: '제조사 주장',
  calc: '계산 결과',
  assume: '설명용 가정',
  unverified: '검증 필요',
};

export type Region = 'kr' | 'us';
export const REGION_LABEL: Record<Region, string> = { kr: '한국', us: '미국' };

/** 사이트에서 "확인 못 함" 류 표현을 통일 */
export const NA = {
  notComparable: '직접 비교 불가',
  undisclosed: '비공개',
  quote: '견적 필요',
  notFound: '이번 조사에서 확인 못 함',
  notSold: '판매하지 않음',
} as const;
