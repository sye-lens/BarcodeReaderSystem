export type Gs1ParseResult = {
  gtin: string;
  lotNumber: string;
  rawExpiry: string;
};

function readFixed(raw: string, start: number, length: number, label: string): string {
  const value = raw.slice(start, start + length);
  if (value.length !== length) {
    throw new Error(`${label} は ${length} 文字必要です:  "${value}"`);
  }
  return value;
}
  
export function parseGs1(raw: string): Gs1ParseResult {
  let gtin: string = "";
  let lotNumber: string = "";
  let rawExpiry: string = "";
  let productDate: string = "";
  let pos = 0
  const FNC1 = "\x1d"  // ASCIIコードで29番目の文字（GS）を表す
  while (pos < raw.length){
    const ai = raw.slice(pos, pos + 2)              // 今の位置でAIを2文字読む
    if (ai === "01") { 
      gtin = readFixed(raw, pos + 2, 14, "GTIN");
      pos += 16; }
    else if (ai === "17") { 
      rawExpiry = readFixed(raw, pos + 2, 6, "Raw expiry");
      pos += 8;  }
    else if (ai === "11") { 
      productDate = readFixed(raw, pos + 2, 6, "Product date");
      pos += 8;  }
    else if (ai === "10") { 
      const start = pos +2;
      const sep = raw.indexOf(FNC1, start);
      if (sep === -1){lotNumber = raw.slice(start);  pos = raw.length; }
      else { lotNumber = raw.slice(start, sep);  pos = sep + 1; }
    }
    else { throw new Error(`不明なAI: ${ai}`); }  // 未知のAIが出てきたら例外を返す
  }
  if (gtin === "" || rawExpiry === "" || lotNumber === "") { 
    throw new Error("必要なAIが揃っていません");
  }  // 必須AIが揃ったら終了
  return { gtin, lotNumber, rawExpiry }
}