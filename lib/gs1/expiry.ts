export function convertExpiry(rawExpiry: string): string {
  if (!/^\d{6}$/.test(rawExpiry)) {
    throw new Error("期限が6文字ではありません");
  }

  // 1."260909"を3つに切り分ける
  const yy = rawExpiry.slice(0, 2); // 年
  const mm = rawExpiry.slice(2, 4); // 月
  let dd  = rawExpiry.slice(4, 6); // 日

  // 月の妥当性をチェックする
  if (parseInt(mm, 10) < 1 || parseInt(mm, 10) > 12) {
    throw new Error("月が不正です");
  }
  // ※ yyを4桁の年に変換する際、スライディング方式で変換する
  const now = new Date();
  const currentYY : number = now.getFullYear() % 100; // 現在の年の下2桁
  const diff = parseInt(yy, 10) - currentYY; 

  let century: number;
  const currentCentury : number = Math.floor(now.getFullYear() / 100) * 100;             
  if (diff >= 51) {
    century = currentCentury - 100;                  // 前の世紀
  } else if (diff <= -50) {
    century = currentCentury + 100;                  // 次の世紀
  } else {
    century = currentCentury ;                  // 今の世紀
  }
  
  // 2.年を4桁に変換する
  const yyyy = parseInt(yy, 10) + century; // 2000年以降の年として扱う

  // 日の妥当性をチェックする
  const lastDayOfMonth = new Date(yyyy, parseInt(mm, 10), 0).getDate();
  if (parseInt(dd, 10) > lastDayOfMonth) {
    throw new Error("日が不正です");
  }
  else if (dd === "00") {
    // 日が00の場合、月の最終日を取得する
    dd = String(lastDayOfMonth);
  }
  // 3.日付をYYYY-MM-DD形式に変換する
  return `${yyyy}-${mm}-${dd}`;
}