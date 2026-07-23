import { readBarcode } from "@/lib/gs1/readBarcode";
import { findProductByGtin } from "@/lib/db/products";
import { registerReagentLot } from "@/lib/db/reagentLots";

// スキャン登録: GS1文字列を受け取り、商品照合→ロット登録まで行う。
export async function POST(request: Request) {
  // 1. リクエストボディから raw を取り出す
  let raw: unknown;
  try {
    const body = await request.json();
    raw = body?.raw;
  } catch {
    return Response.json({ error: "リクエストボディが不正です" }, { status: 400 });
  }
  if (typeof raw !== "string" || raw.length === 0) {
    return Response.json({ error: "raw は必須です" }, { status: 400 });
  }

  // 2. GS1文字列をパース＆期限変換（失敗は400）
  let scan;
  try {
    scan = readBarcode(raw);
  } catch (e) {
    const message = e instanceof Error ? e.message : "読み取りに失敗しました";
    return Response.json({ error: message }, { status: 400 });
  }

  // 3. 商品マスタ照合（未登録は404。読取結果を返してシード投入に使えるようにする）
  const product = await findProductByGtin(scan.gtin);
  if (!product) {
    return Response.json(
      {
        error: "未登録のGTINです",
        gtin: scan.gtin,
        lotNumber: scan.lotNumber,
        expiryDate: scan.expiryDate,
      },
      { status: 404 },
    );
  }

  // 4. ロット登録（(gtin, lot_number) 重複は409で弾く）
  const lot = await registerReagentLot(scan);
  if (!lot) {
    return Response.json({ error: "既に登録済みのロットです" }, { status: 409 });
  }

  // 5. 登録成功
  return Response.json(
    {
      product,
      gtin: scan.gtin,
      lotNumber: scan.lotNumber,
      expiryDate: scan.expiryDate,
    },
    { status: 201 },
  );
}
