"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
}

export default function Toast({ message, type = "info", onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgClass =
        type === "success" ? "bg-green-600" :
            type === "error" ? "bg-red-600" :
                "bg-blue-600";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl text-white font-black flex items-center gap-3 ${bgClass}`}
        >
            <span>{type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            {message}
        </motion.div>
    );
}
