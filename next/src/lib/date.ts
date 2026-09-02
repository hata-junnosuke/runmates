/**
 * 日付ユーティリティ（TZ非依存）
 *
 * 本番のNext.jsはVercel上でUTC実行されるため、素の `new Date()` から
 * getFullYear()/getMonth() で「今日」を求めると、JST 0:00〜8:59 の間だけ前日を指す。
 * さらにクライアントコンポーネントはSSR時＝サーバーのTZ、ハイドレーション後＝ブラウザのTZで
 * 評価されるため、環境変数 TZ では直せない。
 *
 * そこで「今が何日・何月か」の判定はフロントで一切行わず、JSTの Date.current を持つ
 * Railsに委ねている（`/running_statistics` の today、および一覧APIの年月省略時のデフォルト）。
 * ここに置くのは、受け取った日付を組み立て・分解・整形するだけのTZ非依存な処理に限ること
 * （eslint の no-restricted-syntax で強制している）。
 */

const pad2 = (value: number): string => String(value).padStart(2, '0');

/**
 * Date をローカルの年月日から YYYY-MM-DD に変換する。
 * `toISOString()` はTZに関係なく常にUTCになるため使わないこと。
 */
export function formatDateString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/**
 * YYYY-MM-DD を数値に分解する。Date を経由しないのでTZの影響を受けない。
 */
export function splitDateString(dateString: string): {
  year: number;
  month: number;
  day: number;
} {
  const parts = dateString.split('-');
  return {
    year: Number(parts[0]),
    month: Number(parts[1]),
    day: Number(parts[2]),
  };
}

/**
 * YYYY-MM-DD をローカル深夜の Date としてパースする。
 * `new Date('YYYY-MM-DD')` はUTC深夜として解釈されるため、
 * UTCより西のTZのブラウザでは1日前になってしまう。
 */
export function parseDateString(dateString: string): Date {
  const { year, month, day } = splitDateString(dateString);
  return new Date(year, month - 1, day);
}

/**
 * YYYY-MM-DD を日本語表記にフォーマットする。
 */
export function formatJapaneseDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return parseDateString(dateString).toLocaleDateString('ja-JP', options);
}
