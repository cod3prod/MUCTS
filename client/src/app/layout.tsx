import type { Metadata } from "next";
import "@/styles/index.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "먹츠 | 먹고 싶은 사람들끼리 모여라",
  description: "1인 가구를 위한 따뜻한 한 끼 커뮤니티",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
