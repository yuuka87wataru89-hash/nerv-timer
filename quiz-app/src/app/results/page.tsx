"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  EMPTY_COUNTS,
  Group,
  GROUP_LABEL,
  resetVoteCounts,
  subscribeToVoteCounts,
  VoteCounts,
} from "@/lib/quiz";

const CHOICE_COLORS = { A: "#22c55e", B: "#f59e0b" };
const GROUP_COLORS: Record<Group, string> = {
  highschool: "#38bdf8",
  adult: "#f472b6",
};

function pieData(counts: VoteCounts[Group]) {
  return [
    { name: "A", value: counts.A },
    { name: "B", value: counts.B },
  ];
}

export default function ResultsPage() {
  const [counts, setCounts] = useState<VoteCounts>(EMPTY_COUNTS);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToVoteCounts(setCounts);
    return unsubscribe;
  }, []);

  const total =
    counts.highschool.A + counts.highschool.B + counts.adult.A + counts.adult.B;

  const barData = [
    {
      choice: "A",
      [GROUP_LABEL.highschool]: counts.highschool.A,
      [GROUP_LABEL.adult]: counts.adult.A,
    },
    {
      choice: "B",
      [GROUP_LABEL.highschool]: counts.highschool.B,
      [GROUP_LABEL.adult]: counts.adult.B,
    },
  ];

  async function handleReset() {
    if (!window.confirm("すべての投票結果をリセットしますか？")) return;
    setResetting(true);
    try {
      await resetVoteCounts();
    } finally {
      setResetting(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">投票結果</h1>
        <div className="flex items-center gap-3 text-lg text-slate-400">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          LIVE ・ 総投票数 {total} 票
        </div>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-center text-2xl font-semibold text-slate-300">
          A vs B（{GROUP_LABEL.highschool} / {GROUP_LABEL.adult} 比較）
        </h2>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="choice" stroke="#cbd5e1" tick={{ fontSize: 20 }} />
            <YAxis allowDecimals={false} stroke="#cbd5e1" tick={{ fontSize: 16 }} />
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "none", color: "#fff" }}
            />
            <Legend wrapperStyle={{ fontSize: 18 }} />
            <Bar
              dataKey={GROUP_LABEL.highschool}
              fill={GROUP_COLORS.highschool}
              radius={[6, 6, 0, 0]}
            />
            <Bar dataKey={GROUP_LABEL.adult} fill={GROUP_COLORS.adult} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {(["highschool", "adult"] as Group[]).map((group) => {
          const groupTotal = counts[group].A + counts[group].B;
          return (
            <div key={group} className="rounded-2xl bg-slate-900/60 p-6">
              <h3
                className="mb-2 text-center text-2xl font-bold"
                style={{ color: GROUP_COLORS[group] }}
              >
                {GROUP_LABEL[group]}（{groupTotal} 票）
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData(counts[group])}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={110}
                    label={(entry) =>
                      groupTotal > 0
                        ? `${entry.name}: ${Math.round(
                            (entry.value / groupTotal) * 100
                          )}%`
                        : `${entry.name}: 0%`
                    }
                  >
                    {pieData(counts[group]).map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CHOICE_COLORS[entry.name as "A" | "B"]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "none", color: "#fff" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 18 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </section>

      <footer className="mt-12 flex justify-center">
        <button
          onClick={handleReset}
          disabled={resetting}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-800 disabled:opacity-50"
        >
          結果をリセット
        </button>
      </footer>
    </main>
  );
}
