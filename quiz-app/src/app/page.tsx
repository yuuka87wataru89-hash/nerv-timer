import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          リアルタイムクイズ投票アプリ
        </h1>
        <p className="mt-3 text-slate-400">
          スマホから投票して、プロジェクターでリアルタイム集計を見よう
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/vote"
          className="rounded-xl bg-sky-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-sky-400"
        >
          📱 投票画面（ユーザー用）
        </Link>
        <Link
          href="/results"
          className="rounded-xl bg-indigo-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-indigo-400"
        >
          📊 集計画面（プロジェクター用）
        </Link>
      </div>
    </main>
  );
}
