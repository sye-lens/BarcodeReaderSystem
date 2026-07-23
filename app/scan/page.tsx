"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { normalizeGs1Input } from "@/lib/gs1/normalizeGs1Input";
import { useBarcodeScanner } from "./useBarcodeScanner";

type ScanResult = {
  status: number;
  data: {
    error?: string;
    product?: { name: string; manufacturer: string | null; category: string | null };
    gtin?: string;
    lotNumber?: string;
    expiryDate?: string;
  };
};

export default function ScanPage() {
  const [manual, setManual] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const submit = useCallback(async (raw: string) => {
    const normalized = normalizeGs1Input(raw);
    if (!normalized) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ raw: normalized }),
      });
      const data = await res.json();
      setResult({ status: res.status, data });
    } catch {
      setResult({ status: 0, data: { error: "通信に失敗しました" } });
    } finally {
      setLoading(false);
    }
  }, []);

  const { videoRef, active, error, start, stop } = useBarcodeScanner({
    onDecoded: submit,
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">試薬スキャン</h1>
        <Link href="/products" className="text-sm text-blue-600 underline">
          商品一覧
        </Link>
      </header>

      {/* カメラ */}
      <section className="flex flex-col gap-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/80">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
          {!active && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
              カメラは停止中
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!active ? (
            <button
              onClick={start}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white active:bg-blue-700"
            >
              カメラで読み取る
            </button>
          ) : (
            <button
              onClick={stop}
              className="flex-1 rounded-md bg-gray-600 px-4 py-2 font-medium text-white active:bg-gray-700"
            >
              停止
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">
            カメラエラー: {error}（下の手入力をお使いください）
          </p>
        )}
      </section>

      {/* 手入力フォールバック */}
      <section className="flex flex-col gap-2">
        <label htmlFor="manual" className="text-sm font-medium">
          手入力（区切りは <code className="rounded bg-gray-100 px-1">|</code> で代用可）
        </label>
        <textarea
          id="manual"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          rows={3}
          placeholder="01... 17... 10..."
          className="w-full rounded-md border border-gray-300 p-2 font-mono text-sm"
        />
        <button
          onClick={() => submit(manual)}
          disabled={loading || manual.trim().length === 0}
          className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white active:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "送信中..." : "登録する"}
        </button>
      </section>

      {/* 結果表示 */}
      {result && <ResultCard result={result} />}
    </main>
  );
}

function ResultCard({ result }: { result: ScanResult }) {
  const { status, data } = result;

  if (status === 201) {
    return (
      <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4">
        <p className="font-bold text-emerald-800">登録しました</p>
        <dl className="mt-2 grid grid-cols-[6rem_1fr] gap-y-1 text-sm">
          <dt className="text-gray-500">商品名</dt>
          <dd>{data.product?.name}</dd>
          <dt className="text-gray-500">GTIN</dt>
          <dd className="font-mono">{data.gtin}</dd>
          <dt className="text-gray-500">ロット</dt>
          <dd className="font-mono">{data.lotNumber}</dd>
          <dt className="text-gray-500">使用期限</dt>
          <dd>{data.expiryDate}</dd>
        </dl>
      </div>
    );
  }

  const tone =
    status === 409
      ? "border-amber-300 bg-amber-50 text-amber-800"
      : "border-red-300 bg-red-50 text-red-800";

  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <p className="font-bold">{data.error ?? "エラーが発生しました"}</p>
      {status === 404 && data.gtin && (
        <p className="mt-1 font-mono text-sm">読み取ったGTIN: {data.gtin}</p>
      )}
    </div>
  );
}
