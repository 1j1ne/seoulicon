/**
 * “AI가 질문을 받았을 때” 처리 과정 애니메이션의 단계 설명.
 * 일반적인 대형 언어모델(LLM) 추론 흐름을 NPU 서버 기준으로 단순화한 개념 설명입니다.
 */
export type Where = 'user' | 'cpu' | 'link' | 'hbm' | 'sram' | 'core';

export interface ProcStage {
  key: string;
  title: string;
  where: string;
  plain: string;
  detail: string;
  /** 재생 시간(초) — 디코드 단계는 토큰 하나당 시간 */
  dur: number;
}

export const procStages: ProcStage[] = [
  {
    key: 'arrive',
    title: '① 질문 도착',
    where: '내 기기 → 데이터센터 서버',
    plain: '입력한 문장이 인터넷을 타고 데이터센터의 서버에 도착합니다.',
    detail: '서버는 여러 사용자의 요청을 모아 차례로, 또는 묶어서(배치) 처리합니다.',
    dur: 1.4,
  },
  {
    key: 'tokenize',
    title: '② 토큰으로 쪼개기',
    where: '서버 CPU',
    plain: 'AI는 글자를 그대로 읽지 못합니다. 문장을 작은 조각(토큰)으로 나누고 각 조각에 번호를 붙입니다.',
    detail: '아래 조각과 번호는 설명용 예시입니다. 실제 토크나이저는 모델마다 다르게 나눕니다.',
    dur: 1.8,
  },
  {
    key: 'send',
    title: '③ NPU로 전달',
    where: 'PCIe 연결 통로',
    plain: '토큰 번호가 CPU에서 PCIe 통로를 지나 NPU 카드로 전달됩니다.',
    detail: '모델의 숫자(가중치)는 서비스 시작 때 이미 NPU 옆 HBM 메모리에 올려 둔 상태입니다.',
    dur: 1.2,
  },
  {
    key: 'prefill',
    title: '④ 질문 전체 이해하기 (프리필)',
    where: 'HBM → SRAM → 연산 슬라이스',
    plain: '질문의 모든 토큰을 한꺼번에 계산해 문맥을 파악합니다. 이때 계산 결과 일부를 “KV 캐시”로 HBM에 저장해 둡니다.',
    detail: '토큰 여러 개를 동시에 처리하므로 연산기가 바쁘게 일하는 구간입니다. 답의 첫 글자가 나오기까지 걸리는 시간에 영향을 줍니다.',
    dur: 2.6,
  },
  {
    key: 'decode',
    title: '⑤ 다음 단어 하나씩 만들기 (디코드)',
    where: 'HBM ⇄ NPU 칩 (반복)',
    plain: '다음에 올 단어 후보들의 확률을 계산해 하나를 고르고, 그 단어를 다시 입력으로 넣어 다음 단어를 만듭니다. 답이 끝날 때까지 반복합니다.',
    detail: '단어 하나를 만들 때마다 모델 가중치 전체를 HBM에서 다시 읽어야 합니다. 그래서 이 구간은 연산 속도보다 메모리 대역폭이 속도를 좌우하는 경우가 많습니다.',
    dur: 1.5,
  },
  {
    key: 'stream',
    title: '⑥ 글자로 바꿔 돌려보내기',
    where: 'NPU → CPU → 내 기기',
    plain: '만들어진 토큰 번호를 다시 글자로 바꿔 화면으로 보냅니다. 그래서 답이 한 글자씩 나타나는 것처럼 보입니다.',
    detail: '실제로는 디코드 중에 토큰이 나올 때마다 바로바로 보냅니다(스트리밍).',
    dur: 1.4,
  },
];

/** 예시 답변 토큰과 각 단계의 후보 확률(설명용 예시 값) */
export const answerTokens: { tok: string; alts: [string, number][] }[] = [
  { tok: '칩', alts: [['칩', 0.58], ['AI', 0.24], ['저', 0.11]] },
  { tok: '이', alts: [['이', 0.71], ['은', 0.18], ['의', 0.06]] },
  { tok: ' 단어', alts: [[' 단어', 0.47], [' 답', 0.33], [' 글자', 0.12]] },
  { tok: '를', alts: [['를', 0.83], ['로', 0.09], ['들', 0.05]] },
  { tok: ' 하나씩', alts: [[' 하나씩', 0.64], [' 차례로', 0.22], [' 빠르게', 0.08]] },
  { tok: ' 만들어', alts: [[' 만들어', 0.69], [' 골라', 0.17], [' 계산해', 0.1]] },
  { tok: '요.', alts: [['요.', 0.77], ['요!', 0.15], ['요', 0.05]] },
];

/** 설명용 토큰 분할 — 실제 토크나이저가 아님 */
export function demoTokenize(q: string): { t: string; id: number }[] {
  const words = q.trim().split(/(\s+)/).filter((w) => w.trim().length > 0);
  const out: string[] = [];
  words.forEach((w, i) => {
    const prefix = i === 0 ? '' : ' ';
    const m = w.match(/^(.*?)([?.!,]*)$/)!;
    const body = m[1];
    const punct = m[2];
    if (body.length > 2) {
      out.push(prefix + body.slice(0, 2), body.slice(2));
    } else if (body) out.push(prefix + body);
    if (punct) out.push(punct);
  });
  return out.slice(0, 12).map((t) => {
    let h = 7;
    for (const c of t) h = (h * 31 + c.charCodeAt(0)) % 99991;
    return { t, id: 1000 + (h % 89000) };
  });
}
