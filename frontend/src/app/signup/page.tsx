"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        mainPart: "VOCAL",
        experienceYears: 0,
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "experienceYears" ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("회원가입이 완료되었습니다! 로그인해주세요.");
                router.push("/login");
            } else {
                const data = await response.json();
                setError(data.message || "회원가입 중 오류가 발생했습니다.");
            }
        } catch (err) {
            setError("서버와 통신 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
            <div className="h-20" /> {/* Navbar Spacer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="glass-morphism p-8 md:p-10 rounded-[2.5rem]">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                            Join the Club
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            어울림의 새로운 멤버가 되어보세요.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">이름</label>
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    placeholder="홍길동"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">주요 세션</label>
                                <select
                                    name="mainPart"
                                    value={formData.mainPart}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="VOCAL">Vocal</option>
                                    <option value="GUITAR">Guitar</option>
                                    <option value="BASS">Bass</option>
                                    <option value="DRUM">Drum</option>
                                    <option value="PIANO">Piano</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">이메일</label>
                            <input
                                required
                                name="email"
                                type="email"
                                placeholder="example@aulim.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">비밀번호</label>
                            <input
                                required
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-5 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">경력 (년)</label>
                                <input
                                    name="experienceYears"
                                    type="number"
                                    min="0"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">연락처</label>
                                <input
                                    required
                                    name="phone"
                                    type="text"
                                    placeholder="010-0000-0000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-blue-600 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-70"
                        >
                            {loading ? "가입 중..." : "회원가입 하기"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        이미 계정이 있으신가요?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            로그인
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
