import { describe, it, expect } from "vitest";   
import { parseGs1 } from "./parse";              

describe("parseGs1", () => {                      
  it("製造日(AI 11)が混ざっても正しく抽出できる", () => {
    const raw = "0123456789012345112601011726090910ABC1234";  // 入力
    const result = parseGs1(raw);
    expect(result.gtin).toBe("23456789012345");              //   期待する結果
    expect(result.rawExpiry).toBe("260909");
    expect(result.lotNumber).toBe("ABC1234");
  });
  it("可変長フィールドの後にFNC1区切りで別AIが続いても正しく抽出できる", () => {
    const raw = "01234567890123451126010110ABC1234\x1d17260909";    // 入力
    const result = parseGs1(raw);
    expect(result.gtin).toBe("23456789012345");              //   期待する結果
    expect(result.rawExpiry).toBe("260909");
    expect(result.lotNumber).toBe("ABC1234");           
  });
  it("未知のAIが含まれる場合は例外を返す", () => {
    const raw = "012345678901234521123456781126010110ABC1234\x1d17260909";    // 入力
    expect(() => parseGs1(raw)).toThrow();           
  });
  it("必須AIの17が存在しない場合は例外を返す", () => {
    const raw = "01234567890123451126010110ABC1234\x1d";    // 入力
    expect(() => parseGs1(raw)).toThrow("必要なAIが揃っていません");       
  });
  it("01が途中で切れている場合は例外を返す", () => {
    const raw = "01234567890";    // 入力
    expect(() => parseGs1(raw)).toThrow("GTIN は 14 文字必要です");       
  });
  it("17が途中で切れている場合は例外を返す", () => {
    const raw = "0123456789012345172609";    // 入力
    expect(() => parseGs1(raw)).toThrow("Raw expiry は 6 文字必要です");       
  });
  it("11が途中で切れている場合は例外を返す", () => {
    const raw = "0123456789012345112601";    // 入力
    expect(() => parseGs1(raw)).toThrow("Product date は 6 文字必要です");       
  });
  });