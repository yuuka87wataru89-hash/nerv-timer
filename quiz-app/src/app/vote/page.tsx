"use client";

import { useEffect, useState } from "react";
import { castVote, Choice, GROUP_LABEL, Group } from "@/lib/quiz";

const VOTE_STORAGE_KEY = "quiz_vote_v1";

export default function VotePage() {
  const [group, setGroup] = useState<Group | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState<{ group: Group; choice: Choice } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(VOTE_STORAGE_KEY);
    if (saved) {
      try {
        setVoted(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem(VOTE_STORAGE_KEY);
      }
    }
  }, []);

  async function handleVote(choice: Choice) {
    if (!group || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await castVote(group, choice);
      const result = { group, choice };
      setVoted(result);
      window.localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
      console.error(e);
      setError("投票に失敗しました。通信環境を確認してもう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRevote() {
    window.localStorage.removeItem(VOTE_STORAGE_KEY);
    setVoted(null);
    setGroup(null);
  }

  if (voted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
        <div className="text-6xl">✅</div>
        <h1 className="text-2xl font-bold">投票ありがとうございました！</h1>
        <p className="text-slate-400">
          {GROUP_LABEL[voted.group]} として「{voted.choice}」に投票しました
        </p>
        <button
          onClick={handleRevote}
          className="mt-4 rounded-lg border border-slate-600 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          投票をやり直す
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-center text-2xl font-bold">クイズに投票しよう！</h1>

      <section className="w-full max-w-sm">
        <p className="mb-3 text-center text-sm text-slate-400">
          あなたの属性を選んでください
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setGroup("highschool")}
            className={`rounded-xl border-2 px-4 py-4 text-lg font-semibold transition ${
              group === "highschool"
                ? "border-highschool bg-highschool/20 text-highschool"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            🎓 {GROUP_LABEL.highschool}
          </button>
          <button
            onClick={() => setGroup("adult")}
            className={`rounded-xl border-2 px-4 py-4 text-lg font-semibold transition ${
              group === "adult"
                ? "border-adult bg-adult/20 text-adult"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            💼 {GROUP_LABEL.adult}
          </button>
        </div>
      </section>

      <section className="w-full max-w-sm">
        <p className="mb-3 text-center text-sm text-slate-400">
          {group
            ? "どちらだと思いますか？ A か B を選んでください"
            : "先に属性を選んでください"}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            disabled={!group || submitting}
            onClick={() => handleVote("A")}
            className="rounded-2xl bg-choiceA px-6 py-10 text-4xl font-extrabold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-30 enabled:active:scale-95"
          >
            A
          </button>
          <button
            disabled={!group || submitting}
            onClick={() => handleVote("B")}
            className="rounded-2xl bg-choiceB px-6 py-10 text-4xl font-extrabold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-30 enabled:active:scale-95"
          >
            B
          </button>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </main>
  );
}
