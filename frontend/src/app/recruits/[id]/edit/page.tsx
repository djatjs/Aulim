"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Dropdown } from "@/components/ui/Dropdown";

const PART_OPTIONS = [
    { value: "VOCAL", label: "Vocal" },
    { value: "GUITAR", label: "Guitar" },
    { value: "BASS", label: "Bass" },
    { value: "DRUM", label: "Drum" },
    { value: "PIANO", label: "Piano" },
];

export default function EditRecruitPage() {
    const router = useRouter();
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [singer, setSinger] = useState("");
    const [songName, setSongName] = useState("");
    const [targetPerformance, setTargetPerformance] = useState("");
    const [referenceLink, setReferenceLink] = useState("");
    const [content, setContent] = useState("");
    const [sessions, setSessions] = useState<{ part: string, count: number, currentCount?: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        alert(message);
    };

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const item = await fetchApi(`/recruits/${id}`);

                // Verify author
                const storedEmail = localStorage.getItem("email");
                if (!storedEmail) {
                    showToast("로그인이 필요합니다.", "error");
                    router.push("/login");
                    return;
                }

                if (item.authorEmail !== storedEmail) {
                    showToast("권한이 없습니다.", "error");
                    router.push(`/recruits/${id}`);
                    return;
                }

                setTitle(item.title);
                setSinger(item.singer);
                setSongName(item.songName);
                setTargetPerformance(item.targetPerformance);
                setReferenceLink(item.referenceLink);
                setContent(item.content);
                if (item.sessions) {
                    setSessions(item.sessions.map((s: any) => ({ part: s.part, count: s.count, currentCount: s.currentCount })));
                }
            } catch (err: any) {
                alert(err.message);
                router.push("/recruits");
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [id, router]);

    const addSession = () => {
        setSessions([...sessions, { part: "GUITAR", count: 1 }]);
    };

    const removeSession = (index: number) => {
        setSessions(sessions.filter((_, i) => i !== index));
    };

    const updateSession = (index: number, field: string, value: any) => {
        const newSessions = [...sessions];
        (newSessions[index] as any)[field] = value;
        setSessions(newSessions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await fetchApi(`/recruits/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    title, singer, songName, targetPerformance, referenceLink, content, sessions
                })
            });
            showToast("게시글이 성공적으로 수정되었습니다!", "success");
            router.push(`/recruits/${id}`);
        } catch (err: any) {
            showToast(err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-28 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism p-10 rounded-[3rem]"
                >
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">구인글 수정하기</h1>
                        <button onClick={() => router.back()} className="text-slate-400 font-bold hover:text-slate-600 transition-all">취소</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">게시글 제목</label>
                                <input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">가수명</label>
                                    <input
                                        required
                                        value={singer}
                                        onChange={(e) => setSinger(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">곡명</label>
                                    <input
                                        required
                                        value={songName}
                                        onChange={(e) => setSongName(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">목표 공연</label>
                                    <input
                                        value={targetPerformance}
                                        onChange={(e) => setTargetPerformance(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">참고 링크</label>
                                    <input
                                        value={referenceLink}
                                        onChange={(e) => setReferenceLink(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">상세 설명</label>
                                <textarea
                                    rows={5}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Session Recruiting */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">모집 세션 수정</h2>
                                <button
                                    type="button"
                                    onClick={addSession}
                                    className="text-sm font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
                                >
                                    + 세션 추가
                                </button>
                            </div>

                            <div className="space-y-4">
                                {sessions.map((session, index) => (
                                    <div key={index} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                        <div className="flex-1 min-w-[150px]">
                                            <Dropdown
                                                options={PART_OPTIONS}
                                                value={session.part}
                                                onChange={(val) => updateSession(index, "part", val)}
                                                className="w-full"
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            min={session.currentCount ? Math.max(1, session.currentCount) : 1}
                                            value={session.count}
                                            onChange={(e) => updateSession(index, "count", parseInt(e.target.value))}
                                            className="w-20 bg-white dark:bg-slate-900 border-none p-3 rounded-xl outline-none font-bold text-center"
                                        />
                                        <span className="text-sm font-bold text-slate-400">명</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSession(index)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 dark:shadow-none disabled:opacity-50"
                        >
                            {submitting ? "저장 중..." : "수정 완료하기"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
