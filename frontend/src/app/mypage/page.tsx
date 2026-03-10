"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";

interface MyPageSummary {
    name: string;
    mainPart: string;
    experienceYears: number;
    myPosts: any[];
    teamReservations: any[];
}

export default function MyPage() {
    const router = useRouter();
    const [summary, setSummary] = useState<MyPageSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"recruit" | "schedule">("schedule");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResId, setSelectedResId] = useState<number | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ message, type });
    };

    const loadSummary = async () => {
        try {
            setLoading(true);
            const data = await fetchApi("/mypage/summary");
            setSummary(data);
        } catch (err) {
            console.error("Failed to load summary", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSummary();
    }, []);

    const handleEdit = (postId: number, authorEmail: string) => {
        const storedEmail = localStorage.getItem("email");
        if (authorEmail !== storedEmail) {
            showToast("권한이 없습니다.", "error");
            return;
        }
        router.push(`/recruits/${postId}/edit`);
    };

    const handleDelete = async (postId: number) => {
        if (!confirm("정말 이 구인글을 삭제하시겠습니까?")) return;
        try {
            await fetchApi(`/recruits/${postId}`, { method: "DELETE" });
            showToast("성공적으로 삭제되었습니다.", "success");
            loadSummary();
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    const handleCancelClick = (id: number) => {
        setSelectedResId(id);
        setIsModalOpen(true);
    };

    const confirmCancel = async () => {
        if (!selectedResId) return;
        try {
            await fetchApi(`/reservations/${selectedResId}`, { method: "DELETE" });
            alert("예약이 취소되었습니다.");
            setIsModalOpen(false);
            loadSummary();
        } catch (err: any) {
            alert(`취소 실패: ${err.message}`);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!summary) return <div>Data not found.</div>;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-28 px-6">
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left: Profile Card */}
                <div className="lg:col-span-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-morphism p-8 rounded-[2.5rem] sticky top-32"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-xl flex items-center justify-center text-white text-3xl font-black">
                                {summary.name?.[0]}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{summary.name}</h2>
                            <span className="px-4 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                {summary.mainPart}
                            </span>

                            <div className="w-full space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold">활동 경력</span>
                                    <span className="text-slate-900 dark:text-white font-black">{summary.experienceYears}년</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold">소속 세션</span>
                                    <span className="text-slate-900 dark:text-white font-black uppercase">{summary.mainPart}</span>
                                </div>
                            </div>

                            <button className="w-full mt-10 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all">
                                프로필 수정
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Tabs & Content */}
                <div className="lg:col-span-8">
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab("schedule")}
                            className={`px-8 py-4 rounded-2xl font-bold transition-all ${activeTab === "schedule" ? "bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none" : "bg-white text-slate-500 dark:bg-slate-900"}`}
                        >
                            연습 일정
                        </button>
                        <button
                            onClick={() => setActiveTab("recruit")}
                            className={`px-8 py-4 rounded-2xl font-bold transition-all ${activeTab === "recruit" ? "bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none" : "bg-white text-slate-500 dark:bg-slate-900"}`}
                        >
                            나의 구인 현황
                        </button>
                    </div>

                    <div className="space-y-6">
                        {activeTab === "schedule" ? (
                            (!summary.teamReservations || summary.teamReservations.length === 0) ? (
                                <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] text-center border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-400 font-bold">예약된 연습 일정이 없습니다.</p>
                                    <Link href="/reservations" className="mt-6 inline-block text-blue-600 font-black hover:underline">지금 예약하러 가기 →</Link>
                                </div>
                            ) : (
                                summary.teamReservations.map((res: any) => (
                                    <motion.div
                                        key={res.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex justify-between items-center group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">
                                                {res.roomName?.slice(-1)}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white capitalize">{res.roomName}</h4>
                                                <p className="text-slate-500 font-medium">
                                                    {new Date(res.startAt).toLocaleDateString()} | {new Date(res.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(res.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCancelClick(res.id)}
                                            className="px-6 py-3 border-2 border-red-50 text-red-500 rounded-xl font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                        >
                                            예약 취소
                                        </button>
                                    </motion.div>
                                ))
                            )
                        ) : (
                            (!summary.myPosts || summary.myPosts.length === 0) ? (
                                <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] text-center border border-slate-100 dark:border-slate-800">
                                    <p className="text-slate-400 font-bold">내가 작성한 구인글이 없습니다.</p>
                                </div>
                            ) : (
                                summary.myPosts.map((post: any) => (
                                    <motion.div
                                        key={post.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex justify-between items-center group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 font-black">
                                                {post.singer?.[0]}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1">{post.title}</h4>
                                                <p className="text-slate-500 font-medium">
                                                    {post.singer} - {post.songName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(post.id, post.authorEmail)}
                                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">수정</button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-100 transition-all">삭제</button>
                                            <Link href={`/recruits/${post.id}`} className="ml-2 px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg active:scale-95">상세보기</Link>
                                        </div>
                                    </motion.div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl"
                        >
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 text-center">예약을 취소할까요?</h3>
                            <p className="text-slate-500 text-center mb-8 font-medium">취소된 예약은 복구할 수 없습니다.</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-2xl font-bold"
                                >
                                    돌아가기
                                </button>
                                <button
                                    onClick={confirmCancel}
                                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none"
                                >
                                    취소하기
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
