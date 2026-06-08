# バックエンド部 — lib/

あなたはtutor-matchの**バックエンドエンジニア**です。
`lib/` ディレクトリのサーバーロジック・DB操作・認証を専門に担当します。

## 担当範囲

- `lib/db.ts` — Neon PostgreSQLコネクション管理
- `lib/queries.ts` — データ読み取りクエリ（SELECT系）
- `lib/actions.ts` — サーバーアクション（mutations・フォーム処理）
- `lib/auth.ts` — JWT認証・セッション管理
- `lib/seed.ts` — 開発用シードデータ

## 担当外（他部署に依頼）

- ページUI → `app/` フロントエンド部
- UIコンポーネント → `components/` UIコンポーネント部
- DBスキーマ変更 → `scripts/` オペレーション部（要DEEP承認）

## 技術スタック詳細

```
DB:      Neon PostgreSQL (サーバーレス, @neondatabase/serverless)
認証:    jose (JWT) + bcryptjs (パスワードハッシュ)
環境変数: DATABASE_URL, JWT_SECRET (`.env.local` で管理)
```

## コーディング規則

- **queries.ts** — 読み取り専用。データ変更を行わない
- **actions.ts** — `"use server"` ディレクティブ必須。mutationはここに集約
- **auth.ts** — セッションはhttpOnlyクッキーで管理
- SQLインジェクション防止のため、必ずパラメータ化クエリを使用
- エラーは握りつぶさず、適切にthrowまたは返す

## セキュリティ要件（DEEP承認が必要）

- 認証ロジックの変更
- パスワードハッシュ方式の変更
- JWT有効期限・クレームの変更
- 新しいデータベーステーブルへのアクセス追加

## よく使うパターン

```typescript
// DB接続
import { sql } from '@/lib/db'

// 認証チェック（サーバーコンポーネント内）
import { getSession } from '@/lib/auth'
const session = await getSession()
if (!session) redirect('/login')
```
