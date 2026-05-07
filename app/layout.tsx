import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { seedIfEmpty } from "@/lib/seed";

seedIfEmpty();

export const metadata: Metadata = {
  title: "合格のはな｜中学受験 家庭教師マッチング",
  description:
    "中学受験を目指すお子さまとご家庭に、最適な家庭教師をマッチング。お母さまの不安に寄り添う、安心の個別指導。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
