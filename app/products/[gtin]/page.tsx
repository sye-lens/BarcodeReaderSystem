import Link from "next/link";
import { notFound } from "next/navigation";
import { findProductByGtin } from "@/lib/db/products";
import { findLotsByGtin } from "@/lib/db/reagentLots";

// 新規登録が即反映されるよう、常にリクエスト時にDBを読む。
export const dynamic = "force-dynamic";

export default async function ProductLotsPage({
  params,
}: {
  params: Promise<{ gtin: string }>;
}) {
  const { gtin } = await params;

  const product = await findProductByGtin(gtin);
  if (!product) notFound();

  const lots = await findLotsByGtin(gtin);

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 p-4">
      <header className="flex flex-col gap-1">
        <Link href="/products" className="text-sm text-blue-600 underline">
          ← 商品一覧
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-sm text-gray-500">
          {[product.manufacturer, product.category].filter(Boolean).join(" / ") ||
            "—"}
          <span className="ml-2 font-mono text-xs text-gray-400">{gtin}</span>
        </p>
      </header>

      {lots.length === 0 ? (
        <p className="text-gray-500">まだロットが登録されていません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2 pr-3 font-medium">ロット番号</th>
                <th className="py-2 pr-3 font-medium">使用開始日</th>
                <th className="py-2 pr-3 font-medium">使用期限</th>
                <th className="py-2 font-medium">開封者</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr
                  key={lot.id}
                  className="border-b border-gray-100 text-gray-900"
                >
                  <td className="py-2 pr-3 font-mono">{lot.lot_number}</td>
                  <td className="py-2 pr-3">{lot.opened_at ?? "-"}</td>
                  <td className="py-2 pr-3">{lot.expiry_date}</td>
                  <td className="py-2">{lot.opened_by ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
