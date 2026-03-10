"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="py-20 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        AULIM <span className="text-blue-600">.</span>
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">© 2026 Aulim Music Club. All rights reserved.</p>
                </div>
                <div className="flex gap-10 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <Link href="#" className="hover:text-blue-600 transition-colors">Instagram</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
