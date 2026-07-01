export function convertExpiry(rawExpiry: string): string {
  // 1."260909"を3つに切り分ける
  const yy = rawExpiry.slice(0, 2); // 年
  const mm = rawExpiry.slice(2, 4); // 月
  let dd  = rawExpiry.slice(4, 6); // 日

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
  if (dd === "00") {
    // 日が00の場合、月の最終日を取得する
    const lastDay = new Date(yyyy, parseInt(mm, 10), 0).getDate();
    dd = String(lastDay);
  }
  // 3.日付をYYYY-MM-DD形式に変換する
  return `${yyyy}-${mm}-${dd}`;
}