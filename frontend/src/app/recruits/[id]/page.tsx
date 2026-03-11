"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { HelpCircle, AlertTriangle } from "lucide-react";

interface RecruitDetail {
    id: number;
    title: string;
    singer: string;
    songName: string;
    targetPerformance: string;
    referenceLink: string;
    content: string;
    author?: any;
    authorName?: string;
    authorEmail?: string;
    status: "OPEN" | "CLOSED" | "COMPLETED";
    sessions: any[];
    applications: any[];
}

export default function RecruitDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const [detail, setDetail] = useState<RecruitDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [applyMessage, setApplyMessage] = useState("");
    const [selectedPart, setSelectedPart] = useState("");
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        setUserEmail(localStorage.getItem("email"));
    }, []);

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        alert(message);
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

    const currentAuthorEmail = detail?.author?.email || detail?.authorEmail;
    const currentAuthorName = detail?.author?.name || detail?.authorName;

    const isAuthor = userEmail === currentAuthorEmail;
    const myApplication = detail?.applications?.find(app => app.applicantEmail === userEmail);
    const hasApplied = !!myApplication;
    const myApplicationStatus = myApplication?.status;

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

    const handleReject = async (appId: number) => {
        if (!confirm("정말 이 지원자를 거절하시겠습니까? 거절 후 변경할 수 없습니다.")) return;
        try {
            await fetchApi(`/recruits/applications/${appId}/reject`, { method: "PATCH" });
            showToast("신청을 거절했습니다.", "success");
            loadDetail();
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    const handleEdit = () => {
        router.push(`/recruits/${id}/edit`);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await fetchApi(`/recruits/${id}`, { method: "DELETE" });
            showToast("게시글이 삭제되었습니다.", "success");
            setIsDeleteModalOpen(false);
            router.push("/recruits");
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    const handleCloseClick = () => {
        setIsCloseModalOpen(true);
    };

    const confirmClose = async () => {
        try {
            await fetchApi(`/recruits/${id}/close`, { method: "PATCH" });
            showToast("모집이 마감되었습니다.", "success");
            setIsCloseModalOpen(false);
            loadDetail();
        } catch (err: any) {
            showToast(err.message, "error");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!detail) return <div className="p-20 text-center">게시글을 찾을 수 없습니다.</div>;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-28 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left: Content */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${detail.status === 'OPEN' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                    detail.status === 'CLOSED' ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                                        'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                    }`}>
                                    {detail.status === 'OPEN' ? '모집중' : detail.status === 'CLOSED' ? '마감됨' : '모집 완료'}
                                </span>
                                <span className="text-slate-400 font-bold text-sm">By {currentAuthorName}</span>
                            </div>
                            {isAuthor && (
                                <div className="flex gap-2">
                                    {detail.status === 'OPEN' && (
                                        <button
                                            onClick={handleCloseClick}
                                            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-all">
                                            마감
                                        </button>
                                    )}
                                    <button
                                        onClick={handleEdit}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">수정</button>
                                    <button
                                        onClick={handleDeleteClick}
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
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleReject(app.id)}
                                                    className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-black text-sm hover:bg-red-100 transition-all dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                                >
                                                    거절하기
                                                </button>
                                                <button
                                                    onClick={() => handleAccept(app.id)}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
                                                >
                                                    수락하기
                                                </button>
                                            </div>
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
                            <div className="w-full py-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-center rounded-[2rem] font-black text-lg">
                                모집 완료
                            </div>
                        )}
                        {detail.status === 'CLOSED' && (
                            <div className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-center rounded-[2rem] font-black text-lg">
                                모집 마감
                            </div>
                        )}
                        {isAuthor && detail.status === 'OPEN' && (
                            <div className="w-full py-5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-center rounded-[2rem] font-black text-sm">
                                지원 대기중
                            </div>
                        )}
                        {hasApplied && detail.status === 'OPEN' && (
                            <div className={`w-full py-5 text-center rounded-[2rem] font-black text-sm transition-all ${myApplicationStatus === 'ACCEPTED'
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                                : myApplicationStatus === 'REJECTED'
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                                    : 'bg-green-50 dark:bg-green-900/20 text-green-600'
                                }`}>
                                {myApplicationStatus === 'ACCEPTED' ? '팀 합류 확정' :
                                    myApplicationStatus === 'REJECTED' ? '모집 불합격' :
                                        '지원 승인 대기중'}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Apply Modal */}
            <ModalDialog
                open={isApplyModalOpen}
                onOpenChange={setIsApplyModalOpen}
                title="참여 신청하기"
                footer={
                    <>
                        <button onClick={() => setIsApplyModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 transition-all">
                            취소
                        </button>
                        <button onClick={handleApply} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition-all px-6">
                            지원 완료
                        </button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="space-y-2 text-left">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">지원 세션 선택</label>
                        <Dropdown
                            options={detail.sessions
                                .filter((s: any) => s.currentCount < s.count)
                                .map((s: any) => ({ value: s.part, label: s.part }))}
                            value={selectedPart}
                            onChange={(val) => setSelectedPart(val)}
                            placeholder="지원할 세션을 선택하세요"
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">나의 메시지</label>
                        <textarea
                            rows={4}
                            value={applyMessage}
                            onChange={(e) => setApplyMessage(e.target.value)}
                            placeholder="간단한 자기소개나 지원 동기를 적어주세요."
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                        />
                    </div>
                </div>
            </ModalDialog>

            {/* Delete Confirm Modal */}
            <ModalDialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                title="게시글 삭제"
                description="정말 이 구인글을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
                footer={
                    <>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 transition-all">
                            돌아가기
                        </button>
                        <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 dark:shadow-none transition-all px-6">
                            삭제하기
                        </button>
                    </>
                }
            />

            {/* Close Confirm Modal */}
            <ModalDialog
                open={isCloseModalOpen}
                onOpenChange={setIsCloseModalOpen}
                title="모집 마감"
                description="아직 모집 인원이 덜 찼더라도 구인을 수동으로 마감하시겠습니까? 마감된 게시글에는 더 이상 신청할 수 없습니다."
                footer={
                    <>
                        <button onClick={() => setIsCloseModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 transition-all">
                            취소
                        </button>
                        <button onClick={confirmClose} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all px-6">
                            마감하기
                        </button>
                    </>
                }
            />
        </main>
    );
}
