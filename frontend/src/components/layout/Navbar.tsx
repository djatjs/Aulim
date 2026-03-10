"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        // Listen for storage changes (optional, but good for tab sync)
        const handleStorageChange = () => {
            const token = localStorage.getItem("token");
            setIsLoggedIn(!!token);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setIsLoggedIn(false);
        window.location.href = "/"; // Force redirect and reload
    };

    return (
        <nav className="fixed top-0 w-full z-[100] glass-morphism border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white group">
                    AULIM <span className="text-blue-600 group-hover:animate-pulse">.</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/recruits" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-400">
                        구인 목록
                    </Link>
                    <Link href="/reservations" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-400">
                        연습실 예약
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <Link href="/mypage" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-400">
                                마이페이지
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-400">
                                로그인
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-sm font-bold hover:scale-[1.03] active:scale-[0.97] transition-all"
                            >
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
