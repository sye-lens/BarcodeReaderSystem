import { describe, it, expect } from "vitest";   // ① 道具を読み込む
import { parseGs1 } from "./parse";              // ② テスト対象を読み込む

describe("parseGs1", () => {                      // ③ テストのまとまり
  it("製造日(AI 11)が混ざっても正しく抽出できる", () => {
    const raw = "0123456789012345112601011726090910ABC1234";                            //   入力（あなたが組み立てる）
    const result = parseGs1(raw);
    expect(result.gtin).toBe("23456789012345");              //   期待する結果
    expect(result.rawExpiry).toBe("260909");
    expect(result.lotNumber).toBe("ABC1234");
  });
});