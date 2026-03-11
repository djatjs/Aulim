"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

interface RecruitPost {
    id: number;
    title: string;
    singer: string;
    songName: string;
    author?: any;
    authorName?: string;
    status: "OPEN" | "CLOSED" | "COMPLETED";
    createdAt: string;
    sessions: any[];
}

export default function RecruitListPage() {
    const [posts, setPosts] = useState<RecruitPost[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPosts = async () => {
        try {
            const data = await fetchApi("/recruits");
            setPosts(data);
        } catch (err) {
            console.error("Failed to load recruits", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-28 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">함께 공연할 멤버를 찾으세요</h1>
                        <p className="text-slate-500 font-medium">다양한 곡과 세션의 구인 게시글을 확인하고 지원해보세요.</p>
                    </div>
                    <Link
                        href="/recruits/new"
                        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none"
                    >
                        새 구인글 작성
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase ${post.status === 'OPEN' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                    post.status === 'CLOSED' ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                                        'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                    }`}>
                                    {post.status === 'OPEN' ? '모집중' : post.status === 'CLOSED' ? '마감됨' : '모집완료'}
                                </span>
                                <span className="text-slate-400 text-xs font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>

                            <Link href={`/recruits/${post.id}`} className="block">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{post.title}</h3>
                                <p className="text-slate-500 font-medium mb-6 line-clamp-1">{post.singer} - {post.songName}</p>
                            </Link>

                            <div className="flex flex-wrap gap-2 mb-8 min-h-[4rem]">
                                {post.sessions.map((session: any) => {
                                    const isFull = session.currentCount >= session.count;
                                    return (
                                        <div key={session.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all ${isFull ? 'bg-slate-50 text-slate-400 dark:bg-slate-800/50' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                            <span>{session.part}</span>
                                            <span className="opacity-50">{session.currentCount}/{session.count}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-400">By {post.author?.name || post.authorName}</span>
                                <Link href={`/recruits/${post.id}`} className="text-blue-600 font-black text-sm hover:underline">상세보기 →</Link>
                            </div>
                        </motion.div>
                    ))}

                    {posts.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
                            <p className="text-slate-400 font-bold text-lg text-center">현재 진행 중인 구인이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
