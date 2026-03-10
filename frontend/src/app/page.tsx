"use client";

import Link from "next/link";
import { FeatureSteps } from "@/components/blocks/feature-section";
import { motion } from "framer-motion";

const reservationGuide = [
    {
        step: 'Step 1',
        title: '동아리 팀 확인',
        content: '어울림 멤버라면 배정받은 팀 ID를 확인하세요. 팀 정보가 없다면 운영진에게 문의해주세요.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 2',
        title: '연습실 및 시간 선택',
        content: '원하는 연습실과 시간을 선택합니다. 한 팀당 하루 최대 2시간까지 예약 가능합니다.',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 3',
        title: '예약 완료 및 연습 시작',
        content: '정보를 입력하고 예약 버튼을 누르면 끝! 이제 여러분의 열정을 연습실에서 불태워보세요.',
        image: 'https://images.unsplash.com/photo-1514320298574-2c9d81791a1e?q=80&w=2070&auto=format&fit=crop'
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
                            Aulim Music Club Reservation
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight premium-gradient">
                            Play Your Sound, <br className="hidden md:block" />
                            Book Your Space.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                            울림 동아리원들을 위한 스마트한 연습실 예약 파트너. <br className="hidden sm:block" />
                            최고의 무대를 향한 첫 걸음을 지금 예약하세요.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/reservations"
                                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-200 dark:shadow-blue-900/20"
                            >
                                지금 예약하기
                            </Link>
                            <Link
                                href="#guide"
                                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700"
                            >
                                이용 가이드 보기
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Guide Section */}
            <section id="guide" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <FeatureSteps
                    features={reservationGuide}
                    title="How to Book Your Room"
                    autoPlayInterval={5000}
                    imageHeight="h-[500px]"
                />
            </section>

        </main>
    );
}
