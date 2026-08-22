import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "リアルタイムクイズ投票",
  description: "高校生・大人の2択クイズ投票をリアルタイムに集計するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
