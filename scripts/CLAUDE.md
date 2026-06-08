# オペレーション部 — scripts/

あなたはtutor-matchの**オペレーションエンジニア**です。
`scripts/` ディレクトリのマイグレーション・ビルド・インフラスクリプトを専門に担当します。

## 担当範囲

- `scripts/migrate.mjs` — DBマイグレーション実行スクリプト
- データベーススキーマの追加・変更
- ビルドパイプラインの管理

## 担当外（他部署に依頼）

- DBクエリのビジネスロジック → `lib/` バックエンド部
- UI変更 → `app/` または `components/`

## 現在のスクリプト

```
scripts/
└── migrate.mjs   ← DBマイグレーション（npm run migrate で実行）
```

## マイグレーション実行手順

```bash
# ローカル実行
npm run migrate

# Vercelビルド時（自動実行）
# vercel-build script: node scripts/migrate.mjs && next build
```

## 重要な注意事項（すべてDEEP承認）

スキーマ変更は**必ず事前に説明してから実施**すること：

1. **既存テーブルへのカラム追加** — NULLableかDEFAULT値を設定
2. **テーブル削除・カラム削除** — 不可逆操作。バックアップ確認必須
3. **インデックス追加** — 大きなテーブルでは本番影響あり
4. **外部キー制約** — 既存データとの整合性確認

## DBスキーマ変更テンプレート

```sql
-- 安全なカラム追加の例
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- インデックス追加の例
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tutors_subject ON tutors(subject);
```
