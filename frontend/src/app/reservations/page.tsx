"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

interface Reservation {
    id: number;
    teamName: string;
    roomName: string;
    startAt: string;
    endAt: string;
}

export default function ReservationPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReservations = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString();
            const result = await fetchApi(`/reservations?date=${today}`);
            setReservations(result.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    const handleReserve = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            teamId: Number(formData.get("teamId")),
            roomId: Number(formData.get("roomId")),
            startAt: formData.get("startAt"),
            endAt: formData.get("endAt"),
        };

        try {
            await fetchApi("/reservations", {
                method: "POST",
                body: JSON.stringify(data),
            });
            alert("✨ 예약이 완료되었습니다!");
            loadReservations();
        } catch (err: any) {
            alert(`예약 실패: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <div className="h-20" /> {/* Spacer for fixed navbar */}

            <main className="max-w-7xl mx-auto px-6 pt-16">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
                        Book Your <span className="premium-gradient">Session</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">연습실을 선택하고 여러분의 시간을 예약하세요.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Booking Form Card */}
                    <div className="lg:col-span-12 xl:col-span-4">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 sticky top-28">
                            <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">신규 예약 신청</h2>

                            <form onSubmit={handleReserve} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">팀 ID</label>
                                    <input name="teamId" type="number" placeholder="관리자 앱에서 확인 가능" className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">연습실 번호</label>
                                    <input name="roomId" type="number" placeholder="1번 ~ 8번 방" className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">시작 일시</label>
                                        <input name="startAt" type="datetime-local" className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">종료 일시</label>
                                        <input name="endAt" type="datetime-local" className="w-full bg-slate-50 dark:bg-slate-800 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none" required />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none mt-4">
                                    예약 완료하기
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Reservation Status Section */}
                    <div className="lg:col-span-12 xl:col-span-8">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">실시간 현황</h2>
                                <p className="text-sm text-slate-500 font-medium mt-1">오늘 예약된 모든 일정을 확인하세요.</p>
                            </div>
                            <button onClick={loadReservations} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" />
                                </svg>
                                새로고침
                            </button>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800" />
                                ))}
                            </div>
                        ) : reservations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-slate-400 font-bold">아직 오늘의 예약이 없습니다.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reservations.map((res) => (
                                    <motion.div
                                        key={res.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                Confirmed
                                            </div>
                                            <span className="text-slate-300 font-bold text-sm">#0{res.id}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors uppercase truncate">
                                            {res.teamName}
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{res.roomName}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-black text-slate-600 dark:text-slate-400">
                                                    {new Date(res.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(res.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        {error && (
                            <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2rem] text-red-600 dark:text-red-400 text-sm font-bold text-center">
                                ⚠️ {error}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
