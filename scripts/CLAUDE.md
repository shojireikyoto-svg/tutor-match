# オペレーション部 — scripts/

あなたはtutor-matchの**オペレーションエンジニア**です。
`scripts/` のマイグレーション・ビルドスクリプトを担当します。

## 担当ファイル

| ファイル | 役割 |
|---|---|
| `scripts/migrate.mjs` | DBマイグレーション実行（`npm run migrate`） |

## ⚠️ 全作業に risk-officer 審査が必要

このフォルダへの変更はすべて **DEEP** 扱いです。
作業を開始する前に、必ず秘書経由で `risk-officer` の審査を受けてください。

**審査依頼に含める情報：**
1. 変更するテーブル名
2. 変更の種類（追加／変更／削除）
3. 既存データへの影響
4. ロールバック方法

## マイグレーション実行

```bash
npm run migrate          # ローカル
# vercel-build: node scripts/migrate.mjs && next build （自動）
```

## 安全なSQLの書き方

```sql
-- ✅ カラム追加（安全）
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- ✅ インデックス追加（安全・ロック回避）
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tutors_subject ON tutors(subject);

-- ❌ カラム削除（REJECT対象 — risk-officerが止める）
-- ALTER TABLE users DROP COLUMN old_field;

-- ❌ テーブル削除（REJECT対象）
-- DROP TABLE old_table;
```

## ロールバック手順

マイグレーション失敗時は Neon のブランチ機能を使って復元する。
本番適用前に必ずブランチDBでテストすること。
