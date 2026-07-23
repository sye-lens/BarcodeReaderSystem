const FNC1 = "\x1d"; // GS1のグループセパレータ(ASCII 29)

// 手入力用: 貼り付けにくい FNC1 の代わりに可視文字 | を入力してもらい、送信前に FNC1 へ戻す。
// カメラ読取テキストはそのまま通る（| を含まなければ無変換）。
export function normalizeGs1Input(input: string): string {
  return input.trim().replaceAll("|", FNC1);
}
