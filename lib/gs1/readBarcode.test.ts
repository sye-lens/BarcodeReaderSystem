import { describe, it, expect } from "vitest";   
import { readBarcode } from "./readBarcode";              

describe("readBarcode", () => {                      
  it("製造日(AI 11)が混ざっても正しく抽出できる", () => {
    const raw = "0123456789012345112601011726090910ABC1234";  // 入力
    const result = readGs1barcode(raw);
    expect(result.gtin).toBe("23456789012345");              //   期待する結果
    expect(result.expiryDate).toBe("26-09-09");
    expect(result.lotNumber).toBe("ABC1234");
  });
  });