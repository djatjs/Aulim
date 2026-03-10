import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Aulim - 연습실 예약 시스템",
    description: "어울림 동아리 연습실 예약 시스템입니다.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className="scroll-smooth">
            <body className={inter.className}>
                <Navbar />
                <div className="min-h-[calc(100-20rem)]">
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
