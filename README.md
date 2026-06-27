# BarcodeReaderSystem

BarcodeReaderSystem は臨床検査技師がISO15189の要求事項に基づき、バーコードリーダーを使用して試薬類の使用開始、使用期限、ロット番号をwebアプリケーション上で管理するためのシステムです。
アプリケーションは実装内容は以下の通りです。

- アプリケーション
- GitHub

## 機能

- GS1コードの読み取り
  - カメラでGS1コードを読み取り、商品情報、使用期限、ロット番号を取得
- 試薬管理
  - コードから取得した情報をもとに、試薬の使用開始、使用期限、ロット番号をデータベースに記録

## 開発環境（フロントエンド）

- Next.js

## 開発環境（バックエンド）

※ 今回はMVP完成を目的とするため、BFF（Backend For Frontend）として、Next.jsのAPI Routesを使用してバックエンドを実装しています。

## 開発環境（データベース）

- Supabase

## 画面

1. スキャン画面  
   GS1読み取り → 商品マスタ照合
   - 既存GTIN: ロット登録(gtin+lot_numberでユニーク、初回登録日=使用開始日、2回目以降は弾く)
   - 未登録GTIN: エラー表示
2. 商品登録画面 試薬名・メーカー・カテゴリを手入力(別UI、能動導線のみ)
3. (未決定)ロット一覧

## データベース設計

※ v1前提で設計、MVPでは一部のみ運用

- products
  - gtin(PK), name, manufacturer, category
- reagent_lots
  - id, gtin(FK), lot_number, expiry_date, status, opened_at, created_at
    ※ (gtin, lot_number)にユニーク制約
- usage_records
  - id, lot_id(FK), used_at, user_id  
    ※列は作る、MVPでは最小運用

## その他の機能

- 認証: なし(v1で追加)
- 状態遷移: なし(status列は持つがv1で運用)
