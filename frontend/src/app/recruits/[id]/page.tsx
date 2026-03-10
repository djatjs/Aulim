"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import Toast from "@/components/ui/Toast";

interface RecruitDetail {
    id: number;
    title: string;
    singer: string;
    songName: string;
    targetPerformance: string;
    referenceLink: string;
    content: string;
    authorName: string;
    authorEmail: string;
    status: "OPEN" | "COMPLETED";
    sessions: any[];
    applications: any[];
}

export default function RecruitDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [detail, setDetail] = useState<RecruitDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [applyMessage, setApplyMessage] = useState("");
    const [selectedPart, setSelectedPart] = useState("");
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    useEffect(() => {
        setUserEmail(localStorage.getItem("email"));
    }, []);

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ message, type });
    };

    const loadDetail = async () => {
        try {
            const data = await fetchApi(`/recruits`);
            const item = data.find((p: any) => p.id === parseInt(id));
            setDetail(item);
        } catch (err) {
            console.error("Failed to load recruit detail", err);
            showToast("데이터를 불러오지 못했습니다.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDetail();
    }, []);

    const isAuthor = userEmail === detail?.authorEmail;
    const hasApplied = detail?.applications?.some(app => app.applicantEmail === userEmail);

    const handleApply = async () => {
        if (!selectedPart) return showToast("세션을 선택해주세요.", "info");
        try {
            await fetchApi(`/recruits/${id}/apply`, {
                method: "POST",
                body: JSON.stringify({ part: selectedPart, message: applyMessage })
            });
            showToast("참여 신청이 완료되었습니다!", "success");
            setIsApplyModalOpen(false);
            loadDetail();
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    const handleAccept = async (appId: number) => {
        try {
            await fetchApi(`/recruits/applications/${appId}/accept`, { method: "PATCH" });
            showToast("신청을 수락했습니다!", "success");
            loadDetail();
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    const handleEdit = () => {
        router.push(`/recruits/${id}/edit`);
    };

    const handleDelete = async () => {
        if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
        try {
            await fetchApi(`/recruits/${id}`, { method: "DELETE" });
            showToast("게시글이 삭제되었습니다.", "success");
            router.push("/recruits");
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!detail) return <div className="p-20 text-center">게시글을 찾을 수 없습니다.</div>;

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

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left: Content */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
                                    {detail.status === 'OPEN' ? '모집 중' : '모집 완료'}
                                </span>
                                <span className="text-slate-400 font-bold text-sm">By {detail.authorName}</span>
                            </div>
                            {isAuthor && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleEdit}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">수정</button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-100 transition-all">삭제</button>
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{detail.title}</h1>

                        <div className="grid grid-cols-2 gap-6 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl mb-10">
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Artist</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white">{detail.singer}</p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Song</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white">{detail.songName}</p>
                            </div>
                            {detail.targetPerformance && (
                                <div className="col-span-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">Target</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{detail.targetPerformance}</p>
                                </div>
                            )}
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">상세 설명</h3>
                            <div className="text-slate-600 dark:text-slate-400 font-medium whitespace-pre-wrap leading-relaxed">
                                {detail.content || "상세 설명이 없습니다."}
                            </div>
                        </div>

                        {detail.referenceLink && (
                            <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">🔗</div>
                                    <div className="text-sm">
                                        <p className="font-black text-blue-600 dark:text-blue-400">참고 링크</p>
                                        <p className="text-slate-500 font-medium line-clamp-1">{detail.referenceLink}</p>
                                    </div>
                                </div>
                                <a href={detail.referenceLink} target="_blank" className="px-6 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl font-bold shadow-sm hover:scale-105 transition-all">이동</a>
                            </div>
                        )}
                    </motion.div>

                    {/* Applications Management (Author only) */}
                    {isAuthor && detail.applications && detail.applications.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">지원자 현황 관리</h3>
                            <div className="space-y-4">
                                {detail.applications.map((app: any) => (
                                    <div key={app.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex justify-between items-center transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-black text-slate-900 dark:text-white text-lg">{app.applicantName}</p>
                                                <span className="text-xs font-black text-blue-600 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded-md uppercase">{app.part}</span>
                                            </div>
                                            <p className="text-slate-500 font-medium text-sm">"{app.message || '지원 메시지가 없습니다.'}"</p>
                                        </div>
                                        {app.status === 'PENDING' ? (
                                            <button
                                                onClick={() => handleAccept(app.id)}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
                                            >
                                                수락하기
                                            </button>
                                        ) : (
                                            <span className="text-sm font-black text-slate-400 px-4">
                                                {app.status === 'ACCEPTED' ? '수락됨' : '거절됨'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right: Sessions & Application */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 sticky top-32 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">모집 현황</h3>

                        <div className="space-y-6 mb-10">
                            {detail.sessions.map((session: any) => {
                                const isFull = session.currentCount >= session.count;
                                return (
                                    <div key={session.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="font-black text-slate-700 dark:text-slate-300 uppercase text-xs tracking-wider">{session.part}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="font-black text-slate-900 dark:text-white">{session.currentCount} / {session.count}</span>
                                                    {isFull && <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md">마감</span>}
                                                </div>
                                            </div>

                                            {detail.status === 'OPEN' && !isAuthor && (
                                                <button
                                                    disabled={isFull || hasApplied}
                                                    onClick={() => {
                                                        setSelectedPart(session.part);
                                                        setIsApplyModalOpen(true);
                                                    }}
                                                    className={`px-4 py-2 rounded-xl font-black text-xs transition-all ${isFull || hasApplied ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none active:scale-95'}`}
                                                >
                                                    {isFull ? '모집 완료' : hasApplied ? '지원 완료' : '신청하기'}
                                                </button>
                                            )}
                                        </div>
                                        <div className="w-full h-1.5 bg-white dark:bg-slate-900 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full shadow-sm transition-all duration-1000 ${isFull ? 'bg-slate-300' : 'bg-blue-600'}`}
                                                style={{ width: `${(session.currentCount / session.count) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {detail.status === 'COMPLETED' && (
                            <div className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-center rounded-[2rem] font-black text-lg">
                                전체 모집이 완료되었습니다
                            </div>
                        )}
                        {isAuthor && detail.status === 'OPEN' && (
                            <div className="w-full py-5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-center rounded-[2rem] font-black text-sm">
                                지원자들의 신청을 기다리고 있습니다
                            </div>
                        )}
                        {hasApplied && detail.status === 'OPEN' && (
                            <div className="w-full py-5 bg-green-50 dark:bg-green-900/20 text-green-600 text-center rounded-[2rem] font-black text-sm">
                                지원서가 정상적으로 전달되었습니다
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Apply Modal */}
            <AnimatePresence>
                {isApplyModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">참여 신청하기</h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-600 dark:text-slate-400 ml-1">지원 세션 선택</label>
                                    <select
                                        value={selectedPart}
                                        onChange={(e) => setSelectedPart(e.target.value)}
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    >
                                        <option value="">지원할 세션을 선택하세요</option>
                                        {detail.sessions.filter((s: any) => s.currentCount < s.count).map((s: any) => (
                                            <option key={s.id} value={s.part}>{s.part}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-600 dark:text-slate-400 ml-1">나의 메시지</label>
                                    <textarea
                                        rows={4}
                                        value={applyMessage}
                                        onChange={(e) => setApplyMessage(e.target.value)}
                                        placeholder="간단한 자기소개나 지원 동기를 적어주세요."
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setIsApplyModalOpen(false)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-[2rem] font-black hover:bg-slate-200 transition-all">취소</button>
                                    <button onClick={handleApply} className="flex-2 py-5 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all px-10">지원 완료</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
