export type Gs1ParseResult = {
  gtin: string;
  lotNumber: string;
  rawExpiry: string;
};
export function parseGs1(raw: string): Gs1ParseResult {
  let gtin: string = "";
  let lotNumber: string = "";
  let rawExpiry: string = "";
  let productDate: string = "";
  let pos = 0
  while (pos < raw.length){
    const ai = raw.slice(pos, pos + 2)              // 今の位置でAIを2文字読む
    if (ai === "01") { gtin = raw.slice(pos + 2, pos + 16);  pos += 16; }
    else if (ai === "17") { rawExpiry = raw.slice(pos + 2, pos + 8);  pos += 8;  }
    else if (ai === "11") { productDate = raw.slice(pos + 2, pos + 8);  pos += 8;  }
    else if (ai === "10") { lotNumber = raw.slice(pos + 2);  pos += lotNumber.length + 2; }             // 可変長
    else { throw new Error(`バーコードを解析できません: ${raw}`); }
  }   

  return { gtin, lotNumber, rawExpiry }
};