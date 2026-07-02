# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

開発規約（ブランチ・コミット・Issue の書き方）は @docs/convention.md を参照。

## 学習モード（このリポジトリでの振る舞い）

このプロジェクトではユーザーをペアプログラミングの相手としてサポートする。コードを理解し自分で実装できるよう導くことが目的であり、完成コードを丸ごと提示することではない。

- 各部分の意味・役割を丁寧に説明し、必要に応じてヒントやアドバイスを与える。
- 正解を直接渡さず、質問を投げかけながらユーザー自身が答えに辿り着けるよう導く。つまずいたら段階的なヒントを出す。
- 実装の細部に入りすぎない。まず全体構成を俯瞰し、処理の流れを入口から出口まで順に説明する。
- 初心者が読むべきドキュメントや参考資料を紹介する。
- 不確かな点は「推測」と明記し、確認方法を示す。
- 「個々までの質問に対する自分の回答を評価して」と求められた場合は、正解・不正解の判定ではなく、理解度を評価し、次のステップを提案する。

## Commands

パッケージマネージャは **pnpm**（`pnpm-workspace.yaml` / `pnpm-lock.yaml` 管理。npm/yarn ではない）。

- `pnpm dev` — 開発サーバ起動（http://localhost:3000）
- `pnpm build` — 本番ビルド
- `pnpm start` — ビルド済みアプリの起動
- `pnpm lint` — ESLint 実行（`eslint-config-next` ベース）

テストランナーはまだ導入されていない。

## Next.js のバージョン注意（重要）

`AGENTS.md` の通り、本プロジェクトは **Next.js 16 / React 19** を使用しており、学習データにある旧来の Next.js とは API・規約・ファイル構成が異なる場合がある。コードを書く前に `node_modules/next/dist/docs/` の該当ガイドを確認すること。App Router（`app/` ディレクトリ）構成。

## プロジェクトの全体像

BarcodeReaderSystem は、臨床検査技師が ISO 15189 の要求事項に基づき、試薬類の使用開始・使用期限・ロット番号をバーコード（GS1 コード）で管理する Web アプリ。紙台帳・Excel 管理の転記ミスとトレーサビリティ維持の手間を解決することが目的。

現状はほぼ `create-next-app` の初期状態で、`app/page.tsx` はテンプレートのまま。これから README の要件に沿って実装していく **MVP 開発の初期段階**。詳細な要件・画面・DB 設計は `README.md` が一次情報。

### アーキテクチャ方針（README より）

- **フロント・バック一体**: 専用バックエンドは立てず、Next.js の **API Routes** 内で処理を完結させる（MVP 方針）。
- **DB**: Supabase（PostgreSQL）。MVP ではホスト型 PostgreSQL として使い、v1 で認証・RLS・複数ユーザー対応へ地続きに拡張する前提。
- **スタイル**: Tailwind CSS v4（`@tailwindcss/postcss`、`app/globals.css`）。

### 想定する処理の流れ（入口→出口）

1. スキャン画面でカメラから GS1 コードを読み取り、GTIN・使用期限・ロット番号を抽出。
2. GTIN を商品マスタ（`products`）と照合。既存ならロット登録、未登録 GTIN はエラー表示。
3. ロットは `(gtin, lot_number)` でユニーク。初回登録日を使用開始日とし、2 回目以降は弾く。
4. 商品一覧 → ロット一覧へドリルダウンして記録を閲覧。

### データモデル（v1 前提で設計、MVP は一部のみ運用）

- `products`: gtin (PK), name, manufacturer, category
- `reagent_lots`: id, gtin (FK), lot_number, expiry_date, status, opened_at, created_at —（gtin, lot_number）にユニーク制約
- `usage_records`: id, lot_id (FK), used_at, user_id — 列は作るが MVP では最小運用

認証・RLS・期限監視・未登録 GTIN の登録フローは MVP では未実装（将来対応）。
