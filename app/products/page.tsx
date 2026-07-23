import Link from "next/link";
import { findAllProductsWithLotCount } from "@/lib/db/products";

// 新規登録が即反映されるよう、常にリクエスト時にDBを読む。
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await findAllProductsWithLotCount();

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">商品一覧</h1>
        <Link href="/scan" className="text-sm text-blue-600 underline">
          スキャン
        </Link>
      </header>

      {products.length === 0 ? (
        <p className="text-gray-500">
          登録された商品がありません。シード投入またはスキャンで追加してください。
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map((p) => (
            <li key={p.gtin}>
              <Link
                href={`/products/${p.gtin}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{p.name}</p>
                  <p className="truncate text-sm text-gray-500">
                    {[p.manufacturer, p.category].filter(Boolean).join(" / ") ||
                      "—"}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">
                    {p.gtin}
                  </p>
                </div>
                <span className="ml-3 shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {p.lotCount} ロット
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
