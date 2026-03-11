"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { Music, FileText, Send, CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";

interface MyPageSummary {
    name: string;
    mainPart: string;
    phone?: string;
    myPosts: any[];
    appliedPosts: any[];
    teamReservations: any[];
}

const PART_OPTIONS = [
    { value: "VOCAL", label: "Vocal" },
    { value: "GUITAR", label: "Guitar" },
    { value: "BASS", label: "Bass" },
    { value: "DRUM", label: "Drum" },
    { value: "PIANO", label: "Piano" },
];

export default function MyPage() {
    const router = useRouter();
    const [summary, setSummary] = useState<MyPageSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"myPosts" | "appliedPosts" | "schedule">("myPosts");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResId, setSelectedResId] = useState<number | null>(null);
    // Profile Edit States
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: "", mainPart: "VOCAL", phone: "" });
    const [updatingProfile, setUpdatingProfile] = useState(false);

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        alert(message);
    };

    const loadSummary = async () => {
        try {
            setLoading(true);
            const data = await fetchApi("/mypage/summary");
            setSummary(data);
            setEditFormData({
                name: data.name,
                mainPart: data.mainPart,
                phone: data.phone || "",
            });
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

    const handleCancelApplication = async (appId: number, status: string) => {
        const confirmMsg = status === 'ACCEPTED'
            ? "정말 합주 팀에서 하차하시겠습니까? 현재 팀원들의 연습 일정에 지장이 갈 수 있습니다."
            : status === 'REJECTED' ? "거절된 내역을 삭제하시겠습니까?" : "정말 이 지원을 취소하시겠습니까?";

        if (!confirm(confirmMsg)) return;
        try {
            await fetchApi(`/recruits/applications/${appId}`, { method: "DELETE" });
            const successMsg = status === 'ACCEPTED' ? "정상적으로 하차 처리되었습니다." : status === 'REJECTED' ? "내역이 삭제되었습니다." : "지원이 취소되었습니다.";
            showToast(successMsg, "success");
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

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            await fetchApi("/mypage/profile", {
                method: "PUT",
                body: JSON.stringify(editFormData),
            });
            showToast("프로필이 성공적으로 수정되었습니다.", "success");
            setIsEditProfileOpen(false);
            loadSummary(); // Reload to reflect changes
        } catch (err: any) {
            showToast(err.message || "프로필 수정에 실패했습니다.", "error");
        } finally {
            setUpdatingProfile(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!summary) return <div>Data not found.</div>;

    return (
        <main className="min-h-screen bg-slate-100/50 dark:bg-slate-950/80 pb-20 pt-28 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200/40 via-slate-100/20 to-transparent dark:from-slate-900/40 dark:via-slate-950/20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left: Profile Card */}
                <div className="lg:col-span-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] sticky top-32 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-xl flex items-center justify-center text-white text-3xl font-black">
                                {summary.name?.[0]}
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{summary.name}</h2>
                            <span className="px-4 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                {summary.mainPart}
                            </span>

                            <div className="w-full space-y-4 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-bold">주요 포지션</span>
                                    <span className="text-slate-900 dark:text-white font-black uppercase">{summary.mainPart}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditProfileOpen(true)}
                                className="w-full mt-10 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                프로필 수정
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Tabs & Content */}
                <div className="lg:col-span-8">
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab("myPosts")}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === "myPosts" ? "bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none" : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                        >
                            내가 작성한 구인글
                        </button>
                        <button
                            onClick={() => setActiveTab("appliedPosts")}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === "appliedPosts" ? "bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none" : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                        >
                            내가 지원한 구인글
                        </button>
                        <button
                            onClick={() => setActiveTab("schedule")}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === "schedule" ? "bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none" : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                        >
                            연습 일정
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
                        ) : activeTab === "myPosts" ? (
                            <div className="space-y-6">
                                {/* 작성한 구인글 */}
                                <div>
                                    {/* <h3 className="text-xl font-black flex items-center gap-3 text-slate-900 dark:text-white mb-6">
                                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        내가 작성한 구인글
                                    </h3> */}
                                    <div className="space-y-4">
                                        {(!summary.myPosts || summary.myPosts.length === 0) ? (
                                            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-12 rounded-[2.5rem] text-center border border-dashed border-slate-200 dark:border-slate-800">
                                                <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                                                    <FileText className="w-8 h-8 opacity-50" />
                                                </div>
                                                <p className="text-slate-500 font-bold">아직 작성하신 구인글이 없습니다.</p>
                                                <Link href="/recruits/new" className="mt-4 inline-block text-blue-600 font-bold text-sm hover:underline">첫 구인글 쓰러가기 →</Link>
                                            </div>
                                        ) : (
                                            summary.myPosts.map((post: any) => (
                                                <motion.div
                                                    key={post.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between gap-6 group relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 shadow-xl shadow-slate-200/30 dark:shadow-none"
                                                >
                                                    {/* Decorative background blob */}
                                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:scale-150" />

                                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 relative z-10 w-full">
                                                        <div className="flex flex-col gap-3 flex-1 pt-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                {post.status === "OPEN" ? (
                                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-black text-xs bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-500/20">
                                                                        <Clock className="w-3.5 h-3.5" /> 모집중
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-black text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" /> {post.status === "COMPLETED" ? "모집완료" : "마감됨"}
                                                                    </span>
                                                                )}
                                                                <span className="text-blue-600 dark:text-blue-400 font-black text-xs bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-500/20">
                                                                    내가 작성한 글
                                                                </span>
                                                            </div>

                                                            <h4 className="text-xl font-black text-slate-900 dark:text-white truncate">{post.title}</h4>

                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <Music className="w-4 h-4 text-slate-400 shrink-0" />
                                                                <span className="text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg text-xs truncate max-w-[120px]">{post.singer}</span>
                                                                <span className="text-slate-300 dark:text-slate-600 text-xs">-</span>
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium text-xs truncate">{post.songName}</span>
                                                            </div>
                                                        </div>

                                                        <div className="w-full md:w-auto mt-2 md:mt-0 flex flex-col gap-2 shrink-0">
                                                            <div className="flex flex-row gap-2 w-full">
                                                                <button
                                                                    onClick={() => handleEdit(post.id, post.authorEmail)}
                                                                    className="flex-1 px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-center shadow-sm"
                                                                >
                                                                    수정
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(post.id)}
                                                                    className="flex-1 px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-all text-center shadow-sm"
                                                                >
                                                                    삭제
                                                                </button>
                                                            </div>
                                                            <Link href={`/recruits/${post.id}`} className="w-full flex justify-center items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all shadow-md active:scale-95 group/btn">
                                                                상세보기 <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === "appliedPosts" ? (
                            <div className="space-y-6">
                                {/* 지원한 구인글 */}
                                <div>
                                    {/* <h3 className="text-xl font-black flex items-center gap-3 text-slate-900 dark:text-white mb-6">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <Send className="w-4 h-4 ml-0.5" />
                                        </div>
                                        내가 지원한 구인글
                                    </h3> */}
                                    <div className="space-y-4">
                                        {(!summary.appliedPosts || summary.appliedPosts.length === 0) ? (
                                            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-12 rounded-[2.5rem] text-center border border-dashed border-slate-200 dark:border-slate-800">
                                                <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                                                    <Send className="w-8 h-8 opacity-50 ml-1" />
                                                </div>
                                                <p className="text-slate-500 font-bold">지원한 구인글이 없습니다.</p>
                                                <Link href="/recruits" className="mt-4 inline-block text-indigo-600 font-bold text-sm hover:underline">모집 공고 찾아보기 →</Link>
                                            </div>
                                        ) : (
                                            summary.appliedPosts.map((app: any) => (
                                                <motion.div
                                                    key={app.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-[2rem] border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between gap-6 group relative overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 shadow-xl shadow-slate-200/30 dark:shadow-none"
                                                >
                                                    {/* Decorative background blob */}
                                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none transition-all group-hover:scale-150" />

                                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 relative z-10 w-full">
                                                        <div className="flex flex-col gap-3 flex-1 pt-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                {app.status === "ACCEPTED" && (
                                                                    <span className="flex items-center gap-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-black px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-500/30">
                                                                        <CheckCircle2 className="w-3.5 h-3.5" /> 합류 성공
                                                                    </span>
                                                                )}
                                                                {app.status === "REJECTED" && (
                                                                    <span className="flex items-center gap-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-black px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-500/30">
                                                                        <XCircle className="w-3.5 h-3.5" /> 불합격
                                                                    </span>
                                                                )}
                                                                {app.status === "PENDING" && (
                                                                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                                        <Clock className="w-3.5 h-3.5" /> 대기중
                                                                    </span>
                                                                )}
                                                                <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                                                                    {app.appliedPart} 지원
                                                                </span>
                                                            </div>

                                                            <h4 className="text-xl font-black text-slate-900 dark:text-white truncate">{app.title}</h4>

                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <Music className="w-4 h-4 text-slate-400 shrink-0" />
                                                                <span className="text-slate-600 dark:text-slate-300 font-bold bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg text-xs truncate max-w-[120px]">{app.singer}</span>
                                                                <span className="text-slate-300 dark:text-slate-600 text-xs">-</span>
                                                                <span className="text-slate-500 dark:text-slate-400 font-medium text-xs truncate">{app.songName}</span>
                                                            </div>
                                                        </div>

                                                        <div className="w-full md:w-auto mt-2 md:mt-0 flex flex-row md:flex-col gap-2 shrink-0">
                                                            <button
                                                                onClick={() => handleCancelApplication(app.id, app.status)}
                                                                className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-all text-center shadow-sm"
                                                            >
                                                                {app.status === "PENDING" ? "지원 취소" : app.status === "ACCEPTED" ? "팀 하차하기" : "내역 삭제"}
                                                            </button>
                                                            <Link href={`/recruits/${app.postId}`} className="flex-[2] md:flex-none flex justify-center items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:scale-[1.02] transition-all shadow-md active:scale-95 group/btn">
                                                                공고 보기 <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : null}
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

            {/* Profile Edit Modal */}
            <AnimatePresence>
                {isEditProfileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">프로필 수정</h3>
                                <button onClick={() => setIsEditProfileOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">이름</label>
                                    <input
                                        required
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">주요 세션</label>
                                    <Dropdown
                                        options={PART_OPTIONS}
                                        value={editFormData.mainPart}
                                        onChange={(val) => setEditFormData({ ...editFormData, mainPart: val })}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">연락처</label>
                                    <input
                                        type="text"
                                        placeholder="010-0000-0000"
                                        value={editFormData.phone}
                                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditProfileOpen(false)}
                                        className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updatingProfile}
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-colors disabled:opacity-70"
                                    >
                                        {updatingProfile ? "저장 중..." : "저장하기"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
