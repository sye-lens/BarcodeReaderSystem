import { describe, it, expect } from "vitest";
import { normalizeGs1Input } from "./normalizeGs1Input";

const GS = "\x1d"; // FNC1(グループセパレータ)

describe("normalizeGs1Input", () => {
  it("可視区切り文字 | を FNC1 に変換する", () => {
    expect(normalizeGs1Input("10ABC|17260909")).toBe(`10ABC${GS}17260909`);
  });

  it("| が複数あってもすべて変換する", () => {
    expect(normalizeGs1Input("a|b|c")).toBe(`a${GS}b${GS}c`);
  });

  it("| を含まない文字列はそのまま返す", () => {
    expect(normalizeGs1Input("0123456789012345")).toBe("0123456789012345");
  });

  it("前後の空白を除去する", () => {
    expect(normalizeGs1Input("  10ABC  ")).toBe("10ABC");
  });

  it("既にFNC1が含まれていればそのまま保持する", () => {
    expect(normalizeGs1Input(`10ABC${GS}17`)).toBe(`10ABC${GS}17`);
  });
});
