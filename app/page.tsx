import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-1 flex-col justify-center gap-8 p-6">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">試薬管理システム</h1>
        <p className="text-sm text-gray-500">
          GS1コードで試薬の使用開始・使用期限・ロット番号を記録します
        </p>
      </header>

      <nav className="flex flex-col gap-3">
        <Link
          href="/scan"
          className="flex flex-col rounded-xl bg-blue-600 p-5 text-white transition-colors hover:bg-blue-700"
        >
          <span className="text-lg font-semibold">スキャンして登録</span>
          <span className="text-sm text-blue-100">
            カメラまたは手入力でGS1コードを読み取る
          </span>
        </Link>

        <Link
          href="/products"
          className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 text-gray-900 transition-colors hover:bg-gray-50"
        >
          <span className="text-lg font-semibold">商品一覧を見る</span>
          <span className="text-sm text-gray-500">
            登録済み商品からロット記録を閲覧する
          </span>
        </Link>
      </nav>
    </main>
  );
}
