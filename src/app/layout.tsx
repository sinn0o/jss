import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "jss — 자소서 대리작성",
  description: "경험(STAR) 데이터베이스를 기반으로 채용공고에 맞춘 자소서 초안을 생성합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ToastProvider>
          <Nav />
          <main className="flex-1">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
