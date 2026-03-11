"use client";

import Link from "next/link";
import { FeatureSteps } from "@/components/blocks/feature-section";
import { motion } from "framer-motion";

const serviceGuide = [
    {
        step: 'Step 1',
        title: '새로운 프로젝트의 시작',
        content: '어떤 무대를 꾸미고 싶은지 알려주세요. 매력적인 구인글 하나면, 어울림의 수많은 실력파 멤버들이 당신의 무대에 지원할 것입니다.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 2',
        title: '완벽한 하모니의 탄생',
        content: '마음에 드는 멤버의 지원을 수락하는 순간, 자동으로 합주 팀이 결성됩니다. 복잡한 절차 없이 음악에만 집중하세요.',
        image: 'https://images.unsplash.com/photo-1514320298574-2c9d81791a1e?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 3',
        title: '열정을 쏟아낼 공간',
        content: '팀이 꾸려졌다면 이제 연습할 차례입니다. 팀 전용으로 언제든지 간편하게 어울림 연습실을 예약하세요.',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop'
    },
];

export default function Home() {
    return (
        <main className="min-h-screen">
            <div className="h-20" /> {/* Navbar Spacer */}

            {/* Hero Section */}
            <section className="relative pt-20 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 blur-[120px] rounded-full -z-10 dark:bg-blue-900/10" />

                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                            Aulim Smart Recruitment & Reservation
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight premium-gradient">
                            Build Your Band, <br className="hidden md:block" />
                            Rock the Stage.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                            어울림 동아리원들을 위한 스마트 구인 게시판 & 예약 시스템. <br className="hidden sm:block" />
                            마음이 맞는 세션을 찾고 팀을 결성해, 완벽한 무대를 준비하세요.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/recruits"
                                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-200 dark:shadow-blue-900/20"
                            >
                                멤버 찾기
                            </Link>
                            <Link
                                href="/reservations"
                                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700"
                            >
                                연습실 예약
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Guide Section */}
            <section id="guide" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <FeatureSteps
                    features={serviceGuide}
                    title="How Aulim Works"
                    autoPlayInterval={5000}
                    imageHeight="h-[500px]"
                />
            </section>

        </main>
    );
}
