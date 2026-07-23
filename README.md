# BarcodeReaderSystem

臨床検査技師が ISO 15189 の要求事項に基づき、**GS1 コード（バーコード）で試薬類の使用開始・使用期限・ロット番号を管理**するための Web アプリケーションです。紙台帳や Excel による試薬管理は、記録（使用開始・期限・ロットのトレーサビリティ）の維持に手間と転記ミスのリスクがあります。本システムは GS1 コードを読み取り、試薬情報を構造化して記録することでこの課題を解決します。

本リポジトリでは、まず最小構成で動作するもの（MVP）を制作しています。

## 主な機能

- **GS1 コードの読み取り**: カメラ（DataMatrix / GS1-128）または手入力で GS1 コードを読み取り、GTIN・使用期限・ロット番号を抽出。
- **試薬ロットの登録**: GTIN を商品マスタと照合し、ロットを登録。`(GTIN, ロット番号)` はユニークで、初回登録日を使用開始日とし、2 回目以降は弾く。
- **閲覧**: 商品一覧 → ロット一覧へドリルダウンして記録を確認。

## 画面

| パス | 内容 |
|---|---|
| `/` | ホーム（各画面への導線） |
| `/scan` | スキャン画面（カメラ + 手入力）→ ロット登録 |
| `/products` | 商品一覧（ロット件数付き） |
| `/products/[gtin]` | ロット一覧（使用開始日・使用期限・ロット番号・開封者） |

## 技術スタック

- **Next.js 16 / React 19**（App Router）
- **Drizzle ORM + postgres-js**（DB アクセス）
- **Supabase（PostgreSQL）**
- **Tailwind CSS v4**
- **vitest**（テスト）
- パッケージマネージャは **pnpm**

## アーキテクチャ方針

- 専用バックエンドは立てず、Next.js の **API Routes（route handler）** で書き込みを処理（MVP 方針）。
- **読み取りは Server Component から `db` を直接クエリ**、**書き込み（スキャン登録）は Client Component → `POST /api/scan`**。
- GS1 のパース・期限変換は `lib/gs1/` に純ロジックとして分離（TDD）。DB アクセスは `lib/db/` に分離。

## セットアップ

### 前提

- Node.js 20+（`--env-file` を使うため）、pnpm
- Supabase プロジェクト（PostgreSQL）

### 手順

```bash
pnpm install

# .env.local に接続文字列を設定（Supabase の Connection pooling 推奨）
echo 'DATABASE_URL="postgresql://postgres.<ref>:<password>@<host>.pooler.supabase.com:6543/postgres"' > .env.local

pnpm db:push    # スキーマを Supabase に反映（products / reagent_lots / usage_records）
pnpm db:seed    # デモ用の商品・サンプルロットを投入
pnpm dev        # http://localhost:3000
```

> **Note**: Supabase の無料枠は放置でプロジェクトが自動一時停止（paused）します。接続エラー（`tenant/user ... not found` など）が出たらダッシュボードで Resume してください。

## スクリプト

| コマンド | 内容 |
|---|---|
| `pnpm dev` | 開発サーバ起動 |
| `pnpm build` / `pnpm start` | 本番ビルド / 起動 |
| `pnpm test` | vitest 実行 |
| `pnpm lint` | ESLint 実行 |
| `pnpm db:push` | スキーマを DB へ反映（drizzle-kit） |
| `pnpm db:seed` | デモ用データ投入（冪等） |
| `pnpm db:reset` | ロット記録を全削除（マスタは保持。デモ前のクリーンアップ用） |
| `pnpm db:studio` | Drizzle Studio |

## データモデル

- `products`: `gtin(PK)`, `name`, `manufacturer`, `category`
- `reagent_lots`: `id`, `gtin(FK)`, `lot_number`, `expiry_date`, `status`, `opened_at`, `opened_by`, `created_at` — `(gtin, lot_number)` にユニーク制約
- `usage_records`: `id`, `lot_id(FK)`, `used_at`, `used_by` — テーブルは作るが MVP では最小運用

## デプロイ（Vercel）

1. Vercel にリポジトリを接続。
2. 環境変数 **`DATABASE_URL`** を設定（Production 等の対象環境を選択）。**サーバレス向けに Supabase の Transaction pooler（ポート 6543）を推奨**。
3. デプロイ。カメラ利用に必要な HTTPS は Vercel が自動対応。

> 環境変数は設定後に再デプロイしないと反映されません。未設定だと `ECONNREFUSED 127.0.0.1:5432`（ローカル既定への接続）になります。

## 今後の予定（MVP では未実装）

- 認証・複数ユーザー・RLS（施設 / 部門分離）
- ロットのライフサイクル状態遷移（入庫 → 使用中 → 枯渇 / 期限切れ）
- 期限監視・警告
- 未登録 GTIN スキャン時の登録フロー

## 開発規約

ブランチ・コミット・Issue・PR の規約は [docs/convention.md](./docs/convention.md) を参照。
DB 設計の ER 図は [docs/er.md](./docs/er.md) を参照。
