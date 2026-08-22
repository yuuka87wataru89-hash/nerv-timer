# リアルタイムクイズ投票アプリ

Next.js（App Router）+ Firebase Firestore を使った、2択クイズのリアルタイム投票アプリです。

- **画面1（投票画面 `/vote`）**: スマホ向け。「高校生」「大人」を選んでから A/B の2択に投票できます。
- **画面2（集計画面 `/results`）**: プロジェクター投影向け。投票結果を棒グラフ（高校生 vs 大人）と円グラフ（各属性ごとの A/B 比率）でリアルタイムに表示します。

## セットアップ

### 1. Firebase プロジェクトを作成

1. [Firebase コンソール](https://console.firebase.google.com/) で新規プロジェクトを作成
2. 「Firestore Database」を有効化（本番モードでOK。下記のルールを設定します）
3. 「プロジェクトの設定」→「マイアプリ」でウェブアプリを追加し、設定値を取得

### 2. Firestore セキュリティルールを設定

このリポジトリの `firestore.rules` の内容を Firebase コンソールの Firestore ルールに貼り付けて公開してください。
（`quiz/current` ドキュメントのみを誰でも読み書きできる、投票アプリ用の簡易ルールです。）

### 3. 環境変数を設定

```bash
cp .env.local.example .env.local
```

`.env.local` に Firebase の設定値を入力してください。

### 4. 依存関係のインストール & 起動

```bash
npm install
npm run dev
```

- 投票画面: http://localhost:3000/vote
- 集計画面: http://localhost:3000/results

## データ構造

Firestore の `quiz/current` ドキュメント1件に集計結果を保持するシンプルな構造です。

```json
{
  "highschool": { "A": 0, "B": 0 },
  "adult": { "A": 0, "B": 0 }
}
```

投票時は `increment(1)` でカウントアップするため、複数端末から同時に投票してもカウントが競合しません。
集計画面は `onSnapshot` でこのドキュメントを購読し、更新のたびにグラフが自動で再描画されます。

## 投票のリセット

集計画面下部の「結果をリセット」ボタンから、次のクイズに向けて投票数を 0 にリセットできます。
