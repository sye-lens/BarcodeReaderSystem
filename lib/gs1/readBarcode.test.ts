import { describe, it, expect } from "vitest";
import { readBarcode } from "./readBarcode";

describe("readBarcode", () => {
  it("GS1文字列から gtin・変換済み期限(YYYY-MM-DD)・ロット番号を返す", () => {
    const raw = "0123456789012345112601011726090910ABC1234"; // 01+GTIN, 11製造日, 17期限, 10ロット
    const result = readBarcode(raw);
    expect(result.gtin).toBe("23456789012345");
    expect(result.expiryDate).toBe("2026-09-09"); // convertExpiry を通した4桁年
    expect(result.lotNumber).toBe("ABC1234");
  });

  it("パース不能な文字列では parseGs1 の例外が伝播する", () => {
    expect(() => readBarcode("99invalid")).toThrow();
  });
});
