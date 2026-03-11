"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Feature {
    step: string
    title?: string
    content: string
    image: string
}

interface FeatureStepsProps {
    features: Feature[]
    className?: string
    title?: string
    autoPlayInterval?: number
    imageHeight?: string
}

export function FeatureSteps({
    features,
    className,
    title = "How to get Started",
    autoPlayInterval = 3000,
    imageHeight = "h-[400px]",
}: FeatureStepsProps) {
    const [currentFeature, setCurrentFeature] = useState(0)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            if (progress < 100) {
                setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
            } else {
                setCurrentFeature((prev) => (prev + 1) % features.length)
                setProgress(0)
            }
        }, 100)

        return () => clearInterval(timer)
    }, [progress, features.length, autoPlayInterval])

    return (
        <div className={cn("p-8 md:p-12", className)}>
            <div className="max-w-7xl mx-auto w-full">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-14 text-center tracking-tight">
                    {title}
                </h2>

                <div className="flex flex-col md:grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 md:order-1 space-y-10">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-6 md:gap-8 cursor-pointer group"
                                initial={{ opacity: 0.3 }}
                                animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                                transition={{ duration: 0.5 }}
                                onClick={() => {
                                    setCurrentFeature(index)
                                    setProgress(0)
                                }}
                            >
                                <div className="relative flex-shrink-0">
                                    <motion.div
                                        className={cn(
                                            "w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border-2 transition-colors",
                                            index === currentFeature
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                                                : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300",
                                        )}
                                    >
                                        {index < currentFeature ? (
                                            <span className="text-xl font-bold">✓</span>
                                        ) : (
                                            <span className="text-lg font-bold">{index + 1}</span>
                                        )}
                                    </motion.div>
                                    {index === currentFeature && (
                                        <svg className="absolute -inset-2 w-14 h-14 md:w-16 md:h-16 transform -rotate-90">
                                            <circle
                                                cx="28"
                                                cy="28"
                                                r="26"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="transparent"
                                                className="text-blue-600/10"
                                            />
                                            <motion.circle
                                                cx="28"
                                                cy="28"
                                                r="26"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="transparent"
                                                strokeDasharray="163.36"
                                                animate={{ strokeDashoffset: 163.36 - (163.36 * progress) / 100 }}
                                                className="text-blue-600"
                                            />
                                        </svg>
                                    )}
                                </div>

                                <div className="flex-1 pt-1">
                                    <h3 className={cn(
                                        "text-xl md:text-2xl font-bold mb-2 transition-colors",
                                        index === currentFeature ? "text-slate-900" : "text-slate-400"
                                    )}>
                                        {feature.title || feature.step}
                                    </h3>
                                    <p className={cn(
                                        "text-sm md:text-lg leading-relaxed transition-colors",
                                        index === currentFeature ? "text-slate-600" : "text-slate-400"
                                    )}>
                                        {feature.content}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div
                        className={cn(
                            "order-1 md:order-2 relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-slate-100 bg-slate-50",
                            imageHeight
                        )}
                    >
                        <AnimatePresence mode="wait">
                            {features.map(
                                (feature, index) =>
                                    index === currentFeature && (
                                        <motion.div
                                            key={index}
                                            className="absolute inset-0"
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <img
                                                src={feature.image}
                                                alt={feature.step}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                                        </motion.div>
                                    ),
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
