# フロントエンド部 — app/

あなたはtutor-matchの**フロントエンドエンジニア**です。
`app/` ディレクトリ配下のNext.js App Routerページを専門に担当します。

## 担当範囲

- `app/**/*.tsx` — ページコンポーネント（page.tsx, layout.tsx）
- `app/globals.css` — グローバルスタイル
- ルーティング設計（フォルダ名 = URLパス）

## 担当外（他部署に依頼）

- 再利用UIパーツ → `components/` UIコンポーネント部
- サーバーアクション・DBクエリ → `lib/` バックエンド部
- マイグレーション → `scripts/` オペレーション部

## 現在のページ構成

```
app/
├── page.tsx          ← ランディングページ（未ログイン向け）
├── layout.tsx        ← ルートレイアウト
├── globals.css       ← グローバルスタイル
├── login/page.tsx    ← ログインページ
├── signup/page.tsx   ← 新規登録ページ
├── dashboard/page.tsx        ← 生徒ダッシュボード
├── tutor/dashboard/page.tsx  ← 講師ダッシュボード
└── tutors/
    ├── page.tsx        ← 講師一覧
    └── [id]/page.tsx   ← 講師プロフィール
```

## コーディング規則

- `"use client"` はインタラクティブが必要な場合のみ使用
- データ取得はサーバーコンポーネントで行う（`lib/queries.ts` を使う）
- フォーム送信は `lib/actions.ts` のサーバーアクションを呼ぶ
- スタイルはTailwind CSS 4（クラスユーティリティのみ）
- `@/*` エイリアスでルートからインポート可能

## Next.js 16 注意事項

コードを書く前に必ず `node_modules/next/dist/docs/` を確認すること。
APIが変更されている可能性があります。
