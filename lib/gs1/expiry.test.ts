import { describe, it, expect } from "vitest";   
import { convertExpiry } from "./expiry";              

describe("convertExpiry", () => {                      
  it("有効期限を正しく変換できる", () => {
    const rawExpiry = "260909";
    const result = convertExpiry(rawExpiry);
    expect(result).toBe("2026-09-09");
  });

  it("rawExpiryが991231の時、正しく変換できるか", () => {
    const rawExpiry = "991231";
    const result = convertExpiry(rawExpiry);
    expect(result).toBe("1999-12-31");
  });

  it("rawExpiryが260900の場合、2026-09-30になる", () => {
    const rawExpiry = "260900";
    const result = convertExpiry(rawExpiry);
    expect(result).toBe("2026-09-30");
  });

  it("rawExpiryが261232の場合、例外を返す", () => {
    const rawExpiry = "261232";
    expect(() => convertExpiry(rawExpiry)).toThrow("日が不正です");
  });

  it("rawExpiryが26093の場合、例外を返す", () => {
    const rawExpiry = "26093";
    expect(() => convertExpiry(rawExpiry)).toThrow("期限が6文字ではありません");});

  it("rawExpiryが261313の場合、例外を返す", () => {
    const rawExpiry = "261313";
    expect(() => convertExpiry(rawExpiry)).toThrow("月が不正です");
  });
  it ("rawExpiryが260230の場合、例外を返す", () => {
    const rawExpiry = "260230";
    expect(() => convertExpiry(rawExpiry)).toThrow("日が不正です");
  });
  });