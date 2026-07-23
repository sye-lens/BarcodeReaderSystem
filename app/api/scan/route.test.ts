import { describe, it, expect, vi, beforeEach } from "vitest";

// DBアクセスはモックして、ルートのオーケストレーション（分岐とステータス）だけを検証する。
vi.mock("@/lib/db/products", () => ({ findProductByGtin: vi.fn() }));
vi.mock("@/lib/db/reagentLots", () => ({ registerReagentLot: vi.fn() }));

import { POST } from "./route";
import { findProductByGtin } from "@/lib/db/products";
import { registerReagentLot } from "@/lib/db/reagentLots";

// 01+GTIN(14) / 11製造日 / 17期限 / 10ロット
const VALID_RAW = "0123456789012345112601011726090910ABC1234";
const GTIN = "23456789012345";
const EXPIRY = "2026-09-09";
const LOT = "ABC1234";

function postRequest(body: unknown): Request {
  return new Request("http://localhost/api/scan", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const product = { gtin: GTIN, name: "テスト試薬", manufacturer: "M社", category: "生化学" };

beforeEach(() => {
  vi.mocked(findProductByGtin).mockReset();
  vi.mocked(registerReagentLot).mockReset();
});

describe("POST /api/scan", () => {
  it("登録済みGTIN・新規ロットなら201で登録内容を返す", async () => {
    vi.mocked(findProductByGtin).mockResolvedValue(product);
    vi.mocked(registerReagentLot).mockResolvedValue({ id: "uuid-1" } as never);

    const res = await POST(postRequest({ raw: VALID_RAW }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.gtin).toBe(GTIN);
    expect(json.expiryDate).toBe(EXPIRY);
    expect(json.lotNumber).toBe(LOT);
    expect(json.product).toMatchObject({ name: "テスト試薬" });
    expect(vi.mocked(registerReagentLot)).toHaveBeenCalledWith(
      expect.objectContaining({ gtin: GTIN, lotNumber: LOT, expiryDate: EXPIRY }),
    );
  });

  it("未登録GTINなら404で読取結果(gtin等)を返す", async () => {
    vi.mocked(findProductByGtin).mockResolvedValue(undefined);

    const res = await POST(postRequest({ raw: VALID_RAW }));
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.gtin).toBe(GTIN);
    expect(json.lotNumber).toBe(LOT);
    expect(vi.mocked(registerReagentLot)).not.toHaveBeenCalled();
  });

  it("パース不能な文字列なら400", async () => {
    const res = await POST(postRequest({ raw: "99invalid" }));
    expect(res.status).toBe(400);
    expect(vi.mocked(findProductByGtin)).not.toHaveBeenCalled();
  });

  it("同一ロットの重複登録なら409", async () => {
    vi.mocked(findProductByGtin).mockResolvedValue(product);
    vi.mocked(registerReagentLot).mockResolvedValue(null);

    const res = await POST(postRequest({ raw: VALID_RAW }));
    expect(res.status).toBe(409);
  });

  it("rawが無いリクエストは400", async () => {
    const res = await POST(postRequest({}));
    expect(res.status).toBe(400);
  });

  it("DB接続エラーなら503で明快なメッセージを返す", async () => {
    vi.mocked(findProductByGtin).mockRejectedValue(
      new Error("connect ECONNREFUSED 127.0.0.1:5432"),
    );

    const res = await POST(postRequest({ raw: VALID_RAW }));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });
});
