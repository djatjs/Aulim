"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, X } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notiRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

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

    const loadNotifications = async () => {
        if (!isLoggedIn) return;
        try {
            const [listUrl, countUrl] = await Promise.all([
                fetchApi("/notifications"),
                fetchApi("/notifications/unread-count")
            ]);
            setNotifications(listUrl);
            setUnreadCount(countUrl.count);
        } catch (err) {
            console.error("Failed to load notifications", err);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            loadNotifications();
            // Polling every 1 minute
            const interval = setInterval(loadNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [isLoggedIn]);

    // Click outside to close notification and profile dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRead = async (id: number, url: string) => {
        try {
            await fetchApi(`/notifications/${id}/read`, { method: "PATCH" });
            setShowNotifications(false);
            window.location.href = url;
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteNotification = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await fetchApi(`/notifications/${id}`, { method: "DELETE" });
            loadNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReadAll = async () => {
        try {
            await fetchApi("/notifications/read-all", { method: "PATCH" });
            loadNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-[100] glass-morphism border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white group leading-none">
                        AULIM <span className="text-blue-600 group-hover:animate-pulse">.</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 mt-1">
                        <Link href="/recruits" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-400">
                            구인 목록
                        </Link>
                        <Link href="/reservations" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-400">
                            연습실 예약
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {isLoggedIn ? (
                        <>
                            <div className="relative" ref={notiRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform origin-top-right"
                                        >
                                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                                <h4 className="font-black text-slate-900 dark:text-white">최근 알림</h4>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={handleReadAll}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700"
                                                    >
                                                        모두 읽기
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-[25rem] overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="p-8 text-center text-slate-400 text-sm font-medium">새로운 알림이 없습니다.</div>
                                                ) : (
                                                    notifications.map((noti) => (
                                                        <div
                                                            key={noti.id}
                                                            onClick={() => handleRead(noti.id, noti.relatedUrl)}
                                                            className={`relative p-4 border-b border-slate-50 dark:border-slate-800/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex gap-4 ${!noti.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                                        >
                                                            {!noti.read && <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />}
                                                            <div className="flex-1">
                                                                    <p className={`text-sm pr-6 ${noti.read ? 'text-slate-500 font-medium' : 'text-slate-900 dark:text-white font-bold'}`}>
                                                                        {noti.message}
                                                                    </p>
                                                                    <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                                                                        {new Date(noti.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                    <button
                                                                        onClick={(e) => handleDeleteNotification(noti.id, e)}
                                                                        className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                        title="알림 삭제"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-200 dark:border-slate-700"
                                >
                                    <User className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                </button>

                                <AnimatePresence>
                                    {showProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform origin-top-right flex flex-col"
                                        >
                                            <Link
                                                href="/mypage"
                                                onClick={() => setShowProfile(false)}
                                                className="px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 text-left"
                                            >
                                                마이페이지
                                            </Link>
                                            <button
                                                onClick={() => { setShowProfile(false); handleLogout(); }}
                                                className="px-6 py-4 text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors text-left"
                                            >
                                                로그아웃
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
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
