"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PARTS = ["VOCAL", "GUITAR", "BASS", "DRUM", "PIANO"];

export default function NewRecruitPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [singer, setSinger] = useState("");
    const [songName, setSongName] = useState("");
    const [targetPerformance, setTargetPerformance] = useState("");
    const [referenceLink, setReferenceLink] = useState("");
    const [content, setContent] = useState("");
    const [sessions, setSessions] = useState<{ part: string, count: number }[]>([
        { part: "VOCAL", count: 1 }
    ]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            await fetchApi("/recruits", {
                method: "POST",
                body: JSON.stringify({
                    title, singer, songName, targetPerformance, referenceLink, content, sessions
                })
            });
            alert("구인글이 등록되었습니다!");
            router.push("/recruits");
        } catch (err: any) {
            alert(`오류: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-28 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism p-10 rounded-[3rem]"
                >
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-10">새 구인글 작성하기</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">게시글 제목</label>
                                <input
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="예: [정기공연] 잔나비 - 주저하는 연인들을 위해 같이 하실 분!"
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
                                        placeholder="예: 잔나비"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">곡명</label>
                                    <input
                                        required
                                        value={songName}
                                        onChange={(e) => setSongName(e.target.value)}
                                        placeholder="예: 주저하는 연인들을 위해"
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
                                        placeholder="예: 5월 정기공연"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-700 dark:text-slate-300 ml-1">참고 링크 (유튜브 등)</label>
                                    <input
                                        value={referenceLink}
                                        onChange={(e) => setReferenceLink(e.target.value)}
                                        placeholder="https://..."
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
                                    placeholder="곡에 대한 추가 설명이나 바라는 점을 적어주세요."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Session Recruiting */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">모집 세션 설정</h2>
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
                                        <select
                                            value={session.part}
                                            onChange={(e) => updateSession(index, "part", e.target.value)}
                                            className="flex-1 bg-white dark:bg-slate-900 border-none p-3 rounded-xl outline-none font-bold"
                                        >
                                            {PARTS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <input
                                            type="number"
                                            min="1"
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
                            disabled={loading}
                            className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 dark:shadow-none disabled:opacity-50"
                        >
                            {loading ? "작성 중..." : "구인 시작하기"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
